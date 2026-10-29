(function () {
  'use strict';

  /* ==========================================================================
     NETS BUSINESS CORE PWA - SINGLE APP ENGINE
     Marca Marge + Nets | Vanilla JS IIFE Single Source of Truth
     ========================================================================== */

  // --- Constantes de Almacenamiento ---
  const STORAGE_KEYS = {
    AUTH: 'nets_auth',
    THEME: 'nets_theme',
    APPS: 'nets_apps_state_v3',
    ONBOARDED: 'nets_onboarded',
    DEALS: 'nets_crm_deals_v2',
    CHATS: 'nets_chat_history_v2'
  };

  // --- Estado Global ---
  let pwaInstallEvent = null;
  let activeChatId = 'chat-1';
  let isMobileChatDetail = false;

  // Usuario predeterminado (Colombia)
  const DEFAULT_USER = {
    name: 'Gerardo Ortiz',
    shortName: 'Ger',
    email: 'gerardo.ortiz@nets.com.co',
    role: 'Director Comercial Regional',
    avatar: 'GO',
    city: 'Bogotá D.C., Colombia',
    streakDays: 14,
    level: 'Líder Platinum'
  };

  function resolveUser(auth) {
    const u = auth && typeof auth === 'object' ? auth : {};
    const name = (u.name || u.displayName || DEFAULT_USER.name || 'Usuario').trim();
    const parts = name.split(/\s+/).filter(Boolean);
    const initials = ((parts[0] && parts[0][0]) || 'U') + ((parts[1] && parts[1][0]) || '');
    const avatar = (u.avatar && String(u.avatar) !== 'undefined')
      ? String(u.avatar)
      : initials.toUpperCase();
    return {
      name,
      shortName: (u.shortName && String(u.shortName) !== 'undefined') ? u.shortName : (parts[0] || 'Usuario'),
      email: u.email || DEFAULT_USER.email,
      role: u.role || DEFAULT_USER.role,
      avatar,
      city: u.city || DEFAULT_USER.city,
      streakDays: u.streakDays || DEFAULT_USER.streakDays || 0,
      level: u.level || DEFAULT_USER.level
    };
  }

  // Producto y mock compartido (única fuente de verdad entre pantallas)
  const PRODUCT = {
    name: 'Nets Business Core',
    shortName: 'Nets Core',
    parent: 'Nets Company',
    edition: 'Business Core'
  };

  const CRM_STAGES = [
    { id: 'prospeccion', label: 'Pendiente' },
    { id: 'calificacion', label: 'Calificación' },
    { id: 'propuesta', label: 'Propuesta' },
    { id: 'negociacion', label: 'Negociación' },
    { id: 'ganado', label: 'Ganado' },
    { id: 'perdido', label: 'Perdido' }
  ];

  // Apps: Fuente única de la verdad
  const INITIAL_APPS = [
    {
      id: 'crm',
      title: 'Oportunidades',
      icon: 'crm',
      enabled: true,
      route: '#/crm',
      badge: '6 fases',
      desc: 'Pipeline comercial, pronósticos ponderados y metas B2B'
    },
    {
      id: 'chat',
      title: 'WhatsApp',
      icon: 'chat',
      enabled: true,
      route: '#/chat',
      badge: 'En vivo',
      desc: 'Bandeja omnicanal conectada a Meta Cloud API y bot IA'
    },
    {
      id: 'inventory',
      title: 'Inventario',
      icon: 'box',
      enabled: false,
      route: '#/inventory',
      badge: '4 bodegas',
      desc: 'Control multisede Montevideo, Guayabal, Yumbo y Fontibón'
    },
    {
      id: 'invoice',
      title: 'Facturación DIAN',
      icon: 'receipt',
      enabled: false,
      route: '#/invoice',
      badge: 'UBL 2.1',
      desc: 'Emisión electrónica, CUFE, eventos Radian y notas crédito'
    },
    {
      id: 'support',
      title: 'Casos y Soporte',
      icon: 'headset',
      enabled: false,
      route: '#/support',
      badge: 'Mesa ITIL',
      desc: 'Acuerdos de nivel de servicio (SLA), tickets N1 a N3 y escalamiento'
    }
  ];

  // Oportunidades CRM (6 etapas reales sin palabra "ejemplo")
  const INITIAL_DEALS = [
    {
      id: 'deal-101',
      title: 'Grupo Nutresa - Enlace SD-WAN y Nube Híbrida',
      client: 'Grupo Nutresa S.A.',
      clientShort: 'Grupo Nutresa',
      stage: 'prospeccion',
      amount: 48500000,
      initials: 'GN',
      tag: 'Alimentos',
      days: 4,
      priority: 'alta'
    },
    {
      id: 'deal-102',
      title: 'Cementos Argos - Renovación Datacenter Principal',
      client: 'Cementos Argos S.A.',
      clientShort: 'Cementos Argos',
      stage: 'calificacion',
      amount: 135000000,
      initials: 'CA',
      tag: 'Construcción',
      days: 9,
      priority: 'urgente'
    },
    {
      id: 'deal-103',
      title: 'Celsia Energía - Bot WhatsApp Atención Cuadrillas',
      client: 'Celsia Colombia S.A. E.S.P.',
      clientShort: 'Celsia',
      stage: 'propuesta',
      amount: 64200000,
      initials: 'CE',
      tag: 'Energía',
      days: 12,
      priority: 'media'
    },
    {
      id: 'deal-104',
      title: 'Bancolombia - Seguridad Perimetral y SOC Nets Guard',
      client: 'Bancolombia S.A.',
      clientShort: 'Bancolombia',
      stage: 'negociacion',
      amount: 218000000,
      initials: 'BC',
      tag: 'Banca y Fintech',
      days: 18,
      priority: 'alta'
    },
    {
      id: 'deal-105',
      title: 'Carvajal Pulpa y Papel - Cableado Estructurado Planta Yumbo',
      client: 'Carvajal S.A.',
      clientShort: 'Carvajal',
      stage: 'ganado',
      amount: 89000000,
      initials: 'CJ',
      tag: 'Manufactura',
      days: 25,
      priority: 'baja'
    },
    {
      id: 'deal-106',
      title: 'Rappi Colombia - Interconexión Dark Fiber Sede Chicó',
      client: 'Rappi S.A.S.',
      clientShort: 'Rappi',
      stage: 'perdido',
      amount: 42000000,
      initials: 'RP',
      tag: 'Tecnología',
      days: 31,
      priority: 'baja'
    },
    {
      id: 'deal-107',
      title: 'Terpel - Monitoreo IoT Estaciones de Servicio',
      client: 'Organización Terpel S.A.',
      clientShort: 'Terpel',
      stage: 'propuesta',
      amount: 112000000,
      initials: 'TP',
      tag: 'Petróleo & Gas',
      days: 6,
      priority: 'alta'
    }
  ];

  // Chats realistas estilo WhatsApp
  const INITIAL_CHATS = [
    {
      id: 'chat-1',
      name: 'Ing. Carlos Mario Restrepo',
      company: 'Grupo Nutresa S.A.',
      phone: '+57 314 829 1104',
      avatar: 'CR',
      online: true,
      lastTime: '10:42 a. m.',
      unread: 2,
      messages: [
        { id: 'm1', from: 'them', text: 'Buenos días Gerardo, revisamos el pliego de la conectividad en Medellín.', time: '10:30 a. m.' },
        { id: 'm2', from: 'them', text: '¿Es posible incluir redundancia 4G con tarjeta eSIM multired?', time: '10:31 a. m.' },
        { id: 'm3', from: 'me', text: '¡Buen día, Carlos! Por supuesto, Nets incluye failover automático a red Claro/Tigo sin costo adicional.', time: '10:38 a. m.' },
        { id: 'm4', from: 'them', text: 'Excelente. Envíame la adenda con la propuesta económica para firmar.', time: '10:42 a. m.' }
      ]
    },
    {
      id: 'chat-2',
      name: 'Dra. Marcela Echeverri',
      company: 'Cementos Argos S.A.',
      phone: '+57 301 554 9081',
      avatar: 'ME',
      online: false,
      lastTime: 'Ayer',
      unread: 0,
      messages: [
        { id: 'm1', from: 'them', text: 'Hola Gerardo, el comité directivo aprobó el presupuesto para la fase 1.', time: 'Ayer' },
        { id: 'm2', from: 'me', text: 'Excelente noticia Marcela. Coordinamos visita del ingeniero residente para el lunes.', time: 'Ayer' }
      ]
    },
    {
      id: 'chat-3',
      name: 'Bot Asistente Nets IA',
      company: 'Canal Oficial Nets Colombia',
      phone: '+57 320 000 8899',
      avatar: 'AI',
      online: true,
      lastTime: '09:15 a. m.',
      unread: 0,
      messages: [
        { id: 'm1', from: 'them', text: 'Reporte matutino: 12 cotizaciones sincronizadas exitosamente con la DIAN.', time: '09:00 a. m.' },
        { id: 'm2', from: 'them', text: 'Se detectó latencia menor a 11ms en el nodo troncal Bogotá-Cali.', time: '09:15 a. m.' }
      ]
    }
  ];

  // Inventario y Facturas Mock
  const INITIAL_INVENTORY = [
    { sku: 'NTS-RTR-900', desc: 'Router Edge Óptico 10Gbps SFP+', stock: 24, min: 5, bodega: 'Montevideo (Bogotá)', cost: 3850000 },
    { sku: 'NTS-SWT-48P', desc: 'Switch Capa 3 Gestionable 48 Puertos PoE+', stock: 42, min: 10, bodega: 'Guayabal (Medellín)', cost: 2490000 },
    { sku: 'NTS-AP-W6E', desc: 'Punto de Acceso Wi-Fi 6E Enterprise Mesh', stock: 110, min: 25, bodega: 'Yumbo (Valle)', cost: 890000 },
    { sku: 'NTS-FBR-SM1', desc: 'Bobina Fibra Monomodo 2km Drop Blindada', stock: 18, min: 4, bodega: 'Fontibón (Bogotá)', cost: 1420000 },
    { sku: 'NTS-UPS-3KV', desc: 'UPS Online Onda Senoidal Pura 3000VA Rack', stock: 7, min: 3, bodega: 'Montevideo (Bogotá)', cost: 5120000 }
  ];

  const INITIAL_INVOICES = [
    { prefix: 'SETT', number: 8920, client: 'Bancolombia S.A.', nit: '890.903.938-8', amount: 259420000, date: '2026-10-12', status: 'Validada DIAN', cufe: 'f83a79d20c8b3e1' },
    { prefix: 'SETT', number: 8921, client: 'Celsia Colombia S.A. E.S.P.', nit: '900.284.453-1', amount: 76398000, date: '2026-10-13', status: 'Validada DIAN', cufe: 'c491b827e69a03f' },
    { prefix: 'SETT', number: 8922, client: 'Organización Terpel S.A.', nit: '860.004.522-3', amount: 133280000, date: '2026-10-14', status: 'Validada DIAN', cufe: '98d41cf5e02ab71' },
    { prefix: 'SETT', number: 8923, client: 'Rappi S.A.S.', nit: '900.843.801-0', amount: 49980000, date: '2026-10-14', status: 'En Proceso', cufe: 'Pendiente' }
  ];

  // KPIs derivados del mock compartido (home ≡ CRM ≡ facturas)
  function computeMockKpis(deals) {
    const weights = { prospeccion: 0.1, calificacion: 0.3, propuesta: 0.5, negociacion: 0.8, ganado: 1, perdido: 0 };
    const weighted = deals.reduce((s, d) => s + d.amount * (weights[d.stage] ?? 0), 0);
    const salesMonth = Math.round(weighted);
    const activeOpps = deals.filter(d => d.stage !== 'perdido').length;
    const newOpps = deals.length;
    return {
      goalLabel: 'Meta Octubre 2026',
      goalTarget: 450000000,
      goalCurrent: salesMonth,
      salesMonth,
      salesDelta: '+18.2%',
      goalFoot: 'Rendimiento +12.4% superior a septiembre',
      newOpps,
      activeOpps,
      botChats: 1836,
      botSla: '99.2% SLA',
      quotes: 34,
      quotesNote: '34 radicadas'
    };
  }

  const MOCK_ACTIVITY = [
    { titleHtml: '<strong>Bancolombia S.A.</strong> avanzó a Negociación final.', time: 'Hace 14 minutos · Auditoría Nets CRM' },
    { titleHtml: '<strong>Celsia Colombia S.A. E.S.P.</strong> recibió propuesta de bot WhatsApp.', time: 'Hace 1 hora · WhatsApp' },
    { titleHtml: 'Factura SETT-8921 validada ante la DIAN.', time: 'Hoy 09:12 · Facturación' },
    { titleHtml: 'Stock crítico en UPS 3KVA — bodega Montevideo.', time: 'Ayer · Inventario' }
  ];

  // --- Recuperación de Estado ---
  function getStoredAuth() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUTH);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  function setStoredAuth(user) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    }
  }

  function getAppsState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.APPS);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    localStorage.setItem(STORAGE_KEYS.APPS, JSON.stringify(INITIAL_APPS));
    return INITIAL_APPS;
  }

  function saveAppsState(apps) {
    localStorage.setItem(STORAGE_KEYS.APPS, JSON.stringify(apps));
  }

  function getDeals() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DEALS);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    localStorage.setItem(STORAGE_KEYS.DEALS, JSON.stringify(INITIAL_DEALS));
    return INITIAL_DEALS;
  }

  function saveDeals(deals) {
    localStorage.setItem(STORAGE_KEYS.DEALS, JSON.stringify(deals));
  }

  function getChats() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CHATS);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(INITIAL_CHATS));
    return INITIAL_CHATS;
  }

  function saveChats(chats) {
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
  }

  // --- Utilidades ---
  function formatCOP(value) {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(value);
  }

  function formatDate(iso) {
    if (!iso || iso === 'Pendiente') return iso || '—';
    const d = new Date(iso + 'T12:00:00');
    if (Number.isNaN(d.getTime())) return iso;
    return new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }).format(d);
  }

  function getGreeting(name) {
    const hour = new Date().getHours();
    let salutation = 'Buenas noches';
    if (hour >= 5 && hour < 12) salutation = 'Buenos días';
    else if (hour >= 12 && hour < 19) salutation = 'Buenas tardes';
    return `${salutation}, ${name}`;
  }

  // Generador de Iconos SVG Familia Coherente (Stroke #2DAAE1 o currentColor)
  function icon(name, color = 'var(--blue)', size = 18) {
    const paths = {
      crm: '<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>',
      chat: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
      box: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
      receipt: '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z"/><path d="M16 8H8"/><path d="M16 12H8"/><path d="M13 16H8"/>',
      headset: '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>',
      apps: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>',
      home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
      search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
      moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
      sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
      download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
      logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
      send: '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
      check: '<polyline points="20 6 9 17 4 12"/>',
      arrowLeft: '<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>',
      plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
      award: '<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>',
      bolt: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
      close: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'
    };

    const svgPath = paths[name] || paths.apps;
    return `
      <svg class="nets-icon nets-icon-${name}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        ${svgPath}
      </svg>
    `.trim();
  }

  // Notificaciones Toast Modernas
  function toast(message, type = 'info', duration = 3200) {
    let container = document.getElementById('nets-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'nets-toast-container';
      container.className = 'nets-toast-container';
      document.body.appendChild(container);
    }

    const toastEl = document.createElement('div');
    toastEl.className = `nets-toast nets-toast-${type} fade-up`;
    const iconColor = type === 'success' ? '#2DAAE1' : type === 'error' ? '#EF4444' : '#2DAAE1';
    toastEl.innerHTML = `
      <span class="nets-toast-icon">${icon(type === 'success' ? 'check' : 'bolt', iconColor, 18)}</span>
      <span class="nets-toast-msg">${message}</span>
    `;

    container.appendChild(toastEl);
    setTimeout(() => {
      toastEl.classList.add('nets-toast-hide');
      setTimeout(() => toastEl.remove(), 260);
    }, duration);
  }

  // Count Up fluido para KPIs
  function countUp(element, endVal, duration = 1200, isCurrency = false) {
    if (!element) return;
    const finalText = isCurrency ? formatCOP(endVal) : endVal.toLocaleString('es-CO');
    const normalized = (s) => (s || '').replace(/\s/g, '');
    // Si el HTML ya pintó el valor final (mock compartido), no reinicia en 0
    if (normalized(element.textContent) === normalized(finalText)) {
      element.textContent = finalText;
      return;
    }
    const startVal = 0;
    const startTime = performance.now();
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isReduced) {
      element.textContent = finalText;
      return;
    }

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startVal + (endVal - startVal) * ease);

      element.textContent = isCurrency ? formatCOP(current) : current.toLocaleString('es-CO');

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = isCurrency ? formatCOP(endVal) : endVal.toLocaleString('es-CO');
      }
    }
    requestAnimationFrame(update);
  }

  // Canvas Sparkline simple sin dependencias
  function renderSparkline(canvas, dataPoints, strokeColor = '#2DAAE1') {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth || 120;
    const height = canvas.height = canvas.offsetHeight || 36;
    ctx.clearRect(0, 0, width, height);

    if (!dataPoints || dataPoints.length < 2) return;
    const min = Math.min(...dataPoints);
    const max = Math.max(...dataPoints);
    const range = (max - min) || 1;

    const points = dataPoints.map((val, idx) => {
      const x = (idx / (dataPoints.length - 1)) * (width - 8) + 4;
      const y = height - 4 - ((val - min) / range) * (height - 12);
      return { x, y };
    });

    // Línea de tendencia
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Relleno sutil gradiente
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, 'rgba(45, 170, 225, 0.28)');
    grad.addColorStop(1, 'rgba(45, 170, 225, 0.00)');
    ctx.lineTo(points[points.length - 1].x, height);
    ctx.lineTo(points[0].x, height);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
  }

  // Confeti de Victoria Canvas para Negocios Ganados (1.5s)
  function confetti(duration = 1500) {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    let canvas = document.getElementById('nets-confetti');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'nets-confetti';
      canvas.className = 'nets-confetti-canvas';
      document.body.appendChild(canvas);
    }
    const ctx = canvas.getContext('2d');
    const width = canvas.width = window.innerWidth;
    const height = canvas.height = window.innerHeight;

    const colors = ['#2DAAE1', '#0B2545', '#10B981', '#38BDF8', '#F59E0B', '#FFFFFF'];
    const count = 70;
    const particles = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: width / 2 + (Math.random() - 0.5) * 200,
        y: height / 2 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 1.6) * 14,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 10,
        alpha: 1
      });
    }

    const start = performance.now();
    function step(timestamp) {
      const elapsed = timestamp - start;
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // Gravedad
        p.rotation += p.vRot;
        p.alpha = Math.max(0, 1 - (elapsed / duration));

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });

      if (elapsed < duration) {
        requestAnimationFrame(step);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    }
    requestAnimationFrame(step);
  }

  // --- Paleta de Comandos Global (Ctrl+K / Cmd+K) ---
  function openCommandPalette() {
    let modal = document.getElementById('nets-cmd-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'nets-cmd-modal';
      modal.className = 'nets-cmd-modal';
      modal.innerHTML = `
        <div class="nets-cmd-backdrop" data-action="close-cmd"></div>
        <div class="nets-cmd-box fade-up">
          <div class="nets-cmd-search-wrap">
            ${icon('search', 'var(--blue)', 18)}
            <input type="text" id="nets-cmd-input" class="nets-cmd-input" placeholder="Buscar en Nets Business Core..." autofocus autocomplete="off" />
            <kbd class="nets-cmd-esc">ESC</kbd>
          </div>
          <div class="nets-cmd-results" id="nets-cmd-results"></div>
          <div class="nets-cmd-footer">
            <span>Navegue con <kbd>↑</kbd> <kbd>↓</kbd> y ejecute con <kbd>Enter</kbd></span>
            <span class="nets-cmd-tag">Nets Business Core</span>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.addEventListener('click', (e) => {
        if (e.target.dataset.action === 'close-cmd') closeCommandPalette();
      });

      const input = modal.querySelector('#nets-cmd-input');
      input.addEventListener('input', () => updateCmdResults(input.value));
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeCommandPalette();
        if (e.key === 'Enter') {
          const selected = modal.querySelector('.nets-cmd-item.active');
          if (selected) {
            selected.click();
          }
        }
      });
    }

    modal.classList.add('open');
    const inp = modal.querySelector('#nets-cmd-input');
    inp.value = '';
    inp.focus();
    updateCmdResults('');
  }

  function closeCommandPalette() {
    const modal = document.getElementById('nets-cmd-modal');
    if (modal) modal.classList.remove('open');
  }

  function updateCmdResults(query) {
    const container = document.getElementById('nets-cmd-results');
    if (!container) return;
    const q = query.trim().toLowerCase();

    const apps = getAppsState().filter(a => a.enabled);
    const deals = getDeals();

    const items = [
      { type: 'Acceso Rápido', title: 'Panel de Inicio', route: '#/home', icon: 'home' },
      ...apps.map(a => ({ type: 'Módulo Habilitado', title: a.title, route: a.route, icon: a.icon })),
      { type: 'Administración', title: 'Administración de aplicaciones', route: '#/apps', icon: 'apps' },
      ...deals.map(d => ({ type: 'Oportunidad B2B', title: `${d.client} · ${formatCOP(d.amount)}`, route: '#/crm', icon: 'crm' }))
    ].filter(item => !q || item.title.toLowerCase().includes(q) || item.type.toLowerCase().includes(q));

    if (items.length === 0) {
      container.innerHTML = `<div class="nets-cmd-empty">No se encontraron resultados para "${query}"</div>`;
      return;
    }

    container.innerHTML = items.slice(0, 7).map((item, idx) => `
      <div class="nets-cmd-item ${idx === 0 ? 'active' : ''}" data-route="${item.route}">
        <span class="nets-cmd-item-icon">${icon(item.icon, '#2DAAE1', 18)}</span>
        <div class="nets-cmd-item-info">
          <span class="nets-cmd-item-title">${item.title}</span>
          <span class="nets-cmd-item-badge">${item.type}</span>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.nets-cmd-item').forEach(el => {
      el.addEventListener('click', () => {
        const route = el.getAttribute('data-route');
        closeCommandPalette();
        if (route) window.location.hash = route;
      });
    });
  }

  // --- Modal Onboarding de Primera Visita ---
  function checkFirstVisitOnboarding() {
    const onboarded = localStorage.getItem(STORAGE_KEYS.ONBOARDED);
    if (onboarded) return;
    if (document.getElementById('nets-onboarding-modal')) return;

    const overlay = document.createElement('div');
    overlay.className = 'nets-modal-backdrop fade-up';
    overlay.id = 'nets-onboarding-modal';
    overlay.innerHTML = `
      <div class="nets-modal-card">
        <div class="nets-modal-header">
          <div class="nets-badge-pill">${icon('award', 'var(--blue)', 16)} Bienvenido a Nets Business Core</div>
          <button class="nets-btn-icon-ghost" id="btn-close-onboard" aria-label="Cerrar bienvenida">${icon('close', 'currentColor', 18)}</button>
        </div>
        <div class="nets-modal-body">
          <h2 class="nets-modal-title">Nets Business Core · Ecosistema Nets Colombia</h2>
          <p class="nets-modal-desc">
            Nets Business Core, plataforma corporativa para la alta dirección y gestión omnicanal. Administre oportunidades comerciales, conversaciones de WhatsApp API, control de inventario y facturación electrónica DIAN con total fluidez.
          </p>
          <div class="nets-features-checklist">
            <div class="nets-check-row">
              <span class="nets-check-dot">${icon('check', 'var(--blue)', 16)}</span>
              <span><strong>Pipeline B2B:</strong> Arrastre y suelte acuerdos comerciales entre 6 etapas auditadas.</span>
            </div>
            <div class="nets-check-row">
              <span class="nets-check-dot">${icon('check', 'var(--blue)', 16)}</span>
              <span><strong>WhatsApp Centralizado:</strong> Mensajería directa e inteligencia artificial de respuesta.</span>
            </div>
            <div class="nets-check-row">
              <span class="nets-check-dot">${icon('check', 'var(--blue)', 16)}</span>
              <span><strong>Atajo Global:</strong> Presione <kbd>Ctrl+K</kbd> o <kbd>Cmd+K</kbd> en cualquier vista para navegar al instante.</span>
            </div>
          </div>
        </div>
        <div class="nets-modal-footer">
          <button class="nets-btn nets-btn-primary" id="btn-finish-onboard">Entendido, Iniciar Sesión de Trabajo</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const close = () => {
      localStorage.setItem(STORAGE_KEYS.ONBOARDED, 'true');
      overlay.classList.add('nets-fade-out');
      setTimeout(() => overlay.remove(), 260);
      toast('Onboarding completado. Bienvenido a Nets Business Core.', 'success');
    };

    overlay.querySelector('#btn-close-onboard').addEventListener('click', close);
    overlay.querySelector('#btn-finish-onboard').addEventListener('click', close);
  }

  // --- Tema Oscuro / Claro ---
  function initTheme() {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    document.documentElement.setAttribute('data-theme', saved);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
    localStorage.setItem(STORAGE_KEYS.THEME, next);
    toast(`Modo ${next === 'dark' ? 'oscuro' : 'claro'} activado`, 'info', 1800);
    // Actualizar botón de vista si existe
    const btn = document.getElementById('btn-toggle-theme');
    if (btn) btn.innerHTML = icon(next === 'dark' ? 'sun' : 'moon', 'currentColor', 18);
  }

  // --- Banner ÚNICO: "Vista previa" + Instalar ---
  function renderSingleTopBanner() {
    let banner = document.getElementById('nets-top-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'nets-top-banner';
      banner.className = 'nets-top-banner';
      document.body.prepend(banner);
    }

    const showInstall = !!pwaInstallEvent;
    banner.innerHTML = `
      <div class="nets-banner-inner">
        <span class="nets-banner-tag">MODO DEMO</span>
        <span class="nets-banner-text nets-banner-text-quiet">Vista previa</span>
        ${showInstall ? `
          <button id="nets-btn-pwa-install" class="nets-btn-banner-install" aria-label="Instalar Nets Business Core">
            ${icon('download', '#FFFFFF', 16)}
            <span>Instalar</span>
          </button>
        ` : ''}
      </div>
    `;

    if (showInstall) {
      const btn = banner.querySelector('#nets-btn-pwa-install');
      if (btn) {
        btn.addEventListener('click', async () => {
          if (!pwaInstallEvent) return;
          pwaInstallEvent.prompt();
          const { outcome } = await pwaInstallEvent.userChoice;
          if (outcome === 'accepted') {
            toast('Instalando Nets Business Core en su dispositivo...', 'success');
          }
          pwaInstallEvent = null;
          renderSingleTopBanner();
        });
      }
    }
  }

  // --- Skeleton Loading Transición (400ms) ---
  function runWithSkeleton(appContainer, renderCallback) {
    appContainer.innerHTML = `
      <div class="nets-skeleton-view fade-up">
        <div class="nets-skel-header">
          <div class="nets-skel-line nets-skel-title"></div>
          <div class="nets-skel-line nets-skel-subtitle"></div>
        </div>
        <div class="nets-skel-grid">
          <div class="nets-skel-card"></div>
          <div class="nets-skel-card"></div>
          <div class="nets-skel-card"></div>
          <div class="nets-skel-card"></div>
        </div>
        <div class="nets-skel-board"></div>
      </div>
    `;

    setTimeout(() => {
      renderCallback();
      appContainer.classList.add('ready');
    }, 400);
  }

  // --- Layout Base: Sidebar Desktop + Header + Mobile Bottom Nav ---
  function wrapLayout(viewTitle, viewSubtitle, contentHtml, activeRoute) {
    const auth = getStoredAuth();
    const enabledApps = getAppsState().filter(a => a.enabled);
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    // Barra de navegación móvil inferior: Solo items habilitados principales
    const bottomNavItems = [
      { route: '#/home', iconName: 'home', label: 'Inicio' },
      ...enabledApps.slice(0, 3).map(a => ({
        route: a.route,
        iconName: a.icon,
        label: a.id === 'crm' ? 'CRM' : (a.id === 'chat' ? 'WhatsApp' : a.title.split(' ')[0])
      })),
      { route: '#/apps', iconName: 'apps', label: 'Apps' }
    ];

    return `
      <div class="nets-shell">
        <!-- Sidebar Desktop -->
        <aside class="nets-sidebar" aria-label="Navegación Principal">
          <div class="nets-sidebar-brand">
            <img src="logo-blanco.svg" alt="Nets Company" class="nets-sidebar-logo" onerror="this.outerHTML='<span class=\\'nets-logo-text\\'>NETS</span>'" />
            <span class="nets-sidebar-edition">${PRODUCT.edition}</span>
          </div>

          <nav class="nets-sidebar-nav">
            <div class="nets-sidebar-section-title">Principal</div>
            <a href="#/home" class="nets-nav-link ${activeRoute === '#/home' ? 'active' : ''}">
              ${icon('home', activeRoute === '#/home' ? '#2DAAE1' : 'currentColor', 18)}
              <span>Inicio</span>
            </a>

            <div class="nets-sidebar-section-title">Módulos Activos</div>
            ${enabledApps.map(app => `
              <a href="${app.route}" class="nets-nav-link ${activeRoute === app.route ? 'active' : ''}">
                ${icon(app.icon, activeRoute === app.route ? '#2DAAE1' : 'currentColor', 18)}
                <span>${app.title}</span>
                <span class="nets-nav-pill">${app.badge}</span>
              </a>
            `).join('')}

            <div class="nets-sidebar-section-title">Configuración</div>
            <a href="#/apps" class="nets-nav-link ${activeRoute === '#/apps' ? 'active' : ''}">
              ${icon('apps', activeRoute === '#/apps' ? '#2DAAE1' : 'currentColor', 18)}
              <span>Administración de apps</span>
            </a>
          </nav>

          <div class="nets-sidebar-footer">
            <div class="nets-user-brief">
              <div class="nets-user-avatar">${resolveUser(auth).avatar}</div>
              <div class="nets-user-meta">
                <span class="nets-user-name">${resolveUser(auth).name}</span>
                <span class="nets-user-role">${resolveUser(auth).role}</span>
              </div>
            </div>
            <button class="nets-btn-logout-sidebar" id="btn-logout" title="Cerrar sesión" aria-label="Cerrar sesión">
              ${icon('logout', 'currentColor', 18)}
            </button>
          </div>
        </aside>

        <!-- Main Wrapper -->
        <div class="nets-main-wrapper">
          <!-- Topbar -->
          <header class="nets-topbar">
            <div class="nets-topbar-left">
              <button class="nets-search-trigger" id="btn-search-trigger" aria-label="Buscar en Nets Business Core">
                ${icon('search', 'var(--blue)', 18)}
                <span class="nets-search-placeholder">Buscar en ${PRODUCT.shortName}...</span>
                <kbd class="nets-search-kbd">⌘K</kbd>
              </button>
            </div>

            <div class="nets-topbar-right">
              <button class="nets-btn-icon" id="btn-toggle-theme" title="Alternar tema" aria-label="Alternar tema claro u oscuro">
                ${icon(isDark ? 'sun' : 'moon', 'currentColor', 18)}
              </button>

              <div class="nets-mobile-avatar" id="btn-user-popover" role="button" tabindex="0" aria-label="Menú de usuario ${resolveUser(auth).name}">
                ${resolveUser(auth).avatar}
              </div>
            </div>
          </header>

          <!-- View Header -->
          <div class="nets-page-header fade-up">
            <div class="nets-page-titles">
              <h1 class="nets-page-title">${viewTitle}</h1>
              <p class="nets-page-subtitle">${viewSubtitle}</p>
            </div>
          </div>

          <!-- Page Content -->
          <main class="nets-page-content">
            ${contentHtml}
          </main>
        </div>

        <!-- Mobile PWA Bottom Navigation (Activo #2DAAE1) -->
        <nav class="nets-bottom-nav" aria-label="Navegación Móvil">
          ${bottomNavItems.map(item => `
            <a href="${item.route}" class="nets-bottom-nav-link ${activeRoute === item.route ? 'active' : ''}">
              ${icon(item.iconName, activeRoute === item.route ? '#2DAAE1' : 'currentColor', 18)}
              <span class="nets-bottom-nav-label">${item.label}</span>
            </a>
          `).join('')}
        </nav>
      </div>
    `;
  }

  // --- Vista 1: Login (#/login) ---
  function renderLogin() {
    return `
      <div class="nets-auth-container fade-up">
        <div class="nets-auth-card">
          <div class="nets-auth-header">
            <img src="logo.svg" alt="Nets Company" class="nets-auth-logo" onerror="this.outerHTML='<h1 class=\\'nets-logo-text-big\\'>NETS</h1>'" />
            <h2 class="nets-auth-title">Acceso a Nets Business Core</h2>
            <p class="nets-auth-subtitle">Ingrese a Nets Business Core con sus credenciales Nets Company</p>
          </div>

          <form id="nets-login-form" class="nets-auth-form">
            <div class="nets-form-group">
              <label for="login-email">Correo Electrónico Corporativo</label>
              <input type="email" id="login-email" class="nets-input" value="gerardo.ortiz@nets.com.co" required />
            </div>

            <div class="nets-form-group">
              <label for="login-password">Contraseña Maestra</label>
              <input type="password" id="login-password" class="nets-input" value="••••••••••••" required />
            </div>

            <div class="nets-auth-options">
              <label class="nets-checkbox-label">
                <input type="checkbox" checked id="remember-me" />
                <span>Recordar sesión segura</span>
              </label>
              <button type="button" class="nets-link" id="link-forgot-pw">¿Olvidó su clave?</button>
            </div>

            <button type="submit" class="nets-btn nets-btn-primary nets-btn-block">
              Iniciar Sesión
            </button>
          </form>

          <div class="nets-auth-footer">
            <span>Infraestructura protegida con Nets Guard SOC 2 Tipo II</span>
          </div>
        </div>
      </div>
    `;
  }

  // --- Vista 2: Home (#/home) ---
  function renderLockedGate(title) {
    const q = encodeURIComponent('Hola Nets Business Core, quiero activar ' + title);
    const content = `
      <div class="nets-locked-gate">
        <div class="nets-locked-card">
          <div style="font-size:32px;margin-bottom:12px" aria-hidden="true">🔒</div>
          <h3 style="margin:0 0 8px;color:var(--navy)">${title}</h3>
          <p class="muted" style="margin:0 0 18px;font-size:14px">Contacta a Nets Business Core para activar esta función</p>
          <a class="nets-btn-wa" href="https://wa.me/573200008899?text=${q}" target="_blank" rel="noopener">Contactar por WhatsApp</a>
        </div>
      </div>`;
    return wrapLayout(title, 'Módulo no activo', content, '#/apps');
  }

  function renderHome() {
    const user = resolveUser(getStoredAuth());
    const greeting = getGreeting(user.shortName);
    const kpis = computeMockKpis(getDeals());
    const pct = Math.round((kpis.goalCurrent / kpis.goalTarget) * 100);
    const contentHtml = `
      <div class="nets-home-simple">
        <section class="nets-welcome-card" style="padding:18px 20px">
          <h2 class="nets-welcome-greeting" style="margin:0 0 4px;font-size:22px">${greeting}</h2>
          <p class="nets-welcome-text" style="margin:0">Resumen operativo · ${kpis.goalLabel}</p>
        </section>

        <section class="nets-kpis-simple-grid">
          <div class="nets-kpi-simple">
            <div class="nets-kpi-label">Ventas del mes vs meta</div>
            <div class="nets-kpi-val">${formatCOP(kpis.salesMonth)}</div>
            <div class="nets-kpi-meta">Meta ${formatCOP(kpis.goalTarget)} · ${pct}%</div>
            <div class="nets-goal-mini" aria-hidden="true"><span style="width:${pct}%"></span></div>
          </div>
          <div class="nets-kpi-simple">
            <div class="nets-kpi-label">Oportunidades activas</div>
            <div class="nets-kpi-val">${kpis.activeOpps}</div>
            <div class="nets-kpi-meta">${kpis.newOpps} en pipeline</div>
          </div>
          <div class="nets-kpi-simple">
            <div class="nets-kpi-label">Conversaciones WhatsApp</div>
            <div class="nets-kpi-val">${kpis.botChats.toLocaleString('es-CO')}</div>
            <div class="nets-kpi-meta">${kpis.botSla}</div>
          </div>
          <div class="nets-kpi-simple">
            <div class="nets-kpi-label">Cotizaciones pendientes</div>
            <div class="nets-kpi-val">${kpis.quotes}</div>
            <div class="nets-kpi-meta">${kpis.quotesNote}</div>
          </div>
        </section>

        <section class="nets-actions-card">
          <div class="nets-card-title-row" style="margin-bottom:12px">
            <h3 class="nets-card-heading" style="margin:0">Próximas acciones</h3>
            <span class="nets-tag-live">Hoy</span>
          </div>
          <div class="nets-activity-feed">
            ${MOCK_ACTIVITY.map(a => `
              <div class="nets-activity-item">
                <span class="nets-act-dot"></span>
                <div class="nets-act-body">
                  <p class="nets-act-title">${a.titleHtml}</p>
                  <span class="nets-act-time">${a.time}</span>
                </div>
              </div>`).join('')}
          </div>
        </section>
      </div>`;
    return wrapLayout('Inicio', 'Lo esencial de su operación', contentHtml, '#/home');
  }



  function renderCrm() {
    const deals = getDeals();
    const board = CRM_STAGES.map(stage => {
      const cards = deals.filter(d => d.stage === stage.id);
      const sum = cards.reduce((a, d) => a + d.amount, 0);
      return `
        <div class="kanban-column nets-kanban-col" data-stage="${stage.id}">
          <div class="kanban-column-header">
            <span class="kanban-column-title">${stage.label}</span>
            <span class="kanban-badge">${cards.length}</span>
          </div>
          <div class="muted" style="font-size:14px;margin:0 0 8px">${formatCOP(sum)}</div>
          <div class="kanban-cards-stack" data-drop="${stage.id}">
            ${cards.map(d => `
              <article class="kanban-card" draggable="true" data-id="${d.id}" role="button" tabindex="0" aria-grabbed="false" aria-label="Oportunidad ${d.client}, ${formatCOP(d.amount)}. Arrastre para cambiar de etapa.">
                <div style="display:flex;gap:10px;align-items:center;margin-bottom:8px">
                  <div class="nets-user-avatar" style="width:32px;height:32px;font-size:12px;background:var(--blue-soft);color:var(--blue)">${d.initials}</div>
                  <div>
                    <div style="font-weight:600;font-size:14px">${d.client}</div>
                    <div class="muted" style="font-size:14px">${d.tag} · ${d.days}d</div>
                  </div>
                </div>
                <p style="font-size:14px;margin:0 0 8px;color:var(--muted)">${d.title}</p>
                <strong style="color:var(--navy)">${formatCOP(d.amount)}</strong>
                <label class="muted" style="display:block;font-size:12px;margin-top:10px">Mover a etapa</label>
                <select class="kanban-move-menu" data-move="${d.id}" aria-label="Mover ${d.client} a otra etapa">
                  ${CRM_STAGES.map(s => `<option value="${s.id}" ${s.id===d.stage?'selected':''}>${s.label}</option>`).join('')}
                </select>
              </article>
            `).join('')}
          </div>
        </div>`;
    }).join('');
    const content = `
      <section class="kanban-section">
        <div class="kanban-board kanban-board-scroll nets-kanban">${board}</div>
      </section>`;
    return wrapLayout('Oportunidades', 'Pipeline comercial · 6 etapas · arrastre para avanzar', content, '#/crm');
  }

  function renderChat() {
    const chats = getChats();
    const active = chats.find(c => c.id === activeChatId) || chats[0];
    const showDetail = isMobileChatDetail || (typeof window !== 'undefined' && window.innerWidth >= 800);
    const list = chats.map(c => `
      <button class="nets-chat-list-item ${c.id === active.id ? 'active' : ''}" data-chat="${c.id}" type="button">
        <div class="nets-user-avatar" style="background:var(--blue-soft);color:var(--blue)">${c.avatar}</div>
        <div style="flex:1;min-width:0;text-align:left">
          <div style="display:flex;justify-content:space-between;gap:8px">
            <strong style="font-size:14px">${c.name}</strong>
            <span class="muted" style="font-size:14px">${c.lastTime}</span>
          </div>
          <div class="muted chat-preview" style="font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${c.company}</div>
        </div>
        ${c.unread ? `<span class="kanban-badge" style="background:var(--blue);color:#fff">${c.unread}</span>` : ''}
      </button>`).join('');
    const msgs = (active.messages || []).map(m => `
      <div class="chat-bubble ${m.from === 'me' ? 'me' : 'them'}">
        ${m.text}
        <div class="chat-time">${m.time}</div>
      </div>`).join('');
    const content = `
      <section class="nets-chat-layout" style="display:grid;grid-template-columns:minmax(260px,320px) 1fr;gap:16px;min-height:60vh">
        <aside class="nets-card nets-chat-list-pane" style="padding:12px;display:${showDetail && window.innerWidth < 800 ? 'none' : 'flex'};flex-direction:column;gap:6px;overflow:auto">${list}</aside>
        <div class="nets-card nets-chat-detail-pane" style="display:${(!showDetail && window.innerWidth < 800) ? 'none' : 'flex'};flex-direction:column;padding:0;overflow:hidden;min-height:55vh">
          <div class="nets-chat-header">
            <button type="button" class="nets-chat-back" id="btn-chat-back" aria-label="Volver a la bandeja" style="display:${window.innerWidth < 800 ? 'grid' : 'none'}">
              ${icon('arrowLeft', 'currentColor', 18)}
            </button>
            <div class="nets-user-avatar" style="width:36px;height:36px;font-size:12px;background:var(--blue-soft);color:var(--blue)">${active.avatar}</div>
            <div style="min-width:0;flex:1">
              <strong style="display:block;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${active.name}</strong>
              <span class="muted" style="font-size:13px">${active.phone || active.company}</span>
            </div>
          </div>
          <div class="nets-chat-thread" id="nets-chat-thread">${msgs}</div>
          <form id="nets-chat-form" style="display:flex;gap:8px;padding:12px;border-top:1px solid var(--border);background:var(--surface)">
            <input class="nets-input" id="nets-chat-input" placeholder="Escriba un mensaje..." autocomplete="off" style="flex:1" />
            <button type="submit" class="nets-btn nets-btn-primary">Enviar</button>
          </form>
        </div>
      </section>`;
    return wrapLayout('WhatsApp', 'Bandeja omnicanal y bot Nets IA', content, '#/chat');
  }

  function renderApps() {
    const apps = getAppsState();
    const rows = apps.map(a => {
      if (!a.enabled) {
        const q = encodeURIComponent('Hola Nets Business Core, quiero activar ' + a.title);
        return `
        <button type="button" class="nets-card nets-app-row locked" data-locked-app="${a.id}" style="display:flex;align-items:center;justify-content:space-between;gap:16px;width:100%;text-align:left;cursor:pointer">
          <div style="display:flex;gap:12px;align-items:center">
            <div>${icon(a.icon,'var(--muted)', 18)}</div>
            <div>
              <strong>${a.title}</strong>
              <p class="muted app-card-desc" style="margin:4px 0 0;font-size:14px">${a.desc}</p>
            </div>
          </div>
          <span class="nets-app-lock-badge">🔒 Bloqueada</span>
        </button>`;
      }
      return `
      <div class="nets-card" style="display:flex;align-items:center;justify-content:space-between;gap:16px">
        <a href="${a.route}" style="display:flex;gap:12px;align-items:center;flex:1;min-width:0">
          <div>${icon(a.icon,'var(--blue)', 18)}</div>
          <div>
            <strong>${a.title}</strong>
            <p class="muted app-card-desc" style="margin:4px 0 0;font-size:14px">${a.desc}</p>
          </div>
        </a>
        <span class="nets-app-lock-badge" style="color:var(--blue);background:var(--blue-soft)">Activa</span>
      </div>`;
    }).join('');
    const content = `<div style="display:flex;flex-direction:column;gap:12px">${rows}</div>
      <p class="muted" style="font-size:13px;margin:8px 0 0">Las funciones bloqueadas se activan con el equipo Nets Business Core.</p>`;
    return wrapLayout('Administración de aplicaciones', 'Módulos de su portal', content, '#/apps');
  }

  function renderInventory() {
    const appState = getAppsState().find(a => a.id === 'inventory');
    if (!appState || !appState.enabled) return renderLockedGate('Inventario');

    const rows = INITIAL_INVENTORY.map(i => `
      <tr>
        <td><strong>${i.sku}</strong></td>
        <td class="muted" style="font-size:14px">${i.desc}</td>
        <td>${i.stock}</td>
        <td class="muted" style="font-size:14px">${i.bodega}</td>
        <td>${formatCOP(i.cost)}</td>
      </tr>`).join('');
    const content = `
      <div class="nets-card" style="overflow:auto">
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <thead><tr style="text-align:left;color:var(--muted)">
            <th style="padding:10px">SKU</th><th>Descripción</th><th>Stock</th><th>Bodega</th><th>Costo</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
    return wrapLayout('Inventario', 'Control multisede Colombia', content, '#/inventory');
  }

  function renderInvoice() {
    const appState = getAppsState().find(a => a.id === 'invoice');
    if (!appState || !appState.enabled) return renderLockedGate('Facturación DIAN');

    const rows = INITIAL_INVOICES.map(f => `
      <tr>
        <td><strong>${f.prefix}-${f.number}</strong></td>
        <td>${f.client}</td>
        <td class="muted" style="font-size:14px">${f.nit}</td>
        <td>${formatCOP(f.amount)}</td>
        <td>${formatDate(f.date)}</td>
        <td><span class="kanban-badge">${f.status}</span></td>
      </tr>`).join('');
    const content = `
      <div class="nets-card" style="overflow:auto">
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <thead><tr style="text-align:left;color:var(--muted)">
            <th style="padding:10px">Documento</th><th>Cliente</th><th>NIT</th><th>Valor</th><th>Fecha</th><th>Estado</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
    return wrapLayout('Facturación DIAN', 'Emisión electrónica UBL 2.1', content, '#/invoice');
  }

  function renderSupport() {
    const appState = getAppsState().find(a => a.id === 'support');
    if (!appState || !appState.enabled) return renderLockedGate('Casos y Soporte');
    const content = `
      <div class="nets-card">
        <p class="muted" style="font-size:14px">Mesa de servicio ITIL — tickets N1 a N3.</p>
      </div>`;
    return wrapLayout('Casos', 'Mesa de servicio ITIL', content, '#/support');
  }

  function attachViewEvents(route) {
    const logout = document.getElementById('btn-logout');
    if (logout) logout.onclick = () => { setStoredAuth(null); location.hash = '#/login'; router(); };

    const theme = document.getElementById('btn-toggle-theme');
    if (theme) theme.onclick = () => toggleTheme();

    const search = document.getElementById('btn-search-trigger');
    if (search) search.onclick = () => openCommandPalette();

    if (route === '#/login') {
      const form = document.getElementById('nets-login-form');
      if (form) form.onsubmit = (e) => {
        e.preventDefault();
        setStoredAuth(DEFAULT_USER);
        toast('Sesión iniciada', 'success');
        location.hash = '#/home';
        router();
      };
    }

    if (route === '#/crm') {
      bindCrmInteractions();
    }

    if (route === '#/chat') {
      document.querySelectorAll('[data-chat]').forEach(btn => {
        btn.onclick = () => {
          activeChatId = btn.dataset.chat;
          isMobileChatDetail = true;
          try {
            history.pushState({ netsChatDetail: true, chatId: activeChatId }, '', '#/chat');
          } catch (e) {}
          router(true);
        };
      });
      const back = document.getElementById('btn-chat-back');
      if (back) back.onclick = () => {
        isMobileChatDetail = false;
        if (history.state && history.state.netsChatDetail) {
          history.back();
        } else {
          router(true);
        }
      };
      const form = document.getElementById('nets-chat-form') || document.getElementById('chat-send-form');
      if (form) form.onsubmit = (e) => {
        e.preventDefault();
        const input = document.getElementById('nets-chat-input') || document.getElementById('chat-input');
        const text = (input && input.value || '').trim();
        if (!text) return;
        const chats = getChats();
        const chat = chats.find(c => c.id === activeChatId);
        if (!chat) return;
        chat.messages.push({ id: 'm' + Date.now(), from: 'me', text, time: 'Ahora' });
        chat.lastTime = 'Ahora';
        saveChats(chats);
        input.value = '';
        router(true);
      };
      const thread = document.getElementById('nets-chat-thread');
      if (thread) thread.scrollTop = thread.scrollHeight;
    }

    if (route === '#/apps') {
      document.querySelectorAll('[data-locked-app]').forEach(btn => {
        btn.onclick = () => {
          const apps = getAppsState();
          const app = apps.find(a => a.id === btn.dataset.lockedApp);
          const title = (app && app.title) || 'esta función';
          const q = encodeURIComponent('Hola Nets Business Core, quiero activar ' + title);
          const existing = document.getElementById('nets-locked-modal');
          if (existing) existing.remove();
          const modal = document.createElement('div');
          modal.id = 'nets-locked-modal';
          modal.className = 'nets-modal-backdrop';
          modal.innerHTML = `
            <div class="nets-locked-card" role="dialog" aria-modal="true" aria-labelledby="locked-title">
              <div style="font-size:28px;margin-bottom:8px" aria-hidden="true">🔒</div>
              <h3 id="locked-title" style="margin:0 0 8px;color:var(--navy)">${title}</h3>
              <p class="muted" style="margin:0 0 16px;font-size:14px">Contacta a Nets Business Core para activar esta función</p>
              <a class="nets-btn-wa" href="https://wa.me/573200008899?text=${q}" target="_blank" rel="noopener">Contactar por WhatsApp</a>
              <button type="button" class="nets-btn" id="btn-close-locked" style="display:block;margin:14px auto 0;background:transparent;border:0;color:var(--muted);cursor:pointer">Cerrar</button>
            </div>`;
          document.body.appendChild(modal);
          modal.onclick = (ev) => { if (ev.target === modal) modal.remove(); };
          const close = document.getElementById('btn-close-locked');
          if (close) close.onclick = () => modal.remove();
        };
      });
    }

    if (route !== '#/chat') {
      isMobileChatDetail = false;
    }
  }

  function moveDealToStage(dealId, nextStage) {
    const deals = getDeals();
    const deal = deals.find(d => d.id === dealId);
    if (!deal || deal.stage === nextStage) return false;
    deal.stage = nextStage;
    saveDeals(deals);
    if (nextStage === 'ganado') confetti(1500);
    toast(nextStage === 'ganado' ? '¡Oportunidad ganada!' : 'Etapa actualizada', 'success');
    return true;
  }

  function bindCrmInteractions() {
    let dragId = null;
    document.querySelectorAll('.kanban-card').forEach(card => {
      card.addEventListener('dragstart', (e) => {
        if (e.target.closest('select')) { e.preventDefault(); return; }
        dragId = card.dataset.id;
        card.classList.add('dragging');
        card.style.opacity = '.5';
        try { e.dataTransfer.setData('text/plain', dragId); } catch (err) {}
      });
      card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
        card.style.opacity = '1';
        dragId = null;
      });

      let longPressTimer = null;
      let draggingTouch = false;
      let startX = 0, startY = 0;
      card.addEventListener('touchstart', (e) => {
        if (e.target.closest('select,button,a,label')) return;
        const t = e.touches[0];
        startX = t.clientX; startY = t.clientY;
        draggingTouch = false;
        longPressTimer = setTimeout(() => {
          draggingTouch = true;
          dragId = card.dataset.id;
          card.classList.add('dragging');
          if (navigator.vibrate) try { navigator.vibrate(25); } catch (err) {}
        }, 260);
      }, { passive: true });
      card.addEventListener('touchmove', (e) => {
        const t = e.touches[0];
        if (!draggingTouch) {
          if (Math.abs(t.clientX - startX) > 12 || Math.abs(t.clientY - startY) > 12) {
            clearTimeout(longPressTimer);
          }
          return;
        }
        e.preventDefault();
        const boardEl = document.querySelector('.kanban-board-scroll') || document.querySelector('.kanban-board');
        if (boardEl) {
          const rect = boardEl.getBoundingClientRect();
          if (t.clientX > rect.right - 48) boardEl.scrollLeft += 18;
          if (t.clientX < rect.left + 48) boardEl.scrollLeft -= 18;
        }
        document.querySelectorAll('[data-drop]').forEach(z => { z.style.outline = 'none'; });
        const under = document.elementFromPoint(t.clientX, t.clientY);
        const zone = under && under.closest('[data-drop]');
        if (zone) {
          zone.style.outline = '2px dashed #2DAAE1';
          card._touchZone = zone;
        } else {
          card._touchZone = null;
        }
      }, { passive: false });
      const endTouch = () => {
        clearTimeout(longPressTimer);
        if (draggingTouch && card._touchZone && dragId) {
          const next = card._touchZone.dataset.drop;
          if (moveDealToStage(dragId, next)) {
            document.querySelectorAll('[data-drop]').forEach(z => { z.style.outline = 'none'; });
            card.classList.remove('dragging');
            draggingTouch = false;
            dragId = null;
            router(true);
            return;
          }
        }
        draggingTouch = false;
        card.classList.remove('dragging');
        document.querySelectorAll('[data-drop]').forEach(z => { z.style.outline = 'none'; });
      };
      card.addEventListener('touchend', endTouch);
      card.addEventListener('touchcancel', endTouch);
    });

    document.querySelectorAll('[data-drop]').forEach(zone => {
      zone.addEventListener('dragover', e => { e.preventDefault(); zone.style.outline = '2px dashed #2DAAE1'; });
      zone.addEventListener('dragleave', () => { zone.style.outline = 'none'; });
      zone.addEventListener('drop', e => {
        e.preventDefault();
        zone.style.outline = 'none';
        const id = dragId || (e.dataTransfer && e.dataTransfer.getData('text/plain'));
        if (!id) return;
        if (moveDealToStage(id, zone.dataset.drop)) router(true);
      });
    });

    document.querySelectorAll('.kanban-move-menu').forEach(sel => {
      sel.addEventListener('touchstart', e => e.stopPropagation(), { passive: true });
      sel.addEventListener('mousedown', e => e.stopPropagation());
      sel.onchange = () => {
        const id = sel.dataset.move;
        if (moveDealToStage(id, sel.value)) router(true);
      };
    });
  }

  function router(skipSkeleton) {
    const root = document.getElementById('app') || document.body;
    let hash = location.hash || '#/login';
    if (!hash.startsWith('#/')) hash = '#/login';
    const auth = getStoredAuth();
    if (!auth && hash !== '#/login') {
      location.hash = '#/login';
      hash = '#/login';
    }
    if (auth && hash === '#/login') {
      location.hash = '#/home';
      hash = '#/home';
    }

    const paint = () => {
      let html = '';
      if (hash === '#/login') html = renderLogin();
      else if (hash === '#/home') html = renderHome();
      else if (hash === '#/crm') html = renderCrm();
      else if (hash === '#/chat') html = renderChat();
      else if (hash === '#/apps') html = renderApps();
      else if (hash === '#/inventory') html = renderInventory();
      else if (hash === '#/invoice') html = renderInvoice();
      else if (hash === '#/support') html = renderSupport();
      else html = renderHome();

      if (hash === '#/login') {
        root.innerHTML = html;
      } else {
        root.innerHTML = html;
      }
      root.classList.add('ready');
      renderSingleTopBanner();
      attachViewEvents(hash);
      checkFirstVisitOnboarding();
    };

    if (skipSkeleton || hash === '#/login') paint();
    else runWithSkeleton(root, paint);
  }

  function boot() {
    const theme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') document.documentElement.classList.add('dark');

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      pwaInstallEvent = e;
      renderSingleTopBanner();
    });

    window.addEventListener('hashchange', () => {
      if (!location.hash.startsWith('#/chat')) isMobileChatDetail = false;
      router();
    });
    window.addEventListener('popstate', (e) => {
      isMobileChatDetail = !!(e.state && e.state.netsChatDetail);
      router(true);
    });
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openCommandPalette();
      }
    });

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    if (!document.getElementById('app')) {
      const app = document.createElement('div');
      app.id = 'app';
      document.body.appendChild(app);
    }
    if (!location.hash) location.hash = getStoredAuth() ? '#/home' : '#/login';
    router();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
