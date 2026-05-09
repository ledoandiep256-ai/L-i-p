import React, { useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { 
  Users, 
  UserPlus, 
  Building2, 
  LayoutDashboard, 
  Search, 
  LogOut, 
  ChevronRight, 
  Phone, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  QrCode, 
  Download, 
  Printer,
  X,
  Plus,
  Edit2,
  Trash2,
  Filter,
  CheckCircle2,
  AlertCircle,
  Menu,
  ChevronDown,
  Settings,
  Key,
  Camera,
  Eye,
  EyeOff,
  Save,
  Check
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatDate } from './lib/utils';
import { User, Branch, Member, UserRole } from './types';

// --- INITIAL MOCK DATA ---
const APP_LOGO = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Logo_H%E1%BB%99i_C%E1%BB%B1u_chi%E1%BA%BFn_binh_Vi%E1%BB%87t_Nam.svg/512px-Logo_H%E1%BB%99i_C%E1%BB%B1u_chi%E1%BA%BFn_binh_Vi%E1%BB%87t_Nam.svg.png";

const INITIAL_BRANCHES: Branch[] = [
  // Empty as requested
];

const INITIAL_USERS: User[] = [];

const INITIAL_MEMBERS: Member[] = [];

// --- COMPONENTS ---

const LoginPage = ({ onLogin, users, onRegister, onResetPassword }: { 
  onLogin: (user: User) => void, 
  users: User[],
  onRegister: (user: User) => void,
  onResetPassword: (emailOrPhone: string, newPass: string) => boolean
}) => {
  const [view, setView] = useState<'login' | 'register' | 'forgotPassword'>('login');
  
  // Login states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Register states
  const [regUnit, setRegUnit] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  
  // Forgot password states
  const [forgotContact, setForgotContact] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showResetNewPassword, setShowResetNewPassword] = useState(false);
  const [showResetConfirmPassword, setShowResetConfirmPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Giả định: Tài khoản Chi hội trưởng là số điện thoại (bắt đầu bằng số)
  const isBranchLeader = username.length > 0 && /^\d/.test(username);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json();
        onLogin(data.user);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Tài khoản hoặc mật khẩu không đúng');
      }
    } catch (err) {
      setError('Lỗi kết nối máy chủ');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const newUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      name: regUnit,
      unitName: regUnit,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
      role: 'ADMIN'
    };

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      if (response.ok) {
        setSuccess('Đăng ký thành công! Vui lòng đăng nhập.');
        setView('login');
        setUsername(regEmail || regPhone);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Lỗi đăng ký');
      }
    } catch (err) {
      setError('Lỗi kết nối máy chủ');
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact: forgotContact, newPassword })
      });

      if (response.ok) {
        setSuccess('Đổi mật khẩu thành công! Vui lòng đăng nhập.');
        setView('login');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Thông tin xác thực không tìm thấy');
      }
    } catch (err) {
      setError('Lỗi kết nối máy chủ');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="vn-gradient p-8 text-center text-white">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden border-4 border-vietnam-yellow/50 shadow-lg p-1">
            <img src={APP_LOGO} alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-tight">Hội Cựu Chiến Binh</h1>
          <p className="text-vietnam-yellow/90 font-medium tracking-wide">PHẦN MỀM QUẢN LÝ HỘI VIÊN</p>
        </div>
        
        <div className="p-8">
          <AnimatePresence mode="wait">
            {view === 'login' && (
              <motion.form 
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleLogin} 
                className="space-y-6"
              >
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                  </div>
                )}
                {success && (
                  <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg flex items-center gap-2 text-sm font-bold">
                    <CheckCircle2 size={18} />
                    <span>{success}</span>
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">TÀI KHOẢN (EMAIL/SĐT)</label>
                  <input 
                    type="text" 
                    className="w-full"
                    placeholder="Vd: hoiccbayun@gmail.com"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">MẬT KHẨU</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      className="w-full pr-12"
                      placeholder="••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-vietnam-red"
                    >
                      {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <button 
                    type="button" 
                    onClick={() => setView('forgotPassword')}
                    className="text-vietnam-red font-bold hover:underline"
                  >
                    Quên mật khẩu?
                  </button>
                </div>

                <button 
                  type="submit" 
                  className="w-full vn-gradient text-white font-black py-4 rounded-lg shadow-lg hover:shadow-vietnam-red/20 text-lg uppercase"
                >
                  ĐĂNG NHẬP
                </button>

                <div className="text-center pt-2">
                  <p className="text-slate-500 mb-2">Chưa có tài khoản?</p>
                  <button 
                    type="button" 
                    onClick={() => setView('register')}
                    className="text-lg font-black text-vietnam-red hover:underline uppercase tracking-tight"
                  >
                    ĐĂNG KÝ TÀI KHOẢN
                  </button>
                </div>
              </motion.form>
            )}

            {view === 'register' && (
              <motion.form 
                key="register"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleRegister} 
                className="space-y-4"
              >
                <h2 className="text-xl font-black text-slate-800 uppercase mb-4 text-center">ĐĂNG KÝ CẤP XÃ/PHƯỜNG</h2>
                
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Tên đơn vị Xã/Phường</label>
                  <input 
                    type="text" 
                    className="w-full"
                    placeholder="Vd: Xã Liên Ninh"
                    value={regUnit}
                    onChange={(e) => setRegUnit(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Email</label>
                    <input 
                      type="email" 
                      className="w-full"
                      placeholder="Vd: lienninh@gmail.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Số điện thoại</label>
                    <input 
                      type="tel" 
                      className="w-full"
                      placeholder="Vd: 0987..."
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Mật khẩu</label>
                  <div className="relative">
                    <input 
                      type={showRegPassword ? "text" : "password"} 
                      className="w-full pr-12"
                      placeholder="••••••"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-vietnam-red"
                    >
                      {showRegPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full vn-gradient text-white font-black py-4 rounded-lg shadow-lg mt-4 uppercase"
                >
                  TẠO TÀI KHOẢN
                </button>

                <button 
                  type="button" 
                  onClick={() => setView('login')}
                  className="w-full text-slate-500 font-bold hover:text-slate-800 transition-colors py-2"
                >
                  QUAY LẠI ĐĂNG NHẬP
                </button>
              </motion.form>
            )}

            {view === 'forgotPassword' && (
              <motion.form 
                key="forgot"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleReset} 
                className="space-y-4"
              >
                <h2 className="text-xl font-black text-slate-800 uppercase mb-4 text-center">QUÊN MẬT KHẨU</h2>
                
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center gap-2 text-sm">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Email hoặc Số điện thoại đã đăng ký</label>
                  <input 
                    type="text" 
                    className="w-full"
                    placeholder="Nhập Email hoặc SĐT"
                    value={forgotContact}
                    onChange={(e) => setForgotContact(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Mật khẩu mới</label>
                  <div className="relative">
                    <input 
                      type={showResetNewPassword ? "text" : "password"} 
                      className="w-full pr-12"
                      placeholder="••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowResetNewPassword(!showResetNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-vietnam-red"
                    >
                      {showResetNewPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Xác nhận mật khẩu mới</label>
                  <div className="relative">
                    <input 
                      type={showResetConfirmPassword ? "text" : "password"} 
                      className="w-full pr-12"
                      placeholder="••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setShowResetConfirmPassword(!showResetConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-vietnam-red"
                    >
                      {showResetConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full vn-gradient text-white font-black py-4 rounded-lg shadow-lg mt-4 uppercase"
                >
                  CẤP LẠI MẬT KHẨU
                </button>

                <button 
                  type="button" 
                  onClick={() => setView('login')}
                  className="w-full text-slate-500 font-bold hover:text-slate-800 transition-colors py-2"
                >
                  QUAY LẠI ĐĂNG NHẬP
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'members' | 'branches' | 'reports' | 'settings'>('dashboard');
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Temporary settings states
  const [tempName, setTempName] = useState('');
  const [tempUnitName, setTempUnitName] = useState('');
  const [tempAvatarUrl, setTempAvatarUrl] = useState('');
  const [tempCurrentPassword, setTempCurrentPassword] = useState('');
  const [tempNewPassword, setTempNewPassword] = useState('');
  const [tempConfirmPassword, setTempConfirmPassword] = useState('');
  const [settingsStatus, setSettingsStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [showSaveToast, setShowSaveToast] = useState(false);

  const [isAddingBranch, setIsAddingBranch] = useState(false);
  const [newBranch, setNewBranch] = useState({ name: '', managerName: '', phone: '' });

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const isInitialMount = React.useRef(true);

  // --- API DATA HELPERS ---
  const fetchData = async (unitId?: string) => {
    try {
      const url = unitId ? `/api/data?unitId=${unitId}` : '/api/data';
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        
        if (data.users) {
          setUsers(data.users);
        }
        
        if (unitId) {
          const serverBranches = data.branches || [];
          const serverMembers = data.members || [];
          
          setBranches(prev => JSON.stringify(prev) === JSON.stringify(serverBranches) ? prev : serverBranches);
          setMembers(prev => JSON.stringify(prev) === JSON.stringify(serverMembers) ? prev : serverMembers);
          setIsDataLoaded(true);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const syncDataToServer = async (newData: { 
    branches?: Branch[], 
    members?: Member[], 
    users?: User[] 
  }) => {
    // Determine the unitId for filtering on server
    const activeUnitId = currentUser?.role === 'ADMIN' ? currentUser.id : currentUser?.unitId;

    // Only sync if we have successfully loaded data from the server or explicitly syncing users
    if (!isDataLoaded && !newData.users) return;
    if (!activeUnitId && !newData.users) return;

    try {
      await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newData, unitId: activeUnitId })
      });

      // Keep local backup as fallback
      if (newData.members) localStorage.setItem('vma_members', JSON.stringify(newData.members));
      if (newData.branches) localStorage.setItem('vma_branches', JSON.stringify(newData.branches));
      if (newData.users) localStorage.setItem('vma_users', JSON.stringify(newData.users));
    } catch (error) {
      console.error("Error syncing data:", error);
    }
  };

  // Initialize data and Polling
  useEffect(() => {
    const savedUser = localStorage.getItem('vma_auth');
    
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setCurrentUser(parsedUser);
      setTempName(parsedUser.name || '');
      setTempUnitName(parsedUser.unitName || '');
      setTempAvatarUrl(parsedUser.avatarUrl || '');
      
      fetchData(parsedUser.id);
    } else {
      fetchData();
    }

    // Polling interval for background synchronization (every 30 seconds)
    const interval = setInterval(() => {
      const latestUser = localStorage.getItem('vma_auth');
      if (latestUser) {
        const user = JSON.parse(latestUser);
        fetchData(user.id);
      } else {
        fetchData();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Sync changes to server - More robust triggers
  useEffect(() => {
    if (isDataLoaded || users.length > 1) { // Allow sync if data is loaded or we have more than the default admin
      syncDataToServer({ members });
    }
  }, [members, isDataLoaded]);

  useEffect(() => {
    if (isDataLoaded || users.length > 1) {
      syncDataToServer({ branches });
    }
  }, [branches, isDataLoaded]);

  useEffect(() => {
    if (users.length > 0) {
      syncDataToServer({ users });
    }
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('vma_auth', JSON.stringify(currentUser));
      
      // Keep currentUser in sync with the users global list
      const latestProfile = users.find(u => u.id === currentUser.id);
      if (latestProfile && JSON.stringify(latestProfile) !== JSON.stringify(currentUser)) {
        setCurrentUser(latestProfile);
      }

      // Sync temp states for settings
      if (currentUser.name && !tempName) setTempName(currentUser.name);
      if (currentUser.unitName && !tempUnitName) setTempUnitName(currentUser.unitName);
      if (currentUser.avatarUrl && !tempAvatarUrl) setTempAvatarUrl(currentUser.avatarUrl);
    } else {
      localStorage.removeItem('vma_auth');
    }
  }, [currentUser, users]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setTempName(user.name || '');
    setTempUnitName(user.unitName || '');
    setTempAvatarUrl(user.avatarUrl || '');
    // Fetch data for the new user immediately
    fetchData(user.id);
  };

  const handleRegister = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
  };

  const handleResetPassword = (contact: string, newPass: string) => {
    const account = users.find(u => u.email === contact || u.phone === contact);
    if (account) {
      setUsers(prev => prev.map(u => (u.email === contact || u.phone === contact) ? { ...u, password: newPass } : u));
      return true;
    }
    return false;
  };

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setCurrentUser(null);
    setMembers([]);
    setBranches([]);
    setIsDataLoaded(false);
    setShowLogoutConfirm(false);
  };

  const handleAddBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const branchId = Math.random().toString(36).substring(2, 9);
    const activeUnitId = currentUser.role === 'ADMIN' ? currentUser.id : currentUser.branchId; // Should be handled better if branch leader adds branch (not allowed)
    
    // 1. Create the branch
    const branchEntry: Branch = {
      id: branchId,
      unitId: currentUser.id, // Only ADMIN can add branch
      name: newBranch.name,
      managerName: newBranch.managerName,
      phone: newBranch.phone,
      memberCount: 0
    };

    // 2. Create the branch leader account
    const leaderAccount: User = {
      id: `u-${branchId}`,
      unitId: currentUser.id,
      name: newBranch.managerName,
      phone: newBranch.phone,
      role: 'BRANCH_LEADER',
      branchId: branchId,
      unitName: newBranch.name,
      password: '123456' // Default password for new leaders
    };

    setBranches(prev => [...prev, branchEntry]);
    setUsers(prev => [...prev, leaderAccount]);
    setNewBranch({ name: '', managerName: '', phone: '' });
    setIsAddingBranch(false);
  };

  const handleDeleteBranch = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa chi hội này? Tất cả hội viên và tài khoản chi hội trưởng sẽ bị xóa.')) {
      setBranches(prev => prev.filter(b => b.id !== id));
      setMembers(prev => prev.filter(m => m.branchId !== id));
      setUsers(prev => prev.filter(u => u.branchId !== id));
      if (selectedBranchId === id) setSelectedBranchId(null);
    }
  };

  const handleExportExcel = (targetBranchId: string | null) => {
    if (!currentUser) return;
    const activeUnitId = currentUser.unitId || currentUser.id;

    const exportData = members
      .filter(m => (targetBranchId === null || m.branchId === targetBranchId) && m.unitId === activeUnitId)
      .map(m => {
        const branch = branches.find(b => b.id === m.branchId);
        return {
          "Họ và tên": m.fullName,
          "Ngày sinh": m.dob,
          "Giới tính": m.gender,
          "Dân tộc": m.ethnicity,
          "Tôn giáo": m.religion,
          "Số CCCD": m.citizenId,
          "Số thẻ Hội viên": m.memberCode,
          "Số điện thoại": m.phone,
          "Quê quán": m.hometown,
          "Nơi ở hiện nay": m.address,
          "Ngày nhập ngũ": m.enlistDate,
          "Đơn vị khi nhập ngũ": m.enlistUnit,
          "Ngày xuất ngũ": m.dischargeDate,
          "Cấp bậc, chức vụ khi xuất ngũ": m.dischargeInfo,
          "Ngày vào Hội": m.joinDate,
          "Ngày vào Đảng": m.partyJoinDate,
          "Chức vụ hiện tại": m.position,
          "Trình độ văn hóa": m.education,
          "Chuyên môn kỹ thuật": m.professionalQualification,
          "Học hàm, học vị": m.academicTitle,
          "Lý luận chính trị": m.politicalTheory,
          "Đối tượng (CCB/CQN)": m.category,
          "Hình thức khen thưởng": m.rewards,
          "Hình thức kỷ luật": m.disciplines,
          "Ngày nhận kỷ niệm chương": m.medalDate,
          "Nghề nghiệp hiện nay": m.occupation,
          "Tình trạng hội viên": m.status,
          "Ngày, lý do ra khỏi Hội": m.leaveDateAndReason,
          "Đối tượng chính sách": m.policyCategory,
          "Ghi chú": m.notes,
          "Chi hội": branch?.name || 'N/A',
          "Đơn vị": currentUser?.unitName || 'Hội CCB Xã'
        };
      });

    if (exportData.length === 0) {
      alert('Không có dữ liệu để xuất!');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hội viên");
    
    // Auto-adjust column width (simple version)
    const wscols = Object.keys(exportData[0]).map(key => ({ wch: Math.max(key.length, 20) }));
    worksheet['!cols'] = wscols;

    const fileName = targetBranchId 
      ? `Danh_sach_hoi_vien_${branches.find(b => b.id === targetBranchId)?.name.replace(/\s+/g, '_')}.xlsx`
      : 'Danh_sach_hoi_vien_Toan_Xa.xlsx';
      
    XLSX.writeFile(workbook, fileName);
  };

  const handleManualSave = () => {
    localStorage.setItem('vma_members', JSON.stringify(members));
    localStorage.setItem('vma_branches', JSON.stringify(branches));
    localStorage.setItem('vma_users', JSON.stringify(users));
    if (currentUser) {
      localStorage.setItem('vma_auth', JSON.stringify(currentUser));
    }
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 3000);
  };

  const handleSaveSettings = () => {
    if (!currentUser) return;
    
    const updatedUser = { 
      ...currentUser, 
      avatarUrl: tempAvatarUrl
    };
    
    // Update current user via the users list (sync is handled by useEffect)
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    setUsers(updatedUsers);
    
    setSettingsStatus({ type: 'success', message: 'Thông tin đã được lưu thành công!' });
    setTimeout(() => setSettingsStatus(null), 3000);
  };

  const handleUpdatePassword = () => {
    if (!currentUser) return;

    if (!tempCurrentPassword) {
      setSettingsStatus({ type: 'error', message: 'Vui lòng nhập mật khẩu hiện tại!' });
      return;
    }

    if (tempCurrentPassword !== currentUser.password) {
      setSettingsStatus({ type: 'error', message: 'Mật khẩu hiện tại không đúng!' });
      return;
    }

    if (!tempNewPassword) {
      setSettingsStatus({ type: 'error', message: 'Vui lòng nhập mật khẩu mới!' });
      return;
    }

    if (tempNewPassword !== tempConfirmPassword) {
      setSettingsStatus({ type: 'error', message: 'Mật khẩu xác nhận không khớp!' });
      return;
    }

    const updatedUser = { 
      ...currentUser, 
      password: tempNewPassword 
    };
    
    // Update via users list
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    setUsers(updatedUsers);

    // Clear fields
    setTempCurrentPassword('');
    setTempNewPassword('');
    setTempConfirmPassword('');
    
    setSettingsStatus({ type: 'success', message: 'Đã cập nhật mật khẩu thành công!' });
    setTimeout(() => setSettingsStatus(null), 3000);
  };

  const filteredMembers = useMemo(() => {
    let result = [...members];
    
    // Multi-tenant Filter
    if (currentUser) {
      const activeUnitId = currentUser.unitId || currentUser.id;
      result = result.filter(m => m.unitId === activeUnitId);
    }

    if (currentUser?.role === 'BRANCH_LEADER') {
      result = result.filter(m => m.branchId === currentUser.branchId);
    } else if (selectedBranchId) {
      result = result.filter(m => m.branchId === selectedBranchId);
    }
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(m => 
        m.fullName.toLowerCase().includes(q) || 
        m.phone.includes(q) || 
        m.memberCode.toLowerCase().includes(q)
      );
    }
    
    // Sắp xếp A-Z theo tên
    return result.sort((a, b) => a.fullName.localeCompare(b.fullName, 'vi'));
  }, [members, currentUser, searchQuery, selectedBranchId]);

  const stats = useMemo(() => {
    if (!currentUser) return { total: 0, branches: 0, females: 0, minorities: 0, exempt: 0, deceased: 0, moved: 0, left: 0, veterans: 0, partyMembers: 0 };
    
    const activeUnitId = currentUser.unitId || currentUser.id;

    const relevantMembers = currentUser?.role === 'BRANCH_LEADER' 
      ? members.filter(m => m.branchId === currentUser.branchId && m.unitId === activeUnitId)
      : members.filter(m => m.unitId === activeUnitId);
      
    const relevantBranches = currentUser?.role === 'BRANCH_LEADER'
      ? branches.filter(b => b.id === currentUser.branchId && b.unitId === activeUnitId)
      : branches.filter(b => b.unitId === activeUnitId);

    return {
      total: relevantMembers.length,
      branches: relevantBranches.length,
      females: relevantMembers.filter(m => m.gender === 'Nữ').length,
      minorities: relevantMembers.filter(m => m.ethnicity && m.ethnicity.toLowerCase() !== 'kinh').length,
      exempt: relevantMembers.filter(m => m.status === 'Miễn sinh hoạt' || m.status === 'Miễn Sinh Hoạt').length,
      deceased: relevantMembers.filter(m => m.status === 'Chết').length,
      moved: relevantMembers.filter(m => m.status === 'Đã chuyển đi' || m.status === 'Đã Chuyển Đi').length,
      left: relevantMembers.filter(m => m.status === 'Ra khỏi Hội' || m.status === 'Ra Khỏi Hội').length,
      veterans: relevantMembers.filter(m => m.category === 'Cựu chiến binh').length,
      partyMembers: relevantMembers.filter(m => !!m.partyJoinDate).length
    };
  }, [members, branches, currentUser]);

  const statsByBranch = useMemo(() => {
    if (!currentUser) return [];
    const activeUnitId = currentUser.unitId || currentUser.id;

    const relevantBranches = currentUser?.role === 'BRANCH_LEADER'
      ? branches.filter(b => b.id === currentUser.branchId && b.unitId === activeUnitId)
      : branches.filter(b => b.unitId === activeUnitId);

    return relevantBranches.map(b => ({
      name: b.name,
      count: members.filter(m => m.branchId === b.id && m.unitId === activeUnitId).length
    }));
  }, [branches, members, currentUser]);

  const handleAddMember = (m: Member) => {
    if (!currentUser) return;
    
    const activeUnitId = currentUser.unitId || currentUser.id;

    const newMembers = [...members, { ...m, unitId: activeUnitId }];
    setMembers(newMembers);
    setIsMemberModalOpen(false);
    setEditingMember(null);
  };

  const handleEditMember = (updated: Member) => {
    setMembers(members.map(m => m.id === updated.id ? updated : m));
    setIsMemberModalOpen(false);
    setEditingMember(null);
  };

  const handleDeleteMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
    setMemberToDelete(null);
  };

  if (!currentUser) return (
    <LoginPage 
      onLogin={handleLogin} 
      users={users} 
      onRegister={handleRegister} 
      onResetPassword={handleResetPassword}
    />
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Mobile Toggle */}
      <div className="md:hidden vn-gradient p-4 text-white flex justify-between items-center sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white rounded-full overflow-hidden border-2 border-vietnam-yellow shadow-inner p-1">
            <img src={APP_LOGO} alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
          </div>
          <span className="font-bold uppercase text-sm tracking-tight">Hội CCB Việt Nam</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Sidebar Backdrop (Mobile) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-2xl transition-transform duration-300 transform md:translate-x-0 md:static md:inset-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col">
          <div className="p-6 vn-gradient text-white shrink-0">
            <div className="flex flex-col items-center text-center gap-3 mb-6">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-4 border-white/50 overflow-hidden shadow-md shrink-0">
                {currentUser.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <img src={APP_LOGO} alt="Logo" className="w-full h-full object-contain p-1.5" referrerPolicy="no-referrer" />
                )}
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black uppercase leading-tight tracking-wider">Hội CCB Việt Nam</h3>
                <p className="text-xs text-vietnam-yellow font-black uppercase tracking-wide mb-3">
                  {currentUser.unitName?.toUpperCase() || 'HỘI CCB XÃ AYUN'}
                  {currentUser.villageName && ` - ${currentUser.villageName}`}
                </p>
                <button 
                  onClick={handleManualSave}
                  className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-[10px] font-black py-1.5 px-4 rounded-full border border-white/20 transition-all uppercase tracking-widest active:scale-95"
                >
                  <Save size={12} className={showSaveToast ? "animate-bounce" : ""} />
                  {showSaveToast ? 'Đã lưu' : 'Lưu dữ liệu'}
                </button>
              </div>
            </div>
            
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10 flex flex-col items-center">
              <p className="text-[10px] font-bold text-white/70 uppercase mb-1">Quản trị hệ thống:</p>
              <p className="font-black text-sm truncate uppercase mb-2">
                {currentUser.role === 'ADMIN' ? (currentUser.name?.toUpperCase() || 'HỘI CCB XÃ') : currentUser.name}
              </p>
              <div className="flex items-center justify-center gap-2 w-full pt-2 border-t border-white/5">
                <ShieldCheck size={14} className="text-vietnam-yellow" />
                <span className="text-[10px] font-bold py-0.5 px-3 bg-vietnam-yellow text-vietnam-red rounded-full uppercase">
                  {currentUser.role === 'ADMIN' ? 'Cấp 1 - Hội Xã' : 'Cấp 2 - Chi Hội'}
                </span>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            <NavItem 
              active={activeTab === 'dashboard'} 
              onClick={() => {setActiveTab('dashboard'); setIsSidebarOpen(false);}}
              icon={<LayoutDashboard />}
              label="Thống kê hội viên"
            />
            <NavItem 
              active={activeTab === 'members'} 
              onClick={() => {setActiveTab('members'); setIsSidebarOpen(false);}}
              icon={<Users />}
              label="Quản lý hội viên"
            />
            {currentUser.role === 'ADMIN' && (
              <NavItem 
                active={activeTab === 'branches'} 
                onClick={() => {setActiveTab('branches'); setIsSidebarOpen(false);}}
                icon={<Building2 />}
                label="Quản Lý Chi Hội"
              />
            )}
            <NavItem 
              active={activeTab === 'reports'} 
              onClick={() => {setActiveTab('reports'); setIsSidebarOpen(false);}}
              icon={<Download />}
              label="Báo Cáo & Thống Kê"
            />
            <NavItem 
              active={activeTab === 'settings'} 
              onClick={() => {setActiveTab('settings'); setIsSidebarOpen(false);}}
              icon={<Settings />}
              label="Cài Đặt Hệ Thống"
            />
            <button 
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center gap-3 text-slate-600 hover:text-red-600 p-4 rounded-xl transition-all font-bold group"
            >
              <div className="text-slate-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all">
                <LogOut size={24} />
              </div>
              <span className="text-base tracking-tight">Đăng xuất</span>
            </button>
          </nav>

          <div className="p-4 border-t border-slate-100">
            <div className="text-[10px] text-slate-400 text-center uppercase tracking-widest font-bold">
              Hệ thống Quản lý v1.0.0
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="hidden md:flex bg-white border-b border-slate-200 h-20 items-center justify-between px-8 sticky top-0 z-30">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
            <div className="w-2 h-6 bg-vietnam-red rounded-full" />
            {activeTab === 'dashboard' ? 'Thống kê hội viên' : 
             activeTab === 'members' ? 'Quản lý hội viên' : 
             activeTab === 'branches' ? 'Danh sách chi hội' : 
             activeTab === 'reports' ? 'Báo cáo xuất dữ liệu' : 'Cài đặt tài khoản'}
          </h2>
          
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Thời gian hệ thống</p>
              <p className="text-xs font-bold text-slate-600">{new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className="h-10 w-px bg-slate-100" />
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Đơn vị quản lý</p>
              <p className="text-xs font-black text-vietnam-red uppercase">{currentUser.role === 'ADMIN' ? (currentUser.unitName?.toUpperCase() || 'XÃ AYUN (TOÀN XÃ)') : branches.find(b => b.id === currentUser.branchId)?.name}</p>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8">
          {/* Global Search Bar - Repositioned to top-center */}
          <div className="max-w-2xl mx-auto mb-8 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-slate-400" size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Tìm kiếm hội viên theo Tên, Số điện thoại hoặc Số thẻ..."
              className="w-full h-14 pl-12 pr-4 bg-white border-2 border-slate-200 focus:border-vietnam-red rounded-2xl shadow-sm italic text-slate-600 transition-all text-base font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-red-500"
              >
                <X size={20} />
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-8"
              >
                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard 
                    label="TỔNG SỐ HỘI VIÊN" 
                    value={stats.total} 
                    icon={<Users className="text-blue-600" />} 
                    color="border-blue-500" 
                    onClick={() => {setActiveTab('members'); setSelectedBranchId(null);}}
                  />
                  <StatCard 
                    label="TỔNG SỐ CHI HỘI" 
                    value={stats.branches} 
                    icon={<Building2 className="text-purple-600" />} 
                    color="border-purple-500" 
                    onClick={() => setActiveTab('branches')}
                  />
                  <StatCard 
                    label="TỔNG SỐ HỘI VIÊN NỮ" 
                    value={stats.females} 
                    icon={<Users className="text-pink-600" />} 
                    color="border-pink-500" 
                    onClick={() => {setActiveTab('members'); setSelectedBranchId(null);}}
                  />
                  <StatCard 
                    label="HỘI VIÊN DÂN TỘC THIỂU SỐ" 
                    value={stats.minorities} 
                    icon={<Users className="text-emerald-600" />} 
                    color="border-emerald-500" 
                    onClick={() => {setActiveTab('members'); setSelectedBranchId(null);}}
                  />
                  <StatCard 
                    label="HỘI VIÊN MIỄN SINH HOẠT" 
                    value={stats.exempt} 
                    icon={<CheckCircle2 className="text-amber-600" />} 
                    color="border-amber-500" 
                    onClick={() => {setActiveTab('members'); setSelectedBranchId(null);}}
                  />
                  <StatCard 
                    label="HỘI VIÊN CHẾT" 
                    value={stats.deceased} 
                    icon={<Users className="text-slate-600" />} 
                    color="border-slate-500" 
                    onClick={() => {setActiveTab('members'); setSelectedBranchId(null);}}
                  />
                  <StatCard 
                    label="HỘI VIÊN ĐÃ CHUYỂN ĐI" 
                    value={stats.moved} 
                    icon={<CheckCircle2 className="text-orange-600" />} 
                    color="border-orange-500" 
                    onClick={() => {setActiveTab('members'); setSelectedBranchId(null);}}
                  />
                  <StatCard 
                    label="HỘI VIÊN RA KHỎI HỘI" 
                    value={stats.left} 
                    icon={<Users className="text-red-900" />} 
                    color="border-red-900" 
                    onClick={() => {setActiveTab('members'); setSelectedBranchId(null);}}
                  />
                  <StatCard 
                    label="HỘI VIÊN CỰU CHIẾN BINH" 
                    value={stats.veterans} 
                    icon={<Users className="text-green-800" />} 
                    color="border-green-800" 
                    onClick={() => {setActiveTab('members'); setSelectedBranchId(null);}}
                  />
                  <StatCard 
                    label="HỘI VIÊN LÀ ĐẢNG VIÊN" 
                    value={stats.partyMembers} 
                    icon={<Users className="text-red-600" />} 
                    color="border-red-600" 
                    onClick={() => {setActiveTab('members'); setSelectedBranchId(null);}}
                  />
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                  <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
                    <div className="w-2 h-6 bg-vietnam-red rounded-full" />
                    THỐNG KÊ SỐ LƯỢNG HỘI VIÊN TỪNG CHI HỘI
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {statsByBranch.map((b, i) => {
                      const branch = branches.find(br => br.name === b.name);
                      return (
                        <div 
                          key={i} 
                          onClick={() => {
                            if (branch) {
                              setSelectedBranchId(branch.id);
                              setActiveTab('members');
                            }
                          }}
                          className="bg-slate-50 p-6 rounded-2xl flex justify-between items-center hover:bg-vietnam-red hover:text-white transition-all cursor-pointer group shadow-sm hover:shadow-lg hover:-translate-y-1"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-vietnam-red group-hover:bg-white/20 group-hover:text-white shadow-sm">
                              <Building2 size={24} />
                            </div>
                            <span className="font-bold text-lg">{b.name}</span>
                          </div>
                          <span className="bg-vietnam-red text-white px-4 py-2 rounded-xl text-lg font-black shadow-lg group-hover:bg-white group-hover:text-vietnam-red">
                            {b.count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="vn-card bg-white">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold">Thành viên mới gia nhập</h3>
                    <button onClick={() => setActiveTab('members')} className="text-sm font-bold text-vietnam-red hover:underline">Xem tất cả</button>
                  </div>
                  <div className="space-y-4">
                    {(currentUser.role === 'BRANCH_LEADER' 
                      ? members.filter(m => m.branchId === currentUser.branchId) 
                      : members.filter(m => m.unitId === (currentUser.unitId || currentUser.id)))
                      .slice(-3).reverse().map(m => (
                      <div key={m.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-vietnam-red/10 rounded-full flex items-center justify-center text-vietnam-red font-bold">
                            {m.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold">{m.fullName}</p>
                            <p className="text-xs text-slate-500">{m.position} • {branches.find(b => b.id === m.branchId)?.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium text-slate-600">Gia nhập: {formatDate(m.joinDate)}</p>
                          <p className="text-[10px] text-emerald-600 font-bold uppercase mt-1">Đã xác minh</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'members' && (
              <motion.div 
                key="members"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                    {currentUser.role === 'ADMIN' && (
                      <button 
                        onClick={() => setSelectedBranchId(null)}
                        className={cn(
                          "px-4 py-2 rounded-lg border text-sm font-bold whitespace-nowrap transition-all",
                          selectedBranchId === null 
                            ? "bg-vietnam-red text-white border-vietnam-red shadow-md" 
                            : "bg-white text-slate-600 border-slate-200 hover:border-vietnam-red"
                        )}
                      >
                        Tất cả ({members.length})
                      </button>
                    )}
                    {(currentUser.role === 'ADMIN' 
                      ? branches.filter(b => b.unitId === currentUser.id) 
                      : branches.filter(b => b.id === currentUser.branchId)).map(b => (
                      <button 
                        key={b.id} 
                        onClick={() => setSelectedBranchId(b.id)}
                        className={cn(
                          "px-4 py-2 rounded-lg border text-sm font-bold whitespace-nowrap transition-all",
                          (selectedBranchId === b.id || (currentUser.role === 'BRANCH_LEADER' && b.id === currentUser.branchId))
                            ? "bg-vietnam-red text-white border-vietnam-red shadow-md" 
                            : "bg-slate-100 text-slate-600 border-transparent hover:border-slate-200"
                        )}
                      >
                        {b.name} ({members.filter(m => m.branchId === b.id).length})
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={() => {setEditingMember(null); setIsMemberModalOpen(true);}}
                    className="vn-gradient text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg w-full sm:w-auto justify-center"
                  >
                    <UserPlus size={20} />
                    THÊM HỘI VIÊN
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredMembers.map(m => (
                    <MemberListItem 
                      key={m.id} 
                      member={m} 
                      branchName={branches.find(b => b.id === m.branchId)?.name || 'N/A'}
                      onView={() => setSelectedMember(m)}
                      onDelete={() => setMemberToDelete(m)}
                    />
                  ))}
                  {filteredMembers.length === 0 && (
                    <div className="col-span-full bg-white rounded-2xl p-12 text-center border-2 border-dashed border-slate-200">
                      {searchQuery ? (
                        <>
                          <Search size={48} className="mx-auto text-slate-300 mb-4" />
                          <p className="text-slate-500 font-medium">Không tìm thấy hội viên nào khớp với tìm kiếm.</p>
                          <button 
                            onClick={() => setSearchQuery('')}
                            className="mt-4 text-vietnam-red font-bold hover:underline"
                          >
                            Xóa bộ lọc tìm kiếm
                          </button>
                        </>
                      ) : (
                        <>
                          <AlertCircle size={48} className="mx-auto text-amber-500 mb-4" />
                          <p className="text-slate-600 font-medium max-w-md mx-auto leading-relaxed">
                            Chưa có thông tin hội viên. Hãy nhập thông tin hội viên tại mục <span className="font-black text-vietnam-red">THÊM HỘI VIÊN</span>
                          </p>
                          <button 
                            onClick={() => {setEditingMember(null); setIsMemberModalOpen(true);}}
                            className="mt-6 vn-gradient text-white px-8 py-3 rounded-xl font-bold inline-flex items-center gap-2 shadow-lg"
                          >
                            <Plus size={20} /> THÊM NGAY
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'branches' && (
              <motion.div key="branches" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-black text-slate-800 uppercase">QUẢN LÝ CHI HỘI</h2>
                    <p className="text-slate-500 font-medium">Danh sách và quản lý tài khoản chi hội trưởng</p>
                  </div>
                  {currentUser.role === 'ADMIN' && (
                    <button 
                      onClick={() => setIsAddingBranch(true)}
                      className="vn-gradient text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-vietnam-red/20 uppercase"
                    >
                      <Plus size={20} /> Thêm Chi Hội Mới
                    </button>
                  )}
                </div>

                <AnimatePresence>
                  {isAddingBranch && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} 
                      animate={{ height: 'auto', opacity: 1 }} 
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mb-6"
                    >
                      <div className="vn-card bg-amber-50 border-amber-300 p-6 rounded-2xl">
                        <form onSubmit={handleAddBranch} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-amber-700">Tên chi hội</label>
                            <input 
                              type="text" 
                              className="w-full bg-white border-amber-200" 
                              placeholder="Vd: Chi hội 1" 
                              value={newBranch.name}
                              onChange={(e) => setNewBranch({...newBranch, name: e.target.value})}
                              required 
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-amber-700">Chi hội trưởng</label>
                            <input 
                              type="text" 
                              className="w-full bg-white border-amber-200" 
                              placeholder="Nhập họ và tên" 
                              value={newBranch.managerName}
                              onChange={(e) => setNewBranch({...newBranch, managerName: e.target.value})}
                              required 
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-amber-700">Số điện thoại (Tài khoản login)</label>
                            <input 
                              type="tel" 
                              className="w-full bg-white border-amber-200" 
                              placeholder="Nhập số điện thoại" 
                              value={newBranch.phone}
                              onChange={(e) => setNewBranch({...newBranch, phone: e.target.value})}
                              required 
                            />
                          </div>
                          <div className="md:col-span-3 flex justify-end gap-3 pt-2">
                            <button 
                              type="button" 
                              onClick={() => setIsAddingBranch(false)}
                              className="px-6 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-lg transition-colors"
                            >
                              Hủy bỏ
                            </button>
                            <button 
                              type="submit" 
                              className="px-8 py-2 vn-gradient text-white font-black rounded-lg shadow-lg uppercase text-sm"
                            >
                              Xác nhận thêm & tạo tài khoản
                            </button>
                          </div>
                        </form>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {selectedBranchId ? (
                   <div className="space-y-4">
                      <button 
                        onClick={() => setSelectedBranchId(null)}
                        className="flex items-center gap-2 text-slate-500 font-black hover:text-vietnam-red transition-colors uppercase text-sm"
                      >
                        <ChevronRight className="rotate-180" /> Quay lại danh sách chi hội
                      </button>
                      <div className="vn-card border-l-8">
                         <h3 className="text-xl font-black text-slate-800 mb-6 uppercase flex items-center gap-3">
                           <Users className="text-vietnam-red" />
                           DANH SÁCH HỘI VIÊN: {branches.find(b => b.id === selectedBranchId)?.name}
                         </h3>
                         <div className="overflow-x-auto rounded-xl border border-slate-100">
                            <table className="w-full text-left border-collapse">
                              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black tracking-widest">
                                <tr>
                                  <th className="p-4">Họ và Tên</th>
                                  <th className="p-4">Số thẻ</th>
                                  <th className="p-4">SĐT</th>
                                  <th className="p-4">Chức vụ</th>
                                  <th className="p-4 text-center">Thao tác</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-50">
                                {members.filter(m => m.branchId === selectedBranchId).length > 0 ? (
                                  members.filter(m => m.branchId === selectedBranchId).map(member => (
                                    <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                                      <td className="p-4 font-bold text-slate-800">{member.fullName}</td>
                                      <td className="p-4">
                                        <span className="bg-slate-100 px-2 py-1 rounded font-mono text-sm">{member.memberCode}</span>
                                      </td>
                                      <td className="p-4 text-slate-500">{member.phone}</td>
                                      <td className="p-4 text-slate-500 font-medium">{member.position}</td>
                                      <td className="p-4 text-center">
                                        <button 
                                          onClick={() => {
                                            setSelectedMember(member);
                                            setActiveTab('members');
                                          }}
                                          className="p-2 text-slate-400 hover:text-vietnam-red"
                                        >
                                          <Eye size={18} />
                                        </button>
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-400 italic">Chi hội này chưa có hội viên</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                         </div>
                      </div>
                   </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {branches
                      .filter(b => b.unitId === (currentUser.unitId || currentUser.id))
                      .map((branch) => {
                       const branchMemberCount = members.filter(m => m.branchId === branch.id).length;
                       return (
                        <motion.div 
                          key={branch.id} 
                          whileHover={{ y: -5 }}
                          className="vn-card hover:shadow-xl transition-all cursor-pointer group relative bg-white"
                          onClick={() => setSelectedBranchId(branch.id)}
                        >
                          <div className="absolute top-4 right-4 bg-vietnam-red text-white w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-black shadow-lg">
                            <span className="text-sm">{branchMemberCount}</span>
                            <span className="text-[8px] -mt-1 uppercase">HV</span>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="bg-slate-50 w-14 h-14 rounded-2xl flex items-center justify-center text-vietnam-red mb-2">
                              <Building2 size={28} />
                            </div>
                            <div>
                              <h3 className="text-xl font-black text-slate-800 group-hover:text-vietnam-red transition-colors uppercase line-clamp-1">{branch.name}</h3>
                              <div className="flex items-center gap-2 text-slate-500 mt-2">
                                <ShieldCheck size={16} className="text-emerald-500" />
                                <span className="text-[10px] font-bold uppercase tracking-tight">Chi hội trưởng: {branch.managerName || 'Chưa cập nhật'}</span>
                              </div>
                              <div className="flex items-center gap-2 text-slate-500 mt-1">
                                <Phone size={14} />
                                <span className="text-[11px] font-mono">{branch.phone || 'N/A'}</span>
                              </div>
                            </div>
                            
                            <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                              <span className="text-[10px] font-black text-slate-400 uppercase">Bấm để xem chi tiết</span>
                              <div className="flex items-center gap-2">
                                {currentUser.role === 'ADMIN' && (
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteBranch(branch.id);
                                    }}
                                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    title="Xóa chi hội"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                )}
                                <ChevronRight size={16} className="text-slate-300 group-hover:text-vietnam-red group-hover:translate-x-1 transition-all" />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                       );
                    })}
                    {branches.length === 0 && (
                      <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
                        <Building2 className="mx-auto text-slate-200 mb-4" size={64} />
                        <h4 className="text-lg font-black text-slate-400 uppercase">Chưa có dữ liệu chi hội</h4>
                        <p className="text-slate-400 mb-6">Vui lòng bấm nút thêm mới để bắt đầu</p>
                        <button 
                          onClick={() => setIsAddingBranch(true)}
                          className="bg-slate-100 text-slate-500 px-6 py-2 rounded-xl font-bold uppercase text-xs hover:bg-slate-200"
                        >
                          Tạo ngay
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'reports' && (
              <motion.div key="reports" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                <div>
                   <h2 className="text-2xl font-black text-slate-800 uppercase mb-2">BÁO CÁO & XUẤT DỮ LIỆU</h2>
                   <p className="text-slate-500 font-medium tracking-tight">Xuất danh sách hội viên và báo cáo định kỳ của đơn vị</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {currentUser.role === 'ADMIN' && (
                    <div className="vn-card bg-white border-t-4 border-t-blue-600 p-8 shadow-xl">
                      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                        <Download size={32} />
                      </div>
                      <h3 className="text-xl font-bold mb-4">Xuất danh sách toàn đơn vị</h3>
                      <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                        Tải xuống toàn bộ danh sách hội viên của xã trong một tập tin Excel duy nhất với đầy đủ các trường thông tin.
                      </p>
                      <button 
                        onClick={() => handleExportExcel(null)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-lg shadow-blue-200 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2"
                      >
                        <Download size={20} /> Tải dữ liệu toàn đơn vị
                      </button>
                      <p className="text-center text-[10px] text-slate-400 mt-4 uppercase font-bold italic">Tổng số: {members.filter(m => m.unitId === currentUser.id).length} hội viên</p>
                    </div>
                  )}

                  <div className={cn(
                    "vn-card bg-white border-t-4 border-t-emerald-600 p-8 shadow-xl",
                    currentUser.role !== 'ADMIN' && "md:col-span-2 max-w-2xl mx-auto w-full"
                  )}>
                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                      <Building2 size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-4">Xuất danh sách {currentUser.role === 'BRANCH_LEADER' ? 'Chi hội' : 'theo Chi hội'}</h3>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                      {currentUser.role === 'BRANCH_LEADER' 
                        ? 'Tải xuống danh sách hội viên đầy đủ của chi hội bạn đang quản lý.'
                        : 'Lựa chọn chi hội cụ thể để xuất dữ liệu hội viên của chi hội đó.'}
                    </p>
                    
                    <div className="space-y-4">
                      {currentUser.role === 'ADMIN' ? (
                        <>
                          <label className="text-[10px] font-black text-slate-400 uppercase">Chọn chi hội cần xuất</label>
                          <select 
                            className="w-full"
                            id="branchExportSelect"
                            defaultValue=""
                          >
                            <option value="" disabled>-- Chọn chi hội --</option>
                            {branches.filter(b => b.unitId === currentUser.id).map(b => (
                              <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                          </select>
                        </>
                      ) : null}
                      <button 
                        onClick={() => {
                          if (currentUser.role === 'BRANCH_LEADER') {
                            handleExportExcel(currentUser.branchId!);
                          } else {
                            const select = document.getElementById('branchExportSelect') as HTMLSelectElement;
                            if (select.value) {
                              handleExportExcel(select.value);
                            } else {
                              alert('Vui lòng chọn một chi hội!');
                            }
                          }
                        }}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-xl shadow-lg shadow-emerald-200 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2"
                      >
                        <Printer size={20} /> {currentUser.role === 'BRANCH_LEADER' ? 'Tải dữ liệu Chi hội' : 'Xuất dữ liệu chi hội'}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="vn-card bg-slate-900 text-white p-8 overflow-hidden relative group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                    <ShieldCheck size={120} />
                  </div>
                  <div className="relative z-10 max-w-2xl">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                       <CheckCircle2 className="text-emerald-400" />
                       Cam kết bảo mật dữ liệu
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                      Dữ liệu xuất ra chứa các thông tin nhạy cảm của hội viên (CCCD, SĐT, Địa chỉ). Quản trị viên vui lòng bảo quản tập tin an toàn và chỉ sử dụng cho mục đích công việc của Hội.
                    </p>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                       <span>Định dạng: .xlsx</span>
                       <span>•</span>
                       <span>Mã hóa: UTF-8</span>
                       <span>•</span>
                       <span>Bảo mật: Cao</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-8">
                <div className="vn-card bg-white p-8">
                  <h3 className="text-lg font-bold mb-8 flex items-center gap-2 text-vietnam-red">
                    <Settings className="text-vietnam-red" />
                    CẤU HÌNH TÀI KHOẢN & ĐƠN VỊ
                  </h3>
                  
                  {settingsStatus && (
                    <div className={cn(
                      "mb-6 p-4 rounded-xl flex items-center gap-3 font-bold text-sm",
                      settingsStatus.type === 'success' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"
                    )}>
                      {settingsStatus.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                      {settingsStatus.message}
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row items-start gap-10">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative group">
                        <div className="w-48 h-48 rounded-2xl border-4 border-slate-100 flex items-center justify-center bg-slate-50 overflow-hidden shadow-inner relative">
                          {tempAvatarUrl ? (
                            <img src={tempAvatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex flex-col items-center gap-2 opacity-30">
                              <img src={APP_LOGO} alt="Logo" className="w-20 h-20 object-contain" referrerPolicy="no-referrer" />
                              <span className="text-[10px] font-black uppercase">Chưa có ảnh</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                            <Camera className="text-white" size={32} />
                          </div>
                        </div>
                        <label className="absolute -bottom-3 -right-3 w-12 h-12 bg-vietnam-red text-white rounded-2xl flex items-center justify-center cursor-pointer shadow-xl hover:scale-105 active:scale-95 transition-all border-4 border-white">
                          <Camera size={24} />
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                               const reader = new FileReader();
                               reader.onloadend = () => {
                                 setTempAvatarUrl(reader.result as string);
                               };
                               reader.readAsDataURL(file);
                            }
                          }} />
                        </label>
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ảnh đại diện đơn vị</p>
                    </div>
                    
                        <div className="flex-1 space-y-6 w-full">
                          <div className="space-y-2">
                            <label className="text-sm font-black text-slate-700 uppercase tracking-wide">
                              {currentUser.role === 'ADMIN' ? 'ĐƠN VỊ XÃ / PHƯỜNG' : 'TÊN CHI HỘI'}
                            </label>
                            <input 
                              type="text" 
                              className="w-full h-14 bg-slate-50 text-slate-500 cursor-not-allowed font-bold" 
                              value={currentUser.role === 'ADMIN' 
                                ? (tempUnitName || currentUser.unitName || '').toUpperCase()
                                : (branches.find(b => b.id === currentUser.branchId)?.name || currentUser.unitName || 'Chi hội chưa xác định')} 
                              disabled
                            />
                          </div>
  
                          <div className="space-y-2">
                            <label className="text-sm font-black text-slate-700 uppercase tracking-wide">
                              TÊN NGƯỜI QUẢN TRỊ / ĐẠI DIỆN
                            </label>
                            <input 
                              type="text" 
                              className="w-full h-14 bg-slate-50 text-slate-500 cursor-not-allowed font-bold" 
                              value={currentUser.role === 'ADMIN' 
                                ? (currentUser.name?.toUpperCase() || tempName.toUpperCase())
                                : (currentUser.name || tempName)} 
                              disabled
                            />
                          </div>

                        <div className="space-y-2">
                          <label className="text-sm font-black text-slate-700 uppercase tracking-wide">Email liên hệ / Tài khoản</label>
                          <input 
                             type="text" 
                             className="w-full h-14 bg-slate-50 text-slate-500 cursor-not-allowed" 
                             value={currentUser.email || currentUser.phone || ''} 
                             readOnly 
                          />
                        </div>

                        <div className="pt-6">
                          <button 
                            onClick={handleSaveSettings}
                            className="w-full md:w-auto px-10 h-14 vn-gradient text-white font-black rounded-2xl shadow-lg shadow-vietnam-red/20 flex items-center justify-center gap-3 uppercase tracking-wider text-sm md:text-base whitespace-nowrap"
                          >
                            <CheckCircle2 size={24} /> LƯU THÔNG TIN THAY ĐỔI
                          </button>
                        </div>
                    </div>
                  </div>
                </div>

                <div className="vn-card bg-white p-8">
                  <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
                    <Key className="text-vietnam-red" />
                    Đổi mật khẩu truy cập
                  </h3>
                  
                  <div className="space-y-6 max-w-md">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Mật khẩu hiện tại</label>
                      <div className="relative">
                        <input 
                          type={showCurrentPassword ? "text" : "password"} 
                          placeholder="••••••" 
                          className="w-full pr-12" 
                          value={tempCurrentPassword}
                          onChange={(e) => setTempCurrentPassword(e.target.value)}
                        />
                        <button 
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-vietnam-red"
                        >
                          {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Mật khẩu mới</label>
                      <div className="relative">
                        <input 
                          type={showNewPassword ? "text" : "password"} 
                          placeholder="••••••" 
                          className="w-full pr-12" 
                          value={tempNewPassword}
                          onChange={(e) => setTempNewPassword(e.target.value)}
                        />
                        <button 
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-vietnam-red"
                        >
                          {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Xác nhận mật khẩu mới</label>
                      <div className="relative">
                        <input 
                          type={showConfirmPassword ? "text" : "password"} 
                          placeholder="••••••" 
                          className="w-full pr-12" 
                          value={tempConfirmPassword}
                          onChange={(e) => setTempConfirmPassword(e.target.value)}
                        />
                        <button 
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-vietnam-red"
                        >
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                    
                    <button 
                      onClick={handleUpdatePassword}
                      className="w-full vn-gradient text-white font-black py-4 rounded-xl shadow-lg shadow-vietnam-red/20 uppercase tracking-widest text-sm"
                    >
                      CẬP NHẬT MẬT KHẨU
                    </button>
                  </div>
                </div>

                <div className="vn-card bg-slate-900 text-white p-8">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-vietnam-yellow">
                    <ShieldCheck />
                    Bảo mật dữ liệu
                  </h3>
                  <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                    Hệ thống lưu trữ dữ liệu tại trình duyệt của bạn (Local Storage). Để đảm bảo an toàn, vui lòng không chia sẻ tài khoản đăng nhập và đảm bảo thiết bị được bảo mật.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button onClick={() => {
                        const data = {
                          members,
                          branches,
                          timestamp: new Date().toISOString()
                        };
                        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `VMA_Backup_${new Date().toLocaleDateString('vi-VN')}.json`;
                        a.click();
                    }} className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
                      <Download size={16} /> SAO LƯU DỮ LIỆU
                    </button>
                    <button className="bg-red-600/20 hover:bg-red-600/30 text-red-400 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
                      <Trash2 size={16} /> XÓA TẤT CẢ DỮ LIỆU
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Member Details Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-5xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="vn-gradient px-8 py-6 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-2 border-white/30 overflow-hidden text-vietnam-red text-2xl font-black">
                  {selectedMember.fullName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold uppercase tracking-tight">{selectedMember.fullName}</h2>
                  <p className="text-vietnam-yellow font-medium">{selectedMember.memberCode}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedMember(null)}
                className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center hover:bg-black/20 transition-colors"
              >
                <X />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Profile Bar */}
              <div className="space-y-6 lg:border-r lg:pr-8 border-slate-100">
                <div className="bg-slate-50 p-6 rounded-2xl flex flex-col items-center">
                  <div className="bg-white p-3 rounded-xl shadow-inner mb-4">
                    <QRCodeSVG value={`MEMBER:${selectedMember.memberCode}`} size={140} />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">QR HỘI VIÊN</p>
                </div>

                <div className="space-y-5">
                   <div className="p-4 bg-vietnam-red/5 rounded-xl border border-vietnam-red/10 text-center">
                      <p className="text-[10px] font-bold text-vietnam-red opacity-70 uppercase mb-1">Tình trạng</p>
                      <p className="font-black text-vietnam-red">{selectedMember.status}</p>
                   </div>
                   <DetailItem icon={<Phone size={18} />} label="Điện thoại" value={selectedMember.phone || 'N/A'} />
                   <DetailItem icon={<Calendar size={18} />} label="Ngày sinh" value={formatDate(selectedMember.dob)} />
                   <DetailItem icon={<MapPin size={18} />} label="Nơi ở hiện nay" value={selectedMember.address} />
                </div>
              </div>

              {/* Information Areas */}
              <div className="lg:col-span-3 space-y-10">
                {/* Section 1: Personal & Education */}
                <section>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <div className="h-4 w-1 bg-vietnam-red" />
                    1. THÔNG TIN CÁ NHÂN & ĐÀO TẠO
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-8">
                    <DataPoint label="Dân tộc" value={selectedMember.ethnicity} />
                    <DataPoint label="Tôn giáo" value={selectedMember.religion} />
                    <DataPoint label="Số CCCD" value={selectedMember.citizenId} />
                    <DataPoint label="Quê quán" value={selectedMember.hometown} className="sm:col-span-2" />
                    <DataPoint label="Giáo dục phổ thông" value={selectedMember.education} />
                    <DataPoint label="Chuyên môn" value={selectedMember.professionalQualification} />
                    <DataPoint label="Học hàm, học vị" value={selectedMember.academicTitle} />
                    <DataPoint label="Lý luận chính trị" value={selectedMember.politicalTheory} />
                  </div>
                </section>

                {/* Section 2: Enlistment */}
                <section>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <div className="h-4 w-1 bg-vietnam-red" />
                    2. LỊCH SỬ NHẬP NGŨ & QUÂN ĐỘI
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-8">
                    <DataPoint label="Tháng, năm nhập ngũ" value={selectedMember.enlistDate} />
                    <DataPoint label="Đơn vị nhập ngũ" value={selectedMember.enlistUnit} />
                    <DataPoint label="Tháng, năm xuất ngũ" value={selectedMember.dischargeDate} />
                    <DataPoint label="Thông tin khi xuất ngũ" value={selectedMember.dischargeInfo} className="sm:col-span-2" />
                  </div>
                </section>

                {/* Section 3: Association */}
                <section>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <div className="h-4 w-1 bg-vietnam-red" />
                    3. THÔNG TIN HOẠT ĐỘNG HỘI
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-8">
                    <DataPoint label="Ngày vào Hội" value={selectedMember.joinDate} />
                    <DataPoint label="Ngày vào Đảng" value={selectedMember.partyJoinDate || 'Chưa vào Đảng'} />
                    <DataPoint label="Chức vụ Hội" value={selectedMember.position} />
                    <DataPoint label="Đối tượng" value={selectedMember.category} />
                    <DataPoint label="Kỷ niệm chương" value={selectedMember.medalDate || 'Chưa có'} />
                    <DataPoint label="Chi hội" value={branches.find(b => b.id === selectedMember.branchId)?.name || 'N/A'} />
                    <DataPoint label="Biến động sinh hoạt" value={selectedMember.leaveDateAndReason || 'Không'} className="sm:col-span-2" />
                  </div>
                </section>

                {/* Section 4: Social & Rewards */}
                <section>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <div className="h-4 w-1 bg-vietnam-red" />
                    4. KHEN THƯỞNG, KỶ LUẬT & CHÍNH SÁCH
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                    <DataPoint label="Khen thưởng" value={selectedMember.rewards || 'Không'} />
                    <DataPoint label="Kỷ luật" value={selectedMember.disciplines || 'Không'} />
                    <DataPoint label="Đối tượng chính sách" value={selectedMember.policyCategory} />
                    <DataPoint label="Nghề nghiệp" value={selectedMember.occupation} />
                  </div>
                </section>

                {/* Notes */}
                <section className="bg-slate-50 p-6 rounded-2xl">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Ghi chú bổ sung</p>
                  <p className="text-sm italic text-slate-600 leading-relaxed">{selectedMember.notes || 'Không có ghi chú thêm.'}</p>
                </section>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-4 shrink-0">
               <button 
                onClick={() => setSelectedMember(null)}
                className="px-8 bg-slate-200 text-slate-700 font-black h-14 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-300"
              >
                THOÁT
              </button>
              <button 
                onClick={() => {setEditingMember(selectedMember); setIsMemberModalOpen(true); setSelectedMember(null);}}
                className="flex-1 bg-blue-600 text-white font-black h-14 rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-600/20"
              >
                <Edit2 size={18} /> SỬA HỒ SƠ
              </button>
              <button 
                onClick={() => {setMemberToDelete(selectedMember); setSelectedMember(null);}}
                className="px-8 bg-white text-red-600 font-black h-14 rounded-2xl border-2 border-red-100 flex items-center justify-center gap-2 hover:bg-red-50"
              >
                <Trash2 size={18} /> XÓA
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Member Form Modal */}
      {isMemberModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white w-full max-w-4xl max-h-[95vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center flex-shrink-0">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <UserPlus className="text-vietnam-red" />
                {editingMember ? 'Cập nhật hồ sơ hội viên' : 'Thêm hội viên mới'}
              </h2>
              <button onClick={() => setIsMemberModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
            </div>

            <div className="flex-1 overflow-auto p-8">
               <MemberForm 
                 branches={branches.filter(b => b.unitId === (currentUser.unitId || currentUser.id))}
                 initialData={editingMember || undefined}
                 onSubmit={editingMember ? handleEditMember : handleAddMember}
                 currentUser={currentUser}
               />
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {memberToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
           <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl p-8 text-center"
           >
              <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={40} />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">CẢNH BÁO XÓA</h3>
              <p className="text-slate-500 mb-8 font-medium">Bạn có chắc muốn xóa hội viên <span className="text-slate-900 font-bold">{memberToDelete.fullName}</span> không?</p>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setMemberToDelete(null)}
                  className="py-4 bg-slate-100 text-slate-600 font-black rounded-xl hover:bg-slate-200 uppercase"
                >
                  KHÔNG
                </button>
                <button 
                  onClick={() => handleDeleteMember(memberToDelete.id)}
                  className="py-4 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 shadow-lg shadow-red-600/30 uppercase"
                >
                  CÓ
                </button>
              </div>
           </motion.div>
        </div>
      )}
      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative z-10 text-center"
            >
              <div className="w-20 h-20 bg-red-100 text-vietnam-red rounded-full flex items-center justify-center mx-auto mb-6">
                <LogOut size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2 uppercase">XÁC NHẬN THOÁT</h3>
              <p className="text-slate-500 font-medium mb-8">Bạn có muốn thoát ứng dụng?</p>
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-colors uppercase"
                >
                  Không
                </button>
                <button 
                  onClick={handleLogout}
                  className="py-4 vn-gradient text-white font-black rounded-2xl shadow-lg shadow-vietnam-red/20 uppercase"
                >
                  Có
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Save Toast */}
      <AnimatePresence>
        {showSaveToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[200] flex items-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl border border-slate-700"
          >
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Check size={20} />
            </div>
            <div>
              <p className="font-black uppercase text-xs">Hệ thống đã lưu</p>
              <p className="text-[10px] text-slate-400 font-medium">Dữ liệu đã được lưu trữ an toàn trong app.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- SUB-COMPONENTS ---

const NavItem = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 p-4 rounded-xl transition-all font-bold group",
      active 
        ? "bg-vietnam-red/10 text-vietnam-red shadow-sm" 
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    )}
  >
    <div className={cn(
      "transition-transform group-hover:scale-110",
      active ? "text-vietnam-red" : "text-slate-400"
    )}>
      {React.cloneElement(icon as React.ReactElement, { size: 24 })}
    </div>
    <span className="text-base tracking-tight">{label}</span>
    {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-vietnam-red shadow-[0_0_8px_rgba(218,37,29,0.5)]" />}
  </button>
);

const StatCard = ({ label, value, icon, color, onClick }: { label: string, value: number, icon: React.ReactNode, color: string, onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={cn(
      "bg-white rounded-2xl p-6 shadow-sm border-b-4 transition-all", 
      color,
      onClick && "cursor-pointer hover:shadow-md hover:-translate-y-1"
    )}
  >
    <div className="flex justify-between items-start mb-4">
      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center">
        {React.cloneElement(icon as React.ReactElement, { size: 28 })}
      </div>
    </div>
    <div>
      <p className="text-3xl font-black text-slate-900">{value}</p>
      <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mt-1">{label}</p>
    </div>
  </div>
);

interface MemberListItemProps {
  member: Member;
  branchName: string;
  onView: () => void;
  onDelete: () => void;
}

const MemberListItem: React.FC<MemberListItemProps> = ({ member, branchName, onView, onDelete }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:shadow-md hover:border-vietnam-red/30 transition-all group flex flex-col">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 bg-vietnam-red text-white flex items-center justify-center rounded-2xl text-xl font-black shadow-lg shadow-vietnam-red/20 group-hover:scale-110 transition-transform overflow-hidden">
          {member.imageUrl ? (
            <img src={member.imageUrl} className="w-full h-full object-cover" />
          ) : (
            member.fullName.charAt(0)
          )}
        </div>
        <div>
          <h4 className="font-bold text-lg leading-tight">{member.fullName}</h4>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Số thẻ hội viên:</p>
          <p className="text-xs text-vietnam-red font-bold">{member.memberCode}</p>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
          <QRCodeSVG value={member.memberCode} size={30} />
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
    
    <div className="space-y-2 mb-6 flex-1">
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        <div className="flex items-center gap-2 text-[11px] text-slate-600">
          <Building2 size={12} className="text-slate-400 shrink-0" />
          <span className="font-bold truncate">{branchName}</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-600">
          <Phone size={12} className="text-slate-400 shrink-0" />
          <span className="font-bold">{member.phone || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-600">
          <UserPlus size={12} className="text-slate-400 shrink-0" />
          <span className="font-medium">Giới tính: <span className="font-bold">{member.gender}</span></span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-600">
          <Calendar size={12} className="text-slate-400 shrink-0" />
          <span className="font-medium">Ngày sinh: <span className="font-bold">{formatDate(member.dob)}</span></span>
        </div>
        <div className="col-span-2 flex items-center gap-2 text-[11px] text-slate-600">
          <CheckCircle2 size={12} className="text-slate-400 shrink-0" />
          <span className="font-medium">Vào Hội: <span className="font-bold text-vietnam-red">{member.joinDate}</span></span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-3">
        <span className={cn(
          "text-[10px] uppercase font-bold py-1 px-2 rounded-md",
          member.status === 'Đang sinh hoạt' ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
        )}>
          {member.status}
        </span>
        <span className="text-[10px] uppercase font-bold py-1 px-2 rounded-md bg-blue-50 text-blue-600">
          {member.position}
        </span>
      </div>
    </div>

    <button 
      onClick={onView}
      className="w-full flex items-center justify-center gap-2 py-4 bg-slate-100 text-slate-700 hover:bg-vietnam-red hover:text-white rounded-xl font-black transition-all text-sm group/btn"
    >
      XEM CHI TIẾT
      <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
    </button>
  </div>
);

const DetailItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex items-start gap-3">
    <div className="mt-1 text-vietnam-red/70">{icon}</div>
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className="text-sm font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

const DataPoint = ({ label, value, isStatus, className }: { label: string, value: string, isStatus?: boolean, className?: string }) => (
  <div className={cn("space-y-0.5", className)}>
    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
    <p className={cn(
      "text-sm font-semibold",
      isStatus && value === 'Đang sinh hoạt' ? "text-emerald-600" : "text-slate-800"
    )}>
      {value}
    </p>
  </div>
);

const ReportAction = ({ title, desc, icon }: { title: string, desc: string, icon: React.ReactNode }) => (
  <button className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-sm border border-slate-200 hover:border-vietnam-red transition-all text-left">
    <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
      {React.cloneElement(icon as React.ReactElement, { size: 32 })}
    </div>
    <div>
      <h4 className="font-bold text-lg mb-1">{title}</h4>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
    </div>
  </button>
);

const MemberForm = ({ branches, initialData, onSubmit, currentUser }: { branches: Branch[], initialData?: Member, onSubmit: (m: Member) => void, currentUser: User }) => {
  const [formData, setFormData] = useState<Partial<Member>>(initialData || {
    gender: 'Nam',
    status: 'Đang sinh hoạt',
    branchId: currentUser.role === 'BRANCH_LEADER' ? currentUser.branchId : branches[0]?.id,
    professionalQualification: 'Khác',
    politicalTheory: 'Khác',
    category: 'Cựu chiến binh',
    memberCode: initialData?.memberCode || `CCB-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
  });
  
  const [errors, setErrors] = useState<string[]>([]);

  const isLeaveInfoMandatory = ['Đã chuyển đi', 'Chết', 'Ra khỏi Hội'].includes(formData.status || '');

  const mandatoryFieldsTitles: {[key: string]: string} = {
    fullName: "(1) Họ và tên",
    dob: "(2) Ngày, tháng, năm sinh",
    gender: "(3) Giới tính",
    ethnicity: "(4) Dân tộc",
    religion: "(5) Tôn giáo",
    citizenId: "(6) Số CC/CCCD",
    memberCode: "(7) Số thẻ hội viên",
    hometown: "(9) Quê quán",
    address: "(10) Nơi ở hiện nay",
    enlistDate: "(11) Tháng, năm tham gia CM/Nhập ngũ",
    enlistUnit: "(12) Đơn vị nhập ngũ",
    dischargeDate: "(13) Tháng, năm xuất ngũ/CN/Nghỉ hưu",
    dischargeInfo: "(14) Cấp bậc, chức vụ, đơn vị khi xuất ngũ",
    joinDate: "(15) Tháng, năm vào Hội",
    position: "(16) Chức vụ Hội",
    status: "(26) Tình trạng sinh hoạt"
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const missingFields: string[] = [];
    Object.keys(mandatoryFieldsTitles).forEach(field => {
      if (!formData[field as keyof Member]) {
        missingFields.push(mandatoryFieldsTitles[field]);
      }
    });

    if (isLeaveInfoMandatory && !formData.leaveDateAndReason) {
      missingFields.push("(27) Ngày/Lý do chuyển đi/mất/ra Hội");
    }

    if (missingFields.length > 0) {
      setErrors(missingFields);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const result = {
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      ...formData
    } as Member;
    onSubmit(result);
  };

  const renderLabel = (label: string, fieldName: keyof Member) => {
    const isMandatory = mandatoryFieldsTitles[fieldName] || (fieldName === 'leaveDateAndReason' && isLeaveInfoMandatory);
    return (
      <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">
        {label} {isMandatory && <span className="text-vietnam-red">*</span>}
      </label>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* 0. Photo Upload */}
      <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full bg-white border-4 border-white shadow-xl overflow-hidden flex items-center justify-center text-slate-200">
            {formData.imageUrl ? (
              <img src={formData.imageUrl} alt="Hội viên" className="w-full h-full object-cover" />
            ) : (
              <Camera size={48} />
            )}
          </div>
          <label className="absolute bottom-0 right-0 w-10 h-10 bg-vietnam-red text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform">
            <Camera size={20} />
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setFormData({...formData, imageUrl: reader.result as string});
                  };
                  reader.readAsDataURL(file);
                }
              }} 
            />
          </label>
        </div>
        <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">
          Tải ảnh lên hoặc chụp chân dung bằng điện thoại
        </p>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border-2 border-red-100 p-6 rounded-2xl flex flex-col gap-3">
          <div className="flex items-center gap-2 text-red-600 font-bold">
            <AlertCircle size={20} />
            <span>KHÔNG THỂ LƯU HỒ SƠ: VUI LÒNG NHẬP ĐẦY ĐỦ THÔNG TIN BẮT BUỘC</span>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 pl-7">
            {errors.map((err, i) => (
              <li key={i} className="text-xs text-red-500 font-medium list-disc">{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Grid container for fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* 1. Họ và tên */}
        <div className="space-y-1">
          {renderLabel("(1) Họ và tên", "fullName")}
          <input 
            type="text" className="w-full"
            value={formData.fullName || ''}
            onChange={e => setFormData({...formData, fullName: e.target.value})}
          />
        </div>

        {/* 2. Ngày sinh */}
        <div className="space-y-1">
          {renderLabel("(2) Ngày, tháng, năm sinh", "dob")}
          <input 
            type="date" className="w-full"
            value={formData.dob || ''}
            onChange={e => setFormData({...formData, dob: e.target.value})}
          />
        </div>

        {/* 3. Giới tính */}
        <div className="space-y-1 text-slate-500 border rounded-lg overflow-hidden flex flex-col justify-end bg-slate-50/30">
          {renderLabel("(3) Giới tính", "gender")}
          <select 
            className="w-full border-none bg-transparent h-10 px-3 cursor-pointer outline-none"
            value={formData.gender || 'Nam'}
            onChange={e => setFormData({...formData, gender: e.target.value as any})}
          >
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
        </div>

        {/* 4. Dân tộc */}
        <div className="space-y-1">
          {renderLabel("(4) Dân tộc", "ethnicity")}
          <input 
            type="text" className="w-full"
            value={formData.ethnicity || ''}
            onChange={e => setFormData({...formData, ethnicity: e.target.value})}
          />
        </div>

        {/* 5. Tôn giáo */}
        <div className="space-y-1">
          {renderLabel("(5) Tôn giáo", "religion")}
          <input 
            type="text" className="w-full"
            value={formData.religion || ''}
            onChange={e => setFormData({...formData, religion: e.target.value})}
          />
        </div>

        {/* 6. Số CCCD */}
        <div className="space-y-1">
          {renderLabel("(6) Số CC/CCCD", "citizenId")}
          <input 
            type="text" className="w-full"
            value={formData.citizenId || ''}
            onChange={e => setFormData({...formData, citizenId: e.target.value})}
          />
        </div>

        {/* 7. Số thẻ hội viên */}
        <div className="space-y-1">
          {renderLabel("(7) Số thẻ hội viên", "memberCode")}
          <input 
            type="text" className="w-full"
            value={formData.memberCode || ''}
            onChange={e => setFormData({...formData, memberCode: e.target.value})}
          />
        </div>

        {/* 8. Số điện thoại */}
        <div className="space-y-1">
          {renderLabel("(8) Số điện thoại", "phone")}
          <input 
            type="tel" className="w-full"
            value={formData.phone || ''}
            onChange={e => setFormData({...formData, phone: e.target.value})}
          />
        </div>

        {/* 9. Quê quán */}
        <div className="space-y-1 md:col-span-2">
          {renderLabel("(9) Quê quán", "hometown")}
          <input 
            type="text" className="w-full"
            value={formData.hometown || ''}
            onChange={e => setFormData({...formData, hometown: e.target.value})}
          />
        </div>

        {/* 10. Nơi ở hiện nay */}
        <div className="space-y-1 md:col-span-2">
          {renderLabel("(10) Nơi ở hiện nay", "address")}
          <input 
            type="text" className="w-full"
            value={formData.address || ''}
            onChange={e => setFormData({...formData, address: e.target.value})}
          />
        </div>

        {/* 11. Nhập ngũ */}
        <div className="space-y-1">
          {renderLabel("(11) Tháng, năm tham gia CM/Nhập ngũ", "enlistDate")}
          <input 
            type="month" className="w-full"
            value={formData.enlistDate || ''}
            onChange={e => setFormData({...formData, enlistDate: e.target.value})}
          />
        </div>

        {/* 12. Đơn vị nhập ngũ */}
        <div className="space-y-1">
          {renderLabel("(12) Đơn vị nhập ngũ", "enlistUnit")}
          <input 
            type="text" className="w-full"
            value={formData.enlistUnit || ''}
            onChange={e => setFormData({...formData, enlistUnit: e.target.value})}
          />
        </div>

        {/* 13. Xuất ngũ */}
        <div className="space-y-1">
          {renderLabel("(13) Tháng, năm xuất ngũ/CN/Nghỉ hưu", "dischargeDate")}
          <input 
            type="month" className="w-full"
            value={formData.dischargeDate || ''}
            onChange={e => setFormData({...formData, dischargeDate: e.target.value})}
          />
        </div>

        {/* 14. Thông tin khi xuất ngũ */}
        <div className="space-y-1">
          {renderLabel("(14) Cấp bậc, chức vụ, đơn vị khi xuất ngũ", "dischargeInfo")}
          <input 
            type="text" className="w-full"
            value={formData.dischargeInfo || ''}
            onChange={e => setFormData({...formData, dischargeInfo: e.target.value})}
          />
        </div>

        {/* 15. Vào Hội */}
        <div className="space-y-1">
          {renderLabel("(15) Tháng, năm vào Hội", "joinDate")}
          <input 
            type="month" className="w-full"
            value={formData.joinDate || ''}
            onChange={e => setFormData({...formData, joinDate: e.target.value})}
          />
        </div>

        {/* 15.1 Vào Đảng */}
        <div className="space-y-1">
          {renderLabel("Ngày, tháng, năm vào Đảng", "partyJoinDate")}
          <input 
            type="date" className="w-full"
            value={formData.partyJoinDate || ''}
            onChange={e => setFormData({...formData, partyJoinDate: e.target.value})}
          />
        </div>

        {/* 16. Chức vụ Hội */}
        <div className="space-y-1">
          {renderLabel("(16) Chức vụ Hội", "position")}
          <input 
            type="text" className="w-full"
            value={formData.position || ''}
            onChange={e => setFormData({...formData, position: e.target.value})}
          />
        </div>

        {/* 17. Giáo dục phổ thông */}
        <div className="space-y-1">
          {renderLabel("(17) Giáo dục phổ thông", "education")}
          <input 
            type="text" className="w-full" placeholder="Vd: 12/12"
            value={formData.education || ''}
            onChange={e => setFormData({...formData, education: e.target.value})}
          />
        </div>

        {/* 18. Trình độ chuyên môn */}
        <div className="space-y-1 text-slate-500 border rounded-lg overflow-hidden flex flex-col justify-end bg-slate-50/30">
          {renderLabel("(18) Trình độ chuyên môn", "professionalQualification")}
          <select 
            className="w-full border-none bg-transparent h-10 px-3 cursor-pointer outline-none"
            value={formData.professionalQualification || 'Khác'}
            onChange={e => setFormData({...formData, professionalQualification: e.target.value as any})}
          >
            <option value="Sơ cấp">Sơ cấp</option>
            <option value="Trung cấp">Trung cấp</option>
            <option value="Cao đẳng">Cao đẳng</option>
            <option value="Đại học">Đại học</option>
            <option value="Khác">Khác</option>
          </select>
        </div>

        {/* 19. Học hàm học vị */}
        <div className="space-y-1">
          {renderLabel("(19) Học hàm, học vị", "academicTitle")}
          <input 
            type="text" className="w-full"
            value={formData.academicTitle || ''}
            onChange={e => setFormData({...formData, academicTitle: e.target.value})}
          />
        </div>

        {/* 20. Lý luận chính trị */}
        <div className="space-y-1 text-slate-500 border rounded-lg overflow-hidden flex flex-col justify-end bg-slate-50/30">
          {renderLabel("(20) Lý luận chính trị", "politicalTheory")}
          <select 
            className="w-full border-none bg-transparent h-10 px-3 cursor-pointer outline-none"
            value={formData.politicalTheory || 'Khác'}
            onChange={e => setFormData({...formData, politicalTheory: e.target.value as any})}
          >
            <option value="Sơ cấp">Sơ cấp</option>
            <option value="Trung cấp">Trung cấp</option>
            <option value="Cao cấp">Cao cấp</option>
            <option value="Khác">Khác</option>
          </select>
        </div>

        {/* 21. Thuộc đối tượng */}
        <div className="space-y-1 text-slate-500 border rounded-lg overflow-hidden flex flex-col justify-end bg-slate-50/30">
          {renderLabel("(21) Thuộc đối tượng", "category")}
          <select 
            className="w-full border-none bg-transparent h-10 px-3 cursor-pointer outline-none"
            value={formData.category || 'Cựu chiến binh'}
            onChange={e => setFormData({...formData, category: e.target.value as any})}
          >
            <option value="Cựu chiến binh">Cựu chiến binh</option>
            <option value="Cựu quân nhân">Cựu quân nhân</option>
          </select>
        </div>

        {/* 22. Khen thưởng */}
        <div className="space-y-1">
          {renderLabel("(22) Các hình thức khen thưởng", "rewards")}
          <input 
            type="text" className="w-full"
            value={formData.rewards || ''}
            onChange={e => setFormData({...formData, rewards: e.target.value})}
          />
        </div>

        {/* 23. Kỷ luật */}
        <div className="space-y-1">
          {renderLabel("(23) Các hình thức kỷ luật", "disciplines")}
          <input 
            type="text" className="w-full"
            value={formData.disciplines || ''}
            onChange={e => setFormData({...formData, disciplines: e.target.value})}
          />
        </div>

        {/* 24. Kỷ niệm chương */}
        <div className="space-y-1">
          {renderLabel("(24) Tháng, năm nhận Kỷ niệm chương", "medalDate")}
          <input 
            type="month" className="w-full"
            value={formData.medalDate || ''}
            onChange={e => setFormData({...formData, medalDate: e.target.value})}
          />
        </div>

        {/* 25. Nghề nghiệp */}
        <div className="space-y-1">
          {renderLabel("(25) Nghề nghiệp hiện nay", "occupation")}
          <input 
            type="text" className="w-full"
            value={formData.occupation || ''}
            onChange={e => setFormData({...formData, occupation: e.target.value})}
          />
        </div>

        {/* 26. Tình trạng sinh hoạt */}
        <div className="space-y-1 text-slate-500 border rounded-lg overflow-hidden flex flex-col justify-end bg-slate-50/30">
          {renderLabel("(26) Tình trạng sinh hoạt", "status")}
          <select 
            className="w-full border-none bg-transparent h-10 px-3 cursor-pointer outline-none"
            value={formData.status || 'Đang sinh hoạt'}
            onChange={e => setFormData({...formData, status: e.target.value as any})}
          >
             <option value="Đang sinh hoạt">Đang sinh hoạt</option>
             <option value="Miễn sinh hoạt">Miễn sinh hoạt</option>
             <option value="Đã chuyển đi">Đã chuyển đi</option>
             <option value="Chết">Chết</option>
             <option value="Ra khỏi Hội">Ra khỏi Hội</option>
          </select>
        </div>

        {/* 27. Ngày chuyển đi / Lý do */}
        <div className="space-y-1">
          {renderLabel("(27) Ngày/Lý do chuyển đi/mất/ra Hội", "leaveDateAndReason")}
          <input 
            type="text" className="w-full" placeholder="Vd: 20/10/2023 - Chuyển sinh hoạt về quê"
            value={formData.leaveDateAndReason || ''}
            onChange={e => setFormData({...formData, leaveDateAndReason: e.target.value})}
          />
        </div>

        {/* 28. Đối tượng chính sách */}
        <div className="space-y-1">
          {renderLabel("(28) Thuộc đối tượng chính sách", "policyCategory")}
          <input 
            type="text" className="w-full" placeholder="Vd: Thương binh, Bệnh binh... "
            value={formData.policyCategory || ''}
            onChange={e => setFormData({...formData, policyCategory: e.target.value})}
          />
        </div>

        {/* Chi hội (hidden / context field) */}
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase text-slate-500 mb-1 block">Chi hội quản lý</label>
          <select 
            className="w-full"
            disabled={currentUser.role === 'BRANCH_LEADER'}
            value={formData.branchId}
            onChange={e => setFormData({...formData, branchId: e.target.value})}
          >
            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>

        {/* 29. Ghi chú */}
        <div className="space-y-1 md:col-span-2">
          {renderLabel("(29) Ghi chú thêm", "notes")}
          <textarea 
            className="w-full" rows={3}
            value={formData.notes || ''}
            onChange={e => setFormData({...formData, notes: e.target.value})}
          />
        </div>
      </div>

      <div className="pt-4">
        <button type="submit" className="w-full vn-gradient text-white font-black py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 text-lg">
          {initialData ? <Edit2 /> : <Plus />}
          {initialData ? 'CẬP NHẬT HỒ SƠ' : 'LƯU HỒ SƠ HỘI VIÊN'}
        </button>
      </div>
    </form>
  )
}
