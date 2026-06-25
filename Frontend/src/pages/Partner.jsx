import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeIndianRupee,
  Handshake,
  Megaphone,
  Route,
  Sparkles,
} from "lucide-react";
import replacementBusImg from "../assets/replce_bus.jpg";
import sponsorImg from "../assets/sponser.jpg";
import travelImg from "../assets/travel.jpg";
import "../style/providerPartner.css";

const Partner = () => {
  const sections = [
    {
      title: "Operational Partnership",
      label: "Business Collaboration",
      description:
        "Work with PuneBus on route support, operator services, travel coordination and shared customer programs.",
      benefits: ["Verified business onboarding", "Operator coordination", "City-wide service visibility"],
      buttonText: "Register Partner",
      role: "vendor",
      image: replacementBusImg,
      icon: Handshake,
    },
    {
      title: "Sponsorship & Brand Tie-ups",
      label: "Brand Growth",
      description:
        "Promote your brand through bus visibility, service touchpoints and campaign opportunities across Pune.",
      benefits: ["Bus and route branding", "Campaign support", "Local audience reach"],
      buttonText: "Send Partnership Enquiry",
      role: "enquiry",
      image: sponsorImg,
      icon: Megaphone,
    },
    {
      title: "Travel & Experience Partners",
      label: "Passenger Value",
      description:
        "Build offers, assisted travel experiences and passenger programs for regular and premium journeys.",
      benefits: ["Passenger engagement", "Offer-based programs", "Follow-up from PuneBus team"],
      buttonText: "Start Collaboration",
      role: "restaurant",
      image: travelImg,
      icon: Route,
    },
  ];

  return (
    <main className="provider-partner-page partner-theme">
      <section className="pp-hero pp-partner-hero">
        <div className="pp-shell pp-hero-grid">
          <div className="pp-hero-copy">
            <p className="pp-eyebrow">Partnership</p>
            <h1>Partner with PuneBus and reach more people</h1>
            <p>
              Build operational, sponsorship and travel collaborations with a
              trusted bus service platform. Share your details and our team will
              review the best route for onboarding.
            </p>
            <div className="pp-actions">
              <Link className="pp-btn pp-btn-primary" to="/enquiry">
                Send Partnership Enquiry
                <ArrowRight size={18} />
              </Link>
              <Link className="pp-btn pp-btn-secondary" to="/partner-register?type=vendor">
                Register Business
              </Link>
            </div>
          </div>

          <div className="pp-hero-panel">
            <div className="pp-partner-highlight">
              <Sparkles size={24} />
              <div>
                <strong>Built for serious collaborations</strong>
                <p>
                  Sponsors, service businesses and travel brands can connect
                  through one clear follow-up flow.
                </p>
              </div>
            </div>
            <div className="pp-mini-grid">
              <span>Brand visibility</span>
              <span>Service tie-ups</span>
              <span>Passenger offers</span>
              <span>Operator support</span>
            </div>
          </div>
        </div>
      </section>

      <section className="pp-shell pp-section">
        <div className="pp-section-heading">
          <p className="pp-eyebrow">Partner Options</p>
          <h2>Pick the collaboration that fits your business</h2>
          <p>
            Each option has a clear button so your team can either register
            directly or send a partnership enquiry for a custom tie-up.
          </p>
        </div>

        <div className="pp-card-grid">
          {sections.map((section) => (
            <article className="pp-card" key={section.title}>
              <div className="pp-card-image">
                <img src={section.image} alt={section.title} />
                <span className="pp-card-label">{section.label}</span>
              </div>
              <div className="pp-card-body">
                <div className="pp-card-title-row">
                  <span className="pp-icon-box">
                    <section.icon size={22} />
                  </span>
                  <h3>{section.title}</h3>
                </div>
                <p>{section.description}</p>
                <ul className="pp-feature-list">
                  {section.benefits.map((benefit) => (
                    <li key={benefit}>
                      <BadgeIndianRupee size={17} />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  className="pp-btn pp-btn-card"
                  to={
                    section.role === "enquiry"
                      ? "/enquiry"
                      : `/partner-register?type=${section.role}`
                  }
                >
                  {section.buttonText}
                  <ArrowRight size={18} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="pp-shell pp-section pp-info-band">
        <div>
          <p className="pp-eyebrow">Why Partner</p>
          <h2>More reach, cleaner coordination</h2>
        </div>
        <p>
          PuneBus can help your business connect with passengers, bus operators
          and local routes through a reviewed partnership process.
        </p>
        <Link className="pp-btn pp-btn-primary" to="/enquiry">
          Talk to PuneBus
          <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  );
};

export default Partner;
