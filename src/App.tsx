import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Sliders,
  CheckCircle,
  Clock,
  DollarSign,
  MapPin,
  Camera,
  Eye,
  Truck,
  Shield,
  TrendingUp,
  Sparkles,
  Award,
  ChevronRight,
  Star,
  Users,
  Briefcase,
  Terminal,
  ShoppingBag,
  Plus,
  Minus,
  Check,
  X,
  Menu,
  Send,
  Info,
  Heart,
  Globe,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Flame,
  Wrench,
  Gauge,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Mail,
  Building2,
  User,
  Calendar,
  History,
  Share2,
  LogOut,
  FolderTree,
  FileCode,
  Leaf
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import RoutingMap from './components/RoutingMap';
import CustomerPortal from './components/CustomerPortal';
import MechanicPortal from './components/MechanicPortal';
import MechanicAuthPortal from './components/MechanicAuthPortal';
import AdminPortal from './components/AdminPortal';

// Resilient Brand Logo Component that renders polished HTML/CSS vector styling to guarantee instant loading, perfect sharpness, and zero external blocks
const BrandLogo: React.FC<{ name: string; logoUrl: string }> = ({ name }) => {
  if (name === 'Cofap') {
    return (
      <div className="flex items-center gap-1 font-sans italic font-extrabold text-[#f26522] text-sm md:text-base select-none tracking-tight">
        <span className="not-italic text-[10px] text-[#f26522] mr-0.5">◀</span>cofap
      </div>
    );
  }
  if (name === 'D.I.D') {
    return (
      <div className="text-[#e31b23] font-black tracking-widest text-sm md:text-base font-sans select-none flex items-center justify-center gap-0.5">
        D<span className="text-[8px] text-[#e31b23]">•</span>I<span className="text-[8px] text-[#e31b23]">•</span>D
      </div>
    );
  }
  if (name === 'Fram') {
    return (
      <div className="bg-[#f26522] text-black px-2.5 py-1 font-black italic border border-black text-[10px] md:text-xs tracking-tighter select-none rounded">
        FRAM
      </div>
    );
  }
  if (name === 'Tecfil') {
    return (
      <div className="text-[#0d47a1] font-black italic tracking-tighter text-sm md:text-base select-none">
        Tec<span className="text-[#fbc02d]">fil</span>
      </div>
    );
  }
  if (name === 'TRW Varga') {
    return (
      <div className="flex flex-col items-center leading-none select-none">
        <span className="bg-[#fbc02d] text-black text-[7px] font-bold px-1 rounded-sm uppercase tracking-tight scale-90">VARGA</span>
        <span className="text-[#e31b23] font-black tracking-tighter text-sm md:text-base">TRW</span>
      </div>
    );
  }
  if (name === 'NGK') {
    return (
      <div className="flex flex-col items-center leading-none select-none">
        <span className="text-[#e31b23] font-black text-sm md:text-base tracking-tighter">NGK</span>
        <span className="text-[#e31b23] text-[5px] font-black tracking-widest uppercase scale-90">SPARK PLUGS</span>
      </div>
    );
  }
  if (name === 'Nissin') {
    return (
      <div className="text-[#004b93] font-black tracking-wider text-xs md:text-sm select-none flex items-center gap-0.5">
        <span className="text-red-600">N</span>ISSIN
      </div>
    );
  }
  if (name === 'Bosch') {
    return (
      <div className="text-red-600 font-extrabold tracking-tight text-sm md:text-base font-sans select-none">
        BOSCH
      </div>
    );
  }
  if (name === 'Castrol') {
    return (
      <div className="text-green-700 font-extrabold italic text-sm md:text-base font-sans select-none">
        Castrol
      </div>
    );
  }
  if (name === 'Michelin') {
    return (
      <div className="text-blue-800 font-extrabold tracking-wider text-[11px] md:text-xs uppercase select-none">
        MICHELIN
      </div>
    );
  }
  if (name === 'Pirelli') {
    return (
      <div className="text-red-600 font-extrabold tracking-widest text-[11px] md:text-xs uppercase select-none">
        PIRELLI
      </div>
    );
  }
  if (name === 'Mobil') {
    return (
      <div className="text-blue-800 font-black text-sm md:text-base select-none">
        Mobil<span className="text-red-600">o</span>
      </div>
    );
  }
  return (
    <div className="text-zinc-500 font-extrabold tracking-wider text-[10px] uppercase font-mono select-none">
      {name}
    </div>
  );
};

// Custom Services list for Client Section (iFood Style)
interface Service {
  id: string;
  name: string;
  time: number;
  category: 'Mais Pedidos' | 'Mecânica Rápida' | 'Transmissão & Freios';
  image: string;
  description: string;
  formaAtendimento: 'Pronto Atendimento' | 'Sob Agendamento';
}

const SERVICES_CATALOG: Service[] = [
  {
    id: 'srv-1',
    name: 'TROCAR ÓLEO DE MOTOR',
    formaAtendimento: 'Pronto Atendimento',
    time: 15,
    category: 'Mais Pedidos',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=400',
    description: 'Substituição completa do óleo com lubrificante premium Mobil para prolongar a vida útil do motor.'
  },
  {
    id: 'srv-2',
    name: 'TROCAR KIT TRANSMISSAO (RELAÇÃO)',
    formaAtendimento: 'Sob Agendamento',
    time: 40,
    category: 'Transmissão & Freios',
    image: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&q=80&w=400',
    description: 'Troca de corrente, coroa e pinhão novos com regulagem profissional e lubrificação técnica.'
  },
  {
    id: 'srv-3',
    name: 'TROCA DE FILTRO DE OLEO',
    formaAtendimento: 'Pronto Atendimento',
    time: 10,
    category: 'Mecânica Rápida',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=400',
    description: 'Instalação de novo filtro de óleo de alta eficiência para manter a lubrificação do motor sempre purificada.'
  },
  {
    id: 'srv-4',
    name: 'TROCA DA PASTILHA DE FREIO',
    formaAtendimento: 'Pronto Atendimento',
    time: 20,
    category: 'Mais Pedidos',
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=400',
    description: 'Substituição das pastilhas de freio dianteiras ou traseiras Cobreq com lixamento técnico do disco.'
  },
  {
    id: 'srv-5',
    name: 'TROCA DA LONA DE FREIO',
    formaAtendimento: 'Pronto Atendimento',
    time: 25,
    category: 'Transmissão & Freios',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=400',
    description: 'Substituição completa das sapatas/lonas de freio traseiras para sistemas de tambor mecânico.'
  },
  {
    id: 'srv-6',
    name: 'RETROVISORES',
    formaAtendimento: 'Pronto Atendimento',
    time: 10,
    category: 'Mecânica Rápida',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=400',
    description: 'Instalação e ajuste de espelhos retrovisores reforçados anti-vibração para garantir segurança.'
  },
  {
    id: 'srv-7',
    name: 'REPARO CAMARA PNEU DIANTEIRO/TRASEIRO',
    formaAtendimento: 'Pronto Atendimento',
    time: 25,
    category: 'Mecânica Rápida',
    image: 'https://images.unsplash.com/photo-1615887023516-9b6bcd559e87?auto=format&fit=crop&q=80&w=400',
    description: 'Reparo profissional de furo ou vulcanização completa de câmara de ar de moto.'
  },
  {
    id: 'srv-8',
    name: 'REPARO PNEU SEM DIANTEIRO/TRASEIRO',
    formaAtendimento: 'Pronto Atendimento',
    time: 15,
    category: 'Mais Pedidos',
    image: 'https://images.unsplash.com/photo-1582266255765-fa5cf1a1d501?auto=format&fit=crop&q=80&w=400',
    description: 'Remoção de objeto perfurante e remendo rápido do tipo macarrão vulcanizado para pneu tubeless.'
  },
  {
    id: 'srv-9',
    name: 'TROCA DE FILTRO AR',
    formaAtendimento: 'Pronto Atendimento',
    time: 15,
    category: 'Mecânica Rápida',
    image: 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?auto=format&fit=crop&q=80&w=400',
    description: 'Substituição do filtro de ar para melhorar o rendimento e reduzir o consumo de combustível.'
  },
  {
    id: 'srv-10',
    name: 'TROCA DO LAMPADAS',
    formaAtendimento: 'Pronto Atendimento',
    time: 15,
    category: 'Mecânica Rápida',
    image: 'https://images.unsplash.com/photo-1508898578281-774ac4893c0c?auto=format&fit=crop&q=80&w=400',
    description: 'Substituição de lâmpadas queimadas de farol principal, piscas auxiliares ou lanterna de freio.'
  },
  {
    id: 'srv-11',
    name: 'TROCAR VELA DE IGNIÇÃO',
    formaAtendimento: 'Pronto Atendimento',
    time: 15,
    category: 'Mecânica Rápida',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=400',
    description: 'Instalação de vela de ignição NGK nova para garantir partidas rápidas e queima eficiente.'
  }
];

