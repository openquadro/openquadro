# OpenQuadro Community

An open-source, offline-first workspace for building your own "quadros" (boards) — lists, tables, planners, inventories, contacts, or anything else you want to organize.

No backend, no login, no build step. Everything runs in the browser and your data never leaves your device.

> "O teu quadro, os teus dados." — your board, your data.

## How it works

The whole app is four static files:

```
app-community/
├── index.html          # markup only — topbar, sidebar, modal skeleton
├── assets/
│   ├── styles.css       # all styling — light + dark theme via CSS variables
│   ├── app.js           # all behaviour — data model, rendering, modals
│   └── icon.png         # logo (sourced from ../brand/, never hand-recreated)
├── LICENSE
└── README.md
```

There's no framework, no bundler, no package.json. Open `index.html` directly in a browser, or serve the folder with any static server (e.g. `python3 -m http.server`) — both work identically. The only external dependency is the Google Fonts CDN (Inter + JetBrains Mono).

All data is stored client-side in `localStorage`, under three keys:

| Key | What it holds |
|---|---|
| `openquadro_boards` | your boards and their content |
| `openquadro_profile` | your local display name/email — used only for the avatar initials, never sent anywhere |
| `openquadro_theme` | light/dark preference |

Clearing your browser's site data for this page wipes everything — there's no export/import yet (it's on the roadmap; see `CLAUDE.md` in the parent folder for the product plan).

## Boards and view templates

Each board you create picks one of six built-in templates, defined in `VIEW_DEFS` near the top of `assets/app.js`:

| Type | What it's for |
|---|---|
| `grid` | weekly grid — category rows × day-of-week columns |
| `checklist` | task list with a cycling status (to do / in progress / done) |
| `custom-table` | table with your own columns — add/remove them freely |
| `expense-table` | shopping/expense list — name, qty, price, notes, auto subtotal |
| `appointments` | time-slotted entries with a status, blocks double-booking |
| `agenda` | calendar + a task list per day |

A template's data shape and its rendering live together: `renderBoardView()` is the dispatch table, and the `render*View()` functions right below it (`renderGridView`, `renderChecklistView`, `renderCustomTableView`, `renderExpenseTableView`, `renderAppointmentsView`, `renderAgendaView`) hold the actual markup and behaviour for each one.

### Adding a new template

1. Add an entry to `VIEW_DEFS` — `{ type, title, sub }` — so it appears as a choice in the "new board" modal.
2. In `openBoardModal()`'s save handler, add a branch that initializes the right empty data shape for your `type` (e.g. `base.items = []`).
3. Write a `renderMyTypeView(container, board)` function that renders the board's data into `container.innerHTML` and wires up its own event listeners. Follow the existing pattern: after every data mutation, call `save()` then re-render the view.
4. Register it in `renderBoardView()`'s dispatch: `else if (board.type === 'my-type') renderMyTypeView(container, board);`
5. If your template needs a wide table (more columns than fit on mobile), reuse the responsive-table helpers instead of building your own: `getVisibleCols`, `toggleCol`, `renderColumnsBar`, `openColumnsModal`. Look at how `renderGridView`, `renderCustomTableView`, and `renderExpenseTableView` use them — the first column always stays pinned and visible, and everything else is shown/hidden through the "Colunas" button, which opens a modal. Column visibility and add/remove controls should never live directly on the table.

## Local customization

Everything below is a plain CSS variable or a small JS constant — edit and reload, no build step.

- **Colors & theme** — `assets/styles.css`, under `:root` (light) and `:root[data-theme="dark"]` (dark). The four "brand/category" colors (`BOARD_COLORS` in `app.js`) come from the official style guide and are reserved for tinting board icons only — check `DESIGN.md` in the parent folder before touching them. Everything functional (buttons, links, focus rings) should stay on `--accent`.
- **Board icons** — `BOARD_ICONS` in `app.js`, a small curated set of inline SVG paths (no emoji, by design — see `DESIGN.md` / `brand/README.md`). Add a new key with your own SVG children to extend the icon picker.
- **Default/seed boards** — `seedData()` in `app.js`. This only runs once, the first time the app opens with nothing yet in `localStorage`; edit it to change what a fresh install starts with.
- **Default profile** — the fallback object in `loadProfile()` (`{ name: 'Utilizador', email: '...' }`), shown until someone edits their profile from the avatar dropdown (top-right → pencil icon).
- **Sidebar/topbar copy** — currently hardcoded in Portuguese throughout `index.html` and `app.js`; there's no i18n layer yet, so translating means editing strings directly.

## License

See `LICENSE`.
