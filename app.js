const state = {
  activeApps: {
    crm: true,
    chat: true,
    inventario: true,
    facturacion: true,
    soporte: false
  },
  selectedChatId: 1,
  leads: [
    { id: 1, name: 'Distribuciones El Cóndor SAS', contact: 'Mateo Morales (Bogotá)', val: '$ 18.500.000 COP', stage: 'PENDIENTE' },
    { id: 2, name: 'Café La Montaña Ltda', contact: 'Valeria Restrepo (Medellín)', val: '$ 8.200.000 COP', stage: 'PENDIENTE' },
    { id: 3, name: 'Logística del Caribe SA', contact: 'Carlos Char (Barranquilla)', val: '$ 42.000.000 COP', stage: 'CONTACTADO' },
    { id: 4, name: 'Ferretería Los Paisas', contact: 'Andrés Zuluaga (Pereira)', val: '$ 12.400.000 COP', stage: 'COTIZACIÓN ENVIADA' },
    { id: 5, name: 'Textiles del Tolima SAS', contact: 'Camila Ospina (Ibagué)', val: '$ 27.600.000 COP', stage: 'COTIZACIÓN ENVIADA' },
    { id: 6, name: 'Agropecuaria San Jerónimo', contact: 'Felipe Henao (Villavicencio)', val: '$ 35.000.000 COP', stage: 'EN NEGOCIACIÓN' },
    { id: 7, name: 'Clínica Odontológica Boyacá', contact: 'Dra. Pilar Forero (Tunja)', val: '$ 15.800.000 COP', stage: 'GANADO' }
  ],
  chats: [
    {
      id: 1,
      name: 'Distribuciones El Cóndor',
      phone: '+57 310 445 9021',
      lastMsg: '¿Tienen disponibilidad para entrega en Corabastos?',
      time: '11:42 AM',
      unread: 2,
      messages: [
        { sender: 'them', text: 'Buenos días, requerimos 50 bultos de insumos para este viernes.', time: '11:38 AM' },
        { sender: 'me', text: 'Buen día estimado Mateo. Sí señor, contamos con stock inmediato.', time: '11:40 AM' },
        { sender: 'them', text: '¿Tienen disponibilidad para entrega en Corabastos?', time: '11:42 AM' }
      ]
    },
    {
      id: 2,
      name: 'Carlos Char (Logística Caribe)',
      phone: '+57 300 812 3490',
      lastMsg: 'Quedo pendiente de la propuesta formal.',
      time: '10:15 AM',
      unread: 0,
      messages: [
        { sender: 'me', text: 'Don Carlos, gusto saludarlo. Le envié los términos de servicio al correo.', time: '09:50 AM' },
        { sender: 'them', text: 'Recibido, revisamos con la junta y quedo pendiente de la propuesta formal.', time: '10:15 AM' }
      ]
    },
    {
      id: 3,
      name: 'Valeria Restrepo - Café La Montaña',
      phone: '+57 314 620 1188',
      lastMsg: 'Perfecto, coordinamos visita técnica.',
      time: 'Ayer',
      unread: 0,
      messages: [
        { sender: 'them', text: 'Hola, ¿podrían validar la capacidad de carga en planta?', time: 'Ayer 04:12 PM' },
        { sender: 'me', text: 'Claro que sí doña Valeria, agendemos para este jueves.', time: 'Ayer 04:30 PM' },
        { sender: 'them', text: 'Perfecto, coordinamos visita técnica.', time: 'Ayer 04:35 PM' }
      ]
    },
    {
      id: 4,
      name: 'Felipe Henao (Agro San Jerónimo)',
      phone: '+57 320 905 7712',
      lastMsg: 'Listo, aprobada la orden de compra.',
      time: 'Lunes',
      unread: 0,
      messages: [
        { sender: 'them', text: 'Enviamos el anticipo correspondiente al 50%.', time: 'Lun 02:10 PM' },
        { sender: 'me', text: 'Confirmado el pago en Bancolombia.', time: 'Lun 02:25 PM' },
        { sender: 'them', text: 'Listo, aprobada la orden de compra.', time: 'Lun 02:40 PM' }
      ]
    }
  ]
};

