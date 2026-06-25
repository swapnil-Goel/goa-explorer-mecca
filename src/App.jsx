import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, HelpCircle, Users, Map, Compass, Star, Gift, X, ChevronRight, Lightbulb, PenTool, Award, UserCheck } from 'lucide-react';

// ═══════════════════════════════════════
// QUESTION BANK
// ═══════════════════════════════════════
const QUESTIONS = [
  { q: "Which fort is famous for iconic cliffside sunsets over the Arabian Sea?", answer: "Chapora Fort" },
  { q: "Which waterfall is Goa's tallest and most powerful, featured on a currency note?", answer: "Dudhsagar Waterfalls" },
  { q: "Which beach is the heart of Goa's legendary nightlife and beach parties?", answer: "Baga Beach" },
  { q: "Where is Goa's capital city, known for its colonial architecture?", answer: "Panjim" },
  { q: "Which beach is known as the 'Queen of Beaches' in North Goa?", answer: "Calangute Beach" },
  { q: "Which colorful heritage district in Panjim is famous for Portuguese-era homes?", answer: "Fontainhas" },
  { q: "Which fort overlooks a dramatic confluence of sea and river in South Goa?", answer: "Cabo De Rama Fort" },
  { q: "Which peaceful beach in the far south is known as Goa's paradise cove?", answer: "Palolem Beach" },
  { q: "Which beach is home to the famous flea market every Wednesday?", answer: "Anjuna Beach" },
  { q: "Which beach at the Mandovi river mouth offers city views and windsurfing?", answer: "Dona Paula Beach" },
  { q: "Which pristine beach is a nesting site for Olive Ridley sea turtles?", answer: "Morjim Beach" },
  { q: "Which beach is known for its bohemian vibe and yoga retreats in the north?", answer: "Arambol Beach" },
  { q: "Which serene beach lies just north of Arambol and has a still-water lake?", answer: "Mandrem Beach" },
  { q: "Which beach between Mandrem and Morjim is known for its exclusivity?", answer: "Ashwem Beach" },
  { q: "Which beach is Goa's most popular and commercial stretch?", answer: "Calangute Beach" },
  { q: "Which peaceful beach south of Calangute is known for its calm waters?", answer: "Candolim Beach" },
  { q: "Which rocky beach near the Chapora River is a backpacker hotspot?", answer: "Vagator Beach" },
  { q: "Which beach at the southern tip of Goa is closest to the Karnataka border?", answer: "Agonda Beach" },
  { q: "Which beach near Margao is Goa's longest and straightest stretch of sand?", answer: "Colva Beach" },
  { q: "Which beach between Colva and Benaulim is known for its tranquility?", answer: "Varca Beach" },
  { q: "Which beach shares its name with a famous poem and has dolphin sightings?", answer: "Benaulim Beach" },
  { q: "Which beach near Vasco da Gama was traditionally used by fishermen?", answer: "Miramar Beach" },
  { q: "Which waterfall is hidden near Valpoi in North Goa's forests?", answer: "Harvalem Waterfalls" },
  { q: "Which waterfall in the Sattari region is surrounded by dense forest?", answer: "Surla Waterfalls" },
  { q: "Which beach south of Margao is popular for its shack culture?", answer: "Majorda Beach" },
  { q: "Which city in central Goa is known for the Mahalaxmi Temple?", answer: "Ponda" },
  { q: "Which beach near Panjim has the Aguada Fort lighthouse visible from it?", answer: "Candolim Beach" },
  { q: "Which sacred hill in Goa offers panoramic views of the Mandovi estuary?", answer: "Dona Paula Beach" },
  { q: "Which colonial city area in Panjim is the old Portuguese quarter?", answer: "Fontainhas" },
  { q: "Which dramatic hilltop fort was once held by Bijapur Sultanate?", answer: "Chapora Fort" },
];

