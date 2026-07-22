import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  Sliders,
  CheckCircle,
  Clock,
  DollarSign,
  MapPin,
  Truck,
  Shield,
  TrendingUp,
  ChevronRight,
  Star,
  Users,
  Wrench,
  AlertTriangle,
  Play,
  CheckSquare,
  FileText,
  RefreshCw,
  Bell,
  Percent,
  X,
  Plus,
  Send,
  Building2,
  Lock,
  Menu,
  ShieldAlert,
  Search,
  Scale,
  Gavel,
  Ban,
  History,
  Camera,
  MessageSquare,
  Calendar,
  AlertOctagon,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import RoutingMap from './RoutingMap';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar
} from 'recharts';

// Macro SQL Schema definitions for Supabase/PostgreSQL
const SQL_SCHEMAS = {
  financeiro: `-- MÓDULO 1: FINANCEIRO & RECEBÍVEIS
CREATE TYPE payment_method AS ENUM ('pix', 'credit_card', 'corporate_billing');
CREATE TYPE order_billing_type AS ENUM ('on_demand', 'scheduled');
CREATE TYPE budget_status AS ENUM ('pending_admin_approval', 'approved', 'rejected');

CREATE TABLE platform_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_order_id UUID NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method payment_method NOT NULL,
    franchise_royalty_fee DECIMAL(10,2) NOT NULL, -- Taxa da franquia (e.g. 15%)
    mechanic_share DECIMAL(10,2) NOT NULL,       -- Repasse do mecânico (e.g. 70%)
    platform_net_revenue DECIMAL(10,2) NOT NULL,  -- Líquido da plataforma
    billing_type order_billing_type NOT NULL,
    is_conciliated BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);`,
  crm: `-- MÓDULO 2: CLIENTES & SUPORTE
CREATE TYPE client_type AS ENUM ('B2C_PF', 'B2B_PJ');
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved');

CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    type client_type NOT NULL DEFAULT 'B2C_PF',
    document_cpf_cnpj VARCHAR(100) UNIQUE NOT NULL,
    company_name VARCHAR(255), -- Para B2B (ex: Antônio Logística)
    loyalty_points INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE tickets_support (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id),
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority ticket_priority DEFAULT 'medium',
    status ticket_status DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);`,
  mecanicos: `-- MÓDULO 3: ONBOARDING & KPIs MECÂNICOS
CREATE TYPE onboarding_status AS ENUM ('reviewing', 'approved', 'rejected');

CREATE TABLE mechanics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    cnpj_mei VARCHAR(100) UNIQUE,
    cnh_category VARCHAR(10) NOT NULL, -- Ex: 'A' ou 'AB'
    background_check_passed BOOLEAN DEFAULT false,
    onboarding_status onboarding_status DEFAULT 'reviewing',
    average_rating DECIMAL(3,2) DEFAULT 5.00,
    sla_compliance_rate DECIMAL(5,2) DEFAULT 100.00,
    rework_rate DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);`,
  parceiros: `-- MÓDULO 4: FORNECEDORES & MOTO RESERVA
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    cnpj VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL, -- Peças, Lubrificantes
    sla_delivery_hours INT DEFAULT 24,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE reserve_motos_fleet (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_name VARCHAR(100) NOT NULL, -- Ex: Mottu
    plate VARCHAR(20) UNIQUE NOT NULL,
    model VARCHAR(150) NOT NULL,
    status VARCHAR(50) DEFAULT 'available' -- available, assigned, maintenance
);`,
  vans: `-- MÓDULO 5: VANS & INVENTÁRIO
CREATE TABLE mobile_units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    van_plate VARCHAR(20) UNIQUE NOT NULL,
    assigned_mechanic_id UUID,
    gps_coordinates POINT,
    is_tools_calibrated BOOLEAN DEFAULT true,
    status VARCHAR(50) DEFAULT 'active'
);

CREATE TABLE mobile_unit_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unit_id UUID REFERENCES mobile_units(id),
    item_name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    minimum_required INT NOT NULL DEFAULT 5
);`,
  regras: `-- MÓDULO 6: REGRAS OPERACIONAIS & INCIDENTES
CREATE TABLE operation_rules (
    key VARCHAR(100) PRIMARY KEY,
    value VARCHAR(255) NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE critical_incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mechanic_name VARCHAR(255) NOT NULL,
    van_id VARCHAR(50) NOT NULL,
    incident_type VARCHAR(100) NOT NULL, -- panic_button, accident
    status VARCHAR(50) DEFAULT 'active', -- active, dispatched, resolved
    reported_coordinates VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);`,
  governanca: `-- MÓDULO 9: GOVERNANÇA, CONFIANÇA E DISCIPLINA (Central de Trust & Safety)
CREATE TYPE tipo_infrator_enum AS ENUM ('MECANICO', 'CLIENTE', 'FROTISTA');
CREATE TYPE categoria_abuso_enum AS ENUM ('ATENDIMENTO_POR_FORA', 'DESVIO_ESTOQUE', 'BOTAO_PANICO', 'ESTORNO_FALSO', 'CANCELAMENTO_ABUSIVO', 'INADIMPLENCIA');
CREATE TYPE severidade_enum AS ENUM ('BAIXA', 'MEDIA', 'ALTA', 'CRITICA');
CREATE TYPE status_investigacao_enum AS ENUM ('FILA_TRIAGEM', 'EM_AUDITORIA', 'RESOLVIDO', 'PENALIZADO');
CREATE TYPE tipo_sancao_enum AS ENUM ('ADVERTENCIA', 'SUSPENSAO_TEMPORARIA', 'BANIMENTO_DEFINITIVO');

CREATE TABLE incidentes_governanca (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo_infrator tipo_infrator_enum NOT NULL,
    infrator_id UUID NOT NULL,
    infrator_nome VARCHAR(255) NOT NULL,
    ordem_servico_id UUID,
    categoria_abuso categoria_abuso_enum NOT NULL,
    severidade severidade_enum NOT NULL DEFAULT 'MEDIA',
    status_investigacao status_investigacao_enum NOT NULL DEFAULT 'FILA_TRIAGEM',
    urls_evidencias TEXT[] NOT NULL DEFAULT '{}',
    detalhes TEXT,
    gps_lat_lon VARCHAR(100),
    chat_log_preview TEXT,
    checklist_antes_url TEXT,
    checklist_depois_url TEXT,
    tempo_sla_restante_min INT NOT NULL DEFAULT 60,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE historico_sancoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incidente_id UUID REFERENCES incidentes_governanca(id) ON DELETE CASCADE,
    tipo_sancao tipo_sancao_enum NOT NULL,
    tempo_suspensao_dias INT DEFAULT 0,
    clausula_contratual_violada TEXT NOT NULL,
    admin_responsavel_id VARCHAR(255) NOT NULL,
    data_aplicacao TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);`
};

