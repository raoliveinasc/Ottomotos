import React, { useState, useEffect } from 'react';
import {
  Wrench,
  MapPin,
  Clock,
  Camera,
  Trash2,
  Play,
  Square,
  User,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Check,
  Plus,
  Edit2,
  Truck,
  FileText,
  ChevronRight,
  RefreshCw,
  Sliders,
  Shield,
  Activity,
  Menu,
  X,
  Compass,
  Award,
  CheckCircle2,
  Video,
  Database,
  ArrowLeft,
  ChevronDown,
  ExternalLink,
  SlidersHorizontal,
  Layers,
  Archive,
  BarChart3
} from 'lucide-react';

interface MechanicPortalProps {
  onBackToLanding?: () => void;
}

interface ServiceOrderSim {
  id: string;
  clientName: string;
  motoModel: string;
  motoPlate: string;
  serviceName: string;
  estimatedTimeM: number;
  parts: string[];
  address: string;
  status: 'PENDING' | 'IN_ROUTE' | 'CHECKED_IN' | 'REPAIRING' | 'CLOSING' | 'COMPLETED';
}

export default function MechanicPortal({ onBackToLanding }: MechanicPortalProps) {
  // Sidebar states
  const [activeTab, setActiveTab] = useState<'shift' | 'dashboard' | 'me-data' | 'performance'>('dashboard');
  // Navigation sub-view to switch easily between the active OS progress and the overall queue list
  const [dashboardSubView, setDashboardSubView] = useState<'os' | 'list'>('list');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Shift states
  const [isShiftActive, setIsShiftActive] = useState(true); // Default active to showcase dashboard initially
  const [shiftStart, setShiftStart] = useState('08:00');
  const [shiftEnd, setShiftEnd] = useState('17:00');
  const [serviceType, setServiceType] = useState<'mobile' | 'fixed'>('mobile');
  const [deadlineAlert, setDeadlineAlert] = useState(false);
  const [currentTimeSim, setCurrentTimeSim] = useState('16:45'); // Simulated near-end shift time to demonstrate alert

  // Simulated timer for shift deadline alert
  useEffect(() => {
    if (isShiftActive) {
      // Simulate that the current time is close to shiftEnd
      const timer = setTimeout(() => {
        setDeadlineAlert(true);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setDeadlineAlert(false);
    }
  }, [isShiftActive]);

  // ME (Microenterprise) state
  const [meName, setMeName] = useState('Danilo Mecânica ME');
  const [meCnpj, setMeCnpj] = useState('45.289.112/0001-89');
  const [meOwner, setMeOwner] = useState('Danilo Otto dos Santos');
  const [meStatus, setMeStatus] = useState<'Approved' | 'Pending'>('Approved');
  const [isEditingMe, setIsEditingMe] = useState(false);

  const handleSaveMe = (e: React.FormEvent) => {
    e.preventDefault();
    setMeStatus('Pending');
    setIsEditingMe(false);
  };

  // Sample work orders
  const [orders, setOrders] = useState<ServiceOrderSim[]>([
    {
      id: 'OS-8841',
      clientName: 'Carol Silva',
      motoModel: 'Honda CG 160 Fan (2022)',
      motoPlate: 'FHP-8H22',
      serviceName: 'Troca de Óleo e Filtro de Motor',
      estimatedTimeM: 20,
      parts: ['Óleo Mobil Super Moto 10W30 1L', 'Filtro de Óleo Honda'],
      address: 'Av. Francisco Glicério, 1200 - Cambuí, Campinas - SP',
      status: 'PENDING'
    },
    {
      id: 'OS-9214',
      clientName: 'Carlos Motoboy',
      motoModel: 'Yamaha Fazer 250 (2021)',
      motoPlate: 'GJK-3A45',
      serviceName: 'Troca de Pastilha de Freio e Relação',
      estimatedTimeM: 40,
      parts: ['Pastilha de Freio Cobreq', 'Kit de Transmissão Riffel'],
      address: 'Rua Barão de Jaguara, 450 - Centro, Campinas - SP',
      status: 'PENDING'
    },
    {
      id: 'OS-7321',
      clientName: 'Marcos Souza',
      motoModel: 'Honda PCX 150 (2020)',
      motoPlate: 'EEY-9F12',
      serviceName: 'Revisão Básica e Velas',
      estimatedTimeM: 30,
      parts: ['Vela de Ignição NGK', 'Filtro de Ar de Alta Performance'],
      address: 'Shopping Dom Pedro, Estacionamento G3 - Campinas - SP',
      status: 'COMPLETED'
    }
  ]);

  // Active OS state (Work Mode)
  const [selectedOS, setSelectedOS] = useState<ServiceOrderSim | null>(null);
  
  // Stages states: A = Roteamento, B = Vistoria, C = Reparo, D = Entrega/Descarte
  const [stage, setStage] = useState<'A' | 'B' | 'C' | 'D'>('A');

  // Stage B states
  const [preChecklist, setPreChecklist] = useState({
    scratches: false,
    leaks: false,
    tires: false,
    mirrors: false
  });
  const [visualNotes, setVisualNotes] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=300'
  ]);

  // Stage C states
  const [timerRemaining, setTimerRemaining] = useState(1200); // 20 minutes in seconds
  const [timerActive, setTimerActive] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [tasks, setTasks] = useState([
    { id: 'tsk-1', name: 'Realizar dreno do óleo antigo', done: false },
    { id: 'tsk-2', name: 'Substituir o filtro de óleo antigo pelo novo', done: false },
    { id: 'tsk-3', name: 'Abastecer com o novo óleo Mobil 10W30', done: false },
    { id: 'tsk-4', name: 'Verificar nível e fechar bujão com torque adequado', done: false }
  ]);

  // Stage D states
  const [postChecklist, setPostChecklist] = useState({
    brakeTest: false,
    lightsTest: false,
    chainTension: false,
    boltsCheck: false,
    wasteDisposed: false // Mandatory waste management
  });

  // Start OS Work mode
  const handleSelectOS = (os: ServiceOrderSim) => {
    setSelectedOS(os);
    setDashboardSubView('os'); // Ensure the user is taken directly to the active OS workspace
    setStage('A');
    setTimerRemaining(os.estimatedTimeM * 60);
    setTimerActive(false);
    // Reset checklists for the OS
    setPreChecklist({
      scratches: false,
      leaks: false,
      tires: false,
      mirrors: false
    });
    setPostChecklist({
      brakeTest: false,
      lightsTest: false,
      chainTension: false,
      boltsCheck: false,
      wasteDisposed: false
    });
    // Set typical tasks based on OS
    if (os.id === 'OS-9214') {
      setTasks([
        { id: 'tsk-1', name: 'Remover roda traseira e pinça de freio', done: false },
        { id: 'tsk-2', name: 'Substituir pastilhas velhas por novas Cobreq', done: false },
        { id: 'tsk-3', name: 'Remover kit relação antigo (pinhão, coroa e corrente)', done: false },
        { id: 'tsk-4', name: 'Instalar kit relação novo Riffel com torque padrão', done: false },
        { id: 'tsk-5', name: 'Ajustar tensão da corrente e montar roda traseira', done: false }
      ]);
    } else {
      setTasks([
        { id: 'tsk-1', name: 'Realizar dreno do óleo antigo', done: false },
        { id: 'tsk-2', name: 'Substituir o filtro de óleo antigo pelo novo', done: false },
        { id: 'tsk-3', name: 'Abastecer com o novo óleo Mobil 10W30', done: false },
        { id: 'tsk-4', name: 'Verificar nível e fechar bujão com torque adequado', done: false }
      ]);
    }
  };

  // Stage C Timer Countdown loop
  useEffect(() => {
    let interval: any;
    if (timerActive && timerRemaining > 0) {
      interval = setInterval(() => {
        setTimerRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timerRemaining === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerRemaining]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // ME Status and alert check
  const isMeApproved = meStatus === 'Approved';

  // Toggle shift
  const handleToggleShift = () => {
    if (!isShiftActive) {
      setIsShiftActive(true);
      setActiveTab('dashboard');
      setDashboardSubView('list');
    } else {
      setIsShiftActive(false);
      setDeadlineAlert(false);
      setActiveTab('shift');
    }
  };

  return (
    <div className="bg-zinc-100 min-h-screen text-zinc-900 font-sans flex flex-col md:flex-row antialiased selection:bg-brand-orange selection:text-black">
      {/* MOBILE HEADER */}
      <div className="md:hidden bg-zinc-950 text-white flex justify-between items-center px-4 py-3.5 border-b border-zinc-900 w-full shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-orange animate-ping"></span>
          <span className="font-sans font-black tracking-wider text-sm uppercase text-white">
            OTTO<span className="text-brand-orange">MOTOS</span>
          </span>
          <span className="bg-zinc-800 text-[9px] text-zinc-400 font-mono px-1.5 py-0.5 rounded font-bold uppercase">
            Tablet
          </span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          className="p-2 text-zinc-400 hover:text-white transition-colors"
          id="mobile-menu-btn"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* LEFT SIDEBAR (DARK ZINC - CUSTOMER.IO SAAS STYLE) */}
      <aside className={`
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        fixed md:relative top-0 left-0 bottom-0 z-40
        w-64 bg-zinc-950 text-zinc-400 border-r border-zinc-900 flex flex-col justify-between
        transition-transform duration-300 ease-in-out h-full md:h-auto shrink-0
      `}>
        {/* Upper sidebar branding and menu */}
        <div className="flex flex-col">
          {/* Brand header */}
          <div className="p-6 border-b border-zinc-900/60 flex flex-col gap-1 text-left">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-orange flex items-center justify-center font-black text-black text-sm shadow-md select-none">
                Ω
              </div>
              <div>
                <span className="font-sans font-black tracking-widest text-sm text-white block">
                  OTTO<span className="text-brand-orange">MOTOS</span>
                </span>
                <span className="text-[8px] text-zinc-500 font-mono tracking-widest uppercase block -mt-0.5">
                  PARCEIRO • VAN #02
                </span>
              </div>
            </div>
          </div>

          {/* Sidebar Navigation Items */}
          <nav className="p-4 space-y-1 text-left">
            <button
              onClick={() => { setActiveTab('shift'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'shift' 
                  ? 'bg-zinc-900 text-white shadow-sm' 
                  : 'text-zinc-450 hover:text-zinc-200 hover:bg-zinc-900/40'
              }`}
              id="tab-btn-shift"
            >
              <SlidersHorizontal className={`w-4 h-4 ${activeTab === 'shift' ? 'text-brand-orange' : 'text-zinc-500'}`} />
              <span>Configurar Turno</span>
            </button>

            <button
              onClick={() => {
                if (!isShiftActive) {
                  alert('Por favor, ative seu turno primeiro na tela de "Configurar Turno"!');
                  return;
                }
                setActiveTab('dashboard');
                setDashboardSubView('list');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                !isShiftActive ? 'opacity-30 cursor-not-allowed' : ''
              } ${
                activeTab === 'dashboard' 
                  ? 'bg-zinc-900 text-white shadow-sm' 
                  : 'text-zinc-450 hover:text-zinc-200 hover:bg-zinc-900/40'
              }`}
              id="tab-btn-dashboard"
            >
              <div className="flex items-center gap-3">
                <Wrench className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-brand-orange' : 'text-zinc-500'}`} />
                <span>Ordens de Serviço</span>
              </div>
              {isShiftActive && (
                <span className="bg-zinc-900 text-brand-orange font-bold text-[10px] px-2 py-0.5 rounded-full border border-zinc-800">
                  {orders.filter(o => o.status === 'PENDING').length}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('performance'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'performance' 
                  ? 'bg-zinc-900 text-white shadow-sm' 
                  : 'text-zinc-450 hover:text-zinc-200 hover:bg-zinc-900/40'
              }`}
              id="tab-btn-performance"
            >
              <BarChart3 className={`w-4 h-4 ${activeTab === 'performance' ? 'text-brand-orange' : 'text-zinc-500'}`} />
              <span>Rendimento & KPIs</span>
            </button>

            <button
              onClick={() => { setActiveTab('me-data'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'me-data' 
                  ? 'bg-zinc-900 text-white shadow-sm' 
                  : 'text-zinc-450 hover:text-zinc-200 hover:bg-zinc-900/40'
              }`}
              id="tab-btn-me-data"
            >
              <div className="flex items-center gap-3">
                <User className={`w-4 h-4 ${activeTab === 'me-data' ? 'text-brand-orange' : 'text-zinc-500'}`} />
                <span>Dados Cadastrais PJ</span>
              </div>
              <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                isMeApproved ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
              }`}>
                {meStatus === 'Approved' ? 'Ativo' : 'Análise'}
              </span>
            </button>
          </nav>
        </div>

        {/* Lower sidebar user profile switcher */}
        <div className="p-4 border-t border-zinc-900/80 space-y-3">
          {/* Integrated Profile Card with Status Dot */}
          <div className="flex items-center justify-between bg-zinc-900/30 p-2.5 rounded-xl border border-zinc-900/80">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="relative shrink-0">
                <div className="w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center font-black text-black font-sans text-xs shadow-inner">
                  DO
                </div>
                <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-zinc-950 ${
                  isShiftActive ? 'bg-emerald-500' : 'bg-zinc-500'
                }`}></span>
              </div>
              <div className="text-left overflow-hidden">
                <strong className="text-zinc-200 text-xs block font-semibold truncate leading-tight">Danilo Otto</strong>
                <button
                  onClick={handleToggleShift}
                  className={`text-[9px] font-mono block uppercase transition-colors text-left font-semibold ${
                    isShiftActive ? 'text-emerald-400 hover:text-emerald-350' : 'text-zinc-500 hover:text-zinc-400'
                  }`}
                  title="Clique para alternar o sinal"
                >
                  {isShiftActive ? 'Online • Sinal On' : 'Offline • Sinal Off'}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={onBackToLanding}
            className="w-full text-zinc-500 hover:text-zinc-200 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
            id="back-to-landing-btn"
          >
            <ArrowLeft className="w-3 h-3" />
            Sair do Portal
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER PANEL */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-h-screen">
        
        {/* SAAS HEADER AND BREADCRUMB STRIP */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 mb-4 border-b border-zinc-200">
          <div className="text-left font-sans">
            {/* Breadcrumb path */}
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 uppercase tracking-widest font-bold font-mono">
              <span>Painel</span>
              <ChevronRight className="w-2.5 h-2.5 text-zinc-350" />
              <span>Danilo Otto</span>
              <ChevronRight className="w-2.5 h-2.5 text-zinc-350" />
              <span className="text-brand-orange">
                {activeTab === 'shift' && 'Configuração de Turno'}
                {activeTab === 'dashboard' && 'Central de Atendimento'}
                {activeTab === 'me-data' && 'Dados Fiscais'}
                {activeTab === 'performance' && 'Produtividade'}
              </span>
            </div>
            
            <h1 className="text-xl sm:text-2xl font-black text-zinc-900 uppercase tracking-tight mt-1">
              {activeTab === 'shift' && 'Configuração de Expediente'}
              {activeTab === 'dashboard' && (selectedOS && dashboardSubView === 'os' ? `Ordem Ativa: ${selectedOS.id}` : 'Ordens de Serviço')}
              {activeTab === 'me-data' && 'Dados Cadastrais da ME'}
              {activeTab === 'performance' && 'Rendimento & Performance'}
            </h1>
          </div>

          {/* Time and Active OS count simulator */}
          <div className="flex items-center gap-2 bg-white border border-zinc-200/80 shadow-sm px-3.5 py-1.5 rounded-xl text-left">
            <Clock className="w-4 h-4 text-brand-orange shrink-0" />
            <div className="font-mono text-[11px]">
              <span className="text-zinc-400 block uppercase font-bold text-[8px] leading-none">Hora Simulada</span>
              <span className="text-zinc-800 font-bold leading-normal">{currentTimeSim} ({shiftEnd} Limite)</span>
            </div>
          </div>
        </div>

        {/* CUSTOMER.IO INPIRED SAAS METADATA STRIP (BANNER STATE SUMMARY) */}
        <div className="grid grid-cols-2 md:grid-cols-5 bg-white border border-zinc-200/80 rounded-2xl shadow-sm mb-6 divide-y md:divide-y-0 md:divide-x divide-zinc-150 overflow-hidden text-left">
          {/* Block 1: Connection status */}
          <div className="p-4 flex flex-col justify-center">
            <span className="text-[9px] text-zinc-400 uppercase tracking-wider font-mono block">Status do Sinal</span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2 h-2 rounded-full ${isShiftActive ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-350'}`}></span>
              <strong className="text-sm font-black text-zinc-950 uppercase tracking-tight">
                {isShiftActive ? 'Turno Ativo' : 'Offline'}
              </strong>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono mt-0.5">Disponível na Rede</span>
          </div>

          {/* Block 2: Operação */}
          <div className="p-4 flex flex-col justify-center">
            <span className="text-[9px] text-zinc-400 uppercase tracking-wider font-mono block">Modalidade</span>
            <strong className="text-sm font-black text-zinc-950 uppercase tracking-tight mt-1.5">
              {serviceType === 'mobile' ? 'Unidade Móvel' : 'Ponto Fixo'}
            </strong>
            <span className="text-[10px] text-zinc-500 font-mono mt-0.5">OttoVan #02</span>
          </div>

          {/* Block 3: Fila de espera */}
          <div className="p-4 flex flex-col justify-center">
            <span className="text-[9px] text-zinc-400 uppercase tracking-wider font-mono block">Fila de Chamados</span>
            <strong className="text-sm font-black text-zinc-950 uppercase tracking-tight mt-1.5 flex items-center gap-1.5">
              {orders.filter(o => o.status === 'PENDING').length} OS <span className="bg-amber-100 text-amber-800 font-mono text-[9px] px-1 rounded-md">Atendendo</span>
            </strong>
            <span className="text-[10px] text-zinc-500 font-mono mt-0.5">Na região Campinas</span>
          </div>

          {/* Block 4: Faturamento */}
          <div className="p-4 flex flex-col justify-center">
            <span className="text-[9px] text-zinc-400 uppercase tracking-wider font-mono block">Ganhos de Hoje</span>
            <strong className="text-sm font-black text-brand-orange font-mono mt-1.5">
              R$ 150,00
            </strong>
            <span className="text-[10px] text-emerald-600 font-mono mt-0.5 font-bold">✓ Meta diária batida</span>
          </div>

          {/* Block 5: SLA compliance */}
          <div className="p-4 flex flex-col justify-center">
            <span className="text-[9px] text-zinc-400 uppercase tracking-wider font-mono block">SLA de Atendimento</span>
            <strong className="text-sm font-black text-zinc-950 font-mono mt-1.5">
              23 min médio
            </strong>
            <span className="text-[10px] text-zinc-500 font-mono mt-0.5 font-bold text-emerald-600">✓ 85% dentro do prazo</span>
          </div>
        </div>

        {/* SHIFT DEADLINE ALERT */}
        {isShiftActive && deadlineAlert && (
          <div className="bg-amber-50/60 border border-brand-orange/30 text-zinc-800 p-4 sm:p-5 rounded-2xl mb-6 text-left flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm animate-pulse">
            <div className="flex gap-3.5 items-start">
              <div className="bg-brand-orange text-black p-2 rounded-xl shrink-0">
                <AlertTriangle className="w-5 h-5 shrink-0" />
              </div>
              <div>
                <h5 className="font-extrabold text-zinc-900 text-sm uppercase font-sans tracking-tight">Alerta de Término de Expediente!</h5>
                <p className="text-xs text-zinc-650 mt-1 leading-relaxed">
                  Faltam apenas 15 minutos para o encerramento planejado do seu expediente às <strong className="text-zinc-950 font-bold">{shiftEnd}</strong>. Deseja estender sua janela de atendimento para continuar recebendo novas ordens de serviço?
                </p>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto shrink-0 justify-end">
              <button
                onClick={() => {
                  setShiftEnd('19:00');
                  setDeadlineAlert(false);
                  alert('Expediente estendido até às 19:00 com sucesso!');
                }}
                className="bg-brand-orange hover:bg-brand-orange-hover text-black font-extrabold text-2xs uppercase tracking-wider py-2.5 px-4 rounded-xl transition-all shadow-sm cursor-pointer"
                id="extend-shift-btn"
              >
                Estender +2 Horas
              </button>
              <button
                onClick={() => setDeadlineAlert(false)}
                className="bg-white border border-zinc-200 hover:bg-zinc-100 text-zinc-750 font-extrabold text-2xs uppercase tracking-wider py-2.5 px-4 rounded-xl transition-all cursor-pointer"
                id="ignore-shift-btn"
              >
                Ignorar
              </button>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            TAB 1: SHIFT CONFIGURATION SCREEN
            ---------------------------------------------------- */}
        {activeTab === 'shift' && (
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto shadow-sm text-left space-y-8">
            <div className="space-y-1.5 border-b border-zinc-100 pb-5">
              <span className="text-[10px] text-brand-orange uppercase tracking-widest font-black block font-mono">Controle de Expediente</span>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-900 uppercase tracking-tight">
                Status Operacional da Unidade Móvel
              </h2>
              <p className="text-zinc-500 text-xs sm:text-sm">
                Selecione as suas diretrizes de atendimento e mude seu sinal para receber ordens geolocalizadas em Campinas-SP.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Form Elements */}
              <div className="space-y-6">
                {/* 1. Status toggle */}
                <div className="space-y-2.5 text-left">
                  <label className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold block font-mono">Sinal de Disponibilidade</label>
                  <div className="flex items-center gap-4 bg-zinc-50 p-4 sm:p-5 rounded-2xl border border-zinc-200/60 shadow-inner">
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isShiftActive}
                        onChange={handleToggleShift}
                        className="sr-only peer"
                        id="shift-status-checkbox"
                      />
                      <div className="w-11 h-6 bg-zinc-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-orange"></div>
                    </div>
                    <div>
                      <strong className="text-xs sm:text-sm font-bold text-zinc-900 block">
                        {isShiftActive ? 'Sinal Online (Disponível)' : 'Sinal Offline (Indisponível)'}
                      </strong>
                      <span className="text-[10px] text-zinc-500 block mt-0.5 leading-normal">
                        {isShiftActive ? 'Sua Van e ferramentas estão visíveis aos clientes próximos' : 'Ative para receber ordens de reparação de motocicletas'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Type of Service */}
                <div className="space-y-2.5 text-left">
                  <label className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold block font-mono">Modalidade de Atendimento</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setServiceType('mobile')}
                      className={`p-4 rounded-2xl text-left border transition-all ${
                        serviceType === 'mobile'
                          ? 'border-brand-orange bg-zinc-950 text-white shadow-md'
                          : 'border-zinc-200 bg-white text-zinc-750 hover:border-zinc-300 hover:bg-zinc-50'
                      }`}
                      id="service-type-mobile-btn"
                    >
                      <Truck className={`w-5 h-5 mb-2.5 ${serviceType === 'mobile' ? 'text-brand-orange' : 'text-zinc-400'}`} />
                      <strong className="text-xs block font-bold">Unidade Móvel (Van)</strong>
                      <span className={`text-[10px] block leading-relaxed mt-1.5 ${serviceType === 'mobile' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        Furgão-oficina itinerante que vai até a residência ou trabalho do piloto.
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setServiceType('fixed')}
                      className={`p-4 rounded-2xl text-left border transition-all ${
                        serviceType === 'fixed'
                          ? 'border-brand-orange bg-zinc-950 text-white shadow-md'
                          : 'border-zinc-200 bg-white text-zinc-750 hover:border-zinc-300 hover:bg-zinc-50'
                      }`}
                      id="service-type-fixed-btn"
                    >
                      <MapPin className={`w-5 h-5 mb-2.5 ${serviceType === 'fixed' ? 'text-brand-orange' : 'text-zinc-400'}`} />
                      <strong className="text-xs block font-bold">Ponto Fixo (Posto)</strong>
                      <span className={`text-[10px] block leading-relaxed mt-1.5 ${serviceType === 'fixed' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        Atendimento estabelecido em base fixa parceira ou ponto de recarga homologado.
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Form Elements */}
              <div className="space-y-6 bg-zinc-50 p-6 rounded-2xl border border-zinc-200 flex flex-col justify-between">
                <div className="space-y-4 text-left">
                  <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block font-mono">Horário Planejado do Turno</label>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] text-zinc-500 block font-bold">Horário de Início</span>
                      <input
                        type="time"
                        value={shiftStart}
                        onChange={(e) => setShiftStart(e.target.value)}
                        className="w-full bg-white border border-zinc-200 rounded-lg p-2.5 text-xs text-zinc-800 font-bold font-mono focus:outline-none focus:border-brand-orange"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-zinc-500 block font-bold">Horário de Término</span>
                      <input
                        type="time"
                        value={shiftEnd}
                        onChange={(e) => setShiftEnd(e.target.value)}
                        className="w-full bg-white border border-zinc-200 rounded-lg p-2.5 text-xs text-zinc-800 font-bold font-mono focus:outline-none focus:border-brand-orange"
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-4 border-t border-zinc-200/80">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-bold block">Boas práticas do Expediente</span>
                    <ul className="text-[10px] text-zinc-500 leading-relaxed space-y-1.5 list-disc pl-4">
                      <li>O sistema envia chamados geolocalizados até 45 min antes do término do seu turno.</li>
                      <li>Mantenha as peças de alto giro (óleos, pastilhas, relações) sempre inventariadas na Van.</li>
                      <li>Ao final do expediente, declare o descarte ecológico de resíduos acumulados na Van.</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-200">
                  <button
                    onClick={handleToggleShift}
                    className="w-full bg-brand-orange hover:bg-brand-orange-hover text-black font-black py-3 px-4 rounded-xl text-xs uppercase tracking-widest text-center transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                    id="shift-activation-action-btn"
                  >
                    {isShiftActive ? (
                      <>
                        <Square className="w-4 h-4 fill-black" /> Desativar Meu Sinal (Offline)
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-black animate-pulse" /> Ativar Meu Sinal (Online)
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            TAB 2: LIST OF ACTIVE ORDERS & WORK MODE FLOW
            ---------------------------------------------------- */}
        {activeTab === 'dashboard' && isShiftActive && (
          <div className="space-y-6">
            
            {/* Active Stepper Header displayed when there is an active OS */}
            {selectedOS && (
              <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm p-4 sm:p-5 max-w-7xl mx-auto text-left">
                {/* Horizontal Navigation inside Dashboard */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-5 pb-4 border-b border-zinc-150">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setDashboardSubView('os')}
                      className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                        dashboardSubView === 'os'
                          ? 'bg-brand-orange text-black font-extrabold shadow-sm'
                          : 'bg-zinc-100 text-zinc-650 hover:bg-zinc-200 hover:text-black font-bold'
                      }`}
                      id="subview-btn-os"
                    >
                      <Wrench className="w-4 h-4" />
                      Atendimento Ativo ({selectedOS.id})
                    </button>
                    <button
                      onClick={() => setDashboardSubView('list')}
                      className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                        dashboardSubView === 'list'
                          ? 'bg-zinc-950 text-white font-extrabold shadow-sm'
                          : 'bg-zinc-100 text-zinc-650 hover:bg-zinc-200 hover:text-black font-bold'
                      }`}
                      id="subview-btn-list"
                    >
                      <FileText className="w-4 h-4" />
                      Fila Geral de Chamados
                    </button>
                  </div>
                  
                  <div className="text-[10px] text-zinc-500 font-mono flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-150 px-3 py-1.5 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Sincronizado: Você pode alterar entre telas sem perder o status de execução</span>
                  </div>
                </div>

                {/* THE "CUSTOMER.IO CSV REVIEW" INSPIRED PROGRESS STEPPER */}
                {dashboardSubView === 'os' && (
                  <div className="relative py-1">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      
                      {/* Step 1 */}
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all shrink-0 ${
                          stage === 'A' 
                            ? 'bg-brand-orange text-black font-black ring-4 ring-brand-orange/20' 
                            : (stage === 'B' || stage === 'C' || stage === 'D') 
                              ? 'bg-emerald-500 text-white' 
                              : 'bg-zinc-200 text-zinc-400'
                        }`}>
                          {(stage === 'B' || stage === 'C' || stage === 'D') ? <Check className="w-4 h-4 stroke-[3]" /> : '1'}
                        </div>
                        <div className="text-left font-sans">
                          <h4 className="text-xs font-black text-zinc-900 uppercase">1. Roteamento</h4>
                          <span className="text-[10px] text-zinc-450 block font-mono">Deslocamento GPS</span>
                        </div>
                      </div>

                      {/* Line divider 1 */}
                      <div className="hidden sm:block h-0.5 bg-zinc-200 flex-1 min-w-[20px]" />

                      {/* Step 2 */}
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all shrink-0 ${
                          stage === 'B' 
                            ? 'bg-brand-orange text-black font-black ring-4 ring-brand-orange/20' 
                            : (stage === 'C' || stage === 'D') 
                              ? 'bg-emerald-500 text-white' 
                              : 'bg-zinc-200 text-zinc-400'
                        }`}>
                          {(stage === 'C' || stage === 'D') ? <Check className="w-4 h-4 stroke-[3]" /> : '2'}
                        </div>
                        <div className="text-left font-sans">
                          <h4 className="text-xs font-black text-zinc-900 uppercase">2. Vistoria</h4>
                          <span className="text-[10px] text-zinc-450 block font-mono">Fotos & Checklist</span>
                        </div>
                      </div>

                      {/* Line divider 2 */}
                      <div className="hidden sm:block h-0.5 bg-zinc-200 flex-1 min-w-[20px]" />

                      {/* Step 3 */}
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all shrink-0 ${
                          stage === 'C' 
                            ? 'bg-brand-orange text-black font-black ring-4 ring-brand-orange/20' 
                            : stage === 'D' 
                              ? 'bg-emerald-500 text-white' 
                              : 'bg-zinc-200 text-zinc-400'
                        }`}>
                          {stage === 'D' ? <Check className="w-4 h-4 stroke-[3]" /> : '3'}
                        </div>
                        <div className="text-left font-sans">
                          <h4 className="text-xs font-black text-zinc-900 uppercase">3. Reparo Ativo</h4>
                          <span className="text-[10px] text-zinc-450 block font-mono">Cronômetro & Câmera</span>
                        </div>
                      </div>

                      {/* Line divider 3 */}
                      <div className="hidden sm:block h-0.5 bg-zinc-200 flex-1 min-w-[20px]" />

                      {/* Step 4 */}
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all shrink-0 ${
                          stage === 'D' 
                            ? 'bg-brand-orange text-black font-black ring-4 ring-brand-orange/20' 
                            : 'bg-zinc-200 text-zinc-400'
                        }`}>
                          4
                        </div>
                        <div className="text-left font-sans">
                          <h4 className="text-xs font-black text-zinc-900 uppercase">4. Auditoria</h4>
                          <span className="text-[10px] text-zinc-450 block font-mono">Logística Reversa</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* If no order is selected or if user toggled to view the list (THE SAAS DATA GRID QUEUE LIST) */}
            {!selectedOS || dashboardSubView === 'list' ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left items-stretch">
                
                {/* Active queue list (Left 8/12 cols) */}
                <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-3xl p-5 sm:p-7 space-y-6 shadow-sm flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-zinc-150">
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-zinc-900 uppercase tracking-tight font-sans">
                          Fila de Ordens Disponíveis para Despacho
                        </h3>
                        <p className="text-zinc-500 text-xs mt-0.5">
                          Tabela estruturada e mapeada contendo as solicitações geolocalizadas próximas de sua OttoVan.
                        </p>
                      </div>
                      <span className="bg-zinc-100 border border-zinc-200 text-zinc-700 font-bold text-xs px-3 py-1.5 rounded-full font-mono shrink-0">
                        {orders.filter(o => o.status === 'PENDING').length} OS Aguardando
                      </span>
                    </div>

                    {/* SAAS DATA TABLE REPRESENTATION */}
                    <div className="overflow-x-auto border border-zinc-200 rounded-2xl bg-white shadow-inner">
                      <table className="w-full min-w-[700px] text-left border-collapse font-sans">
                        <thead>
                          <tr className="bg-zinc-50/80 border-b border-zinc-200">
                            <th className="py-3.5 px-4 text-[10px] font-black text-zinc-500 uppercase tracking-wider font-mono">Row / OS</th>
                            <th className="py-3.5 px-4 text-[10px] font-black text-zinc-500 uppercase tracking-wider font-mono">Cliente & Contato</th>
                            <th className="py-3.5 px-4 text-[10px] font-black text-zinc-500 uppercase tracking-wider font-mono">Veículo & Placa</th>
                            <th className="py-3.5 px-4 text-[10px] font-black text-zinc-500 uppercase tracking-wider font-mono">Procedimento Técnico</th>
                            <th className="py-3.5 px-4 text-[10px] font-black text-zinc-500 uppercase tracking-wider font-mono">Materiais Separados</th>
                            <th className="py-3.5 px-4 text-[10px] font-black text-zinc-500 uppercase tracking-wider font-mono text-right">Ação</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-150">
                          {orders.filter(o => o.status !== 'COMPLETED').map((os, index) => {
                            const isSelected = selectedOS?.id === os.id;
                            return (
                              <tr 
                                key={os.id} 
                                className={`transition-all hover:bg-zinc-50/50 ${
                                  isSelected ? 'bg-brand-orange/[0.03]' : ''
                                }`}
                              >
                                {/* Linha / ID */}
                                <td className="py-4 px-4 font-mono">
                                  <div className="flex flex-col gap-1">
                                    <span className="text-[10px] text-zinc-400">#{(index + 1).toString().padStart(2, '0')}</span>
                                    <span className="bg-zinc-950 text-brand-orange font-mono font-black text-xs px-2 py-0.5 rounded border border-zinc-900 text-center w-max block">
                                      {os.id}
                                    </span>
                                  </div>
                                </td>

                                {/* Cliente */}
                                <td className="py-4 px-4">
                                  <div className="text-xs">
                                    <strong className="text-zinc-900 font-bold block">{os.clientName}</strong>
                                    <span className="text-[9px] text-zinc-400 block font-mono">Cambuí, Campinas</span>
                                  </div>
                                </td>

                                {/* Moto */}
                                <td className="py-4 px-4">
                                  <div className="text-xs">
                                    <strong className="text-zinc-800 font-medium block">{os.motoModel}</strong>
                                    <span className="text-[10px] bg-zinc-100 border border-zinc-250 px-1.5 py-0.5 rounded font-mono text-zinc-650 font-bold mt-1 inline-block">
                                      Placa: {os.motoPlate}
                                    </span>
                                  </div>
                                </td>

                                {/* Serviço */}
                                <td className="py-4 px-4">
                                  <div className="text-xs max-w-[200px]">
                                    <strong className="text-zinc-900 block font-bold leading-tight">{os.serviceName}</strong>
                                    <span className="text-[9px] text-brand-orange font-mono font-black uppercase tracking-wider block mt-1.5">
                                      ⏱ {os.estimatedTimeM} min SLA
                                    </span>
                                  </div>
                                </td>

                                {/* Peças */}
                                <td className="py-4 px-4">
                                  <div className="flex flex-col gap-1 max-w-[150px]">
                                    {os.parts.map((part, pIdx) => (
                                      <span key={pIdx} className="text-[10px] text-zinc-600 truncate font-mono block" title={part}>
                                        ⚙ {part}
                                      </span>
                                    ))}
                                  </div>
                                </td>

                                {/* Ações */}
                                <td className="py-4 px-4 text-right">
                                  {isSelected ? (
                                    <button
                                      onClick={() => setDashboardSubView('os')}
                                      className="bg-zinc-950 hover:bg-zinc-900 text-white font-extrabold text-[10px] uppercase tracking-wider py-2 px-3 rounded-lg transition-all shadow-sm flex items-center gap-1 justify-center ml-auto cursor-pointer"
                                    >
                                      Revisar <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        if (selectedOS) {
                                          const confirmSwitch = window.confirm(`Atenção: Você já possui o chamado ${selectedOS.id} em andamento. Deseja pausar o progresso atual e iniciar o atendimento da ${os.id}?`);
                                          if (!confirmSwitch) return;
                                        }
                                        handleSelectOS(os);
                                      }}
                                      className="bg-brand-orange hover:bg-brand-orange-hover text-black font-extrabold text-[10px] uppercase tracking-wider py-2 px-3 rounded-lg transition-all cursor-pointer shadow-sm"
                                    >
                                      Atender OS
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {orders.filter(o => o.status !== 'COMPLETED').length === 0 && (
                      <div className="p-12 text-center text-zinc-400 bg-zinc-50 border border-dashed border-zinc-200 rounded-2xl">
                        <Activity className="w-8 h-8 text-zinc-350 mx-auto mb-2 animate-pulse" />
                        <p className="text-xs font-bold font-sans uppercase">Fila Vazia de Despacho</p>
                        <p className="text-[10px] text-zinc-550 mt-1">
                          Nenhuma ordem geolocalizada aguardando no momento.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="text-[10px] text-zinc-400 font-mono mt-4 pt-3 border-t border-zinc-100 leading-normal flex items-center gap-2">
                    <Shield className="w-4 h-4 text-brand-orange shrink-0" />
                    <span>Todas as ordens acima são calculadas em tempo de deslocamento por GPS integrado para garantir o tempo mínimo de SLA da rede OttoMotos.</span>
                  </div>
                </div>

                {/* Right sidebar: stats & instructions (Right 4/12 cols) */}
                <div className="lg:col-span-4 bg-zinc-950 text-white border border-zinc-900 rounded-3xl p-6 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <span className="text-[10px] text-brand-orange uppercase tracking-widest font-black block font-mono">Faturamento do Turno</span>
                    <h3 className="text-base sm:text-lg font-black tracking-tight text-left">
                      Faturamento Líquido de Hoje
                    </h3>
                    <p className="text-xs text-zinc-400 text-left leading-relaxed">
                      Sua conta homologada da microempresa recebe o repasse Pix imediatamente após a conclusão homologada de cada veículo.
                    </p>

                    <div className="space-y-3 pt-3">
                      <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-850 flex justify-between items-center text-left">
                        <div>
                          <span className="text-[10px] text-zinc-500 uppercase font-bold block font-mono">Faturamento Bruto</span>
                          <span className="text-xl font-black text-brand-orange font-mono">R$ 150,00</span>
                        </div>
                        <span className="bg-emerald-950 text-emerald-400 font-mono text-[9px] font-bold px-2 py-0.5 rounded border border-emerald-900/40">
                          2 OS Concluídas
                        </span>
                      </div>

                      <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-850 flex justify-between items-center text-left">
                        <div>
                          <span className="text-[10px] text-zinc-500 uppercase font-bold block font-mono">Média por Serviço</span>
                          <span className="text-lg font-black text-white font-mono">R$ 75,00 líquidos</span>
                        </div>
                        <span className="bg-emerald-950 text-emerald-400 font-mono text-[9px] font-bold px-2 py-0.5 rounded border border-emerald-900/40">
                          Taxa Cheia Repasse
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-850 text-left space-y-2">
                    <span className="text-[10px] text-brand-orange uppercase font-bold font-mono block">Diretrizes de Auditoria</span>
                    <p className="text-[10px] text-zinc-400 leading-relaxed font-mono">
                      🔒 O repasse fiscal das ordens de serviço exige a homologação visual através de fotos prévias e a declaração de logística reversa de resíduos químicos na Van.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* ACTIVE WORK MODE SEQUENCE SPLIT GRID (STAGES A, B, C, D) */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left items-start max-w-7xl mx-auto">
                {/* Workflow Left Side (8/12 cols) */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* STAGE A: DISPATCH / ROUTING PANEL */}
                  {stage === 'A' && (
                    <div className="bg-white border border-zinc-200 rounded-3xl p-5 sm:p-7 space-y-6 shadow-sm">
                      <div className="space-y-1.5 border-b border-zinc-100 pb-4">
                        <span className="text-[9px] bg-brand-orange/10 text-brand-orange font-black px-2.5 py-1 rounded-md uppercase tracking-wider font-mono border border-brand-orange/15">
                          FASE 1: ROTEAMENTO DA UNIDADE MÓVEL
                        </span>
                        <h3 className="text-base sm:text-lg font-black text-zinc-900 uppercase tracking-tight mt-2.5">
                          Deslocamento GPS e Estimativa de Rota
                        </h3>
                        <p className="text-zinc-500 text-xs">
                          Inicie o deslocamento para a localização do cliente. A furgão-oficina OttoVan está pré-carregada com os insumos requeridos.
                        </p>
                      </div>

                      {/* Map Simulation */}
                      <div className="relative w-full h-80 bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 flex items-center justify-center">
                        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#1c1c1e_1px,transparent_1px)] [background-size:16px_16px]"></div>
                        
                        <div className="relative w-full h-full flex items-center justify-center">
                          {/* Simulated path drawing */}
                          <svg className="absolute inset-0 w-full h-full">
                            <path d="M 150 120 Q 280 180, 420 220" fill="transparent" stroke="#FF5A00" strokeWidth="4" strokeDasharray="8,4" className="animate-[dash_2s_linear_infinite]" />
                          </svg>

                          {/* Pin 1: OttoVan */}
                          <div className="absolute left-[150px] top-[120px] flex flex-col items-center">
                            <span className="bg-zinc-950 text-brand-orange text-[9px] font-black font-mono px-1.5 py-0.5 rounded border border-zinc-800 whitespace-nowrap shadow-md mb-1 animate-bounce">
                              🚐 OTTOVAN #02 (VOCÊ)
                            </span>
                            <div className="w-5 h-5 bg-brand-orange border-2 border-white rounded-full flex items-center justify-center shadow-lg">
                              <Compass className="w-3 h-3 text-black animate-spin" />
                            </div>
                          </div>

                          {/* Pin 2: Client */}
                          <div className="absolute left-[420px] top-[220px] flex flex-col items-center">
                            <span className="bg-white text-zinc-900 text-[9px] font-black font-mono px-1.5 py-0.5 rounded border border-zinc-250 whitespace-nowrap shadow-md mb-1">
                              📍 CLIENTE ({selectedOS.clientName.toUpperCase()})
                            </span>
                            <div className="w-5 h-5 bg-zinc-950 border-2 border-brand-orange rounded-full flex items-center justify-center shadow-lg">
                              <MapPin className="w-3 h-3 text-brand-orange" />
                            </div>
                          </div>

                          <div className="absolute bottom-4 left-4 right-4 bg-zinc-950/90 text-zinc-300 p-3 rounded-xl border border-zinc-800 text-2xs space-y-1 font-mono flex justify-between items-center">
                            <span>SISTEMA INTEGRADO GPS WAZE / MAPS</span>
                            <span className="text-brand-orange flex items-center gap-1 font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              Trajeto de Van Otimizado
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* OS Details Summary Card */}
                      <div className="bg-zinc-50 border border-zinc-200/60 p-4 sm:p-5 rounded-2xl">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-[10px] text-zinc-400 block font-bold font-mono uppercase">Endereço do Chamado</span>
                            <span className="text-xs text-zinc-800 font-bold leading-relaxed block mt-1">{selectedOS.address}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-zinc-400 block font-bold font-mono uppercase">Procedimento e Peças</span>
                            <span className="text-xs text-zinc-800 font-extrabold block mt-1">{selectedOS.serviceName}</span>
                            <span className="text-[11px] text-zinc-500 block mt-0.5">{selectedOS.parts.join(', ')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Sticky Navigation Footer */}
                      <div className="pt-4 border-t border-zinc-200 flex flex-col sm:flex-row justify-between gap-3">
                        <button
                          onClick={() => setSelectedOS(null)}
                          className="bg-zinc-150 hover:bg-zinc-250 text-zinc-750 font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-xl transition-all font-mono cursor-pointer"
                        >
                          Cancelar e Liberar OS
                        </button>

                        <button
                          onClick={() => setStage('B')}
                          className="flex-1 bg-brand-orange hover:bg-brand-orange-hover text-black font-extrabold text-xs uppercase tracking-wider py-3 px-6 rounded-xl text-center transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                        >
                          Confirmar Chegada ao Local <ChevronRight className="w-4 h-4 stroke-[3]" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STAGE B: PREPARATION & CHECKLIST PANEL */}
                  {stage === 'B' && (
                    <div className="bg-white border border-zinc-200 rounded-3xl p-5 sm:p-7 space-y-6 shadow-sm">
                      <div className="space-y-1.5 border-b border-zinc-100 pb-4">
                        <span className="text-[9px] bg-brand-orange/10 text-brand-orange font-black px-2.5 py-1 rounded-md uppercase tracking-wider font-mono border border-brand-orange/15">
                          FASE 2: LAUDO VISUAL & CHECK-IN
                        </span>
                        <h3 className="text-base sm:text-lg font-black text-zinc-900 uppercase tracking-tight mt-2.5">
                          Vistoria Prévia de Avarias
                        </h3>
                        <p className="text-zinc-500 text-xs">
                          Você chegou ao local! Realize a inspeção visual na moto e registre quaisquer riscos para evitar alegações falsas ou desacordo comercial.
                        </p>
                      </div>

                      {/* GPS Checkin Confirmed */}
                      <div className="bg-emerald-50/60 border border-emerald-200 p-4 rounded-xl flex items-center justify-between text-left gap-3">
                        <div className="space-y-0.5">
                          <strong className="text-xs text-emerald-850 block font-bold">Vínculo GPS Confirmado</strong>
                          <span className="text-[10px] text-emerald-600 block leading-relaxed font-mono">Manutenção validada no endereço do cliente</span>
                        </div>
                        <span className="bg-emerald-500 text-white font-mono text-[9px] font-black px-2 py-1 rounded">
                          CHECK-IN OK
                        </span>
                      </div>

                      {/* Inspection Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch text-left">
                        {/* Checkbox fields */}
                        <div className="space-y-4 bg-zinc-50 p-5 rounded-2xl border border-zinc-200/60">
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-bold block">1. Itens Observados na Moto</span>
                          
                          <div className="space-y-2.5">
                            <label className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-zinc-200 hover:border-brand-orange/40 transition-colors cursor-pointer">
                              <input
                                type="checkbox"
                                checked={preChecklist.scratches}
                                onChange={(e) => setPreChecklist(prev => ({ ...prev, scratches: e.target.checked }))}
                                className="rounded text-brand-orange focus:ring-brand-orange w-4 h-4 cursor-pointer"
                              />
                              <span className="text-xs text-zinc-700 font-semibold">Arranhões prévios na carenagem / tanque</span>
                            </label>

                            <label className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-zinc-200 hover:border-brand-orange/40 transition-colors cursor-pointer">
                              <input
                                type="checkbox"
                                checked={preChecklist.leaks}
                                onChange={(e) => setPreChecklist(prev => ({ ...prev, leaks: e.target.checked }))}
                                className="rounded text-brand-orange focus:ring-brand-orange w-4 h-4 cursor-pointer"
                              />
                              <span className="text-xs text-zinc-700 font-semibold">Vazamentos visíveis no bloco de motor</span>
                            </label>

                            <label className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-zinc-200 hover:border-brand-orange/40 transition-colors cursor-pointer">
                              <input
                                type="checkbox"
                                checked={preChecklist.tires}
                                onChange={(e) => setPreChecklist(prev => ({ ...prev, tires: e.target.checked }))}
                                className="rounded text-brand-orange focus:ring-brand-orange w-4 h-4 cursor-pointer"
                              />
                              <span className="text-xs text-zinc-700 font-semibold">Pneu traseiro/dianteiro abaixo do limite (TWI)</span>
                            </label>

                            <label className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-zinc-200 hover:border-brand-orange/40 transition-colors cursor-pointer">
                              <input
                                type="checkbox"
                                checked={preChecklist.mirrors}
                                onChange={(e) => setPreChecklist(prev => ({ ...prev, mirrors: e.target.checked }))}
                                className="rounded text-brand-orange focus:ring-brand-orange w-4 h-4 cursor-pointer"
                              />
                              <span className="text-xs text-zinc-700 font-semibold">Retrovisores trincados ou piscas quebrados</span>
                            </label>
                          </div>

                          <div className="space-y-1.5 pt-2">
                            <span className="text-[10px] text-zinc-500 block font-bold font-mono">Laudo ou Notas Adicionais:</span>
                            <textarea
                              value={visualNotes}
                              onChange={(e) => setVisualNotes(e.target.value)}
                              placeholder="Digite observações manuais (ex: capa do banco com rasgo, retrovisor modificado, marcas de queda...)"
                              className="w-full bg-white border border-zinc-200 rounded-lg p-2.5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-brand-orange h-20 resize-none"
                            />
                          </div>
                        </div>

                        {/* Visual upload records */}
                        <div className="space-y-5 bg-zinc-50 p-5 rounded-2xl border border-zinc-200/60 flex flex-col justify-between">
                          <div className="space-y-4">
                            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-bold block">2. Evidência Fotográfica</span>
                            
                            <div className="space-y-3">
                              <span className="text-[10px] text-zinc-550 block font-semibold leading-normal">Foto panorâmica lateral da moto para o arquivo da rede:</span>
                              <div className="flex items-center gap-3.5">
                                <div className="w-20 h-20 rounded-2xl overflow-hidden border border-zinc-200 shadow-sm relative shrink-0">
                                  <img src={uploadedPhotos[0]} alt="Checklist damage" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    alert('Simulador: Câmera do tablet ativada! Foto do checklist anexada ao processo.');
                                  }}
                                  className="bg-white hover:bg-zinc-100 border border-zinc-250 text-zinc-700 font-extrabold text-2xs uppercase tracking-wider py-3 px-4 rounded-xl flex items-center gap-1.5 shadow-sm transition-all font-mono cursor-pointer"
                                >
                                  <Camera className="w-4 h-4 text-zinc-550" /> Fotografar Avaria
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="text-[10px] text-zinc-500 font-mono leading-relaxed bg-zinc-100 p-3 rounded-lg border border-zinc-150">
                            🔒 O cliente recebe as notificações fotográficas no app em tempo real. As fotos e os checklists salvaguardam a franquia judicialmente.
                          </div>
                        </div>
                      </div>

                      {/* Back / Next buttons */}
                      <div className="pt-4 border-t border-zinc-200 flex justify-between gap-3">
                        <button
                          onClick={() => setStage('A')}
                          className="bg-zinc-150 hover:bg-zinc-250 text-zinc-750 font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-xl transition-all font-mono cursor-pointer"
                        >
                          Voltar ao Trajeto
                        </button>

                        <button
                          onClick={() => {
                            setStage('C');
                            setTimerActive(true);
                          }}
                          className="flex-1 bg-brand-orange hover:bg-brand-orange-hover text-black font-extrabold text-xs uppercase tracking-wider py-3 px-6 rounded-xl text-center transition-all shadow-sm cursor-pointer"
                        >
                          Avançar para o Reparo Técnico
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STAGE C: REPAIR & STREAMING CAMERA PANEL */}
                  {stage === 'C' && (
                    <div className="bg-white border border-zinc-200 rounded-3xl p-5 sm:p-7 space-y-6 shadow-sm">
                      <div className="space-y-1.5 border-b border-zinc-100 pb-4">
                        <span className="text-[9px] bg-brand-orange/10 text-brand-orange font-black px-2.5 py-1 rounded-md uppercase tracking-wider font-mono border border-brand-orange/15">
                          FASE 3: EXECUÇÃO DO CONSERTO NA VAN
                        </span>
                        <h3 className="text-base sm:text-lg font-black text-zinc-900 uppercase tracking-tight mt-2.5">
                          Mão na Massa & Transmissão Conectada
                        </h3>
                        <p className="text-zinc-500 text-xs">
                          Mantenha as boas práticas de segurança técnica. O cronômetro do SLA e o stream de câmera por satélite estão ativos no painel do cliente.
                        </p>
                      </div>

                      {/* TOP PANEL: TIMER AND CAMERA STATUS */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* SLA Stopwatch (Dark Background for maximum focus) */}
                        <div className="bg-zinc-950 text-white border border-zinc-900 p-5 rounded-2xl text-left flex flex-col justify-between relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <Clock className="w-24 h-24 text-brand-orange" />
                          </div>
                          <div className="space-y-1.5">
                            <span className="text-[9px] text-brand-orange uppercase font-black tracking-widest font-mono flex items-center gap-1.5">
                              <Activity className="w-3.5 h-3.5" /> CRONÔMETRO SLA OPERACIONAL
                            </span>
                            <div className="text-3xl font-black font-mono tracking-tight text-white mt-1 animate-pulse">
                              {formatTime(timerRemaining)}
                            </div>
                            <p className="text-[10px] text-zinc-400 font-mono">
                              Tempo restante estimado ({selectedOS.estimatedTimeM} minutos de SLA acordado)
                            </p>
                          </div>

                          <div className="pt-4 flex gap-2">
                            <button
                              type="button"
                              onClick={() => setTimerActive(!timerActive)}
                              className={`text-[9px] uppercase font-black tracking-wider py-2 px-3.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                                timerActive ? 'bg-zinc-900 text-amber-400 border border-zinc-800 hover:bg-zinc-850' : 'bg-brand-orange text-black font-black'
                              }`}
                            >
                              {timerActive ? <Square className="w-3.5 h-3.5 fill-amber-400" /> : <Play className="w-3.5 h-3.5 fill-black" />}
                              {timerActive ? 'Pausar SLA' : 'Iniciar SLA'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setTimerRemaining(selectedOS.estimatedTimeM * 60)}
                              className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 text-[9px] uppercase font-bold py-2 px-3.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <RefreshCw className="w-3.5 h-3.5" /> Reiniciar
                            </button>
                          </div>
                        </div>

                        {/* Customer Live Stream Panel */}
                        <div className="bg-zinc-900 text-white p-5 rounded-2xl relative overflow-hidden border border-zinc-800 flex flex-col justify-between text-left">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] text-zinc-400 uppercase font-bold font-mono">Canal Transmissão Interna 01</span>
                            
                            <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                              cameraOn ? 'bg-red-950 text-red-400 border border-red-900/40' : 'bg-zinc-950 text-zinc-550 border border-zinc-850'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${cameraOn ? 'bg-red-500 animate-ping' : 'bg-zinc-550'}`}></span>
                              {cameraOn ? 'AO VIVO PARA O CLIENTE' : 'CAMERA MUTADA'}
                            </span>
                          </div>

                          <div className="py-3 flex items-center gap-3">
                            <Video className={`w-9 h-9 ${cameraOn ? 'text-red-500' : 'text-zinc-650'}`} />
                            <div>
                              <h5 className="font-extrabold text-xs text-zinc-200 uppercase font-sans">Satélite de Segurança OttoVan</h5>
                              <p className="text-[10px] text-zinc-400 leading-normal mt-0.5">
                                O cliente está assistindo ao fluxo de reparação em tempo real pelo app.
                              </p>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-zinc-850 flex justify-between items-center text-[10px]">
                            <span className="text-zinc-500 font-mono">Streaming HD via 5G</span>
                            <button
                              onClick={() => setCameraOn(!cameraOn)}
                              className="text-brand-orange hover:underline font-bold text-[10px] uppercase tracking-wider font-mono cursor-pointer"
                            >
                              {cameraOn ? 'Desmutar Camera' : 'Ligar Transmissão'}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* STEP-BY-STEP REPLACEMENT TASKS */}
                      <div className="space-y-4 bg-zinc-50 p-5 rounded-2xl border border-zinc-200/60">
                        <div className="flex justify-between items-center pb-2 border-b border-zinc-200/80">
                          <span className="text-[10px] text-zinc-550 uppercase tracking-wider font-mono font-bold block">Checklist Técnico do Conserto</span>
                          <span className="text-[10px] bg-zinc-200 border border-zinc-350 px-2.5 py-0.5 rounded text-zinc-700 font-bold font-mono">
                            {tasks.filter(t => t.done).length} de {tasks.length} concluídas
                          </span>
                        </div>

                        <div className="space-y-2.5">
                          {tasks.map((task, idx) => (
                            <div
                              key={task.id}
                              onClick={() => {
                                const newTasks = [...tasks];
                                newTasks[idx].done = !newTasks[idx].done;
                                setTasks(newTasks);
                              }}
                              className={`flex items-start gap-3.5 p-3 rounded-xl border transition-all cursor-pointer ${
                                task.done
                                  ? 'bg-zinc-950 text-white border-zinc-950 shadow-sm'
                                  : 'bg-white text-zinc-755 border-zinc-200 hover:border-zinc-300'
                              }`}
                            >
                              <div className={`w-5 h-5 rounded-md flex items-center justify-center border mt-0.5 shrink-0 ${
                                task.done ? 'bg-brand-orange border-brand-orange' : 'border-zinc-300 bg-white'
                              }`}>
                                {task.done && <Check className="w-3.5 h-3.5 text-black stroke-[3]" />}
                              </div>
                              <div className="text-left flex-1 flex justify-between items-center gap-3">
                                <span className="text-xs font-bold leading-relaxed">{task.name}</span>
                                <span className={`text-[9px] uppercase font-bold font-mono px-2 py-0.5 rounded-full ${
                                  task.done ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {task.done ? 'Pronto' : 'Obrigatório'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* OS Completion navigation triggers */}
                      <div className="pt-4 border-t border-zinc-200 flex justify-between gap-3">
                        <button
                          onClick={() => setStage('B')}
                          className="bg-zinc-150 hover:bg-zinc-250 text-zinc-750 font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-xl transition-all font-mono cursor-pointer"
                        >
                          Voltar à Vistoria
                        </button>

                        <button
                          onClick={() => {
                            const allDone = tasks.every(t => t.done);
                            if (!allDone) {
                              const confirmNext = window.confirm('Algumas tarefas operacionais ainda estão pendentes. Tem certeza que deseja prosseguir para o encerramento do chamado?');
                              if (!confirmNext) return;
                            }
                            setStage('D');
                            setTimerActive(false);
                          }}
                          className="flex-1 bg-brand-orange hover:bg-brand-orange-hover text-black font-extrabold text-xs uppercase tracking-wider py-3 px-6 rounded-xl text-center transition-all shadow-sm cursor-pointer"
                        >
                          Ir para Auditoria e Entrega
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STAGE D: CLOSURE & DISPOSAL PANEL */}
                  {stage === 'D' && (
                    <div className="bg-white border border-zinc-200 rounded-3xl p-5 sm:p-7 space-y-6 shadow-sm">
                      <div className="space-y-1.5 border-b border-zinc-100 pb-4">
                        <span className="text-[9px] bg-brand-orange/10 text-brand-orange font-black px-2.5 py-1 rounded-md uppercase tracking-wider font-mono border border-brand-orange/15">
                          FASE 4: AUDITORIA DE SEGURANÇA E ECO-DESCARTE
                        </span>
                        <h3 className="text-base sm:text-lg font-black text-zinc-900 uppercase tracking-tight mt-2.5">
                          Checklist de Segurança & Descarte de Resíduos
                        </h3>
                        <p className="text-zinc-500 text-xs">
                          Realize as auditorias funcionais antes de assinar a liberação do veículo ao cliente. Confirme a destinação correta do refino de óleo.
                        </p>
                      </div>

                      {/* Checklists grids */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch text-left">
                        
                        {/* Post-execution inspection form */}
                        <div className="space-y-4 bg-zinc-50 p-5 rounded-2xl border border-zinc-200/60">
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-bold block">1. Auditoria Técnica Final</span>
                          
                          <div className="space-y-2.5">
                            <label className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-zinc-200 hover:border-brand-orange/40 transition-colors cursor-pointer">
                              <input
                                type="checkbox"
                                checked={postChecklist.brakeTest}
                                onChange={(e) => setPostChecklist(prev => ({ ...prev, brakeTest: e.target.checked }))}
                                className="rounded text-brand-orange focus:ring-brand-orange w-4 h-4 cursor-pointer"
                              />
                              <span className="text-xs text-zinc-700 font-semibold">Bujão de óleo verificado e apertado com torque padrão</span>
                            </label>

                            <label className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-zinc-200 hover:border-brand-orange/40 transition-colors cursor-pointer">
                              <input
                                type="checkbox"
                                checked={postChecklist.lightsTest}
                                onChange={(e) => setPostChecklist(prev => ({ ...prev, lightsTest: e.target.checked }))}
                                className="rounded text-brand-orange focus:ring-brand-orange w-4 h-4 cursor-pointer"
                              />
                              <span className="text-xs text-zinc-700 font-semibold">Sinalização de farol, piscas e lanternas aprovada</span>
                            </label>

                            <label className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-zinc-200 hover:border-brand-orange/40 transition-colors cursor-pointer">
                              <input
                                type="checkbox"
                                checked={postChecklist.chainTension}
                                onChange={(e) => setPostChecklist(prev => ({ ...prev, chainTension: e.target.checked }))}
                                className="rounded text-brand-orange focus:ring-brand-orange w-4 h-4 cursor-pointer"
                              />
                              <span className="text-xs text-zinc-700 font-semibold">Tensão da corrente ajustada e lubrificada com graxa</span>
                            </label>

                            <label className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-zinc-200 hover:border-brand-orange/40 transition-colors cursor-pointer">
                              <input
                                type="checkbox"
                                checked={postChecklist.boltsCheck}
                                onChange={(e) => setPostChecklist(prev => ({ ...prev, boltsCheck: e.target.checked }))}
                                className="rounded text-brand-orange focus:ring-brand-orange w-4 h-4 cursor-pointer"
                              />
                              <span className="text-xs text-zinc-700 font-semibold">Inspeção visual e limpeza de graxas residuais concluída</span>
                            </label>
                          </div>
                        </div>

                        {/* Waste management compliance */}
                        <div className="space-y-4 bg-zinc-50 p-5 rounded-2xl border border-zinc-200/60 flex flex-col justify-between">
                          <div className="space-y-3 text-left">
                            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-bold block">2. Logística Reversa Ecológica</span>
                            
                            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-3">
                              <span className="text-[9px] text-emerald-750 uppercase font-black tracking-widest font-mono flex items-center gap-1.5">
                                <Award className="w-4 h-4 text-emerald-650" /> COMPLIANCE AMBIENTAL (OBRIGATÓRIO)
                              </span>
                              
                              <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={postChecklist.wasteDisposed}
                                  onChange={(e) => setPostChecklist(prev => ({ ...prev, wasteDisposed: e.target.checked }))}
                                  className="rounded text-emerald-600 focus:ring-emerald-500 w-5 h-5 shrink-0 mt-0.5 cursor-pointer"
                                />
                                <div className="space-y-1">
                                  <strong className="text-xs font-bold text-zinc-900 block">Declaro Logística Reversa Concluída</strong>
                                  <span className="text-[10px] text-zinc-550 leading-relaxed block font-mono">
                                    O óleo lubrificante antigo e o filtro retirado foram devidamente alocados no reservatório ecológico da OttoVan para logística reversa.
                                  </span>
                                </div>
                              </label>
                            </div>
                          </div>

                          <div className="bg-zinc-950 text-white p-3.5 rounded-xl border border-zinc-900 text-2xs space-y-1.5 leading-normal font-mono text-left">
                            <span className="text-brand-orange block font-black uppercase text-[9px] tracking-wider">Fechamento Integrado</span>
                            <p className="text-zinc-400">Ao confirmar, o cartão de Carol Silva será fechado e o repasse Pix correspondente será creditado na sua conta PJ.</p>
                          </div>
                        </div>
                      </div>

                      {/* Submit / back footer */}
                      <div className="pt-4 border-t border-zinc-200 flex justify-between gap-3">
                        <button
                          onClick={() => setStage('C')}
                          className="bg-zinc-150 hover:bg-zinc-250 text-zinc-750 font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-xl transition-all font-mono cursor-pointer"
                        >
                          Voltar ao Reparo
                        </button>

                        <button
                          onClick={() => {
                            if (!postChecklist.wasteDisposed) {
                              alert('Atenção: A confirmação de descarte ecológico dos resíduos químicos da moto é OBRIGATÓRIA para liberar o faturamento da OS!');
                              return;
                            }
                            // Simulate finishing OS
                            const updatedOrders = orders.map(o => {
                              if (o.id === selectedOS.id) {
                                  return { ...o, status: 'COMPLETED' as const };
                              }
                              return o;
                            });
                            setOrders(updatedOrders);
                            setSelectedOS(null);
                            alert(`Ordem de Serviço ${selectedOS.id} finalizada com sucesso! Faturamento fechado. O repasse de R$ 75,00 líquidos foi creditado na conta bancária cadastrada da sua ME.`);
                          }}
                          className={`flex-1 font-extrabold text-xs uppercase tracking-widest py-3 px-6 rounded-xl text-center transition-all shadow-sm ${
                            postChecklist.wasteDisposed
                              ? 'bg-brand-orange hover:bg-brand-orange-hover text-black hover:scale-[1.01] cursor-pointer'
                              : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                          }`}
                        >
                          Concluir OS & Liberar Repasse
                        </button>
                      </div>
                    </div>
                  )}

                </div>

                {/* Right Side: Active OS Details Summary (4 cols) (SAAS CLIENT REVIEW PANEL) */}
                <div className="lg:col-span-4 bg-zinc-950 text-white border border-zinc-900 rounded-3xl p-5 sm:p-6 space-y-6 shadow-lg text-left">
                  <div className="space-y-1 bg-zinc-900/40 p-4 rounded-xl border border-zinc-900">
                    <span className="text-[9px] text-brand-orange uppercase tracking-widest font-black block font-mono">Ficha de Atendimento</span>
                    <h3 className="text-base font-black tracking-tight mt-1">
                      Metadados do Cliente
                    </h3>
                  </div>

                  <div className="space-y-4 text-xs">
                    {/* User profile details */}
                    <div className="flex items-center gap-3 bg-zinc-900 p-3.5 rounded-xl border border-zinc-850">
                      <div className="w-10 h-10 rounded-full bg-brand-orange/15 border border-brand-orange/30 flex items-center justify-center font-black text-brand-orange text-xs">
                        {selectedOS.clientName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <strong className="text-white block text-sm font-sans">{selectedOS.clientName}</strong>
                        <span className="text-zinc-500 block text-[10px] font-mono">+55 (19) 98765-4321</span>
                      </div>
                    </div>

                    {/* Vehicle info */}
                    <div className="space-y-1 bg-zinc-900/40 p-3 rounded-xl border border-zinc-900/60">
                      <span className="text-[10px] text-zinc-500 block uppercase font-bold font-mono">Motocicleta Cadastrada</span>
                      <strong className="text-brand-orange block text-sm mt-0.5">{selectedOS.motoModel}</strong>
                      <span className="text-zinc-400 font-mono text-[10px] block mt-1">Placa Oficial: {selectedOS.motoPlate}</span>
                    </div>

                    {/* GPS Delivery Address */}
                    <div className="space-y-1 bg-zinc-900/40 p-3 rounded-xl border border-zinc-900/60">
                      <span className="text-[10px] text-zinc-500 block uppercase font-bold font-mono">Endereço da Ocorrência</span>
                      <p className="text-zinc-300 leading-relaxed mt-1 text-[11px]">{selectedOS.address}</p>
                    </div>

                    {/* Inventory Items Separated */}
                    <div className="space-y-2.5">
                      <span className="text-[10px] text-zinc-500 block uppercase font-bold font-mono">Materiais Separados na Van</span>
                      <div className="flex flex-col gap-1.5">
                        {selectedOS.parts.map((part, idx) => (
                          <div key={idx} className="bg-zinc-900 border border-zinc-850 p-2.5 rounded-lg text-zinc-350 text-[10px] font-mono flex items-center justify-between gap-1.5">
                            <span className="flex items-center gap-2 truncate">
                              <Wrench className="w-3.5 h-3.5 text-brand-orange shrink-0" /> {part}
                            </span>
                            <span className="bg-emerald-950 text-emerald-400 font-mono text-[8px] font-bold px-1.5 py-0.5 rounded border border-emerald-900/30 shrink-0 uppercase">
                              Em Estoque
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-900">
                    <button
                      onClick={() => {
                        if (window.confirm('Deseja realmente abandonar o atendimento desta OS? O chamado voltará para a fila pública da central de despacho.')) {
                          setSelectedOS(null);
                        }
                      }}
                      className="w-full bg-zinc-900/60 hover:bg-zinc-900 text-red-400 border border-zinc-850 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors block font-mono cursor-pointer"
                    >
                      Abandonar Chamado ⚠️
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ----------------------------------------------------
            TAB 3: ME (MICROENTERPRISE) DATA MANAGEMENT
            ---------------------------------------------------- */}
        {activeTab === 'me-data' && (
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto shadow-sm text-left space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-zinc-150">
              <div className="space-y-1 text-left">
                <span className="text-[10px] bg-brand-orange/10 text-brand-orange font-black px-2.5 py-1 rounded-md uppercase tracking-wider font-mono border border-brand-orange/15">
                  DADOS FISCAIS DE FATURAMENTO
                </span>
                <h3 className="text-xl font-black text-zinc-900 uppercase tracking-tight mt-2.5 font-sans">
                  Gestão Cadastral da Microempresa (ME)
                </h3>
                <p className="text-zinc-500 text-xs mt-0.5">
                  A OttoMotos exige faturamento através de Pessoa Jurídica ativa para repasse das OSs homologadas.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className={`w-3 h-3 rounded-full ${isMeApproved ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`}></span>
                <span className={`text-xs font-black uppercase font-mono tracking-wider ${isMeApproved ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {meStatus === 'Approved' ? 'Homologado / Ativo' : 'Aguardando Análise'}
                </span>
              </div>
            </div>

            {meStatus === 'Pending' && (
              <div className="bg-amber-50/60 border border-amber-200 text-zinc-850 p-4 rounded-xl text-xs leading-relaxed">
                <strong className="text-zinc-950 font-bold block">Solicitação de Alteração Cadastral Submetida:</strong>
                O time fiscal da franquia OttoMotos avaliará o cadastro em até 24 horas úteis. Seu canal atual de repasses bancários continua ativo normalmente.
              </div>
            )}

            <form onSubmit={handleSaveMe} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-500 uppercase tracking-wider font-bold block font-mono">Razão Social / Nome Fantasia</label>
                  <input
                    type="text"
                    disabled={!isEditingMe}
                    value={meName}
                    onChange={(e) => setMeName(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-3 text-xs text-zinc-800 font-bold focus:outline-none focus:border-brand-orange disabled:opacity-60"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-zinc-500 uppercase tracking-wider font-bold block font-mono">CNPJ da Empresa</label>
                  <input
                    type="text"
                    disabled={!isEditingMe}
                    value={meCnpj}
                    onChange={(e) => setMeCnpj(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-3 text-xs text-zinc-800 font-bold font-mono focus:outline-none focus:border-brand-orange disabled:opacity-60"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-zinc-500 uppercase tracking-wider font-bold block font-mono">Responsável Técnico / Titular</label>
                  <input
                    type="text"
                    disabled={!isEditingMe}
                    value={meOwner}
                    onChange={(e) => setMeOwner(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-3 text-xs text-zinc-800 font-bold focus:outline-none focus:border-brand-orange disabled:opacity-60"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-zinc-500 uppercase tracking-wider font-bold block font-mono">Domicílio Bancário (Repasse OS)</label>
                  <select
                    disabled={!isEditingMe}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-3 text-xs text-zinc-800 font-bold focus:outline-none focus:border-brand-orange disabled:opacity-60"
                  >
                    <option>Banco Itaú Unibanco S.A. (Ag: 1245, CC: 88412-1)</option>
                    <option>Banco Bradesco S.A. (Ag: 2210, CC: 45012-3)</option>
                    <option>Nubank Pagamentos S.A. (CC: 229155-2)</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-200 flex justify-end gap-3">
                {isEditingMe ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsEditingMe(false)}
                      className="bg-zinc-150 hover:bg-zinc-250 text-zinc-700 font-black text-2xs uppercase tracking-wider py-3 px-5 rounded-xl transition-all font-mono"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="bg-brand-orange hover:bg-brand-orange-hover text-black font-extrabold text-2xs uppercase tracking-wider py-3 px-6 rounded-xl transition-all shadow-sm"
                    >
                      Submeter para Homologação
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditingMe(true)}
                    className="bg-zinc-950 hover:bg-zinc-900 text-white font-extrabold text-xs uppercase tracking-wider py-3 px-5 rounded-xl transition-all flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-brand-orange" /> Atualizar Informações PJ
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* ----------------------------------------------------
            TAB 4: PERFORMANCE DASHBOARD (KPIs)
            ---------------------------------------------------- */}
        {activeTab === 'performance' && (
          <div className="space-y-6 max-w-5xl mx-auto text-left">
            {/* KPI Cards row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Daily KPI */}
              <div className="bg-white border border-zinc-200 p-6 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden">
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-black block font-mono">Ganhos de Hoje</span>
                <div className="mt-4">
                  <h4 className="text-3xl font-black text-zinc-900 font-mono">R$ 150,00</h4>
                  <span className="text-[10px] text-emerald-600 font-mono font-bold block mt-1.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> ✓ Meta Diária de Turno Completa
                  </span>
                </div>
              </div>

              {/* Weekly KPI */}
              <div className="bg-white border border-zinc-200 p-6 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden">
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-black block font-mono">Faturamento da Semana</span>
                <div className="mt-4">
                  <h4 className="text-3xl font-black text-zinc-900 font-mono">R$ 975,00</h4>
                  <span className="text-[10px] text-emerald-600 font-mono font-bold block mt-1.5">
                    📈 +15% acima do faturamento médio da região
                  </span>
                </div>
              </div>

              {/* Monthly KPI */}
              <div className="bg-white border border-zinc-200 p-6 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden">
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-black block font-mono">Faturamento Mensal Acumulado</span>
                <div className="mt-4">
                  <h4 className="text-3xl font-black text-zinc-900 font-mono">R$ 4.125,00</h4>
                  <span className="text-[10px] text-zinc-500 font-mono font-bold block mt-1.5">
                    Soma líquida depositada em conta PJ
                  </span>
                </div>
              </div>
            </div>

            {/* Performance analysis charts simulation panel */}
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="space-y-1.5 border-b border-zinc-150 pb-4">
                <span className="text-[9px] bg-brand-orange/10 text-brand-orange font-black px-2.5 py-1 rounded-md uppercase tracking-wider font-mono border border-brand-orange/15">
                  INDICADORES DE PRODUTIVIDADE OPERACIONAL
                </span>
                <h3 className="text-base sm:text-lg font-black text-zinc-900 uppercase tracking-tight font-sans mt-2.5">
                  Evolução do Faturamento de Manutenções Semanais
                </h3>
              </div>

              {/* Pure CSS bar chart representation for pristine UI look */}
              <div className="h-64 flex items-end gap-6 pt-8 border-b border-zinc-200 relative">
                <div className="absolute top-0 left-0 text-2xs font-mono text-zinc-400 space-y-12">
                  <div>R$ 1.500</div>
                  <div>R$ 1.000</div>
                  <div>R$ 500</div>
                </div>

                {/* Bars */}
                <div className="flex-1 flex justify-around items-end h-full pl-16">
                  {/* Sem 1 */}
                  <div className="flex flex-col items-center gap-2 group w-12 cursor-pointer">
                    <span className="text-[9px] font-mono font-bold text-zinc-650 opacity-0 group-hover:opacity-100 transition-opacity">R$ 750</span>
                    <div className="bg-zinc-900 group-hover:bg-brand-orange w-full h-24 rounded-t-lg transition-all duration-200 shadow-sm"></div>
                    <span className="text-2xs font-bold text-zinc-500 font-sans uppercase">Sem 1</span>
                  </div>

                  {/* Sem 2 */}
                  <div className="flex flex-col items-center gap-2 group w-12 cursor-pointer">
                    <span className="text-[9px] font-mono font-bold text-zinc-650 opacity-0 group-hover:opacity-100 transition-opacity">R$ 900</span>
                    <div className="bg-zinc-900 group-hover:bg-brand-orange w-full h-28 rounded-t-lg transition-all duration-200 shadow-sm"></div>
                    <span className="text-2xs font-bold text-zinc-500 font-sans uppercase">Sem 2</span>
                  </div>

                  {/* Sem 3 */}
                  <div className="flex flex-col items-center gap-2 group w-12 cursor-pointer">
                    <span className="text-[9px] font-mono font-bold text-zinc-650 opacity-0 group-hover:opacity-100 transition-opacity">R$ 1.125</span>
                    <div className="bg-zinc-900 group-hover:bg-brand-orange w-full h-36 rounded-t-lg transition-all duration-200 shadow-sm"></div>
                    <span className="text-2xs font-bold text-zinc-500 font-sans uppercase">Sem 3</span>
                  </div>

                  {/* Sem 4 */}
                  <div className="flex flex-col items-center gap-2 group w-12 cursor-pointer">
                    <span className="text-[9px] font-mono font-bold text-zinc-900">R$ 1.350</span>
                    <div className="bg-brand-orange w-full h-44 rounded-t-lg shadow-sm"></div>
                    <span className="text-2xs font-black text-zinc-900 font-sans uppercase">Sem 4</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-zinc-500 pt-1">
                <span>*Toque em qualquer coluna semanal para ver o detalhamento analítico de Ordens finalizadas.</span>
                <span className="font-mono text-emerald-600 font-bold">✓ Evolução de faturamento constante de 18% ao mês</span>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
