import React, { useState, useEffect } from 'react';
import {
  Wrench,
  MapPin,
  Clock,
  Camera,
  CheckSquare,
  Trash2,
  Play,
  Square,
  User,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  FolderTree,
  Check,
  Plus,
  Edit2,
  Truck,
  FileText,
  ChevronRight,
  Eye,
  RefreshCw,
  Sliders,
  Shield,
  Activity,
  FileCode,
  Menu,
  X,
  Compass,
  Award
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
  const [activeTab, setActiveTab] = useState<'shift' | 'dashboard' | 'me-data' | 'performance'>('shift');
  // Navigation sub-view to switch easily between the active OS progress and the overall queue list
  const [dashboardSubView, setDashboardSubView] = useState<'os' | 'list'>('os');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Shift states
  const [isShiftActive, setIsShiftActive] = useState(false);
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
  
  // Stages states
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
    } else {
      setIsShiftActive(false);
      setDeadlineAlert(false);
      setActiveTab('shift');
    }
  };

  return (
    <div className="bg-zinc-950 min-h-screen text-zinc-900 font-sans flex flex-col md:flex-row antialiased">
      {/* MOBILE HEADER */}
      <div className="md:hidden bg-zinc-950 text-white flex justify-between items-center px-4 py-3 border-b border-zinc-900 w-full shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-orange"></span>
          <span className="font-sans font-black tracking-tight text-sm uppercase text-white">OttoMotos <span className="text-brand-orange">VanTablet</span></span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-zinc-400 hover:text-white">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* SIDEBAR (BLACK) */}
      <aside className={`
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        fixed md:relative top-0 left-0 bottom-0 z-40
        w-72 bg-zinc-950 text-white p-6 border-r border-zinc-900 flex flex-col justify-between
        transition-transform duration-300 ease-in-out h-full md:h-auto shrink-0
      `}>
        <div className="space-y-8">
          {/* Brand Logo & Info */}
          <div className="hidden md:flex flex-col gap-1 border-b border-zinc-900 pb-5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-brand-orange animate-pulse"></span>
              <span className="font-sans font-black tracking-widest text-lg uppercase text-white">OTTO<span className="text-brand-orange">MOTOS</span></span>
            </div>
            <div className="text-[10px] text-zinc-500 font-mono flex items-center justify-between mt-1">
              <span>SISTEMA DE FRANQUIA</span>
              <span className="bg-zinc-900 px-1.5 py-0.5 rounded text-brand-orange font-bold">V4.8-PRO</span>
            </div>
          </div>

          {/* Van/Shift Status Pill */}
          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Status do Turno</span>
              <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                isShiftActive ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' : 'bg-zinc-950 text-zinc-550 border border-zinc-850'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isShiftActive ? 'bg-emerald-400 animate-ping' : 'bg-zinc-500'}`}></span>
                {isShiftActive ? 'Ativo / Em Rota' : 'Inativo'}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-zinc-400">
                <span>Período:</span>
                <span className="font-semibold text-white">{shiftStart} - {shiftEnd}</span>
              </div>
              <div className="flex justify-between text-[11px] text-zinc-400">
                <span>Atendimento:</span>
                <span className="font-semibold text-white">{serviceType === 'mobile' ? 'Móvel (Van)' : 'Fixo (Base)'}</span>
              </div>
            </div>

            {isShiftActive && (
              <div className="text-[10px] text-zinc-500 font-mono bg-zinc-950/80 p-2 rounded border border-zinc-850">
                🚐 <span className="font-semibold text-zinc-300">OttoVan #02</span> ativa na região de Campinas-SP.
              </div>
            )}
          </div>

          {/* Navigation Menu (Black Side Menu) */}
          <nav className="space-y-1.5">
            <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-black block mb-2 font-mono">Operacional</span>
            
            <button
              onClick={() => { setActiveTab('shift'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'shift' ? 'bg-zinc-900 text-white border-l-4 border-brand-orange pl-4' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sliders className="w-4 h-4 text-brand-orange" />
                <span>Configurar Turno</span>
              </div>
              <ChevronRight className="w-3 h-3 text-zinc-600" />
            </button>

            <button
              onClick={() => {
                if (!isShiftActive) {
                  alert('Por favor, ative seu turno primeiro na tela de "Configurar Turno"!');
                  return;
                }
                setActiveTab('dashboard');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                !isShiftActive ? 'opacity-40 cursor-not-allowed' : ''
              } ${
                activeTab === 'dashboard' ? 'bg-zinc-900 text-white border-l-4 border-brand-orange pl-4' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Wrench className="w-4 h-4 text-brand-orange" />
                <span>Painel de Chamados</span>
              </div>
              <span className="bg-brand-orange text-black font-black text-[9px] px-1.5 py-0.5 rounded-full font-mono">
                {orders.filter(o => o.status === 'PENDING').length}
              </span>
            </button>

            <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-black block pt-6 mb-2 font-mono">Administrativo</span>

            <button
              onClick={() => { setActiveTab('me-data'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'me-data' ? 'bg-zinc-900 text-white border-l-4 border-brand-orange pl-4' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-brand-orange" />
                <span>Dados de Microempresa</span>
              </div>
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                isMeApproved ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
              }`}>
                {meStatus === 'Approved' ? 'Ok' : 'Pendente'}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('performance'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'performance' ? 'bg-zinc-900 text-white border-l-4 border-brand-orange pl-4' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <TrendingUp className="w-4 h-4 text-brand-orange" />
                <span>Indicadores (KPIs)</span>
              </div>
              <ChevronRight className="w-3 h-3 text-zinc-600" />
            </button>
          </nav>
        </div>

        {/* Back and Exit Button */}
        <div className="pt-6 border-t border-zinc-900 space-y-3">
          <div className="text-[10px] text-zinc-500 font-mono text-center">
            Logado como: <strong>Danilo Otto</strong>
          </div>
        </div>
      </aside>

      {/* MAIN PANEL CONTENT (WHITE FOR CONTENT PANELS) */}
      <main className="flex-1 bg-zinc-50 p-4 sm:p-8 overflow-y-auto min-h-screen">
        {/* TOP STATUS NAVIGATION BAR */}
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
          <div className="text-left">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-black block font-mono">PORTAL DE OPERAÇÕES DE MOTO-CONVENIÊNCIA</span>
            <h1 className="text-xl sm:text-2xl font-black text-black font-sans uppercase">
              {activeTab === 'shift' && 'Configurar Turno & Escala'}
              {activeTab === 'dashboard' && 'Lista de Chamados Ativos'}
              {activeTab === 'me-data' && 'Gerenciador de Dados ME'}
              {activeTab === 'performance' && 'Rendimento & Desempenho'}
              {selectedOS && activeTab === 'dashboard' && ' | Ordem de Serviço em Progresso'}
            </h1>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs bg-zinc-100 border border-zinc-200 text-zinc-700 px-3 py-1.5 rounded-lg font-bold">
            <Clock className="w-3.5 h-3.5 text-brand-orange" />
            <span>Simulador: {currentTimeSim} ({shiftEnd} Limite)</span>
          </div>
        </div>

        {/* SHIFT DEADLINE ALERT */}
        {isShiftActive && deadlineAlert && (
          <div className="bg-amber-50 border-l-4 border-brand-orange text-zinc-800 p-4 rounded-xl mb-6 text-left flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
            <div className="flex gap-3 items-start">
              <AlertTriangle className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
              <div>
                <h5 className="font-extrabold text-zinc-900 text-xs sm:text-sm uppercase font-sans">Alerta: Turno Prestes a Expirar!</h5>
                <p className="text-xs text-zinc-650 mt-0.5">
                  Faltam apenas 15 minutos para o encerramento planejado do seu expediente às <strong className="text-zinc-950 font-bold">{shiftEnd}</strong>. Tem novos chamados na fila ou deseja estender seu horário de disponibilidade?
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShiftEnd('19:00');
                  setDeadlineAlert(false);
                  alert('Expediente estendido até às 19:00 com sucesso!');
                }}
                className="bg-brand-orange hover:bg-brand-orange-hover text-black font-black text-2xs uppercase tracking-wider py-2 px-3.5 rounded-lg transition-all"
              >
                Estender +2 Horas
              </button>
              <button
                onClick={() => setDeadlineAlert(false)}
                className="bg-zinc-200 hover:bg-zinc-300 text-zinc-700 font-extrabold text-2xs uppercase tracking-wider py-2 px-3.5 rounded-lg transition-all"
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
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto shadow-md text-left space-y-8 animate-fade-in">
            <div className="space-y-2">
              <span className="text-[10px] text-brand-orange uppercase tracking-widest font-black block font-mono">PORTAL DE ACESSO DO PARCEIRO</span>
              <h2 className="text-2xl font-black text-black uppercase tracking-tight font-sans">
                Selecione as Regras de Trabalho de Hoje
              </h2>
              <p className="text-zinc-500 text-xs sm:text-sm">
                Configure os detalhes do seu expediente antes de receber pedidos geolocalizados de manutenção em Campinas-SP.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Form Elements */}
              <div className="space-y-5">
                {/* 1. Status toggle */}
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 uppercase tracking-wider font-black block font-mono">Disponibilidade</label>
                  <div className="flex items-center gap-4 bg-zinc-50 p-4 rounded-2xl border border-zinc-150">
                    <div className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isShiftActive}
                        onChange={handleToggleShift}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-zinc-350 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-orange"></div>
                    </div>
                    <div>
                      <strong className="text-sm font-bold text-zinc-900 block">
                        {isShiftActive ? 'Estou Online (Recebendo Rotas)' : 'Estou Offline (Expediente Pausado)'}
                      </strong>
                      <span className="text-2xs text-zinc-500 block">
                        {isShiftActive ? 'Sua localização e van estão visíveis aos clientes' : 'Ative para receber ordens de serviço no seu raio'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Type of Service */}
                <div className="space-y-2">
                  <label className="text-xs text-zinc-500 uppercase tracking-wider font-black block font-mono font-bold">Tipo de Atendimento Operado</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setServiceType('mobile')}
                      className={`p-4 rounded-2xl text-left border transition-all ${
                        serviceType === 'mobile'
                          ? 'border-brand-orange bg-zinc-950 text-white shadow-md'
                          : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'
                      }`}
                    >
                      <Truck className={`w-5 h-5 mb-2 ${serviceType === 'mobile' ? 'text-brand-orange' : 'text-zinc-400'}`} />
                      <strong className="text-xs block font-bold">Unidade Móvel (Van)</strong>
                      <span className={`text-[10px] block leading-relaxed mt-1 ${serviceType === 'mobile' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        Desloca-se até o cliente com a furgão-oficina totalmente equipada.
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setServiceType('fixed')}
                      className={`p-4 rounded-2xl text-left border transition-all ${
                        serviceType === 'fixed'
                          ? 'border-brand-orange bg-zinc-950 text-white shadow-md'
                          : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'
                      }`}
                    >
                      <MapPin className={`w-5 h-5 mb-2 ${serviceType === 'fixed' ? 'text-brand-orange' : 'text-zinc-400'}`} />
                      <strong className="text-xs block font-bold">Ponto Fixo (Malls)</strong>
                      <span className={`text-[10px] block leading-relaxed mt-1 ${serviceType === 'fixed' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        Atendimento estacionado em shopping parceiro ou base local homologada.
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Form Elements */}
              <div className="space-y-5 bg-zinc-50 p-6 rounded-2xl border border-zinc-150 flex flex-col justify-between">
                <div className="space-y-4">
                  <label className="text-xs text-zinc-500 uppercase tracking-wider font-black block font-mono font-bold">Horário Planejado de Turno</label>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] text-zinc-500 block font-bold">Horário de Início</span>
                      <input
                        type="time"
                        value={shiftStart}
                        onChange={(e) => setShiftStart(e.target.value)}
                        className="w-full bg-white border border-zinc-200 rounded-lg p-2.5 text-xs text-zinc-800 font-bold focus:outline-none focus:border-brand-orange"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-zinc-500 block font-bold">Horário de Término</span>
                      <input
                        type="time"
                        value={shiftEnd}
                        onChange={(e) => setShiftEnd(e.target.value)}
                        className="w-full bg-white border border-zinc-200 rounded-lg p-2.5 text-xs text-zinc-800 font-bold focus:outline-none focus:border-brand-orange"
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <span className="text-2xs text-zinc-500 uppercase tracking-wider font-mono font-bold block">Regras Operacionais de Disponibilidade</span>
                    <ul className="text-2xs text-zinc-650 leading-relaxed space-y-1.5 list-disc pl-4">
                      <li>O sistema envia chamados geolocalizados até 45 min antes do término do seu turno.</li>
                      <li>Para receber bônus por produtividade no dia, seu expediente online mínimo deve ser de 4 horas continuas.</li>
                      <li>Em caso de urgência, altere sua chave de disponibilidade para Offline imediatamente.</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-200">
                  <button
                    onClick={handleToggleShift}
                    className="w-full bg-brand-orange hover:bg-brand-orange-hover text-black font-extrabold py-3 px-4 rounded-xl text-xs uppercase tracking-widest text-center transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isShiftActive ? (
                      <>
                        <Square className="w-4 h-4 fill-black" /> Encerrar Disponibilidade
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-black" /> Iniciar Turno e Abrir Van
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
          <div className="space-y-8 animate-fade-in">
            {/* Navigation sub-view selection header displayed when there is an active OS */}
            {selectedOS && (
              <div className="bg-white border border-zinc-200 p-2.5 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-center gap-2 max-w-7xl mx-auto text-left">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setDashboardSubView('os')}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                      dashboardSubView === 'os'
                        ? 'bg-brand-orange text-black font-extrabold shadow-sm cursor-pointer'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-black font-bold cursor-pointer'
                    }`}
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    Atendimento em Progresso ({selectedOS.id})
                  </button>
                  <button
                    onClick={() => setDashboardSubView('list')}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                      dashboardSubView === 'list'
                        ? 'bg-zinc-950 text-white font-extrabold shadow-sm cursor-pointer'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-black font-bold cursor-pointer'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Lista de Chamados / Fila de Despacho
                  </button>
                </div>
                <div className="text-[11px] text-zinc-500 font-mono flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Navegue livremente sem perder seu progresso atual
                </div>
              </div>
            )}

            {/* If no order is selected or if user toggled to view the list */}
            {!selectedOS || dashboardSubView === 'list' ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left items-stretch">
                {/* Active queue list (Left 2 cols) */}
                <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                  <div className="flex justify-between items-center pb-4 border-b border-zinc-150">
                    <div>
                      <h3 className="text-lg font-extrabold text-zinc-950 uppercase tracking-tight font-sans">
                        Fila de Despacho Próxima
                      </h3>
                      <p className="text-zinc-500 text-xs">
                        Ordens de serviço solicitadas por clientes na sua área de cobertura em Campinas.
                      </p>
                    </div>
                    <span className="bg-zinc-100 border border-zinc-200 text-zinc-700 font-bold text-xs px-3 py-1 rounded-full font-mono">
                      {orders.filter(o => o.status === 'PENDING').length} OS aguardando
                    </span>
                  </div>

                  <div className="space-y-4">
                    {orders.filter(o => o.status !== 'COMPLETED').map((os) => (
                      <div
                        key={os.id}
                        className={`border rounded-2xl p-5 hover:border-brand-orange transition-all duration-200 relative group flex flex-col justify-between ${
                          selectedOS?.id === os.id
                            ? 'bg-brand-orange/5 border-brand-orange ring-1 ring-brand-orange/20'
                            : 'bg-zinc-50 border-zinc-150'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="bg-brand-orange text-black font-mono font-black text-xs px-2 py-0.5 rounded">
                                {os.id}
                              </span>
                              <span className="text-2xs text-zinc-500 font-mono font-bold uppercase">
                                Est. {os.estimatedTimeM} min
                              </span>
                            </div>
                            {selectedOS?.id === os.id ? (
                              <span className="text-2xs font-extrabold text-white uppercase bg-zinc-950 border border-zinc-900 px-2.5 py-0.5 rounded-full font-mono flex items-center gap-1 animate-pulse">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                Chamado em Andamento
                              </span>
                            ) : (
                              <span className="text-2xs font-bold text-brand-orange uppercase bg-brand-orange-light border border-brand-orange/25 px-2 py-0.5 rounded-full font-mono">
                                Aguardando Aceite
                              </span>
                            )}
                          </div>

                          <div className="space-y-1">
                            <h4 className="font-extrabold text-zinc-950 text-sm sm:text-base font-sans">{os.serviceName}</h4>
                            <p className="text-xs text-zinc-650 flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                              Cliente: <strong>{os.clientName}</strong> | Moto: <strong>{os.motoModel}</strong> ({os.motoPlate})
                            </p>
                            <p className="text-xs text-zinc-650 flex items-start gap-1.5 leading-normal">
                              <MapPin className="w-3.5 h-3.5 text-brand-orange shrink-0 mt-0.5" />
                              <span>{os.address}</span>
                            </p>
                          </div>

                          <div className="pt-2 flex flex-wrap gap-1.5">
                            {os.parts.map((p, idx) => (
                              <span key={idx} className="bg-white border border-zinc-200 text-zinc-600 px-2 py-0.5 rounded text-[10px] font-medium font-mono">
                                ⚙ {p}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-zinc-200/60 mt-4 flex justify-end">
                          {selectedOS?.id === os.id ? (
                            <button
                              onClick={() => setDashboardSubView('os')}
                              className="bg-zinc-950 hover:bg-zinc-900 text-white font-extrabold text-2xs uppercase tracking-widest py-2 px-5 rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow"
                            >
                              Continuar Atendimento <ChevronRight className="w-3.5 h-3.5" />
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
                              className="bg-brand-orange hover:bg-brand-orange-hover text-black font-extrabold text-2xs uppercase tracking-widest py-2 px-5 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                            >
                              Abrir OS e Ver Rota <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {orders.filter(o => o.status !== 'COMPLETED').length === 0 && (
                      <div className="p-12 text-center text-zinc-400 bg-zinc-50 border border-dashed border-zinc-200 rounded-2xl">
                        <Activity className="w-8 h-8 text-zinc-350 mx-auto mb-2 animate-pulse" />
                        <p className="text-xs font-bold font-sans uppercase">Nenhum chamado ativo na fila</p>
                        <p className="text-2xs text-zinc-500 mt-1">
                          Aguardando que clientes solicitem serviços ou o algoritmo distribua novos chamados.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right sidebar: quick KPIs of the day */}
                <div className="bg-zinc-950 text-white border border-zinc-900 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <span className="text-[10px] text-brand-orange uppercase tracking-widest font-black block font-mono">Resumo Operacional de Hoje</span>
                    <h3 className="text-lg font-black tracking-tight font-sans">
                      Performance das Últimas Horas
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Rastreie seus ganhos e agilidade no atendimento das chamadas finalizadas hoje.
                    </p>

                    <div className="space-y-3 pt-2">
                      <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex justify-between items-center">
                        <div className="text-left">
                          <span className="text-[10px] text-zinc-500 uppercase font-bold block">Ganhos de Hoje</span>
                          <span className="text-xl font-black text-brand-orange font-mono">R$ 150,00</span>
                        </div>
                        <span className="bg-emerald-950 text-emerald-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                          2 OS Concluídas
                        </span>
                      </div>

                      <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex justify-between items-center">
                        <div className="text-left">
                          <span className="text-[10px] text-zinc-500 uppercase font-bold block">Tempo Médio SLA</span>
                          <span className="text-lg font-black text-white font-mono">23 min / OS</span>
                        </div>
                        <span className="bg-emerald-950 text-emerald-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                          Meta &lt; 30 min
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-850/80 text-left space-y-2 text-xs">
                    <div className="flex gap-2 items-start text-zinc-400">
                      <Shield className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                      <p className="text-2xs leading-normal">
                        <strong>Lembrete de Segurança:</strong> Lembre-se de sempre filmar o checklist de avarias e fotos de vistoria. A plataforma monitora rigorosamente.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* ACTIVE WORK MODE SEQUENCE (STAGES A, B, C, D) */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left items-start">
                {/* Workflow Left Side (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                  {/* WORK MODE COMPASS BAR */}
                  <div className="bg-zinc-950 text-white rounded-2xl p-4 border border-zinc-900 flex justify-between items-center flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-orange/10 border border-brand-orange/30 flex items-center justify-center font-bold text-brand-orange">
                        {stage}
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase font-black block font-mono">CHAMADO EM EXECUÇÃO</span>
                        <h4 className="font-extrabold text-xs sm:text-sm text-white uppercase font-sans">
                          {selectedOS.motoModel} - {selectedOS.serviceName}
                        </h4>
                      </div>
                    </div>

                    {/* Step wizard indicators */}
                    <div className="flex items-center gap-1.5 sm:gap-2.5">
                      <button
                        disabled={stage === 'A'}
                        onClick={() => {
                          if (stage === 'D') setStage('C');
                          else if (stage === 'C') setStage('B');
                          else if (stage === 'B') setStage('A');
                        }}
                        className="p-1 px-2.5 text-[10px] uppercase font-bold text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 rounded disabled:opacity-30 disabled:hover:text-zinc-400"
                      >
                        Voltar
                      </button>

                      <div className="flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${stage === 'A' ? 'bg-brand-orange' : 'bg-zinc-700'}`} title="Despacho"></span>
                        <span className={`w-2 h-2 rounded-full ${stage === 'B' ? 'bg-brand-orange' : 'bg-zinc-700'}`} title="Preparação"></span>
                        <span className={`w-2 h-2 rounded-full ${stage === 'C' ? 'bg-brand-orange' : 'bg-zinc-700'}`} title="Reparo"></span>
                        <span className={`w-2 h-2 rounded-full ${stage === 'D' ? 'bg-brand-orange' : 'bg-zinc-700'}`} title="Encerramento"></span>
                      </div>
                    </div>
                  </div>

                  {/* ----------------- STAGE A: DISPATCH PANEL ----------------- */}
                  {stage === 'A' && (
                    <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in">
                      <div className="space-y-1">
                        <span className="text-2xs bg-brand-orange-light text-brand-orange font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono border border-brand-orange/15">
                          FASE A: ROTEAMENTO DA OTTOVAN
                        </span>
                        <h3 className="text-xl font-black text-zinc-950 uppercase tracking-tight font-sans mt-2">
                          Aceitar Chamado e Iniciar Rota
                        </h3>
                        <p className="text-zinc-500 text-xs">
                          O cliente Carol Silva está aguardando a chegada da sua van móvel de atendimento no endereço especificado.
                        </p>
                      </div>

                      {/* Map Simulation */}
                      <div className="relative w-full h-80 bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 flex items-center justify-center">
                        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#1c1c1e_1px,transparent_1px)] [background-size:16px_16px]"></div>
                        
                        {/* Map graphical points represent GPS layout */}
                        <div className="relative w-full h-full flex items-center justify-center">
                          {/* Simulated path drawing */}
                          <svg className="absolute inset-0 w-full h-full">
                            <path d="M 150 120 Q 280 180, 420 220" fill="transparent" stroke="#FF5A00" strokeWidth="4" strokeDasharray="8,4" className="animate-[dash_2s_linear_infinite]" />
                          </svg>

                          {/* Pin 1: OttoVan */}
                          <div className="absolute left-[150px] top-[120px] flex flex-col items-center">
                            <span className="bg-black text-brand-orange text-[9px] font-black font-mono px-1.5 py-0.5 rounded-md border border-zinc-800 whitespace-nowrap shadow-md mb-1 animate-bounce">
                              🚐 SUA OTTOVAN #02
                            </span>
                            <div className="w-5 h-5 bg-brand-orange border-2 border-white rounded-full flex items-center justify-center shadow-lg">
                              <Compass className="w-3 h-3 text-black animate-spin" />
                            </div>
                          </div>

                          {/* Pin 2: Client */}
                          <div className="absolute left-[420px] top-[220px] flex flex-col items-center">
                            <span className="bg-white text-zinc-900 text-[9px] font-black font-mono px-1.5 py-0.5 rounded-md border border-zinc-200 whitespace-nowrap shadow-md mb-1">
                              📍 MOTOCICLISTA (CAROL)
                            </span>
                            <div className="w-5 h-5 bg-zinc-950 border-2 border-brand-orange rounded-full flex items-center justify-center shadow-lg">
                              <MapPin className="w-3 h-3 text-brand-orange" />
                            </div>
                          </div>

                          <div className="absolute bottom-4 left-4 right-4 bg-zinc-950/90 text-white p-3 rounded-xl border border-zinc-800 text-2xs space-y-1 font-mono flex justify-between items-center">
                            <span>SISTEMA INTEGRADO GPS WAZE / MAPS</span>
                            <span className="text-brand-orange">✓ Rota rápida gerada via Cambuí</span>
                          </div>
                        </div>
                      </div>

                      {/* OS Alert details Card */}
                      <div className="bg-zinc-50 border border-zinc-200 p-5 rounded-2xl flex flex-col md:flex-row justify-between gap-6">
                        <div className="space-y-2.5 text-left flex-1">
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-bold block">Ficha Resumida do Chamado</span>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-2xs text-zinc-500 block font-bold">Endereço de Atendimento:</span>
                              <span className="text-xs text-zinc-800 font-bold leading-normal block">{selectedOS.address}</span>
                            </div>
                            <div>
                              <span className="text-2xs text-zinc-500 block font-bold">Modelo & Placa da Moto:</span>
                              <span className="text-xs text-zinc-800 font-bold block">{selectedOS.motoModel} ({selectedOS.motoPlate})</span>
                            </div>
                            <div>
                              <span className="text-2xs text-zinc-500 block font-bold">Procedimento Solicitado:</span>
                              <span className="text-xs text-zinc-800 font-extrabold block">{selectedOS.serviceName}</span>
                            </div>
                            <div>
                              <span className="text-2xs text-zinc-500 block font-bold">Peças Separadas de Estoque:</span>
                              <span className="text-xs text-zinc-800 font-bold block">{selectedOS.parts.join(', ')}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-zinc-200 flex justify-between gap-4">
                        <button
                          onClick={() => {
                            setSelectedOS(null);
                          }}
                          className="bg-zinc-200 hover:bg-zinc-300 text-zinc-700 font-black text-2xs uppercase tracking-widest py-3 px-6 rounded-xl transition-all"
                        >
                          Cancelar e Voltar à Fila
                        </button>

                        <button
                          onClick={() => {
                            setStage('B');
                          }}
                          className="flex-1 bg-brand-orange hover:bg-brand-orange-hover text-black font-extrabold text-2xs uppercase tracking-widest py-3 px-6 rounded-xl text-center transition-all shadow-md hover:scale-[1.01] cursor-pointer"
                        >
                          Aceitar OS e Iniciar Deslocamento (GPS)
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ----------------- STAGE B: PREPARATION & CHECKLIST ----------------- */}
                  {stage === 'B' && (
                    <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in">
                      <div className="space-y-1">
                        <span className="text-2xs bg-brand-orange-light text-brand-orange font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono border border-brand-orange/15">
                          FASE B: RECEPÇÃO E PREPARAÇÃO DO VEÍCULO (NO LOCAL)
                        </span>
                        <h3 className="text-xl font-black text-zinc-950 uppercase tracking-tight font-sans mt-2">
                          Vistoria Prévias e Check-in da Moto
                        </h3>
                        <p className="text-zinc-500 text-xs">
                          Você chegou ao local do cliente! Faça o check-in físico e registre quaisquer avarias ou riscos pré-existentes na moto.
                        </p>
                      </div>

                      {/* Arrival Check-in button */}
                      <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="text-left">
                          <strong className="text-xs text-zinc-900 block font-bold">Confirmação de Chegada (GPS Check-in)</strong>
                          <span className="text-[10px] text-zinc-550 block">O app notificará o cliente de que a van chegou em frente à sua residência.</span>
                        </div>
                        <button
                          type="button"
                          disabled={preChecklist.scratches} // Disabled to simulate completed check-in once we start checklists
                          className="bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold text-2xs uppercase tracking-wider py-2.5 px-4 rounded-xl transition-all flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4 text-emerald-400" /> Confirmado no Local
                        </button>
                      </div>

                      {/* Damage Checklist & protective film form */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                        
                        {/* Inspection form */}
                        <div className="space-y-4 bg-zinc-50 p-5 rounded-2xl border border-zinc-200">
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-bold block">1. Checklist Digital de Avarias</span>
                          
                          <div className="space-y-3">
                            <label className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-zinc-200 hover:border-brand-orange/40 transition-colors cursor-pointer">
                              <input
                                type="checkbox"
                                checked={preChecklist.scratches}
                                onChange={(e) => setPreChecklist(prev => ({ ...prev, scratches: e.target.checked }))}
                                className="rounded text-brand-orange focus:ring-brand-orange w-4 h-4"
                              />
                              <span className="text-xs text-zinc-700 font-medium">Moto tem arranhões/avarias prévias no tanque ou carenagem</span>
                            </label>

                            <label className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-zinc-200 hover:border-brand-orange/40 transition-colors cursor-pointer">
                              <input
                                type="checkbox"
                                checked={preChecklist.leaks}
                                onChange={(e) => setPreChecklist(prev => ({ ...prev, leaks: e.target.checked }))}
                                className="rounded text-brand-orange focus:ring-brand-orange w-4 h-4"
                              />
                              <span className="text-xs text-zinc-700 font-medium">Vazamentos aparentes no motor ou amortecedor</span>
                            </label>

                            <label className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-zinc-200 hover:border-brand-orange/40 transition-colors cursor-pointer">
                              <input
                                type="checkbox"
                                checked={preChecklist.tires}
                                onChange={(e) => setPreChecklist(prev => ({ ...prev, tires: e.target.checked }))}
                                className="rounded text-brand-orange focus:ring-brand-orange w-4 h-4"
                              />
                              <span className="text-xs text-zinc-700 font-medium">Pneus desgastados (abaixo do TWI recomendável)</span>
                            </label>

                            <label className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-zinc-200 hover:border-brand-orange/40 transition-colors cursor-pointer">
                              <input
                                type="checkbox"
                                checked={preChecklist.mirrors}
                                onChange={(e) => setPreChecklist(prev => ({ ...prev, mirrors: e.target.checked }))}
                                className="rounded text-brand-orange focus:ring-brand-orange w-4 h-4"
                              />
                              <span className="text-xs text-zinc-700 font-medium">Retrovisores ou pisca soltos/rachados</span>
                            </label>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] text-zinc-550 block font-bold">Observações adicionais de avaria física:</span>
                            <textarea
                              value={visualNotes}
                              onChange={(e) => setVisualNotes(e.target.value)}
                              placeholder="Descreva detalhes como rachaduras, ferrugem, peças adaptadas..."
                              className="w-full bg-white border border-zinc-200 rounded-lg p-2.5 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-brand-orange h-16"
                            />
                          </div>
                        </div>

                        {/* Photo upload and info */}
                        <div className="space-y-5 bg-zinc-50 p-5 rounded-2xl border border-zinc-200 flex flex-col justify-between">
                          <div className="space-y-4 text-left">
                            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-bold block">2. Registro Fotográfico de Vistoria</span>
                            
                            {/* Camera upload simulator */}
                            <div className="space-y-2">
                              <span className="text-[10px] text-zinc-550 block font-bold">Fotos de Vistoria de Avarias (Opcional):</span>
                              <div className="flex items-center gap-3">
                                <div className="w-16 h-16 rounded-xl overflow-hidden border border-zinc-200 relative">
                                  <img src={uploadedPhotos[0]} alt="Checklist damage" className="w-full h-full object-cover" />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    alert('Simulador: Câmera ativada! Foto tirada com sucesso.');
                                  }}
                                  className="bg-white hover:bg-zinc-100 border border-zinc-250 text-zinc-700 font-extrabold text-2xs uppercase tracking-wider py-2.5 px-3 rounded-lg flex items-center gap-1 shadow-sm"
                                >
                                  <Camera className="w-4 h-4 text-zinc-550" /> Tirar Nova Foto
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="text-[10px] text-zinc-550 font-mono leading-normal bg-zinc-100 p-2.5 rounded border border-zinc-200">
                            🔒 Checklist digital e fotos de avarias integrados com Inteligência Artificial para validação legal.
                          </div>
                        </div>

                      </div>

                      <div className="pt-4 border-t border-zinc-200 flex justify-between gap-4">
                        <button
                          onClick={() => setStage('A')}
                          className="bg-zinc-200 hover:bg-zinc-300 text-zinc-700 font-black text-2xs uppercase tracking-widest py-3 px-6 rounded-xl transition-all"
                        >
                          Voltar ao Roteamento
                        </button>

                        <button
                          onClick={() => {
                            setStage('C');
                            setTimerActive(true);
                          }}
                          className="flex-1 bg-brand-orange hover:bg-brand-orange-hover text-black font-extrabold text-2xs uppercase tracking-widest py-3 px-6 rounded-xl text-center transition-all shadow-md hover:scale-[1.01] cursor-pointer"
                        >
                          Concluir Preparação e Iniciar Reparo (Mão na Massa)
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ----------------- STAGE C: REPAIR & STREAMING CAMERA ----------------- */}
                  {stage === 'C' && (
                    <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in">
                      <div className="space-y-1">
                        <span className="text-2xs bg-brand-orange-light text-brand-orange font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono border border-brand-orange/15">
                          FASE C: EXECUÇÃO DO CONSERTO NA VAN
                        </span>
                        <h3 className="text-xl font-black text-zinc-950 uppercase tracking-tight font-sans mt-2">
                          Reparo Sob Câmera & SLA Cronometrado
                        </h3>
                        <p className="text-zinc-500 text-xs">
                          Siga as tarefas obrigatórias com total conformidade. O cronômetro e a câmera de transmissão do cliente estão monitorando ativamente.
                        </p>
                      </div>

                      {/* TOP PANEL: TIMER AND CAMERA STATUS */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* SLA Stopwatch (Orange Background for highlight) */}
                        <div className="bg-zinc-950 text-white border border-zinc-900 p-5 rounded-2xl text-left flex flex-col justify-between relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <Clock className="w-32 h-32 text-brand-orange" />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] text-brand-orange uppercase font-black tracking-widest font-mono flex items-center gap-1">
                              <Activity className="w-3 h-3 text-brand-orange" /> CRONÔMETRO SLA DE REPARO
                            </span>
                            <div className="text-4xl font-black font-mono tracking-tight text-white mt-1 animate-pulse">
                              {formatTime(timerRemaining)}
                            </div>
                            <p className="text-[10px] text-zinc-400 font-mono">
                              Tempo restante estimado da OS ({selectedOS.estimatedTimeM} minutos sugeridos).
                            </p>
                          </div>

                          <div className="pt-4 flex gap-2">
                            <button
                              type="button"
                              onClick={() => setTimerActive(!timerActive)}
                              className={`text-[10px] uppercase font-black tracking-wider py-1.5 px-3.5 rounded-lg flex items-center gap-1 transition-colors ${
                                timerActive ? 'bg-zinc-800 text-amber-400 hover:bg-zinc-700' : 'bg-brand-orange text-black font-extrabold hover:bg-brand-orange-hover'
                              }`}
                            >
                              {timerActive ? <Square className="w-3 h-3 fill-amber-400" /> : <Play className="w-3 h-3 fill-black" />}
                              {timerActive ? 'Pausar Tempo' : 'Iniciar Tempo'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setTimerRemaining(selectedOS.estimatedTimeM * 60)}
                              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-[10px] uppercase font-bold py-1.5 px-3.5 rounded-lg transition-colors flex items-center gap-1"
                            >
                              <RefreshCw className="w-3 h-3" /> Reiniciar
                            </button>
                          </div>
                        </div>

                        {/* Customer Live Stream Panel */}
                        <div className="bg-zinc-900 text-white p-5 rounded-2xl relative overflow-hidden border border-zinc-800 flex flex-col justify-between">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] text-zinc-400 uppercase font-bold font-mono">Câmera de Transmissão 01</span>
                            
                            <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                              cameraOn ? 'bg-red-950 text-red-400 border border-red-900' : 'bg-zinc-950 text-zinc-500 border border-zinc-850'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${cameraOn ? 'bg-red-500 animate-ping' : 'bg-zinc-650'}`}></span>
                              {cameraOn ? 'AO VIVO PARA O CLIENTE' : 'CÂMERA DESATIVADA'}
                            </span>
                          </div>

                          <div className="py-2 flex items-center gap-3">
                            <Camera className={`w-10 h-10 ${cameraOn ? 'text-red-500' : 'text-zinc-650'}`} />
                            <div className="text-left">
                              <h5 className="font-extrabold text-xs text-white uppercase font-sans">Câmera de Teto OttoVan</h5>
                              <p className="text-[10px] text-zinc-400">
                                Carol Silva está assistindo a manutenção do filtro de óleo em tempo real no app dela.
                              </p>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-zinc-850 flex justify-between items-center text-[10px]">
                            <span className="text-zinc-500">Transmissão em HD 1080p via LTE</span>
                            <button
                              onClick={() => setCameraOn(!cameraOn)}
                              className="text-brand-orange hover:underline font-bold"
                            >
                              {cameraOn ? 'Desligar Canal' : 'Ligar Canal'}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* STEP-BY-STEP REPLACEMENT TASKS */}
                      <div className="space-y-4 bg-zinc-50 p-5 rounded-2xl border border-zinc-200">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-bold block">Ficha de Reposição e Checklist Operacional</span>
                          <span className="text-[10px] text-zinc-500 font-mono">
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
                              className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                                task.done
                                  ? 'bg-zinc-950 text-white border-zinc-950'
                                  : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300'
                              }`}
                            >
                              <div className={`w-5 h-5 rounded-md flex items-center justify-center border mt-0.5 shrink-0 ${
                                task.done ? 'bg-brand-orange border-brand-orange' : 'border-zinc-300 bg-white'
                              }`}>
                                {task.done && <Check className="w-3.5 h-3.5 text-black stroke-[3]" />}
                              </div>
                              <div className="text-left">
                                <span className="text-xs font-bold leading-normal block">{task.name}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* OS Completion navigation triggers */}
                      <div className="pt-4 border-t border-zinc-200 flex justify-between gap-4">
                        <button
                          onClick={() => setStage('B')}
                          className="bg-zinc-200 hover:bg-zinc-300 text-zinc-700 font-black text-2xs uppercase tracking-widest py-3 px-6 rounded-xl transition-all"
                        >
                          Voltar para Inspeção
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
                          className="flex-1 bg-brand-orange hover:bg-brand-orange-hover text-black font-extrabold text-2xs uppercase tracking-widest py-3 px-6 rounded-xl text-center transition-all shadow-md hover:scale-[1.01] cursor-pointer"
                        >
                          Reparos Concluídos: Ir para Encerramento & Descarte
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ----------------- STAGE D: CLOSURE & DISPOSAL ----------------- */}
                  {stage === 'D' && (
                    <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in">
                      <div className="space-y-1">
                        <span className="text-2xs bg-brand-orange-light text-brand-orange font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono border border-brand-orange/15">
                          FASE D: ENCERRAMENTO E DESCARTE CERTIFICADO
                        </span>
                        <h3 className="text-xl font-black text-zinc-950 uppercase tracking-tight font-sans mt-2">
                          Controle de Resíduos & Checklist Final de Segurança
                        </h3>
                        <p className="text-zinc-500 text-xs">
                          Antes de entregar a moto ao motociclista, realize os testes funcionais de segurança e certifique-se do descarte responsável dos resíduos químicos.
                        </p>
                      </div>

                      {/* Checklists grids */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                        
                        {/* Post-execution inspection form */}
                        <div className="space-y-4 bg-zinc-50 p-5 rounded-2xl border border-zinc-200 text-left">
                          <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-bold block">1. Auditoria Final de Torque & Segurança</span>
                          
                          <div className="space-y-3">
                            <label className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-zinc-200 hover:border-brand-orange/40 transition-colors cursor-pointer">
                              <input
                                type="checkbox"
                                checked={postChecklist.brakeTest}
                                onChange={(e) => setPostChecklist(prev => ({ ...prev, brakeTest: e.target.checked }))}
                                className="rounded text-brand-orange focus:ring-brand-orange w-4 h-4"
                              />
                              <span className="text-xs text-zinc-700 font-medium">Bujão de óleo de dreno apertado com torquímetro</span>
                            </label>

                            <label className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-zinc-200 hover:border-brand-orange/40 transition-colors cursor-pointer">
                              <input
                                type="checkbox"
                                checked={postChecklist.lightsTest}
                                onChange={(e) => setPostChecklist(prev => ({ ...prev, lightsTest: e.target.checked }))}
                                className="rounded text-brand-orange focus:ring-brand-orange w-4 h-4"
                              />
                              <span className="text-xs text-zinc-700 font-medium">Faróis, setas e freio traseiro funcionando e testados</span>
                            </label>

                            <label className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-zinc-200 hover:border-brand-orange/40 transition-colors cursor-pointer">
                              <input
                                type="checkbox"
                                checked={postChecklist.chainTension}
                                onChange={(e) => setPostChecklist(prev => ({ ...prev, chainTension: e.target.checked }))}
                                className="rounded text-brand-orange focus:ring-brand-orange w-4 h-4"
                              />
                              <span className="text-xs text-zinc-700 font-medium">Regulagem do freio a tambor/disco revisado</span>
                            </label>

                            <label className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-zinc-200 hover:border-brand-orange/40 transition-colors cursor-pointer">
                              <input
                                type="checkbox"
                                checked={postChecklist.boltsCheck}
                                onChange={(e) => setPostChecklist(prev => ({ ...prev, boltsCheck: e.target.checked }))}
                                className="rounded text-brand-orange focus:ring-brand-orange w-4 h-4"
                              />
                              <span className="text-xs text-zinc-700 font-medium">Limpeza e inspeção final de resíduos nas superfícies da moto</span>
                            </label>
                          </div>
                        </div>

                        {/* Waste management compliance */}
                        <div className="space-y-4 bg-zinc-50 p-5 rounded-2xl border border-zinc-200 text-left flex flex-col justify-between">
                          <div className="space-y-3">
                            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-bold block">2. Descarte Ecológico Responsável</span>
                            
                            {/* Waste compliance highlight panel */}
                            <div className="bg-emerald-50 border border-emerald-500/20 p-4 rounded-xl space-y-3">
                              <span className="text-2xs text-emerald-600 uppercase font-black tracking-widest font-mono flex items-center gap-1">
                                <Award className="w-4 h-4" /> COMPLIANCE ECO-SUSTENTÁVEL
                              </span>
                              
                              <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={postChecklist.wasteDisposed}
                                  onChange={(e) => setPostChecklist(prev => ({ ...prev, wasteDisposed: e.target.checked }))}
                                  className="rounded text-emerald-600 focus:ring-emerald-500 w-5 h-5 shrink-0 mt-0.5 accent-emerald-600"
                                />
                                <div className="space-y-0.5">
                                  <strong className="text-xs font-black text-zinc-950 block">Você descartou o óleo lubrificante queimado e a embalagem nas áreas adequadas da van?</strong>
                                  <span className="text-[10px] text-zinc-650 leading-normal block">
                                    O óleo é recolhido no reservatório da van de logística reversa e encaminhado para re-refino certificado, sem qualquer emissão ao solo.
                                  </span>
                                </div>
                              </label>
                            </div>
                          </div>

                          <div className="bg-zinc-950 text-white p-3.5 rounded-xl border border-zinc-900 text-2xs space-y-1 leading-normal">
                            💰 <strong className="text-brand-orange">Fechamento Online Pix/Cartão:</strong> O pagamento será efetuado pelo cartão cadastrado da Carol assim que você finalizar a Ordem de Serviço.
                          </div>
                        </div>

                      </div>

                      <div className="pt-4 border-t border-zinc-200 flex justify-between gap-4">
                        <button
                          onClick={() => setStage('C')}
                          className="bg-zinc-200 hover:bg-zinc-300 text-zinc-700 font-black text-2xs uppercase tracking-widest py-3 px-6 rounded-xl transition-all"
                        >
                          Voltar para Execução
                        </button>

                        <button
                          onClick={() => {
                            if (!postChecklist.wasteDisposed) {
                              alert('Atenção: A confirmação de descarte ecologicamente adequado dos resíduos é OBRIGATÓRIA para liberação da van!');
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
                            alert(`Ordem de Serviço ${selectedOS.id} finalizada com sucesso! A van foi liberada para o próximo chamado. Ganhos de R$ 75,00 líquidos foram adicionados à sua conta.`);
                          }}
                          className={`flex-1 font-extrabold text-2xs uppercase tracking-widest py-3 px-6 rounded-xl text-center transition-all shadow-md cursor-pointer ${
                            postChecklist.wasteDisposed
                              ? 'bg-brand-orange hover:bg-brand-orange-hover text-black hover:scale-[1.01]'
                              : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                          }`}
                        >
                          Finalizar OS e Liberar Van para Próxima Rota
                        </button>
                      </div>
                    </div>
                  )}

                </div>

                {/* Right Side: Active OS Details Summary (4 cols) */}
                <div className="lg:col-span-4 bg-zinc-950 text-white border border-zinc-900 rounded-3xl p-6 sm:p-8 space-y-6 shadow-lg">
                  <div className="space-y-2 border-b border-zinc-900 pb-4 text-left">
                    <span className="text-[10px] text-brand-orange uppercase tracking-widest font-black block font-mono">Resumo do Atendimento</span>
                    <h3 className="text-lg font-black tracking-tight font-sans">
                      Dados do Cliente
                    </h3>
                  </div>

                  <div className="space-y-4 text-xs text-left">
                    <div className="space-y-1">
                      <span className="text-[10px] text-zinc-500 block uppercase font-bold">Cliente e Contato</span>
                      <strong className="text-white block text-sm">{selectedOS.clientName}</strong>
                      <span className="text-zinc-400 block">+55 (19) 98765-4321</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-zinc-500 block uppercase font-bold">Veículo</span>
                      <strong className="text-brand-orange block">{selectedOS.motoModel}</strong>
                      <span className="text-zinc-400 block font-mono text-[11px]">Placa: {selectedOS.motoPlate}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-zinc-500 block uppercase font-bold">Endereço Solicitado</span>
                      <p className="text-zinc-300 leading-normal">{selectedOS.address}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-zinc-500 block uppercase font-bold">Peças de Substituição</span>
                      <div className="flex flex-col gap-1 mt-1">
                        {selectedOS.parts.map((p, idx) => (
                          <span key={idx} className="bg-zinc-900 border border-zinc-850 p-2 rounded text-zinc-350 text-[10px] font-mono flex items-center gap-1.5">
                            <Wrench className="w-3.5 h-3.5 text-brand-orange shrink-0" /> {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-900 text-left">
                    <button
                      onClick={() => {
                        if (window.confirm('Deseja realmente abandonar o atendimento desta OS? O chamado voltará para a fila pública.')) {
                          setSelectedOS(null);
                        }
                      }}
                      className="w-full bg-zinc-900 hover:bg-zinc-855 text-red-400 border border-zinc-850 py-3 rounded-xl font-bold text-2xs uppercase tracking-widest transition-colors"
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
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto shadow-md text-left space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-zinc-200">
              <div className="space-y-1">
                <span className="text-2xs bg-brand-orange-light text-brand-orange font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono border border-brand-orange/15">
                  DADOS FISCAIS & CONTRATUAIS
                </span>
                <h3 className="text-xl font-black text-zinc-950 uppercase tracking-tight font-sans mt-2">
                  Gestão de Microempresa (ME / MEI)
                </h3>
                <p className="text-zinc-500 text-xs">
                  A OttoMotos exige que todos os parceiros possuam um CNPJ ME ou MEI regularizado para faturamento legal de suas OSs.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${isMeApproved ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`}></span>
                <span className={`text-xs font-black uppercase font-mono tracking-wider ${isMeApproved ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {meStatus === 'Approved' ? 'Homologado / Ativo' : 'Aguardando Aprovação'}
                </span>
              </div>
            </div>

            {meStatus === 'Pending' && (
              <div className="bg-amber-50 border-l-4 border-amber-500 text-zinc-800 p-4 rounded-xl text-xs sm:text-sm">
                <strong>Solicitação de Alteração Pendente:</strong> Seus novos dados contratuais foram submetidos com sucesso. A equipe regulatória e de faturamento da OttoMotos analisará os documentos em até 24 horas úteis. Sua faturamento atual continua ativo.
              </div>
            )}

            <form onSubmit={handleSaveMe} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-500 uppercase tracking-wider font-black block font-mono font-bold">Razão Social / Nome da ME</label>
                  <input
                    type="text"
                    disabled={!isEditingMe}
                    value={meName}
                    onChange={(e) => setMeName(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-xs text-zinc-800 font-bold focus:outline-none focus:border-brand-orange disabled:opacity-60"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-zinc-500 uppercase tracking-wider font-black block font-mono font-bold">CNPJ Contratual</label>
                  <input
                    type="text"
                    disabled={!isEditingMe}
                    value={meCnpj}
                    onChange={(e) => setMeCnpj(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-xs text-zinc-800 font-bold focus:outline-none focus:border-brand-orange disabled:opacity-60"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-zinc-500 uppercase tracking-wider font-black block font-mono font-bold">Responsável Legal</label>
                  <input
                    type="text"
                    disabled={!isEditingMe}
                    value={meOwner}
                    onChange={(e) => setMeOwner(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-xs text-zinc-800 font-bold focus:outline-none focus:border-brand-orange disabled:opacity-60"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-zinc-500 uppercase tracking-wider font-black block font-mono font-bold">Banco para Recebimento de OS</label>
                  <select
                    disabled={!isEditingMe}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-xs text-zinc-800 font-bold focus:outline-none focus:border-brand-orange disabled:opacity-60"
                  >
                    <option>Banco Itau S.A. (Ag: 1245, CC: 88412-1)</option>
                    <option>Banco Bradesco S.A. (Ag: 2210, CC: 45012-3)</option>
                    <option>Nubank - Nu Pagamentos (CC: 229155-2)</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-200 flex justify-between gap-4">
                {isEditingMe ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsEditingMe(false)}
                      className="bg-zinc-200 hover:bg-zinc-300 text-zinc-700 font-black text-2xs uppercase tracking-widest py-3 px-6 rounded-xl transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="bg-brand-orange hover:bg-brand-orange-hover text-black font-extrabold text-2xs uppercase tracking-widest py-3 px-6 rounded-xl transition-all shadow-md"
                    >
                      Salvar e Enviar para Homologação
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditingMe(true)}
                    className="bg-zinc-950 hover:bg-zinc-900 text-white font-extrabold text-2xs uppercase tracking-widest py-3 px-6 rounded-xl transition-all flex items-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-brand-orange" /> Alterar Dados ME
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
          <div className="space-y-8 animate-fade-in max-w-5xl mx-auto text-left">
            {/* Cards row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Daily KPI */}
              <div className="bg-white border border-zinc-200 p-6 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-black block font-mono">Faturamento Diário</span>
                <div className="mt-3">
                  <h4 className="text-3xl font-black text-zinc-950 font-mono">R$ 150,00</h4>
                  <span className="text-2xs text-emerald-600 font-mono font-bold block mt-1">✓ Meta Diária Alcançada (100%)</span>
                </div>
              </div>

              {/* Weekly KPI */}
              <div className="bg-white border border-zinc-200 p-6 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-black block font-mono">Faturamento Semanal</span>
                <div className="mt-3">
                  <h4 className="text-3xl font-black text-zinc-950 font-mono">R$ 975,00</h4>
                  <span className="text-2xs text-emerald-600 font-mono font-bold block mt-1">✓ +15% acima da média regional</span>
                </div>
              </div>

              {/* Monthly KPI */}
              <div className="bg-white border border-zinc-200 p-6 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-black block font-mono">Faturamento Mensal</span>
                <div className="mt-3">
                  <h4 className="text-3xl font-black text-zinc-950 font-mono">R$ 4.125,00</h4>
                  <span className="text-2xs text-zinc-500 font-mono font-bold block mt-1">Soma bruta acumulada no período</span>
                </div>
              </div>
            </div>

            {/* Performance analysis charts simulation panel */}
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <span className="text-2xs bg-brand-orange-light text-brand-orange font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono border border-brand-orange/15">
                INDICADORES FINANCEIROS DE FRANQUIA
              </span>
              
              <h3 className="text-lg font-black text-zinc-950 uppercase tracking-tight font-sans mt-2">
                Evolução Semanal de Reparos Realizados
              </h3>

              {/* Pure CSS bar chart representation for pristine UI look */}
              <div className="h-64 flex items-end gap-6 pt-8 border-b border-zinc-150 relative">
                <div className="absolute top-0 left-0 text-2xs font-mono text-zinc-400 space-y-12">
                  <div>R$ 1.500</div>
                  <div>R$ 1.000</div>
                  <div>R$ 500</div>
                </div>

                {/* Bars */}
                <div className="flex-1 flex justify-around items-end h-full pl-16">
                  {/* Sem 1 */}
                  <div className="flex flex-col items-center gap-2 group w-12">
                    <span className="text-3xs font-mono font-bold text-zinc-650 opacity-0 group-hover:opacity-100 transition-opacity">R$ 750</span>
                    <div className="bg-zinc-900 group-hover:bg-brand-orange w-full h-24 rounded-t-lg transition-colors duration-200 shadow-sm"></div>
                    <span className="text-2xs font-bold text-zinc-500 font-sans uppercase">Sem 1</span>
                  </div>

                  {/* Sem 2 */}
                  <div className="flex flex-col items-center gap-2 group w-12">
                    <span className="text-3xs font-mono font-bold text-zinc-650 opacity-0 group-hover:opacity-100 transition-opacity">R$ 900</span>
                    <div className="bg-zinc-900 group-hover:bg-brand-orange w-full h-28 rounded-t-lg transition-colors duration-200 shadow-sm"></div>
                    <span className="text-2xs font-bold text-zinc-500 font-sans uppercase">Sem 2</span>
                  </div>

                  {/* Sem 3 */}
                  <div className="flex flex-col items-center gap-2 group w-12">
                    <span className="text-3xs font-mono font-bold text-zinc-650 opacity-0 group-hover:opacity-100 transition-opacity">R$ 1.125</span>
                    <div className="bg-zinc-900 group-hover:bg-brand-orange w-full h-36 rounded-t-lg transition-colors duration-200 shadow-sm"></div>
                    <span className="text-2xs font-bold text-zinc-500 font-sans uppercase">Sem 3</span>
                  </div>

                  {/* Sem 4 */}
                  <div className="flex flex-col items-center gap-2 group w-12">
                    <span className="text-3xs font-mono font-bold text-zinc-650 opacity-0 group-hover:opacity-100 transition-opacity">R$ 1.350</span>
                    <div className="bg-brand-orange w-full h-44 rounded-t-lg shadow-sm"></div>
                    <span className="text-2xs font-bold text-zinc-900 font-sans uppercase">Sem 4</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-zinc-500">
                <span>*Toque em qualquer barra da semana para inspecionar os chamados agregados no período.</span>
                <span className="font-mono text-emerald-600 font-bold">✓ Crescimento constante de 18% ao mês</span>
              </div>
            </div>
          </div>
        )}



      </main>
    </div>
  );
}
