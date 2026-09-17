import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./SignatureHighlight.scss";

gsap.registerPlugin(ScrollTrigger);

// how much space to leave at top for the fixed/sticky nav while pinned
// bump this up/down to match your real nav height
const NAV_OFFSET = 85;

const STAGES = [
  {
    key: "top",
    label: "Top Notes",
    notes: "Citrus · Bergamot",
    tint: "#E8D5C4",
    image:
      "https://images.unsplash.com/photo-1621275155732-2bff82c64fd2?w=1400&q=80&auto=format&fit=crop",
  },
  {
    key: "heart",
    label: "Heart Notes",
    notes: "Jasmine · Amber",
    tint: "#C9A66B",
    image:
      "https://images.unsplash.com/photo-1589493732575-11a963a7c415?w=1400&q=80&auto=format&fit=crop",
  },
  {
    key: "base",
    label: "Base Notes",
    notes: "Musk · Sandalwood",
    tint: "#1A1A1A",
    image:
      "https://images.unsplash.com/photo-1584841247175-4d766cefa018?w=1400&q=80&auto=format&fit=crop",
  },
];

// Pass `images={[url1, url2, url3]}` to override any of the 3 stage photos
export default function SignatureHighlight({ images = [] }) {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const mediaRef = useRef(null);
  const textRefs = useRef([]);
  const dotRefs = useRef([]);
  const imageRefs = useRef([]);
  textRefs.current = [];
  dotRefs.current = [];
  imageRefs.current = [];

  const addTextRef = (el) => el && textRefs.current.push(el);
  const addDotRef = (el) => el && dotRefs.current.push(el);
  const addImageRef = (el) => el && imageRefs.current.push(el);

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
            const y = Math.max(-24, Math.min(24, (i - seg) * 24));
            gsap.set(textRefs.current[i], { autoAlpha: alpha, y });
            gsap.set(imageRefs.current[i], { autoAlpha: alpha });
          });

          gsap.set(mediaRef.current, { "--tint": STAGES[activeIdx].tint });
          dotRefs.current.forEach((d, di) =>
            d.classList.toggle("js-signature__dot--active", di === activeIdx)
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
    // media stays sticky at the top so the image crossfade is still visible
    mm.add("(max-width: 768px)", () => {
      const ctx = gsap.context(() => {
        gsap.set(textRefs.current, { autoAlpha: 1, y: 0 });
        gsap.set(imageRefs.current[0], { autoAlpha: 1 });
        gsap.set(imageRefs.current.slice(1), { autoAlpha: 0 });

        STAGES.forEach((_, i) => {
          gsap.fromTo(
            textRefs.current[i],
            { autoAlpha: 0, y: 24 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              ease: "power2.out",
              scrollTrigger: {
                trigger: textRefs.current[i],
                start: "top 80%",
              },
            }
          );

          ScrollTrigger.create({
            trigger: textRefs.current[i],
            start: "top 60%",
            end: "bottom 40%",
            onEnter: () => setActiveImage(i),
            onEnterBack: () => setActiveImage(i),
          });
        });

        function setActiveImage(idx) {
          imageRefs.current.forEach((img, ii) => {
            gsap.to(img, { autoAlpha: ii === idx ? 1 : 0, duration: 0.4 });
          });
        }
      }, sectionRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      className="js-signature"
      ref={sectionRef}
      style={{ "--tint": STAGES[0].tint }}
    >
      <div className="js-signature__pin" ref={pinRef}>
        <div className="js-signature__media" ref={mediaRef}>
          {STAGES.map((stage, i) => (
            <div className="js-signature__media-frame" key={stage.key} ref={addImageRef}>
              <img src={images[i] || stage.image} alt={`${stage.label} — Jass Silk perfume`} />
            </div>
          ))}
          <div className="js-signature__media-tint" aria-hidden="true" />
        </div>

        <div className="js-signature__content">
          <span className="js-signature__eyebrow">The Signature</span>

          <div className="js-signature__stages">
            {STAGES.map((stage) => (
              <div className="js-signature__stage" key={stage.key} ref={addTextRef}>
                <span className="js-signature__stage-label">{stage.label}</span>
                <span className="js-signature__stage-notes">{stage.notes}</span>
              </div>
            ))}
          </div>

          <div className="js-signature__dots" aria-hidden="true">
            {STAGES.map((stage, i) => (
              <span
                className={`js-signature__dot ${i === 0 ? "js-signature__dot--active" : ""}`}
                key={stage.key}
                ref={addDotRef}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}