const STYLES = `
  :root {
    --navy: #061E33;
    --navy-light: #0d2d4a;
    --orange: #F58233;
    --orange-hover: #e07226;
    --bg-app: #f4f6f9;
    --text-main: #212529;
    --text-muted: #6c757d;
    --border-color: #e2e8f0;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: "DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  body { background: var(--bg-app); color: var(--text-main); }
  
  .preview-banner {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 32px;
    background-color: var(--orange);
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;
    z-index: 9999;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }

  .app-layout {
    display: flex;
    min-height: calc(100vh - 32px);
    margin-top: 32px;
  }

  .sidebar {
    width: 250px;
    background-color: var(--navy);
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-shrink: 0;
  }

  .sidebar-header {
    padding: 24px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .brand-logo {
    font-size: 20px;
    font-weight: 800;
    color: #fff;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .brand-logo span { color: var(--orange); }

  .sidebar-menu {
    list-style: none;
    padding: 16px 0;
    flex: 1;
  }
  .sidebar-menu li a {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 20px;
    color: #cbd5e1;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s;
  }
  .sidebar-menu li a:hover,
  .sidebar-menu li.active a {
    background-color: var(--navy-light);
    color: #fff;
    border-left: 4px solid var(--orange);
  }

  .sidebar-footer {
    padding: 20px;
    border-top: 1px solid rgba(255,255,255,0.08);
    background: rgba(0,0,0,0.1);
  }
  .user-badge {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
  }
  .user-avatar {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: var(--orange);
    color: white;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
  }
  .user-info { font-size: 13px; line-height: 1.2; }
  .user-info .user-name { font-weight: 600; color: #fff; }
  .user-info .user-role { color: #94a3b8; font-size: 11px; }

  .btn-logout {
    width: 100%;
    padding: 8px;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.25);
    border-radius: 6px;
    color: #fff;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    transition: 0.2s;
  }
  .btn-logout:hover {
    background: rgba(255,255,255,0.1);
    border-color: #fff;
  }

  .main-content {
    flex: 1;
    background-color: var(--bg-app);
    padding: 30px;
    overflow-y: auto;
  }

  /* View Header */
  .view-header {
    margin-bottom: 24px;
  }
  .view-title { font-size: 24px; font-weight: 700; color: var(--navy); }
  .view-desc { font-size: 14px; color: var(--text-muted); margin-top: 4px; }

  /* Login Card */
  .login-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 32px);
    margin-top: 32px;
    background: #edf2f7;
  }
  .login-card {
    background: #fff;
    padding: 40px;
    border-radius: 12px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.06);
  }
  .login-title { font-size: 22px; font-weight: 800; color: var(--navy); text-align: center; }
  .login-sub { font-size: 13px; color: var(--text-muted); text-align: center; margin-bottom: 24px; }
  .form-group { margin-bottom: 16px; }
  .form-group label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: var(--navy); }
  .form-control {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-size: 14px;
    outline: none;
  }
  .form-control:focus { border-color: var(--orange); }
  .btn-primary {
    width: 100%;
    background-color: var(--orange);
    color: white;
    border: none;
    padding: 12px;
    font-size: 14px;
    font-weight: 700;
    border-radius: 6px;
    cursor: pointer;
    transition: 0.2s;
  }
  .btn-primary:hover { background-color: var(--orange-hover); }

  /* Home Apps Grid */
  .apps-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 20px;
  }
  .app-card {
    background: #fff;
    border: 1px solid var(--border-color);
    border-radius: 10px;
    padding: 24px 20px;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .app-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 18px rgba(0,0,0,0.06);
    border-color: var(--orange);
  }
  .app-icon { font-size: 32px; margin-bottom: 12px; }
  .app-name { font-size: 16px; font-weight: 700; color: var(--navy); margin-bottom: 4px; }
  .app-desc { font-size: 12px; color: var(--text-muted); }

  /* Kanban Board */
  .kanban-board {
    display: flex;
    gap: 16px;
    overflow-x: auto;
    padding-bottom: 16px;
  }
  .kanban-col {
    background: #edf2f7;
    border-radius: 8px;
    min-width: 250px;
    max-width: 250px;
    padding: 12px;
    display: flex;
    flex-direction: column;
  }
  .col-header {
    font-size: 12px;
    font-weight: 700;
    color: var(--navy);
    text-transform: uppercase;
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .col-count {
    background: #cbd5e1;
    color: var(--navy);
    border-radius: 12px;
    padding: 2px 8px;
    font-size: 11px;
  }
  .kanban-cards { display: flex; flex-direction: column; gap: 10px; flex: 1; }
  .lead-card {
    background: #fff;
    border-radius: 6px;
    padding: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    border-left: 3px solid var(--orange);
  }
  .lead-company { font-size: 13px; font-weight: 700; color: var(--navy); margin-bottom: 4px; }
  .lead-contact { font-size: 12px; color: var(--text-muted); margin-bottom: 8px; }
  .lead-val { font-size: 12px; font-weight: 700; color: #166534; background: #dcfce7; display: inline-block; padding: 2px 6px; border-radius: 4px; }

  /* WhatsApp Chat Layout */
  .chat-layout {
    display: flex;
    background: #fff;
    border: 1px solid var(--border-color);
    border-radius: 10px;
    height: 580px;
    overflow: hidden;
  }
  .chat-sidebar {
    width: 320px;
    border-right: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
  }
  .chat-list { overflow-y: auto; flex: 1; }
  .chat-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-bottom: 1px solid #f1f5f9;
    cursor: pointer;
  }
  .chat-item:hover, .chat-item.active { background: #f8fafc; }
  .chat-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #25D366;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 15px;
    flex-shrink: 0;
  }
  .chat-details { flex: 1; min-width: 0; }
  .chat-title-row { display: flex; justify-content: space-between; font-size: 13px; font-weight: 700; margin-bottom: 2px; }
  .chat-time { font-size: 11px; color: var(--text-muted); font-weight: 400; }
  .chat-preview { font-size: 12px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .chat-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #efeae2;
  }
  .chat-topbar {
    padding: 12px 18px;
    background: #fff;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .chat-messages {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .bubble {
    max-width: 65%;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 13px;
    position: relative;
    line-height: 1.4;
  }
  .bubble.me {
    align-self: flex-end;
    background: #d9fdd3;
    color: #111;
  }
  .bubble.them {
    align-self: flex-start;
    background: #fff;
    color: #111;
  }
  .bubble-time { font-size: 10px; color: #888; text-align: right; margin-top: 4px; }
  .chat-footer-mock {
    background: #f0f2f5;
    padding: 12px 16px;
    border-top: 1px solid var(--border-color);
    font-size: 12px;
    color: var(--text-muted);
    text-align: center;
    font-style: italic;
  }

  /* Admin Apps */
  .admin-panel {
    background: #fff;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    padding: 24px;
    max-width: 650px;
  }
  .company-info {
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border-color);
  }
  .company-name { font-size: 18px; font-weight: 700; color: var(--navy); }
  .company-nit { font-size: 13px; color: var(--text-muted); }
  .apps-toggle-list { display: flex; flex-direction: column; gap: 14px; }
  .toggle-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-radius: 6px;
    background: #f8fafc;
  }
  .toggle-label { font-size: 14px; font-weight: 600; color: var(--navy); }
  .switch {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
  }
  .switch input { opacity: 0; width: 0; height: 0; }
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: #cbd5e1;
    transition: .2s;
    border-radius: 24px;
  }
  .slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .2s;
    border-radius: 50%;
  }
  input:checked + .slider { background-color: var(--orange); }
  input:checked + .slider:before { transform: translateX(20px); }
`;

