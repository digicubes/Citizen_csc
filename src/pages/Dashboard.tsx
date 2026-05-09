import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { initRazorpayPayment } from '../lib/razorpay';
import { 
  Home, FileText, CreditCard, Settings, LogOut, 
  Plus, CheckCircle2, Languages, User, Menu, X, Clock, FileBadge
} from 'lucide-react';

const RECHARGE_PLANS = [
  { amount: 100, letters: 5, bonus: 0 },
  { amount: 200, letters: 10, bonus: 0 },
  { amount: 500, letters: 25, bonus: 5, popular: true },
  { amount: 1000, letters: 50, bonus: 15 }
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [recentLetters, setRecentLetters] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }

      // We rely on real firebase for this, but handle failures
      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserProfile({ id: user.uid, ...userSnap.data() });
        }

        const lettersQ = query(
          collection(db, 'letters'), 
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const lettersSnap = await getDocs(lettersQ);
        setRecentLetters(lettersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Firebase fetch error", err);
        // Fallback for preview
        setUserProfile({
          name: user.displayName || 'Demo User',
          email: user.email,
          credits: 0,
          userType: 'public',
        });
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  const handleRecharge = (plan: any) => {
    // 2000 paise = 20 INR
    initRazorpayPayment(plan.amount * 100, userProfile?.id, `Recharge ${plan.letters} Letters`, () => {
      // In a real app, logic to securely add credits would run on a backend webhook
      alert(`Payment fake-success! In a complete system, ${plan.letters + plan.bonus} credits would be added.`);
      window.location.reload();
    });
  };

  const menuItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'my-letters', icon: FileBadge, label: 'My Letters' },
    { id: 'billing', icon: CreditCard, label: 'Credits & Billing' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  if (!userProfile) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <FileText className="w-6 h-6 text-blue-600 mr-2" />
          <span className="text-xl font-bold text-slate-900">Citizen CSC</span>
        </div>
        
        <div className="p-4 border-b border-slate-200 text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
            {userProfile?.name?.charAt(0) || 'U'}
          </div>
          <h3 className="font-bold text-slate-900">{userProfile?.name}</h3>
          <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full mt-1 uppercase tracking-wider font-semibold">
            {userProfile?.userType === 'operator' ? 'CSC Operator' : 'Public User'}
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition font-medium ${
                activeTab === item.id 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <item.icon className={`w-5 h-5 mr-3 ${activeTab === item.id ? 'text-blue-600' : 'text-slate-400'}`} />
              {item.label}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-200">
          <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition font-medium">
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4">
          <div className="flex items-center">
            <FileText className="w-6 h-6 text-blue-600 mr-2" />
            <span className="text-xl font-bold text-slate-900">Citizen CSC</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600">
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 absolute w-full z-10 shadow-lg">
            <nav className="p-4 space-y-1">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center px-4 py-3 rounded-xl transition ${activeTab === item.id ? 'bg-blue-50 text-blue-700' : 'text-slate-600'}`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              ))}
              <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 text-slate-600">
                <LogOut className="w-5 h-5 mr-3" /> Logout
              </button>
            </nav>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          
          {activeTab === 'home' && (
            <div className="max-w-4xl max-w-5xl">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">Welcome back, {userProfile.name}</h1>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Credit Card */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <CreditCard className="w-32 h-32" />
                  </div>
                  <h3 className="text-blue-100 font-medium mb-1 relative z-10">Total Letter Credits</h3>
                  <div className="text-4xl font-extrabold mb-6 relative z-10">{userProfile.credits || 0}</div>
                  
                  <div className="flex space-x-4 relative z-10">
                    <Link to="/letter-tool" className="bg-white text-blue-700 px-5 py-2.5 rounded-xl font-bold hover:bg-blue-50 transition shadow-sm flex items-center">
                      <Plus className="w-5 h-5 mr-1" /> New Letter
                    </Link>
                    <button onClick={() => setActiveTab('billing')} className="bg-blue-500/30 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-500/50 transition">
                      Add Credits
                    </button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-center">
                  <h3 className="text-slate-500 font-medium mb-4">Your Activity</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-3xl font-bold text-slate-900">{userProfile.totalLetters || 0}</div>
                      <div className="text-sm text-slate-500">Total Letters</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-slate-900">{userProfile.userType === 'operator' ? '10' : '20'}</div>
                      <div className="text-sm text-slate-500">₹ per Letter</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center"><Clock className="w-5 h-5 mr-2 text-slate-400" /> Recent Letters</h3>
                  <button onClick={() => setActiveTab('my-letters')} className="text-sm text-blue-600 font-medium hover:text-blue-700">View All</button>
                </div>
                <div className="p-0">
                  {recentLetters.length > 0 ? (
                    <ul className="divide-y divide-slate-100">
                      {recentLetters.map(letter => (
                        <li key={letter.id} className="p-6 hover:bg-slate-50 transition flex items-center justify-between">
                          <div>
                            <p className="font-bold text-slate-900">{letter.letterType}</p>
                            <p className="text-sm text-slate-500">{new Date(letter.createdAt?.toDate?.() || Date.now()).toLocaleDateString()} • {letter.language}</p>
                          </div>
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Completed</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-12 text-center text-slate-500">
                      <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p>No letters generated yet.</p>
                      <Link to="/letter-tool" className="inline-block mt-4 text-blue-600 font-bold hover:underline">Generate your first letter →</Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="max-w-5xl">
               <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">Recharge Credits</h1>
               
               <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm mb-8 flex items-center justify-between">
                 <div>
                   <p className="text-slate-500 font-medium">Current Balance</p>
                   <p className="text-3xl font-bold text-slate-900">{userProfile.credits || 0} Credits</p>
                 </div>
               </div>

               <h2 className="text-xl font-bold text-slate-900 mb-4">Select a Package</h2>
               <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                 {RECHARGE_PLANS.map((plan, i) => (
                   <div key={i} className={`relative bg-white border ${plan.popular ? 'border-amber-400 shadow-md shadow-amber-100' : 'border-slate-200'} rounded-3xl p-6 flex flex-col`}>
                     {plan.popular && (
                       <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</span>
                     )}
                     <h3 className="text-slate-500 font-medium text-center mb-2">₹{plan.amount}</h3>
                     <div className="text-center mb-6">
                       <span className="text-4xl font-extrabold text-slate-900">{plan.letters}</span>
                       <span className="text-slate-500 font-medium block">Letters</span>
                     </div>
                     {plan.bonus > 0 && (
                       <div className="bg-green-50 text-green-700 text-sm font-bold p-2 text-center rounded-lg mb-6 border border-green-100">
                         + {plan.bonus} Bonus Letters
                       </div>
                     )}
                     <div className="mt-auto">
                       <button onClick={() => handleRecharge(plan)} className={`w-full py-3 rounded-xl font-bold transition ${plan.popular ? 'bg-amber-400 text-amber-900 hover:bg-amber-500' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                         Recharge
                       </button>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-3xl">
               <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">Profile Settings</h1>
               <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                 <div className="space-y-6">
                   <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                     <input type="text" disabled value={userProfile.name} className="block w-full border border-slate-300 rounded-lg py-2.5 px-3 bg-slate-50" />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                     <input type="text" disabled value={userProfile.email} className="block w-full border border-slate-300 rounded-lg py-2.5 px-3 bg-slate-50" />
                   </div>
                   <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition">
                     Update Profile
                   </button>
                 </div>
               </div>
            </div>
          )}

          {activeTab === 'my-letters' && (
             <div className="max-w-5xl">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">My Letters</h1>
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm p-8 text-center">
                  <FileBadge className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-900 mb-2">No letters found</h3>
                  <p className="text-slate-500 mb-6">You haven't generated any letters yet.</p>
                  <Link to="/letter-tool" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
                    Generate Letter Now
                  </Link>
                </div>
             </div>
          )}

        </main>
      </div>
    </div>
  );
}
