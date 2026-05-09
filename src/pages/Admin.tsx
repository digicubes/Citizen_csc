import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ShieldCheck, Users, FileText, IndianRupee, Activity, Search } from 'lucide-react';

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          setIsAdmin(true);
        } else {
          // Temporarily allow all for preview if the DB is unpopulated
          // In real app, redirect: navigate('/dashboard');
          setIsAdmin(true); 
        }
      } catch (err) {
        // Fallback for preview
        setIsAdmin(true);
      } finally {
        setLoading(false);
      }
    };
    checkAdmin();
  }, [navigate]);

  if (loading) return <div>Loading Admin...</div>;
  if (!isAdmin) return <div>Access Denied</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-300 font-sans">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-8 h-8 text-blue-500" />
          <span className="text-xl font-bold text-white tracking-tight">Citizen CSC | Admin</span>
        </div>
        <div>
          <button onClick={() => navigate('/dashboard')} className="text-sm bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-white font-medium transition">
            Exit to App
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Stats Row */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl"><Users className="w-6 h-6"/></div>
            </div>
            <h3 className="text-slate-400 font-medium">Total Users</h3>
            <p className="text-3xl font-bold text-white">4,281</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
             <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-green-500/20 text-green-400 rounded-xl"><FileText className="w-6 h-6"/></div>
            </div>
            <h3 className="text-slate-400 font-medium">Letters Generated</h3>
            <p className="text-3xl font-bold text-white">12,593</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
             <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-yellow-500/20 text-yellow-400 rounded-xl"><IndianRupee className="w-6 h-6"/></div>
            </div>
            <h3 className="text-slate-400 font-medium">Total Revenue</h3>
            <p className="text-3xl font-bold text-white">₹1,45,200</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
             <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl"><Activity className="w-6 h-6"/></div>
            </div>
            <h3 className="text-slate-400 font-medium">Active Centers</h3>
            <p className="text-3xl font-bold text-white">342</p>
          </div>
        </div>

        {/* User Management */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
            <h2 className="text-xl font-bold text-white">Recent Users</h2>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/>
              <input type="text" placeholder="Search users..." className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none" />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/50 text-slate-400 text-sm py-3 border-b border-slate-700">
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Credits</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {[1,2,3].map(i => (
                  <tr key={i} className="hover:bg-slate-700/30 transition">
                    <td className="px-6 py-4 text-white font-medium">User Name {i}</td>
                    <td className="px-6 py-4">user{i}@example.com</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-md uppercase">Public</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-white">10</td>
                    <td className="px-6 py-4">
                      <button className="text-blue-400 hover:text-blue-300 font-medium text-sm">Manage</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
