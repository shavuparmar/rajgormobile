import { useState, useEffect, useRef, useCallback } from "react";


function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const h = () => setY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return y;
}

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVis(true);
      },
      { threshold },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, vis];
}

/* ══════════════════════════════════════════════════════════
   SMOOTH SCROLL HELPER
══════════════════════════════════════════════════════════ */
function scrollTo(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 64;
  window.scrollTo({ top, behavior: "smooth" });
}

/* ══════════════════════════════════════════════════════════
   3-D PHONE  (transform values must stay inline)
══════════════════════════════════════════════════════════ */
function Phone3D({ scrollY = 0 }) {
  const rotY = (scrollY / 8) % 360;
  const rotX = Math.sin(scrollY / 300) * 12;
  return (
    <div
      style={{
        perspective: 900,
        width: 200,
        height: 400,
        margin: "0 auto",
        filter: "drop-shadow(0 40px 60px rgba(0,200,255,.28))",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transform: `rotateY(${rotY}deg) rotateX(${rotX}deg)`,
          transition: "transform .05s linear",
          position: "relative",
        }}
      >
        {/* back face */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg,#1a1a2e,#0d0d1a)",
            borderRadius: 30,
            backfaceVisibility: "hidden",
            transform: "translateZ(-11px)",
            border: "1px solid rgba(255,255,255,.07)",
          }}
        />

        {/* front face */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(160deg,#1e1e3f,#0a0a18)",
            borderRadius: 30,
            backfaceVisibility: "hidden",
            transform: "translateZ(11px)",
            overflow: "hidden",
            border: "1.5px solid rgba(0,220,255,.32)",
            boxShadow: "inset 0 0 40px rgba(0,200,255,.08)",
          }}
        >
          {/* screen */}
          <div
            style={{
              position: "absolute",
              top: 16,
              left: 12,
              right: 12,
              bottom: 16,
              background: "linear-gradient(180deg,#000918,#001428)",
              borderRadius: 22,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 7,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "space-between",
                padding: "0 14px",
                fontSize: 8,
                color: "rgba(255,255,255,.45)",
              }}
            >
              <span>9:41</span>
              <span>●●● ▲</span>
            </div>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: 56,
                height: 18,
                background: "#0a0a18",
                borderRadius: "0 0 10px 10px",
              }}
            />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 9,
                padding: "30px 9px 9px",
                width: "100%",
              }}
            >
              {["📱", "🔧", "🔋", "💻", "🎧", "📷", "🔌", "⚡"].map((ic, i) => (
                <div
                  key={i}
                  style={{
                    background: "rgba(0,200,255,.1)",
                    borderRadius: 10,
                    padding: 5,
                    textAlign: "center",
                    fontSize: 14,
                    border: "1px solid rgba(0,200,255,.15)",
                  }}
                >
                  {ic}
                </div>
              ))}
            </div>
            <div
              style={{
                position: "absolute",
                bottom: 16,
                left: "50%",
                transform: "translateX(-50%)",
                width: 36,
                height: 3,
                background: "rgba(0,200,255,.65)",
                borderRadius: 2,
                boxShadow: "0 0 10px rgba(0,200,255,.9)",
              }}
            />
          </div>
          {/* camera */}
          <div
            style={{
              position: "absolute",
              top: 7,
              right: 16,
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "radial-gradient(circle,#222 30%,#111 100%)",
              border: "2px solid rgba(255,255,255,.14)",
            }}
          />
        </div>

        {/* left side */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: 0,
            width: 11,
            height: "80%",
            background: "linear-gradient(90deg,#080818,#1a1a3a)",
            transform: "rotateY(-90deg) translateZ(11px)",
            backfaceVisibility: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "22%",
              left: 2,
              width: 5,
              height: 36,
              background: "#2a2a2a",
              borderRadius: 3,
            }}
          />
        </div>

        {/* right side */}
        <div
          style={{
            position: "absolute",
            top: "16%",
            right: 0,
            width: 11,
            height: "28%",
            background: "linear-gradient(90deg,#1a1a3a,#080818)",
            transform: "rotateY(90deg) translateZ(11px)",
            backfaceVisibility: "hidden",
          }}
        />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PARTICLES
══════════════════════════════════════════════════════════ */
function Particles() {
  const pts = useRef(
    Array.from({ length: 16 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      s: Math.random() * 3.5 + 1,
      d: Math.random() * 8 + 5,
      dl: Math.random() * 5,
    })),
  ).current;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pts.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.s,
            height: p.s,
            borderRadius: "50%",
            background: "rgba(0,200,255,.55)",
            boxShadow: `0 0 ${p.s * 3}px rgba(0,200,255,.45)`,
            animation: `rmFloat ${p.d}s ${p.dl}s infinite ease-in-out`,
          }}
        />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION HEADING
