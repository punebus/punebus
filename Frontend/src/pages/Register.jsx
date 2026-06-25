// src/pages/Register.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  Building2,
  BusFront,
  CheckCircle2,
  ClipboardList,
  Fingerprint,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  Route,
  Send,
  ShieldCheck,
  Sparkles,
  UtensilsCrossed,
  UserRound,
  Wrench,
} from "lucide-react";
import api from "../api/apiClient";
import busImage from "../assets/replce_bus.jpg";
import foodImage from "../assets/restorent.jpg";
import parcelImage from "../assets/parcel.jpg";
import mechanicImage from "../assets/mechanic.jpg";
import cleanerImage from "../assets/cleaner.jpg";
import driverImage from "../assets/driver.jpg";
import "../style/register.css";

const ROLE_OPTIONS = ["driver", "vendor", "parcel", "mechanic", "cleaner"];
const SUPPORTED_REGISTRATION_ROLES = [...ROLE_OPTIONS, "restaurant"];

const ROLE_META = {
  driver: {
    label: "Driver",
    hero: "Driver Registration",
    subtitle:
      "Register professional driving services for route operations, replacement shifts and travel support.",
    servicePlaceholder: "Route driver, replacement shift, travel driver",
    descriptionLabel: "Driving Experience",
    image: driverImage,
    icon: UserRound,
    highlights: ["License details", "Route experience", "Shift availability", "Verified profile"],
  },
  vendor: {
    label: "BusVendor",
    hero: "BusVendor Registration",
    subtitle:
      "Share your fleet, charter or route support service for PuneBus review and approval.",
    servicePlaceholder: "Bus rental, route backup, charter services",
    descriptionLabel: "Service Description",
    image: busImage,
    icon: BusFront,
    highlights: ["Fleet availability", "Route backup", "Charter support", "Depot details"],
  },
  restaurant: {
    label: "Restaurant Partner",
    hero: "Restaurant Partner Registration",
    subtitle:
      "List catering, meal or refreshment services for passenger and crew support.",
    servicePlaceholder: "Meals, refreshments, bulk catering",
    descriptionLabel: "Business Description",
    image: foodImage,
    icon: UtensilsCrossed,
    highlights: ["Meal supply", "Crew support", "Bulk orders", "Service area"],
  },
  parcel: {
    label: "ParcelVendor",
    hero: "ParcelVendor Registration",
    subtitle:
      "Apply to support pickup, delivery and route-based logistics for PuneBus.",
    servicePlaceholder: "Pickup slots, delivery support, route logistics",
    descriptionLabel: "Partnership Description",
    image: parcelImage,
    icon: PackageCheck,
    highlights: ["Pickup points", "Route delivery", "Tracking support", "Service timing"],
  },
  mechanic: {
    label: "Mechanic",
    hero: "Mechanic Registration",
    subtitle:
      "Register workshop or field mechanic services for breakdown support and vehicle maintenance.",
    servicePlaceholder: "Breakdown support, diagnostics, depot maintenance",
    descriptionLabel: "Repair Service Description",
    image: mechanicImage,
    icon: Wrench,
    highlights: ["Breakdown response", "Diagnostics", "Spare coordination", "Depot service"],
  },
  cleaner: {
    label: "Cleaner",
    hero: "Cleaner Registration",
    subtitle:
      "Offer bus cleaning, washing and hygiene support for depots, scheduled routes and fleet upkeep.",
    servicePlaceholder: "Interior cleaning, bus washing, depot hygiene",
    descriptionLabel: "Cleaning Service Description",
    image: cleanerImage,
    icon: Sparkles,
    highlights: ["Interior cleaning", "Washing support", "Hygiene checks", "Depot coverage"],
  },
};

// Accept either role or service query parameter values.
const normalizeRoleFromParam = (role, service) => {
  const raw = String(role || service || "").toLowerCase();

  const aliasMap = {
    vendor: "vendor",
    driver: "driver",
    restaurant: "restaurant",
    parcel: "parcel",
    mechanic: "mechanic",
    cleaner: "cleaner",
    "bus-vendor": "vendor",
    busvendor: "vendor",
    "bus-provider": "vendor",
    "professional-drivers": "driver",
    "driver-provider": "driver",
    "temporary-bus-provider": "vendor",
    "restaurant-vendor": "restaurant",
    "hotel-vendor": "restaurant",
    "parcel-partner": "parcel",
    "parcel-vendor": "parcel",
    parcelvendor: "parcel",
    "mechanic-provider": "mechanic",
    "cleaner-provider": "cleaner",
  };

  const resolved = aliasMap[raw] || raw;
  return SUPPORTED_REGISTRATION_ROLES.includes(resolved) ? resolved : "vendor";
};

const createEmptyForm = (role) => ({
  name: "",
  phone: "",
  email: "",
  role,
  AddharNo: "",
  address: "",
  providerDescription: "",
  providerServices: "",
});

