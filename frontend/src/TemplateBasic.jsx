import React from 'react';

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

// --- ACADEMIC FORMATTER ENGINE (Adapted for Basic Layout) ---
const renderBasicContent = (title, text) => {
  if (!text || typeof text !== 'string') return null;
  
  // Clean markdown artifacts and trim empty lines
  const lines = text.split('\n')
    .map(l => l.replace(/\*\*/g, '').replace(/\*/g, '').trim())
    .filter(l => l);

  const renderContent = () => {
    // 1. SKILLS: Bold the category (before colon)
    if (title.toLowerCase().includes('skill')) {
      return lines.map((line, i) => {
        if (line.includes(':')) {
          const [key, ...rest] = line.split(':');
          return (
            <div key={i} className="flex items-start gap-2 mb-1 text-[10pt] text-black leading-snug">
              <span className="font-bold shrink-0 w-[135px]">{key.trim()}</span>
              <span>: {rest.join(':').trim()}</span>
            </div>
          );
        }
        return <p key={i} className="text-[10pt] text-black">{line}</p>;
      });
    }

    // 2. PROJECTS: Bold Name. Italic Tech Stack on right
    if (title.toLowerCase().includes('project')) {
      return lines.map((line, i) => {
        if (line.startsWith('-') || line.startsWith('•')) {
          return (
            <li key={i} className="ml-5 list-disc mb-1 pl-1 text-[10pt] text-black leading-[1.3] text-justify">
              {line.replace(/^[-•]\s*/, '')}
            </li>
          );
        }
        if (line.includes('|')) {
           const [pName, pTech] = line.split('|');
           return (
             <div key={i} className="flex justify-between items-end mt-3 mb-1 text-[10pt] text-black">
               <span className="font-bold">{pName.trim()}.</span>
               <span className="italic text-gray-700">{pTech.trim()}</span>
             </div>
           );
        }
        return <p key={i} className="font-bold mt-3 mb-1 text-[10pt] text-black">{line}.</p>;
      });
    }

    // 3. EDUCATION: Degree | Date, then Bold Institution
    if (title.toLowerCase().includes('education')) {
      let isInstitution = false;
      return lines.map((line, i) => {
        if (line.includes('|')) {
          const [deg, date] = line.split('|');
          isInstitution = true; 
          return (
            <div key={i} className="flex justify-between items-end mt-3 mb-0.5 text-[10pt] text-black">
              <span>{deg.trim()}</span>
              <span>{date.trim()}</span>
            </div>
          );
        } else if (isInstitution) {
          isInstitution = false;
          return <p key={i} className="font-bold text-[10pt] text-black mb-0.5">{line}</p>;
        }
        return <p key={i} className="text-[10pt] text-black mb-0.5">{line}</p>;
      });
    }

    // 4. GENERAL: Experience and Activities
    return lines.map((line, i) => {
      if (line.startsWith('-') || line.startsWith('•')) {
        return (
          <li key={i} className="ml-5 list-disc mb-1 pl-1 text-[10pt] text-black leading-[1.3] text-justify">
            {line.replace(/^[-•]\s*/, '')}
          </li>
        );
      }
      if (line.includes('|')) {
        const [role, date] = line.split('|');
        return (
          <div key={i} className="flex justify-between items-end mt-3 mb-0.5 text-[10pt] text-black">
            <span className="font-bold">{role.trim()}</span>
            <span>{date.trim()}</span>
          </div>
        );
      }
      return <p key={i} className="font-bold text-[10pt] text-black mt-3 mb-0.5">{line}</p>;
    });
  };

  return (
    <div className="flex w-full py-4 border-t-[1px] border-black">
      <div className="w-[25%] pr-4 shrink-0">
        <h2 className="text-[9.5pt] font-bold uppercase tracking-widest text-black leading-tight">
          {title}
        </h2>
      </div>
      <div className="w-[75%] pl-2 leading-snug">
        {renderContent()}
      </div>
    </div>
  );
};

export default function TemplateBasic({ name, phone, address, email, content, rawData }) {
  const sections = parseSections(content, rawData);

  return (
    <div 
      className="bg-white w-[8.5in] h-[11in] max-h-[11in] overflow-hidden shadow-2xl relative px-14 py-12 text-black" 
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      {/* HEADER: Subtitle (Software Engineering) Removed */}
      <div className="mb-4">
        <h1 className="text-[34pt] font-bold tracking-tight leading-none text-black">
          {name || "SANSKRITI KARANTH"}
        </h1>
      </div>

      {/* CONTACT INFO: 1px Solid Black Line */}
      <div className="flex w-full py-4 border-t-[1px] border-black mb-1 text-[9.5pt]">
        <div className="w-[25%] pr-4 shrink-0">
          <h2 className="font-bold uppercase tracking-widest text-black">Contact</h2>
        </div>
        <div className="w-[75%] pl-2 grid grid-cols-2 gap-y-1 gap-x-4">
          <p><span className="font-bold">Phone:</span> {phone || "9191919191"}</p>
          <p><span className="font-bold">Address:</span> {address || "City, State"}</p>
          <p><span className="font-bold">Email:</span> {email || "sanskritikaranth4@gmail.com"}</p>
          <p><span className="font-bold">Portfolio:</span> LinkedIn / GitHub</p>
        </div>
      </div>

      {/* DYNAMIC SECTIONS */}
      {renderBasicContent("Professional Experience", sections.experience)}
      {renderBasicContent("Education", sections.education)}
      {renderBasicContent("Skills & Competencies", sections.skills)}
      {renderBasicContent("Key Projects", sections.projects)}
      {renderBasicContent("Extracurriculars", sections.extracurricular)}
    </div>
  );
}