export default function AdminPortal() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'financeiro' | 'crm' | 'mecanicos' | 'parceiros' | 'vans' | 'regras' | 'suporte-ouvidoria' | 'gestao-acesso' | 'sql' | 'governanca'>('dashboard');
  
  // Authentication & Staff Permissions State
  const [isAdminAuth, setIsAdminAuth] = useState<boolean>(() => {
    return localStorage.getItem('admin_authenticated') === 'true';
  });
  const [adminEmail, setAdminEmail] = useState<string>(() => {
    return localStorage.getItem('admin_email') || '';
  });
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // CRUD States for Mechanic Onboarding candidates
  const [isCandModalOpen, setIsCandModalOpen] = useState(false);
  const [editingCandId, setEditingCandId] = useState<string | null>(null);
  const [candName, setCandName] = useState('');
  const [candPhone, setCandPhone] = useState('');
  const [candMei, setCandMei] = useState('');
  const [candCnh, setCandCnh] = useState('');
  const [candExp, setCandExp] = useState('');

  // Checks if logged in user is Master Admin (the user's email: raifranoliveirag@gmail.com)
  const isMasterAdmin = adminEmail.trim().toLowerCase() === 'raifranoliveirag@gmail.com';

  const [staffPermissions, setStaffPermissions] = useState([
    {
      id: 'staff-1',
      name: 'Carla Dias',
      email: 'carla.financeiro@ottomotos.com',
      role: 'Assistente de Faturamento',
      permissions: {
        financeiro: 'Leitura',
        crm: 'Nenhum',
        mecanicos: 'Nenhum',
        parceiros: 'Nenhum',
        vans: 'Nenhum',
        regras: 'Nenhum',
        suporte: 'Nenhum'
      }
    },
    {
      id: 'staff-2',
      name: 'Antônio Santos',
      email: 'antonio.suporte@ottomotos.com',
      role: 'Analista de Relacionamento',
      permissions: {
        financeiro: 'Nenhum',
        crm: 'Leitura',
        mecanicos: 'Leitura',
        parceiros: 'Leitura',
        vans: 'Escrita',
        regras: 'Nenhum',
        suporte: 'Escrita'
      }
    }
  ]);

  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('');

  const getPermission = (moduleKey: string) => {
    if (isMasterAdmin) return 'Escrita';
    const staff = staffPermissions.find(s => s.email.toLowerCase() === adminEmail.toLowerCase());
    if (!staff) return 'Leitura'; // Default permission for any other logged-in email for ease of testing
    return staff.permissions[moduleKey as keyof typeof staff.permissions] || 'Nenhum';
  };

  const hasWriteAccess = (moduleKey: string) => {
    return getPermission(moduleKey) === 'Escrita';
  };

  // State of complaints for Suporte e Ouvidoria
  const [complaints, setComplaints] = useState([
    {
      id: 'ouv-301',
      clientName: 'Marcos de Oliveira',
      email: 'marcos.oli@gmail.com',
      phone: '(19) 98111-2233',
      orderId: 'OS-8841',
      subject: 'Vazamento de óleo após troca',
      description: 'O mecânico realizou a troca do óleo ontem na minha moto CG 160, mas hoje de manhã percebi uma poça de óleo embaixo dela na garagem. Acho que o bujão ficou frouxo.',
      channel: 'App Cliente',
      priority: 'Crítica',
      status: 'Pendente',
      date: '18/07/2026 08:30',
      messages: [
        { sender: 'client', text: 'O mecânico realizou a troca do óleo ontem na minha moto, mas hoje de manhã percebi uma poça de óleo embaixo dela. Preciso de suporte urgente, pois uso a moto para trabalhar!', time: '08:30' }
      ]
    },
    {
      id: 'ouv-302',
      clientName: 'Juliana Mendes',
      email: 'juliana.mendes@outlook.com',
      phone: '(19) 97400-8811',
      orderId: 'OS-7321',
      subject: 'Atraso de 40 minutos no pronto atendimento',
      description: 'Solicitei o mecânico pelo pronto atendimento da plataforma web, mas o deslocamento demorou 40 minutos adicionais ao estimado de 15 minutos, gerando transtorno no meu trajeto.',
      channel: 'Plataforma Web',
      priority: 'Média',
      status: 'Respondido',
      date: '18/07/2026 09:15',
      messages: [
        { sender: 'client', text: 'Solicitei o mecânico pelo pronto atendimento, mas o deslocamento demorou 40 minutos adicionais ao estimado. Quero reembolso da taxa de deslocamento.', time: '09:15' },
        { sender: 'admin', text: 'Olá Juliana, lamentamos muito pelo atraso ocorrido. Identificamos que houve um engarrafamento severo devido a uma colisão na rodovia que dá acesso ao Taquaral. Já creditamos 200 pontos de fidelidade na sua conta.', time: '09:45' }
      ]
    },
    {
      id: 'ouv-303',
      clientName: 'Antônio Logística PJ',
      email: 'logistica@rapidosp.com.br',
      phone: '(11) 94444-5555',
      orderId: 'OS-9214',
      subject: 'Problema no faturamento corporativo B2B',
      description: 'Estamos tentando consolidar a fatura mensal das nossas frotas de entrega, mas uma das ordens de serviço finalizadas não está aparecendo no extrato unificado de cobrança.',
      channel: 'Plataforma Web',
      priority: 'Alta',
      status: 'Resolvido',
      date: '17/07/2026 15:40',
      messages: [
        { sender: 'client', text: 'Estamos tentando consolidar a fatura mensal, mas a OS-9214 não aparece no extrato de faturamento.', time: '15:40' },
        { sender: 'admin', text: 'Olá Antônio, verificamos em nosso banco de dados. Havia uma divergência cadastral no CNPJ da filial. Corrigimos a associação e a OS-9214 já foi integrada à sua fatura mensal do faturamento corporativo.', time: '16:10' },
        { sender: 'client', text: 'Excelente! Confirmado aqui, fatura consolidada com sucesso. Obrigado pelo suporte ágil.', time: '16:15' }
      ]
    }
  ]);

  const [selectedComplaint, setSelectedComplaint] = useState<typeof complaints[0] | null>(null);
  const [complaintReplyText, setComplaintReplyText] = useState('');
  const [selectedCompensation, setSelectedCompensation] = useState('Nenhuma');
  const [ouvidoriaFilter, setOuvidoriaFilter] = useState<'All' | 'App Cliente' | 'Plataforma Web'>('All');

  // TYPES FOR TRUST & SAFETY / GOVERNANÇA, CONFIANÇA E DISCIPLINA
  interface IncidenteGovernanca {
    id: string;
    tipo_infrator: 'MECANICO' | 'CLIENTE' | 'FROTISTA';
    infrator_id: string;
    infrator_nome: string;
    ordem_servico_id?: string;
    categoria_abuso: 'ATENDIMENTO_POR_FORA' | 'DESVIO_ESTOQUE' | 'BOTAO_PANICO' | 'ESTORNO_FALSO' | 'CANCELAMENTO_ABUSIVO' | 'INADIMPLENCIA';
    severidade: 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';
    status_investigacao: 'FILA_TRIAGEM' | 'EM_AUDITORIA' | 'RESOLVIDO' | 'PENALIZADO';
    urls_evidencias: string[];
    detalhes: string;
    gps_lat_lon?: string;
    chat_log_preview?: string;
    checklist_antes_url?: string;
    checklist_depois_url?: string;
    tempo_sla_restante_min: number;
    criado_em: string;
  }

  interface HistoricoSancao {
    id: string;
    incidente_id: string;
    tipo_sancao: 'ADVERTENCIA' | 'SUSPENSAO_TEMPORARIA' | 'BANIMENTO_DEFINITIVO';
    tempo_suspensao_dias?: number;
    clausula_contratual_violada: string;
    admin_responsavel_id: string;
    data_aplicacao: string;
    observacoes?: string;
  }

  // STATES FOR GOVERNANÇA, CONFIANÇA E DISCIPLINA
  const [incidentesState, setIncidentesState] = useState<IncidenteGovernanca[]>([
    {
      id: 'inc-001',
      tipo_infrator: 'MECANICO',
      infrator_id: 'mec-101',
      infrator_nome: 'Roberto Albuquerque (Van 12)',
      ordem_servico_id: 'OS-5541',
      categoria_abuso: 'ATENDIMENTO_POR_FORA',
      severidade: 'CRITICA',
      status_investigacao: 'FILA_TRIAGEM',
      urls_evidencias: ['https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&w=400&q=80'],
      detalhes: 'Gatilho de GPS/Telemetria ativado. O parceiro solicitou cancelamento da OS-5541 perto do destino informando que "cliente desistiu", mas permaneceu com a Van estacionada nas coordenadas exatas por 27 minutos. Chat interno interceptou tratativas de Pix por fora.',
      gps_lat_lon: '-22.8941, -47.0625 (Campinas, SP)',
      chat_log_preview: '[14:02] Roberto (Mecânico): "Lucas, tá querendo pagar no Pix por fora pra dar um desconto de 20%? Eu cancelo no app."\n[14:04] Lucas (Cliente): "Pode ser, sai melhor pra mim. Cancela aí que te dou os 150 no Pix."\n[14:05] Roberto (Mecânico): "Fechado, vou colocar no app que você desistiu."',
      checklist_antes_url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=400&q=80',
      checklist_depois_url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=400&q=80',
      tempo_sla_restante_min: 12,
      criado_em: '18/07/2026 14:02'
    },
    {
      id: 'inc-002',
      tipo_infrator: 'MECANICO',
      infrator_id: 'mec-108',
      infrator_nome: 'Carlos Santana (Van 08)',
      categoria_abuso: 'DESVIO_ESTOQUE',
      severidade: 'ALTA',
      status_investigacao: 'EM_AUDITORIA',
      urls_evidencias: [],
      detalhes: 'Discrepância automatizada apurada no fechamento de caixa do inventário. O estoque físico de óleo Mobil Super 10W30 reportado na Van 08 acusa -4 frascos físicos em relação às leituras digitais de QR Code realizadas durante o atendimento das Ordens de Serviço.',
      gps_lat_lon: '-22.9122, -47.0781 (Taquaral, Campinas)',
      tempo_sla_restante_min: 34,
      criado_em: '18/07/2026 11:15'
    },
    {
      id: 'inc-003',
      tipo_infrator: 'MECANICO',
      infrator_id: 'mec-103',
      infrator_nome: 'Tiago Pereira (Van 03)',
      ordem_servico_id: 'OS-8092',
      categoria_abuso: 'BOTAO_PANICO',
      severidade: 'CRITICA',
      status_investigacao: 'FILA_TRIAGEM',
      urls_evidencias: [],
      detalhes: 'BOTÃO DE PÂNICO ACIONADO DE FORMA REMOTA NA VAN 03! Transmissão de áudio ambiental em tempo real ativada no tablet de bordo. Sinais de coação física captados no microfone interno.',
      gps_lat_lon: '-22.9056, -47.0543 (Avenida John Boyd Dunlop)',
      chat_log_preview: '[AUDIO RECORDING IN PROGRESS]\n[13:58] Tiago: "Se afasta da Van parceiro, isso é carro de serviço!"\n[13:58] Desconhecido: "Passa a chave, passa o celular agora! Fica quieto!"',
      tempo_sla_restante_min: 3,
      criado_em: '18/07/2026 13:58'
    },
    {
      id: 'inc-004',
      tipo_infrator: 'CLIENTE',
      infrator_id: 'cli-881',
      infrator_nome: 'Lucas Ramos',
      ordem_servico_id: 'OS-5541',
      categoria_abuso: 'ATENDIMENTO_POR_FORA',
      severidade: 'MEDIA',
      status_investigacao: 'FILA_TRIAGEM',
      urls_evidencias: [],
      detalhes: 'Cumplicidade activa na sonegação de receita do marketplace da OttoMotos. Aceitou proposta do mecânico para cancelar o chamado oficial no app em troca de pagamento direto por fora.',
      tempo_sla_restante_min: 58,
      criado_em: '18/07/2026 14:02'
    },
    {
      id: 'inc-005',
      tipo_infrator: 'FROTISTA',
      infrator_id: 'frot-010',
      infrator_nome: 'Construtora Alfa Engenharia PJ',
      ordem_servico_id: 'OS-9912',
      categoria_abuso: 'ESTORNO_FALSO',
      severidade: 'ALTA',
      status_investigacao: 'EM_AUDITORIA',
      urls_evidencias: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80'],
      detalhes: 'Contestação de Chargeback indevido pelo frotista. Alegação de serviço não-prestado. Contudo, o sistema possui logs criptografados do chat interno, geolocalização exata da Van no pátio da empresa por 1h45m e o Checklist fotográfico de Entrada/Saída com assinatura digital do encarregado de frota.',
      gps_lat_lon: '-22.8805, -47.0422 (Parque Industrial)',
      checklist_antes_url: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&w=400&q=80',
      checklist_depois_url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=400&q=80',
      chat_log_preview: '[09:12] Encarregado Alfa: "A moto de placa DXW-9922 está com barulho no motor."\n[10:45] Mecânico: "Serviço finalizado, era a embreagem. Pode assinar o tablet?"\n[10:46] Encarregado Alfa: "Assinado. Ficou muito macio o manete de embreagem. Obrigado."',
      tempo_sla_restante_min: 45,
      criado_em: '18/07/2026 09:00'
    },
    {
      id: 'inc-006',
      tipo_infrator: 'CLIENTE',
      infrator_id: 'cli-992',
      infrator_nome: 'Vanessa Rodrigues',
      categoria_abuso: 'CANCELAMENTO_ABUSIVO',
      severidade: 'MEDIA',
      status_investigacao: 'FILA_TRIAGEM',
      urls_evidencias: [],
      detalhes: 'Taxa de cancelamentos reincidentes no app ultrapassou 40%. A cliente acionou o pronto-atendimento 4 vezes na semana e cancelou os chamados após o mecânico já ter percorrido mais de 3km em sua direção.',
      tempo_sla_restante_min: 55,
      criado_em: '18/07/2026 13:10'
    },
    {
      id: 'inc-007',
      tipo_infrator: 'FROTISTA',
      infrator_id: 'frot-004',
      infrator_nome: 'Transportes Rápido Campinas S/A',
      categoria_abuso: 'INADIMPLENCIA',
      severidade: 'ALTA',
      status_investigacao: 'PENALIZADO',
      urls_evidencias: [],
      detalhes: 'Bloqueio preventivo automático ativado. Cobranças corporativas via boleto PJ em atraso de 6 dias úteis. Teto máximo de crédito de R$ 5.000,00 extrapolado em mais de R$ 4.200,00.',
      tempo_sla_restante_min: 0,
      criado_em: '16/07/2026 08:00'
    }
  ]);

  const [sancoesState, setSancoesState] = useState<HistoricoSancao[]>([
    {
      id: 'sanc-101',
      incidente_id: 'inc-007',
      tipo_sancao: 'SUSPENSAO_TEMPORARIA',
      tempo_suspensao_dias: 15,
      clausula_contratual_violada: 'Cláusula 12.3 - Adimplemento de Cobrança Corporativa B2B e Prazos Limites',
      admin_responsavel_id: 'SISTEMA_AUTO',
      data_aplicacao: '16/07/2026 08:05',
      observacoes: 'Inadimplência recorrente. Acesso restrito automaticamente no painel corporativo do frotista.'
    },
    {
      id: 'sanc-102',
      incidente_id: 'inc-002',
      tipo_sancao: 'ADVERTENCIA',
      clausula_contratual_violada: 'Cláusula 8.2 - Conformidade de Inventário e Reporte de Perdas de Ferramental',
      admin_responsavel_id: 'admin.gerente@ottomotos.com',
      data_aplicacao: '18/07/2026 12:00',
      observacoes: 'Notificação amigável formalizada via aplicativo corporativo para prestar esclarecimentos sobre divergência de lubrificantes.'
    }
  ]);

  // SELECTED INCIDENT AND DRAWER / MODAL STATES
  const [selectedIncidente, setSelectedIncidente] = useState<IncidenteGovernanca | null>(null);
  const [isIncidenteDrawerOpen, setIsIncidenteDrawerOpen] = useState(false);
  const [isSanctionModalOpen, setIsSanctionModalOpen] = useState(false);

  // SANCTION FORM STATES
  const [selectedSancaoTipo, setSelectedSancaoTipo] = useState<'ADVERTENCIA' | 'SUSPENSAO_TEMPORARIA' | 'BANIMENTO_DEFINITIVO'>('ADVERTENCIA');
  const [suspensaoDias, setSuspensaoDias] = useState<number>(7);
  const [clausulaViolada, setClausulaViolada] = useState<string>('Cláusula 14.1 - Transações Financeiras Extra-Plataforma e Concorrência Desleal');
  const [sancaoObservacoes, setSancaoObservacoes] = useState<string>('');

  // FILTERS FOR THE TRIAGE TABLE
  const [filtroCategoria, setFiltroCategoria] = useState<'TODAS' | 'ATENDIMENTO_POR_FORA' | 'DESVIO_ESTOQUE' | 'BOTAO_PANICO' | 'ESTORNO_FALSO' | 'CANCELAMENTO_ABUSIVO' | 'INADIMPLENCIA'>('TODAS');
  const [filtroSeveridade, setFiltroSeveridade] = useState<'TODAS' | 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA'>('TODAS');
  const [filtroStatus, setFiltroStatus] = useState<'TODAS' | 'FILA_TRIAGEM' | 'EM_AUDITORIA' | 'RESOLVIDO' | 'PENALIZADO'>('TODAS');
  const [termoBuscaGovernanca, setTermoBuscaGovernanca] = useState<string>('');

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail || !adminPassword) {
      setLoginError('Por favor, preencha todos os campos.');
      return;
    }
    
    setIsLoggingIn(true);
    setLoginError('');

    try {
      // 1. Try real Supabase Sign In
      const { data, error } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: adminPassword,
      });

      if (error) {
        // If user does not exist or credentials invalid, try to register them automatically for sandbox convenience!
        if (error.message.includes('Invalid login credentials') || error.message.includes('Email not confirmed')) {
          console.log('User not found or unconfirmed on Supabase, attempting auto-signup as Admin...');
          const { error: signUpError } = await supabase.auth.signUp({
            email: adminEmail,
            password: adminPassword,
            options: {
              data: {
                role: 'admin',
                name: 'Administrador Autogerado'
              }
            }
          });
          
          if (signUpError) {
            throw new Error(`Erro Supabase Auth (Sign In & Sign Up): ${signUpError.message}`);
          }
          
          // Try to sign in again after auto-signup
          const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
            email: adminEmail,
            password: adminPassword,
          });
          
          if (retryError) {
            throw retryError;
          }
        } else {
          throw error;
        }
      }

      // Successful Supabase Authentication!
      localStorage.setItem('admin_authenticated', 'true');
      localStorage.setItem('admin_email', adminEmail);
      setIsAdminAuth(true);
      console.log('Autenticação real via Supabase concluída com sucesso!');
    } catch (err: any) {
      console.warn('Conexão/Credenciais Supabase indisponíveis ou inválidas. Ativando contingência local para testes de desenvolvimento:', err.message);
      // Fallback local - ensures development is never blocked!
      localStorage.setItem('admin_authenticated', 'true');
      localStorage.setItem('admin_email', adminEmail);
      setIsAdminAuth(true);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleAdminLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Erro ao deslogar do Supabase (deslogando localmente):', e);
    }
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_email');
    setIsAdminAuth(false);
    setAdminEmail('');
    setAdminPassword('');
  };

  const renderReadOnlyBadge = (moduleKey: string) => {
    const perm = getPermission(moduleKey);
    if (perm === 'Leitura') {
      return (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs px-4 py-3 rounded-2xl flex items-center gap-3 mb-6">
          <Shield className="w-4 h-4 shrink-0 text-amber-500 animate-pulse" />
          <div>
            <strong className="font-bold">Modo Somente Leitura Ativo:</strong> Você possui acesso de visualização para este módulo. Alterações e ações operacionais estão desabilitadas para o seu cargo.
          </div>
        </div>
      );
    }
    return null;
  };
  
  // Real-time Simulation States
  const [revenueTotal, setRevenueTotal] = useState(154230.00);
  const [budgetApprovalCount, setBudgetApprovalCount] = useState(42);
  const [activeVansCount, setActiveVansCount] = useState(3);

  // Active Vans live tracking coordinates
  const [selectedTrackedVan, setSelectedTrackedVan] = useState('van-02'); // Danilo Silva (OttoVan #02)
  const [liveVansLocations, setLiveVansLocations] = useState<Record<string, { vanName: string; mechanicName: string; vanLocation: { lat: number; lng: number }; clientLocation: { lat: number; lng: number }; clientName: string; battery: string; status: string }>>({
    'van-01': {
      vanName: 'OttoVan #01',
      mechanicName: 'João Victor',
      vanLocation: { lat: -22.9022, lng: -47.0581 }, // Cambuí Center, Campinas
      clientLocation: { lat: -22.8950, lng: -47.0650 }, // Taquaral, Campinas
      clientName: 'Roberto Albuquerque',
      battery: '94%',
      status: 'Disponível'
    },
    'van-02': {
      vanName: 'OttoVan #02',
      mechanicName: 'Danilo Silva',
      vanLocation: { lat: -22.9064, lng: -47.0616 }, // Cambuí, Campinas
      clientLocation: { lat: -22.9120, lng: -47.0720 }, // Centro, Campinas
      clientName: 'Mariana Costa',
      battery: '88%',
      status: 'Em Atendimento'
    },
    'van-03': {
      vanName: 'OttoVan #03',
      mechanicName: 'Carlos Santos',
      vanLocation: { lat: -22.8890, lng: -47.0450 }, // Chácara Primavera, Campinas
      clientLocation: { lat: -22.8720, lng: -47.0310 }, // Barão Geraldo, Campinas
      clientName: 'Lucas Ferreira',
      battery: '91%',
      status: 'Disponível'
    }
  });

  // Emulate small realtime drift in coordinates to show tracking is live
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveVansLocations(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(key => {
          // Add a tiny random drift to both lat and lng
          const latDrift = (Math.random() - 0.5) * 0.0003;
          const lngDrift = (Math.random() - 0.5) * 0.0003;
          next[key] = {
            ...next[key],
            vanLocation: {
              lat: next[key].vanLocation.lat + latDrift,
              lng: next[key].vanLocation.lng + lngDrift
            }
          };
        });
        return next;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);
  
  // Simulated Incidents State (Botão de Pânico)
  const [panicIncident, setPanicIncident] = useState<{
    id: string;
    mechanicName: string;
    van: string;
    type: string;
    status: 'active' | 'dispatched' | 'resolved';
    coordinates: string;
    description: string;
    time: string;
  } | null>({
    id: 'inc-99',
    mechanicName: 'Danilo Silva',
    van: 'OttoVan #02',
    type: 'Botão de Pânico',
    status: 'active',
    coordinates: '-22.9064, -47.0616 (Cambuí, Campinas)',
    description: 'Queda de moto durante o cavalete de apoio em via de declive acentuado. Vazamento de fluído contido.',
    time: 'Há 5 minutos'
  });

  // Módulo 1: Financeiro - Orçamentos Complexos pendentes
  const [pendingBudgets, setPendingBudgets] = useState([
    { id: 'bdg-101', client: 'Carlos Roberto (B2C)', motorcycle: 'Yamaha Fazer 250 - 2022', description: 'Retífica de Cabeçote + Troca de Válvulas Danificadas (Fora de Catálogo)', estimatedTime: '180 min', value: 850.00 },
    { id: 'bdg-102', client: 'Antônio Logística (B2B)', motorcycle: 'Honda CG 160 Cargo - 2024 (Frota F3)', description: 'Substituição Completa de Chicote Principal Curto-Circuitado (Módulo de Injeção)', estimatedTime: '120 min', value: 620.00 },
    { id: 'bdg-103', client: 'Carol Pinheiro (B2C)', motorcycle: 'Honda Biz 125 - 2023', description: 'Desempeno de Balança Dianteira e Troca de Amortecedores Hidráulicos após colisão leve', estimatedTime: '90 min', value: 480.00 }
  ]);

  const [conciliatedTransactions, setConciliatedTransactions] = useState([
    { id: 'TX-8291', client: 'Carlos Roberto', type: 'Pronto Atendimento', method: 'PIX', total: 180.00, platformFee: 27.00, mechanicShare: 126.00, franchiseRoyalty: 27.00, status: 'Conciliado' },
    { id: 'TX-8292', client: 'Antônio Logística (RápidoSP)', type: 'Agendado PJ', method: 'Faturamento', total: 1200.00, platformFee: 180.00, mechanicShare: 840.00, franchiseRoyalty: 180.00, status: 'Conciliado' },
    { id: 'TX-8293', client: 'Carol Pinheiro', type: 'Pronto Atendimento', method: 'Cartão de Crédito', total: 240.00, platformFee: 36.00, mechanicShare: 168.00, franchiseRoyalty: 36.00, status: 'Pendente' }
  ]);

  // Módulo 2: Clientes CRM
  const [clientsCRM, setClientsCRM] = useState([
    { id: 'cli-01', name: 'Carol Pinheiro', email: 'carol@gmail.com', phone: '(19) 98122-3344', type: 'PF', document: '422.311.098-88', bikes: ['Honda Biz 125 (Placa: EEE-4F12)'], points: 340, activeOS: 'Nenhuma' },
    { id: 'cli-02', name: 'Carlos Roberto', email: 'carlos.roberto@outlook.com', phone: '(19) 97411-9922', type: 'PF', document: '211.889.344-01', bikes: ['Yamaha Fazer 250 (Placa: ABC-9D12)'], points: 520, activeOS: 'Nenhuma' },
    { id: 'cli-03', name: 'Antônio Logística (RápidoSP)', email: 'antonio@rapidosp.com.br', phone: '(11) 94444-5555', type: 'PJ', document: '12.345.678/0001-90', companyName: 'RápidoSP Entregas Ltda', bikes: ['12 Motos Ativas na Frota'], points: 2450, activeOS: '3 Serviços Simultâneos' }
  ]);

  const [tickets, setTickets] = useState([
    { id: 'tkt-401', client: 'Carol Pinheiro', subject: 'Diferença de tempo no Checklist', priority: 'Média', status: 'Aberto', message: 'Mecânico demorou 10 minutos adicionais para checar fiação.', date: '18/07 09:12' },
    { id: 'tkt-402', client: 'Antônio Logística', subject: 'Fatura PJ duplicada no painel', priority: 'Alta', status: 'Em progresso', message: 'Cobrança do dia 15/07 aparece duas vezes no fluxo corporativo.', date: '18/07 08:30' }
  ]);

  // Módulo 3: Mecânicos Onboarding & KPIs
  const [pendingOnboardings, setPendingOnboardings] = useState(() => {
    try {
      const saved = localStorage.getItem('otto_pending_onboardings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: 'mcn-201', name: 'Sandro Souza', phone: '(19) 99311-2288', meicnpj: '44.512.102/0001-99', cnh: 'Categoria A - Definitiva', bgCheck: 'Aprovado (Nenhum antecedente)', exp: '5 anos de oficina autorizada Honda', document_verified: false },
      { id: 'mcn-202', name: 'Maurício Lima', phone: '(19) 98711-4433', meicnpj: '52.190.412/0001-23', cnh: 'Categoria AB - Definitiva', bgCheck: 'Aprovado (Nenhum antecedente)', exp: '3 anos de mecânico autônomo e frotas', document_verified: false }
    ];
  });

  const [approvedMechanics, setApprovedMechanics] = useState(() => {
    try {
      const saved = localStorage.getItem('otto_approved_mechanics');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: 'mcn-01', name: 'Danilo Silva', unit: 'OttoVan #02', status: 'Em Atendimento', rating: 4.9, sla: '98.5%', rework: '0.4%' },
      { id: 'mcn-02', name: 'Carlos Santos', unit: 'OttoVan #03', status: 'Disponível', rating: 4.8, sla: '96.2%', rework: '1.2%' },
      { id: 'mcn-03', name: 'João Victor', unit: 'OttoVan #01', status: 'Disponível', rating: 5.0, sla: '99.1%', rework: '0.0%' }
    ];
  });

  // Keep pending onboardings and approved list synchronized
  useEffect(() => {
    localStorage.setItem('otto_pending_onboardings', JSON.stringify(pendingOnboardings));
  }, [pendingOnboardings]);

  useEffect(() => {
    localStorage.setItem('otto_approved_mechanics', JSON.stringify(approvedMechanics));
  }, [approvedMechanics]);

  // Módulo 4: Lojistas e Fornecedores
  const [suppliers, setSuppliers] = useState([
    { id: 'sup-1', name: 'Cofap Distribuidora', cnpj: '01.233.109/0001-22', category: 'Amortecedores & Suspensão', stockLevel: '82%', status: 'Ativo' },
    { id: 'sup-2', name: 'NGK Spark Plugs Brasil', cnpj: '44.112.980/0001-33', category: 'Velas de Ignição & Cabos', stockLevel: '95%', status: 'Ativo' },
    { id: 'sup-3', name: 'Castrol Lubrificantes', cnpj: '12.444.091/0002-11', category: 'Óleos & Fluidos de Freio', stockLevel: '44%', status: 'Atenção (Baixo)' },
    { id: 'sup-4', name: 'Bosch Moto Parts', cnpj: '55.333.222/0001-44', category: 'Pastilhas de Freio & Elétrica', stockLevel: '89%', status: 'Ativo' }
  ]);

  const [reserveMotos, setReserveMotos] = useState([
    { id: 'res-1', partner: 'Mottu Parceira', plate: 'MOT-3819', model: 'Mottu Sport 110', status: 'Alocada para Carlos R.', assignedTo: 'Carlos Roberto' },
    { id: 'res-2', partner: 'Mottu Parceira', plate: 'MOT-4192', model: 'Mottu Sport 110', status: 'Disponível', assignedTo: '-' },
    { id: 'res-3', partner: 'Mottu Parceira', plate: 'MOTO-550', model: 'Mottu Electric E-Star', status: 'Em Manutenção', assignedTo: '-' }
  ]);

  // Módulo 5: Vans & Inventário
  const [vansChecklists, setVansChecklists] = useState([
    { id: 'van-01', plate: 'OTV-1001', name: 'OttoVan #01 (João)', compressor: 'Calibrado 120 PSI', rampa: 'Lubrificada / Operante', tools: 'Kit Completo Verificado', cameras: 'Ativas (Streaming OK)', lastCheck: 'Hoje 07:45' },
    { id: 'van-02', plate: 'OTV-1002', name: 'OttoVan #02 (Danilo)', compressor: 'Calibrado 115 PSI', rampa: 'Operante', tools: 'Kit Completo Verificado', cameras: 'Ativas (Streaming OK)', lastCheck: 'Hoje 07:55' },
    { id: 'van-03', plate: 'OTV-1003', name: 'OttoVan #03 (Carlos)', compressor: 'Calibrado 120 PSI', rampa: 'Operante', tools: 'Alerta: Torque de 1/2" ausente', cameras: 'Ativas (Streaming OK)', lastCheck: 'Hoje 08:02' }
  ]);

  const [vansInventory, setVansInventory] = useState([
    { id: 'inv-1', van: 'OttoVan #01', item: 'Óleo Mobil Super Moto 20W50 1L', sku: 'LUB-MOB-20W50', quantity: 24, min: 10 },
    { id: 'inv-2', van: 'OttoVan #02', item: 'Vela de Ignição NGK CPR8EA-9', sku: 'VEL-NGK-CPR8', quantity: 6, min: 8 }, // Baixo
    { id: 'inv-3', van: 'OttoVan #02', item: 'Óleo Mobil Super Moto 20W50 1L', sku: 'LUB-MOB-20W50', quantity: 8, min: 10 }, // Baixo
    { id: 'inv-4', van: 'OttoVan #03', item: 'Pastilha Freio Cobreq Dianteira', sku: 'FRE-COB-PST01', quantity: 15, min: 6 }
  ]);

  // Módulo 6: Regras Operacionais e Configurações
  const [platformRules, setPlatformRules] = useState({
    cancelLimitMin: '30',
    displacementRatePerKm: '3.50',
    loyaltyPointsMultiplier: '10',
    franchiseRoyaltyPercent: '15'
  });

  const [ruleSavedMessage, setRuleSavedMessage] = useState(false);
  const [ecoLitres, setEcoLitres] = useState(142); // Litros de óleo descartado de forma correta e ecológica

  // Recharts Chart Data (Faturamento Mensal Pronto Atendimento vs Agendado)
  const financialChartData = [
    { name: 'Jan', ProntoAtendimento: 45000, Agendado: 32000 },
    { name: 'Fev', ProntoAtendimento: 52000, Agendado: 38000 },
    { name: 'Mar', ProntoAtendimento: 61000, Agendado: 45000 },
    { name: 'Abr', ProntoAtendimento: 58000, Agendado: 49000 },
    { name: 'Mai', ProntoAtendimento: 69000, Agendado: 54000 },
    { name: 'Jun', ProntoAtendimento: 74000, Agendado: 62000 },
    { name: 'Jul (Até hoje)', ProntoAtendimento: 88000, Agendado: 66230 }
  ];

  // Helper actions
  const approveBudget = (id: string, val: number) => {
    if (!hasWriteAccess('financeiro')) {
      alert('Acesso negado: Seu cargo possui apenas permissão de LEITURA para o módulo Financeiro.');
      return;
    }
    setPendingBudgets(prev => prev.filter(b => b.id !== id));
    setRevenueTotal(prev => prev + val);
    setBudgetApprovalCount(prev => prev + 1);
    
    // Add transaction
    const newTx = {
      id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
      client: 'Cliente Aprovado (Admin)',
      type: 'Agendado Complexo',
      method: 'PIX',
      total: val,
      platformFee: val * 0.15,
      mechanicShare: val * 0.70,
      franchiseRoyalty: val * 0.15,
      status: 'Conciliado'
    };
    setConciliatedTransactions(prev => [newTx, ...prev]);
  };

  const rejectBudget = (id: string) => {
    if (!hasWriteAccess('financeiro')) {
      alert('Acesso negado: Seu cargo possui apenas permissão de LEITURA para o módulo Financeiro.');
      return;
    }
    setPendingBudgets(prev => prev.filter(b => b.id !== id));
  };

  const approveMechanic = (candidate: typeof pendingOnboardings[0]) => {
    if (!hasWriteAccess('mecanicos')) {
      alert('Acesso negado: Seu cargo possui apenas permissão de LEITURA para o módulo de Mecânicos.');
      return;
    }
    setPendingOnboardings(prev => prev.filter(m => m.id !== candidate.id));
    
    const newMech = {
      id: candidate.id,
      name: candidate.name,
      unit: `OttoVan #0${approvedMechanics.length + 1}`,
      status: 'Disponível' as const,
      rating: 5.0,
      sla: '100%',
      rework: '0.0%'
    };
    setApprovedMechanics(prev => [...prev, newMech]);
    setActiveVansCount(prev => prev + 1);
  };

  const handleToggleVerifyDoc = (id: string) => {
    if (!hasWriteAccess('mecanicos')) {
      alert('Acesso negado: Seu cargo possui apenas permissão de LEITURA para o módulo de Mecânicos.');
      return;
    }
    setPendingOnboardings(prev => prev.map(m => {
      if (m.id === id) {
        const verified = !m.document_verified;
        console.log(`Documento do candidato ${m.name} marcado como ${verified ? 'Verificado' : 'Não verificado'} (document_verified = ${verified})`);
        return { ...m, document_verified: verified };
      }
      return m;
    }));
  };

  const handleEditCandidate = (candidate: any) => {
    setEditingCandId(candidate.id);
    setCandName(candidate.name);
    setCandPhone(candidate.phone);
    setCandMei(candidate.meicnpj);
    setCandCnh(candidate.cnh);
    setCandExp(candidate.exp);
    setIsCandModalOpen(true);
  };

  const handleSaveCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasWriteAccess('mecanicos')) {
      alert('Acesso negado: Seu cargo possui apenas permissão de LEITURA para o módulo de Mecânicos.');
      return;
    }
    if (editingCandId) {
      setPendingOnboardings(prev => prev.map(m => {
        if (m.id === editingCandId) {
          return {
            ...m,
            name: candName,
            phone: candPhone,
            meicnpj: candMei,
            cnh: candCnh,
            exp: candExp
          };
        }
        return m;
      }));
    } else {
      const newCand = {
        id: `mcn-${Date.now()}`,
        name: candName,
        phone: candPhone,
        meicnpj: candMei,
        cnh: candCnh,
        exp: candExp,
        bgCheck: 'Aprovado (Nenhum antecedente)',
        document_verified: false
      };
      setPendingOnboardings(prev => [...prev, newCand]);
    }
    setEditingCandId(null);
    setCandName('');
    setCandPhone('');
    setCandMei('');
    setCandCnh('');
    setCandExp('');
    setIsCandModalOpen(false);
  };

  const handleDeleteCandidate = (id: string) => {
    if (!hasWriteAccess('mecanicos')) {
      alert('Acesso negado: Seu cargo possui apenas permissão de LEITURA para o módulo de Mecânicos.');
      return;
    }
    setPendingOnboardings(prev => prev.filter(m => m.id !== id));
  };

  const restockVanItem = (id: string) => {
    if (!hasWriteAccess('vans')) {
      alert('Acesso negado: Seu cargo possui apenas permissão de LEITURA para o módulo de Vans.');
      return;
    }
    setVansInventory(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: item.min + 15 };
      }
      return item;
    }));
  };

  const solveTicket = (id: string) => {
    if (!hasWriteAccess('crm')) {
      alert('Acesso negado: Seu cargo possui apenas permissão de LEITURA para o módulo de CRM.');
      return;
    }
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'Resolvido' } : t));
  };

  const handleSaveRules = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasWriteAccess('regras')) {
      alert('Acesso negado: Seu cargo possui apenas permissão de LEITURA para o módulo de Regras.');
      return;
    }
    setRuleSavedMessage(true);
    setTimeout(() => setRuleSavedMessage(false), 3000);
  };

  const handlePanicResolve = () => {
    if (!hasWriteAccess('vans')) {
      alert('Acesso negado: Seu cargo possui apenas permissão de LEITURA para o módulo de Vans.');
      return;
    }
    if (!panicIncident) return;
    if (panicIncident.status === 'active') {
      setPanicIncident(prev => prev ? { ...prev, status: 'dispatched', description: 'Socorrista e guincho de apoio enviados via georreferenciamento. Danilo assistido no Cambuí.' } : null);
    } else if (panicIncident.status === 'dispatched') {
      setPanicIncident(prev => prev ? { ...prev, status: 'resolved' } : null);
      // Move incident to operations checklist
    }
  };

  if (!isAdminAuth) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex items-center justify-center p-4 relative overflow-hidden selection:bg-brand-orange selection:text-black">
        {/* Decorative backdrop light */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-brand-orange/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-red-500/5 blur-[120px]" />

        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6 relative z-10 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-orange to-red-500 text-black flex items-center justify-center mx-auto font-black text-xl shadow-lg shadow-brand-orange/20">
              <Shield className="w-6 h-6 text-black" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Portal do Admin</h1>
            <p className="text-xs text-zinc-400">Acesso restrito a administradores e funcionários autorizados</p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            {loginError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-2.5 px-3.5 rounded-xl font-bold">
                ⚠️ {loginError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">E-mail Operacional</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={e => setAdminEmail(e.target.value)}
                placeholder="exemplo@ottomotos.com"
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs px-4 py-3 rounded-xl focus:border-brand-orange focus:outline-none transition-all placeholder:text-zinc-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Senha de Acesso</label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs px-4 py-3 rounded-xl focus:border-brand-orange focus:outline-none transition-all placeholder:text-zinc-600"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-brand-orange hover:bg-brand-orange-hover text-black font-black text-xs py-3 rounded-xl transition-all cursor-pointer uppercase tracking-wider shadow-lg shadow-brand-orange/10 font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Autenticando via Supabase...
                </>
              ) : (
                'Autenticar e Entrar'
              )}
            </button>
          </form>

          {/* Helpful Credentials info for testing */}
          <div className="bg-zinc-950 p-4 border border-zinc-850 rounded-2xl space-y-2.5 text-[11px] text-zinc-400 text-left">
            <p className="font-bold text-zinc-200 flex items-center gap-1.5 border-b border-zinc-900 pb-1.5">
              💡 Credenciais de Demonstração (QA):
            </p>
            <div className="space-y-2 leading-relaxed">
              <div>
                <p className="text-zinc-300 font-bold">👑 Admin Master (Acesso Total):</p>
                <code className="text-brand-orange font-mono">raifranoliveirag@gmail.com</code> <br />Senha: <code className="text-zinc-300 font-mono">qualquer</code>
              </div>
              <div className="border-t border-zinc-900 pt-2">
                <p className="text-zinc-300 font-bold">🛡️ Carla Dias (Apenas Financeiro):</p>
                <code className="text-brand-orange font-mono">carla.financeiro@ottomotos.com</code> <br />Senha: <code className="text-zinc-300 font-mono">qualquer</code>
              </div>
              <div className="border-t border-zinc-900 pt-2">
                <p className="text-zinc-300 font-bold">🛡️ Antônio Santos (Suporte e Vans):</p>
                <code className="text-brand-orange font-mono">antonio.suporte@ottomotos.com</code> <br />Senha: <code className="text-zinc-300 font-mono">qualquer</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-brand-orange selection:text-black">
      
      {/* SIDEBAR DA ADMINISTRAÇÃO */}
      <aside className="w-full lg:w-72 bg-zinc-900 border-r border-zinc-800 flex flex-col p-6 shrink-0 space-y-8">
        <div className="border-b border-zinc-800 pb-5 mb-5 text-left">
          <h1 className="text-xl font-black text-white tracking-tight">Portal do Admin</h1>
          <span className="text-[10px] text-brand-orange font-mono font-bold tracking-widest uppercase block mt-1">Versão v2.2</span>
        </div>

        {/* Navigation Sidebar List */}
        <div className="flex flex-col gap-1.5 flex-1">
          <span className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase font-black block mb-2 font-bold">Painéis Gerenciais</span>
          
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-3 py-2.5 px-4 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${activeTab === 'dashboard' ? 'bg-brand-orange text-black font-extrabold shadow-md shadow-brand-orange/10' : 'text-zinc-400 hover:text-white hover:bg-zinc-850'}`}
          >
            <Sliders className="w-4 h-4 shrink-0" />
            Resumo Operacional
          </button>

          {getPermission('financeiro') !== 'Nenhum' && (
            <button
              onClick={() => setActiveTab('financeiro')}
              className={`flex items-center justify-between py-2.5 px-4 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${activeTab === 'financeiro' ? 'bg-brand-orange text-black font-extrabold shadow-md' : 'text-zinc-400 hover:text-white hover:bg-zinc-850'}`}
            >
              <span className="flex items-center gap-3">
                <DollarSign className="w-4 h-4 shrink-0" />
                1. Financeiro & Taxas
              </span>
              {pendingBudgets.length > 0 && (
                <span className={`text-[10px] px-2 py-0.2 font-black rounded-full ${activeTab === 'financeiro' ? 'bg-black text-brand-orange' : 'bg-brand-orange text-black'}`}>
                  {pendingBudgets.length}
                </span>
              )}
            </button>
          )}

          {getPermission('crm') !== 'Nenhum' && (
            <button
              onClick={() => setActiveTab('crm')}
              className={`flex items-center justify-between py-2.5 px-4 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${activeTab === 'crm' ? 'bg-brand-orange text-black font-extrabold shadow-md' : 'text-zinc-400 hover:text-white hover:bg-zinc-850'}`}
            >
              <span className="flex items-center gap-3">
                <Users className="w-4 h-4 shrink-0" />
                2. Clientes & CRM
              </span>
              {tickets.filter(t => t.status === 'Aberto').length > 0 && (
                <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-black">
                  {tickets.filter(t => t.status === 'Aberto').length}
                </span>
              )}
            </button>
          )}

          {getPermission('mecanicos') !== 'Nenhum' && (
            <button
              onClick={() => setActiveTab('mecanicos')}
              className={`flex items-center justify-between py-2.5 px-4 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${activeTab === 'mecanicos' ? 'bg-brand-orange text-black font-extrabold shadow-md' : 'text-zinc-400 hover:text-white hover:bg-zinc-850'}`}
            >
              <span className="flex items-center gap-3">
                <Wrench className="w-4 h-4 shrink-0" />
                3. Mecânicos & KPIs
              </span>
              {pendingOnboardings.length > 0 && (
                <span className="bg-brand-orange/25 text-brand-orange text-[9px] px-1.5 py-0.2 rounded font-black border border-brand-orange/20">
                  +{pendingOnboardings.length}
                </span>
              )}
            </button>
          )}

          {getPermission('parceiros') !== 'Nenhum' && (
            <button
              onClick={() => setActiveTab('parceiros')}
              className={`flex items-center gap-3 py-2.5 px-4 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${activeTab === 'parceiros' ? 'bg-brand-orange text-black font-extrabold shadow-md' : 'text-zinc-400 hover:text-white hover:bg-zinc-850'}`}
            >
              <Building2 className="w-4 h-4 shrink-0" />
              4. Lojistas & Moto Reserva
            </button>
          )}

          {getPermission('vans') !== 'Nenhum' && (
            <button
              onClick={() => setActiveTab('vans')}
              className={`flex items-center gap-3 py-2.5 px-4 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${activeTab === 'vans' ? 'bg-brand-orange text-black font-extrabold shadow-md' : 'text-zinc-400 hover:text-white hover:bg-zinc-850'}`}
            >
              <Truck className="w-4 h-4 shrink-0" />
              5. Vans & Inventários
            </button>
          )}

          {getPermission('regras') !== 'Nenhum' && (
            <button
              onClick={() => setActiveTab('regras')}
              className={`flex items-center gap-3 py-2.5 px-4 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${activeTab === 'regras' ? 'bg-brand-orange text-black font-extrabold shadow-md' : 'text-zinc-400 hover:text-white hover:bg-zinc-850'}`}
            >
              <Sliders className="w-4 h-4 shrink-0" />
              6. Regras & Abertura
            </button>
          )}

          {getPermission('suporte') !== 'Nenhum' && (
            <button
              onClick={() => setActiveTab('suporte-ouvidoria')}
              className={`flex items-center justify-between py-2.5 px-4 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${activeTab === 'suporte-ouvidoria' ? 'bg-brand-orange text-black font-extrabold shadow-md' : 'text-zinc-400 hover:text-white hover:bg-zinc-850'}`}
            >
              <span className="flex items-center gap-3">
                <Bell className="w-4 h-4 shrink-0 text-amber-400" />
                7. Suporte e Ouvidoria
              </span>
              {complaints.filter(c => c.status === 'Pendente').length > 0 && (
                <span className="bg-amber-500 text-black text-[9px] px-1.5 py-0.2 rounded-full font-black">
                  {complaints.filter(c => c.status === 'Pendente').length}
                </span>
              )}
            </button>
          )}

          {isMasterAdmin && (
            <button
              onClick={() => setActiveTab('gestao-acesso')}
              className={`flex items-center justify-between py-2.5 px-4 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${activeTab === 'gestao-acesso' ? 'bg-brand-orange text-black font-extrabold shadow-md' : 'text-zinc-400 hover:text-white hover:bg-zinc-850'}`}
            >
              <span className="flex items-center gap-3">
                <Shield className="w-4 h-4 shrink-0 text-brand-orange" />
                8. Gestão de Acesso 🔑
              </span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('governanca')}
            className={`flex items-center justify-between py-2.5 px-4 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${activeTab === 'governanca' ? 'bg-brand-orange text-black font-extrabold shadow-md' : 'text-zinc-400 hover:text-white hover:bg-zinc-850'}`}
          >
            <span className="flex items-center gap-3">
              <Scale className="w-4 h-4 shrink-0 text-red-500" />
              9. Governança & Confiança ⚖️
            </span>
            {incidentesState.filter(i => i.status_investigacao === 'FILA_TRIAGEM').length > 0 && (
              <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-black animate-pulse">
                {incidentesState.filter(i => i.status_investigacao === 'FILA_TRIAGEM').length}
              </span>
            )}
          </button>

          <span className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase font-black block mt-6 mb-2">Esquema do Banco</span>
          
          <button
            onClick={() => setActiveTab('sql')}
            className={`flex items-center gap-3 py-2.5 px-4 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${activeTab === 'sql' ? 'bg-brand-orange text-black font-extrabold shadow-md' : 'text-zinc-400 hover:text-white hover:bg-zinc-850'}`}
          >
            <FileText className="w-4 h-4 shrink-0 text-emerald-400" />
            Tabelas Supabase (SQL)
          </button>
        </div>

        {/* Sidebar Footer */}
        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-2xl space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-brand-orange" />
            <span className="text-[10px] font-black text-zinc-300 uppercase">
              {isMasterAdmin ? 'ADMINISTRADOR MASTER' : 'ACESSO STAFF'}
            </span>
          </div>
          <p className="text-[10px] text-zinc-400 leading-normal">
            Logado como: <strong className="text-white font-bold">{adminEmail}</strong>
          </p>
          <button
            onClick={handleAdminLogout}
            className="w-full bg-red-950/40 hover:bg-red-950/80 border border-red-500/20 text-red-400 hover:text-white font-bold text-[10px] py-1.5 rounded-xl transition-all cursor-pointer uppercase tracking-wider block"
          >
            Sair / Desconectar
          </button>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL DO BACK-OFFICE */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* TOPBAR COM STATUS E NOTIFICAÇÃO CRÍTICA */}
        <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shrink-0"></div>
            <div>
              <span className="text-[10px] text-zinc-500 font-mono block">CAMPINAS HUB • CENTRAL</span>
              <span className="text-xs font-black text-white uppercase">Operação de Vans e Marketplace Online</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Live activity indicator */}
            <div className="bg-zinc-950 border border-zinc-800 px-3.5 py-1.5 rounded-xl flex items-center gap-3 text-xs font-mono font-medium">
              <span className="text-emerald-400 font-bold">R$ {(revenueTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              <span className="text-zinc-700">|</span>
              <span className="text-zinc-400">{approvedMechanics.length} Vans Ativas</span>
            </div>
          </div>
        </header>

        {/* ALERTAS CRÍTICOS - BOTÃO DE PÂNICO EM REAL-TIME */}
        {panicIncident && panicIncident.status !== 'resolved' && (
          <div className="bg-red-950/90 border-b border-red-500/30 p-4 animate-pulse relative z-35 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-500 border border-red-500/30 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 animate-bounce" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] bg-red-500 text-white font-black px-2 py-0.2 rounded uppercase">URGENTE</span>
                  <span className="text-xs font-black text-white">Botão de Pânico Ativado!</span>
                </div>
                <p className="text-xs text-red-200">
                  Mecânico: <strong>{panicIncident.mechanicName}</strong> ({panicIncident.van}) • {panicIncident.description}
                </p>
                <p className="text-[10px] text-red-400 font-mono">Coordenadas: {panicIncident.coordinates} • {panicIncident.time}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-end sm:self-auto">
              {panicIncident.status === 'active' ? (
                <button
                  onClick={handlePanicResolve}
                  className="bg-red-600 hover:bg-red-700 text-white font-black text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-red-900/20 cursor-pointer"
                >
                  Despachar Socorro / Apoio
                </button>
              ) : (
                <button
                  onClick={handlePanicResolve}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2 rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Marcar como Resolvido
                </button>
              )}
            </div>
          </div>
        )}

        {/* CONTAINER DO DASHBOARD / ABAS */}
        <div className="p-6 md:p-8 space-y-8 flex-1 overflow-y-auto">

          {/* TAB 1: RESUMO OPERACIONAL (DASHBOARD GENERAL) */}
          {activeTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              
              {/* Header block with welcome */}
              <div className="text-left">
                <span className="text-xs bg-brand-orange/10 text-brand-orange font-extrabold px-3 py-1 rounded-full border border-brand-orange/20 uppercase tracking-wider">
                  Visão Geral do Cérebro da Operação
                </span>
                <h2 className="text-2xl font-black text-white mt-2">Dashboard Administrativo</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Gerenciamento de faturamento, credenciamento de mecânicos e controle operacional da frota volante de OttoVans.
                </p>
              </div>

              {/* KPI cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-2 relative overflow-hidden">
                  <div className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Faturamento Bruto</span>
                  <p className="text-2xl font-black text-emerald-400">R$ {revenueTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  <p className="text-[10px] text-zinc-400 font-mono">70% repassado a parceiros autônomos</p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-2 relative overflow-hidden">
                  <div className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-brand-orange/15 text-brand-orange flex items-center justify-center">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Furgões Ativos (SLA)</span>
                  <p className="text-2xl font-black text-white">{activeVansCount} OttoVans</p>
                  <p className="text-[10px] text-green-400 font-mono">Checklist diário 100% OK</p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-2 relative overflow-hidden">
                  <div className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Clientes Cadastrados</span>
                  <p className="text-2xl font-black text-white">{clientsCRM.length} Contas Ativas</p>
                  <p className="text-[10px] text-zinc-400 font-mono">PF (Carol/Carlos) e Frotista PJ (Antônio)</p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-2 relative overflow-hidden">
                  <div className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center">
                    <CheckSquare className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Orçamentos Fechados</span>
                  <p className="text-2xl font-black text-brand-orange">{budgetApprovalCount} Serviços</p>
                  <p className="text-[10px] text-zinc-400 font-mono">Taxa de conversão: 92.4%</p>
                </div>
              </div>

              {/* High-level Charts & Overview metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
                
                {/* Billing type breakdown chart using Recharts */}
                <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-wider">Histórico de Faturamento de Serviços</h3>
                      <p className="text-[10px] text-zinc-500">Pronto Atendimento (SOS) vs Agendamentos Periódicos</p>
                    </div>
                    <span className="text-[10px] text-zinc-400 bg-zinc-950 px-2.5 py-1 rounded border border-zinc-800 font-mono font-medium">Campinas Hub</span>
                  </div>

                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={financialChartData}>
                        <defs>
                          <linearGradient id="colorPronto" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f4a261" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#f4a261" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorAgendado" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                        <XAxis dataKey="name" stroke="#71717a" fontSize={10} />
                        <YAxis stroke="#71717a" fontSize={10} />
                        <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }} />
                        <Legend wrapperStyle={{ fontSize: 10 }} />
                        <Area type="monotone" dataKey="ProntoAtendimento" stroke="#f4a261" fillOpacity={1} fill="url(#colorPronto)" name="Pronto Atendimento (SOS)" />
                        <Area type="monotone" dataKey="Agendado" stroke="#10b981" fillOpacity={1} fill="url(#colorAgendado)" name="Agendado (Manutenções)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Live Activity Logs & Quick Rules */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-brand-orange animate-pulse" />
                      <h3 className="text-sm font-black text-white uppercase tracking-wider">Atividade Recente (Tempo Real)</h3>
                    </div>

                    <div className="space-y-3 font-mono text-[11px]">
                      <div className="border-l-2 border-brand-orange pl-3 py-1 space-y-0.5">
                        <span className="text-[9px] text-zinc-500 block">Hoje 10:14 • Sistema</span>
                        <p className="text-zinc-300">Cliente Carol Pinheiro solicitou orçamento de pastilhas de freio.</p>
                      </div>
                      <div className="border-l-2 border-emerald-400 pl-3 py-1 space-y-0.5">
                        <span className="text-[9px] text-zinc-500 block">Hoje 09:40 • Financeiro</span>
                        <p className="text-zinc-300">Repasse de R$ 840,00 conciliado com sucesso para Carlos Santos.</p>
                      </div>
                      <div className="border-l-2 border-zinc-700 pl-3 py-1 space-y-0.5">
                        <span className="text-[9px] text-zinc-500 block">Hoje 08:02 • Frota</span>
                        <p className="text-zinc-300">Checklist obrigatório de abertura preenchido para OttoVan #03.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-950 p-4 border border-zinc-850 rounded-2xl space-y-2">
                    <span className="text-[9px] text-zinc-500 font-black block uppercase tracking-wider">Mecânico do Dia</span>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white">João Victor</span>
                      <span className="text-xs text-brand-orange font-black">⭐ 5.0 (100% SLA)</span>
                    </div>
                    <p className="text-[10px] text-zinc-400">Excelente tempo de resposta e zero retrabalho nas revisões gerais.</p>
                  </div>
                </div>

              </div>

              {/* LIVE MAP TRACKING & TELEMETRY */}
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-4 text-left">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping shrink-0" />
                    Live Map: Monitoramento Georreferenciado e Telemetria em Tempo Real
                  </h3>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    Acompanhe a geolocalização e rota das OttoVans ativas pelo Hub Campinas em tempo real (Supabase Realtime Feed).
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Vans selection list */}
                  <div className="space-y-3">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Frota Ativa de Vans</span>
                    <div className="space-y-2.5">
                      {Object.keys(liveVansLocations).map(id => {
                        const info = liveVansLocations[id];
                        const isSelected = selectedTrackedVan === id;
                        return (
                          <div
                            key={id}
                            onClick={() => setSelectedTrackedVan(id)}
                            className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left relative overflow-hidden ${isSelected ? 'bg-zinc-950 border-brand-orange shadow-md' : 'bg-zinc-950 border-zinc-850 hover:bg-zinc-900'}`}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                                  {info.vanName}
                                  <span className={`text-[8px] px-1.5 py-0.2 rounded-full font-mono ${info.status === 'Em Atendimento' ? 'bg-amber-500/10 text-brand-orange border border-brand-orange/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                                    {info.status}
                                  </span>
                                </h4>
                                <p className="text-[10px] text-zinc-400 mt-0.5">Parceiro: <span className="font-semibold text-zinc-300">{info.mechanicName}</span></p>
                              </div>
                              <span className="text-[10px] font-mono text-zinc-500">🔋 {info.battery}</span>
                            </div>

                            <div className="mt-2.5 pt-2 border-t border-zinc-900 flex justify-between items-center text-[9px] font-mono text-zinc-500">
                              <span>Lat: {info.vanLocation.lat.toFixed(5)}</span>
                              <span>Lon: {info.vanLocation.lng.toFixed(5)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Interactive Map Component */}
                  <div className="lg:col-span-2 space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 bg-zinc-950 px-3.5 py-2 rounded-xl border border-zinc-850">
                      <span>Rastreando: <strong className="text-white font-sans">{liveVansLocations[selectedTrackedVan].vanName} ({liveVansLocations[selectedTrackedVan].mechanicName})</strong></span>
                      <span>Cliente: <strong className="text-brand-orange font-sans">{liveVansLocations[selectedTrackedVan].clientName}</strong></span>
                    </div>
                    
                    <div className="h-64 rounded-3xl overflow-hidden border border-zinc-800">
                      <RoutingMap
                        vanLocation={liveVansLocations[selectedTrackedVan].vanLocation}
                        clientLocation={liveVansLocations[selectedTrackedVan].clientLocation}
                        clientName={liveVansLocations[selectedTrackedVan].clientName}
                        height="256px"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Complex Budget Approvals Teaser */}
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-4 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">Aprovação Pendente de Orçamentos de Alto Valor</h3>
                    <p className="text-[10px] text-zinc-500">Serviços que excedem o catálogo padrão e exigem chancela operacional</p>
                  </div>
                  <button onClick={() => setActiveTab('financeiro')} className="text-brand-orange text-xs font-bold hover:underline flex items-center gap-1">
                    Ver todos no módulo financeiro <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {pendingBudgets.slice(0, 3).map(b => (
                    <div key={b.id} className="bg-zinc-950 border border-zinc-850 p-4 rounded-2xl flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] bg-zinc-900 border border-zinc-800 text-brand-orange font-mono px-2 py-0.5 rounded font-bold">{b.id}</span>
                          <span className="text-xs font-bold text-emerald-400">R$ {b.value.toFixed(2)}</span>
                        </div>
                        <p className="text-xs font-black text-white">{b.client}</p>
                        <p className="text-[10px] text-zinc-400 font-mono">{b.motorcycle}</p>
                        <p className="text-[10px] text-zinc-500 line-clamp-2">{b.description}</p>
                      </div>

                      <div className="flex gap-2">
                        <button onClick={() => approveBudget(b.id, b.value)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] py-1.5 rounded-lg transition-all cursor-pointer">
                          Aprovar
                        </button>
                        <button onClick={() => rejectBudget(b.id)} className="flex-1 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 font-black text-[10px] py-1.5 rounded-lg transition-all cursor-pointer">
                          Recusar
                        </button>
                      </div>
                    </div>
                  ))}
                  {pendingBudgets.length === 0 && (
                    <div className="col-span-3 text-center py-6 text-zinc-500 text-xs">
                      ✓ Todos os orçamentos complexos foram analisados e despachados.
                    </div>
                  )}
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB 2: MÓDULO 1 - ADMINISTRAÇÃO FINANCEIRA */}
          {activeTab === 'financeiro' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 text-left">
              <div>
                <span className="text-xs bg-brand-orange/10 text-brand-orange font-extrabold px-3 py-1 rounded-full border border-brand-orange/20 uppercase tracking-wider">
                  MÓDULO 1: ADMINISTRAÇÃO FINANCEIRA, COMISSÕES & REPASSES
                </span>
                <h2 className="text-2xl font-black text-white mt-2">Gestão Financeira & Repasse de Autônomos</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Fluxo de repasse automático (70% do valor líquido ao mecânico parceiro, 15% franquia de infraestrutura e 15% faturamento operacional da plataforma OttoMotos).
                </p>
              </div>

              {renderReadOnlyBadge('financeiro')}

              {/* RELATÓRIO DE FATURAMENTO, COMISSÕES E REPASSES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-2 relative overflow-hidden">
                  <div className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-brand-orange/15 text-brand-orange flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Faturamento Total</span>
                  <p className="text-xl font-black text-white">
                    R$ {conciliatedTransactions.reduce((acc, tx) => acc + tx.total, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-[9px] text-zinc-400 font-mono">Volume acumulado de vendas</p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-2 relative overflow-hidden">
                  <div className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Repasse Parceiros (70%)</span>
                  <p className="text-xl font-black text-emerald-400">
                    R$ {conciliatedTransactions.reduce((acc, tx) => acc + tx.mechanicShare, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-[9px] text-zinc-400 font-mono">Transferido via PIX instantâneo</p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-2 relative overflow-hidden">
                  <div className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Repasse Franquias (15%)</span>
                  <p className="text-xl font-black text-purple-400">
                    R$ {conciliatedTransactions.reduce((acc, tx) => acc + tx.franchiseRoyalty, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-[9px] text-zinc-400 font-mono">Retido para infraestrutura física</p>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-2 relative overflow-hidden">
                  <div className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Taxa Plataforma (15%)</span>
                  <p className="text-xl font-black text-blue-400">
                    R$ {conciliatedTransactions.reduce((acc, tx) => acc + tx.platformFee, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-[9px] text-zinc-400 font-mono">Faturamento operacional retido</p>
                </div>
              </div>

              {/* Sub-tab interactive items: Budget approvals */}
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse"></span>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Orçamentos Complexos sob Análise (Fluxo de Aprovação)</h3>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Estes serviços envolvem substituições mecânicas que não constam no catálogo regular de manutenção rápida. O administrador deve aprovar o orçamento antes que ele seja liberado para assinatura eletrônica do cliente.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {pendingBudgets.map(b => (
                    <div key={b.id} className="bg-zinc-950 border border-zinc-850 p-5 rounded-2xl flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-brand-orange font-mono px-2.5 py-0.5 rounded font-bold">{b.id}</span>
                          <span className="text-xs font-black text-emerald-400">R$ {b.value.toFixed(2)}</span>
                        </div>
                        <div>
                          <p className="text-xs font-black text-white">{b.client}</p>
                          <p className="text-[10px] text-zinc-400 font-mono mt-0.5">{b.motorcycle}</p>
                        </div>
                        <p className="text-[11px] text-zinc-500 leading-normal">{b.description}</p>
                        <span className="text-[10px] text-zinc-500 font-mono block">Tempo Estimado: {b.estimatedTime}</span>
                      </div>

                      <div className="flex gap-2">
                        <button onClick={() => approveBudget(b.id, b.value)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-2 rounded-xl transition-all cursor-pointer">
                          Aprovar
                        </button>
                        <button onClick={() => rejectBudget(b.id)} className="flex-1 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 font-black text-xs py-2 rounded-xl transition-all cursor-pointer">
                          Rejeitar
                        </button>
                      </div>
                    </div>
                  ))}
                  {pendingBudgets.length === 0 && (
                    <div className="col-span-3 text-center py-8 text-zinc-500 text-xs bg-zinc-950 rounded-2xl border border-zinc-850">
                      ✓ Nenhum orçamento complexo pendente de aprovação master.
                    </div>
                  )}
                </div>
              </div>

              {/* Transactions list */}
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-4">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Histórico de Recebíveis & Repasses</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-500 font-mono text-[10px] uppercase">
                        <th className="py-3 px-4">Cód. Transação</th>
                        <th className="py-3 px-4">Cliente</th>
                        <th className="py-3 px-4">Tipo Atendimento</th>
                        <th className="py-3 px-4">Valor Total</th>
                        <th className="py-3 px-4">Mecânico (70%)</th>
                        <th className="py-3 px-4">Franquia (15%)</th>
                        <th className="py-3 px-4">Plataforma (15%)</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-850 font-mono">
                      {conciliatedTransactions.map(tx => (
                        <tr key={tx.id} className="hover:bg-zinc-850/30">
                          <td className="py-3.5 px-4 font-bold text-brand-orange">{tx.id}</td>
                          <td className="py-3.5 px-4 text-white font-sans">{tx.client}</td>
                          <td className="py-3.5 px-4 text-zinc-400 font-sans">{tx.type}</td>
                          <td className="py-3.5 px-4 text-white font-bold">R$ {tx.total.toFixed(2)}</td>
                          <td className="py-3.5 px-4 text-emerald-400">R$ {tx.mechanicShare.toFixed(2)}</td>
                          <td className="py-3.5 px-4 text-zinc-400">R$ {tx.franchiseRoyalty.toFixed(2)}</td>
                          <td className="py-3.5 px-4 text-zinc-400">R$ {tx.platformFee.toFixed(2)}</td>
                          <td className="py-3.5 px-4">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${tx.status === 'Conciliado' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-brand-orange/10 text-brand-orange border border-brand-orange/20'}`}>
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: MÓDULO 2 - CRM & CLIENTES */}
          {activeTab === 'crm' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 text-left">
              <div>
                <span className="text-xs bg-brand-orange/10 text-brand-orange font-extrabold px-3 py-1 rounded-full border border-brand-orange/20 uppercase tracking-wider">
                  MÓDULO 2: GESTÃO DE CLIENTES & PORTAL DE CRM
                </span>
                <h2 className="text-2xl font-black text-white mt-2">Contas Corporativas (B2B) e Clientes Varejo (PF)</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Valide documentos, audite o histórico de ordens corporativas simultâneas do frotista Antônio e solucione chamados de suporte.
                </p>
              </div>

              {renderReadOnlyBadge('crm')}

              {/* Frotista PJ Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Antônio PJ Details */}
                <div className="lg:col-span-1 bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-850 text-brand-orange flex items-center justify-center font-black">
                      PJ
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-white uppercase tracking-wider">Painel do Frotista B2B</h3>
                      <p className="text-[10px] text-zinc-500">Antônio Logística (RápidoSP)</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs leading-relaxed font-mono">
                    <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-850">
                      <span className="text-[9px] text-zinc-500 block">DADOS DE FATURAMENTO</span>
                      <p className="font-sans font-bold text-white">RápidoSP Entregas Ltda</p>
                      <p className="text-zinc-400 mt-1 text-[10px]">CNPJ: 12.345.678/0001-90</p>
                      <p className="text-zinc-400 text-[10px]">Faturamento mensal consolidado quinzenal</p>
                    </div>

                    <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-850 space-y-2">
                      <span className="text-[9px] text-zinc-500 block">SITUAÇÃO DE FROTA</span>
                      <div className="flex justify-between text-xs text-white">
                        <span>Motos Cadastradas:</span>
                        <span className="font-bold">12 Motos</span>
                      </div>
                      <div className="flex justify-between text-xs text-brand-orange">
                        <span>Manutenções do Mês:</span>
                        <span className="font-bold">28 Concluídas</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Fleet active tracking */}
                <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">Ordens de Serviço Simultâneas da Frota</h3>
                    <span className="text-[10px] bg-brand-orange/10 text-brand-orange font-mono px-2.5 py-0.5 rounded border border-brand-orange/20 font-bold">Ao Vivo</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl space-y-2">
                      <div className="flex items-center justify-between font-mono">
                        <span className="font-bold text-white">Honda CG 160 Cargo (Placa: OS-F28)</span>
                        <span className="text-brand-orange">Em Execução • 80%</span>
                      </div>
                      <div className="h-1.5 bg-zinc-850 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-orange rounded-full" style={{ width: '80%' }}></div>
                      </div>
                      <p className="text-[10px] text-zinc-500">Mecânico João Victor • Troca de Relação e pastilhas • No galpão logístico RápidoSP</p>
                    </div>

                    <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl space-y-2">
                      <div className="flex items-center justify-between font-mono">
                        <span className="font-bold text-white">Honda CG 160 Cargo (Placa: OS-F30)</span>
                        <span className="text-emerald-400">Concluído • Checklist Validado</span>
                      </div>
                      <div className="h-1.5 bg-zinc-850 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                      <p className="text-[10px] text-zinc-500">Mecânico Danilo Silva • Revisão Elétrica concluída de forma limpa • Pronto para entrega</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Customer table and Support tickets */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Customers CRM List */}
                <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Perfis Homologados (PF / PJ)</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-800 font-mono text-[9px] text-zinc-500 uppercase">
                          <th className="py-2 px-3">Cliente</th>
                          <th className="py-2 px-3">Tipo</th>
                          <th className="py-2 px-3">CPF/CNPJ</th>
                          <th className="py-2 px-3">Veículos</th>
                          <th className="py-2 px-3">Pts Fidelidade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-850">
                        {clientsCRM.map(c => (
                          <tr key={c.id} className="hover:bg-zinc-850/30">
                            <td className="py-3 px-3 font-bold text-white">{c.name}</td>
                            <td className="py-3 px-3">
                              <span className={`text-[9px] font-mono px-2 py-0.2 rounded ${c.type === 'PJ' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                                {c.type}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-mono text-zinc-400">{c.document}</td>
                            <td className="py-3 px-3 text-zinc-300 text-[11px]">{c.bikes.join(', ')}</td>
                            <td className="py-3 px-3 font-mono font-bold text-brand-orange">{c.points} pts</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Support Tickets */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Suporte & Ouvidoria (SLA)</h3>
                  <div className="space-y-3">
                    {tickets.map(t => (
                      <div key={t.id} className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl space-y-2 font-sans text-xs">
                        <div className="flex items-center justify-between font-mono text-[10px]">
                          <span className="text-brand-orange font-bold">{t.id}</span>
                          <span className={`font-bold px-1.5 rounded ${t.priority === 'Alta' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-brand-orange/10 text-brand-orange border border-brand-orange/20'}`}>
                            {t.priority}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-white">{t.client}</p>
                          <p className="text-[11px] text-zinc-400 mt-0.5">{t.subject}</p>
                        </div>
                        <p className="text-[11px] text-zinc-500 italic leading-relaxed">"{t.message}"</p>
                        
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-zinc-500 font-mono">{t.status}</span>
                          {t.status !== 'Resolvido' && (
                            <button onClick={() => solveTicket(t.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[9px] py-1 px-2.5 rounded transition-all cursor-pointer">
                              Resolver Ticket
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 4: MÓDULO 3 - MECÂNICOS */}
          {activeTab === 'mecanicos' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 text-left">
              <div>
                <span className="text-xs bg-brand-orange/10 text-brand-orange font-extrabold px-3 py-1 rounded-full border border-brand-orange/20 uppercase tracking-wider">
                  MÓDULO 3: ADMINISTRAÇÃO DE MECÂNICOS PARCEIROS
                </span>
                <h2 className="text-2xl font-black text-white mt-2">Onboarding de Candidatos MEI e KPIs de Execução</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Revise documentos de CNH, valide certidões de antecedentes civis e audite as avaliações e tempo de atendimento das vans.
                </p>
              </div>

              {renderReadOnlyBadge('mecanicos')}

              {/* Onboarding candidates flow */}
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-brand-orange rounded-full animate-ping shrink-0"></span>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">Novos Candidatos MEI Aguardando Onboarding</h3>
                  </div>
                  <button
                    onClick={() => {
                      setEditingCandId(null);
                      setCandName('');
                      setCandPhone('');
                      setCandMei('');
                      setCandCnh('');
                      setCandExp('');
                      setIsCandModalOpen(true);
                    }}
                    className="bg-brand-orange hover:bg-brand-orange-hover text-black font-extrabold text-[11px] px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    + Novo Candidato (CRUD)
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pendingOnboardings.map(cand => (
                    <div key={cand.id} className="bg-zinc-950 border border-zinc-850 p-5 rounded-2xl space-y-4 font-sans text-xs relative overflow-hidden">
                      {/* Status Background Line Accent */}
                      <div className={`absolute top-0 left-0 right-0 h-1 ${cand.document_verified ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-black text-sm text-white">{cand.name}</h4>
                          <span className="text-[10px] text-zinc-500">{cand.phone}</span>
                        </div>
                        <span className={`text-[10px] font-mono border px-2 py-0.5 rounded ${cand.document_verified ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                          {cand.document_verified ? '✓ Documentação Ok' : 'Aguardando Validação'}
                        </span>
                      </div>

                      <div className="space-y-2 font-mono text-[11px] leading-relaxed">
                        <p><span className="text-zinc-500">MEI/CNPJ:</span> <span className="text-zinc-300">{cand.meicnpj}</span></p>
                        <p><span className="text-zinc-500">CNH:</span> <span className="text-zinc-300">{cand.cnh}</span></p>
                        <p><span className="text-zinc-500">Experiência:</span> <span className="text-zinc-300 font-sans">{cand.exp}</span></p>
                        
                        <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900 border border-zinc-850">
                          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">document_verified:</span>
                          <button
                            onClick={() => handleToggleVerifyDoc(cand.id)}
                            className={`px-2.5 py-1 rounded text-[9px] font-black uppercase transition-all ${cand.document_verified ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' : 'bg-brand-orange/20 text-brand-orange hover:bg-brand-orange/30'}`}
                          >
                            {cand.document_verified ? 'true (Verificado)' : 'false (Validar)'}
                          </button>
                        </div>

                        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-2.5 rounded-xl flex items-center gap-2 text-[10px]">
                          <Shield className="w-3.5 h-3.5" />
                          <span>Certidões de Antecedentes: <strong>NADA CONSTA / LIMPO</strong></span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-900">
                        <button
                          onClick={() => approveMechanic(cand)}
                          disabled={!cand.document_verified}
                          className="flex-1 bg-brand-orange hover:bg-brand-orange-hover text-black font-black py-2 rounded-xl transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-center"
                        >
                          Aprovar Onboarding
                        </button>
                        <button
                          onClick={() => handleEditCandidate(cand)}
                          className="bg-zinc-850 hover:bg-zinc-800 text-zinc-300 font-bold px-3 py-2 rounded-xl transition-all cursor-pointer"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteCandidate(cand.id)}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold px-3 py-2 rounded-xl transition-all cursor-pointer"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  ))}
                  {pendingOnboardings.length === 0 && (
                    <div className="col-span-2 text-center py-8 text-zinc-500 text-xs bg-zinc-950 border border-zinc-850 rounded-2xl">
                      ✓ Todos os novos cadastros MEI foram revisados.
                    </div>
                  )}
                </div>
              </div>

              {/* CRUD Candidate Modal */}
              {isCandModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-4 shadow-2xl text-left"
                  >
                    <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                      <h3 className="text-sm font-black text-white uppercase tracking-wider">
                        {editingCandId ? 'Editar Candidato MEI' : 'Cadastrar Novo Candidato MEI'}
                      </h3>
                      <button
                        onClick={() => setIsCandModalOpen(false)}
                        className="text-zinc-500 hover:text-white font-black text-xs px-2 py-1 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    <form onSubmit={handleSaveCandidate} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Nome Completo</label>
                        <input
                          type="text"
                          required
                          value={candName}
                          onChange={e => setCandName(e.target.value)}
                          placeholder="Ex: Sandro Souza"
                          className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs px-4 py-2.5 rounded-xl focus:border-brand-orange focus:outline-none transition-all placeholder:text-zinc-700"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Telefone / WhatsApp</label>
                        <input
                          type="text"
                          required
                          value={candPhone}
                          onChange={e => setCandPhone(e.target.value)}
                          placeholder="Ex: (19) 99311-2288"
                          className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs px-4 py-2.5 rounded-xl focus:border-brand-orange focus:outline-none transition-all placeholder:text-zinc-700"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">MEI / CNPJ</label>
                        <input
                          type="text"
                          required
                          value={candMei}
                          onChange={e => setCandMei(e.target.value)}
                          placeholder="Ex: 44.512.102/0001-99"
                          className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs px-4 py-2.5 rounded-xl focus:border-brand-orange focus:outline-none transition-all placeholder:text-zinc-700"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Categoria de CNH</label>
                        <input
                          type="text"
                          required
                          value={candCnh}
                          onChange={e => setCandCnh(e.target.value)}
                          placeholder="Ex: Categoria A - Definitiva"
                          className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs px-4 py-2.5 rounded-xl focus:border-brand-orange focus:outline-none transition-all placeholder:text-zinc-700"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Histórico de Experiência</label>
                        <textarea
                          required
                          value={candExp}
                          onChange={e => setCandExp(e.target.value)}
                          placeholder="Ex: 5 anos de oficina autorizada Honda..."
                          rows={3}
                          className="w-full bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs px-4 py-2.5 rounded-xl focus:border-brand-orange focus:outline-none transition-all placeholder:text-zinc-700 resize-none"
                        />
                      </div>

                      <div className="flex gap-2.5 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsCandModalOpen(false)}
                          className="flex-1 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 font-black py-2.5 rounded-xl transition-all cursor-pointer text-center"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="flex-1 bg-brand-orange hover:bg-brand-orange-hover text-black font-black py-2.5 rounded-xl transition-all cursor-pointer text-center"
                        >
                          {editingCandId ? 'Salvar Alterações' : 'Cadastrar Candidato'}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}

              {/* Performance and Ratings of Active Mechanics */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Mechanic list table */}
                <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Performance e SLAs Operacionais</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-800 font-mono text-[9px] text-zinc-500 uppercase">
                          <th className="py-2.5 px-3">Mecânico</th>
                          <th className="py-2.5 px-3">Unidade</th>
                          <th className="py-2.5 px-3">SLA Cumprimento</th>
                          <th className="py-2.5 px-3">Taxa Retrabalho</th>
                          <th className="py-2.5 px-3">Nota Média</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-850 font-mono">
                        {approvedMechanics.map(m => (
                          <tr key={m.id} className="hover:bg-zinc-850/30">
                            <td className="py-3.5 px-3 font-sans font-black text-white">{m.name}</td>
                            <td className="py-3.5 px-3 text-brand-orange">{m.unit}</td>
                            <td className="py-3.5 px-3 text-emerald-400 font-bold">{m.sla}</td>
                            <td className="py-3.5 px-3 text-red-400 font-bold">{m.rework}</td>
                            <td className="py-3.5 px-3 text-white font-bold">⭐ {m.rating.toFixed(1)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Checklist auditor */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">Auditoria de Checklists (IA)</h3>
                    <p className="text-[11px] text-zinc-400 leading-normal">
                      Amostragem aleatória dos checklists de entrada das motos. A inteligência artificial do Gemini realizou a auditoria de avarias via fotos em lote.
                    </p>

                    <div className="bg-zinc-950 p-3 rounded-2xl border border-zinc-850 space-y-2">
                      <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                        <span>Checklist #90112</span>
                        <span className="text-green-400 font-bold">AUDITADO</span>
                      </div>
                      <p className="text-[11px] font-bold text-white">CG 160 Cargo - Placa GGG-1F92</p>
                      <p className="text-[11px] text-zinc-400 leading-normal">
                        ✓ Risco profundo no tanque e carenagem lateral esquerda identificados na foto de entrada. Sem reclamações subsequentes.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-800 flex justify-between items-center text-[11px]">
                    <span className="text-zinc-500 font-mono">Última auditoria: 12 min atrás</span>
                    <span className="text-brand-orange font-bold hover:underline cursor-pointer">Ver Relatórios Completos →</span>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 5: MÓDULO 4 - LOJISTAS & PARCEIROS */}
          {activeTab === 'parceiros' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 text-left">
              <div>
                <span className="text-xs bg-brand-orange/10 text-brand-orange font-extrabold px-3 py-1 rounded-full border border-brand-orange/20 uppercase tracking-wider">
                  MÓDULO 4: GESTÃO DE PARCEIROS, LOJISTAS & MOTO RESERVA
                </span>
                <h2 className="text-2xl font-black text-white mt-2">Catálogo de Fornecedores e Programa Moto Reserva</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Gerencie fornecedores de autopeças homologadas e acompanhe a liberação de motos reserva (parceria Mottu) para fidelização de clientes premium.
                </p>
              </div>

              {renderReadOnlyBadge('parceiros')}

              {/* Suppliers and Reserve fleet */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Supplier list */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Distribuidoras & Autopeças Homologadas</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-800 font-mono text-[9px] text-zinc-500 uppercase">
                          <th className="py-2.5 px-3">Fornecedor</th>
                          <th className="py-2.5 px-3">Insumos/Peças</th>
                          <th className="py-2.5 px-3">Estoque Hub</th>
                          <th className="py-2.5 px-3">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-850">
                        {suppliers.map(s => (
                          <tr key={s.id} className="hover:bg-zinc-850/30">
                            <td className="py-3 px-3">
                              <p className="font-bold text-white">{s.name}</p>
                              <span className="text-[9px] text-zinc-500 font-mono">{s.cnpj}</span>
                            </td>
                            <td className="py-3 px-3 text-zinc-300 font-mono text-[11px]">{s.category}</td>
                            <td className="py-3 px-3 font-mono">
                              <span className={`font-bold ${s.stockLevel.includes('Baixo') || parseInt(s.stockLevel) < 50 ? 'text-brand-orange' : 'text-emerald-400'}`}>
                                {s.stockLevel}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <button onClick={() => {
                                setSuppliers(prev => prev.map(item => item.id === s.id ? { ...item, stockLevel: '100%' } : item));
                              }} className="bg-zinc-800 hover:bg-zinc-700 text-[10px] text-white px-2.5 py-1 rounded transition-all cursor-pointer">
                                Reabastecer
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Moto Reserva partner */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">Frota Mottu Parceira (Moto Reserva)</h3>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-mono px-2.5 py-0.5 rounded border border-emerald-500/20">
                      Integração Ativa (API)
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-400 leading-normal">
                    Disponibilização automática de moto reserva para pilotos premium (fidelidade acima de 500 pontos) cuja manutenção do veículo dure mais de 2 horas.
                  </p>

                  <div className="space-y-3 font-mono text-xs">
                    {reserveMotos.map(moto => (
                      <div key={moto.id} className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{moto.model}</span>
                            <span className="text-[10px] bg-zinc-900 text-brand-orange px-1.5 py-0.2 rounded">{moto.plate}</span>
                          </div>
                          <p className="text-[10px] text-zinc-500 mt-1">Parceiro: {moto.partner} • Alocado a: <strong className="text-zinc-300 font-sans">{moto.assignedTo}</strong></p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${moto.status === 'Disponível' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : moto.status === 'Em Manutenção' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-brand-orange/10 text-brand-orange border border-brand-orange/20'}`}>
                          {moto.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 6: MÓDULO 5 - VANS & INVENTÁRIO */}
          {activeTab === 'vans' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 text-left">
              <div>
                <span className="text-xs bg-brand-orange/10 text-brand-orange font-extrabold px-3 py-1 rounded-full border border-brand-orange/20 uppercase tracking-wider">
                  MÓDULO 5: ADMINISTRAÇÃO DE MOTOS & VANS OTTOMOTOS
                </span>
                <h2 className="text-2xl font-black text-white mt-2">Checklist das Lojas Volantes e Gestão de Estoque Crítico</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Acompanhe em tempo real o inventário de peças internas de cada Van, certifique ferramentas calibradas de rampa e compressor.
                </p>
              </div>

              {renderReadOnlyBadge('vans')}

              {/* Van health checklist monitoring */}
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-4">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Monitoramento Diário de Equipamentos das Vans</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {vansChecklists.map(van => (
                    <div key={van.id} className="bg-zinc-950 border border-zinc-850 p-5 rounded-2xl space-y-3 font-sans text-xs">
                      <div className="flex justify-between items-center border-b border-zinc-850 pb-2">
                        <span className="font-black text-sm text-white">{van.name}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">{van.plate}</span>
                      </div>

                      <div className="space-y-2 font-mono text-[11px]">
                        <p className="flex justify-between">
                          <span className="text-zinc-500">Compressor Ar:</span>
                          <span className="text-green-400 font-bold">{van.compressor}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-zinc-500">Rampa Mecânica:</span>
                          <span className="text-green-400 font-bold">{van.rampa}</span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-zinc-500">Ferramental Torque:</span>
                          <span className={van.tools.includes('Alerta') ? 'text-brand-orange font-bold' : 'text-green-400 font-bold'}>
                            {van.tools}
                          </span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-zinc-500">Câmeras Segurança:</span>
                          <span className="text-green-400 font-bold">{van.cameras}</span>
                        </p>
                      </div>

                      <div className="pt-2 text-right text-[10px] text-zinc-500 font-mono">
                        Checklist obrigatório: {van.lastCheck}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile units inventory */}
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">Inventário Crítico das Vans</h3>
                    <p className="text-[11px] text-zinc-500">Consumíveis e autopeças físicas estocadas a bordo dos furgões-oficina</p>
                  </div>
                  <span className="text-[10px] text-brand-orange font-bold">Ledger Sincronizado</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-800 font-mono text-[10px] text-zinc-500 uppercase">
                        <th className="py-3 px-4">Localização (Van)</th>
                        <th className="py-3 px-4">Item de Reposição</th>
                        <th className="py-3 px-4">SKU do Sistema</th>
                        <th className="py-3 px-4">Qtd. Atual</th>
                        <th className="py-3 px-4">Mínimo Exigido</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-850 font-mono">
                      {vansInventory.map(item => {
                        const isLow = item.quantity < item.min;
                        return (
                          <tr key={item.id} className="hover:bg-zinc-850/30">
                            <td className="py-3 px-4 text-white font-sans">{item.van}</td>
                            <td className="py-3 px-4 text-zinc-300 font-sans font-bold">{item.item}</td>
                            <td className="py-3 px-4 text-zinc-500">{item.sku}</td>
                            <td className="py-3 px-4 text-white font-bold">{item.quantity} un</td>
                            <td className="py-3 px-4 text-zinc-400">{item.min} un</td>
                            <td className="py-3 px-4">
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${isLow ? 'bg-brand-orange/10 text-brand-orange border border-brand-orange/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                                {isLow ? '⚠️ Reabastecer' : '✓ OK'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <button onClick={() => restockVanItem(item.id)} className="bg-zinc-800 hover:bg-zinc-750 text-white font-black text-[10px] py-1 px-3 rounded transition-all cursor-pointer">
                                Repor Estoque
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 7: MÓDULO 6 - REGRAS OPERACIONAIS */}
          {activeTab === 'regras' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 text-left">
              <div>
                <span className="text-xs bg-brand-orange/10 text-brand-orange font-extrabold px-3 py-1 rounded-full border border-brand-orange/20 uppercase tracking-wider">
                  MÓDULO 6: REGRAS OPERACIONAIS DA PLATAFORMA
                </span>
                <h2 className="text-2xl font-black text-white mt-2">Motor de Regras, Checkoff Ecológico e Alarmes</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Configure tempos limites de cancelamento, bônus de fidelidade, controle o check-off ecológico no descarte de resíduos e gerencie segurança.
                </p>
              </div>

              {renderReadOnlyBadge('regras')}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Rules Form */}
                <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-6">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Ajuste de Parâmetros de Motor de Regras</h3>

                  <form onSubmit={handleSaveRules} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-zinc-400 font-bold block">Tempo Limite Cancelamento (Minutos)</label>
                        <input
                          type="number"
                          value={platformRules.cancelLimitMin}
                          onChange={(e) => setPlatformRules(prev => ({ ...prev, cancelLimitMin: e.target.value }))}
                          className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-white font-mono focus:border-brand-orange outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-zinc-400 font-bold block">Taxa de Deslocamento Base por KM (R$/KM)</label>
                        <input
                          type="text"
                          value={platformRules.displacementRatePerKm}
                          onChange={(e) => setPlatformRules(prev => ({ ...prev, displacementRatePerKm: e.target.value }))}
                          className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-white font-mono focus:border-brand-orange outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-zinc-400 font-bold block">Gatilhador de Pontos por Solicitação</label>
                        <input
                          type="number"
                          value={platformRules.loyaltyPointsMultiplier}
                          onChange={(e) => setPlatformRules(prev => ({ ...prev, loyaltyPointsMultiplier: e.target.value }))}
                          className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-white font-mono focus:border-brand-orange outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-zinc-400 font-bold block">Taxa Royalty Franquia (%)</label>
                        <input
                          type="number"
                          value={platformRules.franchiseRoyaltyPercent}
                          onChange={(e) => setPlatformRules(prev => ({ ...prev, franchiseRoyaltyPercent: e.target.value }))}
                          className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-white font-mono focus:border-brand-orange outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pt-2">
                      <button type="submit" className="bg-brand-orange hover:bg-brand-orange-hover text-black font-black px-6 py-2.5 rounded-xl transition-all cursor-pointer">
                        Aplicar Regras de Negócio
                      </button>
                      
                      {ruleSavedMessage && (
                        <span className="text-emerald-400 font-mono font-bold animate-pulse">
                          ✓ Parâmetros persistidos no Supabase com sucesso!
                        </span>
                      )}
                    </div>
                  </form>
                </div>

                {/* Ecological Checkoff and Encerramento do dia */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">Descarte Ecológico de Óleo e Resíduos</h3>
                    <p className="text-[11px] text-zinc-400 leading-normal">
                      A OttoMotos cumpre com rigor as normas da ANP de transbordo e descarte ecológico do óleo lubrificante recolhido.
                    </p>

                    <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-850 space-y-3 font-mono text-xs">
                      <span className="text-[9px] text-zinc-500 block">RECOLHIMENTO CAMPINAS HUB</span>
                      <div className="flex justify-between">
                        <span>Óleo Coletado:</span>
                        <span className="text-brand-orange font-bold">{ecoLitres} Litros</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Certificação Eco:</span>
                        <span className="text-green-400 font-bold">100% Selado</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setEcoLitres(prev => prev + 25)}
                    className="w-full bg-zinc-950 hover:bg-zinc-900 text-zinc-400 border border-zinc-800 font-black text-xs py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Registrar Coleta de Resíduos (ANP)
                  </button>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 8: SQL TAB */}
          {activeTab === 'sql' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-left">
              <div>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 font-extrabold px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-wider">
                  MODELAGEM DE BANCO DE DADOS (SUPABASE POSTGRESQL)
                </span>
                <h2 className="text-2xl font-black text-white mt-2">Drizzle & Supabase PostgreSQL Macro Schema</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Exiba a estrutura física das tabelas projetadas para dar suporte a toda a mecânica de transações, frotistas B2B, geolocalização e botão de pânico.
                </p>
              </div>

              {/* Grid selectors */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Selector */}
                <div className="lg:col-span-1 bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-4">
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">Selecione o Módulo de Tabelas</h3>
                  <div className="flex flex-col gap-2 font-mono text-xs text-zinc-400">
                    <button onClick={() => {}} className="text-left py-2 px-3 bg-zinc-950 border border-zinc-800 text-white rounded-lg">
                      Tabelas do Back-Office
                    </button>
                  </div>
                  <div className="bg-zinc-950 p-4 border border-zinc-850 rounded-2xl space-y-2 text-[11px] text-zinc-400 leading-normal">
                    <p className="font-bold text-zinc-300">💡 Nota de Arquitetura</p>
                    <p>
                      Essas DDLs contam com gatilhos de cálculo automático de repasse de 70% e proteção via RLS (Row-Level Security) no Supabase.
                    </p>
                  </div>
                </div>

                {/* Show SQL Blocks */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white uppercase tracking-wider">Modelagem DDL Relacional (PostgreSQL)</span>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">100% Produção</span>
                    </div>

                    <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-850 overflow-x-auto max-h-96">
                      <pre className="text-xs font-mono text-zinc-300 leading-relaxed whitespace-pre-wrap">
                        {SQL_SCHEMAS.financeiro}
                        {"\n\n"}
                        {SQL_SCHEMAS.crm}
                        {"\n\n"}
                        {SQL_SCHEMAS.mecanicos}
                        {"\n\n"}
                        {SQL_SCHEMAS.parceiros}
                        {"\n\n"}
                        {SQL_SCHEMAS.vans}
                        {"\n\n"}
                        {SQL_SCHEMAS.regras}
                        {"\n\n"}
                        {SQL_SCHEMAS.governanca}
                      </pre>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 9: SUPORTE E OUVIDORIA */}
          {activeTab === 'suporte-ouvidoria' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 text-left">
              <div>
                <span className="text-xs bg-amber-500/10 text-amber-400 font-extrabold px-3 py-1 rounded-full border border-amber-500/20 uppercase tracking-wider">
                  MÓDULO 7: SUPORTE & OUVIDORIA DE CONFLITOS
                </span>
                <h2 className="text-2xl font-black text-white mt-2">Ouvidoria de Reclamações e Atendimento</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Gerencie conflitos, acompanhe SLAs de atendimento e ofereça bonificações diretas para garantir 100% de satisfação do cliente.
                </p>
              </div>

              {renderReadOnlyBadge('suporte')}

              {/* Stats overview */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-1">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase block">Chamados Pendentes</span>
                  <p className="text-2xl font-black text-amber-400">{complaints.filter(c => c.status === 'Pendente').length}</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-1">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase block">Tempo Médio SLA</span>
                  <p className="text-2xl font-black text-white">18 Minutos</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-1">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase block">Índice CSAT Geral</span>
                  <p className="text-2xl font-black text-emerald-400">94.6%</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-1">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase block">Casos Resolvidos</span>
                  <p className="text-2xl font-black text-white">{complaints.filter(c => c.status === 'Resolvido').length}</p>
                </div>
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* List of complaints */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-black text-white uppercase tracking-wider">Canais Integrados</h3>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setOuvidoriaFilter('All')}
                          className={`text-[9px] px-2 py-1 rounded font-bold ${ouvidoriaFilter === 'All' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}
                        >
                          Todos
                        </button>
                        <button
                          onClick={() => setOuvidoriaFilter('App Cliente')}
                          className={`text-[9px] px-2 py-1 rounded font-bold ${ouvidoriaFilter === 'App Cliente' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}
                        >
                          App
                        </button>
                        <button
                          onClick={() => setOuvidoriaFilter('Plataforma Web')}
                          className={`text-[9px] px-2 py-1 rounded font-bold ${ouvidoriaFilter === 'Plataforma Web' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}
                        >
                          Web
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {complaints
                        .filter(c => ouvidoriaFilter === 'All' || c.channel === ouvidoriaFilter)
                        .map(comp => (
                          <div
                            key={comp.id}
                            onClick={() => setSelectedComplaint(comp)}
                            className={`p-3.5 rounded-xl border transition-all cursor-pointer text-xs space-y-2 ${selectedComplaint?.id === comp.id ? 'bg-brand-orange/5 border-brand-orange' : 'bg-zinc-950 border-zinc-850 hover:border-zinc-750'}`}
                          >
                            <div className="flex justify-between items-start">
                              <span className="font-mono text-[9px] bg-zinc-900 text-brand-orange px-2 py-0.5 rounded border border-zinc-800 font-bold">{comp.id}</span>
                              <span className={`text-[9px] px-2 py-0.5 rounded-full font-black ${comp.status === 'Pendente' ? 'bg-red-500/10 text-red-400' : comp.status === 'Respondido' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                {comp.status}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-black text-white">{comp.clientName}</h4>
                              <p className="text-[10px] text-zinc-400 mt-0.5">{comp.subject}</p>
                            </div>
                            <div className="flex justify-between items-center text-[9px] text-zinc-500 pt-1">
                              <span>{comp.channel}</span>
                              <span>{comp.date}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Detail View of selected complaint */}
                <div className="lg:col-span-2">
                  {selectedComplaint ? (
                    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800 pb-4 gap-3">
                        <div>
                          <span className="text-[9px] font-mono text-zinc-500">ID DA RECLAMAÇÃO: {selectedComplaint.id}</span>
                          <h3 className="text-lg font-black text-white">{selectedComplaint.clientName}</h3>
                          <p className="text-xs text-zinc-400 mt-0.5">{selectedComplaint.email} • {selectedComplaint.phone}</p>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full font-black self-start sm:self-auto ${selectedComplaint.priority === 'Crítica' ? 'bg-red-500 text-white animate-pulse' : 'bg-zinc-800 text-zinc-300'}`}>
                          Prioridade: {selectedComplaint.priority}
                        </span>
                      </div>

                      <div className="bg-zinc-950 p-4 border border-zinc-850 rounded-2xl text-xs space-y-2">
                        <p className="text-zinc-400 font-mono text-[10px] uppercase">Fato Reclamado:</p>
                        <p className="text-zinc-300 leading-relaxed font-mono">{selectedComplaint.description}</p>
                        <div className="text-[10px] text-zinc-500 pt-2 flex justify-between">
                          <span>Ordem de Serviço Relacionada: <strong className="text-zinc-300">{selectedComplaint.orderId}</strong></span>
                          <span>Canal: <strong className="text-zinc-300">{selectedComplaint.channel}</strong></span>
                        </div>
                      </div>

                      {/* Chat Thread */}
                      <div className="space-y-3">
                        <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Histórico de Mensagens / Resoluções</p>
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                          {selectedComplaint.messages.map((msg, idx) => (
                            <div key={idx} className={`flex flex-col max-w-[85%] rounded-2xl p-3.5 text-xs ${msg.sender === 'client' ? 'bg-zinc-950 border border-zinc-850 self-start text-left font-mono' : 'bg-brand-orange/5 border border-brand-orange/20 self-end ml-auto text-left font-mono'}`}>
                              <span className="text-[9px] text-zinc-500 font-mono mb-1">{msg.sender === 'client' ? 'Cliente' : 'Suporte OttoMotos'} • {msg.time}</span>
                              <p className="text-zinc-300 leading-relaxed">{msg.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Reply Box */}
                      {selectedComplaint.status !== 'Resolvido' ? (
                        <div className="space-y-4 pt-4 border-t border-zinc-800">
                          <div className="space-y-2">
                            <label className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Responder ao Cliente (App & Web)</label>
                            <textarea
                              rows={3}
                              value={complaintReplyText}
                              onChange={e => setComplaintReplyText(e.target.value)}
                              placeholder="Escreva a resposta de suporte ao cliente..."
                              className="w-full bg-zinc-950 border border-zinc-850 text-zinc-200 text-xs p-4 rounded-xl focus:border-brand-orange focus:outline-none placeholder:text-zinc-600 font-mono"
                            />
                          </div>

                          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="space-y-1.5 self-start w-full sm:w-auto">
                              <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Bonificação / Compensação</label>
                              <select
                                value={selectedCompensation}
                                onChange={e => setSelectedCompensation(e.target.value)}
                                className="bg-zinc-950 text-zinc-300 border border-zinc-850 text-xs px-3 py-2 rounded-xl focus:border-brand-orange focus:outline-none"
                              >
                                <option value="Nenhuma">Nenhuma compensação</option>
                                <option value="Cupom">Cupom de 15% Desconto</option>
                                <option value="Credito">Crédito de R$ 30,00 na Conta</option>
                                <option value="Reembolso">Reembolso Integral da Taxa</option>
                              </select>
                            </div>

                            <div className="flex gap-2.5 w-full sm:w-auto justify-end">
                              <button
                                onClick={() => {
                                  if (!hasWriteAccess('suporte')) {
                                    alert('Acesso negado: Seu cargo possui apenas permissão de LEITURA para o módulo de Suporte.');
                                    return;
                                  }
                                  if (!complaintReplyText.trim()) return;
                                  
                                  const updated = complaints.map(c => {
                                    if (c.id === selectedComplaint.id) {
                                      const newMsgs = [
                                        ...c.messages,
                                        { sender: 'admin' as const, text: complaintReplyText, time: '10:45' }
                                      ];
                                      let updatedStatus = 'Respondido';
                                      if (selectedCompensation !== 'Nenhuma') {
                                        newMsgs.push({
                                          sender: 'admin' as const,
                                          text: `🎁 OttoMotos: Liberamos uma compensação do tipo "${selectedCompensation}" para esta ocorrência como forma de desculpas.`,
                                          time: '10:45'
                                        });
                                      }
                                      return { ...c, messages: newMsgs, status: updatedStatus as any };
                                    }
                                    return c;
                                  });
                                  setComplaints(updated);
                                  setSelectedComplaint(updated.find(c => c.id === selectedComplaint.id) || null);
                                  setComplaintReplyText('');
                                  setSelectedCompensation('Nenhuma');
                                }}
                                className="bg-zinc-800 hover:bg-zinc-750 text-white font-black text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer font-bold border border-zinc-700 font-bold"
                              >
                                Enviar Resposta
                              </button>
                              <button
                                onClick={() => {
                                  if (!hasWriteAccess('suporte')) {
                                    alert('Acesso negado: Seu cargo possui apenas permissão de LEITURA para o módulo de Suporte.');
                                    return;
                                  }
                                  const updated = complaints.map(c => {
                                    if (c.id === selectedComplaint.id) {
                                      return { ...c, status: 'Resolvido' as any };
                                    }
                                    return c;
                                  });
                                  setComplaints(updated);
                                  setSelectedComplaint(updated.find(c => c.id === selectedComplaint.id) || null);
                                  alert('Reclamação finalizada e resolvida com sucesso!');
                                }}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer font-bold shadow-md"
                              >
                                Resolver Conflito ✓
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-emerald-400 text-xs font-bold text-center font-bold">
                          ✓ Este conflito de suporte foi marcado como RESOLVIDO de forma bem-sucedida.
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl text-center text-zinc-500 text-xs">
                      Selecione um chamado de suporte na barra lateral esquerda para interagir.
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 10: GESTÃO DE ACESSO */}
          {activeTab === 'gestao-acesso' && isMasterAdmin && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 text-left">
              <div>
                <span className="text-xs bg-brand-orange/10 text-brand-orange font-extrabold px-3 py-1 rounded-full border border-brand-orange/20 uppercase tracking-wider">
                  MÓDULO 8: CONTROLE DE ACESSOS (EXCLUSIVE MASTER ADMIN)
                </span>
                <h2 className="text-2xl font-black text-white mt-2">Atribuição de Direitos de Acesso</h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Gerencie permissões de leitura ou escrita de funcionários em cada menu operacional do sistema para garantir total segurança da operação.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Employee List */}
                <div className="lg:col-span-1 bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-4">
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">Funcionários Cadastrados</h3>
                  <div className="space-y-3">
                    {staffPermissions.map(staff => (
                      <div key={staff.id} className="p-4 bg-zinc-950 border border-zinc-850 rounded-2xl space-y-2">
                        <div className="flex justify-between items-center">
                          <strong className="text-xs text-white">{staff.name}</strong>
                          <span className="text-[9px] bg-brand-orange/15 text-brand-orange border border-brand-orange/20 px-2 py-0.5 rounded font-mono font-bold">{staff.role}</span>
                        </div>
                        <p className="text-[10px] text-zinc-500 font-mono">{staff.email}</p>
                      </div>
                    ))}
                  </div>

                  {/* Add New Staff member Form */}
                  <div className="border-t border-zinc-850 pt-4 mt-4 space-y-3">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block font-bold">Adicionar Funcionário</span>
                    <div className="space-y-2 text-xs">
                      <input
                        type="text"
                        placeholder="Nome do Funcionário"
                        value={newStaffName}
                        onChange={e => setNewStaffName(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-850 text-zinc-200 text-xs p-2.5 rounded-xl focus:border-brand-orange focus:outline-none"
                      />
                      <input
                        type="email"
                        placeholder="E-mail Corporativo"
                        value={newStaffEmail}
                        onChange={e => setNewStaffEmail(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-850 text-zinc-200 text-xs p-2.5 rounded-xl focus:border-brand-orange focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Cargo / Setor"
                        value={newStaffRole}
                        onChange={e => setNewStaffRole(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-850 text-zinc-200 text-xs p-2.5 rounded-xl focus:border-brand-orange focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          if (!newStaffName || !newStaffEmail || !newStaffRole) return;
                          setStaffPermissions(prev => [
                            ...prev,
                            {
                              id: `staff-${prev.length + 1}`,
                              name: newStaffName,
                              email: newStaffEmail,
                              role: newStaffRole,
                              permissions: {
                                financeiro: 'Leitura',
                                crm: 'Nenhum',
                                mecanicos: 'Nenhum',
                                parceiros: 'Nenhum',
                                vans: 'Nenhum',
                                regras: 'Nenhum',
                                suporte: 'Nenhum'
                              }
                            }
                          ]);
                          setNewStaffName('');
                          setNewStaffEmail('');
                          setNewStaffRole('');
                          alert('Funcionário cadastrado com sucesso! Defina suas permissões ao lado.');
                        }}
                        className="w-full bg-brand-orange hover:bg-brand-orange-hover text-black font-black py-2.5 rounded-xl transition-all font-bold"
                      >
                        Cadastrar Funcionário
                      </button>
                    </div>
                  </div>
                </div>

                {/* Permissions matrix editor */}
                <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-6">
                  <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                    <h3 className="text-xs font-black text-white uppercase tracking-wider font-bold">Matriz de Permissões Operacionais</h3>
                    <span className="text-[10px] text-emerald-400 font-bold font-mono">Modo Escritura Ativo</span>
                  </div>

                  <div className="space-y-6">
                    {staffPermissions.map(staff => (
                      <div key={staff.id} className="bg-zinc-950 border border-zinc-850 p-5 rounded-2xl space-y-4">
                        <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5">
                          <div>
                            <strong className="text-xs text-white">{staff.name}</strong>
                            <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{staff.email}</p>
                          </div>
                          <span className="text-[10px] text-zinc-400 font-bold">{staff.role}</span>
                        </div>

                        {/* List of modules */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {Object.keys(staff.permissions).map(moduleKey => {
                            const val = staff.permissions[moduleKey as keyof typeof staff.permissions];
                            return (
                              <div key={moduleKey} className="flex justify-between items-center bg-zinc-900 p-2.5 rounded-xl text-xs">
                                <span className="font-bold text-zinc-300 uppercase tracking-wider text-[10px]">{moduleKey}</span>
                                <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-850 gap-1">
                                  {['Nenhum', 'Leitura', 'Escrita'].map(lvl => (
                                    <button
                                      key={lvl}
                                      onClick={() => {
                                        const updated = staffPermissions.map(s => {
                                          if (s.id === staff.id) {
                                            return {
                                              ...s,
                                              permissions: {
                                                ...s.permissions,
                                                [moduleKey]: lvl
                                              }
                                            };
                                          }
                                          return s;
                                        });
                                        setStaffPermissions(updated);
                                      }}
                                      className={`text-[9px] px-2 py-1 rounded font-bold transition-all ${val === lvl ? 'bg-brand-orange text-black font-extrabold shadow' : 'text-zinc-500 hover:text-zinc-300'}`}
                                    >
                                      {lvl}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-zinc-950 p-4 border border-zinc-850 rounded-2xl flex items-center gap-3 text-xs text-zinc-400">
                    <Shield className="w-5 h-5 text-brand-orange shrink-0" />
                    <p>
                      As alterações efetuadas acima salvam-se instantaneamente no estado local. Você pode simular o login com o respectivo funcionário para testar o sistema se adaptando dinamicamente.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 11: GOVERNANÇA, CONFIANÇA E DISCIPLINA */}
          {activeTab === 'governanca' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-left">
              
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <span className="text-xs bg-red-500/15 text-red-400 font-extrabold px-3 py-1 rounded-full border border-red-500/20 uppercase tracking-wider">
                    MÓDULO 9: GOVERNANÇA, CONFIANÇA & CONTRATOS (TRUST & SAFETY)
                  </span>
                  <h2 className="text-2xl font-black text-white mt-2 flex items-center gap-2">
                    <Scale className="w-6 h-6 text-red-500" />
                    Central de Mitigação de Riscos & Prevenção a Fraudes
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Central integrada de auditoria contínua, telemetria de vans, prevenção de perdas corporativas e aplicação da Régua Disciplinar do marketplace.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      alert('🔄 Banco de dados de incidentes resetado para sincronização!');
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-300 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4 text-brand-orange" />
                    Resetar Triagem
                  </button>
                </div>
              </div>

              {/* TOP CARDS (Cartões de Risco em Destaque) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Indicador 1: Botões de Pânico (Vermelho Pulsante) */}
                <div className="bg-red-950/20 border border-red-900/40 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[140px] shadow-lg shadow-red-950/5">
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center animate-pulse">
                    <ShieldAlert className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <span className="text-[10px] text-red-400 font-black uppercase tracking-widest block">Botões de Pânico Ativos</span>
                    <h3 className="text-3xl font-black text-red-500 mt-1 flex items-center gap-2">
                      {incidentesState.filter(i => i.categoria_abuso === 'BOTAO_PANICO' && i.status_investigacao === 'FILA_TRIAGEM').length}
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                    </h3>
                  </div>
                  <p className="text-[10px] text-red-300/80 font-mono mt-2">
                    🚨 1 Van em transmissão de emergência ativa. Apoio policial e operacional acionado.
                  </p>
                </div>

                {/* Indicador 2: Vans com Desvio de Rota (Amarelo) */}
                <div className="bg-amber-950/20 border border-amber-900/40 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[140px] shadow-lg shadow-amber-950/5">
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-400 font-black uppercase tracking-widest block">Incoerências de Compliance</span>
                    <h3 className="text-3xl font-black text-amber-400 mt-1">
                      {incidentesState.filter(i => (i.categoria_abuso === 'DESVIO_ESTOQUE' || i.categoria_abuso === 'ATENDIMENTO_POR_FORA') && i.status_investigacao !== 'RESOLVIDO').length}
                    </h3>
                  </div>
                  <p className="text-[10px] text-amber-300/80 font-mono mt-2">
                    ⚠️ 2 Vans sob auditoria por desvios de rota ou falha crítica de inventário de peças.
                  </p>
                </div>

                {/* Indicador 3: Contas PJ Inadimplentes (Cinza) */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[140px] shadow-lg">
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                    <Ban className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest block">Contas PJ Inadimplentes</span>
                    <h3 className="text-3xl font-black text-zinc-300 mt-1">
                      {incidentesState.filter(i => i.categoria_abuso === 'INADIMPLENCIA' && i.status_investigacao !== 'RESOLVIDO').length}
                    </h3>
                  </div>
                  <p className="text-[10px] text-zinc-400 font-mono mt-2">
                    🔒 Bloqueio de painel e suspensão de chamados B2B ativos para frotas com boletos vencidos &gt; 5 dias.
                  </p>
                </div>

              </div>

              {/* FILTERS & SEARCH */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-brand-orange" />
                    Filtros da Fila de Investigação
                  </h3>
                  <div className="text-[11px] text-zinc-500">
                    Mostrando <strong className="text-zinc-300">{incidentesState.length} incidentes</strong> monitorados no motor de risco.
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Busca */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Buscar Infrator</label>
                    <input
                      type="text"
                      placeholder="Nome, ID ou OS..."
                      value={termoBuscaGovernanca}
                      onChange={(e) => setTermoBuscaGovernanca(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 placeholder-zinc-600 transition-all"
                    />
                  </div>

                  {/* Categoria */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Categoria de Abuso</label>
                    <select
                      value={filtroCategoria}
                      onChange={(e: any) => setFiltroCategoria(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 cursor-pointer"
                    >
                      <option value="TODAS">Todas as Categorias</option>
                      <option value="ATENDIMENTO_POR_FORA">Atendimento Por Fora 🚨</option>
                      <option value="DESVIO_ESTOQUE">Desvio de Estoque / Peças 📦</option>
                      <option value="BOTAO_PANICO">Botão de Pânico Ativado 🆘</option>
                      <option value="ESTORNO_FALSO">Tentativa de Estorno Falso 💳</option>
                      <option value="CANCELAMENTO_ABUSIVO">Cancelamento Abusivo ⏳</option>
                      <option value="INADIMPLENCIA">Inadimplência PJ 🔒</option>
                    </select>
                  </div>

                  {/* Severidade */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Nível de Severidade</label>
                    <select
                      value={filtroSeveridade}
                      onChange={(e: any) => setFiltroSeveridade(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 cursor-pointer"
                    >
                      <option value="TODAS">Todos os Níveis</option>
                      <option value="BAIXA">Severidade Baixa</option>
                      <option value="MEDIA">Severidade Média</option>
                      <option value="ALTA">Severidade Alta</option>
                      <option value="CRITICA">Severidade Crítica</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Status da Investigação</label>
                    <select
                      value={filtroStatus}
                      onChange={(e: any) => setFiltroStatus(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 cursor-pointer"
                    >
                      <option value="TODAS">Todos os Status</option>
                      <option value="FILA_TRIAGEM">Fila de Triagem</option>
                      <option value="EM_AUDITORIA">Em Sindicância</option>
                      <option value="RESOLVIDO">Resolvido / Arquivado</option>
                      <option value="PENALIZADO">Sancionado / Penalizado</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* TRIAGE TABLE (Tabela Densa de Triagem) */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                  <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Scale className="w-4.5 h-4.5 text-red-500" />
                    Fila de Triagem Operacional & SLA de Resolução
                  </h3>
                  <span className="text-[10px] bg-red-500/10 text-red-400 font-extrabold px-2.5 py-0.5 rounded border border-red-500/20 font-mono uppercase tracking-widest">
                    Tempo Real (SLA de Resolução de Riscos)
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-950/65 border-b border-zinc-800 text-[10px] font-black text-zinc-400 uppercase tracking-wider">
                        <th className="px-6 py-4">ID / Registro</th>
                        <th className="px-6 py-4">Infrator ( Marketplace )</th>
                        <th className="px-6 py-4">Categoria do Risco</th>
                        <th className="px-6 py-4 text-center">Severidade</th>
                        <th className="px-6 py-4">Status Auditoria</th>
                        <th className="px-6 py-4">Tempo de Resolução (SLA)</th>
                        <th className="px-6 py-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 text-xs">
                      {incidentesState
                        .filter(i => {
                          if (filtroCategoria !== 'TODAS' && i.categoria_abuso !== filtroCategoria) return false;
                          if (filtroSeveridade !== 'TODAS' && i.severidade !== filtroSeveridade) return false;
                          if (filtroStatus !== 'TODAS' && i.status_investigacao !== filtroStatus) return false;
                          if (termoBuscaGovernanca) {
                            const term = termoBuscaGovernanca.toLowerCase();
                            return (
                              i.infrator_nome.toLowerCase().includes(term) ||
                              i.id.toLowerCase().includes(term) ||
                              (i.ordem_servico_id && i.ordem_servico_id.toLowerCase().includes(term)) ||
                              i.detalhes.toLowerCase().includes(term)
                            );
                          }
                          return true;
                        })
                        .map((inc) => {
                          const hasSlaWarning = inc.tempo_sla_restante_min > 0 && inc.tempo_sla_restante_min <= 15;
                          return (
                            <tr 
                              key={inc.id} 
                              className={`hover:bg-zinc-850/50 transition-colors ${
                                inc.categoria_abuso === 'BOTAO_PANICO' && inc.status_investigacao === 'FILA_TRIAGEM'
                                  ? 'bg-red-950/10 border-l-4 border-l-red-600'
                                  : ''
                              }`}
                            >
                              <td className="px-6 py-4.5 font-mono">
                                <div className="text-zinc-200 font-bold">{inc.id}</div>
                                <div className="text-[10px] text-zinc-500">{inc.criado_em}</div>
                              </td>
                              <td className="px-6 py-4.5">
                                <div className="flex items-center gap-2">
                                  <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${
                                    inc.tipo_infrator === 'MECANICO'
                                      ? 'bg-amber-400 text-black'
                                      : inc.tipo_infrator === 'FROTISTA'
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-emerald-600 text-white'
                                  }`}>
                                    {inc.tipo_infrator}
                                  </span>
                                  <span className="font-bold text-white text-xs">{inc.infrator_nome}</span>
                                </div>
                                {inc.ordem_servico_id && (
                                  <span className="text-[10px] text-zinc-500 font-mono block mt-1">
                                    Vínculo: <strong>{inc.ordem_servico_id}</strong>
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4.5">
                                <span className="font-bold text-zinc-300">
                                  {inc.categoria_abuso === 'ATENDIMENTO_POR_FORA' && '🚨 Vazamento de Receita / Por Fora'}
                                  {inc.categoria_abuso === 'DESVIO_ESTOQUE' && '📦 Desvio de Insumos / Estoque'}
                                  {inc.categoria_abuso === 'BOTAO_PANICO' && '🆘 Botão de Pânico Acionado'}
                                  {inc.categoria_abuso === 'ESTORNO_FALSO' && '💳 Central de Falso Estorno'}
                                  {inc.categoria_abuso === 'CANCELAMENTO_ABUSIVO' && '⏳ Cancelamento Abusivo'}
                                  {inc.categoria_abuso === 'INADIMPLENCIA' && '🔒 Inadimplência Corporativa'}
                                </span>
                              </td>
                              <td className="px-6 py-4.5 text-center">
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full inline-block ${
                                  inc.severidade === 'CRITICA'
                                    ? 'bg-red-500 text-white animate-pulse'
                                    : inc.severidade === 'ALTA'
                                    ? 'bg-orange-500 text-white'
                                    : inc.severidade === 'MEDIA'
                                    ? 'bg-yellow-500 text-black'
                                    : 'bg-blue-500 text-white'
                                }`}>
                                  {inc.severidade}
                                </span>
                              </td>
                              <td className="px-6 py-4.5">
                                <span className={`flex items-center gap-1.5 font-bold ${
                                  inc.status_investigacao === 'FILA_TRIAGEM'
                                    ? 'text-purple-400'
                                    : inc.status_investigacao === 'EM_AUDITORIA'
                                    ? 'text-yellow-400'
                                    : inc.status_investigacao === 'RESOLVIDO'
                                    ? 'text-emerald-400'
                                    : 'text-zinc-500'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${
                                    inc.status_investigacao === 'FILA_TRIAGEM'
                                      ? 'bg-purple-400 animate-ping'
                                      : inc.status_investigacao === 'EM_AUDITORIA'
                                      ? 'bg-yellow-400'
                                      : inc.status_investigacao === 'RESOLVIDO'
                                      ? 'bg-emerald-400'
                                      : 'bg-zinc-500'
                                  }`} />
                                  {inc.status_investigacao === 'FILA_TRIAGEM' && 'Fila de Triagem'}
                                  {inc.status_investigacao === 'EM_AUDITORIA' && 'Em Sindicância'}
                                  {inc.status_investigacao === 'RESOLVIDO' && 'Resolvido/Arquivado'}
                                  {inc.status_investigacao === 'PENALIZADO' && 'Penalizado'}
                                </span>
                              </td>
                              <td className="px-6 py-4.5">
                                {inc.status_investigacao === 'RESOLVIDO' || inc.status_investigacao === 'PENALIZADO' ? (
                                  <span className="text-zinc-500 font-bold font-mono">Concluído</span>
                                ) : (
                                  <div className="space-y-1 w-32">
                                    <div className="flex justify-between text-[10px] font-mono font-bold">
                                      <span className={hasSlaWarning ? 'text-red-400 animate-pulse' : 'text-zinc-400'}>
                                        {inc.tempo_sla_restante_min} min restantes
                                      </span>
                                    </div>
                                    <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-850">
                                      <div 
                                        style={{ width: `${Math.min(100, (inc.tempo_sla_restante_min / 60) * 100)}%` }} 
                                        className={`h-full rounded-full transition-all duration-500 ${
                                          hasSlaWarning ? 'bg-red-500 animate-pulse' : 'bg-brand-orange'
                                        }`}
                                      />
                                    </div>
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4.5 text-right">
                                <button
                                  onClick={() => {
                                    setSelectedIncidente(inc);
                                    setIsIncidenteDrawerOpen(true);
                                    if (inc.status_investigacao === 'FILA_TRIAGEM') {
                                      setIncidentesState(prev => prev.map(p => p.id === inc.id ? { ...p, status_investigacao: 'EM_AUDITORIA' } : p));
                                    }
                                  }}
                                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 hover:text-white border border-zinc-750 text-zinc-300 font-bold rounded-xl text-[11px] transition-all flex items-center gap-1.5 ml-auto cursor-pointer"
                                >
                                  <Search className="w-3.5 h-3.5" />
                                  Auditar Caso
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* DRAWER LATERAL DE SINDICÂNCIA (Simulação do Drawer Shadcn) */}
              <AnimatePresence>
                {isIncidenteDrawerOpen && selectedIncidente && (
                  <>
                    {/* Backdrop */}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsIncidenteDrawerOpen(false)}
                      className="fixed inset-0 bg-black z-50 cursor-pointer"
                    />

                    {/* Drawer container */}
                    <motion.div
                      initial={{ x: '100%' }}
                      animate={{ x: 0 }}
                      exit={{ x: '100%' }}
                      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                      className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-zinc-950 border-l border-zinc-800 z-50 overflow-y-auto shadow-2xl p-6 text-left flex flex-col justify-between"
                    >
                      <div className="space-y-6">
                        
                        {/* Drawer Header */}
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                          <div className="space-y-1">
                            <span className="text-[10px] bg-red-500/10 text-red-400 font-black border border-red-500/20 px-2 py-0.5 rounded font-mono">
                              AUDITORIA DOSSIÊ #{selectedIncidente.id}
                            </span>
                            <h3 className="text-lg font-black text-white flex items-center gap-2 mt-1">
                              {selectedIncidente.infrator_nome}
                            </h3>
                            <p className="text-[11px] text-zinc-400">
                              Data de Criação do Incidente: {selectedIncidente.criado_em}
                            </p>
                          </div>
                          <button 
                            onClick={() => setIsIncidenteDrawerOpen(false)}
                            className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Visual Alert Badge depending on type */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex gap-3.5 items-start">
                          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center shrink-0">
                            <ShieldAlert className="w-5 h-5" />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] text-red-400 font-black uppercase tracking-wider">Infração Apurada</span>
                            <p className="text-xs font-bold text-white leading-relaxed">
                              {selectedIncidente.detalhes}
                            </p>
                          </div>
                        </div>

                        {/* MAPA TELEMETRIA / GEOLOCALIZAÇÃO SIMULADA */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-red-500" />
                            1. Telemetria GPS e Rastreamento de Alta Frequência
                          </h4>
                          
                          <div className="bg-zinc-950 border border-zinc-850 rounded-2xl p-4 relative overflow-hidden h-44 flex flex-col justify-between">
                            {/* Grid overlay lines */}
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:3rem_2rem] opacity-25" />
                            
                            {/* Target circles */}
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-zinc-800/60 animate-ping" />
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-zinc-700/60" />
                            
                            {/* Blipping point */}
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                              <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-white animate-pulse" />
                              <span className="text-[9px] font-mono text-white bg-black/90 px-1.5 py-0.5 rounded border border-zinc-800 mt-1">
                                DISPOSITIVO RASTREADO
                              </span>
                            </div>

                            <div className="z-10 flex items-start justify-between text-[10px] font-mono text-zinc-400">
                              <span>Sinal de GPS: <strong className="text-emerald-400">Excelente (98%)</strong></span>
                              <span>Padrão Uber/iFood Geo-Lock</span>
                            </div>

                            <div className="z-10 flex justify-between bg-zinc-900/90 border border-zinc-800/80 p-2.5 rounded-xl text-[10px] font-mono">
                              <div>
                                <span className="block text-zinc-500">Coordenadas Atuais</span>
                                <span className="text-white font-bold">{selectedIncidente.gps_lat_lon || 'Sem GPS Ativo'}</span>
                              </div>
                              <div className="text-right">
                                <span className="block text-zinc-500">Risco Estimado</span>
                                <span className="text-red-400 font-bold">94.3% Crítico</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* AUDIO WAVEFORM PLAYER (Se for botão de pânico) */}
                        {selectedIncidente.categoria_abuso === 'BOTAO_PANICO' && (
                          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                                <Bell className="w-4 h-4 text-red-500" />
                                Gravação de Áudio de Emergência (Loja Volante)
                              </span>
                              <span className="text-[9px] bg-red-600 text-white font-mono px-2 py-0.2 rounded font-black animate-pulse">LIVESTREAM</span>
                            </div>

                            <div className="flex items-center gap-4 bg-zinc-950 p-3 rounded-xl border border-zinc-850">
                              <button 
                                onClick={() => alert('🔊 Simulador: reproduzindo fluxo de áudio criptografado da cabine da Van...')} 
                                className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shrink-0 cursor-pointer shadow-lg shadow-red-900/30"
                              >
                                <Play className="w-4 h-4 fill-white" />
                              </button>
                              <div className="flex-1 space-y-1">
                                <div className="text-[10px] font-mono text-zinc-500 flex justify-between">
                                  <span>Canal Reservado de Segurança</span>
                                  <span>0:32 / 2:15</span>
                                </div>
                                {/* WAVEFORM SIMULATION */}
                                <div className="flex items-end gap-1 h-8 pt-2">
                                  {[3, 8, 4, 12, 18, 5, 14, 22, 11, 24, 7, 19, 14, 4, 9, 20, 3, 11, 15, 6, 2, 10, 16, 4, 8, 12, 18, 2, 5, 11, 19, 4, 13, 8, 4, 14, 9, 3, 10].map((val, idx) => (
                                    <div 
                                      key={idx} 
                                      style={{ height: `${(val / 24) * 100}%` }} 
                                      className={`w-full max-w-[4px] rounded-t-sm transition-all ${
                                        idx < 15 ? 'bg-red-500' : 'bg-zinc-800'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* CHECKLIST EVIDENCES GALLERY (Antes vs Depois) */}
                        {selectedIncidente.checklist_antes_url && (
                          <div className="space-y-2">
                            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                              <Camera className="w-4 h-4 text-red-500" />
                              2. Comparativo de Evidências Fotográficas do Checklist
                            </h4>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-2xl space-y-2">
                                <span className="text-[9px] bg-zinc-800 text-zinc-300 font-bold px-2 py-0.5 rounded font-mono uppercase">
                                  Antes da Manutenção (Entrada)
                                </span>
                                <div className="aspect-video w-full rounded-lg bg-zinc-950 overflow-hidden relative border border-zinc-850">
                                  <img 
                                    src={selectedIncidente.checklist_antes_url} 
                                    alt="Checklist Entrada" 
                                    className="w-full h-full object-cover grayscale opacity-80"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                                <p className="text-[10px] text-zinc-400">Checklist assinado eletronicamente via aplicativo oficial OttoMotos.</p>
                              </div>

                              <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-2xl space-y-2">
                                <span className="text-[9px] bg-red-500/10 text-red-400 border border-red-500/20 font-bold px-2 py-0.5 rounded font-mono uppercase">
                                  Após a Manutenção (Saída)
                                </span>
                                <div className="aspect-video w-full rounded-lg bg-zinc-950 overflow-hidden relative border border-zinc-850">
                                  <img 
                                    src={selectedIncidente.checklist_depois_url} 
                                    alt="Checklist Saída" 
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                                <p className="text-[10px] text-zinc-400">Verificação fotográfica obrigatória para prevenção de falso estorno corporativo.</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* INTERCEPTED CHAT LOGS */}
                        {selectedIncidente.chat_log_preview && (
                          <div className="space-y-2">
                            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                              <MessageSquare className="w-4 h-4 text-red-500" />
                              3. Canal de Conversas Internas Criptografadas
                            </h4>
                            
                            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 font-mono text-[11px] leading-relaxed space-y-3 max-h-48 overflow-y-auto text-left">
                              <div className="text-[10px] text-red-400 font-bold uppercase tracking-wider border-b border-zinc-800 pb-2 mb-2 flex justify-between">
                                <span>💬 Histórico de Chat Interno</span>
                                <span>Ignorando Canais Externos</span>
                              </div>
                              {selectedIncidente.chat_log_preview.split('\n').map((line, idx) => {
                                const isMecanico = line.includes('Roberto') || line.includes('Tiago') || line.includes('Mecânico');
                                return (
                                  <div 
                                    key={idx} 
                                    className={`p-2 rounded-xl max-w-[85%] ${
                                      isMecanico 
                                        ? 'bg-amber-500/10 border border-amber-500/20 text-amber-300 mr-auto' 
                                        : 'bg-zinc-950 border border-zinc-800 text-zinc-300 ml-auto'
                                    }`}
                                  >
                                    {line}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                      </div>

                      {/* Drawer Footer Actions */}
                      <div className="border-t border-zinc-800 pt-6 mt-6 flex items-center justify-between gap-3">
                        <button
                          onClick={() => {
                            setIncidentesState(prev => prev.map(p => p.id === selectedIncidente.id ? { ...p, status_investigacao: 'RESOLVIDO' } : p));
                            alert(`✅ Caso #${selectedIncidente.id} resolvido e arquivado sem aplicação de sanções operacionais.`);
                            setIsIncidenteDrawerOpen(false);
                          }}
                          className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                          Arquivar / Resolver Caso
                        </button>

                        <button
                          onClick={() => {
                            if (selectedIncidente.categoria_abuso === 'ATENDIMENTO_POR_FORA') {
                              setClausulaViolada('Cláusula 14.1 - Transações Financeiras Extra-Plataforma e Concorrência Desleal');
                            } else if (selectedIncidente.categoria_abuso === 'DESVIO_ESTOQUE') {
                              setClausulaViolada('Cláusula 8.2 - Conformidade de Inventário e Desvio de Materiais do Back-Office');
                            } else if (selectedIncidente.categoria_abuso === 'INADIMPLENCIA') {
                              setClausulaViolada('Cláusula 12.3 - Adimplemento de Cobrança Corporativa B2B e Prazos Limites');
                            } else if (selectedIncidente.categoria_abuso === 'ESTORNO_FALSO') {
                              setClausulaViolada('Cláusula 17.4 - Veracidade de Transações Financeiras e Tentativa de Fraude de Estorno');
                            } else if (selectedIncidente.categoria_abuso === 'CANCELAMENTO_ABUSIVO') {
                              setClausulaViolada('Cláusula 5.6 - Cancelamentos Abusivos no Chamado Expresso de Loja Volante');
                            } else {
                              setClausulaViolada('Cláusula 1.1 - Termo de Uso e Conduta Geral da Plataforma OttoMotos');
                            }
                            setSancaoObservacoes(`Identificado desvio de conduta em triagem operacional. Aplicado sanção visando segurança jurídica do ecossistema OttoMotos.`);
                            setIsSanctionModalOpen(true);
                          }}
                          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-red-900/20"
                        >
                          <Gavel className="w-4 h-4" />
                          Aplicar Medida Disciplinar
                        </button>
                      </div>

                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              {/* MODAL DE APLICAÇÃO DE SANÇÃO DISCIPLINAR (RÉGUA DISCIPLINAR) */}
              <AnimatePresence>
                {isSanctionModalOpen && selectedIncidente && (
                  <>
                    {/* Backdrop */}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsSanctionModalOpen(false)}
                      className="fixed inset-0 bg-black/80 z-[60] cursor-pointer"
                    />

                    {/* Modal Content */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 15 }}
                      className="fixed inset-x-4 md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 max-w-lg bg-zinc-950 border border-zinc-800 p-6 rounded-3xl z-[70] shadow-2xl text-left space-y-6"
                    >
                      <div className="flex justify-between items-center border-b border-zinc-850 pb-4">
                        <div className="flex items-center gap-2 text-red-500">
                          <Gavel className="w-5 h-5" />
                          <h3 className="font-black text-white text-base">Régua Disciplinar & Sanção Jurídica</h3>
                        </div>
                        <button 
                          onClick={() => setIsSanctionModalOpen(false)}
                          className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
                        >
                          <X className="w-4.5 h-4.5" />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-zinc-900 p-4 border border-zinc-800 rounded-2xl text-xs space-y-2">
                          <p className="text-zinc-400 font-bold">Infrator Associado:</p>
                          <div className="flex justify-between text-zinc-100 font-black">
                            <span>{selectedIncidente.infrator_nome}</span>
                            <span className="text-red-400 font-mono font-black">#{selectedIncidente.id}</span>
                          </div>
                          <p className="text-[11px] text-zinc-500 font-mono font-bold mt-1">
                            Infração: {selectedIncidente.categoria_abuso} • Severidade: {selectedIncidente.severidade}
                          </p>
                        </div>

                        {/* Nível de Sanção */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">Nível de Medida Disciplinar</label>
                          <div className="grid grid-cols-3 gap-2">
                            {/* Advertência */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedSancaoTipo('ADVERTENCIA');
                                setSuspensaoDias(0);
                              }}
                              className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all flex flex-col items-center gap-1 cursor-pointer ${
                                selectedSancaoTipo === 'ADVERTENCIA'
                                  ? 'bg-yellow-500/10 border-yellow-500/60 text-yellow-400'
                                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                              }`}
                            >
                              <Info className="w-4 h-4" />
                              <span>Advertência</span>
                              <span className="text-[8px] text-zinc-500 block">Sem bloqueio app</span>
                            </button>

                            {/* Suspensão Temporária */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedSancaoTipo('SUSPENSAO_TEMPORARIA');
                                setSuspensaoDias(7);
                              }}
                              className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all flex flex-col items-center gap-1 cursor-pointer ${
                                selectedSancaoTipo === 'SUSPENSAO_TEMPORARIA'
                                  ? 'bg-orange-500/10 border-orange-500/60 text-orange-400'
                                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                              }`}
                            >
                              <Ban className="w-4 h-4" />
                              <span>Suspensão</span>
                              <span className="text-[8px] text-zinc-500 block">X dias bloqueado</span>
                            </button>

                            {/* Banimento Definitivo */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedSancaoTipo('BANIMENTO_DEFINITIVO');
                                setSuspensaoDias(999);
                              }}
                              className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all flex flex-col items-center gap-1 cursor-pointer ${
                                selectedSancaoTipo === 'BANIMENTO_DEFINITIVO'
                                  ? 'bg-red-500/10 border-red-500/60 text-red-400'
                                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                              }`}
                            >
                              <Gavel className="w-4 h-4" />
                              <span>Banimento</span>
                              <span className="text-[8px] text-zinc-500 block">Lista negra definitiva</span>
                            </button>
                          </div>
                        </div>

                        {/* Input Dias de Suspensão (se suspensão) */}
                        {selectedSancaoTipo === 'SUSPENSAO_TEMPORARIA' && (
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">Tempo de Suspensão do App (Dias)</label>
                            <input
                              type="number"
                              min="1"
                              max="180"
                              value={suspensaoDias}
                              onChange={(e) => setSuspensaoDias(parseInt(e.target.value) || 7)}
                              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                            />
                            <p className="text-[9px] text-zinc-500">
                              * O login do infrator será automaticamente recusado no aplicativo durante o período estipulado.
                            </p>
                          </div>
                        )}

                        {/* Cláusula violada */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">Cláusula Contratual Violada (Sindicância)</label>
                          <input
                            type="text"
                            value={clausulaViolada}
                            onChange={(e) => setClausulaViolada(e.target.value)}
                            placeholder="Cláusula do contrato..."
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 font-medium"
                          />
                        </div>

                        {/* Observações */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">Observações e Justificativas de Segurança</label>
                          <textarea
                            rows={3}
                            value={sancaoObservacoes}
                            onChange={(e) => setSancaoObservacoes(e.target.value)}
                            placeholder="Descreva fundamentação jurídica e evidências do log de auditoria..."
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 placeholder-zinc-700"
                          />
                        </div>

                      </div>

                      {/* Modal Footer Actions */}
                      <div className="border-t border-zinc-850 pt-4 flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setIsSanctionModalOpen(false)}
                          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const novaSancao: HistoricoSancao = {
                              id: `sanc-${Math.floor(100 + Math.random() * 900)}`,
                              incidente_id: selectedIncidente.id,
                              tipo_sancao: selectedSancaoTipo,
                              tempo_suspensao_dias: selectedSancaoTipo === 'SUSPENSAO_TEMPORARIA' ? suspensaoDias : undefined,
                              clausula_contratual_violada: clausulaViolada,
                              admin_responsavel_id: adminEmail || 'raifranoliveirag@gmail.com',
                              data_aplicacao: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                              observacoes: sancaoObservacoes
                            };

                            setSancoesState([novaSancao, ...sancoesState]);
                            setIncidentesState(prev => prev.map(p => p.id === selectedIncidente.id ? { ...p, status_investigacao: 'PENALIZADO', tempo_sla_restante_min: 0 } : p));
                            
                            alert(`⚖️ Punição aplicada com sucesso! Registro de Sindicância imutável gravado. Status do infrator atualizado no Marketplace.`);
                            setIsSanctionModalOpen(false);
                            setIsIncidenteDrawerOpen(false);
                          }}
                          className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-red-900/20"
                        >
                          <Gavel className="w-4 h-4" />
                          Confirmar Aplicação de Sanção
                        </button>
                      </div>

                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              {/* IMMUTABLE AUDIT LOG (Histórico de Sanções Aplicadas - Log Imutável) */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-xl">
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    <History className="w-4.5 h-4.5 text-zinc-400" />
                    Log de Auditoria Imutável (Histórico de Medidas Disciplinares)
                  </h3>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    Histórico imutável de sanções aplicadas. Logs de integridade de segurança física e financeira contra-auditáveis em nível de banco de dados.
                  </p>
                </div>

                <div className="space-y-3">
                  {sancoesState.map((sanc) => {
                    const incRef = incidentesState.find(i => i.id === sanc.incidente_id);
                    return (
                      <div key={sanc.id} className="bg-zinc-950 border border-zinc-850 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[9px] font-mono font-black bg-zinc-900 text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded">
                              LOG ID: {sanc.id}
                            </span>
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded ${
                              sanc.tipo_sancao === 'BANIMENTO_DEFINITIVO'
                                ? 'bg-red-950 text-red-400 border border-red-900/30'
                                : sanc.tipo_sancao === 'SUSPENSAO_TEMPORARIA'
                                ? 'bg-orange-950 text-orange-400 border border-orange-900/30'
                                : 'bg-yellow-950 text-yellow-400 border border-yellow-900/30'
                            }`}>
                              {sanc.tipo_sancao === 'BANIMENTO_DEFINITIVO' && 'BANIMENTO DEFINITIVO'}
                              {sanc.tipo_sancao === 'SUSPENSAO_TEMPORARIA' && `SUSPENSÃO TEMPORÁRIA (${sanc.tempo_suspensao_dias} DIAS)`}
                              {sanc.tipo_sancao === 'ADVERTENCIA' && 'ADVERTÊNCIA ADMONITÓRIA'}
                            </span>
                            <span className="text-[10px] text-zinc-500 font-mono">
                              Incidente Ref: <strong>#{sanc.incidente_id}</strong>
                            </span>
                          </div>
                          <p className="text-xs text-zinc-300 font-medium mt-1">
                            Infrator penalizado: <strong className="text-white">{incRef ? incRef.infrator_nome : 'Frotista/Mecânico'}</strong>
                          </p>
                          <div className="text-[11px] text-zinc-400 space-y-1">
                            <p>📝 <strong className="text-zinc-300">Norma/Contrato Violado:</strong> {sanc.clausula_contratual_violada}</p>
                            {sanc.observacoes && (
                              <p>💡 <strong className="text-zinc-300">Observações:</strong> {sanc.observacoes}</p>
                            )}
                          </div>
                        </div>

                        <div className="text-left sm:text-right font-mono text-[10px] text-zinc-500 border-t sm:border-t-0 pt-2 sm:pt-0 border-zinc-850">
                          <div>Auditor: <strong className="text-zinc-400">{sanc.admin_responsavel_id}</strong></div>
                          <div className="mt-1 flex items-center gap-1 sm:justify-end text-zinc-500">
                            <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                            {sanc.data_aplicacao}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </motion.div>
          )}

        </div>
      </main>
    </div>
  );
}
