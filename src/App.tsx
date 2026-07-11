import { useState } from 'react';
import {
  Database,
  Terminal,
  Code,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  RefreshCw,
  Upload,
  Copy,
  Play,
  Check,
  GitBranch,
  ChevronRight,
  X,
  Sparkles,
  Award,
  CircleAlert,
  Sliders,
  Settings,
  Flame,
  FileCode,
  ListFilter,
  Smartphone,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UserProfile,
  ServiceItem,
  ServiceOrder,
  InventoryItem,
  LoyaltyProfile,
  ChecklistValidation,
  INITIAL_USERS,
  INITIAL_SERVICES,
  INITIAL_INVENTORY,
  INITIAL_LOYALTY,
  INITIAL_ORDERS,
  INITIAL_VALIDATIONS,
  getGeneratedSQL,
  GITHUB_AND_VERCEL_STEPS,
  ENV_EXAMPLE_FILE_CONTENT
} from './types';

export default function App() {
  // Config parameters for Dynamic SQL Generator
  const [cancelMinutes, setCancelMinutes] = useState<number>(30);
  const [displacementTax, setDisplacementTax] = useState<number>(50);
  const [enableRls, setEnableRls] = useState<boolean>(true);

  // Simulated Database State
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [services, setServices] = useState<ServiceItem[]>(INITIAL_SERVICES);
  const [orders, setOrders] = useState<ServiceOrder[]>(INITIAL_ORDERS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [loyalty, setLoyalty] = useState<LoyaltyProfile[]>(INITIAL_LOYALTY);
  const [validations, setValidations] = useState<ChecklistValidation[]>(INITIAL_VALIDATIONS);

  // Simulation Alert Logs
  const [alertLogs, setAlertLogs] = useState<Array<{ id: string; msg: string; time: string; type: 'warning' | 'success' | 'info' }>>([
    { id: '1', msg: 'Sistema inicializado: Banco de Dados Simulado Carregado.', time: '02:49:01', type: 'info' }
  ]);

  // Selected Active Tab in main navigation
  const [currentTab, setCurrentTab] = useState<'sql' | 'env' | 'git' | 'simulator' | 'web-mobile'>('simulator');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [simSubTab, setSimSubTab] = useState<'cancellation' | 'inventory' | 'gemini' | 'loyalty'>('cancellation');

  // Copy States
  const [copiedSQL, setCopiedSQL] = useState<boolean>(false);
  const [copiedEnv, setCopiedEnv] = useState<boolean>(false);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  // Cancellation Simulator States
  const [selectedOSId, setSelectedOSId] = useState<string>('os-1002');
  const [cancellationTimeOffset, setCancellationTimeOffset] = useState<number>(15); // elapsed minutes

  // Gemini Simulator States
  const [geminiStatus, setGeminiStatus] = useState<'idle' | 'scanning' | 'done'>('idle');
  const [inspectionPart, setInspectionPart] = useState<string>('Pastilha de Freio Traseira');
  const [damagePreset, setDamagePreset] = useState<string>('Fricção metálica severa, restando apenas 1.5mm de composto de frenagem');
  const [uploadedImagePreset, setUploadedImagePreset] = useState<string>('https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=400');
  const [geminiResult, setGeminiResult] = useState<any>(null);

  // Loyalty Add Score state
  const [loyaltyTargetUser, setLoyaltyTargetUser] = useState<string>('usr-client-1');
  const [loyaltyPointsToAdd, setLoyaltyPointsToAdd] = useState<number>(100);

  // Web-to-Mobile simulation states
  const [mobileScreen, setMobileScreen] = useState<'mechanic' | 'client'>('mechanic');
  const [mobilePhotoStatus, setMobilePhotoStatus] = useState<'idle' | 'taking' | 'processing' | 'done'>('idle');
  const [mobileLoyaltyAdded, setMobileLoyaltyAdded] = useState<boolean>(false);

  // GitHub integration states
  const [gitUser, setGitUser] = useState<string>('RAIFRAN-DESENVOLVEDOR-PORTFOLIO');
  const [gitRepo, setGitRepo] = useState<string>('ottomotos');
  const [gitBranch, setGitBranch] = useState<string>('main');
  const [gitSyncStatus, setGitSyncStatus] = useState<'idle' | 'linking' | 'pushing' | 'synced'>('idle');
  const [gitTerminalLogs, setGitTerminalLogs] = useState<string[]>([]);

  // Add Log helper
  const addLog = (msg: string, type: 'warning' | 'success' | 'info' = 'info') => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    setAlertLogs(prev => [
      { id: `${Date.now()}-${Math.random()}`, msg, time: timeStr, type },
      ...prev
    ]);
  };

  // GitHub terminal simulation trigger
  const startGitSimulation = () => {
    if (gitSyncStatus !== 'idle') return;
    setGitSyncStatus('linking');
    setGitTerminalLogs([
      `$ git init`,
      `Initialized empty Git repository in /workspace/${gitRepo}-frontend/.git/`,
      `$ git add .`,
      `$ git commit -m "feat: initial setup, supabase database schema and folder structure"`,
      `[main (root-commit) a1b2c3d] feat: initial setup, supabase database schema and folder structure`,
      ` 12 files changed, 258 insertions(+)`,
      ` create mode 100644 package.json`,
      ` create mode 100644 src/app/page.tsx`,
      `$ git branch -M ${gitBranch}`
    ]);

    setTimeout(() => {
      setGitSyncStatus('pushing');
      setGitTerminalLogs(prev => [
        ...prev,
        `$ git remote add origin https://github.com/${gitUser}/${gitRepo}.git`,
        `$ git push -u origin ${gitBranch}`,
        `Enumerating objects: 15, done.`,
        `Counting objects: 100% (15/15), done.`,
        `Delta compression using up to 8 threads`,
        `Compressing objects: 100% (12/12), done.`,
        `Writing objects: 100% (15/15), 3.42 KiB | 3.42 MiB/s, done.`,
        `Total 15 (delta 1), reused 0 (delta 0), pack-reused 0`
      ]);

      setTimeout(() => {
        setGitSyncStatus('synced');
        setGitTerminalLogs(prev => [
          ...prev,
          `To https://github.com/${gitUser}/${gitRepo}.git`,
          ` * [new branch]      ${gitBranch} -> ${gitBranch}`,
          `branch '${gitBranch}' set up to track remote branch '${gitBranch}' from 'origin'.`,
          `Sincronização com o repositório GitHub concluída com sucesso! 🎉`
        ]);
        addLog(`GitHub: Repositório github.com/${gitUser}/${gitRepo} sincronizado com sucesso via HTTPS.`, 'success');
      }, 1500);
    }, 1500);
  };

  // Trigger Cancel simulation matching the postgres trigger logic perfectly
  const executeCancellationTrigger = (osId: string, elapsedMin: number) => {
    const order = orders.find(o => o.id === osId);
    if (!order) {
      addLog('Ordem de serviço não encontrada', 'warning');
      return;
    }
    if (order.status === 'CANCELLED') {
      addLog(`O.S. ${osId} já se encontra CANCELADA.`, 'warning');
      return;
    }

    const start = new Date();
    // Simulate creation time by subtracting minutes
    start.setMinutes(start.getMinutes() - elapsedMin);

    let tax = 0;
    let message = '';
    
    // Simulate Trigger Logic:
    // elapsed_minutes = EXTRACT(EPOCH FROM (NOW() - NEW.start_time)) / 60;
    // IF elapsed_minutes > cancelMinutes THEN NEW.displacement_tax := displacementTax; ELSE NEW.displacement_tax := 0;
    if (elapsedMin > cancelMinutes) {
      tax = displacementTax;
      message = `TRIGGER SQL trg_order_cancellation: Cancelamento da O.S. ${osId} após o limite grátis (${elapsedMin}min Decorridos). Taxa de deslocamento de R$ ${displacementTax},00 aplicada com sucesso!`;
      addLog(message, 'warning');
    } else {
      tax = 0;
      message = `TRIGGER SQL trg_order_cancellation: Cancelamento efetuado dentro do prazo de tolerância (${elapsedMin}min / ${cancelMinutes}min limite). Isento de taxa!`;
      addLog(message, 'success');
    }

    setOrders(prev => prev.map(o => {
      if (o.id === osId) {
        return {
          ...o,
          status: 'CANCELLED',
          displacement_tax: tax,
          cancellation_time: new Date().toISOString()
        };
      }
      return o;
    }));
  };

  // Trigger inventory decrease/increase simulation with alert trigger checks
  const handleInventoryQuantityChange = (itemId: string, delta: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === itemId) {
        const newQty = Math.max(0, item.quantity + delta);
        const threshold = item.minimum_threshold;
        
        let shouldTriggerAlert = false;
        // Trigger condition: quantity falls below or equal minimum_threshold, and previous quantity was above it.
        if (newQty <= threshold && item.quantity > threshold) {
          shouldTriggerAlert = true;
        }

        if (shouldTriggerAlert) {
          const alertMsg = `TRIGGER SQL trg_inventory_low_alert: Alerta crítico! Estoque de [${item.item_name}] atingiu nível mínimo (${newQty} no estoque / Mínimo: ${threshold}). Registrado em inventory_alerts.`;
          addLog(alertMsg, 'warning');
          return { ...item, quantity: newQty, alert_active: true };
        } else {
          return { ...item, quantity: newQty, alert_active: newQty <= threshold };
        }
      }
      return item;
    }));
  };

  // Trigger Gemini vision analysis simulator
  const runGeminiInspection = () => {
    if (geminiStatus === 'scanning') return;
    setGeminiStatus('scanning');
    addLog(`Enviando foto da peça para análise computacional do Gemini Vision...`, 'info');

    setTimeout(() => {
      // Simulate response
      const matched = inspectionPart.toLowerCase().includes('freio') || inspectionPart.toLowerCase().includes('banco') || inspectionPart.toLowerCase().includes('óleo');
      const mockScore = parseFloat((85 + Math.random() * 14).toFixed(1));
      const response = {
        part_recognized: inspectionPart,
        is_correct_part_for_order: true,
        confidence_score: mockScore,
        visual_anomalies_detected: [damagePreset],
        gemini_safety_rating: 'WARN' as const
      };

      setGeminiResult(response);
      setGeminiStatus('done');

      // Add state record representation
      const newValidation: ChecklistValidation = {
        id: `val-${Date.now()}`,
        service_order_id: selectedOSId,
        uploaded_image_url: `checklist_images/${selectedOSId}/${inspectionPart.replace(/\s+/g, '_').toLowerCase()}.png`,
        part_name: inspectionPart,
        pre_existing_damage: damagePreset,
        gemini_validation_response: response,
        validated: matched,
        checked_at: new Date().toISOString()
      };

      setValidations(prev => [newValidation, ...prev]);
      addLog(`Gemini Visual AI validado com ${mockScore}% de confiança! Banco atualizado: checklist_validations.`, 'success');
    }, 2000);
  };

  // Trigger Loyalty Points add / reserve bike evaluator
  const handleAddLoyaltyPoints = (userId: string, pts: number) => {
    setLoyalty(prev => prev.map(prof => {
      if (prof.client_id === userId) {
        const newBalance = prof.points_balance + pts;
        const reachedReserveBike = newBalance >= 500;
        const previousBikeAccess = prof.has_reserve_bike_access;

        if (reachedReserveBike && !previousBikeAccess) {
          addLog(`Programa Fidelidade: Cliente ganhou acesso ao benefício Moto Reserva com ${newBalance} pontos!`, 'success');
        } else {
          addLog(`Adicionado +${pts} pontos para o perfil do cliente no banco de dados. Pontos totais: ${newBalance}.`, 'info');
        }

        return {
          ...prof,
          points_balance: newBalance,
          has_reserve_bike_access: reachedReserveBike
        };
      }
      return prof;
    }));
  };

  // Copy text helper
  const copyToClipboard = (text: string, type: 'sql' | 'env' | number) => {
    navigator.clipboard.writeText(text);
    if (type === 'sql') {
      setCopiedSQL(true);
      setTimeout(() => setCopiedSQL(false), 2000);
    } else if (type === 'env') {
      setCopiedEnv(true);
      setTimeout(() => setCopiedEnv(false), 2000);
    } else {
      setCopiedCodeIndex(type);
      setTimeout(() => setCopiedCodeIndex(null), 2000);
    }
  };

  const dynamicSQL = getGeneratedSQL({ cancelMinutes, displacementTax, pointsPerBrl: 10, enableRls });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-brand-orange selection:text-black">
      {/* Dynamic Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <svg viewBox="0 0 310 100" className="h-10 text-brand-orange fill-current" xmlns="http://www.w3.org/2000/svg">
                <g fill="currentColor">
                  {/* Speed dynamic loop matching OttoMotos logo */}
                  <path d="M 45 15 C 20 15 0 35 0 60 C 0 85 20 105 45 105 C 62 105 76 95 82 81 C 84 76 81 71 76 71 C 72 71 69 73 67 77 C 63 85 55 90 45 90 C 28 90 15 77 15 60 C 15 43 28 30 45 30 C 56 30 65 36 69 46 C 71 51 75 53 79 51 C 83 50 85 46 83 42 C 76 26 62 15 45 15 Z" />
                  <path d="M 52 55 C 47 50 42 57 42 63 C 42 71 49 77 57 77 C 67 77 73 60 83 51 C 72 51 62 63 52 55 Z" />
                  <circle cx="85" cy="23" r="10" />
                </g>
                <text x="110" y="70" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif" fontWeight="900" fontSize="32" fill="#FFFFFF" letterSpacing="-1">OTTO</text>
                <text x="205" y="70" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif" fontWeight="900" fontSize="32" fill="#FF5A00" letterSpacing="-1">MOTOS</text>
              </svg>
            </div>
            <div className="border-l border-zinc-800 pl-3">
              <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                Portal Engenharia & Banco de Dados
                <span className="text-[10px] bg-brand-orange-light text-brand-orange font-bold px-2 py-0.5 rounded-full uppercase border border-brand-orange/20">
                  Fase 1 - Ativo
                </span>
              </h1>
              <p className="text-[10px] text-zinc-400">Modelador de Schemas Supabase, IA (Gemini) e Infraestrutura.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-zinc-500">Autor: Engenheiro Full-Stack Sênior</span>
            <span className="text-zinc-700">•</span>
            <span className="text-zinc-500">Último commit: Jun 2026</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        
        {/* Core Description / Jumbotron */}
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-930 border border-zinc-800 rounded-xl p-5 mb-6 shadow-md relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 pointer-events-none p-4 select-none">
            <Database className="w-48 h-48 text-brand-orange" />
          </div>
          <div className="max-w-3xl">
            <h2 className="text-brand-orange font-bold text-sm tracking-widest uppercase mb-1 flex items-center gap-1.5">
              <Sliders className="w-4 h-4" /> Startup de Mecânica Conveniente
            </h2>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
              Infraestrutura de Reparos Rápidos (50cc a 300cc)
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Trabalhando com foco em <strong>transparência e conveniência</strong> (furgões <strong>Station</strong>, vans <strong>Mobile</strong> e pontos <strong>Express</strong>), nossa arquitetura inicial integra segurança com autenticação refinada do <strong>Supabase</strong>, lógica de triggers autônomos para cancelamento/estoque, e validação computacional via <strong>Gemini AI Studio</strong>.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-zinc-800/60 text-xs">
            <div className="bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-850">
              <p className="text-zinc-500">Banco de Dados</p>
              <p className="font-semibold text-white mt-0.5">PostgreSQL (Supabase)</p>
            </div>
            <div className="bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-850">
              <p className="text-zinc-500">Frontend & API</p>
              <p className="font-semibold text-white mt-0.5">Next.js (App Router)</p>
            </div>
            <div className="bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-850">
              <p className="text-zinc-500">Hospedagem & CI/CD</p>
              <p className="font-semibold text-white mt-0.5">Vercel & Github Integration</p>
            </div>
            <div className="bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-850">
              <p className="text-zinc-500">Análise de IA</p>
              <p className="font-semibold text-white mt-0.5">Gemini Vision & Text JSON</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-zinc-800 mb-6 overflow-x-auto scrollbar-thin">
          <button
            onClick={() => setCurrentTab('simulator')}
            className={`py-3 px-4 font-semibold text-sm flex items-center gap-2 border-b-2 transition-all shrink-0 ${
              currentTab === 'simulator'
                ? 'border-brand-orange text-brand-orange bg-brand-orange-light'
                : 'border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/50'
            }`}
          >
            <Cpu className="w-4 h-4" />
            Simulador de Triggers & IA
          </button>
          
          <button
            onClick={() => setCurrentTab('sql')}
            className={`py-3 px-4 font-semibold text-sm flex items-center gap-2 border-b-2 transition-all shrink-0 ${
              currentTab === 'sql'
                ? 'border-brand-orange text-brand-orange bg-brand-orange-light'
                : 'border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/50'
            }`}
          >
            <Database className="w-4 h-4" />
            Script DDL Supabase (SQL)
          </button>

          <button
            onClick={() => setCurrentTab('web-mobile')}
            className={`py-3 px-4 font-semibold text-sm flex items-center gap-2 border-b-2 transition-all shrink-0 ${
              currentTab === 'web-mobile'
                ? 'border-brand-orange text-brand-orange bg-brand-orange-light'
                : 'border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/50'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            Arquitetura Web/Mobile
          </button>

          <button
            onClick={() => setCurrentTab('git')}
            className={`py-3 px-4 font-semibold text-sm flex items-center gap-2 border-b-2 transition-all shrink-0 ${
              currentTab === 'git'
                ? 'border-brand-orange text-brand-orange bg-brand-orange-light'
                : 'border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/50'
            }`}
          >
            <Terminal className="w-4 h-4" />
            Git & Deploy Vercel CLI
          </button>

          <button
            onClick={() => setCurrentTab('env')}
            className={`py-3 px-4 font-semibold text-sm flex items-center gap-2 border-b-2 transition-all shrink-0 ${
              currentTab === 'env'
                ? 'border-brand-orange text-brand-orange bg-brand-orange-light'
                : 'border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/50'
            }`}
          >
            <Code className="w-4 h-4" />
            Credenciais env.local
          </button>
        </div>

        {/* Tab Contents */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main content area (Left on large screens, spanning 8-9 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            <AnimatePresence mode="wait">
              {currentTab === 'simulator' && (
                <motion.div
                  key="sim"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {/* Simulator Overview */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                    <div className="p-4 bg-zinc-850/50 border-b border-zinc-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <h4 className="font-bold text-white text-base">Playground: Laboratório de Triggers em Tempo Real</h4>
                        <p className="text-xs text-zinc-400">Interaja com a lógica das tabelas e regras de negócio antes de subir para produção.</p>
                      </div>

                      {/* Sub-tabs selector */}
                      <div className="flex bg-zinc-950 p-1 rounded-lg border border-brand-orange/10">
                        <button
                          onClick={() => setSimSubTab('cancellation')}
                          className={`text-xs px-2.5 py-1.5 rounded font-medium transition-all ${
                            simSubTab === 'cancellation' ? 'bg-brand-orange text-black' : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          Trigger Cancelamento
                        </button>
                        <button
                          onClick={() => setSimSubTab('inventory')}
                          className={`text-xs px-2.5 py-1.5 rounded font-medium transition-all ${
                            simSubTab === 'inventory' ? 'bg-brand-orange text-black' : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          Trigger Estoque
                        </button>
                        <button
                          onClick={() => setSimSubTab('gemini')}
                          className={`text-xs px-2.5 py-1.5 rounded font-medium transition-all ${
                            simSubTab === 'gemini' ? 'bg-brand-orange text-black' : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          Gemini Vision Check
                        </button>
                        <button
                          onClick={() => setSimSubTab('loyalty')}
                          className={`text-xs px-2.5 py-1.5 rounded font-medium transition-all ${
                            simSubTab === 'loyalty' ? 'bg-brand-orange text-black' : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          Loyalty & Rewards
                        </button>
                      </div>
                    </div>

                    <div className="p-5">
                      {/* SUBTAB: CANCELAMENTO */}
                      {simSubTab === 'cancellation' && (
                        <div className="space-y-4">
                          <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-850 text-sm">
                            <h5 className="font-bold text-white mb-2 flex items-center gap-1.5">
                              <ShieldCheck className="w-4 h-4 text-brand-orange" />
                              Regra SQL: fn_process_order_cancellation
                            </h5>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                              Simula a chamada do trigger Postgres que intercepta qualquer atualização de status para <span className="text-red-400 font-mono">CANCELLED</span>. Se a diferença de minutos entre o <span className="text-zinc-300 font-mono">start_time</span> e o horário atual for maior que o limite configurado (hoje: <span className="text-brand-orange font-semibold">{cancelMinutes} minutos</span>), aplica a multa/taxa de deslocamento de <span className="text-brand-orange font-semibold">R$ {displacementTax},00</span> para indenizar o mecânico furgonista.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3 p-4 bg-zinc-950/50 rounded-lg border border-zinc-850">
                            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest block">Parâmetros Ativos de Simulação</span>
                            
                            <div>
                              <label className="text-xs text-zinc-300 flex justify-between mb-1">
                                <span>Tolerância de Cancelamento Grátis:</span>
                                <span className="text-brand-orange font-bold">{cancelMinutes} minutos</span>
                              </label>
                              <input
                                type="range"
                                min="5"
                                max="120"
                                step="5"
                                value={cancelMinutes}
                                onChange={(e) => setCancelMinutes(parseInt(e.target.value))}
                                className="w-full accent-brand-orange cursor-pointer"
                              />
                            </div>

                            <div>
                              <label className="text-xs text-zinc-300 flex justify-between mb-1">
                                <span>Taxa de Deslocamento Padrão:</span>
                                <span className="text-brand-orange font-bold">R$ {displacementTax},00</span>
                              </label>
                              <input
                                type="range"
                                min="10"
                                max="150"
                                step="5"
                                value={displacementTax}
                                onChange={(e) => setDisplacementTax(parseInt(e.target.value))}
                                className="w-full accent-brand-orange cursor-pointer"
                              />
                            </div>
                          </div>

                          <div className="p-4 bg-zinc-950/50 rounded-lg border border-zinc-850 space-y-3 justify-between flex flex-col">
                            <div>
                              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest block mb-2">Selecione uma O.S. Ativa para Testar</span>
                              <div className="space-y-2">
                                {orders.map(order => (
                                  <label
                                    key={order.id}
                                    onClick={() => {
                                      if (order.status !== 'CANCELLED') {
                                        setSelectedOSId(order.id);
                                      }
                                    }}
                                    className={`flex justify-between items-center p-2 rounded border cursor-pointer text-xs transition-all ${
                                      order.status === 'CANCELLED'
                                        ? 'border-zinc-800 bg-zinc-900/30 opacity-50 cursor-not-allowed'
                                        : selectedOSId === order.id
                                        ? 'border-brand-orange bg-brand-orange-light text-brand-orange'
                                        : 'border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-300'
                                    }`}
                                  >
                                    <div>
                                      <p className="font-bold">{order.id} - Placa: {order.vehicle_plate}</p>
                                      <p className="font-mono text-[9px] text-zinc-500">{order.vehicle_model} | {order.attendance_model}</p>
                                    </div>
                                    <div className="text-right">
                                      <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold ${
                                        order.status === 'IN_PROGRESS' ? 'bg-brand-orange-light text-brand-orange' : 'bg-blue-500/10 text-blue-400'
                                      }`}>
                                        {order.status}
                                      </span>
                                    </div>
                                  </label>
                                ))}
                              </div>
                            </div>

                            <div className="pt-2">
                              <label className="text-xs text-zinc-300 flex justify-between mb-1">
                                <span>Simular Tempo de Execução Decorrido:</span>
                                <span className="text-white font-mono">{cancellationTimeOffset} minutos</span>
                              </label>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setCancellationTimeOffset(15)}
                                  className={`flex-1 text-[10px] py-1 rounded transition-all ${
                                    cancellationTimeOffset === 15 ? 'bg-zinc-800 text-brand-orange border border-brand-orange/45' : 'bg-zinc-900 text-zinc-400'
                                  }`}
                                >
                                  15 Min (Grátis)
                                </button>
                                <button
                                  onClick={() => setCancellationTimeOffset(45)}
                                  className={`flex-1 text-[10px] py-1 rounded transition-all ${
                                    cancellationTimeOffset === 45 ? 'bg-zinc-800 text-brand-orange border border-brand-orange/45' : 'bg-zinc-900 text-zinc-400'
                                  }`}
                                >
                                  45 Min (Multa)
                                </button>
                                <button
                                  onClick={() => setCancellationTimeOffset(90)}
                                  className={`flex-1 text-[10px] py-1 rounded transition-all ${
                                    cancellationTimeOffset === 90 ? 'bg-zinc-800 text-brand-orange border border-brand-orange/45' : 'bg-zinc-900 text-zinc-400'
                                  }`}
                                >
                                  90 Min (Multa)
                                </button>
                              </div>
                            </div>

                            <button
                              onClick={() => executeCancellationTrigger(selectedOSId, cancellationTimeOffset)}
                              className="w-full bg-red-650 hover:bg-red-700 text-white font-bold text-xs py-2 px-3 rounded flex items-center justify-center gap-1.5 transition-all shadow-md mt-2"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              Cancelar e Disparar Trigger no Banco
                            </button>
                          </div>
                        </div>

                        {/* Render current orders database state summary */}
                        <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-850">
                          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest block mb-2">Simulado: service_orders State</span>
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                              <thead className="bg-zinc-900 text-zinc-400 border-b border-zinc-800">
                                <tr>
                                  <th className="p-2.5">O.S. ID</th>
                                  <th className="p-2.5">Veículo</th>
                                  <th className="p-2.5">Localização</th>
                                  <th className="p-2.5">Iniciado em</th>
                                  <th className="p-2.5">Status</th>
                                  <th className="p-2.5 text-right">Taxa de Deslocamento</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-zinc-850/50">
                                {orders.map(o => (
                                  <tr key={o.id} className="hover:bg-zinc-900/40">
                                    <td className="p-2.5 font-bold font-mono text-zinc-300">{o.id}</td>
                                    <td className="p-2.5">
                                      <p>{o.vehicle_model}</p>
                                      <p className="text-[10px] text-zinc-500">{o.vehicle_plate}</p>
                                    </td>
                                    <td className="p-2.5">
                                      <span className="text-xs px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                                        {o.attendance_model}
                                      </span>
                                    </td>
                                    <td className="p-2.5 text-zinc-400 font-mono text-[10px]">
                                      {new Date(o.start_time).toLocaleTimeString()}
                                    </td>
                                    <td className="p-2.5">
                                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                        o.status === 'CANCELLED'
                                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                          : o.status === 'IN_PROGRESS'
                                          ? 'bg-brand-orange-light text-brand-orange border border-brand-orange/20'
                                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                      }`}>
                                        {o.status}
                                      </span>
                                    </td>
                                    <td className="p-2.5 text-right font-bold text-white font-mono">
                                      R$ {o.displacement_tax},00
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SUBTAB: INVENTARIO */}
                    {simSubTab === 'inventory' && (
                      <div className="space-y-4">
                        <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-850 text-sm">
                          <h5 className="font-bold text-white mb-2 flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-brand-orange" />
                            Regra SQL: fn_check_inventory_threshold
                          </h5>
                          <p className="text-xs text-zinc-400 leading-relaxed">
                            Simula a chamada de trigger do Postgres reativo. Toda vez que uma peça é consumida ou dada entrada no estoque, o trigger analisa se o nível de unidades atual (<span className="text-zinc-300 font-mono">quantity</span>) alcançou o valor limite configurado (<span className="text-zinc-300 font-mono">minimum_threshold</span>). Se for atingido, insere automaticamente um log na tabela <span className="text-brand-orange font-mono">inventory_alerts</span> sem alterar o fluxo da venda original.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800 space-y-3">
                              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest block">Estoque Disponível</span>
                              <div className="space-y-2">
                                {inventory.map(item => (
                                  <div
                                    key={item.id}
                                    className={`p-3 rounded-lg border transition-all ${
                                      item.alert_active 
                                        ? 'bg-brand-orange-light border-brand-orange/30' 
                                        : 'bg-zinc-950 border-zinc-800'
                                    }`}
                                  >
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="font-bold text-xs text-zinc-200">{item.item_name}</span>
                                      {item.alert_active && (
                                        <span className="text-[9px] bg-brand-orange-light text-brand-orange font-bold px-2 py-0.5 rounded border border-brand-orange/30 flex items-center gap-1">
                                          <AlertTriangle className="w-2.5 h-2.5" /> BAIXO ESTOQUE
                                        </span>
                                      )}
                                    </div>

                                    <div className="flex justify-between items-center text-xs">
                                      <div className="text-zinc-400">
                                        Qtd: <strong className="text-white font-mono text-sm">{item.quantity}</strong> | Mínimo: <span className="text-zinc-500 font-mono">{item.minimum_threshold}</span>
                                      </div>
                                      <div className="flex gap-1.5">
                                        <button
                                          onClick={() => handleInventoryQuantityChange(item.id, -5)}
                                          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold px-2 py-1 rounded text-xs select-none"
                                        >
                                          Comprar / Consumir -5
                                        </button>
                                        <button
                                          onClick={() => handleInventoryQuantityChange(item.id, 10)}
                                          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold px-2 py-1 rounded text-xs select-none"
                                        >
                                          Restocar +10
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="flex flex-col justify-between">
                              <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-850 h-full flex flex-col justify-between">
                                <div>
                                  <span className="text-xs font-semibold text-brand-orange uppercase tracking-widest block mb-2 flex items-center gap-1.5">
                                    <Database className="w-3.5 h-3.5" /> Audits: inventory_alerts Log
                                  </span>
                                  <p className="text-[11px] text-zinc-400 mb-2 leading-relaxed">
                                    Abaixo está simulada a tabela do Supabase que registra alertas via trigger automaticamente toda vez que estoque de segurança de um item é rompido.
                                  </p>
                                </div>
                                
                                <div className="space-y-2 mt-2 flex-grow overflow-y-auto max-h-[220px] pr-1">
                                  {inventory.filter(i => i.alert_active).map(item => (
                                    <div key={item.id} className="text-xs p-2 bg-zinc-900 border border-brand-orange/20 rounded flex items-start gap-2 text-zinc-300 animate-fadeIn">
                                      <AlertTriangle className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                                      <div>
                                        <strong className="text-white font-semibold">Alerta de Estoque:</strong> Limite mínimo atingido para {item.item_name}.
                                        <p className="text-[10px] text-zinc-500 mt-0.5 font-mono">Qtd atual: {item.quantity} / Gatilho: {item.minimum_threshold} unidades.</p>
                                      </div>
                                    </div>
                                  ))}
                                  {inventory.filter(i => i.alert_active).length === 0 && (
                                    <div className="text-center py-6 text-zinc-600 text-xs">
                                      Nenhum nível crítico registrado atualmente. Todos os itens estão restocados acima do nível mínimo de controle operacional.
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* SUBTAB: GEMINI VISION CHECKLIST */}
                      {simSubTab === 'gemini' && (
                        <div className="space-y-4">
                          <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-850 text-sm">
                            <h5 className="font-bold text-white mb-2 flex items-center gap-1.5">
                              <Cpu className="w-4 h-4 text-brand-orange" />
                              Integração Supabase Storage & Gemini Vision API
                            </h5>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                              Antes de iniciar o serviço, os mecânicos capturam avarias e avarias preexistentes da motocicleta utilizando um celular. Este módulo simula o tratamento no banco onde as fotos são salvas no Bucket <span className="text-emerald-400">checklist_images</span> do Supabase Storage. Em seguida, a URL é processada por nossa inteligência artificial para certificar que a foto tirada de fato corresponde a peça correta no catálogo, prevenindo fraudes e automatizando o preenchimento de checklists.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            
                            {/* Inputs side */}
                            <div className="space-y-3 p-4 bg-zinc-900 rounded-lg border border-zinc-800">
                              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest block mb-2">Simulador de Upload de Imagem checklist_images</span>
                              
                              <div>
                                <label className="text-xs text-zinc-300 block mb-1">Passo 1: Selecione a Peça no Catálogo</label>
                                <select
                                  value={inspectionPart}
                                  onChange={(e) => {
                                    setInspectionPart(e.target.value);
                                    if (e.target.value.toLowerCase().includes('freio')) {
                                      setDamagePreset('Fricção metálica severa, restando apenas 1.5mm de composto de frenagem');
                                      setUploadedImagePreset('https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=450');
                                    } else if (e.target.value.toLowerCase().includes('banco')) {
                                      setDamagePreset('Corte linear de 5cm na lateral esquerda do estofado, espuma levemente exposta');
                                      setUploadedImagePreset('https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=450');
                                    } else {
                                      setDamagePreset('Filtro saturado com excesso de poeira e grumos de óleo de cárter seco');
                                      setUploadedImagePreset('https://images.unsplash.com/photo-1502743780242-f10d2ce370f3?auto=format&fit=crop&q=80&w=450');
                                    }
                                  }}
                                  className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 rounded p-2 text-xs focus:ring-1 focus:ring-brand-orange focus:outline-none"
                                >
                                  <option value="Pastilha de Freio Traseira">Pastilha de Freio Traseira (Express)</option>
                                  <option value="Banco de Couro">Banco de Couro e Assento (Mobile)</option>
                                  <option value="Filtro de Ar do Carburador">Filtro de Ar Secundário (Station)</option>
                                </select>
                              </div>

                              <div>
                                <label className="text-xs text-zinc-300 block mb-1">Passo 2: Diagnóstico Preexistente (Mecânico)</label>
                                <textarea
                                  value={damagePreset}
                                  onChange={(e) => setDamagePreset(e.target.value)}
                                  rows={2}
                                  className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 rounded p-2 text-xs focus:ring-1 focus:ring-brand-orange focus:outline-none"
                                />
                              </div>

                              <div>
                                <label className="text-xs text-zinc-300 block mb-1">Simular Envio de Foto</label>
                                <div className="border border-dashed border-zinc-800 rounded p-3 text-center bg-zinc-950/50">
                                  <img
                                    src={uploadedImagePreset}
                                    alt="Prévia de Upload"
                                    referrerPolicy="no-referrer"
                                    className="h-24 mx-auto rounded object-cover border border-zinc-805 mb-2 hover:opacity-90 cursor-pointer"
                                  />
                                  <p className="text-[10px] text-zinc-500">Caminho Supabase path: <code className="text-emerald-500">checklist_images/os-1001/verify.png</code></p>
                                </div>
                              </div>

                              <button
                                onClick={runGeminiInspection}
                                disabled={geminiStatus === 'scanning'}
                                className="w-full bg-brand-orange hover:bg-brand-orange-hover disabled:bg-zinc-700 text-zinc-950 font-bold text-xs py-2 px-3 rounded flex items-center justify-center gap-1.5 transition-all shadow-md"
                              >
                                {geminiStatus === 'scanning' ? (
                                  <>
                                    <RefreshCw className="w-4 h-4 animate-spin" /> Analisando Imagem pelo Gemini AI...
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="w-4 h-4 text-zinc-950 fill-current" /> Executar Verificação Vision AI Integrada
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Display results side */}
                            <div className="bg-zinc-950 rounded-lg border border-zinc-850 p-4 space-y-4">
                              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest block">Response JSONB: checklist_validations</span>
                              
                              {geminiStatus === 'scanning' && (
                                <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
                                  <div className="relative">
                                    <div className="w-12 h-12 rounded-full border-4 border-brand-orange border-t-transparent animate-spin"></div>
                                    <Cpu className="w-5 h-5 text-brand-orange absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]" />
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold text-white">Gemini 3.5 Flash: Processando Tensor de Imagem</p>
                                    <p className="text-[10px] text-zinc-500">Mapeando marcas de desgaste físico preexistentes e correspondência de peças...</p>
                                  </div>
                                </div>
                              )}

                              {geminiStatus === 'idle' && !geminiResult && (
                                <div className="flex flex-col items-center justify-center py-16 text-center text-zinc-500">
                                  <Upload className="w-10 h-10 mb-2 text-zinc-700" />
                                  <p className="text-xs">Aguardando envio de checklist fotográfico pelo mecânico.</p>
                                  <p className="text-[10px] text-zinc-600 mt-1">Selecione uma peça e clique no botão para subir.</p>
                                </div>
                              )}

                              {(geminiStatus === 'done' || geminiResult) && geminiResult && (
                                <div className="space-y-3 animate-fadeIn">
                                  <div className="p-3 bg-zinc-900 border border-zinc-800 rounded text-xs flex justify-between items-center">
                                    <div>
                                      <p className="text-zinc-400 font-medium">Reconhecimento de Elemento:</p>
                                      <p className="font-bold text-white text-sm">{geminiResult.part_recognized}</p>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold block mb-1">
                                        FOTO CORRESPONDE
                                      </span>
                                      <span className="text-zinc-500 text-[10px] font-mono">Confiança: {geminiResult.confidence_score}%</span>
                                    </div>
                                  </div>

                                  <div>
                                    <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-1">Payload JSON de Resposta (Salvo em public.checklist_validations):</p>
                                    <pre className="bg-zinc-900 p-2.5 rounded text-[10px] font-mono text-brand-orange overflow-x-auto whitespace-pre-wrap max-h-[160px] border border-zinc-850">
                                      {JSON.stringify(geminiResult, null, 2)}
                                    </pre>
                                  </div>

                                  <div className="p-2.5 bg-zinc-900/60 border border-zinc-800 rounded-lg text-xs flex gap-2">
                                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                    <div>
                                      <p className="font-semibold text-white">Transparência Assegurada</p>
                                      <p className="text-[11px] text-zinc-400 leading-normal">O checklist fotográfico preexistente foi auditado e consolidado. Evita discussões pós-reparo com o cliente.</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* SUBTAB: LOYALTY & REWARDS */}
                      {simSubTab === 'loyalty' && (
                        <div className="space-y-4">
                          <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-850 text-sm">
                            <h5 className="font-bold text-white mb-2 flex items-center gap-1.5">
                              <Award className="w-4 h-4 text-brand-orange" />
                              Programa de Fidelidade e Direitos Especiais (Moto Reserva)
                            </h5>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                              Cada manutenção realizada na OttoMotos gera pontuações no banco de dados. Clientes B2C recorrentes e frotistas B2B acumulam pontos. Se cruzarem a marca padrão de <span className="text-brand-orange font-semibold">500 pontos</span>, obtêm acesso livre ao acionamento de uma moto substituta de baixa cilindrada (<span className="text-emerald-400 font-mono">has_reserve_bike_access = TRUE</span>) enquanto seu veículo está em manutenção na van ou nos pontos rotativos.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800 space-y-3">
                              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest block">Simular Ganho de Pontos</span>
                              
                              <div>
                                <label className="text-xs text-zinc-300 block mb-1">Selecione o Perfis / Cliente</label>
                                <select
                                  value={loyaltyTargetUser}
                                  onChange={(e) => setLoyaltyTargetUser(e.target.value)}
                                  className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 rounded p-2 text-xs focus:ring-1 focus:ring-brand-orange focus:outline-none"
                                >
                                  {users.filter(u => u.role.startsWith('client')).map(client => (
                                    <option key={client.id} value={client.id}>
                                      {client.name} ({client.role === 'client_b2b' ? 'B2B/Frota' : 'B2C'})
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="text-xs text-zinc-300 block mb-1">Pontuação a Adicionar (ex: Conclusão de Serviço)</label>
                                <select
                                  value={loyaltyPointsToAdd}
                                  onChange={(e) => setLoyaltyPointsToAdd(parseInt(e.target.value))}
                                  className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 rounded p-2 text-xs focus:ring-1 focus:ring-brand-orange focus:outline-none"
                                >
                                  <option value="50">Troca de óleo rápida (+50 pontos)</option>
                                  <option value="120">Troca de Kit de Transmissão (+120 pontos)</option>
                                  <option value="250">Revisão Geral de Frota (+250 pontos)</option>
                                </select>
                              </div>

                              <button
                                onClick={() => handleAddLoyaltyPoints(loyaltyTargetUser, loyaltyPointsToAdd)}
                                className="w-full bg-brand-orange hover:bg-brand-orange-hover text-zinc-950 font-bold text-xs py-2 px-3 rounded flex items-center justify-center gap-1.5 transition-all shadow-md"
                              >
                                <Award className="w-4 h-4 fill-current animate-pulse" /> Adicionar Pontos no Banco
                              </button>
                            </div>

                            <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-850 space-y-3">
                              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest block mb-2">Simulado: loyalty_program Data State</span>
                              
                              <div className="space-y-2">
                                {loyalty.map(lp => {
                                  const cl = users.find(u => u.id === lp.client_id);
                                  return (
                                    <div key={lp.id} className="p-2 bg-zinc-900 rounded border border-zinc-800 flex justify-between items-center text-xs">
                                      <div>
                                        <p className="font-bold text-white">{cl?.name || 'Cliente'}</p>
                                        <p className="text-[10px] text-zinc-500">ID: {lp.client_id}</p>
                                      </div>
                                      <div className="text-right">
                                        <p className="font-bold text-brand-orange text-sm font-mono">{lp.points_balance} pts</p>
                                        <span className={`inline-block text-[9px] px-1.5 py-0.5 rounded mt-1 font-bold ${
                                          lp.has_reserve_bike_access 
                                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                            : 'bg-zinc-850 text-zinc-500 border border-zinc-800'
                                        }`}>
                                          {lp.has_reserve_bike_access ? 'Moto Reserva Lib.' : 'Sem Moto Reserva'}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Simulator Logs Feed */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                    <div className="px-4 py-3 bg-zinc-850 border-b border-zinc-800 flex justify-between items-center text-xs">
                      <span className="font-mono text-zinc-400 flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-brand-orange" />
                        Gatilhos e Logs da Simulação de Banco de Dados
                      </span>
                      <button
                        onClick={() => {
                          setAlertLogs([{ id: '1', msg: 'Logs limpos.', time: new Date().toTimeString().split(' ')[0], type: 'info' }]);
                        }}
                        className="text-[10px] text-zinc-500 hover:text-white px-2 py-0.5 rounded transition-all bg-zinc-950"
                      >
                        Limpar Logs
                      </button>
                    </div>

                    <div className="p-4 bg-zinc-950 max-h-[160px] overflow-y-auto space-y-1.5 font-mono text-[10px]">
                      {alertLogs.map(log => (
                        <div key={log.id} className="flex gap-2 items-start py-0.5 border-b border-zinc-900/30">
                          <span className="text-zinc-500">{log.time}</span>
                          <span className={`font-bold ${
                            log.type === 'warning' ? 'text-brand-orange' : log.type === 'success' ? 'text-emerald-400' : 'text-blue-400'
                          }`}>
                            [{log.type.toUpperCase()}]
                          </span>
                          <span className="text-zinc-300 leading-relaxed">{log.msg}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentTab === 'sql' && (
                <motion.div
                  key="sql"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-zinc-800">
                      <div>
                        <h4 className="font-bold text-white text-base">PostgreSQL DDL - Supabase Init Setup</h4>
                        <p className="text-xs text-zinc-400">Arraste os parâmetros abaixo para atualizar dinamicamente o código SQL gerado.</p>
                      </div>

                      <button
                        onClick={() => copyToClipboard(dynamicSQL, 'sql')}
                        className="bg-brand-orange hover:bg-brand-orange-hover text-zinc-950 font-bold text-xs py-1.5 px-3 rounded flex items-center gap-1.5 self-end sm:self-auto transition-all shadow"
                      >
                        {copiedSQL ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedSQL ? "Copiado!" : "Copiar Script SQL"}
                      </button>
                    </div>

                    {/* Live configuration knobs for SQL builder */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-zinc-950 p-4 rounded-lg border border-zinc-850">
                      <div>
                        <label className="text-xs text-zinc-400 block mb-1">Minutos Tolerância Triggger:</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={cancelMinutes}
                            onChange={(e) => setCancelMinutes(Math.max(1, parseInt(e.target.value) || 0))}
                            className="bg-zinc-900 border border-zinc-800 text-zinc-100 rounded px-2 py-1 text-xs w-20 focus:outline-none focus:ring-1 focus:ring-brand-orange"
                          />
                          <span className="text-xs text-zinc-500">minutos</span>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-zinc-400 block mb-1">Custos Deslocamento do Mecânico:</label>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-zinc-500">R$</span>
                          <input
                            type="number"
                            value={displacementTax}
                            onChange={(e) => setDisplacementTax(Math.max(0, parseInt(e.target.value) || 0))}
                            className="bg-zinc-900 border border-zinc-800 text-zinc-100 rounded px-2 py-1 text-xs w-20 focus:outline-none focus:ring-1 focus:ring-brand-orange"
                          />
                          <span className="text-xs text-zinc-500">,00 BRL</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-4 sm:pt-0">
                        <input
                          type="checkbox"
                          id="rlsCheck"
                          checked={enableRls}
                          onChange={(e) => setEnableRls(e.target.checked)}
                          className="w-4 h-4 accent-brand-orange cursor-pointer"
                        />
                        <label htmlFor="rlsCheck" className="text-xs text-zinc-300 cursor-pointer">
                          Habilitar Row Level Security (RLS)
                        </label>
                      </div>
                    </div>

                    {/* Pre-installed insert examples explanation banner */}
                    <div className="bg-brand-orange-light/10 border border-brand-orange/20 p-3 rounded-lg flex items-start gap-2.5 text-xs text-zinc-300">
                      <AlertTriangle className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">Carga Inicial de Serviços Garantida:</strong> de acordo com a regra de negócio exigida da startup, o SQL carrega automaticamente via <code className="text-brand-orange text-[11px]">ON CONFLICT</code> os serviços: <strong>TROCAR ÓLEO DE MOTOR</strong> (Pronto Atendimento, 20 min), <strong>TROCA DA PASTILHA DE FREIO</strong> (Pronto Atendimento, 20 min) e <strong>TROCAR KIT TRANSMISSÃO</strong> (Sob Agendamento, 30 min).
                      </div>
                    </div>

                    {/* Code Container */}
                    <div className="relative">
                      <pre className="bg-zinc-950 p-4 rounded-lg overflow-x-auto text-[11px] font-mono text-zinc-350 leading-relaxed max-h-[480px] border border-zinc-850">
                        {dynamicSQL}
                      </pre>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentTab === 'git' && (
                <motion.div
                  key="git"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm space-y-5">
                    {/* Header */}
                    <div className="border-b border-zinc-800 pb-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                      <div>
                        <h4 className="font-bold text-white text-base flex items-center gap-2">
                          <GitBranch className="w-5 h-5 text-brand-orange" />
                          Etapa 2: Integração com o GitHub (Código Fonte)
                        </h4>
                        <p className="text-xs text-zinc-400">Personalize seu repositório oficial e simule a sincronização do código frontend do OttoMotos.</p>
                      </div>
                    </div>

                    {/* Interactive Fields Widget */}
                    <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-850/80 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Organização/Usuário GitHub</label>
                        <input
                          type="text"
                          value={gitUser}
                          onChange={(e) => setGitUser(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-brand-orange"
                          placeholder="Ex: RAIFRAN-DESENVOLVEDOR-PORTFOLIO"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Nome do Repositório</label>
                        <input
                          type="text"
                          value={gitRepo}
                          onChange={(e) => setGitRepo(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-brand-orange"
                          placeholder="Ex: ottomotos"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Branch Padrão</label>
                        <input
                          type="text"
                          value={gitBranch}
                          onChange={(e) => setGitBranch(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-brand-orange"
                          placeholder="Ex: main"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start w-full">
                      {/* Left side: Guide List (dynamic commands update with input above) */}
                      <div className="xl:col-span-7 space-y-4">
                        {[
                          {
                            title: "1. Inicializar Repositório Local & Next.js",
                            desc: "Crie o projeto e configure a estrutura recomendada de pastas.",
                            commands: [
                              "# Criar novo projeto Next.js com TypeScript e App Router",
                              `npx create-next-app@latest ${gitRepo}-frontend --use-npm --ts --src-dir --tailwind --app`,
                              `cd ${gitRepo}-frontend`,
                              "",
                              "# Instalar dependências essenciais do Supabase e Gemini",
                              "npm install @supabase/supabase-js @supabase/auth-helpers-nextjs @google/genai lucide-react framer-motion"
                            ]
                          },
                          {
                            title: "2. Vincular ao GitHub & Primeiro Commit",
                            desc: "Configure seu repositório local e conecte-o ao repositório remoto no GitHub.",
                            commands: [
                              "# Inicializar git",
                              "git init",
                              "",
                              "# Adicionar arquivos e fazer a primeira consolidação",
                              "git add .",
                              "git commit -m 'feat: setup inicial, schemas supabase e estruturas'",
                              "",
                              "# Configurar branch principal e adicionar o repositório GitHub remoto",
                              `git branch -M ${gitBranch}`,
                              `git remote add origin https://github.com/${gitUser}/${gitRepo}.git`,
                              `git push -u origin ${gitBranch}`
                            ]
                          },
                          {
                            title: "3. CLI da Vercel (Login & Vinculação)",
                            desc: "Vincule o repositório local e faça o deploy inicial do Next.js via Vercel CLI.",
                            commands: [
                              "# Instalar a CLI global da Vercel para deploys rápidos",
                              "npm install -g vercel",
                              "",
                              "# Fazer login na conta da Vercel",
                              "vercel login",
                              "",
                              "# Iniciar projeto interativo de vinculação",
                              "vercel link",
                              "",
                              "# Realizar deploy inicial para staging",
                              "vercel"
                            ]
                          }
                        ].map((step, index) => (
                          <div key={index} className="p-4 bg-zinc-950 rounded-lg border border-zinc-850 space-y-2">
                            <div className="flex justify-between items-center border-b border-zinc-900 pb-1.5">
                              <h5 className="font-bold text-xs text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                                <Terminal className="w-4 h-4" /> {step.title}
                              </h5>
                              <button
                                onClick={() => copyToClipboard(step.commands.join('\n'), index)}
                                className="text-[10px] bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white px-2 py-1 rounded border border-zinc-800 flex items-center gap-1 transition-all cursor-pointer"
                              >
                                {copiedCodeIndex === index ? <Check className="w-3 text-emerald-400" /> : <Copy className="w-3" />}
                                {copiedCodeIndex === index ? "Copiado!" : "Copiar Comandos"}
                              </button>
                            </div>
                            
                            <p className="text-[11px] text-zinc-400 leading-normal">{step.desc}</p>
                            
                            <pre className="bg-zinc-900/60 p-3 rounded font-mono text-[10.5px] text-emerald-400 overflow-x-auto leading-relaxed border border-zinc-850/40">
                              {step.commands.join('\n')}
                            </pre>
                          </div>
                        ))}
                      </div>

                      {/* Right side: Terminal Emulator Simulator */}
                      <div className="xl:col-span-5 bg-zinc-950 rounded-xl border border-zinc-850 overflow-hidden flex flex-col h-[525px] shadow-lg">
                        <div className="bg-zinc-900 border-b border-zinc-850 px-4 py-2.5 flex justify-between items-center shrink-0">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                            <span className="text-[10px] text-zinc-400 font-mono ml-2 border-l border-zinc-800 pl-2">git-bash-emulator</span>
                          </div>
                          <span className="text-[9px] bg-zinc-800/85 px-2 py-0.5 rounded text-zinc-400 font-mono">SSH CONNECTED</span>
                        </div>

                        {/* Terminal Body */}
                        <div className="flex-1 p-4 font-mono text-[11px] text-zinc-300 overflow-y-auto space-y-1.5 scrollbar-none">
                          {gitTerminalLogs.length === 0 ? (
                            <div className="h-full flex flex-col justify-center items-center text-center p-6 text-zinc-500 space-y-3">
                              <Terminal className="w-10 h-10 text-zinc-700 stroke-[1.5]" />
                              <div>
                                <p className="font-bold text-xs text-zinc-455">Simulador de Commit & Push</p>
                                <p className="text-[11px] text-zinc-500 max-w-[240px] leading-normal mt-1">Configure os campos acima e clique no botão abaixo para simular o processo de sincronização nativa git.</p>
                              </div>
                            </div>
                          ) : (
                            gitTerminalLogs.map((log, lidx) => (
                              <div
                                key={lidx}
                                className={`leading-relaxed whitespace-pre-wrap ${
                                  log.startsWith('$') ? 'text-brand-orange font-bold' : 
                                  log.includes('concluída') ? 'text-emerald-400 font-semibold bg-emerald-950/25 p-1.5 rounded border border-emerald-900/35' : 'text-zinc-350'
                                }`}
                              >
                                {log}
                              </div>
                            ))
                          )}
                        </div>

                        {/* Push action footer */}
                        <div className="p-3 bg-zinc-900 border-t border-zinc-850 flex gap-2 shrink-0">
                          <button
                            onClick={startGitSimulation}
                            disabled={gitSyncStatus !== 'idle'}
                            className="flex-1 bg-brand-orange hover:bg-brand-orange-hover disabled:bg-zinc-800 text-black disabled:text-zinc-550 font-extrabold text-xs py-2 rounded transition-all cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            {gitSyncStatus === 'idle' && (
                              <>
                                <GitBranch className="w-4 h-4 animate-pulse" />
                                Simular Git Push para GitHub
                              </>
                            )}
                            {gitSyncStatus === 'linking' && (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                Vinculando Repositório Local...
                              </>
                            )}
                            {gitSyncStatus === 'pushing' && (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                Enviando commits para GitHub...
                              </>
                            )}
                            {gitSyncStatus === 'synced' && (
                              <>
                                <Check className="w-4 h-4 text-black font-extrabold" />
                                Repositório Sincronizado!
                              </>
                            )}
                          </button>
                          {gitTerminalLogs.length > 0 && (
                            <button
                              onClick={() => {
                                setGitTerminalLogs([]);
                                setGitSyncStatus('idle');
                              }}
                              className="bg-zinc-800 hover:bg-zinc-750 text-zinc-400 hover:text-white px-3 py-2 rounded text-xs transition-all cursor-pointer"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentTab === 'env' && (
                <motion.div
                  key="env"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
                    <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                      <div>
                        <h4 className="font-bold text-white text-base">Arquivo de Variáveis: .env.local</h4>
                        <p className="text-xs text-zinc-400">Template com os roteamentos necessários para conectar o Supabase e o Gemini AI.</p>
                      </div>

                      <button
                        onClick={() => copyToClipboard(ENV_EXAMPLE_FILE_CONTENT, 'env')}
                        className="bg-brand-orange hover:bg-brand-orange-hover text-zinc-950 font-bold text-xs py-1.5 px-3 rounded flex items-center gap-1.5 transition-all shadow"
                      >
                        {copiedEnv ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedEnv ? "Copiado!" : "Copiar .env"}
                      </button>
                    </div>

                    <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-850">
                      <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest block mb-1.5">Instrução de Alocação de Segredos</span>
                      <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                        Crie um arquivo chamado <strong className="text-zinc-100 font-mono text-xs">.env.local</strong> no diretório raiz do seu projeto Next.js recém-criado. Insira as credenciais do seu projeto do Supabase obtidas no painel de administração e o token de API provido pelo Google AI Studio para que os serviços serverless funcionem corretamente.
                      </p>

                      <pre className="p-3 bg-zinc-900 text-zinc-300 font-mono text-[11px] leading-relaxed rounded border border-zinc-850 overflow-x-auto">
                        {ENV_EXAMPLE_FILE_CONTENT}
                      </pre>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentTab === 'web-mobile' && (
                <motion.div
                  key="web-mobile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
                    <div className="border-b border-zinc-800 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <h4 className="font-bold text-white text-base flex items-center gap-2">
                          <Smartphone className="w-5 h-5 text-brand-orange" />
                          Plano de Portabilidade: Web para Mobile Apps
                        </h4>
                        <p className="text-xs text-zinc-400">Diretrizes arquiteturais para empacotar o OttoMotos com Capacitor, React e PWA.</p>
                      </div>
                      
                      <div className="bg-zinc-950 p-1 rounded-lg border border-brand-orange/10 flex items-center gap-1.5 text-xs text-zinc-400 shrink-0">
                        <span className="pl-1 text-zinc-500 font-medium">Visualizar:</span>
                        <button
                          onClick={() => setMobileScreen('mechanic')}
                          className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                            mobileScreen === 'mechanic' ? 'bg-brand-orange text-black' : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          App Oficina
                        </button>
                        <button
                          onClick={() => setMobileScreen('client')}
                          className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                            mobileScreen === 'client' ? 'bg-brand-orange text-black' : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          App Cliente
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 w-full">
                      {/* Left Side: Instructions and Code Blocks */}
                      <div className="xl:col-span-7 space-y-5">
                        
                        {/* Intro text */}
                        <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-850 space-y-2 text-xs leading-relaxed">
                          <h5 className="font-bold text-white flex items-center gap-1.5 text-xs">
                            <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
                            Por que usar uma arquitetura Híbrida (Capacitor/PWA)?
                          </h5>
                          <p className="text-zinc-300">
                            A startup OttoMotos opera em um cenário de alta mobilidade física (mecânicos furgonistas nas ruas e clientes agendados em movimento). Para garantir o menor tempo de desenvolvimento e máxima fidelidade de código da Fase 1, a estratégia sugerida é o uso do <strong>Capacitor (da Ionic)</strong>. 
                          </p>
                          <p className="text-zinc-400">
                            Dessa forma, o mesmo código em React/Typescript e as consultas ao banco de dados Supabase podem ser compilados diretamente para <strong>Android (Java/Kotlin)</strong> e <strong>iOS (Swift/Objective-C)</strong> sem necessity de reescrever em outra linguagem.
                          </p>
                        </div>

                        {/* Bento Grid layout of features */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Item 1: Deep Linking & Auth */}
                          <div className="p-3.5 bg-zinc-950/60 rounded-xl border border-zinc-850/80 space-y-2 flex flex-col justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 text-zinc-200 mb-1">
                                <ShieldCheck className="w-4 h-4 text-brand-orange" />
                                <strong className="text-xs">Deep Linking & Supabase Auth</strong>
                              </div>
                              <p className="text-[11px] text-zinc-400 leading-normal">
                                No app nativo móvel, redirecionamentos padrão de login (OAuth ou links de confirmação) não operam em URLs Web comuns como <span className="text-zinc-350 font-mono">http://localhost:3000</span>. Configura-se esquemas nativos:
                              </p>
                            </div>
                            <pre className="p-2 bg-zinc-900 rounded font-mono text-[9px] text-emerald-400 overflow-x-auto">
{`"appId": "io.ottomotos.app",
"appName": "OttoMotos",
"cordova": {
  "preferences": {
    "UniversalLinks": "enabled"
  }
}`}
                            </pre>
                            <span className="block text-[10px] text-zinc-500">Mapear <code className="text-zinc-350 font-mono bg-zinc-900 px-1 rounded">io.ottomotos.app://</code> no redirect do Supabase Auth.</span>
                          </div>

                          {/* Item 2: Camera permissions */}
                          <div className="p-3.5 bg-zinc-950/60 rounded-xl border border-zinc-850/80 space-y-2 flex flex-col justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 text-zinc-200 mb-1">
                                <Smartphone className="w-4 h-4 text-brand-orange" />
                                <strong className="text-xs">Câmera Nativa (Checklists)</strong>
                              </div>
                              <p className="text-[11px] text-zinc-400 leading-normal">
                                Nossa validação visual via AI (Gemini Vision) requer upload de avarias. Para o webapp usamos as tags HTML input, mas em aplicativos nativos, use o SDK Capacitor Camera para obter fotos de alta resolução diretamente do hardware do celular:
                              </p>
                            </div>
                            <pre className="p-2 bg-zinc-900 rounded font-mono text-[9px] text-emerald-400 overflow-x-auto">
{`import { Camera, CameraResultType } from '@capacitor/camera';

const takePhoto = async () => {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: false,
    resultType: CameraResultType.Uri
  });
  return image.webPath;
};`}
                            </pre>
                          </div>

                          {/* Item 3: Geolocation */}
                          <div className="p-3.5 bg-zinc-950/60 rounded-xl border border-zinc-850/80 space-y-2 flex flex-col justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 text-zinc-200 mb-1">
                                <Globe className="w-4 h-4 text-brand-orange" />
                                <strong className="text-xs">Rastreamento GPS em Real-Time</strong>
                              </div>
                              <p className="text-[11px] text-zinc-400 leading-normal">
                                Os furgões furgonistas da modalidade <strong>Mobile</strong> circulam prestando reparação na via. Usando o plugin Geolocation do Capacitor é possível atualizar no Supabase as coordenadas do mecânico em segundo plano a cada 2 minutos:
                              </p>
                            </div>
                            <pre className="p-2 bg-zinc-900 rounded font-mono text-[9px] text-emerald-400 overflow-x-auto">
{`import { Geolocation } from '@capacitor/geolocation';

const trackLocation = async () => {
  const coords = await Geolocation.getCurrentPosition();
  // Atualizar Tabela public.mechanic
}`}
                            </pre>
                          </div>

                          {/* Item 4: Push Notifications */}
                          <div className="p-3.5 bg-zinc-950/60 rounded-xl border border-zinc-850/80 space-y-2 flex flex-col justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 text-zinc-200 mb-1">
                                <Flame className="w-4 h-4 text-brand-orange" />
                                <strong className="text-xs">Notificações por Push operacionais</strong>
                              </div>
                              <p className="text-[11px] text-zinc-400 leading-normal">
                                Diferente de e-mails, notificações push convertem mais. Use o Supabase Database Webhooks conectados ao Firebase Cloud Messaging (FCM) no app do mecânico para alertar instantaneamente sobre novas ordens de serviço ou níveis críticos de estoque:
                              </p>
                            </div>
                            <pre className="p-2 bg-zinc-900 rounded font-mono text-[9px] text-emerald-400 overflow-x-auto">
{`import { PushNotifications } from '@capacitor/push';

PushNotifications.addListener('pushReceived', 
  (notification) => {
    console.log('Mensagem:', notification.body);
  }
);`}
                            </pre>
                          </div>
                        </div>

                      </div>

                      {/* Right Side: Interactive CSS Phone Chassis Simulator */}
                      <div className="xl:col-span-5 flex flex-col justify-center items-center">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-3 block">Simulação de Smartphone Ativo</span>
                        
                        {/* Device Shell Chassis */}
                        <div className="max-w-[320px] w-full h-[620px] bg-zinc-950 border-[10px] border-zinc-800 rounded-[38px] shadow-2xl relative flex flex-col overflow-hidden text-zinc-100 select-none">
                          {/* Island / Notch details */}
                          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-40 flex items-center justify-around px-1">
                            <div className="w-2.5 h-2.5 bg-zinc-900 rounded-full border border-zinc-950 animate-pulse"></div>
                            <div className="w-6 h-0.5 bg-zinc-900 rounded-full"></div>
                          </div>

                          {/* Mobile Phone Status Bar */}
                          <div className="bg-zinc-950 py-1.5 px-6 flex justify-between items-center text-[10px] text-zinc-400 font-mono z-30 shrink-0">
                            <span>12:45 UTC</span>
                            <div className="flex items-center gap-1">
                              <span>5G</span>
                              <div className="flex gap-[1px]">
                                <div className="w-[2px] h-[3px] bg-zinc-400"></div>
                                <div className="w-[2px] h-[5px] bg-zinc-400"></div>
                                <div className="w-[2px] h-[7px] bg-zinc-400"></div>
                                <div className="w-[2px] h-[10px] bg-zinc-400"></div>
                              </div>
                              <div className="w-5 h-2.5 border border-zinc-400 rounded-sm relative p-[1px] flex">
                                <div className="bg-emerald-400 h-full w-[85%] rounded-2xs"></div>
                                <div className="w-[1px] h-[4px] bg-zinc-400 absolute -right-[2px] top-[2px]"></div>
                              </div>
                            </div>
                          </div>

                          {/* App content workspace inside Phone */}
                          <div className="flex-1 bg-zinc-900 p-4 overflow-y-auto flex flex-col justify-between scrollbar-none">
                            
                            {/* Inner App Header */}
                            <div className="flex justify-between items-center border-b border-zinc-800 pb-2 mb-3">
                              <span className="text-xs font-black tracking-tight text-white flex items-center gap-1">
                                <svg viewBox="0 0 310 100" className="h-4 text-brand-orange fill-current" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M 45 15 C 20 15 0 35 0 60 C 0 85 20 105 45 105 C 62 105 76 95 82 81 C 84 76 81 71 76 71 C 72 71 69 73 67 77 C 63 85 55 90 45 90 C 28 90 15 77 15 60 C 15 43 28 30 45 30 C 56 30 65 36 69 46 C 71 51 75 53 79 51 C 83 50 85 46 83 42 C 76 26 62 15 45 15 Z" />
                                </svg>
                                OTTO MOTOS
                              </span>
                              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">v1.0.0-Hybrid</span>
                            </div>

                            {/* SCREEN CONTENT: mechanic */}
                            {mobileScreen === 'mechanic' && (
                              <div className="space-y-3 flex-1 flex flex-col justify-between">
                                <div className="space-y-2.5">
                                  <div className="flex justify-between items-center bg-zinc-950 p-2 rounded border border-zinc-850">
                                    <div className="text-[10px]">
                                      <p className="text-zinc-400 font-bold">Oficina / Danilo</p>
                                      <p className="text-white text-xs font-extrabold mt-0.5">O.S. #1002 - Em Espera</p>
                                    </div>
                                    <span className="text-[9px] bg-brand-orange-light text-brand-orange font-bold px-1.5 py-0.5 rounded uppercase">Ativo</span>
                                  </div>

                                  <div className="bg-zinc-950 p-2.5 rounded border border-zinc-850 space-y-1.5">
                                    <span className="text-[9px] text-zinc-400 uppercase font-black tracking-widest block font-bold">Checklist Visual (Fotografar)</span>
                                    
                                    {/* Action element */}
                                    <div className="border border-dashed border-zinc-800 bg-zinc-900 rounded p-3 text-center flex flex-col items-center justify-center min-h-[90px] relative overflow-hidden">
                                      {mobilePhotoStatus === 'idle' && (
                                        <>
                                          <Smartphone className="w-5 h-5 text-zinc-400 mb-1 animate-pulse" />
                                          <p className="text-[9px] text-zinc-400 leading-normal">Nenhum registro visual adicionado ainda</p>
                                        </>
                                      )}

                                      {mobilePhotoStatus === 'taking' && (
                                        <div className="space-y-1 py-1">
                                          <div className="w-4 h-4 rounded-full bg-red-500 animate-ping mx-auto"></div>
                                          <p className="text-[11px] text-zinc-300 font-bold font-mono">Disparando Câmera API...</p>
                                        </div>
                                      )}

                                      {mobilePhotoStatus === 'processing' && (
                                        <div className="space-y-1 py-1">
                                          <RefreshCw className="w-4 h-4 text-brand-orange animate-spin mx-auto" />
                                          <p className="text-[11px] text-zinc-300 font-bold font-mono">Processando Gemini Vision...</p>
                                        </div>
                                      )}

                                      {mobilePhotoStatus === 'done' && (
                                        <div className="text-center">
                                          <img src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=200" alt="Inspected part" className="w-16 h-12 rounded object-cover mx-auto" referrerPolicy="no-referrer" />
                                          <p className="text-[9px] text-emerald-400 font-bold mt-1 inline-flex items-center gap-0.5"><Check className="w-3 h-3" /> Pastilha Traseira: 98% Confiança</p>
                                        </div>
                                      )}
                                    </div>

                                    {/* Interactive native triggers */}
                                    <div className="flex gap-2 text-xs">
                                      <button
                                        onClick={() => {
                                          if (mobilePhotoStatus !== 'idle') return;
                                          setMobilePhotoStatus('taking');
                                          setTimeout(() => {
                                            setMobilePhotoStatus('processing');
                                            setTimeout(() => {
                                              setMobilePhotoStatus('done');
                                              addLog('Aplicativo Mobile: Foto de peça recebida via Capacitor Camera e analisada por AI.', 'success');
                                            }, 2000);
                                          }, 1000);
                                        }}
                                        disabled={mobilePhotoStatus !== 'idle'}
                                        className="flex-1 bg-brand-orange hover:bg-brand-orange-hover active:bg-amber-600 disabled:opacity-40 text-black font-extrabold text-[10px] py-1.5 rounded transition-all flex items-center justify-center gap-1 h-[36px] cursor-pointer"
                                      >
                                        Fotografar Peça
                                      </button>
                                      
                                      <button
                                        onClick={() => {
                                          setMobilePhotoStatus('idle');
                                        }}
                                        className="bg-zinc-800 hover:bg-zinc-700 text-zinc-350 px-2 rounded text-[10px] cursor-pointer"
                                      >
                                        Reset
                                      </button>
                                    </div>
                                  </div>

                                  <div className="bg-zinc-950 p-2.5 rounded border border-zinc-850">
                                    <span className="text-[9px] text-zinc-400 uppercase font-black tracking-widest block mb-1">Status Operacional:</span>
                                    <p className="text-[10px] text-zinc-300 leading-normal">
                                      Furgão ativo no setor <strong>Campinas - Central</strong>. Sincronização offline ativa no SQLite local do app de serviço.
                                    </p>
                                  </div>
                                </div>

                                <div className="p-2 bg-brand-orange-light/10 border border-brand-orange/20 rounded text-[9px] text-zinc-305 leading-relaxed text-center">
                                  💡 <strong>Modo Offline Automatizado:</strong> Se a rede cair nas garagens, o app local enfileira os checklists para envio ao reconectar.
                                </div>
                              </div>
                            )}

                            {/* SCREEN CONTENT: client */}
                            {mobileScreen === 'client' && (
                              <div className="space-y-3 flex-1 flex flex-col justify-between">
                                <div className="space-y-2.5">
                                  {/* Client greeting card */}
                                  <div className="bg-zinc-950 p-2.5 rounded border border-zinc-850 space-y-1">
                                    <p className="text-[9px] text-zinc-400 uppercase tracking-widest font-bold">Cliente Conectado</p>
                                    <p className="text-white text-xs font-extrabold">Olá, Carol Silva</p>
                                    <div className="flex justify-between items-center text-[10px] pt-1">
                                      <span className="text-zinc-505">Saldo Fidelidade:</span>
                                      <span className="text-brand-orange font-bold font-mono">{loyalty.find(l => l.client_id === 'usr-client-1')?.points_balance || 150} pts</span>
                                    </div>
                                  </div>

                                  {/* Active tracking service card */}
                                  <div className="bg-zinc-950 p-2.5 rounded border border-zinc-850 space-y-2">
                                    <div className="flex justify-between items-center">
                                      <span className="text-[9px] text-zinc-400 uppercase font-black tracking-widest animate-pulse">O.S. #1001 - Honda Biz</span>
                                      <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1 py-0.5 rounded font-bold uppercase shrink-0">EM PROGRESSO</span>
                                    </div>
                                    
                                    <div className="space-y-1 text-[10px] text-zinc-300">
                                      <p className="flex justify-between"><span>Modelo de reparo:</span> <strong className="text-white">Express</strong></p>
                                      <p className="flex justify-between"><span>Mecânico Alocado:</span> <strong className="text-white">Danilo</strong></p>
                                    </div>

                                    {/* Action button inside phone to claim loyalty */}
                                    <div className="pt-1.5 border-t border-zinc-900">
                                      <button
                                        onClick={() => {
                                          handleAddLoyaltyPoints('usr-client-1', 100);
                                          setMobileLoyaltyAdded(true);
                                          setTimeout(() => setMobileLoyaltyAdded(false), 2000);
                                        }}
                                        className="w-full bg-zinc-900 hover:bg-zinc-850 text-white font-bold text-[9px] py-1.5 rounded transition-all flex items-center justify-center gap-1 border border-zinc-800 cursor-pointer h-[32px]"
                                      >
                                        <Award className="w-3.5 h-3.5 text-brand-orange" />
                                        {mobileLoyaltyAdded ? "Adicionados +100 Pontos!" : "Simular Geração de Pontos"}
                                      </button>
                                    </div>
                                  </div>

                                  {/* Reserve Bike Request panel */}
                                  <div className="bg-zinc-950 p-2.5 rounded border border-zinc-850 space-y-1 text-center">
                                    <span className="text-[9px] text-zinc-400 uppercase font-black tracking-widest block mb-1">Benefício Moto Reserva</span>
                                    
                                    <button
                                      disabled={ (loyalty.find(l => l.client_id === 'usr-client-1')?.points_balance || 150) < 500 }
                                      className="w-full bg-brand-orange text-black disabled:bg-zinc-850 disabled:text-zinc-600 font-extrabold text-[9px] py-1.5 rounded transition-all uppercase h-[32px] cursor-pointer"
                                    >
                                      {(loyalty.find(l => l.client_id === 'usr-client-1')?.points_balance || 150) >= 500 ? "Resgatar Moto Reserva" : "Bloqueado (Mínimo 500 pts)"}
                                    </button>
                                  </div>
                                </div>

                                <div className="text-[8.5px] text-zinc-400 text-center leading-normal">
                                  O aplicativo móvel se integra via autenticação de sessão do Supabase, salvando o JWT token localmente de forma persistente.
                                </div>
                              </div>
                            )}

                          </div>

                          {/* Home indicator bar inside Phone screen */}
                          <div className="bg-zinc-950 py-1.5 flex justify-center z-30 shrink-0">
                            <div className="w-24 h-1 bg-zinc-700 rounded-full"></div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Right sidebar - Database Explorer and Roles overview (Spans 4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Supabase Roles Explainer */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-sm space-y-3">
              <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-orange" />
                Matriz de Perfis (users_profiles)
              </h4>
              <p className="text-xs text-zinc-400 leading-normal">
                Níveis de acesso configurados no PostgreSQL integrados ao Supabase Auth para guiar as regras RLS recomendadas:
              </p>

              <div className="space-y-2 mt-2">
                <div className="p-2.5 bg-zinc-950 rounded border border-zinc-850 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <strong className="text-white">client_b2c</strong>
                    <span className="text-[9px] bg-zinc-800 text-zinc-400 font-mono px-1 py-0.5 rounded">Clientes Carol/Carlos</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-normal">Visualizam as próprias manutenções e o balanço do programa de fidelidade.</p>
                </div>

                <div className="p-2.5 bg-zinc-950 rounded border border-zinc-850 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <strong className="text-white">client_b2b</strong>
                    <span className="text-[9px] bg-zinc-800 text-zinc-400 font-mono px-1 py-0.5 rounded">Frotistas (Ex: Antônio)</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-normal">Permite monitoramento simultâneo de várias motocicletas vinculadas à empresa frotista.</p>
                </div>

                <div className="p-2.5 bg-zinc-950 rounded border border-zinc-850 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <strong className="text-white">mechanic</strong>
                    <span className="text-[9px] bg-zinc-805 text-zinc-350 font-mono px-1 py-0.5 rounded">Danilo Mecânico</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-normal">Acessa ordens registradas, preenche avarias do checklist e faz upload no storage.</p>
                </div>

                <div className="p-2.5 bg-zinc-950 rounded border border-zinc-850 text-xs">
                  <div className="flex justify-between items-center mb-1">
                    <strong className="text-white">admin</strong>
                    <span className="text-[9px] bg-brand-orange-light text-brand-orange font-mono px-1 py-0.5 rounded border border-brand-orange/20">Isabela Administradora</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-normal">Controle de fluxo operacional irrestrito, resets de estoque e auditorias globais.</p>
                </div>
              </div>
            </div>

            {/* Simulated Table counts */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-sm space-y-3">
              <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                <Database className="w-4 h-4 text-emerald-400" />
                Explorador de Registros (Simulado)
              </h4>
              <p className="text-xs text-zinc-400 leading-normal">
                Status das tabelas que estão sendo emuladas pelo dashboard no navegador:
              </p>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center p-2 bg-zinc-950 rounded border border-zinc-850">
                  <span className="font-mono text-zinc-400">users_profiles</span>
                  <span className="font-bold text-white">{users.length} linhas</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-zinc-950 rounded border border-zinc-850">
                  <span className="font-mono text-zinc-400">services_catalog</span>
                  <span className="font-bold text-white">{services.length} linhas</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-zinc-950 rounded border border-zinc-850">
                  <span className="font-mono text-zinc-400">service_orders</span>
                  <span className="font-bold text-white">{orders.length} linhas</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-zinc-950 rounded border border-zinc-850">
                  <span className="font-mono text-zinc-400">inventory</span>
                  <span className="font-bold text-white">{inventory.length} linhas</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-zinc-950 rounded border border-zinc-850">
                  <span className="font-mono text-zinc-400">loyalty_program</span>
                  <span className="font-bold text-white">{loyalty.length} linhas</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-zinc-950 rounded border border-zinc-850">
                  <span className="font-mono text-zinc-400">checklist_validations</span>
                  <span className="font-bold text-white">{validations.length} linhas</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setUsers(INITIAL_USERS);
                  setServices(INITIAL_SERVICES);
                  setOrders(INITIAL_ORDERS);
                  setInventory(INITIAL_INVENTORY);
                  setLoyalty(INITIAL_LOYALTY);
                  setValidations(INITIAL_VALIDATIONS);
                  addLog('Todos os estados e logs foram revertidos aos valores de fábrica.', 'info');
                }}
                className="w-full mt-2 bg-zinc-950 hover:bg-zinc-850 text-zinc-400 hover:text-white border border-zinc-800 text-[11px] py-1.5 rounded transition-all flex items-center justify-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Reparar / Resetar Banco Simulado
              </button>
            </div>

            {/* Architecture validation tag */}
            <div className="p-3 bg-zinc-900/40 border border-zinc-850 rounded-lg text-xs leading-relaxed text-zinc-400">
              <span className="font-bold text-zinc-200 block mb-1">Validação do Sênior</span>
              Este portal valida de forma visual a transição e integridade das tabelas da Fase 1, permitindo exportar diretamente o código SQL estruturado otimizado para o Supabase.
            </div>

          </div>

        </div>

      </main>

      <footer className="border-t border-zinc-900 bg-zinc-950 py-8 px-4 text-center text-xs text-zinc-500 mt-12">
        <p>© 2026 OttoMotos Startup de Reparos Rápidos. Todos os direitos reservados de infraestrutura.</p>
        <p className="mt-1 text-zinc-650">Desenvolvido sob diretrizes rígidas de integridade de Banco de Dados e RLS.</p>
      </footer>
    </div>
  );
}
