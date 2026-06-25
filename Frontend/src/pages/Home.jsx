// HomePage.jsx
import React, { useState, useEffect } from "react";
import cleanerImg from "../assets/cleaner.jpg";
import driverImg from "../assets/driver.jpg";
import mechanicImg from "../assets/mechanic.jpg";
import replacementBusImg from "../assets/replce_bus.jpg";
import parcelImg from "../assets/parcel.jpg";
import silverVideo from "../assets/video/Silver.mp4";
import GoldVideo from "../assets/video/gold_pakage.mp4";
import homepageImg from "../assets/homepage.png";
import dashboardVideo from "../assets/Video/dashboard.mp4";
import restorentImg from "../assets/restorent.jpg";

/* 👇 New images for the added service section (update paths as needed) */
import service1Img from "../assets/sponser.jpg";
import service2Img from "../assets/travel.jpg";

import {
  Bus,
  Users,
  Shield,
  MapPin,
  ArrowRight,
  Phone,
  BarChart3,
  Smartphone,
  CreditCard,
  Wrench,
  Navigation,
  ClipboardList,
  Handshake,
} from "lucide-react";

import EnquiryForm from "./EnquiryForm";
import "../style/homePage.css";

/* ---------------------------
   Config
----------------------------*/
// TODO: put your real support number here
const PHONE_NUMBER = "+919876543210";

/* ---------------------------
   Minimal UI primitives
----------------------------*/
const Button = ({
  children,
  style = {},
  variant = "solid",
  size = "md",
  href, // if provided, renders an <a> instead of <button>
  ...props
}) => {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    borderRadius: "12px",
    border: "1px solid transparent",
    cursor: "pointer",
    fontWeight: 600,
    lineHeight: 1,
    textDecoration: "none",
    transition:
      "transform .15s ease, box-shadow .15s ease, background-color .15s ease, color .15s ease",
  };
  const sizes = {
    sm: { padding: "0.5rem 0.8rem", fontSize: "0.85rem" },
    md: { padding: "0.8rem 1.2rem", fontSize: "1rem" },
    lg: { padding: "1.1rem 1.6rem", fontSize: "1.125rem" },
  };
  const variants = {
    solid: { backgroundColor: "#1e40af", color: "white" },
    outline: {
      backgroundColor: "transparent",
      color: "#1e40af",
      borderColor: "#1e40af",
    },
  };

  const Comp = href ? "a" : "button";
  const mouseHandlers = href
    ? {}
    : {
        onMouseDown: (e) => (e.currentTarget.style.transform = "scale(0.98)"),
        onMouseUp: (e) => (e.currentTarget.style.transform = "scale(1)"),
        onMouseLeave: (e) => (e.currentTarget.style.transform = "scale(1)"),
      };

  return (
    <Comp
      {...props}
      {...mouseHandlers}
      href={href}
      style={{ ...base, ...sizes[size], ...variants[variant], ...style }}
    >
      {children}
    </Comp>
  );
};

const Card = ({ children, style = {} }) => (
  <div
    style={{
      borderRadius: 16,
      backgroundColor: "white",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      overflow: "hidden",
      ...style,
    }}
  >
    {children}
  </div>
);

const CardHeader = ({ children, style = {} }) => (
  <div style={{ padding: "1.25rem 1.25rem 0.75rem", ...style }}>{children}</div>
);
const CardContent = ({ children, style = {} }) => (
  <div style={{ padding: "0 1.25rem 1.25rem", ...style }}>{children}</div>
);
const CardTitle = ({ children, style = {} }) => (
  <h3
    style={{
      margin: 0,
      fontSize: "1.25rem",
      fontWeight: 700,
      color: "#1e293b",
      ...style,
    }}
  >
    {children}
  </h3>
);
const CardDescription = ({ children, style = {} }) => (
  <p style={{ margin: 0, color: "#64748b", ...style }}>{children}</p>
);

