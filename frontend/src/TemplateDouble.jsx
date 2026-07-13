import React from 'react';
import { Phone, Mail, MapPin, Globe } from 'lucide-react';

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
    skills: extract('Skills') || rawData?.skills || '',
    extracurricular: extract('Extracurricular') || rawData?.extracurricular || ''
  };
};

// --- TIMELINE RENDERER (Right Side) ---
const renderTimeline = (text) => {
  if (!text || typeof text !== 'string') return null;
  const blocks = text.split(/\n\s*\n/).filter(b => b.trim());
  
  return blocks.map((block, i) => {
    const lines = block.split('\n').filter(l => l.trim());
    const rawTitle = lines[0].replace(/\*/g, '').trim();
    const [titlePart, subPart] = rawTitle.includes('|') ? rawTitle.split('|') : [rawTitle, ''];
    const bullets = lines.slice(1);
    
    return (
      <div key={i} className="relative pl-6 mb-5">
        {/* Visual Timeline Dot */}
        <div className="absolute left-[-5px] top-1.5 w-[9px] h-[9px] rounded-full border-2 border-gray-800 bg-white z-10"></div>
        
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <h3 className="font-bold text-[10pt] text-gray-900">{titlePart.trim()}</h3>
          {subPart.trim() && <span className="text-[8.5pt] text-gray-500 italic whitespace-nowrap">{subPart.trim()}</span>}
        </div>
        <div className="text-[9pt] text-gray-600 leading-relaxed space-y-1">
          {bullets.map((bullet, j) => (
            <p key={j} className="text-justify">{bullet.replace(/^[-•]\s*/, '').trim()}</p>
          ))}
        </div>
      </div>
    );
  });
};

// --- SKILL LIST RENDERER (Left Sidebar) ---
const renderSkillsList = (text) => {
  if (!text || typeof text !== 'string') return null;
  return text.split('\n').filter(l => l.trim()).map((line, i) => {
    const clean = line.replace(/^[-•]\s*/, '').replace(/\*/g, '').trim();
    if (!clean) return null;
    const [rawKey, ...rest] = clean.split(':');
    const value = rest.join(':').trim();

    return (
      <div key={i} className="mb-3">
        <p className="text-[9pt] text-gray-800 font-bold uppercase tracking-wide mb-0.5">{rawKey.trim()}</p>
        {value && <p className="text-[8.5pt] text-gray-600 leading-snug">{value}</p>}
      </div>
    );
  });
};

// --- SIMPLE BULLET LIST (Extracurricular) ---
const renderBulletList = (text) => {
  if (!text || typeof text !== 'string') return null;
  return text.split('\n').filter(l => l.trim()).map((line, i) => (
    <li key={i} className="ml-4 list-disc mb-1 pl-1 text-[9pt] text-gray-700 leading-relaxed text-justify">
      {line.replace(/^[-•]\s*/, '').replace(/\*/g, '').trim()}
    </li>
  ));
};

export default function TemplateDouble({ name, phone, address, email, content, rawData, photo }) {
  const sections = parseSections(content, rawData);

  return (
    <div className="font-sans text-gray-900 bg-white w-[8.5in] h-[11in] max-h-[11in] overflow-hidden shadow-2xl relative flex">
      
      {/* --- LEFT COLUMN (GRAY SIDEBAR) --- */}
      <div className="w-[35%] bg-[#E6E6E6] z-10 flex flex-col items-center pt-10 px-6">
        
        {/* Profile Photo (Circle) */}
        <div className="w-44 h-44 rounded-full border-[6px] border-[#E6E6E6] bg-gray-300 mb-8 z-20 shadow-sm overflow-hidden flex items-center justify-center">
          {photo ? (
            <img src={photo} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-500 text-xs font-bold uppercase">No Photo</span>
          )}
        </div>

        <div className="w-full text-left space-y-10">
           {/* Education */}
           <div>
             <h2 className="text-[11pt] font-black tracking-[0.2em] uppercase mb-2">Education</h2>
             <hr className="border-t-2 border-gray-900 w-10 mb-4"/>
             <div className="text-[9.5pt] text-gray-700 leading-snug space-y-3">
                {sections.education.split('\n').filter(l => l.trim()).map((l, i) => (
                  <p key={i}>{l.replace(/\*/g, '').trim()}</p>
                ))}
             </div>
           </div>

           {/* Skills */}
           <div>
             <h2 className="text-[11pt] font-black tracking-[0.2em] uppercase mb-2">Skills</h2>
             <hr className="border-t-2 border-gray-900 w-10 mb-4"/>
             <div className="w-full">
                {renderSkillsList(sections.skills)}
             </div>
           </div>
        </div>
      </div>

      {/* --- RIGHT COLUMN (WHITE CONTENT) --- */}
      <div className="w-[65%] bg-white relative">
        
        {/* Dark Header Band (Name Only) */}
        <div className="absolute top-12 left-0 w-full h-32 bg-[#2B2B2B] z-0 flex flex-col justify-center pl-14 pr-8">
            <h1 className="text-white text-3xl font-black tracking-[0.1em] uppercase leading-none">
              {name || "LORNA ALVARADO"}
            </h1>
        </div>

        <div className="pt-[12.5rem] px-10 pb-10">
            
            {/* Contact Info Grid */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-4 mb-12 text-[8.5pt] font-bold text-gray-800">
                <div className="flex items-center gap-2"><Phone size={14} className="text-gray-900 shrink-0"/> {phone || "+123-456-7890"}</div>
                <div className="flex items-center gap-2"><Globe size={14} className="text-gray-900 shrink-0"/> Portfolio / LinkedIn</div>
                <div className="flex items-center gap-2"><Mail size={14} className="text-gray-900 shrink-0"/> {email || "hello@site.com"}</div>
                <div className="flex items-center gap-2"><MapPin size={14} className="text-gray-900 shrink-0"/> {address || "City, State"}</div>
            </div>

            {/* Experience Timeline */}
            {sections.experience && (
              <div className="mb-10">
                <h2 className="text-[12pt] font-black tracking-[0.2em] uppercase mb-6 text-gray-800 flex items-center gap-4">
                    Experience <span className="flex-1 h-[1.5px] bg-gray-300"></span>
                </h2>
                <div className="border-l-[1.5px] border-gray-400 ml-[3px]">
                    {renderTimeline(sections.experience)}
                </div>
              </div>
            )}

            {/* Projects Timeline */}
            {sections.projects && (
              <div>
                <h2 className="text-[12pt] font-black tracking-[0.2em] uppercase mb-6 text-gray-800 flex items-center gap-4 mt-4">
                    Projects <span className="flex-1 h-[1.5px] bg-gray-300"></span>
                </h2>
                <div className="border-l-[1.5px] border-gray-400 ml-[3px]">
                    {renderTimeline(sections.projects)}
                </div>
              </div>
            )}

            {/* Extracurricular */}
            {sections.extracurricular && (
              <div className="mt-8">
                <h2 className="text-[12pt] font-black tracking-[0.2em] uppercase mb-4 text-gray-800 flex items-center gap-4">
                    Extracurricular <span className="flex-1 h-[1.5px] bg-gray-300"></span>
                </h2>
                <ul className="space-y-0.5">
                    {renderBulletList(sections.extracurricular)}
                </ul>
              </div>
            )}
            
        </div>
      </div>
    </div>
  );
}