function injectStyles() {
  if (!document.getElementById('nets-styles')) {
    const styleEl = document.createElement('style');
    styleEl.id = 'nets-styles';
    styleEl.innerHTML = STYLES;
    document.head.appendChild(styleEl);
  }
}

function renderBanner() {
  return `<div class="preview-banner">VISTA PREVIA · Datos de ejemplo — aún no conectado a Odoo</div>`;
}

function renderLayout(currentHash, contentHtml) {
  return `
    ${renderBanner()}
    <div class="app-layout">
      <aside class="sidebar">
        <div>
          <div class="sidebar-header">
            <a href="#/home" class="brand-logo">Nets<span>Company</span></a>
          </div>
          <ul class="sidebar-menu">
            <li class="${currentHash === '#/home' ? 'active' : ''}">
              <a href="#/home">🏠 Inicio</a>
            </li>
            <li class="${currentHash === '#/crm' ? 'active' : ''}">
              <a href="#/crm">📈 CRM</a>
            </li>
            <li class="${currentHash === '#/chat' ? 'active' : ''}">
              <a href="#/chat">💬 Chat WhatsApp</a>
            </li>
            <li class="${currentHash === '#/admin/apps' ? 'active' : ''}">
              <a href="#/admin/apps">⚙️ Admin apps</a>
            </li>
          </ul>
        </div>
        <div class="sidebar-footer">
          <div class="user-badge">
            <div class="user-avatar">G</div>
            <div class="user-info">
              <div class="user-name">Ger (ejemplo)</div>
              <div class="user-role">Administrador</div>
            </div>
          </div>
          <button class="btn-logout" id="btnLogout">Cerrar Sesión</button>
        </div>
      </aside>
      <main class="main-content">
        ${contentHtml}
      </main>
    </div>
  `;
}

