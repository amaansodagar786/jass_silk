import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./SignatureHighlight.scss";

gsap.registerPlugin(ScrollTrigger);

// how much space to leave at top for the fixed/sticky nav while pinned
const NAV_OFFSET = 0;

// swap `image` for real client ingredient photography whenever it's ready —
// these are free-license Unsplash placeholders for now (citrus, jasmine,
// sandalwood — matched to each note, not generic/abstract)
const STAGES = [
  {
    key: "top",
    label: "Top",
    full: "Top Notes",
    notes: "Citrus · Bergamot",
    blurb: "Bright and immediate - the first breath of the fragrance.",
    tint: "#E8D5C4",
    image:
      "https://images.unsplash.com/photo-1507598641400-ec3536ba81bc?w=1600&q=80&auto=format&fit=crop",
  },
  {
    key: "heart",
    label: "Heart",
    full: "Heart Notes",
    notes: "Jasmine · Amber",
    blurb: "Warm and floral - the soul that lingers through the day.",
    tint: "#C9A66B",
    image:
      "https://images.unsplash.com/photo-1684472993236-b605bb80ca0b?w=1600&q=80&auto=format&fit=crop",
  },
  {
    key: "base",
    label: "Base",
    full: "Base Notes",
    notes: "Musk · Sandalwood",
    blurb: "Deep and grounding - what stays on skin long after.",
    tint: "#8A6A46",
    image:
      "https://images.unsplash.com/photo-1702001145743-094b0b7ead51?w=1600&q=80&auto=format&fit=crop",
  },
];

// Pass `images={[url1, url2, url3]}` to override any of the 3 stage photos
export default function SignatureHighlight({ images = [] }) {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const chamberRef = useRef(null);
  const mediaRefs = useRef([]);
  const wordRefs = useRef([]);
  const notesRefs = useRef([]);
  const blurbRefs = useRef([]);
  const numberRefs = useRef([]);
  const spineRefs = useRef([]);
  mediaRefs.current = [];
  wordRefs.current = [];
  notesRefs.current = [];
  blurbRefs.current = [];
  numberRefs.current = [];
  spineRefs.current = [];

  const addMediaRef = (el) => el && mediaRefs.current.push(el);
  const addWordRef = (el) => el && wordRefs.current.push(el);
  const addNotesRef = (el) => el && notesRefs.current.push(el);
  const addBlurbRef = (el) => el && blurbRefs.current.push(el);
  const addNumberRef = (el) => el && numberRefs.current.push(el);
  const addSpineRef = (el) => el && spineRefs.current.push(el);

  useEffect(() => {
    const mm = gsap.matchMedia();

    // Desktop / tablet — pinned, scrubbed stage sequence, driven by one
    // deterministic render(progress) function (proven stable pattern —
    // avoids the GSAP tween-capture race that a discrete timeline hits
    // inside a pinned + scrubbed ScrollTrigger).
    mm.add("(min-width: 769px)", () => {
      const ctx = gsap.context(() => {
        const segMax = STAGES.length - 1;

        function render(progress) {
          const seg = progress * segMax;
          const activeIdx = Math.round(Math.min(Math.max(seg, 0), segMax));

          STAGES.forEach((stage, i) => {
            const dist = seg - i; // signed — direction drives parallax
            const absDist = Math.abs(dist);
            const alpha = Math.max(0, 1 - absDist);

            gsap.set(mediaRefs.current[i], { autoAlpha: alpha, scale: 1.06 - alpha * 0.06 });

            // layered parallax — each element moves at its own "depth":
            // the ghost number is the slowest/furthest-back layer, the
            // word is the fastest/nearest, notes + blurb sit in between
            // with a slight horizontal drift for extra depth
            gsap.set(numberRefs.current[i], { autoAlpha: alpha * 0.14, y: dist * 26 });
            gsap.set(wordRefs.current[i], { autoAlpha: alpha, y: dist * 90, scale: 1 - absDist * 0.08 });
            gsap.set(notesRefs.current[i], { autoAlpha: alpha, y: dist * 55, x: dist * 10 });
            gsap.set(blurbRefs.current[i], { autoAlpha: alpha, y: dist * 70, x: dist * -14 });
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

        render(0);
      }, sectionRef);

      return () => ctx.revert();
    });

    // Mobile — no pin, media stays sticky behind the text stages as they
    // reveal in normal scroll flow
    mm.add("(max-width: 768px)", () => {
      const ctx = gsap.context(() => {
        gsap.set(mediaRefs.current, { autoAlpha: 0 });
        gsap.set(mediaRefs.current[0], { autoAlpha: 1 });
        gsap.set(wordRefs.current, { autoAlpha: 1, y: 0, x: 0, scale: 1 });
        gsap.set(notesRefs.current, { autoAlpha: 1, y: 0, x: 0 });
        gsap.set(blurbRefs.current, { autoAlpha: 1, y: 0, x: 0 });
        gsap.set(numberRefs.current, { autoAlpha: 0.14, y: 0 });

        STAGES.forEach((_, i) => {
          ScrollTrigger.create({
            trigger: wordRefs.current[i],
            start: "top 60%",
            end: "bottom 40%",
            onEnter: () => setActive(i),
            onEnterBack: () => setActive(i),
          });

          // small standalone parallax drift on the ghost number as its
          // own block scrolls through — independent of the active-stage
          // crossfade logic above
          gsap.fromTo(
            numberRefs.current[i],
            { y: -18 },
            {
              y: 18,
              ease: "none",
              scrollTrigger: {
                trigger: wordRefs.current[i],
                start: "top bottom",
                end: "bottom top",
                scrub: 0.6,
              },
            }
          );
        });

        function setActive(idx) {
          mediaRefs.current.forEach((el, ii) =>
            gsap.to(el, { autoAlpha: ii === idx ? 1 : 0, duration: 0.5 })
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
      <div className="js-signature__pin" ref={pinRef}>
        <div className="js-signature__chamber" ref={chamberRef}>
          <div className="js-signature__grid">
            {/* Sharp ingredient photography — one per stage, crossfading */}
            <div className="js-signature__media">
              {STAGES.map((stage, i) => (
                <div className="js-signature__media-frame" key={stage.key} ref={addMediaRef}>
                  <img src={images[i] || stage.image} alt={`${stage.full} — ${stage.notes}`} />
                </div>
              ))}
              <div className="js-signature__media-tint" aria-hidden="true" />
            </div>

            <div className="js-signature__content">
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

              {/* Layered parallax stage text — ghost number sits behind
                  as the slowest-moving depth layer */}
              <div className="js-signature__stack">
                {STAGES.map((stage, i) => (
                  <div className="js-signature__stage-block" key={stage.key}>
                    <span className="js-signature__ghost-number" ref={addNumberRef} aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="js-signature__word" ref={addWordRef}>{stage.full}</span>
                    <span className="js-signature__word-notes" ref={addNotesRef}>{stage.notes}</span>
                    <p className="js-signature__blurb" ref={addBlurbRef}>{stage.blurb}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}