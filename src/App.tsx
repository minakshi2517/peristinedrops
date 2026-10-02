import {
  Component,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import { CONTACT, IMG, TAGLINE } from "./content";
import { AboutPage, ContactPage, GalleryPage, HomePage, ProductsPage, StoryPage } from "./pages";
import { ALL, NAV, PAGES, pageFrom, type Go, type Page } from "./routes";
import { Roll, useFlag } from "./ui";

const BottleStage = lazy(() => import("./scene").then((mod) => ({ default: mod.BottleStage })));

const SEEN_KEY = "pd-intro";
const STAGE_PAGES: Page[] = ["home", "products"];

class StageBoundary extends Component<{ children: ReactNode; onFail: () => void }, { bad: boolean }> {
  state = { bad: false };
  static getDerivedStateFromError() {
    return { bad: true };
  }
  componentDidCatch() {
    this.props.onFail();
  }
  render() {
    return this.state.bad ? null : this.props.children;
  }
}

function introSeen() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return true;
  }
}

function Intro({ ready, onReveal, onDone }: { ready: boolean; onReveal: () => void; onDone: () => void }) {
  const cb = useRef({ onReveal, onDone });
  cb.current = { onReveal, onDone };
  const [minDone, setMinDone] = useState(false);
  const [capped, setCapped] = useState(false);
  const leaving = minDone && (ready || capped);

  useEffect(() => {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* storage unavailable */
    }
    const min = window.setTimeout(() => setMinDone(true), 800);
    const cap = window.setTimeout(() => setCapped(true), 3200);
    return () => {
      window.clearTimeout(min);
      window.clearTimeout(cap);
    };
  }, []);

  useEffect(() => {
    if (!leaving) return;
    cb.current.onReveal();
    const done = window.setTimeout(() => cb.current.onDone(), 900);
    return () => window.clearTimeout(done);
  }, [leaving]);

  return (
    <div className={leaving ? "intro-screen leave" : "intro-screen"} aria-hidden="true">
      <img src={IMG.logoWhite.src} alt="" width={IMG.logoWhite.w} height={IMG.logoWhite.h} />
    </div>
  );
}

function Footer({ go, page }: { go: Go; page: Page }) {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <a href="/" onClick={(e) => go(e, "home")} aria-label="Pristine Drops, home">
            <img className="footer-logo" src={IMG.logoWhite.src} alt="Pristine Drops" width={IMG.logoWhite.w} height={IMG.logoWhite.h} loading="lazy" />
          </a>
          <p>Packaged drinking water with one promise printed on every label: goodness in every drop.</p>
        </div>

        <nav className="footer-col" aria-label="Footer">
          <p className="footer-label">Explore</p>
          {ALL.map((id) => (
            <a key={id} className="ul" href={PAGES[id].path} onClick={(e) => go(e, id)} aria-current={page === id ? "page" : undefined}>
              {PAGES[id].label}
            </a>
          ))}
        </nav>

        <div className="footer-col">
          <p className="footer-label">Contact</p>
          {CONTACT.email && (
            <a className="ul" href={`mailto:${CONTACT.email}`}>
              {CONTACT.email}
            </a>
          )}
          {CONTACT.phone && (
            <a className="ul" href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}>
              {CONTACT.phone}
            </a>
          )}
          {CONTACT.location && <span>{CONTACT.location}</span>}
          <a className="ul" href={PAGES.contact.path} onClick={(e) => go(e, "contact")}>
            Send a message
          </a>
        </div>

        {CONTACT.socials.length > 0 && (
          <div className="footer-col">
            <p className="footer-label">Follow</p>
            {CONTACT.socials.map((s) => (
              <a key={s.label} className="ul" href={s.href} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            ))}
          </div>
        )}
      </div>

      <p className="footer-statement" aria-hidden="true">
        {TAGLINE.replace("Every Drop", "every drop")}.
      </p>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Pristine Drops. All rights reserved.</p>
        <p className="footer-mantra">Pure · Fresh · Pristine</p>
        <a className="ul" href={PAGES[page].path} onClick={(e) => go(e, page)}>
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}