export default function App() {
  // Navigation State
  const [workspaceMode, setWorkspaceMode] = useState<'institutional' | 'client' | 'mechanic' | 'admin'>('institutional');
  const [navMobileOpen, setNavMobileOpen] = useState(false);

  // Hidden activation via secret triggers (no visible buttons)
  const [logoClicks, setLogoClicks] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('admin') === 'true' || params.get('portal') === 'admin') {
        setWorkspaceMode('admin');
      }
    }
  }, []);

  const handleLogoClick = () => {
    setLogoClicks(prev => {
      const next = prev + 1;
      if (next >= 5) {
        setWorkspaceMode('admin');
        alert('🔑 Portal Administrativo OttoMotos Desbloqueado via Sequência de Cliques!');
        return 0;
      }
      return next;
    });
    
    if (logoClicks === 0) {
      handleModeChange('institutional');
    }
  };

  const [mechanicViewMode, setMechanicViewMode] = useState<'marketing' | 'portal'>('portal'); // Default to 'portal' for direct functional access
  const [mechanicUser, setMechanicUser] = useState<{
    id: string;
    name: string;
    email: string;
    meName: string;
    meCnpj: string;
    cnh: string;
  } | null>(() => {
    const saved = localStorage.getItem('otto_active_mechanic_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });
  const [previewStep, setPreviewStep] = useState<number>(3); // Default to Step 3: Mecânico no Local
  
  // Admin radius setting (determined in the platform admin panel)
  const [adminRadius, setAdminRadius] = useState<number>(15); // Default search radius in km
  
  // Client Shopping Bag State (iFood Style)
  const [cart, setCart] = useState<Array<{ service: Service; quantity: number }>>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('Mais Pedidos');

  // Checkout and tracking states
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [checkoutMoto, setCheckoutMoto] = useState('Honda CG 160 Titan');
  const [checkoutAddress, setCheckoutAddress] = useState('Rua General Osório, 1200 - Centro, Campinas - SP');
  const [activeTracking, setActiveTracking] = useState(false);
  const [routeDistance, setRouteDistance] = useState<string>('2.4 km');
  const [routeDuration, setRouteDuration] = useState<string>('12 min');
  const [showLiveCamera, setShowLiveCamera] = useState(false);

  // Client portal authentication & navigation states
  const [clientUser, setClientUser] = useState<{
    name: string;
    email: string;
    type: 'PF' | 'PJ';
    cpfCnpj: string;
    companyName?: string;
    role: 'B2C_CAROL' | 'B2C_CARLOS' | 'B2B_ANTONIO';
    points: number;
  } | null>(null);

  const [clientActiveTab, setClientActiveTab] = useState<'dashboard' | 'catalog' | 'tracking' | 'fidelidade' | 'architecture'>('dashboard');

  interface Motorcycle {
    id: string;
    model: string;
    plate: string;
    year: string;
    color: string;
  }
  
  const [garage, setGarage] = useState<Motorcycle[]>([]);
  const [selectedMotoId, setSelectedMotoId] = useState<string>('');

  // Authentication form state
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: '',
    type: 'PF' as 'PF' | 'PJ',
    cpf: '',
    cnpj: '',
    companyName: '',
  });

  const [showAddBikeForm, setShowAddBikeForm] = useState(false);
  const [newBike, setNewBike] = useState({
    model: 'Honda CG 160 Titan',
    plate: '',
    year: '2025',
    color: 'Preto'
  });

  // Mechanic Section Calculator States
  const [servicesPerDay, setServicesPerDay] = useState<number>(5);
  const [daysPerWeek, setDaysPerWeek] = useState<number>(5);
  const [showMechanicSuccess, setShowMechanicSuccess] = useState(false);

  // Mechanic Registration Form State
  const [mechanicName, setMechanicName] = useState('');
  const [mechanicEmail, setMechanicEmail] = useState('');
  const [mechanicPhone, setMechanicPhone] = useState('');
  const [mechanicCnh, setMechanicCnh] = useState('A');
  const [mechanicExp, setMechanicExp] = useState('3_5_years');

  // Log Event helper simulating real gtag and fbq scripts
  const logEvent = (system: 'Meta Pixel' | 'Google Analytics', eventName: string, payload: any) => {
    // Real placeholders for Google Analytics and Meta Pixel tracking
    if (typeof window !== 'undefined') {
      console.log(`[Analytics - ${system}]`, eventName, payload);
    }
  };

  // Trigger initial PageView events
  useEffect(() => {
    logEvent('Google Analytics', 'gtag("config", "G-OTTO2026", { "hero_variation": "B-Split-Screen" })', { page_path: '/', theme: 'Montserrat' });
    logEvent('Meta Pixel', 'fbq("track", "PageView")', { variation: 'B-Split-Screen' });
  }, []);

  // Update mode triggers conversion tracking
  const handleModeChange = (mode: 'institutional' | 'client' | 'mechanic' | 'admin') => {
    setWorkspaceMode(mode);
    setNavMobileOpen(false);
    logEvent('Google Analytics', 'gtag("event", "tab_switch")', { target_mode: mode });
    logEvent('Meta Pixel', 'fbq("trackCustom", "TabSwitch")', { mode });
  };

  // Shopping cart functions
  const addToCart = (service: Service) => {
    setCart(prev => {
      const existing = prev.find(item => item.service.id === service.id);
      if (existing) {
        return prev.map(item => item.service.id === service.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { service, quantity: 1 }];
    });
    logEvent('Google Analytics', 'gtag("event", "add_to_cart")', { item_id: service.id, name: service.name });
    logEvent('Meta Pixel', 'fbq("track", "AddToCart")', { content_name: service.name, content_ids: [service.id] });
  };

  const removeFromCart = (serviceId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.service.id === serviceId);
      if (existing && existing.quantity > 1) {
        return prev.map(item => item.service.id === serviceId ? { ...item, quantity: item.quantity - 1 } : item);
      }
      return prev.filter(item => item.service.id !== serviceId);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const getSubtotal = () => {
    return 0; // Price references removed
  };

  const displacementTax = 35.00;
  const getTotal = () => {
    return 0; // Price references removed
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowCheckoutModal(false);
    setActiveTracking(true);
    
    // Log conversion events
    logEvent('Google Analytics', 'gtag("event", "request_quote")', {
      transaction_id: `Q-${Date.now()}`,
      items: cart.map(item => ({ item_name: item.service.name, quantity: item.quantity }))
    });
    logEvent('Meta Pixel', 'fbq("track", "Lead")', {
      content_category: 'quote_request',
      contents: cart.map(item => ({ id: item.service.id, quantity: item.quantity }))
    });

    // Clear cart after order is placed
    setCart([]);
    setIsCartOpen(false);
    setClientActiveTab('tracking');

    // Scroll to tracking map smoothly
    setTimeout(() => {
      const mapElement = document.getElementById('map-tracking-view');
      if (mapElement) {
        mapElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleMechanicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowMechanicSuccess(true);
    logEvent('Google Analytics', 'gtag("event", "lead_mechanic")', {
      mechanic_name: mechanicName,
      experience_years: mechanicExp,
      estimated_earnings: getEstimatedEarnings()
    });
    logEvent('Meta Pixel', 'fbq("track", "Lead")', {
      content_category: 'mechanic_registration',
      content_name: mechanicName,
      estimated_earnings: getEstimatedEarnings()
    });
  };

  // Calculator monthly gross revenue formula
  const getEstimatedEarnings = () => {
    const baseFeePerService = 75.00; // mechanic's net share per job
    const weeklyJobs = servicesPerDay * daysPerWeek;
    return Math.round(weeklyJobs * 4.34 * baseFeePerService);
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-brand-orange selection:text-black antialiased">
      <div className="sticky top-0 z-50 w-full">
        <nav id="navbar" className="bg-zinc-950 text-white border-b border-zinc-900 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
            
            {/* Logo element */}
            <div className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer shrink-0 animate-fadeIn" onClick={handleLogoClick}>
              <svg className="h-11 sm:h-13 lg:h-15 w-auto shrink-0" viewBox="0 0 70 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Outer circle/ring (open at top-right) */}
                <path d="M 41.5 20.5 A 13.5 13.5 0 1 0 43.5 35.5" stroke="#FF6B00" strokeWidth="7" strokeLinecap="round" fill="none" />
                {/* Central solid circle */}
                <circle cx="32" cy="30" r="5.5" fill="#FF6B00" />
                {/* Droplet pointing up-right */}
                <path d="M 40.5 21.5 C 43.5 17, 46.5 15.5, 49.5 16 C 52.5 16.5, 51.5 20.5, 47.5 23.5 C 44.5 25.5, 42 24.5, 40.5 21.5 Z" fill="#FF6B00" />
                {/* Separate dot at top-right */}
                <circle cx="56" cy="15" r="4.5" fill="#FF6B00" />
              </svg>
              <div className="flex flex-col justify-center -space-y-1 sm:-space-y-1.5 text-left">
                <div className="flex items-center text-xl sm:text-2xl lg:text-3xl font-sans tracking-tight leading-none select-none">
                  <span className="text-white font-extrabold">Otto</span>
                  <span className="text-zinc-200 font-light ml-0.5">Motos</span>
                </div>
                <span className="text-[9px] sm:text-[10.5px] lg:text-[12px] font-black tracking-[0.22em] text-brand-orange uppercase leading-none font-sans block select-none">
                  SERVIÇOS
                </span>
              </div>
            </div>

            {/* Centralized text navigation with no heavy buttons - Hidden on mobile/iPad, Visible on Desktop */}
            <div className="hidden lg:flex items-center gap-6 text-xs font-bold">
              <button
                onClick={() => {
                  handleModeChange('institutional');
                  setTimeout(() => {
                    const target = document.getElementById('como-funciona');
                    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 100);
                }}
                className="text-zinc-300 hover:text-brand-orange px-2 py-1.5 cursor-pointer transition-all"
              >
                Como Funciona
              </button>
              <button
                onClick={() => {
                  handleModeChange('institutional');
                  setTimeout(() => {
                    const target = document.getElementById('quem-somos');
                    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 100);
                }}
                className="text-zinc-300 hover:text-brand-orange px-2 py-1.5 cursor-pointer transition-all"
              >
                Quem Somos / Sobre Nós
              </button>
              <button
                onClick={() => {
                  handleModeChange('institutional');
                  setTimeout(() => {
                    const target = document.getElementById('contato-suporte');
                    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 100);
                }}
                className="text-zinc-300 hover:text-brand-orange px-2 py-1.5 cursor-pointer transition-all"
              >
                Contato / Suporte
              </button>
            </div>

            {/* Action portals: Clean text links/tabs - Hidden on mobile, Visible on iPad & Desktop */}
            <div className="hidden md:flex items-center gap-2.5 text-xs font-bold">
              <button
                onClick={() => {
                  handleModeChange('client');
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }, 50);
                }}
                className={`px-3 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
                  workspaceMode === 'client' ? 'bg-brand-orange text-black font-extrabold shadow-md' : 'text-zinc-300 hover:text-brand-orange hover:bg-zinc-900'
                }`}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="5" cy="18" r="3" />
                  <circle cx="19" cy="18" r="3" />
                  <path d="M5 18l4-7h5l5 7M15 7l4 11" />
                  <path d="M9 11l2-4h4" />
                  <path d="M15 7l1-3h3" />
                  <path d="M7 11h4" />
                </svg>
                MyOttomotos
              </button>
              <button
                onClick={() => {
                  handleModeChange('mechanic');
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }, 50);
                }}
                className={`px-3 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
                  workspaceMode === 'mechanic' ? 'bg-brand-orange text-black font-extrabold shadow-md' : 'text-zinc-300 hover:text-brand-orange hover:bg-zinc-900'
                }`}
              >
                <Wrench className="w-3.5 h-3.5" />
                MyOttoVan
              </button>
            </div>

            {/* Menu toggle for mobile/iPad viewports */}
            <div className="flex lg:hidden items-center">
              <button
                onClick={() => setNavMobileOpen(!navMobileOpen)}
                className="p-2 text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-850 rounded-xl transition-all cursor-pointer border border-zinc-800"
                aria-label="Toggle Menu"
              >
                {navMobileOpen ? <X className="w-5 h-5 text-brand-orange" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>

          {/* Collapsible Mobile Menu Drawer with AnimatePresence */}
          <AnimatePresence>
            {navMobileOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="lg:hidden border-t border-zinc-900 bg-zinc-950 px-4 py-5 space-y-4 text-left overflow-hidden"
              >
                {/* Secondary navigation links */}
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase font-black block mb-1 px-3">
                    Navegação do Site
                  </span>
                  <button
                    onClick={() => {
                      setNavMobileOpen(false);
                      handleModeChange('institutional');
                      setTimeout(() => {
                        const target = document.getElementById('como-funciona');
                        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }, 100);
                    }}
                    className="w-full text-left text-zinc-300 hover:text-brand-orange py-2.5 px-3 rounded-xl hover:bg-zinc-900/50 text-xs font-bold transition-all cursor-pointer"
                  >
                    Como Funciona
                  </button>
                  <button
                    onClick={() => {
                      setNavMobileOpen(false);
                      handleModeChange('institutional');
                      setTimeout(() => {
                        const target = document.getElementById('quem-somos');
                        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }, 100);
                    }}
                    className="w-full text-left text-zinc-300 hover:text-brand-orange py-2.5 px-3 rounded-xl hover:bg-zinc-900/50 text-xs font-bold transition-all cursor-pointer"
                  >
                    Quem Somos / Sobre Nós
                  </button>
                  <button
                    onClick={() => {
                      setNavMobileOpen(false);
                      handleModeChange('institutional');
                      setTimeout(() => {
                        const target = document.getElementById('contato-suporte');
                        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }, 100);
                    }}
                    className="w-full text-left text-zinc-300 hover:text-brand-orange py-2.5 px-3 rounded-xl hover:bg-zinc-900/50 text-xs font-bold transition-all cursor-pointer"
                  >
                    Contato / Suporte
                  </button>
                </div>

                {/* Portals selection */}
                <div className="flex flex-col gap-2 pt-3 border-t border-zinc-900">
                  <span className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase font-black block mb-1 px-3">
                    Acessar Portais
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-black uppercase tracking-wider">
                    <button
                      onClick={() => {
                        setNavMobileOpen(false);
                        handleModeChange('client');
                        setTimeout(() => {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }, 50);
                      }}
                      className={`w-full py-3 px-1 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        workspaceMode === 'client' ? 'bg-brand-orange text-black font-extrabold shadow' : 'bg-zinc-900 text-zinc-300 hover:text-brand-orange'
                      }`}
                    >
                      <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="5" cy="18" r="3" />
                        <circle cx="19" cy="18" r="3" />
                        <path d="M5 18l4-7h5l5 7M15 7l4 11" />
                        <path d="M9 11l2-4h4" />
                        <path d="M15 7l1-3h3" />
                        <path d="M7 11h4" />
                      </svg>
                      MyOttomotos
                    </button>
                    <button
                      onClick={() => {
                        setNavMobileOpen(false);
                        handleModeChange('mechanic');
                        setTimeout(() => {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }, 50);
                      }}
                      className={`w-full py-3 px-1 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        workspaceMode === 'mechanic' ? 'bg-brand-orange text-black font-extrabold shadow' : 'bg-zinc-900 text-zinc-300 hover:text-brand-orange'
                      }`}
                    >
                      <Wrench className="w-3.5 h-3.5 shrink-0" />
                      MyOttoVan
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </nav>
        {/* Splitting orange bar right underneath top menu */}
        <div className="h-2 bg-brand-orange w-full shadow-md relative z-30" />
      </div>

      {/* 1. INSTITUTIONAL PAGE VIEW */}
      {workspaceMode === 'institutional' && (
        <motion.div
          key="workspace-institutional"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bg-white text-zinc-900 min-h-screen selection:bg-brand-orange selection:text-black animate-fadeIn"
        >
          {/* HERO INSTITUCIONAL PRINCIPAL (BRANCO) */}
          <section className="bg-white text-zinc-950 py-24 px-4 relative overflow-hidden border-b border-zinc-200">
            {/* Background glowing effects */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[140px] pointer-events-none"></div>
            
            <div className="max-w-6xl mx-auto text-center space-y-7 relative z-10 font-sans">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-100 border border-zinc-200 text-brand-orange text-xs font-semibold rounded-full uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-brand-orange animate-pulse" />
                Mecânica Conveniente sob Demanda
              </span>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08] max-w-4xl mx-auto text-zinc-950">
                Mecânico de moto onde você estiver. <br className="hidden sm:inline" />
                <span className="text-brand-orange">Rápido, transparente e sem surpresas.</span>
              </h1>

              <p className="text-zinc-600 text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-medium">
                Receba atendimento especializado para sua moto ou frota direto na sua localização, com preço fixo e acompanhamento em tempo real.
              </p>

              {/* CTA Único e Proeminente com Alívios */}
              <div className="space-y-4 pt-2 max-w-md mx-auto w-full">
                <button
                  onClick={() => {
                    handleModeChange('client');
                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 50);
                  }}
                  className="w-full bg-brand-orange hover:bg-brand-orange-hover text-black font-black text-base py-4.5 px-8 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-orange/30 hover:scale-[1.02] cursor-pointer uppercase tracking-wider"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="5" cy="18" r="3" />
                    <circle cx="19" cy="18" r="3" />
                    <path d="M5 18l4-7h5l5 7M15 7l4 11" />
                    <path d="M9 11l2-4h4" />
                    <path d="M15 7l1-3h3" />
                    <path d="M7 11h4" />
                  </svg>
                  Solicitar Mecânico Agora
                </button>
                
                {/* Micro-cópia de Alívio */}
                <p className="text-zinc-500 text-xs font-semibold">
                  Preço fixo direto no aplicativo • Atendimento a domicílio
                </p>

                {/* Filtro de Persona Secundária */}
                <p className="text-zinc-500 text-xs pt-2">
                  Quer trabalhar de forma independente?{' '}
                  <button
                    onClick={() => {
                      handleModeChange('mechanic');
                      setTimeout(() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }, 50);
                    }}
                    className="text-brand-orange hover:underline font-bold cursor-pointer transition-all bg-transparent border-none p-0 inline"
                  >
                    Seja um Parceiro (MyOttoVan)
                  </button>
                </p>
              </div>

              {/* Prova Social & Depoimento Real Destacado */}
              <div className="pt-4 max-w-2xl mx-auto space-y-5">
                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 text-left shadow-sm">
                  <div className="flex -space-x-2 shrink-0">
                    <div className="w-10 h-10 rounded-full bg-zinc-200 border-2 border-white flex items-center justify-center font-bold text-xs text-zinc-700">TS</div>
                    <div className="w-10 h-10 rounded-full bg-brand-orange text-black border-2 border-white flex items-center justify-center font-bold text-xs">⭐</div>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-700 italic font-medium leading-relaxed">
                      "Minha moto quebrou a caminho do trabalho. Em minutos o mecânico da OttoMotos chegou com a van e resolveu. Muito prático e o preço foi super justo!"
                    </p>
                    <span className="text-[10px] text-zinc-500 block mt-1 font-bold">
                      Thiago Silva — Honda CG 160 • Há 2 dias • ⭐⭐⭐⭐⭐ Verificado
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-[10px] font-mono text-zinc-500">
                  <span className="flex items-center gap-1">🛡️ Preço fixado no app</span>
                  <span className="hidden sm:inline text-zinc-300">•</span>
                  <span className="flex items-center gap-1">✅ Peças com garantia original</span>
                  <span className="hidden sm:inline text-zinc-300">•</span>
                  <span className="flex items-center gap-1">⭐ 4.9/5 estrelas (12k+ avaliações)</span>
                </div>
              </div>
            </div>
          </section>

          {/* SEÇÃO DILEMA DO PROPRIETÁRIO & DO MECÂNICO (PREMIUM DARK) */}
          <section id="o-dilema" className="py-24 px-4 bg-zinc-950 border-b border-zinc-900">
            <div className="max-w-5xl mx-auto space-y-16">
              
              <div className="text-center space-y-3">
                <span className="text-xs bg-zinc-900 border border-zinc-800 text-brand-orange font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
                  O Dilema e a Oportunidade
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-sans">
                  O Dilema dos Proprietários e dos Mecânicos
                </h2>
                <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto font-sans font-medium">
                  Entenda os desafios do mercado tradicional de duas rodas e por que a OttoMotos foi concebida para redefinir as regras do jogo.
                </p>
              </div>

              {/* Grid 2 Columns: Dilemma Owners vs Dilemma Mechanics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                
                {/* Panel 1: Dilema dos Proprietários */}
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 space-y-6 flex flex-col justify-between shadow-xl">
                  <div className="space-y-4 text-left">
                    <h3 className="text-xl font-black text-white flex items-center gap-2">
                      <span className="w-3 h-3 bg-red-650 rounded-full animate-pulse"></span>
                      Dilema dos Proprietários de Motos
                    </h3>
                    <p className="text-zinc-300 text-xs font-semibold font-sans">
                      A difícil escolha entre o amadorismo perigoso e os valores abusivos das concessionárias convencionais.
                    </p>
                    
                    <div className="space-y-4 pt-2">
                      {/* Oficinas de Bairro */}
                      <div className="space-y-2">
                        <span className="text-xs font-black text-red-500 uppercase tracking-wider block">Oficinas de Bairro Tradicionais</span>
                        <ul className="space-y-2.5 text-xs text-zinc-400 font-sans font-medium">
                          <li className="flex items-start gap-2">
                            <HelpCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            <span><span className="font-bold text-zinc-300">Falta de Capacidade Técnica:</span> Sem manuais oficiais de serviço, gerando falhas operacionais perigosas.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Shield className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            <span><span className="font-bold text-zinc-300">Sem Garantia de Peças:</span> Utilização de insumos duvidosos sem rastreabilidade ou procedência clara.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            <span><span className="font-bold text-zinc-300">Ambientes Desorganizados:</span> Espaços sujos que não inspiram nenhuma segurança técnica.</span>
                          </li>
                        </ul>
                      </div>

                      {/* Concessionárias */}
                      <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                        <span className="text-xs font-black text-red-500 uppercase tracking-wider block">Concessionárias Autorizadas</span>
                        <ul className="space-y-2.5 text-xs text-zinc-400 font-sans font-medium">
                          <li className="flex items-start gap-2">
                            <DollarSign className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            <span><span className="font-bold text-zinc-300">Orçamentos Exorbitantes:</span> Mão de obra super-faturada e custos fixos transferidos ao consumidor.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Settings className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            <span><span className="font-bold text-zinc-300">Substituição Forçada de Peças:</span> Condenação desnecessária de componentes em perfeito estado operacional.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Clock className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            <span><span className="font-bold text-zinc-300">Falta de Praticidade Crítica:</span> Unidades distantes com agendamentos burocráticos e demorados.</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-950/20 border border-red-900/45 rounded-xl p-4 text-center mt-4">
                    <p className="text-xs font-black text-red-400 font-mono">
                      RESULTADO: Insegurança, Desgaste e Custos Absurdos
                    </p>
                  </div>
                </div>

                {/* Panel 2: Dilema dos Mecânicos */}
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 space-y-6 flex flex-col justify-between shadow-xl">
                  <div className="space-y-4 text-left">
                    <h3 className="text-xl font-black text-white flex items-center gap-2">
                      <span className="w-3 h-3 bg-red-650 rounded-full animate-pulse"></span>
                      Dilema dos Mecânicos de Motos
                    </h3>
                    <p className="text-zinc-300 text-xs font-semibold font-sans">
                      A barreira financeira extrema para alcançar a formalização e gerenciar uma oficina estável e lucrativa.
                    </p>
                    
                    <div className="space-y-4 pt-2">
                      {/* Custo Fixo e Operacional */}
                      <div className="space-y-2">
                        <span className="text-xs font-black text-red-500 uppercase tracking-wider block">Custo Fixo Sufocante</span>
                        <ul className="space-y-2.5 text-xs text-zinc-400 font-sans font-medium">
                          <li className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            <span><span className="font-bold text-zinc-300">Alto Custo Imobiliário:</span> Aluguel comercial de galpões, energia trifásica e licenças municipais complexas.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Globe className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            <span><span className="font-bold text-zinc-300">Dependência de Bairro:</span> Limitação ao fluxo local, sem canais de marketing para atração de novos clientes.</span>
                          </li>
                        </ul>
                      </div>

                      {/* Profissionalização e Renda */}
                      <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                        <span className="text-xs font-black text-red-500 uppercase tracking-wider block">Estagnação Profissional</span>
                        <ul className="space-y-2.5 text-xs text-zinc-400 font-sans font-medium">
                          <li className="flex items-start gap-2">
                            <Wrench className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            <span><span className="font-bold text-zinc-300">Falta de oportunidade para desenvolvimento:</span> Efetuar treinamentos regulares em novas ferramentas, equipamentos e tipos de veículos.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <TrendingUp className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            <span><span className="font-bold text-zinc-300">Retenção Abusiva de Margem:</span> Oficinas tradicionais ficam com até 80% do valor do serviço, explorando o mecânico.</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-950/20 border border-red-900/45 rounded-xl p-4 text-center mt-4">
                    <p className="text-xs font-black text-red-400 font-mono">
                      RESULTADO: Profissionais Qualificados Presos ao Subemprego
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* BLOCO: COMO FUNCIONA (A JORNADA DO APP MÓVEL - BRANCO) */}
          <section id="como-funciona" className="py-24 px-4 bg-white text-zinc-950 border-b border-zinc-200">
            <div className="max-w-5xl mx-auto space-y-16">
              <div className="text-center space-y-3">
                <span className="text-xs bg-zinc-100 border border-zinc-200 text-brand-orange font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Passo a Passo
                </span>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight font-sans text-zinc-950">
                  Como Funciona o Aplicativo
                </h2>
                <p className="text-zinc-600 text-sm sm:text-base max-w-2xl mx-auto font-sans">
                  Praticidade total na palma da sua mão. Veja como é simples solicitar atendimento para sua moto ou frota em minutos.
                </p>
              </div>

              {/* Grid Responsivo de 4 Passos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Passo 1 */}
                <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-6 space-y-4 hover:border-brand-orange/30 hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20">
                        <Smartphone className="w-5 h-5 text-brand-orange" />
                      </div>
                      <span className="text-xs font-black font-mono text-zinc-400 bg-zinc-200/50 px-2 py-0.5 rounded-md">PASSO 01</span>
                    </div>
                    <h3 className="font-extrabold text-base text-zinc-900 text-left">Solicite no App</h3>
                    <p className="text-xs text-zinc-600 leading-relaxed text-left">
                      Escolha o serviço como troca de óleo ou pneu e peça o orçamento direto pelo smartphone.
                    </p>
                  </div>
                </div>

                {/* Passo 2 */}
                <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-6 space-y-4 hover:border-brand-orange/30 hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20">
                        <Truck className="w-5 h-5 text-brand-orange" />
                      </div>
                      <span className="text-xs font-black font-mono text-zinc-400 bg-zinc-200/50 px-2 py-0.5 rounded-md">PASSO 02</span>
                    </div>
                    <h3 className="font-extrabold text-base text-zinc-900 text-left">Localize a Van</h3>
                    <p className="text-xs text-zinc-600 leading-relaxed text-left">
                      O sistema inteligente encontra a Loja Volante da OttoMotos mais próxima de você em tempo real.
                    </p>
                  </div>
                </div>

                {/* Passo 3 */}
                <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-6 space-y-4 hover:border-brand-orange/30 hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20">
                        <Calendar className="w-5 h-5 text-brand-orange" />
                      </div>
                      <span className="text-xs font-black font-mono text-zinc-400 bg-zinc-200/50 px-2 py-0.5 rounded-md">PASSO 03</span>
                    </div>
                    <h3 className="font-extrabold text-base text-zinc-900 text-left">Agende a Visita</h3>
                    <p className="text-xs text-zinc-600 leading-relaxed text-left">
                      Escolha o dia, horário e local ideais para o seu atendimento, sem precisar interromper sua rotina.
                    </p>
                  </div>
                </div>

                {/* Passo 4 */}
                <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-6 space-y-4 hover:border-brand-orange/30 hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20">
                        <Award className="w-5 h-5 text-brand-orange" />
                      </div>
                      <span className="text-xs font-black font-mono text-zinc-400 bg-zinc-200/50 px-2 py-0.5 rounded-md">PASSO 04</span>
                    </div>
                    <h3 className="font-extrabold text-base text-zinc-900 text-left">Avalie e Pontue</h3>
                    <p className="text-xs text-zinc-600 leading-relaxed text-left">
                      Pague pelo aplicativo de forma 100% segura, acumule pontos de fidelidade e ganhe descontos exclusivos.
                    </p>
                  </div>
                </div>

              </div>

              {/* Botão de simulação rápida abaixo dos passos para aumentar a conversão */}
              <div className="text-center pt-2">
                <button
                  onClick={() => {
                    handleModeChange('client');
                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 50);
                  }}
                  className="bg-zinc-950 hover:bg-zinc-900 text-white font-black text-sm py-3 px-8 rounded-xl inline-flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer shadow-md"
                >
                  <Smartphone className="w-4 h-4 text-brand-orange" />
                  Experimentar Fluxo do Aplicativo
                </button>
              </div>
            </div>
          </section>

          {/* NOVO BLOCO: CONFIANÇA & PROVA SOCIAL (PREMIUM DARK) */}
          <section id="prova-social" className="py-24 px-4 bg-zinc-950 text-white border-b border-zinc-900">
            <div className="max-w-5xl mx-auto space-y-16">
              
              {/* Headline e Chamada da Infraestrutura das Vans */}
              <div className="text-center space-y-4">
                <span className="text-xs bg-zinc-900 border border-zinc-800 text-brand-orange font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
                  Qualidade Concessionária a Domicílio
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-sans">
                  Tecnologia e Segurança Sob Duas Rodas
                </h2>
                
                {/* Destaque de Infraestrutura das Vans */}
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 max-w-3xl mx-auto mt-2 flex flex-col sm:flex-row items-center gap-4 text-left">
                  <div className="w-12 h-12 rounded-xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center shrink-0">
                    <Shield className="w-6 h-6 text-brand-orange" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-white">Infraestrutura Premium e Peças Originais</h4>
                    <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                      Nossas Lojas Volantes são equipadas com ferramentas de alta precisão e peças originais. Levamos uma oficina de ponta direto para a sua calçada ou empresa, assegurando um serviço impecável com garantia total.
                    </p>
                  </div>
                </div>
              </div>

              {/* Grid de Depoimentos Reais baseados nas Personas do Vídeo */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                
                {/* Depoimento 1: Carol (Segurança & Transparência) */}
                <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 flex flex-col justify-between hover:border-zinc-700/60 transition-all duration-300">
                  <div className="space-y-4 text-left">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-3.5 h-3.5 fill-brand-orange text-brand-orange" />
                      ))}
                    </div>
                    <p className="text-xs text-zinc-350 italic leading-relaxed font-medium">
                      "Eu não entendo nada de mecânica e sempre tinha receio de me empurrarem serviços desnecessários. Na OttoMotos, o checklist digital transparente e o preço fixado no app de antemão me deram total tranquilidade!"
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-6 mt-6 border-t border-zinc-800/80 text-left">
                    <div className="w-10 h-10 rounded-full bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center font-bold text-xs text-brand-orange">
                      C
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-white">Carol Silva</h4>
                      <p className="text-[10px] text-zinc-500 font-mono">Honda CG 160 Fan • São Paulo</p>
                    </div>
                  </div>
                </div>

                {/* Depoimento 2: Carlos (Rapidez & Credibilidade) */}
                <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 flex flex-col justify-between hover:border-zinc-700/60 transition-all duration-300">
                  <div className="space-y-4 text-left">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-3.5 h-3.5 fill-brand-orange text-brand-orange" />
                      ))}
                    </div>
                    <p className="text-xs text-zinc-350 italic leading-relaxed font-medium">
                      "Como motoboy, moto parada significa dia sem faturar. Quando meu cabo de embreagem rompeu, chamei a van da OttoMotos e em minutos o mecânico resolveu o problema com peças de primeira qualidade. Salvei meu dia de entregas!"
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-6 mt-6 border-t border-zinc-800/80 text-left">
                    <div className="w-10 h-10 rounded-full bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center font-bold text-xs text-brand-orange">
                      K
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-white">Carlos Motoboy</h4>
                      <p className="text-[10px] text-zinc-500 font-mono">Yamaha Factor 150 • Campinas</p>
                    </div>
                  </div>
                </div>

                {/* Depoimento 3: Antônio (Gestão PJ & Comodidade) */}
                <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 flex flex-col justify-between hover:border-zinc-700/60 transition-all duration-300">
                  <div className="space-y-4 text-left">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-3.5 h-3.5 fill-brand-orange text-brand-orange" />
                      ))}
                    </div>
                    <p className="text-xs text-zinc-350 italic leading-relaxed font-medium">
                      "Gerenciar a frota da nossa distribuidora era cansativo e caro. Com a OttoMotos, os técnicos atendem nossa frota na própria sede e acompanho todo o histórico e checklist técnico online. Uma verdadeira revolução de comodidade!"
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-6 mt-6 border-t border-zinc-800/80 text-left">
                    <div className="w-10 h-10 rounded-full bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center font-bold text-xs text-brand-orange">
                      A
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-white">Antônio (Frotista PJ)</h4>
                      <p className="text-[10px] text-zinc-500 font-mono">15 Motocicletas Atendidas</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </section>

          {/* PAINEL DE PROPOSTA DE VALOR - LARANJA */}
          <section className="py-24 px-4 bg-brand-orange border-b border-brand-orange-hover/20">
            <div className="max-w-7xl mx-auto space-y-16">
              <div className="text-center space-y-3">
                <span className="text-xs bg-black/10 border border-black/10 text-black font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Por Que Escolher a OttoMotos?
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight font-sans">
                  Nossos Diferenciais e Compromisso Técnico
                </h2>
                <p className="text-black/80 text-sm sm:text-base max-w-2xl mx-auto font-sans font-medium">
                  Unimos tecnologia de ponta, excelência operacional e responsabilidade ambiental para entregar a melhor experiência em manutenção de motos.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 items-stretch">
                
                {/* Credibilidade */}
                <div className="bg-white border border-white/40 p-6 rounded-2xl text-left flex flex-col justify-between shadow-md shadow-black/5 hover:scale-[1.02] transition-all duration-300">
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20">
                      <Shield className="w-5 h-5 text-brand-orange" />
                    </div>
                    <h4 className="font-extrabold text-base text-zinc-950 font-sans">Credibilidade</h4>
                    <ul className="space-y-2.5 text-xs text-zinc-600 leading-relaxed font-sans">
                      <li>
                        <strong className="text-zinc-900 block font-bold">Profissionais Qualificados</strong>
                        Técnicos altamente capacitados com treinamento regular nas mais recentes ferramentas e tipos de veículos.
                      </li>
                      <li>
                        <strong className="text-zinc-900 block font-bold">Serviços Padronizados</strong>
                        Manutenções executadas sob rígidos padrões de excelência técnica e controle de qualidade.
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Transparência */}
                <div className="bg-white border border-white/40 p-6 rounded-2xl text-left flex flex-col justify-between shadow-md shadow-black/5 hover:scale-[1.02] transition-all duration-300">
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20">
                      <Eye className="w-5 h-5 text-brand-orange" />
                    </div>
                    <h4 className="font-extrabold text-base text-zinc-950 font-sans">Transparência</h4>
                    <ul className="space-y-2.5 text-xs text-zinc-600 leading-relaxed font-sans">
                      <li>
                        <strong className="text-zinc-900 block font-bold">Acompanhamento Online</strong>
                        Acompanhe o percurso em tempo real e monitore a execução do serviço ao vivo pelo app.
                      </li>
                      <li>
                        <strong className="text-zinc-900 block font-bold">Catálogo Simplificado</strong>
                        Lista transparente de serviços com preço fixo, sem taxas surpresas ou orçamentos confusos.
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Conveniência */}
                <div className="bg-white border border-white/40 p-6 rounded-2xl text-left flex flex-col justify-between shadow-md shadow-black/5 hover:scale-[1.02] transition-all duration-300">
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20">
                      <Truck className="w-5 h-5 text-brand-orange" />
                    </div>
                    <h4 className="font-extrabold text-base text-zinc-950 font-sans">Conveniência</h4>
                    <ul className="space-y-2.5 text-xs text-zinc-600 leading-relaxed font-sans">
                      <li>
                        <strong className="text-zinc-900 block font-bold">Atendimento no Local</strong>
                        Serviço prático de "leva e traz" ou manutenção rápida feita diretamente onde você estiver.
                      </li>
                      <li>
                        <strong className="text-zinc-900 block font-bold">Reserva de Motocicleta</strong>
                        Garantia de mobilidade contínua com opção de reserva de moto cortesia durante reparos mais complexos.
                      </li>
                      <li>
                        <strong className="text-zinc-900 block font-bold">Garantia Estendida</strong>
                        Segurança e tranquilidade com garantias abrangentes registradas direto na sua carteira digital.
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Inovação */}
                <div className="bg-white border border-white/40 p-6 rounded-2xl text-left flex flex-col justify-between shadow-md shadow-black/5 hover:scale-[1.02] transition-all duration-300">
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20">
                      <Smartphone className="w-5 h-5 text-brand-orange" />
                    </div>
                    <h4 className="font-extrabold text-base text-zinc-950 font-sans">Inovação</h4>
                    <ul className="space-y-2.5 text-xs text-zinc-600 leading-relaxed font-sans">
                      <li>
                        <strong className="text-zinc-900 block font-bold">Pagamento Digital</strong>
                        Transações seguras, criptografadas e imediatas via Pix ou cartões diretamente pelo smartphone.
                      </li>
                      <li>
                        <strong className="text-zinc-900 block font-bold">Monitoramento Remoto</strong>
                        Sensores eletrônicos e câmeras de segurança integradas registrando 100% da manutenção.
                      </li>
                      <li>
                        <strong className="text-zinc-900 block font-bold">Autoatendimento</strong>
                        Interface intuitiva e autônoma de agendamento e personalização de serviços a qualquer hora.
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Sustentabilidade */}
                <div className="bg-white border border-white/40 p-6 rounded-2xl text-left flex flex-col justify-between shadow-md shadow-black/5 hover:scale-[1.02] transition-all duration-300">
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center border border-brand-orange/20">
                      <Leaf className="w-5 h-5 text-brand-orange" />
                    </div>
                    <h4 className="font-extrabold text-base text-zinc-950 font-sans">Sustentabilidade</h4>
                    <ul className="space-y-2.5 text-xs text-zinc-600 leading-relaxed font-sans">
                      <li>
                        <strong className="text-zinc-900 block font-bold">Descarte Ecológico</strong>
                        Logística reversa e descarte certificado de óleo lubrificante e resíduos metálicos nocivos.
                      </li>
                      <li>
                        <strong className="text-zinc-900 block font-bold">Baixa Emissão de Carbono</strong>
                        Planejamento inteligente de rotas diminuindo quilometragem rodada e emissões de poluentes na cidade.
                      </li>
                    </ul>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* MARQUEE DE CONFIANÇA (LOGOS - BRANCO) */}
          <section className="py-12 bg-white border-b border-zinc-200 overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-black block mb-6 font-mono">
                Marcas e Parceiros Homologados
              </span>
              
              <div className="relative w-full overflow-hidden py-4 flex items-center">
                {/* Lateral smooth fade gradients */}
                <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

                <motion.div
                  className="flex gap-5 whitespace-nowrap w-max"
                  animate={{ x: [0, "-50%"] }}
                  transition={{
                    ease: "linear",
                    duration: 30,
                    repeat: Infinity,
                  }}
                >
                  {[
                    { name: 'Bosch', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/16/Bosch-logo.svg' },
                    { name: 'Castrol', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Castrol_Logo.svg' },
                    { name: 'Cofap', logo: 'https://logodownload.org/wp-content/uploads/2018/09/cofap-logo.png' },
                    { name: 'D.I.D', logo: 'https://cdnlogo.com/logos/d/16/did-racing-chain.svg' },
                    { name: 'Fram', logo: 'https://cdnlogo.com/logos/f/31/fram.svg' },
                    { name: 'Michelin', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Michelin_Logo.svg' },
                    { name: 'NGK', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/NGK_Spark_Plugs_logo.svg' },
                    { name: 'Nissin', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Nissin_Group_logo.svg' },
                    { name: 'Pirelli', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Pirelli-Logo.svg' },
                    { name: 'Tecfil', logo: 'https://logodownload.org/wp-content/uploads/2021/04/tecfil-logo.png' },
                    { name: 'TRW Varga', logo: 'https://logodownload.org/wp-content/uploads/2020/09/trw-logo.png' },
                    { name: 'Mobil', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Mobil_Logo.svg' }
                  ].concat([
                    { name: 'Bosch', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/16/Bosch-logo.svg' },
                    { name: 'Castrol', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Castrol_Logo.svg' },
                    { name: 'Cofap', logo: 'https://logodownload.org/wp-content/uploads/2018/09/cofap-logo.png' },
                    { name: 'D.I.D', logo: 'https://cdnlogo.com/logos/d/16/did-racing-chain.svg' },
                    { name: 'Fram', logo: 'https://cdnlogo.com/logos/f/31/fram.svg' },
                    { name: 'Michelin', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Michelin_Logo.svg' },
                    { name: 'NGK', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/NGK_Spark_Plugs_logo.svg' },
                    { name: 'Nissin', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Nissin_Group_logo.svg' },
                    { name: 'Pirelli', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Pirelli-Logo.svg' },
                    { name: 'Tecfil', logo: 'https://logodownload.org/wp-content/uploads/2021/04/tecfil-logo.png' },
                    { name: 'TRW Varga', logo: 'https://logodownload.org/wp-content/uploads/2020/09/trw-logo.png' },
                    { name: 'Mobil', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Mobil_Logo.svg' }
                  ]).map((brand, idx) => (
                    <div
                      key={`${brand.name}-${idx}`}
                      className="bg-zinc-50 px-5 py-3 rounded-2xl shadow-xs border border-zinc-200/80 hover:border-zinc-300 hover:bg-white transition-all hover:scale-[1.03] flex items-center justify-center h-14 w-32 md:h-16 md:w-36 shrink-0 select-none"
                    >
                      <BrandLogo name={brand.name} logoUrl={brand.logo} />
                    </div>
                  ))}
                </motion.div>
              </div>

            </div>
          </section>

          {/* QUEM SOMOS / SOBRE NÓS E TIME OPERACIONAL (BRANCO) */}
          <section id="quem-somos" className="py-24 px-4 bg-white border-b border-zinc-200 text-zinc-950">
            <div className="max-w-5xl mx-auto space-y-16 text-left font-sans">
              
              <div className="text-center space-y-3">
                <span className="text-xs bg-zinc-100 border border-zinc-200 text-brand-orange font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Quem Somos
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight font-sans">
                  Nossa Trajetoria e o que nos move
                </h2>
                <p className="text-zinc-600 text-sm sm:text-base max-w-2xl mx-auto text-center font-sans">
                  Construindo confiança técnica, transparência operacional e relevância social de forma estruturada.
                </p>
              </div>

              {/* Grid: Story + Founders */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                
                {/* História & Mentores */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-zinc-950 font-sans">Nossa Motivação (A Dor)</h3>
                    <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
                      A OttoMotos nasceu da indignação com a total ausência de transparência na manutenção mecânica de motos. O dilema de se submeter a preços exorbitantes e peças empurradas sem real necessidade em concessionárias, ou lidar com a falta de qualificação técnica e ferramental inadequado de pequenas oficinas, inspirou nossa visão de transformar o ecossistema urbano de duas rodas.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-zinc-950 font-sans">Nossa Missão</h3>
                    <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
                      Nossa missão é conectar motociclistas a profissionais qualificados através da tecnologia. Entregamos serviços de forma conveniente, transparente e diferenciada direto na localização do cliente, enquanto empoderamos mecânicos com a infraestrutura para gerenciarem seus próprios negócios de forma independente.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-zinc-950 font-sans">Nossa Visão</h3>
                    <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
                      Ser a maior e mais confiável rede de mecânica conveniente e sob demanda da América Latina, unindo tecnologia de ponta, capacitação profissional e impacto social para transformar a jornada urbana sobre duas rodas.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-zinc-950 font-sans">Nossos Valores</h3>
                    <ul className="text-zinc-600 text-xs sm:text-sm leading-relaxed space-y-2 list-disc pl-4">
                      <li><strong className="text-brand-orange font-bold">Compromisso:</strong> Entrega de serviços mecânicos com máxima excelência, integridade e transparência de ponta a ponta.</li>
                      <li><strong className="text-brand-orange font-bold">Inclusão:</strong> Fomento social que empodera e capacita mecânicos parceiros, dando suporte para sua independência financeira.</li>
                      <li><strong className="text-brand-orange font-bold">Inovação:</strong> Soluções inteligentes guiadas por inteligência digital e tecnologia móvel para simplificar o cotidiano dos pilotos.</li>
                      <li><strong className="text-brand-orange font-bold">Sustentabilidade:</strong> Otimização contínua de rotas e fomento de práticas ecológicas voltadas para um futuro de mobilidade limpa.</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-8 space-y-6">
                   <h3 className="text-lg font-bold text-zinc-950 font-sans flex items-center gap-2">
                     <span className="w-2.5 h-2.5 bg-brand-orange rounded-full"></span>
                     Time de Fundadores
                   </h3>
  
                   <div className="space-y-6">
                     {/* Raifran */}
                     <div className="flex gap-4 items-start">
                       <div className="relative w-16 h-16 shrink-0 shadow">
                         <img 
                           src="/raifran.png" 
                           alt="Raifran Oliveira" 
                           className="relative z-10 w-16 h-16 rounded-full object-cover border-2 border-brand-orange"
                           onError={(e) => {
                             e.currentTarget.style.display = 'none';
                           }}
                         />
                         <div className="absolute inset-0 w-16 h-16 rounded-full bg-brand-orange text-black font-black flex items-center justify-center font-sans text-lg border border-brand-orange/20 shadow-sm">
                           RO
                         </div>
                       </div>
                       <div className="space-y-1">
                         <h4 className="font-extrabold text-sm text-zinc-950">Raifran Oliveira</h4>
                         <p className="text-[10px] text-brand-orange font-bold uppercase tracking-wide">Sócio Investidor</p>
                         <p className="text-xs text-zinc-600 leading-relaxed font-sans">
                           +30 anos de experiência na área de TI. Bacharel em Ciências da Computação pela UNICSUL, com especializações em Gestão de Projetos pela FGV/RJ, Gestão de Negócios e Finanças Internacionais pela FIA-USP e Inteligência Artificial pela Universidade de Stanford/USA, com vivência internacional em indústrias Financeira, de Seguros, Varejo, Distribuição e Automobilística. Apaixonado por Big Trails, conhece bem os desafios diários dos usuários de duas rodas.
                         </p>
                       </div>
                     </div>
  
                     {/* Alexandre */}
                     <div className="flex gap-4 items-start pt-6 border-t border-zinc-200">
                       <div className="relative w-16 h-16 shrink-0 shadow">
                         <img 
                           src="/alexandre.png" 
                           alt="Alexandre Marcolino" 
                           className="relative z-10 w-16 h-16 rounded-full object-cover border-2 border-zinc-300"
                           onError={(e) => {
                             e.currentTarget.style.display = 'none';
                           }}
                         />
                         <div className="absolute inset-0 w-16 h-16 rounded-full bg-zinc-100 text-zinc-700 font-black flex items-center justify-center font-sans text-lg border border-zinc-200 shadow-sm">
                           AM
                         </div>
                       </div>
                       <div className="space-y-1">
                         <h4 className="font-extrabold text-sm text-zinc-950">Alexandre Marcolino</h4>
                         <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wide">Sócio Operador</p>
                         <p className="text-xs text-zinc-600 leading-relaxed font-sans">
                           +25 anos na área de Logística, Transporte e Tráfego, tendo atuado em empresas de Transporte Escolar, Executivo, Socorro Mecânico, Operadoras de Vias (CCR) e na CET. Possui especialização em Cargas Perigosas, Manuseio de Maquinários, Direção Defensiva e Segurança de Trânsito. Apaixonado por Choppers, possui profundo conhecimento prãtico das necessidades dos motociclistas urbanos.
                         </p>
                       </div>
                     </div>
                   </div>
                 </div>
  
                </div>
  
              </div>
            </section>

          {/* CONTATO / SUPORTE - LARANJA */}
          <section id="contato-suporte" className="py-20 px-4 bg-brand-orange border-b border-brand-orange-hover/20 text-black">
            <div className="max-w-5xl mx-auto space-y-12 font-sans text-left">
              <div className="text-center space-y-3">
                <span className="text-xs bg-black/10 border border-black/10 text-black font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Contato e Suporte
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight font-sans">
                  Fale Conosco
                </h2>
                <p className="text-black/80 text-sm sm:text-base max-w-2xl mx-auto text-center font-sans font-medium">
                  Dúvidas, sugestões, parcerias ou suporte operacional? Nossa equipe está pronta para atender você.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
                {/* Form */}
                <div className="md:col-span-7 bg-black/10 border border-black/10 p-6 sm:p-8 rounded-3xl space-y-4">
                  <h3 className="text-lg font-bold text-black font-sans">Envie uma mensagem</h3>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    logEvent('Google Analytics', 'gtag("event", "contact_submit")', {});
                    alert('Sua mensagem foi enviada com sucesso! Responderemos em menos de 24 horas.');
                    e.currentTarget.reset();
                  }} className="space-y-4 text-xs font-semibold text-black/80 font-sans">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-black/80 font-bold">Seu Nome</label>
                        <input type="text" required placeholder="Ex: Lucas Mendes" className="w-full border border-black/10 rounded-xl px-3.5 py-2.5 bg-white text-zinc-950 placeholder-zinc-400 focus:outline-none focus:border-black" />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-black/80 font-bold">Seu E-mail</label>
                        <input type="email" required placeholder="Ex: lucas@gmail.com" className="w-full border border-black/10 rounded-xl px-3.5 py-2.5 bg-white text-zinc-950 placeholder-zinc-400 focus:outline-none focus:border-black" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-black/80 font-bold">Assunto</label>
                      <select required className="w-full border border-black/10 rounded-xl px-3.5 py-2.5 bg-white text-zinc-950 focus:outline-none focus:border-black font-sans">
                        <option value="suporte" className="bg-white text-zinc-950">Suporte Técnico / Dúvidas sobre Serviço</option>
                        <option value="parceria" className="bg-white text-zinc-950">Quero ser um Mecânico Parceiro</option>
                        <option value="b2b" className="bg-white text-zinc-950">Parceria Frotista / Corporativo</option>
                        <option value="outros" className="bg-white text-zinc-950">Outros Assuntos</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-black/80 font-bold">Sua Mensagem</label>
                      <textarea required rows={4} placeholder="Digite os detalhes da sua mensagem..." className="w-full border border-black/10 rounded-xl px-3.5 py-2.5 bg-white text-zinc-950 placeholder-zinc-400 focus:outline-none focus:border-black resize-none"></textarea>
                    </div>
                    <button type="submit" className="w-full bg-zinc-950 hover:bg-zinc-900 text-white font-extrabold py-3.5 px-4 rounded-xl text-center shadow-md transition-transform hover:scale-[1.01] cursor-pointer">
                      Enviar Mensagem por E-mail
                    </button>
                  </form>
                </div>

                {/* Info */}
                <div className="md:col-span-5 bg-black/10 border border-black/10 text-black rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-black font-sans">Canais de Atendimento</h3>
                    <div className="space-y-4 text-xs font-mono">
                      <div className="space-y-1">
                        <span className="text-black/50 block font-bold">E-mail Corporativo</span>
                        <a href="mailto:contato@ottomotos.com" className="text-zinc-950 hover:underline font-extrabold text-sm block">contato@ottomotos.com</a>
                        <a href="mailto:suporte@ottomotos.com" className="text-zinc-950 hover:underline font-extrabold text-sm block">suporte@ottomotos.com</a>
                      </div>

                      <div className="space-y-1">
                        <span className="text-black/50 block font-bold">Sede e Hub Operacional</span>
                        <p className="text-black/85 leading-relaxed text-[11px] font-sans font-medium">
                          Campinas Tech Hub<br />
                          Rua Bento de Arruda Camargo, 120 - Mansões Santo Antônio, Campinas/SP • CEP 13088-040
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-black/50 block font-bold">Horário de Operação</span>
                        <p className="text-black/85 text-[11px] font-sans font-medium">Segunda a Sábado: 07:00 às 20:00<br />Plantões Emergenciais aos Domingos</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-black/10 space-y-3 font-sans">
                    <span className="text-xs text-black/50 font-bold block uppercase tracking-wider">Redes Sociais</span>
                    <div className="flex flex-wrap gap-4">
                      <span className="text-[11px] text-zinc-900 cursor-pointer hover:text-black font-bold font-mono">📸 Instagram</span>
                      <span className="text-[11px] text-zinc-900 cursor-pointer hover:text-black font-bold font-mono">💼 LinkedIn</span>
                      <span className="text-[11px] text-zinc-900 cursor-pointer hover:text-black font-bold font-mono">🎥 YouTube</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>


        </motion.div>
      )}

      {/* RENDER DYNAMIC WORKSPACE BASED ON USER'S DIRECT SELECTION (iFood vs Uber Vibe) */}
      <div className="transition-all duration-300">
        
        {/* =========================================
            🧑‍✈️ AREA DO CLIENTE: INTERFACE ESTILO IFOOD 
            ========================================= */}
        {workspaceMode === 'client' && (
          <CustomerPortal
            cart={cart}
            setCart={setCart}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            clearCart={clearCart}
            getTotal={getTotal}
            getSubtotal={getSubtotal}
            displacementTax={displacementTax}
            checkoutName={checkoutName}
            setCheckoutName={setCheckoutName}
            checkoutPhone={checkoutPhone}
            setCheckoutPhone={setCheckoutPhone}
            checkoutMoto={checkoutMoto}
            setCheckoutMoto={setCheckoutMoto}
            checkoutAddress={checkoutAddress}
            setCheckoutAddress={setCheckoutAddress}
            activeTracking={activeTracking}
            setActiveTracking={setActiveTracking}
            routeDistance={routeDistance}
            setRouteDistance={setRouteDistance}
            routeDuration={routeDuration}
            setRouteDuration={setRouteDuration}
            showLiveCamera={showLiveCamera}
            setShowLiveCamera={setShowLiveCamera}
            logEvent={logEvent}
            adminRadius={adminRadius}
            setAdminRadius={setAdminRadius}
          />
        )}

        {/* =========================================
            👑 PAINEL DO ADMINISTRADOR (ADMIN PORTAL)
            ========================================= */}
        {workspaceMode === 'admin' && (
          <AdminPortal />
        )}

        {/* =========================================
            🔧 AREA DO MECÂNICO: INTERFACE ESTILO UBER 
            ========================================= */}
        {workspaceMode === 'mechanic' && (
          mechanicUser === null ? (
            <MechanicAuthPortal
              onLoginSuccess={(user) => {
                setMechanicUser(user);
                localStorage.setItem('otto_active_mechanic_user', JSON.stringify(user));
                setMechanicViewMode('portal');
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 50);
              }}
              onBackToLanding={() => handleModeChange('institutional')}
            />
          ) : mechanicViewMode === 'portal' ? (
            <MechanicPortal
              mechanicUser={mechanicUser}
              onBackToLanding={() => {
                setMechanicUser(null);
                localStorage.removeItem('otto_active_mechanic_user');
                handleModeChange('institutional');
              }}
            />
          ) : (
            <motion.div
              key="workspace-mechanic"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-zinc-950 text-white pb-20"
            >
              {/* Top Banner to switch to functional tablet */}
              <div className="bg-brand-orange text-black font-sans font-black text-xs py-3.5 px-4 text-center uppercase tracking-wider flex justify-between items-center max-w-7xl mx-auto rounded-b-2xl shadow-md border-b border-brand-orange-hover/25">
                <span>🛠️ Simulador de Operações Ativo</span>
                <button
                  onClick={() => setMechanicViewMode('portal')}
                  className="bg-black hover:bg-zinc-900 text-white px-4 py-1.5 rounded-lg text-2xs uppercase tracking-widest font-black transition-all flex items-center gap-1"
                >
                  Acessar Painel do Mecânico (Tablet da Van) →
                </button>
              </div>
            {/* HEADLINE / INDEPENDENCIA SLOGAN */}
            <div id="independencia-vibe" className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 border-b border-zinc-900 text-left">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                
                {/* Visual tech layout representing interior of OttoVan */}
                <div id="estrutura-van" className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Wrench className="w-64 h-64 text-brand-orange" />
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-zinc-850">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-brand-orange rounded-full animate-ping"></span>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-300">
                        ESTRUTURA TECNOLÓGICA DA OTTOVAN #02
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono bg-zinc-950 px-2 py-0.5 rounded text-zinc-500">Campinas SP</span>
                  </div>

                  {/* Diagram Points */}
                  <div className="space-y-4">
                    <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-850 text-xs flex gap-3 items-start">
                      <div className="w-6 h-6 rounded bg-brand-orange-light text-brand-orange flex items-center justify-center font-bold font-mono text-[11px] shrink-0">1</div>
                      <div className="space-y-0.5">
                        <h5 className="font-extrabold text-white">Bancada de Serviços de Alta Densidade</h5>
                        <p className="text-[11px] text-zinc-400">Equipada com compressor pneumático de alta performance, morsas técnicas e gavetas inteligentes.</p>
                      </div>
                    </div>

                    <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-850 text-xs flex gap-3 items-start">
                      <div className="w-6 h-6 rounded bg-brand-orange-light text-brand-orange flex items-center justify-center font-bold font-mono text-[11px] shrink-0">2</div>
                      <div className="space-y-0.5">
                        <h5 className="font-extrabold text-white">Câmera HD de Monitoramento de Bancada</h5>
                        <p className="text-[11px] text-zinc-400">Transmite automaticamente o vídeo do diagnóstico e troca de peças em alta definição direto para a tela do aplicativo do cliente Carol.</p>
                      </div>
                    </div>

                    <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-850 text-xs flex gap-3 items-start">
                      <div className="w-6 h-6 rounded bg-brand-orange-light text-brand-orange flex items-center justify-center font-bold font-mono text-[11px] shrink-0">3</div>
                      <div className="space-y-0.5">
                        <h5 className="font-extrabold text-white">Estoque Consignado Inteligente</h5>
                        <p className="text-[11px] text-zinc-400">Peças sobressalentes organizadas com leitor de RFID para controle autônomo. O software alerta automaticamente se o estoque estiver baixo.</p>
                      </div>
                    </div>

                    <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-850 text-xs flex gap-3 items-start">
                      <div className="w-6 h-6 rounded bg-brand-orange-light text-brand-orange flex items-center justify-center font-bold font-mono text-[11px] shrink-0">4</div>
                      <div className="space-y-0.5">
                        <h5 className="font-extrabold text-white">Tablet de Navegação e Auditoria de Avaria</h5>
                        <p className="text-[11px] text-zinc-400">Exibe rotas inteligentes com cálculo de tráfego em tempo real, checklists digitais com IA do Gemini, e ordens de serviço pendentes.</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] text-zinc-500 font-mono text-center pt-2 border-t border-zinc-850">
                    🚐 Dimensões de Carga Útil Adaptadas para Motos de 50cc a 300cc
                  </div>
                </div>

                {/* Slogan and details copy */}
                <div className="space-y-6">
                  <span className="text-xs bg-brand-orange-light text-brand-orange font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-brand-orange/20 inline-block">
                    Modelo de Franquia Móvel
                  </span>
                  
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.1] font-sans">
                    Seja seu próprio chefe. Dirija a <span className="text-brand-orange">OttoVan.</span>
                  </h3>
                  
                  <p className="text-zinc-300 text-sm md:text-base leading-relaxed">
                    A OttoMotos transforma mecânicos talentosos em proprietários de microfranquias lucrativas. Sem as amarras e os altos custos fixos de uma oficina física tradicional (aluguel de ponto comercial, contas de água/luz exorbitantes, barreira geográfica), você opera uma van moderna pré-equipada e atende clientes qualificados da sua região.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                      <h5 className="font-black text-brand-orange text-xs uppercase tracking-wider mb-1">Custo de Ponto Zero</h5>
                      <p className="text-xs text-zinc-400 leading-normal">Livre-se de aluguéis comerciais pesados. A van é a sua oficina autônoma sobre rodas.</p>
                    </div>
                    
                    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                      <h5 className="font-black text-brand-orange text-xs uppercase tracking-wider mb-1">Rotas Inteligentes</h5>
                      <p className="text-xs text-zinc-400 leading-normal">O aplicativo calcula o trajeto mais rápido para deslocamento otimizado, minimizando custos de combustível.</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        const target = document.getElementById('calculadora-ganhos');
                        if (target) target.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-750 text-white font-bold text-xs py-3.5 px-6 rounded-xl flex items-center gap-1"
                    >
                      Calcular Ganhos Estimados <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* INTERACTIVE EARNINGS CALCULATOR */}
            <div id="calculadora-ganhos" className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Sliders and controls (Left 7 cols) */}
                <div className="lg:col-span-7 space-y-6 text-left">
                  <span className="text-xs bg-brand-orange-light text-brand-orange font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-brand-orange/20 inline-block">
                    Simulador Financeiro
                  </span>
                  
                  <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                    Quanto eu posso faturar operando uma OttoVan?
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    Ajuste os parâmetros de atendimentos diários e dias de trabalho semanais abaixo para simular sua margem bruta bruta média baseada na taxa tabelada de serviço de R$ 75,00 por job.
                  </p>

                  <div className="space-y-6 bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
                    {/* Slider 1: Jobs per day */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-zinc-300">
                        <span>Atendimentos por dia</span>
                        <span className="text-brand-orange font-black text-sm">{servicesPerDay} reparos</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                        value={servicesPerDay}
                        onChange={(e) => {
                          setServicesPerDay(parseInt(e.target.value));
                          logEvent('Google Analytics', 'gtag("event", "adjust_calc_jobs")', { jobs: parseInt(e.target.value) });
                        }}
                        className="w-full accent-brand-orange bg-zinc-950 h-2 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                        <span>1 serviço (tranquilo)</span>
                        <span>10 serviços (alto volume)</span>
                      </div>
                    </div>

                    {/* Slider 2: Days per week */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-zinc-300">
                        <span>Dias trabalhados por semana</span>
                        <span className="text-brand-orange font-black text-sm">{daysPerWeek} dias</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="7"
                        step="1"
                        value={daysPerWeek}
                        onChange={(e) => {
                          setDaysPerWeek(parseInt(e.target.value));
                          logEvent('Google Analytics', 'gtag("event", "adjust_calc_days")', { days: parseInt(e.target.value) });
                        }}
                        className="w-full accent-brand-orange bg-zinc-950 h-2 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                        <span>1 dia</span>
                        <span>7 dias (escala cheia)</span>
                      </div>
                    </div>
                  </div>

                  {/* Descriptive helper explaining why it is so lucrative */}
                  <div className="flex gap-3 bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-4 text-[11px] text-zinc-400">
                    <Info className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      💡 <strong>Fórmula do Sucesso:</strong> Como operadora móvel parceira, você recebe R$ 75,00 líquidos em média por serviço concluído (fora gorjetas diretas de clientes). Fazendo apenas <strong>{servicesPerDay} serviços por dia</strong> e descansando <strong>{7 - daysPerWeek} dias por semana</strong>, seu rendimento supera com folga a renda média de mecânicos que trabalham sob subordinação de oficinas físicas comerciais clt tradicionais!
                    </p>
                  </div>
                </div>

                {/* Earnings result card (Right 5 cols) */}
                <div className="lg:col-span-5 bg-gradient-to-br from-zinc-900 via-zinc-950 to-brand-orange/10 border border-zinc-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
                  <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-orange/10 rounded-full blur-2xl pointer-events-none"></div>
                  
                  <span className="text-[10px] bg-brand-orange-light text-brand-orange font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-brand-orange/20 inline-block">
                    Rendimento Mensal Estimado
                  </span>

                  <div className="space-y-1">
                    <p className="text-[11px] text-zinc-400 uppercase font-black tracking-wider">Faturamento Líquido Estimado</p>
                    <h4 className="text-4xl md:text-5xl font-black text-white tracking-tight font-sans drop-shadow animate-pulse">
                      R$ {getEstimatedEarnings().toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h4>
                    <p className="text-[10px] text-emerald-400 font-mono">✓ Livre de Aluguel de Ponto Comercial</p>
                  </div>

                  <div className="bg-zinc-950/60 p-4 rounded-2xl border border-zinc-850 text-xs text-left space-y-2">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Média de jobs semanais:</span>
                      <strong className="text-zinc-300">{servicesPerDay * daysPerWeek} atendimentos</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Média de jobs mensais:</span>
                      <strong className="text-zinc-300">{Math.round(servicesPerDay * daysPerWeek * 4.34)} atendimentos</strong>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-zinc-850 text-[11px]">
                      <span className="text-zinc-400">Marketing Centralizado:</span>
                      <strong className="text-brand-orange">Gratuito / Incluso</strong>
                    </div>
                  </div>

                  <div className="pt-2">
                    <a
                      href="#formulario-parceiro"
                      className="block w-full bg-brand-orange hover:bg-brand-orange-hover text-black font-extrabold py-4 px-4 rounded-xl text-center text-xs transition-all shadow-lg hover:scale-102 cursor-pointer"
                      onClick={() => {
                        logEvent('Google Analytics', 'gtag("event", "click_calculator_apply")', {});
                      }}
                    >
                      🚀 Começar Minha Inscrição
                    </a>
                  </div>

                  <p className="text-[9px] text-zinc-500 font-mono">
                    *Rendimento baseado na média histórica operacional de Campinas.
                  </p>
                </div>

              </div>
            </div>

            {/* THREE MAIN USPs FOR MECHANICS */}
            <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 border-t border-zinc-900 bg-zinc-900/30">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* USP 1 */}
                <div className="bg-zinc-900/80 border border-zinc-800/80 p-6 rounded-2xl text-left space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-orange-light text-brand-orange flex items-center justify-center border border-brand-orange/15 shrink-0">
                    <TrendingUp className="w-5 h-5 text-brand-orange" />
                  </div>
                  <h4 className="font-extrabold text-sm text-white uppercase tracking-tight">Ganhos Previsíveis</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Receba seus fechamentos líquidos diretamente na sua conta bancária cadastrada todas as quartas-feiras, sem atrasos.
                  </p>
                </div>

                {/* USP 2 */}
                <div className="bg-zinc-900/80 border border-zinc-800/80 p-6 rounded-2xl text-left space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-orange-light text-brand-orange flex items-center justify-center border border-brand-orange/15 shrink-0">
                    <Sliders className="w-5 h-5 text-brand-orange" />
                  </div>
                  <h4 className="font-extrabold text-sm text-white uppercase tracking-tight">Tecnologia de Ponta</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Checklists automáticos integrados via tablet, auditoria eletrônica contra danos pré-existentes e rotas calibradas de despacho.
                  </p>
                </div>

                {/* USP 3 */}
                <div className="bg-zinc-900/80 border border-zinc-800/80 p-6 rounded-2xl text-left space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-orange-light text-brand-orange flex items-center justify-center border border-brand-orange/15 shrink-0">
                    <Globe className="w-5 h-5 text-brand-orange" />
                  </div>
                  <h4 className="font-extrabold text-sm text-white uppercase tracking-tight">Marketing Pago</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Nossa equipe investe ativamente em anúncios locais e redes sociais para garantir que a sua van sempre tenha ordens de serviço.
                  </p>
                </div>

              </div>
            </div>

            {/* MECHANIC SIGNUP FORM */}
            <div id="formulario-parceiro" className="max-w-xl mx-auto px-4 py-16 sm:px-6">
              
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
                
                <div className="text-center max-w-md mx-auto space-y-1">
                  <h4 className="font-black text-xl text-white uppercase tracking-tight font-sans">
                    Ficha de Inscrição de Parceiro
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Preencha os dados básicos abaixo para iniciar o processo de seleção da sua Loja Volante.
                  </p>
                </div>

                {showMechanicSuccess ? (
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl p-5 text-center space-y-3 text-xs"
                  >
                    <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
                    <h5 className="font-extrabold text-sm text-white">Inscrição Enviada com Sucesso!</h5>
                    <p className="leading-relaxed text-zinc-300">
                      Obrigado por se inscrever, <strong>{mechanicName}</strong>! Nossa equipe analisará seu perfil de CNH e experiência de mecânica. Entraremos em contato via Whatsapp em até 24 horas úteis para agendar a sua vistoria técnica de admissão.
                    </p>
                    <button
                      onClick={() => setShowMechanicSuccess(false)}
                      className="text-xs font-bold text-brand-orange hover:text-brand-orange-hover mt-1 block mx-auto underline cursor-pointer"
                    >
                      Inscrever outro parceiro
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleMechanicSubmit} className="space-y-4 text-xs text-left font-medium">
                    
                    {/* Name */}
                    <div className="space-y-1">
                      <label className="text-zinc-400 block">Nome Completo</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: João Pedro"
                        value={mechanicName}
                        onChange={(e) => setMechanicName(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white font-bold focus:bg-zinc-900 focus:outline-none focus:border-brand-orange"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-zinc-400 block">E-mail Comercial</label>
                      <input
                        type="email"
                        required
                        placeholder="Ex: joao.mecanico@gmail.com"
                        value={mechanicEmail}
                        onChange={(e) => setMechanicEmail(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white font-bold focus:bg-zinc-900 focus:outline-none focus:border-brand-orange"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-1">
                      <label className="text-zinc-400 block">Telefone para Contato (WhatsApp)</label>
                      <input
                        type="tel"
                        required
                        placeholder="Ex: (19) 97777-8888"
                        value={mechanicPhone}
                        onChange={(e) => setMechanicPhone(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white font-bold focus:bg-zinc-900 focus:outline-none focus:border-brand-orange"
                      />
                    </div>

                    {/* CNH and Experience */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-zinc-400 block">Categoria da CNH</label>
                        <select
                          value={mechanicCnh}
                          onChange={(e) => setMechanicCnh(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white font-bold focus:bg-zinc-900 focus:outline-none focus:border-brand-orange"
                        >
                          <option value="A">Categoria A (Apenas Moto)</option>
                          <option value="B">Categoria B (Apenas Carro/Van)</option>
                          <option value="AB">Categoria AB (Moto & Carro/Van)</option>
                          <option value="C_D">Categoria C/D (Profissional)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-zinc-400 block">Experiência em Mecânica</label>
                        <select
                          value={mechanicExp}
                          onChange={(e) => setMechanicExp(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-white font-bold focus:bg-zinc-900 focus:outline-none focus:border-brand-orange"
                        >
                          <option value="less_than_1">Menos de 1 ano</option>
                          <option value="1_3_years">1 a 3 anos</option>
                          <option value="3_5_years">3 a 5 anos</option>
                          <option value="more_than_5">Mais de 5 anos</option>
                        </select>
                      </div>
                    </div>

                    <div className="bg-zinc-950/80 border border-zinc-850 p-3 rounded-xl text-[10px] text-zinc-500 leading-normal">
                      🔒 <strong>Política de Admissão:</strong> Para pilotar a OttoVan, exigimos ficha limpa criminal, CNH regularizada e aprovação na vistoria técnica prática. Não há taxa de inscrição para candidatos.
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-brand-orange hover:bg-brand-orange-hover text-black font-extrabold py-4 px-4 rounded-xl text-center text-xs transition-all shadow-lg hover:scale-[1.01] active:scale-99 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" /> Enviar Minha Ficha de Cadastro
                    </button>

                  </form>
                )}

              </div>
            </div>

          </motion.div>
          )
        )}

      </div>



      {/* FOOTER */}
      <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-900 py-12 text-xs font-medium text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <span className="text-white font-extrabold uppercase text-xs tracking-wider block">OttoMotos SaaS</span>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Reparo de motocicletas sob demanda. Uma nova forma de prover serviços, unindo conveniência absoluta para quem pilota e independência real para quem conserta.
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-white font-extrabold uppercase text-xs tracking-wider block">Para Motociclistas</span>
              <ul className="space-y-2 text-[11px]">
                <li><button onClick={() => handleModeChange('client')} className="hover:text-white transition-colors">Cardápio de Serviços</button></li>
                <li><button onClick={() => handleModeChange('client')} className="hover:text-white transition-colors">Inspeção Digital</button></li>
                <li><button onClick={() => handleModeChange('client')} className="hover:text-white transition-colors">Gestão de Frotas B2B</button></li>
              </ul>
            </div>

            <div className="space-y-3">
              <span className="text-white font-extrabold uppercase text-xs tracking-wider block">Para Mecânicos</span>
              <ul className="space-y-2 text-[11px]">
                <li><button onClick={() => handleModeChange('mechanic')} className="hover:text-white transition-colors">Abra sua Franquia</button></li>
                <li><button onClick={() => handleModeChange('mechanic')} className="hover:text-white transition-colors">Calculadora de Ganhos</button></li>
                <li><button onClick={() => handleModeChange('mechanic')} className="hover:text-white transition-colors">Suporte Tecnológico</button></li>
              </ul>
            </div>

            <div className="space-y-3">
              <span className="text-white font-extrabold uppercase text-xs tracking-wider block">Sede Operacional</span>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Campinas Tech Hub • Campinas, SP<br />
                SLA Médio de Despacho &lt; 30 min
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-zinc-600 font-mono">
            <p>© 2026 OttoMotos Tecnologia S.A. Todos os direitos reservados. Montserrat Font Configured.</p>
            <div className="flex gap-4">
              <span>Google Analytics GA4</span>
              <span>Meta Pixel Tracker</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
