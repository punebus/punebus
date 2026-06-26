import { useCallback, useEffect, useMemo, useState } from "react";
import api from "./api/apiClient.jsx";

const USER_FILTER_ROLES = ["manager", "executor", "admin"];
const CREATE_PANEL_ROLES = ["manager", "executor"];
const CONFIG_ROLES = ["manager", "executor"];
const roleLabels = {
  admin: "Admin",
  manager: "Manager",
  executor: "Executor",
  driver: "Driver",
  vendor: "Bus Vendor",
  restaurant: "Restaurant",
  parcel: "Parcel Vendor",
  mechanic: "Mechanic",
  cleaner: "Cleaner",
};

const approvalLabels = {
  pending: "Pending",
  manager_approved: "Manager Approved",
  approved: "Approved",
  rejected: "Rejected",
};

const PANEL_SECTIONS = [
  { id: "profile", label: "Profile" },
  { id: "metrics", label: "Metrics" },
  { id: "permissions", label: "Focus List" },
];

const PANEL_PERMISSIONS = {
  manager: [
    "Monitor enquiries",
    "Review subscriptions",
    "Coordinate executor work",
    "View active subscriptions",
    "Review completed enquiries",
  ],
  executor: [
    "Track pending enquiries",
    "Update field work",
    "Follow customer tasks",
    "View completed enquiries",
    "View active subscriptions",
  ],
};

const defaultPanelConfig = (role) => ({
  role,
  visibleSections: PANEL_SECTIONS.map((section) => section.id),
  permissions: PANEL_PERMISSIONS[role] || [],
});

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  password: "",
  role: "manager",
  address: "",
};

