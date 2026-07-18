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
  Building2,
  User,
  Calendar,
  History,
  Share2,
  LogOut,
  FolderTree,
  FileCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import RoutingMap from './RoutingMap';

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
    image: '/src/assets/images/troca_oleo_motor_1784374619776.jpg',
    description: 'Substituição completa do óleo com lubrificante premium Mobil para prolongar a vida útil do motor.'
  },
  {
    id: 'srv-2',
    name: 'TROCAR KIT TRANSMISSAO (RELAÇÃO)',
    formaAtendimento: 'Sob Agendamento',
    time: 40,
    category: 'Transmissão & Freios',
    image: '/src/assets/images/kit_transmissao_moto_1784375082487.jpg',
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
  },
  {
    id: 'srv-12',
    name: 'TROCA DE MANETE',
    formaAtendimento: 'Pronto Atendimento',
    time: 15,
    category: 'Mecânica Rápida',
    image: 'https://images.unsplash.com/photo-1558981285-6f0c94958bb6?auto=format&fit=crop&q=80&w=400',
    description: 'Instalação de manete de freio ou embreagem esportivo ou original em alumínio.'
  },
  {
    id: 'srv-13',
    name: 'TROCA CAMARA PNEU DIANTEIRO/TRASEIRO',
    formaAtendimento: 'Pronto Atendimento',
    time: 30,
    category: 'Mecânica Rápida',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=400',
    description: 'Substituição completa da câmara de ar avariada por uma nova reforçada Metzeler.'
  },
  {
    id: 'srv-14',
    name: 'TROCA PNEU SEM DIANTEIRO/TRASEIRO',
    formaAtendimento: 'Pronto Atendimento',
    time: 30,
    category: 'Mecânica Rápida',
    image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&q=80&w=400',
    description: 'Troca completa de pneu convencional ou esportivo sem câmara de ar (tubeless).'
  },
  {
    id: 'srv-15',
    name: 'TROCA DE FUSIVEL',
    formaAtendimento: 'Pronto Atendimento',
    time: 10,
    category: 'Mecânica Rápida',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=400',
    description: 'Avaliação do sistema elétrico e troca de fusível principal ou secundário queimado.'
  },
  {
    id: 'srv-16',
    name: 'TROCAR TENSOR DA CORRENTE DE COMANDO',
    formaAtendimento: 'Pronto Atendimento',
    time: 25,
    category: 'Mecânica Rápida',
    image: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=400',
    description: 'Substituição do acionador/tensor mecânico ou hidráulico da corrente de comando.'
  },
  {
    id: 'srv-17',
    name: 'TROCA DO CABO DE ACELERADOR',
    formaAtendimento: 'Pronto Atendimento',
    time: 20,
    category: 'Mecânica Rápida',
    image: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=400',
    description: 'Substituição dos cabos de acelerador A e B por cabos novos lubrificados.'
  },
  {
    id: 'srv-18',
    name: 'TROCA DO CABO DE EMBREAGEM',
    formaAtendimento: 'Pronto Atendimento',
    time: 15,
    category: 'Mecânica Rápida',
    image: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&q=80&w=400',
    description: 'Substituição do cabo de embreagem por novo modelo com ajuste ideal de folga.'
  },
  {
    id: 'srv-19',
    name: 'TROCAR CABO DE FREIO (FREIO TAMBOR DIANTEIRO)',
    formaAtendimento: 'Pronto Atendimento',
    time: 15,
    category: 'Transmissão & Freios',
    image: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&q=80&w=400',
    description: 'Substituição do cabo de freio dianteiro em motos com sistema a tambor de alta resistência.'
  },
  {
    id: 'srv-20',
    name: 'TROCAR CABO VELOCIMETRO',
    formaAtendimento: 'Pronto Atendimento',
    time: 15,
    category: 'Mecânica Rápida',
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=400',
    description: 'Substituição do cabo de velocímetro para manter a marcação correta de velocidade.'
  },
  {
    id: 'srv-21',
    name: 'TROCA DE CABO DE VELA E CACHIMBO',
    formaAtendimento: 'Pronto Atendimento',
    time: 15,
    category: 'Mecânica Rápida',
    image: 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&q=80&w=400',
    description: 'Instalação de novo terminal supressor de ruídos (cachimbo) e cabo de alta tensão.'
  },
  {
    id: 'srv-22',
    name: 'TROCAR ROLAMENTO RODA DIANTEIRA/TRASEIRA',
    formaAtendimento: 'Pronto Atendimento',
    time: 30,
    category: 'Transmissão & Freios',
    image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=400',
    description: 'Substituição técnica de rolamento de cubo de roda de moto com alinhamento.'
  },
  {
    id: 'srv-23',
    name: 'LUBRIFICAR E E AJUSTAR CORRENTE',
    formaAtendimento: 'Pronto Atendimento',
    time: 10,
    category: 'Mais Pedidos',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=400',
    description: 'Ajuste fino de tensão da corrente de transmissão secundária com lubrificação técnica Motul.'
  },
  {
    id: 'srv-24',
    name: 'TROCAR BATERIA',
    formaAtendimento: 'Pronto Atendimento',
    time: 15,
    category: 'Mais Pedidos',
    image: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=400',
    description: 'Substituição completa de bateria de moto com teste de carga do estator/regulador.'
  },
  {
    id: 'srv-25',
    name: 'TROCAR RELE SETA',
    formaAtendimento: 'Pronto Atendimento',
    time: 10,
    category: 'Mecânica Rápida',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=400',
    description: 'Substituição de relé eletrônico de piscas auxiliares (setas) danificado.'
  },
  {
    id: 'srv-26',
    name: 'TROCA DE FILTRO DE COMBUSTIVEL E MANGUEIRAS',
    formaAtendimento: 'Pronto Atendimento',
    time: 15,
    category: 'Mecânica Rápida',
    image: 'https://images.unsplash.com/photo-1538333581680-9561853a4837?auto=format&fit=crop&q=80&w=400',
    description: 'Substituição de filtro de linha de combustível e mangueiras ressecadas de alimentação.'
  },
  {
    id: 'srv-27',
    name: 'TROCAR RELE PARTIDA',
    formaAtendimento: 'Pronto Atendimento',
    time: 15,
    category: 'Mecânica Rápida',
    image: 'https://images.unsplash.com/photo-1518135839073-4e71539c5704?auto=format&fit=crop&q=80&w=400',
    description: 'Instalação de novo relé de partida elétrica para acionamento correto do motor de arranque.'
  },
  {
    id: 'srv-28',
    name: 'TROCAR FLUÍDO DE FREIO',
    formaAtendimento: 'Pronto Atendimento',
    time: 20,
    category: 'Transmissão & Freios',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=400',
    description: 'Sangria completa e substituição de fluído de freio hidraulico por especificação DOT-4 ou DOT-5.1 Varga.'
  },
  {
    id: 'srv-29',
    name: 'TROCAR FLEXIVEL DE FREIO',
    formaAtendimento: 'Sob Agendamento',
    time: 30,
    category: 'Transmissão & Freios',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=400',
    description: 'Substituição do flexível de freio de borracha convencional por novo flexível.'
  },
  {
    id: 'srv-30',
    name: 'TROCAR REGULADOR',
    formaAtendimento: 'Sob Agendamento',
    time: 30,
    category: 'Mecânica Rápida',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=400',
    description: 'Substituição de retificador/regulador de voltagem do sistema elétrico.'
  },
  {
    id: 'srv-31',
    name: 'TROCAR AMORTECEDOR TRASEIRO',
    formaAtendimento: 'Sob Agendamento',
    time: 45,
    category: 'Transmissão & Freios',
    image: 'https://images.unsplash.com/photo-1615887023516-9b6bcd559e87?auto=format&fit=crop&q=80&w=400',
    description: 'Troca completa de amortecedor(es) traseiro(s) monochoque ou bichoque Cofap.'
  },
  {
    id: 'srv-32',
    name: 'REAPERTO GERAL MECÂNICO (REVISAO)',
    formaAtendimento: 'Sob Agendamento',
    time: 60,
    category: 'Mais Pedidos',
    image: 'https://images.unsplash.com/photo-1500628550463-c8881a54d4d4?auto=format&fit=crop&q=80&w=400',
    description: 'Reaperto geral com torquímetro de parafusos de chassi, motor, suspensão e suportes.'
  },
  {
    id: 'srv-33',
    name: 'REAPERTO DOS CONECTORES (ELETRICOS)',
    formaAtendimento: 'Sob Agendamento',
    time: 30,
    category: 'Mecânica Rápida',
    image: 'https://images.unsplash.com/photo-1518135839073-4e71539c5704?auto=format&fit=crop&q=80&w=400',
    description: 'Limpeza de oxidação com limpa-contato de conectores principais e reaperto técnico.'
  }
];

interface Motorcycle {
  id: string;
  model: string;
  plate: string;
  year: string;
  color: string;
}