// ═══════════════════════════════════════
// LOCATION DATABASE with map coordinates (% of map image)
// ═══════════════════════════════════════
const LOCATIONS = [
  { id: 1,  name: "Arambol Beach",        x: 15.2, y: 9.8  },
  { id: 2,  name: "Mandrem Beach",        x: 23.3, y: 13.7 },
  { id: 3,  name: "Ashwem Beach",         x: 23.8, y: 20.0 },
  { id: 4,  name: "Morjim Beach",         x: 20.6, y: 26.5 },
  { id: 5,  name: "Vagator Beach",        x: 15.5, y: 30.9 },
  { id: 6,  name: "Anjuna Beach",         x: 23.6, y: 34.0 },
  { id: 7,  name: "Baga Beach",           x: 28.0, y: 36.0 },
  { id: 8,  name: "Calangute Beach",      x: 17.7, y: 40.3 },
  { id: 9,  name: "Candolim Beach",       x: 26.0, y: 43.5 },
  { id: 10, name: "Panjim",               x: 46.0, y: 36.5 },
  { id: 11, name: "Fontainhas",           x: 48.5, y: 38.5 },
  { id: 12, name: "Miramar Beach",        x: 38.0, y: 46.5 },
  { id: 13, name: "Dona Paula Beach",     x: 27.0, y: 50.0 },
  { id: 14, name: "Majorda Beach",        x: 27.5, y: 59.5 },
  { id: 15, name: "Colva Beach",          x: 26.5, y: 63.5 },
  { id: 16, name: "Varca Beach",          x: 27.0, y: 67.5 },
  { id: 17, name: "Benaulim Beach",       x: 26.0, y: 71.0 },
  { id: 18, name: "Cabo De Rama Fort",    x: 34.5, y: 79.5 },
  { id: 19, name: "Agonda Beach",         x: 29.0, y: 84.5 },
  { id: 20, name: "Palolem Beach",        x: 31.5, y: 90.5 },
  { id: 21, name: "Dudhsagar Waterfalls", x: 78.0, y: 52.0 },
  { id: 22, name: "Harvalem Waterfalls",  x: 70.0, y: 17.5 },
  { id: 23, name: "Surla Waterfalls",     x: 76.5, y: 24.0 },
  { id: 24, name: "Chapora Fort",         x: 21.1, y: 32.0 },
];
// ═══════════════════════════════════════
// COUPON GENERATION
// ═══════════════════════════════════════
const generateCoupon = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'SOUL-';
  for (let i = 0; i < 3; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

// ═══════════════════════════════════════
// SVG COMPASS ROSE (decorative)
// ═══════════════════════════════════════
const CompassRose = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="18" stroke="#d97706" strokeWidth="0.8" strokeDasharray="2 2" />
    <circle cx="20" cy="20" r="12" stroke="#d97706" strokeWidth="0.5" />
    <polygon points="20,4 22,18 20,20 18,18" fill="#fbbf24" />
    <polygon points="20,36 22,22 20,20 18,22" fill="#d97706" />
    <polygon points="4,20 18,18 20,20 18,22" fill="#d97706" />
    <polygon points="36,20 22,18 20,20 22,22" fill="#fbbf24" />
    <circle cx="20" cy="20" r="2.5" fill="#fbbf24" />
    <text x="20" y="2.5" fill="#d97706" fontSize="3" textAnchor="middle" fontFamily="serif">N</text>
  </svg>
);

