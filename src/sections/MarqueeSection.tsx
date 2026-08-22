import { useEffect, useRef, useState } from 'react';
import { row1Images, row2Images } from '../data/marqueeImages';

function tripled(images: string[]) {
  return [...images, ...images, ...images];
}

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const [, setTick] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const offset =
        (window.scrollY - sectionTop + window.innerHeight) * 0.3;

      if (row1Ref.current) {
        row1Ref.current.style.transform = `translateX(${offset - 200}px)`;
      }
      if (row2Ref.current) {
        row2Ref.current.style.transform = `translateX(${-(offset - 200)}px)`;
      }
      setTick((t) => t + 1);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const row1 = tripled(row1Images);
  const row2 = tripled(row2Images);

  return (
    <section
      ref={sectionRef}
      className="bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden"
    >
      <div ref={row1Ref} className="flex gap-3" style={{ willChange: 'transform' }}>
        {row1.map((src, i) => (
          <img
            key={`row1-${i}`}
            src={src}
            alt=""
            loading="lazy"
            className="rounded-2xl object-cover flex-shrink-0"
            style={{ width: '420px', height: '270px' }}
          />
        ))}
      </div>
      <div
        ref={row2Ref}
        className="flex gap-3 mt-3"
        style={{ willChange: 'transform' }}
      >
        {row2.map((src, i) => (
          <img
            key={`row2-${i}`}
            src={src}
            alt=""
            loading="lazy"
            className="rounded-2xl object-cover flex-shrink-0"
            style={{ width: '420px', height: '270px' }}
          />
        ))}
      </div>
    </section>
  );
}
