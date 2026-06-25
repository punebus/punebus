import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  Handshake,
  Mail,
  MapPin,
  Phone,
  Route,
  Send,
  Sparkles,
  UserRound,
} from "lucide-react";
import api from "../api/apiClient";
import "../style/partnerRegister.css";

const TYPE_META = {
  vendor: {
    heading: "Operational Partner Registration",
    description:
      "Register your business to support route operations, operator collaboration and fleet partnerships.",
    label: "Operational",
    subtitle: "Bus route collaboration and operational support.",
    servicePlaceholder: "Route sponsorship, operator coordination, fleet tie-up",
    role: "vendor",
    icon: BriefcaseBusiness,
  },
  restaurant: {
    heading: "Travel Partner Registration",
    description:
      "Join PuneBus as a travel or experience partner to offer passenger amenities, packages and on-route services.",
    label: "Travel",
    subtitle: "Passenger experience and venue partnerships.",
    servicePlaceholder: "Passenger offers, travel packages, event tie-ups",
    role: "restaurant",
    icon: Sparkles,
  },
  parcel: {
    heading: "Parcel Partner Registration",
    description:
      "Apply to support delivery, pickup and route-based logistics services through PuneBus.",
    label: "Parcel",
    subtitle: "Parcel and logistics collaboration.",
    servicePlaceholder: "Pickup points, drop support, route logistics",
    role: "parcel",
    icon: Route,
  },
};

const normalizePartnerType = (type) => {
  const raw = String(type || "").toLowerCase();
  const aliasMap = {
    vendor: "vendor",
    restaurant: "restaurant",
    parcel: "parcel",
    ops: "vendor",
    operational: "vendor",
    travel: "restaurant",
    experience: "restaurant",
    logistics: "parcel",
  };
  return TYPE_META[aliasMap[raw]] ? aliasMap[raw] : "vendor";
};

const createEmptyForm = (role) => ({
  businessName: "",
  contactPerson: "",
  phone: "",
  email: "",
  role,
  partnerFocus: "",
  collaborationDetails: "",
  routes: "",
  address: "",
});

