import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  LogOut,
  Shield,
  TrendingUp,
  Clock,
  Lock,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Database,
  BarChart3,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  fetchAdminUsers,
  fetchPasswordLogs,
  fetchAdminStatistics,
  verifyAdminAccess,
  type AdminUser,
  type PasswordLog,
  type AdminStatistics,
} from '../services/adminApi';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';

const STRENGTH_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  very_weak: { bg: 'bg-red-950', text: 'text-red-400', border: 'border-red-700' },
  weak: { bg: 'bg-orange-950', text: 'text-orange-400', border: 'border-orange-700' },
  medium: { bg: 'bg-yellow-950', text: 'text-yellow-400', border: 'border-yellow-700' },
  strong: { bg: 'bg-green-950', text: 'text-green-400', border: 'border-green-700' },
  very_strong: { bg: 'bg-emerald-950', text: 'text-emerald-400', border: 'border-emerald-700' },
};

interface TabType {
  id: 'dashboard' | 'users' | 'logs';
  label: string;
  icon: React.ReactNode;
}

export function AdminPage() {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  // Authentication state
  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // UI state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'logs'>('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data state
  const [statistics, setStatistics] = useState<AdminStatistics | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [logs, setLogs] = useState<PasswordLog[]>([]);

  // Pagination state
  const [usersPage, setUsersPage] = useState(1);
  const [logsPage, setLogsPage] = useState(1);
  const [usersTotal, setUsersTotal] = useState(0);
  const [logsTotal, setLogsTotal] = useState(0);
  const [usersSearch, setUsersSearch] = useState('');

  const ITEMS_PER_PAGE = 20;

  /**
   * Authenticate with admin key
   */
  const handleAdminAuth = useCallback(async () => {
    if (!adminKey.trim()) {
      setAuthError('Please enter an admin key');
      return;
    }

    setAuthLoading(true);
    setAuthError(null);

    try {
      const isValid = await verifyAdminAccess(adminKey);
      if (isValid) {
        setIsAuthenticated(true);
        // Load initial data
        await loadStatistics(adminKey);
      } else {
        setAuthError('Invalid admin key');
      }
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  }, [adminKey]);

  /**
   * Load statistics
   */
  const loadStatistics = useCallback(async (key?: string) => {
    try {
      const stats = await fetchAdminStatistics(key || adminKey);
      setStatistics(stats);
    } catch (err) {
      console.error('Failed to load statistics:', err);
    }
  }, [adminKey]);

  /**
   * Load users
   */
  const loadUsers = useCallback(async (page: number, search?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchAdminUsers(page, ITEMS_PER_PAGE, search, adminKey);
      setUsers(response.data);
      setUsersTotal(response.total);
      setUsersPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [adminKey]);

  /**
   * Load password logs
   */
  const loadLogs = useCallback(async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchPasswordLogs(page, ITEMS_PER_PAGE, undefined, undefined, undefined, adminKey);
      setLogs(response.data);
      setLogsTotal(response.total);
      setLogsPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load logs');
    } finally {
      setLoading(false);
    }
  }, [adminKey]);

  /**
   * Clear admin session on page unload/close
   * Ensures user is logged out when browser closes or page refreshes
   */
  useEffect(() => {
    const handleBeforeUnload = () => {
      setIsAuthenticated(false);
      setAdminKey('');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  /**
   * Load data when authenticated
   */
  useEffect(() => {
    if (isAuthenticated) {
      loadStatistics();
      loadUsers(1);
      loadLogs(1);
    }
  }, [isAuthenticated, loadStatistics, loadUsers, loadLogs]);

  /**
   * Logout logic
   */
  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminKey('');
    localStorage.removeItem('admin_key');
    logout();
    navigate('/');
  };

  /**
   * Handle user search
   */
  const handleUserSearch = (query: string) => {
    setUsersSearch(query);
    setUsersPage(1);
    loadUsers(1, query);
  };

  const tabs: TabType[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'users', label: 'Users', icon: <Users className="w-4 h-4" /> },
    { id: 'logs', label: 'Logs', icon: <Database className="w-4 h-4" /> },
  ];

  // Not logged in redirect
  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--destructive)' }} />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You must be logged in to access the admin panel</p>
          <Button onClick={() => navigate('/login')}>Go to Login</Button>
        </div>
      </div>
    );
  }

  // Admin authentication screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--background)' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-8 rounded-lg border"
          style={{
            background: 'var(--card)',
            borderColor: 'var(--border)',
          }}
        >
          <div className="flex items-center justify-center mb-6">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center mr-3"
              style={{
                background: 'rgba(0, 200, 255, 0.1)',
                border: '1px solid rgba(0, 200, 255, 0.4)',
                boxShadow: '0 0 12px rgba(0, 200, 255, 0.2)',
              }}
            >
              <Shield className="w-6 h-6" style={{ color: '#00c8ff' }} />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Admin Access</h1>
          </div>

          <p className="text-center mb-6" style={{ color: 'var(--muted-foreground)' }}>
            Enter your admin key to access the dashboard
          </p>

          {authError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded mb-4 border"
              style={{
                borderColor: '#ff6b6b',
                background: 'rgba(255, 107, 107, 0.1)',
                color: '#ff6b6b',
              }}
            >
              {authError}
            </motion.div>
          )}

          <Input
            type="password"
            placeholder="Enter admin key"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAdminAuth()}
            disabled={authLoading}
            className="mb-4"
            style={{
              background: 'var(--input)',
              border: '1px solid var(--border)',
              color: 'var(--foreground)',
            }}
          />

          <Button
            onClick={handleAdminAuth}
            disabled={authLoading}
            className="w-full font-semibold"
            style={{
              background: 'rgba(0, 200, 255, 0.2)',
              border: '1px solid rgba(0, 200, 255, 0.4)',
              color: '#00c8ff',
            }}
          >
            {authLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Shield className="w-4 h-4 mr-2" />
            )}
            Verify Access
          </Button>
        </motion.div>
      </div>
    );
  }

  // Calculate pagination
  const usersTotalPages = Math.ceil(usersTotal / ITEMS_PER_PAGE);
  const logsTotalPages = Math.ceil(logsTotal / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: 'var(--background)' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background: 'rgba(0, 200, 255, 0.1)',
                border: '1px solid rgba(0, 200, 255, 0.4)',
                boxShadow: '0 0 12px rgba(0, 200, 255, 0.2)',
              }}
            >
              <Shield className="w-6 h-6" style={{ color: '#00c8ff' }} />
            </div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>Admin Dashboard</h1>
            <Badge 
              style={{ 
                background: 'rgba(0, 200, 255, 0.2)', 
                color: '#00c8ff',
                border: '1px solid rgba(0, 200, 255, 0.4)',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.75rem',
              }}
            >
              🔒 Admin Only
            </Badge>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="gap-2"
            style={{
              background: 'rgba(255, 107, 107, 0.05)',
              border: '1px solid rgba(255, 107, 107, 0.3)',
              color: '#ff6b6b',
            }}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground">
          <span>Home</span>
          <span className="mx-2">/</span>
          <span>Admin Dashboard</span>
        </div>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-lg border border-destructive bg-destructive/10 text-destructive mb-6"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Error</h3>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex gap-2 border-b" style={{ borderColor: 'var(--border)' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-accent border-b-2 font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              style={{
                borderBottomColor: activeTab === tab.id ? 'var(--accent)' : 'transparent',
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Statistics Cards */}
          {statistics && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                {
                  label: 'Total Users',
                  value: statistics.total_users,
                  icon: <Users className="w-6 h-6" />,
                },
                {
                  label: 'Total Analyses',
                  value: statistics.total_analyses,
                  icon: <Database className="w-6 h-6" />,
                },
                {
                  label: 'Avg Entropy',
                  value: statistics.avg_entropy.toFixed(2),
                  icon: <TrendingUp className="w-6 h-6" />,
                },
                {
                  label: 'Bits/Char',
                  value: `${(statistics.avg_entropy / 8).toFixed(2)}`,
                  icon: <BarChart3 className="w-6 h-6" />,
                },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-6 rounded-lg border"
                  style={{
                    background: 'var(--card)',
                    borderColor: 'var(--border)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <div style={{ color: 'var(--accent)' }}>{stat.icon}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Strength Distribution */}
          {statistics && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-lg border"
              style={{
                background: 'var(--card)',
                borderColor: 'var(--border)',
              }}
            >
              <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--foreground)' }}>Password Strength Distribution</h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {Object.entries(statistics.strength_distribution).map(([level, count]) => (
                  <div key={level} className="text-center">
                    <div
                      className={`text-3xl font-bold mb-2 ${STRENGTH_COLORS[level]?.text || 'text-gray-400'}`}
                    >
                      {count}
                    </div>
                    <p className="text-sm text-muted-foreground capitalize">
                      {level.replace('_', ' ')}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex gap-2 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
              <Input
                placeholder="Search by username or email..."
                value={usersSearch}
                onChange={(e) => handleUserSearch(e.target.value)}
                className="pl-10"
                style={{
                  background: 'var(--input)',
                  border: '1px solid var(--border)',
                  color: 'var(--foreground)',
                }}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadUsers(usersPage, usersSearch)}
              disabled={loading}
              style={{
                background: 'rgba(0, 200, 255, 0.05)',
                border: '1px solid rgba(0, 200, 255, 0.3)',
                color: '#00c8ff',
              }}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Password</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((u, idx) => (
                    <motion.tr
                      key={u.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-accent/50 transition-colors"
                    >
                      <TableCell className="font-mono text-sm">{u.id}</TableCell>
                      <TableCell className="font-semibold">{u.username}</TableCell>
                      <TableCell className="text-sm">{u.email || '-'}</TableCell>
                      <TableCell className="font-mono text-sm break-all">{u.password}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(u.created_at).toLocaleDateString()}
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Showing {users.length === 0 ? 0 : (usersPage - 1) * ITEMS_PER_PAGE + 1}-
              {Math.min(usersPage * ITEMS_PER_PAGE, usersTotal)} of {usersTotal}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadUsers(usersPage - 1, usersSearch)}
                disabled={usersPage === 1 || loading}
                style={{
                  background: 'rgba(0, 200, 255, 0.05)',
                  border: '1px solid rgba(0, 200, 255, 0.3)',
                  color: '#00c8ff',
                }}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadUsers(usersPage + 1, usersSearch)}
                disabled={usersPage >= usersTotalPages || loading}
                style={{
                  background: 'rgba(0, 200, 255, 0.05)',
                  border: '1px solid rgba(0, 200, 255, 0.3)',
                  color: '#00c8ff',
                }}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Logs Tab */}
      {activeTab === 'logs' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadLogs(logsPage)}
            disabled={loading}
            style={{
              background: 'rgba(0, 200, 255, 0.05)',
              border: '1px solid rgba(0, 200, 255, 0.3)',
              color: '#00c8ff',
            }}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>

          <div className="rounded-lg border overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Password</TableHead>
                  <TableHead>Strength</TableHead>
                  <TableHead>Entropy</TableHead>
                  <TableHead>Crack Time</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log, idx) => (
                    <motion.tr
                      key={log.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-accent/50 transition-colors"
                    >
                      <TableCell className="font-mono text-sm">{log.id}</TableCell>
                      <TableCell className="font-mono text-sm">{log.user_id}</TableCell>
                      <TableCell className="font-mono text-xs">{log.masked_password}</TableCell>
                      <TableCell>
                        <Badge
                          className={`${STRENGTH_COLORS[log.strength]?.bg} ${STRENGTH_COLORS[log.strength]?.text}`}
                        >
                          {log.strength.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {log.entropy.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-sm">{log.crack_time}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(log.created_at).toLocaleDateString()}
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Showing {logs.length === 0 ? 0 : (logsPage - 1) * ITEMS_PER_PAGE + 1}-
              {Math.min(logsPage * ITEMS_PER_PAGE, logsTotal)} of {logsTotal}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadLogs(logsPage - 1)}
                disabled={logsPage === 1 || loading}
                style={{
                  background: 'rgba(0, 200, 255, 0.05)',
                  border: '1px solid rgba(0, 200, 255, 0.3)',
                  color: '#00c8ff',
                }}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadLogs(logsPage + 1)}
                disabled={logsPage >= logsTotalPages || loading}
                style={{
                  background: 'rgba(0, 200, 255, 0.05)',
                  border: '1px solid rgba(0, 200, 255, 0.3)',
                  color: '#00c8ff',
                }}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