const Register = () => {
  const [searchParams] = useSearchParams();

  const incomingRole = searchParams.get("role");
  const incomingService = searchParams.get("service");
  const initialRole = normalizeRoleFromParam(incomingRole, incomingService);

  const [form, setForm] = useState(() => createEmptyForm(initialRole));
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    const updatedRole = normalizeRoleFromParam(incomingRole, incomingService);
    setForm((prev) =>
      prev.role === updatedRole ? prev : { ...prev, role: updatedRole }
    );
  }, [incomingRole, incomingService]);

  const currentRole = ROLE_META[form.role] || ROLE_META.vendor;
  const CurrentRoleIcon = currentRole.icon;

  const handleRolePick = (value) => {
    setForm((prev) => ({ ...prev, role: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const res = await api.post("/api/auth/register", form);
      const successText = res?.data?.message || "Registered successfully!";
      setMsg({ type: "success", text: successText });
      setShowSuccessPopup(true);
      setForm(createEmptyForm(form.role));
      setTimeout(() => setShowSuccessPopup(false), 2500);
    } catch (err) {
      setMsg({
        type: "error",
        text: err?.response?.data?.message || "Registration failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">
      <section className="register-shell" aria-labelledby="provider-register-title">
        <aside className="register-side">
          <div className="register-side-media">
            <img src={currentRole.image} alt="" />
            <div className="register-side-badge">
              <CurrentRoleIcon size={18} aria-hidden="true" />
              <span>{currentRole.label}</span>
            </div>
          </div>

          <div className="register-side-copy">
            <p className="register-eyebrow">Provider Onboarding</p>
            <h1 id="provider-register-title">{currentRole.hero}</h1>
            <p>{currentRole.subtitle}</p>
          </div>

          <div className="register-highlight-grid" aria-label="Registration highlights">
            {currentRole.highlights.map((item, index) => (
              <div className="register-highlight" key={item}>
                {index % 2 === 0 ? (
                  <Route size={18} aria-hidden="true" />
                ) : (
                  <Building2 size={18} aria-hidden="true" />
                )}
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="register-review-box">
            <ShieldCheck size={24} aria-hidden="true" />
            <div>
              <strong>Admin review</strong>
              <p>Your request goes to the PuneBus team for verification and approval.</p>
            </div>
          </div>
        </aside>

        <section className="register-form-panel" aria-label="Provider registration form">
          <div className="register-form-head">
            <p className="register-eyebrow">Choose Category</p>
            <h2>Submit provider details</h2>
          </div>

          <div className="register-role-tabs" role="tablist" aria-label="Provider category">
            {ROLE_OPTIONS.map((roleOption) => {
              const meta = ROLE_META[roleOption];
              const RoleIcon = meta.icon;
              const isActive = form.role === roleOption;

              return (
                <button
                  className={`register-role-tab${isActive ? " is-active" : ""}`}
                  key={roleOption}
                  type="button"
                  onClick={() => handleRolePick(roleOption)}
                  aria-pressed={isActive}
                >
                  <span className="register-role-tab-icon">
                    <RoleIcon size={17} aria-hidden="true" />
                  </span>
                  <span>{meta.label}</span>
                </button>
              );
            })}
          </div>

          {msg && (
            <div className={`register-message register-message-${msg.type}`} role="alert">
              {msg.type === "success" ? (
                <CheckCircle2 size={18} aria-hidden="true" />
              ) : (
                <AlertCircle size={18} aria-hidden="true" />
              )}
              <span>{msg.text}</span>
            </div>
          )}

          <form onSubmit={submit} className="register-form">
            <div className="register-fields">
              <label className="register-field">
                <span className="register-label">
                  <UserRound size={16} aria-hidden="true" />
                  Full Name *
                </span>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                />
              </label>

              <label className="register-field">
                <span className="register-label">
                  <Phone size={16} aria-hidden="true" />
                  Phone Number *
                </span>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                />
              </label>

              <label className="register-field">
                <span className="register-label">
                  <Mail size={16} aria-hidden="true" />
                  Email <span className="register-optional">optional</span>
                </span>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                />
              </label>

              <label className="register-field">
                <span className="register-label">
                  <CurrentRoleIcon size={16} aria-hidden="true" />
                  Role *
                </span>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  required
                >
                  <option value="driver">Driver</option>
                  <option value="vendor">BusVendor</option>
                  <option value="parcel">ParcelVendor</option>
                  <option value="mechanic">Mechanic</option>
                  <option value="cleaner">Cleaner</option>
                  {form.role === "restaurant" && (
                    <option value="restaurant">Restaurant Partner</option>
                  )}
                </select>
              </label>

              <label className="register-field register-field-full">
                <span className="register-label">
                  <Fingerprint size={16} aria-hidden="true" />
                  AddharNo <span className="register-optional">optional</span>
                </span>
                <input
                  name="AddharNo"
                  value={form.AddharNo}
                  onChange={handleChange}
                  placeholder="e.g. 8568-1241-7456"
                />
              </label>

              <label className="register-field register-field-full">
                <span className="register-label">
                  <ClipboardList size={16} aria-hidden="true" />
                  {currentRole.descriptionLabel} *
                </span>
                <textarea
                  name="providerDescription"
                  value={form.providerDescription}
                  onChange={handleChange}
                  placeholder={`Describe your ${currentRole.label.toLowerCase()}`}
                  required
                />
              </label>

              <label className="register-field register-field-full">
                <span className="register-label">
                  <Route size={16} aria-hidden="true" />
                  {currentRole.label} Services *
                </span>
                <input
                  name="providerServices"
                  value={form.providerServices}
                  onChange={handleChange}
                  placeholder={currentRole.servicePlaceholder}
                  required
                />
              </label>

              <label className="register-field register-field-full">
                <span className="register-label">
                  <MapPin size={16} aria-hidden="true" />
                  Address <span className="register-optional">optional</span>
                </span>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter your business or service address"
                />
              </label>
            </div>

            <button type="submit" className="register-submit" disabled={loading}>
              <Send size={18} aria-hidden="true" />
              {loading ? "Registering..." : "Submit Registration"}
            </button>
          </form>
        </section>
      </section>

      {showSuccessPopup && (
        <div className="register-popup-overlay" role="dialog" aria-modal="true">
          <div className="register-popup-card">
            <CheckCircle2 size={38} aria-hidden="true" />
            <div className="register-popup-title">Registration Sent</div>
            <p>{msg?.text || "Your registration request has been received."}</p>
            <button type="button" onClick={() => setShowSuccessPopup(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Register;