function renderLogin() {
  return `
    ${renderBanner()}
    <div class="login-wrapper">
      <div class="login-card">
        <h2 class="login-title">Nets Company</h2>
        <p class="login-sub">Portal de Operaciones y Servicios Empresariales</p>
        <form id="loginForm">
          <div class="form-group">
            <label>Correo Electrónico</label>
            <input type="email" class="form-control" placeholder="ger@ejemplo.com" required value="ger@ejemplo.com">
          </div>
          <div class="form-group">
            <label>Contraseña</label>
            <input type="password" class="form-control" placeholder="••••••••" required value="123456">
          </div>
          <button type="submit" class="btn-primary">Ingresar al Portal</button>
        </form>
      </div>
    </div>
  `;
}

function renderHome() {
  return `
    <div class="view-header">
      <h1 class="view-title">Panel de Aplicaciones</h1>
      <p class="view-desc">Seleccione una aplicación para gestionar los módulos empresariales.</p>
    </div>
    <div class="apps-grid">
      <div class="app-card" onclick="window.location.hash='#/crm'">
        <div class="app-icon">📈</div>
        <div class="app-name">CRM</div>
        <div class="app-desc">Embudos de venta, cotizaciones y oportunidades activas.</div>
      </div>
      <div class="app-card" onclick="window.location.hash='#/chat'">
        <div class="app-icon">💬</div>
        <div class="app-name">Chat WhatsApp</div>
        <div class="app-desc">Atención en línea a clientes y prospectos comerciales.</div>
      </div>
      <div class="app-card" onclick="alert('Módulo de Inventario disponible próximamente con sincronización Odoo.')">
        <div class="app-icon">📦</div>
        <div class="app-name">Inventario</div>
        <div class="app-desc">Existencias, bodegas en Bogotá y despachos nacionales.</div>
      </div>
      <div class="app-card" onclick="alert('Módulo de Facturación Electrónica DIAN disponible próximamente.')">
        <div class="app-icon">🧾</div>
        <div class="app-name">Facturación</div>
        <div class="app-desc">Emisión DIAN, resoluciones y cobro de cartera.</div>
      </div>
      <div class="app-card" onclick="alert('Módulo de Soporte y Mesa de Ayuda disponible próximamente.')">
        <div class="app-icon">🎧</div>
        <div class="app-name">Soporte</div>
        <div class="app-desc">Mesa de ayuda y gestión de tickets de servicio.</div>
      </div>
    </div>
  `;
}

function renderCRM() {
  const stages = ['PENDIENTE', 'CONTACTADO', 'COTIZACIÓN ENVIADA', 'EN NEGOCIACIÓN', 'GANADO'];
  const columnsHtml = stages.map(stage => {
    const stageLeads = state.leads.filter(l => l.stage === stage);
    const cardsHtml = stageLeads.map(lead => `
      <div class="lead-card">
        <div class="lead-company">${lead.name}</div>
        <div class="lead-contact">${lead.contact}</div>
        <div class="lead-val">${lead.val}</div>
      </div>
    `).join('');

    return `
      <div class="kanban-col">
        <div class="col-header">
          <span>${stage}</span>
          <span class="col-count">${stageLeads.length}</span>
        </div>
        <div class="kanban-cards">${cardsHtml}</div>
      </div>
    `;
  }).join('');

  return `
    <div class="view-header">
      <h1 class="view-title">Embudo de Ventas (CRM)</h1>
      <p class="view-desc">Gestión y seguimiento de cuentas comerciales en Colombia.</p>
    </div>
    <div class="kanban-board">
      ${columnsHtml}
    </div>
  `;
}

