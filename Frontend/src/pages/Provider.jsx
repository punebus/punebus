import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  BusFront,
  ClipboardCheck,
  UserRound,
  Sparkles,
  PackageCheck,
  Wrench,
} from "lucide-react";
import driverImg from "../assets/driver.jpg";
import replacementBusImg from "../assets/replce_bus.jpg";
import parcelImg from "../assets/parcel.jpg";
import mechanicImg from "../assets/mechanic.jpg";
import cleanerImg from "../assets/cleaner.jpg";
import "../style/providerPartner.css";

const Provider = () => {
  const cards = [
    {
      title: "Driver",
      label: "Driving Support",
      description:
        "Register professional driving services for route operations, replacement shifts and travel support.",
      features: ["Verified driver profile", "Route support", "Shift availability"],
      image: driverImg,
      role: "driver",
      cta: "Register as Driver",
      icon: UserRound,
    },
    {
      title: "BusVendor",
      label: "Fleet Support",
      description:
        "Register your buses for route backup, temporary fleet needs and planned charter support across Pune.",
      features: [
        "Route and fleet matching",
        "Temporary bus requirements",
        "Verified operator onboarding",
      ],
      image: replacementBusImg,
      role: "vendor",
      cta: "Register as Bus Provider",
      icon: BusFront,
    },
    {
      title: "ParcelVendor",
      label: "Route Logistics",
      description:
        "Use scheduled bus movement to support pickup, drop and route-based parcel delivery operations.",
      features: ["Secure handling", "Pickup & drop support", "Route-based delivery"],
      image: parcelImg,
      role: "parcel",
      cta: "Register as Parcel Partner",
      icon: PackageCheck,
    },
    {
      title: "Mechanic",
      label: "Repair Support",
      description:
        "Register workshop or on-road mechanic services for breakdown support, diagnostics and maintenance.",
      features: ["Breakdown response", "Vehicle diagnostics", "Depot maintenance"],
      image: mechanicImg,
      role: "mechanic",
      cta: "Register as Mechanic",
      icon: Wrench,
    },
    {
      title: "Cleaner",
      label: "Cleaning Support",
      description:
        "Offer bus cleaning, washing and hygiene support for depots, routes and scheduled fleet upkeep.",
      features: ["Interior cleaning", "Depot wash support", "Hygiene checks"],
      image: cleanerImg,
      role: "cleaner",
      cta: "Register as Cleaner",
      icon: Sparkles,
    },
  ];

  const stats = [
    { value: "5", label: "Provider categories" },
    { value: "24h", label: "Approval review target" },
    { value: "100%", label: "Admin verified onboarding" },
  ];

  const steps = [
    "Choose your provider category",
    "Add business details and services",
    "Admin reviews and approves your profile",
  ];

  return (
    <main className="provider-partner-page">
      <section className="pp-hero">
        <div className="pp-shell pp-hero-grid">
          <div className="pp-hero-copy">
            <p className="pp-eyebrow">Provider Services</p>
            <h1>Grow your service business with PuneBus</h1>
            <p>
              Add your driver, bus, parcel, mechanic or cleaning service to PuneBus
              and connect with operators who need verified support. Every registration
              goes through an approval flow, so providers stay trusted and traceable.
            </p>
            <div className="pp-actions">
              <Link className="pp-btn pp-btn-primary" to="/register?role=vendor">
                Start Provider Registration
                <ArrowRight size={18} />
              </Link>
              <Link className="pp-btn pp-btn-secondary" to="/services">
                View Services
              </Link>
            </div>
          </div>

          <div className="pp-hero-panel" aria-label="Provider onboarding summary">
            {stats.map((item) => (
              <div className="pp-stat" key={item.label}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
            <div className="pp-note">
              <BadgeCheck size={22} />
              <p>
                Approved providers become available for matching, support
                listings and operator follow-up.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pp-shell pp-section">
        <div className="pp-section-heading">
          <p className="pp-eyebrow">Choose Category</p>
          <h2>Provider options built for daily bus operations</h2>
          <p>
            Select the service type that matches your business. The button will
            open the registration form with the correct role already selected.
          </p>
        </div>

        <div className="pp-card-grid">
          {cards.map((card) => (
            <article className="pp-card" key={card.title}>
              <div className="pp-card-image">
                <img src={card.image} alt={card.title} />
                <span className="pp-card-label">{card.label}</span>
              </div>
              <div className="pp-card-body">
                <div className="pp-card-title-row">
                  <span className="pp-icon-box">
                    <card.icon size={22} />
                  </span>
                  <h3>{card.title}</h3>
                </div>
                <p>{card.description}</p>
                <ul className="pp-feature-list">
                  {card.features.map((feature) => (
                    <li key={feature}>
                      <ClipboardCheck size={17} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link className="pp-btn pp-btn-card" to={`/register?role=${card.role}`}>
                  {card.cta}
                  <ArrowRight size={18} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="pp-shell pp-section pp-info-band">
        <div>
          <p className="pp-eyebrow">How It Works</p>
          <h2>Simple onboarding, clear approval</h2>
        </div>
        <div className="pp-steps">
          {steps.map((step, index) => (
            <div className="pp-step" key={step}>
              <span>{index + 1}</span>
              <p>{step}</p>
            </div>
          ))}
        </div>
        <Link className="pp-btn pp-btn-primary" to="/register?role=vendor">
          Register Now
          <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  );
};

export default Provider;
