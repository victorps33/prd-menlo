'use client';

import { useEffect, useState } from 'react';
import { usePrd } from '@/context/PrdContext';

export default function Sidebar() {
  const { sections } = usePrd();
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-120px 0px -60% 0px' }
    );

    const elements = document.querySelectorAll('.et');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav className="sd">
      <div className="sd-l">Etapas</div>
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#e${s.id}`}
          className={activeId === `e${s.id}` ? 'ac' : ''}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(`e${s.id}`)?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          {s.id}. {s.title}
        </a>
      ))}
      <div className="sd-l" style={{ marginTop: 10 }}>Links</div>
      <a href="https://menlocobranca.vercel.app" target="_blank" rel="noopener noreferrer">
        Abrir plataforma
      </a>
    </nav>
  );
}
