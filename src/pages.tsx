import { useRef, useState, type CSSProperties, type FormEvent } from "react";
import {
  CHAPTERS,
  COLOURS,
  CONTACT,
  ENQUIRIES,
  FAQS,
  FOCUS,
  IMG,
  LABEL_PARTS,
  LOGO_PARTS,
  PERSONALITY,
  PRINCIPLES,
  PROMISES,
  TAGLINE,
  TOPICS,
} from "./content";
import type { Go } from "./routes";
import { Arrow, Closing, Icon, Lines, Manifesto, PageHead, PageLink, Photo, Roll, useScrollVar } from "./ui";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

function Promises() {
  return (
    <ul className="promises">
      {PROMISES.map((item, i) => (
        <li key={item.title} className="promise reveal" style={d(i * 90)}>
          <Icon name={item.icon} />
          <h3>{item.title}</h3>
          <p>{item.copy}</p>
        </li>
      ))}
    </ul>
  );
}

function Spec({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="spec reveal" style={d(200)}>
      {rows.map(([term, value]) => (
        <div key={term}>
          <dt>{term}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Mark() {
  const ref = useRef<HTMLElement>(null);
  useScrollVar(ref);
  return (
    <section className="mark" ref={ref} aria-label="Visual identity">
      <div className="mark-sticky">
        <div className="mark-disc">
          <img src={IMG.logoWhite.src} alt="Pristine Drops logo" width={IMG.logoWhite.w} height={IMG.logoWhite.h} decoding="async" />
        </div>
        <div className="mark-copy">
          <p className="mark-label">Visual identity</p>
          <h2>
            A drop. Two waves. <br />
            <em>One name.</em>
          </h2>
          <p>A single drop and flowing waves above classic serif capitals, always white on Pristine Blue.</p>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- home */

function Ticker() {
  const items = PROMISES.map((p) => p.title).concat(TAGLINE);
  const row = (hidden: boolean) => (
    <ul className="ticker-row" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item}>
          <Icon name="drop" />
          {item}
        </li>
      ))}
    </ul>
  );
  return (
    <div className="ticker" role="presentation">
      <div className="ticker-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

function StageFallback() {
  return <img className="stage-fallback" src={IMG.cutout.src} alt={IMG.cutout.alt} width={IMG.cutout.w} height={IMG.cutout.h} />;
}

export function HomePage({ go, wide, failed }: { go: Go; wide: boolean; failed: boolean }) {
  return (
    <>
      <div id="stage-zone">
        <section className="hero" data-bottle="0.5,0.55,0.64" data-bottle-m="0.5,0.43,0.44" data-at="top">
          <h1 className="sr-only">Pristine Drops — pure, fresh packaged drinking water. {TAGLINE}.</h1>
          {failed && (
            <>
              <p className="hero-word" aria-hidden="true">
                <span>Pristine</span>
              </p>
              <StageFallback />
            </>
          )}
          <div className="hero-top">
            <p className="hero-tag">Packaged drinking water</p>
            <p className="hero-tagline">{TAGLINE}</p>
          </div>
          <div className="hero-foot">
            <div className="hero-lede">
              <p className="hero-line">
                Pure. Fresh. <em>Pristine.</em>
              </p>
              <p className="hero-sub">Clean, refreshing drinking water in a bottle made to be trusted, and to look good on any table.</p>
            </div>
            {wide && !failed && (
              <p className="hero-hint" aria-hidden="true">
                <span /> Drag to turn
              </p>
            )}
            <div className="hero-actions">
              <PageLink go={go} to="products">
                Explore the product
              </PageLink>
              <PageLink go={go} to="contact" className="text-link">
                Get in touch
              </PageLink>
            </div>
          </div>
        </section>

        <section className="intro intro--stage" data-bottle="0.24,0.55,0.56" data-bottle-m="0.5,-0.7,0.4">
          <div className="intro-body">
            <p className="sec-label reveal">Introducing Pristine Drops</p>
            <Manifesto text="Pristine Drops is packaged drinking water with one promise printed on every label: goodness in every drop. Clean, fresh and refreshingly simple. Water the way it should be, in a bottle you can trust." />
            <PageLink go={go} to="about" className="text-link reveal">
              Read our story
            </PageLink>
          </div>
        </section>
      </div>

      <Ticker />

      <section className="why">
        <div className="sec-head">
          <p className="sec-label reveal">Why Pristine Drops</p>
          <Lines lines={["Four promises,", <em key="e">on every label.</em>]} />
        </div>
        <Promises />
      </section>

      <section className="showcase">
        <Photo img={IMG.splash} className="showcase-photo" />
        <div className="showcase-copy">
          <p className="sec-label reveal">The bottle</p>
          <Lines lines={["Crystal clear.", <em key="e">Unmistakably blue.</em>]} />
          <p className="body-copy reveal" style={d(120)}>
            A clear bottle, a white cap and a blue label you can spot across the room. Simple on purpose, so the water inside does the talking.
          </p>
          <Spec
            rows={[
              ["Product", "Packaged drinking water"],
              ["Tagline", TAGLINE],
              ["Label", "Pristine blue wrap with the drop logo"],
            ]}
          />
          <PageLink go={go} to="products" className="text-link reveal">
            View the product
          </PageLink>
        </div>
      </section>

      <section className="quality">
        <div className="quality-grid">
          <div className="quality-copy">
            <p className="sec-label reveal">Quality &amp; purity</p>
            <Lines lines={["Clean, fresh", <em key="e">and reliable.</em>]} />
            <p className="quality-lead reveal" style={d(120)}>
              Good water should never be a question. Our focus is simple: keep it clean, keep it fresh and keep it consistent, so every
              bottle of Pristine Drops tastes exactly as it should.
            </p>
          </div>
          <Photo img={IMG.label} className="quality-photo" caption="Every label carries the promise." />
        </div>
        <ul className="principles">
          {PRINCIPLES.map(([title, copy], i) => (
            <li key={title} className="principle reveal" style={d(i * 90)}>
              <h3>{title}</h3>
              <p>{copy}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="identity">
        <div className="identity-logo img-reveal">
          <img src={IMG.logoWhite.src} alt="Pristine Drops logo" width={IMG.logoWhite.w} height={IMG.logoWhite.h} loading="lazy" decoding="async" />
        </div>
        <div className="identity-copy">
          <p className="sec-label reveal">Brand identity</p>
          <Lines lines={["Simple", <em key="e">by design.</em>]} />
          <p className="body-copy reveal" style={d(120)}>
            A single water drop and flowing waves, paired with classic serif capitals and set white on a clear, confident blue. The same
            mark you see on every bottle.
          </p>
          <ul className="identity-chips reveal" style={d(200)}>
            <li>
              <i style={{ background: "#007FB4" }} /> Pristine Blue
            </li>
            <li>
              <i style={{ background: "#FFFFFF" }} /> Pure White
            </li>
            <li>Serif wordmark</li>
          </ul>
          <PageLink go={go} to="brand" className="text-link reveal">
            Explore the identity
          </PageLink>
        </div>
      </section>

      <section className="teaser">
        <div className="sec-head">
          <p className="sec-label reveal">From the gallery</p>
          <Lines lines={["Seen up", <em key="e">close.</em>]} />
        </div>
        <div className="teaser-grid">
          <Photo img={IMG.studio} className="teaser-a" caption="Still life · on the table" />
          <Photo img={IMG.label} className="teaser-b" caption="Detail · the label" delay={100} />
          <div className="teaser-c reveal" style={d(180)}>
            <p>Product photography and brand imagery, collected in one place.</p>
            <PageLink go={go} to="gallery" className="text-link">
              Open the gallery
            </PageLink>
          </div>
        </div>
      </section>

      <Closing
        go={go}
        label="Get in touch"
        lines={["Let’s keep", <em key="e">things flowing.</em>]}
        copy="For distribution, bulk orders, partnerships or simply to say hello, we would love to hear from you."
        primary={["contact", "Get in touch"]}
        secondary={["products", "View the product"]}
      />
    </>
  );
}

/* ---------------------------------------------------------------- about */

export function AboutPage({ go }: { go: Go }) {
  return (
    <>
      <PageHead
        label="About Pristine Drops"
        lines={["Water, kept", <em key="e">pristine.</em>]}
        lead="Pristine Drops is a packaged drinking water brand built around a simple idea: everyday water should be clean, fresh and something you never have to think twice about."
      />

      <section className="split">
        <Photo img={IMG.studio} className="split-photo" eager />
        <div className="split-copy">
          <p className="sec-label reveal">Who we are</p>
          <Lines lines={["A brand built on", <em key="e">one promise.</em>]} />
          <p className="body-copy reveal" style={d(120)}>
            We believe the best water is the one you never have to question. That belief shapes everything at Pristine Drops: the water
            inside, the bottle that holds it and the label that carries our name.
          </p>
          <p className="body-copy reveal" style={d(180)}>
            Our promise is printed on every bottle: <em>{TAGLINE.toLowerCase()}</em>. It is short on purpose. It is the standard we hold
            ourselves to, sip after sip.
          </p>
        </div>
      </section>

      <section className="philosophy">
        <p className="sec-label reveal">Our philosophy</p>
        <div className="philosophy-body">
          <Manifesto text="Water should taste like nothing and feel like everything. No noise and no shortcuts. Just clean, fresh water, presented with the same care we put into keeping it pure." />
        </div>
      </section>

      <section className="define">
        <div className="define-word reveal">
          <p className="define-term">
            pris·tine
          </p>
          <p className="define-meta">/ˈprɪs.tiːn/ · adjective</p>
        </div>
        <ol className="define-list">
          <li className="reveal" style={d(100)}>
            In its original condition; unspoiled.
          </li>
          <li className="reveal" style={d(180)}>
            Clean and fresh, as if new.
          </li>
        </ol>
        <p className="define-note reveal" style={d(260)}>
          That is the standard behind the name. Every bottle should reach you the way water is meant to be: unspoiled, clean and fresh.
        </p>
      </section>

      <section className="focus">
        <div className="sec-head">
          <p className="sec-label reveal">Our focus</p>
          <Lines lines={["Freshness, cleanliness,", <em key="e">quality.</em>]} />
        </div>
        <ul className="focus-list">
          {FOCUS.map(([title, copy], i) => (
            <li key={title} className="focus-item reveal" style={d(i * 90)}>
              <h3>{title}</h3>
              <p>{copy}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="personality">
        <div className="sec-head">
          <p className="sec-label reveal">Brand personality</p>
          <Lines lines={["How Pristine", <em key="e">feels.</em>]} />
        </div>
        <ul className="persona-list">
          {PERSONALITY.map(([word, line], i) => (
            <li key={word} className="persona reveal" style={d(i * 70)}>
              <span className="persona-word">{word}</span>
              <span className="persona-line">{line}</span>
            </li>
          ))}
        </ul>
      </section>

      <Mark />

      <Closing
        go={go}
        label="Work with us"
        lines={["Let’s make something", <em key="e">refreshing.</em>]}
        copy="Whether you want to stock Pristine Drops or simply learn more about the brand, we would be glad to talk."
        primary={["contact", "Get in touch"]}
        secondary={["brand", "See the identity"]}
      />
    </>
  );
}

/* ---------------------------------------------------------------- products */

export function ProductsPage({ go, failed }: { go: Go; failed: boolean }) {
  return (
    <>
      <div id="stage-zone">
        <section className="page-head page-head--stage" data-bottle="0.73,0.56,0.64" data-bottle-m="0.5,0.71,0.4" data-at="top">
          {failed && <StageFallback />}
          <div className="page-head-copy">
            <p className="sec-label reveal">Products</p>
            <Lines as="h1" lines={["Pristine Drops", <em key="e">drinking water.</em>]} />
            <p className="lead reveal" style={d(180)}>
              Clean, refreshing packaged drinking water in a clear bottle with the signature Pristine blue label. One product, made to one
              standard.
            </p>
            <a className="scroll-cue reveal" style={d(260)} href="#water" onClick={(e) => go(e, "products", "water")}>
              <span /> Scroll to explore
            </a>
          </div>
        </section>

        {CHAPTERS.map((c) => (
          <article
            key={c.id}
            id={c.id}
            className={c.flip ? "chapter chapter--flip" : "chapter"}
            data-bottle={c.bottle}
            data-bottle-m={c.bottleM}
          >
            <div className="chapter-copy">
              <p className="sec-label reveal">{c.label}</p>
              <Lines lines={[c.title[0], <em key="e">{c.title[1]}</em>]} />
              <p className="body-copy reveal" style={d(120)}>
                {c.copy}
              </p>
              <Spec rows={c.rows} />
            </div>
          </article>
        ))}
      </div>

      <section className="overview">
        <Photo img={IMG.splash} className="overview-photo" caption="Pristine Drops packaged drinking water" />
        <div className="overview-copy">
          <p className="sec-label reveal">The product</p>
          <Lines lines={["Goodness in", <em key="e">every drop.</em>]} />
          <p className="body-copy reveal" style={d(120)}>
            Pure, refreshing water, sealed in a clear bottle and wrapped in the blue Pristine label. Made for the desk, the table and
            everywhere in between.
          </p>
          <Spec
            rows={[
              ["Product", "Packaged drinking water"],
              ["Brand", "Pristine Drops"],
              ["Bottle", "Clear bottle with a white cap"],
              ["Label", "Pristine blue wrap with the drop logo"],
            ]}
          />
          <PageLink go={go} to="contact" className="btn reveal">
            Enquire about this product
          </PageLink>
        </div>
      </section>

      <section className="label-detail">
        <div className="sec-head">
          <p className="sec-label reveal">The label</p>
          <Lines lines={["Every detail,", <em key="e">up close.</em>]} />
        </div>
        <div className="label-grid">
          <Photo img={IMG.label} className="label-photo" />
          <ul className="parts">
            {LABEL_PARTS.map(([title, copy], i) => (
              <li key={title} className="part reveal" style={d(i * 90)}>
                <h3>{title}</h3>
                <p>{copy}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="why why--plain">
        <div className="sec-head">
          <p className="sec-label reveal">Printed on every label</p>
          <Lines lines={["Four promises,", <em key="e">one bottle.</em>]} />
        </div>
        <Promises />
      </section>

      <Closing
        go={go}
        label="Stocking Pristine Drops?"
        lines={["Bring Pristine", <em key="e">to your shelves.</em>]}
        copy="For distribution, bulk orders and partnerships, tell us a little about what you need and we will get back to you."
        primary={["contact", "Make an enquiry"]}
        secondary={["gallery", "See the gallery"]}
      />
    </>
  );
}

/* ---------------------------------------------------------------- brand */

export function BrandPage({ go }: { go: Go }) {
  return (
    <>
      <PageHead
        label="Brand identity"
        lines={["A drop, a wave,", <em key="e">a name.</em>]}
        lead="The Pristine Drops identity is built from a few clear elements: a water drop, flowing waves and a classic serif wordmark, set white on a clear, confident blue."
      />

      <section className="brand-logo">
        <Photo img={IMG.logo} className="brand-logo-photo" caption="Primary logo · white on Pristine Blue" eager />
        <div className="brand-logo-copy">
          <p className="sec-label reveal">The logo</p>
          <Lines lines={["The primary", <em key="e">lockup.</em>]} />
          <p className="body-copy reveal" style={d(120)}>
            The logo stacks the mark above the wordmark. It appears white on Pristine Blue, exactly as it does on the bottle.
          </p>
          <ul className="parts parts--compact">
            {LOGO_PARTS.map(([title, copy], i) => (
              <li key={title} className="part reveal" style={d(160 + i * 80)}>
                <h3>{title}</h3>
                <p>{copy}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="colours">
        <div className="sec-head">
          <p className="sec-label reveal">Colour</p>
          <Lines lines={["Clear blue,", <em key="e">pure white.</em>]} />
        </div>
        <ul className="swatches">
          {COLOURS.map((colour, i) => (
            <li
              key={colour.name}
              className={`swatch-card reveal${colour.dark ? " is-dark" : ""}`}
              style={{ ...d(i * 90), background: colour.hex }}
            >
              <span className="swatch-role">{colour.role}</span>
              <span className="swatch-name">{colour.name}</span>
              <span className="swatch-hex">{colour.hex}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="type">
        <div className="sec-head">
          <p className="sec-label reveal">Typography</p>
          <Lines lines={["Classic, calm", <em key="e">and clear.</em>]} />
        </div>
        <div className="type-grid">
          <article className="type-card type-card--mark reveal">
            <span className="type-role">Wordmark</span>
            <img src={IMG.logoWhite.src} alt="Pristine Drops wordmark" width={IMG.logoWhite.w} height={IMG.logoWhite.h} loading="lazy" decoding="async" />
            <p>Classic serif capitals, drawn as part of the logo artwork. Always use the supplied file and never retype it.</p>
          </article>
          <article className="type-card reveal" style={d(90)}>
            <span className="type-role">Display · website</span>
            <span className="type-sample type-sample--serif">Aa</span>
            <p className="type-name">Instrument Serif</p>
            <p>For headlines and large statements. Light, elegant and calm.</p>
          </article>
          <article className="type-card reveal" style={d(180)}>
            <span className="type-role">Text · website</span>
            <span className="type-sample type-sample--sans">Aa</span>
            <p className="type-name">Instrument Sans</p>
            <p>For body copy, navigation and details. Clean and easy to read.</p>
          </article>
        </div>
      </section>

      <section className="application">
        <div className="sec-head">
          <p className="sec-label reveal">Application</p>
          <Lines lines={["On the", <em key="e">bottle.</em>]} />
        </div>
        <div className="application-grid">
          <Photo img={IMG.splash} className="app-photo app-photo--a" caption="The logo on the label, in motion" />
          <div className="application-copy">
            <p className="body-copy reveal">
              On the bottle, the logo sits white at the centre of a blue wrap, with the tagline <em>“{TAGLINE}”</em> beside it. The same
              lockup and the same colour, wherever the brand appears.
            </p>
            <Photo img={IMG.studio} className="app-photo app-photo--b" caption="The label in a still life" delay={120} />
          </div>
        </div>
      </section>

      <section className="usage">
        <div className="sec-head">
          <p className="sec-label reveal">Using the logo</p>
          <Lines lines={["Keep it", <em key="e">pristine.</em>]} />
        </div>
        <div className="usage-grid">
          <div className="usage-col reveal">
            <h3>Do</h3>
            <ul>
              <li>Use the supplied logo files.</li>
              <li>Keep the logo white on Pristine Blue or on a clean, dark background.</li>
              <li>Give the logo generous space around it.</li>
            </ul>
          </div>
          <div className="usage-col usage-col--dont reveal" style={d(100)}>
            <h3>Don’t</h3>
            <ul>
              <li>Stretch, squash or rotate the logo.</li>
              <li>Change its colours or add shadows and effects.</li>
              <li>Retype the wordmark in another font.</li>
            </ul>
          </div>
        </div>
      </section>

      <Closing
        go={go}
        label="Brand assets"
        lines={["Need the", <em key="e">brand files?</em>]}
        copy="For logo files, product images or brand guidance, get in touch and we will share what you need."
        primary={["contact", "Request assets"]}
        secondary={["gallery", "View the gallery"]}
      />
    </>
  );
}

/* ---------------------------------------------------------------- gallery */

export function GalleryPage({ go }: { go: Go }) {
  return (
    <>
      <PageHead
        label="Gallery"
        lines={["The bottle,", <em key="e">up close.</em>]}
        lead="Product photography and brand imagery from Pristine Drops."
      />

      <section className="gallery">
        <div className="g-row g-row--a">
          <Photo img={IMG.splash} className="g-a1" caption="In motion · the bottle in a splash" eager />
          <Photo img={IMG.studio} className="g-a2" caption="Still life · on the table" delay={120} />
        </div>

        <blockquote className="g-quote">
          <Lines as="p" lines={["Goodness", <em key="e">in every drop.</em>]} />
        </blockquote>

        <div className="g-row g-row--b">
          <Photo img={IMG.label} className="g-b1" caption="Detail · the label up close" />
          <Photo img={IMG.logo} className="g-b2" caption="Identity · the primary logo" delay={120} />
        </div>
      </section>

      <section className="studies">
        <div className="sec-head">
          <p className="sec-label reveal">Colour studies</p>
          <Lines lines={["One bottle,", <em key="e">three moods.</em>]} />
        </div>
        <ul className="study-list">
          {[
            ["study--blue", "On Pristine Blue"],
            ["study--paper", "On pure white"],
            ["study--ink", "On deep ink"],
          ].map(([mod, caption], i) => (
            <li key={mod} className={`study ${mod} reveal`} style={d(i * 110)}>
              <img src={IMG.cutout.src} alt={`${IMG.cutout.alt}, ${caption.toLowerCase()}`} width={IMG.cutout.w} height={IMG.cutout.h} loading="lazy" decoding="async" />
              <span>{caption}</span>
            </li>
          ))}
        </ul>
      </section>

      <Closing
        go={go}
        label="Press & media"
        lines={["Want to feature", <em key="e">Pristine Drops?</em>]}
        copy="For product images and brand assets, send us a note and tell us about your project."
        primary={["contact", "Contact us"]}
        secondary={["products", "View the product"]}
      />
    </>
  );
}

/* ---------------------------------------------------------------- contact */

export function ContactPage({ go }: { go: Go }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [topic, setTopic] = useState(TOPICS[0]);
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError("Please add your name and a valid email.");
      setSent(false);
      return;
    }
    setFormError("");
    setSent(true);
    formRef.current?.reset();
    setTopic(TOPICS[0]);
  }

  const details = [
    ["Email", CONTACT.email ? <a className="mail" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> : null],
    ["Phone", CONTACT.phone ? <a className="ul" href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}>{CONTACT.phone}</a> : null],
    ["Address", CONTACT.location || null],
    [
      "Social",
      CONTACT.socials.length ? (
        <span className="socials">
          {CONTACT.socials.map((s) => (
            <a key={s.label} className="ul" href={s.href} target="_blank" rel="noreferrer">
              {s.label}
            </a>
          ))}
        </span>
      ) : null,
    ],
  ] as const;

  return (
    <>
      <PageHead
        label="Contact"
        lines={["Let’s connect.", <em key="e">Drop us a line.</em>]}
        lead="Distribution, bulk orders, partnerships or simply a hello. Send us a message and we will get back to you."
        aside={<Photo img={IMG.duo} className="page-head-photo" eager />}
      />

      <section className="enquiries">
        <p className="sec-label reveal">How can we help?</p>
        <ul className="enquiry-list">
          {ENQUIRIES.map(([title, copy], i) => (
            <li key={title} className="reveal" style={d(i * 80)}>
              <button
                type="button"
                className={topic === title ? "enquiry is-active" : "enquiry"}
                onClick={() => {
                  setTopic(title);
                  go(null, "contact", "form");
                }}
              >
                <span className="enquiry-title">{title}</span>
                <span className="enquiry-copy">{copy}</span>
                <span className="enquiry-cta">
                  Choose <Arrow />
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="contact">
        <div className="contact-grid">
          <aside className="contact-info reveal">
            <dl>
              {details
                .filter(([, value]) => value)
                .map(([term, value]) => (
                  <div key={term}>
                    <dt>{term}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
            </dl>
          </aside>

          <form
            id="form"
            ref={formRef}
            className="form reveal"
            style={d(120)}
            onSubmit={submit}
            onInput={() => formError && setFormError("")}
            noValidate
          >
            <label className="field">
              <span>Name</span>
              <input name="name" type="text" autoComplete="name" placeholder="Your name" />
            </label>
            <label className="field">
              <span>Email</span>
              <input name="email" type="email" autoComplete="email" placeholder="you@company.com" />
            </label>
            <fieldset className="full topics">
              <legend>I’m interested in</legend>
              {TOPICS.map((item) => (
                <label key={item} className="topic">
                  <input type="radio" name="topic" value={item} checked={topic === item} onChange={() => setTopic(item)} />
                  <span>{item}</span>
                </label>
              ))}
            </fieldset>
            <label className="field full">
              <span>Message</span>
              <textarea name="message" rows={5} placeholder="Tell us a little about what you need" />
            </label>
            <div className="full form-foot">
              <button className="btn" type="submit">
                <Roll>Send message</Roll>
                <span className="sr-only">Send message</span>
                <Arrow />
              </button>
              <p className={formError ? "note err" : sent ? "note ok" : "note"} role="status">
                {formError || (sent ? "Thank you. Your message is in, we’ll be in touch soon." : "")}
              </p>
            </div>
          </form>
        </div>
      </section>

      <section className="faq">
        <div className="sec-head">
          <p className="sec-label reveal">Questions</p>
          <Lines lines={["Good to", <em key="e">know.</em>]} />
        </div>
        <div className="faq-list">
          {FAQS.map(([q, a], i) => (
            <details key={q} className="faq-item reveal" style={d(i * 70)}>
              <summary>
                <span>{q}</span>
                <i aria-hidden="true" />
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
