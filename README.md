# 📄 **ResuMatch Pro**

---

## **Overview**
An AI-powered resume builder that tailors your resume to a specific job description — extracting keywords, rewriting your content, all in one flow.

Built with **FastAPI + LangGraph** (multi-agent pipeline) on the backend, and **React + Vite** on the frontend. Feed it your details and a job description, and ResuMatch Pro runs a 4-agent "war room" that validates your input, analyzes the JD, rewrites your resume content, and then renders it into a polished, downloadable PDF.

---

## **🔗 Quick Links**
- 🌐 Live Demo — *add your deployed frontend URL here*
- ⚙️ API — *add your deployed Render URL here*
- 💻 Source Code — You're already here!

---

## **✨ Features**
### 🧠 **Agentic Resume Pipeline**
Powered by LangGraph, requests flow through four specialized agents:
- **Gatekeeper (Validator)** — checks the submitted data is complete and sane before spending an LLM call on it  
- **JD Analyst** — extracts the key skills/keywords from the pasted job description  
- **Content Strategist** — rewrites your experience, projects, and skills to align with those keywords  

Every LLM call is wrapped in a safe structured-output handler, so a malformed model response fails loudly with a clear error instead of crashing silently downstream.

---

## **📝 Resume Input**
Single form capturing industry, contact details, education, experience, projects, skills, extracurriculars, and the target job description.

---

## **🎨 Templates**
Four downloadable resume layouts to choose from: **Basic, Creative, Double-column, and Professional**

---

## **📥 Export**
One-click PDF export via **html2pdf.js** — no watermarks, ready to send.

---

## **🛠️ Tech Stack**
| Layer              | Technology |
|--------------------|------------|
| Backend Framework  | FastAPI |
| Agent Orchestration| LangGraph |
| LLM                | OpenAI (gpt-4o-mini) via langchain-openai |
| Backend Server     | Uvicorn |
| Frontend Framework | React 19 + Vite |
| Styling            | Tailwind CSS |
| Icons              | Lucide React |
| PDF Export         | html2pdf.js |
| Backend Hosting    | Render |
| Frontend Hosting   | Vercel (or any static host) |

---

## **🔑 How It Works**
1. Fill in your details (name, contact info, education, experience, projects, skills, extracurriculars) and paste the job description you're targeting  
2. Hit generate — the request hits `POST /generate` on the FastAPI backend  
3. The LangGraph pipeline runs: **Validate → Analyze JD → Rewrite Content**  
4. If validation fails or any agent errors out, you get a clear message back instead of a broken result  
5. On success, you get back the optimized resume content and the extracted keywords  
6. Pick a template and export straight to PDF  

---

## **🚀 Getting Started**

### **Prerequisites**
- Python 3.11+  
- Node.js 18+  
- An OpenAI API key  

### **1️⃣ Clone the repo**
```bash
git clone https://github.com/yourusername/resumatch-pro.git
cd resumatch-pro
