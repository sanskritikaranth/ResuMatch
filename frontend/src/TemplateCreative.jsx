import React from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

// --- CRASH-PROOF HELPER: Section Extraction ---
const parseSections = (content, rawData) => {
  const extract = (header) => {
    if (!content || typeof content !== 'string') return '';
    const match = content.match(new RegExp(`### ${header}\\s*\\n([\\s\\S]*?)(?=###|$)`, 'i'));
    return match ? match[1].trim() : '';
  };

  return {
    education: extract('Education') || rawData?.education || '',
    experience: extract('Experience') || rawData?.experience || '',
    projects: extract('Projects') || rawData?.projects || '',
    skills: extract('Skills') || rawData?.skills || ''
  };
};

// --- FORMATTED TEXT RENDERER (Education & Experience) ---
const renderFormattedText = (text, isLight) => {
  if (!text || typeof text !== 'string') return null;
  const lines = text.split('\n').map(l => l.replace(/\*/g, '').trim()).filter(l => l);

  let isInstitution = false;
  return lines.map((line, i) => {
    // Render bullet points
    if (line.startsWith('-') || line.startsWith('•')) {
      return (
        <li key={i} className={`ml-4 list-disc mb-1 pl-1 text-[8.5pt] leading-snug text-justify ${isLight ? 'text-gray-300' : 'text-[#162C2C]/80'}`}>
          {line.replace(/^[-•]\s*/, '')}
        </li>
      );
    }
    // Handle "Title | Date" splitting
    if (line.includes('|')) {
      const [title, date] = line.split('|');
      isInstitution = true; 
      return (
        <div key={i} className={`flex justify-between items-end mt-3 mb-0.5 text-[9pt] ${isLight ? 'text-white' : 'text-[#162C2C]'}`}>
          <span>{title.trim()}</span>
          <span className="text-[8.5pt]">{date.trim()}</span>
        </div>
      );
    } else if (isInstitution) {
      isInstitution = false;
      return <p key={i} className={`font-bold text-[9.5pt] mb-0.5 ${isLight ? 'text-white' : 'text-[#162C2C]'}`}>{line}</p>;
    }
    return <p key={i} className={`font-bold text-[9.5pt] mt-2 mb-0.5 ${isLight ? 'text-white' : 'text-[#162C2C]'}`}>{line}</p>;
  });
};

// --- PROJECT RENDERER (Bold Title. Italic Tech) ---
const renderProjectsText = (text, isLight) => {
  if (!text || typeof text !== 'string') return null;
  const lines = text.split('\n').map(l => l.replace(/\*/g, '').trim()).filter(l => l);
  
  return lines.map((line, i) => {
    if (line.startsWith('-') || line.startsWith('•')) {
      return <li key={i} className={`ml-4 list-disc mb-1 pl-1 text-[8.5pt] leading-snug text-justify ${isLight ? 'text-gray-300' : 'text-[#162C2C]/80'}`}>{line.replace(/^[-•]\s*/, '')}</li>;
    }
    if (line.includes('|')) {
      const [pName, pTech] = line.split('|');
      return (
        <div key={i} className={`flex justify-between items-end mt-3 mb-1 text-[9pt] ${isLight ? 'text-white' : 'text-[#162C2C]'}`}>
          <span className="font-bold">{pName.trim()}.</span>
          <span className="italic text-[8pt] opacity-80">{pTech.trim()}</span>
        </div>
      );
    }
    return <p key={i} className={`font-bold text-[9.5pt] mt-2 mb-1 ${isLight ? 'text-white' : 'text-[#162C2C]'}`}>{line}.</p>;
  });
};

// --- SKILL CIRCLE RENDERER ---
const renderSkillCircles = (text) => {
  if (!text || typeof text !== 'string') return null;
  const skills = text.replace(/.*:/g, '').split(/[,|]/).map(s => s.replace(/[-*]/g, '').trim()).filter(s => s && s.length < 20).slice(0, 8);
  return skills.map((skill, i) => (
    <div key={i} className="w-[62px] h-[62px] rounded-full bg-[#F7D2C9] text-[#162C2C] flex items-center justify-center text-center p-1 text-[7pt] font-bold shadow-sm leading-tight">
      {skill}
    </div>
  ));
};

