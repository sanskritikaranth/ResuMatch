import { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import { Sun, Moon, Sparkles, RefreshCcw, Download, ShieldCheck, AlertCircle, AlertTriangle, UploadCloud } from 'lucide-react';

import TemplateProfessional from './TemplateProfessional';
import TemplateDouble from './TemplateDouble';
import TemplateCreative from './TemplateCreative';
import TemplateBasic from './TemplateBasic';

// Restored Extended Industry List
const INDUSTRIES = [
  "Software Engineering", "Data Science & AI", "Cybersecurity", "Cloud Architecture", "Product Management", "UI/UX Design",
  "Pharmacy", "Nursing", "General Medicine", "Biotechnology", "Clinical Research", "Psychology & Counseling",
  "Mechanical Engineering", "Civil Engineering", "Electrical Engineering", "Aerospace Engineering", "Architecture",
  "Investment Banking", "Accounting & Audit", "Financial Planning", "Business Analysis", "Marketing & SEO", "Human Resources",
  "Graphic Design", "Content Writing", "Law & Legal Services", "Public Relations",
  "Teaching & Education", "Project Management", "Supply Chain & Logistics"
];

const TEMPLATES = [
  { id: 'professional', name: 'Professional', desc: 'Centered, clean LaTeX style.' },
  { id: 'double', name: 'Double Column', desc: 'Gray sidebar with timeline.' },
  { id: 'creative', name: 'Creative', desc: 'Peach/Navy with photo circle.' },
  { id: 'basic', name: 'Basic / Simple', desc: 'Clean left-aligned classic.' }
];

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [editableContent, setEditableContent] = useState('');

  const [industry, setIndustry] = useState('');
  const [template, setTemplate] = useState('professional');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [photo, setPhoto] = useState(null); 
  const [aboutMe, setAboutMe] = useState(''); 
  
  const [education, setEducation] = useState('');
  const [experience, setExperience] = useState('');
  const [projects, setProjects] = useState('');
  const [skills, setSkills] = useState('');
  const [extracurricular, setExtracurricular] = useState('');
  const [jd, setJd] = useState('');

  const cleanMarkdown = (text) => text ? text.replace(/\*\*/g, '').replace(/\*/g, '').trim() : '';

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const triggerAI = async () => {
    setAiError('');
    if (!name || !jd || !skills || !experience) return setAiError("Missing critical fields.");

    setIsLoading(true);
    try {
      const payload = { 
        industry, name, email, phone, address, education, experience, skills, extracurricular, jd,
        projects: projects + "\n\nCRITICAL: Generate exactly 3 bullet points per project."
      };
      const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
      const response = await fetch(`${API_URL}/generate`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (!response.ok) {
        setAiError(`Server error (${response.status}). Check the backend terminal for details.`);
        setIsLoading(false);
        return;
      }
      if (data.status === "error") {
        setAiError(data.message || "The AI pipeline rejected this request.");
        setIsLoading(false);
        return;
      }

      setEditableContent(cleanMarkdown(data.optimized_content));
      setStep(4);
    } catch (e) { setAiError("Could not reach the backend. Is uvicorn running on port 8000?"); }
    setIsLoading(false);
  };

  const downloadPDF = () => {
    const element = document.getElementById('resume-view');
    html2pdf().set({ margin: 0, filename: `Resume.pdf`, html2canvas: { scale: 2 }, jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' } }).from(element).save();
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20 transition-colors duration-500">
      
      {/* THEME TOGGLE */}
      <div className="fixed top-6 right-6 z-[100]">
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800">
          {theme === 'light' ? <Moon className="text-indigo-600" /> : <Sun className="text-amber-400" />}
        </button>
      </div>

      <div className="max-w-7xl mx-auto pt-10 px-6">
        <header className="flex items-center gap-3 mb-10">
          <Sparkles className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-black uppercase italic">ResuMatch <span className="text-indigo-600 not-italic">Pro</span></h1>
        </header>

        {/* STEP 1: INDUSTRY */}
        {step === 1 && (
          <div className="text-center">
            <h2 className="text-4xl font-black mb-10">Professional Domain</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {INDUSTRIES.map(i => (
                <button key={i} onClick={() => { setIndustry(i); setStep(2); }} className="p-4 text-sm font-bold rounded-2xl bg-white dark:bg-slate-900 shadow-sm border-2 border-transparent hover:border-indigo-600 hover:text-indigo-600 transition">
                  {i}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: TEMPLATES (Restored Visuals) */}
        {step === 2 && (
          <div>
            <h2 className="text-4xl font-black text-center mb-10 text-indigo-600">Choose Architecture</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {TEMPLATES.map(t => (
                <div key={t.id} onClick={() => setTemplate(t.id)}
                  className={`cursor-pointer p-6 rounded-3xl border-4 transition-all flex flex-col items-center text-center ${template === t.id ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30' : 'border-transparent bg-white dark:bg-slate-900 shadow-md'}`}>
                  
                  {/* RESTORED VISUAL HINTS */}
                  <div className="w-full h-32 rounded-xl mb-4 overflow-hidden border border-slate-200 bg-slate-100 flex">
                    {t.id === 'professional' && <div className="w-full bg-white p-2"><div className="w-1/2 h-2 bg-slate-800 mx-auto mb-2"></div><div className="w-full border-t border-slate-300"></div></div>}
                    {t.id === 'double' && <><div className="w-1/3 bg-slate-300 flex justify-center pt-2"><div className="w-6 h-6 rounded-full bg-slate-400"></div></div><div className="w-2/3 bg-white"></div></>}
                    {t.id === 'creative' && <><div className="w-1/2 bg-[#fcdbd6]"></div><div className="w-1/2 bg-[#1b3b3a]"></div></>}
                    {t.id === 'basic' && <div className="w-full bg-white p-3"><div className="w-1/2 h-2 bg-slate-800 mb-2"></div><div className="w-3/4 h-1 bg-slate-300"></div></div>}
                  </div>

                  <h3 className="font-bold text-lg">{t.name}</h3>
                  <p className="text-xs text-slate-500 mt-2">{t.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 flex justify-between">
              <button onClick={() => setStep(1)} className="font-bold text-slate-400">Back</button>
              <button onClick={() => setStep(3)} className="bg-indigo-600 text-white px-12 py-3 rounded-full font-bold shadow-lg">Continue</button>
            </div>
          </div>
        )}

        {/* STEP 3: DOSSIER */}
        {step === 3 && (
          <div className="max-w-5xl mx-auto bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-2xl">
            <h2 className="text-3xl font-black mb-8 text-indigo-600 uppercase tracking-tighter">Compile Dossier</h2>
            
            <div className="space-y-8">
              <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest">1. Personal & Photo</h3>
                  {['double', 'creative'].includes(template) && (
                    <label className="cursor-pointer flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 px-4 py-2 rounded-xl text-xs font-bold transition hover:bg-indigo-200">
                      <UploadCloud size={16} />
                      {photo ? "Photo Uploaded" : "Upload Photo"}
                      <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                    </label>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input className="modern-input" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
                  <input className="modern-input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                  <input className="modern-input" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
                  <input className="modern-input" placeholder="City, State" value={address} onChange={e => setAddress(e.target.value)} />
                </div>
              </div>

              {template === 'creative' && (
                <div className="p-6 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 rounded-3xl">
                  <h3 className="text-xs font-black uppercase text-amber-700 tracking-widest mb-4">About Me</h3>
                  <textarea className="modern-input w-full min-h-[100px]" placeholder="Write a short engaging bio..." value={aboutMe} onChange={e => setAboutMe(e.target.value)} />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <textarea className="modern-input min-h-[150px]" placeholder="Education (Degree | Date)" value={education} onChange={e => setEducation(e.target.value)} />
                <textarea className="modern-input min-h-[150px]" placeholder="Experience (Role | Date)" value={experience} onChange={e => setExperience(e.target.value)} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <textarea className="modern-input min-h-[120px]" placeholder="Projects (Name | Stack)" value={projects} onChange={e => setProjects(e.target.value)} />
                <textarea className="modern-input min-h-[120px]" placeholder="Skills (Category : Skills)" value={skills} onChange={e => setSkills(e.target.value)} />
              </div>

              <textarea className="modern-input min-h-[100px]" placeholder="Target Job Description" value={jd} onChange={e => setJd(e.target.value)} />
            </div>

            {aiError && (
              <div className="mt-8 p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 flex items-center gap-3 text-red-700 dark:text-red-400">
                <AlertTriangle size={20} className="shrink-0" />
                <span className="text-sm font-semibold">{aiError}</span>
              </div>
            )}

            <div className="flex justify-between mt-12">
              <button onClick={() => setStep(2)} className="font-bold text-slate-400">Back</button>
              <button onClick={triggerAI} disabled={isLoading} className="bg-emerald-600 text-white px-14 py-4 rounded-full font-black shadow-xl disabled:bg-slate-400">
                {isLoading ? "PROCESSING..." : "COMPILE AI RESUME"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PREVIEW */}
        {step === 4 && (
          <div className="animate-in fade-in duration-700">
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl mb-10 sticky top-4 z-50">
               <h2 className="text-2xl font-black italic text-indigo-600 uppercase">Draft Ready</h2>
               <div className="flex gap-3">
                 <button onClick={() => setStep(3)} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800"><RefreshCcw size={20}/></button>
                 <button onClick={downloadPDF} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg"><Download className="inline mr-2"/> DOWNLOAD PDF</button>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <textarea 
                className="w-full h-[800px] bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-xl font-mono text-sm border-none outline-none focus:ring-2 focus:ring-indigo-500"
                value={editableContent}
                onChange={e => setEditableContent(e.target.value)}
              />

              <div className="bg-slate-200 dark:bg-slate-950 p-6 rounded-[3rem] h-[900px] overflow-auto flex justify-center shadow-inner">
                <div id="resume-view" className="relative">
                   {template === 'professional' && <TemplateProfessional name={name} phone={phone} address={address} email={email} content={editableContent} rawData={{ education, experience, projects, skills }} />}
                   {template === 'double' && <TemplateDouble name={name} phone={phone} address={address} email={email} content={editableContent} photo={photo} rawData={{ education, experience, projects, skills }} />}
                   {template === 'creative' && <TemplateCreative name={name} phone={phone} address={address} email={email} content={editableContent} photo={photo} aboutMe={aboutMe} rawData={{ education, experience, projects, skills }} />}
                   {template === 'basic' && <TemplateBasic name={name} phone={phone} address={address} email={email} content={editableContent} rawData={{ education, experience, projects, skills }} />}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .modern-input { width: 100%; padding: 1.25rem; border-radius: 1.25rem; background-color: #f8fafc; border: 2px solid transparent; transition: all 0.2s; outline: none; font-weight: 500; font-size: 0.9rem; }
        .dark .modern-input { background-color: #0f172a; border-color: #1e293b; color: #f1f5f9; }
        .modern-input:focus { border-color: #4f46e5; box-shadow: 0 0 0 4px #e0e7ff; }
      `}</style>
    </div>
  );
}