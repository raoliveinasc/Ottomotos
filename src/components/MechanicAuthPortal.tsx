import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wrench,
  Shield,
  FileText,
  User,
  Mail,
  Lock,
  Phone,
  Briefcase,
  FileUp,
  Trash2,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Award,
  IdCard,
  Eye,
  EyeOff,
  Truck,
  DollarSign,
  TrendingUp,
  Clock,
  Check,
  CheckCircle,
  HelpCircle,
  Info,
  ChevronDown,
  ChevronUp,
  MapPin,
  Sliders,
  Camera,
  Globe,
  Star,
  Users,
  ArrowLeft
} from 'lucide-react';

interface MechanicAuthPortalProps {
  onLoginSuccess: (mechanicUser: {
    id: string;
    name: string;
    email: string;
    meName: string;
    meCnpj: string;
    cnh: string;
  }) => void;
  onBackToLanding: () => void;
}

interface UploadedDoc {
  name: string;
  size: string;
  uploading: boolean;
  progress: number;
  completed: boolean;
}

export default function MechanicAuthPortal({ onLoginSuccess, onBackToLanding }: MechanicAuthPortalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Earnings Simulator state
  const [jobsPerDay, setJobsPerDay] = useState<number>(5);
  const [daysPerWeek, setDaysPerWeek] = useState<number>(5);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Register Form states
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCpf, setRegCpf] = useState('');
  const [regCnh, setRegCnh] = useState('AB');
  const [regCnpj, setRegCnpj] = useState('');
  const [regMeName, setRegMeName] = useState('');
  const [regExp, setRegExp] = useState('3');
  const [regCerts, setRegCerts] = useState('');
  
  // Simulated document uploads
  const [documents, setDocuments] = useState<Record<string, UploadedDoc | null>>({
    cnh: null,
    background: null,
    residence: null,
    technical: null
  });

  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [createdProtocol, setCreatedProtocol] = useState('');
  const [createdCandidate, setCreatedCandidate] = useState<any | null>(null);

  // Default demo mechanics
  const demoMechanics = [
    {
      id: 'mcn-01',
      name: 'Danilo Otto dos Santos',
      email: 'danilo@ottomotos.com',
      meName: 'Danilo Mecânica ME',
      meCnpj: '45.289.112/0001-89',
      cnh: 'Categoria AB - Definitiva'
    }
  ];

  // Calculate earnings formula
  const calculateEarnings = () => {
    const weeklyJobs = jobsPerDay * daysPerWeek;
    const monthlyJobs = Math.round(weeklyJobs * 4.34);
    const grossRatePerJob = 75; // average net rate per service
    return monthlyJobs * grossRatePerJob;
  };

  // Scroll smoothly to auth section
  const scrollToAuth = (tab: 'login' | 'register') => {
    setActiveTab(tab);
    const el = document.getElementById('auth-form-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle Login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    if (!loginEmail || !loginPassword) {
      setLoginError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsLoggingIn(true);

    setTimeout(() => {
      const found = demoMechanics.find(
        m => m.email.toLowerCase() === loginEmail.toLowerCase()
      );

      let customFound = null;
      try {
        const savedApproved = localStorage.getItem('otto_approved_mechanics');
        if (savedApproved) {
          const arr = JSON.parse(savedApproved);
          const match = arr.find((m: any) => m.email && m.email.toLowerCase() === loginEmail.toLowerCase());
          if (match) {
            customFound = {
              id: match.id,
              name: match.name,
              email: match.email || `${match.name.toLowerCase().replace(/\s+/g, '')}@ottomotos.com`,
              meName: match.meName || `${match.name} ME`,
              meCnpj: match.meicnpj || '00.000.000/0001-00',
              cnh: match.cnh || 'Categoria AB - Definitiva'
            };
          }
        }
      } catch (err) {
        console.error(err);
      }

      const activeUser = found || customFound;

      if (activeUser) {
        onLoginSuccess(activeUser);
      } else {
        if (loginEmail.includes('@') && loginPassword.length >= 4) {
          onLoginSuccess({
            id: `mcn-${Math.floor(Math.random() * 900) + 100}`,
            name: loginEmail.split('@')[0].toUpperCase(),
            email: loginEmail,
            meName: `${loginEmail.split('@')[0].toUpperCase()} Reparos ME`,
            meCnpj: '44.312.809/0001-99',
            cnh: 'Categoria AB - Definitiva'
          });
        } else {
          setLoginError('Credenciais não encontradas ou inválidas.');
        }
      }
      setIsLoggingIn(false);
    }, 800);
  };

  // Simulates file upload progress
  const triggerDocUpload = (docKey: string, fileName: string, fileSize: string) => {
    setDocuments(prev => ({
      ...prev,
      [docKey]: {
        name: fileName,
        size: fileSize,
        uploading: true,
        progress: 0,
        completed: false
      }
    }));

    let progressVal = 0;
    const interval = setInterval(() => {
      progressVal += 20;
      setDocuments(prev => {
        const doc = prev[docKey];
        if (!doc) return prev;
        return {
          ...prev,
          [docKey]: {
            ...doc,
            progress: progressVal,
            completed: progressVal >= 100,
            uploading: progressVal < 100
          }
        };
      });

      if (progressVal >= 100) {
        clearInterval(interval);
      }
    }, 150);
  };

  const removeDoc = (docKey: string) => {
    setDocuments(prev => ({
      ...prev,
      [docKey]: null
    }));
  };

  const mockFileSelection = (docKey: string) => {
    const fileOptions: Record<string, { name: string; size: string }> = {
      cnh: { name: 'cnh_digital_definitiva_ab.pdf', size: '1.4 MB' },
      background: { name: 'certidao_nada_consta_pf.pdf', size: '840 KB' },
      residence: { name: 'comprovante_luz_copel.pdf', size: '1.1 MB' },
      technical: { name: 'certificado_mecanica_motocicletas_senai.png', size: '2.3 MB' }
    };
    const chosen = fileOptions[docKey];
    triggerDocUpload(docKey, chosen.name, chosen.size);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!regName || !regEmail || !regPhone || !regCpf || !regCnpj || !regMeName) {
      alert('Por favor, preencha todos os campos obrigatórios do formulário.');
      return;
    }

    if (!documents.cnh || !documents.background) {
      alert('Por favor, anexe pelo menos os documentos obrigatórios (CNH e Certidão de Antecedentes Criminais).');
      return;
    }

    const randId = `mcn-${Math.floor(100 + Math.random() * 900)}`;
    const protocolNum = `OTTO-2026-${randId.toUpperCase()}`;

    const candidateData = {
      id: randId,
      name: regName,
      phone: regPhone,
      email: regEmail,
      meicnpj: regCnpj,
      meName: regMeName,
      cnh: `Categoria ${regCnh} - Definitiva`,
      bgCheck: 'Aprovado (Nenhum antecedente)',
      exp: `${regExp} anos de experiência ativa. Cursos: ${regCerts || 'Não informado'}`
    };

    try {
      const savedPending = localStorage.getItem('otto_pending_onboardings');
      let arr = [];
      if (savedPending) {
        arr = JSON.parse(savedPending);
      }
      arr.unshift(candidateData);
      localStorage.setItem('otto_pending_onboardings', JSON.stringify(arr));
    } catch (err) {
      console.error(err);
    }

    setCreatedProtocol(protocolNum);
    setCreatedCandidate(candidateData);
    setRegisterSuccess(true);
  };

  const handleInstantApprovalBypass = () => {
    if (!createdCandidate) return;

    try {
      const savedApproved = localStorage.getItem('otto_approved_mechanics');
      let approvedArr = [];
      if (savedApproved) {
        approvedArr = JSON.parse(savedApproved);
      }
      approvedArr.unshift(createdCandidate);
      localStorage.setItem('otto_approved_mechanics', JSON.stringify(approvedArr));

      const savedPending = localStorage.getItem('otto_pending_onboardings');
      if (savedPending) {
        const pendArr = JSON.parse(savedPending);
        const filtered = pendArr.filter((c: any) => c.id !== createdCandidate.id);
        localStorage.setItem('otto_pending_onboardings', JSON.stringify(filtered));
      }
    } catch (err) {
      console.error(err);
    }

    onLoginSuccess({
      id: createdCandidate.id,
      name: createdCandidate.name,
      email: createdCandidate.email || `${createdCandidate.name.toLowerCase().replace(/\s+/g, '')}@ottomotos.com`,
      meName: createdCandidate.meName || `${createdCandidate.name} Reparos ME`,
      meCnpj: createdCandidate.meicnpj || '00.000.000/0001-00',
      cnh: createdCandidate.cnh || 'Categoria AB - Definitiva'
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-brand-orange selection:text-black font-sans">
      {/* 1. HEADER DA ÁREA DO MECÂNICO */}
      <header className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 px-4 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToLanding}
              className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Voltar ao início"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Início</span>
            </button>
            <div className="h-5 w-px bg-zinc-800 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-orange text-black flex items-center justify-center font-black text-sm shadow-md">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-sm sm:text-base text-white tracking-tight block leading-tight">
                  MyOttoVan
                </span>
                <span className="text-[9px] text-brand-orange font-mono uppercase font-bold tracking-wider block">
                  Área do Mecânico & MEI
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => scrollToAuth('login')}
              className="bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl border border-zinc-750 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-brand-orange" />
              <span>Entrar</span>
            </button>
            <button
              onClick={() => scrollToAuth('register')}
              className="bg-brand-orange hover:bg-brand-orange-hover text-black font-extrabold text-xs px-4 py-2 rounded-xl shadow-lg transition-all cursor-pointer uppercase tracking-wider hidden sm:flex items-center gap-1.5"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Cadastrar MEI</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION - ABORDAGEM LANDING PAGE */}
      <section className="relative pt-12 pb-20 px-4 overflow-hidden border-b border-zinc-900 bg-gradient-to-b from-zinc-950 via-zinc-900/50 to-zinc-950">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto text-center space-y-7 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-black rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            Franquia Móvel de Mecânica sob Demanda
          </span>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08] max-w-4xl mx-auto text-white font-sans">
            Sua oficina sobre rodas completa. <br className="hidden sm:inline" />
            <span className="text-brand-orange">Sua liberdade e faturamento em alta.</span>
          </h1>

          <p className="text-zinc-300 text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-normal">
            Elimine os altos custos fixos de aluguel comercial. Trabalhe com a van equipada MyOttoVan, atenda chamados em tempo real na sua região e fature direto na sua conta MEI.
          </p>

          {/* Prova Social de Confiança do Mecânico */}
          <div className="max-w-xl mx-auto bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4.5 flex flex-col sm:flex-row items-center gap-4 text-left shadow-2xl">
            <div className="flex -space-x-2 shrink-0 items-center">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
                alt="Danilo Silva"
                className="w-11 h-11 rounded-full object-cover border-2 border-brand-orange"
                referrerPolicy="no-referrer"
              />
              <div className="w-6 h-6 rounded-full bg-brand-orange text-black flex items-center justify-center text-[10px] font-black border-2 border-zinc-900">
                ★
              </div>
            </div>
            <div>
              <p className="text-xs text-zinc-200 italic font-medium leading-snug">
                "Antes eu pagava R$ 2.800 de aluguel fixo em ponto comercial e sobrava muito pouco. Com a MyOttoVan, recebo os chamados no tablet, uso o estoque de peças consignado e faturo mais de R$ 10.000/mês."
              </p>
              <span className="text-[10px] text-brand-orange block mt-1.5 font-bold font-mono">
                Danilo Silva — Mecânico Parceiro há 1 ano • 4.9 ★ • +140 atendimentos
              </span>
            </div>
          </div>

          {/* Botões de Ação Principais */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3 max-w-md mx-auto w-full">
            <button
              onClick={() => scrollToAuth('login')}
              className="w-full sm:w-auto flex-1 bg-brand-orange hover:bg-brand-orange-hover text-black font-black text-sm py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-orange/20 hover:scale-[1.02] cursor-pointer uppercase tracking-wider"
            >
              <User className="w-4 h-4" />
              <span>Acessar Login do Mecânico</span>
            </button>
            <button
              onClick={() => scrollToAuth('register')}
              className="w-full sm:w-auto flex-1 bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold text-sm py-4 px-6 rounded-xl border border-zinc-750 flex items-center justify-center gap-2 transition-all cursor-pointer uppercase tracking-wider"
            >
              <Briefcase className="w-4 h-4 text-brand-orange" />
              <span>Cadastrar MEI</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. VANTAGENS COMPETITIVAS */}
      <section className="py-16 px-4 max-w-7xl mx-auto border-b border-zinc-900">
        <div className="text-center max-w-3xl mx-auto space-y-2 mb-12">
          <span className="text-xs bg-brand-orange/10 text-brand-orange font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-brand-orange/20 inline-block">
            Por que ser um Parceiro MyOttoVan?
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Tudo o que você precisa para crescer sem dívidas
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-2xl space-y-3 text-left hover:border-brand-orange/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center border border-brand-orange/20">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-white">Rendimento Atrativo</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Média líquida de R$ 75,00 por serviço. Faça seu próprio horário e multiplique seus ganhos diários.
            </p>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-2xl space-y-3 text-left hover:border-brand-orange/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center border border-brand-orange/20">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-white">Zero Custo de Galpão</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Esqueça contas absurdas de luz comercial, água e aluguel de ponto fixo. A van é sua base autônoma.
            </p>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-2xl space-y-3 text-left hover:border-brand-orange/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center border border-brand-orange/20">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-white">Peças Consignadas</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Estoque completo de peças de marcas líderes (Cofap, NGK, Tecfil, D.I.D, Mobil) sem precisar desembolsar capital.
            </p>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-2xl space-y-3 text-left hover:border-brand-orange/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center border border-brand-orange/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base text-white">Despacho Estilo Uber</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Chamados de socorro e agendamentos entregues direto no tablet por geolocalização.
            </p>
          </div>
        </div>
      </section>

      {/* 4. SIMULADOR INTERATIVO DE GANHOS */}
      <section className="py-16 px-4 max-w-7xl mx-auto border-b border-zinc-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="text-xs bg-brand-orange/10 text-brand-orange font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-brand-orange/20 inline-block">
              Simulador Financeiro
            </span>

            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Quanto eu posso faturar operando a MyOttoVan?
            </h2>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Ajuste a quantidade de atendimentos diários e os dias trabalhados na semana para simular sua margem líquida média mensal.
            </p>

            <div className="space-y-6 bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-zinc-300">
                  <span>Atendimentos por dia</span>
                  <span className="text-brand-orange font-black text-sm">{jobsPerDay} reparos/dia</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={jobsPerDay}
                  onChange={(e) => setJobsPerDay(parseInt(e.target.value))}
                  className="w-full accent-brand-orange bg-zinc-950 h-2.5 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                  <span>1 serviço (ritmo leve)</span>
                  <span>10 serviços (alta produtividade)</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-zinc-300">
                  <span>Dias trabalhados por semana</span>
                  <span className="text-brand-orange font-black text-sm">{daysPerWeek} dias/semana</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="7"
                  step="1"
                  value={daysPerWeek}
                  onChange={(e) => setDaysPerWeek(parseInt(e.target.value))}
                  className="w-full accent-brand-orange bg-zinc-950 h-2.5 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                  <span>1 dia</span>
                  <span>7 dias (escala cheia)</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 text-[11px] text-zinc-400">
              <Info className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                💡 <strong>Entendimento do Cálculo:</strong> Considerando a taxa média de R$ 75,00 líquidos por job concluído, realizando <strong>{jobsPerDay} serviços/dia</strong> e descansando <strong>{7 - daysPerWeek} dias/semana</strong>, seu faturamento ultrapassa o ganho de mecânicos sob regime CLT fixo!
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 bg-gradient-to-br from-zinc-900 via-zinc-950 to-brand-orange/10 border border-zinc-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <span className="text-[10px] bg-brand-orange/10 text-brand-orange font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-brand-orange/20 inline-block">
              Rendimento Mensal Estimado
            </span>

            <div className="space-y-1">
              <p className="text-[11px] text-zinc-400 uppercase font-black tracking-wider">Faturamento Líquido Estimado</p>
              <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight font-sans drop-shadow">
                R$ {calculateEarnings().toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <p className="text-[10px] text-emerald-400 font-mono font-bold">✓ Livre de Aluguel de Ponto Comercial</p>
            </div>

            <div className="bg-zinc-950/60 p-4 rounded-2xl border border-zinc-850 text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-500">Média de jobs semanais:</span>
                <strong className="text-zinc-200">{jobsPerDay * daysPerWeek} atendimentos</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Média de jobs mensais:</span>
                <strong className="text-zinc-200">{Math.round(jobsPerDay * daysPerWeek * 4.34)} atendimentos</strong>
              </div>
            </div>

            <button
              onClick={() => scrollToAuth('register')}
              className="w-full bg-brand-orange hover:bg-brand-orange-hover text-black font-extrabold py-3.5 px-4 rounded-xl text-center text-xs transition-all shadow-lg hover:scale-[1.01] cursor-pointer uppercase tracking-wider"
            >
              🚀 Iniciar Minha Candidatura MEI
            </button>
          </div>
        </div>
      </section>

      {/* 5. ESTRUTURA TECNOLÓGICA DA VAN */}
      <section className="py-16 px-4 max-w-7xl mx-auto border-b border-zinc-900">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6 shadow-2xl relative overflow-hidden text-left">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-brand-orange rounded-full animate-ping"></span>
                <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-300">
                  ESTRUTURA TECNOLÓGICA DA MYOTTOVAN #02
                </h4>
              </div>
              <span className="text-[10px] font-mono bg-zinc-950 px-2 py-0.5 rounded text-zinc-500">Campinas SP</span>
            </div>

            <div className="space-y-4">
              <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-800 text-xs flex gap-3 items-start">
                <div className="w-6 h-6 rounded bg-brand-orange/20 text-brand-orange flex items-center justify-center font-bold font-mono text-[11px] shrink-0">1</div>
                <div className="space-y-0.5">
                  <h5 className="font-extrabold text-white">Bancada de Serviços de Alta Densidade</h5>
                  <p className="text-[11px] text-zinc-400">Equipada com compressor pneumático de alta performance, morsa e suporte técnico.</p>
                </div>
              </div>

              <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-800 text-xs flex gap-3 items-start">
                <div className="w-6 h-6 rounded bg-brand-orange/20 text-brand-orange flex items-center justify-center font-bold font-mono text-[11px] shrink-0">2</div>
                <div className="space-y-0.5">
                  <h5 className="font-extrabold text-white">Câmera HD de Transmissão de Bancada</h5>
                  <p className="text-[11px] text-zinc-400">Transmite automaticamente o vídeo do diagnóstico e troca de peças em HD para a tela do app do cliente.</p>
                </div>
              </div>

              <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-800 text-xs flex gap-3 items-start">
                <div className="w-6 h-6 rounded bg-brand-orange/20 text-brand-orange flex items-center justify-center font-bold font-mono text-[11px] shrink-0">3</div>
                <div className="space-y-0.5">
                  <h5 className="font-extrabold text-white">Estoque Consignado Inteligente</h5>
                  <p className="text-[11px] text-zinc-400">Peças sobressalentes organizadas para reposição autônoma sem travar seu capital.</p>
                </div>
              </div>

              <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-800 text-xs flex gap-3 items-start">
                <div className="w-6 h-6 rounded bg-brand-orange/20 text-brand-orange flex items-center justify-center font-bold font-mono text-[11px] shrink-0">4</div>
                <div className="space-y-0.5">
                  <h5 className="font-extrabold text-white">Tablet de Navegação e Ordens de Serviço</h5>
                  <p className="text-[11px] text-zinc-400">Exibe rotas otimizadas com cálculo de tráfego, checklists digitais e chamados ativos.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 text-left">
            <span className="text-xs bg-brand-orange/10 text-brand-orange font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-brand-orange/20 inline-block">
              Modelo de Parceria MEI
            </span>
            
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-[1.1]">
              Seja o dono da sua rota. Opere a <span className="text-brand-orange">MyOttoVan.</span>
            </h2>
            
            <p className="text-zinc-300 text-sm leading-relaxed">
              A OttoMotos conecta mecânicos qualificados a uma frota de vans oficinas totalmente equipadas. Em vez de abrir uma loja física e arcar com reformas e aluguel comercial, você atende clientes prontos da sua região com respaldo tecnológico.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                <h5 className="font-black text-brand-orange text-xs uppercase tracking-wider mb-1">Custo Fixos Mínimos</h5>
                <p className="text-xs text-zinc-400 leading-normal">Livre-se de contas comerciais pesadas. A van é sua oficina autônoma móvel.</p>
              </div>
              
              <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                <h5 className="font-black text-brand-orange text-xs uppercase tracking-wider mb-1">Chamados em Tempo Real</h5>
                <p className="text-xs text-zinc-400 leading-normal">O app direciona os chamados por proximidade, reduzindo tempo gasto no trânsito.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SESSÃO DE AUTENTICAÇÃO E CADASTRO (FORMULÁRIOS) */}
      <section id="auth-form-section" className="py-16 px-4 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
          <span className="text-xs bg-brand-orange/10 text-brand-orange font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-brand-orange/20 inline-block">
            Portal de Acesso e Candidatura
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Acesse sua Conta ou Inscreva-se
          </h2>
          <p className="text-xs text-zinc-400">
            Se você já é um mecânico credenciado, faça o login. Se deseja se tornar parceiro, preencha o formulário de candidatura MEI.
          </p>
        </div>

        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="mx-auto w-full bg-white text-zinc-900 border border-zinc-200 rounded-3xl overflow-hidden shadow-2xl text-left transition-all duration-300 pt-6"
          style={{ maxWidth: activeTab === 'login' ? '480px' : '820px' }}
        >
          {!registerSuccess ? (
            <div>
              {/* BRANDING HEADER - MyOttoVan Style */}
              <div className="text-center space-y-1 pb-4 px-6">
                <h3 className="text-2xl font-black text-zinc-950 tracking-tight">MyOttoVan</h3>
                <p className="text-xs font-extrabold text-brand-orange tracking-tight">
                  "Seja o dono da sua rota e do seu sucesso"
                </p>
              </div>

              {/* TABS HEADER */}
              <div className="flex border-b border-zinc-200 bg-zinc-50 px-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className={`flex-1 py-3 text-xs sm:text-sm font-bold border-b-2 text-center transition-colors cursor-pointer ${
                    activeTab === 'login'
                      ? 'border-brand-orange text-brand-orange font-black'
                      : 'border-transparent text-zinc-400 hover:text-zinc-600'
                  }`}
                >
                  🔑 Fazer Login
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className={`flex-1 py-3 text-xs sm:text-sm font-bold border-b-2 text-center transition-colors cursor-pointer ${
                    activeTab === 'register'
                      ? 'border-brand-orange text-brand-orange font-black'
                      : 'border-transparent text-zinc-400 hover:text-zinc-600'
                  }`}
                >
                  📝 Cadastrar MEI
                </button>
              </div>

              {/* TAB CONTENT */}
              <div className="p-6 sm:p-8">
                <AnimatePresence mode="wait">
                  {activeTab === 'login' ? (
                    <motion.div
                      key="login-tab-content"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      {loginError && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-3.5 rounded-xl text-xs text-left font-semibold">
                          ⚠️ {loginError}
                        </div>
                      )}

                      <form onSubmit={handleLoginSubmit} className="space-y-4 text-left text-xs">
                        <div className="space-y-1">
                          <label className="text-zinc-600 block font-bold">
                            E-mail do Mecânico / ID Parceiro
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <input
                              type="email"
                              required
                              placeholder="ex: danilo@ottomotos.com"
                              value={loginEmail}
                              onChange={e => setLoginEmail(e.target.value)}
                              className="w-full bg-white border border-zinc-200 rounded-xl pl-11 pr-4 py-2.5 text-zinc-950 font-bold focus:outline-none focus:border-brand-orange transition-all placeholder:text-zinc-400"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label className="text-zinc-600 block font-bold">
                              Senha de Acesso
                            </label>
                            <a href="#esqueci" className="text-[10px] text-zinc-400 hover:text-brand-orange transition-colors">
                              Esqueceu a senha?
                            </a>
                          </div>
                          <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                            <input
                              type={showPassword ? 'text' : 'password'}
                              required
                              placeholder="••••••••"
                              value={loginPassword}
                              onChange={e => setLoginPassword(e.target.value)}
                              className="w-full bg-white border border-zinc-200 rounded-xl pl-11 pr-11 py-2.5 text-zinc-950 font-bold focus:outline-none focus:border-brand-orange transition-all placeholder:text-zinc-400"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isLoggingIn}
                          className="w-full bg-brand-orange hover:bg-brand-orange-hover text-black font-black py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer shadow-lg text-xs sm:text-sm uppercase tracking-wider"
                        >
                          {isLoggingIn ? (
                            <span>Autenticando na Rede...</span>
                          ) : (
                            <>
                              <span>Entrar no Painel Operacional</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </form>

                      {/* NOTA: A seção "Modo de Demonstração Técnico" foi totalmente removida conforme solicitado! */}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="register-tab-content"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-8"
                    >
                      <div className="text-left space-y-1">
                        <h3 className="text-lg font-black text-zinc-950 uppercase tracking-tight">Formulário de Candidatura MEI</h3>
                        <p className="text-xs text-zinc-500 leading-normal">
                          Preencha seus dados cadastrais técnicos e anexe fotos nítidas dos documentos para auditoria de segurança da rede OttoMotos.
                        </p>
                      </div>

                      <form onSubmit={handleRegisterSubmit} className="space-y-6 text-left text-xs">
                        {/* SECTION 1: DADOS PESSOAIS */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-black text-brand-orange uppercase tracking-wider border-b border-zinc-200 pb-1.5 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" /> 1. Dados Pessoais & Habilitação
                          </h4>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-zinc-500 block font-bold">Nome Completo</label>
                              <input
                                type="text"
                                required
                                placeholder="ex: Sandro de Souza Lima"
                                value={regName}
                                onChange={e => setRegName(e.target.value)}
                                className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2 text-zinc-950 font-bold focus:outline-none focus:border-brand-orange"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-zinc-500 block font-bold">E-mail Comercial</label>
                              <input
                                type="email"
                                required
                                placeholder="ex: sandro.mecanica@gmail.com"
                                value={regEmail}
                                onChange={e => setRegEmail(e.target.value)}
                                className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2 text-zinc-950 font-bold focus:outline-none focus:border-brand-orange"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-zinc-500 block font-bold">WhatsApp / Telefone</label>
                              <input
                                type="text"
                                required
                                placeholder="(19) 99812-4411"
                                value={regPhone}
                                onChange={e => setRegPhone(e.target.value)}
                                className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2 text-zinc-950 font-bold focus:outline-none focus:border-brand-orange"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-zinc-500 block font-bold">CPF do Titular</label>
                              <input
                                type="text"
                                required
                                placeholder="000.000.000-00"
                                value={regCpf}
                                onChange={e => setRegCpf(e.target.value)}
                                className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2 text-zinc-950 font-bold focus:outline-none focus:border-brand-orange"
                              />
                            </div>

                            <div className="space-y-1 sm:col-span-2">
                              <label className="text-zinc-500 block font-bold">Categoria da CNH</label>
                              <select
                                value={regCnh}
                                onChange={e => setRegCnh(e.target.value)}
                                className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2 text-zinc-950 font-bold focus:outline-none focus:border-brand-orange"
                              >
                                <option value="AB">Categoria AB (Moto & Carro - Recomendado)</option>
                                <option value="A">Categoria A (Apenas Moto)</option>
                                <option value="B">Categoria B (Apenas Carro/Van)</option>
                                <option value="C">Categoria C ou Superior</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* SECTION 2: REGISTRO MEI */}
                        <div className="space-y-4 pt-2">
                          <h4 className="text-xs font-black text-brand-orange uppercase tracking-wider border-b border-zinc-200 pb-1.5 flex items-center gap-1.5">
                            <Briefcase className="w-3.5 h-3.5" /> 2. Registro MEI (Pessoa Jurídica)
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-zinc-500 block font-bold">CNPJ do MEI</label>
                              <input
                                type="text"
                                required
                                placeholder="00.000.000/0001-00"
                                value={regCnpj}
                                onChange={e => setRegCnpj(e.target.value)}
                                className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2 text-zinc-950 font-bold focus:outline-none focus:border-brand-orange"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-zinc-500 block font-bold">Razão Social / Nome Fantasia MEI</label>
                              <input
                                type="text"
                                required
                                placeholder="ex: Sandro Reparos de Motocicletas ME"
                                value={regMeName}
                                onChange={e => setRegMeName(e.target.value)}
                                className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2 text-zinc-950 font-bold focus:outline-none focus:border-brand-orange"
                              />
                            </div>
                          </div>
                        </div>

                        {/* SECTION 3: EXPERIÊNCIA TÉCNICA */}
                        <div className="space-y-4 pt-2">
                          <h4 className="text-xs font-black text-brand-orange uppercase tracking-wider border-b border-zinc-200 pb-1.5 flex items-center gap-1.5">
                            <Wrench className="w-3.5 h-3.5" /> 3. Experiência de Oficina
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-zinc-500 block font-bold">Tempo de Experiência Ativa</label>
                              <select
                                value={regExp}
                                onChange={e => setRegExp(e.target.value)}
                                className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2 text-zinc-950 font-bold focus:outline-none focus:border-brand-orange"
                              >
                                <option value="1">1 a 2 anos</option>
                                <option value="3">3 a 5 anos</option>
                                <option value="5">Mais de 5 anos</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-zinc-500 block font-bold">Cursos ou Certificações (Opcional)</label>
                              <input
                                type="text"
                                placeholder="ex: SENAI Mecânica de Motos, Injeção Eletrônica Magneti Marelli"
                                value={regCerts}
                                onChange={e => setRegCerts(e.target.value)}
                                className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2 text-zinc-950 font-bold focus:outline-none focus:border-brand-orange"
                              />
                            </div>
                          </div>
                        </div>

                        {/* SECTION 4: DOCUMENTOS OBRIGATÓRIOS */}
                        <div className="space-y-4 pt-2">
                          <h4 className="text-xs font-black text-brand-orange uppercase tracking-wider border-b border-zinc-200 pb-1.5 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5" /> 4. Anexo de Documentos para Auditoria
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Doc 1: CNH */}
                            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="font-bold text-zinc-900 block">1. CNH Digital ou Foto *</span>
                                  <span className="text-[10px] text-zinc-500">Categoria A ou AB válida</span>
                                </div>
                                <span className="text-[9px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded">Obrigatório</span>
                              </div>

                              {documents.cnh ? (
                                <div className="bg-white p-2 rounded-xl border border-zinc-200 flex items-center justify-between text-[11px]">
                                  <div className="flex items-center gap-2 truncate">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <span className="font-bold text-zinc-800 truncate">{documents.cnh.name}</span>
                                  </div>
                                  <button type="button" onClick={() => removeDoc('cnh')} className="text-zinc-400 hover:text-red-500">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => mockFileSelection('cnh')}
                                  className="w-full py-2 bg-white hover:bg-zinc-100 border border-dashed border-zinc-300 rounded-xl text-zinc-600 font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                  <FileUp className="w-3.5 h-3.5 text-brand-orange" /> Anexar CNH
                                </button>
                              )}
                            </div>

                            {/* Doc 2: Antecedentes */}
                            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="font-bold text-zinc-900 block">2. Antecedentes Criminais *</span>
                                  <span className="text-[10px] text-zinc-500">Certidão Negativa Polícia Federal</span>
                                </div>
                                <span className="text-[9px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded">Obrigatório</span>
                              </div>

                              {documents.background ? (
                                <div className="bg-white p-2 rounded-xl border border-zinc-200 flex items-center justify-between text-[11px]">
                                  <div className="flex items-center gap-2 truncate">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <span className="font-bold text-zinc-800 truncate">{documents.background.name}</span>
                                  </div>
                                  <button type="button" onClick={() => removeDoc('background')} className="text-zinc-400 hover:text-red-500">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => mockFileSelection('background')}
                                  className="w-full py-2 bg-white hover:bg-zinc-100 border border-dashed border-zinc-300 rounded-xl text-zinc-600 font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                  <FileUp className="w-3.5 h-3.5 text-brand-orange" /> Anexar Certidão
                                </button>
                              )}
                            </div>

                            {/* Doc 3: Comprovante de Residência */}
                            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="font-bold text-zinc-900 block">3. Comprovante de Residência</span>
                                  <span className="text-[10px] text-zinc-500">Conta recente (até 90 dias)</span>
                                </div>
                                <span className="text-[9px] bg-zinc-200 text-zinc-600 font-bold px-1.5 py-0.5 rounded">Opcional</span>
                              </div>

                              {documents.residence ? (
                                <div className="bg-white p-2 rounded-xl border border-zinc-200 flex items-center justify-between text-[11px]">
                                  <div className="flex items-center gap-2 truncate">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <span className="font-bold text-zinc-800 truncate">{documents.residence.name}</span>
                                  </div>
                                  <button type="button" onClick={() => removeDoc('residence')} className="text-zinc-400 hover:text-red-500">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => mockFileSelection('residence')}
                                  className="w-full py-2 bg-white hover:bg-zinc-100 border border-dashed border-zinc-300 rounded-xl text-zinc-600 font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                  <FileUp className="w-3.5 h-3.5 text-brand-orange" /> Anexar Comprovante
                                </button>
                              )}
                            </div>

                            {/* Doc 4: Certificados */}
                            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="font-bold text-zinc-900 block">4. Certificados Cursos</span>
                                  <span className="text-[10px] text-zinc-500">Comprovação técnica extra</span>
                                </div>
                                <span className="text-[9px] bg-zinc-200 text-zinc-600 font-bold px-1.5 py-0.5 rounded">Opcional</span>
                              </div>

                              {documents.technical ? (
                                <div className="bg-white p-2 rounded-xl border border-zinc-200 flex items-center justify-between text-[11px]">
                                  <div className="flex items-center gap-2 truncate">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <span className="font-bold text-zinc-800 truncate">{documents.technical.name}</span>
                                  </div>
                                  <button type="button" onClick={() => removeDoc('technical')} className="text-zinc-400 hover:text-red-500">
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => mockFileSelection('technical')}
                                  className="w-full py-2 bg-white hover:bg-zinc-100 border border-dashed border-zinc-300 rounded-xl text-zinc-600 font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                  <FileUp className="w-3.5 h-3.5 text-brand-orange" /> Anexar Diploma/Certificado
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-brand-orange hover:bg-brand-orange-hover text-black font-black py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer shadow-lg text-xs sm:text-sm uppercase tracking-wider mt-6"
                        >
                          <span>Enviar Candidatura para Auditoria de Segurança</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            /* SUCCESS ONBOARDING PROTOCOL BOX */
            <div className="p-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl font-bold">
                ✓
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200 font-bold">
                  PROTOCOLO DE CANDIDATURA: {createdProtocol}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-zinc-950">
                  Candidatura Enviada com Sucesso!
                </h3>
                <p className="text-xs text-zinc-600 max-w-md mx-auto leading-relaxed">
                  Olá <strong>{createdCandidate?.name}</strong>, sua ficha foi registrada e enviada para o painel da equipe técnica da OttoMotos.
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-left space-y-2 max-w-lg mx-auto text-xs">
                <h4 className="font-extrabold text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-brand-orange" /> Próximos Passos de Homologação:
                </h4>
                <ul className="space-y-1.5 text-amber-800 text-[11px] list-disc list-inside">
                  <li>Nossa equipe efetuará a checagem da CNH e do MEI.</li>
                  <li>Entraremos em contato via WhatsApp no número {createdCandidate?.phone}.</li>
                  <li>Agendamento da vistoria presencial da sua MyOttoVan.</li>
                </ul>
              </div>

              <div className="pt-4 border-t border-zinc-200 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                <button
                  type="button"
                  onClick={handleInstantApprovalBypass}
                  className="w-full bg-brand-orange hover:bg-brand-orange-hover text-black font-extrabold py-3 px-4 rounded-xl text-xs transition-all shadow-md cursor-pointer uppercase tracking-wider"
                >
                  ⚡ Aprovação Instantânea (Modo Teste QA)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRegisterSuccess(false);
                    setActiveTab('login');
                  }}
                  className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold py-3 px-4 rounded-xl text-xs transition-all cursor-pointer"
                >
                  Voltar para Tela de Login
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </section>

      {/* 7. FAQ PARA MECÂNICOS */}
      <section className="py-16 px-4 max-w-4xl mx-auto border-t border-zinc-900">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs bg-brand-orange/10 text-brand-orange font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-brand-orange/20 inline-block">
            Tire Suas Dúvidas
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Perguntas Frequentes do Mecânico
          </h2>
        </div>

        <div className="space-y-3 text-left">
          {[
            {
              q: 'Preciso ter van própria para me tornar um mecânico parceiro?',
              a: 'Não. A MyOttoVan é fornecida no modelo de parceria/franquia móvel já equipada com compressor, morsa, bancada de serviço e câmera HD de monitoramento.'
            },
            {
              q: 'Quais são os requisitos mínimos para aprovação?',
              a: 'Você precisa ter CNH válida com Categoria AB ou A (moto e van), registro MEI ativo de manutenção de motocicletas e atestado de bons antecedentes criminais.'
            },
            {
              q: 'Como funciona o estoque de peças consignado?',
              a: 'A van já sai para a rua com estoque de óleos, filtros Tecfil, pastilhas TRW Varga e velas NGK. Você só paga pelas peças que utilizar ao concluir os serviços dos clientes.'
            },
            {
              q: 'Como e quando recebo pelos atendimentos efetuados?',
              a: 'Todos os valores das mãos de obra aprovadas são repassados diretamente para a sua conta bancária vinculada ao seu CNPJ MEI semanalmente com extrato transparente.'
            }
          ].map((faq, idx) => (
            <div
              key={idx}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4.5 text-left font-bold text-sm text-white flex justify-between items-center gap-4 cursor-pointer hover:text-brand-orange transition-colors"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-brand-orange shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
                )}
              </button>
              {openFaq === idx && (
                <div className="px-4.5 pb-4.5 text-xs text-zinc-300 leading-relaxed border-t border-zinc-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 8. FOOTER DA ÁREA DO MECÂNICO */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-10 px-4 text-center text-xs text-zinc-500 space-y-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-brand-orange text-black flex items-center justify-center font-bold text-xs">
              <Truck className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-white text-sm">MyOttoVan</span>
            <span className="text-[10px] text-zinc-600 font-mono">© 2026 OttoMotos Tecnologias para Mobilidade</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-zinc-400">
            <button onClick={onBackToLanding} className="hover:text-brand-orange transition-colors cursor-pointer">
              Portal Institucional
            </button>
            <span>•</span>
            <button onClick={() => scrollToAuth('login')} className="hover:text-brand-orange transition-colors cursor-pointer">
              Login Mecânico
            </button>
            <span>•</span>
            <button onClick={() => scrollToAuth('register')} className="hover:text-brand-orange transition-colors cursor-pointer">
              Seja um Parceiro
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