══════════════════════════════════════════════════════════ */
function SectionHead({ label, title, sub }) {
  const [ref, vis] = useInView();
  return (
    <div ref={ref} className="text-center mb-14">
      <span
        className={`inline-block px-4 py-1 rounded-full border border-cyan-500/30
        bg-cyan-500/10 text-cyan-400 text-[10px] font-bold tracking-[3px] uppercase mb-4
        transition-all duration-500
        ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        {label}
      </span>
      <h2
        className={`rm-display text-4xl md:text-5xl font-black text-white mb-3 leading-tight
        transition-all duration-500 delay-100
        ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
      >
        {title}
      </h2>
      {sub && (
        <p
          className={`text-sky-200/50 text-sm md:text-base max-w-xl mx-auto leading-relaxed
          transition-all duration-500 delay-200
          ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SERVICE CARD
══════════════════════════════════════════════════════════ */
function ServiceCard({ icon, title, desc, delay = 0 }) {
  const [ref, vis] = useInView();
  return (
    <div
      ref={ref}
      className="group p-7 rounded-2xl border border-white/[.05] bg-white/[.025]
        hover:border-cyan-400/40 hover:bg-gradient-to-br hover:from-cyan-500/10 hover:to-blue-700/5
        backdrop-blur-sm hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,200,255,.14)]
        cursor-default transition-all duration-300"
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(36px)",
        transition: `all .5s ease ${delay}ms`,
      }}
    >
      <div
        className="text-4xl mb-4 group-hover:drop-shadow-[0_0_14px_rgba(0,200,255,.55)]
        transition-all duration-300"
      >
        {icon}
      </div>
      <h3 className="rm-display text-lg font-bold text-sky-50 mb-2 tracking-wide">
        {title}
      </h3>
      <p className="text-sky-200/50 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   STAT BOX
══════════════════════════════════════════════════════════ */
function StatBox({ num, label, delay = 0 }) {
  const [ref, vis] = useInView();
  return (
    <div
      ref={ref}
      className="text-center"
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : "translateY(28px)",
        transition: `all .6s ease ${delay}ms`,
      }}
    >
      <div
        className="rm-display text-5xl md:text-6xl font-black text-cyan-400
        drop-shadow-[0_0_20px_rgba(0,200,255,.55)] leading-none"
      >
        {num}
      </div>
      <div className="text-sky-200/40 text-xs mt-2 tracking-widest uppercase">
        {label}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   TESTIMONIAL CARD
══════════════════════════════════════════════════════════ */
function TestiCard({ name, text, stars, city, delay = 0 }) {
  const [ref, vis] = useInView();
  return (
    <div
      ref={ref}
      className="p-6 rounded-2xl border border-cyan-500/10 bg-cyan-500/[.03] backdrop-blur-sm"
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : "translateX(-28px)",
        transition: `all .6s ease ${delay}ms`,
      }}
    >
      <div className="text-yellow-400 text-sm mb-3">{"★".repeat(stars)}</div>
      <p className="text-sky-200/65 text-sm leading-relaxed italic mb-4">
        "{text}"
      </p>
      <div>
        <span className="rm-display font-bold text-cyan-400">{name}</span>
        <span className="text-white/30 text-xs ml-2">{city}</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════════════ */
export default function RajgorMobile() {
  const scrollY = useScrollY();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState("home");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
    msg: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [focusField, setFocusField] = useState(null);

  const sectionIds = ["home", "services", "products", "about", "contact"];
  const navScrolled = scrollY > 40;
  const heroOpacity = Math.max(0, 1 - scrollY / 520);
  const heroScale = Math.max(0.88, 1 - scrollY / 3000);

  /* ── track active section while scrolling ── */
  useEffect(() => {
    const handler = () => {
      for (const id of [...sectionIds].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 80) {
          setActiveId(id);
          return;
        }
      }
      setActiveId("home");
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const handleSubmit = () => {
    if (formData.name.trim() && formData.phone.trim()) setSubmitted(true);
  };

  const inputCls = (key) =>
    `w-full bg-white/[.04] border rounded-xl px-4 py-3 text-white text-sm outline-none
     transition-colors duration-200 placeholder:text-white/25
     ${focusField === key ? "border-cyan-400/55" : "border-cyan-400/15"}`;

  /* ── nav items ── */
  const NAV = [
    { label: "Home", id: "home" },
    { label: "Services", id: "services" },
    { label: "Products", id: "products" },
    { label: "About", id: "about" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <div className="bg-[#04060f] text-white min-h-screen overflow-x-hidden rm-body">
      {/* ── global styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700;800&family=Nunito:wght@400;600;700&display=swap');
        .rm-body   { font-family: 'Nunito', sans-serif; }
        .rm-display{ font-family: 'Rajdhani', sans-serif; }

        ::-webkit-scrollbar       { width: 4px; }
        ::-webkit-scrollbar-track { background: #04060f; }
        ::-webkit-scrollbar-thumb { background: #00c8ff; border-radius: 2px; }

        @keyframes rmFloat {
          0%,100% { transform:translateY(0) scale(1);    opacity:.45 }
          50%      { transform:translateY(-22px) scale(1.1); opacity:1  }
        }
        @keyframes rmPulse {
          0%,100% { box-shadow:0 0 0 0   rgba(0,200,255,.45) }
          50%      { box-shadow:0 0 0 14px rgba(0,200,255,0)  }
        }
        @keyframes rmSpin { to { transform:rotate(360deg) } }
        @keyframes rmShimmer {
          0%   { background-position:-200% center }
          100% { background-position: 200% center }
        }
        @keyframes rmB1 { 0%,100%{transform:translateY(0)}   50%{transform:translateY(-10px)} }
        @keyframes rmB2 { 0%,100%{transform:translateY(0)}   50%{transform:translateY(-13px)} }

        .rm-shimmer {
          background: linear-gradient(90deg,#00c8ff,#fff,#00c8ff);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: rmShimmer 3.2s linear infinite;
        }
        .rm-pulse { animation: rmPulse 2.6s infinite; }
        .rm-spin  { animation: rmSpin  20s linear infinite; }
        .rm-b1    { animation: rmB1 4s ease-in-out infinite; }
        .rm-b2    { animation: rmB2 5s 1.5s ease-in-out infinite; }

        select option { background: #0a0a18; color: #fff; }
      `}</style>

      {/* ╔══════════════════════════════╗
          ║  NAVBAR                      ║
          ╚══════════════════════════════╝ */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 h-16 flex items-center justify-between px-6
        transition-all duration-300
        ${navScrolled ? "bg-[#04060f]/90 backdrop-blur-xl border-b border-cyan-500/[.07]" : ""}`}
      >
        {/* logo */}
        <button
          onClick={() => scrollTo("home")}
          className="flex items-center gap-2.5 bg-transparent border-none outline-none cursor-pointer"
        >
          <div
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-700
            flex items-center justify-center text-lg rm-pulse shadow-[0_0_16px_rgba(0,200,255,.4)]"
          >
            📱
          </div>
          <span className="rm-display text-xl font-black rm-shimmer">
            RAJGOR MOBILE
          </span>
        </button>

        {/* desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => scrollTo(n.id)}
              className={`text-sm font-semibold tracking-wide transition-colors duration-200
                bg-transparent border-none outline-none cursor-pointer
                ${activeId === n.id ? "text-cyan-400" : "text-sky-200/55 hover:text-cyan-300"}`}
            >
              {n.label}
            </button>
          ))}
          <button
            onClick={() => scrollTo("contact")}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600
              text-white text-sm font-bold tracking-wide rm-display
              shadow-[0_4px_20px_rgba(0,200,255,.3)]
              hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,200,255,.45)]
              transition-all duration-300 cursor-pointer border-none outline-none"
          >
            Book Repair
          </button>
        </div>

        {/* hamburger */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="md:hidden flex flex-col gap-1.5 p-1 bg-transparent border-none outline-none cursor-pointer"
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-5 h-0.5 bg-cyan-400 rounded transition-all duration-300"
              style={{
                transform: menuOpen
                  ? i === 0
                    ? "rotate(45deg) translate(5px,5px)"
                    : i === 1
                      ? "scaleX(0)"
                      : "rotate(-45deg) translate(5px,-5px)"
                  : "none",
              }}
            />
          ))}
        </button>
      </nav>

      {/* mobile drawer */}
      <div
        className={`fixed top-16 inset-x-0 z-40 bg-[#04060f]/96 backdrop-blur-xl
        border-b border-cyan-500/10 flex flex-col px-6 py-4 gap-0.5
        transition-all duration-300 md:hidden
        ${menuOpen ? "opacity-100 pointer-events-auto translate-y-0" : "opacity-0 pointer-events-none -translate-y-2"}`}
      >
        {NAV.map((n) => (
          <button
            key={n.id}
            onClick={() => {
              scrollTo(n.id);
              closeMenu();
            }}
            className={`text-left py-3 border-b border-white/[.04] text-sm font-semibold
              tracking-wide transition-colors bg-transparent border-x-0 border-t-0 outline-none cursor-pointer
              ${activeId === n.id ? "text-cyan-400" : "text-sky-200/55 hover:text-cyan-300"}`}
          >
            {n.label}
          </button>
        ))}
        <button
          onClick={() => {
            scrollTo("contact");
            closeMenu();
          }}
          className="mt-3 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600
            text-white font-bold text-sm tracking-wide rm-display cursor-pointer border-none outline-none"
        >
          Book Repair Now
        </button>
      </div>

      {/* ╔══════════════════════════════╗
          ║  HERO                        ║
          ╚══════════════════════════════╝ */}
      <section
        id="home"
        className="relative min-h-screen flex items-center px-6 pt-24 pb-16 overflow-hidden"
      >
        {/* bg grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,200,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,200,255,.04) 1px,transparent 1px)",
            backgroundSize: "50px 50px",
            opacity: Math.max(0, 1 - scrollY / 420),
          }}
        />
        {/* glows */}
        <div
          className="absolute top-1/4 left-[62%] w-[560px] h-[560px] -translate-x-1/2 -translate-y-1/2
          bg-blue-600/18 rounded-full blur-3xl pointer-events-none"
        />
        <div
          className="absolute bottom-1/3 left-[18%] w-80 h-80
          bg-cyan-400/10 rounded-full blur-3xl pointer-events-none"
        />
        <Particles />

        <div
          className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-14 items-center"
          style={{
            opacity: heroOpacity,
            transform: `scale(${heroScale})`,
            transition: "transform .05s linear",
          }}
        >
          {/* left */}
          <div>
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
              border border-cyan-500/25 bg-cyan-500/[.08]
              text-cyan-400 text-[10px] font-bold tracking-[3px] uppercase mb-6"
            >
              <span
                className="w-1.5 h-1.5 rounded-full bg-emerald-400
                shadow-[0_0_6px_rgba(0,255,136,.7)] rm-pulse"
              />
              Surat's #1 Mobile Expert
            </div>

            <h1 className="rm-display text-5xl md:text-[4.2rem] font-black leading-[1.04] mb-5">
              <span className="text-white">Your Phone,</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Repaired
              </span>{" "}
              <span className="text-white">Right.</span>
            </h1>

            <p className="text-sky-200/58 text-base md:text-lg leading-relaxed max-w-lg mb-8">
              Expert mobile repair, genuine accessories, and certified
              second-hand smartphones — all under one roof. Trusted by{" "}
              <strong className="text-cyan-400">10,000+</strong> customers
              across Surat.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => scrollTo("contact")}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600
                  text-white font-bold text-sm tracking-wide rm-display
                  shadow-[0_4px_22px_rgba(0,200,255,.38)]
                  hover:-translate-y-0.5 hover:shadow-[0_8px_34px_rgba(0,200,255,.52)]
                  transition-all duration-300 cursor-pointer border-none outline-none"
              >
                Book a Repair ↗
              </button>
              {/* <button
                onClick={() => scrollTo("products")}
                className="px-7 py-3.5 rounded-xl border border-cyan-400/35 text-cyan-400
                  font-bold text-sm tracking-wide rm-display
                  hover:bg-cyan-500/[.08] hover:border-cyan-400
                  transition-all duration-300 cursor-pointer bg-transparent outline-none"
              >
                Our Products
              </button> */}
            </div>

            {/* mini stats */}
            <div className="flex gap-8 mt-10 pt-8 border-t border-white/[.06]">
              {[
                ["10K+", "Happy Customers"],
                ["30min", "Avg Repair"],
                ["1 Yr", "Warranty"],
              ].map(([n, l]) => (
                <div key={l}>
                  <div
                    className="rm-display text-3xl font-black text-cyan-400
                    drop-shadow-[0_0_16px_rgba(0,200,255,.42)] leading-none"
                  >
                    {n}
                  </div>
                  <div className="text-sky-200/38 text-xs mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* right – 3D phone */}
          <div className="relative flex items-center justify-center">
            <div
              className="absolute w-72 h-72 border border-dashed border-cyan-400/14
              rounded-full rm-spin pointer-events-none"
            >
              {[0, 60, 120, 180, 240, 300].map((deg) => (
                <div
                  key={deg}
                  className="absolute w-2.5 h-2.5 rounded-full
                  bg-cyan-400/60 shadow-[0_0_8px_rgba(0,200,255,.65)]"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: `rotate(${deg}deg) translateX(144px) translate(-50%,-50%)`,
                  }}
                />
              ))}
            </div>
            <Phone3D scrollY={scrollY} />
            <div
              className="rm-b1 absolute top-[8%] right-0 px-3 py-2 rounded-xl
              border border-cyan-400/24 bg-cyan-500/10 backdrop-blur-md
              text-cyan-300 text-[11px] font-bold whitespace-nowrap"
            >
              ✓ 100% Genuine Parts
            </div>
            <div
              className="rm-b2 absolute bottom-[18%] -left-2 px-3 py-2 rounded-xl
              border border-orange-400/22 bg-orange-500/[.07] backdrop-blur-md
              text-orange-300 text-[11px] font-bold whitespace-nowrap"
            >
              ⚡ Same-Day Service
            </div>
          </div>
        </div>

        {/* scroll cue */}
        <div
          className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
          style={{ opacity: Math.max(0, 1 - scrollY / 160) }}
        >
          <span className="text-[9px] tracking-[3px] text-white/22 uppercase">
            Scroll
          </span>
          <div className="w-px h-7 bg-gradient-to-b from-cyan-400 to-transparent" />
        </div>
      </section>

      {/* ╔══════════════════════════════╗
          ║  STATS BAND                  ║
          ╚══════════════════════════════╝ */}
      <div
        className="bg-gradient-to-r from-blue-700/[.07] via-cyan-400/[.07] to-blue-700/[.07]
        border-y border-cyan-500/[.07] py-12 px-6"
      >
        <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatBox num="10K+" label="Customers Served" delay={0} />
          <StatBox num="500+" label="Models Repaired" delay={100} />
          <StatBox num="12+" label="Years in Business" delay={200} />
          <StatBox num="4.9★" label="Customer Rating" delay={300} />
        </div>
      </div>

      {/* ╔══════════════════════════════╗
          ║  SERVICES                    ║
          ╚══════════════════════════════╝ */}
      <section id="services" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHead
            label="Our Services"
            title="Everything Your Phone Needs"
            sub="From cracked screens to battery replacements — we handle it all with care and speed."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: "🔧",
                title: "Screen Replacement",
                desc: "Original display units for all major brands. Crystal-clear quality guaranteed.",
              },
              {
                icon: "🔋",
                title: "Battery Replacement",
                desc: "Restore your phone's stamina with genuine high-capacity batteries.",
              },
              {
                icon: "💧",
                title: "Water Damage Repair",
                desc: "Advanced ultrasonic cleaning and micro-soldering for water-damaged devices.",
              },
              {
                icon: "📡",
                title: "Network & Signal Fix",
                desc: "IMEI repair, signal booster, network IC replacements — we cover it all.",
              },
              {
                icon: "🎙",
                title: "Mic & Speaker Fix",
                desc: "Crystal-clear calls again. Speaker, earpiece, and mic replacements.",
              },
              {
                icon: "🔌",
                title: "Charging Port Repair",
                desc: "Bent pin? Loose connector? We'll have you charging at full speed again.",
              },
            ].map((s, i) => (
              <ServiceCard key={i} {...s} delay={i * 80} />
            ))}
          </div>
        </div>
      </section>

      {/* ╔══════════════════════════════╗
          ║  WHAT WE SELL                ║
          ╚══════════════════════════════╝ */}
      <section
        id="products"
        className="py-24 px-6 bg-gradient-to-b from-transparent via-blue-950/20 to-transparent"
      >
        <div className="max-w-5xl mx-auto">
          <SectionHead
            label="What We Sell"
            title="More Than Just Repairs"
            sub="Certified pre-owned smartphones and premium accessories — all under one roof."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* phones */}
            {(() => {
              const [ref, vis] = useInView();
              return (
                <div
                  ref={ref}
                  className="p-9 rounded-3xl border border-cyan-500/[.18]
                    bg-gradient-to-br from-blue-600/10 to-cyan-500/[.05] backdrop-blur-md"
                  style={{
                    opacity: vis ? 1 : 0,
                    transform: vis ? "translateY(0)" : "translateY(36px)",
                    transition: "all .6s ease",
                  }}
                >
                  <div className="text-5xl mb-5 drop-shadow-[0_0_18px_rgba(0,200,255,.4)]">
                    📱
                  </div>
                  <span
                    className="inline-block px-3 py-0.5 rounded-full border border-cyan-400/25
                    bg-cyan-500/10 text-cyan-400 text-[9px] font-bold tracking-[3px] uppercase mb-3"
                  >
                    Second-Hand Phones
                  </span>
                  <h3 className="rm-display text-2xl font-black text-white mb-3 leading-snug">
                    Certified Pre-Owned Smartphones
                  </h3>
                  <p className="text-sky-200/55 text-sm leading-relaxed mb-5">
                    We sell thoroughly tested, cleaned, and quality-checked
                    second-hand smartphones at the best prices in Surat. Every
                    phone goes through a{" "}
                    <strong className="text-cyan-400">
                      50-point inspection
                    </strong>{" "}
                    before hitting our shelf.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {[
                      "Apple iPhone",
                      "Samsung Galaxy",
                      "OnePlus",
                      "Redmi / Xiaomi",
                      "Realme",
                      "Poco",
                      "Vivo",
                      "Oppo",
                    ].map((b) => (
                      <span
                        key={b}
                        className="px-3 py-1 rounded-full border border-cyan-400/14
                        bg-cyan-500/[.06] text-sky-200/62 text-xs"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                  <div className="pt-5 border-t border-cyan-400/10 flex flex-wrap gap-5">
                    {[
                      ["✅", "6-Month Warranty"],
                      ["🔍", "50-Point Checked"],
                      ["💳", "EMI Available"],
                    ].map(([ic, t]) => (
                      <div
                        key={t}
                        className="flex items-center gap-1.5 text-sky-200/45 text-xs"
                      >
                        <span>{ic}</span>
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* accessories */}
            {(() => {
              const [ref, vis] = useInView();
              return (
                <div
                  ref={ref}
                  className="p-9 rounded-3xl border border-orange-400/[.18]
                    bg-gradient-to-br from-orange-500/[.08] to-red-500/[.04] backdrop-blur-md"
                  style={{
                    opacity: vis ? 1 : 0,
                    transform: vis ? "translateY(0)" : "translateY(36px)",
                    transition: "all .6s ease .15s",
                  }}
                >
                  <div className="text-5xl mb-5 drop-shadow-[0_0_18px_rgba(255,140,0,.38)]">
                    🎧
                  </div>
                  <span
                    className="inline-block px-3 py-0.5 rounded-full border border-orange-400/25
                    bg-orange-400/10 text-orange-300 text-[9px] font-bold tracking-[3px] uppercase mb-3"
                  >
                    Accessories
                  </span>
                  <h3 className="rm-display text-2xl font-black text-white mb-3 leading-snug">
                    Premium Mobile Accessories
                  </h3>
                  <p className="text-sky-200/55 text-sm leading-relaxed mb-5">
                    From fast chargers to screen guards, we carry a wide range
                    of{" "}
                    <strong className="text-orange-300">
                      genuine and branded accessories
                    </strong>{" "}
                    to protect, power, and personalise your device.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {[
                      "Earbuds & Headphones",
                      "Chargers & Cables",
                      "Tempered Glass",
                      "Back Covers",
                      "Power Banks",
                      "Car Mounts",
                      "Bluetooth Speakers",
                      "Gaming Triggers",
                    ].map((b) => (
                      <span
                        key={b}
                        className="px-3 py-1 rounded-full border border-orange-400/14
                        bg-orange-400/[.06] text-sky-200/62 text-xs"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                  <div className="pt-5 border-t border-orange-400/10 flex flex-wrap gap-5">
                    {[
                      ["✅", "100% Genuine"],
                      ["🏷", "Best Prices"],
                      ["🚚", "Home Delivery"],
                    ].map(([ic, t]) => (
                      <div
                        key={t}
                        className="flex items-center gap-1.5 text-sky-200/45 text-xs"
                      >
                        <span>{ic}</span>
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* visit CTA */}
          {(() => {
            const [ref, vis] = useInView();
            return (
              <div
                ref={ref}
                className="p-7 rounded-2xl border border-cyan-500/12
                  bg-gradient-to-r from-cyan-500/[.06] via-blue-700/10 to-cyan-500/[.06]
                  flex flex-wrap items-center justify-between gap-4"
                style={{
                  opacity: vis ? 1 : 0,
                  transform: vis ? "none" : "translateY(20px)",
                  transition: "all .6s ease .3s",
                }}
              >
                <div>
                  <p className="rm-display text-xl font-black text-white mb-1">
                    Want to see what's available right now?
                  </p>
                  <p className="text-sky-200/42 text-sm">
                    Visit our store — stock changes daily. Call us or walk in!
                  </p>
                </div>
                <div className="flex gap-3">
                  <a
                    href="tel:+919638194151"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600
                      text-white font-bold text-sm tracking-wide rm-display
                      shadow-[0_4px_20px_rgba(0,200,255,.3)]
                      hover:-translate-y-0.5 transition-all duration-300 inline-block"
                  >
                    📞 Call Now
                  </a>
                  <button
                    onClick={() => scrollTo("contact")}
                    className="px-5 py-2.5 rounded-xl border border-cyan-400/35 text-cyan-400
                      font-bold text-sm tracking-wide rm-display
                      hover:bg-cyan-500/[.08] hover:border-cyan-400
                      transition-all duration-300 cursor-pointer bg-transparent outline-none"
                  >
                    📍 Directions
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ╔══════════════════════════════╗
          ║  WHY US                      ║
          ╚══════════════════════════════╝ */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <SectionHead
            label="Why Rajgor Mobile"
            title="The Rajgor Difference"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: "🏆",
                title: "12+ Years of Trust",
                desc: "Over a decade serving Surat with honest, expert mobile care.",
              },
              {
                icon: "✅",
                title: "Certified Technicians",
                desc: "All repairs done by factory-trained, certified engineers.",
              },
              {
                icon: "🔒",
                title: "Genuine Parts Only",
                desc: "Only OEM or certified-grade components — no compromises.",
              },
              {
                icon: "⚡",
                title: "Express Repairs",
                desc: "Most screen & battery jobs done in 30–60 minutes.",
              },
            ].map((w, i) => {
              const [ref, vis] = useInView();
              return (
                <div
                  key={i}
                  ref={ref}
                  className="text-center p-8 rounded-2xl border border-white/[.04] bg-white/[.018]
                    transition-all duration-500"
                  style={{
                    opacity: vis ? 1 : 0,
                    transform: vis ? "none" : "translateY(28px)",
                    transitionDelay: `${i * 100}ms`,
                  }}
                >
                  <div className="text-5xl mb-4 drop-shadow-[0_0_12px_rgba(0,200,255,.3)]">
                    {w.icon}
                  </div>
                  <h4 className="rm-display text-lg font-bold text-sky-50 mb-2">
                    {w.title}
                  </h4>
                  <p className="text-sky-200/42 text-sm leading-relaxed">
                    {w.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ╔══════════════════════════════╗
          ║  TESTIMONIALS                ║
          ╚══════════════════════════════╝ */}
      <section className="py-24 px-6 bg-gradient-to-b from-transparent via-blue-950/22 to-transparent">
        <div className="max-w-5xl mx-auto">
          <SectionHead label="Reviews" title="What Our Customers Say" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                name: "Rahul Patel",
                city: "Surat",
                stars: 5,
                text: "Got my iPhone screen replaced in 30 minutes flat. Looks brand new! These guys know what they're doing.",
                delay: 0,
              },
              {
                name: "Priya Shah",
                city: "Adajan, Surat",
                stars: 5,
                text: "Bought a refurbished Samsung from Rajgor Mobile. Working perfectly for 8 months. Great value!",
                delay: 100,
              },
              {
                name: "Amit Desai",
                city: "Vesu, Surat",
                stars: 5,
                text: "Water-damaged OnePlus — thought it was gone forever. Rajgor Mobile saved it! Highly recommend.",
                delay: 200,
              },
              {
                name: "Sneha Mehta",
                city: "Katargam, Surat",
                stars: 5,
                text: "Best mobile shop in Surat for accessories. Genuine products at fair prices. My go-to place.",
                delay: 300,
              },
            ].map((t, i) => (
              <TestiCard key={i} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* ╔══════════════════════════════╗
          ║  ABOUT                       ║
          ╚══════════════════════════════╝ */}
      <section id="about" className="py-24 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* info card */}
          <div className="relative">
            <div
              className="p-9 rounded-3xl border border-cyan-500/14
              bg-gradient-to-br from-blue-700/14 to-cyan-500/[.07] backdrop-blur-md"
            >
              <div className="text-6xl text-center mb-5 drop-shadow-[0_0_20px_rgba(0,200,255,.4)]">
                🏪
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["📍", "kim main road Opps RK park, surat 394110"],
                  ["⏰", "Open 9 AM – 9 PM Daily"],
                  ["📞", "+91 96381 94151"],
                  ["📧", "rajgor@gmail.com"],
                ].map(([ic, t]) => (
                  <div
                    key={t}
                    className="flex items-start gap-2 p-3 rounded-xl bg-white/[.03]
                    text-xs text-sky-200/60 leading-relaxed"
                  >
                    <span className="mt-0.5 shrink-0">{ic}</span>
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="absolute -top-4 -right-4 w-24 h-24
              bg-cyan-400/18 rounded-full blur-2xl pointer-events-none"
            />
          </div>

          {/* story */}
          {(() => {
            const [ref, vis] = useInView();
            return (
              <div ref={ref}>
                <span
                  className={`inline-block px-4 py-1 rounded-full border border-cyan-500/25
                  bg-cyan-500/[.08] text-cyan-400 text-[10px] font-bold tracking-[3px] uppercase mb-5
                  transition-all duration-500
                  ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                >
                  Our Story
                </span>
                <h2
                  className={`rm-display text-4xl font-black text-white mb-5 leading-snug
                  transition-all duration-500 delay-100
                  ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
                >
                  Built on Trust,
                  <br />
                  Powered by Expertise
                </h2>
                <p
                  className={`text-sky-200/52 text-sm leading-relaxed mb-4
                  transition-all duration-500 delay-200
                  ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                >
                  Rajgor Mobile started in 2012 with a simple mission: bring
                  honest, affordable, and expert mobile repair to Surat. What
                  began as a one-man workshop has grown into a full-fledged
                  mobile solutions hub.
                </p>
                <p
                  className={`text-sky-200/52 text-sm leading-relaxed
                  transition-all duration-500 delay-300
                  ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                >
                  Today, we repair every major brand, stock 500+ accessories,
                  and offer a hand-picked selection of certified second-hand
                  phones — all backed by our no-nonsense warranty.
                </p>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ╔══════════════════════════════╗
          ║  BOOKING FORM                ║
          ╚══════════════════════════════╝ */}
      <section
        id="contact"
        className="py-24 px-6 bg-gradient-to-b from-transparent via-blue-950/20 to-transparent"
      >
        <div className="max-w-xl mx-auto">
          <SectionHead
            label="Book a Repair"
            title="Get Your Phone Fixed Today"
            sub="Fill in the form and we'll call you to confirm your appointment."
          />

          {submitted ? (
            <div className="text-center p-14 rounded-2xl border border-emerald-400/20 bg-emerald-500/[.05]">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="rm-display text-3xl font-black text-emerald-400 mb-3">
                Booking Confirmed!
              </h3>
              <p className="text-sky-200/58 text-sm leading-relaxed">
                Thanks <strong className="text-white">{formData.name}</strong>!
                <br />
                Our team will call you at{" "}
                <strong className="text-cyan-400">{formData.phone}</strong>{" "}
                shortly.
              </p>
            </div>
          ) : (
            <div className="p-8 md:p-10 rounded-3xl border border-cyan-500/10 bg-white/[.02] backdrop-blur-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {[
                  {
                    label: "Your Name",
                    key: "name",
                    placeholder: "Rahul Patel",
                    type: "text",
                  },
                  {
                    label: "Phone Number",
                    key: "phone",
                    placeholder: "+91 99999 88888",
                    type: "tel",
                  },
                ].map(({ label, key, placeholder, type }) => (
                  <div key={key}>
                    <label
                      className="block text-[10px] font-bold tracking-widest uppercase
                      text-sky-200/42 mb-2"
                    >
                      {label}
                    </label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={formData[key]}
                      onChange={(e) =>
                        setFormData((f) => ({ ...f, [key]: e.target.value }))
                      }
                      onFocus={() => setFocusField(key)}
                      onBlur={() => setFocusField(null)}
                      className={inputCls(key)}
                    />
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <label
                  className="block text-[10px] font-bold tracking-widest uppercase
                  text-sky-200/42 mb-2"
                >
                  Service Needed
                </label>
                <select
                  value={formData.service}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, service: e.target.value }))
                  }
                  onFocus={() => setFocusField("service")}
                  onBlur={() => setFocusField(null)}
                  className={inputCls("service")}
                  style={{
                    color: formData.service ? "#fff" : "rgba(255,255,255,.28)",
                    background: "rgba(4,6,15,.95)",
                  }}
                >
                  <option value="">Select a service…</option>
                  {[
                    "Screen Replacement",
                    "Battery Replacement",
                    "Water Damage Repair",
                    "Charging Port Repair",
                    "Network Fix",
                    "Speaker / Mic Fix",
                    "Other",
                  ].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-7">
                <label
                  className="block text-[10px] font-bold tracking-widest uppercase
                  text-sky-200/42 mb-2"
                >
                  Additional Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your issue briefly…"
                  value={formData.msg}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, msg: e.target.value }))
                  }
                  onFocus={() => setFocusField("msg")}
                  onBlur={() => setFocusField(null)}
                  className={`${inputCls("msg")} resize-y`}
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600
                  text-white font-black text-base tracking-wide rm-display
                  shadow-[0_4px_24px_rgba(0,200,255,.35)]
                  hover:-translate-y-0.5 hover:shadow-[0_8px_36px_rgba(0,200,255,.52)]
                  transition-all duration-300 cursor-pointer border-none outline-none"
              >
                Book Repair Appointment →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ╔══════════════════════════════╗
          ║  FOOTER                      ║
          ╚══════════════════════════════╝ */}
      <footer className="border-t border-cyan-500/[.07] pt-14 pb-8 px-6 bg-[#02040c]/60">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* brand */}
            <div>
              <button
                onClick={() => scrollTo("home")}
                className="flex items-center gap-2.5 mb-4 bg-transparent border-none outline-none cursor-pointer"
              >
                <div
                  className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-700
                  flex items-center justify-center text-base"
                >
                  📱
                </div>
                <span className="rm-display text-lg font-black rm-shimmer">
                  RAJGOR MOBILE
                </span>
              </button>
              <p className="text-sky-200/38 text-xs leading-relaxed mb-4 max-w-[210px]">
                Surat's trusted mobile repair shop, second-hand phone store &
                accessories hub since 2012.
              </p>
              <div className="flex gap-2.5">
                {["📘", "📸", "▶️", "💬"].map((ic, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border border-cyan-400/14
                    bg-cyan-500/[.07] flex items-center justify-center text-sm cursor-pointer
                    hover:border-cyan-400/35 hover:bg-cyan-500/12 transition-all duration-200"
                  >
                    {ic}
                  </div>
                ))}
              </div>
            </div>

            {/* services */}
            <div>
              <h4 className="rm-display text-sm font-bold text-sky-100 mb-4 tracking-widest uppercase">
                Services
              </h4>
              {[
                "Screen Repair",
                "Battery Fix",
                "Water Damage",
                "Network Fix",
                "Camera Repair",
                "Charging Port",
              ].map((s) => (
                <button
                  key={s}
                  onClick={() => scrollTo("services")}
                  className="block text-sky-200/40 text-xs mb-2 hover:text-cyan-400
                    transition-colors duration-200 cursor-pointer bg-transparent border-none outline-none text-left"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* products */}
            <div>
              <h4 className="rm-display text-sm font-bold text-sky-100 mb-4 tracking-widest uppercase">
                Products
              </h4>
              {[
                "Refurbished iPhones",
                "Samsung Phones",
                "OnePlus Devices",
                "Earbuds & Headphones",
                "Chargers & Cables",
                "Phone Covers",
              ].map((s) => (
                <button
                  key={s}
                  onClick={() => scrollTo("products")}
                  className="block text-sky-200/40 text-xs mb-2 hover:text-cyan-400
                    transition-colors duration-200 cursor-pointer bg-transparent border-none outline-none text-left"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* contact */}
            <div>
              <h4 className="rm-display text-sm font-bold text-sky-100 mb-4 tracking-widest uppercase">
                Contact
              </h4>
              {[
                ["📍", "kim main opp RK park,surat 394110"],
                ["📞", "+91 919638194151"],
                ["📧", "rajgormobile@gmail.com"],
                ["⏰", "Mon-Sun: 9 AM - 9 PM"],
              ].map(([ic, t]) => (
                <div
                  key={t}
                  className="flex gap-2 text-sky-200/40 text-xs mb-2.5 leading-relaxed"
                >
                  <span className="shrink-0">{ic}</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/[.04] pt-6 flex flex-wrap justify-between items-center gap-3">
            <span className="text-sky-200/28 text-xs">
              © 2024 Rajgor Mobile, Surat. All rights reserved.
            </span>
            <span className="text-sky-200/28 text-xs">
              Made with ❤️ in Surat, Gujarat
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
