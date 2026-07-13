import React from 'react';

export default function TemplateProfessional({ name, phone, address, email, content, rawData }) {
  // --- CRASH-PROOF PARSER ---
  const extract = (header) => {
    if (!content) return '';
    const match = content.match(new RegExp(`### ${header}\\s*\\n([\\s\\S]*?)(?=###|$)`, 'i'));
    return match ? match[1].trim() : '';
  };

  const sections = {
    education: extract('Education') || rawData?.education || '',
    experience: extract('Experience') || rawData?.experience || '',
    projects: extract('Projects') || rawData?.projects || '',
    skills: extract('Skills') || rawData?.skills || '',
    extracurricular: extract('Extracurricular') || rawData?.extracurricular || ''
  };

  // --- INTERNAL FORMATTER (Andrew Clark LaTeX Style) ---
  const renderSection = (title, text) => {
    if (!text) return null;
    const lines = text.split('\n').map(l => l.replace(/\*/g, '').trim()).filter(l => l);

    const renderLines = () => {
      // 1. SKILLS: Bold category, then colon
      if (title.toLowerCase().includes('skill')) {
        return lines.map((line, i) => {
          if (line.includes(':')) {
            const [key, ...rest] = line.split(':');
            return (
              <div key={i} className="flex items-start gap-2 mb-1 text-[10.5pt]">
                <span className="font-bold shrink-0 w-[150px]">{key.trim()}</span>
                <span>: {rest.join(':').trim()}</span>
              </div>
            );
          }
          return <p key={i} className="text-[10.5pt] mb-0.5">{line}</p>;
        });
      }

      // 2. PROJECTS: Bold Name. (Left) | Italic Tech (Right)
      if (title.toLowerCase().includes('project')) {
        return lines.map((line, i) => {
          if (line.startsWith('-') || line.startsWith('•')) {
            return <li key={i} className="ml-5 list-disc mb-0.5 pl-1 text-[10.5pt] leading-tight text-justify">{line.replace(/^[-•]\s*/, '')}</li>;
          }
          if (line.includes('|')) {
            const [pName, pTech] = line.split('|');
            return (
              <div key={i} className={`flex justify-between items-end ${i === 0 ? 'mt-0' : 'mt-3'} mb-1 text-[10.5pt]`}>
                <span className="font-bold">{pName.trim()}.</span>
                <span className="italic">{pTech.trim()}</span>
              </div>
            );
          }
          return <p key={i} className={`font-bold ${i === 0 ? 'mt-0' : 'mt-3'} mb-1 text-[10.5pt]`}>{line}.</p>;
        });
      }

      // 3. EDUCATION: Degree (Left) | Year (Right) -> Bold Institution
      if (title.toLowerCase().includes('education')) {
        let isInstitution = false;
        return lines.map((line, i) => {
          if (line.includes('|')) {
            const [deg, date] = line.split('|');
            isInstitution = true; 
            return (
              <div key={i} className={`flex justify-between items-end ${i === 0 ? 'mt-0' : 'mt-2'} mb-0.5 text-[10.5pt]`}>
                <span>{deg.trim()}</span>
                <span>{date.trim()}</span>
              </div>
            );
          } else if (isInstitution) {
            isInstitution = false;
            return <p key={i} className="font-bold text-[10.5pt] mb-0.5">{line}</p>;
          }
          return <p key={i} className="text-[10.5pt] mb-0.5 leading-tight">{line}</p>;
        });
      }

      // 4. GENERAL (Experience)
      return lines.map((line, i) => {
        if (line.startsWith('-') || line.startsWith('•')) {
          return <li key={i} className="ml-5 list-disc mb-0.5 pl-1 text-[10.5pt] leading-tight text-justify">{line.replace(/^[-•]\s*/, '')}</li>;
        }
        if (line.includes('|')) {
          const [role, date] = line.split('|');
          return (
            <div key={i} className={`flex justify-between items-end ${i === 0 ? 'mt-0' : 'mt-3'} mb-0.5 text-[10.5pt]`}>
              <span className="font-bold">{role.trim()}</span>
              <span>{date.trim()}</span>
            </div>
          );
        }
        return <p key={i} className={`font-bold text-[10.5pt] ${i === 0 ? 'mt-0' : 'mt-1.5'} mb-0.5`}>{line}</p>;
      });
    };

    return (
      <div className="mb-5">
        <h2 className="text-[11pt] font-normal uppercase tracking-widest mb-1">{title}</h2>
        <hr className="border-t-[1.5px] border-black mb-2" />
        <div className="leading-snug">{renderLines()}</div>
      </div>
    );
  };

  return (
    <div 
      id="resume-view"
      className="px-12 py-10 bg-white w-[8.5in] h-[11in] max-h-[11in] overflow-hidden relative text-black"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      <div className="text-center mb-6">
        <h1 className="text-[28pt] font-light tracking-widest uppercase mb-1 leading-none">{name || "ANDREW CLARK"}</h1>
        <p className="text-[10.5pt] mb-0.5">{phone || "+918000000011"} &nbsp;&nbsp; {address || "Bengaluru, Karnataka"}</p>
        <p className="text-[10.5pt] text-blue-700 font-medium">{email || "abc@gmail.com"} &nbsp;&bull;&nbsp; LinkedIn &nbsp;&bull;&nbsp; LeetCode &nbsp;&bull;&nbsp; GitHub</p>
      </div>

      {renderSection("Education", sections.education)}
      {renderSection("Skills", sections.skills)}
      {renderSection("Projects", sections.projects)}
      {renderSection("Experience", sections.experience)}
      {renderSection("Extra-Curricular Activities", sections.extracurricular)}
    </div>
  );
}