import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import "./CustomCursor.scss";

const CURSOR_CONFIG = {
    view: { label: "View", className: "js-cursor--view" },
    buy: { label: "Buy", className: "js-cursor--buy" },
    drag: { label: null, className: "js-cursor--drag" },
    link: { label: null, className: "js-cursor--link" },
};

// Custom cursor is completely off inside these
const CURSOR_DISABLED_SELECTOR = "footer, .js-footer, [data-cursor-disabled]";

export default function CustomCursor() {
    const [enabled, setEnabled] = useState(false);
    const [cursorType, setCursorType] = useState(null);
    const [visible, setVisible] = useState(false);

    const ringRef = useRef(null);
    const dotRef = useRef(null);
    const ringX = useRef(null);
    const ringY = useRef(null);
    const dotX = useRef(null);
    const dotY = useRef(null);

    useEffect(() => {
        const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        setEnabled(finePointer);
        if (finePointer) document.body.classList.add("js-cursor-none");
        return () => document.body.classList.remove("js-cursor-none");
    }, []);

    useEffect(() => {
        if (!enabled) return;

        ringX.current = gsap.quickTo(ringRef.current, "x", { duration: 0.45, ease: "power3" });
        ringY.current = gsap.quickTo(ringRef.current, "y", { duration: 0.45, ease: "power3" });
        dotX.current = gsap.quickTo(dotRef.current, "x", { duration: 0.12, ease: "power3" });
        dotY.current = gsap.quickTo(dotRef.current, "y", { duration: 0.12, ease: "power3" });

        let inDisabledZone = false;
        let insideWindow = true;

        const isDisabledTarget = (el) => !!(el && el.closest && el.closest(CURSOR_DISABLED_SELECTOR));

        const syncVisibility = () => setVisible(insideWindow && !inDisabledZone);

        const handleMove = (e) => {
            ringX.current(e.clientX);
            ringY.current(e.clientY);
            dotX.current(e.clientX);
            dotY.current(e.clientY);

            const nowDisabled = isDisabledTarget(e.target);
            if (nowDisabled !== inDisabledZone) {
                inDisabledZone = nowDisabled;
                if (nowDisabled) setCursorType(null);
            }
            insideWindow = true;
            syncVisibility();
        };

        const handleOver = (e) => {
            if (isDisabledTarget(e.target)) return;
            const target = e.target.closest("[data-cursor]");
            if (target) setCursorType(target.getAttribute("data-cursor"));
        };

        const handleOut = (e) => {
            const leaving = e.target.closest("[data-cursor]");
            const enteringSame = e.relatedTarget && e.relatedTarget.closest?.("[data-cursor]");
            if (leaving && !enteringSame) setCursorType(null);
        };

        const handleDown = () => {
            if (inDisabledZone) return;
            gsap.to(ringRef.current, { scale: 0.82, duration: 0.15, ease: "power2.out" });
        };
        const handleUp = () => {
            gsap.to(ringRef.current, { scale: 1, duration: 0.3, ease: "back.out(3)" });
        };

        const handleLeaveWindow = () => {
            insideWindow = false;
            syncVisibility();
        };
        const handleEnterWindow = () => {
            insideWindow = true;
            syncVisibility();
        };

        document.addEventListener("mousemove", handleMove);
        document.addEventListener("mouseover", handleOver);
        document.addEventListener("mouseout", handleOut);
        document.addEventListener("mousedown", handleDown);
        document.addEventListener("mouseup", handleUp);
        document.addEventListener("mouseleave", handleLeaveWindow);
        document.addEventListener("mouseenter", handleEnterWindow);

        return () => {
            document.removeEventListener("mousemove", handleMove);
            document.removeEventListener("mouseover", handleOver);
            document.removeEventListener("mouseout", handleOut);
            document.removeEventListener("mousedown", handleDown);
            document.removeEventListener("mouseup", handleUp);
            document.removeEventListener("mouseleave", handleLeaveWindow);
            document.removeEventListener("mouseenter", handleEnterWindow);
        };
    }, [enabled]);

    if (!enabled) return null;

    const config = cursorType ? CURSOR_CONFIG[cursorType] : null;

    return (
        <div
            className={`js-cursor ${visible ? "js-cursor--visible" : ""} ${config ? config.className : ""}`}
            aria-hidden="true"
        >
            <span className="js-cursor__dot" ref={dotRef} />
            <span className="js-cursor__ring" ref={ringRef}>
                {cursorType === "drag" && (
                    <span className="js-cursor__drag-icons">
                        <FaArrowLeftLong /> <FaArrowRightLong />
                    </span>
                )}
                {config?.label && <span className="js-cursor__label">{config.label}</span>}
            </span>
        </div>
    );
}