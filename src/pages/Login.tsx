import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ShieldCheck, UserCircle, Building, Mail, Lock, Phone, MapPin } from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState('public'); // public, operator
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [stateName, setStateName] = useState('');
  const [cscId, setCscId] = useState('');

  const handleAuthError = (err: any) => {
    alert(err.message || 'Authentication Failed');
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user docs exist
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          userType: 'public', // Default for Google Sign In
          credits: 0,
          totalLetters: 0,
          createdAt: new Date(),
        });
      }
      navigate('/dashboard');
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/dashboard');
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;
        
        await setDoc(doc(db, 'users', user.uid), {
          name,
          email,
          mobile,
          userType,
          state: stateName,
          cscId: userType === 'operator' ? cscId : null,
          credits: 0, // Starts at 0
          totalLetters: 0,
          createdAt: new Date(),
        });
        navigate('/dashboard');
      }
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center space-x-2">
          <ShieldCheck className="h-10 w-10 text-blue-600" />
          <span className="text-2xl font-bold text-slate-900 tracking-tight">Citizen CSC</span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
          {isLogin ? 'Sign in to your account' : 'Create a new account'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          
          <div className="flex p-1 mb-8 bg-slate-100 rounded-xl">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${isLogin ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Login
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${!isLogin ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Register
            </button>
          </div>

          {!isLogin && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">I am registering as a:</label>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => setUserType('public')}
                  className={`flex flex-col items-center p-4 border rounded-xl transition ${userType === 'public' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}
                >
                  <UserCircle className="w-6 h-6 mb-2" />
                  <span className="text-sm font-bold">Public User</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setUserType('operator')}
                  className={`flex flex-col items-center p-4 border rounded-xl transition ${userType === 'operator' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}
                >
                  <Building className="w-6 h-6 mb-2" />
                  <span className="text-sm font-bold">CSC Operator</span>
                </button>
              </div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserCircle className="h-5 w-5 text-slate-400" />
                    </div>
                    <input type="text" required value={name} onChange={e => setName(e.target.value)} className="pl-10 block w-full border border-slate-300 rounded-lg py-2.5 focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-slate-400" />
                    </div>
                    <input type="tel" required value={mobile} onChange={e => setMobile(e.target.value)} className="pl-10 block w-full border border-slate-300 rounded-lg py-2.5 focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-slate-400" />
                    </div>
                    <input type="text" required value={stateName} onChange={e => setStateName(e.target.value)} className="pl-10 block w-full border border-slate-300 rounded-lg py-2.5 focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none" />
                  </div>
                </div>

                {userType === 'operator' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">CSC Registration ID</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <ShieldCheck className="h-5 w-5 text-slate-400" />
                      </div>
                      <input type="text" required value={cscId} onChange={e => setCscId(e.target.value)} className="pl-10 block w-full border border-slate-300 rounded-lg py-2.5 focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none" />
                    </div>
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="pl-10 block w-full border border-slate-300 rounded-lg py-2.5 focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="pl-10 block w-full border border-slate-300 rounded-lg py-2.5 focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none" />
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded" />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900">Remember me</label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Forgot password?</a>
                </div>
              </div>
            )}

            <div>
              <button disabled={loading} type="submit" className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:opacity-50">
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button onClick={handleGoogleSignIn} disabled={loading} className="w-full flex justify-center bg-white py-2.5 px-4 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                </svg>
                Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