const readAdmin = () => {
  try {
    return JSON.parse(localStorage.getItem("adminUser") || "null");
  } catch {
    return null;
  }
};

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("/api/auth/admin/login", form);
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminUser", JSON.stringify(res.data.user));
      onLogin(res.data.user);
    } catch (err) {
      setMessage(err?.response?.data?.message || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  const submitForgot = async (event) => {
    event.preventDefault();
    setForgotLoading(true);
    setForgotMsg("");
    try {
      const res = await api.post("/api/auth/forgot-password", { email: forgotEmail });
      setForgotMsg(res.data.message);
    } catch (err) {
      setForgotMsg(err?.response?.data?.message || "Failed to send reset email");
    } finally {
      setForgotLoading(false);
    }
  };

  if (showForgot) {
    return (
      <main className="login-page">
        <form className="login-card" onSubmit={submitForgot}>
          <p className="eyebrow">PuneBus Control</p>
          <h1>Forgot Password</h1>
          <p style={{ color: "#aaa", fontSize: "0.875rem", marginBottom: "1rem" }}>
            Enter your admin email and we&apos;ll send you a reset link.
          </p>
          <label className="field">
            Email
            <input
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              required
            />
          </label>
          <button className="primary-btn" disabled={forgotLoading} type="submit">
            {forgotLoading ? "Sending..." : "Send Reset Link"}
          </button>
          {forgotMsg && (
            <p className={`message ${forgotMsg.includes("sent") ? "success" : "error"}`}>
              {forgotMsg}
            </p>
          )}
          <button
            type="button"
            className="link-btn"
            onClick={() => { setShowForgot(false); setForgotMsg(""); }}
          >
            ← Back to Login
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={submit}>
        <p className="eyebrow">PuneBus Control</p>
        <h1>Admin Login</h1>
        <label className="field">
          Email
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </label>
        <label className="field">
          Password
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </label>
        {message && <p className="message error">{message}</p>}
        <div className="login-actions">
          <button className="primary-btn" disabled={loading} type="submit">
            {loading ? "Logging in..." : "Login"}
          </button>
          <button
            type="button"
            className="link-btn"
            onClick={() => { setShowForgot(true); setMessage(""); }}
          >
            Forgot Password?
          </button>
        </div>
      </form>
    </main>
  );
}

function Dashboard({ admin, onLogout }) {
  const sectionIds = [
    "overview",
    "create-user",
    "permissions",
    "registrations",
    "enquiries",
    "directory",
  ];
  const [activeSection, setActiveSection] = useState(() => {
    const hash = window?.location?.hash?.replace("#", "") || "overview";
    return sectionIds.includes(hash) ? hash : "overview";
  });
  const [activeRole, setActiveRole] = useState("manager");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [responseDrafts, setResponseDrafts] = useState({});
  const [form, setForm] = useState(emptyForm);
  const [panelConfigs, setPanelConfigs] = useState(() => ({
    manager: defaultPanelConfig("manager"),
    executor: defaultPanelConfig("executor"),
  }));
  const [configLoading, setConfigLoading] = useState(false);
  const [configMessage, setConfigMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [providerLoading, setProviderLoading] = useState(false);
  const [enquiryLoading, setEnquiryLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [providerMessage, setProviderMessage] = useState("");
  const [enquiryMessage, setEnquiryMessage] = useState("");

  const managerUrl = import.meta.env.VITE_MANAGER_APP_URL || "http://127.0.0.1:5175";
  const executorUrl = import.meta.env.VITE_EXECUTOR_APP_URL || "http://127.0.0.1:5176";
  const frontendUrl = import.meta.env.VITE_FRONTEND_APP_URL || "http://127.0.0.1:5173";

  const visibleStats = useMemo(() => {
    const counts = stats?.counts || {};
    const pendingProviders = providers.filter((provider) => provider.approvalStatus !== "approved").length;
    const pendingEnquiries = enquiries.filter((enquiry) => enquiry.status !== "done").length;
    return [
      ["Managers", counts.manager || 0],
      ["Executors", counts.executor || 0],
      ["Pending Providers", pendingProviders],
      ["Open Enquiries", pendingEnquiries],
      ["All Users", stats?.total || 0],
    ];
  }, [enquiries, providers, stats]);

  const overviewGraphData = useMemo(() => {
    const maxValue = Math.max(...visibleStats.map(([, value]) => Number(value) || 0), 1);
    return visibleStats.map(([label, value]) => ({
      label,
      value,
      ratio: Math.round((Number(value) || 0) / maxValue * 100),
    }));
  }, [visibleStats]);

  const loadStats = useCallback(async () => {
    const res = await api.get("/api/admin/stats");
    setStats(res.data);
  }, []);

  const loadUsers = useCallback(async (role = activeRole) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/admin/list/${role}?page=1&limit=50`);
      setUsers(res.data.users || []);
    } finally {
      setLoading(false);
    }
  }, [activeRole]);

  const loadProviders = useCallback(async () => {
    setProviderLoading(true);
    try {
      const res = await api.get("/api/providers?limit=100");
      setProviders(res.data.providers || []);
    } catch (err) {
      setProviderMessage(err?.response?.data?.message || "Unable to load registrations");
    } finally {
      setProviderLoading(false);
    }
  }, []);

  const loadEnquiries = useCallback(async () => {
    setEnquiryLoading(true);
    try {
      const res = await api.get("/api/enquiry");
      setEnquiries(res.data.items || []);
    } catch (err) {
      setEnquiryMessage(err?.response?.data?.message || "Unable to load enquiries");
    } finally {
      setEnquiryLoading(false);
    }
  }, []);

  const loadPanelConfigs = useCallback(async () => {
    setConfigLoading(true);
    setConfigMessage("");

    try {
      const responses = await Promise.all(
        CONFIG_ROLES.map((role) => api.get(`/api/panel-config/${role}`))
      );
      setPanelConfigs(
        responses.reduce((nextConfigs, res, index) => {
          const role = CONFIG_ROLES[index];
          nextConfigs[role] = {
            ...defaultPanelConfig(role),
            ...(res.data.config || {}),
          };
          return nextConfigs;
        }, {})
      );
    } catch (err) {
      setConfigMessage(err?.response?.data?.message || "Unable to load panel permissions");
    } finally {
      setConfigLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
    loadUsers(activeRole);
  }, [activeRole, loadStats, loadUsers]);

  useEffect(() => {
    loadPanelConfigs();
    loadProviders();
    loadEnquiries();
  }, [loadEnquiries, loadPanelConfigs, loadProviders]);

  useEffect(() => {
    const syncToHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (sectionIds.includes(hash)) {
        setActiveSection(hash);
      }
    };

    window.addEventListener("hashchange", syncToHash);
    return () => window.removeEventListener("hashchange", syncToHash);
  }, []);

  const createUser = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      await api.post("/api/admin/user", form);
      setMessage(`${roleLabels[form.role]} created successfully`);
      setForm({ ...emptyForm, role: form.role });
      loadStats();
      loadUsers(form.role);
      setActiveRole(form.role);
    } catch (err) {
      setMessage(err?.response?.data?.message || "Failed to create user");
    }
  };

  const deleteUser = async (user) => {
    if (!window.confirm(`Delete ${user.name}?`)) return;
    await api.delete(`/api/admin/user/${user._id}`);
    loadStats();
    loadUsers(activeRole);
  };

  const togglePanelConfig = (role, key, value) => {
    setPanelConfigs((current) => {
      const roleConfig = current[role] || defaultPanelConfig(role);
      const currentValues = roleConfig[key] || [];
      const nextValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];

      return {
        ...current,
        [role]: {
          ...roleConfig,
          [key]: nextValues,
        },
      };
    });
  };

  const savePanelConfig = async (role) => {
    const roleConfig = panelConfigs[role] || defaultPanelConfig(role);
    setConfigLoading(true);
    setConfigMessage("");

    try {
      const res = await api.put(`/api/panel-config/${role}`, {
        visibleSections: roleConfig.visibleSections,
        permissions: roleConfig.permissions,
      });
      setPanelConfigs((current) => ({
        ...current,
        [role]: {
          ...defaultPanelConfig(role),
          ...(res.data.config || {}),
        },
      }));
      setConfigMessage(`${roleLabels[role]} permissions saved`);
    } catch (err) {
      setConfigMessage(err?.response?.data?.message || "Unable to save panel permissions");
    } finally {
      setConfigLoading(false);
    }
  };

  const approveProvider = async (provider) => {
    setProviderMessage("");
    const note = window.prompt(`Approve ${provider.name}? Add note (optional):`) || "";
    try {
      const res = await api.put(`/api/providers/${provider._id}/approve`, { note });
      setProviderMessage(`Provider approved${res.data.emailSent ? " and email sent" : ""}`);
      loadProviders();
      loadStats();
    } catch (err) {
      setProviderMessage(err?.response?.data?.message || "Unable to approve provider");
    }
  };

  const rejectProvider = async (provider) => {
    setProviderMessage("");
    const note = window.prompt(`Reject ${provider.name}? Add reason (optional):`) || "";
    try {
      const res = await api.put(`/api/providers/${provider._id}/reject`, { note });
      setProviderMessage(`Provider rejected${res.data.emailSent ? " and email sent" : ""}`);
      loadProviders();
      loadStats();
    } catch (err) {
      setProviderMessage(err?.response?.data?.message || "Unable to reject provider");
    }
  };

  const deleteProvider = async (provider) => {
    if (!window.confirm(`Delete registration for "${provider.name}"? This cannot be undone.`)) return;
    setProviderMessage("");
    try {
      await api.delete(`/api/providers/${provider._id}`);
      setProviderMessage("Provider deleted");
      loadProviders();
      loadStats();
    } catch (err) {
      setProviderMessage(err?.response?.data?.message || "Unable to delete provider");
    }
  };

  const deleteEnquiry = async (enquiry) => {
    if (!window.confirm(`Delete enquiry from "${enquiry.contactPersonName || enquiry.companyName}"? This cannot be undone.`)) return;
    setEnquiryMessage("");
    try {
      await api.delete(`/api/enquiry/${enquiry._id}`);
      setEnquiryMessage("Enquiry deleted");
      loadEnquiries();
    } catch (err) {
      setEnquiryMessage(err?.response?.data?.message || "Unable to delete enquiry");
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

  return (<>
    <main className="dashboard">
      <aside className="sidebar">
        <div className="brand-block">
          <span className="brand-mark">PB</span>
          <div>
            <strong>PuneBus</strong>
            <small>Admin Console</small>
          </div>
        </div>

        <nav className="side-nav" aria-label="Admin sections">
          {sectionIds.map((section) => {
            const labels = {
              overview: "Overview",
              "create-user": "Panel Users",
              permissions: "Permissions",
              registrations: "Registrations",
              enquiries: "Enquiries",
              directory: "Directory",
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
          <strong>{admin?.name || "Admin"}</strong>
          <small>{admin?.email || "admin account"}</small>
        </div>
      </aside>

      <section className="main-area">
        <header className="page-header">
          <div>
            <p className="eyebrow">Admin App : Port 5174</p>
            <h1>Admin Panel</h1>
          </div>
          <div className="top-actions">
            <a className="quiet-btn" href={frontendUrl}>Public Frontend</a>
            <a className="quiet-btn" href={managerUrl}>Manager App</a>
            <a className="quiet-btn" href={executorUrl}>Executor App</a>
            <button className="secondary-btn" type="button" onClick={onLogout}>
              Logout
            </button>
          </div>
        </header>

        <section className={`metrics ${activeSection === "overview" ? "active-section" : "hidden-section"}`} id="overview">
          <div className="overview-header">
            <div>
              <p className="eyebrow">Live dashboard</p>
              <h2>Core metrics</h2>
            </div>
            <span className="overview-pill">Updated just now</span>
          </div>

          <div className="metric-grid">
            {visibleStats.map(([label, value]) => (
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

        <section className={`work-grid ${activeSection === "create-user" || activeSection === "permissions" ? "active-section" : "hidden-section"}`}>
          <section className={`panel create-panel ${activeSection === "create-user" ? "active-section" : "hidden-section"}`} id="create-user">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Panel Users</p>
                <h2>Add User</h2>
              </div>
            </div>
            <form className="form-grid" onSubmit={createUser}>
              <label className="field">
                Role
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  {CREATE_PANEL_ROLES.map((role) => (
                    <option key={role} value={role}>{roleLabels[role]}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                Name
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </label>
              <label className="field">
                Phone
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              </label>
              <label className="field">
                Email
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </label>
              <label className="field">
                Password
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
              </label>
              <label className="field">
                Address
                <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </label>
              <button className="primary-btn submit-btn" type="submit">Create User</button>
            </form>
            {message && (
              <p className={`message ${message.includes("success") ? "success" : "error"}`}>
                {message}
              </p>
            )}
          </section>

          <section className={`panel access-panel ${activeSection === "permissions" ? "active-section" : "hidden-section"}`} id="permissions">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Access Control</p>
                <h2>Panel Permissions</h2>
              </div>
            </div>
            <div className="permission-grid">
              {CONFIG_ROLES.map((role) => {
                const roleConfig = panelConfigs[role] || defaultPanelConfig(role);

                return (
                  <div className="permission-column" key={role}>
                    <h3>{roleLabels[role]}</h3>
                    <div className="option-group">
                      <p className="option-title">Visible Sections</p>
                      {PANEL_SECTIONS.map((section) => (
                        <label className="check-row" key={section.id}>
                          <input
                            type="checkbox"
                            checked={roleConfig.visibleSections.includes(section.id)}
                            onChange={() => togglePanelConfig(role, "visibleSections", section.id)}
                          />
                          <span>{section.label}</span>
                        </label>
                      ))}
                    </div>
                    <div className="option-group">
                      <p className="option-title">Access Items</p>
                      {(PANEL_PERMISSIONS[role] || []).map((permission) => (
                        <label className="check-row" key={permission}>
                          <input
                            type="checkbox"
                            checked={roleConfig.permissions.includes(permission)}
                            onChange={() => togglePanelConfig(role, "permissions", permission)}
                          />
                          <span>{permission}</span>
                        </label>
                      ))}
                    </div>
                    <button
                      className="primary-btn"
                      disabled={configLoading}
                      type="button"
                      onClick={() => savePanelConfig(role)}
                    >
                      Save {roleLabels[role]}
                    </button>
                  </div>
                );
              })}
            </div>
            {configMessage && (
              <p className={`message ${configMessage.includes("saved") ? "success" : "error"}`}>
                {configMessage}
              </p>
            )}
          </section>
        </section>

        <section className={`table-wrap ${activeSection === "registrations" ? "active-section" : "hidden-section"}`} id="registrations">
          <div className="table-head">
            <div>
              <p className="eyebrow">Provider And Business</p>
              <h2>Registrations</h2>
            </div>
            <button className="quiet-btn" type="button" onClick={loadProviders}>Refresh</button>
          </div>
          {providerMessage && (
            <p className={`message table-message ${providerMessage.includes("Unable") ? "error" : "success"}`}>
              {providerMessage}
            </p>
          )}
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Business</th>
                  <th>Type</th>
                  <th>Contact</th>
                  <th>Services</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {providerLoading ? (
                  <tr><td colSpan="6">Loading...</td></tr>
                ) : providers.length === 0 ? (
                  <tr><td colSpan="6">No registrations found.</td></tr>
                ) : (
                  providers.map((provider) => (
                    <tr key={provider._id}>
                      <td>
                        <strong>{provider.name}</strong>
                        <small>{provider.address || provider.providerDescription || "-"}</small>
                      </td>
                      <td><span className="role-pill">{roleLabels[provider.role] || provider.role}</span></td>
                      <td>
                        <strong>{provider.phone}</strong>
                        <small>{provider.email || "No email"}</small>
                      </td>
                      <td>{(provider.providerServices || []).join(", ") || "-"}</td>
                      <td><span className={`status-pill status-${provider.approvalStatus}`}>{approvalLabels[provider.approvalStatus] || provider.approvalStatus}</span></td>
                      <td>
                        <div className="row-actions">
                          {provider.approvalStatus !== "approved" && (
                            <button className="primary-btn small-btn" type="button" onClick={() => approveProvider(provider)}>
                              Approve
                            </button>
                          )}
                          {provider.approvalStatus !== "rejected" && (
                            <button className="danger-btn small-btn" type="button" onClick={() => rejectProvider(provider)}>
                              Reject
                            </button>
                          )}
                          <button className="danger-btn small-btn" type="button" onClick={() => deleteProvider(provider)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className={`table-wrap ${activeSection === "enquiries" ? "active-section" : "hidden-section"}`} id="enquiries">
          <div className="table-head">
            <div>
              <p className="eyebrow">Customer Requests</p>
              <h2>Enquiries</h2>
            </div>
            <button className="quiet-btn" type="button" onClick={loadEnquiries}>Refresh</button>
          </div>
          {enquiryMessage && (
            <p className={`message table-message ${enquiryMessage.includes("Unable") || enquiryMessage.includes("Please") ? "error" : "success"}`}>
              {enquiryMessage}
            </p>
          )}
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Company</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Response</th>
                </tr>
              </thead>
              <tbody>
                {enquiryLoading ? (
                  <tr><td colSpan="5">Loading...</td></tr>
                ) : enquiries.length === 0 ? (
                  <tr><td colSpan="5">No enquiries found.</td></tr>
                ) : (
                  enquiries.map((enquiry) => (
                    <tr key={enquiry._id}>
                      <td>
                        <strong>{enquiry.contactPersonName || "-"}</strong>
                        <small>{enquiry.contactNo || "-"}</small>
                        <small>{enquiry.email || "No email"}</small>
                      </td>
                      <td>
                        <strong>{enquiry.companyName || "-"}</strong>
                        <small>{enquiry.companyAddress || enquiry.address || "-"}</small>
                      </td>
                      <td><span className="role-pill">{enquiry.membership}</span></td>
                      <td><span className={`status-pill status-${enquiry.status}`}>{enquiry.status}</span></td>
                      <td className="response-cell">
                        <textarea
                          value={responseDrafts[enquiry._id] ?? enquiry.responseMessage ?? ""}
                          onChange={(e) => setResponseDrafts((current) => ({ ...current, [enquiry._id]: e.target.value }))}
                          placeholder="Write response for customer email"
                        />
                        <div className="row-actions" style={{ marginTop: "0.4rem" }}>
                          <button className="primary-btn small-btn" type="button" onClick={() => sendEnquiryResponse(enquiry)}>
                            Send Response
                          </button>
                          <button className="danger-btn small-btn" type="button" onClick={() => deleteEnquiry(enquiry)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className={`table-wrap ${activeSection === "directory" ? "active-section" : "hidden-section"}`} id="directory">
          <div className="table-head">
            <div>
              <p className="eyebrow">User Directory</p>
              <h2>{roleLabels[activeRole]} Users</h2>
            </div>
            <div className="role-tabs">
              {USER_FILTER_ROLES.map((role) => (
                <button
                  className={activeRole === role ? "tab-btn active" : "tab-btn"}
                  type="button"
                  key={role}
                  onClick={() => setActiveRole(role)}
                >
                  {roleLabels[role]}
                </button>
              ))}
            </div>
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6">Loading...</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan="6">No users found.</td></tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.phone}</td>
                      <td>{user.email || "-"}</td>
                      <td><span className="role-pill">{user.role}</span></td>
                      <td>{user.isActive ? "Active" : "Inactive"}</td>
                      <td>
                        <button className="danger-btn" type="button" onClick={() => deleteUser(user)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>

  </>);
}


export default function App() {
  const [admin, setAdmin] = useState(readAdmin);
  const token = localStorage.getItem("adminToken");

  // Handle reset password token in URL
  const resetToken = new URLSearchParams(window.location.search).get("resetToken");
  const [resetPwd, setResetPwd] = useState("");
  const [resetConfirm, setResetConfirm] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMsg, setResetMsg] = useState("");
  const [resetDone, setResetDone] = useState(false);

  const submitReset = async (e) => {
    e.preventDefault();
    if (resetPwd !== resetConfirm) {
      setResetMsg("Passwords do not match");
      return;
    }
    if (resetPwd.length < 6) {
      setResetMsg("Password must be at least 6 characters");
      return;
    }
    setResetLoading(true);
    setResetMsg("");
    try {
      const res = await api.post("/api/auth/reset-password", { token: resetToken, password: resetPwd });
      setResetMsg(res.data.message);
      setResetDone(true);
      // Clear token from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (err) {
      setResetMsg(err?.response?.data?.message || "Failed to reset password");
    } finally {
      setResetLoading(false);
    }
  };

  if (resetToken && !resetDone) {
    return (
      <main className="login-page">
        <form className="login-card" onSubmit={submitReset}>
          <p className="eyebrow">PuneBus Control</p>
          <h1>Set New Password</h1>
          <label className="field">
            New Password
            <input type="password" value={resetPwd} onChange={(e) => setResetPwd(e.target.value)} required />
          </label>
          <label className="field">
            Confirm Password
            <input type="password" value={resetConfirm} onChange={(e) => setResetConfirm(e.target.value)} required />
          </label>
          <button className="primary-btn" disabled={resetLoading} type="submit">
            {resetLoading ? "Updating..." : "Change Password"}
          </button>
          {resetMsg && (
            <p className={`message ${resetMsg.includes("success") || resetMsg.includes("updated") ? "success" : "error"}`}>
              {resetMsg}
            </p>
          )}
        </form>
      </main>
    );
  }

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setAdmin(null);
  };

  if (!token || !admin) return <Login onLogin={setAdmin} />;
  return <Dashboard admin={admin} onLogout={logout} />;
}