interface CustomerPortalProps {
  cart: Array<{ service: Service; quantity: number }>;
  setCart: React.Dispatch<React.SetStateAction<Array<{ service: Service; quantity: number }>>>;
  addToCart: (service: Service) => void;
  removeFromCart: (serviceId: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getSubtotal: () => number;
  displacementTax: number;
  checkoutName: string;
  setCheckoutName: (val: string) => void;
  checkoutPhone: string;
  setCheckoutPhone: (val: string) => void;
  checkoutMoto: string;
  setCheckoutMoto: (val: string) => void;
  checkoutAddress: string;
  setCheckoutAddress: (val: string) => void;
  activeTracking: boolean;
  setActiveTracking: (val: boolean) => void;
  routeDistance: string;
  setRouteDistance: (val: string) => void;
  routeDuration: string;
  setRouteDuration: (val: string) => void;
  showLiveCamera: boolean;
  setShowLiveCamera: (val: boolean) => void;
  logEvent: (system: 'Meta Pixel' | 'Google Analytics', eventName: string, payload: any) => void;
  adminRadius: number;
  setAdminRadius: (val: number) => void;
}

export default function CustomerPortal({
  cart,
  setCart,
  addToCart,
  removeFromCart,
  clearCart,
  getTotal,
  getSubtotal,
  displacementTax,
  checkoutName,
  setCheckoutName,
  checkoutPhone,
  setCheckoutPhone,
  checkoutMoto,
  setCheckoutMoto,
  checkoutAddress,
  setCheckoutAddress,
  activeTracking,
  setActiveTracking,
  routeDistance,
  setRouteDistance,
  routeDuration,
  setRouteDuration,
  showLiveCamera,
  setShowLiveCamera,
  logEvent,
  adminRadius,
  setAdminRadius
}: CustomerPortalProps) {
  // Authentication State
  const [clientUser, setClientUser] = useState<{
    name: string;
    email: string;
    type: 'PF' | 'PJ';
    cpfCnpj: string;
    companyName?: string;
    role: 'B2C_CAROL' | 'B2C_CARLOS' | 'B2B_ANTONIO';
    points: number;
  } | null>(null);

  const [clientActiveTab, setClientActiveTab] = useState<'dashboard' | 'catalog' | 'tracking' | 'fidelidade'>('catalog');
  const [adminQuoteExpiryMinutes, setAdminQuoteExpiryMinutes] = useState(5);

  // Real-time mechanic quote bidding state
  const [quoteStatus, setQuoteStatus] = useState<'idle' | 'searching' | 'proposals' | 'approved'>('idle');
  const [selectedProposal, setSelectedProposal] = useState<{
    id: string;
    mechanicName: string;
    rating: number;
    distance: string;
    price: number;
    arrivalMinutes: number;
    vehicle: string;
    avatar: string;
  } | null>(null);

  // Live Tracking and Chat simulation states
  const [vanPos, setVanPos] = useState({ lat: -22.9015, lng: -47.0602 });
  const [selectedCamera, setSelectedCamera] = useState<'van' | 'repair'>('van');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'mechanic' | 'client'; text: string; time: string }>>([
    { sender: 'mechanic', text: 'Olá! Acabei de aceitar seu atendimento e já estou ligando a van para ir até você.', time: '14:32' },
    { sender: 'mechanic', text: 'Pode deixar que farei uma inspeção técnica geral na sua moto. Se tiver alguma dúvida, fale comigo por aqui!', time: '14:33' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isMechanicTyping, setIsMechanicTyping] = useState(false);

  // Van location movement simulation toward client location
  useEffect(() => {
    if (quoteStatus !== 'approved') {
      setVanPos({ lat: -22.9015, lng: -47.0602 });
      return;
    }

    const clientLocation = { lat: -22.9110, lng: -47.0560 };
    const interval = setInterval(() => {
      setVanPos(current => {
        const latDiff = clientLocation.lat - current.lat;
        const lngDiff = clientLocation.lng - current.lng;
        
        if (Math.abs(latDiff) < 0.0001 && Math.abs(lngDiff) < 0.0001) {
          clearInterval(interval);
          return clientLocation;
        }

        return {
          lat: current.lat + latDiff * 0.2, // move 20% closer each tick
          lng: current.lng + lngDiff * 0.2
        };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [quoteStatus]);

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    const newMsg = { sender: 'client' as const, text: userText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');
    setIsMechanicTyping(true);

    // Simulate mechanic response
    setTimeout(() => {
      setIsMechanicTyping(false);
      let replyText = "Entendido! Estou focado no trânsito agora, mas chego em instantes.";
      const lower = userText.toLowerCase();
      if (lower.includes('olá') || lower.includes('oi') || lower.includes('tudo bem')) {
        replyText = "Olá! Tudo ótimo por aqui. Estou a caminho de sua residência para realizar o serviço.";
      } else if (lower.includes('demorar') || lower.includes('tempo') || lower.includes('chega')) {
        replyText = "Estou bem pertinho de você, o trânsito em Campinas está tranquilo hoje. Chego em menos de 8 minutos!";
      } else if (lower.includes('ferramenta') || lower.includes('peça') || lower.includes('oleo') || lower.includes('óleo')) {
        replyText = "Sim! Nossa van é equipada com estoque completo de óleo Mobil, filtros e pastilhas de excelente qualidade. Pode ficar tranquilo(a).";
      } else if (lower.includes('camera') || lower.includes('câmera') || lower.includes('reparo') || lower.includes('ver')) {
        replyText = "Isso mesmo! Assim que eu estacionar e iniciar o reparo na bancada móvel, vou ligar a Câmera 2 para você acompanhar de perto.";
      }
      
      setChatMessages(prev => [...prev, {
        sender: 'mechanic',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 2500);
  };

  const [estimates, setEstimates] = useState<{
    id: string;
    title: string;
    price: number;
    timeLeft: number; // in seconds
    status: 'pending' | 'approved' | 'rejected' | 'expired';
  }[]>([]);

  const [activeOSList, setActiveOSList] = useState<{
    id: string;
    title: string;
    mechanic: string;
    price: number;
    status: 'Não Iniciada' | 'Em andamento' | 'Aguardando aprovação' | 'Concluido' | 'Entregue';
    date: string;
    additionalTitle?: string;
    additionalPrice?: number;
    additionalApproved?: boolean | null;
  }[]>([]);

  const [historicalOSList, setHistoricalOSList] = useState<{
    id: string;
    title: string;
    price: number;
    date: string;
    mechanic: string;
    serviceType: 'Pronto Atendimento' | 'Sob Agendamento';
    warranty: string;
    executedServices: string[];
  }[]>([]);

  const [garage, setGarage] = useState<Motorcycle[]>([]);
  const [selectedMotoId, setSelectedMotoId] = useState<string>('');

  // Authentication Form State
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

  const [localToast, setLocalToast] = useState<string | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('Todos os Serviços');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [filterCatalogType, setFilterCatalogType] = useState<'all' | 'pronto' | 'agendado'>('all');
  const [checkoutPayment, setCheckoutPayment] = useState<'cartao' | 'pix'>('pix');

  useEffect(() => {
    if (quoteStatus === 'searching') {
      const timer = setTimeout(() => {
        setQuoteStatus('proposals');
        triggerToast('⚡ Novas propostas de orçamento recebidas!');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [quoteStatus]);

  useEffect(() => {
    if (!clientUser) {
      setEstimates([]);
      setActiveOSList([]);
      setHistoricalOSList([]);
      return;
    }

    if (clientUser.role === 'B2C_CAROL') {
      setEstimates([
        { id: 'EST-1123', title: 'Troca de Vela de Ignição & Filtro de Ar', price: 135.00, timeLeft: adminQuoteExpiryMinutes * 60, status: 'pending' }
      ]);
      setActiveOSList([
        {
          id: 'OS-8821',
          title: 'Troca de Óleo Motor & Pastilha de Freio',
          mechanic: 'Danilo Silva',
          price: 160.00,
          status: 'Em andamento',
          date: 'Hoje',
          additionalTitle: 'Vazamento no retentor da bengala (Crítico)',
          additionalPrice: 90.00,
          additionalApproved: null
        }
      ]);
      setHistoricalOSList([
        { id: 'OS-7450', title: 'Alinhamento e Revisão Rápida', price: 95.00, date: '10/05/2026', mechanic: 'Thiago M.', serviceType: 'Pronto Atendimento', warranty: '90 dias (Garantia Total)', executedServices: ['Alinhamento de guidão', 'Reaperto de parafusos', 'Lubrificação de cabos'] }
      ]);
    } else if (clientUser.role === 'B2C_CARLOS') {
      setEstimates([
        { id: 'EST-4402', title: 'Troca de Filtro de Ar & Lona de Freio', price: 85.00, timeLeft: adminQuoteExpiryMinutes * 60, status: 'pending' }
      ]);
      setActiveOSList([
        {
          id: 'OS-9014',
          title: 'Troca de Kit Relação Completo',
          mechanic: 'Danilo Silva',
          price: 245.00,
          status: 'Não Iniciada',
          date: 'Hoje',
          additionalTitle: 'Pastilha traseira gasta',
          additionalPrice: 45.00,
          additionalApproved: null
        }
      ]);
      setHistoricalOSList([
        { id: 'OS-6231', title: 'Troca de Filtro de Ar e Vela', price: 75.00, date: '12/04/2026', mechanic: 'Thiago M.', serviceType: 'Pronto Atendimento', warranty: '30 dias (Garantia Técnica)', executedServices: ['Troca de Vela NGK', 'Troca de filtro Tecfil'] }
      ]);
    } else if (clientUser.role === 'B2B_ANTONIO') {
      setEstimates([
        { id: 'EST-9022', title: 'Revisão Preventiva B2B de 10k km', price: 380.00, timeLeft: adminQuoteExpiryMinutes * 60, status: 'pending' }
      ]);
      setActiveOSList([
        {
          id: 'OS-1002',
          title: 'Ajuste de Corrente e Freios',
          mechanic: 'Danilo Silva',
          price: 80.00,
          status: 'Aguardando aprovação',
          date: 'Hoje',
          additionalTitle: 'Troca de Pastilha Dianteira',
          additionalPrice: 45.00,
          additionalApproved: null
        }
      ]);
      setHistoricalOSList([
        { id: 'OS-0992', title: 'Troca de Pneu Traseiro Pirelli', price: 310.00, date: '20/05/2026', mechanic: 'Marcos R.', serviceType: 'Sob Agendamento', warranty: '180 dias (Garantia Estendida)', executedServices: ['Pneu Pirelli SuperCity 90/90-18', 'Balanceamento de Roda'] },
        { id: 'OS-0820', title: 'Troca de Óleo Mobil', price: 65.00, date: '18/05/2026', mechanic: 'Marcos R.', serviceType: 'Pronto Atendimento', warranty: '30 dias de Garantia', executedServices: ['Óleo Mobil Super Moto 20W-50'] }
      ]);
    } else {
      setEstimates([
        { id: 'EST-9912', title: 'Serviço de Diagnóstico OBD', price: 90.00, timeLeft: adminQuoteExpiryMinutes * 60, status: 'pending' }
      ]);
      setActiveOSList([
        {
          id: 'OS-9914',
          title: 'Troca de Óleo de Motor',
          mechanic: 'Danilo Silva',
          price: 60.00,
          status: 'Não Iniciada',
          date: 'Hoje',
        }
      ]);
      setHistoricalOSList([]);
    }
  }, [clientUser, adminQuoteExpiryMinutes]);

  useEffect(() => {
    const interval = setInterval(() => {
      setEstimates(prev => 
        prev.map(est => {
          if (est.status === 'pending') {
            if (est.timeLeft <= 1) {
              return { ...est, timeLeft: 0, status: 'expired' };
            }
            return { ...est, timeLeft: est.timeLeft - 1 };
          }
          return est;
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleApproveEstimate = (id: string) => {
    const est = estimates.find(e => e.id === id);
    if (!est) return;
    
    // Add to Active OS
    const newOS = {
      id: `OS-${Math.floor(1000 + Math.random() * 9000)}`,
      title: est.title,
      mechanic: 'Danilo Silva',
      price: est.price,
      status: 'Não Iniciada' as const,
      date: 'Hoje',
    };
    
    setActiveOSList(prev => [newOS, ...prev]);
    setEstimates(prev => prev.filter(e => e.id !== id));
    triggerToast(`Orçamento ${id} aprovado! Uma nova O.S. foi gerada.`);
  };

  const handleRejectEstimate = (id: string) => {
    setEstimates(prev => prev.filter(e => e.id !== id));
    triggerToast(`Orçamento ${id} rejeitado pelo cliente.`);
  };

  const handleApproveAdditional = (osId: string) => {
    setActiveOSList(prev => 
      prev.map(os => {
        if (os.id === osId) {
          return {
            ...os,
            title: `${os.title} + ${os.additionalTitle}`,
            price: os.price + (os.additionalPrice || 0),
            additionalApproved: true,
            status: 'Em andamento'
          };
        }
        return os;
      })
    );
    triggerToast('Serviço adicional aprovado e incluído na O.S.!');
  };

  const handleRejectAdditional = (osId: string) => {
    setActiveOSList(prev => 
      prev.map(os => {
        if (os.id === osId) {
          return {
            ...os,
            additionalApproved: false,
            status: 'Em andamento'
          };
        }
        return os;
      })
    );
    triggerToast('Serviço adicional rejeitado. O reparo prosseguirá com os itens originais.');
  };

  const triggerToast = (msg: string) => {
    setLocalToast(msg);
    setTimeout(() => setLocalToast(null), 3000);
  };

  const handlePersonaLogin = (persona: 'CAROL' | 'CARLOS' | 'ANTONIO') => {
    setQuoteStatus('approved');
    setSelectedProposal({
      id: 'prop-danilo',
      mechanicName: 'Danilo Silva',
      rating: 4.9,
      distance: '2.4 km',
      price: 85,
      arrivalMinutes: 12,
      vehicle: 'Furgão Oficina Móvel #02',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'
    });
    if (persona === 'CAROL') {
      setClientUser({
        name: 'Carol Silva',
        email: 'carol.silva@gmail.com',
        type: 'PF',
        cpfCnpj: '123.456.789-00',
        role: 'B2C_CAROL',
        points: 850
      });
      setGarage([
        { id: 'moto-carol-1', model: 'Honda Biz 125', plate: 'BRA2E19', year: '2023', color: 'Vermelho' }
      ]);
      setSelectedMotoId('moto-carol-1');
      setCheckoutName('Carol Silva');
      setCheckoutPhone('(19) 98765-4321');
      setCheckoutMoto('Honda Biz 125');
      setCheckoutAddress('Rua General Osório, 1200 - Centro, Campinas - SP');
      setActiveTracking(true);
    } else if (persona === 'CARLOS') {
      setClientUser({
        name: 'Carlos MotoFrete',
        email: 'carlos.frete@outlook.com',
        type: 'PF',
        cpfCnpj: '987.654.321-11',
        role: 'B2C_CARLOS',
        points: 1100
      });
      setGarage([
        { id: 'moto-carlos-1', model: 'Yamaha Fazer 250', plate: 'FLX4H88', year: '2022', color: 'Azul' }
      ]);
      setSelectedMotoId('moto-carlos-1');
      setCheckoutName('Carlos MotoFrete');
      setCheckoutPhone('(19) 99988-7766');
      setCheckoutMoto('Yamaha Fazer 250');
      setCheckoutAddress('Av. Francisco Glicério, 1500 - Centro, Campinas - SP');
      setActiveTracking(true);
    } else {
      setClientUser({
        name: 'Antônio Frotista',
        email: 'antonio@logiexpress.com.br',
        type: 'PJ',
        cpfCnpj: '12.345.678/0001-99',
        companyName: 'LogiEntrega Express Ltda',
        role: 'B2B_ANTONIO',
        points: 3500
      });
      setGarage([
        { id: 'moto-antonio-1', model: 'Honda CG 160 Cargo (Frota #01)', plate: 'FRO1A11', year: '2024', color: 'Branco' },
        { id: 'moto-antonio-2', model: 'Honda CG 160 Cargo (Frota #02)', plate: 'FRO1A22', year: '2024', color: 'Branco' },
        { id: 'moto-antonio-3', model: 'Yamaha Factor 150 (Frota #03)', plate: 'FRO1A33', year: '2023', color: 'Preto' }
      ]);
      setSelectedMotoId('moto-antonio-1');
      setCheckoutName('Antônio Frotista');
      setCheckoutPhone('(19) 91122-3344');
      setCheckoutMoto('Honda CG 160 Cargo');
      setCheckoutAddress('Rua Barão de Jaguara, 800 - Cambuí, Campinas - SP');
      setActiveTracking(true);
    }
    setClientActiveTab('catalog');
    triggerToast('Conectado com sucesso no perfil de teste!');
  };

  const handleManualLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteStatus('approved');
    setSelectedProposal({
      id: 'prop-danilo',
      mechanicName: 'Danilo Silva',
      rating: 4.9,
      distance: '2.4 km',
      price: 85,
      arrivalMinutes: 12,
      vehicle: 'Furgão Oficina Móvel #02',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'
    });
    if (isLoginTab) {
      setClientUser({
        name: authForm.email.split('@')[0],
        email: authForm.email,
        type: 'PF',
        cpfCnpj: '000.000.000-00',
        role: 'B2C_CAROL',
        points: 100
      });
      setGarage([
        { id: 'moto-custom', model: 'Honda CG 160 Titan', plate: 'ABC1D23', year: '2025', color: 'Preto' }
      ]);
      setSelectedMotoId('moto-custom');
      setCheckoutName(authForm.email.split('@')[0]);
      setCheckoutPhone('(19) 90000-0000');
      setCheckoutMoto('Honda CG 160 Titan');
      setCheckoutAddress('Av. Brasil, 500 - Jardim Guanabara, Campinas - SP');
    } else {
      setClientUser({
        name: authForm.name || 'Cliente Cadastrado',
        email: authForm.email,
        type: authForm.type,
        cpfCnpj: authForm.type === 'PF' ? authForm.cpf : authForm.cnpj,
        companyName: authForm.type === 'PJ' ? authForm.companyName : undefined,
        role: authForm.type === 'PF' ? 'B2C_CAROL' : 'B2B_ANTONIO',
        points: 0
      });
      const userBike = {
        id: `moto-${Date.now()}`,
        model: 'Honda CG 160 Titan',
        plate: authForm.type === 'PF' ? 'ABC1D23' : 'FRO1A11',
        year: '2025',
        color: 'Preto'
      };
      setGarage([userBike]);
      setSelectedMotoId(userBike.id);
      setCheckoutName(authForm.name || 'Cliente Cadastrado');
      setCheckoutPhone('(19) 90000-0000');
      setCheckoutMoto('Honda CG 160 Titan');
      setCheckoutAddress('Av. Brasil, 500 - Jardim Guanabara, Campinas - SP');
    }
    setClientActiveTab('catalog');
    triggerToast('Sua conta foi criada e você está conectado!');
  };

  const handleAddBikeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBike.plate) {
      triggerToast('A placa é obrigatória!');
      return;
    }
    const bike: Motorcycle = {
      id: `moto-manual-${Date.now()}`,
      model: newBike.model,
      plate: newBike.plate.toUpperCase(),
      year: newBike.year,
      color: newBike.color
    };
    setGarage(prev => [...prev, bike]);
    setSelectedMotoId(bike.id);
    setShowAddBikeForm(false);
    setNewBike({ model: 'Honda CG 160 Titan', plate: '', year: '2025', color: 'Preto' });
    triggerToast(`Moto ${bike.model} adicionada com sucesso!`);
  };

  const handleLogout = () => {
    setClientUser(null);
    setGarage([]);
    setSelectedMotoId('');
    setActiveTracking(false);
    triggerToast('Sessão encerrada!');
  };

  // Get dynamic Active O.S. for selected motorcycle
  const getActiveOS = () => {
    if (!selectedMotoId || !clientUser) return null;
    if (clientUser.role === 'B2C_CAROL' && selectedMotoId === 'moto-carol-1') {
      return {
        id: 'OS-8821',
        title: 'Troca de Óleo Motor & Pastilha de Freio',
        status: 'Mecânico Deslocando',
        price: 160.00,
        date: 'Hoje',
        time: routeDuration,
        mechanic: 'Danilo Silva',
        hasCamera: true
      };
    }
    if (clientUser.role === 'B2C_CARLOS' && selectedMotoId === 'moto-carlos-1') {
      return {
        id: 'OS-9014',
        title: 'Troca de Kit Relação Completo',
        status: 'Em Inspeção',
        price: 245.00,
        date: 'Hoje',
        time: '6 min',
        mechanic: 'Danilo Silva',
        hasCamera: true
      };
    }
    if (clientUser.role === 'B2B_ANTONIO' && selectedMotoId === 'moto-antonio-1') {
      return {
        id: 'OS-1002',
        title: 'Ajuste de Corrente e Freios',
        status: 'Em Execução',
        price: 80.00,
        date: 'Hoje',
        time: 'Em andamento',
        mechanic: 'Danilo Silva',
        hasCamera: true
      };
    }
    return null;
  };

  const getHistoryOS = () => {
    if (!selectedMotoId || !clientUser) return [];
    if (clientUser.role === 'B2C_CAROL' && selectedMotoId === 'moto-carol-1') {
      return [
        { id: 'OS-7450', title: 'Alinhamento e Revisão Rápida', status: 'Finalizado', price: 95.00, date: '10/05/2026', mechanic: 'Thiago M.' }
      ];
    }
    if (clientUser.role === 'B2C_CARLOS' && selectedMotoId === 'moto-carlos-1') {
      return [
        { id: 'OS-6231', title: 'Troca de Filtro de Ar e Vela', status: 'Finalizado', price: 75.00, date: '12/04/2026', mechanic: 'Thiago M.' }
      ];
    }
    if (clientUser.role === 'B2B_ANTONIO') {
      if (selectedMotoId === 'moto-antonio-1') {
        return [
          { id: 'OS-0992', title: 'Troca de Pneu Traseiro Pirelli', status: 'Finalizado', price: 310.00, date: '20/05/2026', mechanic: 'Marcos R.' }
        ];
      }
      if (selectedMotoId === 'moto-antonio-2') {
        return [
          { id: 'OS-0820', title: 'Troca de Óleo Mobil', status: 'Finalizado', price: 65.00, date: '18/05/2026', mechanic: 'Marcos R.' }
        ];
      }
    }
    return [];
  };

  const activeOS = getActiveOS();
  const historyOS = getHistoryOS();

  // Filter Catalog
  const filteredServices = SERVICES_CATALOG.filter(srv => {
    if (activeCategory !== 'Todos os Serviços' && srv.category !== activeCategory) return false;
    if (filterCatalogType === 'pronto') {
      return srv.formaAtendimento === 'Pronto Atendimento';
    }
    if (filterCatalogType === 'agendado') {
      return srv.formaAtendimento === 'Sob Agendamento';
    }
    return true;
  });

  return (
    <div className="bg-white text-zinc-900 pb-20 relative font-sans">
      
      {/* 1. AUTHENTICATION VIEW */}
      {!clientUser ? (
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-6 md:p-8 space-y-4 shadow-xl text-left">
            <div className="text-center space-y-2 pb-2">
              <h2 className="text-3xl font-black text-zinc-950 tracking-tight">MyOttomotos</h2>
              
              {/* Highlighted Slogan */}
              <p className="text-sm font-extrabold text-brand-orange tracking-tight">
                "Uma nova forma de prover serviços"
              </p>
            </div>

            {/* Manual Form Tabs */}
            <div className="flex border-b border-zinc-200">
              <button
                onClick={() => setIsLoginTab(true)}
                className={`flex-1 pb-3 text-xs font-bold border-b-2 text-center transition-colors ${
                  isLoginTab ? 'border-brand-orange text-brand-orange' : 'border-transparent text-zinc-400'
                }`}
              >
                Fazer Login
              </button>
              <button
                onClick={() => setIsLoginTab(false)}
                className={`flex-1 pb-3 text-xs font-bold border-b-2 text-center transition-colors ${
                  !isLoginTab ? 'border-brand-orange text-brand-orange' : 'border-transparent text-zinc-400'
                }`}
              >
                Criar Conta
              </button>
            </div>

            <form onSubmit={handleManualLoginSubmit} className="space-y-4 text-xs">
              {!isLoginTab && (
                <>
                  {/* Tax Designation Toggle */}
                  <div className="space-y-1">
                    <label className="text-zinc-500 block font-bold">Tipo de Cliente</label>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-100 rounded-xl border border-zinc-200">
                      <button
                        type="button"
                        onClick={() => setAuthForm(prev => ({ ...prev, type: 'PF' }))}
                        className={`py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${
                          authForm.type === 'PF' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
                        }`}
                      >
                        Pessoa Física (CPF)
                      </button>
                      <button
                        type="button"
                        onClick={() => setAuthForm(prev => ({ ...prev, type: 'PJ' }))}
                        className={`py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${
                          authForm.type === 'PJ' ? 'bg-white text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'
                        }`}
                      >
                        Pessoa Jurídica (CNPJ)
                      </button>
                    </div>
                  </div>

                  {authForm.type === 'PF' ? (
                    <>
                      {/* Name */}
                      <div className="space-y-1 animate-fadeIn">
                        <label className="text-zinc-500 block font-bold">Nome Completo</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Carol Silva"
                          value={authForm.name}
                          onChange={(e) => setAuthForm(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-zinc-900 font-bold focus:outline-none focus:border-brand-orange"
                        />
                      </div>
                      {/* CPF */}
                      <div className="space-y-1 animate-fadeIn">
                        <label className="text-zinc-500 block font-bold">CPF</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: 123.456.789-00"
                          value={authForm.cpf}
                          onChange={(e) => setAuthForm(prev => ({ ...prev, cpf: e.target.value }))}
                          className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-zinc-900 font-bold focus:outline-none focus:border-brand-orange"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Razão Social */}
                      <div className="space-y-1 animate-fadeIn">
                        <label className="text-zinc-500 block font-bold">Razão Social / Empresa</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: LogiEntrega Express Ltda"
                          value={authForm.companyName}
                          onChange={(e) => setAuthForm(prev => ({ ...prev, companyName: e.target.value }))}
                          className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-zinc-900 font-bold focus:outline-none focus:border-brand-orange"
                        />
                      </div>
                      {/* CNPJ */}
                      <div className="space-y-1 animate-fadeIn">
                        <label className="text-zinc-500 block font-bold">CNPJ</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: 12.345.678/0001-99"
                          value={authForm.cnpj}
                          onChange={(e) => setAuthForm(prev => ({ ...prev, cnpj: e.target.value }))}
                          className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-zinc-900 font-bold focus:outline-none focus:border-brand-orange"
                        />
                      </div>
                      {/* Nome do Responsável */}
                      <div className="space-y-1 animate-fadeIn">
                        <label className="text-zinc-500 block font-bold">Nome do Gestor da Frota</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Antônio de Souza"
                          value={authForm.name}
                          onChange={(e) => setAuthForm(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-zinc-900 font-bold focus:outline-none focus:border-brand-orange"
                        />
                      </div>
                    </>
                  )}
                </>
              )}

              {/* Email */}
              <div className="space-y-1">
                <label className="text-zinc-500 block font-bold">E-mail</label>
                <input
                  type="email"
                  required
                  placeholder="Ex: cliente@ottomotos.com"
                  value={authForm.email}
                  onChange={(e) => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-zinc-900 font-bold focus:outline-none focus:border-brand-orange"
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-zinc-500 block font-bold">Senha</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={authForm.password}
                  onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2.5 text-zinc-900 font-bold focus:outline-none focus:border-brand-orange"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-brand-orange hover:bg-brand-orange-hover text-black font-black py-3 rounded-xl shadow-lg transition-all text-xs"
              >
                {isLoginTab ? 'Entrar no MyOttomotos' : 'Finalizar Cadastro'}
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* 2. LOGGED-IN CUSTOMER AREA */
        <div className="max-w-7xl mx-auto px-4 py-8">
          
          {/* Header Profile Info and global stats */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-5 md:p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm text-left">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center font-bold text-lg border-2 border-brand-orange">
                {clientUser.type === 'PJ' ? <Building2 className="w-6 h-6 text-brand-orange" /> : <User className="w-6 h-6 text-brand-orange" />}
              </div>
              <div className="space-y-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-extrabold text-base text-zinc-950 leading-tight">
                    {clientUser.companyName || clientUser.name}
                  </h3>
                  <span className="text-[9px] bg-brand-orange/10 text-brand-orange font-bold px-1.5 py-0.5 rounded-full border border-brand-orange/15 uppercase">
                    {clientUser.type === 'PJ' ? 'Pessoa Jurídica (B2B)' : 'Pessoa Física (B2C)'}
                  </span>
                </div>
                <p className="text-xs text-zinc-500">
                  {clientUser.companyName ? `Gestor: ${clientUser.name} • ` : ''} {clientUser.email} • ID: {clientUser.cpfCnpj}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setClientActiveTab('fidelidade')}
                className="bg-brand-orange-light text-brand-orange border border-brand-orange/20 hover:bg-brand-orange/10 px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-1.5 transition-all"
              >
                <Award className="w-4 h-4 text-brand-orange" />
                <span>{clientUser.points} Pontos OttoClub</span>
              </button>
              <button
                onClick={handleLogout}
                className="bg-white hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 border border-zinc-200 p-2.5 rounded-2xl transition-all shadow-sm"
                title="Sair da Conta"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sub-tab navigation */}
          <div className="flex border-b border-zinc-200 mb-8 overflow-x-auto gap-2 pb-1 scrollbar-none text-left">
            <button
              onClick={() => setClientActiveTab('catalog')}
              className={`py-3 px-5 font-black text-xs md:text-sm border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
                clientActiveTab === 'catalog'
                  ? 'border-brand-orange text-brand-orange'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Catálogo & Orçamentos
            </button>
            <button
              onClick={() => setClientActiveTab('tracking')}
              className={`py-3 px-5 font-black text-xs md:text-sm border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
                clientActiveTab === 'tracking'
                  ? 'border-brand-orange text-brand-orange'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <MapPin className="w-4 h-4" />
              Acompanhamento Ativo {activeTracking && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>}
            </button>
            <button
              onClick={() => setClientActiveTab('fidelidade')}
              className={`py-3 px-5 font-black text-xs md:text-sm border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
                clientActiveTab === 'fidelidade'
                  ? 'border-brand-orange text-brand-orange'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <Award className="w-4 h-4" />
              Fidelidade & Prêmios
            </button>
            <button
              onClick={() => setClientActiveTab('dashboard')}
              className={`py-3 px-5 font-black text-xs md:text-sm border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
                clientActiveTab === 'dashboard'
                  ? 'border-brand-orange text-brand-orange'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900'
              }`}
            >
              <Sliders className="w-4 h-4" />
              Painel Geral (Garagem)
            </button>
          </div>

          {/* 2.1 DASHBOARD TAB */}
          {clientActiveTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 text-left">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Garagem Card */}
                <div className="lg:col-span-4 bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-zinc-150">
                    <h4 className="font-extrabold text-base text-zinc-950 flex items-center gap-1.5">
                      <Truck className="w-5 h-5 text-brand-orange" />
                      Sua Garagem
                    </h4>
                    <button
                      onClick={() => setShowAddBikeForm(!showAddBikeForm)}
                      className="bg-brand-orange hover:bg-brand-orange-hover text-black text-[10px] font-black px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow transition-all"
                    >
                      <Plus className="w-3 h-3" /> Adicionar Moto
                    </button>
                  </div>

                  {/* Add bike form inside dropdown panel */}
                  {showAddBikeForm && (
                    <form onSubmit={handleAddBikeSubmit} className="bg-zinc-50 border border-zinc-200 p-4 rounded-2xl space-y-3 text-xs animate-fadeIn">
                      <div className="space-y-1">
                        <label className="text-zinc-500 block font-bold">Modelo</label>
                        <select
                          value={newBike.model}
                          onChange={(e) => setNewBike(prev => ({ ...prev, model: e.target.value }))}
                          className="w-full bg-white border border-zinc-200 rounded-lg p-2 font-bold"
                        >
                          <option value="Honda CG 160 Titan">Honda CG 160 Titan</option>
                          <option value="Honda Biz 125">Honda Biz 125</option>
                          <option value="Yamaha Fazer 250">Yamaha Fazer 250</option>
                          <option value="Honda Bros 160">Honda Bros 160</option>
                          <option value="Yamaha YBR Factor 150">Yamaha YBR Factor 150</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-zinc-500 block font-bold">Placa</label>
                          <input
                            type="text"
                            required
                            placeholder="Ex: ABC1D23"
                            value={newBike.plate}
                            onChange={(e) => setNewBike(prev => ({ ...prev, plate: e.target.value }))}
                            className="w-full bg-white border border-zinc-200 rounded-lg p-2 font-bold uppercase"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-zinc-500 block font-bold">Ano</label>
                          <input
                            type="text"
                            placeholder="Ex: 2024"
                            value={newBike.year}
                            onChange={(e) => setNewBike(prev => ({ ...prev, year: e.target.value }))}
                            className="w-full bg-white border border-zinc-200 rounded-lg p-2 font-bold"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="flex-1 bg-brand-orange hover:bg-brand-orange-hover text-black font-bold py-2 rounded-xl text-[10px]"
                        >
                          Confirmar Inclusão
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddBikeForm(false)}
                          className="flex-1 bg-zinc-200 hover:bg-zinc-300 text-zinc-700 font-bold py-2 rounded-xl text-[10px]"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Motorcycles list */}
                  <div className="space-y-2.5">
                    {garage.map(bike => {
                      const isSelected = selectedMotoId === bike.id;
                      return (
                        <div
                          key={bike.id}
                          onClick={() => {
                            setSelectedMotoId(bike.id);
                            setCheckoutMoto(bike.model);
                          }}
                          className={`p-3.5 rounded-2xl border cursor-pointer text-left transition-all ${
                            isSelected
                              ? 'border-brand-orange bg-brand-orange-light shadow-sm'
                              : 'border-zinc-200 hover:bg-zinc-50 bg-white'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-extrabold text-sm text-zinc-950 block">{bike.model}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md font-mono ${
                              isSelected ? 'bg-brand-orange text-black font-black' : 'bg-zinc-100 text-zinc-600'
                            }`}>
                              {bike.plate}
                            </span>
                          </div>
                          <div className="flex justify-between text-[10px] text-zinc-500 pt-1">
                            <span>Ano: {bike.year} • Cor: {bike.color}</span>
                            {isSelected && <span className="text-brand-orange font-bold">● Selecionada</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Bike Active Orders & history */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* BLOCK A: ORÇAMENTOS ATIVOS */}
                  <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-zinc-150 gap-2">
                      <div className="space-y-0.5">
                        <h4 className="font-black text-sm text-zinc-950 uppercase tracking-tight flex items-center gap-1.5">
                          <Sliders className="w-4 h-4 text-brand-orange" />
                          a) Orçamentos Ativos (Bids Recebidos)
                        </h4>
                        <p className="text-[11px] text-zinc-500">
                          Propostas enviadas por mecânicos móveis na sua região de Campinas.
                        </p>
                      </div>
                      
                      {/* Admin Expiry Adjustment Option inside Dashboard */}
                      <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-1.5 flex items-center gap-2 text-[10px] text-zinc-600 font-mono">
                        <Settings className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Validade (Painel Admin):</span>
                        <select
                          value={adminQuoteExpiryMinutes}
                          onChange={(e) => {
                            setAdminQuoteExpiryMinutes(parseInt(e.target.value));
                            triggerToast(`Tempo de validade das propostas alterado para ${e.target.value} minutos.`);
                          }}
                          className="bg-white border border-zinc-200 rounded px-1 py-0.5 text-[10px] font-bold text-zinc-850 focus:outline-none"
                        >
                          <option value="1">1 min</option>
                          <option value="3">3 min</option>
                          <option value="5">5 min</option>
                          <option value="10">10 min</option>
                          <option value="15">15 min</option>
                        </select>
                      </div>
                    </div>

                    {estimates.length > 0 ? (
                      <div className="space-y-3">
                        {estimates.map((est) => {
                          const minutes = Math.floor(est.timeLeft / 60);
                          const seconds = est.timeLeft % 60;
                          const isExpired = est.status === 'expired';

                          return (
                            <div
                              key={est.id}
                              className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                                isExpired
                                  ? 'bg-zinc-50 border-zinc-200 opacity-70'
                                  : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-xs'
                              }`}
                            >
                              <div className="space-y-1 text-left flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] bg-zinc-900 text-white font-mono font-bold px-1.5 py-0.5 rounded">
                                    {est.id}
                                  </span>
                                  <h5 className={`font-extrabold text-sm ${isExpired ? 'text-zinc-500 line-through' : 'text-zinc-950'}`}>
                                    {est.title}
                                  </h5>
                                </div>
                                <p className="text-xs text-zinc-500">
                                  Valor da Mão de Obra e Peças inclusas: <strong className="text-brand-orange">R$ {est.price},00</strong>
                                </p>
                                
                                {/* Expiry countdown visual */}
                                {!isExpired ? (
                                  <div className="flex items-center gap-1.5 text-[11px] text-amber-600 font-bold mt-1">
                                    <Clock className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
                                    <span>Expira em: <strong className="font-mono text-xs">{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</strong></span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1.5 text-[11px] text-red-500 font-bold mt-1">
                                    <Info className="w-3.5 h-3.5 text-red-500" />
                                    <span>Proposta expirada no Painel Admin</span>
                                  </div>
                                )}
                              </div>

                              <div className="flex gap-2 w-full md:w-auto">
                                {!isExpired ? (
                                  <>
                                    <button
                                      onClick={() => handleApproveEstimate(est.id)}
                                      className="flex-1 md:flex-initial bg-brand-orange hover:bg-brand-orange-hover text-black font-black text-xs px-4 py-2 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                                    >
                                      <Check className="w-3.5 h-3.5" /> Aprovar
                                    </button>
                                    <button
                                      onClick={() => handleRejectEstimate(est.id)}
                                      className="flex-1 md:flex-initial bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200 font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                                    >
                                      Rejeitar
                                    </button>
                                  </>
                                ) : (
                                  <span className="w-full md:w-auto text-center bg-red-100 text-red-650 border border-red-200 text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-wider">
                                    ❌ Expirado
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="py-6 text-center space-y-2 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                        <p className="text-xs text-zinc-500 font-medium">Nenhum orçamento ativo ou pendente para esta moto.</p>
                        <button
                          onClick={() => setClientActiveTab('catalog')}
                          className="text-xs text-brand-orange hover:underline font-bold"
                        >
                          Ir ao catálogo solicitar orçamento agora →
                        </button>
                      </div>
                    )}
                  </div>

                  {/* BLOCK B: OS ATIVAS E STATUS */}
                  <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm space-y-5">
                    <div className="pb-3 border-b border-zinc-150">
                      <h4 className="font-black text-sm text-zinc-950 uppercase tracking-tight flex items-center gap-1.5">
                        <Sliders className="w-4 h-4 text-brand-orange" />
                        b) OS Ativas e Respectivos Status
                      </h4>
                      <p className="text-[11px] text-zinc-500">
                        Acompanhe o andamento das ordens de serviço ativas na van-oficina móvel.
                      </p>
                    </div>

                    {activeOSList.length > 0 ? (
                      <div className="space-y-6">
                        {activeOSList.map((os) => {
                          // Define milestone indexes
                          const statuses = ['Não Iniciada', 'Em andamento', 'Aguardando aprovação', 'Concluido', 'Entregue'];
                          const currentIdx = statuses.indexOf(os.status);

                          return (
                            <div key={os.id} className="p-5 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-5 text-left">
                              
                              {/* Header info */}
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] bg-brand-orange text-black font-black px-2 py-0.5 rounded font-mono">
                                      {os.id}
                                    </span>
                                    <h5 className="font-extrabold text-sm text-zinc-900">{os.title}</h5>
                                  </div>
                                  <p className="text-xs text-zinc-500">
                                    Mecânico: <strong className="text-zinc-850">{os.mechanic}</strong> • Valor total: <strong className="text-brand-orange">R$ {os.price},00</strong>
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-orange"></span>
                                  </span>
                                  <span className="text-xs font-black text-brand-orange uppercase tracking-wider">{os.status}</span>
                                </div>
                              </div>

                              {/* STAGES/MILESTONES TRACKER */}
                              <div className="pt-2">
                                <div className="flex justify-between items-center relative">
                                  {/* Progress bar background line */}
                                  <div className="absolute left-0 right-0 h-1 bg-zinc-200 top-1/2 -translate-y-1/2 z-0"></div>
                                  {/* Active progress line */}
                                  <div 
                                    className="absolute left-0 h-1 bg-brand-orange top-1/2 -translate-y-1/2 z-0 transition-all duration-500"
                                    style={{ width: `${(currentIdx / (statuses.length - 1)) * 100}%` }}
                                  ></div>

                                  {statuses.map((st, idx) => {
                                    const isCompleted = idx <= currentIdx;
                                    const isActive = idx === currentIdx;

                                    return (
                                      <div key={st} className="flex flex-col items-center z-10 relative">
                                        <div 
                                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-all ${
                                            isActive 
                                              ? 'bg-brand-orange text-black border-brand-orange shadow-md scale-110'
                                              : isCompleted
                                              ? 'bg-black text-white border-black'
                                              : 'bg-white text-zinc-400 border-zinc-200'
                                          }`}
                                        >
                                          {isCompleted ? '✓' : idx + 1}
                                        </div>
                                        <span className={`text-[9px] font-bold mt-1.5 max-w-[70px] text-center leading-tight hidden sm:block ${
                                          isActive ? 'text-brand-orange font-black' : isCompleted ? 'text-zinc-800' : 'text-zinc-400'
                                        }`}>
                                          {st}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                                {/* Mobile-only status name */}
                                <div className="text-center text-[10px] font-bold text-brand-orange uppercase mt-2 sm:hidden">
                                  Status Atual: {os.status}
                                </div>
                              </div>

                              {/* CRITICAL ADDITIONAL ITEM DIALOG FOR 'Aguardando aprovação' */}
                              {os.status === 'Aguardando aprovação' && os.additionalApproved === null && (
                                <div className="bg-amber-50 border-2 border-amber-400/55 p-4 rounded-xl space-y-3 animate-fadeIn">
                                  <div className="flex items-start gap-2.5">
                                    <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                    <div className="space-y-1">
                                      <span className="text-[9px] bg-amber-600 text-white font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
                                        ⚠️ DIAGNÓSTICO CRÍTICO ADICIONAL
                                      </span>
                                      <h6 className="font-extrabold text-xs text-zinc-900">
                                        O mecânico detectou: <strong className="text-amber-700">{os.additionalTitle}</strong>
                                      </h6>
                                      <p className="text-[11px] text-zinc-650 leading-relaxed">
                                        Para garantir a segurança mecânica da sua moto, recomendamos a substituição adicional desta peça. A van já tem o item em estoque e a substituição é imediata.
                                      </p>
                                      <p className="text-xs pt-1">
                                        Custo Adicional: <strong className="text-amber-700">R$ {os.additionalPrice},00</strong> (Mão de Obra inclusa)
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex gap-2 justify-end pt-1">
                                    <button
                                      onClick={() => handleApproveAdditional(os.id)}
                                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] px-3.5 py-2 rounded-lg transition-all shadow-sm"
                                    >
                                      ✓ Autorizar Serviço Adicional
                                    </button>
                                    <button
                                      onClick={() => handleRejectAdditional(os.id)}
                                      className="bg-zinc-200 hover:bg-zinc-350 text-zinc-700 font-bold text-[10px] px-3.5 py-2 rounded-lg transition-all"
                                    >
                                      Rejeitar Item Extra
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Actions / Interactive Simulator for testing */}
                              <div className="flex flex-wrap gap-2.5 pt-3 border-t border-zinc-200 justify-between items-center">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      setClientActiveTab('tracking');
                                      setActiveTracking(true);
                                    }}
                                    className="bg-brand-orange hover:bg-brand-orange-hover text-black font-black py-2 px-4 rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
                                  >
                                    <MapPin className="w-4 h-4" /> Acompanhar Van & Câmera
                                  </button>
                                </div>

                                {/* Simulator selector: Allow user to change status for testing/interactivity */}
                                <div className="flex items-center gap-1.5 bg-zinc-100 border border-zinc-250/60 p-1 rounded-xl text-[10px] text-zinc-500 font-mono">
                                  <span>Simular Status:</span>
                                  <select
                                    value={os.status}
                                    onChange={(e) => {
                                      const nextStatus = e.target.value as any;
                                      setActiveOSList(prev => 
                                        prev.map(item => item.id === os.id ? { ...item, status: nextStatus } : item)
                                      );
                                      if (nextStatus === 'Aguardando aprovação') {
                                        // Reset approval
                                        setActiveOSList(prev => 
                                          prev.map(item => item.id === os.id ? { ...item, status: nextStatus, additionalApproved: null } : item)
                                        );
                                      }
                                      triggerToast(`Status da O.S. alterado para ${nextStatus}!`);
                                    }}
                                    className="bg-white border border-zinc-200 rounded px-1.5 py-0.5 text-[9px] font-bold text-zinc-800"
                                  >
                                    {statuses.map(st => <option key={st} value={st}>{st}</option>)}
                                  </select>

                                  {os.status === 'Entregue' && (
                                    <button
                                      onClick={() => {
                                        // Archive/move to history
                                        const archivedOS = {
                                          id: os.id,
                                          title: os.title,
                                          price: os.price,
                                          date: 'Hoje',
                                          mechanic: os.mechanic,
                                          serviceType: 'Pronto Atendimento' as const,
                                          warranty: '90 dias (Garantia Total)',
                                          executedServices: [os.title, os.additionalTitle].filter(Boolean) as string[]
                                        };
                                        setHistoricalOSList(prev => [archivedOS, ...prev]);
                                        setActiveOSList(prev => prev.filter(item => item.id !== os.id));
                                        triggerToast('O.S. finalizada e movida para o Histórico de Revisões!');
                                      }}
                                      className="bg-emerald-600 text-white font-black px-2 py-1 rounded hover:bg-emerald-700 transition-all font-sans text-[9px]"
                                    >
                                      Finalizar & Arquivar
                                    </button>
                                  )}
                                </div>
                              </div>

                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="py-6 text-center space-y-2 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200 text-zinc-500 text-xs font-medium">
                        <p>Nenhuma ordem de serviço ativa no momento para esta moto.</p>
                      </div>
                    )}

                    {/* Fleet status table for PJ only, integrated beautifully inside Block B */}
                    {clientUser.type === 'PJ' && (
                      <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
                          <h5 className="font-extrabold text-xs text-zinc-900 flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-brand-orange" />
                            Painel de Controle da Frota (B2B)
                          </h5>
                          <span className="text-[10px] bg-emerald-100 text-emerald-700 font-extrabold px-2 py-0.5 rounded-full">
                            1 Ativa / 2 Disponíveis
                          </span>
                        </div>
                        <div className="overflow-x-auto text-[11px]">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-zinc-200 text-zinc-400 font-bold uppercase text-[9px] font-mono">
                                <th className="py-1">Moto</th>
                                <th>Placa</th>
                                <th>Estado</th>
                                <th>Local</th>
                                <th>Ações</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-150/40 font-medium text-zinc-700">
                              <tr>
                                <td className="py-2 font-bold text-zinc-900">Honda CG Cargo (#01)</td>
                                <td className="font-mono text-zinc-500">FRO1A11</td>
                                <td><span className="px-1.5 py-0.5 rounded-full text-[8px] bg-orange-100 text-orange-600 font-bold">Manutenção Ativa</span></td>
                                <td>Rua Barão de Jaguara</td>
                                <td>
                                  <button
                                    onClick={() => {
                                      setSelectedMotoId('moto-antonio-1');
                                      setClientActiveTab('tracking');
                                      setActiveTracking(true);
                                    }}
                                    className="text-brand-orange hover:underline font-bold text-[10px]"
                                  >
                                    Rastrear
                                  </button>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 font-bold text-zinc-900">Honda CG Cargo (#02)</td>
                                <td className="font-mono text-zinc-500">FRO1A22</td>
                                <td><span className="px-1.5 py-0.5 rounded-full text-[8px] bg-emerald-100 text-emerald-600 font-bold">Disponível</span></td>
                                <td>-</td>
                                <td>
                                  <button
                                    onClick={() => {
                                      setSelectedMotoId('moto-antonio-2');
                                      setClientActiveTab('catalog');
                                    }}
                                    className="text-zinc-500 hover:underline font-bold text-[10px]"
                                  >
                                    Orçar
                                  </button>
                                </td>
                              </tr>
                              <tr>
                                <td className="py-2 font-bold text-zinc-900">Yamaha Factor 150 (#03)</td>
                                <td className="font-mono text-zinc-500">FRO1A33</td>
                                <td><span className="px-1.5 py-0.5 rounded-full text-[8px] bg-emerald-100 text-emerald-600 font-bold">Disponível</span></td>
                                <td>-</td>
                                <td>
                                  <button
                                    onClick={() => {
                                      setSelectedMotoId('moto-antonio-3');
                                      setClientActiveTab('catalog');
                                    }}
                                    className="text-zinc-500 hover:underline font-bold text-[10px]"
                                  >
                                    Orçar
                                  </button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* BLOCK C: HISTÓRICO DE OS */}
                  <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm space-y-4">
                    <div className="pb-3 border-b border-zinc-150">
                      <h4 className="font-black text-sm text-zinc-950 uppercase tracking-tight flex items-center gap-1.5">
                        <History className="w-4 h-4 text-brand-orange" />
                        c) Histórico de OS & Sumário de Serviços
                      </h4>
                      <p className="text-[11px] text-zinc-500">
                        Histórico completo de revisões executadas com tipo de atendimento e certificado de garantia.
                      </p>
                    </div>

                    {historicalOSList.length > 0 ? (
                      <div className="space-y-3">
                        {historicalOSList.map((hist) => (
                          <div
                            key={hist.id}
                            className="p-4 border border-zinc-150 bg-zinc-50/50 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left"
                          >
                            <div className="space-y-2 flex-1">
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-[9px] font-mono font-bold bg-zinc-200 text-zinc-700 px-1.5 py-0.5 rounded">
                                    {hist.id}
                                  </span>
                                  <h5 className="font-extrabold text-sm text-zinc-900 leading-snug">{hist.title}</h5>
                                </div>
                                <p className="text-[11px] text-zinc-500">
                                  Mecânico Responsável: <strong className="text-zinc-700">{hist.mechanic}</strong> • Realizado em: <strong className="text-zinc-700">{hist.date}</strong>
                                </p>
                              </div>

                              {/* Sumário de Serviços Executados */}
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Serviços Executados:</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {hist.executedServices && hist.executedServices.length > 0 ? (
                                    hist.executedServices.map((srv, idx) => (
                                      <span key={`${srv}-${idx}`} className="text-[9px] bg-zinc-100 border border-zinc-200 text-zinc-700 px-2 py-0.5 rounded-full font-bold">
                                        🛠️ {srv}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-[9px] bg-zinc-100 border border-zinc-200 text-zinc-700 px-2 py-0.5 rounded-full font-bold">
                                      🛠️ {hist.title}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Details: Tipo de Serviço, Garantia */}
                              <div className="grid grid-cols-2 gap-4 pt-1 border-t border-zinc-150/50 text-[11px]">
                                <div className="space-y-0.5">
                                  <span className="text-zinc-400 block text-[9px] font-bold uppercase tracking-wider">Tipo de Atendimento</span>
                                  <span className="font-extrabold text-zinc-800 flex items-center gap-1">
                                    {hist.serviceType === 'Pronto Atendimento' ? '⚡' : '📅'} {hist.serviceType}
                                  </span>
                                </div>
                                <div className="space-y-0.5">
                                  <span className="text-zinc-400 block text-[9px] font-bold uppercase tracking-wider">Garantia Técnica</span>
                                  <span className="font-extrabold text-emerald-600 flex items-center gap-1">
                                    🛡️ {hist.warranty}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end w-full md:w-auto pt-3 md:pt-0 border-t md:border-none border-zinc-200 shrink-0 gap-1">
                              <span className="font-black text-base text-brand-orange">R$ {hist.price},00</span>
                              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                                <Check className="w-3 h-3 text-emerald-600" /> Atendido com Sucesso
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-450 py-6 text-center bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                        Nenhum reparo concluído registrado anteriormente nesta moto.
                      </p>
                    )}
                  </div>

                </div>
              </div>
            </motion.div>
          )}

          {/* 2.2 CATALOG TAB */}
          {clientActiveTab === 'catalog' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-left">
              <div className="text-center max-w-2xl mx-auto space-y-3 mb-4">
                <span className="text-xs bg-brand-orange-light text-brand-orange font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-brand-orange/20">
                  Catálogo de Serviços
                </span>
                <h3 className="text-2xl font-black text-zinc-950 tracking-tight">
                  Selecione as manutenções para solicitar orçamentos
                </h3>
                <p className="text-xs text-zinc-500">
                  Selecione os itens desejados para a sua moto. Ao enviar o pedido, mecânicos ativos na sua região enviarão propostas de orçamento personalizadas em tempo real.
                </p>

                {/* Sub-filtering: Pronto Atendimento vs Sob Agendamento */}
                <div className="flex justify-center gap-2 pt-2">
                  <button
                    onClick={() => setFilterCatalogType('all')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      filterCatalogType === 'all'
                        ? 'bg-zinc-900 text-white shadow-sm'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    Ver Tudo
                  </button>
                  <button
                    onClick={() => setFilterCatalogType('pronto')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      filterCatalogType === 'pronto'
                        ? 'bg-brand-orange text-black shadow-sm font-black'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    ⚡ Pronto Atendimento (Serviços Rápidos)
                  </button>
                  <button
                    onClick={() => setFilterCatalogType('agendado')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      filterCatalogType === 'agendado'
                        ? 'bg-zinc-950 text-brand-orange shadow-sm border border-brand-orange/35'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    📅 Sob Agendamento (Complexos)
                  </button>
                </div>
              </div>

              {/* Category tabs */}
              <div className="flex border-b border-zinc-200 mb-8 overflow-x-auto gap-2 pb-1 scrollbar-none">
                {['Todos os Serviços', 'Mais Pedidos', 'Mecânica Rápida', 'Transmissão & Freios'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      logEvent('Google Analytics', 'gtag("event", "select_category")', { category: cat });
                    }}
                    className={`py-2 px-4 font-bold text-xs rounded-full transition-all whitespace-nowrap ${
                      activeCategory === cat
                        ? 'bg-brand-orange text-black shadow font-black'
                        : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Menu Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map(srv => {
                  const inCartQty = cart.find(item => item.service.id === srv.id)?.quantity || 0;
                  return (
                    <div 
                      key={srv.id} 
                      className="bg-white border border-zinc-200 rounded-3xl p-5 flex flex-col justify-between gap-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                    >
                      {/* Floating estimated time badge */}
                      <span className="absolute top-3 left-3 bg-black/80 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 z-10 font-mono">
                        <Clock className="w-3 h-3 text-brand-orange" />
                        {srv.time} min
                      </span>

                      {/* Service illustration */}
                      <div className="h-32 rounded-2xl overflow-hidden border border-zinc-100 relative bg-zinc-50">
                        <img 
                          src={srv.image} 
                          alt={srv.name} 
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-103"
                          style={srv.id === 'srv-1' ? { objectPosition: '50% 82%' } : undefined}
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Text content */}
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-xs text-zinc-950 tracking-tight leading-snug">
                          {srv.name}
                        </h4>
                        <p className="text-zinc-500 text-[11px] leading-relaxed line-clamp-2">
                          {srv.description}
                        </p>
                      </div>

                      {/* Pricing and cart addition button */}
                      <div className="flex justify-between items-center pt-2 border-t border-zinc-100">
                        <div>
                          <span className="text-[9px] text-zinc-400 block uppercase font-bold tracking-wider">Atendimento</span>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full inline-block ${
                            srv.formaAtendimento === 'Pronto Atendimento' ? 'bg-emerald-100 text-emerald-850 border border-emerald-200' : 'bg-blue-100 text-blue-850 border border-blue-200'
                          }`}>
                            {srv.formaAtendimento}
                          </span>
                        </div>

                        {inCartQty > 0 ? (
                          <div className="flex items-center gap-2 bg-zinc-900 text-white rounded-xl p-1 border border-zinc-800">
                            <button
                              onClick={() => removeFromCart(srv.id)}
                              className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-bold text-[11px] px-1">{inCartQty}</span>
                            <button
                              onClick={() => addToCart(srv)}
                              className="w-6 h-6 flex items-center justify-center text-brand-orange hover:text-white hover:bg-zinc-800 rounded-lg"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(srv)}
                            className="bg-brand-orange hover:bg-brand-orange-hover text-black font-extrabold text-[10px] py-1.5 px-3 rounded-lg flex items-center gap-1 transition-all active:scale-97 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" /> Adicionar ao Orçamento
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* 2.3 ACTIVE TRACKING TAB */}
          {clientActiveTab === 'tracking' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-left">
              
              {activeTracking ? (
                <>
                  {/* SEARCHING STATE */}
                  {(quoteStatus === 'searching' || quoteStatus === 'idle') && (
                    <div className="bg-zinc-950 text-white rounded-3xl p-8 border border-zinc-800 shadow-2xl text-center space-y-6 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-brand-orange animate-pulse"></div>
                      <div className="py-10 space-y-6 flex flex-col items-center">
                        <div className="relative flex items-center justify-center w-28 h-28">
                          <span className="absolute inline-flex h-full w-full rounded-full bg-brand-orange/10 animate-ping" style={{ animationDuration: '2s' }}></span>
                          <span className="absolute inline-flex h-4/5 w-4/5 rounded-full bg-brand-orange/20 animate-ping" style={{ animationDuration: '1.5s' }}></span>
                          <div className="relative rounded-full w-16 h-16 bg-zinc-900 border border-brand-orange flex items-center justify-center text-3xl shadow-inner shadow-brand-orange/20">
                            📡
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-lg font-black text-white uppercase tracking-tight">
                            Buscando mecânicos disponíveis...
                          </h4>
                          <p className="text-xs text-zinc-200 max-w-md mx-auto">
                            Disparando o seu pedido de orçamento para furgões-oficina ativos dentro do raio operacional de <strong className="text-brand-orange font-mono text-sm">{adminRadius} km</strong>.
                          </p>
                        </div>

                        <div className="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-850/80 max-w-sm w-full space-y-2 text-xs">
                          <div className="flex items-center justify-between text-[11px] text-zinc-500">
                            <span>Região de Busca:</span>
                            <span className="font-bold text-zinc-300">{checkoutAddress.split(',')[0]}</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-zinc-500">
                            <span>Status do Painel:</span>
                            <span className="text-emerald-500 font-bold flex items-center gap-1 animate-pulse">
                              ● Buscando Profissionais Ativos...
                            </span>
                          </div>
                        </div>

                        <p className="text-[10px] text-zinc-500 animate-pulse">
                          Aguardando respostas e propostas de orçamento...
                        </p>
                      </div>
                    </div>
                  )}

                  {/* PROPOSALS LIST STATE */}
                  {quoteStatus === 'proposals' && (
                    <div className="bg-zinc-950 text-white rounded-3xl p-6 border border-zinc-800 shadow-2xl space-y-6">
                      <div className="flex justify-between items-center pb-4 border-b border-zinc-900">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                            </span>
                            <h4 className="font-bold text-sm text-zinc-300">
                              PROPOSTAS DE ORÇAMENTO RECEBIDAS ({adminRadius} KM)
                            </h4>
                          </div>
                          <p className="text-xs text-zinc-400">
                            Os seguintes mecânicos móveis estão disponíveis no raio de atendimento e enviaram suas propostas de mão de obra:
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                          {
                            id: 'prop-danilo',
                            mechanicName: 'Danilo Silva',
                            rating: 4.9,
                            reviewsCount: 142,
                            distance: '2.4 km',
                            price: 85,
                            arrivalMinutes: 12,
                            vehicle: 'Furgão Oficina Móvel #02',
                            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'
                          },
                          {
                            id: 'prop-carlos',
                            mechanicName: 'Carlos Santos',
                            rating: 4.8,
                            reviewsCount: 98,
                            distance: '1.2 km',
                            price: 75,
                            arrivalMinutes: 8,
                            vehicle: 'Furgão Oficina Móvel #05',
                            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100'
                          },
                          {
                            id: 'prop-joao',
                            mechanicName: 'João Souza',
                            rating: 4.7,
                            reviewsCount: 65,
                            distance: '4.1 km',
                            price: 90,
                            arrivalMinutes: 15,
                            vehicle: 'Furgão Oficina Móvel #09',
                            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100'
                          }
                        ].map((bid) => (
                          <div key={bid.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between gap-4 hover:border-brand-orange transition-all duration-300">
                            <div className="flex items-center gap-3">
                              <img src={bid.avatar} alt={bid.mechanicName} className="w-12 h-12 rounded-full object-cover border border-zinc-800" referrerPolicy="no-referrer" />
                              <div className="text-left">
                                <h5 className="font-extrabold text-sm text-white">{bid.mechanicName}</h5>
                                <p className="text-[10px] text-zinc-300">{bid.vehicle}</p>
                                <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold mt-0.5">
                                  <span>★</span>
                                  <span>{bid.rating}</span>
                                  <span className="text-zinc-500 font-normal">({bid.reviewsCount})</span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2 border-t border-b border-zinc-800 py-3 text-left text-xs text-zinc-300">
                              <div className="flex justify-between">
                                <span>Distância:</span>
                                <strong className="text-white">{bid.distance}</strong>
                              </div>
                              <div className="flex justify-between">
                                <span>Tempo estimado:</span>
                                <strong className="text-white">~ {bid.arrivalMinutes} min</strong>
                              </div>
                              <div className="flex justify-between items-center text-sm pt-1 border-t border-zinc-800/30">
                                <span className="font-bold text-zinc-300">Mão de Obra:</span>
                                <strong className="text-brand-orange text-base font-black">R$ {bid.price},00</strong>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                setSelectedProposal(bid);
                                setQuoteStatus('approved');
                                triggerToast(`Orçamento aprovado com sucesso! ${bid.mechanicName} está se deslocando.`);
                              }}
                              className="w-full bg-brand-orange hover:bg-brand-orange-hover text-black font-extrabold py-2.5 rounded-xl text-xs transition-all cursor-pointer"
                            >
                              ✓ Aprovar Orçamento
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ACTIVE REPAIR TRACKING STATE */}
                  {quoteStatus === 'approved' && (
                    <div className="bg-zinc-950 text-white rounded-3xl p-5 md:p-6 border border-zinc-800 shadow-2xl space-y-6">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-zinc-900">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="relative flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                            </span>
                            <h4 className="font-bold text-sm text-zinc-300">
                              ACOMPANHAMENTO DO ATENDIMENTO EM TEMPO REAL
                            </h4>
                          </div>
                          <p className="text-xs text-zinc-200">
                            Seu mecânico <strong>{selectedProposal?.mechanicName || 'Danilo Silva'}</strong> ({selectedProposal?.vehicle || 'Furgão Oficina Móvel #02'}) já está em rota ativa para o endereço solicitado.
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setShowLiveCamera(!showLiveCamera);
                              logEvent('Google Analytics', 'gtag("event", "toggle_live_camera")', { show: !showLiveCamera });
                            }}
                            className={`text-xs px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                              showLiveCamera
                                ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                                : 'bg-zinc-850 hover:bg-zinc-800 text-white border border-zinc-700'
                            }`}
                          >
                            <Camera className="w-3.5 h-3.5" />
                            {showLiveCamera ? 'Desligar Câmera ao Vivo' : '🎥 Assistir Câmera ao Vivo da Van'}
                          </button>
                          <button
                            onClick={() => {
                              setActiveTracking(false);
                              setShowLiveCamera(false);
                              setQuoteStatus('idle');
                            }}
                            className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 hover:text-white p-2 rounded-xl"
                            title="Fechar Visualização"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                        
                        {/* Routing Map utilizing Google Maps and computing live routes */}
                        <div className="lg:col-span-8 space-y-4 flex flex-col justify-between">
                          <div className="space-y-2 relative">
                            <div className="relative">
                              <RoutingMap
                                vanLocation={vanPos} // Simulated dynamic live movement
                                clientLocation={{ lat: -22.9110, lng: -47.0560 }} // Campinas Client Home
                                clientName={clientUser?.name || 'Cliente'}
                                height="320px"
                                onRouteComputed={(dist, dur) => {
                                  setRouteDistance(dist);
                                  setRouteDuration(dur);
                                }}
                              />
                              {/* Overlay stats card */}
                              <div className="absolute top-3 left-3 bg-zinc-950/95 border border-zinc-800 p-3 rounded-xl text-xs font-mono text-zinc-300 z-10 pointer-events-none space-y-1 shadow-lg max-w-[200px]">
                                <p className="font-bold text-brand-orange flex items-center gap-1">
                                  <span className="w-2 h-2 bg-brand-orange rounded-full animate-ping"></span> 
                                  {selectedProposal?.mechanicName || 'Danilo Silva'}
                                </p>
                                <p>Distância: <strong className="text-white">{routeDistance || selectedProposal?.distance || '2.4 km'}</strong></p>
                                <p>Tempo Restante: <strong className="text-white">{routeDuration || (selectedProposal ? `${selectedProposal.arrivalMinutes} min` : '12 min')}</strong></p>
                                <p>Mão de Obra: <strong className="text-brand-orange">R$ {selectedProposal?.price || 85},00</strong></p>
                              </div>
                            </div>
                            <div className="text-[10px] text-zinc-500 text-left font-mono">
                              📍 Endereço de Atendimento: {checkoutAddress} • Veículo Selecionado: {checkoutMoto}
                            </div>
                          </div>

                          {/* Mechanic Live Chat Panel */}
                          <div className="bg-zinc-900 border border-zinc-850 rounded-2xl p-4 flex flex-col justify-between space-y-3 text-left">
                            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                              <div className="flex items-center gap-2">
                                <div className="relative">
                                  <img 
                                    src={selectedProposal?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'} 
                                    alt="Mechanic" 
                                    className="w-8 h-8 rounded-full object-cover border border-zinc-800"
                                    referrerPolicy="no-referrer"
                                  />
                                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-zinc-900 rounded-full"></span>
                                </div>
                                <div>
                                  <h5 className="text-xs font-bold text-white">{selectedProposal?.mechanicName || 'Danilo Silva'}</h5>
                                  <p className="text-[10px] text-zinc-450">Franqueado OttoMotos Ativo • Conectado</p>
                                </div>
                              </div>
                              <span className="text-[10px] bg-zinc-800 text-zinc-300 font-mono px-2 py-0.5 rounded-full">
                                Chat Oficial Criptografado
                              </span>
                            </div>

                            {/* Messages area */}
                            <div className="h-44 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                              {chatMessages.map((msg, idx) => (
                                <div 
                                  key={idx} 
                                  className={`flex flex-col max-w-[85%] ${msg.sender === 'client' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                                >
                                  <div className={`p-2.5 rounded-xl text-xs ${
                                    msg.sender === 'client' 
                                      ? 'bg-brand-orange text-black font-medium rounded-tr-none' 
                                      : 'bg-zinc-800 text-zinc-200 rounded-tl-none'
                                  }`}>
                                    {msg.text}
                                  </div>
                                  <span className="text-[8px] text-zinc-500 mt-0.5 font-mono">{msg.time}</span>
                                </div>
                              ))}

                              {isMechanicTyping && (
                                <div className="flex items-center gap-1 text-xs text-zinc-500 italic animate-pulse">
                                  <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"></span>
                                  <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                  <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                                  <span className="text-[10px] ml-1">{selectedProposal?.mechanicName || 'Danilo'} está digitando...</span>
                                </div>
                              )}
                            </div>

                            {/* Chat input form */}
                            <form onSubmit={handleSendChatMessage} className="flex gap-2 border-t border-zinc-800 pt-2">
                              <input
                                type="text"
                                placeholder="Envie uma mensagem direta para o mecânico..."
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-orange placeholder-zinc-500"
                              />
                              <button
                                type="submit"
                                className="bg-brand-orange hover:bg-brand-orange-hover text-black p-2 rounded-xl transition-all flex items-center justify-center cursor-pointer"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                            </form>
                          </div>
                        </div>

                        {/* Left Sidebar: Status info & live camera simulator */}
                        <div className="lg:col-span-4 flex flex-col justify-between bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
                          
                          {/* Live Camera View simulator if active */}
                          {showLiveCamera ? (
                            <div className="space-y-3 animate-fadeIn text-left flex-1 flex flex-col justify-between">
                              <div className="space-y-1">
                                <span className="text-[10px] font-black uppercase text-red-500 tracking-wider flex items-center gap-1 animate-pulse">
                                  <Eye className="w-3.5 h-3.5" /> Monitoramento ao Vivo por Câmera
                                </span>
                                <p className="text-[11px] text-zinc-400 leading-relaxed">
                                  Alterne entre as câmeras da bancada móvel e do para-brisa para acompanhar todo o processo de reparo.
                                </p>
                              </div>

                              {/* Camera Feed Screen */}
                              <div className="relative h-44 rounded-xl overflow-hidden border border-zinc-800 bg-black flex items-center justify-center">
                                <img 
                                  src={
                                    selectedCamera === 'van'
                                      ? "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=400" // Van road dashboard
                                      : "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=400" // Repair workbench
                                  } 
                                  alt="Live camera stream feed"
                                  className="w-full h-full object-cover opacity-65"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute top-2 left-2 bg-red-600 text-white font-mono font-bold text-[8px] px-1.5 py-0.5 rounded flex items-center gap-1 animate-pulse">
                                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                                  REC AO VIVO
                                </div>
                                <div className="absolute top-2 right-2 bg-black/75 px-1.5 py-0.5 rounded text-[8px] text-zinc-400 font-mono">
                                  {selectedCamera === 'van' ? 'CAM_01_VAN_DASH' : 'CAM_02_WORKBENCH'}
                                </div>
                                <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-0.5 rounded text-[9px] text-zinc-300 font-mono">
                                  {selectedCamera === 'van' 
                                    ? `🚐 Furgão Móvel em Deslocamento`
                                    : `🔧 Reparo Ativo da Moto ${checkoutMoto}`
                                  }
                                </div>
                              </div>

                              {/* Camera switcher buttons */}
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  type="button"
                                  onClick={() => setSelectedCamera('van')}
                                  className={`py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all ${
                                    selectedCamera === 'van'
                                      ? 'bg-brand-orange text-black font-extrabold'
                                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-750'
                                  }`}
                                >
                                  Câmera 1 (Van / Rota)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSelectedCamera('repair')}
                                  className={`py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all ${
                                    selectedCamera === 'repair'
                                      ? 'bg-brand-orange text-black font-extrabold'
                                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-750'
                                  }`}
                                >
                                  Câmera 2 (Bancada)
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-850/80 space-y-3 text-left">
                              <h5 className="font-bold text-xs text-white uppercase tracking-wider">Câmera de Monitoramento</h5>
                              <p className="text-[11px] text-zinc-400 leading-relaxed">
                                Nossas furgões-oficina possuem duas câmeras digitais de segurança para gravação contínua. Assista à rota do mecânico ou veja o reparo ao vivo na bancada de qualquer lugar!
                              </p>
                              <button
                                onClick={() => {
                                  setShowLiveCamera(true);
                                  setSelectedCamera('van');
                                }}
                                className="text-xs text-brand-orange hover:text-brand-orange-hover font-bold flex items-center gap-1"
                              >
                                Ativar transmissão ao vivo <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}

                          {/* Service status milestones */}
                          <div className="space-y-2.5 text-left pt-3 border-t border-zinc-850">
                            <div className="flex items-center gap-2.5 text-xs text-emerald-400">
                              <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center font-bold">✓</div>
                              <span>Orçamento Aprovado (R$ {selectedProposal?.price || 85},00)</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-xs text-brand-orange">
                              <div className="w-5 h-5 rounded-full bg-brand-orange-light flex items-center justify-center font-bold animate-pulse">🚐</div>
                              <span>Em Rota / Deslocando (~ {routeDuration || (selectedProposal ? `${selectedProposal.arrivalMinutes} min` : '12 min')})</span>
                            </div>
                            <div className="flex items-center gap-2.5 text-xs text-zinc-500">
                              <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center font-bold">3</div>
                              <span>Execução & Câmera na Bancada</span>
                            </div>
                          </div>

                        </div>

                      </div>

                      {/* Cancellation policy alert */}
                      <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-2xl flex items-start gap-3 text-xs text-yellow-300">
                        <Info className="w-5 h-5 shrink-0 text-yellow-500" />
                        <p className="leading-relaxed">
                          <strong>Política de Cancelamento Justo:</strong> O cancelamento de ordens solicitadas é 100% gratuito se efetuado em até <strong>30 minutos</strong> a partir do agendamento. Se o cancelamento for solicitado após esse limite de tempo ou após a chegada da furgão-oficina no local, será faturada uma taxa de deslocamento operacional de <strong>R$ {displacementTax},00</strong> para ressarcimento dos insumos do franqueado.
                        </p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-12 bg-zinc-50 border border-zinc-200 rounded-3xl text-center max-w-xl mx-auto space-y-4">
                  <div className="w-12 h-12 rounded-full bg-zinc-200 text-zinc-500 flex items-center justify-center mx-auto text-xl">
                    📍
                  </div>
                  <h4 className="font-extrabold text-base text-zinc-950">Acompanhamento Inativo</h4>
                  <p className="text-xs text-zinc-500 max-w-md mx-auto px-4">
                    Não há nenhuma furgão oficina se deslocando até você no momento. Solicite as manutenções necessárias na aba de catálogo e conclua o agendamento para iniciar o tracking ao vivo.
                  </p>
                  <button
                    onClick={() => setClientActiveTab('catalog')}
                    className="bg-brand-orange hover:bg-brand-orange-hover text-black font-black py-2.5 px-5 rounded-xl text-xs transition-all shadow"
                  >
                    Montar Orçamento de Serviços
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* 2.4 FIDELIDADE TAB */}
          {clientActiveTab === 'fidelidade' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Points Card */}
                <div className="bg-zinc-950 text-white rounded-3xl p-6 border border-zinc-800 shadow-xl space-y-5">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[10px] bg-brand-orange text-black font-black px-2 py-0.5 rounded uppercase tracking-wider">
                        OttoClub Premium
                      </span>
                      <h4 className="font-extrabold text-lg">Pontos Acumulados</h4>
                      <p className="text-xs text-zinc-400">Acumule pontos em cada reparo de frota ou particular!</p>
                    </div>
                    <Award className="w-10 h-10 text-brand-orange animate-bounce" />
                  </div>

                  <div className="py-2">
                    <span className="text-4xl font-black text-white">{clientUser.points}</span>
                    <span className="text-zinc-500 text-xs block pt-1">Cada R$ 1,00 em serviços convertem-se em 1 ponto.</span>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-zinc-900">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Recompensa Disponível:</span>
                    
                    {clientUser.points >= 1000 ? (
                      <div className="p-3 bg-brand-orange/10 border border-brand-orange/20 rounded-xl space-y-2 animate-fadeIn">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-brand-orange flex items-center gap-1">
                            <Sparkles className="w-4 h-4" /> Moto Reserva Mottu Pronta para Uso!
                          </span>
                          <span className="bg-brand-orange text-black font-bold text-[8px] px-1.5 py-0.5 rounded">Resgatável</span>
                        </div>
                        <p className="text-[11px] text-zinc-300 leading-normal">
                          Como você possui mais de 1000 pontos no OttoClub, você tem o benefício exclusivo de acionar uma moto reserva totalmente grátis para não interromper seu trabalho ou entregas!
                        </p>
                        <button
                          onClick={() => triggerToast('Sua solicitação de Moto Reserva (MOTTU) foi registrada! Nossa van trará a moto reserva acoplada.')}
                          className="w-full bg-brand-orange hover:bg-brand-orange-hover text-black font-black py-2 rounded-lg text-xs transition-all shadow"
                        >
                          Acionar Moto Reserva Mottu Grátis
                        </button>
                      </div>
                    ) : (
                      <div className="p-3 bg-zinc-900 border border-zinc-850 rounded-xl text-xs space-y-2">
                        <div className="flex justify-between text-zinc-400">
                          <span>Moto Reserva Mottu Grátis</span>
                          <span className="font-mono text-zinc-500">850 / 1000 pts</span>
                        </div>
                        <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-brand-orange h-full rounded-full" style={{ width: '85%' }}></div>
                        </div>
                        <p className="text-[10px] text-zinc-500">
                          Faltam apenas <strong>150 pontos</strong> para você habilitar a Moto Reserva Mottu integrada em seu próximo atendimento móvel!
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Indique e Ganhe Card */}
                <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm space-y-5 flex flex-col justify-between">
                  <div className="space-y-2 text-left">
                    <span className="text-[10px] bg-brand-orange-light text-brand-orange font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      Ganhe Descontos
                    </span>
                    <h4 className="font-extrabold text-base text-zinc-900 flex items-center gap-1.5">
                      <Share2 className="w-4 h-4 text-brand-orange" />
                      Programa de Indicação OttoMotos
                    </h4>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Compartilhe seu link exclusivo com outros motociclistas ou frotistas de Campinas e região. Toda vez que um indicado realizar a primeira revisão na van, você ganha <strong>R$ 20,00 de saldo</strong> e seu indicado ganha <strong>10% de desconto</strong>!
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-zinc-100">
                    <label className="text-[10px] text-zinc-400 block font-bold uppercase tracking-wider">Seu Link Compartilhável:</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={`https://my.ottomotos.com/join/OTTO_${clientUser.name.split(' ')[0].toUpperCase()}_${clientUser.points}`}
                        className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs font-mono text-zinc-600 select-all focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`https://my.ottomotos.com/join/OTTO_${clientUser.name.split(' ')[0].toUpperCase()}_${clientUser.points}`);
                          triggerToast('Link copiado para a área de transferência!');
                        }}
                        className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-sm flex items-center gap-1 shrink-0"
                      >
                        Copiar
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

        </div>
      )}

      {/* Floating toast notification banner */}
      <AnimatePresence>
        {localToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-6 z-50 bg-zinc-900 border border-zinc-800 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 max-w-sm text-left text-xs font-semibold"
          >
            <Sparkles className="w-4 h-4 text-brand-orange shrink-0 animate-spin" style={{ animationDuration: '3s' }} />
            <span>{localToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING SACOLA DE SERVIÇOS (iFood Cart widget) */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 right-6 z-30 animate-bounce">
          <button
            onClick={() => setIsCartOpen(true)}
            className="bg-brand-orange text-black font-extrabold px-5 py-4 rounded-full shadow-2xl flex items-center gap-2 hover:scale-105 active:scale-97 transition-all border-4 border-white text-xs"
          >
            <ShoppingBag className="w-5 h-5 text-black" />
            Sacola de Orçamentos ({cart.reduce((sum, item) => sum + item.quantity, 0)})
            <span className="bg-black text-brand-orange text-[10px] px-2.5 py-1 rounded-full font-black ml-1 shadow-inner uppercase tracking-wider">
              Solicitar
            </span>
          </button>
        </div>
      )}

      {/* SACOLA DRAWER MODAL */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
            <div className="absolute inset-0" onClick={() => setIsCartOpen(false)}></div>
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="relative w-full max-w-md bg-white h-full shadow-2xl border-l border-zinc-200 flex flex-col justify-between text-left z-10"
            >
              {/* Header */}
              <div className="p-5 border-b border-zinc-100 flex justify-between items-center bg-zinc-50">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-brand-orange" />
                  <h4 className="font-black text-sm text-zinc-950 uppercase tracking-tight">Sua Sacola OttoMotos</h4>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-zinc-200 text-zinc-400 hover:text-zinc-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Items list */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cart.map(item => (
                  <div key={item.service.id} className="flex gap-4 pb-4 border-b border-zinc-100 items-start text-xs">
                    <div className="w-16 h-12 rounded-lg overflow-hidden border border-zinc-200 shrink-0 bg-zinc-50">
                      <img src={item.service.image} alt={item.service.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <h5 className="font-extrabold text-xs text-zinc-950 leading-tight">
                        {item.service.name}
                      </h5>
                      <p className="text-[10px] text-zinc-400">Tempo estimado: {item.service.time} min</p>
                      <span className="text-[10px] bg-brand-orange/10 text-brand-orange border border-brand-orange/20 px-1.5 py-0.5 rounded font-black uppercase tracking-wider block w-fit">
                        {item.service.formaAtendimento}
                      </span>
                    </div>

                    {/* Quantities */}
                    <div className="flex items-center gap-1.5 bg-zinc-100 rounded-lg p-1 border border-zinc-200 shrink-0">
                      <button
                        onClick={() => removeFromCart(item.service.id)}
                        className="w-5 h-5 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 rounded"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold text-[11px] px-1">{item.quantity}</span>
                      <button
                        onClick={() => addToCart(item.service)}
                        className="w-5 h-5 flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 rounded"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Actions */}
              <div className="p-5 border-t border-zinc-100 bg-zinc-50 space-y-2 text-xs">
                <div className="space-y-1.5 pb-3">
                  <div className="bg-brand-orange/10 border border-brand-orange/15 p-3 rounded-xl mb-2 text-zinc-850 text-[11px] leading-relaxed">
                    Você está solicitando um <strong>orçamento sob demanda</strong>. O pedido será encaminhado para todos os mecânicos no raio de <span className="font-bold text-brand-orange font-mono">{adminRadius} km</span>.
                  </div>
                  <div className="flex justify-between text-[10px] text-zinc-500 font-bold">
                    <span>Tempo de execução:</span>
                    <span className="font-mono text-zinc-900">{cart.reduce((sum, item) => sum + (item.service.time * item.quantity), 0)} min</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-zinc-500 font-bold pb-2 border-b border-zinc-200">
                    <span>Mecânicos na região:</span>
                    <span className="text-emerald-600 font-extrabold flex items-center gap-1">🟢 Ativos e Filtrados</span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-brand-orange pt-1.5">
                    <span>Orçamento Estimado:</span>
                    <span>Sob Proposta</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowCheckoutModal(true);
                    logEvent('Google Analytics', 'gtag("event", "begin_checkout")', { value: 0 });
                  }}
                  className="w-full bg-brand-orange hover:bg-brand-orange-hover text-black font-black py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all text-xs shadow cursor-pointer"
                >
                  <Check className="w-4 h-4" /> Solicitar Propostas de Orçamento
                </button>
                <button
                  onClick={clearCart}
                  className="w-full text-center text-[10px] font-bold text-zinc-500 hover:text-zinc-800 py-1"
                >
                  Limpar Sacola
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CHECKOUT MODAL */}
      <AnimatePresence>
        {showCheckoutModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl text-left"
            >
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-450 hover:text-zinc-900"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
                  <div className="w-8 h-8 rounded-full bg-brand-orange-light text-brand-orange flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-zinc-950 font-sans uppercase tracking-tight">Formulário de Agendamento</h4>
                    <p className="text-[10px] text-zinc-400">Preencha os dados de localização para despacho do furgão.</p>
                  </div>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  setShowCheckoutModal(false);
                  setIsCartOpen(false);
                  setClientActiveTab('tracking');
                  setActiveTracking(true);
                  setQuoteStatus('searching');
                  setSelectedProposal(null);
                  triggerToast('Enviando solicitação de orçamento para mecânicos ativos...');
                  setCart([]);
                }} className="space-y-4 text-xs font-medium">
                  
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-zinc-500 block">Nome do Proprietário / Responsável</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Carol Silva"
                      value={checkoutName}
                      onChange={(e) => setCheckoutName(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-900 font-bold focus:bg-white focus:outline-none focus:border-brand-orange"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-zinc-500 block">Telefone para Contato (WhatsApp)</label>
                    <input
                      type="tel"
                      required
                      placeholder="Ex: (11) 98765-4321"
                      value={checkoutPhone}
                      onChange={(e) => setCheckoutPhone(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-900 font-bold focus:bg-white focus:outline-none focus:border-brand-orange"
                    />
                  </div>

                  {/* Moto model selection */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-zinc-500 block">Modelo da Moto</label>
                      <input
                        type="text"
                        required
                        value={checkoutMoto}
                        onChange={(e) => setCheckoutMoto(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-900 font-bold focus:bg-white focus:outline-none focus:border-brand-orange"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-zinc-500 block">Placa (Opcional)</label>
                      <input
                        type="text"
                        placeholder="Ex: ABC1D23"
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-900 font-bold focus:bg-white focus:outline-none focus:border-brand-orange"
                      />
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="space-y-1">
                    <label className="text-zinc-500 block">Endereço Completo (Domicílio, Trabalho ou Via Pública)</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Av. Francisco Glicério, 1500 - Centro, Campinas - SP"
                      value={checkoutAddress}
                      onChange={(e) => setCheckoutAddress(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-900 font-bold focus:bg-white focus:outline-none focus:border-brand-orange"
                    />
                  </div>

                  {/* Payment Method simulation */}
                  <div className="space-y-1">
                    <label className="text-zinc-500 block">Forma de Pagamento (Paga apenas após o serviço concluído)</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setCheckoutPayment('cartao')}
                        className={`border rounded-xl p-3 flex flex-col items-center gap-1 cursor-pointer transition-all ${
                          checkoutPayment === 'cartao'
                            ? 'border-brand-orange bg-brand-orange-light/50 text-brand-orange'
                            : 'border-zinc-200 hover:bg-zinc-50 bg-white text-zinc-900'
                        }`}
                      >
                        <span className="font-extrabold text-[11px] flex items-center gap-1">💳 Cartão</span>
                        <span className={`text-[9px] ${checkoutPayment === 'cartao' ? 'text-brand-orange' : 'text-zinc-400'}`}>Na Maquininha</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCheckoutPayment('pix')}
                        className={`border rounded-xl p-3 flex flex-col items-center gap-1 cursor-pointer transition-all ${
                          checkoutPayment === 'pix'
                            ? 'border-brand-orange bg-brand-orange-light/50 text-brand-orange'
                            : 'border-zinc-200 hover:bg-zinc-50 bg-white text-zinc-900'
                        }`}
                      >
                        <span className="font-extrabold text-[11px] flex items-center gap-1">⚡ Pix</span>
                        <span className={`text-[9px] ${checkoutPayment === 'pix' ? 'text-brand-orange' : 'text-zinc-400'}`}>QR Code</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-brand-orange-light border border-brand-orange/15 rounded-xl p-3 text-[10px] text-zinc-700 leading-normal">
                    💡 <strong>Garantia de Transparência:</strong> Sua solicitação de orçamento será disparada para os mecânicos móveis no raio de <strong>{adminRadius} km</strong>. Você poderá analisar as propostas recebidas e escolher a melhor opção diretamente na tela de Acompanhamento.
                  </div>

                  {/* CTA submit */}
                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowCheckoutModal(false)}
                      className="flex-1 border border-zinc-200 hover:bg-zinc-100 text-zinc-600 font-bold py-3.5 rounded-xl text-center"
                    >
                      Voltar à Sacola
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-brand-orange hover:bg-brand-orange-hover text-black font-extrabold py-3.5 rounded-xl text-center shadow-lg hover:scale-101 active:scale-99 transition-all cursor-pointer"
                    >
                      🚀 Disparar Pedido de Orçamento
                    </button>
                  </div>

                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