// ═══════════════════════════════════════
// MAP MARKER
// ═══════════════════════════════════════
const MapMarker = ({ location, onClick, isShaking, isCorrect, isWrong }) => {
  return (
    <div
      className={`marker-pin ${isShaking ? 'shake-animation' : ''}`}
      style={{ left: `${location.x}%`, top: `${location.y}%` }}
      onClick={() => onClick(location)}
      title={location.name}
    >
      <div className={`relative transition-all duration-200 ${isCorrect ? 'scale-125' : ''}`}>
        {/* Marker dot */}
        <div
          className={`w-4 h-4 rounded-full border-2 border-yellow-400 flex items-center justify-center cursor-pointer
            ${isCorrect ? 'bg-green-500 border-green-300' : isWrong ? 'bg-red-500 border-red-300' : 'bg-yellow-500'}
            hover:scale-125 transition-all duration-200`}
          style={{
            boxShadow: isCorrect
              ? '0 0 12px rgba(34,197,94,0.8)'
              : '0 0 6px rgba(251,191,36,0.6)',
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-200" />
        </div>
        {/* Hover label */}
        <span className="marker-label">{location.name}</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════
// MODAL – LEADERBOARD
// ═══════════════════════════════════════
const LeaderboardModal = ({ onClose }) => {
  const entries = [
    { rank: 1, name: "Arjun Sharma", score: 12, college: "GIM Goa" },
    { rank: 2, name: "Priya Nair",   score: 10, college: "GIM Goa" },
    { rank: 3, name: "Rahul Mehta",  score: 9,  college: "GIM Goa" },
    { rank: 4, name: "Sneha Patel",  score: 8,  college: "GIM Goa" },
    { rank: 5, name: "Vikram Das",   score: 7,  college: "GIM Goa" },
  ];
  return (
    <ModalWrapper onClose={onClose} title="LEADERBOARD" icon={<Trophy size={20} className="text-yellow-400" />}>
      <div className="space-y-2 mt-4">
        {entries.map(e => (
          <div key={e.rank} className="flex items-center gap-3 p-2 rounded"
            style={{ background: e.rank === 1 ? 'rgba(251,191,36,0.12)' : 'rgba(255,255,255,0.03)', border: '1px solid rgba(251,191,36,0.15)' }}>
            <span className={`text-sm font-bold w-6 ${e.rank === 1 ? 'text-yellow-400' : e.rank === 2 ? 'text-gray-300' : e.rank === 3 ? 'text-yellow-600' : 'text-gray-500'}`}>#{e.rank}</span>
            <span className="flex-1 text-gray-200 text-sm font-medium">{e.name}</span>
            <span className="text-yellow-400 text-sm font-bold">{e.score} pts</span>
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-gray-500 mt-4 italic">Updated every hour • Top 5 Explorers</p>
    </ModalWrapper>
  );
};

// ═══════════════════════════════════════
// MODAL – HOW TO PLAY
// ═══════════════════════════════════════
const HowToPlayModal = ({ onClose }) => (
  <ModalWrapper onClose={onClose} title="HOW TO PLAY" icon={<HelpCircle size={20} className="text-yellow-400" />}>
    <div className="space-y-4 mt-4">
      {[
        { n: "01", t: "Read the Question", d: "A Goa-related question appears on the left panel. Read it carefully." },
        { n: "02", t: "Find the Location", d: "Identify the correct place on the Goa map based on the question." },
        { n: "03", t: "Click the Marker", d: "Click the golden marker on the map that matches your answer." },
        { n: "04", t: "Unlock Your Coupon", d: "If correct, you'll receive an exclusive SOUL coupon! Wrong? Keep exploring." },
      ].map(s => (
        <div key={s.n} className="flex gap-3 items-start">
          <span className="text-2xl font-black text-yellow-500 opacity-60 leading-none" style={{ fontFamily: 'Cinzel' }}>{s.n}</span>
          <div>
            <p className="text-yellow-300 font-semibold text-sm" style={{ fontFamily: 'Cinzel' }}>{s.t}</p>
            <p className="text-gray-400 text-xs mt-0.5">{s.d}</p>
          </div>
        </div>
      ))}
    </div>
    <div className="mt-4 p-3 rounded" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
      <p className="text-yellow-400 text-xs text-center" style={{ fontFamily: 'Cinzel' }}>
        ✦ Each correct answer unlocks 1 exclusive reward ✦
      </p>
    </div>
  </ModalWrapper>
);

// ═══════════════════════════════════════
// MODAL – ABOUT MECCA
// ═══════════════════════════════════════
const AboutMeccaModal = ({ onClose }) => (
  <ModalWrapper onClose={onClose} title="ABOUT MECCA" icon={<Users size={20} className="text-yellow-400" />}>
    <div className="mt-4 space-y-3">
      <p className="text-gray-300 text-sm leading-relaxed">
        MECCA – The Marketing Club of Goa Institute of Management – is a student-driven powerhouse that bridges academic theory with real-world marketing practice.
      </p>
      {[
        { icon: <Lightbulb size={14} />, label: "LEARN", desc: "Industry insights, workshops & case studies" },
        { icon: <PenTool size={14} />, label: "CREATE", desc: "Campaigns, events & creative projects" },
        { icon: <Award size={14} />, label: "COMPETE", desc: "National marketing competitions & fests" },
        { icon: <UserCheck size={14} />, label: "LEAD", desc: "Build your marketing career from day one" },
      ].map(item => (
        <div key={item.label} className="flex items-center gap-3 p-2 rounded"
          style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)' }}>
          <span className="text-yellow-400">{item.icon}</span>
          <div>
            <span className="text-yellow-300 text-xs font-bold" style={{ fontFamily: 'Cinzel' }}>{item.label}</span>
            <p className="text-gray-400 text-xs">{item.desc}</p>
          </div>
        </div>
      ))}
      <div className="text-center p-3 rounded mt-2"
        style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.15), rgba(217,119,6,0.1))', border: '1px solid rgba(251,191,36,0.3)' }}>
        <p className="text-yellow-300 text-sm font-semibold" style={{ fontFamily: 'Cinzel' }}>Applications Opening Soon!</p>
        <p className="text-gray-400 text-xs mt-1">Join the most impactful marketing club in GIM</p>
      </div>
    </div>
  </ModalWrapper>
);

// ═══════════════════════════════════════
// MODAL – SUCCESS (COUPON)
// ═══════════════════════════════════════
const SuccessModal = ({ location, coupon, onClose, onNext }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center"
    style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}>
    <div className="modal-animate relative max-w-sm w-full mx-4"
      style={{
        background: 'linear-gradient(135deg, #0f1f3d 0%, #07132a 100%)',
        border: '2px solid #fbbf24',
        borderRadius: '16px',
        boxShadow: '0 0 60px rgba(251,191,36,0.4), 0 0 120px rgba(245,158,11,0.15)',
      }}>
      {/* Top glow band */}
      <div style={{ background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.3), transparent)', height: '2px', borderRadius: '16px 16px 0 0' }} />

      <div className="p-6 text-center">
        {/* Trophy */}
        <div className="float-anim mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-3"
          style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.25), transparent)', border: '2px solid #fbbf24' }}>
          <Trophy size={32} className="text-yellow-400" />
        </div>

        <p className="text-xs tracking-widest text-yellow-500 mb-1" style={{ fontFamily: 'Cinzel' }}>✦ CONGRATULATIONS EXPLORER ✦</p>
        <h2 className="text-2xl font-black gold-text mb-1" style={{ fontFamily: 'Cinzel' }}>LOCATION FOUND!</h2>
        <p className="text-yellow-300 text-lg font-semibold mb-4" style={{ fontFamily: 'Lora' }}>{location.name}</p>

        {/* Ornament */}
        <div className="ornament-divider my-3"><span className="text-xs text-yellow-600">✦</span></div>

        <p className="text-xs tracking-widest text-gray-400 mb-2" style={{ fontFamily: 'Cinzel' }}>COUPON UNLOCKED</p>
        <div className="glow-pulse px-6 py-3 rounded-lg mb-4 inline-block"
          style={{
            background: 'linear-gradient(135deg, #1a0a00, #2d1600)',
            border: '2px dashed #fbbf24',
            letterSpacing: '0.2em',
          }}>
          <span className="text-2xl font-black text-yellow-400" style={{ fontFamily: 'Cinzel' }}>{coupon}</span>
        </div>

        <p className="text-xs text-gray-500 mb-4" style={{ fontFamily: 'Cinzel' }}>Presented by MECCA – The Marketing Club of GIM</p>

        <div className="flex gap-3">
          <button onClick={onNext} className="btn-gold flex-1 py-2.5 rounded-lg text-sm">
            Next Challenge →
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white transition-colors"
            style={{ border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════
// GENERIC MODAL WRAPPER
// ═══════════════════════════════════════
const ModalWrapper = ({ onClose, title, icon, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center"
    style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}>
    <div className="modal-animate relative max-w-md w-full mx-4"
      style={{
        background: 'linear-gradient(135deg, #0f1f3d 0%, #070f1e 100%)',
        border: '1px solid rgba(251,191,36,0.4)',
        borderRadius: '12px',
        boxShadow: '0 0 40px rgba(251,191,36,0.15)',
      }}>
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'rgba(251,191,36,0.2)' }}>
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="gold-text font-bold tracking-wider" style={{ fontFamily: 'Cinzel', fontSize: '14px' }}>{title}</h2>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors">
          <X size={18} />
        </button>
      </div>
      <div className="p-4 max-h-96 overflow-y-auto scrollbar-thin">
        {children}
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════
// TOAST
// ═══════════════════════════════════════
const Toast = ({ message, visible }) => (
  visible ? (
    <div className="toast-animate fixed bottom-24 left-1/2 z-40 px-5 py-3 rounded-lg text-sm font-medium"
      style={{
        transform: 'translateX(-50%)',
        background: 'linear-gradient(135deg, #1a0f0f, #2d1515)',
        border: '1px solid rgba(239,68,68,0.5)',
        color: '#fca5a5',
        boxShadow: '0 4px 20px rgba(239,68,68,0.2)',
        fontFamily: 'Cinzel',
      }}>
      ✗ {message}
    </div>
  ) : null
);

// ═══════════════════════════════════════
// ANIMATED COUNTER
// ═══════════════════════════════════════
const AnimatedCounter = ({ target, duration = 1500 }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <span>{count.toLocaleString()}</span>;
};

// ═══════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════
export default function App() {
  const [question, setQuestion] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questionsSolved, setQuestionsSolved] = useState(1);
  const [couponsUnlocked, setCouponsUnlocked] = useState(1);
  const [shakingId, setShakingId] = useState(null);
  const [correctId, setCorrectId] = useState(null);
  const [wrongId, setWrongId] = useState(null);
  const [successModal, setSuccessModal] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [modal, setModal] = useState(null); // 'leaderboard' | 'howtoplay' | 'aboutmecca'
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);

  // Pick random question
  const pickQuestion = useCallback((avoidIndex = -1) => {
    let idx;
    do { idx = Math.floor(Math.random() * QUESTIONS.length); } while (idx === avoidIndex);
    setQuestion(QUESTIONS[idx]);
    setQuestionIndex(idx);
    setCorrectId(null);
    setWrongId(null);
  }, []);

  useEffect(() => { pickQuestion(); }, []);

  const showToast = (msg) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast({ visible: false, message: '' }), 3000);
  };

  const handleMarkerClick = (location) => {
    if (successModal || !question) return;
    const isCorrect = location.name === question.answer;
    if (isCorrect) {
      const code = generateCoupon();
      setCouponCode(code);
      setCorrectId(location.id);
      setSuccessModal(location);
      setQuestionsSolved(p => p + 1);
      setCouponsUnlocked(p => p + 1);
    } else {
      setWrongId(location.id);
      setShakingId(location.id);
      showToast("Not quite, Explorer. Try another location!");
      setTimeout(() => setShakingId(null), 600);
      setTimeout(() => setWrongId(null), 1200);
    }
  };

  const handleNext = () => {
    setSuccessModal(null);
    pickQuestion(questionIndex);
  };

  return (
    <div className="w-screen h-screen overflow-hidden relative select-none"
      style={{ background: 'radial-gradient(ellipse at 20% 50%, #0a1628 0%, #050d1a 50%, #030810 100%)' }}>

      {/* Background decorative overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `
          radial-gradient(ellipse at 80% 20%, rgba(251,191,36,0.04) 0%, transparent 50%),
          radial-gradient(ellipse at 20% 80%, rgba(30,60,120,0.15) 0%, transparent 50%)
        `
      }} />

      {/* ═══ TOP NAVIGATION BAR ═══ */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-2"
        style={{ background: 'linear-gradient(180deg, rgba(3,8,16,0.98) 0%, rgba(3,8,16,0.85) 100%)', borderBottom: '1px solid rgba(251,191,36,0.2)' }}>

        {/* MECCA Logo */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 flex items-center justify-center rounded"
            style={{ background: 'linear-gradient(135deg, #d97706, #fbbf24)', border: '1px solid #fde68a' }}>
            <span className="text-xs font-black text-yellow-900" style={{ fontFamily: 'Cinzel' }}>M</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-yellow-400 font-bold text-xs leading-none" style={{ fontFamily: 'Cinzel' }}>MECCA</p>
            <p className="text-gray-500 text-[8px] leading-none tracking-wider">THE MARKETING CLUB OF GIM</p>
          </div>
        </div>

        {/* Title */}
        <div className="text-center absolute left-1/2 transform -translate-x-1/2">
          <h1 className="gold-text font-black leading-none" style={{ fontFamily: 'Cinzel', fontSize: 'clamp(18px, 3vw, 32px)', letterSpacing: '0.05em' }}>
            GOA EXPLORER
          </h1>
          <p className="text-yellow-600 text-[9px] tracking-widest" style={{ fontFamily: 'Cinzel' }}>FIND THE PLACE. UNLOCK THE REWARD.</p>
        </div>

        {/* Nav buttons */}
        <div className="flex items-center gap-2">
          <button className="nav-btn" onClick={() => setModal('leaderboard')}>
            <Trophy size={14} />
            <span>LEADERBOARD</span>
          </button>
          <button className="nav-btn" onClick={() => setModal('howtoplay')}>
            <HelpCircle size={14} />
            <span>HOW TO PLAY</span>
          </button>
          <button className="nav-btn" onClick={() => setModal('aboutmecca')}>
            <Users size={14} />
            <span>ABOUT MECCA</span>
          </button>
        </div>
      </header>

      {/* ═══ MAIN CONTENT AREA ═══ */}
      <div className="absolute inset-0 flex gap-0 pt-12 pb-14">

        {/* ─── LEFT PANEL ─── */}
        <aside className="flex-none w-52 xl:w-56 h-full flex flex-col gap-2 p-2 pl-3 overflow-hidden">

          {/* Question Card */}
          <div className="flex-none rounded-lg p-3 relative overflow-hidden"
            style={{
              background: 'linear-gradient(150deg, #f5e6c8 0%, #e8d5a3 40%, #d4b87a 100%)',
              border: '2px solid #b45309',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.3)',
            }}>
            {/* Parchment texture overlay */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(0,0,0,0.05) 20px, rgba(0,0,0,0.05) 21px)'
            }} />

            <div className="relative z-10">
              <div className="ornament-divider mb-2" style={{ color: '#92400e' }}>
                <span className="text-[9px] font-bold tracking-widest" style={{ fontFamily: 'Cinzel', color: '#92400e' }}>
                  ✦ TODAY'S QUESTION ✦
                </span>
              </div>
              <p className="text-center font-semibold leading-snug mb-3"
                style={{ fontFamily: 'Lora', fontSize: '13px', color: '#1c0a00' }}>
                {question?.q || 'Loading question...'}
              </p>
              <div className="ornament-divider my-2" style={{ color: '#92400e' }}>
                <CompassRose size={20} />
              </div>
              <p className="text-center text-[9px] leading-tight mt-1" style={{ color: '#78350f', fontFamily: 'Lora', fontStyle: 'italic' }}>
                Find the correct place on the map and click to unlock your reward!
              </p>
            </div>
          </div>

          {/* Find It Button */}
          <button className="btn-gold flex-none rounded-lg py-2.5 flex items-center justify-center gap-2 text-xs">
            <Compass size={13} />
            FIND IT ON THE MAP
          </button>

          {/* Explorer Progress */}
          <div className="flex-1 rounded-lg p-3"
            style={{
              background: 'linear-gradient(135deg, rgba(15,31,61,0.98) 0%, rgba(7,15,30,0.99) 100%)',
              border: '1px solid rgba(251,191,36,0.35)',
              boxShadow: 'inset 0 0 30px rgba(0,0,0,0.4)',
            }}>
            <div className="ornament-divider mb-3">
              <span className="text-[9px] tracking-widest gold-text font-bold" style={{ fontFamily: 'Cinzel' }}>
                EXPLORER PROGRESS
              </span>
            </div>

            {/* Compass icon center */}
            <div className="flex justify-center mb-3">
              <div className="float-anim">
                <CompassRose size={48} />
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="stat-card">
                <p className="text-[8px] tracking-widest text-gray-500 mb-1" style={{ fontFamily: 'Cinzel' }}>QUESTIONS SOLVED</p>
                <p className="text-2xl font-black gold-text" style={{ fontFamily: 'Cinzel' }}>
                  {String(questionsSolved).padStart(2, '0')}
                </p>
              </div>
              <div className="stat-card">
                <p className="text-[8px] tracking-widest text-gray-500 mb-1" style={{ fontFamily: 'Cinzel' }}>COUPONS UNLOCKED</p>
                <p className="text-2xl font-black gold-text" style={{ fontFamily: 'Cinzel' }}>
                  {String(couponsUnlocked).padStart(2, '0')}
                </p>
              </div>
            </div>

            {/* Treasure chest icon */}
            <div className="mt-3 flex justify-center">
              <div className="glow-pulse rounded-lg p-2" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
                <Gift size={20} className="text-yellow-500" />
              </div>
            </div>
          </div>
        </aside>

        {/* ─── CENTER MAP ─── */}
        <main className="flex-1 h-full relative overflow-hidden mx-1"
  style={{ minWidth: 0 }}>

  {/* Map container */}
  <div
    ref={mapRef}
    className="w-full h-full relative rounded-lg overflow-hidden"
    style={{
      border: '1px solid rgba(251,191,36,0.3)',
      boxShadow: '0 0 40px rgba(0,0,0,0.6)',
    }}

    onClick={(e) => {
      const rect = e.currentTarget.getBoundingClientRect();

      const x = (
        ((e.clientX - rect.left) / rect.width) * 100
      ).toFixed(1);

      const y = (
        ((e.clientY - rect.top) / rect.height) * 100
      ).toFixed(1);

      console.clear();
      console.log("========================");
      console.log(`x: ${x}`);
      console.log(`y: ${y}`);
      console.log("========================");
    }}
  >
            {/* Map image */}
            <img
              src="/goa-map.png"
              alt="Goa Map"
              className="w-full h-full object-fill"
              style={{
                opacity: mapLoaded ? 1 : 0,
                transition: 'opacity 0.8s ease',
              }}
              onLoad={() => setMapLoaded(true)}
              onError={(e) => {
                // fallback: render a styled placeholder map
                e.target.style.display = 'none';
                setMapLoaded(true);
              }}
            />

            {/* Fallback map background when image not loaded */}
            {!mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #1a6b8a 0%, #0d4a6e 50%, #0a3a5c 100%)' }}>
                <div className="text-center">
                  <div className="float-anim"><CompassRose size={60} /></div>
                  <p className="text-yellow-400 mt-3 text-sm" style={{ fontFamily: 'Cinzel' }}>Loading Map...</p>
                  <p className="text-gray-400 text-xs mt-1">Place goa-map.png in /public folder</p>
                </div>
              </div>
            )}

            {/* Map overlay gradient for depth */}
            <div className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(to right, rgba(3,8,16,0.15) 0%, transparent 8%, transparent 92%, rgba(3,8,16,0.15) 100%)',
              }} />

            {/* Map markers */}
            {LOCATIONS.map(loc => (
              <MapMarker
                key={loc.id}
                location={loc}
                onClick={handleMarkerClick}
                isShaking={shakingId === loc.id}
                isCorrect={correctId === loc.id}
                isWrong={wrongId === loc.id}
              />
            ))}

            {/* Map title overlay (top center of map) */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 pointer-events-none">
              <div className="px-3 py-1 rounded"
                style={{
                  background: 'rgba(3,8,16,0.7)',
                  border: '1px solid rgba(251,191,36,0.3)',
                }}>
                <p className="text-yellow-500 text-[8px] tracking-widest" style={{ fontFamily: 'Cinzel' }}>✦ GOA EXPLORER MAP ✦</p>
              </div>
            </div>

            {/* Arabian Sea label */}
            <div className="absolute bottom-1/3 left-4 pointer-events-none">
              <p className="text-blue-300 text-[9px] tracking-widest opacity-60 italic transform -rotate-12" style={{ fontFamily: 'Cinzel' }}>
                ARABIAN<br />SEA
              </p>
            </div>
          </div>
        </main>

        {/* ─── RIGHT PANEL ─── */}
        <aside className="flex-none w-40 xl:w-44 h-full flex flex-col gap-2 p-2 pr-3 overflow-hidden">

          {/* MECCA Logo Card */}
          <div className="flex-none rounded-lg p-3 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(15,31,61,0.98) 0%, rgba(7,15,30,0.99) 100%)',
              border: '2px solid rgba(251,191,36,0.4)',
              boxShadow: '0 0 20px rgba(251,191,36,0.08)',
            }}>
            <div className="w-10 h-10 mx-auto mb-2 rounded flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #d97706, #fbbf24)' }}>
              <span className="text-lg font-black text-yellow-900" style={{ fontFamily: 'Cinzel' }}>M</span>
            </div>
            <p className="gold-text text-sm font-black tracking-wider" style={{ fontFamily: 'Cinzel' }}>MECCA</p>
            <p className="text-gray-500 text-[8px] leading-tight tracking-wider mt-0.5">THE MARKETING CLUB OF GIM</p>

            {/* Compass decorative */}
            <div className="flex justify-center mt-2">
              <CompassRose size={30} />
            </div>
          </div>

          {/* About MECCA panel */}
          <div className="flex-1 rounded-lg p-3 overflow-hidden flex flex-col"
            style={{
              background: 'linear-gradient(150deg, #f5e6c8 0%, #e8d5a3 40%, #d4b87a 100%)',
              border: '2px solid #b45309',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            }}>
            <div className="ornament-divider mb-3" style={{ color: '#92400e' }}>
              <span className="text-[9px] font-bold tracking-widest" style={{ fontFamily: 'Cinzel', color: '#92400e' }}>
                ABOUT MECCA
              </span>
            </div>

            <div className="space-y-2.5 flex-1">
              {[
                { icon: <Lightbulb size={12} />, label: "LEARN" },
                { icon: <PenTool size={12} />, label: "CREATE" },
                { icon: <Trophy size={12} />, label: "COMPETE" },
                { icon: <UserCheck size={12} />, label: "LEAD" },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  <span style={{ color: '#92400e' }}>{item.icon}</span>
                  <span className="text-xs font-bold tracking-wider" style={{ fontFamily: 'Cinzel', color: '#1c0a00' }}>{item.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-3">
              <p className="text-[10px] leading-snug mb-3" style={{ color: '#3d1f00', fontFamily: 'Lora', fontStyle: 'italic' }}>
                Marketing is more than ideas. It's impact.
              </p>

              <button
                className="w-full py-2 rounded text-[9px] font-bold tracking-wider"
                style={{
                  background: 'linear-gradient(135deg, #d97706, #b45309)',
                  color: '#fff8e7',
                  fontFamily: 'Cinzel',
                  border: '1px solid #fbbf24',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}
                onClick={() => setModal('aboutmecca')}>
                APPLICATIONS<br />OPENING SOON
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* ═══ BOTTOM STATS BAR ═══ */}
      <footer className="absolute bottom-0 left-0 right-0 z-30 flex items-center justify-center gap-0"
        style={{
          height: '56px',
          background: 'linear-gradient(180deg, rgba(3,8,16,0.92) 0%, rgba(3,8,16,0.99) 100%)',
          borderTop: '1px solid rgba(251,191,36,0.25)',
        }}>

        <div className="flex items-center gap-6 px-8 py-2 rounded-lg"
          style={{
            background: 'linear-gradient(90deg, rgba(15,31,61,0.8), rgba(7,15,30,0.9), rgba(15,31,61,0.8))',
            border: '1px solid rgba(251,191,36,0.25)',
            boxShadow: '0 0 20px rgba(251,191,36,0.08)',
          }}>

          {/* Explorers Today */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded flex items-center justify-center"
              style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.25)' }}>
              <Users size={16} className="text-yellow-400" />
            </div>
            <div>
              <p className="text-gray-500 text-[8px] tracking-widest" style={{ fontFamily: 'Cinzel' }}>EXPLORERS TODAY</p>
              <p className="gold-text font-black text-xl leading-none" style={{ fontFamily: 'Cinzel' }}>
                <AnimatedCounter target={1247} duration={1800} />
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-8" style={{ background: 'linear-gradient(180deg, transparent, rgba(251,191,36,0.3), transparent)' }} />

          {/* Coupons Unlocked */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded flex items-center justify-center"
              style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.25)' }}>
              <Gift size={16} className="text-yellow-400" />
            </div>
            <div>
              <p className="text-gray-500 text-[8px] tracking-widest" style={{ fontFamily: 'Cinzel' }}>COUPONS UNLOCKED</p>
              <p className="gold-text font-black text-xl leading-none" style={{ fontFamily: 'Cinzel' }}>
                <AnimatedCounter target={582} duration={1500} />
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* ═══ MODALS ═══ */}
      {modal === 'leaderboard' && <LeaderboardModal onClose={() => setModal(null)} />}
      {modal === 'howtoplay' && <HowToPlayModal onClose={() => setModal(null)} />}
      {modal === 'aboutmecca' && <AboutMeccaModal onClose={() => setModal(null)} />}
      {successModal && (
        <SuccessModal
          location={successModal}
          coupon={couponCode}
          onClose={() => setSuccessModal(null)}
          onNext={handleNext}
        />
      )}

      {/* Toast */}
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}
