import os
import traceback
from dotenv import load_dotenv
from typing import TypedDict, List
from pydantic import BaseModel
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI

load_dotenv()
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.1)


class AgentError(Exception):
    """Raised when a specific agent's LLM call fails, so we know exactly which
    step broke instead of a confusing KeyError several nodes downstream."""
    pass


def safe_structured_call(schema, prompt, agent_label: str):
    """Call the LLM with structured output and fail loudly + clearly if it breaks,
    instead of letting a None/malformed result crash a *later* node."""
    try:
        result = llm.with_structured_output(schema).invoke(prompt)
    except Exception as e:
        print(f"❌ {agent_label} — OpenAI call failed: {e}")
        traceback.print_exc()
        raise AgentError(f"{agent_label} failed: {e}") from e

    if result is None:
        print(f"❌ {agent_label} — model returned no parsable structured output.")
        raise AgentError(f"{agent_label} returned no usable output. Try again, or shorten your input.")

    return result

# --- 1. UPDATED STATE (Now handles all 10 fields) ---
class AgentState(TypedDict):
    industry: str
    name: str
    email: str
    phone: str
    address: str
    education: str
    experience: str
    projects: str
    skills: str
    extracurricular: str
    jd: str
    
    # Internal Agent Outputs
    is_valid: bool
    error_message: str
    keywords: List[str]
    optimized_content: str
    score: int
    feedback: List[str]

# --- 2. STRUCTURED OUTPUTS ---
class ValidationOutput(BaseModel):
    is_valid: bool
    error_message: str

class KeywordOutput(BaseModel):
    keywords: List[str]

class ContentOutput(BaseModel):
    optimized_content: str

class ScoreOutput(BaseModel):
    score: int
    feedback: List[str]

# --- 3. THE 4 AGENTS ---

def data_validator(state: AgentState):
    print("🛡️ AGENT 0: Checking for Gibberish/Invalid Data...")
    prompt = f"""
    You are a strict data validation agent for a resume builder.
    Analyze the following user inputs to see if they are mostly gibberish, clearly fake (e.g., 'asdfasdf', 'test1234'), or grossly insufficient.
    
    Experience: {state['experience']}
    Education: {state['education']}
    Skills: {state['skills']}
    
    If it's gibberish or fake, set is_valid to False and provide a helpful error_message (e.g., "Your experience section appears to contain invalid text. Please provide real details.")
    If it looks like a genuine attempt, set is_valid to True and error_message to empty.
    """
    result = safe_structured_call(ValidationOutput, prompt, "Agent 0 (Validator)")
    return {"is_valid": result.is_valid, "error_message": result.error_message}

def jd_analyst(state: AgentState):
    print(f"🕵️ AGENT 1: Analyzing {state['industry']} JD...")
    prompt = f"""
    You are an expert recruiter in {state['industry']}. 
    Extract the 6 most critical technical skills or certifications from this JD:
    JD: {state['jd']}
    """
    result = safe_structured_call(KeywordOutput, prompt, "Agent 1 (JD Analyst)")
    return {"keywords": result.keywords}

def content_strategist(state: AgentState):
    print(f"✍️ AGENT 2: Synthesizing {state['industry']} Dossier...")
    prompt = f"""
    You are an elite executive resume writer for {state['industry']}.
    Synthesize the raw data below into Markdown resume sections.

    Do NOT include the Name and Contact Info (the UI handles that).
    Use these exact headers, ONLY if data is provided for that section:
    ### Education
    ### Experience
    ### Projects
    ### Skills
    ### Extracurricular

    You MUST follow this EXACT line-level format inside each section - the
    frontend parses these lines with strict rules, so any deviation breaks
    the resume layout:

    - Education: one line per entry as "Degree Name | Start-End Date",
      followed on the next line by the institution name in plain text,
      followed by 1-2 plain detail lines (GPA, honors) if relevant.
      Example:
      Bachelor of Engineering, Information Science | 2022 - 2026
      PES University, Bengaluru

    - Experience / Projects: one line per entry as "Role or Project Name | Company or Tech Stack",
      followed by 2-4 bullet lines that each start with "- " (a hyphen and a space).
      Leave exactly ONE blank line between each entry (this is required so the
      frontend can correctly split entries apart).
      Example:
      Software Engineering Intern | Acme Corp
      - Built a REST API in FastAPI serving 10k requests/day
      - Reduced query latency 40% by adding database indexes

      Junior Developer | Beta Inc
      - Developed scalable microservices in Node.js

    - Skills: one line per category as "Category: skill1, skill2, skill3".
      Keep each category label SHORT — 1-2 words, under 20 characters (e.g.
      "Languages", "Web Dev", "Cloud & DevOps", not "Data Structures & Algorithms").
      Example:
      Languages: Python, JavaScript, SQL
      Frameworks: React, FastAPI, LangGraph

    - Extracurricular: bullet lines starting with "- ".

    Never use markdown bold/italics (**, *) or nested bullets. Never omit the
    "|" separator on entry title lines. Never omit the "- " prefix on bullet lines.

    Make the bullets impactful and quantified, using action verbs. Incorporate
    these keywords naturally where truthful to the raw data: {state['keywords']}.

    RAW DATA:
    Education: {state['education']}
    Experience: {state['experience']}
    Projects: {state['projects']}
    Skills: {state['skills']}
    Extracurricular: {state['extracurricular']}
    """
    result = safe_structured_call(ContentOutput, prompt, "Agent 2 (Content Strategist)")
    print(f"   ↳ generated {len(result.optimized_content or '')} chars of resume content")
    return {"optimized_content": result.optimized_content}

def ats_auditor(state: AgentState):
    print("⚖️ AGENT 3: Final ATS Audit...")
    resume_content = state.get("optimized_content")
    if not resume_content:
        raise AgentError("Agent 3 (ATS Auditor) has no resume content to grade — Agent 2 must have failed upstream.")

    prompt = f"""
    You are an advanced ATS Scanner for {state['industry']}.
    Grade this resume content against the expected keywords.
    
    Keywords expected: {state['keywords']}
    Resume Content: {resume_content}
    
    1. Give a score from 0-100.
    2. Provide 3 specific bullet points on where the resume is lacking or can be improved.
    """
    result = safe_structured_call(ScoreOutput, prompt, "Agent 3 (ATS Auditor)")
    return {"score": result.score, "feedback": result.feedback}


# --- 4. GRAPH ROUTING & COMPILATION ---

# Conditional edge: If invalid, skip the rest of the agents and go to END
def route_validation(state: AgentState):
    if state.get("is_valid"):
        return "analyst"
    return END

workflow = StateGraph(AgentState)

workflow.add_node("validator", data_validator)
workflow.add_node("analyst", jd_analyst)
workflow.add_node("strategist", content_strategist)
workflow.add_node("auditor", ats_auditor)

workflow.set_entry_point("validator")
workflow.add_conditional_edges("validator", route_validation) # The Gatekeeper Logic
workflow.add_edge("analyst", "strategist")
workflow.add_edge("strategist", "auditor")
workflow.add_edge("auditor", END)

resume_builder_app = workflow.compile()