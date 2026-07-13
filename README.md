# 📄 **ResuMatch Pro**

---

## **Overview**
An AI-powered resume builder that tailors your resume to a specific job description — extracting keywords, rewriting your content, all in one flow.

Built with **FastAPI + LangGraph** (multi-agent pipeline) on the backend, and **React + Vite** on the frontend. Feed it your details and a job description, and ResuMatch Pro runs a 3-agent "war room" that validates your input, analyzes the JD, rewrites your resume content — then renders it into a polished, downloadable PDF.

---

## **🔗 Quick Links**
- 🌐 Live Demo — *add your deployed frontend URL here*
- ⚙️ API — *add your deployed Render URL here*
- 💻 Source Code — You're already here!

---

## **✨ Features**
### 🧠 **Agentic Resume Pipeline**
Powered by LangGraph, requests flow through three specialized agents:
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
git clone https://github.com/yourusername/resumatch-pro.git  
cd resumatch-pro  

---

### **2️⃣ Backend setup**
python -m venv .venv  
Windows: .venv\Scripts\activate | macOS/Linux: source .venv/bin/activate  
pip install -r requirements.txt  

Create a `.env` file in the project root (never commit this — it's already in `.gitignore`):  
OPENAI_API_KEY=your_openai_api_key_here  
ALLOWED_ORIGINS=http://localhost:5173  

Run the API:  
uvicorn main:app --reload  

API will be live at `http://localhost:8000` — health check at `/`.

---

### **3️⃣ Frontend setup**
cd frontend  
npm install  

Create a `frontend/.env`:  
VITE_API_URL=http://localhost:8000  

Run the dev server:  
npm run dev  

App will be live at `http://localhost:5173`.

---

## **📦 Deployment**

### **⚙️ Backend (Render)**
A `render.yaml` blueprint is already included. In the Render dashboard: **New → Blueprint**, connect this repo, and fill in the `OPENAI_API_KEY` and `ALLOWED_ORIGINS` environment variables when prompted.

### **🌐 Frontend (Vercel)**
cd frontend  
npm run build  

Or connect the repo to Vercel directly with **Root Directory** set to `frontend` — it auto-detects Vite. Set `VITE_API_URL` to your deployed backend URL.

⚠️ After deploying the frontend, update `ALLOWED_ORIGINS` on the backend to include your frontend's live URL so CORS allows requests through.

---

## **📁 Project Structure**
ResuMatch/  
├── main.py                    # FastAPI app, CORS config, /generate endpoint  
├── agents.py                  # LangGraph pipeline: validator, JD analyst, content strategist  
├── requirements.txt  
├── render.yaml                 # Render deployment blueprint  
└── frontend/  
    ├── src/  
    │   ├── App.jsx              # Main form + generation flow  
    │   ├── TemplateBasic.jsx  
    │   ├── TemplateCreative.jsx  
    │   ├── TemplateDouble.jsx  
    │   └── TemplateProfessional.jsx  
    ├── package.json  
    └── vite.config.js  

---

## **🗺️ Roadmap / Future Improvements**
- [ ] User accounts to save past resumes  
- [ ] More template styles  
- [ ] Cover letter generation  
- [ ] Multi-language support  
- [ ] Resume version history / diffing  

---

## **📄 License**
This project is open source and available for personal and educational use.

---

## **🙋 Author**
Built by **SANSKRITI KARANTH** — 4th year ISE student.  

⭐ If you found this project interesting, consider giving it a star!
