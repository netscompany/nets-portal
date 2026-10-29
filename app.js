(function () {
  'use strict';

  /* ==========================================================================
     NETS ENTERPRISE PWA - SINGLE APP ENGINE
     Marca Marge + Nets | Vanilla JS IIFE Single Source of Truth
     ========================================================================== */

  // --- Constantes de Almacenamiento ---
  const STORAGE_KEYS = {
    AUTH: 'nets_auth',
    THEME: 'nets_theme',
    APPS: 'nets_apps_state',
    ONBOARDED: 'nets_onboarded',
    DEALS: 'nets_crm_deals',
    CHATS: 'nets_chat_history'
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
      enabled: true,
      route: '#/inventory',
      badge: '4 bodegas',
      desc: 'Control multisede Montevideo, Guayabal, Yumbo y Fontibón'
    },
    {
      id: 'invoice',
      title: 'Facturación DIAN',
      icon: 'receipt',
      enabled: true,
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
      company: 'Grupo Nutresa',
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
      company: 'Cementos Argos',
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
    { prefix: 'SETT', number: 8920, client: 'Bancolombia S.A.', nit: '890.903.938-8', amount: 259420000, date: '2025-05-12', status: 'Validada DIAN', cufe: 'f83a79d20c8b3e1' },
    { prefix: 'SETT', number: 8921, client: 'Celsia Colombia S.A.', nit: '900.284.453-1', amount: 76398000, date: '2025-05-13', status: 'Validada DIAN', cufe: 'c491b827e69a03f' },
    { prefix: 'SETT', number: 8922, client: 'Organización Terpel S.A.', nit: '860.004.522-3', amount: 133280000, date: '2025-05-14', status: 'Validada DIAN', cufe: '98d41cf5e02ab71' },
    { prefix: 'SETT', number: 8923, client: 'Rappi S.A.S.', nit: '900.843.801-0', amount: 49980000, date: '2025-05-14', status: 'En Proceso', cufe: 'Pendiente' }
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

  function getGreeting(name) {
    const hour = new Date().getHours();
    let salutation = 'Buenas noches';
    if (hour >= 5 && hour < 12) salutation = 'Buenos días';
    else if (hour >= 12 && hour < 19) salutation = 'Buenas tardes';
    return `${salutation}, ${name}`;
  }

  // Generador de Iconos SVG Familia Coherente (Stroke #2DAAE1 o currentColor)
  function icon(name, color = '#2DAAE1', size = 20) {
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
    const startVal = 0;
    const startTime = performance.now();
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isReduced) {
      element.textContent = isCurrency ? formatCOP(endVal) : endVal.toLocaleString('es-CO');
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
            ${icon('search', '#2DAAE1', 20)}
            <input type="text" id="nets-cmd-input" class="nets-cmd-input" placeholder="Buscar módulo, cliente o comando rápido..." autofocus autocomplete="off" />
            <kbd class="nets-cmd-esc">ESC</kbd>
          </div>
          <div class="nets-cmd-results" id="nets-cmd-results"></div>
          <div class="nets-cmd-footer">
            <span>Navegue con <kbd>↑</kbd> <kbd>↓</kbd> y ejecute con <kbd>Enter</kbd></span>
            <span class="nets-cmd-tag">Nets OS v4.2</span>
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

    const overlay = document.createElement('div');
    overlay.className = 'nets-modal-backdrop fade-up';
    overlay.id = 'nets-onboarding-modal';
    overlay.innerHTML = `
      <div class="nets-modal-card">
        <div class="nets-modal-header">
          <div class="nets-badge-pill">${icon('award', '#2DAAE1', 14)} Bienvenido a Nets Portal</div>
          <button class="nets-btn-icon-ghost" id="btn-close-onboard">${icon('close', 'currentColor', 18)}</button>
        </div>
        <div class="nets-modal-body">
          <h2 class="nets-modal-title">Ecosistema Empresarial Nets Colombia</h2>
          <p class="nets-modal-desc">
            Plataforma corporativa diseñada para la alta dirección y gestión omnicanal. Administre oportunidades comerciales, conversaciones de WhatsApp API, control de inventario y facturación electrónica DIAN con total fluidez.
          </p>
          <div class="nets-features-checklist">
            <div class="nets-check-row">
              <span class="nets-check-dot">${icon('check', '#2DAAE1', 14)}</span>
              <span><strong>Pipeline B2B:</strong> Arrastre y suelte acuerdos comerciales entre 6 etapas auditadas.</span>
            </div>
            <div class="nets-check-row">
              <span class="nets-check-dot">${icon('check', '#2DAAE1', 14)}</span>
              <span><strong>WhatsApp Centralizado:</strong> Mensajería directa e inteligencia artificial de respuesta.</span>
            </div>
            <div class="nets-check-row">
              <span class="nets-check-dot">${icon('check', '#2DAAE1', 14)}</span>
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
      toast('Onboarding completado. Disfrute su experiencia Nets.', 'success');
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

  // --- Banner ÚNICO: "Vista previa · Datos de demostración" + Instalar ---
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
        <span class="nets-banner-text">Vista previa · Datos de demostración</span>
        ${showInstall ? `
          <button id="nets-btn-pwa-install" class="nets-btn-banner-install">
            ${icon('download', '#FFFFFF', 14)}
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
            toast('Instalando Nets Enterprise en su dispositivo...', 'success');
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
      ...enabledApps.slice(0, 3).map(a => ({ route: a.route, iconName: a.icon, label: a.title })),
      { route: '#/apps', iconName: 'apps', label: 'Apps' }
    ];

    return `
      <div class="nets-shell">
        <!-- Sidebar Desktop -->
        <aside class="nets-sidebar" aria-label="Navegación Principal">
          <div class="nets-sidebar-brand">
            <img src="logo-blanco.svg" alt="Nets" class="nets-sidebar-logo" onerror="this.outerHTML='<span class=\\'nets-logo-text\\'>NETS</span>'" />
            <span class="nets-sidebar-edition">Enterprise</span>
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
              <div class="nets-user-avatar">${auth ? auth.avatar : 'US'}</div>
              <div class="nets-user-meta">
                <span class="nets-user-name">${auth ? auth.name : 'Usuario'}</span>
                <span class="nets-user-role">${auth ? auth.role : 'Corporativo'}</span>
              </div>
            </div>
            <button class="nets-btn-logout-sidebar" id="btn-logout" title="Cerrar sesión">
              ${icon('logout', 'currentColor', 16)}
            </button>
          </div>
        </aside>

        <!-- Main Wrapper -->
        <div class="nets-main-wrapper">
          <!-- Topbar -->
          <header class="nets-topbar">
            <div class="nets-topbar-left">
              <button class="nets-search-trigger" id="btn-search-trigger">
                ${icon('search', '#2DAAE1', 16)}
                <span class="nets-search-placeholder">Buscar en Nets...</span>
                <kbd class="nets-search-kbd">⌘K</kbd>
              </button>
            </div>

            <div class="nets-topbar-right">
              <div class="nets-streak-pill" title="Racha operativa activa">
                ${icon('award', '#2DAAE1', 16)}
                <span>14 días seguidos</span>
              </div>

              <button class="nets-btn-icon" id="btn-toggle-theme" title="Alternar tema">
                ${icon(isDark ? 'sun' : 'moon', 'currentColor', 18)}
              </button>

              <div class="nets-mobile-avatar" id="btn-user-popover">
                ${auth ? auth.avatar : 'US'}
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
              ${icon(item.iconName, activeRoute === item.route ? '#2DAAE1' : 'currentColor', 20)}
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
            <img src="logo.svg" alt="Nets Logo" class="nets-auth-logo" onerror="this.outerHTML='<h1 class=\\'nets-logo-text-big\\'>NETS</h1>'" />
            <h2 class="nets-auth-title">Acceso al Portal Empresarial</h2>
            <p class="nets-auth-subtitle">Ingrese con sus credenciales de red corporativa Nets Colombia</p>
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
              <a href="javascript:void(0)" class="nets-link" id="link-forgot-pw">¿Olvidó su clave?</a>
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
  function renderHome() {
    const auth = getStoredAuth() || DEFAULT_USER;
    const greeting = getGreeting(auth.shortName || 'Ger');
    const enabledApps = getAppsState().filter(a => a.enabled);

    const goalTarget = 450000000;
    const goalCurrent = 384500000;
    const goalPercent = Math.round((goalCurrent / goalTarget) * 100);

    const contentHtml = `
      <div class="nets-home-grid">
        <!-- Saludo e Insignia -->
        <section class="nets-welcome-card fade-up">
          <div class="nets-welcome-info">
            <div class="nets-badge-streak">
              ${icon('award', '#2DAAE1', 14)}
              <span>Racha Comercial: 14 días cumpliendo metas</span>
            </div>
            <h2 class="nets-welcome-greeting">${greeting}</h2>
            <p class="nets-welcome-text">
              El pipeline nacional registra un avance ponderado del <strong>${goalPercent}%</strong> respecto a la meta trimestral fijada para Colombia.
            </p>
          </div>

          <!-- Meta Mensual Progress -->
          <div class="nets-goal-box">
            <div class="nets-goal-header">
              <span class="nets-goal-label">Meta Mayo 2025</span>
              <span class="nets-goal-values"><strong>${formatCOP(goalCurrent)}</strong> / ${formatCOP(goalTarget)}</span>
            </div>
            <div class="nets-progress-track">
              <div class="nets-progress-fill" style="width: ${goalPercent}%"></div>
            </div>
            <div class="nets-goal-foot">
              <span>Rendimiento +12.4% superior a abril</span>
              <span>${goalPercent}%</span>
            </div>
          </div>
        </section>

        <!-- 4 KPIs con Count-Up y Sparklines -->
        <section class="nets-kpis-grid">
          <div class="nets-kpi-card fade-up" style="animation-delay: 60ms">
            <div class="nets-kpi-top">
              <span class="nets-kpi-label">Ventas del Mes</span>
              <span class="nets-kpi-icon">${icon('receipt', '#2DAAE1', 18)}</span>
            </div>
            <div class="nets-kpi-val" id="kpi-sales">0</div>
            <div class="nets-kpi-bottom">
              <span class="nets-pill-up">+18.2%</span>
              <canvas class="nets-sparkline" id="spark-sales"></canvas>
            </div>
          </div>

          <div class="nets-kpi-card fade-up" style="animation-delay: 120ms">
            <div class="nets-kpi-top">
              <span class="nets-kpi-label">Oportunidades Nuevas</span>
              <span class="nets-kpi-icon">${icon('crm', '#2DAAE1', 18)}</span>
            </div>
            <div class="nets-kpi-val" id="kpi-deals">0</div>
            <div class="nets-kpi-bottom">
              <span class="nets-pill-up">+7 activas</span>
              <canvas class="nets-sparkline" id="spark-deals"></canvas>
            </div>
          </div>

          <div class="nets-kpi-card fade-up" style="animation-delay: 180ms">
            <div class="nets-kpi-top">
              <span class="nets-kpi-label">Conversaciones Bot</span>
              <span class="nets-kpi-icon">${icon('chat', '#2DAAE1', 18)}</span>
            </div>
            <div class="nets-kpi-val" id="kpi-chats">0</div>
            <div class="nets-kpi-bottom">
              <span class="nets-pill-up">99.2% SLA</span>
              <canvas class="nets-sparkline" id="spark-chats"></canvas>
            </div>
          </div>

          <div class="nets-kpi-card fade-up" style="animation-delay: 240ms">
            <div class="nets-kpi-top">
              <span class="nets-kpi-label">Cotizaciones Emitidas</span>
              <span class="nets-kpi-icon">${icon('box', '#2DAAE1', 18)}</span>
            </div>
            <div class="nets-kpi-val" id="kpi-quotes">0</div>
            <div class="nets-kpi-bottom">
              <span class="nets-pill-up">34 radicadas</span>
              <canvas class="nets-sparkline" id="spark-quotes"></canvas>
            </div>
          </div>
        </section>

        <!-- Accesos Rápidos y Apps Habilitadas -->
        <section class="nets-home-split">
          <div class="nets-home-column fade-up" style="animation-delay: 300ms">
            <div class="nets-card-title-row">
              <h3 class="nets-card-heading">Módulos Habilitados</h3>
              <a href="#/apps" class="nets-link-action">Configurar apps</a>
            </div>
            <div class="nets-apps-compact-grid">
              ${enabledApps.map(app => `
                <a href="${app.route}" class="nets-app-compact-card">
                  <div class="nets-app-compact-icon">${icon(app.icon, '#2DAAE1', 22)}</div>
                  <div class="nets-app-compact-texts">
                    <span class="nets-app-compact-name">${app.title}</span>
                    <span class="nets-app-compact-desc">${app.desc}</span>
                  </div>
                </a>
              `).join('')}
            </div>
          </div>

          <div class="nets-home-column fade-up" style="animation-delay: 360ms">
            <div class="nets-card-title-row">
              <h3 class="nets-card-heading">Actividad Operativa Reciente</h3>
              <span class="nets-tag-live">Bogotá HQ</span>
            </div>
            <div class="nets-activity-feed">
              <div class="nets-activity-item">
                <span class="nets-act-dot"></span>
                <div class="nets-act-body">
                  <p class="nets-act-title"><strong>Bancolombia S.A.</strong> avanzó a Negociación final.</p>
                  <span class="nets-act-time">Hace 14 minutos · Auditoría Nets CRM</span>
                </div>
              </div>

              <div class="nets-activity-item">
                <span class="nets-act-dot"></span>
                <div class="nets-act-body">
                  <p class="nets-act-title"><strong>Celsia</strong> recibió propuesta de bot WhatsApp.</p>
                  <span class="nets-act-time">Hace 1 hora · WhatsApp</span>
                </div>
              </div>
              <div class="nets-activity-item">
                <span class="nets-act-dot"></span>
                <div class="nets-act-body">
                  <p class="nets-act-title">Factura SETT-8921 validada ante la DIAN.</p>
                  <span class="nets-act-time">Hoy 09:12 · Facturación</span>
                </div>
              </div>
              <div class="nets-activity-item">
                <span class="nets-act-dot"></span>
                <div class="nets-act-body">
                  <p class="nets-act-title">Stock crítico en UPS 3KVA — bodega Montevideo.</p>
                  <span class="nets-act-time">Ayer · Inventario</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    `;
    return wrapLayout('Inicio', 'Panel operativo Nets Colombia', contentHtml, '#/home');
  }

  const CRM_STAGES = [
    { id: 'prospeccion', label: 'Pendiente' },
    { id: 'calificacion', label: 'Calificación' },
    { id: 'propuesta', label: 'Propuesta' },
    { id: 'negociacion', label: 'Negociación' },
    { id: 'ganado', label: 'Ganado' },
    { id: 'perdido', label: 'Perdido' }
  ];

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
              <article class="kanban-card" draggable="true" data-id="${d.id}">
                <div style="display:flex;gap:10px;align-items:center;margin-bottom:8px">
                  <div class="nets-user-avatar" style="width:32px;height:32px;font-size:12px;background:#E8F6FC;color:#2DAAE1">${d.initials}</div>
                  <div>
                    <div style="font-weight:600;font-size:14px">${d.client}</div>
                    <div class="muted" style="font-size:14px">${d.tag} · ${d.days}d</div>
                  </div>
                </div>
                <p style="font-size:14px;margin:0 0 8px;color:var(--muted)">${d.title}</p>
                <strong style="color:var(--navy)">${formatCOP(d.amount)}</strong>
              </article>
            `).join('')}
          </div>
        </div>`;
    }).join('');
    const content = `
      <section class="kanban-section">
        <div class="kanban-board nets-kanban">${board}</div>
      </section>`;
    return wrapLayout('Oportunidades', 'Pipeline comercial · 6 etapas · arrastre para avanzar', content, '#/crm');
  }

  function renderChat() {
    const chats = getChats();
    const active = chats.find(c => c.id === activeChatId) || chats[0];
    const list = chats.map(c => `
      <button class="nets-chat-list-item ${c.id === active.id ? 'active' : ''}" data-chat="${c.id}" type="button">
        <div class="nets-user-avatar" style="background:#E8F6FC;color:#2DAAE1">${c.avatar}</div>
        <div style="flex:1;min-width:0;text-align:left">
          <div style="display:flex;justify-content:space-between;gap:8px">
            <strong style="font-size:14px">${c.name}</strong>
            <span class="muted" style="font-size:14px">${c.lastTime}</span>
          </div>
          <div class="muted chat-preview" style="font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${c.company}</div>
        </div>
        ${c.unread ? `<span class="kanban-badge" style="background:#2DAAE1;color:#fff">${c.unread}</span>` : ''}
      </button>`).join('');
    const msgs = (active.messages || []).map(m => `
      <div class="chat-bubble ${m.from === 'me' ? 'me' : 'them'}" style="align-self:${m.from==='me'?'flex-end':'flex-start'};background:${m.from==='me'?'#2DAAE1':'#fff'};color:${m.from==='me'?'#fff':'var(--text)'};padding:10px 14px;border-radius:18px;max-width:80%;font-size:14px;border:1px solid var(--border)">
        ${m.text}
        <div style="opacity:.7;font-size:12px;margin-top:4px">${m.time}</div>
      </div>`).join('');
    const content = `
      <section class="nets-chat-layout" style="display:grid;grid-template-columns:minmax(260px,320px) 1fr;gap:16px;min-height:60vh">
        <aside class="nets-card" style="padding:12px;display:${isMobileChatDetail?'none':'flex'};flex-direction:column;gap:6px;overflow:auto">${list}</aside>
        <div class="nets-card" style="display:${(!isMobileChatDetail && window.innerWidth<800)?'none':'flex'};flex-direction:column;padding:0;overflow:hidden">
          <div style="padding:14px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px">
            <button type="button" id="chat-back" class="nets-btn-icon" style="display:none">${icon('home','currentColor',18)}</button>
            <div class="nets-user-avatar" style="background:#E8F6FC;color:#2DAAE1">${active.avatar}</div>
            <div>
              <strong>${active.name}</strong>
              <div class="muted" style="font-size:14px">${active.company} · ${active.phone}</div>
            </div>
          </div>
          <div id="chat-messages" style="flex:1;display:flex;flex-direction:column;gap:10px;padding:16px;overflow:auto;background:#F7FAFC">${msgs}</div>
          <form id="chat-send-form" style="display:flex;gap:8px;padding:12px;border-top:1px solid var(--border)">
            <input id="chat-input" class="nets-input" style="flex:1;padding:10px 12px;border:1px solid var(--border);border-radius:10px;font-size:14px" placeholder="Escriba un mensaje…" autocomplete="off" />
            <button class="btn-accent" type="submit">Enviar</button>
          </form>
        </div>
      </section>
      <style>@media(max-width:800px){.nets-chat-layout{grid-template-columns:1fr!important}}</style>`;
    return wrapLayout('WhatsApp', 'Bandeja omnicanal y bot Nets IA', content, '#/chat');
  }

  function renderApps() {
    const apps = getAppsState();
    const rows = apps.map(a => `
      <div class="nets-card" style="display:flex;align-items:center;justify-content:space-between;gap:16px">
        <div style="display:flex;gap:12px;align-items:center">
          <div>${icon(a.icon,'#2DAAE1',22)}</div>
          <div>
            <strong>${a.title}</strong>
            <p class="muted app-card-desc" style="margin:4px 0 0;font-size:14px">${a.desc}</p>
          </div>
        </div>
        <label class="nets-toggle" style="display:inline-flex;align-items:center;gap:8px;cursor:pointer">
          <input type="checkbox" data-app-toggle="${a.id}" ${a.enabled?'checked':''} />
          <span class="muted" style="font-size:14px">${a.enabled?'Activa':'Inactiva'}</span>
        </label>
      </div>`).join('');
    const content = `<div style="display:flex;flex-direction:column;gap:12px">${rows}</div>`;
    return wrapLayout('Administración de aplicaciones', 'Active o pause módulos del portal sin tocar Odoo', content, '#/apps');
  }

  function renderInventory() {
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
    const rows = INITIAL_INVOICES.map(f => `
      <tr>
        <td><strong>${f.prefix}-${f.number}</strong></td>
        <td>${f.client}</td>
        <td class="muted" style="font-size:14px">${f.nit}</td>
        <td>${formatCOP(f.amount)}</td>
        <td>${f.date}</td>
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
    const content = `
      <div class="nets-card">
        <p class="muted" style="font-size:14px">El módulo Casos y Soporte está desactivado. Actívelo en Administración de aplicaciones.</p>
        <a class="btn-accent" href="#/apps" style="display:inline-block;margin-top:12px;text-decoration:none">Ir a apps</a>
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

    if (route === '#/home') {
      countUp(document.getElementById('kpi-sales'), 384500000, 1200, true);
      countUp(document.getElementById('kpi-deals'), 27, 1000, false);
      countUp(document.getElementById('kpi-chats'), 1842, 1100, false);
      countUp(document.getElementById('kpi-quotes'), 34, 900, false);
      const sparks = [
        ['spark-sales', [12,18,15,22,28,26,31]],
        ['spark-deals', [4,6,5,8,7,9,11]],
        ['spark-chats', [40,55,48,62,70,68,80]],
        ['spark-quotes', [2,3,4,5,4,6,7]]
      ];
      sparks.forEach(([id, data]) => {
        const el = document.getElementById(id);
        if (el) renderSparkline(el, data);
      });
    }

    if (route === '#/crm') {
      let dragId = null;
      document.querySelectorAll('.kanban-card').forEach(card => {
        card.addEventListener('dragstart', () => { dragId = card.dataset.id; card.style.opacity = '.5'; });
        card.addEventListener('dragend', () => { card.style.opacity = '1'; });
      });
      document.querySelectorAll('[data-drop]').forEach(zone => {
        zone.addEventListener('dragover', e => { e.preventDefault(); zone.style.outline = '2px dashed #2DAAE1'; });
        zone.addEventListener('dragleave', () => { zone.style.outline = 'none'; });
        zone.addEventListener('drop', e => {
          e.preventDefault();
          zone.style.outline = 'none';
          if (!dragId) return;
          const deals = getDeals();
          const deal = deals.find(d => d.id === dragId);
          if (!deal) return;
          const next = zone.dataset.drop;
          deal.stage = next;
          saveDeals(deals);
          if (next === 'ganado') confetti(1500);
          toast(next === 'ganado' ? '¡Oportunidad ganada!' : 'Etapa actualizada', 'success');
          router(true);
        });
      });
    }

    if (route === '#/chat') {
      document.querySelectorAll('[data-chat]').forEach(btn => {
        btn.onclick = () => {
          activeChatId = btn.dataset.chat;
          isMobileChatDetail = true;
          router(true);
        };
      });
      const form = document.getElementById('chat-send-form');
      if (form) form.onsubmit = (e) => {
        e.preventDefault();
        const input = document.getElementById('chat-input');
        const text = (input.value || '').trim();
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
    }

    if (route === '#/apps') {
      document.querySelectorAll('[data-app-toggle]').forEach(cb => {
        cb.onchange = () => {
          const apps = getAppsState();
          const app = apps.find(a => a.id === cb.dataset.appToggle);
          if (!app) return;
          app.enabled = cb.checked;
          saveAppsState(apps);
          toast(app.enabled ? app.title + ' activada' : app.title + ' pausada', 'info');
          router(true);
        };
      });
    }
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

    window.addEventListener('hashchange', () => router());
    window.addEventListener('popstate', () => router());
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
