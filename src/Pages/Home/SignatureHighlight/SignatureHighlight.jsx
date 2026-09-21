import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./SignatureHighlight.scss";

import img1 from "../../../assets/images/slide1.png";
import img2 from "../../../assets/images/slide2.png";
import img3 from "../../../assets/images/slide3.png";

gsap.registerPlugin(ScrollTrigger);

// how much space to leave at top for the fixed/sticky nav while pinned
// bump this up/down to match your real nav height
const NAV_OFFSET = 85;

const STAGES = [
  { key: "top", label: "Top", full: "Top Notes", notes: "Citrus · Bergamot", tint: "#E8D5C4", image: img1 },
  { key: "heart", label: "Heart", full: "Heart Notes", notes: "Jasmine · Amber", tint: "#C9A66B", image: img2 },
  { key: "base", label: "Base", full: "Base Notes", notes: "Musk · Sandalwood", tint: "#1A1A1A", image: img3 },
];

const PARTICLE_COUNT = 26;

// Pass `images={[url1, url2, url3]}` to override any of the 3 stage photos
export default function SignatureHighlight({ images = [] }) {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const chamberRef = useRef(null);
  const bgRefs = useRef([]);
  const wordRefs = useRef([]);
  const notesRefs = useRef([]);
  const spineRefs = useRef([]);
  bgRefs.current = [];
  wordRefs.current = [];
  notesRefs.current = [];
  spineRefs.current = [];

  const addBgRef = (el) => el && bgRefs.current.push(el);
  const addWordRef = (el) => el && wordRefs.current.push(el);
  const addNotesRef = (el) => el && notesRefs.current.push(el);
  const addSpineRef = (el) => el && spineRefs.current.push(el);

  // stable, randomized once — never recomputed on re-render
  const particlesRef = useRef(null);
  if (!particlesRef.current) {
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
      left: Math.round(Math.random() * 100),
      size: 3 + Math.round(Math.random() * 6),
      duration: 9 + Math.random() * 8,
      delay: -Math.random() * 14,
    }));
  }

  useEffect(() => {
    const mm = gsap.matchMedia();

    // Desktop / tablet — pinned, scrubbed stage sequence.
    //
    // Deliberately NOT using a timeline of discrete .to() tweens here.
    // With a pinned + scrubbed ScrollTrigger, GSAP captures a tween's
    // "from" value lazily (at render time, not at creation time) — and
    // ScrollTrigger's own internal pin/refresh pass can render the
    // timeline before that capture happens the way you'd expect, which
    // is what was leaving every stage's autoAlpha stuck at 0 no matter
    // what initial gsap.set() we ran. Driving everything from one
    // deterministic function based on scroll progress removes that race
    // entirely — it's called once immediately on setup AND on every
    // scroll update, so the first stage is guaranteed correct on load.
    mm.add("(min-width: 769px)", () => {
      const ctx = gsap.context(() => {
        const segMax = STAGES.length - 1; // 2 for 3 stages

        function render(progress) {
          const seg = progress * segMax; // 0..2
          const activeIdx = Math.round(Math.min(Math.max(seg, 0), segMax));

          STAGES.forEach((stage, i) => {
            const dist = Math.abs(seg - i);
            const alpha = Math.max(0, 1 - dist);
            gsap.set(bgRefs.current[i], { opacity: alpha * 0.5 });
            gsap.set(wordRefs.current[i], { opacity: alpha, scale: 0.86 + alpha * 0.14 });
            gsap.set(notesRefs.current[i], { opacity: alpha, y: (1 - alpha) * 14 });
          });

          gsap.set(chamberRef.current, { "--tint": STAGES[activeIdx].tint });
          spineRefs.current.forEach((el, i) =>
            el.classList.toggle("js-signature__spine-item--active", i === activeIdx)
          );
        }

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: `top ${NAV_OFFSET}px`,
          end: "+=200%",
          scrub: 0.6,
          pin: pinRef.current,
          anticipatePin: 1,
          onUpdate: (self) => render(self.progress),
        });

        // paint the correct initial state right away — don't wait for
        // the first scroll event or ScrollTrigger's own refresh pass
        render(0);
      }, sectionRef);

      return () => ctx.revert();
    });

    // Mobile — no pin, each stage reveals as it scrolls into view,
    // chamber background stays sticky at the top so the mood-shift is still visible
    mm.add("(max-width: 768px)", () => {
      const ctx = gsap.context(() => {
        gsap.set(bgRefs.current, { opacity: 0 });
        gsap.set(bgRefs.current[0], { opacity: 0.5 });
        gsap.set(wordRefs.current, { opacity: 1, scale: 1 });
        gsap.set(notesRefs.current, { opacity: 1, y: 0 });

        STAGES.forEach((_, i) => {
          ScrollTrigger.create({
            trigger: wordRefs.current[i],
            start: "top 60%",
            end: "bottom 40%",
            onEnter: () => setActive(i),
            onEnterBack: () => setActive(i),
          });
        });

        function setActive(idx) {
          bgRefs.current.forEach((bg, ii) =>
            gsap.to(bg, { opacity: ii === idx ? 0.5 : 0, duration: 0.5 })
          );
          gsap.to(chamberRef.current, { "--tint": STAGES[idx].tint, duration: 0.5 });
          spineRefs.current.forEach((el, ii) =>
            el.classList.toggle("js-signature__spine-item--active", ii === idx)
          );
        }
      }, sectionRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="js-signature" ref={sectionRef}>
      <div className="js-signature__grain" aria-hidden="true" />

      <div className="js-signature__pin" ref={pinRef}>
        <div className="js-signature__chamber" ref={chamberRef}>
          {/* Blurred, mood-shifting backdrop — one per stage, crossfading */}
          {STAGES.map((stage, i) => (
            <div className="js-signature__backdrop" key={stage.key} ref={addBgRef}>
              <img src={images[i] || stage.image} alt="" aria-hidden="true" />
            </div>
          ))}
          <div className="js-signature__wash" aria-hidden="true" />

          {/* Floating scent particles */}
          <div className="js-signature__particles" aria-hidden="true">
            {particlesRef.current.map((p, i) => (
              <span
                key={i}
                className="js-signature__particle"
                style={{
                  left: `${p.left}%`,
                  width: p.size,
                  height: p.size,
                  animationDuration: `${p.duration}s`,
                  animationDelay: `${p.delay}s`,
                }}
              />
            ))}
          </div>

          {/* Side wayfinding spine */}
          <div className="js-signature__spine">
            {STAGES.map((stage, i) => (
              <span
                className={`js-signature__spine-item ${i === 0 ? "js-signature__spine-item--active" : ""}`}
                key={stage.key}
                ref={addSpineRef}
              >
                {stage.label}
              </span>
            ))}
          </div>

          {/* Huge crossfading stage typography */}
          <div className="js-signature__words">
            {STAGES.map((stage, i) => (
              <div className="js-signature__word-block" key={stage.key}>
                <span className="js-signature__word" ref={addWordRef}>{stage.full}</span>
                <span className="js-signature__word-notes" ref={addNotesRef}>{stage.notes}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}