/* ---------------------------
   Tiny fade-in on scroll
----------------------------*/
const AnimatedSection = ({ children, className = "", style = {} }) => {
  const [visible, setVisible] = useState(false);
  const ref = React.useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setVisible(true)),
      { rootMargin: "-100px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: `translateY(${visible ? 0 : 20}px)`,
        transition: "opacity .6s ease, transform .6s ease",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* ---------------------------
   Enquiry Modal Wrapper
----------------------------*/
function EnquiryModal({ open, onClose }) {
  // lock scroll when modal open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Enquiry form"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(2,6,23,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "min(820px, 96vw)",
          maxHeight: "92vh",
          overflow: "auto",
          background: "white",
          borderRadius: 14,
          boxShadow: "0 20px 80px rgba(0,0,0,0.35)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "10px 12px 0 12px",
          }}
        >
          <button
            aria-label="Close"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              fontSize: 22,
              lineHeight: 1,
              cursor: "pointer",
              color: "#334155",
            }}
          >
            ×
          </button>
        </div>
        {/* Enquiry Form mounts here; onSuccess closes modal */}
        <EnquiryForm onSuccess={onClose} />
      </div>
    </div>
  );
}

/* ---------------------------
   Hero Section (updated)
----------------------------*/
const Hero = ({ onOpenEnquiry }) => {
  const highlights = [
    "Fleet support",
    "Verified staff",
    "Partner onboarding",
  ];

  return (
    <section
      aria-label="Hero section"
      className="home-hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        overflow: "hidden",
        background: "#0f172a",
      }}
    >
      <style>{`
        @keyframes heroPan {
          0%   { background-position: 35% center; }
          100% { background-position: 75% center; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero__bg { animation: none !important; }
        }
      `}</style>

      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="hero__bg"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 1,
          transform: "translateZ(0)",
          filter: "contrast(1.12) saturate(1.25) brightness(1.05)",
          willChange: "transform",
          imageRendering: "auto",
        }}
      >
        <source src={dashboardVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Softer Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(15, 23, 42, 0.88) 0%, rgba(15, 23, 42, 0.66) 48%, rgba(21, 128, 61, 0.28) 100%)",
        }}
      />

      {/* Content */}
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "5rem clamp(1.5rem, 4vw, 3rem) 80px",
          position: "relative",
          zIndex: 10,
          width: "100%",
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <div style={{ maxWidth: "690px", textAlign: "left" }}>
          <AnimatedSection>
            <div className="home-hero-kicker">
              <Bus size={18} />
              PuneBus operator support platform
            </div>
            <h1
              style={{
                fontSize: "clamp(1.8rem, 4vw, 2.75rem)",
                fontWeight: 800,
                color: "#fff",
                marginBottom: "1.25rem",
                lineHeight: 1.1,
                letterSpacing: 0,
                textShadow: "0 2px 20px rgba(0,0,0,0.25)",
              }}
            >
              Complete bus operations support in one place
            </h1>


            <div className="home-hero-tags">
              {highlights.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "1.85rem" }}>
              <Button
                size="lg"
                href="/provider"
                style={{
                  backgroundColor: "#f59e0b",
                  color: "#0f172a",
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  padding: "1.2rem 2.5rem",
                  border: "none",
                }}
              >
                Become a Provider
                <ArrowRight style={{ width: 20, height: 20 }} />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={onOpenEnquiry}
                style={{
                  color: "#fff",
                  borderColor: "rgba(255,255,255,0.65)",
                  backgroundColor: "transparent",
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  padding: "1.2rem 2.5rem",
                }}
              >
                Get a Quote
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

