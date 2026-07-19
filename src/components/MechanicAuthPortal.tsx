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
  EyeOff
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

  // Default demo mechanic
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

  // Handle Login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    if (!loginEmail || !loginPassword) {
      setLoginError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsLoggingIn(true);

    // Simulate database lookup delay
    setTimeout(() => {
      // Look for the demo mechanic or newly registered approved mechanic
      const found = demoMechanics.find(
        m => m.email.toLowerCase() === loginEmail.toLowerCase()
      );

      // Also search in approved mechanics list from localStorage
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
        // Fallback convenience: allow mock logins for testing with any password
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
          setLoginError('Credenciais não encontradas ou inválidas. Tente usar as credenciais de demonstração.');
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

  // Pre-configured mock files for convenience
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

  // Handle Register/Application submission
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!regName || !regEmail || !regPhone || !regCpf || !regCnpj || !regMeName) {
      alert('Por favor, preencha todos os campos obrigatórios do formulário.');
      return;
    }

    // Verify at least CNH and Background check are simulated
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

    // Save to pending list in localStorage
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

  // Instant demo-approval bypass for QA/convenience
  const handleInstantApprovalBypass = () => {
    if (!createdCandidate) return;

    // Save to approved mechanics in localStorage
    try {
      const savedApproved = localStorage.getItem('otto_approved_mechanics');
      let approvedArr = [];
      if (savedApproved) {
        approvedArr = JSON.parse(savedApproved);
      }
      approvedArr.unshift(createdCandidate);
      localStorage.setItem('otto_approved_mechanics', JSON.stringify(approvedArr));

      // Remove from pending
      const savedPending = localStorage.getItem('otto_pending_onboardings');
      if (savedPending) {
        const pendArr = JSON.parse(savedPending);
        const filtered = pendArr.filter((c: any) => c.id !== createdCandidate.id);
        localStorage.setItem('otto_pending_onboardings', JSON.stringify(filtered));
      }
    } catch (err) {
      console.error(err);
    }

    // Immediately log in
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
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans" id="mechanic-auth-container">
      {/* Background ambient accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-zinc-200/50 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full z-10 space-y-8 my-auto transition-all duration-300">
        {/* LOGO & HERO SECTION */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-zinc-200 rounded-full text-xs text-brand-orange font-bold uppercase tracking-wider shadow-sm">
            <Wrench className="w-3.5 h-3.5 animate-pulse" /> Expansão de Rede OttoMotos
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight font-sans">
            ÁREA DO <span className="text-brand-orange">MECÂNICO PARCEIRO</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-xl mx-auto">
            Seja dono do seu tempo operando uma unidade móvel de alta tecnologia (OttoVan) com faturamento recorrente de 70% a 85% do valor do serviço.
          </p>
        </div>

        {/* MAIN COMPONENT BOX */}
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="mx-auto w-full bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-xl text-left text-zinc-900 transition-all duration-300"
          style={{ maxWidth: activeTab === 'login' ? '460px' : '780px' }}
        >
          {!registerSuccess ? (
            <div>
              {/* TABS HEADER - MyOttomotos Style */}
              <div className="flex border-b border-zinc-200 bg-zinc-50/50 px-4 pt-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className={`flex-1 pb-3 text-xs sm:text-sm font-bold border-b-2 text-center transition-colors cursor-pointer ${
                    activeTab === 'login'
                      ? 'border-brand-orange text-brand-orange font-black'
                      : 'border-transparent text-zinc-400 hover:text-zinc-600'
                  }`}
                >
                  Fazer Login
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className={`flex-1 pb-3 text-xs sm:text-sm font-bold border-b-2 text-center transition-colors cursor-pointer ${
                    activeTab === 'register'
                      ? 'border-brand-orange text-brand-orange font-black'
                      : 'border-transparent text-zinc-400 hover:text-zinc-600'
                  }`}
                >
                  Ser Franqueado
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
                      <div className="text-center space-y-2 pb-2">
                        <h2 className="text-2xl font-black text-zinc-950 tracking-tight">OttoMotos Pro</h2>
                        <p className="text-sm font-extrabold text-brand-orange tracking-tight">
                          "Seja dono do seu tempo e da sua própria oficina móvel"
                        </p>
                      </div>

                      {loginError && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-3.5 rounded-xl text-xs text-left font-semibold">
                          ⚠️ {loginError}
                        </div>
                      )}

                      <form onSubmit={handleLoginSubmit} className="space-y-4 text-left text-xs">
                        <div className="space-y-1">
                          <label className="text-zinc-500 block font-bold">
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
                            <label className="text-zinc-500 block font-bold">
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

                      {/* QUICK DEMO ASSISTANCE BOX */}
                      <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-2xl text-left space-y-2">
                        <div className="flex items-center gap-1.5 text-xs text-brand-orange font-bold">
                          <Sparkles className="w-4 h-4" />
                          <span>Modo de Demonstração Técnico</span>
                        </div>
                        <p className="text-[11px] text-zinc-600 leading-relaxed font-sans">
                          Para testar a interface do tablet de bordo do mecânico (Estilo Uber, com controle de rotas, fotos de check-in, monitor de vídeo, e faturamento), utilize a credencial de demonstração:
                        </p>
                        <div className="p-3 bg-white rounded-xl border border-zinc-200 font-mono text-[10px] space-y-1 text-zinc-800">
                          <p><span className="text-zinc-400">E-mail:</span> <span className="text-zinc-700 font-bold">danilo@ottomotos.com</span></p>
                          <p><span className="text-zinc-400">Senha:</span> <span className="text-zinc-700 font-bold">qualquer senha</span></p>
                        </div>
                      </div>
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
                                onChange={e => {
                                  setRegName(e.target.value);
                                  if (!regMeName && e.target.value) {
                                    setRegMeName(`${e.target.value} Mecânica ME`);
                                  }
                                }}
                                className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-950 font-bold focus:outline-none focus:border-brand-orange transition-all placeholder:text-zinc-400"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-zinc-500 block font-bold">E-mail de Contato</label>
                              <input
                                type="email"
                                required
                                placeholder="ex: sandrosouza@gmail.com"
                                value={regEmail}
                                onChange={e => setRegEmail(e.target.value)}
                                className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-950 font-bold focus:outline-none focus:border-brand-orange transition-all placeholder:text-zinc-400"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-1">
                              <label className="text-zinc-500 block font-bold">WhatsApp (DDD + Celular)</label>
                              <input
                                type="tel"
                                required
                                placeholder="ex: (19) 99311-2288"
                                value={regPhone}
                                onChange={e => setRegPhone(e.target.value)}
                                className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-950 font-bold focus:outline-none focus:border-brand-orange transition-all placeholder:text-zinc-400"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-zinc-500 block font-bold">CPF do Titular</label>
                              <input
                                type="text"
                                required
                                placeholder="ex: 412.091.228-09"
                                value={regCpf}
                                onChange={e => setRegCpf(e.target.value)}
                                className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-950 font-bold focus:outline-none focus:border-brand-orange transition-all placeholder:text-zinc-400"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-zinc-500 block font-bold">Categoria da CNH</label>
                              <select
                                value={regCnh}
                                onChange={e => setRegCnh(e.target.value)}
                                className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-950 font-bold focus:outline-none focus:border-brand-orange transition-all"
                              >
                                <option value="A">Categoria A (Moto)</option>
                                <option value="AB">Categoria AB (Moto e Carro)</option>
                                <option value="B">Categoria B (Carro)</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* SECTION 2: DADOS EMPRESARIAIS (MEI) */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-black text-brand-orange uppercase tracking-wider border-b border-zinc-200 pb-1.5 flex items-center gap-1.5">
                            <Briefcase className="w-3.5 h-3.5" /> 2. CNPJ MEI do Parceiro
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-zinc-500 block font-bold">CNPJ (MEI)</label>
                              <input
                                type="text"
                                required
                                placeholder="ex: 44.512.102/0001-99"
                                value={regCnpj}
                                onChange={e => setRegCnpj(e.target.value)}
                                className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-950 font-bold focus:outline-none focus:border-brand-orange transition-all placeholder:text-zinc-400"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-zinc-500 block font-bold">Razão Social / Nome Fantasia</label>
                              <input
                                type="text"
                                required
                                placeholder="ex: Sandro de Souza Reparos ME"
                                value={regMeName}
                                onChange={e => setRegMeName(e.target.value)}
                                className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-950 font-bold focus:outline-none focus:border-brand-orange transition-all placeholder:text-zinc-400"
                              />
                            </div>
                          </div>
                        </div>

                        {/* SECTION 3: EXPERIÊNCIA */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-black text-brand-orange uppercase tracking-wider border-b border-zinc-200 pb-1.5 flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5" /> 3. Experiência Técnica & Cursos
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-1 sm:col-span-1">
                              <label className="text-zinc-500 block font-bold">Tempo como Mecânico</label>
                              <select
                                value={regExp}
                                onChange={e => setRegExp(e.target.value)}
                                className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-950 font-bold focus:outline-none focus:border-brand-orange transition-all"
                              >
                                <option value="1">Menos de 2 anos</option>
                                <option value="3">3 a 5 anos</option>
                                <option value="5">Mais de 5 anos</option>
                              </select>
                            </div>

                            <div className="space-y-1 sm:col-span-2">
                              <label className="text-zinc-500 block font-bold">Certificados Técnicos / Cursos Principais</label>
                              <input
                                type="text"
                                placeholder="ex: Senai Mecânica de Motos, Injeção Eletrônica Pro"
                                value={regCerts}
                                onChange={e => setRegCerts(e.target.value)}
                                className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-zinc-950 font-bold focus:outline-none focus:border-brand-orange transition-all placeholder:text-zinc-400"
                              />
                            </div>
                          </div>
                        </div>

                        {/* SECTION 4: DOCUMENT UPLOAD SIMULATOR */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-black text-brand-orange uppercase tracking-wider border-b border-zinc-200 pb-1.5 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5" /> 4. Envio de Arquivos Digitalizados (Simulado)
                          </h4>

                          <p className="text-[11px] text-zinc-500 leading-relaxed">
                            Clique nas áreas para simular o upload seguro e imediato dos seus documentos. Formatos aceitos: PDF, JPEG, PNG de até 10 MB.
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* DOC 1: CNH */}
                            <div className="bg-white border border-zinc-200 p-4 rounded-2xl space-y-3 relative overflow-hidden shadow-sm">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <IdCard className="w-5 h-5 text-zinc-400 shrink-0" />
                                  <div className="text-left">
                                    <span className="text-xs font-bold text-zinc-800 block">CNH Frente & Verso *</span>
                                    <span className="text-[9px] text-zinc-400 block font-mono">Obrigatório</span>
                                  </div>
                                </div>
                                {documents.cnh?.completed && (
                                  <span className="text-[9px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 rounded font-bold font-mono">
                                    OK
                                  </span>
                                )}
                              </div>

                              {!documents.cnh ? (
                                <button
                                  type="button"
                                  onClick={() => mockFileSelection('cnh')}
                                  className="w-full py-3 border border-dashed border-zinc-300 hover:border-brand-orange bg-zinc-50 hover:bg-zinc-100 rounded-xl flex items-center justify-center gap-1.5 text-[10px] uppercase font-bold text-zinc-500 hover:text-brand-orange transition-all cursor-pointer"
                                >
                                  <FileUp className="w-3.5 h-3.5" /> Selecionar CNH
                                </button>
                              ) : (
                                <div className="space-y-2 text-left font-mono text-[10px]">
                                  <div className="flex items-center justify-between bg-zinc-50 p-2.5 rounded-xl border border-zinc-200">
                                    <span className="truncate text-zinc-700 pr-2">{documents.cnh.name}</span>
                                    <button
                                      type="button"
                                      onClick={() => removeDoc('cnh')}
                                      className="text-red-500 hover:text-red-600 shrink-0 p-1 cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                  {documents.cnh.uploading && (
                                    <div className="space-y-1">
                                      <div className="h-1 bg-zinc-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-brand-orange transition-all duration-150" style={{ width: `${documents.cnh.progress}%` }}></div>
                                      </div>
                                      <span className="text-[9px] text-zinc-400">Enviando ({documents.cnh.progress}%)</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* DOC 2: BACKGROUND CHECK */}
                            <div className="bg-white border border-zinc-200 p-4 rounded-2xl space-y-3 relative overflow-hidden shadow-sm">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Shield className="w-5 h-5 text-zinc-400 shrink-0" />
                                  <div className="text-left">
                                    <span className="text-xs font-bold text-zinc-800 block">Antecedentes Criminais *</span>
                                    <span className="text-[9px] text-zinc-400 block font-mono">Obrigatório</span>
                                  </div>
                                </div>
                                {documents.background?.completed && (
                                  <span className="text-[9px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 rounded font-bold font-mono">
                                    OK
                                  </span>
                                )}
                              </div>

                              {!documents.background ? (
                                <button
                                  type="button"
                                  onClick={() => mockFileSelection('background')}
                                  className="w-full py-3 border border-dashed border-zinc-300 hover:border-brand-orange bg-zinc-50 hover:bg-zinc-100 rounded-xl flex items-center justify-center gap-1.5 text-[10px] uppercase font-bold text-zinc-500 hover:text-brand-orange transition-all cursor-pointer"
                                >
                                  <FileUp className="w-3.5 h-3.5" /> Selecionar Atestado
                                </button>
                              ) : (
                                <div className="space-y-2 text-left font-mono text-[10px]">
                                  <div className="flex items-center justify-between bg-zinc-50 p-2.5 rounded-xl border border-zinc-200">
                                    <span className="truncate text-zinc-700 pr-2">{documents.background.name}</span>
                                    <button
                                      type="button"
                                      onClick={() => removeDoc('background')}
                                      className="text-red-500 hover:text-red-600 shrink-0 p-1 cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                  {documents.background.uploading && (
                                    <div className="space-y-1">
                                      <div className="h-1 bg-zinc-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-brand-orange transition-all duration-150" style={{ width: `${documents.background.progress}%` }}></div>
                                      </div>
                                      <span className="text-[9px] text-zinc-400">Enviando ({documents.background.progress}%)</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* DOC 3: RESIDENCE */}
                            <div className="bg-white border border-zinc-200 p-4 rounded-2xl space-y-3 relative overflow-hidden shadow-sm">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <FileText className="w-5 h-5 text-zinc-400 shrink-0" />
                                  <div className="text-left">
                                    <span className="text-xs font-bold text-zinc-800 block">Comprovante de Endereço</span>
                                    <span className="text-[9px] text-zinc-400 block font-mono">Opcional</span>
                                  </div>
                                </div>
                                {documents.residence?.completed && (
                                  <span className="text-[9px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 rounded font-bold font-mono">
                                    OK
                                  </span>
                                )}
                              </div>

                              {!documents.residence ? (
                                <button
                                  type="button"
                                  onClick={() => mockFileSelection('residence')}
                                  className="w-full py-3 border border-dashed border-zinc-300 hover:border-brand-orange bg-zinc-50 hover:bg-zinc-100 rounded-xl flex items-center justify-center gap-1.5 text-[10px] uppercase font-bold text-zinc-500 hover:text-brand-orange transition-all cursor-pointer"
                                >
                                  <FileUp className="w-3.5 h-3.5" /> Selecionar Comprovante
                                </button>
                              ) : (
                                <div className="space-y-2 text-left font-mono text-[10px]">
                                  <div className="flex items-center justify-between bg-zinc-50 p-2.5 rounded-xl border border-zinc-200">
                                    <span className="truncate text-zinc-700 pr-2">{documents.residence.name}</span>
                                    <button
                                      type="button"
                                      onClick={() => removeDoc('residence')}
                                      className="text-red-500 hover:text-red-600 shrink-0 p-1 cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                  {documents.residence.uploading && (
                                    <div className="space-y-1">
                                      <div className="h-1 bg-zinc-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-brand-orange transition-all duration-150" style={{ width: `${documents.residence.progress}%` }}></div>
                                      </div>
                                      <span className="text-[9px] text-zinc-400">Enviando ({documents.residence.progress}%)</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* DOC 4: CERTIFICADOS */}
                            <div className="bg-white border border-zinc-200 p-4 rounded-2xl space-y-3 relative overflow-hidden shadow-sm">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Award className="w-5 h-5 text-zinc-400 shrink-0" />
                                  <div className="text-left">
                                    <span className="text-xs font-bold text-zinc-800 block">Certificados Técnicos</span>
                                    <span className="text-[9px] text-zinc-400 block font-mono">Altamente Recomendável</span>
                                  </div>
                                </div>
                                {documents.technical?.completed && (
                                  <span className="text-[9px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 rounded font-bold font-mono">
                                    OK
                                  </span>
                                )}
                              </div>

                              {!documents.technical ? (
                                <button
                                  type="button"
                                  onClick={() => mockFileSelection('technical')}
                                  className="w-full py-3 border border-dashed border-zinc-300 hover:border-brand-orange bg-zinc-50 hover:bg-zinc-100 rounded-xl flex items-center justify-center gap-1.5 text-[10px] uppercase font-bold text-zinc-500 hover:text-brand-orange transition-all cursor-pointer"
                                >
                                  <FileUp className="w-3.5 h-3.5" /> Selecionar Certificado
                                </button>
                              ) : (
                                <div className="space-y-2 text-left font-mono text-[10px]">
                                  <div className="flex items-center justify-between bg-zinc-50 p-2.5 rounded-xl border border-zinc-200">
                                    <span className="truncate text-zinc-700 pr-2">{documents.technical.name}</span>
                                    <button
                                      type="button"
                                      onClick={() => removeDoc('technical')}
                                      className="text-red-500 hover:text-red-600 shrink-0 p-1 cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                  {documents.technical.uploading && (
                                    <div className="space-y-1">
                                      <div className="h-1 bg-zinc-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-brand-orange transition-all duration-150" style={{ width: `${documents.technical.progress}%` }}></div>
                                      </div>
                                      <span className="text-[9px] text-zinc-400">Enviando ({documents.technical.progress}%)</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-brand-orange hover:bg-brand-orange-hover text-black font-black py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer shadow-lg text-xs sm:text-sm uppercase tracking-wider mt-4"
                        >
                          <span>Submeter Cadastro & Documentos</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            /* REGISTRATION CANDIDACY RECEIVED SUCCESS SCREEN - Light Theme style */
            <motion.div
              key="registration-success"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 sm:p-12 text-center space-y-8 text-zinc-900"
            >
              <div className="inline-flex w-16 h-16 rounded-full bg-emerald-100 border border-emerald-200 items-center justify-center text-emerald-600 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl font-black text-zinc-950 uppercase tracking-tight">Candidatura Recebida! 🚀</h2>
                <p className="text-xs sm:text-sm text-zinc-500 max-w-lg mx-auto leading-relaxed">
                  Seus dados e documentos digitais foram salvos com sucesso e enviados para a fila técnica da expansão de rede. Veja abaixo o seu protocolo e andamento.
                </p>
              </div>

              {/* PROTOCOL CODE CARD */}
              <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-2xl max-w-md mx-auto text-center space-y-1.5 font-mono shadow-inner">
                <span className="text-[10px] text-zinc-400 block uppercase tracking-wider font-bold">Protocolo de Registro Unificado</span>
                <span className="text-base font-black text-brand-orange tracking-wider block">{createdProtocol}</span>
                <span className="text-[9px] text-zinc-500 block leading-normal">
                  Nome: {regName} • CNPJ: {regCnpj}
                </span>
              </div>

              {/* OPERATIONAL TRACKING PIPELINE MAP */}
              <div className="max-w-xl mx-auto space-y-4 pt-2">
                <h4 className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold text-left">Pipeline de Ativação do Franqueado</h4>
                
                <div className="space-y-3 text-left text-xs">
                  {/* Step 1 */}
                  <div className="flex gap-3 items-start">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-black flex items-center justify-center shrink-0">1</span>
                    <div>
                      <h5 className="font-bold text-zinc-900">Inscrição de Candidatura & MEI Recebidos</h5>
                      <p className="text-[10px] text-zinc-500">Completo • Formulário e documentos CNH, MEI e ficha de antecedentes criados e indexados.</p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-3 items-start">
                    <span className="w-5 h-5 rounded-full bg-brand-orange text-white text-[10px] font-black flex items-center justify-center shrink-0 animate-pulse">2</span>
                    <div>
                      <h5 className="font-bold text-brand-orange flex items-center gap-1.5">
                        <span>Análise Técnica Master de Documentos</span>
                        <span className="w-1.5 h-1.5 bg-brand-orange rounded-full animate-ping"></span>
                      </h5>
                      <p className="text-[10px] text-zinc-600 font-semibold">Em Auditoria • Nossa equipe administrativa está validando a CNH e a certidão criminal.</p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-3 items-start opacity-50">
                    <span className="w-5 h-5 rounded-full bg-zinc-200 text-zinc-500 text-[10px] font-black flex items-center justify-center shrink-0">3</span>
                    <div>
                      <h5 className="font-bold text-zinc-700">Triagem Prática & Prova Diagnóstica</h5>
                      <p className="text-[10px] text-zinc-400">Pendente • Agendamento de teste prático presencial com motocicletas reais na van.</p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex gap-3 items-start opacity-50">
                    <span className="w-5 h-5 rounded-full bg-zinc-200 text-zinc-500 text-[10px] font-black flex items-center justify-center shrink-0">4</span>
                    <div>
                      <h5 className="font-bold text-zinc-700">Entrega de OttoVan & Ativação de Sinal</h5>
                      <p className="text-[10px] text-zinc-400">Pendente • Retirada do furgão-oficina mobiliado e ativação do tablet operacional.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* DEMO BYPASS FOR QA TESTING */}
              <div className="bg-brand-orange/5 border border-brand-orange/20 p-5 rounded-2xl max-w-lg mx-auto text-left space-y-4 shadow-sm">
                <div className="flex items-center gap-1.5 text-xs text-brand-orange font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Testando como Desenvolvedor ou Administrador?</span>
                </div>
                <p className="text-[11px] text-zinc-600 leading-relaxed font-sans">
                  Sua candidatura foi salva na lista de aguardando onboarding! Você pode abrir o <strong>Painel Administrativo (Admin Portal)</strong> na barra de navegação superior para ver seu nome lá e aprová-lo manualmente. 
                </p>
                <p className="text-[11px] text-zinc-600 leading-relaxed font-sans">
                  Ou, se preferir ver o tablet de bordo agora, use o botão de atalho de simulação abaixo para <strong>aprovar imediatamente</strong> e logar como si mesmo:
                </p>

                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <button
                    onClick={handleInstantApprovalBypass}
                    className="flex-1 bg-brand-orange hover:bg-brand-orange-hover text-black font-black py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all hover:scale-[1.01] flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <span>Aprovar & Entrar com {regName.split(' ')[0]}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setRegisterSuccess(false);
                      setActiveTab('login');
                    }}
                    className="bg-white hover:bg-zinc-100 text-zinc-600 border border-zinc-200 py-2.5 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm"
                  >
                    Voltar para Login
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* BOTTOM NAV BAR ACCESS BUTTON */}
        <div className="text-center">
          <button
            onClick={onBackToLanding}
            className="text-zinc-400 hover:text-brand-orange text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            ← Voltar para a Página Principal de Clientes
          </button>
        </div>
      </div>
    </div>
  );
}
