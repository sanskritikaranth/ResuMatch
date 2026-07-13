import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agents import resume_builder_app, AgentError

app = FastAPI(title="ResuMatch Pro API")

# Comma-separated list of allowed frontend origins, e.g.
# "http://localhost:5173,https://resumatch-pro.vercel.app"
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health_check():
    """Simple health-check endpoint, also useful to confirm the Render deploy is live."""
    return {"status": "ok", "service": "ResuMatch Pro API"}

# NEW: The expanded payload model
class ResumeRequest(BaseModel):
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

@app.post("/generate")
def generate_resume(request: ResumeRequest):
    print(f"🚀 War Room Triggered for: {request.name} ({request.industry})")
    
    initial_state = {
        "industry": request.industry,
        "name": request.name,
        "email": request.email,
        "phone": request.phone,
        "address": request.address,
        "education": request.education,
        "experience": request.experience,
        "projects": request.projects,
        "skills": request.skills,
        "extracurricular": request.extracurricular,
        "jd": request.jd
    }
    
    # Run the Agentic Workflow
    try:
        final_result = resume_builder_app.invoke(initial_state)
    except AgentError as e:
        print(f"❌ Agent pipeline failed: {e}")
        return {
            "status": "error",
            "message": str(e)
        }
    
    # Check if Agent 0 (Gatekeeper) rejected the input
    if not final_result.get("is_valid", True):
        print("❌ Agent 0 Rejected the Data.")
        return {
            "status": "error",
            "message": final_result.get("error_message", "Invalid data detected.")
        }
        
    print("✅ Resume Built Successfully.")
    return {
        "status": "success",
        "optimized_content": final_result.get("optimized_content", ""),
        "score": final_result.get("score", 0),
        "feedback": final_result.get("feedback", []),
        "keywords": final_result.get("keywords", [])
    }