export default function TemplateCreative({ name, phone, address, email, content, rawData, photo, aboutMe }) {
  const sections = parseSections(content, rawData);

  return (
    <div className="w-[8.5in] h-[11in] max-h-[11in] overflow-hidden font-sans bg-[#FDFBF8] relative shadow-2xl text-[#162C2C]">
      
      {/* Background Layer: Dark Navy on the Right */}
      <div className="absolute right-0 top-0 w-[55%] h-full bg-[#162C2C] z-0"></div>

      {/* --- TOP SECTION: Header & Contact --- */}
      <div className="absolute top-0 left-0 w-full h-[2.5in] flex z-10">
        <div className="w-[45%] h-full p-10 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full border-[2px] border-[#162C2C] opacity-10"></div>
          {/* Header Title: Industry Subtitle Removed */}
          <h1 className="text-[38pt] font-black leading-[0.85] tracking-tighter uppercase relative z-10">
            {name ? name.replace(' ', '\n') : "SANSKRITI\nKARANTH"}
          </h1>
        </div>
        <div className="w-[55%] h-full p-10 flex flex-col justify-center text-white pl-12">
          <h2 className="text-[13pt] font-bold uppercase mb-4 tracking-widest">Contact</h2>
          <div className="flex items-center gap-2 text-[8.5pt] mb-3 min-w-0">
            <Mail size={14} className="shrink-0" /> <span className="truncate">{email || "sanskritikaranth4@gmail.com"}</span>
          </div>
          <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-[8.5pt]">
            <div className="flex items-center gap-2 min-w-0"><MapPin size={14} className="shrink-0"/> <span className="truncate">{address || "City, State"}</span></div>
            <div className="flex items-center gap-2 min-w-0"><Phone size={14} className="shrink-0"/> <span className="truncate">{phone || "9191919191"}</span></div>
            <div className="flex items-center gap-2 min-w-0 col-span-2"><Globe size={14} className="shrink-0"/> <span className="truncate">LinkedIn Profile</span></div>
          </div>
        </div>
      </div>

      {/* --- MIDDLE SECTION: Peach Banner & About Me --- */}
      <div className="absolute top-[2.5in] left-0 w-full h-[2.6in] z-20 flex items-center">
        <div className="absolute left-0 w-[85%] h-full bg-[#F7D2C9] rounded-r-[150px] z-0 shadow-md"></div>
        <div className="w-[45%] h-full p-10 relative z-10 flex flex-col justify-center">
          <h2 className="text-[13pt] font-black uppercase mb-3 tracking-widest">About Me</h2>
          <p className="text-[8.5pt] leading-relaxed text-justify line-clamp-6 text-[#162C2C]">
            {aboutMe || "Dedicated AI and Software Engineering professional with a focus on full-stack development and machine learning solutions."}
          </p>
        </div>
        <div className="w-[55%] h-full relative z-10 flex items-center justify-center pr-10">
           <div className="w-52 h-52 rounded-full overflow-hidden border-[6px] border-[#F7D2C9] shadow-xl bg-gray-200 shrink-0">
             {photo ? <img src={photo} alt="Profile" className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500">PHOTO</div>}
           </div>
        </div>
      </div>

      {/* --- BOTTOM SECTION: Education, Skills, Experience, Projects --- */}
      <div className="absolute top-[5.1in] left-0 w-full h-[5.9in] flex z-10">
        
        {/* Left Side: Education & Skills */}
        <div className="w-[45%] h-full p-10 pr-6 flex flex-col">
          <div className="mb-8">
            <h2 className="text-[13pt] font-black uppercase mb-3 tracking-widest">Education</h2>
            <div className="leading-snug">{renderFormattedText(sections.education, false)}</div>
          </div>
          <div className="mt-auto mb-10">
            <h2 className="text-[13pt] font-black uppercase mb-5 tracking-widest">Skills</h2>
            <div className="flex flex-wrap gap-4">{renderSkillCircles(sections.skills)}</div>
          </div>
        </div>

        {/* Right Side: Experience & Projects */}
        <div className="w-[55%] h-full p-10 pl-12 text-white flex flex-col">
          {/* Experience */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
               <h2 className="text-[12pt] font-black uppercase tracking-widest">Experience</h2>
               <div className="flex flex-col gap-1"><div className="w-2.5 h-2.5 rounded-full bg-white"></div><div className="w-2.5 h-2.5 rounded-full bg-white"></div></div>
            </div>
            <div className="leading-snug pr-4">{renderFormattedText(sections.experience, true)}</div>
          </div>

          {/* Projects (Now below Experience) */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-4">
               <h2 className="text-[12pt] font-black uppercase tracking-widest">Projects</h2>
               <div className="flex flex-col gap-1"><div className="w-2.5 h-2.5 rounded-full bg-white"></div><div className="w-2.5 h-2.5 rounded-full bg-white"></div></div>
            </div>
            <div className="leading-snug pr-4">{renderProjectsText(sections.projects, true)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}