export default function App() {
  const reduce = useFlag("(prefers-reduced-motion: reduce)");
  const wide = useFlag("(min-width: 980px) and (pointer: fine)");
  const [page, setPage] = useState<Page>(() => pageFrom(window.location.pathname));
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [stageOn, setStageOn] = useState(true);
  const hasStage = STAGE_PAGES.includes(page);
  const [intro, setIntro] = useState(() => !introSeen() && !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [playing, setPlaying] = useState(!intro);
  const [navHidden, setNavHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [curtain, setCurtain] = useState<{ label: string; phase: "in" | "out" } | null>(null);
  const timers = useRef<number[]>([]);
  const jumping = useRef(false);
  const lenis = useRef<Lenis | null>(null);
  const pendingHash = useRef(window.location.hash.slice(1));

  useEffect(() => {
    if (reduce) return;
    const instance = new Lenis({ autoRaf: true, lerp: 0.11, smoothWheel: true, wheelMultiplier: 0.95 });
    lenis.current = instance;
    return () => {
      instance.destroy();
      lenis.current = null;
    };
  }, [reduce]);

  useEffect(() => {
    const instance = lenis.current;
    if (!instance) return;
    if (intro || menuOpen) instance.stop();
    else instance.start();
  }, [intro, menuOpen, reduce]);

  useEffect(() => {
    document.documentElement.classList.toggle("is-loading", intro);
  }, [intro]);

  useEffect(() => {
    if (window.location.pathname !== PAGES[page].path && pageFrom(window.location.pathname) === page) {
      history.replaceState(null, "", PAGES[page].path + window.location.hash);
    }
  }, [page]);

  useLayoutEffect(() => {
    document.title = PAGES[page].title;
    const target = pendingHash.current ? document.getElementById(pendingHash.current) : null;
    pendingHash.current = "";
    const top = target ? target.getBoundingClientRect().top + window.scrollY - 96 : 0;
    jumping.current = true;
    const instance = lenis.current;
    if (instance) {
      instance.resize();
      instance.scrollTo(top, { immediate: true, force: true });
    } else {
      window.scrollTo(0, top);
    }
  }, [page]);

  useEffect(() => {
    if (!playing) return;
    const nodes = document.querySelectorAll<HTMLElement>(".reveal:not(.in), .lines:not(.in), .img-reveal:not(.in)");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -5% 0px" },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [playing, page]);

  useEffect(() => {
    const root = document.documentElement;
    const wasOpen = root.classList.contains("menu-open");
    root.classList.toggle("menu-open", menuOpen);
    if (!menuOpen) {
      if (!wasOpen) return;
      root.classList.add("menu-closing");
      const id = window.setTimeout(() => root.classList.remove("menu-closing"), 720);
      return () => {
        window.clearTimeout(id);
        root.classList.remove("menu-closing");
      };
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 4000);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const zone = document.getElementById("stage-zone");
    setStageOn(!!zone);
    if (!zone) return;
    const observer = new IntersectionObserver(([entry]) => setStageOn(entry.isIntersecting));
    observer.observe(zone);
    return () => observer.disconnect();
  }, [page]);

  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 40);
      if (jumping.current) {
        jumping.current = false;
        last = y;
        setNavHidden(false);
        return;
      }
      if (Math.abs(y - last) > 6) {
        setNavHidden(y > last && y > window.innerHeight * 0.6);
        last = y;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const swap = useCallback(
    (to: Page, hash: string) => {
      const show = () => {
        pendingHash.current = hash;
        setPage(to);
      };
      timers.current.forEach((t) => window.clearTimeout(t));
      if (reduce) {
        show();
        setCurtain(null);
        return;
      }
      const label = to === "home" ? "Pristine Drops" : PAGES[to].label;
      setCurtain({ label, phase: "in" });
      timers.current = [
        window.setTimeout(() => {
          show();
          setCurtain({ label, phase: "out" });
        }, 560),
        window.setTimeout(() => setCurtain(null), 1360),
      ];
    },
    [reduce],
  );

  const go = useCallback<Go>(
    (event, to, hash = "") => {
      event?.preventDefault();
      setMenuOpen(false);
      if (to === page) {
        const target = hash ? document.getElementById(hash) : null;
        const top = target ? target.getBoundingClientRect().top + window.scrollY - 96 : 0;
        if (lenis.current) lenis.current.scrollTo(top, { duration: 1.3 });
        else window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
        return;
      }
      history.pushState(null, "", PAGES[to].path + (hash ? `#${hash}` : ""));
      swap(to, hash);
    },
    [page, reduce, swap],
  );

  useEffect(() => {
    const onPop = () => swap(pageFrom(window.location.pathname), window.location.hash.slice(1));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [swap]);

  return (
    <>
      {intro && <Intro ready={ready} onReveal={() => setPlaying(true)} onDone={() => setIntro(false)} />}

      <div className={hasStage ? "stage" : "stage off"} aria-hidden="true">
        <StageBoundary
          onFail={() => {
            setFailed(true);
            setReady(true);
          }}
        >
          <Suspense fallback={null}>
            <BottleStage
              reduce={reduce}
              running={stageOn && hasStage}
              playing={playing}
              page={page}
              word={page === "home"}
              onReady={() => setReady(true)}
            />
          </Suspense>
        </StageBoundary>
      </div>

      <a className="skip" href="#main">
        Skip to content
      </a>

      <header className={`nav${scrolled ? " scrolled" : ""}${navHidden && !menuOpen ? " hidden" : ""}${playing ? " on" : ""}`}>
        <a className="brand" href="/" onClick={(e) => go(e, "home")} aria-label="Pristine Drops, home">
          <img src={IMG.logoWhite.src} alt="Pristine Drops" width={IMG.logoWhite.w} height={IMG.logoWhite.h} />
        </a>
        <nav className="nav-links" aria-label="Primary">
          {NAV.map((id) => (
            <a
              key={id}
              href={PAGES[id].path}
              className={page === id ? "is-active" : ""}
              aria-current={page === id ? "page" : undefined}
              onClick={(e) => go(e, id)}
            >
              <Roll>{PAGES[id].label}</Roll>
              <span className="sr-only">{PAGES[id].label}</span>
            </a>
          ))}
        </nav>
        <button className="menu-btn" type="button" aria-expanded={menuOpen} aria-controls="menu" onClick={() => setMenuOpen((open) => !open)}>
          <span>{menuOpen ? "Close" : "Menu"}</span>
          <i />
        </button>
      </header>

      <div id="menu" className={menuOpen ? "menu open" : "menu"} aria-hidden={!menuOpen}>
        <nav aria-label="Mobile">
          {ALL.map((id, i) => (
            <a
              key={id}
              href={PAGES[id].path}
              className={page === id ? "is-active" : ""}
              aria-current={page === id ? "page" : undefined}
              tabIndex={menuOpen ? 0 : -1}
              style={{ "--i": i } as CSSProperties}
              onClick={(e) => go(e, id)}
            >
              {PAGES[id].label}
            </a>
          ))}
        </nav>
        <div className="menu-foot">
          {CONTACT.email && (
            <a href={`mailto:${CONTACT.email}`} tabIndex={menuOpen ? 0 : -1}>
              {CONTACT.email}
            </a>
          )}
          <span>{TAGLINE}</span>
        </div>
      </div>

      <div className={curtain ? `curtain ${curtain.phase}` : "curtain"} aria-hidden="true">
        <div className="curtain-inner">
          <span>{curtain?.label}</span>
        </div>
      </div>

      <main id="main" key={page} className={playing ? "is-playing" : ""}>
        {page === "home" && <HomePage go={go} wide={wide} failed={failed} />}
        {page === "about" && <AboutPage go={go} />}
        {page === "products" && <ProductsPage go={go} failed={failed} />}
        {page === "story" && <StoryPage go={go} />}
        {page === "gallery" && <GalleryPage go={go} />}
        {page === "contact" && <ContactPage go={go} />}
      </main>

      <Footer go={go} page={page} />
    </>
  );
}
