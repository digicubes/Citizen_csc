import { Link } from 'react-router-dom';
import { 
  FileText, ShieldCheck, CreditCard, Languages, 
  History, Building2, CheckCircle2, ChevronRight,
  Menu, X
} from 'lucide-react';
import { useState } from 'react';

const FEATURES = [
  { icon: FileText, title: "AI-Powered Letters", desc: "Gemini AI generates perfect official letters instantly." },
  { icon: ShieldCheck, title: "Professional Print Layouts", desc: "A4, Legal, Bond, and Letterhead print-ready formats." },
  { icon: CreditCard, title: "Pay Per Letter", desc: "₹20/letter for public, ₹10/letter for registered centers." },
  { icon: Languages, title: "15 Indian Languages", desc: "Write securely in Hindi, Telugu, Marathi, Tamil, and more." },
  { icon: History, title: "Letter History", desc: "Access, download, and reprint your past documents anytime." },
  { icon: Building2, title: "CSC Center Dashboard", desc: "Dedicated tools for village level entrepreneurs and operators." },
];

const LETTER_TYPES = [
  "Government Applications", "Income & Caste Certificates", "Job Applications & NOCs",
  "Bank Letters (Loan/Dispute)", "Legal Notices & Affidavits", "School/College Applications",
  "Police Complaints/FIR", "Utility Complaints", "Medical Letters", "Property & Land Letters"
];

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-slate-900 tracking-tight">Citizen CSC</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-blue-600 font-medium">Features</a>
              <a href="#pricing" className="text-slate-600 hover:text-blue-600 font-medium">Pricing</a>
              
              <div className="flex items-center space-x-4 ml-4 border-l pl-6 border-slate-200">
                <select className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer">
                  <option>English</option>
                  <option>हिंदी</option>
                  <option>తెలుగు</option>
                </select>
                <Link to="/login" className="text-slate-600 font-medium hover:text-blue-600">Login</Link>
                <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                  Register
                </Link>
              </div>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-4">
            <a href="#features" className="block text-slate-600 font-medium">Features</a>
            <a href="#pricing" className="block text-slate-600 font-medium">Pricing</a>
            <Link to="/login" className="block text-blue-600 font-medium">Login / Register</Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-24 px-4 overflow-hidden relative">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
          <div className="w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
        </div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3">
          <div className="w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-50"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span>Powered by Google Gemini</span>
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              AI-Powered Letter Generator <br className="hidden md:block"/> for Every Indian.
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed">
              Create government letters, applications & formal documents in seconds — in your preferred language. Perfect for CSC Centers and citizens.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/login" className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-lg shadow-blue-200 transition transform hover:-translate-y-0.5">
                Start Free Trial
              </Link>
              <a href="#how-it-works" className="w-full sm:w-auto bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition flex items-center justify-center">
                Watch Demo
              </a>
            </div>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-6 sm:gap-12 text-slate-500 font-medium text-sm">
            <div className="flex items-center"><CheckCircle2 className="w-5 h-5 text-green-500 mr-2" /> 10,000+ Letters Generated</div>
            <div className="flex items-center"><CheckCircle2 className="w-5 h-5 text-green-500 mr-2" /> 500+ CSC Centers</div>
            <div className="flex items-center"><CheckCircle2 className="w-5 h-5 text-green-500 mr-2" /> 15 Indian Languages</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need to run your center</h2>
            <p className="text-slate-600">Built specifically for the needs of Indian public service operators.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature, idx) => (
              <div key={idx} className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-md transition">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 border border-slate-200">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Letter Types */}
      <section className="py-24 bg-slate-900 text-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Any Letter. Any Language.</h2>
              <p className="text-slate-400 text-lg mb-8">From complex legal notices to simple RTI applications, our AI understands context and formats it perfectly to meet government standards.</p>
              <Link to="/login" className="inline-flex items-center text-blue-400 font-semibold hover:text-blue-300">
                View all templates <ChevronRight className="w-5 h-5 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {LETTER_TYPES.map((type, idx) => (
                <div key={idx} className="bg-slate-800/50 border border-slate-700 p-4 rounded-lg flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-green-400 shrink-0" />
                  <span className="text-sm font-medium text-slate-200">{type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-slate-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-slate-600">Pay only for what you generate. No hidden subscriptions.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Consumer Plan */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Public User</h3>
              <p className="text-slate-500 mb-6">For individual citizens</p>
              <div className="mb-8">
                <span className="text-4xl font-extrabold text-slate-900">₹20</span>
                <span className="text-slate-500 font-medium"> / letter</span>
              </div>
              <ul className="space-y-4 mb-8">
                {["Any letter type", "Print ready format (A4/Legal)", "Download as PDF", "Email copy included", "Hindi & English support"].map((item, i) => (
                  <li key={i} className="flex items-center text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 mr-3 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
              <Link to="/login" className="block w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-center rounded-xl transition">
                Create Account
              </Link>
            </div>

            {/* Operator Plan */}
            <div className="bg-blue-600 rounded-3xl p-8 border border-blue-500 shadow-xl shadow-blue-900/10 relative text-white">
              <div className="absolute top-0 right-8 -translate-y-1/2">
                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 pb-1.5 rounded-full uppercase tracking-wider">Recommended</span>
              </div>
              <h3 className="text-xl font-bold mb-2">CSC / Operator</h3>
              <p className="text-blue-200 mb-6">For cyber cafes & centers</p>
              <div className="mb-8">
                <span className="text-4xl font-extrabold">₹10</span>
                <span className="text-blue-200 font-medium"> / letter</span>
              </div>
              <ul className="space-y-4 mb-8">
                {["All Public features included", "Bulk letter discounts", "Custom Center Letterhead", "All 15 Indian Languages", "Operator admin dashboard"].map((item, i) => (
                  <li key={i} className="flex items-center text-blue-50">
                    <CheckCircle2 className="w-5 h-5 text-green-300 mr-3 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
              <Link to="/login" className="block w-full py-3 px-4 bg-white hover:bg-blue-50 text-blue-700 font-bold text-center rounded-xl transition shadow-sm">
                Register as Center
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <ShieldCheck className="h-10 w-10 text-slate-300 mb-6" />
          <p className="text-slate-500 font-medium mb-2">Made for Bharat 🇮🇳</p>
          <div className="flex space-x-6 text-sm text-slate-400">
            <a href="#" className="hover:text-slate-600">Privacy Policy</a>
            <a href="#" className="hover:text-slate-600">Terms of Service</a>
            <a href="#" className="hover:text-slate-600">WhatsApp Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
