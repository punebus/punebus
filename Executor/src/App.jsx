import { useEffect, useMemo, useState } from "react";
import api from "./api/apiClient.jsx";

const PANEL_SECTIONS = ["profile", "metrics", "permissions"];

const readUser = () => {
  try {
    return JSON.parse(localStorage.getItem("executorUser") || "null");
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
      const res = await api.post("/api/auth/executor/login", form);
      localStorage.setItem("executorToken", res.data.token);
      localStorage.setItem("executorUser", JSON.stringify(res.data.user));
      onLogin(res.data.user);
    } catch (err) {
      setMessage(err?.response?.data?.message || "Executor login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={submit}>
        <p className="eyebrow">PuneBus Execution</p>
        <h1>Executor Login</h1>
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
  const sectionIds = ["overview", "enquiries"];
  const [activeSection, setActiveSection] = useState(() => {
    const hash = window?.location?.hash?.replace("#", "") || "overview";
    return sectionIds.includes(hash) ? hash : "overview";
  });
  const [overview, setOverview] = useState(null);
  const [enquiries, setEnquiries] = useState([]);
  const [responseDrafts, setResponseDrafts] = useState({});
  const [message, setMessage] = useState("");
  const [enquiryMessage, setEnquiryMessage] = useState("");
  const adminUrl = import.meta.env.VITE_ADMIN_APP_URL || "http://127.0.0.1:5174";
  const frontendUrl = import.meta.env.VITE_FRONTEND_APP_URL || "http://127.0.0.1:5173";

  useEffect(() => {
    api.get("/api/panels/overview")
      .then((res) => setOverview(res.data))
      .catch((err) => setMessage(err?.response?.data?.message || "Unable to load executor panel"));

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
      ["Pending Enquiries", data.pendingEnquiries || 0],
      ["Completed Enquiries", data.completedEnquiries || 0],
      ["Total Enquiries", data.totalEnquiries || 0],
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

  const loadEnquiries = async () => {
    try {
      const res = await api.get("/api/enquiry");
      setEnquiries(res.data.items || []);
    } catch (err) {
      setEnquiryMessage(err?.response?.data?.message || "Unable to load enquiries");
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
            <small>Executor Panel</small>
          </div>
        </div>

        <nav className="side-nav" aria-label="Executor sections">
          {["overview", "enquiries"].map((section) => {
            const labels = {
              overview: "Overview",
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
          <strong>{user?.name || "Executor"}</strong>
          <small>{user?.email || overview?.profile?.email || "executor@punebus.com"}</small>
        </div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div>
            <p className="eyebrow">Executor App : Port 5176</p>
            <h1>Executor Panel</h1>
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
                <h2>{user?.name || overview?.profile?.name || "Executor"}</h2>
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
                <h2>Executor Focus</h2>
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
              <div className="records-grid">
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
  const token = localStorage.getItem("executorToken");

  const logout = () => {
    localStorage.removeItem("executorToken");
    localStorage.removeItem("executorUser");
    setUser(null);
  };

  if (!token || !user) return <Login onLogin={setUser} />;
  return <Dashboard user={user} onLogout={logout} />;
}
