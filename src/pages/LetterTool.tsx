import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateLetter, analyzeLetterRequirements } from '../lib/gemini';
import { ArrowLeft, ArrowRight, Printer, Save, CheckCircle, RefreshCw, Bot, CreditCard } from 'lucide-react';

const CATEGORIES = [
  "Government Application", "Certificate Request", "Job Application",
  "Bank Letter", "Legal Notice", "Complaint", "School/College", "Other"
];

const LANGUAGES = [
  "English", "Hindi (हिंदी)", "Telugu (తెలుగు)", "Tamil (தமிழ்)", "Kannada (ಕನ್ನಡ)",
  "Malayalam (മലയാളം)", "Bengali (বাংলা)", "Marathi (मराठी)", "Gujarati (ગુજરાતી)", 
  "Punjabi (ਪੰਜਾਬੀ)", "Odia (ଓଡ଼ିଆ)", "Urdu (اردو)"
];

const PAPER_FORMATS = [
  { id: 'a4', label: 'A4 Paper', desc: 'Standard (210×297mm)' },
  { id: 'legal', label: 'Legal Paper', desc: 'Long (216×356mm)' },
  { id: 'letterhead', label: 'Letter Head', desc: 'With top margin' }
];

export default function LetterTool() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Step 1 Data
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [format, setFormat] = useState('a4');
  const [senderType, setSenderType] = useState('self');

  // Step 2 Data
  const [senderName, setSenderName] = useState('');
  const [senderAddress, setSenderAddress] = useState('');
  const [senderMobile, setSenderMobile] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [recipientDesignation, setRecipientDesignation] = useState('');
  const [recipientDepartment, setRecipientDepartment] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  
  const [description, setDescription] = useState('');
  
  // AI Dynamic Fields
  const [analyzingReqs, setAnalyzingReqs] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [dynamicAnswers, setDynamicAnswers] = useState<Record<string, string>>({});

  // Step 3 Data
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isPaid, setIsPaid] = useState(false);

  const handleAnalyze = async () => {
    if (!description.trim()) return;
    setAnalyzingReqs(true);
    const reqs = await analyzeLetterRequirements(description, category);
    if (reqs.missingFields) {
      setMissingFields(reqs.missingFields);
    }
    setAnalyzingReqs(false);
  };

  const handleGenerate = async () => {
    setLoading(true);
    const allDetails = {
      letterType: category,
      senderName, senderAddress, senderMobile, date,
      recipientDesignation, recipientDepartment, recipientAddress,
      description,
      additionalFields: dynamicAnswers
    };

    const text = await generateLetter(allDetails, language.split(' ')[0]);
    setGeneratedLetter(text);
    setLoading(false);
    setStep(3);
  };

  const handlePayment = () => {
    // Mock Payment
    setIsPaid(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header - Hidden in print */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center print:hidden sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <button onClick={() => navigate('/dashboard')} className="text-slate-500 hover:text-slate-900 mr-2">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-slate-900">Letter Generator</h1>
        </div>
        <div className="flex space-x-2">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-2.5 rounded-full w-12 sm:w-24 transition-all duration-300 ${step >= s ? 'bg-blue-600' : 'bg-slate-200'}`} />
          ))}
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 print:p-0 print:m-0 print:w-full print:max-w-none">
        
        {/* STEP 1 */}
        {step === 1 && (
          <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-10 mt-6 print:hidden">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Step 1: Letter Requirements</h2>
            
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Letter Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border border-slate-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 bg-slate-50 outline-none hover:bg-slate-100 transition">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Output Language</label>
                <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full border border-slate-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500 bg-slate-50 outline-none hover:bg-slate-100 transition">
                  {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">Paper Format</label>
                <div className="grid sm:grid-cols-3 gap-4">
                  {PAPER_FORMATS.map(pf => (
                    <div 
                      key={pf.id}
                      onClick={() => setFormat(pf.id)}
                      className={`cursor-pointer rounded-xl border-2 p-4 transition ${format === pf.id ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-blue-300 bg-white'}`}
                    >
                      <div className="font-bold text-slate-900 mb-1 flex items-center justify-between">
                        {pf.label}
                        {format === pf.id && <CheckCircle className="w-5 h-5 text-blue-600" />}
                      </div>
                      <div className="text-sm text-slate-500">{pf.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button onClick={() => setStep(2)} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold flex items-center hover:bg-blue-700 transition shadow-sm">
                  Next Step <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-10 mt-6 print:hidden">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Step 2: Fill Details</h2>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Sender Details */}
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 border-b pb-2">Sender Details</h3>
                <div><label className="block text-sm text-slate-600">Full Name</label><input value={senderName} onChange={e=>setSenderName(e.target.value)} type="text" className="w-full border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-blue-500 outline-none" /></div>
                <div><label className="block text-sm text-slate-600">Complete Address</label><textarea value={senderAddress} onChange={e=>setSenderAddress(e.target.value)} rows={2} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-blue-500 outline-none" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm text-slate-600">Mobile</label><input value={senderMobile} onChange={e=>setSenderMobile(e.target.value)} type="text" className="w-full border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-blue-500 outline-none" /></div>
                  <div><label className="block text-sm text-slate-600">Date</label><input value={date} onChange={e=>setDate(e.target.value)} type="date" className="w-full border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-blue-500 outline-none" /></div>
                </div>
              </div>

              {/* Recipient Details */}
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900 border-b pb-2">Recipient Details</h3>
                <div><label className="block text-sm text-slate-600">Designation (e.g. The Tahsildar)</label><input value={recipientDesignation} onChange={e=>setRecipientDesignation(e.target.value)} type="text" className="w-full border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-blue-500 outline-none" /></div>
                <div><label className="block text-sm text-slate-600">Department/Office</label><input value={recipientDepartment} onChange={e=>setRecipientDepartment(e.target.value)} type="text" className="w-full border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-blue-500 outline-none" /></div>
                <div><label className="block text-sm text-slate-600">Office Address</label><textarea value={recipientAddress} onChange={e=>setRecipientAddress(e.target.value)} rows={2} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-blue-500 outline-none" /></div>
              </div>
            </div>

            {/* Letter Content & AI */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8">
              <label className="block font-bold text-slate-900 mb-2 flex items-center">
                <Bot className="w-5 h-5 text-blue-600 mr-2" /> Brief description of your request
              </label>
              <p className="text-sm text-slate-600 mb-3">Type in any language (e.g., "Mujhe ration card renew karwana hai")</p>
              <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                onBlur={handleAnalyze}
                rows={3} 
                className="w-full border border-blue-200 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none bg-white shadow-inner mb-4" 
                placeholder="Describe your issue simply..."
              />
              
              {analyzingReqs && <div className="text-blue-600 text-sm font-medium animate-pulse">🤖 AI is checking what else is needed...</div>}
              
              {missingFields.length > 0 && !analyzingReqs && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <h4 className="font-bold text-yellow-800 mb-3 text-sm">AI Suggested Required Fields:</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {missingFields.map(field => (
                      <div key={field}>
                        <label className="block text-xs font-bold text-yellow-900 mb-1">{field}</label>
                        <input 
                          type="text" 
                          value={dynamicAnswers[field] || ''}
                          onChange={e => setDynamicAnswers({...dynamicAnswers, [field]: e.target.value})}
                          className="w-full border border-yellow-300 rounded-md p-2 bg-white text-sm outline-none focus:ring-2 focus:ring-yellow-500" 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-slate-100">
              <button onClick={() => setStep(1)} className="text-slate-500 font-bold hover:text-slate-800 transition">← Back</button>
              <button 
                onClick={handleGenerate} 
                disabled={loading}
                className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold flex items-center hover:bg-green-700 transition shadow-sm disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-5 h-5 animate-spin mr-2" /> : <Bot className="w-5 h-5 mr-2" />}
                {loading ? 'AI Generating...' : 'Generate Letter'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="flex flex-col lg:flex-row gap-6 print:block">
            {/* Left Panel - Controls - Hidden in print */}
            <div className="w-full lg:w-80 shrink-0 print:hidden space-y-6">
              
              {!isPaid ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-2">💳 Payment Required</h3>
                  <p className="text-sm text-slate-600 mb-4">You must pay to print or download the full letter without watermarks.</p>
                  
                  <div className="flex justify-between items-center mb-6 py-3 border-y border-yellow-200/50">
                    <span className="text-slate-600 font-medium">Generation Fee</span>
                    <span className="font-extrabold text-lg text-slate-900">₹20</span>
                  </div>

                  <button onClick={handlePayment} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-sm flex items-center justify-center">
                    <CreditCard className="w-5 h-5 mr-2"/> Pay & Unlock
                  </button>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center text-green-700 font-bold mb-4">
                    <CheckCircle className="w-5 h-5 mr-2" /> Unlocked & Ready
                  </div>
                  
                  <div className="space-y-3">
                    <button onClick={handlePrint} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition flex items-center justify-center shadow-md">
                      <Printer className="w-5 h-5 mr-2"/> Print Letter
                    </button>
                    <button className="w-full bg-white text-slate-700 border border-slate-300 py-3 rounded-xl font-bold hover:bg-slate-50 transition flex items-center justify-center">
                      <Save className="w-5 h-5 mr-2"/> Download PDF
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4">Formatting</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Font Size</label>
                    <input type="range" min="10" max="16" defaultValue="12" className="w-full mt-2" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Margins</label>
                    <input type="range" min="10" max="40" defaultValue="25" className="w-full mt-2" />
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <button onClick={() => setStep(2)} className="text-blue-600 font-medium hover:underline text-sm flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Edit details
                  </button>
                </div>
              </div>
            </div>

            {/* Right Panel - Letter Canvas */}
            <div className="flex-1 lg:pl-6 print:p-0">
              <div className="bg-slate-200/50 p-4 sm:p-8 rounded-xl print:p-0 print:bg-transparent overflow-x-auto min-h-screen">
                {/* The Paper */}
                <div 
                  className={`bg-white shadow-xl mx-auto print:shadow-none print:m-0 relative ${!isPaid ? 'select-none pointer-events-none' : ''}`}
                  style={{
                    width: format === 'a4' ? '210mm' : format === 'legal' ? '216mm' : '210mm',
                    minHeight: format === 'a4' ? '297mm' : format === 'legal' ? '356mm' : '297mm',
                    padding: '25mm',
                    fontFamily: '"Times New Roman", serif',
                    fontSize: '12pt',
                    lineHeight: '1.5',
                    color: '#000'
                  }}
                >
                  {!isPaid && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[1px] print:hidden">
                      <div className="border border-slate-400 opacity-20 text-slate-400 font-extrabold text-6xl rotate-45 pointer-events-none p-4 whitespace-nowrap">
                        PREVIEW ONLY
                      </div>
                    </div>
                  )}

                  <div 
                    contentEditable={isPaid}
                    suppressContentEditableWarning
                    className="whitespace-pre-wrap outline-none"
                  >
                    {generatedLetter || "Letter content loading..."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