const HomeOverview = () => {
  const stats = [
    { value: "500+", label: "Operators supported" },
    { value: "24/7", label: "Enquiry readiness" },
    { value: "3", label: "Provider categories" },
  ];

  const points = [
    {
      icon: Bus,
      title: "For bus owners",
      text: "Drivers, mechanics & fleet backup — all in one place.",
    },
    {
      icon: ClipboardList,
      title: "For providers",
      text: "One registration. Verified listing. Instant reach.",
    },
    {
      icon: Handshake,
      title: "For partners",
      text: "Sponsorship, travel offices & brand tie-ups with PuneBus.",
    },
  ];

  return (
    <section className="home-overview" aria-label="PuneBus overview">
      <div className="home-shell">
        <AnimatedSection>
          <div className="home-overview-grid">
            <div>
              <p className="home-eyebrow">Why PuneBus</p>
              <h2>One Platform.<br />Every Bus Need.</h2>
            </div>
            <div className="home-stat-grid">
              {stats.map((item) => (
                <div className="home-stat-card" key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="home-point-grid">
          {points.map(({ icon: Icon, title, text }) => (
            <article className="home-point-card" key={title}>
              <div className="home-point-icon">
                <Icon size={22} strokeWidth={2} />
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
};

/* ---------------------------
   Video Showcase Section
----------------------------*/
const VideoShowcase = () => {
  const videos = [
    {
      src: silverVideo,
      title: "SILVER PACKAGE",
      description: "(BASIC PLAN)",
    },
    {
      src: GoldVideo,
      title: "GOLD PACKAGE",
      description: "(PREMIUM PLAN)",
    },
    {
      src: silverVideo,
      title: "PLATINUM PACKAGE",
      description: "(ELITE PLAN)",
    },
  ];

  return (
    <section
      aria-label="Video showcase"
      style={{
        padding: "80px 1.5rem",
        backgroundColor: "#f8fafc",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <AnimatedSection>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2
              style={{
                fontSize: "clamp(2rem, 4vw, 2.5rem)",
                fontWeight: "bold",
                color: "#1e293b",
                marginBottom: "1rem",
              }}
            >
              See Our Services in Action
            </h2>
            <p
              style={{
                fontSize: "1.125rem",
                color: "#64748b",
                maxWidth: 700,
                margin: "0 auto",
              }}
            >
              Watch how we deliver exceptional bus services
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
          }}
        >
          {videos.map((video, index) => (
            <Card key={index}>
              <CardContent style={{ padding: "0" }}>
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    paddingTop: "56.25%", // 16:9 aspect ratio
                    backgroundColor: "#000",
                    borderRadius: "16px 16px 0 0",
                    overflow: "hidden",
                  }}
                >
                  <video
                    src={video.src}
                    controls
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    aria-label={video.title}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div style={{ padding: "1.5rem" }}>
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "700",
                      color: "#1e293b",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {video.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.95rem",
                      color: "#64748b",
                      margin: 0,
                    }}
                  >
                    {video.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
};

/* ---------------------------
   Services
----------------------------*/
const Services = ({ phone }) => {
  const services = [
    {
      icon: Users,
      title: "Driver Job Registration",
      subtitle: "Apply here for professional driver positions",
      features: [
        "Police/Govt. verification preferred",
        "Experienced & Fresher drivers welcome",
      ],
      color: "#f97316",
      image: driverImg,
    },
    {
      icon: Wrench,
      title: "Cleaner Job Registration",
      subtitle: "Apply for bus maintenance & cleaning roles",
      features: ["Spot cleaning & full wash roles", "Daily/Monthly openings"],
      color: "#3b82f6",
      image: cleanerImg,
    },
    {
      icon: Navigation,
      title: "Mechanic Job Registration",
      subtitle: "On-road/Depot mechanic positions",
      features: ["24/7 emergency support roles", "Quick repair assignments"],
      color: "#10b981",
      image: mechanicImg,
    },
    {
      icon: Bus,
      title: "Temporary Bus Provider Registration",
      subtitle: "Agency/Owner: list your bus with us",
      features: [
        "Green-clearance certified preferred",
        "For temporary route coverage in Pune",
      ],
      color: "#f97316",
      image: replacementBusImg,
    },
    {
      icon: Shield,
      title: "Parcel Partner Registration",
      subtitle: "Apply to become a verified delivery partner",
      features: [
        "Fast & secure deliveries in Pune",
        "Real-time tracking & pickup",
      ],
      color: "#10b981",
      image: parcelImg,
    },
    {
      icon: Shield, // reuse
      title: "Hotel Vendor Registration",
      subtitle: "Verified hotel partners onboard",
      features: [
        "Easy documentation & compliance",
        "Regular bookings/lead flow",
      ],
      color: "#8b5cf6",
      image: restorentImg,
    },
  ];

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      style={{ padding: "80px 1.5rem", backgroundColor: "white" }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <AnimatedSection>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2
              id="services-heading"
              style={{
                fontSize: "clamp(2rem, 4vw, 2.5rem)",
                fontWeight: "bold",
                color: "#1e293b",
                marginBottom: "1rem",
              }}
            >
              Registration — Jobs & Partnerships
            </h2>
            <p
              style={{
                fontSize: "1.125rem",
                color: "#64748b",
                maxWidth: 700,
                margin: "0 auto",
              }}
            >
              Click here to register: whether you are looking for a <b>job</b>{" "}
              (driver/cleaner/mechanic) or want to <b>partner with us</b>,
              please fill out the form. We will connect you with available
              opportunities after registration.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
          }}
        >
          {services.map((service, index) => (
              <Card key={index}>
                <CardHeader style={{ paddingBottom: "1rem" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        backgroundColor: `${service.color}15`,
                        borderRadius: 12,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <service.icon
                        style={{ width: 24, height: 24, color: service.color }}
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <CardTitle
                        style={{
                          fontSize: "1.125rem",
                          marginBottom: "0.25rem",
                        }}
                      >
                        {service.title}
                      </CardTitle>
                      {service.subtitle && (
                        <CardDescription style={{ fontSize: "0.875rem" }}>
                          {service.subtitle}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div
                    style={{
                      height: 250,
                      backgroundColor: "#f1f5f9",
                      borderRadius: 8,
                      marginBottom: "1rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    {service.image ? (
                      <img
                        src={service.image}
                        alt={service.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <service.icon
                        style={{
                          width: 60,
                          height: 60,
                          color: "rgba(148, 163, 184, 0.3)",
                        }}
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      margin: "0 0 1rem 0",
                    }}
                  >
                    {service.features.map((feature, i) => (
                      <li
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          marginBottom: "0.5rem",
                          color: "#475569",
                          fontSize: "0.875rem",
                        }}
                      >
                        <span
                          style={{
                            width: 4,
                            height: 4,
                            backgroundColor: service.color,
                            borderRadius: "50%",
                          }}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Action row: primary + small call button */}
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <Button
                      style={{
                        flex: "1 1 auto",
                        backgroundColor: service.color,
                        border: "none",
                      }}
                      href={`tel:${phone}`}
                      aria-label={`Enquire about ${service.title}`}
                    >
                      Enquire Now
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      href={`tel:${phone}`}
                      aria-label={`Call about ${service.title}`}
                      title="Call Now"
                    >
                      <Phone style={{ width: 16, height: 16 }} />
                      Call
                    </Button>
                  </div>
                </CardContent>
              </Card>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
};

const ProviderSection = () => {
  const providerCards = [
    {
      title: "Driver",
      description: "Verified. Ready. On-route.",
      features: ["Shift support", "Govt. verified"],
      image: driverImg,
      color: "#2563eb",
      role: "driver",
    },
    {
      title: "Bus Vendor",
      description: "Your fleet. Our network.",
      features: ["Route matching", "Operators only"],
      image: replacementBusImg,
      color: "#f97316",
      role: "vendor",
    },
    {
      title: "Parcel Vendor",
      description: "Fast pickups. Safe drops.",
      features: ["Real-time support", "City-wide reach"],
      image: parcelImg,
      color: "#10b981",
      role: "parcel",
    },
    {
      title: "Mechanic",
      description: "Breakdown? We respond.",
      features: ["24/7 response", "Depot & roadside"],
      image: mechanicImg,
      color: "#2563eb",
      role: "mechanic",
    },
    {
      title: "Cleaner",
      description: "Clean fleet. Happy passengers.",
      features: ["Interior wash", "Depot hygiene"],
      image: cleanerImg,
      color: "#0f766e",
      role: "cleaner",
    },
  ];

  return (
    <section
      aria-labelledby="provider-services-heading"
      style={{ padding: "80px 1.5rem", backgroundColor: "#f8fafc" }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <AnimatedSection>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2
              id="provider-services-heading"
              style={{
                fontSize: "clamp(1.6rem, 3.5vw, 2.25rem)",
                fontWeight: 800,
                color: "#0f172a",
                marginBottom: "0.6rem",
              }}
            >
              Register as a <span style={{ color: "#2563eb" }}>Provider</span>
            </h2>
            <p
              style={{
                fontSize: "1rem",
                color: "#64748b",
                maxWidth: 520,
                margin: "0 auto",
              }}
            >
              List your service. Get reviewed. Start earning with PuneBus.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection>
          {/* Row 1 — 3 cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            {providerCards.slice(0, 3).map((card, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  background: "#ffffff",
                  borderRadius: 16,
                  overflow: "hidden",
                  boxShadow: "0 2px 12px rgba(15,23,42,0.07)",
                  border: "1px solid #e2e8f0",
                  transition: "transform 0.22s, box-shadow 0.22s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 30px rgba(15,23,42,0.12)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 12px rgba(15,23,42,0.07)";
                }}
              >
                <div style={{ height: 200, overflow: "hidden" }}>
                  <img src={card.image} alt={card.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: card.color, flexShrink: 0 }} />
                    <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#0f172a" }}>{card.title}</h3>
                  </div>
                  <p style={{ margin: "0 0 0.75rem", fontSize: "0.88rem", color: "#475569", fontWeight: 500 }}>{card.description}</p>
                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {card.features.map((f, i) => (
                      <li key={i} style={{ fontSize: "0.78rem", fontWeight: 700, color: card.color, background: `${card.color}15`, padding: "3px 10px", borderRadius: 999 }}>{f}</li>
                    ))}
                  </ul>
                  <Button
                    href={`/register?role=${card.role}`}
                    style={{ backgroundColor: card.color, border: "none", marginTop: "auto", width: "100%", justifyContent: "center" }}
                  >
                    Provider Registration
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Row 2 — 2 cards: left and middle columns */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1.5rem",
            }}
          >
            {providerCards.slice(3).map((card, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  background: "#ffffff",
                  borderRadius: 16,
                  overflow: "hidden",
                  boxShadow: "0 2px 12px rgba(15,23,42,0.07)",
                  border: "1px solid #e2e8f0",
                  transition: "transform 0.22s, box-shadow 0.22s",
                  gridColumn: index === 1 ? "2" : "auto",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 30px rgba(15,23,42,0.12)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 12px rgba(15,23,42,0.07)";
                }}
              >
                <div style={{ height: 200, overflow: "hidden" }}>
                  <img src={card.image} alt={card.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: card.color, flexShrink: 0 }} />
                    <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#0f172a" }}>{card.title}</h3>
                  </div>
                  <p style={{ margin: "0 0 0.75rem", fontSize: "0.88rem", color: "#475569", fontWeight: 500 }}>{card.description}</p>
                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {card.features.map((f, i) => (
                      <li key={i} style={{ fontSize: "0.78rem", fontWeight: 700, color: card.color, background: `${card.color}15`, padding: "3px 10px", borderRadius: 999 }}>{f}</li>
                    ))}
                  </ul>
                  <Button
                    href={`/register?role=${card.role}`}
                    style={{ backgroundColor: card.color, border: "none", marginTop: "auto", width: "100%", justifyContent: "center" }}
                  >
                    Provider Registration
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

/* ---------------------------
   Features
----------------------------*/
const Features = () => {
  const features = [
    {
      icon: Smartphone,
      title: "Real-Time Booking System",
      description:
        "Accept bookings 24/7 through our mobile app and web platform. Automated confirmations and seat management.",
    },
    {
      icon: BarChart3,
      title: "Business Analytics",
      description:
        "Track revenue, occupancy rates, and popular routes. Make data-driven decisions to grow your business.",
    },
    {
      icon: CreditCard,
      title: "Digital Payments",
      description:
        "Accept UPI, cards, and digital wallets. Instant settlements and complete transaction history.",
    },
    {
      icon: MapPin,
      title: "GPS Fleet Tracking",
      description:
        "Monitor your entire fleet in real-time. Optimize routes and ensure passenger safety.",
    },
  ];

  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      style={{ padding: "80px 1.5rem", backgroundColor: "#f8fafc" }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <AnimatedSection>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2
              id="features-heading"
              style={{
                fontSize: "clamp(2rem, 4vw, 2.5rem)",
                fontWeight: "bold",
                color: "#1e293b",
                marginBottom: "1rem",
              }}
            >
              Advanced Features
            </h2>
            <p
              style={{
                fontSize: "1.125rem",
                color: "#64748b",
                maxWidth: 700,
                margin: "0 auto",
              }}
            >
              Technology-driven solutions to modernize your operations
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2rem",
          }}
        >
          {features.map((feature, index) => (
            <Card key={index} style={{ backgroundColor: "white" }}>
              <CardHeader>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    backgroundColor: "#dbeafe",
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <feature.icon
                    style={{ width: 28, height: 28, color: "#1e40af" }}
                    aria-hidden="true"
                  />
                </div>
                <CardTitle style={{ fontSize: "1.25rem" }}>
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription style={{ fontSize: "1rem", lineHeight: 1.6 }}>
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
};

/* ---------------------------
   UPDATED: In-City Services -> matches images & opens Enquiry
----------------------------*/
const InCityServices = ({ onOpenEnquiry }) => {
  const items = [
    {
      title: "Bus Branding Sponsorship",
      description:
        "Partner with us to advertise on our travel buses and reach thousands of daily commuters across the city.",
      image: service1Img,
      cta: { label: "Enquire Now", action: () => onOpenEnquiry?.() },
    },
    {
      title: "Travel Booking Office Setup",
      description:
        "Start your own travel business with Pune Bus—online & offline booking available, complete partner support.",
      image: service2Img,
      cta: { label: "Enquire Now", action: () => onOpenEnquiry?.() },
    },
  ];

  return (
    <section
      aria-label="Partnership & Franchise Offers"
      style={{ padding: "80px 1.5rem", backgroundColor: "white" }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <AnimatedSection>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h2
              style={{
                fontSize: "clamp(2rem, 4vw, 2.5rem)",
                fontWeight: "bold",
                color: "#1e293b",
                marginBottom: "0.75rem",
              }}
            >
              Partnership & Franchise Offers
            </h2>
            <p
              style={{
                fontSize: "1.075rem",
                color: "#64748b",
                maxWidth: 760,
                margin: "0 auto",
              }}
            >
              Two high-impact ways to grow with Pune Bus—brand promotions and a
              turnkey travel booking office.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
            alignItems: "start",
          }}
        >
          {items.map((it, idx) => (
            <Card key={idx}>
              <CardContent style={{ paddingBottom: "1.25rem" }}>
                {/* 1024 × 1024 square box (responsive down) */}
                <div
                  style={{
                    width: "100%",
                    maxWidth: 1024,
                    margin: "0 auto 1rem",
                    aspectRatio: "1 / 1",
                    backgroundColor: "#f1f5f9",
                    borderRadius: 12,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={it.image}
                    alt={it.title}
                    width={1024}
                    height={1024}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>

                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "#1e293b",
                    margin: "0 0 0.5rem 0",
                  }}
                >
                  {it.title}
                </h3>
                <p style={{ color: "#64748b", margin: "0 0 1rem 0" }}>
                  {it.description}
                </p>

                <div>
                  <Button
                    onClick={it.cta?.action}
                    aria-label={`${it.cta?.label} for ${it.title}`}
                  >
                    {it.cta?.label}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
};

/* ---------------------------
   CTA
----------------------------*/
const CTA = () => {
  return (
    <section
      aria-label="Call to action"
      style={{ padding: "80px 1.5rem", backgroundColor: "#f8fafc" }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <AnimatedSection>
          <div
            style={{
              background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)",
              borderRadius: 24,
              padding: "clamp(3rem, 6vw, 5rem)",
              textAlign: "center",
              color: "white",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: "bold",
                marginBottom: "1rem",
              }}
            >
              Ready to Transform Your Bus Operations?
            </h2>
            <p
              style={{
                fontSize: "1.25rem",
                marginBottom: "2rem",
                color: "rgba(255,255,255,0.9)",
                maxWidth: 700,
                marginInline: "auto",
              }}
            >
              Join 500+ bus owners who have improved their efficiency and
              revenue with Pune Bus
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                justifyContent: "center",
              }}
            >
              <Button
                size="lg"
                href="/register?role=vendor"
                style={{
                  backgroundColor: "white",
                  color: "#1e40af",
                  fontSize: "1.125rem",
                }}
              >
                Get Started Today
                <ArrowRight
                  style={{ marginLeft: "0.5rem", width: 20, height: 20 }}
                />
              </Button>
              <Button
                size="lg"
                variant="outline"
                href={`tel:${PHONE_NUMBER}`}
                aria-label="Call now"
                title="Call Now"
                style={{
                  borderColor: "white",
                  color: "white",
                  fontSize: "1.125rem",
                }}
              >
                <Phone style={{ width: 20, height: 20 }} />
                Call Now
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

/* ---------------------------
   Main HomePage export
----------------------------*/
export default function HomePage() {
  const [showEnquiry, setShowEnquiry] = useState(false);

  const openEnquiry = () => setShowEnquiry(true);
  const closeEnquiry = () => setShowEnquiry(false);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "white", marginTop: "calc(-1 * var(--nav-height))" }}>
      <main>
        <Hero onOpenEnquiry={openEnquiry} />

        <HomeOverview />

        {/* 👇 Videos come immediately after the hero */}
        <VideoShowcase />

        <ProviderSection />

        {/* Pass the modal opener + phone to Services */}
        <Services onOpenEnquiry={openEnquiry} phone={PHONE_NUMBER} />
        <Features />

        {/* 👇 UPDATED: Matches images and opens enquiry modal */}
        <InCityServices onOpenEnquiry={openEnquiry} />

        <CTA onOpenEnquiry={openEnquiry} />
      </main>

      {/* Modal lives at root so it overlays whole page */}
      <EnquiryModal open={showEnquiry} onClose={closeEnquiry} />
    </div>
  );
}