function renderChat() {
  const activeChat = state.chats.find(c => c.id === state.selectedChatId) || state.chats[0];

  const chatListHtml = state.chats.map(chat => `
    <div class="chat-item ${chat.id === activeChat.id ? 'active' : ''}" data-chat-id="${chat.id}">
      <div class="chat-avatar">${chat.name.charAt(0)}</div>
      <div class="chat-details">
        <div class="chat-title-row">
          <span>${chat.name}</span>
          <span class="chat-time">${chat.time}</span>
        </div>
        <div class="chat-preview">${chat.lastMsg}</div>
      </div>
    </div>
  `).join('');

  const messagesHtml = activeChat.messages.map(m => `
    <div class="bubble ${m.sender}">
      <div>${m.text}</div>
      <div class="bubble-time">${m.time}</div>
    </div>
  `).join('');

  return `
    <div class="view-header">
      <h1 class="view-title">Canal WhatsApp Oficial</h1>
      <p class="view-desc">Historial centralizado de interacciones con clientes.</p>
    </div>
    <div class="chat-layout">
      <div class="chat-sidebar">
        <div class="chat-list">${chatListHtml}</div>
      </div>
      <div class="chat-main">
        <div class="chat-topbar">
          <div class="chat-avatar">${activeChat.name.charAt(0)}</div>
          <div>
            <div style="font-weight:700; font-size:14px; color:var(--navy);">${activeChat.name}</div>
            <div style="font-size:11px; color:var(--text-muted);">${activeChat.phone}</div>
          </div>
        </div>
        <div class="chat-messages">${messagesHtml}</div>
        <div class="chat-footer-mock">Vista previa de solo lectura · Integración WhatsApp Cloud API</div>
      </div>
    </div>
  `;
}

function renderAdminApps() {
  const appKeys = [
    { id: 'crm', name: 'CRM y Gestión de Leads' },
    { id: 'chat', name: 'Chat WhatsApp Empresarial' },
    { id: 'inventario', name: 'Inventario Multibodega' },
    { id: 'facturacion', name: 'Facturación Electrónica DIAN' },
    { id: 'soporte', name: 'Mesa de Soporte / Tickets' }
  ];

  const togglesHtml = appKeys.map(app => `
    <div class="toggle-item">
      <span class="toggle-label">${app.name}</span>
      <label class="switch">
        <input type="checkbox" data-app-id="${app.id}" ${state.activeApps[app.id] ? 'checked' : ''}>
        <span class="slider"></span>
      </label>
    </div>
  `).join('');

  return `
    <div class="view-header">
      <h1 class="view-title">Configuración de Aplicaciones</h1>
      <p class="view-desc">Habilite o deshabilite las aplicaciones del entorno corporativo.</p>
    </div>
    <div class="admin-panel">
      <div class="company-info">
        <div class="company-name">Demo Cliente SAS</div>
        <div class="company-nit">NIT: 901.452.889-1 · Régimen Común (Colombia)</div>
      </div>
      <div class="apps-toggle-list">
        ${togglesHtml}
      </div>
    </div>
  `;
}

function attachEvents(hash) {
  if (hash === '#/login') {
    const form = document.getElementById('loginForm');
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        sessionStorage.setItem('nets_user', 'Ger (ejemplo)');
        window.location.hash = '#/home';
      };
    }
    return;
  }

  const btnLogout = document.getElementById('btnLogout');
  if (btnLogout) {
    btnLogout.onclick = () => {
      sessionStorage.removeItem('nets_user');
      window.location.hash = '#/login';
    };
  }

  if (hash === '#/chat') {
    document.querySelectorAll('.chat-item').forEach(item => {
      item.onclick = () => {
        state.selectedChatId = parseInt(item.getAttribute('data-chat-id'), 10);
        router();
      };
    });
  }

  if (hash === '#/admin/apps') {
    document.querySelectorAll('input[data-app-id]').forEach(checkbox => {
      checkbox.onchange = (e) => {
        const id = e.target.getAttribute('data-app-id');
        state.activeApps[id] = e.target.checked;
      };
    });
  }
}

function router() {
  injectStyles();
  const root = document.getElementById('app');
  if (!root) return;

  const rawHash = window.location.hash;
  const hash = rawHash || '#/home';
  const isAuth = !!sessionStorage.getItem('nets_user');

  if (!isAuth && hash !== '#/login') {
    window.location.hash = '#/login';
    return;
  }

  if (isAuth && hash === '#/login') {
    window.location.hash = '#/home';
    return;
  }

  if (hash === '#/login') {
    root.innerHTML = renderLogin();
    attachEvents(hash);
    return;
  }

  let contentHtml = '';
  switch (hash) {
    case '#/home':
      contentHtml = renderHome();
      break;
    case '#/crm':
      contentHtml = renderCRM();
      break;
    case '#/chat':
      contentHtml = renderChat();
      break;
    case '#/admin/apps':
      contentHtml = renderAdminApps();
      break;
    default:
      contentHtml = renderHome();
  }

  root.innerHTML = renderLayout(hash, contentHtml);
  attachEvents(hash);
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);
