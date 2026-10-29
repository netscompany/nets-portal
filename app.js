(function () {
  'use strict';

  // --- ESTADO GLOBAL ---
  const state = {
    auth: localStorage.getItem('nets_auth') === 'true',
    user: {
      name: 'Ger',
      role: 'Administrador',
      email: 'gerencia@netscompany.co'
    },
    activeChatId: 1,
    mobileChatView: false, // true muestra conversación en móvil
    installPrompt: null,
    apps: JSON.parse(localStorage.getItem('nets_apps') || 'null') || [
      { id: 'crm', name: 'CRM', desc: 'Canales comerciales, embudos y seguimiento', route: '#/crm', icon: 'crm', enabled: true },
      { id: 'whatsapp', name: 'WhatsApp', desc: 'Atención multicanal y mensajería oficial', route: '#/chat', icon: 'chat', enabled: true },
      { id: 'inventory', name: 'Inventario', desc: 'Control de bodegas, existencias y movimientos', route: '#/inventory', icon: 'inventory', enabled: true },
      { id: 'invoice', name: 'Facturación', desc: 'Facturas electrónicas DIAN, pagos y cobros', route: '#/invoice', icon: 'invoice', enabled: true },
      { id: 'support', name: 'Casos y Soporte', desc: 'Mesa de ayuda y requerimientos de clientes', route: '#/support', icon: 'support', enabled: false }
    ],
    crmStages: ['PENDIENTE', 'CONTACTADO', 'COTIZACIÓN ENVIADA', 'EN NEGOCIACIÓN', 'GANADO', 'PERDIDO'],
    opportunities: [
      { id: 'opp-1', name: 'Distribuidora Bogotá S.A.S.', contact: 'Andrés Morales', value: 14500000, stage: 'PENDIENTE', date: 'Hoy, 09:15 a. m.' },
      { id: 'opp-2', name: 'Clínica Odontológica Antioquia', contact: 'Dra. Paola Ortiz', value: 8900000, stage: 'CONTACTADO', date: 'Ayer, 04:30 p. m.' },
      { id: 'opp-3', name: 'Inversiones del Café Eje', contact: 'Mateo Cárdenas', value: 32000000, stage: 'COTIZACIÓN ENVIADA', date: '24 oct, 11:20 a. m.' },
      { id: 'opp-4', name: 'Constructora Bolívar Valle', contact: 'Ing. Rodrigo Silva', value: 58000000, stage: 'EN NEGOCIACIÓN', date: '23 oct, 02:45 p. m.' },
      { id: 'opp-5', name: 'Supermercados Boyacá Real', contact: 'Gloria Espinosa', value: 19200000, stage: 'GANADO', date: '21 oct, 10:00 a. m.' },
      { id: 'opp-6', name: 'Suministros Caribe Cart.', contact: 'Felipe Mendoza', value: 6500000, stage: 'PERDIDO', date: '19 oct, 03:15 p. m.' }
    ],
    conversations: [
      {
        id: 1,
        contact: 'Carlos Restrepo · Medellín',
        phone: '+57 310 445 8920',
        unread: 1,
        time: '10:45 a. m.',
        messages: [
          { sender: 'them', text: 'Buenos días, requerimos confirmación de la cotización enviada ayer para Medellín.', time: '10:30 a. m.' },
          { sender: 'me', text: 'Con gusto Carlos. Estamos validando el stock de entrega prioritaria.', time: '10:42 a. m.' },
          { sender: 'them', text: 'Perfecto, quedamos atentos al enlace de pago.', time: '10:45 a. m.' }
        ]
      },
      {
        id: 2,
        contact: 'Elena Gómez · Cali',
        phone: '+57 315 889 1234',
        unread: 0,
        time: '09:20 a. m.',
        messages: [
          { sender: 'them', text: 'Hola Nets Company, ¿la plataforma emite reporte directo a contabilidad?', time: '09:12 a. m.' },
          { sender: 'me', text: 'Hola Elena, sí. Genera balance conciliado y XML DIAN.', time: '09:20 a. m.' }
        ]
      },
      {
        id: 3,
        contact: 'Transportes Caribe S.A.S.',
        phone: '+57 300 234 5678',
        unread: 0,
        time: 'Ayer, 04:15 p. m.',
        messages: [
          { sender: 'me', text: 'Se ha expedido la orden de servicio 4480 para Barranquilla.', time: '04:10 p. m.' },
          { sender: 'them', text: 'Recibido, procedemos con el despacho mañana temprano.', time: '04:15 p. m.' }
        ]
      }
    ]
  };

  function saveAppsState() {
    localStorage.setItem('nets_apps', JSON.stringify(state.apps));
  }

  function formatCOP(num) {
    return '$ ' + Number(num).toLocaleString('es-CO');
  }

  // --- ICONOS SVG (STROKE 1.8, ROUNDED, CONSISTENTES) ---
  function icon(name, color = '#2DAAE1', size = 20) {
    const s = `width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="nets-icon nets-icon-${name}"`;
    switch (name) {
      case 'home':
        return `<svg ${s}><path d="M3 10.5l9-7.5 9 7.5v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9z"/><polyline points="9 21 9 12 15 12 15 21"/></svg>`;
      case 'crm':
        return `<svg ${s}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></svg>`;
      case 'chat':
        return `<svg ${s}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`;
      case 'apps':
        return `<svg ${s}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>`;
      case 'inventory':
        return `<svg ${s}><path d="M21 8l-9-5-9 5v8l9 5 9-5V8z"/><polyline points="3.27 7.96 12 12.96 20.73 7.96"/><line x1="12" y1="22.96" x2="12" y2="12.96"/></svg>`;
      case 'invoice':
        return `<svg ${s}><path d="M14 2H6a2 2 0 0 0-2 2v16l3-1.5L10 20l3-1.5 3 1.5 4-2V4a2 2 0 0 0-2-2z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="14" y2="11"/><line x1="8" y1="15" x2="12" y2="15"/></svg>`;
      case 'support':
        return `<svg ${s}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"/><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/></svg>`;
      case 'logout':
        return `<svg ${s}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`;
      case 'back':
        return `<svg ${s}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`;
      case 'check':
        return `<svg ${s}><polyline points="20 6 9 17 4 12"/></svg>`;
      case 'send':
        return `<svg ${s}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`;
      case 'download':
        return `<svg ${s}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;
      case 'close':
        return `<svg ${s}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
      default:
        return `<svg ${s}><circle cx="12" cy="12" r="9"/></svg>`;
    }
  }

  // --- INYECCIÓN DE ESTILOS ---
  function injectStyles() {
    if (document.getElementById('nets-styles')) return;
    const style = document.createElement('style');
    style.id = 'nets-styles';
    style.textContent = `
      :root {
        --nets-navy: #061E33;
        --nets-orange: #F58233;
        --nets-gradient: linear-gradient(90deg, #F5A623, #D9472B);
        --nets-blue: #2DAAE1;
        --nets-bg: #F4F7FB;
        --nets-support: #3D5166;
        --nets-main: #0F1C2A;
        --nets-card-border: #E3E8EE;
        --radius-card: 10px;
        --radius-panel: 16px;
      }
      * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
      body {
        font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: var(--nets-bg);
        color: var(--nets-main);
        font-size: 15px;
        line-height: 1.45;
        min-height: 100vh;
      }
      a { color: inherit; text-decoration: none; }
      button { font-family: inherit; cursor: pointer; border: none; outline: none; }
      input, textarea { font-family: inherit; }

      /* Banner discreto */
      .demo-banner {
        background: var(--nets-navy);
        color: #FFFFFF;
        font-size: 12px;
        letter-spacing: 0.3px;
        padding: 6px 16px;
        text-align: center;
        font-weight: 500;
        position: sticky;
        top: 0;
        z-index: 999;
      }

      /* Barra PWA instalable */
      .pwa-bar {
        background: #0B253F;
        color: #FFFFFF;
        padding: 8px 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        font-size: 13px;
      }
      .pwa-bar button.install-btn {
        background: var(--nets-gradient);
        color: #fff;
        font-weight: 600;
        padding: 6px 14px;
        border-radius: 8px;
        font-size: 12px;
        white-space: nowrap;
      }
      .pwa-bar button.close-btn {
        background: transparent;
        color: #A0B2C6;
        display: flex;
        align-items: center;
      }

      /* Layout */
      .app-layout {
        display: flex;
        min-height: calc(100vh - 29px);
      }
      .sidebar {
        display: none;
      }

      /* Bottom Nav móvil */
      .bottom-nav {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #FFFFFF;
        border-top: 1px solid var(--nets-card-border);
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        height: 64px;
        padding-bottom: env(safe-area-inset-bottom, 0px);
        z-index: 900;
      }
      .bottom-nav-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 3px;
        font-size: 11px;
        font-weight: 600;
        color: var(--nets-support);
        min-height: 48px;
      }
      .bottom-nav-item.active {
        color: var(--nets-orange);
      }
      .bottom-nav-item.active svg {
        stroke: var(--nets-orange);
      }

      /* Main Content */
      .main-content {
        flex: 1;
        padding: 16px 16px 84px 16px;
        max-width: 1400px;
        margin: 0 auto;
        width: 100%;
      }

      /* Header de sección */
      .page-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
        flex-wrap: wrap;
        gap: 12px;
      }
      .page-title {
        font-size: 22px;
        font-weight: 700;
        color: var(--nets-navy);
      }
      .page-subtitle {
        font-size: 14px;
        color: var(--nets-support);
        margin-top: 2px;
      }

      /* Botón primario */
      .btn-primary {
        background: var(--nets-gradient);
        color: #FFFFFF;
        font-weight: 600;
        border-radius: var(--radius-card);
        padding: 10px 18px;
        font-size: 14px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        min-height: 44px;
        transition: opacity 0.2s;
      }
      .btn-primary:active { opacity: 0.88; }
      .btn-secondary {
        background: #FFFFFF;
        border: 1px solid var(--nets-card-border);
        color: var(--nets-navy);
        font-weight: 600;
        border-radius: var(--radius-card);
        padding: 9px 16px;
        font-size: 14px;
        display: inline-flex;
        align-items: center;
        min-height: 44px;
      }

      /* HOME Grid */
      .home-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 16px;
        width: 100%;
      }
      .home-card {
        background: #FFFFFF;
        border: 1px solid var(--nets-card-border);
        border-radius: var(--radius-card);
        padding: 20px;
        min-height: 140px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        transition: transform 0.15s, box-shadow 0.15s;
        text-align: left;
      }
      .home-card:active {
        transform: translateY(1px);
      }
      .home-card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
      }
      .home-card-icon-wrap {
        width: 44px;
        height: 44px;
        border-radius: 10px;
        background: rgba(45, 170, 225, 0.12);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .home-card-title {
        font-size: 17px;
        font-weight: 700;
        color: var(--nets-navy);
        margin-bottom: 6px;
      }
      .home-card-desc {
        font-size: 13px;
        color: var(--nets-support);
        line-height: 1.4;
      }
      .home-card-action {
        margin-top: 14px;
        font-size: 13px;
        font-weight: 600;
        color: var(--nets-blue);
        display: flex;
        align-items: center;
        gap: 6px;
      }

      /* CRM KANBAN */
      .crm-board {
        display: flex;
        gap: 16px;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        padding-bottom: 16px;
        -webkit-overflow-scrolling: touch;
      }
      .crm-col {
        flex: 0 0 280px;
        scroll-snap-align: start;
        background: #EAEEF4;
        border-radius: var(--radius-panel);
        padding: 14px;
        display: flex;
        flex-direction: column;
        max-height: calc(100vh - 180px);
      }
      .crm-col-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
        font-weight: 700;
        font-size: 12px;
        letter-spacing: 0.6px;
        color: var(--nets-navy);
      }
      .crm-badge {
        background: #FFFFFF;
        border-radius: 12px;
        padding: 2px 8px;
        font-size: 11px;
        font-weight: 700;
        color: var(--nets-support);
      }
      .crm-cards {
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding-right: 2px;
      }
      .crm-card {
        background: #FFFFFF;
        border-radius: var(--radius-card);
        padding: 14px;
        border: 1px solid var(--nets-card-border);
        box-shadow: 0 1px 3px rgba(6,30,51,0.04);
      }
      .crm-card-title {
        font-weight: 700;
        color: var(--nets-navy);
        font-size: 14px;
        margin-bottom: 4px;
      }
      .crm-card-contact {
        font-size: 12px;
        color: var(--nets-support);
        margin-bottom: 10px;
      }
      .crm-card-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 8px;
        border-top: 1px solid #F0F3F7;
      }
      .crm-card-value {
        font-size: 14px;
        font-weight: 700;
        color: var(--nets-navy); /* NUNCA verde, SIEMPRE navy */
      }
      .crm-card-date {
        font-size: 11px;
        color: var(--nets-support);
      }

      /* WHATSAPP CHAT */
      .chat-wrapper {
        background: #FFFFFF;
        border-radius: var(--radius-panel);
        border: 1px solid var(--nets-card-border);
        display: flex;
        overflow: hidden;
        height: calc(100vh - 160px);
        min-height: 480px;
      }
      .chat-sidebar {
        width: 100%;
        border-right: 1px solid var(--nets-card-border);
        display: flex;
        flex-direction: column;
        background: #FFFFFF;
      }
      .chat-sidebar-header {
        padding: 16px;
        border-bottom: 1px solid var(--nets-card-border);
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .chat-sidebar-title {
        font-size: 17px;
        font-weight: 700;
        color: var(--nets-navy);
      }
      .chat-list {
        overflow-y: auto;
        flex: 1;
      }
      .chat-item {
        padding: 14px 16px;
        border-bottom: 1px solid #F1F4F8;
        cursor: pointer;
        transition: background 0.15s;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .chat-item:hover, .chat-item.active {
        background: #F4F7FB;
      }
      .chat-item-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
      }
      .chat-item-name {
        font-weight: 600;
        font-size: 14px;
        color: var(--nets-navy);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex: 1;
      }
      .chat-item-time {
        font-size: 11px;
        color: var(--nets-support);
        flex-shrink: 0;
      }
      .chat-item-phone {
        font-size: 12px;
        color: var(--nets-support);
      }
      .chat-item-snippet {
        font-size: 13px;
        color: #5A6D82;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .chat-main {
        display: none;
        flex: 1;
        flex-direction: column;
        background: var(--nets-bg); /* NUNCA beige, SIEMPRE #F4F7FB */
      }
      .chat-main-header {
        background: #FFFFFF;
        border-bottom: 1px solid var(--nets-card-border);
        padding: 12px 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        min-height: 60px;
      }
      .chat-back-btn {
        width: 36px;
        height: 36px;
        border-radius: 8px;
        background: #F4F7FB;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .chat-main-title {
        font-weight: 700;
        font-size: 15px;
        color: var(--nets-navy);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .chat-main-phone {
        font-size: 12px;
        color: var(--nets-support);
      }
      .chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .chat-bubble {
        max-width: 82%;
        padding: 10px 14px;
        border-radius: 12px;
        font-size: 14px;
        line-height: 1.4;
        position: relative;
        word-break: break-word;
      }
      /* Enviados navy/blanco, recibidos #EBF0F8/#0F1C2A */
      .chat-bubble.sent {
        align-self: flex-end;
        background: var(--nets-navy);
        color: #FFFFFF;
        border-bottom-right-radius: 2px;
      }
      .chat-bubble.received {
        align-self: flex-start;
        background: #EBF0F8;
        color: var(--nets-main);
        border-bottom-left-radius: 2px;
      }
      .chat-bubble-time {
        font-size: 10px;
        margin-top: 4px;
        text-align: right;
        opacity: 0.75;
      }
      .chat-input-bar {
        background: #FFFFFF;
        border-top: 1px solid var(--nets-card-border);
        padding: 10px 14px;
        display: flex;
        gap: 8px;
        align-items: center;
      }
      .chat-input {
        flex: 1;
        background: #F4F7FB;
        border: 1px solid var(--nets-card-border);
        border-radius: 20px;
        padding: 10px 16px;
        font-size: 14px;
        color: var(--nets-main);
      }
      .chat-send-btn {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        background: var(--nets-gradient);
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        flex-shrink: 0;
      }

      /* ADMIN DE APLICACIONES */
      .admin-table {
        background: #FFFFFF;
        border-radius: var(--radius-panel);
        border: 1px solid var(--nets-card-border);
        overflow: hidden;
      }
      .admin-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 20px;
        border-bottom: 1px solid #EDF1F6;
        gap: 16px;
      }
      .admin-row:last-child { border-bottom: none; }
      .admin-row-left {
        display: flex;
        align-items: center;
        gap: 14px;
      }
      .admin-row-info h4 {
        font-size: 15px;
        font-weight: 700;
        color: var(--nets-navy);
      }
      .admin-row-info p {
        font-size: 13px;
        color: var(--nets-support);
      }
      /* Switch toggle */
      .switch {
        position: relative;
        display: inline-block;
        width: 48px;
        height: 26px;
        flex-shrink: 0;
      }
      .switch input { opacity: 0; width: 0; height: 0; }
      .slider {
        position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
        background-color: #D3DCDE;
        transition: .25s;
        border-radius: 26px;
      }
      .slider:before {
        position: absolute; content: ""; height: 20px; width: 20px; left: 3px; bottom: 3px;
        background-color: white;
        transition: .25s;
        border-radius: 50%;
      }
      input:checked + .slider {
        background: var(--nets-gradient);
      }
      input:checked + .slider:before {
        transform: translateX(22px);
      }

      /* PÁGINAS GENÉRICAS (Inventario, Facturación, etc.) */
      .panel-card {
        background: #FFFFFF;
        border: 1px solid var(--nets-card-border);
        border-radius: var(--radius-panel);
        padding: 24px;
      }

      /* LOGIN SCREEN */
      .login-container {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
        background: var(--nets-bg);
      }
      .login-box {
        width: 100%;
        max-width: 380px;
        background: #FFFFFF;
        border: 1px solid var(--nets-card-border);
        border-radius: var(--radius-panel);
        padding: 32px 24px;
        box-shadow: 0 4px 20px rgba(6,30,51,0.06);
      }
      .login-logo {
        height: 48px;
        max-width: 220px;
        margin: 0 auto 20px auto;
        display: block;
        object-fit: contain;
      }
      .login-field {
        margin-bottom: 16px;
      }
      .login-field label {
        display: block;
        font-size: 13px;
        font-weight: 600;
        color: var(--nets-navy);
        margin-bottom: 6px;
      }
      .login-input {
        width: 100%;
        height: 46px;
        padding: 0 14px;
        border-radius: var(--radius-card);
        border: 1px solid var(--nets-card-border);
        font-size: 14px;
        background: #FFFFFF;
        color: var(--nets-main);
      }
      .login-input:focus {
        border-color: var(--nets-blue);
        outline: none;
      }

      /* DESKTOP (>= 768px) */
      @media (min-width: 768px) {
        .bottom-nav { display: none !important; }
        .sidebar {
          display: flex;
          flex-direction: column;
          width: 260px;
          background: var(--nets-navy);
          color: #FFFFFF;
          position: sticky;
          top: 29px;
          height: calc(100vh - 29px);
          flex-shrink: 0;
        }
        .sidebar-logo-wrap {
          padding: 24px 20px 20px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .sidebar-logo {
          height: 38px;
          max-width: 180px;
          object-fit: contain;
        }
        .sidebar-menu {
          padding: 16px 12px;
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 14px;
          border-radius: 8px;
          color: #B3C5D7;
          font-weight: 600;
          font-size: 14px;
          transition: background 0.15s, color 0.15s;
        }
        .sidebar-item:hover {
          background: rgba(255, 255, 255, 0.06);
          color: #FFFFFF;
        }
        .sidebar-item.active {
          background: var(--nets-gradient);
          color: #FFFFFF;
        }
        .sidebar-item.active svg {
          stroke: #FFFFFF !important;
        }
        .sidebar-footer {
          padding: 16px;
          border-top: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .sidebar-user {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .sidebar-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(45, 170, 225, 0.25);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
        }
        .sidebar-user-name {
          font-size: 13px;
          font-weight: 700;
          color: #FFFFFF;
          line-height: 1.2;
        }
        .sidebar-user-role {
          font-size: 11px;
          color: #8CA3BA;
        }

        .main-content {
          padding: 28px 32px 32px 32px;
        }
        .chat-sidebar {
          width: 340px;
        }
        .chat-main {
          display: flex !important;
        }
        .chat-back-btn {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // --- RENDER LAYOUT GENERAL ---
  function renderLayout(contentHtml, activeRoute) {
    const enabledApps = state.apps.filter(a => a.enabled);

    const bannerHtml = `
      <div class="demo-banner">
        Vista previa · Datos de demostración
      </div>
    `;

    const installHtml = state.installPrompt ? `
      <div class="pwa-bar" id="nets-pwa-bar">
        <span>Instala Nets Company para acceso directo rápido</span>
        <div style="display:flex;align-items:center;gap:8px;">
          <button class="install-btn" id="btn-pwa-install">Instalar Nets Company</button>
          <button class="close-btn" id="btn-pwa-dismiss" aria-label="Cerrar">${icon('close', '#fff', 18)}</button>
        </div>
      </div>
    ` : '';

    const sidebarItems = [
      { name: 'Inicio', route: '#/home', icon: 'home' },
      ...enabledApps.map(a => ({ name: a.name, route: a.route, icon: a.icon })),
      { name: 'Administración', route: '#/apps', icon: 'apps' }
    ];

    const sidebarHtml = `
      <aside class="sidebar">
        <div class="sidebar-logo-wrap">
          <img src="logo-blanco.svg" alt="Nets Company" class="sidebar-logo" onerror="this.onerror=null;this.replaceWith(document.createTextNode('NETS COMPANY'));">
        </div>
        <nav class="sidebar-menu">
          ${sidebarItems.map(item => {
            const isActive = activeRoute === item.route;
            const iconColor = isActive ? '#FFFFFF' : '#2DAAE1';
            return `
              <a href="${item.route}" class="sidebar-item ${isActive ? 'active' : ''}">
                ${icon(item.icon, iconColor, 20)}
                <span>${item.name}</span>
              </a>
            `;
          }).join('')}
        </nav>
        <div class="sidebar-footer">
          <div class="sidebar-user">
            <div class="sidebar-avatar">${state.user.name.charAt(0)}</div>
            <div>
              <div class="sidebar-user-name">${state.user.name}</div>
              <div class="sidebar-user-role">${state.user.role}</div>
            </div>
          </div>
          <button id="btn-logout" title="Cerrar sesión" style="background:transparent;display:flex;align-items:center;">
            ${icon('logout', '#B3C5D7', 20)}
          </button>
        </div>
      </aside>
    `;

    // Bottom Nav: 4 ítems: Inicio, CRM, WhatsApp, Más (Más -> #/apps)
    const isHome = activeRoute === '#/home';
    const isCRM = activeRoute === '#/crm';
    const isChat = activeRoute === '#/chat';
    const isMore = activeRoute === '#/apps' || (!isHome && !isCRM && !isChat);

    const bottomNavHtml = `
      <nav class="bottom-nav">
        <a href="#/home" class="bottom-nav-item ${isHome ? 'active' : ''}">
          ${icon('home', isHome ? '#F58233' : '#3D5166', 22)}
          <span>Inicio</span>
        </a>
        <a href="#/crm" class="bottom-nav-item ${isCRM ? 'active' : ''}">
          ${icon('crm', isCRM ? '#F58233' : '#3D5166', 22)}
          <span>CRM</span>
        </a>
        <a href="#/chat" class="bottom-nav-item ${isChat ? 'active' : ''}">
          ${icon('chat', isChat ? '#F58233' : '#3D5166', 22)}
          <span>WhatsApp</span>
        </a>
        <a href="#/apps" class="bottom-nav-item ${isMore ? 'active' : ''}">
          ${icon('apps', isMore ? '#F58233' : '#3D5166', 22)}
          <span>Más</span>
        </a>
      </nav>
    `;

    return `
      ${bannerHtml}
      ${installHtml}
      <div class="app-layout">
        ${sidebarHtml}
        <main class="main-content">
          ${contentHtml}
        </main>
      </div>
      ${bottomNavHtml}
    `;
  }

  // --- VISTA LOGIN ---
  function renderLogin() {
    return `
      <div class="demo-banner">Vista previa · Datos de demostración</div>
      <div class="login-container">
        <div class="login-box">
          <img src="logo.svg" alt="Nets Company" class="login-logo" onerror="this.onerror=null;this.outerHTML='<h2 style=\\'text-align:center;color:#061E33;margin-bottom:20px;\\'>NETS COMPANY</h2>';">
          <form id="form-login">
            <div class="login-field">
              <label for="login-email">Correo</label>
              <input type="email" id="login-email" class="login-input" placeholder="Correo" required autocomplete="username" value="">
            </div>
            <div class="login-field">
              <label for="login-pass">Contraseña</label>
              <input type="password" id="login-pass" class="login-input" placeholder="Contraseña" required autocomplete="current-password" value="">
            </div>
            <button type="submit" class="btn-primary" style="width:100%;margin-top:10px;">
              Ingresar al portal
            </button>
          </form>
        </div>
      </div>
    `;
  }

  // --- VISTA INICIO (HOME) ---
  function renderHome() {
    const enabledApps = state.apps.filter(a => a.enabled);
    const cardsHtml = enabledApps.map(app => `
      <a href="${app.route}" class="home-card">
        <div>
          <div class="home-card-header">
            <div class="home-card-icon-wrap">
              ${icon(app.icon, '#2DAAE1', 24)}
            </div>
          </div>
          <div class="home-card-title">${app.name}</div>
          <div class="home-card-desc">${app.desc}</div>
        </div>
        <div class="home-card-action">
          <span>Abrir aplicación</span>
          ${icon('back', '#2DAAE1', 14)}
        </div>
      </a>
    `).join('');

    return `
      <div class="page-header">
        <div>
          <h1 class="page-title">Bienvenido, ${state.user.name}</h1>
          <p class="page-subtitle">Portal empresarial Nets Company · Colombia</p>
        </div>
        <a href="#/apps" class="btn-secondary">
          ${icon('apps', '#061E33', 18)}
          <span>Administración de aplicaciones</span>
        </a>
      </div>
      <div class="home-grid">
        ${cardsHtml}
      </div>
    `;
  }

  // --- VISTA CRM ---
  function renderCRM() {
    const boardHtml = state.crmStages.map(stage => {
      const stageOpps = state.opportunities.filter(o => o.stage === stage);
      const totalStage = stageOpps.reduce((acc, curr) => acc + curr.value, 0);

      const cards = stageOpps.map(opp => `
        <div class="crm-card">
          <div class="crm-card-title">${opp.name}</div>
          <div class="crm-card-contact">${opp.contact}</div>
          <div class="crm-card-footer">
            <div class="crm-card-value">${formatCOP(opp.value)}</div>
            <div class="crm-card-date">${opp.date}</div>
          </div>
        </div>
      `).join('');

      return `
        <div class="crm-col">
          <div class="crm-col-header">
            <span>${stage}</span>
            <span class="crm-badge">${stageOpps.length}</span>
          </div>
          <div style="font-size:11px;color:#3D5166;margin-bottom:10px;font-weight:600;">
            Total: ${formatCOP(totalStage)}
          </div>
          <div class="crm-cards">
            ${cards || '<div style="font-size:12px;color:#8CA3BA;padding:8px 0;">Sin oportunidades</div>'}
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="page-header">
        <div>
          <h1 class="page-title">CRM y Oportunidades</h1>
          <p class="page-subtitle">Gestión de etapas comerciales y cotizaciones corporativas</p>
        </div>
        <button class="btn-primary" id="btn-nueva-opp">
          <span>Nueva oportunidad</span>
        </button>
      </div>
      <div class="crm-board">
        ${boardHtml}
      </div>
    `;
  }

  // --- VISTA WHATSAPP ---
  function renderWhatsApp() {
    const activeConv = state.conversations.find(c => c.id === state.activeChatId) || state.conversations[0];
    const isMobileDetail = state.mobileChatView;

    const listHtml = state.conversations.map(conv => {
      const isSelected = conv.id === activeConv.id;
      const lastMsg = conv.messages[conv.messages.length - 1] || { text: '' };
      return `
        <div class="chat-item ${isSelected ? 'active' : ''}" data-chat-id="${conv.id}">
          <div class="chat-item-top">
            <span class="chat-item-name">${conv.contact}</span>
            <span class="chat-item-time">${conv.time}</span>
          </div>
          <div class="chat-item-phone">${conv.phone}</div>
          <div class="chat-item-snippet">${lastMsg.text}</div>
        </div>
      `;
    }).join('');

    const messagesHtml = activeConv.messages.map(msg => `
      <div class="chat-bubble ${msg.sender === 'me' ? 'sent' : 'received'}">
        <div>${msg.text}</div>
        <div class="chat-bubble-time">${msg.time}</div>
      </div>
    `).join('');

    return `
      <div class="page-header">
        <div>
          <h1 class="page-title">WhatsApp</h1>
          <p class="page-subtitle">Bandeja de atención comercial y servicio</p>
        </div>
      </div>
      <div class="chat-wrapper">
        <div class="chat-sidebar" style="${isMobileDetail ? 'display:none;' : 'display:flex;'}">
          <div class="chat-sidebar-header">
            <div class="chat-sidebar-title">Conversaciones</div>
            <span style="font-size:12px;color:var(--nets-support);font-weight:600;">${state.conversations.length} activas</span>
          </div>
          <div class="chat-list">
            ${listHtml}
          </div>
        </div>
        <div class="chat-main" style="${isMobileDetail ? 'display:flex;' : ''}">
          <div class="chat-main-header">
            <button class="chat-back-btn" id="btn-chat-back">
              ${icon('back', '#061E33', 18)}
            </button>
            <div style="flex:1;overflow:hidden;">
              <div class="chat-main-title">${activeConv.contact}</div>
              <div class="chat-main-phone">${activeConv.phone}</div>
            </div>
          </div>
          <div class="chat-messages" id="chat-messages-container">
            ${messagesHtml}
          </div>
          <form class="chat-input-bar" id="form-send-message">
            <input type="text" id="chat-text-input" class="chat-input" placeholder="Escribe un mensaje..." required autocomplete="off">
            <button type="submit" class="chat-send-btn" title="Enviar">
              ${icon('send', '#ffffff', 18)}
            </button>
          </form>
        </div>
      </div>
    `;
  }

  // --- VISTA ADMINISTRACIÓN DE APLICACIONES ---
  function renderAdminApps() {
    const rowsHtml = state.apps.map(app => `
      <div class="admin-row">
        <div class="admin-row-left">
          <div class="home-card-icon-wrap">
            ${icon(app.icon, '#2DAAE1', 22)}
          </div>
          <div class="admin-row-info">
            <h4>${app.name}</h4>
            <p>${app.desc}</p>
          </div>
        </div>
        <label class="switch">
          <input type="checkbox" class="app-toggle" data-app-id="${app.id}" ${app.enabled ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
      </div>
    `).join('');

    return `
      <div class="page-header">
        <div>
          <h1 class="page-title">Administración de aplicaciones</h1>
          <p class="page-subtitle">Activa o desactiva módulos disponibles en el entorno corporativo</p>
        </div>
      </div>
      <div class="admin-table">
        ${rowsHtml}
      </div>
    `;
  }

  // --- VISTAS SECUNDARIAS (Inventario, Facturación, Soporte) ---
  function renderModulePage(title, subtitle, iconName, bodyText) {
    return `
      <div class="page-header">
        <div>
          <h1 class="page-title">${title}</h1>
          <p class="page-subtitle">${subtitle}</p>
        </div>
      </div>
      <div class="panel-card">
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px;">
          <div class="home-card-icon-wrap" style="width:52px;height:52px;">
            ${icon(iconName, '#2DAAE1', 28)}
          </div>
          <div>
            <h3 style="color:var(--nets-navy);font-size:18px;">Módulo habilitado</h3>
            <p style="color:var(--nets-support);font-size:14px;">Operando bajo estándares de Nets Company</p>
          </div>
        </div>
        <p style="color:var(--nets-support);margin-bottom:20px;line-height:1.6;">${bodyText}</p>
        <button class="btn-primary" onclick="window.location.hash='#/home'">Volver al inicio</button>
      </div>
    `;
  }

  // --- ATTACH EVENTOS SEGÚN VISTA ---
  function attachViewEvents(hash) {
    // Dismiss install bar
    const btnDismiss = document.getElementById('btn-pwa-dismiss');
    if (btnDismiss) {
      btnDismiss.addEventListener('click', () => {
        state.installPrompt = null;
        router();
      });
    }

    // PWA install trigger
    const btnInstall = document.getElementById('btn-pwa-install');
    if (btnInstall && state.installPrompt) {
      btnInstall.addEventListener('click', () => {
        state.installPrompt.prompt();
        state.installPrompt.userChoice.then(() => {
          state.installPrompt = null;
          router();
        });
      });
    }

    // Botón logout
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
      btnLogout.addEventListener('click', () => {
        state.auth = false;
        localStorage.setItem('nets_auth', 'false');
        window.location.hash = '#/login';
        router();
      });
    }

    // Login submit
    const formLogin = document.getElementById('form-login');
    if (formLogin) {
      formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        state.auth = true;
        localStorage.setItem('nets_auth', 'true');
        window.location.hash = '#/home';
        router();
      });
    }

    // Toggle de Apps
    const toggles = document.querySelectorAll('.app-toggle');
    toggles.forEach(chk => {
      chk.addEventListener('change', (e) => {
        const appId = e.target.getAttribute('data-app-id');
        const targetApp = state.apps.find(a => a.id === appId);
        if (targetApp) {
          targetApp.enabled = e.target.checked;
          saveAppsState();
          // Si desactivó la app en la que estaba, redirigir a #/apps
          router();
        }
      });
    });

    // CRM Nueva Oportunidad
    const btnNuevaOpp = document.getElementById('btn-nueva-opp');
    if (btnNuevaOpp) {
      btnNuevaOpp.addEventListener('click', () => {
        const client = prompt('Nombre de la empresa / cliente:');
        if (!client) return;
        const val = prompt('Valor estimado en COP:', '15000000');
        state.opportunities.unshift({
          id: 'opp-' + Date.now(),
          name: client,
          contact: 'Contacto comercial',
          value: parseInt(val, 10) || 10000000,
          stage: 'PENDIENTE',
          date: 'Hoy, ' + new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true })
        });
        router();
      });
    }

    // WhatsApp selección chat
    const chatItems = document.querySelectorAll('.chat-item');
    chatItems.forEach(el => {
      el.addEventListener('click', () => {
        const id = parseInt(el.getAttribute('data-chat-id'), 10);
        state.activeChatId = id;
        state.mobileChatView = true;
        router();
      });
    });

    // WhatsApp botón regresar en móvil
    const btnChatBack = document.getElementById('btn-chat-back');
    if (btnChatBack) {
      btnChatBack.addEventListener('click', () => {
        state.mobileChatView = false;
        router();
      });
    }

    // WhatsApp enviar mensaje
    const formSendMsg = document.getElementById('form-send-message');
    if (formSendMsg) {
      formSendMsg.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('chat-text-input');
        const text = input.value.trim();
        if (!text) return;
        const activeConv = state.conversations.find(c => c.id === state.activeChatId);
        if (activeConv) {
          const nowStr = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true });
          activeConv.messages.push({
            sender: 'me',
            text: text,
            time: nowStr
          });
          activeConv.time = nowStr;
        }
        input.value = '';
        router();
        // Scroll al final
        setTimeout(() => {
          const container = document.getElementById('chat-messages-container');
          if (container) container.scrollTop = container.scrollHeight;
        }, 50);
      });
    }
  }

  function router() {
    injectStyles();
    const root = document.getElementById('app');
    if (!root) return;
    let hash = window.location.hash || '#/home';
    if (!hash.startsWith('#/')) hash = '#/home';
    const authed = state.auth === true || localStorage.getItem('nets_auth') === 'true';
    state.auth = authed;
    if (!authed && hash !== '#/login') { window.location.hash = '#/login'; return; }
    if (authed && hash === '#/login') { window.location.hash = '#/home'; return; }
    if (hash === '#/login') { root.innerHTML = renderLogin(); attachViewEvents(hash); return; }
    let content = '';
    switch (hash) {
      case '#/home': content = renderHome(); break;
      case '#/crm': content = renderCRM(); break;
      case '#/chat': content = renderWhatsApp(); break;
      case '#/apps': content = renderAdminApps(); break;
      case '#/inventory': content = renderModulePage('Inventario', 'Control de bodegas', 'inventory', 'Módulo de inventario en demostración.'); break;
      case '#/invoice': content = renderModulePage('Facturación', 'Factura electrónica DIAN', 'invoice', 'Módulo de facturación en demostración.'); break;
      case '#/support': content = renderModulePage('Casos y Soporte', 'Mesa de ayuda', 'support', 'Módulo de soporte en demostración.'); break;
      default: content = renderHome(); hash = '#/home';
    }
    root.innerHTML = renderLayout(content, hash);
    attachViewEvents(hash);
  }

  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); state.installPrompt = e; });
  if ('serviceWorker' in navigator) { window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(()=>{})); }
  window.addEventListener('hashchange', router);
  window.addEventListener('popstate', router);
  window.addEventListener('DOMContentLoaded', router);
 })();
