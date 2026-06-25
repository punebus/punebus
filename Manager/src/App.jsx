import { useEffect, useMemo, useState } from "react";
import api from "./api/apiClient.jsx";

const PANEL_SECTIONS = ["profile", "metrics", "permissions"];
const roleLabels = {
  driver: "Driver",
  vendor: "Bus Vendor",
  restaurant: "Restaurant",
  parcel: "Parcel Vendor",
  mechanic: "Mechanic",
  cleaner: "Cleaner",
};

const approvalLabels = {
  pending: "Pending",
  manager_approved: "Sent To Admin",
  approved: "Approved",
  rejected: "Rejected",
};

const readUser = () => {
  try {
    return JSON.parse(localStorage.getItem("managerUser") || "null");
  } catch {
    return null;
  }
};

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("/api/auth/manager/login", form);
      localStorage.setItem("managerToken", res.data.token);
      localStorage.setItem("managerUser", JSON.stringify(res.data.user));
      onLogin(res.data.user);
    } catch (err) {
      setMessage(err?.response?.data?.message || "Manager login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={submit}>
        <p className="eyebrow">PuneBus Operations</p>
        <h1>Manager Login</h1>
        <label className="field">
          Email
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </label>
        <label className="field">
          Password
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </label>
        <button className="primary-btn" disabled={loading} type="submit">
          {loading ? "Logging in..." : "Login"}
        </button>
        {message && <p className="message error">{message}</p>}
      </form>
    </main>
  );
}

