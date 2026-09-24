import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  AlertTriangle,
  CreditCard,
  FileText,
  UserCheck,
  UserX,
  LogOut,
  Search,
  CheckCircle,
  RefreshCw,
  Eye,
  AlertCircle,
  Activity,
  Crown,
  Settings,
  Save,
  DollarSign,
  BarChart3
} from 'lucide-react';

// Set VITE_API_BASE in admin-client/.env for anything other than local dev
// (e.g. your deployed Cloud Run / Render URL + '/api/admin').
const API_BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/admin`;

interface DashboardStats {
  totalUsers: number;
  totalProfiles: number;
  loggedInUsers: number;
  activeUsers: number;
  newUsersLast7Days: number;
  totalMatches: number;
  totalReports: number;
  pendingReports: number;
  suspendedUsers: number;
  bannedUsers: number;
  premiumUsers: number;
  vipSubscriptions: number;
  proSubscriptions: number;
  totalRevenue: number;
  dailyRevenue: number;
  revenueByDay: { date: string; revenue: number }[];
  recentActivity: { type: string; title: string; detail: string; timestamp: string }[];
  totalTransactions: number;
  totalTransactionAmount: number;
}

interface UserSummary {
  id: string;
  name: string;
  email: string;
  suspended: boolean;
  banned: boolean;
  deleted: boolean;
  isPremium: boolean;
  status: string;
  warned: boolean;
  warningReason?: string;
  online?: boolean;
  lastSignInAt?: string;
}

interface UserDetail extends UserSummary {
  gender?: string;
  location?: string;
  bio?: string;
  photos?: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface SafetyReport {
  id: string;
  reporterUserId: string;
  reportedUserId: string;
  reason: string;
  details?: string;
  status: 'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
  resolvedAt?: string;
  moderationAction?: string;
  resolutionNote?: string;
}

interface AuditLog {
  id: string;
  timestamp: string;
  adminUid: string;
  action: string;
  targetUserId: string;
  details: string;
}

interface TransactionStats {
  totalTransactions: number;
  totalAmount: number;
  dailyAmount: number;
  revenueByDay: { date: string; revenue: number }[];
}

interface PricingSettings {
  chatPerMinuteInr: number;
  audioCallPerMinuteCoins: number;
  videoCallPerMinuteCoins: number;
  proPriceInr: number;
  vipPriceInr: number;
  gameChargeCoins?: number;
  normalGameChargeCoins: number;
  interestingGameChargeCoins: number;
}

export interface AdminPanelUser { uid: string; email: string | null; }

const RevenueChart: React.FC<{ data: { date: string; revenue: number }[] }> = ({ data }) => {
  const width = 700;
  const height = 230;
  const pad = { left: 42, right: 18, top: 18, bottom: 34 };
  const values = data.map(d => d.revenue);
  const max = Math.max(1, ...values);
  const points = data.map((d, i) => {
    const x = pad.left + (i * (width - pad.left - pad.right)) / Math.max(1, data.length - 1);
    const y = pad.top + (height - pad.top - pad.bottom) * (1 - d.revenue / max);
    return { ...d, x, y };
  });
  const polyline = points.map(p => `${p.x},${p.y}`).join(' ');
  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', minWidth: 560, height: 230 }} role="img" aria-label="Revenue for the last seven days">
        {[0, .5, 1].map((ratio) => {
          const y = pad.top + (height - pad.top - pad.bottom) * ratio;
          const value = Math.round(max * (1 - ratio));
          return <g key={ratio}><line x1={pad.left} x2={width-pad.right} y1={y} y2={y} stroke="#334155" strokeWidth="1" /><text x={4} y={y+4} fill="#64748b" fontSize="10">₹{value}</text></g>;
        })}
        {points.length > 1 && <polyline fill="none" stroke="#ec4899" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={polyline} />}
        {points.map((p) => <g key={p.date}><circle cx={p.x} cy={p.y} r="4" fill="#0f172a" stroke="#ec4899" strokeWidth="2" /><text x={p.x} y={height-12} textAnchor="middle" fill="#64748b" fontSize="9">{new Date(p.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}</text></g>)}
      </svg>
    </div>
  );
};

export const AdminPanel: React.FC<{ currentUser: AdminPanelUser; idToken: string; onLogout?: () => void }> = ({ currentUser, idToken, onLogout }) => {
  // Active Tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'payments' | 'pricing'>('dashboard');

  // Data states
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [paymentStats, setPaymentStats] = useState<TransactionStats | null>(null);
  const [pricing, setPricing] = useState<PricingSettings>({ chatPerMinuteInr: 3, audioCallPerMinuteCoins: 20, videoCallPerMinuteCoins: 40, proPriceInr: 345, vipPriceInr: 789, gameChargeCoins: 39, normalGameChargeCoins: 39, interestingGameChargeCoins: 49 });
  const [savingPricing, setSavingPricing] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // User Moderation Form states
  const [modReason, setModReason] = useState('');
  const [modUserTarget, setModUserTarget] = useState<UserSummary | null>(null);
  const [modActionType, setModActionType] = useState<'warn' | 'suspend' | 'ban' | 'delete' | null>(null);

  useEffect(() => {
    if (idToken) {
      fetchDataForTab(activeTab);
    }
  }, [idToken, activeTab]);

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${idToken}`
  });

  const handleLogout = () => { if (onLogout) onLogout(); };

  const fetchDataForTab = async (tab: string) => {
    if (!idToken) return;
    setLoadingData(true);
    setActionError(null);

    try {
      if (tab === 'dashboard') {
        const res = await fetch(`${API_BASE}/dashboard`, { headers: authHeaders() });
        if (res.status === 403) throw new Error('403 Forbidden: You do not have Administrator claims (admin: true).');
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        const data = await res.json();
        setStats(data);
      } else if (tab === 'users') {
        const url = searchQuery
          ? `${API_BASE}/users?search=${encodeURIComponent(searchQuery)}`
          : `${API_BASE}/users`;
        const res = await fetch(url, { headers: authHeaders() });
        if (res.status === 403) throw new Error('403 Forbidden: Admin claim required.');
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        const data = await res.json();
        setUsers(data.items || []);
      } else if (tab === 'payments') {
        const res = await fetch(`${API_BASE}/payments`, { headers: authHeaders() });
        if (res.status === 403) throw new Error('403 Forbidden: Admin claim required.');
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        const data = await res.json();
        setPaymentStats(data);
      } else if (tab === 'pricing') {
        const res = await fetch(`${API_BASE}/pricing`, { headers: authHeaders() });
        if (res.status === 403) throw new Error('403 Forbidden: Admin claim required.');
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        setPricing(await res.json());
      }
    } catch (err: any) {
      setActionError(err.message || 'Failed to load data');
    } finally {
      setLoadingData(false);
    }
  };

  const handleFetchUserDetail = async (uid: string) => {
    try {
      const res = await fetch(`${API_BASE}/users/${uid}`, { headers: authHeaders() });
      if (!res.ok) throw new Error('Failed to fetch user details');
      const data = await res.json();
      setSelectedUser(data);
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  const handleExecuteUserModeration = async () => {
    if (!modUserTarget || !modActionType) return;
    setActionError(null);
    setActionSuccess(null);

    try {
      let endpoint = '';
      let method = 'POST';

      if (modActionType === 'warn') {
        endpoint = `${API_BASE}/users/${modUserTarget.id}/warn?reason=${encodeURIComponent(modReason || 'Policy Violation')}`;
      } else if (modActionType === 'suspend') {
        endpoint = `${API_BASE}/users/${modUserTarget.id}/suspend?suspend=${!modUserTarget.suspended}&reason=${encodeURIComponent(modReason || 'Account Suspension')}`;
      } else if (modActionType === 'ban') {
        endpoint = `${API_BASE}/users/${modUserTarget.id}/ban?ban=${!modUserTarget.banned}&reason=${encodeURIComponent(modReason || 'Account Banned')}`;
      } else if (modActionType === 'delete') {
        endpoint = `${API_BASE}/users/${modUserTarget.id}/delete`;
      }

      const res = await fetch(endpoint, { method, headers: authHeaders() });
      if (!res.ok) throw new Error(`Failed to execute ${modActionType} action`);

      setActionSuccess(`Successfully applied ${modActionType} to user ${modUserTarget.name || modUserTarget.id}`);
      setModUserTarget(null);
      setModActionType(null);
      setModReason('');
      fetchDataForTab('users');
    } catch (err: any) {
      setActionError(err.message);
    }
  };


  const savePricing = async () => {
    setSavingPricing(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      const res = await fetch(`${API_BASE}/pricing`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(pricing)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save pricing');
      setPricing(data);
      setActionSuccess('Pricing updated successfully. New chat/call/video rates will be loaded by the user app.');
    } catch (err: any) {
      setActionError(err.message || 'Failed to save pricing');
    } finally {
      setSavingPricing(false);
    }
  };

  // --- AUTHENTICATED DASHBOARD VIEW ---
  return (
    <>
      <style>{`
        .miora-admin-root { min-width: 0; }
        .miora-admin-header { gap: 16px; }
        .miora-admin-nav { overflow-x: auto; scrollbar-width: thin; }
        .miora-admin-nav button { flex: 0 0 auto; white-space: nowrap; }
        .miora-admin-table-scroll { width: 100%; -webkit-overflow-scrolling: touch; }
        .miora-admin-table-scroll table { min-width: 860px; }
        @media (max-width: 767px) {
          .miora-admin-header { height: auto !important; min-height: 76px; padding: 12px 14px !important; flex-wrap: wrap; align-items: flex-start !important; }
          .miora-admin-header > div:first-child { flex: 1 1 100%; }
          .miora-admin-header > div:last-child { width: 100%; justify-content: space-between; gap: 10px !important; }
          .miora-admin-header > div:last-child > div { min-width: 0; text-align: left !important; overflow: hidden; }
          .miora-admin-header > div:last-child > div > div:first-child { overflow-wrap: anywhere; word-break: break-word; }
          .miora-admin-header button { flex: 0 0 auto; }
          .miora-admin-nav { padding: 0 8px !important; gap: 2px !important; }
          .miora-admin-nav button { padding: 12px 13px !important; font-size: 12px !important; }
          .miora-admin-main { padding: 14px !important; max-width: 100% !important; }
          .miora-admin-main h2 { line-height: 1.25; }
          .miora-admin-table-scroll { border-radius: 10px; }
          .miora-admin-table-scroll table { min-width: 860px; }
        }
      `}</style>
      <div className="miora-admin-root" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0f172a', width: '100%', overflowX: 'hidden' }}>
      {/* HEADER */}
      <header className="miora-admin-header" style={{ height: 64, backgroundColor: '#1e293b', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Shield size={26} color="#ec4899" />
          <span style={{ fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: 0.5 }}>MIORA Admin</span>
          <span style={{ fontSize: 11, backgroundColor: 'rgba(236,72,153,0.2)', color: '#f472b6', padding: '2px 8px', borderRadius: 12, fontWeight: 600 }}>SECURE ARCHITECTURE</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ textAlign: 'right', fontSize: 13 }}>
            <div style={{ color: '#f8fafc', fontWeight: 600 }}>{currentUser.email}</div>
            <div style={{ color: '#64748b', fontSize: 11 }}>UID: {currentUser.uid.slice(0, 8)}...</div>
          </div>
          <button
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', backgroundColor: '#334155', color: '#f8fafc', borderRadius: 8, fontSize: 13, fontWeight: 500 }}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </header>

      {/* NAVIGATION TABS */}
      <nav className="miora-admin-nav" style={{ backgroundColor: '#0f172a', borderBottom: '1px solid #1e293b', padding: '0 24px', display: 'flex', gap: 8, overflowX: 'auto' }}>
        {[
          { id: 'dashboard', label: 'Overview', icon: Shield },
          { id: 'users', label: 'User Management', icon: Users },
          { id: 'payments', label: 'Payments & Revenue', icon: CreditCard },
          { id: 'pricing', label: 'Pricing Settings', icon: Settings }
        ].map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 18px',
                borderBottom: active ? '3px solid #ec4899' : '3px solid transparent',
                color: active ? '#ec4899' : '#94a3b8',
                fontWeight: active ? 600 : 500,
                fontSize: 14,
                backgroundColor: 'transparent'
              }}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* NOTIFICATION BANNERS */}
      {actionError && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', borderLeft: '4px solid #ef4444', padding: '12px 24px', color: '#fca5a5', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={18} />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} style={{ color: '#fca5a5', background: 'none' }}>✕</button>
        </div>
      )}

      {actionSuccess && (
        <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', borderLeft: '4px solid #10b981', padding: '12px 24px', color: '#6ee7b7', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle size={18} />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} style={{ color: '#6ee7b7', background: 'none' }}>✕</button>
        </div>
      )}

      {/* CONTENT AREA */}
      <main className="miora-admin-main" style={{ flex: 1, padding: 24, maxWidth: 1280, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        {loadingData ? (
          <div style={{ display: 'flex', padding: 40, justifyContent: 'center', alignItems: 'center', color: '#94a3b8' }}>
            <RefreshCw className="animate-spin" size={24} style={{ marginRight: 8 }} />
            <span>Loading telemetry & admin controls...</span>
          </div>
        ) : (
          <>
            {/* TAB 1: OVERVIEW / DASHBOARD */}
            {activeTab === 'dashboard' && stats && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div>
                    <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 5 }}>MIORA Dashboard</h2>
                    <div style={{ color: '#64748b', fontSize: 13 }}>Live platform, subscriber and revenue overview</div>
                  </div>
                  <button onClick={() => fetchDataForTab('dashboard')} style={{ padding: '8px 12px', backgroundColor: '#334155', color: '#fff', borderRadius: 8, fontSize: 12, display: 'flex', gap: 6, alignItems: 'center' }}>
                    <RefreshCw size={14} /> Refresh
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 14 }}>
                  {[
                    { title: 'Total Profiles', value: stats.totalProfiles, icon: Users, accent: '#ec4899' },
                    { title: 'Users Who Logged In', value: stats.loggedInUsers, icon: UserCheck, accent: '#10b981' },
                    { title: 'Active Accounts', value: stats.activeUsers, icon: Activity, accent: '#06b6d4' },
                    { title: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`, icon: DollarSign, accent: '#22c55e' },
                    { title: 'Daily Revenue', value: `₹${stats.dailyRevenue.toLocaleString('en-IN')}`, icon: BarChart3, accent: '#f59e0b' },
                    { title: 'VIP Subscriptions', value: stats.vipSubscriptions, icon: Crown, accent: '#eab308' },
                    { title: 'Pro Subscriptions', value: stats.proSubscriptions, icon: CreditCard, accent: '#a78bfa' },
                    { title: 'Total Transactions', value: stats.totalTransactions, icon: FileText, accent: '#38bdf8' }
                  ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <div key={i} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 18 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                          <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>{stat.title}</span>
                          <Icon size={19} color={stat.accent} />
                        </div>
                        <div style={{ fontSize: 27, fontWeight: 700, color: '#fff' }}>{stat.value}</div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(320px, 1fr)', gap: 16, marginTop: 18 }}>
                  <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
                      <div>
                        <h3 style={{ color: '#fff', fontSize: 16, margin: 0 }}>Revenue — last 7 days</h3>
                        <div style={{ color: '#64748b', fontSize: 12, marginTop: 4 }}>Successful Razorpay payments only</div>
                      </div>
                    </div>
                    <RevenueChart data={stats.revenueByDay} />
                  </div>

                  <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                      <Activity size={18} color="#ec4899" />
                      <h3 style={{ color: '#fff', fontSize: 16, margin: 0 }}>Recent Activity</h3>
                    </div>
                    <div style={{ display: 'grid', gap: 12 }}>
                      {stats.recentActivity.length === 0 && <div style={{ color: '#64748b', fontSize: 13 }}>No recent activity yet.</div>}
                      {stats.recentActivity.map((item, index) => (
                        <div key={`${item.timestamp}-${index}`} style={{ display: 'flex', gap: 10, paddingBottom: 10, borderBottom: '1px solid #334155' }}>
                          <div style={{ width: 30, height: 30, borderRadius: 8, backgroundColor: '#0f172a', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                            {item.type === 'payment' ? <DollarSign size={14} color="#22c55e" /> : item.type === 'registration' ? <UserCheck size={14} color="#38bdf8" /> : <Activity size={14} color="#ec4899" />}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ color: '#e2e8f0', fontSize: 12, fontWeight: 600 }}>{item.title}</div>
                            <div style={{ color: '#64748b', fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.detail}</div>
                            <div style={{ color: '#475569', fontSize: 10, marginTop: 2 }}>{new Date(item.timestamp).toLocaleString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: USER MANAGEMENT */}
            {activeTab === 'users' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>User Management</h2>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ position: 'relative', width: 280 }}>
                      <input
                        type="text"
                        placeholder="Search by name, email, UID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchDataForTab('users')}
                        style={{ width: '100%', padding: '8px 12px 8px 36px', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
                      />
                      <Search size={16} color="#64748b" style={{ position: 'absolute', left: 10, top: 10 }} />
                    </div>
                    <button
                      onClick={() => fetchDataForTab('users')}
                      style={{ padding: '8px 16px', backgroundColor: '#334155', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 500 }}
                    >
                      Search
                    </button>
                  </div>
                </div>

                <div className="miora-admin-table-scroll" style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 12, overflowX: 'auto', overflowY: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
                    <thead>
                      <tr style={{ backgroundColor: '#0f172a', borderBottom: '1px solid #334155', color: '#94a3b8', fontSize: 12, textTransform: 'uppercase' }}>
                        <th style={{ padding: '12px 16px' }}>User / UID</th>
                        <th style={{ padding: '12px 16px' }}>Email</th>
                        <th style={{ padding: '12px 16px' }}>Status</th>
                        <th style={{ padding: '12px 16px' }}>Warned</th>
                        <th style={{ padding: '12px 16px' }}>Plan</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id} style={{ borderBottom: '1px solid #334155', color: '#e2e8f0' }}>
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ fontWeight: 600, color: '#fff' }}>{u.name || 'Unnamed User'}</div>
                            <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'monospace' }}>{u.id}</div>
                          </td>
                          <td style={{ padding: '12px 16px' }}>{u.email || 'N/A'}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: 12,
                              fontSize: 11,
                              fontWeight: 600,
                              backgroundColor: u.banned ? 'rgba(239, 68, 68, 0.2)' : u.suspended ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                              color: u.banned ? '#fca5a5' : u.suspended ? '#fcd34d' : '#6ee7b7'
                            }}>
                              {u.banned ? 'BANNED' : u.suspended ? 'SUSPENDED' : u.deleted ? 'DELETED' : (u.online ? 'ONLINE' : 'OFFLINE')}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            {u.warned ? (
                              <span style={{ color: '#f59e0b', fontSize: 12, fontWeight: 500 }} title={u.warningReason}>Yes (Warning)</span>
                            ) : (
                              <span style={{ color: '#64748b', fontSize: 12 }}>No</span>
                            )}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            {u.isPremium ? <span style={{ color: '#eab308', fontWeight: 600, fontSize: 12 }}>PREMIUM</span> : <span style={{ color: '#94a3b8', fontSize: 12 }}>FREE</span>}
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                              <button
                                onClick={() => handleFetchUserDetail(u.id)}
                                style={{ padding: '4px 8px', backgroundColor: '#334155', color: '#fff', borderRadius: 4, fontSize: 12 }}
                                title="View Details"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                onClick={() => { setModUserTarget(u); setModActionType('warn'); }}
                                style={{ padding: '4px 8px', backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#fcd34d', borderRadius: 4, fontSize: 12 }}
                              >
                                Warn
                              </button>
                              <button
                                onClick={() => { setModUserTarget(u); setModActionType('suspend'); }}
                                style={{ padding: '4px 8px', backgroundColor: u.suspended ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.3)', color: u.suspended ? '#6ee7b7' : '#fbbf24', borderRadius: 4, fontSize: 12 }}
                              >
                                {u.suspended ? 'Unsuspend' : 'Suspend'}
                              </button>
                              <button
                                onClick={() => { setModUserTarget(u); setModActionType('ban'); }}
                                style={{ padding: '4px 8px', backgroundColor: u.banned ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: u.banned ? '#6ee7b7' : '#fca5a5', borderRadius: 4, fontSize: 12 }}
                              >
                                {u.banned ? 'Unban' : 'Ban'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeTab === 'payments' && paymentStats && (
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 20 }}>Payments & Subscriptions Telemetry</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                  <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 24 }}>
                    <div style={{ color: '#94a3b8', fontSize: 14 }}>Successful Transactions</div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: '#fff', marginTop: 8 }}>{paymentStats.totalTransactions}</div>
                  </div>
                  <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 24 }}>
                    <div style={{ color: '#94a3b8', fontSize: 14 }}>Total Revenue (INR)</div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: '#10b981', marginTop: 8 }}>₹{paymentStats.totalAmount.toLocaleString('en-IN')}</div>
                  </div>
                  <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 24 }}>
                    <div style={{ color: '#94a3b8', fontSize: 14 }}>Today's Revenue</div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: '#f59e0b', marginTop: 8 }}>₹{paymentStats.dailyAmount.toLocaleString('en-IN')}</div>
                  </div>
                </div>

                <div style={{ marginTop: 24, padding: 20, backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid #f59e0b', borderRadius: 12, color: '#fcd34d', fontSize: 13 }}>
                  <strong>Security Guarantee:</strong> Razorpay payment signatures are verified server-side before a transaction is recorded. Private key secrets are strictly kept inside server environment properties and never exposed in client endpoints.
                </div>
              </div>
            )}
            {activeTab === 'pricing' && (
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Pricing Settings</h2>
                <p style={{ color: '#64748b', fontSize: 13, marginBottom: 20 }}>Change future chat, audio-call and video-call rates from the admin panel. Values are stored securely in Firestore and loaded by the user app.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                  {[
                    { key: 'chatPerMinuteInr', label: 'Chat — ₹ per minute', help: 'Wallet charge while chat billing is active.' },
                    { key: 'audioCallPerMinuteCoins', label: 'Audio call — coins/min', help: 'Recalculates the 1/5/10/30/60 minute audio packages.' },
                    { key: 'videoCallPerMinuteCoins', label: 'Video call — coins/min', help: 'Recalculates the 1/5/10/30/60 minute video packages.' },
                    { key: 'proPriceInr', label: 'PRO — ₹ / 28 days', help: 'Updates the live PRO subscription price used by Razorpay.' },
                    { key: 'vipPriceInr', label: 'VIP — ₹ / 28 days', help: 'Updates the live VIP subscription price used by Razorpay.' },
                    { key: 'normalGameChargeCoins', label: 'Normal Games — ₹ / game', help: 'Standard couple games. Default ₹39.' },
                    { key: 'interestingGameChargeCoins', label: 'Interesting Games — ₹ / game', help: 'Premium/interesting couple games. Default ₹49.' }
                  ].map(field => (
                    <div key={field.key} style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: 20 }}>
                      <label style={{ display: 'block', color: '#e2e8f0', fontWeight: 600, fontSize: 14, marginBottom: 8 }}>{field.label}</label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={(pricing as any)[field.key]}
                        onChange={(e) => setPricing(prev => ({ ...prev, [field.key]: Number(e.target.value) }))}
                        style={{ width: '100%', boxSizing: 'border-box', padding: '11px 12px', backgroundColor: '#0f172a', border: '1px solid #475569', borderRadius: 8, color: '#fff', fontSize: 16 }}
                      />
                      <div style={{ color: '#64748b', fontSize: 11, marginTop: 8 }}>{field.help}</div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={savePricing}
                  disabled={savingPricing}
                  style={{ marginTop: 18, padding: '10px 18px', backgroundColor: '#ec4899', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 7, opacity: savingPricing ? 0.7 : 1 }}
                >
                  <Save size={16} /> {savingPricing ? 'Saving...' : 'Save Pricing'}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* MODAL: MODERATION ACTION */}
      {modUserTarget && modActionType && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}>
          <div style={{ width: '100%', maxWidth: 440, backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 12, textTransform: 'capitalize' }}>
              Confirm {modActionType} for {modUserTarget.name || modUserTarget.id}
            </h3>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#cbd5e1', marginBottom: 6 }}>Reason / Note</label>
              <textarea
                value={modReason}
                onChange={(e) => setModReason(e.target.value)}
                placeholder="Enter reason for this action..."
                style={{ width: '100%', height: 80, padding: 10, backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#fff', fontSize: 13 }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button
                onClick={() => { setModUserTarget(null); setModActionType(null); }}
                style={{ padding: '8px 16px', backgroundColor: '#334155', color: '#fff', borderRadius: 6, fontSize: 13 }}
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteUserModeration}
                style={{ padding: '8px 16px', backgroundColor: modActionType === 'ban' ? '#ef4444' : '#f59e0b', color: '#fff', borderRadius: 6, fontSize: 13, fontWeight: 600 }}
              >
                Execute {modActionType}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* MODAL: USER DETAILS */}
      {selectedUser && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}>
          <div style={{ width: '100%', maxWidth: 520, backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 12 }}>User Profile Inspector</h3>

            <div style={{ backgroundColor: '#0f172a', padding: 16, borderRadius: 12, fontSize: 13, color: '#cbd5e1', display: 'grid', gap: 8 }}>
              <div><strong>UID:</strong> <span style={{ fontFamily: 'monospace' }}>{selectedUser.id}</span></div>
              <div><strong>Name:</strong> {selectedUser.name || 'N/A'}</div>
              <div><strong>Email:</strong> {selectedUser.email || 'N/A'}</div>
              <div><strong>Gender:</strong> {selectedUser.gender || 'N/A'}</div>
              <div><strong>Location:</strong> {selectedUser.location || 'N/A'}</div>
              <div><strong>Bio:</strong> {selectedUser.bio || 'N/A'}</div>
              <div><strong>Account Status:</strong> <span style={{ color: selectedUser.banned ? '#f87171' : selectedUser.suspended ? '#fcd34d' : '#4ade80', fontWeight: 600 }}>{selectedUser.status || (selectedUser.banned ? 'BANNED' : selectedUser.suspended ? 'SUSPENDED' : 'ACTIVE')}</span></div>
              <div><strong>Warning Status:</strong> {selectedUser.warned ? `YES (${selectedUser.warningReason})` : 'NO'}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
              <button
                onClick={() => setSelectedUser(null)}
                style={{ padding: '8px 16px', backgroundColor: '#ec4899', color: '#fff', borderRadius: 6, fontSize: 13, fontWeight: 600 }}
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};
