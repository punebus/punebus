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
        minHeight: "640px",
        display: "flex",
        alignItems: "center",
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

      {/* Background Image */}
      <div
        className="hero__bg"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${homepageImg})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "55% center",
          animation: "heroPan 18s ease-in-out infinite alternate",
          opacity: 1,
          transform: "translateZ(0)",
        }}
      />

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
          padding: "80px clamp(1.5rem, 4vw, 3rem)",
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
                fontSize: "clamp(2.6rem, 6vw, 4.45rem)",
                fontWeight: 800,
                color: "#fff",
                marginBottom: "1.25rem",
                lineHeight: 1.04,
                letterSpacing: 0,
                textShadow: "0 2px 20px rgba(0,0,0,0.25)",
              }}
            >
              Complete bus operations support in one place
            </h1>

            <p
              style={{
                fontSize: "clamp(1rem, 2vw, 1.25rem)",
                color: "rgba(255,255,255,0.9)",
                marginBottom: "2.25rem",
                lineHeight: 1.6,
                fontWeight: 400,
                textShadow: "0 1px 12px rgba(0,0,0,0.25)",
              }}
            >
              From verified drivers and mechanics to fleet providers, parcel
              partners and brand tie-ups, PuneBus helps operators keep routes
              moving with reliable local support.
            </p>

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
    { value: "500+", label: "Operator conversations supported" },
    { value: "24/7", label: "Roadside and enquiry readiness" },
    { value: "3", label: "Provider categories onboarded" },
  ];

  const points = [
    {
      title: "For bus owners",
      text: "Get drivers, mechanics, fleet backup, parcel integration and passenger support services.",
    },
    {
      title: "For providers",
      text: "List your buses, catering, parcel or local business services through one reviewed registration flow.",
    },
    {
      title: "For partners",
      text: "Build sponsorship, travel office and brand collaboration opportunities with PuneBus.",
    },
  ];

  return (
    <section className="home-overview" aria-label="PuneBus overview">
      <div className="home-shell">
        <AnimatedSection>
          <div className="home-overview-grid">
            <div>
              <p className="home-eyebrow">Why PuneBus</p>
              <h2>One platform for daily operations, provider support and partnerships.</h2>
              <p>
                PuneBus brings operator support, verified provider onboarding
                and local business collaborations into a clear service network
                for Pune routes.
              </p>
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
          {points.map((item) => (
            <article className="home-point-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
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
      subtitle: "Naukri chahiye? Yahan apply karein",
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
      subtitle: "Bus cleaning/attendant ke liye apply",
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
      subtitle: "Agency/Owner: apni bus list karein",
      features: [
        "Green-clearance certified preferred",
        "Pune me temporary coverage ke liye",
      ],
      color: "#f97316",
      image: replacementBusImg,
    },
    {
      icon: Shield,
      title: "Parcel Partner Registration",
      subtitle: "Delivery partner banne ke liye apply",
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
              Yahan click karke register karein: agar aapko <b>job chahiye</b>{" "}
              (driver/cleaner/mechanic) ya <b>hamare saath partner</b> banna
              chahte hain, to form bhariye. Registration ke baad hum aapko
              opportunities se jodenge.
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
      description:
        "Register professional drivers for route operations and temporary shift support.",
      features: ["Verified driver profile", "Route support"],
      image: driverImg,
      color: "#2563eb",
      role: "driver",
    },
    {
      title: "BusVendor",
      description:
        "List your vehicles and offer temporary fleet support for Pune routes.",
      features: ["Route-based service matching", "Verified operators only"],
      image: replacementBusImg,
      color: "#f97316",
      role: "vendor",
    },
    {
      title: "ParcelVendor",
      description:
        "Deliver packages securely along passenger routes and city drops.",
      features: ["Real-time pickup support", "Safe parcel handling"],
      image: parcelImg,
      color: "#10b981",
      role: "parcel",
    },
    {
      title: "Mechanic",
      description:
        "Register repair and breakdown support for buses, depots and route operations.",
      features: ["Breakdown response", "Vehicle diagnostics"],
      image: mechanicImg,
      color: "#2563eb",
      role: "mechanic",
    },
    {
      title: "Cleaner",
      description:
        "Offer bus cleaning, washing and hygiene services for fleet upkeep.",
      features: ["Interior cleaning", "Depot wash support"],
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
                fontSize: "clamp(2rem, 4vw, 2.5rem)",
                fontWeight: "bold",
                color: "#1e293b",
                marginBottom: "1rem",
              }}
            >
              Provider Services on PuneBus
            </h2>
            <p
              style={{
                fontSize: "1.125rem",
                color: "#475569",
                maxWidth: 760,
                margin: "0 auto",
              }}
            >
              Share your business services and get listed as a provider. Admin or manager will review your registration, approve it, and keep the full approval history.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {providerCards.map((card, index) => (
            <Card key={index}>
              <div
                style={{
                  height: 240,
                  backgroundColor: `${card.color}22`,
                  overflow: "hidden",
                }}
              >
                <img
                  src={card.image}
                  alt={card.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <CardContent>
                <CardTitle style={{ fontSize: "1.25rem" }}>
                  {card.title}
                </CardTitle>
                <CardDescription style={{ color: "#475569" }}>
                  {card.description}
                </CardDescription>
                <ul
                  style={{ listStyle: "none", padding: 0, margin: "1rem 0" }}
                >
                  {card.features.map((feature, fIndex) => (
                    <li
                      key={fIndex}
                      style={{
                        marginBottom: "0.65rem",
                        color: "#334155",
                      }}
                    >
                      • {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  href={`/register?role=${card.role}`}
                  style={{ backgroundColor: card.color, border: "none" }}
                >
                  Provider Registration
                </Button>
              </CardContent>
            </Card>
          ))}
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
    <div style={{ minHeight: "100vh", backgroundColor: "white" }}>
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
