  const sidebar = document.getElementById('sidebar');
  const content = document.getElementById('content');
  const overlay = document.getElementById('overlay');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const collapseBtn = document.getElementById('collapseBtn');
  const collapseLabel = collapseBtn.querySelector('.collapse-label');
  const topBars = document.getElementById('topBars');

  const isMobile = () => window.innerWidth <= 768;

  function updateBarsOffset() {
    document.documentElement.style.setProperty('--bars-h', topBars.offsetHeight + 'px');
  }

  function setCollapsed(collapsed) {
    sidebar.classList.toggle('collapsed', collapsed);
    content.classList.toggle('collapsed', collapsed);
    collapseLabel.textContent = collapsed ? '' : 'Colapsar';
    collapseBtn.setAttribute('aria-expanded', String(!collapsed));
    hamburgerBtn.setAttribute('aria-expanded', String(!collapsed));
  }

  function setMobileOpen(open) {
    sidebar.classList.toggle('mobile-open', open);
    overlay.classList.toggle('visible', open);
    overlay.setAttribute('aria-hidden', String(!open));
    hamburgerBtn.setAttribute('aria-expanded', String(open));
  }

  hamburgerBtn.addEventListener('click', () => {
    if (isMobile()) {
      setMobileOpen(!sidebar.classList.contains('mobile-open'));
    } else {
      setCollapsed(!sidebar.classList.contains('collapsed'));
    }
  });

  collapseBtn.addEventListener('click', () => {
    setCollapsed(!sidebar.classList.contains('collapsed'));
  });

  overlay.addEventListener('click', () => setMobileOpen(false));

  // dropdowns (gear + user)
  function setupDropdown(btnId, dropdownId) {
    const btn = document.getElementById(btnId);
    const dropdown = document.getElementById(dropdownId);
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains('open');
      document.querySelectorAll('.dropdown').forEach(d => {
        d.classList.remove('open');
        d.parentElement.querySelector('.icon-btn')?.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        dropdown.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  }
  setupDropdown('gearBtn', 'gearDropdown');
  setupDropdown('userBtn', 'userDropdown');

  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
    document.querySelectorAll('.icon-btn').forEach(b => b.setAttribute('aria-expanded', 'false'));
  });

  // ===== tema claro/escuro (persistido em localStorage) =====
  const THEME_KEY = 'openquadro_theme';
  const themeLightBtn = document.getElementById('themeLightBtn');
  const themeDarkBtn = document.getElementById('themeDarkBtn');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    themeLightBtn.classList.toggle('active', theme === 'light');
    themeDarkBtn.classList.toggle('active', theme === 'dark');
    localStorage.setItem(THEME_KEY, theme);
  }

  function preferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  themeLightBtn.addEventListener('click', () => applyTheme('light'));
  themeDarkBtn.addEventListener('click', () => applyTheme('dark'));

  applyTheme(preferredTheme());

  // pesquisa mobile (ícone abre barra dedicada por baixo do topbar)
  const mobileSearchBtn = document.getElementById('mobileSearchBtn');
  const mobileSearchBar = document.getElementById('mobileSearchBar');
  mobileSearchBtn.addEventListener('click', () => {
    mobileSearchBar.classList.add('visible');
    updateBarsOffset();
    mobileSearchBar.querySelector('input').focus();
  });
  document.getElementById('closeMobileSearch').addEventListener('click', () => {
    mobileSearchBar.classList.remove('visible');
    updateBarsOffset();
  });

  // repõe estado ao mudar de breakpoint (mobile <-> desktop)
  window.addEventListener('resize', () => {
    if (!isMobile()) {
      overlay.classList.remove('visible');
      overlay.setAttribute('aria-hidden', 'true');
      sidebar.classList.remove('mobile-open');
      mobileSearchBar.classList.remove('visible');
      setCollapsed(sidebar.classList.contains('collapsed'));
    } else {
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
    updateBarsOffset();
  });

  updateBarsOffset();

  // ============================================================
  // CONFIG / CONSTANTES — conteúdo funcional dos quadros
  // ============================================================
  const days = ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'];
  const monthNamesPt = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const stateLabels = { 'a-fazer': 'A fazer', 'em-curso': 'Em curso', 'feito': 'Feito' };
  const stateOrder = ['a-fazer', 'em-curso', 'feito'];
  const stateVariant = { 'a-fazer': null, 'em-curso': 'progress', 'feito': 'done' };
  const apptStateLabels = { 'pendente': 'Pendente', 'confirmada': 'Confirmada', 'cancelada': 'Cancelada' };
  const apptStateOrder = ['pendente', 'confirmada', 'cancelada'];
  const apptStateVariant = { 'pendente': null, 'confirmada': 'done', 'cancelada': 'danger' };

  // ícones curados (sem emoji — o guia de estilo reserva emoji só à mascote Drobot)
  const BOARD_ICONS = {
    checklist: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
    grid: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="16" y1="2" x2="16" y2="6"/>',
    archive: '<path d="M21 8V21H3V8"/><path d="M1 3h22v5H1z"/><line x1="10" y1="12" x2="14" y2="12"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    folder: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
    tag: '<path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>',
    briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>'
  };
  const ICON_KEYS = Object.keys(BOARD_ICONS);
  // cores de categoria — restrito ao guia de estilo (DESIGN.md "Brand & Category Colors"),
  // usadas só no ícone do quadro, nunca em botões/inputs/estados funcionais
  const BOARD_COLORS = ['#2563EB', '#06B6D4', '#885CF6', '#38BDF8', '#64748B'];
  const VIEW_DEFS = [
    { type: 'grid',          title: 'Grelha semanal',        sub: 'categoria × dia da semana' },
    { type: 'checklist',     title: 'Checklist',             sub: 'itens com estado e prazo' },
    { type: 'custom-table',  title: 'Tabela personalizada',  sub: 'colunas à tua escolha' },
    { type: 'expense-table', title: 'Compras / Despesas',    sub: 'nome, qtd., preço, notas' },
    { type: 'appointments',  title: 'Marcações',             sub: 'hora + estado, sem sobreposição' },
    { type: 'agenda',        title: 'Agenda',                sub: 'calendário + tarefas por dia' },
  ];
  const STORAGE_KEY = 'openquadro_boards';

  function uid(prefix) { return prefix + '_' + Math.random().toString(36).slice(2, 9); }
  function pad2(n) { return String(n).padStart(2, '0'); }
  function fmtDateISO(d) { return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }
  function todayStr() { return fmtDateISO(new Date()); }
  function currentMonthStr() { const d = new Date(); return d.getFullYear() + '-' + pad2(d.getMonth() + 1); }
  function formatDatePt(iso) { const [y, m, d] = iso.split('-').map(Number); return d + ' de ' + monthNamesPt[m - 1] + ' de ' + y; }
  function buildCalendarDays(year, monthIndex0) {
    const firstOfMonth = new Date(year, monthIndex0, 1);
    const firstWeekday = (firstOfMonth.getDay() + 6) % 7; // Segunda = 0
    const start = new Date(year, monthIndex0, 1 - firstWeekday);
    const result = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      result.push({ date: d, inMonth: d.getMonth() === monthIndex0 });
    }
    return result;
  }
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  function boardIconSvg(iconKey) { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${BOARD_ICONS[iconKey] || BOARD_ICONS.folder}</svg>`; }

  // ============================================================
  // TABELA RESPONSIVA: coluna 1 fixa + gestão de colunas em modal
  // (padrão portado de comparativo-tabela-mobile.html, variante C —
  // mostrar/esconder e adicionar/remover colunas vive no modal, nunca
  // diretamente na tabela)
  // ============================================================
  const colVisibilityState = {}; // { stateKey: [colId, ...] } — colunas toggleáveis visíveis

  function getVisibleCols(stateKey, allColIds, defaultIds) {
    let visible = colVisibilityState[stateKey];
    if (!visible) {
      const def = (defaultIds || allColIds.slice(0, 3)).filter(id => allColIds.includes(id));
      visible = def.length ? def : allColIds.slice(0, Math.min(3, allColIds.length));
    } else {
      visible = visible.filter(id => allColIds.includes(id));
      if (!visible.length) visible = allColIds.slice(0, Math.min(1, allColIds.length));
    }
    colVisibilityState[stateKey] = visible;
    return visible;
  }
  function toggleCol(stateKey, colId, allColIds) {
    const visible = colVisibilityState[stateKey] || [];
    if (visible.includes(colId)) {
      if (visible.length > 1) colVisibilityState[stateKey] = visible.filter(id => id !== colId);
    } else {
      colVisibilityState[stateKey] = allColIds.filter(id => visible.includes(id) || id === colId);
    }
  }
  // barra acima da tabela: só o texto informativo + botão que abre o modal de gestão
  function renderColumnsBar(fixedLabel, hasToggleable) {
    if (!hasToggleable) return '';
    return `
      <div class="table-toolbar">
        <span class="hint">Coluna "${escapeHtml(fixedLabel)}" fica sempre visível</span>
        <button type="button" class="col-toggle-btn" data-open-columns>Colunas</button>
      </div>`;
  }

  // ============================================================
  // SEED DATA (usado apenas se não existir nada em localStorage)
  // ============================================================
  function seedData() {
    return {
      boards: [
        {
          id: uid('b'), name: 'Lista de Compras', icon: 'tag', color: '#06B6D4', type: 'expense-table',
          items: [
            { id: uid('it'), nome: 'Arroz agulha', descricao: '', quantidade: 2, preco: 1.2, notas: '' },
            { id: uid('it'), nome: 'Detergente da loiça', descricao: '', quantidade: 1, preco: 2.5, notas: 'marca habitual' },
          ]
        },
        {
          id: uid('b'), name: 'Planeador Semanal', icon: 'grid', color: '#885CF6', type: 'grid',
          rows: [
            { id: uid('row'), label: 'Pequeno-almoço', cells: { Seg: 'Iogurte + fruta', Qua: 'Ovos mexidos' } },
            { id: uid('row'), label: 'Almoço', cells: { Ter: 'Frango grelhado + arroz' } },
            { id: uid('row'), label: 'Jantar', cells: { Qui: 'Sopa de legumes' } },
          ]
        },
        {
          id: uid('b'), name: 'Inventário', icon: 'archive', color: '#64748B', type: 'custom-table',
          columns: [{ id: 'col_item', label: 'Item' }, { id: 'col_qtd', label: 'Quantidade' }, { id: 'col_local', label: 'Localização' }],
          rows: [
            { id: uid('row'), cells: { col_item: 'Caixa de ferramentas', col_qtd: '1', col_local: 'Garagem' } },
            { id: uid('row'), cells: { col_item: 'Livros de cozinha', col_qtd: '6', col_local: 'Sala' } },
          ]
        },
        {
          id: uid('b'), name: 'Contactos', icon: 'users', color: '#38BDF8', type: 'custom-table',
          columns: [{ id: 'col_nome', label: 'Nome' }, { id: 'col_tel', label: 'Telefone' }, { id: 'col_email', label: 'Email' }],
          rows: [
            { id: uid('row'), cells: { col_nome: 'Ana Silva', col_tel: '912 345 678', col_email: 'ana@example.com' } },
          ]
        }
      ]
    };
  }

  function loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { console.warn('localStorage indisponível ou corrompido', e); }
    const seeded = seedData();
    saveDataObj(seeded);
    return seeded;
  }
  function saveDataObj(d) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch (e) { console.warn('não foi possível gravar', e); }
  }

  let db = loadData();
  let activeBoardId = db.boards[0] ? db.boards[0].id : null;
  const apptEditState = {}; // { boardId: itemId | null } — controla qual marcação está em edição

  function save() { saveDataObj(db); }
  function getBoard(id) { return db.boards.find(b => b.id === id); }

  // ============================================================
  // RENDER: SIDEBAR
  // ============================================================
  function renderSidebar() {
    const el = document.getElementById('boardList');
    el.innerHTML = db.boards.map(b => `
      <li>
        <button class="board-item ${b.id === activeBoardId ? 'active' : ''}" data-id="${b.id}">
          <span class="board-icon-mini" style="color:${b.color}">${boardIconSvg(b.icon)}</span>
          <span class="label">${escapeHtml(b.name)}</span>
        </button>
      </li>
    `).join('');
    el.querySelectorAll('.board-item').forEach(btn => {
      btn.addEventListener('click', () => {
        activeBoardId = btn.dataset.id;
        renderAll();
        if (isMobile()) setMobileOpen(false);
      });
    });
  }

  // ============================================================
  // RENDER: CONTENT (cabeçalho do quadro + vista ativa)
  // ============================================================
  function renderContent() {
    const contentEl = document.getElementById('content');
    const board = activeBoardId ? getBoard(activeBoardId) : null;

    if (!board) {
      contentEl.classList.add('is-empty');
      contentEl.innerHTML = `
        <div class="empty-state">
          <div class="icon">${boardIconSvg('folder')}</div>
          <h1>Ainda não tens quadros</h1>
          <p>Cria o primeiro quadro para começares a organizar a tua informação.</p>
        </div>`;
      return;
    }
    contentEl.classList.remove('is-empty');

    contentEl.innerHTML = `
      <div class="content-inner">
        <div class="board-header">
          <div class="board-icon-badge" style="background:${board.color}22;color:${board.color}">${boardIconSvg(board.icon)}</div>
          <h1>${escapeHtml(board.name)}</h1>
          <button class="ghost-btn" id="editBoardBtn" title="Definições do quadro">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </button>
        </div>
        <div class="card" id="boardView"></div>
      </div>
    `;

    document.getElementById('editBoardBtn').addEventListener('click', () => openBoardModal(board));
    renderBoardView(document.getElementById('boardView'), board);
  }

  function renderAll() {
    renderSidebar();
    renderContent();
  }

  // ============================================================
  // DISPATCH DE VISTAS
  // ============================================================
  function renderBoardView(container, board) {
    if (board.type === 'grid') renderGridView(container, board);
    else if (board.type === 'checklist') renderChecklistView(container, board);
    else if (board.type === 'custom-table') renderCustomTableView(container, board);
    else if (board.type === 'expense-table') renderExpenseTableView(container, board);
    else if (board.type === 'appointments') renderAppointmentsView(container, board);
    else if (board.type === 'agenda') renderAgendaView(container, board);
  }

  // ---- Grelha semanal ----
  function renderGridView(container, board) {
    const rows = board.rows;
    const stateKey = board.id;
    const visibleDays = getVisibleCols(stateKey, days, days.slice(0, 3));
    const toolbar = renderColumnsBar('Categoria', true);

    let head = '<th>Categoria</th>' + visibleDays.map(d => `<th>${d}</th>`).join('');
    let body = rows.map(row => {
      let cells = visibleDays.map(d => `<td><div class="meal-cell" contenteditable="true" data-row="${row.id}" data-day="${d}">${escapeHtml(row.cells[d] || '')}</div></td>`).join('');
      return `<tr><td><div class="row-label">${escapeHtml(row.label)}<button class="row-del" data-row="${row.id}" title="Remover">✕</button></div></td>${cells}</tr>`;
    }).join('');

    container.innerHTML = `
      ${toolbar}
      <div class="grid-wrap"><table class="meal-grid"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>
      <button type="button" class="add-record-btn" id="gridAddBtn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Nova categoria
      </button>`;

    container.querySelector('[data-open-columns]')?.addEventListener('click', () => {
      openColumnsModal({
        title: 'Colunas visíveis',
        stateKey,
        columns: [{ id: '__fixed__', label: 'Categoria', fixed: true }, ...days.map(d => ({ id: d, label: d }))],
        allowAddRemove: false,
        rerenderView: () => renderGridView(container, board),
      });
    });

    container.querySelectorAll('.meal-cell').forEach(cell => {
      cell.addEventListener('input', () => {
        const row = rows.find(r => r.id === cell.dataset.row);
        row.cells[cell.dataset.day] = cell.textContent;
        save();
      });
    });
    container.querySelectorAll('.row-del').forEach(btn => {
      btn.addEventListener('click', () => {
        board.rows = board.rows.filter(r => r.id !== btn.dataset.row);
        save(); renderGridView(container, board);
      });
    });
    container.querySelector('#gridAddBtn').addEventListener('click', () => {
      openAddRecordModal('Nova categoria', [
        { id: 'label', label: 'Nome da categoria', placeholder: 'ex: Lanche' },
      ], (v) => {
        const label = v.label.trim();
        if (!label) return 'Indica um nome para a categoria.';
        board.rows.push({ id: uid('row'), label, cells: {} });
        save(); renderGridView(container, board);
        return true;
      });
    });
  }

  // ---- Checklist ----
  function renderChecklistView(container, board) {
    const items = board.items;
    container.innerHTML = items.map(t => `
      <div class="task-row">
        <div class="task-name">${escapeHtml(t.name)}</div>
        <div class="task-due">${escapeHtml(t.due || '')}</div>
        <button class="status-pill mono" ${stateVariant[t.state] ? `data-variant="${stateVariant[t.state]}"` : ''} data-id="${t.id}">${stateLabels[t.state]}</button>
        <button class="item-del" data-id="${t.id}" title="Remover">✕</button>
      </div>`).join('') + `
      <button type="button" class="add-record-btn" id="checkAddBtn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Nova tarefa
      </button>`;

    container.querySelectorAll('.status-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const it = items.find(i => i.id === btn.dataset.id);
        it.state = stateOrder[(stateOrder.indexOf(it.state) + 1) % stateOrder.length];
        save(); renderChecklistView(container, board);
      });
    });
    container.querySelectorAll('.item-del').forEach(btn => {
      btn.addEventListener('click', () => {
        board.items = board.items.filter(i => i.id !== btn.dataset.id);
        save(); renderChecklistView(container, board);
      });
    });
    container.querySelector('#checkAddBtn').addEventListener('click', () => {
      openAddRecordModal('Nova tarefa', [
        { id: 'name', label: 'Nome da tarefa', placeholder: 'ex: Comprar presente' },
        { id: 'due', label: 'Prazo (opcional)', placeholder: 'ex: sexta-feira' },
      ], (v) => {
        const name = v.name.trim();
        if (!name) return 'Indica o nome da tarefa.';
        board.items.push({ id: uid('it'), name, due: v.due.trim() || '-', state: 'a-fazer' });
        save(); renderChecklistView(container, board);
        return true;
      });
    });
  }

  // ---- Tabela personalizada (colunas configuráveis) ----
  function renderCustomTableView(container, board) {
    const cols = board.columns;
    const rows = board.rows;
    const stateKey = board.id;

    const openManageModal = () => openColumnsModal({
      title: 'Colunas',
      stateKey,
      columns: board.columns.map(c => ({ id: c.id, label: c.label })),
      allowAddRemove: true,
      positionalFixed: true,
      onAdd: (label) => {
        const newCol = { id: uid('col'), label };
        board.columns.push(newCol);
        save();
        return { id: newCol.id, label: newCol.label };
      },
      onRemove: (colId) => {
        if (!confirm('Remover esta coluna e os respetivos dados em todas as linhas?')) return false;
        board.columns = board.columns.filter(c => c.id !== colId);
        board.rows.forEach(r => delete r.cells[colId]);
        save();
        return true;
      },
      rerenderView: () => renderCustomTableView(container, board),
    });

    if (!cols.length) {
      container.innerHTML = `
        <div class="empty-state" style="padding:2.5rem 1rem;max-width:none;">
          <div class="icon">${boardIconSvg('grid')}</div>
          <h1>Ainda sem colunas</h1>
          <p>Adiciona a primeira coluna para começares a preencher a tabela.</p>
          <button type="button" class="btn btn-primary" id="ctAddFirstColBtn" style="margin-top:14px;">+ Adicionar coluna</button>
        </div>`;
      container.querySelector('#ctAddFirstColBtn').addEventListener('click', openManageModal);
      return;
    }

    const stickyCol = cols[0];
    const toggleCols = cols.slice(1);
    const visibleIds = toggleCols.length ? getVisibleCols(stateKey, toggleCols.map(c => c.id)) : [];
    const visibleCols = [stickyCol, ...toggleCols.filter(c => visibleIds.includes(c.id))];
    const toolbar = renderColumnsBar(stickyCol.label, true);

    const headHtml = visibleCols.map(c => `<th>${escapeHtml(c.label)}</th>`).join('');
    const bodyHtml = rows.map(r => {
      const tds = visibleCols.map(c => `<td><input type="text" class="dtable-input" data-row="${r.id}" data-col="${c.id}" value="${escapeHtml(r.cells[c.id] || '')}"></td>`).join('');
      return `<tr>${tds}<td style="width:40px;"><button class="item-del" data-row="${r.id}" title="Remover linha">✕</button></td></tr>`;
    }).join('');
    container.innerHTML = `
      ${toolbar}
      <div class="dtable-wrap"><table class="dtable"><thead><tr>${headHtml}<th></th></tr></thead><tbody>${bodyHtml}</tbody></table></div>
      <button type="button" class="add-record-btn" id="ctAddRowBtn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Nova linha
      </button>`;

    container.querySelector('[data-open-columns]')?.addEventListener('click', openManageModal);

    container.querySelectorAll('.dtable-input').forEach(inp => {
      inp.addEventListener('input', () => {
        const row = rows.find(r => r.id === inp.dataset.row);
        row.cells[inp.dataset.col] = inp.value;
        save();
      });
    });
    container.querySelectorAll('.item-del').forEach(btn => {
      btn.addEventListener('click', () => {
        board.rows = board.rows.filter(r => r.id !== btn.dataset.row);
        save(); renderCustomTableView(container, board);
      });
    });

    container.querySelector('#ctAddRowBtn').addEventListener('click', () => {
      openAddRecordModal('Nova linha', board.columns.map(c => ({ id: c.id, label: c.label, placeholder: c.label })), (v) => {
        const cells = {};
        let any = false;
        board.columns.forEach(c => {
          const val = (v[c.id] || '').trim();
          if (val) any = true;
          cells[c.id] = val;
        });
        if (!any) return 'Preenche pelo menos um campo.';
        board.rows.push({ id: uid('row'), cells });
        save(); renderCustomTableView(container, board);
        return true;
      });
    });
  }

  // ---- Tabela de compras / despesas (colunas fixas: Nome sempre visível/fixa, Subtotal sempre visível) ----
  const EXPENSE_TOGGLE_COLS = [
    { id: 'descricao', label: 'Descrição' },
    { id: 'quantidade', label: 'Qtd.' },
    { id: 'preco', label: 'Preço' },
    { id: 'notas', label: 'Notas' },
  ];
  function renderExpenseTableView(container, board) {
    const items = board.items;
    const stateKey = board.id;
    const visible = getVisibleCols(stateKey, EXPENSE_TOGGLE_COLS.map(c => c.id), ['quantidade', 'preco']);
    const show = id => visible.includes(id);
    const toolbar = renderColumnsBar('Nome', true);

    const fieldCell = (it) => {
      let html = '';
      if (show('descricao')) html += `<td><input type="text" class="dtable-input" data-id="${it.id}" data-field="descricao" value="${escapeHtml(it.descricao || '')}"></td>`;
      if (show('quantidade')) html += `<td><input type="number" min="0" step="1" class="dtable-input" data-id="${it.id}" data-field="quantidade" value="${it.quantidade || 0}"></td>`;
      if (show('preco')) html += `<td><input type="number" min="0" step="0.01" class="dtable-input" data-id="${it.id}" data-field="preco" value="${it.preco || 0}"></td>`;
      if (show('notas')) html += `<td><input type="text" class="dtable-input" data-id="${it.id}" data-field="notas" value="${escapeHtml(it.notas || '')}"></td>`;
      return html;
    };

    const rowsHtml = items.map(it => {
      const subtotal = (Number(it.quantidade) || 0) * (Number(it.preco) || 0);
      return `<tr>
        <td><input type="text" class="dtable-input" data-id="${it.id}" data-field="nome" value="${escapeHtml(it.nome || '')}"></td>
        ${fieldCell(it)}
        <td class="dtable-num" data-subtotal="${it.id}">${subtotal.toFixed(2)}€</td>
        <td style="width:40px;"><button class="item-del" data-id="${it.id}" title="Remover">✕</button></td>
      </tr>`;
    }).join('');

    const total = items.reduce((sum, it) => sum + (Number(it.quantidade) || 0) * (Number(it.preco) || 0), 0);
    const headExtra = EXPENSE_TOGGLE_COLS.filter(c => show(c.id)).map(c => `<th>${c.label}</th>`).join('');
    const totalColspan = 1 + EXPENSE_TOGGLE_COLS.filter(c => show(c.id)).length;

    container.innerHTML = `
      ${toolbar}
      <div class="dtable-wrap"><table class="dtable">
        <thead><tr><th>Nome</th>${headExtra}<th>Subtotal</th><th></th></tr></thead>
        <tbody>${rowsHtml}</tbody>
        <tfoot><tr><td colspan="${totalColspan}" style="text-align:right;font-weight:700;">Total</td><td class="dtable-num" id="expenseTotal" style="font-weight:700;">${total.toFixed(2)}€</td><td></td></tr></tfoot>
      </table></div>
      <button type="button" class="add-record-btn" id="expAddBtn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Novo item
      </button>`;

    container.querySelector('[data-open-columns]')?.addEventListener('click', () => {
      openColumnsModal({
        title: 'Colunas visíveis',
        stateKey,
        columns: [
          { id: '__nome__', label: 'Nome', fixed: true },
          ...EXPENSE_TOGGLE_COLS,
          { id: '__subtotal__', label: 'Subtotal', fixed: true },
        ],
        allowAddRemove: false,
        rerenderView: () => renderExpenseTableView(container, board),
      });
    });

    container.querySelectorAll('.dtable-input').forEach(inp => {
      inp.addEventListener('input', () => {
        const it = items.find(i => i.id === inp.dataset.id);
        const field = inp.dataset.field;
        it[field] = (field === 'quantidade' || field === 'preco') ? (Number(inp.value) || 0) : inp.value;
        save();
        if (field === 'quantidade' || field === 'preco') {
          const subtotal = (Number(it.quantidade) || 0) * (Number(it.preco) || 0);
          const cell = container.querySelector(`[data-subtotal="${it.id}"]`);
          if (cell) cell.textContent = subtotal.toFixed(2) + '€';
          const newTotal = items.reduce((s, i2) => s + (Number(i2.quantidade) || 0) * (Number(i2.preco) || 0), 0);
          const totalCell = container.querySelector('#expenseTotal');
          if (totalCell) totalCell.textContent = newTotal.toFixed(2) + '€';
        }
      });
    });
    container.querySelectorAll('.item-del').forEach(btn => {
      btn.addEventListener('click', () => {
        board.items = board.items.filter(i => i.id !== btn.dataset.id);
        save(); renderExpenseTableView(container, board);
      });
    });
    container.querySelector('#expAddBtn').addEventListener('click', () => {
      openAddRecordModal('Novo item', [
        { id: 'nome', label: 'Nome', placeholder: 'ex: Arroz agulha' },
        { id: 'descricao', label: 'Descrição (opcional)', placeholder: '' },
        { id: 'quantidade', label: 'Quantidade', type: 'number', placeholder: '0' },
        { id: 'preco', label: 'Preço', type: 'number', step: '0.01', placeholder: '0.00' },
        { id: 'notas', label: 'Notas (opcional)', placeholder: '' },
      ], (v) => {
        const nome = v.nome.trim();
        if (!nome) return 'Indica o nome do item.';
        items.push({
          id: uid('it'), nome,
          descricao: v.descricao.trim(),
          quantidade: Number(v.quantidade) || 0,
          preco: Number(v.preco) || 0,
          notas: v.notas.trim(),
        });
        save(); renderExpenseTableView(container, board);
        return true;
      });
    });
  }

  // ---- Marcações (hora + descrição + estado, sem sobreposição, editável) ----
  function apptHasCollision(board, time, excludeId) { return board.items.some(i => i.time === time && i.id !== excludeId); }

  function renderAppointmentsView(container, board) {
    const editingId = apptEditState[board.id] || null;
    const sorted = [...board.items].sort((a, b) => (a.time || '').localeCompare(b.time || ''));

    const rowsHtml = sorted.map(it => {
      if (it.id === editingId) {
        return `
          <div class="appt-row appt-editing" data-id="${it.id}">
            <input type="time" class="text-input" id="apptEditTime-${it.id}" style="max-width:120px;flex:0 0 120px;" value="${it.time}">
            <input type="text" class="text-input" id="apptEditDesc-${it.id}" style="flex:1;min-width:140px;" value="${escapeHtml(it.desc)}" placeholder="Descrição...">
            <select class="text-input" id="apptEditState-${it.id}" style="max-width:140px;flex:0 0 140px;">
              ${apptStateOrder.map(s => `<option value="${s}" ${s === it.state ? 'selected' : ''}>${apptStateLabels[s]}</option>`).join('')}
            </select>
            <button class="btn btn-primary" data-save="${it.id}">Guardar</button>
            <button class="btn" data-cancel="${it.id}">Cancelar</button>
          </div>
          <div class="appt-error" data-error="${it.id}"></div>`;
      }
      return `
        <div class="appt-row" data-id="${it.id}">
          <div class="appt-time">${escapeHtml(it.time)}</div>
          <div class="appt-desc">${escapeHtml(it.desc)}</div>
          <button class="status-pill mono" ${apptStateVariant[it.state] ? `data-variant="${apptStateVariant[it.state]}"` : ''} data-id="${it.id}">${apptStateLabels[it.state]}</button>
          <button class="ghost-btn" data-edit="${it.id}" title="Editar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
          </button>
          <button class="item-del" data-id="${it.id}" title="Remover">✕</button>
        </div>`;
    }).join('') || `<div style="padding:1.2rem;color:var(--text-faint);font-size:0.85rem;">sem marcações ainda</div>`;

    container.innerHTML = rowsHtml + `
      <button type="button" class="add-record-btn" id="apptAddBtn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Nova marcação
      </button>`;

    container.querySelectorAll('.status-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const it = board.items.find(i => i.id === btn.dataset.id);
        it.state = apptStateOrder[(apptStateOrder.indexOf(it.state) + 1) % apptStateOrder.length];
        save(); renderAppointmentsView(container, board);
      });
    });
    container.querySelectorAll('[data-edit]').forEach(btn => {
      btn.addEventListener('click', () => {
        apptEditState[board.id] = btn.dataset.edit;
        renderAppointmentsView(container, board);
      });
    });
    container.querySelectorAll('[data-cancel]').forEach(btn => {
      btn.addEventListener('click', () => {
        apptEditState[board.id] = null;
        renderAppointmentsView(container, board);
      });
    });
    container.querySelectorAll('[data-save]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.save;
        const it = board.items.find(i => i.id === id);
        const time = container.querySelector(`#apptEditTime-${id}`).value;
        const desc = container.querySelector(`#apptEditDesc-${id}`).value.trim();
        const state = container.querySelector(`#apptEditState-${id}`).value;
        const errEl = container.querySelector(`[data-error="${id}"]`);
        if (!time || !desc) { errEl.textContent = 'Preenche a hora e a descrição.'; return; }
        if (apptHasCollision(board, time, id)) { errEl.textContent = 'Já existe uma marcação a essa hora.'; return; }
        it.time = time; it.desc = desc; it.state = state;
        apptEditState[board.id] = null;
        save(); renderAppointmentsView(container, board);
      });
    });
    container.querySelectorAll('.item-del').forEach(btn => {
      btn.addEventListener('click', () => {
        board.items = board.items.filter(i => i.id !== btn.dataset.id);
        if (apptEditState[board.id] === btn.dataset.id) apptEditState[board.id] = null;
        save(); renderAppointmentsView(container, board);
      });
    });

    container.querySelector('#apptAddBtn').addEventListener('click', () => {
      openAddRecordModal('Nova marcação', [
        { id: 'time', label: 'Hora', type: 'time' },
        { id: 'desc', label: 'Descrição', placeholder: 'ex: cliente / assunto' },
      ], (v) => {
        if (!v.time || !v.desc.trim()) return 'Preenche a hora e a descrição.';
        if (apptHasCollision(board, v.time, null)) return 'Já existe uma marcação a essa hora.';
        board.items.push({ id: uid('it'), time: v.time, desc: v.desc.trim(), state: 'pendente' });
        save(); renderAppointmentsView(container, board);
        return true;
      });
    });
  }

  // ---- Agenda (calendário + tarefas por dia) ----
  function renderAgendaView(container, board) {
    if (!board.viewMonth) board.viewMonth = currentMonthStr();
    if (!board.selectedDate) board.selectedDate = todayStr();
    const [y, m] = board.viewMonth.split('-').map(Number);
    const monthIndex0 = m - 1;
    const calDays = buildCalendarDays(y, monthIndex0);
    const todayIso = todayStr();

    const calHtml = `
      <div class="cal-nav">
        <button class="cal-nav-btn" id="calPrev">‹</button>
        <div class="cal-month-label">${monthNamesPt[monthIndex0]} ${y}</div>
        <button class="cal-today-btn" id="calToday">Hoje</button>
        <button class="cal-nav-btn" id="calNext">›</button>
      </div>
      <div class="cal-grid">
        ${days.map(d => `<div class="cal-dow">${d}</div>`).join('')}
        ${calDays.map(cd => {
          const iso = fmtDateISO(cd.date);
          const hasItems = board.items.some(it => it.date === iso);
          const cls = ['cal-day'];
          if (!cd.inMonth) cls.push('out');
          if (iso === todayIso) cls.push('today');
          if (iso === board.selectedDate) cls.push('selected');
          return `<div class="${cls.join(' ')}" data-date="${iso}">${cd.date.getDate()}${hasItems ? '<span class="cal-dot"></span>' : ''}</div>`;
        }).join('')}
      </div>`;

    const dayItems = board.items.filter(it => it.date === board.selectedDate).sort((a, b) => (a.time || '').localeCompare(b.time || ''));
    const panelHtml = `
      <div class="agenda-day-panel">
        <div class="agenda-day-title">${formatDatePt(board.selectedDate)}</div>
        ${dayItems.map(it => `
          <div class="agenda-item-row">
            <div class="agenda-item-time">${escapeHtml(it.time)}</div>
            <div class="agenda-item-title">${escapeHtml(it.title)}</div>
            <button class="item-del" data-id="${it.id}" title="Remover">✕</button>
          </div>`).join('') || `<div style="color:var(--text-faint);font-size:0.83rem;padding:0.4rem 0;">sem tarefas para este dia</div>`}
      </div>
      <button type="button" class="add-record-btn" id="agendaAddBtn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Nova tarefa
      </button>`;

    container.innerHTML = calHtml + panelHtml;

    container.querySelectorAll('.cal-day').forEach(cell => {
      cell.addEventListener('click', () => {
        board.selectedDate = cell.dataset.date;
        save(); renderAgendaView(container, board);
      });
    });
    container.querySelector('#calPrev').addEventListener('click', () => shiftMonth(-1));
    container.querySelector('#calNext').addEventListener('click', () => shiftMonth(1));
    container.querySelector('#calToday').addEventListener('click', () => {
      board.viewMonth = currentMonthStr(); board.selectedDate = todayStr();
      save(); renderAgendaView(container, board);
    });
    function shiftMonth(delta) {
      let nm = monthIndex0 + delta, ny = y;
      if (nm < 0) { nm = 11; ny--; }
      if (nm > 11) { nm = 0; ny++; }
      board.viewMonth = ny + '-' + pad2(nm + 1);
      save(); renderAgendaView(container, board);
    }
    container.querySelectorAll('.agenda-item-row .item-del').forEach(btn => {
      btn.addEventListener('click', () => {
        board.items = board.items.filter(i => i.id !== btn.dataset.id);
        save(); renderAgendaView(container, board);
      });
    });
    container.querySelector('#agendaAddBtn').addEventListener('click', () => {
      openAddRecordModal('Nova tarefa — ' + formatDatePt(board.selectedDate), [
        { id: 'time', label: 'Hora', type: 'time' },
        { id: 'title', label: 'Título', placeholder: 'ex: Reunião' },
      ], (v) => {
        if (!v.time || !v.title.trim()) return 'Preenche a hora e o título.';
        board.items.push({ id: uid('it'), date: board.selectedDate, time: v.time, title: v.title.trim() });
        save(); renderAgendaView(container, board);
        return true;
      });
    });
  }

  // ============================================================
  // MODAL: criar / editar quadro
  // ============================================================
  const modalOverlay = document.getElementById('modalOverlay');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalSaveBtn = document.getElementById('modalSaveBtn');
  const modalCancelBtn = document.getElementById('modalCancelBtn');
  const modalDeleteBtn = document.getElementById('modalDeleteBtn');
  const modalCloseBtn = document.getElementById('modalClose');

  function closeModal() { modalOverlay.classList.remove('open'); }
  [modalCancelBtn, modalCloseBtn].forEach(b => b.addEventListener('click', closeModal));
  modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });

  function openBoardModal(existing) {
    const isEdit = !!existing;
    modalTitle.textContent = isEdit ? 'Definições do quadro' : 'Novo quadro';
    modalCancelBtn.style.display = 'inline-flex';
    modalCancelBtn.textContent = 'Cancelar';
    modalSaveBtn.style.display = 'inline-flex';
    modalSaveBtn.textContent = 'Guardar';
    let selectedIcon = isEdit ? existing.icon : ICON_KEYS[0];
    let selectedColor = isEdit ? existing.color : BOARD_COLORS[0];
    let selectedView = isEdit ? existing.type : 'checklist';

    modalBody.innerHTML = `
      <label class="field-label">Nome do quadro</label>
      <input type="text" class="text-input" id="mBoardName" placeholder="ex: Lista de Compras" value="${isEdit ? escapeHtml(existing.name) : ''}">
      <label class="field-label">Ícone</label>
      <div class="icon-grid" id="mBoardIcons">
        ${ICON_KEYS.map(key => `<button type="button" class="icon-choice ${key === selectedIcon ? 'selected' : ''}" data-icon="${key}">${boardIconSvg(key)}</button>`).join('')}
      </div>
      <label class="field-label">Cor</label>
      <div class="color-grid" id="mBoardColors">
        ${BOARD_COLORS.map(c => `<button type="button" class="color-choice ${c === selectedColor ? 'selected' : ''}" data-color="${c}" style="background:${c}" aria-label="${c}"></button>`).join('')}
      </div>
      <label class="field-label">Tipo de vista ${isEdit ? '<span style="font-weight:400;color:var(--text-faint)">(fixo após criação)</span>' : ''}</label>
      <div class="view-grid" id="mBoardViews">
        ${VIEW_DEFS.map(v => `
          <div class="view-choice ${v.type === selectedView ? 'selected' : ''} ${isEdit ? 'disabled' : ''}" data-view="${v.type}">
            <div class="view-choice-title">${v.title}</div>
            <div class="view-choice-sub">${v.sub}</div>
          </div>`).join('')}
      </div>
    `;

    modalBody.querySelectorAll('.icon-choice').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedIcon = btn.dataset.icon;
        modalBody.querySelectorAll('.icon-choice').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
    });
    modalBody.querySelectorAll('.color-choice').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedColor = btn.dataset.color;
        modalBody.querySelectorAll('.color-choice').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
    });
    if (!isEdit) {
      modalBody.querySelectorAll('.view-choice').forEach(el => {
        el.addEventListener('click', () => {
          selectedView = el.dataset.view;
          modalBody.querySelectorAll('.view-choice').forEach(e => e.classList.remove('selected'));
          el.classList.add('selected');
        });
      });
    }

    modalDeleteBtn.style.display = isEdit ? 'inline-flex' : 'none';
    modalDeleteBtn.onclick = () => {
      if (!confirm(`Eliminar o quadro "${existing.name}"?`)) return;
      db.boards = db.boards.filter(b => b.id !== existing.id);
      if (activeBoardId === existing.id) activeBoardId = db.boards[0] ? db.boards[0].id : null;
      save(); renderAll(); closeModal();
    };

    modalSaveBtn.onclick = () => {
      const name = modalBody.querySelector('#mBoardName').value.trim();
      if (!name) { modalBody.querySelector('#mBoardName').focus(); return; }
      if (isEdit) {
        existing.name = name; existing.icon = selectedIcon; existing.color = selectedColor;
      } else {
        const base = { id: uid('b'), name, icon: selectedIcon, color: selectedColor, type: selectedView };
        if (selectedView === 'grid') {
          base.rows = [];
        } else if (selectedView === 'custom-table') {
          base.columns = []; base.rows = [];
        } else if (selectedView === 'agenda') {
          base.items = []; base.viewMonth = currentMonthStr(); base.selectedDate = todayStr();
        } else {
          base.items = []; // checklist, expense-table, appointments
        }
        db.boards.push(base);
        activeBoardId = base.id;
      }
      save(); renderAll(); closeModal();
    };

    modalOverlay.classList.add('open');
    setTimeout(() => modalBody.querySelector('#mBoardName').focus(), 30);
  }

  document.getElementById('newBoardBtn').addEventListener('click', () => openBoardModal(null));

  // ============================================================
  // MODAL: gerir colunas de uma tabela (mostrar/esconder, adicionar/remover)
  // nunca diretamente na tabela — sempre através deste modal
  // ============================================================
  function openColumnsModal(opts) {
    // opts: { title, stateKey, columns:[{id,label,fixed?}], allowAddRemove, positionalFixed?, onAdd(label), onRemove(colId), rerenderView }
    let columns = opts.columns.slice();
    const isFixed = (col, idx) => opts.positionalFixed ? idx === 0 : !!col.fixed;

    modalTitle.textContent = opts.title;
    modalDeleteBtn.style.display = 'none';
    modalCancelBtn.style.display = 'none';
    modalSaveBtn.style.display = 'inline-flex';
    modalSaveBtn.textContent = 'Fechar';
    modalSaveBtn.onclick = closeModal;

    function renderBody() {
      const toggleIds = columns.filter((c, i) => !isFixed(c, i)).map(c => c.id);
      const visible = toggleIds.length ? getVisibleCols(opts.stateKey, toggleIds) : [];

      modalBody.innerHTML = `
        ${columns.length ? columns.map((c, i) => `
          <div class="col-manage-row">
            <span class="col-manage-label">${escapeHtml(c.label)}</span>
            ${isFixed(c, i)
              ? `<span class="badge-fixed">Sempre visível</span>`
              : `<label class="toggle-switch"><input type="checkbox" data-vis-col="${c.id}" ${visible.includes(c.id) ? 'checked' : ''}><span class="track"></span><span class="thumb"></span></label>`}
            ${opts.allowAddRemove ? `<button type="button" class="col-manage-remove" data-remove-col="${c.id}" title="Remover coluna"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>` : ''}
          </div>`).join('') : `<p class="col-manage-empty">Ainda sem colunas.</p>`}
        ${opts.allowAddRemove ? `
          <div class="col-manage-add">
            <input type="text" class="text-input" id="colManageNewName" placeholder="Nome da nova coluna...">
            <button type="button" class="btn btn-primary" id="colManageAddBtn">Adicionar</button>
          </div>` : ''}
      `;

      modalBody.querySelectorAll('[data-vis-col]').forEach(cb => {
        cb.addEventListener('change', () => {
          toggleCol(opts.stateKey, cb.dataset.visCol, toggleIds);
          renderBody();
          opts.rerenderView();
        });
      });
      if (opts.allowAddRemove) {
        modalBody.querySelectorAll('[data-remove-col]').forEach(btn => {
          btn.addEventListener('click', () => {
            const removed = opts.onRemove(btn.dataset.removeCol);
            if (!removed) return;
            columns = columns.filter(c => c.id !== btn.dataset.removeCol);
            renderBody();
            opts.rerenderView();
          });
        });
        const nameInput = modalBody.querySelector('#colManageNewName');
        const doAdd = () => {
          const label = nameInput.value.trim();
          if (!label) return;
          columns.push(opts.onAdd(label));
          renderBody();
          opts.rerenderView();
        };
        modalBody.querySelector('#colManageAddBtn').addEventListener('click', doAdd);
        nameInput.addEventListener('keydown', e => { if (e.key === 'Enter') doAdd(); });
      }
    }

    renderBody();
    modalOverlay.classList.add('open');
  }

  // ============================================================
  // MODAL GENÉRICO: adicionar um novo registo (tarefa, linha, item...)
  // A edição de registos existentes mantém-se sempre diretamente na
  // tabela/lista; só a criação de registos novos passa por aqui.
  // ============================================================
  function openAddRecordModal(title, fields, onSave) {
    // fields: [{ id, label, type?, placeholder?, step? }]
    // onSave(values): true se guardou com sucesso, ou uma string de erro para mostrar no modal
    modalTitle.textContent = title;
    modalDeleteBtn.style.display = 'none';
    modalCancelBtn.style.display = 'inline-flex';
    modalCancelBtn.textContent = 'Cancelar';
    modalSaveBtn.style.display = 'inline-flex';
    modalSaveBtn.textContent = 'Adicionar';

    modalBody.innerHTML = fields.map(f => `
      <label class="field-label">${escapeHtml(f.label)}</label>
      <input type="${f.type || 'text'}" class="text-input" id="mField_${f.id}" placeholder="${escapeHtml(f.placeholder || '')}" ${f.type === 'number' ? `min="0" step="${f.step || '1'}"` : ''}>
    `).join('') + `<p class="form-error" id="mFormError"></p>`;

    const submit = () => {
      const values = {};
      fields.forEach(f => { values[f.id] = modalBody.querySelector(`#mField_${f.id}`).value; });
      const result = onSave(values);
      if (result === true) { closeModal(); }
      else { modalBody.querySelector('#mFormError').textContent = result || 'Preenche os campos obrigatórios.'; }
    };
    modalSaveBtn.onclick = submit;
    modalBody.querySelectorAll('.text-input').forEach(inp => {
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
    });

    modalOverlay.classList.add('open');
    setTimeout(() => modalBody.querySelector('.text-input')?.focus(), 30);
  }

  // ============================================================
  // PERFIL DO UTILIZADOR (nome + email, guardado em localStorage)
  // ============================================================
  const PROFILE_KEY = 'openquadro_profile';
  function getInitials(name) {
    const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  function loadProfile() {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { console.warn('localStorage indisponível ou corrompido', e); }
    return { name: 'Utilizador', email: 'utilizador@exemplo.com' };
  }
  function saveProfile(p) {
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(p)); } catch (e) { console.warn('não foi possível gravar', e); }
  }

  let userProfile = loadProfile();

  function renderProfile() {
    const initials = getInitials(userProfile.name);
    document.getElementById('topAvatar').textContent = initials;
    document.getElementById('profileAvatarLg').textContent = initials;
    document.getElementById('profileNameText').textContent = userProfile.name;
    document.getElementById('profileEmailText').textContent = userProfile.email;
  }

  function openProfileModal() {
    modalTitle.textContent = 'O meu perfil';
    modalDeleteBtn.style.display = 'none';
    modalCancelBtn.style.display = 'inline-flex';
    modalCancelBtn.textContent = 'Cancelar';
    modalSaveBtn.style.display = 'inline-flex';
    modalSaveBtn.textContent = 'Guardar';

    modalBody.innerHTML = `
      <label class="field-label">Nome</label>
      <input type="text" class="text-input" id="mProfileName" placeholder="O teu nome" value="${escapeHtml(userProfile.name)}">
      <label class="field-label">Email</label>
      <input type="email" class="text-input" id="mProfileEmail" placeholder="o-teu-email@exemplo.com" value="${escapeHtml(userProfile.email)}">
    `;

    modalSaveBtn.onclick = () => {
      const name = modalBody.querySelector('#mProfileName').value.trim();
      const email = modalBody.querySelector('#mProfileEmail').value.trim();
      if (!name) { modalBody.querySelector('#mProfileName').focus(); return; }
      userProfile = { name, email };
      saveProfile(userProfile);
      renderProfile();
      closeModal();
    };

    modalOverlay.classList.add('open');
    setTimeout(() => modalBody.querySelector('#mProfileName').focus(), 30);
  }

  document.getElementById('editProfileBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    openProfileModal();
  });
  renderProfile();

  // ============================================================
  // PESQUISA: autocomplete pelo nome dos quadros existentes
  // ============================================================
  function setupSearchAutocomplete(inputEl, suggestionsEl, onAfterSelect) {
    if (!inputEl || !suggestionsEl) return;
    let activeIndex = -1;

    function getMatches(query) {
      const q = query.trim().toLowerCase();
      if (!q) return [];
      return db.boards.filter(b => b.name.toLowerCase().includes(q)).slice(0, 8);
    }

    function setActive(items, index) {
      activeIndex = index;
      items.forEach((it, i) => it.classList.toggle('active', i === activeIndex));
      if (activeIndex >= 0) items[activeIndex].scrollIntoView({ block: 'nearest' });
    }

    function renderSuggestions() {
      const matches = getMatches(inputEl.value);
      activeIndex = -1;
      if (!inputEl.value.trim()) {
        suggestionsEl.classList.remove('open');
        suggestionsEl.innerHTML = '';
        return;
      }
      if (!matches.length) {
        suggestionsEl.innerHTML = `<div class="search-suggestion-empty">Sem quadros com esse nome.</div>`;
        suggestionsEl.classList.add('open');
        return;
      }
      // <span class="board-icon-mini" style="color:${b.color}">${boardIconSvg(b.icon)}</span>
      suggestionsEl.innerHTML = matches.map(b => `
        <button type="button" class="search-suggestion" data-id="${b.id}">          
          ${escapeHtml(b.name)}
        </button>`).join('');
      suggestionsEl.classList.add('open');
      suggestionsEl.querySelectorAll('.search-suggestion').forEach(btn => {
        btn.addEventListener('click', () => selectBoard(btn.dataset.id));
      });
    }

    function selectBoard(id) {
      activeBoardId = id;
      renderAll();
      inputEl.value = '';
      suggestionsEl.classList.remove('open');
      suggestionsEl.innerHTML = '';
      inputEl.blur();
      if (onAfterSelect) onAfterSelect();
    }

    inputEl.addEventListener('input', renderSuggestions);
    inputEl.addEventListener('focus', () => { if (inputEl.value.trim()) renderSuggestions(); });
    inputEl.addEventListener('blur', () => { setTimeout(() => suggestionsEl.classList.remove('open'), 150); });
    inputEl.addEventListener('keydown', (e) => {
      const items = Array.from(suggestionsEl.querySelectorAll('.search-suggestion'));
      if (!items.length) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(items, Math.min(activeIndex + 1, items.length - 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(items, Math.max(activeIndex - 1, 0)); }
      else if (e.key === 'Enter') { e.preventDefault(); selectBoard(items[activeIndex >= 0 ? activeIndex : 0].dataset.id); }
      else if (e.key === 'Escape') { suggestionsEl.classList.remove('open'); inputEl.blur(); }
    });
  }

  setupSearchAutocomplete(document.getElementById('searchInput'), document.getElementById('searchSuggestions'));
  setupSearchAutocomplete(document.getElementById('searchInputMobile'), document.getElementById('searchSuggestionsMobile'), () => {
    mobileSearchBar.classList.remove('visible');
    updateBarsOffset();
  });

  // ============================================================
  // INIT
  // ============================================================
  renderAll();
