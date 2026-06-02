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

            {(() => {
              const steps = [
                { step: '01', icon: <FileText size={22} />, title: 'Write your post', desc: 'Publish a LinkedIn post about your real experience with Datarails.' },
                { step: '02', icon: <ClipboardCheck size={22} />, title: 'Submit the link', desc: "Paste your URL in our form. We'll review it within 2 business days." },
                { step: '03', icon: <Users size={22} />, title: 'Accept sponsorship', desc: 'We send a sponsorship request to fund the reach of your post.' },
                { step: '04', icon: <DollarSign size={22} />, title: 'Get paid', desc: 'Receive your $100 reward after accepting the sponsorship request.' },
              ];

              const StepCard = ({ item, i }: { item: typeof steps[0]; i: number }) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15, ease: [0.2, 0.8, 0.2, 1] }}
                  className="process-step relative"
                  style={{ animationDelay: `${i * 0.9}s` }}
                >
                  {/* Ghost step number */}
                  <div className="process-step-ghost">
                    {item.step}.
                  </div>
                  <div className="relative z-10">
                    <div
                      className="icon-tile process-step-icon mb-5"
                      style={{ animationDelay: `${i * 0.9}s` }}
                    >
                      {item.icon}
                    </div>
                    <h3 style={{ fontWeight: 600, fontSize: 20, color: '#0C142B', marginBottom: 8 }}>
                      {item.title}
                    </h3>
                    <p style={{ fontSize: 15, color: '#595959', lineHeight: 1.6 }}>
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              );

              return (
                <>
                  {/* Desktop: flex row with animated connectors */}
                  <div className="hidden lg:flex items-start gap-0">
                    {steps.map((item, i) => (
                      <React.Fragment key={i}>
                        <div className="flex-1">
                          <StepCard item={item} i={i} />
                        </div>
                        {i < steps.length - 1 && (
                          <div
                            className="flex-shrink-0 flex items-start"
                            style={{ paddingTop: 30, width: 48 }}
                          >
                            <div className="step-connector w-full">
                              <span
                                className="step-connector-dot"
                                style={{ animationDelay: `${i * 0.9 + 0.45}s` }}
                              />
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Mobile / tablet: 2-col grid */}
                  <div className="grid md:grid-cols-2 gap-10 lg:hidden">
                    {steps.map((item, i) => (
                      <StepCard key={i} item={item} i={i} />
                    ))}
                  </div>
                </>
              );
            })()}
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
        <section className="pt-0 pb-12 md:py-24 px-6 md:px-12" style={{ background: '#0C142B' }}>
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
                  color: '#595959',
                  fontSize: 15,
                  lineHeight: 1.65,
                  boxShadow: 'var(--shadow-1)',
                  border: '1px solid #FFEFD9',
                }}
              >
                A few things you don't need to include: financial data, screenshots, or dashboard images.
                We know you work with sensitive information. Your story is what matters, not the numbers.
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
              display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center',
              justifyContent: 'center',
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
                textDecoration: 'none', wordBreak: 'break-all',
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading]   = useState(false);
  const [step, setStep]         = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back
  const [formData, setFormData] = useState({
    profession: '',
    industry: '',
    style: 'professional',
    specificMoments: [] as string[],
    keyOutcomes: [] as string[],
  });
  const [customMoment, setCustomMoment] = useState('');
  const [customOutcome, setCustomOutcome] = useState('');
  const [customIndustry, setCustomIndustry] = useState('');
  const [customProfession, setCustomProfession] = useState('');
  const [outcomeMetrics, setOutcomeMetrics] = useState<Record<string, string>>({});
  const [generatedPost, setGeneratedPost] = useState('');

  const professions = ['FP&A Manager', 'Controller', 'CFO', 'Finance Director', 'VP Finance', 'Finance Analyst'];
  const industries  = ['SaaS', 'Manufacturing', 'Healthcare', 'Retail', 'Services', 'Real Estate'];
  const moments = [
    'Month-end close taking multiple days',
    'Manual consolidation from multiple systems',
    'Errors found in critical board reports',
    'Dreading unexpected CFO questions',
    'Last minute notice for budget scenarios',
    'Spreadsheet version control nightmares',
  ];
  const outcomeDefs = [
    { label: 'Saved 50% time on month-end close', before: 'Saved ', defaultMetric: '50', suffix: '%', after: ' time on month-end close' },
    { label: 'Real-time visibility for leadership', before: null, defaultMetric: null, suffix: null, after: null },
    { label: 'Automated 90% of data consolidation', before: 'Automated ', defaultMetric: '90', suffix: '%', after: ' of data consolidation' },
    { label: 'Improved forecast accuracy by 25%', before: 'Improved forecast accuracy by ', defaultMetric: '25', suffix: '%', after: '' },
    { label: 'Faster, self-service board reporting', before: null, defaultMetric: null, suffix: null, after: null },
    { label: 'Replaced 50+ manual spreadsheets', before: 'Replaced ', defaultMetric: '50', suffix: '+', after: ' manual spreadsheets' },
  ];

  const STEPS = [
    {
      label: 'Role',
      title: 'Who are you?',
      subtitle: 'Select your job title and industry so we can tailor your story.',
    },
    {
      label: 'Moment',
      title: 'What was the pain?',
      subtitle: 'Pick the frustrations you experienced before Datarails — select any that apply.',
    },
    {
      label: 'Outcome',
      title: 'What changed?',
      subtitle: 'Select the wins you achieved after using Datarails — pick the relevant ones.',
    },
    {
      label: 'Tone',
      title: 'How should it sound?',
      subtitle: 'Pick your writing style, then generate your post.',
    },
  ];

  const goTo = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
    setTimeout(() => containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

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
      const resolvedOutcomes = formData.keyOutcomes.map(label => {
        const def = outcomeDefs.find(o => o.label === label);
        if (!def?.before) return label;
        const metric = outcomeMetrics[label] ?? def.defaultMetric;
        return `${def.before}${metric}${def.suffix ?? ''}${def.after}`;
      });
      const payload = {
        ...formData,
        profession: formData.profession === 'Other' ? customProfession : formData.profession,
        industry: formData.industry === 'Other' ? customIndustry : formData.industry,
        specificMoment: [...formData.specificMoments, customMoment].filter(Boolean).join(', '),
        keyOutcome: [...resolvedOutcomes, customOutcome].filter(Boolean).join(', '),
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

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 14,
    padding: '16px 20px',
    color: '#E7E9F1',
    fontFamily: 'var(--font-sans)',
    fontSize: 16,
    fontWeight: 400,
    outline: 'none',
    boxSizing: 'border-box',
  };

  const optionRowStyle = (selected: boolean): React.CSSProperties => ({
    textAlign: 'left',
    padding: '16px 20px',
    borderRadius: 14,
    fontSize: 16,
    fontWeight: 500,
    cursor: 'pointer',
    border: '1px solid',
    transition: 'all 180ms cubic-bezier(0.2,0.8,0.2,1)',
    background: selected ? 'rgba(255,163,15,0.1)' : 'rgba(255,255,255,0.02)',
    borderColor: selected ? '#FFA30F' : 'rgba(255,255,255,0.08)',
    color: selected ? '#FFA30F' : '#C4C8D8',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  });

  const checkIcon = (selected: boolean) => (
    <span style={{
      flexShrink: 0,
      width: 22, height: 22,
      borderRadius: '50%',
      border: `2px solid ${selected ? '#FFA30F' : 'rgba(255,255,255,0.15)'}`,
      background: selected ? '#FFA30F' : 'transparent',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all 180ms',
      fontSize: 12, color: '#0C142B', fontWeight: 900,
    }}>
      {selected && '✓'}
    </span>
  );

  return (
    <div ref={containerRef} style={{ background: '#131B36', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 28, overflow: 'hidden' }}>

      {/* Feather pen loading overlay */}
      {loading && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'rgba(10, 15, 35, 0.93)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 36,
          animation: 'overlayFadeIn 0.4s ease-out',
        }}>
          {/* Pen + glow */}
          <div style={{ position: 'relative', width: 180, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              position: 'absolute',
              width: 130,
              height: 130,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,163,15,0.18) 0%, transparent 70%)',
              animation: 'glowPulse 2s ease-in-out infinite',
            }} />
            <div style={{
              animation: 'featherWrite 1.9s ease-in-out infinite',
              transformOrigin: '50% 90%',
              filter: 'drop-shadow(0 6px 20px rgba(255,163,15,0.4))',
            }}>
              <img src="/feather.svg" alt="feather pen" width="150" height="150" style={{ display: 'block' }} />
            </div>
          </div>

          {/* Animated ink lines */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 220 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                height: 2,
                background: 'linear-gradient(90deg, #FFA30F 0%, rgba(255,163,15,0.08) 100%)',
                borderRadius: 2,
                animation: `inkLine 1.9s ease-in-out ${i * 0.32}s infinite`,
                transformOrigin: 'left center',
              }}/>
            ))}
          </div>

          {/* Label */}
          <p style={{
            color: '#E7E9F1',
            fontSize: 17,
            fontWeight: 500,
            fontFamily: 'var(--font-sans)',
            textAlign: 'center',
            maxWidth: 360,
            lineHeight: 1.65,
            margin: 0,
            letterSpacing: '-0.01em',
          }}>
            Writing your personal draft and making sure it's awesome
          </p>

          {/* Patience hint */}
          <p style={{
            color: 'rgba(107,113,136,0.85)',
            fontSize: 12,
            fontWeight: 400,
            fontFamily: 'var(--font-sans)',
            textAlign: 'center',
            maxWidth: 300,
            lineHeight: 1.6,
            margin: '-16px 0 0',
            letterSpacing: '0.01em',
          }}>
            Good things take time — this can take up to a minute.<br />Please don't refresh the page!
          </p>

          {/* Bouncing dots */}
          <div style={{ display: 'flex', gap: 8 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: '#FFA30F',
                animation: `dotBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
              }}/>
            ))}
          </div>
        </div>
      )}

      {/* Header bar */}
      <div style={{ padding: '20px clamp(20px, 5vw, 40px)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#FFA30F', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={14} /> AI Writing Assistant
        </span>
        <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6B7188', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', padding: '4px 10px', borderRadius: 6 }}>
          Beta
        </span>
      </div>

      {/* Step progress bar */}
      <div style={{ padding: '28px clamp(20px, 5vw, 40px) 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          {STEPS.map((s, i) => {
            const done    = i < step;
            const current = i === step;
            return (
              <React.Fragment key={i}>
                {/* Circle */}
                <button
                  onClick={() => i <= step && goTo(i)}
                  style={{
                    flexShrink: 0,
                    width: 42, height: 42,
                    borderRadius: '50%',
                    border: current ? '2px solid #FFA30F' : done ? '2px solid #FFA30F' : '2px solid rgba(255,255,255,0.1)',
                    background: done ? '#FFA30F' : current ? 'rgba(255,163,15,0.12)' : 'rgba(255,255,255,0.03)',
                    color: done ? '#0C142B' : current ? '#FFA30F' : '#6B7188',
                    fontFamily: 'var(--font-sans)',
                    fontSize: 14, fontWeight: 800,
                    cursor: i <= step ? 'pointer' : 'default',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 250ms',
                    boxShadow: current ? '0 0 0 4px rgba(255,163,15,0.15)' : 'none',
                  }}
                >
                  {done ? '✓' : i + 1}
                </button>
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div style={{ flex: 1, height: 2, background: i < step ? '#FFA30F' : 'rgba(255,255,255,0.07)', transition: 'background 300ms' }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
        {/* Step labels */}
        <div style={{ display: 'flex', marginTop: 10 }}>
          {STEPS.map((s, i) => (
            <React.Fragment key={i}>
              <div style={{ width: 42, textAlign: 'center', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: i === step ? '#FFA30F' : i < step ? '#C4C8D8' : '#7B83A0', flexShrink: 0, transition: 'color 250ms' }}>
                {s.label}
              </div>
              {i < STEPS.length - 1 && <div style={{ flex: 1 }} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step heading */}
      <div style={{ padding: '24px clamp(20px, 5vw, 40px) 0' }}>
        <motion.div
          key={`heading-${step}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#FFA30F', marginBottom: 10 }}>
            Step {step + 1} of {STEPS.length}
          </div>
          <h3 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: '#E7E9F1', lineHeight: 1.2, marginBottom: 8 }}>
            {STEPS[step].title}
          </h3>
          <p style={{ margin: 0, fontSize: 15, color: '#A9AEC2', lineHeight: 1.6 }}>
            {STEPS[step].subtitle}
          </p>
        </motion.div>
      </div>

      {/* Step content */}
      <div style={{ padding: '24px clamp(20px, 5vw, 40px) 0', minHeight: 260 }}>
        <motion.div
          key={`content-${step}`}
          initial={{ opacity: 0, x: direction * 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
        >

          {/* ── Step 0: Role ── */}
          {step === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9BA3BF', display: 'block', marginBottom: 14 }}>
                  My Role
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
                  {[...professions, 'Other'].map(p => (
                    <button
                      key={p}
                      onClick={() => setFormData({ ...formData, profession: p })}
                      style={{
                        padding: '12px 20px', borderRadius: 12, fontSize: 15, fontWeight: 600,
                        cursor: 'pointer', border: '1px solid', transition: 'all 180ms',
                        background: formData.profession === p ? '#FFA30F' : 'rgba(255,255,255,0.04)',
                        borderColor: formData.profession === p ? '#FFA30F' : 'rgba(255,255,255,0.1)',
                        color: formData.profession === p ? '#0C142B' : '#C4C8D8',
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                {formData.profession === 'Other' && (
                  <input
                    type="text"
                    placeholder="Enter your role..."
                    value={customProfession}
                    onChange={e => setCustomProfession(e.target.value)}
                    style={inputStyle}
                  />
                )}
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9BA3BF', display: 'block', marginBottom: 14 }}>
                  Industry
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
                  {[...industries, 'Other'].map(ind => (
                    <button
                      key={ind}
                      onClick={() => setFormData({ ...formData, industry: ind })}
                      style={{
                        padding: '12px 20px', borderRadius: 12, fontSize: 15, fontWeight: 600,
                        cursor: 'pointer', border: '1px solid', transition: 'all 180ms',
                        background: formData.industry === ind ? '#FFA30F' : 'rgba(255,255,255,0.04)',
                        borderColor: formData.industry === ind ? '#FFA30F' : 'rgba(255,255,255,0.1)',
                        color: formData.industry === ind ? '#0C142B' : '#C4C8D8',
                      }}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
                {formData.industry === 'Other' && (
                  <input
                    type="text"
                    placeholder="Enter your industry..."
                    value={customIndustry}
                    onChange={e => setCustomIndustry(e.target.value)}
                    style={inputStyle}
                  />
                )}
              </div>
            </div>
          )}

          {/* ── Step 1: Moment ── */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#FFA30F', marginBottom: 2 }}>
                Pick up to 3
              </div>
              {moments.map(m => (
                <button key={m} type="button" onClick={() => toggle('specificMoments', m)} style={optionRowStyle(formData.specificMoments.includes(m))}>
                  {checkIcon(formData.specificMoments.includes(m))}
                  {m}
                </button>
              ))}
              <textarea
                rows={2}
                placeholder="Or describe your own pain point..."
                value={customMoment}
                onChange={e => setCustomMoment(e.target.value)}
                style={{ ...inputStyle, resize: 'none', marginTop: 6 }}
              />
            </div>
          )}

          {/* ── Step 2: Outcome ── */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#FFA30F', marginBottom: 2 }}>
                Pick up to 3
              </div>
              {outcomeDefs.map(def => {
                const selected = formData.keyOutcomes.includes(def.label);
                const liveLabel = def.before
                  ? `${def.before}${outcomeMetrics[def.label] ?? def.defaultMetric}${def.suffix ?? ''}${def.after}`
                  : def.label;
                return (
                  <div
                    key={def.label}
                    onClick={() => toggle('keyOutcomes', def.label)}
                    style={{
                      ...optionRowStyle(selected),
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                      {checkIcon(selected)}
                      <span>{liveLabel}</span>
                    </span>
                    {selected && def.defaultMetric && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: '#FFA30F', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Custom number</span>
                        <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0, border: '1px solid rgba(255,163,15,0.5)', borderRadius: 8, overflow: 'hidden' }}>
                          <input
                            type="number"
                            min="0"
                            value={outcomeMetrics[def.label] ?? def.defaultMetric}
                            onChange={e => setOutcomeMetrics(prev => ({ ...prev, [def.label]: e.target.value }))}
                            onClick={e => e.stopPropagation()}
                            style={{
                              background: 'rgba(255,255,255,0.08)',
                              border: 'none',
                              padding: '6px 10px',
                              fontSize: 14,
                              width: 64,
                              color: '#FFA30F',
                              fontFamily: 'var(--font-sans)',
                              fontWeight: 700,
                              outline: 'none',
                              MozAppearance: 'textfield',
                            } as React.CSSProperties}
                          />
                          <span style={{
                            background: 'rgba(255,163,15,0.15)',
                            color: '#FFA30F',
                            fontWeight: 800,
                            fontSize: 14,
                            padding: '6px 10px',
                            userSelect: 'none',
                            borderLeft: '1px solid rgba(255,163,15,0.3)',
                          }}>
                            {def.suffix}
                          </span>
                        </span>
                      </span>
                    )}
                  </div>
                );
              })}
              <textarea
                rows={2}
                placeholder="Or describe your own outcome..."
                value={customOutcome}
                onChange={e => setCustomOutcome(e.target.value)}
                style={{ ...inputStyle, resize: 'none', marginTop: 6 }}
              />
            </div>
          )}

          {/* ── Step 3: Tone ── */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {([
                  { id: 'professional', label: 'Professional', desc: 'Polished and structured', emoji: '💼' },
                  { id: 'punchy',       label: 'Punchy',       desc: 'Short. Hard-hitting.',   emoji: '⚡' },
                  { id: 'casual',       label: 'Casual',       desc: 'Like a colleague chat',  emoji: '💬' },
                  { id: 'detailed',     label: 'Detailed',     desc: 'Full narrative arc',      emoji: '📖' },
                ] as const).map(s => (
                  <button
                    key={s.id}
                    onClick={() => setFormData({ ...formData, style: s.id })}
                    style={{
                      padding: '20px', borderRadius: 16, border: '1px solid', cursor: 'pointer',
                      textAlign: 'left', transition: 'all 180ms cubic-bezier(0.2,0.8,0.2,1)',
                      borderColor: formData.style === s.id ? '#FFA30F' : 'rgba(255,255,255,0.07)',
                      background: formData.style === s.id ? 'rgba(255,163,15,0.1)' : 'rgba(255,255,255,0.02)',
                      boxShadow: formData.style === s.id ? '0 0 0 1px #FFA30F' : 'none',
                    }}
                  >
                    <div style={{ fontSize: 22, marginBottom: 8 }}>{s.emoji}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: formData.style === s.id ? '#FFA30F' : '#E7E9F1', marginBottom: 4 }}>
                      {s.label}
                    </div>
                    <div style={{ fontSize: 13, color: '#6B7188', lineHeight: 1.4 }}>{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </motion.div>
      </div>

      {/* Navigation footer */}
      <div style={{ padding: '24px clamp(20px, 5vw, 40px) 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
        {step > 0 ? (
          <button
            onClick={() => goTo(step - 1)}
            style={{
              background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12, padding: '14px 24px', fontSize: 15, fontWeight: 600,
              color: '#6B7188', cursor: 'pointer', fontFamily: 'var(--font-sans)',
              transition: 'all 180ms', display: 'flex', alignItems: 'center', gap: 8,
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = '#A9AEC2'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#6B7188'; }}
          >
            ← Back
          </button>
        ) : <div />}

        {step < STEPS.length - 1 ? (
          <button
            onClick={() => goTo(step + 1)}
            style={{
              background: '#FFA30F', border: 'none', borderRadius: 12,
              padding: '16px 32px', fontSize: 16, fontWeight: 700,
              color: '#0C142B', cursor: 'pointer', fontFamily: 'var(--font-sans)',
              display: 'flex', alignItems: 'center', gap: 10,
              transition: 'all 180ms', boxShadow: '0 4px 16px rgba(255,163,15,0.3)',
            }}
            onMouseOver={e => { e.currentTarget.style.background = '#FFB833'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(255,163,15,0.4)'; }}
            onMouseOut={e => { e.currentTarget.style.background = '#FFA30F'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(255,163,15,0.3)'; }}
          >
            Continue <span style={{ fontSize: 18 }}>→</span>
          </button>
        ) : (
          <button
            onClick={generate}
            disabled={loading}
            style={{
              background: loading ? 'rgba(255,163,15,0.5)' : '#FFA30F',
              border: 'none', borderRadius: 12,
              padding: '16px 32px', fontSize: 16, fontWeight: 700,
              color: '#0C142B', cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-sans)',
              display: 'flex', alignItems: 'center', gap: 10,
              transition: 'all 180ms', boxShadow: '0 4px 16px rgba(255,163,15,0.3)',
            }}
          >
            {loading ? (
              <div style={{ width: 18, height: 18, border: '2.5px solid rgba(12,20,43,0.3)', borderTop: '2.5px solid #0C142B', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
            ) : (
              <Sparkles size={18} />
            )}
            {loading ? 'Writing your post...' : 'Generate My Post'}
          </button>
        )}
      </div>
      {!generatedPost && (
        <p style={{ textAlign: 'right', padding: '0 clamp(20px, 5vw, 40px) 24px', fontSize: 12, color: '#6B7188', margin: 0 }}>
          Good writing takes time. Even AI needs a moment to find the right words ✍️
        </p>
      )}

      {/* Generated post output */}
      {generatedPost && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          style={{
            margin: `0 clamp(16px, 5vw, 40px) 40px`,
            background: '#0C142B',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 24,
            padding: 32,
            position: 'relative',
          }}
        >
          <div style={{ position: 'absolute', top: -14, left: 28, background: '#FA3576', color: '#fff', padding: '5px 16px', borderRadius: 999, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            Post Draft
          </div>
          <div style={{ fontSize: 15, lineHeight: 1.8, color: '#E7E9F1', whiteSpace: 'pre-wrap', marginBottom: 24, fontWeight: 400 }}>
            {generatedPost}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={() => { navigator.clipboard.writeText(generatedPost); alert('Copied to clipboard!'); }}
              style={{ width: '100%', background: '#ffffff', color: '#0C142B', border: 'none', borderRadius: 12, padding: '16px 20px', fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 150ms' }}
              onMouseOver={e => (e.currentTarget.style.background = '#E7E9F1')}
              onMouseOut={e => (e.currentTarget.style.background = '#ffffff')}
            >
              Copy Text <ClipboardCheck size={16} />
            </button>
            <button
              onClick={generate}
              disabled={loading}
              style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px 20px', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 700, color: '#6B7188', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 150ms', opacity: loading ? 0.4 : 1 }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)'; e.currentTarget.style.color = '#A9AEC2'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#6B7188'; }}
            >
              {loading ? <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.15)', borderTop: '2px solid #FFF', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} /> : <Sparkles size={14} />}
              {loading ? 'Writing...' : 'Write a different version'}
            </button>
          </div>
        </motion.div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        @keyframes overlayFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes featherWrite {
          0%, 100% { transform: rotate(-28deg) translate(0px, 0px); }
          15%       { transform: rotate(-24deg) translate(7px, 3px); }
          35%       { transform: rotate(-32deg) translate(-3px, 1px); }
          55%       { transform: rotate(-25deg) translate(9px, 4px); }
          75%       { transform: rotate(-30deg) translate(2px, 1px); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50%       { opacity: 1;    transform: scale(1.18); }
        }
        @keyframes inkLine {
          0%        { transform: scaleX(0);   opacity: 0; }
          25%       { opacity: 1; }
          70%       { transform: scaleX(1);   opacity: 0.75; }
          100%      { transform: scaleX(0);   opacity: 0; }
        }
        @keyframes dotBounce {
          0%, 80%, 100% { transform: translateY(0);   opacity: 0.45; }
          40%            { transform: translateY(-9px); opacity: 1; }
        }
      `}</style>
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
      className="submission-form-wrap submission-form"
      style={{
        background: '#131B36',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 24,
        padding: '40px 44px',
        textAlign: 'left',
        maxWidth: 680,
        margin: '0 auto',
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
