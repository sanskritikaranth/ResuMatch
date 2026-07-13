# ResuMatch Pro

AI-powered resume optimization tool. You provide your raw experience, education,
and a target job description; a 4-agent pipeline analyzes the JD, rewrites your
resume to match it, and grades the result like an ATS scanner would — all before
you export a polished, print-ready PDF.

## How it works

Every submission runs through a small agent graph (built with LangGraph), not a
single prompt call:

1. **Validator** — rejects gibberish/placeholder input before burning API calls.
2. **JD Analyst** — extracts the 6 most critical skills/keywords from the target job description.
3. **Content Strategist** — rewrites your raw input into resume copy, weaving in the extracted keywords.
4. **ATS Auditor** — scores the final draft 0-100 against the job description and gives specific feedback.   
ResuMatch/
+-- main.py              # FastAPI app, /generate endpoint
+-- agents.py             # LangGraph agent pipeline
+-- requirements.txt
+-- render.yaml            # Render deployment config
+-- frontend/
+-- src/
+-- App.jsx                  # Multi-step form + state
+-- TemplateProfessional.jsx # Resume layout components
+-- TemplateDouble.jsx
+-- TemplateCreative.jsx
+-- TemplateBasic.jsx
## Running locally

**Backend**
```bash
cd ResuMatch
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env        # then paste your OPENAI_API_KEY into .env
uvicorn main:app --reload
```
Backend runs at `http://127.0.0.1:8000`. Visit `/docs` for the interactive Swagger UI.

**Frontend** (separate terminal)
```bash
cd ResuMatch/frontend
npm install
cp .env.example .env        # VITE_API_URL=http://127.0.0.1:8000 by default
npm run dev
```
Frontend runs at `http://localhost:5173`.

## Deployment

**Backend to Render**
1. Push this repo to GitHub.
2. New -> Web Service on Render, point it at the repo (root directory: `ResuMatch`).
3. Render will pick up `render.yaml` automatically, or set manually:
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables: `OPENAI_API_KEY`, and `ALLOWED_ORIGINS` (your Vercel URL, added after the step below).

**Frontend to Vercel**
1. New Project on Vercel, point it at the repo, root directory: `ResuMatch/frontend`.
2. Framework preset: Vite.
3. Add environment variable `VITE_API_URL` = your Render backend URL.
4. Deploy, then copy the resulting Vercel URL back into Render's `ALLOWED_ORIGINS`.

## Roadmap / ideas for next iteration
- Persist generated resumes (DB) so users can revisit past drafts
- Auth so users can save multiple resume versions
- Cover letter generation as a 5th agent