function Dashboard({ user, onLogout }) {
  const sectionIds = ["overview", "registrations", "enquiries"];
  const [activeSection, setActiveSection] = useState(() => {
    const hash = window?.location?.hash?.replace("#", "") || "overview";
    return sectionIds.includes(hash) ? hash : "overview";
  });
  const [overview, setOverview] = useState(null);
  const [providers, setProviders] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [responseDrafts, setResponseDrafts] = useState({});
  const [message, setMessage] = useState("");
  const [providerMessage, setProviderMessage] = useState("");
  const [enquiryMessage, setEnquiryMessage] = useState("");
  const adminUrl = import.meta.env.VITE_ADMIN_APP_URL || "http://127.0.0.1:5174";
  const frontendUrl = import.meta.env.VITE_FRONTEND_APP_URL || "http://127.0.0.1:5173";

  useEffect(() => {
    api.get("/api/panels/overview")
      .then((res) => setOverview(res.data))
      .catch((err) => setMessage(err?.response?.data?.message || "Unable to load manager panel"));

    api.get("/api/providers?limit=100")
      .then((res) => setProviders(res.data.providers || []))
      .catch((err) => setProviderMessage(err?.response?.data?.message || "Unable to load registrations"));

    api.get("/api/enquiry")
      .then((res) => setEnquiries(res.data.items || []))
      .catch((err) => setEnquiryMessage(err?.response?.data?.message || "Unable to load enquiries"));
  }, []);

  useEffect(() => {
    const resetSection = () => {
      const hash = window.location.hash.replace("#", "");
      if (sectionIds.includes(hash)) {
        setActiveSection(hash);
      }
    };

    window.addEventListener("hashchange", resetSection);
    return () => window.removeEventListener("hashchange", resetSection);
  }, []);

  const metrics = useMemo(() => {
    const data = overview?.metrics || {};
    return [
      ["Total Enquiries", data.totalEnquiries || 0],
      ["Pending Enquiries", data.pendingEnquiries || 0],
      ["Active Subscriptions", data.activeSubscriptions || 0],
    ];
  }, [overview]);

  const overviewGraphData = useMemo(() => {
    const maxValue = Math.max(...metrics.map(([, value]) => Number(value) || 0), 1);
    return metrics.map(([label, value]) => ({
      label,
      ratio: Math.round((Number(value) || 0) / maxValue * 100),
    }));
  }, [metrics]);

  const visibleSections = overview?.visibleSections || [];
  const hasSection = (section) => visibleSections.includes(section);
  const hasAnySection = PANEL_SECTIONS.some((section) => hasSection(section));

  const loadProviders = async () => {
    try {
      const res = await api.get("/api/providers?limit=100");
      setProviders(res.data.providers || []);
    } catch (err) {
      setProviderMessage(err?.response?.data?.message || "Unable to load registrations");
    }
  };

  const loadEnquiries = async () => {
    try {
      const res = await api.get("/api/enquiry");
      setEnquiries(res.data.items || []);
    } catch (err) {
      setEnquiryMessage(err?.response?.data?.message || "Unable to load enquiries");
    }
  };

  const sendForAdminApproval = async (provider) => {
    const note = window.prompt(`Send ${provider.name} to admin for final approval? Add note (optional):`) || "";
    setProviderMessage("");
    try {
      await api.put(`/api/providers/${provider._id}/manager-approve`, { note });
      setProviderMessage("Sent to admin for final approval");
      loadProviders();
    } catch (err) {
      setProviderMessage(err?.response?.data?.message || "Unable to update registration");
    }
  };

  const sendEnquiryResponse = async (enquiry) => {
    const responseMessage = String(responseDrafts[enquiry._id] || "").trim();
    if (!responseMessage) {
      setEnquiryMessage("Please enter a response before sending");
      return;
    }

    setEnquiryMessage("");
    try {
      const res = await api.put(`/api/enquiry/${enquiry._id}/respond`, { responseMessage });
      setEnquiryMessage(`Response saved${res.data.emailSent ? " and email sent" : ""}`);
      setResponseDrafts((current) => ({ ...current, [enquiry._id]: "" }));
      loadEnquiries();
    } catch (err) {
      setEnquiryMessage(err?.response?.data?.message || "Unable to send enquiry response");
    }
  };

  return (
    <main className="dashboard">
      <aside className="sidebar">
        <div className="brand-block">
          <span className="brand-mark">PB</span>
          <div>
            <strong>PuneBus</strong>
            <small>Manager Panel</small>
          </div>
        </div>

        <nav className="side-nav" aria-label="Manager sections">
          {sectionIds.map((section) => {
            const labels = {
              overview: "Overview",
              registrations: "Registrations",
              enquiries: "Enquiries",
            };
            return (
              <a
                key={section}
                href={`#${section}`}
                className={activeSection === section ? "active-link" : ""}
                onClick={() => setActiveSection(section)}
              >
                {labels[section]}
              </a>
            );
          })}
        </nav>

        <div className="admin-summary">
          <span>Signed in</span>
          <strong>{user?.name || "Manager"}</strong>
          <small>{user?.email || overview?.profile?.email || "manager@punebus.com"}</small>
        </div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div>
            <p className="eyebrow">Manager App : Port 5175</p>
            <h1>Manager Panel</h1>
          </div>
          <div>
            <a className="quiet-btn" href={frontendUrl}>Public Frontend</a>{" "}
            <a className="quiet-btn" href={adminUrl}>Admin App</a>{" "}
            <button className="quiet-btn" type="button" onClick={onLogout}>Logout</button>
          </div>
        </header>

        <section className="content">
          {message && <p className="message error">{message}</p>}

          <section id="overview" className={activeSection === "overview" ? "active-section" : "hidden-section"}>
            {overview && hasSection("profile") && (
              <section className="panel">
                <p className="eyebrow">Signed in as</p>
                <h2>{user?.name || overview?.profile?.name || "Manager"}</h2>
                <p>{user?.email || overview?.profile?.email}</p>
              </section>
            )}

            {overview && hasSection("metrics") && (
              <section className="panel overview-panel">
                <div className="overview-header">
                  <div>
                    <p className="eyebrow">Live dashboard</p>
                    <h2>Core metrics</h2>
                  </div>
                  <span className="overview-pill">Updated just now</span>
                </div>
                <div className="metric-grid">
                  {metrics.map(([label, value]) => (
                    <article className="metric metric-card" key={label}>
                      <div className="metric-label">{label}</div>
                      <strong>{value}</strong>
                      <div className="metric-bar">
                        <div className="metric-fill" style={{ width: `${overviewGraphData.find((item) => item.label === label)?.ratio}%` }} />
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {overview && hasSection("permissions") && (
              <section className="panel">
                <h2>Manager Focus</h2>
                <div className="task-list">
                  {(overview?.panel?.permissions || []).map((item) => (
                    <div className="task-row" key={item}><span />{item}</div>
                  ))}
                </div>
              </section>
            )}

            {overview && !hasAnySection && (
              <section className="panel">
                <h2>No access assigned</h2>
              </section>
            )}
          </section>

          <section id="registrations" className={activeSection === "registrations" ? "active-section" : "hidden-section"}>
            <section className="panel">
              <div className="section-head">
                <div>
                  <p className="eyebrow">Provider And Business</p>
                  <h2>Registrations</h2>
                </div>
                <button className="quiet-btn" type="button" onClick={loadProviders}>Refresh</button>
              </div>
              {providerMessage && <p className={`message ${providerMessage.includes("Unable") ? "error" : "success"}`}>{providerMessage}</p>}
              <div className="records-grid">
                {providers.length === 0 ? (
                  <p className="empty-text">No registrations found.</p>
                ) : (
                  providers.map((provider) => (
                    <article className="record-card" key={provider._id}>
                      <div>
                        <h3>{provider.name}</h3>
                        <p>{roleLabels[provider.role] || provider.role} | {provider.phone}</p>
                        <p>{provider.email || "No email added"}</p>
                      </div>
                      <span className={`status-pill status-${provider.approvalStatus}`}>
                        {approvalLabels[provider.approvalStatus] || provider.approvalStatus}
                      </span>
                      <p>{(provider.providerServices || []).join(", ") || provider.providerDescription || "No service details"}</p>
                      {provider.approvalStatus !== "approved" && provider.approvalStatus !== "manager_approved" && (
                        <button className="primary-btn" type="button" onClick={() => sendForAdminApproval(provider)}>
                          Send To Admin
                        </button>
                      )}
                    </article>
                  ))
                )}
              </div>
            </section>
          </section>

          <section id="enquiries" className={activeSection === "enquiries" ? "active-section" : "hidden-section"}>
            <section className="panel">
              <div className="section-head">
                <div>
                  <p className="eyebrow">Customer Requests</p>
                  <h2>Enquiries</h2>
                </div>
                <button className="quiet-btn" type="button" onClick={loadEnquiries}>Refresh</button>
              </div>
              {enquiryMessage && <p className={`message ${enquiryMessage.includes("Unable") || enquiryMessage.includes("Please") ? "error" : "success"}`}>{enquiryMessage}</p>}
              <div className="records-grid enquiry-grid">
                {enquiries.length === 0 ? (
                  <p className="empty-text">No enquiries found.</p>
                ) : (
                  enquiries.map((enquiry) => (
                    <article className="record-card" key={enquiry._id}>
                      <div>
                        <h3>{enquiry.companyName || "Enquiry"}</h3>
                        <p>{enquiry.contactPersonName || "-"} | {enquiry.contactNo || "-"}</p>
                        <p>{enquiry.email || "No email added"}</p>
                      </div>
                      <span className={`status-pill status-${enquiry.status}`}>{enquiry.status}</span>
                      <textarea
                        value={responseDrafts[enquiry._id] ?? enquiry.responseMessage ?? ""}
                        onChange={(e) => setResponseDrafts((current) => ({ ...current, [enquiry._id]: e.target.value }))}
                        placeholder="Write response for customer email"
                      />
                      <button className="primary-btn" type="button" onClick={() => sendEnquiryResponse(enquiry)}>
                        Send Response
                      </button>
                    </article>
                  ))
                )}
              </div>
            </section>
          </section>
        </section>
      </section>
    </main>
  );
}

export default function App() {
  const [user, setUser] = useState(readUser);
  const token = localStorage.getItem("managerToken");

  const logout = () => {
    localStorage.removeItem("managerToken");
    localStorage.removeItem("managerUser");
    setUser(null);
  };

  if (!token || !user) return <Login onLogin={setUser} />;
  return <Dashboard user={user} onLogout={logout} />;
}
