/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ClipboardCheck, 
  UserPlus, 
  CircleDollarSign, 
  Send,
  MessageSquare,
  HelpCircle,
  Clock,
  Briefcase,
  Globe,
  PenLine
} from 'lucide-react';

// --- Sub-components (defined in same file for brevity but treated as distinct units) ---

const SectionHeader = ({ label, title, description, center = false }: { label?: string, title: string, description?: string, center?: boolean }) => (
  <div className={`mb-12 ${center ? 'text-center' : ''}`}>
    {label && <span className="section-label">{label}</span>}
    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">{title}</h2>
    {description && <p className="text-lg text-slate-400 max-w-2xl mx-auto">{description}</p>}
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<'how' | 'write' | 'form'>('how');
  const generatorRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen font-sans selection:bg-blue-500/30 selection:text-blue-100">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-500 z-50 origin-left"
        style={{ scaleX }}
      />
      
      {/* Navbar */}
      <nav className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0A0C10]/80 backdrop-blur-xl px-4 md:px-8 py-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-xs">DR</span>
          </div>
          <span className="font-bold text-lg tracking-tight">Datarails <span className="text-blue-500">Advocacy</span></span>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => scrollTo(generatorRef)}
            className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
          >
            AI Assistant
          </button>
          <button 
            onClick={() => scrollTo(formRef)}
            className="bg-blue-600 text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2"
          >
            Submit Post <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-32 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-16 items-center">
            <div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                  Earn $100 Per Post
                </div>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white leading-[1.1] mb-8">
                  Your Datarails story <br/>
                  <span className="text-blue-500 italic">is worth sharing.</span>
                </h1>
                <p className="text-xl text-slate-400 mb-10 max-w-lg leading-relaxed">
                  Tell your LinkedIn network how you transformed your finance workflow and we'll reward you with $100 and amplified reach.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => scrollTo(generatorRef)}
                    className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 group"
                  >
                    Help me write my post <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  </button>
                  <button 
                    onClick={() => scrollTo(formRef)}
                    className="bg-white border-none text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                  >
                    Submit Post URL <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 relative z-10 backdrop-blur-md">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center">
                    <Briefcase className="text-blue-400 w-6 h-6" />
                  </div>
                  <div>
                    <div className="h-3 w-32 bg-white/10 rounded-full mb-2"></div>
                    <div className="h-2 w-48 bg-white/5 rounded-full"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-3 w-full bg-white/5 rounded-full"></div>
                  <div className="h-3 w-[90%] bg-white/5 rounded-full"></div>
                  <div className="h-3 w-full bg-white/5 rounded-full"></div>
                  <div className="h-3 w-[70%] bg-blue-500/20 rounded-full"></div>
                </div>
                <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
                  <div className="flex gap-4">
                    <div className="w-6 h-6 bg-white/5 rounded"></div>
                    <div className="w-6 h-6 bg-white/5 rounded"></div>
                    <div className="w-6 h-6 bg-white/5 rounded"></div>
                  </div>
                  <div className="h-8 w-24 bg-blue-600 rounded-lg"></div>
                </div>
                
                <div className="absolute -top-6 -right-6 bg-blue-600 text-white px-6 py-4 rounded-2xl shadow-xl font-bold rotate-6 flex flex-col items-center">
                  <span className="text-[10px] opacity-80 uppercase tracking-widest">Reward</span>
                  <span className="text-3xl">$100</span>
                </div>
              </div>
              <div className="absolute -inset-4 bg-blue-500/10 blur-[100px] -z-10 rounded-full"></div>
            </motion.div>
          </div>
        </section>

        {/* Navigation Tabs (Mobile/Responsive) */}
        <div className="sticky top-20 z-30 bg-[#0A0C10]/80 backdrop-blur pl-4 overflow-x-auto border-b border-white/10 flex md:hidden no-scrollbar">
           {['how', 'write', 'form'].map((tab) => (
             <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-4 font-bold text-sm whitespace-nowrap border-b-2 transition-all ${activeTab === tab ? 'border-blue-500 text-blue-500' : 'border-transparent text-slate-500'}`}
             >
               {tab === 'how' ? 'How it Works' : tab === 'write' ? 'Write Post' : 'Submit'}
             </button>
           ))}
        </div>

        {/* How it Works */}
        <section className="py-24 bg-white/0 px-4 md:px-8 border-y border-white/5">
          <div className="max-w-7xl mx-auto">
            <SectionHeader 
              label="The Process"
              title="Simple steps, fast rewards."
              description="Share your experience and get rewarded within days."
            />
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { step: '01', title: 'Write your post', desc: 'Publish a LinkedIn post about your real experience with Datarails.', icon: <PenLine className="w-6 h-6" /> },
                { step: '02', title: 'Submit link', desc: 'Paste your URL in our form. We’ll review it within 2 business days.', icon: <ClipboardCheck className="w-6 h-6" /> },
                { step: '03', title: 'Accept sponsor', desc: "We'll send a sponsorship request to fund the reach of your post.", icon: <UserPlus className="w-6 h-6" /> },
                { step: '04', title: 'Get Paid', desc: 'Receive your $100 reward after accepting the sponsorship request.', icon: <CircleDollarSign className="w-6 h-6" /> }
              ].map((item, i) => (
                <div key={i} className="group relative">
                  <div className="text-8xl font-black text-white/[0.03] transition-colors group-hover:text-blue-500/[0.05] absolute -top-8 -left-4 -z-0 pointer-events-none">
                    {item.step}
                  </div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-slate-400 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                    <p className="text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Assistant Tool */}
        <section ref={generatorRef} className="py-24 bg-slate-50 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
             <AIAssistant />
          </div>
        </section>

        {/* What to write */}
        <section className="py-24 bg-white/0 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <SectionHeader 
              label="The Creative Guide"
              title="What to write"
              description="Think about something that used to be painful that no longer is. A close that finished on time. A question your CFO asked that you could actually answer."
            />
            
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div className="bg-slate-900/40 p-8 rounded-[32px] border border-white/5 space-y-6">
                <h4 className="text-xl font-bold text-white mb-2">Start with a moment</h4>
                <p className="text-slate-400 font-medium">A process you stopped dreading. A project you finally had time for. Here are examples that work:</p>
                
                <div className="space-y-4">
                  {[
                    "My month-end close finished yesterday. I had to share that — because a year ago, it would have taken another week.",
                    "Our CFO asked me for a scenario last week with 2 hours' notice. I used to dread that. Now I don't.",
                    "I spent three years thinking manual consolidation was just... how FP&A worked. It's not."
                  ].map((quote, i) => (
                    <div key={i} className="bg-[#0A0C10] p-4 rounded-xl border border-white/5 italic text-slate-300 relative">
                      <span className="absolute -left-2 top-4 text-blue-500 font-serif text-4xl opacity-20">"</span>
                      {quote}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-600/5 p-8 rounded-[32px] border border-blue-500/10 space-y-6">
                <h4 className="text-xl font-bold text-white mb-2">Want a structured story?</h4>
                <p className="text-slate-400 font-medium">That works too. Both types qualify. Try this layout:</p>
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-[#0A0C10] rounded-xl border border-white/5">
                      <span className="text-[10px] uppercase font-bold text-blue-500 block mb-1">Problem</span>
                      <span className="text-xs text-slate-400">The pain you faced</span>
                   </div>
                   <div className="p-4 bg-[#0A0C10] rounded-xl border border-white/5">
                      <span className="text-[10px] uppercase font-bold text-blue-500 block mb-1">Before</span>
                      <span className="text-xs text-slate-400">Manual workflows</span>
                   </div>
                   <div className="p-4 bg-[#0A0C10] rounded-xl border border-white/5">
                      <span className="text-[10px] uppercase font-bold text-blue-500 block mb-1">Change</span>
                      <span className="text-xs text-slate-400">Datarails approach</span>
                   </div>
                   <div className="p-4 bg-[#0A0C10] rounded-xl border border-white/5">
                      <span className="text-[10px] uppercase font-bold text-blue-500 block mb-1">Outcome</span>
                      <span className="text-xs text-slate-400">The results</span>
                   </div>
                </div>
                <div className="pt-4">
                  <button 
                    onClick={() => scrollTo(generatorRef)}
                    className="text-white bg-blue-600 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2"
                  >
                    Use AI Writing Assistant <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Your post, our reach */}
        <section className="py-24 bg-white/0 px-4 md:px-8 border-y border-white/5 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid md:grid-cols-2 gap-16 items-center">
               <div>
                  <SectionHeader 
                    label="Amplification"
                    title="Your post, our reach."
                  />
                  <ul className="space-y-6">
                    {[
                      "Your post stays on your profile, and you remain the author.",
                      "We promote it as a Thought Leader Ad using paid distribution.",
                      "Help your experience reach a wider audience of finance professionals.",
                      "Your post stays yours. We just amplify your reach."
                    ].map((text, i) => (
                      <li key={i} className="flex gap-4 items-start">
                        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-1">
                          <CheckCircle2 className="w-4 h-4 text-blue-500" />
                        </div>
                        <span className="text-lg text-slate-300 font-medium">{text}</span>
                      </li>
                    ))}
                  </ul>
               </div>
               <div className="hidden md:block bg-slate-900 border border-white/10 p-8 rounded-[40px] shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-slate-800 rounded-full"></div>
                    <div>
                      <div className="h-2.5 w-24 bg-slate-800 rounded-full mb-1.5"></div>
                      <div className="h-2 w-32 bg-slate-900 rounded-full"></div>
                    </div>
                  </div>
                  <div className="space-y-3 mb-8">
                    <div className="h-2.5 w-full bg-slate-800 rounded-full"></div>
                    <div className="h-2.5 w-full bg-slate-800 rounded-full"></div>
                    <div className="h-2.5 w-2/3 bg-slate-800 rounded-full"></div>
                  </div>
                  <div className="bg-blue-600/10 border border-blue-500/30 rounded-xl p-4 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Promoted by Datarails</span>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Eligibility & Inspiration */}
        <section className="py-24 bg-white/0 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16">
              <div>
                <SectionHeader 
                  label="Requirements"
                  title="Post Eligibility"
                />
                <div className="space-y-4">
                  {[
                    "Be published on LinkedIn",
                    "Be written in the first person",
                    "Reflect your genuine experience using Datarails",
                    "Be at least 600 characters",
                    "Tag the official Datarails LinkedIn page",
                    "Accept a sponsorship request from Datarails (this just means we can promote it — you stay the author)"
                  ].map((req, i) => (
                    <div key={i} className="flex gap-4 items-start bg-white/5 p-4 rounded-xl border border-white/5">
                      <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0" />
                      <span className="font-semibold text-slate-300">{req}</span>
                    </div>
                  ))}
                  <div className="mt-8 p-6 bg-slate-900 border border-white/5 rounded-2xl italic text-slate-400 font-medium leading-relaxed">
                    "One thing you don't need to include: financial data, screenshots, or dashboard images. We know you work with sensitive information. Your story is what matters, not the numbers."
                  </div>
                </div>
              </div>
              
              <div>
                <SectionHeader 
                  label="Inspiration"
                  title="What to share"
                />
                <div className="flex flex-wrap gap-2">
                  {[
                    "Time saved",
                    "Faster budget cycles",
                    "Manual consolidation",
                    "Spreadsheet errors",
                    "Real-time visibility",
                    "Reliance on IT",
                    "Scenario modeling"
                  ].map((outcome, i) => (
                    <span key={i} className="bg-white/5 text-slate-400 px-3 py-1 rounded-md font-bold text-[11px] uppercase tracking-wider border border-white/5">
                      {outcome}
                    </span>
                  ))}
                </div>
                
                <div className="mt-12 bg-slate-900/50 p-8 rounded-3xl border border-white/5">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-500" /> Starting hooks
                  </h4>
                  <div className="space-y-4">
                    <blockquote className="border-l-2 border-blue-500/30 pl-4 py-1 italic text-slate-400 font-medium">
                      "My month-end close finished yesterday. A year ago, it would have taken another week."
                    </blockquote>
                    <blockquote className="border-l-2 border-blue-500/30 pl-4 py-1 italic text-slate-400 font-medium">
                      "Our CFO asked for a scenario with 2 hours' notice. I used to dread that. Now I don't."
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA & Form */}
        <section ref={formRef} className="py-24 bg-black text-white px-4 md:px-8 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="max-w-4xl mx-auto relative z-10 text-center">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">Ready to share your story?</h2>
            <p className="text-xl text-slate-400 mb-12">Submit your details below and we'll review your post within 48 hours.</p>
            
            <SubmissionForm />
            
            <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-8 pt-12 border-t border-white/10 uppercase tracking-widest text-[10px] font-bold text-slate-500">
               <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> 2-Day Review</div>
               <div className="flex items-center gap-2"><CircleDollarSign className="w-4 h-4" /> Instant $100 Payout</div>
               <div className="flex items-center gap-2"><Globe className="w-4 h-4" /> Trusted by 2k+ Teams</div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-16 px-4 md:px-8 bg-[#0A0C10] border-t border-white/5 text-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">DR</span>
            </div>
            <span className="font-bold tracking-tight text-white">Datarails</span>
          </div>
          <div className="flex gap-8 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
            <a href="#" className="hover:text-blue-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Terms</a>
            <span className="flex items-center gap-2 text-slate-400 font-medium normal-case tracking-normal"><HelpCircle className="w-4 h-4 text-blue-500" /> sarah.brown@marketing.datarails.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- AI Assistant Logic ---

interface ChipProps {
  key?: React.Key;
  label: string;
  selected: boolean;
  onClick: () => void;
}

const Chip = ({ label, selected, onClick }: ChipProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
      selected 
        ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20' 
        : 'bg-[#0A0C10] text-slate-500 border-white/10 hover:border-white/20'
    }`}
  >
    {label}
  </button>
);

function AIAssistant() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'role' | 'moment' | 'outcome' | 'tone'>('role');
  const [formData, setFormData] = useState({
    profession: '',
    industry: '',
    style: 'professional',
    specificMoments: [] as string[],
    keyOutcomes: [] as string[]
  });
  const [customMoment, setCustomMoment] = useState('');
  const [generatedPost, setGeneratedPost] = useState('');

  const professions = ["FP&A Manager", "Controller", "CFO", "Finance Director", "VP Finance", "Finance Analyst"];
  const industries = ["SaaS", "Manufacturing", "Healthcare", "Retail", "Services", "Real Estate"];
  const moments = [
    "Month-end close taking 10+ days",
    "Manual consolidation from multiple systems",
    "Errors found in critical board reports",
    "Dreading unexpected CFO questions",
    "2-hour notice for budget scenarios",
    "Spreadsheet version control nightmares"
  ];
  const outcomes = [
    "Saved 50% time on month-end close",
    "Real-time visibility for leadership",
    "Automated 90% of data consolidation",
    "Improved forecast accuracy by 25%",
    "Faster, self-service board reporting",
    "Replaced 50+ manual spreadsheets"
  ];

  const toggleSelection = (field: 'specificMoments' | 'keyOutcomes', value: string) => {
    setFormData(prev => {
      const current = prev[field];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(v => v !== value) };
      }
      if (current.length < 3) {
        return { ...prev, [field]: [...current, value] };
      }
      return prev;
    });
  };

  const generate = async () => {
    if (!formData.profession || (formData.specificMoments.length === 0 && !customMoment)) {
      alert("Please select or enter your role and at least one specific moment.");
      return;
    }
    
    setLoading(true);
    try {
      const payload = {
        ...formData,
        specificMoment: [...formData.specificMoments, customMoment].filter(Boolean).join(', '),
        keyOutcome: formData.keyOutcomes.join(', ')
      };

      const response = await fetch('/api/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      setGeneratedPost(data.post);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/50 border border-white/5 rounded-[32px] p-8 md:p-12 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-blue-500">AI Post Generator</h3>
        <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-500 uppercase font-black">Beta</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
        {(['role', 'moment', 'outcome', 'tone'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/5 text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      
      <div className="min-h-[250px]">
        {activeTab === 'role' && (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">My Role</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {professions.map(p => (
                  <Chip key={p} label={p} selected={formData.profession === p} onClick={() => setFormData({...formData, profession: p})} />
                ))}
              </div>
              <input 
                type="text" 
                placeholder="Or type custom role..." 
                value={formData.profession}
                onChange={e => setFormData({...formData, profession: e.target.value})}
                className="w-full bg-[#0A0C10] border border-white/10 rounded-xl px-4 py-3 text-slate-300 font-semibold focus:border-blue-500 outline-none" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Industry</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {industries.map(i => (
                  <Chip key={i} label={i} selected={formData.industry === i} onClick={() => setFormData({...formData, industry: i})} />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'moment' && (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">The Moment (Select up to 3)</label>
              <span className="text-[10px] text-blue-500 font-bold">{formData.specificMoments.length}/3 selected</span>
            </div>
            <div className="flex flex-col gap-2 mb-4">
              {moments.map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => toggleSelection('specificMoments', m)}
                  className={`text-left px-5 py-4 rounded-xl text-sm font-semibold transition-all border ${
                    formData.specificMoments.includes(m) 
                      ? 'bg-blue-600/10 border-blue-500 text-blue-400' 
                      : 'bg-[#0A0C10] text-slate-400 border-white/10 hover:border-white/20'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <textarea 
              rows={2} 
              placeholder="Or describe your own moment..." 
              value={customMoment}
              onChange={e => setCustomMoment(e.target.value)}
              className="w-full bg-[#0A0C10] border border-white/10 rounded-xl px-4 py-4 text-slate-300 font-semibold focus:border-blue-500 outline-none resize-none" 
            />
          </motion.div>
        )}

        {activeTab === 'outcome' && (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">The Outcome (Select up to 3)</label>
              <span className="text-[10px] text-blue-500 font-bold">{formData.keyOutcomes.length}/3 selected</span>
            </div>
            <div className="flex flex-col gap-2 mb-4">
              {outcomes.map(o => (
                <button
                  key={o}
                  type="button"
                  onClick={() => toggleSelection('keyOutcomes', o)}
                  className={`text-left px-5 py-4 rounded-xl text-sm font-semibold transition-all border ${
                    formData.keyOutcomes.includes(o) 
                      ? 'bg-blue-600/10 border-blue-500 text-blue-400' 
                      : 'bg-[#0A0C10] text-slate-400 border-white/10 hover:border-white/20'
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'tone' && (
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Tone & Writing Style</label>
            <div className="grid grid-cols-2 gap-3">
              {['professional', 'punchy', 'casual', 'detailed'].map(s => (
                <button 
                  key={s}
                  onClick={() => setFormData({...formData, style: s})}
                  className={`py-4 px-4 rounded-2xl text-[11px] font-bold uppercase tracking-wider transition-all border ${
                    formData.style === s 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20' 
                      : 'bg-[#0A0C10] text-slate-500 border-white/5 hover:border-white/10'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="pt-8 text-center">
               <p className="text-[10px] text-slate-500 uppercase font-black mb-6 tracking-[0.2em]">Ready to draft your story?</p>
               <button 
                onClick={generate}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-blue-500/10"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Sparkles className="w-6 h-6" />
                )}
                {loading ? "Writing post..." : "Generate LinkedIn Post"}
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {generatedPost && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 w-full bg-[#0A0C10] border border-white/10 rounded-3xl p-8 relative shadow-2xl"
        >
          <div className="absolute -top-4 left-8 bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Datarails AI Draft</div>
          <div className="prose prose-invert whitespace-pre-wrap font-medium text-slate-300 mb-8 leading-relaxed text-sm">
            {generatedPost}
          </div>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(generatedPost);
              alert("Copied to clipboard!");
            }}
            className="w-full bg-white text-black py-4 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
          >
            Copy Story <ClipboardCheck className="w-5 h-5" />
          </button>
        </motion.div>
      )}
    </div>
  );
}

// --- Submission Form Logic ---

function SubmissionForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    setStatus('success');
  };

  if (status === 'success') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/5 border border-white/10 p-12 rounded-[32px] max-w-xl mx-auto"
      >
        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-500/20">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-3xl font-bold mb-4 text-white">Post Submitted!</h3>
        <p className="text-slate-400 mb-8 font-medium">We've received your story. Our marketing team will review it and reach out within 2 business days via email.</p>
        <button 
          onClick={() => setStatus('idle')}
          className="text-white hover:text-blue-500 font-bold underline transition-colors"
        >
          Submit another post
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className="bg-white/5 border border-white/10 text-white p-8 md:p-12 rounded-[32px] shadow-2xl text-left max-w-3xl mx-auto grid md:grid-cols-2 gap-6 backdrop-blur-xl">
      <div>
        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Full Name</label>
        <input required type="text" className="w-full bg-[#0A0C10] border border-white/10 rounded-xl px-4 py-4 focus:border-blue-500 outline-none transition-all font-bold text-slate-300" placeholder="First & Last" />
      </div>
      <div>
        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Work Email</label>
        <input required type="email" className="w-full bg-[#0A0C10] border border-white/10 rounded-xl px-4 py-4 focus:border-blue-500 outline-none transition-all font-bold text-slate-300" placeholder="name@company.com" />
      </div>
      <div>
        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Company Name</label>
        <input required type="text" className="w-full bg-[#0A0C10] border border-white/10 rounded-xl px-4 py-4 focus:border-blue-500 outline-none transition-all font-bold text-slate-300" placeholder="Where do you work?" />
      </div>
      <div>
        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Your Job Title</label>
        <input required type="text" className="w-full bg-[#0A0C10] border border-white/10 rounded-xl px-4 py-4 focus:border-blue-500 outline-none transition-all font-bold text-slate-300" placeholder="e.g. Director of Finance" />
      </div>
      <div className="md:col-span-2">
        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">LinkedIn Post URL</label>
        <div className="relative">
          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <input required type="url" className="w-full bg-[#0A0C10] border border-white/10 rounded-xl pl-12 pr-4 py-4 focus:border-blue-500 outline-none transition-all font-bold text-slate-300" placeholder="https://linkedin.com/posts/..." />
        </div>
      </div>
      <div className="md:col-span-2 pt-4">
        <button 
          disabled={status === 'submitting'}
          type="submit" 
          className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl"
        >
          {status === 'submitting' ? (
            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
          ) : (
            <Send className="w-5 h-5" />
          )}
          {status === 'submitting' ? "Sending..." : "Submit for Approval"}
        </button>
        <p className="text-[10px] text-slate-500 mt-4 text-center leading-relaxed">By submitting, you agree to our terms and conditions for the advocacy program.</p>
      </div>
    </form>
  );
}