const PartnerRegister = () => {
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get("type");
  const initialType = normalizePartnerType(typeParam);

  const [form, setForm] = useState(() => createEmptyForm(TYPE_META[initialType].role));
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    const selectedType = normalizePartnerType(typeParam);
    setForm((prev) =>
      prev.role === TYPE_META[selectedType].role
        ? prev
        : { ...prev, role: TYPE_META[selectedType].role }
    );
  }, [typeParam]);

  const roleOptions = [
    { value: "vendor", label: "Operational" },
    { value: "restaurant", label: "Travel" },
    { value: "parcel", label: "Parcel" },
  ];

  const currentType = normalizePartnerType(form.role);
  const currentMeta = TYPE_META[currentType];
  const CurrentIcon = currentMeta.icon;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (nextRole) => {
    setForm((prev) => ({ ...prev, role: TYPE_META[nextRole].role }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const res = await api.post("/api/auth/register", {
        name: form.businessName,
        phone: form.phone,
        email: form.email,
        role: form.role,
        AddharNo: "",
        address: form.address,
        providerDescription: `${form.partnerFocus} \n\n${form.collaborationDetails}`,
        providerServices: form.routes,
      });
      const successText = res?.data?.message || "Partner registration submitted successfully.";
      setMsg({ type: "success", text: successText });
      setShowSuccessPopup(true);
      setForm(createEmptyForm(form.role));
      setTimeout(() => setShowSuccessPopup(false), 2500);
    } catch (err) {
      setMsg({
        type: "error",
        text: err?.response?.data?.message || "Partner registration failed.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="partner-register-page">
      <section className="partner-register-shell" aria-labelledby="partner-register-title">
        <div className="partner-register-intro">
          <div>
            <p className="partner-register-eyebrow">Partner Registration</p>
            <h1 id="partner-register-title">{currentMeta.heading}</h1>
            <p>{currentMeta.description}</p>
          </div>

          <div className="partner-register-summary">
            <span>
              <CurrentIcon size={22} aria-hidden="true" />
            </span>
            <div>
              <strong>{currentMeta.label} Partner</strong>
              <small>{currentMeta.subtitle}</small>
            </div>
          </div>
        </div>

        <section className="partner-register-card" aria-label="Partner registration form">
          <div className="partner-register-topline">
            <div>
              <p className="partner-register-eyebrow">Select Type</p>
              <h2>Share business details</h2>
            </div>

            <div className="partner-type-tabs" role="tablist" aria-label="Partner type">
              {roleOptions.map((opt) => {
                const meta = TYPE_META[opt.value];
                const Icon = meta.icon;
                const isActive = opt.value === form.role;
                return (
                  <button
                    className={`partner-type-tab${isActive ? " is-active" : ""}`}
                    key={opt.value}
                    type="button"
                    onClick={() => handleRoleChange(opt.value)}
                    aria-pressed={isActive}
                  >
                    <Icon size={16} aria-hidden="true" />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {msg && (
            <div className={`partner-register-message partner-register-message-${msg.type}`} role="alert">
              {msg.type === "success" ? (
                <CheckCircle2 size={18} aria-hidden="true" />
              ) : (
                <AlertCircle size={18} aria-hidden="true" />
              )}
              <span>{msg.text}</span>
            </div>
          )}

          <form className="partner-register-form" onSubmit={submit}>
            <label className="partner-field">
              <span>
                <BriefcaseBusiness size={16} aria-hidden="true" />
                Business / Brand Name *
              </span>
              <input
                name="businessName"
                value={form.businessName}
                onChange={handleChange}
                placeholder="Enter business or brand name"
                required
              />
            </label>

            <label className="partner-field">
              <span>
                <UserRound size={16} aria-hidden="true" />
                Contact Person *
              </span>
              <input
                name="contactPerson"
                value={form.contactPerson}
                onChange={handleChange}
                placeholder="Primary contact name"
                required
              />
            </label>

            <label className="partner-field">
              <span>
                <Phone size={16} aria-hidden="true" />
                Phone Number *
              </span>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="Contact phone number"
                required
              />
            </label>

            <label className="partner-field">
              <span>
                <Mail size={16} aria-hidden="true" />
                Email <small>optional</small>
              </span>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="contact@example.com"
              />
            </label>

            <label className="partner-field partner-field-full">
              <span>
                <Handshake size={16} aria-hidden="true" />
                Partnership Focus *
              </span>
              <input
                name="partnerFocus"
                value={form.partnerFocus}
                onChange={handleChange}
                placeholder={currentMeta.subtitle}
                required
              />
            </label>

            <label className="partner-field partner-field-full">
              <span>
                <BadgeCheck size={16} aria-hidden="true" />
                Collaboration Details *
              </span>
              <textarea
                name="collaborationDetails"
                value={form.collaborationDetails}
                onChange={handleChange}
                placeholder="Explain the idea, scope and expected outcome"
                required
              />
            </label>

            <label className="partner-field partner-field-full">
              <span>
                <Route size={16} aria-hidden="true" />
                Target routes / service areas *
              </span>
              <input
                name="routes"
                value={form.routes}
                onChange={handleChange}
                placeholder={currentMeta.servicePlaceholder}
                required
              />
            </label>

            <label className="partner-field partner-field-full">
              <span>
                <MapPin size={16} aria-hidden="true" />
                Address <small>optional</small>
              </span>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Business address or preferred partner location"
              />
            </label>

            <button className="partner-submit" type="submit" disabled={loading}>
              <Send size={18} aria-hidden="true" />
              {loading ? "Sending request..." : "Submit Partner Request"}
            </button>
          </form>
        </section>
      </section>

      {showSuccessPopup && (
        <div className="partner-register-popup-overlay" role="dialog" aria-modal="true">
          <div className="partner-register-popup-card">
            <CheckCircle2 size={38} aria-hidden="true" />
            <div className="partner-register-popup-title">Partner Request Sent</div>
            <p>{msg?.text || "Your partnership application has been submitted."}</p>
            <button type="button" onClick={() => setShowSuccessPopup(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default PartnerRegister;
