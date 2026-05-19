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
  Send,
  Globe,
  Clock,
  DollarSign,
  Users,
  FileText,
  ChevronRight,
  MessageSquare,
  Briefcase,
} from 'lucide-react';

// ─── Tiny Datarails wordmark SVG (white version for dark bg) ─────────────────
const LogoBright = ({ height = 32 }: { height?: number }) => (
  <img src="/logos/datarails-bright.png" alt="Datarails" style={{ height }} />
);
const LogoDark = ({ height = 32 }: { height?: number }) => (
  <img src="/logos/datarails-dark.png" alt="Datarails" style={{ height }} />
);

// ─── Section header (eyebrow + title + optional description) ─────────────────
const SectionHeader = ({
  label,
  title,
  description,
  center = false,
  dark = false,
}: {
  label?: string;
  title: React.ReactNode;
  description?: string;
  center?: boolean;
  dark?: boolean;
}) => (
  <div className={`mb-14 ${center ? 'text-center' : ''}`}>
    {label && (
      <span className={`eyebrow ${dark ? 'text-[#A9AEC2]' : 'text-[#9B9B9B]'}`}>
        {label}
      </span>
    )}
    <h2
      style={{
        fontWeight: 600,
        letterSpacing: '-0.02em',
        lineHeight: 1.1,
        color: dark ? '#ffffff' : '#0C142B',
        margin: 0,
      }}
      className="text-3xl md:text-5xl"
    >
      {title}
    </h2>
    {description && (
      <p
        className="mt-4 text-lg max-w-2xl"
        style={{
          color: dark ? '#A9AEC2' : '#595959',
          lineHeight: 1.6,
          marginLeft: center ? 'auto' : undefined,
          marginRight: center ? 'auto' : undefined,
        }}
      >
        {description}
      </p>
    )}
  </div>
);

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const generatorRef = useRef<HTMLDivElement>(null);
  const formRef      = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) =>
    ref.current?.scrollIntoView({ behavior: 'smooth' });

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <div className="min-h-screen" style={{ fontFamily: 'var(--font-sans)' }}>
      {/* ── Scroll progress bar ── */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 origin-left"
        style={{ scaleX, height: 2, background: '#FA3576' }}
      />

      {/* ════════════════════════════════════════
          NAVBAR — dark navy, sticky
      ════════════════════════════════════════ */}
      <nav
        className="sticky top-0 z-40 w-full px-6 md:px-12 py-4 flex justify-between items-center"
        style={{
          background: 'rgba(12,20,43,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <LogoBright height={28} />

        <div className="flex items-center gap-4">
          <button
            onClick={() => scrollTo(generatorRef)}
            style={{ color: '#A9AEC2', fontSize: 13, letterSpacing: '0.05em', fontWeight: 400 }}
            className="hidden md:block uppercase hover:text-white transition-colors"
          >
            AI Assistant
          </button>
          <button
            onClick={() => scrollTo(formRef)}
            className="btn-pink"
            style={{ fontSize: 13, padding: '10px 22px' }}
          >
            Submit Post <ArrowRight size={14} />
          </button>
        </div>
      </nav>

      <main>
        {/* ════════════════════════════════════════
            HERO — dark navy, full bleed
        ════════════════════════════════════════ */}
        <section
          className="relative overflow-hidden px-6 md:px-12 pt-20 pb-32"
          style={{ background: '#0C142B' }}
        >
          <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.2fr_0.8fr] gap-16 items-center">
            {/* Left — headline */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
            >
              {/* Eyebrow pill */}
              <div
                className="inline-flex items-center gap-2 mb-8"
                style={{
                  fontSize: 12,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#FFA30F',
                  border: '1px solid rgba(255,163,15,0.3)',
                  borderRadius: 999,
                  padding: '6px 16px',
                }}
              >
                <span
                  style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: '#FFA30F',
                    display: 'inline-block',
                  }}
                />
                Earn $100 Per Post
              </div>

              <h1
                style={{
                  fontWeight: 600,
                  fontSize: 'clamp(48px, 7vw, 88px)',
                  lineHeight: 1.05,
                  letterSpacing: '-0.035em',
                  color: '#ffffff',
                  margin: '0 0 28px',
                }}
              >
                Your Datarails story{' '}
                <em style={{ color: '#FFA30F', fontStyle: 'italic', fontWeight: 600 }}>
                  is worth sharing.
                </em>
              </h1>

              <p
                style={{
                  fontSize: 20,
                  color: '#A9AEC2',
                  lineHeight: 1.6,
                  maxWidth: 480,
                  marginBottom: 36,
                }}
              >
                Tell your LinkedIn network how you transformed your finance workflow
                and we'll reward you with $100 and amplified reach.
              </p>

              <div className="flex flex-wrap gap-4">
                <button onClick={() => scrollTo(generatorRef)} className="btn-pink" style={{ fontSize: 16, padding: '16px 36px' }}>
                  Help me write my post <Sparkles size={16} />
                </button>
                <button onClick={() => scrollTo(formRef)} className="pill-yellow" style={{ fontSize: 15, padding: '14px 30px' }}>
                  Submit Post URL <ArrowRight size={15} />
                </button>
              </div>
            </motion.div>

            {/* Right — mock card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
              className="relative hidden lg:block"
            >
              <div
                className="relative z-10 p-8"
                style={{
                  background: '#131B36',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 24,
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    style={{
                      width: 48, height: 48, borderRadius: '50%',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  />
                  <div>
                    <div style={{ height: 12, width: 120, background: 'rgba(255,255,255,0.08)', borderRadius: 6, marginBottom: 8 }} />
                    <div style={{ height: 10, width: 160, background: 'rgba(255,255,255,0.04)', borderRadius: 6 }} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                  {[100, 92, 100, 68].map((w, i) => (
                    <div key={i} style={{ height: 11, width: `${w}%`, background: i === 3 ? 'rgba(250,53,118,0.2)' : 'rgba(255,255,255,0.05)', borderRadius: 6 }} />
                  ))}
                </div>
                <div
                  style={{
                    padding: '10px 16px',
                    borderRadius: 10,
                    background: 'rgba(255,163,15,0.08)',
                    border: '1px solid rgba(255,163,15,0.25)',
                    textAlign: 'center',
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#FFA30F',
                  }}
                >
                  Promoted by Datarails
                </div>

                {/* Reward badge */}
                <div
                  style={{
                    position: 'absolute', top: -20, right: -20,
                    background: '#FA3576',
                    borderRadius: 16,
                    padding: '16px 24px',
                    transform: 'rotate(6deg)',
                    boxShadow: '0 8px 24px rgba(250,53,118,0.4)',
                    textAlign: 'center',
                    color: '#fff',
                  }}
                >
                  <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.8, marginBottom: 2 }}>Reward</div>
                  <div style={{ fontSize: 32, fontWeight: 600, lineHeight: 1 }}>$100</div>
                </div>
              </div>
              <div
                style={{
                  position: 'absolute', inset: -32,
                  background: 'rgba(250,53,118,0.06)',
                  filter: 'blur(80px)',
                  borderRadius: '50%',
                  zIndex: 0,
                  pointerEvents: 'none',
                }}
              />
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            HOW IT WORKS — cream background
        ════════════════════════════════════════ */}
        <section className="py-24 px-6 md:px-12" style={{ background: '#FFF9F1' }}>
          <div className="max-w-7xl mx-auto">
            <SectionHeader
              label="The Process"
              title={<>Simple steps, <span className="kw-pink">fast rewards.</span></>}
              description="Share your genuine experience and get rewarded within days."
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
              {[
                { step: '01', icon: <FileText size={22} />, title: 'Write your post', desc: 'Publish a LinkedIn post about your real experience with Datarails.' },
                { step: '02', icon: <ClipboardCheck size={22} />, title: 'Submit the link', desc: "Paste your URL in our form. We'll review it within 2 business days." },
                { step: '03', icon: <Users size={22} />, title: 'Accept sponsorship', desc: 'We send a sponsorship request to fund the reach of your post.' },
                { step: '04', icon: <DollarSign size={22} />, title: 'Get paid', desc: 'Receive your $100 reward after accepting the sponsorship request.' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.2, 0.8, 0.2, 1] }}
                  className="relative"
                >
                  {/* Ghost step number */}
                  <div
                    style={{
                      position: 'absolute', top: -24, left: -8,
                      fontSize: 80, fontWeight: 600, lineHeight: 1,
                      color: 'rgba(12,20,43,0.04)',
                      letterSpacing: '-0.02em',
                      pointerEvents: 'none',
                      userSelect: 'none',
                    }}
                  >
                    {item.step}.
                  </div>
                  <div className="relative z-10">
                    <div className="icon-tile mb-6">{item.icon}</div>
                    <h3
                      style={{ fontWeight: 600, fontSize: 20, color: '#0C142B', marginBottom: 10 }}
                    >
                      {item.title}
                    </h3>
                    <p style={{ fontSize: 15, color: '#595959', lineHeight: 1.6 }}>
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            AI ASSISTANT — dark navy (tool section)
        ════════════════════════════════════════ */}
        <section
          ref={generatorRef}
          className="py-24 px-6 md:px-12"
          style={{ background: '#0C142B' }}
        >
          <div className="max-w-4xl mx-auto">
            <SectionHeader
              label="AI Writing Assistant"
              title={<>Draft your story in <em style={{ color: '#FFA30F', fontStyle: 'italic' }}>minutes.</em></>}
              description="Tell us about your role, your pain point, and your outcome — we'll generate a ready-to-use story, written to best practices and post eligibility requirements."
              dark
            />
            <AIAssistant />
          </div>
        </section>

        {/* ════════════════════════════════════════
            AMPLIFICATION — dark navy
        ════════════════════════════════════════ */}
        <section className="py-24 px-6 md:px-12" style={{ background: '#0C142B' }}>
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div>
              <SectionHeader
                label="Amplification"
                title={<>Your post, <em style={{ color: '#FFA30F', fontStyle: 'italic' }}>our reach.</em></>}
                dark
              />
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {[
                  'Your post stays on your profile — you remain the author.',
                  'We promote it as a Thought Leader Ad using paid LinkedIn distribution.',
                  'Your experience reaches a wider audience of finance professionals.',
                  'Your story stays yours. We just amplify it.',
                ].map((text, i) => (
                  <li key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: 24, height: 24, borderRadius: '50%',
                        background: 'rgba(255,163,15,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, marginTop: 2,
                      }}
                    >
                      <CheckCircle2 size={14} color="#FFA30F" />
                    </div>
                    <span style={{ fontSize: 17, color: '#E7E9F1', lineHeight: 1.55 }}>{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mock LinkedIn post */}
            <div
              className="hidden md:block"
              style={{
                background: '#131B36',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 24,
                padding: 32,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                <div>
                  <div style={{ height: 12, width: 96, background: 'rgba(255,255,255,0.08)', borderRadius: 6, marginBottom: 8 }} />
                  <div style={{ height: 10, width: 140, background: 'rgba(255,255,255,0.04)', borderRadius: 6 }} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {[100, 94, 100, 72, 88, 50].map((w, i) => (
                  <div key={i} style={{ height: 10, width: `${w}%`, background: 'rgba(255,255,255,0.05)', borderRadius: 6 }} />
                ))}
              </div>
              <div
                style={{
                  padding: '12px 18px',
                  borderRadius: 10,
                  background: 'rgba(255,163,15,0.08)',
                  border: '1px solid rgba(255,163,15,0.28)',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#FFA30F',
                  textAlign: 'center',
                }}
              >
                Promoted by Datarails
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            ELIGIBILITY + INSPIRATION — cream
        ════════════════════════════════════════ */}
        <section className="py-24 px-6 md:px-12" style={{ background: '#FFF9F1' }}>
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
            {/* Requirements */}
            <div>
              <SectionHeader label="Requirements" title={<>Post <span className="kw-pink">Eligibility</span></>} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  'Published on LinkedIn',
                  'Written in the first person',
                  'Reflects your genuine experience using Datarails',
                  'At least 600 characters',
                  'Tags the official Datarails LinkedIn page',
                  'You accept a sponsorship request from Datarails',
                ].map((req, i) => (
                  <div
                    key={i}
                    className="card-light"
                    style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px' }}
                  >
                    <CheckCircle2 size={20} color="#FA3576" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 15, fontWeight: 600, color: '#0C142B' }}>{req}</span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: 24,
                  padding: '24px 28px',
                  background: '#ffffff',
                  borderRadius: 18,
                  fontStyle: 'italic',
                  color: '#595959',
                  fontSize: 15,
                  lineHeight: 1.65,
                  boxShadow: 'var(--shadow-1)',
                  border: '1px solid #FFEFD9',
                }}
              >
                "One thing you don't need to include: financial data, screenshots, or dashboard images.
                We know you work with sensitive information. Your story is what matters, not the numbers."
              </div>
            </div>

            {/* Inspiration */}
            <div>
              <SectionHeader label="Inspiration" title={<>What to <span className="kw-pink">share</span></>} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 40 }}>
                {[
                  'Time saved', 'Faster budget cycles', 'Manual consolidation',
                  'Spreadsheet errors', 'Real-time visibility', 'Reliance on IT',
                  'Scenario modeling', 'Board reporting', 'Month-end close',
                ].map((tag, i) => (
                  <span
                    key={i}
                    style={{
                      padding: '8px 16px',
                      background: '#ffffff',
                      border: '1px solid #FFEFD9',
                      borderRadius: 999,
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#0C142B',
                      letterSpacing: '0.02em',
                      boxShadow: 'var(--shadow-1)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div
                style={{
                  background: '#ffffff',
                  borderRadius: 18,
                  padding: '28px 32px',
                  boxShadow: 'var(--shadow-2)',
                }}
              >
                <div
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    fontSize: 11, fontWeight: 600, letterSpacing: '0.12em',
                    textTransform: 'uppercase', color: '#9B9B9B',
                    marginBottom: 20,
                  }}
                >
                  <MessageSquare size={14} color="#FA3576" /> Starting hooks
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {[
                    '"My month-end close finished yesterday. A year ago, it would have taken another week."',
                    '"Our CFO asked for a scenario with 2 hours\' notice. I used to dread that. Now I don\'t."',
                    '"I spent three years thinking manual consolidation was just... how FP&A worked. It\'s not."',
                  ].map((q, i) => (
                    <blockquote
                      key={i}
                      style={{
                        borderLeft: '2px solid #FA3576',
                        paddingLeft: 16,
                        fontStyle: 'italic',
                        color: '#595959',
                        fontSize: 15,
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      {q}
                    </blockquote>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════
            CTA + FORM — dark navy
        ════════════════════════════════════════ */}
        <section
          ref={formRef}
          className="py-24 px-6 md:px-12 relative overflow-hidden"
          style={{ background: '#0C142B' }}
        >
          <div
            style={{
              position: 'absolute', top: 0, right: 0,
              width: 400, height: 400,
              background: 'rgba(250,53,118,0.08)',
              filter: 'blur(120px)',
              borderRadius: '50%',
              transform: 'translate(30%, -30%)',
              pointerEvents: 'none',
            }}
          />
          <div className="max-w-4xl mx-auto relative z-10 text-center">
            <SectionHeader
              center
              label="Ready?"
              title={<>Share your story.</>}
              description="Submit your details below and we'll review your post within 48 hours."
              dark
            />
            <SubmissionForm />

            <div
              className="mt-16 pt-10 flex flex-col md:flex-row items-center justify-center gap-8"
              style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
            >
              {[
                { icon: <Clock size={16} />, label: '2-Day Review' },
                { icon: <DollarSign size={16} />, label: 'Instant $100 Payout' },
                { icon: <Globe size={16} />, label: 'Trusted by 2k+ Teams' },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    fontSize: 11, fontWeight: 600,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: '#6B7188',
                  }}
                >
                  <span style={{ color: '#FFA30F' }}>{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ════════════════════════════════════════
          FOOTER — dark navy
      ════════════════════════════════════════ */}
      <footer
        className="py-14 px-6 md:px-12"
        style={{ background: '#0C142B', borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <LogoBright height={26} />

          <div
            style={{
              display: 'flex', gap: 32, alignItems: 'center',
              fontSize: 12, fontWeight: 600,
              letterSpacing: '0.08em', textTransform: 'uppercase',
            }}
          >
            <a href="#" style={{ color: '#6B7188', textDecoration: 'none' }}
               onMouseOver={e => (e.currentTarget.style.color = '#FFA30F')}
               onMouseOut={e => (e.currentTarget.style.color = '#6B7188')}>
              Privacy
            </a>
            <a href="#" style={{ color: '#6B7188', textDecoration: 'none' }}
               onMouseOver={e => (e.currentTarget.style.color = '#FFA30F')}
               onMouseOut={e => (e.currentTarget.style.color = '#6B7188')}>
              Terms
            </a>
            <a
              href="mailto:sarah.brown@marketing.datarails.com"
              style={{
                color: '#A9AEC2', fontSize: 12, fontWeight: 400,
                letterSpacing: '0.02em', textTransform: 'none',
                textDecoration: 'none',
              }}
            >
              sarah.brown@marketing.datarails.com
            </a>
          </div>

          <div style={{ fontSize: 13, color: '#6B7188' }}>© Datarails 2026</div>
        </div>
      </footer>
    </div>
  );
}

// ─── Chip ─────────────────────────────────────────────────────────────────────
const Chip = ({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) => (
  <button type="button" onClick={onClick} className={`chip ${selected ? 'selected' : ''}`}>
    {label}
  </button>
);

// ─── AI Assistant ─────────────────────────────────────────────────────────────
function AIAssistant() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'role' | 'moment' | 'outcome' | 'tone'>('role');
  const [formData, setFormData] = useState({
    profession: '',
    industry: '',
    style: 'professional',
    specificMoments: [] as string[],
    keyOutcomes: [] as string[],
  });
  const [customMoment, setCustomMoment] = useState('');
  const [generatedPost, setGeneratedPost] = useState('');

  const professions = ['FP&A Manager', 'Controller', 'CFO', 'Finance Director', 'VP Finance', 'Finance Analyst'];
  const industries  = ['SaaS', 'Manufacturing', 'Healthcare', 'Retail', 'Services', 'Real Estate'];
  const moments = [
    'Month-end close taking 10+ days',
    'Manual consolidation from multiple systems',
    'Errors found in critical board reports',
    'Dreading unexpected CFO questions',
    '2-hour notice for budget scenarios',
    'Spreadsheet version control nightmares',
  ];
  const outcomes = [
    'Saved 50% time on month-end close',
    'Real-time visibility for leadership',
    'Automated 90% of data consolidation',
    'Improved forecast accuracy by 25%',
    'Faster, self-service board reporting',
    'Replaced 50+ manual spreadsheets',
  ];

  const toggle = (field: 'specificMoments' | 'keyOutcomes', value: string) => {
    setFormData(prev => {
      const cur = prev[field];
      if (cur.includes(value)) return { ...prev, [field]: cur.filter(v => v !== value) };
      if (cur.length < 3)      return { ...prev, [field]: [...cur, value] };
      return prev;
    });
  };

  const generate = async () => {
    if (!formData.profession || (formData.specificMoments.length === 0 && !customMoment)) {
      alert('Please select your role and at least one specific moment.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...formData,
        specificMoment: [...formData.specificMoments, customMoment].filter(Boolean).join(', '),
        keyOutcome: formData.keyOutcomes.join(', '),
      };
      const response = await fetch('/api/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      setGeneratedPost(data.post);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const TABS = ['role', 'moment', 'outcome', 'tone'] as const;
  const TAB_LABELS = { role: 'Role', moment: 'Moment', outcome: 'Outcome', tone: 'Tone' };

  const inputStyle: React.CSSProperties = {
    width: '100%', background: '#0C142B',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12, padding: '14px 16px',
    color: '#E7E9F1', fontFamily: 'var(--font-sans)',
    fontSize: 14, fontWeight: 400, outline: 'none',
    boxSizing: 'border-box',
  };

  const optionRowStyle = (selected: boolean): React.CSSProperties => ({
    textAlign: 'left', padding: '14px 18px',
    borderRadius: 12, fontSize: 14, fontWeight: 400,
    cursor: 'pointer', border: '1px solid',
    transition: 'all 150ms',
    background: selected ? 'rgba(255,163,15,0.08)' : 'rgba(255,255,255,0.02)',
    borderColor: selected ? '#FFA30F' : 'rgba(255,255,255,0.07)',
    color: selected ? '#FFA30F' : '#A9AEC2',
  });

  return (
    <div
      style={{
        background: '#131B36',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 28,
        padding: '40px 44px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#FFA30F' }}>
          AI Post Generator
        </span>
        <span
          style={{
            fontSize: 9, fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase',
            color: '#6B7188', background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)', padding: '3px 10px', borderRadius: 6,
          }}
        >
          Beta
        </span>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-1">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '9px 20px',
              borderRadius: 999,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              border: 'none',
              transition: 'all 150ms',
              background: activeTab === tab ? '#FFA30F' : 'rgba(255,255,255,0.05)',
              color: activeTab === tab ? '#0C142B' : '#6B7188',
              whiteSpace: 'nowrap',
            }}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ minHeight: 260 }}>
        {activeTab === 'role' && (
          <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <div>
              <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6B7188', display: 'block', marginBottom: 14 }}>My Role</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                {professions.map(p => <Chip key={p} label={p} selected={formData.profession === p} onClick={() => setFormData({ ...formData, profession: p })} />)}
              </div>
              <input type="text" placeholder="Or type custom role..." value={formData.profession}
                onChange={e => setFormData({ ...formData, profession: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6B7188', display: 'block', marginBottom: 14 }}>Industry</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {industries.map(ind => <Chip key={ind} label={ind} selected={formData.industry === ind} onClick={() => setFormData({ ...formData, industry: ind })} />)}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'moment' && (
          <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6B7188' }}>The Moment (up to 3)</label>
              <span style={{ fontSize: 10, color: '#FFA30F', fontWeight: 700 }}>{formData.specificMoments.length}/3</span>
            </div>
            {moments.map(m => (
              <button key={m} type="button" onClick={() => toggle('specificMoments', m)} style={optionRowStyle(formData.specificMoments.includes(m))}>
                {m}
              </button>
            ))}
            <textarea rows={2} placeholder="Or describe your own moment..." value={customMoment}
              onChange={e => setCustomMoment(e.target.value)}
              style={{ ...inputStyle, resize: 'none', marginTop: 4 }} />
          </motion.div>
        )}

        {activeTab === 'outcome' && (
          <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6B7188' }}>The Outcome (up to 3)</label>
              <span style={{ fontSize: 10, color: '#FFA30F', fontWeight: 700 }}>{formData.keyOutcomes.length}/3</span>
            </div>
            {outcomes.map(o => (
              <button key={o} type="button" onClick={() => toggle('keyOutcomes', o)} style={optionRowStyle(formData.keyOutcomes.includes(o))}>
                {o}
              </button>
            ))}
          </motion.div>
        )}

        {activeTab === 'tone' && (
          <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6B7188', display: 'block' }}>
              Tone &amp; Writing Style
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {([
                { id: 'professional', label: 'Professional', desc: 'Polished and structured' },
                { id: 'punchy',       label: 'Punchy',       desc: 'Short. Hard-hitting.' },
                { id: 'casual',       label: 'Casual',       desc: 'Like a colleague chat' },
                { id: 'detailed',     label: 'Detailed',     desc: 'Full narrative arc' },
              ] as const).map(s => (
                <button
                  key={s.id}
                  onClick={() => setFormData({ ...formData, style: s.id })}
                  style={{
                    padding: '16px 18px', borderRadius: 16,
                    border: '1px solid',
                    borderColor: formData.style === s.id ? '#FFA30F' : 'rgba(255,255,255,0.06)',
                    background: formData.style === s.id ? 'rgba(255,163,15,0.08)' : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 150ms',
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: formData.style === s.id ? '#FFA30F' : '#6B7188', marginBottom: 4 }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: 12, color: formData.style === s.id ? '#A9AEC2' : '#6B7188' }}>{s.desc}</div>
                </button>
              ))}
            </div>

            <div style={{ paddingTop: 16, textAlign: 'center' }}>
              <p style={{ fontSize: 10, color: '#6B7188', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.18em', marginBottom: 20 }}>
                Ready to draft your story?
              </p>
              <button
                onClick={generate}
                disabled={loading}
                className="btn-yellow"
                style={{ width: '100%', justifyContent: 'center', fontSize: 15, padding: '18px 32px', borderRadius: 16, opacity: loading ? 0.5 : 1 }}
              >
                {loading ? (
                  <div style={{ width: 18, height: 18, border: '2px solid rgba(12,20,43,0.3)', borderTop: '2px solid #0C142B', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                ) : (
                  <Sparkles size={18} />
                )}
                {loading ? 'Writing your post...' : 'Generate LinkedIn Post'}
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Generated post output */}
      {generatedPost && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          style={{
            marginTop: 40,
            background: '#0C142B',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 24,
            padding: 32,
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute', top: -14, left: 28,
              background: '#FA3576', color: '#fff',
              padding: '5px 16px', borderRadius: 999,
              fontSize: 10, fontWeight: 700,
              letterSpacing: '0.14em', textTransform: 'uppercase',
            }}
          >
            Datarails AI Draft
          </div>
          <div
            style={{
              fontSize: 14, lineHeight: 1.75,
              color: '#E7E9F1', whiteSpace: 'pre-wrap',
              marginBottom: 24, fontWeight: 400,
            }}
          >
            {generatedPost}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={() => { navigator.clipboard.writeText(generatedPost); alert('Copied to clipboard!'); }}
              style={{
                width: '100%', background: '#ffffff', color: '#0C142B',
                border: 'none', borderRadius: 12, padding: '14px 20px',
                fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700,
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 8, transition: 'all 150ms',
              }}
              onMouseOver={e => (e.currentTarget.style.background = '#E7E9F1')}
              onMouseOut={e => (e.currentTarget.style.background = '#ffffff')}
            >
              Copy Story <ClipboardCheck size={16} />
            </button>
            <button
              onClick={generate}
              disabled={loading}
              style={{
                width: '100%', background: 'transparent',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12, padding: '12px 20px',
                fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 700,
                color: '#6B7188', letterSpacing: '0.12em', textTransform: 'uppercase',
                cursor: 'pointer', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 8,
                transition: 'all 150ms',
                opacity: loading ? 0.4 : 1,
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)'; e.currentTarget.style.color = '#A9AEC2'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#6B7188'; }}
            >
              {loading ? (
                <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.15)', borderTop: '2px solid #FFF', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
              ) : (
                <Sparkles size={14} />
              )}
              {loading ? 'Writing...' : 'Write a different version'}
            </button>
          </div>
        </motion.div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Submission Form ──────────────────────────────────────────────────────────
function SubmissionForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const form = e.target as HTMLFormElement;
      const data = Object.fromEntries(new FormData(form));
      await fetch('/api/submit-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      setStatus('success');
    } catch {
      setStatus('success'); // optimistic
    }
  };

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: '#131B36',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 24,
          padding: '56px 40px',
          maxWidth: 500,
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 72, height: 72, borderRadius: '50%',
            background: '#FA3576',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 28px',
            boxShadow: '0 8px 24px rgba(250,53,118,0.3)',
          }}
        >
          <CheckCircle2 size={36} color="#fff" />
        </div>
        <h3 style={{ fontWeight: 600, fontSize: 28, color: '#fff', marginBottom: 12 }}>Post Submitted!</h3>
        <p style={{ color: '#A9AEC2', fontSize: 16, lineHeight: 1.6, marginBottom: 28 }}>
          We've received your story. Our marketing team will review it and reach out
          within 2 business days via email.
        </p>
        <button
          onClick={() => setStatus('idle')}
          style={{ color: '#FFA30F', background: 'none', border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer', textDecoration: 'underline' }}
        >
          Submit another post
        </button>
      </motion.div>
    );
  }

  const inputCls: React.CSSProperties = {
    width: '100%', background: '#0C142B',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12, padding: '14px 16px',
    color: '#E7E9F1', fontFamily: 'var(--font-sans)',
    fontSize: 14, fontWeight: 400, outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <form
      onSubmit={submit}
      style={{
        background: '#131B36',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 24,
        padding: '40px 44px',
        textAlign: 'left',
        maxWidth: 680,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 20,
      }}
    >
      {[
        { name: 'fullName',   label: 'Full Name',       type: 'text',  placeholder: 'First & Last',               span: false },
        { name: 'email',      label: 'Work Email',      type: 'email', placeholder: 'name@company.com',            span: false },
        { name: 'company',    label: 'Company Name',    type: 'text',  placeholder: 'Where do you work?',          span: false },
        { name: 'title',      label: 'Your Job Title',  type: 'text',  placeholder: 'e.g. Director of Finance',    span: false },
        { name: 'postUrl',    label: 'LinkedIn Post URL', type: 'url', placeholder: 'https://linkedin.com/posts/...', span: true },
      ].map(f => (
        <div key={f.name} style={f.span ? { gridColumn: '1 / -1' } : {}}>
          <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6B7188', marginBottom: 10 }}>
            {f.label}
          </label>
          <input
            required
            name={f.name}
            type={f.type}
            placeholder={f.placeholder}
            style={inputCls}
            onFocus={e => (e.target.style.borderColor = '#FFA30F')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
          />
        </div>
      ))}

      <div style={{ gridColumn: '1 / -1', paddingTop: 8 }}>
        <button
          disabled={status === 'submitting'}
          type="submit"
          className="btn-yellow"
          style={{ width: '100%', justifyContent: 'center', fontSize: 15, padding: '18px 32px', borderRadius: 14, opacity: status === 'submitting' ? 0.5 : 1 }}
        >
          {status === 'submitting' ? (
            <div style={{ width: 18, height: 18, border: '2px solid rgba(12,20,43,0.3)', borderTop: '2px solid #0C142B', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
          ) : (
            <Send size={18} />
          )}
          {status === 'submitting' ? 'Sending...' : 'Submit for Approval'}
        </button>
        <p style={{ fontSize: 11, color: '#6B7188', marginTop: 14, textAlign: 'center', lineHeight: 1.6 }}>
          By submitting, you agree to our terms and conditions for the advocacy program.
        </p>
      </div>
    </form>
  );
}
