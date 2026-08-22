import { useLayoutEffect, useRef, useState } from 'react';
import FadeIn from '../components/FadeIn';
import Magnet from '../components/Magnet';
import ContactButton from '../components/ContactButton';
import { getRotatingPortrait } from '../utils/rotatingPortrait';

const navLinks = ['About', 'Price', 'Projects', 'Contact'];
const HERO_NAME = 'LELOUCH';

function navLinkProps(link: string) {
  if (link === 'Contact') {
    return {
      href: 'https://t.me/lyzos',
      target: '_blank',
      rel: 'noopener noreferrer',
    };
  }
  return { href: `#${link.toLowerCase()}` };
}

export default function HeroSection() {
  const headingWrapRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [scaleX, setScaleX] = useState(1);
  const [portraitSrc] = useState(() => getRotatingPortrait());

  // Scales the heading horizontally so any name length fills the full
  // width edge-to-edge without ever clipping, on every breakpoint.
  useLayoutEffect(() => {
    function fitHeading() {
      const wrap = headingWrapRef.current;
      const heading = headingRef.current;
      if (!wrap || !heading) return;

      heading.style.transform = 'scaleX(1)';
      const wrapWidth = wrap.offsetWidth;
      const textWidth = heading.scrollWidth;

      if (textWidth > 0 && wrapWidth > 0) {
        setScaleX(wrapWidth / textWidth);
      }
    }

    fitHeading();
    window.addEventListener('resize', fitHeading);

    if (document.fonts?.ready) {
      document.fonts.ready.then(fitHeading);
    }

    return () => window.removeEventListener('resize', fitHeading);
  }, []);

  return (
    <section className="h-screen flex flex-col relative" style={{ overflowX: 'clip' }}>
      {/* Navbar */}
      <FadeIn delay={0} y={-20} as="nav">
        <div className="flex justify-between items-center px-6 md:px-10 pt-6 md:pt-8">
          {navLinks.map((link) => (
            <a
              key={link}
              {...navLinkProps(link)}
              className="text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] transition-opacity duration-200 hover:opacity-70"
            >
              {link}
            </a>
          ))}
        </div>
      </FadeIn>

      {/* Heading */}
      <div ref={headingWrapRef} className="overflow-hidden w-full mt-6 sm:mt-4 md:-mt-5">
        <FadeIn delay={0.15} y={40}>
          <h1
            ref={headingRef}
            className="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap w-fit text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw]"
            style={{ transform: `scaleX(${scaleX})`, transformOrigin: 'left center' }}
          >
            Hi, i&apos;m {HERO_NAME}
          </h1>
        </FadeIn>
      </div>

      {/* Portrait */}
      <Magnet
        padding={150}
        strength={3}
        activeTransition="transform 0.3s ease-out"
        inactiveTransition="transform 0.6s ease-in-out"
        className="absolute left-1/2 -translate-x-1/2 z-10 top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0 w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px]"
      >
        <FadeIn delay={0.6} y={30}>
          <img
            src={portraitSrc}
            alt={`${HERO_NAME} portrait`}
            className="w-full h-auto select-none pointer-events-none"
            draggable={false}
          />
        </FadeIn>
      </Magnet>

      {/* Bottom bar */}
      <div className="flex justify-between items-end pb-7 sm:pb-8 md:pb-10 px-6 md:px-10 mt-auto relative z-20">
        <FadeIn delay={0.35} y={20}>
          <p
            className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[260px]"
            style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
          >
            a 3d creator driven by crafting striking and unforgettable projects
          </p>
        </FadeIn>
        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
}
