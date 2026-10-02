import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import { PAGES, type Go, type Page } from "./routes";

export function useFlag(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const apply = () => setMatches(media.matches);
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [query]);
  return matches;
}

export function Roll({ children }: { children: string }) {
  return (
    <span className="roll" aria-hidden="true">
      <span data-text={children}>{children}</span>
    </span>
  );
}

export function Arrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

const ICONS = {
  drop: "M12 3.5c3.2 4 5.5 7.2 5.5 10.2a5.5 5.5 0 0 1-11 0c0-3 2.3-6.2 5.5-10.2Z M9.2 14.6c.5 1.4 1.6 2.2 3 2.3",
  shield: "M12 3.5 19 6v5.6c0 4.3-2.9 7.6-7 8.9-4.1-1.3-7-4.6-7-8.9V6l7-2.5Z M8.8 12.2l2.2 2.2 4.2-4.4",
  wave: "M3 9c2 0 2-1.6 4.5-1.6S9.5 9 12 9s2.5-1.6 4.5-1.6S19 9 21 9 M3 14c2 0 2-1.6 4.5-1.6S9.5 14 12 14s2.5-1.6 4.5-1.6S19 14 21 14 M3 19c2 0 2-1.6 4.5-1.6S9.5 19 12 19s2.5-1.6 4.5-1.6S19 19 21 19",
  seal: "M12 3l2.1 1.6 2.6-.2.9 2.5 2.2 1.4-.8 2.5.8 2.5-2.2 1.4-.9 2.5-2.6-.2L12 19l-2.1-1.6-2.6.2-.9-2.5-2.2-1.4.8-2.5-.8-2.5 2.2-1.4.9-2.5 2.6.2L12 3Z M9.2 11.4l1.9 1.9 3.7-3.8",
};

export function Icon({ name }: { name: keyof typeof ICONS }) {
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

export function Lines({
  lines,
  as: Tag = "h2",
  className,
}: {
  lines: ReactNode[];
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
}) {
  return (
    <Tag className={`lines ${className ?? ""}`}>
      {lines.map((line, i) => (
        <span className="ln" key={i}>
          <span style={{ "--i": i } as CSSProperties}>{line}</span>
        </span>
      ))}
    </Tag>
  );
}

/** Sets `--p` (0–1) on the element: through a sticky track, through the viewport, or while it scrolls out. */
export function useScrollVar(ref: RefObject<HTMLElement | null>, mode: "track" | "view" | "exit" = "track") {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p =
        mode === "track"
          ? -rect.top / Math.max(1, rect.height - vh)
          : mode === "exit"
            ? -rect.top / Math.max(1, rect.height)
            : (vh - rect.top) / Math.max(1, vh + rect.height);
      el.style.setProperty("--p", Math.min(1, Math.max(0, p)).toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [ref, mode]);
}

export function Manifesto({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const spans = [...el.querySelectorAll<HTMLSpanElement>(".w")];
    let lit = -1;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.85 - rect.top) / (rect.height + vh * 0.25)));
      const next = Math.round(p * spans.length);
      if (next === lit) return;
      spans.forEach((span, i) => span.classList.toggle("on", i < next));
      lit = next;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <p className="manifesto" ref={ref}>
      {words.map((word, i) => (
        <span className="w" key={i}>
          {word}{" "}
        </span>
      ))}
    </p>
  );
}

type Img = { src: string; w: number; h: number; alt: string };

export function Photo({
  img,
  className,
  caption,
  eager,
  delay,
}: {
  img: Img;
  className?: string;
  caption?: string;
  eager?: boolean;
  delay?: number;
}) {
  return (
    <figure className={`photo ${className ?? ""}`}>
      <div className="photo-frame img-reveal" style={delay ? ({ "--d": `${delay}ms` } as CSSProperties) : undefined}>
        <img
          src={img.src}
          alt={img.alt}
          width={img.w}
          height={img.h}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={eager ? "high" : undefined}
        />
      </div>
      {caption && <figcaption className="reveal">{caption}</figcaption>}
    </figure>
  );
}

export function PageLink({
  go,
  to,
  hash,
  className = "btn",
  children,
}: {
  go: Go;
  to: Page;
  hash?: string;
  className?: string;
  children: string;
}) {
  return (
    <a className={className} href={PAGES[to].path + (hash ? `#${hash}` : "")} onClick={(e) => go(e, to, hash)}>
      <Roll>{children}</Roll>
      <span className="sr-only">{children}</span>
      <Arrow />
    </a>
  );
}

export function PageHead({ label, lines, lead, aside }: { label: string; lines: ReactNode[]; lead: string; aside?: ReactNode }) {
  return (
    <section className={aside ? "page-head page-head--split" : "page-head"}>
      <div className="page-head-copy">
        <p className="sec-label reveal">{label}</p>
        <Lines as="h1" lines={lines} />
        <p className="lead reveal" style={{ "--d": "180ms" } as CSSProperties}>
          {lead}
        </p>
      </div>
      {aside}
    </section>
  );
}

export function Closing({
  go,
  label,
  lines,
  copy,
  primary,
  secondary,
}: {
  go: Go;
  label: string;
  lines: ReactNode[];
  copy: string;
  primary: [Page, string];
  secondary?: [Page, string];
}) {
  return (
    <section className="closing">
      <p className="sec-label reveal">{label}</p>
      <Lines lines={lines} />
      <p className="closing-copy reveal" style={{ "--d": "160ms" } as CSSProperties}>
        {copy}
      </p>
      <div className="closing-actions reveal" style={{ "--d": "240ms" } as CSSProperties}>
        <PageLink go={go} to={primary[0]}>
          {primary[1]}
        </PageLink>
        {secondary && (
          <PageLink go={go} to={secondary[0]} className="btn btn--ghost">
            {secondary[1]}
          </PageLink>
        )}
      </div>
    </section>
  );
}
