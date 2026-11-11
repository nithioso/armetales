/* =====================================================================
   ARMETALES · Shell y utilidades de interfaz  ·  window.UI
   Requiere: data.js (window.ARM). Opcionales: Leaflet 1.9.4 (UI.map) y Chart.js 4.4 (UI.chart).
   Cada página: <body data-page="clave"> + <main id="app">…</main>. El shell se inyecta solo.
   Documentación viva con ejemplos: styleguide.html
   ===================================================================== */
(function () {
'use strict';
var ARM = window.ARM || {};
var UI = window.UI = {};
var doc = document;

/* ---------- 0. utilidades básicas ---------- */
UI.esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); };
var esc = UI.esc;
UI.$ = function (sel, root) { return (root || doc).querySelector(sel); };
UI.$$ = function (sel, root) { return Array.prototype.slice.call((root || doc).querySelectorAll(sel)); };
UI.param = function (name) { try { return new URLSearchParams(location.search).get(name); } catch (e) { return null; } };
UI.norm = function (s) { return String(s == null ? '' : s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { return null; } }
UI.store = store;
function el(tag, attrs, html) { var e = doc.createElement(tag); if (attrs) Object.keys(attrs).forEach(function (k) { if (k === 'class') e.className = attrs[k]; else if (attrs[k] !== false && attrs[k] != null) e.setAttribute(k, attrs[k] === true ? '' : attrs[k]); }); if (html != null) { if (typeof html === 'string') e.innerHTML = html; else e.appendChild(html); } return e; }
UI.el = el;
var uid = 0; function nid(p) { return (p || 'ui') + '-' + (++uid); }
function toNode(c) { if (c == null) return null; if (typeof c === 'string') { var t = doc.createElement('template'); t.innerHTML = c.trim(); return t.content; } return c; }
var readyCbs = [], isReady = false;
UI.ready = function (fn) { if (isReady) fn(); else readyCbs.push(fn); };
var themeCbs = [];
UI.onTheme = function (fn) { themeCbs.push(fn); };

/* ---------- 1. iconos (estilo Lucide, trazo 1.75) ---------- */
var I = {
 'menu':'<path d="M4 6h16M4 12h16M4 18h16"/>','x':'<path d="M18 6 6 18M6 6l12 12"/>','search':'<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
 'bell':'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0"/>','sun':'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
 'moon':'<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>','chevron-down':'<path d="m6 9 6 6 6-6"/>','chevron-right':'<path d="m9 18 6-6-6-6"/>','chevron-left':'<path d="m15 18-6-6 6-6"/>','chevron-up':'<path d="m18 15-6-6-6 6"/>',
 'chevrons-up-down':'<path d="m7 15 5 5 5-5M7 9l5-5 5 5"/>','check':'<path d="M20 6 9 17l-5-5"/>','plus':'<path d="M5 12h14M12 5v14"/>','minus':'<path d="M5 12h14"/>','filter':'<path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>',
 'download':'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>','upload':'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m14-7-5-5-5 5M12 3v12"/>',
 'more':'<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>','edit':'<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>',
 'trash':'<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>','eye':'<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
 'refresh':'<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16M8 16H3v5"/>','log-out':'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14 5-5-5-5m5 5H9"/>',
 'sliders':'<path d="M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4"/>','info':'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>','alert-circle':'<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>',
 'alert-triangle':'<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3M12 9v4M12 17h.01"/>','check-circle':'<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3"/>','x-circle':'<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>',
 'clock':'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>','arrow-up':'<path d="m5 12 7-7 7 7M12 19V5"/>','arrow-down':'<path d="M12 5v14m7-7-7 7-7-7"/>','arrow-right':'<path d="M5 12h14m-7-7 7 7-7 7"/>','arrow-left':'<path d="M19 12H5m7 7-7-7 7-7"/>','arrow-up-right':'<path d="M7 7h10v10M7 17 17 7"/>',
 'external-link':'<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>','copy':'<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
 'map':'<path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15M15 6v15"/>','map-pin':'<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>','navigation':'<path d="M3 11 22 2l-9 19-2-8-8-2z"/>',
 'layout-dashboard':'<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
 'package':'<path d="m16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12"/>',
 'lock':'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>','calendar':'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
 'route':'<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
 'truck':'<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2M15 18H9M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
 'layers':'<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83ZM22 17.65l-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65M22 12.65l-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
 'clipboard-list':'<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M12 11h4M12 16h4M8 11h.01M8 16h.01"/>',
 'clipboard-check':'<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2m1 10 2 2 4-4"/>',
 'smartphone':'<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>','camera':'<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
 'warehouse':'<path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35ZM6 18h12M6 14h12"/>',
 'scan':'<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 12h10"/>','bar-chart':'<path d="M12 20V10M18 20V4M6 20v-4"/>',
 'shield-check':'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1zm-11 -1 2 2 4-4"/>',
 'users':'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>','user':'<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
 'plug':'<path d="M12 22v-5M9 8V2M15 8V2M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"/>','file-text':'<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7ZM14 2v4a2 2 0 0 0 2 2h4M10 9H8M16 13H8M16 17H8"/>',
 'panel-left':'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/>','phone':'<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
 'mail':'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>','link':'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
 'send':'<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>','trending-up':'<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>','trending-down':'<path d="m22 17-8.5-8.5-5 5L2 7"/><path d="M16 17h6v-6"/>',
 'ban':'<circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>','undo':'<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>','flag':'<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/>',
 'gauge':'<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>','database':'<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5M3 12a9 3 0 0 0 18 0"/>','help-circle':'<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/>',
 'inbox':'<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>','list':'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
 'play':'<path d="m6 3 14 9-14 9z"/>','cloud':'<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>','cart':'<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
 'key':'<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3"/>','image':'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21"/>','pen':'<path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
 'wrench':'<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>','zap':'<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>','target':'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
 'box':'<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>','git-branch':'<line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>','home':'<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>'
};
UI.icon = function (name, cls) { var p = I[name] || I['info']; return '<svg class="icon' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + p + '</svg>'; };
UI.icons = function () { return Object.keys(I); };
var icon = UI.icon;

/* ---------- 2. formato ---------- */
function toDate(v) { if (v instanceof Date) return v; if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v)) { var p = v.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); } return new Date(v); }
var NF = {}; function nf(dec, max) { var k = dec + '|' + max; return NF[k] || (NF[k] = new Intl.NumberFormat('es-CO', { minimumFractionDigits: dec, maximumFractionDigits: max })); }
var MESES = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
function p2(n) { return (n < 10 ? '0' : '') + n; }
function sameDay(a, b) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
UI.fmt = {
  num: function (n, dec) { if (n == null || isNaN(n)) return '—'; return nf(dec || 0, dec || 0).format(n); },
  cop: function (n) { if (n == null || isNaN(n)) return '—'; return '$ ' + nf(0, 0).format(Math.round(n)); },
  kg: function (n) { if (n == null || isNaN(n)) return '—'; return nf(0, Math.abs(n) < 100 ? 1 : 0).format(n) + ' kg'; },
  ton: function (kg, dec) { if (kg == null || isNaN(kg)) return '—'; return nf(dec == null ? 1 : dec, dec == null ? 1 : dec).format(kg / 1000) + ' t'; },
  m3: function (n, dec) { if (n == null || isNaN(n)) return '—'; return nf(0, dec == null ? 1 : dec).format(n) + ' m³'; },
  pct: function (n, dec) { if (n == null || isNaN(n)) return '—'; return nf(dec || 0, dec || 0).format(n) + ' %'; },
  fecha: function (v) { if (!v) return '—'; var d = toDate(v); return d.getDate() + ' ' + MESES[d.getMonth()] + ' ' + d.getFullYear(); },
  hora: function (v) { if (!v) return '—'; var d = toDate(v); return p2(d.getHours()) + ':' + p2(d.getMinutes()); },
  fechaHora: function (v) {
    if (!v) return '—'; var d = toDate(v), n = new Date(), y = new Date(n), t = new Date(n); y.setDate(n.getDate() - 1); t.setDate(n.getDate() + 1);
    var h = p2(d.getHours()) + ':' + p2(d.getMinutes());
    if (sameDay(d, n)) return 'Hoy ' + h; if (sameDay(d, y)) return 'Ayer ' + h; if (sameDay(d, t)) return 'Mañana ' + h;
    return d.getDate() + ' ' + MESES[d.getMonth()] + (d.getFullYear() !== n.getFullYear() ? ' ' + d.getFullYear() : '') + ', ' + h;
  },
  relativo: function (v) {
    if (!v) return '—'; var d = toDate(v), diff = (d.getTime() - Date.now()) / 60000, a = Math.abs(diff), s;
    if (a < 1) return 'ahora'; if (a < 60) s = Math.round(a) + ' min'; else if (a < 1440) s = Math.round(a / 60) + ' h'; else s = Math.round(a / 1440) + ' d';
    return diff < 0 ? 'hace ' + s : 'en ' + s;
  },
  nit: function (s) { return s; }
};
var fmt = UI.fmt;

/* ---------- 3. chips de estado, placa, medidor, helpers de marcado ---------- */
var TONOS = {
  /* pedido */ 'Recibido':'neutral','Stock validado':'info','Bloqueado por stock':'danger','En firme':'info','En preparación':'warning','Listo para despacho':'success','Planificado':'info','En ruta':'info','Entregado':'success','Entrega parcial':'warning','Fallido':'danger',
  /* reserva */ 'Activa':'info','Consumida':'success','Liberada':'neutral','Pendiente':'neutral','Sin stock':'danger','Parcial':'warning',
  /* vehículo / despacho */ 'Disponible':'success','Cargando':'warning','Mantenimiento':'warning','Inactivo':'neutral','Cerrado':'success','Programado':'neutral','Descanso':'neutral','Incapacidad':'warning',
  /* parada */ 'En camino':'info','En sitio':'warning','Entregada':'success','Fallida':'danger','Descargando':'warning','En patio':'neutral','En muelle':'warning','En taller':'warning',
  /* novedad / tarea / conteo */ 'Abierta':'danger','En gestión':'warning','Resuelta':'success','Cerrada':'neutral','En curso':'warning','Completada':'info','Certificada':'success','En conteo':'info','Con diferencia':'warning','Conciliado':'success','Ajustado':'success',
  /* integración */ 'Procesado':'success','Error':'danger','Reintentando':'warning','Duplicado ignorado':'neutral','Operativa':'success','Con alertas':'warning','Caída':'danger',
  /* usuario / prioridad / varios */ 'Activo':'success','Bloqueado':'danger','Alta':'danger','Media':'warning','Baja':'neutral','Propuesta':'info','Propuesto':'info','Aprobado':'success','Vigente':'success','En revisión':'warning','Propuesta vigente':'info','Aplicada':'success',
  'Validada':'success','Rechazada':'danger','Exitoso':'success','Rechazado':'danger','Ocupada':'info','En ruta ':'info','Cargado':'success','Sin asignar':'warning','Reservado':'info'
};
UI.tone = function (estado) { return TONOS[estado] || 'neutral'; };
/* UI.chip(estado, {tone, label, small, noDot}) → <span class="chip chip-…"> */
UI.chip = function (estado, o) { o = o || {}; var t = o.tone || TONOS[estado] || 'neutral'; return '<span class="chip chip-' + t + (o.small ? ' chip-sm' : '') + (o.noDot ? ' no-dot' : '') + '">' + esc(o.label || estado) + '</span>'; };
/* UI.plate('WNK 482', {large}) */
UI.plate = function (placa, o) { return '<span class="plate' + (o && o.large ? ' plate-lg' : '') + '" aria-label="Placa ' + esc(placa) + '">' + esc(placa) + '</span>'; };
/* UI.meter(valor, max, {unidad, text (texto libre), level:'ok|warn|crit|low|info', mode:'util'|'ocupacion', size:'lg', mark, label, showValue}) → barra tramada con umbrales */
UI.meter = function (valor, max, o) {
  o = o || {}; max = max || 100; var pct = max ? valor / max * 100 : 0, lv, mode = o.mode || 'util';
  if (o.level) lv = o.level;
  else if (mode === 'ocupacion') lv = pct >= 95 ? 'crit' : pct >= 80 ? 'warn' : 'ok';
  else lv = pct > 100 ? 'crit' : pct >= 95 ? 'warn' : pct < (o.low == null ? 50 : o.low) ? 'low' : 'ok';
  var txt = o.text != null ? o.text : o.unidad ? fmt.num(valor, o.dec || 0) + ' / ' + fmt.num(max, o.dec || 0) + ' ' + o.unidad : fmt.pct(Math.round(pct));
  return '<div class="meter' + (o.size === 'lg' ? ' meter-lg' : '') + '" data-level="' + lv + '" role="meter" aria-valuemin="0" aria-valuemax="' + max + '" aria-valuenow="' + valor + '" aria-label="' + esc(o.label || 'Utilización') + ' ' + Math.round(pct) + ' %">' +
    '<div class="meter-track"><div class="meter-fill" style="--v:' + Math.max(0, Math.min(100, pct)) + '%"></div>' + (o.mark ? '<i class="meter-mark" style="left:' + o.mark + '%"></i>' : '') + '</div>' +
    (o.showValue === false ? '' : '<span class="meter-val">' + txt + '</span>') + '</div>';
};
UI.avatar = function (nombre, o) { o = o || {}; var p = String(nombre || '?').trim().split(/\s+/), ini = (p[0][0] + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase(), h = 0; for (var i = 0; i < nombre.length; i++) h = (h * 31 + nombre.charCodeAt(i)) % 6; return '<span class="avatar t' + (h + 1) + (o.size ? ' is-' + o.size : '') + '" title="' + esc(nombre) + '" aria-hidden="true">' + esc(ini) + '</span>'; };
/* UI.delta(valor, {unit:'pts'|'%'|'', better:'up'|'down', dec}) → píldora con flecha; color según si sube o baja es bueno */
UI.delta = function (v, o) {
  o = o || {}; var better = o.better || 'up', up = v > 0, flat = Math.abs(v) < 0.05, good = flat ? null : (better === 'up' ? up : !up);
  var cls = flat ? 'flat' : (up ? 'up' : 'down') + '-' + (good ? 'good' : 'bad');
  return '<span class="delta ' + cls + '" aria-label="' + (flat ? 'sin cambio' : (up ? 'sube ' : 'baja ') + Math.abs(v)) + '">' + icon(flat ? 'minus' : up ? 'arrow-up' : 'arrow-down') + fmt.num(Math.abs(v), o.dec == null ? 1 : o.dec) + (o.unit != null ? o.unit : ' pts') + '</span>';
};
UI.sparkSvg = function (data, o) {
  o = o || {}; if (!data || data.length < 2) return ''; var w = 120, h = 28, mn = Math.min.apply(null, data), mx = Math.max.apply(null, data), r = mx - mn || 1;
  var pts = data.map(function (v, i) { return (i / (data.length - 1) * w).toFixed(1) + ',' + (h - 3 - (v - mn) / r * (h - 6)).toFixed(1); });
  var c = o.color || 'var(--steel)';
  return '<svg class="kpi-spark" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" aria-hidden="true"><polygon points="0,' + h + ' ' + pts.join(' ') + ' ' + w + ',' + h + '" fill="' + c + '" opacity=".1"/><polyline points="' + pts.join(' ') + '" fill="none" stroke="' + c + '" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg>';
};
/* UI.kpi({label, value, unit, delta:{v,unit,better}, note, spark:[..], sparkColor, icon, onClick:true, id}) → HTML. Con onClick queda como <button class="card kpi is-interactive" data-kpi="id">. */
UI.kpi = function (o) {
  var tag = o.onClick ? 'button type="button"' : 'div', end = o.onClick ? 'button' : 'div';
  return '<' + tag + ' class="card kpi' + (o.onClick ? ' is-interactive' : '') + '"' + (o.id ? ' data-kpi="' + esc(o.id) + '"' : '') + '>' +
    '<span class="kpi-label">' + (o.icon ? icon(o.icon, 'icon-sm') : '') + esc(o.label) + '</span>' +
    '<span class="kpi-value">' + (o.valueHtml || esc(o.value)) + (o.unit ? '<small>' + esc(o.unit) + '</small>' : '') + '</span>' +
    '<span class="kpi-foot"><span class="row gap-2 nowrap">' + (o.delta ? UI.delta(o.delta.v, o.delta) : '') + (o.note ? '<span class="kpi-note">' + esc(o.note) + '</span>' : '') + '</span>' + (o.spark ? UI.sparkSvg(o.spark, { color: o.sparkColor }) : '') + '</span>' +
    (o.onClick ? '<span class="kpi-open">' + icon('arrow-up-right', 'icon-sm') + '</span>' : '') + '</' + end + '>';
};
/* UI.empty({icon, title, text, action:{label, id}}) */
UI.empty = function (o) { o = o || {}; return '<div class="empty"><div class="empty-ico">' + icon(o.icon || 'inbox') + '</div><h3>' + esc(o.title || 'Sin resultados') + '</h3>' + (o.text ? '<p>' + esc(o.text) + '</p>' : '') + (o.action ? '<button type="button" class="btn btn-secondary btn-sm mt-3" data-empty-action="' + esc(o.action.id || '') + '">' + esc(o.action.label) + '</button>' : '') + '</div>'; };
UI.skeleton = function (lines, o) { var h = ''; for (var i = 0; i < (lines || 3); i++) h += '<span class="skeleton sk-line" style="width:' + (i === lines - 1 ? 60 : 100 - (i * 7) % 25) + '%;margin:10px 0"></span>'; return h; };
/* UI.banner({tone:'info|success|warning|danger', title, text, icon}) */
UI.banner = function (o) { var t = o.tone || 'info'; return '<div class="banner' + (t !== 'info' ? ' is-' + t : '') + '" role="' + (t === 'danger' ? 'alert' : 'status') + '">' + icon(o.icon || { info: 'info', success: 'check-circle', warning: 'alert-triangle', danger: 'alert-circle' }[t]) + '<div class="b-body">' + (o.title ? '<div class="b-title">' + esc(o.title) + '</div>' : '') + (o.html || esc(o.text || '')) + '</div></div>'; };
/* UI.kv([[clave, htmlValor], …] , {left}) → lista clave-valor */
UI.kv = function (pairs, o) { return '<dl class="kv' + (o && o.left ? ' is-left' : '') + '">' + pairs.map(function (p) { return '<dt>' + esc(p[0]) + '</dt><dd>' + (p[1] == null || p[1] === '' ? '<span class="subtle">—</span>' : p[1]) + '</dd>'; }).join('') + '</dl>'; };
/* UI.timeline([{title, meta, body, state:'done|current|error|pending'}]) */
UI.timeline = function (items) { return '<ol class="timeline">' + items.map(function (i) { var s = i.state || 'pending'; return '<li class="tl-item' + (s !== 'pending' ? ' is-' + s : '') + '"><span class="tl-dot">' + (s === 'done' ? icon('check') : '') + '</span><div class="tl-title">' + (i.titleHtml || esc(i.title)) + '</div>' + (i.meta ? '<div class="tl-meta">' + esc(i.meta) + '</div>' : '') + (i.body ? '<div class="tl-body">' + i.body + '</div>' : '') + '</li>'; }).join('') + '</ol>'; };
/* UI.stepper([{label, sub, state:'done|current|error|pending'}]) */
UI.stepper = function (steps, o) { return '<ol class="stepper' + (o && o.responsive === false ? '' : ' is-responsive') + '">' + steps.map(function (s) { var st = s.state || 'pending'; return '<li class="step' + (st !== 'pending' ? ' is-' + st : '') + '"' + (st === 'current' ? ' aria-current="step"' : '') + '><span>' + esc(s.label) + (s.sub ? '<br><small>' + esc(s.sub) + '</small>' : '') + '</span></li>'; }).join('') + '</ol>'; };
UI.legend = function (items) { return '<div class="legend">' + items.map(function (i) { return '<span><i class="sw" style="background:' + i.color + '"></i>' + esc(i.label) + '</span>'; }).join('') + '</div>'; };

/* ---------- 4. overlays: pila, foco, Esc ---------- */
var stack = [], lockN = 0;
function lock() { if (!lockN++) doc.body.style.overflow = 'hidden'; }
function unlock() { if (!--lockN) doc.body.style.overflow = ''; }
var FOC = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
function focusables(root) { return UI.$$(FOC, root).filter(function (e) { return e.offsetParent !== null || e === doc.activeElement; }); }
doc.addEventListener('keydown', function (e) {
  var top = stack[stack.length - 1]; if (!top) return;
  if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); top.close(); }
  else if (e.key === 'Tab' && top.trap) {
    var f = focusables(top.root); if (!f.length) { e.preventDefault(); return; }
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (doc.activeElement === first || !top.root.contains(doc.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (doc.activeElement === last || !top.root.contains(doc.activeElement))) { e.preventDefault(); first.focus(); }
  }
}, true);
function mount(root, o) {
  o = o || {}; var closed = false, prev = doc.activeElement, entry = { root: root, trap: o.trap !== false };
  entry.close = function () { if (closed) return; closed = true; var i = stack.indexOf(entry); if (i > -1) stack.splice(i, 1); root.classList.remove('is-open'); setTimeout(function () { root.remove(); }, 190); if (o.lock !== false) unlock(); if (prev && prev.focus && o.restore !== false) { try { prev.focus({ preventScroll: true }); } catch (e) {} } if (o.onClose) o.onClose(); };
  doc.body.appendChild(root); if (o.lock !== false) lock(); stack.push(entry);
  requestAnimationFrame(function () { root.classList.add('is-open'); if (o.focus !== false) { var t = o.initialFocus ? UI.$(o.initialFocus, root) : null; (t || focusables(root).filter(function (x) { return !x.matches('.ov-head button'); })[0] || focusables(root)[0] || root).focus({ preventScroll: true }); } });
  if (o.dismissible !== false) root.addEventListener('mousedown', function (e) { if (e.target === root) entry.close(); });
  return entry;
}
function buildFooter(foot, close) {
  if (!foot) return null; var f = el('footer', { class: 'ov-foot' });
  if (Array.isArray(foot)) foot.forEach(function (b) {
    var btn = el('button', { type: 'button', class: 'btn ' + ({ primary: 'btn-primary', secondary: 'btn-secondary', ghost: 'btn-ghost', danger: 'btn-danger is-solid', 'danger-outline': 'btn-danger' }[b.kind || 'secondary']) }, (b.icon ? icon(b.icon) : '') + esc(b.label));
    btn.addEventListener('click', function () { var r = b.onClick ? b.onClick(api) : undefined; if (r !== false && b.keepOpen !== true) close(); });
    if (b.id) btn.id = b.id; f.appendChild(btn);
  });
  else f.appendChild(toNode(foot)); var api; f.__setApi = function (a) { api = a; }; return f;
}
function panel(kind, o) {
  o = o || {}; var tid = nid('ov-title'), root = el('div', { class: 'overlay' + (kind === 'modal' ? ' modal-overlay' : '') });
  var box = el(kind === 'modal' ? 'div' : 'aside', { class: kind, role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': tid });
  var w = o.width || (kind === 'modal' ? 520 : 520); box.style.setProperty(kind === 'modal' ? '--modal-w' : '--drawer-w', typeof w === 'number' ? w + 'px' : w);
  var head = el('header', { class: 'ov-head' }, '<div class="min-w-0"><h2 class="ov-title" id="' + tid + '">' + (o.titleHtml || esc(o.title || '')) + '</h2>' + (o.subtitle || o.subtitleHtml ? '<p class="ov-sub">' + (o.subtitleHtml || esc(o.subtitle)) + '</p>' : '') + '</div>');
  var x = el('button', { type: 'button', class: 'btn btn-ghost btn-icon btn-sm', 'aria-label': 'Cerrar' }, icon('x')); head.appendChild(x);
  var body = el('div', { class: 'ov-body' }); if (o.body != null && typeof o.body !== 'function') body.appendChild(toNode(o.body)); if (o.noPadding) body.style.padding = '0';
  box.appendChild(head); box.appendChild(body); var entry, api;
  var foot = buildFooter(o.footer, function () { entry.close(); }); if (foot) box.appendChild(foot);
  root.appendChild(box); entry = mount(root, { onClose: o.onClose, dismissible: o.dismissible, initialFocus: o.initialFocus });
  x.addEventListener('click', function () { entry.close(); });
  api = { el: box, root: root, body: body, footer: foot, close: entry.close, setBody: function (h) { body.innerHTML = ''; body.appendChild(toNode(h)); }, setTitle: function (t) { UI.$('.ov-title', head).textContent = t; } }; if (typeof o.body === 'function') { var r = o.body(body, api); if (r != null) body.appendChild(toNode(r)); }
  if (foot && foot.__setApi) foot.__setApi(api); if (typeof o.body === 'function') o.body(body, api);
  if (o.onOpen) o.onOpen(api); return api;
}
/* UI.drawer({title, subtitle, body, footer, width, onClose, onOpen}) → {el, body, close, setBody, setTitle}
   body: string HTML | Node | function(bodyEl, api). footer: HTML | Node | [{label, kind:'primary|secondary|ghost|danger', icon, onClick(api) (false = no cerrar), keepOpen}] */
UI.drawer = function (o) { return panel('drawer', o); };
/* UI.modal({title, body, footer, width, …}) — misma forma que drawer, centrado */
UI.modal = function (o) { return panel('modal', o); };
/* UI.confirm({title, message|html, confirmLabel, cancelLabel, tone:'danger|primary', onConfirm}) → Promise<boolean>. También UI.confirm('¿Seguro?') */
UI.confirm = function (o) {
  if (typeof o === 'string') o = { message: o }; var danger = (o.tone || 'danger') === 'danger';
  return new Promise(function (resolve) {
    var done = false;
    UI.modal({ title: o.title || '¿Confirmas la acción?', width: 440, onClose: function () { if (!done) resolve(false); },
      body: '<div class="row nowrap start gap-3"><span class="confirm-icon' + (danger ? '' : ' is-info') + '">' + icon(danger ? 'alert-triangle' : 'help-circle') + '</span><div class="t-14" style="white-space:normal;min-width:0;flex:1">' + (o.html || esc(o.message || '')) + '</div></div>',
      footer: [{ label: o.cancelLabel || 'Cancelar', kind: 'secondary', onClick: function () { done = true; resolve(false); } },
        { label: o.confirmLabel || 'Confirmar', kind: danger ? 'danger' : 'primary', onClick: function () { done = true; if (o.onConfirm) o.onConfirm(); resolve(true); } }] });
  });
};

/* ---------- 5. toasts ---------- */
var toastRegion;
/* UI.toast(mensaje, tipo = 'info'|'success'|'error'|'warning', {duration, title}) */
UI.toast = function (msg, tipo, o) {
  o = o || {}; tipo = tipo || 'info';
  if (!toastRegion) { toastRegion = el('div', { class: 'toast-region', 'aria-live': 'polite', 'aria-atomic': 'false' }); doc.body.appendChild(toastRegion); }
  var ic = { success: 'check-circle', error: 'alert-circle', warning: 'alert-triangle', info: 'info' }[tipo] || 'info';
  var t = el('div', { class: 'toast ' + tipo, role: tipo === 'error' ? 'alert' : 'status' }, icon(ic) + '<div class="t-msg">' + (o.title ? '<strong>' + esc(o.title) + '</strong><br>' : '') + esc(msg) + '</div>');
  var x = el('button', { type: 'button', class: 't-close', 'aria-label': 'Cerrar aviso' }, icon('x', 'icon-sm')); t.appendChild(x);
  function rm() { if (t.__gone) return; t.__gone = true; t.classList.add('is-leaving'); setTimeout(function () { t.remove(); }, 190); }
  x.addEventListener('click', rm); toastRegion.appendChild(t); while (toastRegion.children.length > 4) toastRegion.firstChild.remove();
  var d = o.duration == null ? 4200 : o.duration; if (d > 0) setTimeout(rm, d); return { close: rm };
};

/* ---------- 6. pestañas ---------- */
/* UI.tabs(el, {onChange(id), hash:false}) — el: contenedor .tabs[role=tablist] con botones .tab[role=tab][aria-controls=idPanel]; paneles [role=tabpanel] con ese id. Devuelve {select(id)} */
UI.tabs = function (root, o) {
  o = o || {}; var tabs = UI.$$('[role="tab"]', root), api = {};
  var booted = false; setTimeout(function () { booted = true; }, 0);
  function sel(id, focus) { tabs.forEach(function (t) { var on = t.getAttribute('aria-controls') === id; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; var p = doc.getElementById(t.getAttribute('aria-controls')); if (p) p.hidden = !on; if (on && focus) t.focus(); }); if (o.hash && booted) { try { history.replaceState(null, '', '#' + id); } catch (e) {} } if (o.onChange) o.onChange(id); }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { sel(t.getAttribute('aria-controls')); });
    t.addEventListener('keydown', function (e) { var n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : null; if (n == null) return; e.preventDefault(); n = (n + tabs.length) % tabs.length; sel(tabs[n].getAttribute('aria-controls'), true); });
  });
  var start = (o.hash && location.hash && tabs.filter(function (t) { return t.getAttribute('aria-controls') === location.hash.slice(1); })[0]) || tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] || tabs[0];
  if (start) sel(start.getAttribute('aria-controls')); api.select = function (id) { sel(id); }; return api;
};

/* ---------- 7. menú desplegable ---------- */
var openMenu = null;
/* UI.menu(ancla, items, {align:'start'|'end', onClose}) — items: {label, icon, onClick, href, danger, disabled, checked} | {sep:true} | {heading:'Texto'} | {html:'…'} */
UI.menu = function (anchor, items, o) {
  o = o || {}; if (openMenu) { var same = openMenu.anchor === anchor; openMenu.close(); if (same) return null; }
  var m = el('div', { class: 'menu', role: 'menu' }), idx = 0;
  items.forEach(function (it) {
    if (it.sep) { m.appendChild(el('div', { class: 'menu-sep', role: 'separator' })); return; }
    if (it.heading) { m.appendChild(el('div', { class: 'menu-label' }, esc(it.heading))); return; }
    if (it.html) { m.appendChild(el('div', { class: 'menu-head' }, it.html)); return; }
    var b = el(it.href ? 'a' : 'button', { class: 'menu-item' + (it.danger ? ' is-danger' : ''), role: it.checked != null ? 'menuitemradio' : 'menuitem', 'aria-checked': it.checked != null ? String(!!it.checked) : false, type: it.href ? false : 'button', href: it.href || false, disabled: it.disabled || false, tabindex: '-1' },
      (it.icon ? icon(it.icon) : '') + '<span>' + esc(it.label) + '</span>' + (it.checked ? icon('check', 'check-end') : ''));
    b.addEventListener('click', function () { api.close(); if (it.onClick) it.onClick(); }); m.appendChild(b);
  });
  doc.body.appendChild(m);
  var r = anchor.getBoundingClientRect(), mw = m.offsetWidth, mh = m.offsetHeight, vw = innerWidth, vh = innerHeight;
  var left = (o.align || 'start') === 'end' ? r.right - mw : r.left; left = Math.max(8, Math.min(left, vw - mw - 8));
  var top = r.bottom + 6; if (top + mh > vh - 8) top = Math.max(8, r.top - mh - 6); m.style.left = left + 'px'; m.style.top = top + 'px';
  anchor.setAttribute('aria-expanded', 'true'); var entry;
  function outside(e) { if (!m.contains(e.target) && !anchor.contains(e.target)) api.close(); }
  function kd(e) { var els = UI.$$('.menu-item:not([disabled])', m), i = els.indexOf(doc.activeElement); if (e.key === 'ArrowDown') { e.preventDefault(); (els[i + 1] || els[0]).focus(); } else if (e.key === 'ArrowUp') { e.preventDefault(); (els[i - 1] || els[els.length - 1]).focus(); } else if (e.key === 'Tab') { api.close(); } }
  var api = { anchor: anchor, close: function () { if (!m.isConnected) return; var i = stack.indexOf(entry); if (i > -1) stack.splice(i, 1); m.remove(); anchor.setAttribute('aria-expanded', 'false'); doc.removeEventListener('mousedown', outside, true); doc.removeEventListener('keydown', kd); removeEventListener('resize', api.close); removeEventListener('scroll', api.close, true); openMenu = null; if (o.onClose) o.onClose(); } };
  entry = { root: m, trap: false, close: function () { api.close(); try { anchor.focus(); } catch (e) {} } }; stack.push(entry);
  setTimeout(function () { doc.addEventListener('mousedown', outside, true); }, 0); doc.addEventListener('keydown', kd); addEventListener('resize', api.close); addEventListener('scroll', api.close, true);
  var f = UI.$('.menu-item:not([disabled])', m); if (f) f.focus(); openMenu = api; return api;
};

/* ---------- 8. tabla de datos ---------- */
/* UI.table(el, {columns, rows, pageSize, pageSizes, searchable, filters, onRowClick, selectable, onSelect, bulkActions, emptyText, rowKey, actions, dense, maxHeight, toolbar, caption, loading, cards})
   columns: [{key, label, sortable (def. true), align:'right', mono, num, title (celda principal en tarjeta móvil), width, hideMobile, render(row, i) → HTML, value(row) → valor de orden/búsqueda}]
   filters: [{key, label, options:[…]|'auto', all:'Todos', match(row, val)}]   actions: row → items de UI.menu (agrega columna ⋯)
   Devuelve {el, setRows(rows), refresh(), getSelected(), clearSelection(), setFilter(key, val), search(q), goTo(n), setLoading(b), getView()} */
UI.table = function (host, o) {
  o = o || {}; var cols = o.columns, rows = o.rows || [], st = { q: '', f: {}, sort: o.sort || null, page: 1, size: o.pageSize || 10, sel: new Set(), loading: !!o.loading };
  var cards = o.cards !== false, hasTools = o.searchable || (o.filters && o.filters.length) || o.toolbar;
  host.innerHTML = '<div class="table-card">' + (hasTools ? '<div class="table-toolbar"></div>' : '') + '<div class="table-bulk" hidden></div><div class="table-wrap"' + (o.maxHeight ? ' style="--table-max:' + (typeof o.maxHeight === 'number' ? o.maxHeight + 'px' : o.maxHeight) + '"' : '') + '><table class="table' + (cards ? ' table--cards' : '') + (o.dense ? ' is-dense' : '') + '">' + (o.caption ? '<caption class="sr-only">' + esc(o.caption) + '</caption>' : '') + '<thead></thead><tbody></tbody></table></div><div class="table-empty" hidden></div><div class="table-foot"><span class="tf-info" aria-live="polite"></span><span class="row gap-3"><span class="tf-size"></span><nav class="pagination" aria-label="Paginación"></nav></span></div></div>';
  var card = host.firstElementChild, tools = UI.$('.table-toolbar', card), bulk = UI.$('.table-bulk', card), thead = UI.$('thead', card), tbody = UI.$('tbody', card), empty = UI.$('.table-empty', card), info = UI.$('.tf-info', card), pag = UI.$('.pagination', card), sizeBox = UI.$('.tf-size', card), wrap = UI.$('.table-wrap', card), foot = UI.$('.table-foot', card);
  function cv(c, r) { return c.value ? c.value(r) : r[c.key]; }
  /* barra de herramientas */
  if (tools) {
    if (o.searchable) { var ph = (o.searchable && o.searchable.placeholder) || 'Buscar…'; tools.appendChild(el('div', { class: 'search' }, icon('search') + '<input class="input" type="search" placeholder="' + esc(ph) + '" aria-label="' + esc(ph) + '">')); UI.$('input', tools).addEventListener('input', function (e) { st.q = e.target.value; st.page = 1; draw(); }); }
    (o.filters || []).forEach(function (f) {
      var opts = f.options === 'auto' || !f.options ? Array.from(new Set(rows.map(function (r) { return r[f.key]; }))).filter(function (v) { return v != null && v !== ''; }).sort() : f.options;
      var s = el('select', { class: 'select input-sm', 'aria-label': f.label, style: 'width:auto;min-width:130px' }, '<option value="">' + esc(f.all || f.label) + '</option>' + opts.map(function (v) { var val = typeof v === 'object' ? v.value : v, lb = typeof v === 'object' ? v.label : v; return '<option value="' + esc(val) + '">' + esc(lb) + '</option>'; }).join(''));
      s.addEventListener('change', function () { st.f[f.key] = s.value; st.page = 1; draw(); }); s.dataset.key = f.key; tools.appendChild(s);
    });
    if (o.toolbar) tools.appendChild(toNode(o.toolbar));
  }
  function visible() {
    var q = UI.norm(st.q), out = rows.filter(function (r) {
      for (var k in st.f) { if (st.f[k] === '' || st.f[k] == null) continue; var fd = (o.filters || []).filter(function (x) { return x.key === k; })[0]; if (fd && fd.match ? !fd.match(r, st.f[k]) : String(r[k]) !== st.f[k]) return false; }
      if (!q) return true; var hay = cols.map(function (c) { return UI.norm(cv(c, r)); }).join(' ') + ' ' + UI.norm((o.searchKeys || []).map(function (k) { return r[k]; }).join(' ')); return hay.indexOf(q) > -1;
    });
    if (st.sort) { var c = cols.filter(function (x) { return x.key === st.sort.key; })[0], d = st.sort.dir === 'asc' ? 1 : -1; if (c) out = out.slice().sort(function (a, b) { var x = cv(c, a), y = cv(c, b); if (x == null) return 1; if (y == null) return -1; if (typeof x === 'number' && typeof y === 'number') return (x - y) * d; return String(x).localeCompare(String(y), 'es', { numeric: true, sensitivity: 'base' }) * d; }); }
    return out;
  }
  function rid(r) { return o.rowKey ? r[o.rowKey] : rows.indexOf(r); }
  function head() {
    var h = '<tr>' + (o.selectable ? '<th class="col-check"><label class="check"><input type="checkbox" data-all aria-label="Seleccionar todas las filas de esta página"></label></th>' : '');
    cols.forEach(function (c, i) { var s = st.sort && st.sort.key === c.key, sortable = c.sortable !== false && c.key; h += '<th scope="col"' + (c.hideMobile ? ' class="hide-mobile' + (sortable ? ' is-sortable' : '') + (c.align === 'right' || c.num ? ' num' : '') + '"' : ' class="' + (sortable ? 'is-sortable ' : '') + (c.align === 'right' || c.num ? 'num' : '') + '"') + (c.width ? ' style="width:' + c.width + '"' : '') + (s ? ' aria-sort="' + (st.sort.dir === 'asc' ? 'ascending' : 'descending') + '"' : '') + '>' + (sortable ? '<button type="button" class="sort" data-sort="' + esc(c.key) + '">' + esc(c.label) + icon(s ? (st.sort.dir === 'asc' ? 'chevron-up' : 'chevron-down') : 'chevrons-up-down') + '</button>' : esc(c.label)) + '</th>'; });
    if (o.actions) h += '<th class="cell-actions"><span class="sr-only">Acciones</span></th>'; thead.innerHTML = h + '</tr>';
  }
  function draw() {
    var all = visible(), total = all.length, pages = Math.max(1, Math.ceil(total / st.size)); if (st.page > pages) st.page = pages;
    var start = (st.page - 1) * st.size, slice = all.slice(start, start + st.size), h = '';
    head();
    if (st.loading) { for (var s = 0; s < Math.min(st.size, 6); s++) h += '<tr>' + (o.selectable ? '<td class="col-check"></td>' : '') + cols.map(function () { return '<td><span class="skeleton sk-line" style="width:' + (50 + Math.random() * 40) + '%"></span></td>'; }).join('') + (o.actions ? '<td></td>' : '') + '</tr>'; tbody.innerHTML = h; thead.parentNode.hidden = false; empty.hidden = true; foot.hidden = true; return; }
    foot.hidden = false;
    slice.forEach(function (r, i) {
      var id = rid(r), on = st.sel.has(r);
      h += '<tr data-i="' + (start + i) + '"' + (o.onRowClick ? ' class="is-clickable' + (on ? ' is-selected' : '') + '" tabindex="0"' : (on ? ' class="is-selected"' : '')) + '>' + (o.selectable ? '<td class="col-check"><label class="check"><input type="checkbox" data-row' + (on ? ' checked' : '') + ' aria-label="Seleccionar fila"></label></td>' : '');
      cols.forEach(function (c) { var v = c.render ? c.render(r, start + i) : esc(cv(c, r) == null ? '—' : cv(c, r)); var cl = [c.hideMobile ? 'hide-mobile' : '', c.title ? 'cell-title' : '', c.mono ? 'cell-mono' : '', c.align === 'right' || c.num ? 'num' : ''].join(' ').trim(); h += '<td' + (cl ? ' class="' + cl + '"' : '') + ' data-label="' + (c.title ? '' : esc(c.label)) + '">' + v + '</td>'; });
      if (o.actions) h += '<td class="cell-actions" data-label=""><button type="button" class="btn btn-ghost btn-icon btn-sm" data-act aria-label="Acciones de la fila" aria-haspopup="menu">' + icon('more') + '</button></td>';
      h += '</tr>';
    });
    tbody.innerHTML = h; thead.parentNode.hidden = !slice.length;
    empty.hidden = !!slice.length; if (!slice.length) { empty.innerHTML = UI.empty({ icon: 'search', title: rows.length ? 'Sin resultados' : (o.emptyText || 'Aún no hay registros'), text: rows.length ? (o.emptyText || 'Prueba con otros filtros o términos de búsqueda.') : '', action: rows.length && (st.q || Object.keys(st.f).some(function (k) { return st.f[k]; })) ? { label: 'Limpiar filtros', id: 'clear' } : null }); }
    info.textContent = total ? 'Mostrando ' + (start + 1) + '–' + Math.min(total, start + st.size) + ' de ' + fmt.num(total) + (total !== rows.length ? ' (filtrado de ' + fmt.num(rows.length) + ')' : '') : '0 resultados';
    /* paginación */
    var pb = ''; if (pages > 1) { var set = [1]; for (var p = st.page - 1; p <= st.page + 1; p++) if (p > 1 && p < pages) set.push(p); set.push(pages); set = Array.from(new Set(set)).sort(function (a, b) { return a - b; });
      pb += '<button type="button" class="page-btn" data-page="' + (st.page - 1) + '" aria-label="Página anterior"' + (st.page === 1 ? ' disabled' : '') + '>' + icon('chevron-left', 'icon-sm') + '</button>'; var last = 0;
      set.forEach(function (p) { if (p - last > 1) pb += '<span class="page-btn" aria-hidden="true">…</span>'; pb += '<button type="button" class="page-btn" data-page="' + p + '"' + (p === st.page ? ' aria-current="page"' : '') + ' aria-label="Página ' + p + '">' + p + '</button>'; last = p; });
      pb += '<button type="button" class="page-btn" data-page="' + (st.page + 1) + '" aria-label="Página siguiente"' + (st.page === pages ? ' disabled' : '') + '>' + icon('chevron-right', 'icon-sm') + '</button>'; }
    pag.innerHTML = pb; if (o.pageSizes) sizeBox.innerHTML = '<label class="row gap-2 nowrap">Filas <select class="select input-sm" style="width:auto" data-size aria-label="Filas por página">' + o.pageSizes.map(function (n) { return '<option' + (n === st.size ? ' selected' : '') + '>' + n + '</option>'; }).join('') + '</select></label>';
    /* selección */
    if (o.selectable) { var allc = UI.$('[data-all]', thead), n = slice.filter(function (r) { return st.sel.has(r); }).length; if (allc) { allc.checked = slice.length > 0 && n === slice.length; allc.indeterminate = n > 0 && n < slice.length; } bulkDraw(); }
  }
  function bulkDraw() {
    if (!o.selectable) return; var n = st.sel.size; bulk.hidden = !n; if (!n) return;
    bulk.innerHTML = '<strong>' + n + ' seleccionad' + (n === 1 ? 'a' : 'as') + '</strong>' + (o.bulkActions || []).map(function (a, i) { return '<button type="button" class="btn btn-secondary btn-sm" data-bulk="' + i + '">' + (a.icon ? icon(a.icon) : '') + esc(a.label) + '</button>'; }).join('') + '<button type="button" class="btn btn-ghost btn-sm" data-bulk="clear">Quitar selección</button>';
    if (o.onSelect) o.onSelect(Array.from(st.sel));
  }
  card.addEventListener('click', function (e) {
    var t = e.target, b;
    if ((b = t.closest('[data-sort]'))) { var k = b.dataset.sort; st.sort = st.sort && st.sort.key === k ? (st.sort.dir === 'asc' ? { key: k, dir: 'desc' } : null) : { key: k, dir: 'asc' }; draw(); return; }
    if ((b = t.closest('button.page-btn[data-page]')) && !b.disabled) { st.page = +b.dataset.page; draw(); wrap.scrollTop = 0; return; }
    if ((b = t.closest('[data-empty-action]'))) { api.clear(); return; }
    if ((b = t.closest('[data-bulk]'))) { var a = b.dataset.bulk; if (a === 'clear') api.clearSelection(); else (o.bulkActions[+a].onClick || function () {})(Array.from(st.sel)); return; }
    var tr = t.closest('tbody tr[data-i]'); if (!tr) return; var row = visible()[+tr.dataset.i];
    if ((b = t.closest('[data-act]'))) { UI.menu(b, o.actions(row), { align: 'end' }); return; }
    if (t.closest('input[data-row]')) { if (t.checked) st.sel.add(row); else st.sel.delete(row); tr.classList.toggle('is-selected', t.checked); var cb = UI.$('[data-all]', thead), pg = UI.$$('tbody input[data-row]', card); if (cb) { var n = pg.filter(function (x) { return x.checked; }).length; cb.checked = n === pg.length; cb.indeterminate = n > 0 && n < pg.length; } bulkDraw(); return; }
    if (t.closest('a,button,input,select,label,[data-no-row]')) return; if (o.onRowClick) o.onRowClick(row, tr);
  });
  card.addEventListener('change', function (e) { var t = e.target; if (t.matches('[data-all]')) { var all = visible(), start = (st.page - 1) * st.size; all.slice(start, start + st.size).forEach(function (r) { if (t.checked) st.sel.add(r); else st.sel.delete(r); }); draw(); } else if (t.matches('[data-size]')) { st.size = +t.value; st.page = 1; draw(); } });
  card.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('tbody tr.is-clickable')) { e.preventDefault(); o.onRowClick(visible()[+e.target.dataset.i], e.target); } });
  var api = {
    el: card,
    setRows: function (r) { rows = r || []; st.sel.clear(); st.page = 1; draw(); },
    refresh: function () { draw(); }, getSelected: function () { return Array.from(st.sel); }, clearSelection: function () { st.sel.clear(); draw(); },
    setFilter: function (k, v) { st.f[k] = v; var s = UI.$('select[data-key="' + k + '"]', card); if (s) s.value = v; st.page = 1; draw(); },
    search: function (q) { st.q = q; var i = UI.$('input[type=search]', card); if (i) i.value = q; st.page = 1; draw(); },
    goTo: function (n) { st.page = n; draw(); }, setLoading: function (b) { st.loading = !!b; draw(); }, getView: function () { return visible(); },
    clear: function () { st.q = ''; st.f = {}; UI.$$('select[data-key]', card).forEach(function (s) { s.value = ''; }); var i = UI.$('input[type=search]', card); if (i) i.value = ''; st.page = 1; draw(); }
  };
  draw(); return api;
};

/* ---------- 9. mapa (Leaflet + teselas claro/oscuro) ---------- */
var maps = [];
/* Teselas: CARTO (basemaps.cartocdn.com) exige hoy una API key, por eso se usa el lienzo gris de Esri (claro/oscuro) sin llave.
   Para cambiar de proveedor edita TILES; cada entrada es {base, labels}. */
var TILES = {
  light: { base: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', labels: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}' },
  dark: { base: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', labels: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}' }
};
UI.tiles = TILES;
function tileSet() { return TILES[doc.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light']; }
/* UI.map(el, {center:[lat,lng], zoom, scrollZoom}) → {map (L.Map), pin(), vehicle(), route(), fit(), clear(), invalidate(), destroy()}
   pin({lat,lng,n,state:'pending|current|done|failed|partial|origin',popup,onClick}) · vehicle({lat,lng,placa,state:'moving|stopped|off',popup,onClick}) · route(puntos,{color,weight,dashed,opacity}) · fit(arrayDePuntosOCapas,{padding}) */
UI.map = function (host, o) {
  o = o || {};
  if (!window.L) { host.innerHTML = UI.empty({ icon: 'map', title: 'No se pudo cargar el mapa', text: 'Verifica la conexión a internet para ver las teselas.' }); return { map: null, pin: noop, vehicle: noop, route: noop, fit: noop, clear: noop, invalidate: noop, destroy: noop }; }
  var L = window.L; host.classList.add('map'); host.innerHTML = '';
  var map = L.map(host, { center: o.center || [4.68, -74.14], zoom: o.zoom || 11, zoomControl: o.zoomControl !== false, scrollWheelZoom: false, attributionControl: true }); if (map.attributionControl) map.attributionControl.setPrefix(false);
  var ts = tileSet(), tiles = [L.tileLayer(ts.base, { maxNativeZoom: 16, maxZoom: 18, attribution: 'Tiles © Esri — Esri, DeLorme, NAVTEQ' }).addTo(map), L.tileLayer(ts.labels, { maxNativeZoom: 16, maxZoom: 18, opacity: .9 }).addTo(map)], layer = L.featureGroup().addTo(map);
  if (o.scrollZoom) map.scrollWheelZoom.enable(); else { map.on('click', function () { map.scrollWheelZoom.enable(); }); host.addEventListener('mouseleave', function () { map.scrollWheelZoom.disable(); }); }
  var api = {
    map: map, layer: layer, _tiles: tiles,
    pin: function (p) { var ic = L.divIcon({ className: '', html: '<div class="pin is-' + (p.state === 'pending' || !p.state ? 'pending' : p.state) + '">' + (p.n != null ? esc(p.n) : '') + '</div>', iconSize: [28, 28], iconAnchor: [14, 14] }); var m = L.marker([p.lat, p.lng], { icon: ic, title: p.title || '', keyboard: true }).addTo(layer); if (p.popup) m.bindPopup(p.popup); if (p.onClick) m.on('click', p.onClick); return m; },
    vehicle: function (v) { var ic = L.divIcon({ className: '', html: '<div class="veh-pin' + (v.state === 'stopped' ? ' is-stopped' : v.state === 'off' ? ' is-off' : '') + '">' + UI.plate(v.placa) + '<span class="veh-dot"></span></div>', iconSize: [0, 0], iconAnchor: [0, 0] }); var m = L.marker([v.lat, v.lng], { icon: ic, zIndexOffset: 500, title: v.placa }).addTo(layer); if (v.popup) m.bindPopup(v.popup); if (v.onClick) m.on('click', v.onClick); return m; },
    route: function (pts, r) { r = r || {}; var c = r.color || cssVar('--blue'); var pl = L.polyline(pts, { color: c, weight: r.weight || 4, opacity: r.opacity || .85, dashArray: r.dashed ? '8 8' : null, lineJoin: 'round' }).addTo(layer); return pl; },
    fit: function (what, f) { try { var b = what && what.length ? L.latLngBounds(what.map(function (w) { return w.getLatLng ? w.getLatLng() : w; })) : layer.getBounds(); if (b.isValid()) map.fitBounds(b, { padding: [(f && f.padding) || 36, (f && f.padding) || 36], maxZoom: (f && f.maxZoom) || 15 }); } catch (e) {} },
    clear: function () { layer.clearLayers(); }, invalidate: function () { map.invalidateSize(); }, destroy: function () { if (api._ro) { api._ro.disconnect(); api._ro = null; } var ix = maps.indexOf(api); if (ix > -1) maps.splice(ix, 1); map.remove(); }
  };
  maps.push(api); setTimeout(function () { map.invalidateSize(); }, 60); if (window.ResizeObserver) { api._ro = new ResizeObserver(function () { if (map._container && map._loaded !== false && host.isConnected) { try { map.invalidateSize(); } catch (e) {} } }); api._ro.observe(host); } return api;
};
function noop() {}
UI.onTheme(function () { maps.forEach(function (m) { if (m._tiles) { var t = tileSet(); m._tiles[0].setUrl(t.base); m._tiles[1].setUrl(t.labels); } }); });
function cssVar(n) { return getComputedStyle(doc.documentElement).getPropertyValue(n).trim(); }
UI.cssVar = cssVar;

/* ---------- 10. gráficos (Chart.js) ---------- */
var charts = [];
function pal() { var d = doc.documentElement.getAttribute('data-theme') === 'dark'; return { series: d ? ['#5B93F0', '#35B27D', '#E0A21A', '#FF5A70', '#98A3AD', '#B28AE0'] : ['#2A6BDB', '#15915A', '#C98A00', '#D4122D', '#56616B', '#7A4B9A'], text: cssVar('--text-2'), grid: cssVar('--border'), surface: cssVar('--surface'), ink: cssVar('--text'), red: d ? '#FF5A70' : '#D4122D', steel: cssVar('--steel') }; }
UI.chartColors = pal;
function baseChart(host) { var c; if (host.tagName === 'CANVAS') c = host; else { c = host.querySelector('canvas'); if (!c) { c = doc.createElement('canvas'); host.appendChild(c); } } return c; }
function common(P, o) {
  if (window.Chart) { Chart.defaults.font.family = cssVar('--font-ui') || 'Instrument Sans, sans-serif'; Chart.defaults.font.size = 12; Chart.defaults.color = P.text; }
  return { responsive: true, maintainAspectRatio: false, animation: { duration: 400 }, interaction: { mode: 'index', intersect: false },
    plugins: { legend: { display: o.legend === true, position: 'bottom', align: 'start', labels: { usePointStyle: true, pointStyle: 'rectRounded', boxWidth: 8, boxHeight: 8, padding: 14, color: P.text } },
      tooltip: { backgroundColor: P.ink, titleColor: P.surface, bodyColor: P.surface, padding: 10, cornerRadius: 8, boxPadding: 4, usePointStyle: true, callbacks: o.unit ? { label: function (c) { var v = c.parsed.y != null ? c.parsed.y : c.parsed; return ' ' + (c.dataset.label ? c.dataset.label + ': ' : '') + fmt.num(v, o.dec || 0) + (o.unit === '%' ? ' %' : ' ' + o.unit); } } : {} } },
    scales: { x: { grid: { display: false }, border: { color: P.grid }, ticks: { color: P.text, maxRotation: 0, autoSkip: true, maxTicksLimit: o.maxXTicks || 8 } }, y: { beginAtZero: o.beginAtZero !== false, min: o.min, max: o.max, grid: { color: P.grid }, border: { display: false }, ticks: { color: P.text, maxTicksLimit: 6, callback: o.unit ? function (v) { return fmt.num(v, o.tickDec || 0) + (o.unit === '%' ? ' %' : ''); } : undefined } } } };
}
function reg(kind, host, cfg, build) {
  UI.chart.destroy(host);
  if (!window.Chart) { host.innerHTML = UI.empty({ icon: 'bar-chart', title: 'Gráfico no disponible', text: 'No se pudo cargar la librería de gráficos.' }); return null; }
  var canvas = baseChart(host), item = { host: host, canvas: canvas, build: build, cfg: cfg, kind: kind }; item.chart = new Chart(canvas, build(cfg, pal())); charts.push(item); return item.chart;
}
UI.onTheme(function () { charts.forEach(function (i) { if (!i.canvas.isConnected) return; i.chart.destroy(); i.chart = new Chart(i.canvas, i.build(i.cfg, pal())); }); });
UI.chart = {
  /* UI.chart.destroy(el) — destruye los gráficos de ese contenedor (se llama solo al volver a pintar en el mismo el) */
  destroy: function (host) { charts = charts.filter(function (i) { if (i.host === host || i.canvas === host) { try { i.chart.destroy(); } catch (e) {} return false; } return true; }); },
  /* UI.chart.line(el, {labels, datasets:[{label, data, color, fill, dashed}], unit:'%', dec, min, max, target:{value,label}, legend, tension}) */
  line: function (host, cfg) { return reg('line', host, cfg, function (c, P) { var op = common(P, c), ds = c.datasets.map(function (d, i) { var col = d.color || P.series[i % P.series.length]; return { label: d.label, data: d.data, borderColor: col, backgroundColor: d.fill ? col + '22' : col, fill: !!d.fill, tension: c.tension == null ? .3 : c.tension, borderWidth: 2, pointRadius: d.points ? 3 : 0, pointHoverRadius: 4, borderDash: d.dashed ? [5, 4] : undefined }; });
    if (c.target) ds.push({ label: c.target.label || 'Meta', data: c.labels.map(function () { return c.target.value; }), borderColor: P.steel, borderDash: [6, 5], borderWidth: 1.5, pointRadius: 0, fill: false }); return { type: 'line', data: { labels: c.labels, datasets: ds }, options: op }; }); },
  /* UI.chart.bar(el, {labels, datasets:[{label,data,color}], horizontal, stacked, unit, legend}) */
  bar: function (host, cfg) { return reg('bar', host, cfg, function (c, P) { var op = common(P, c); if (c.horizontal) { op.indexAxis = 'y'; op.scales.y.ticks.callback = function (v) { return this.getLabelForValue(v); }; op.scales.x.ticks.callback = function (v) { return fmt.num(v, c.dec || 0); }; op.scales.x.grid = { color: P.grid }; op.scales.y.grid = { display: false }; op.scales.x.beginAtZero = true; op.interaction = { mode: 'nearest', axis: 'y', intersect: false }; if (c.unit) { op.scales.x.ticks.callback = function (v) { return fmt.num(v, c.dec || 0) + (c.unit === '%' ? ' %' : ''); }; op.scales.y.ticks.callback = function (v) { return this.getLabelForValue(v); }; op.plugins.tooltip.callbacks = { label: function (x) { return ' ' + fmt.num(x.parsed.x, c.dec || 0) + (c.unit === '%' ? ' %' : ' ' + c.unit); } }; } } if (c.stacked) { op.scales.x.stacked = true; op.scales.y.stacked = true; }
    return { type: 'bar', data: { labels: c.labels, datasets: c.datasets.map(function (d, i) { var col = d.color || P.series[i % P.series.length]; return { label: d.label, data: d.data, backgroundColor: d.colors || col, borderRadius: 4, maxBarThickness: 32, borderSkipped: false }; }) }, options: op }; }); },
  /* UI.chart.donut(el, {labels, data, colors, center:{value,label}, legend}) */
  donut: function (host, cfg) { return reg('donut', host, cfg, function (c, P) { var op = common(P, c); op.cutout = c.cutout || '70%'; delete op.scales; op.interaction = { mode: 'nearest' }; op.plugins.legend.display = c.legend !== false; op.plugins.legend.position = c.legendPos || 'right'; op.plugins.tooltip.callbacks = { label: function (x) { return ' ' + x.label + ': ' + fmt.num(x.parsed, c.dec || 0) + (c.unit ? ' ' + c.unit : ''); } };
    var center = { id: 'center', afterDraw: function (ch) { if (!c.center) return; var a = ch.chartArea, x = (a.left + a.right) / 2, y = (a.top + a.bottom) / 2, g = ch.ctx; g.save(); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = P.ink; g.font = '600 26px ' + cssVar('--font-display'); g.fillText(c.center.value, x, y - (c.center.label ? 8 : 0)); if (c.center.label) { g.fillStyle = P.text; g.font = '12px ' + cssVar('--font-ui'); g.fillText(c.center.label, x, y + 16); } g.restore(); } };
    return { type: 'doughnut', data: { labels: c.labels, datasets: [{ data: c.data, backgroundColor: c.colors || P.series, borderColor: P.surface, borderWidth: 2, hoverOffset: 4 }] }, options: op, plugins: [center] }; }); },
  /* UI.chart.spark(el, {data, color, fill}) — mini línea sin ejes */
  spark: function (host, cfg) { return reg('spark', host, cfg, function (c, P) { var col = c.color || P.series[0]; return { type: 'line', data: { labels: c.data.map(function (_, i) { return i; }), datasets: [{ data: c.data, borderColor: col, backgroundColor: col + '22', fill: c.fill !== false, borderWidth: 1.75, pointRadius: 0, tension: .35 }] }, options: { responsive: true, maintainAspectRatio: false, animation: false, events: [], plugins: { legend: { display: false }, tooltip: { enabled: false } }, scales: { x: { display: false }, y: { display: false } }, layout: { padding: 2 } } }; }); }
};

/* ---------- 11. shell ---------- */
var NAV = [
 { g: 'Operación', items: [
  { id: 'panel', label: 'Panel de control', href: 'panel.html', icon: 'layout-dashboard' }, { id: 'pedidos', label: 'Pedidos', href: 'pedidos.html', icon: 'package', count: 'pedidos' },
  { id: 'reservas', label: 'Reservas', href: 'reservas.html', icon: 'lock' }, { id: 'planeacion', label: 'Planeación logística', href: 'planeacion.html', icon: 'calendar' },
  { id: 'motor-rutas', label: 'Motor de rutas', href: 'motor-rutas.html', icon: 'route' }, { id: 'cargue', label: 'Optimización de cargue', href: 'cargue.html', icon: 'layers' },
  { id: 'despachos', label: 'Despachos', href: 'despachos.html', icon: 'clipboard-list' }, { id: 'seguimiento', label: 'Seguimiento de ruta', href: 'seguimiento.html', icon: 'navigation' },
  { id: 'conductor', label: 'App de conductores', href: 'conductor.html', icon: 'smartphone' }, { id: 'evidencias', label: 'Evidencias', href: 'evidencias.html', icon: 'camera' },
  { id: 'novedades', label: 'Novedades', full: 'Novedades y devoluciones', href: 'novedades.html', icon: 'alert-triangle', count: 'novedades', alert: true } ] },
 { g: 'Bodega', items: [
  { id: 'bodegas', label: 'Bodegas WMS', href: 'bodegas.html', icon: 'warehouse' }, { id: 'preparacion', label: 'Preparación de pedidos', href: 'preparacion.html', icon: 'clipboard-check', count: 'preparacion' },
  { id: 'inventario', label: 'Inventario y conteos', href: 'inventario.html', icon: 'scan' } ] },
 { g: 'Análisis', items: [ { id: 'reportes', label: 'Reportes e indicadores', href: 'reportes.html', icon: 'bar-chart' }, { id: 'auditoria', label: 'Auditoría y trazabilidad', href: 'auditoria.html', icon: 'shield-check' } ] },
 { g: 'Maestros', items: [
  { id: 'clientes', label: 'Clientes', href: 'clientes.html', icon: 'users' }, { id: 'productos', label: 'Productos', href: 'productos.html', icon: 'box' },
  { id: 'vehiculos', label: 'Vehículos', href: 'vehiculos.html', icon: 'truck' }, { id: 'rutas', label: 'Rutas', href: 'rutas.html', icon: 'map' } ] },
 { g: 'Administración', items: [
  { id: 'integraciones', label: 'Integraciones', href: 'integraciones.html', icon: 'plug', count: 'integraciones', alert: true }, { id: 'usuarios', label: 'Usuarios y roles', href: 'usuarios.html', icon: 'key' },
  { id: 'notificaciones', label: 'Notificaciones', href: 'notificaciones.html', icon: 'bell' } ] }
];
UI.nav = NAV;
function counts() {
  var c = {}; try {
    c.pedidos = ARM.pedidos.filter(function (p) { return ['Recibido', 'Stock validado', 'Bloqueado por stock', 'En firme', 'En preparación', 'Listo para despacho', 'Planificado'].indexOf(p.estado) > -1; }).length;
    c.novedades = ARM.novedades.filter(function (n) { return n.estado === 'Abierta'; }).length;
    c.preparacion = ARM.tareas.filter(function (t) { return t.estado === 'Pendiente' || t.estado === 'En curso'; }).length;
    c.integraciones = ARM.logs.filter(function (l) { return l.estado === 'Error' || l.estado === 'Reintentando'; }).length;
  } catch (e) {} return c;
}
UI.unreadCount = function () { try { return ARM.notificaciones.filter(function (n) { return !n.leida; }).length; } catch (e) { return 0; } };
function findNav(id) { for (var i = 0; i < NAV.length; i++) for (var j = 0; j < NAV[i].items.length; j++) if (NAV[i].items[j].id === id) return { g: NAV[i].g, item: NAV[i].items[j] }; return null; }
function setTheme(t, silent) { doc.documentElement.setAttribute('data-theme', t); store('arm.theme', t); var b = UI.$('#themeBtn'); if (b) { b.innerHTML = icon(t === 'dark' ? 'sun' : 'moon'); b.setAttribute('aria-label', t === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'); b.setAttribute('data-tip', t === 'dark' ? 'Tema claro' : 'Tema oscuro'); } if (!silent) themeCbs.forEach(function (f) { try { f(t); } catch (e) {} }); }
UI.theme = function (t) { if (t) setTheme(t); return doc.documentElement.getAttribute('data-theme') || 'light'; };
UI.sede = function () { var id = store('arm.sede') || ARM.sedeActual; return (ARM.idx && ARM.idx.sedes[id]) || (ARM.sedes && ARM.sedes[0]) || { id: '', nombre: '' }; };
/* HU de la pantalla actual (botón «Historias de usuario»). Algunas pantallas cubren varios módulos o parte de otro. */
var HU_EXTRA = { conductor: [{ numero: 16, only: ['ARM-HU-141', 'ARM-HU-142', 'ARM-HU-143'], nota: 'Captura de fotografía, firma y coordenadas desde la app' }] };
UI.huFor = function (page) {
  var out = [], mods = (ARM.modulos || []), file = page + '.html';
  mods.forEach(function (m) { if (m.pantalla === file) out.push({ m: m, hu: m.hu || [], nota: '' }); });
  (HU_EXTRA[page] || []).forEach(function (x) { var m = mods.filter(function (k) { return k.numero === x.numero; })[0]; if (m) out.push({ m: m, hu: (m.hu || []).filter(function (h) { return x.only.indexOf(h.id) > -1; }), nota: x.nota || '', parcial: true }); });
  return out;
};
function openHU(page) {
  var list = UI.huFor(page), total = list.reduce(function (a, x) { return a + x.hu.length; }, 0), tono = { 'Fuente directa': 'info', 'Propuesta transversal': 'neutral', 'Fuente directa contextual': 'warning' };
  var body = '<div class="hu-list">' + list.map(function (x) { return '<section class="hu-mod" aria-label="Módulo ' + x.m.numero + '"><header class="hu-mod-head"><span class="hu-num">' + String(x.m.numero).padStart(2, '0') + '</span><div class="grow"><div class="strong">' + esc(x.m.nombre) + '</div><div class="t-12 muted">' + (x.parcial ? 'Cubre ' + x.hu.length + ' de ' + x.m.cantidadHU + ' historias' + (x.nota ? ' · ' + esc(x.nota) : '') : x.hu.length + ' historias') + '</div></div>' + UI.chip(x.m.procedencia, { tone: tono[x.m.procedencia] || 'neutral', small: true }) + '</header><ul class="hu-items">' + x.hu.map(function (h) { return '<li><span class="hu-id">' + esc(h.id.replace('ARM-', '')) + '</span><span>' + esc(h.titulo) + '</span></li>'; }).join('') + '</ul></section>'; }).join('') + '</div>';
  UI.drawer({ title: 'Historias que cubre esta pantalla', subtitle: total + (total === 1 ? ' historia de usuario' : ' historias de usuario') + ' · ' + list.length + (list.length === 1 ? ' módulo' : ' módulos'), width: 480, body: body, footer: '<a class="btn btn-secondary btn-block" href="alcance.html">Ver alcance completo' + icon('arrow-right') + '</a>' });
}
function buildShell() {
  var page = doc.body.dataset.page || '', app = doc.getElementById('app'); if (!app || doc.body.dataset.shell === 'none') return;
  var me = ARM.usuarioActual || { nombre: 'Laura Restrepo', rol: 'Jefe de logística' }, sede = UI.sede(), cnt = counts(), cur = findNav(page);
  var shell = el('div', { class: 'shell', 'data-collapsed': store('arm.collapsed') === '1' ? 'true' : 'false', 'data-nav-open': 'false' });
  var nav = NAV.map(function (g) { return '<div class="nav-group"><div class="nav-title">' + esc(g.g) + '</div>' + g.items.map(function (i) { var n = i.count && cnt[i.count]; return '<a class="nav-item" href="' + i.href + '" data-tip="' + esc(i.label) + '" data-tip-pos="right"' + (i.id === page ? ' aria-current="page"' : '') + '>' + icon(i.icon) + '<span class="nav-label">' + esc(i.label) + '</span>' + (n ? '<span class="nav-count' + (i.alert ? ' is-alert' : '') + '" aria-label="' + n + ' pendientes">' + n + '</span>' : '') + '</a>'; }).join('') + '</div>'; }).join('');
  var side = el('aside', { class: 'sidebar', id: 'sidebar', 'aria-label': 'Navegación principal' },
    '<div class="sb-head"><a class="brand-pill" href="panel.html" aria-label="Armetales, ir al panel"><img class="full" src="assets/img/logo.png" alt="Armetales" width="134" height="29"><img class="mark" src="assets/img/logo-mark.png" alt="" width="28" height="28"></a><button type="button" class="btn btn-ghost btn-icon btn-sm ml-auto hide-md-up" id="navClose" aria-label="Cerrar menú">' + icon('x') + '</button></div>' +
    '<div class="sb-site"><button type="button" class="site-select" id="siteBtn" aria-haspopup="menu" aria-label="Cambiar de sede o bodega" data-tip="Sede o bodega" data-tip-pos="right">' + icon('warehouse') + '<span class="ss-text grow"><span class="ss-label">Sede / bodega</span><br><span class="ss-name" id="siteName">' + esc(sede.nombre) + '</span></span><span class="ss-chev">' + icon('chevrons-up-down', 'icon-sm') + '</span></button></div>' +
    '<nav class="sb-nav" aria-label="Módulos">' + nav + '</nav>' +
    '<div class="sb-foot"><a class="nav-item' + (page === 'alcance' ? '" aria-current="page' : '') + '" href="alcance.html" data-tip="Alcance de la propuesta" data-tip-pos="right">' + icon('file-text') + '<span class="nav-label foot-label">Alcance de la propuesta</span></a><div class="demo-tag">Demo · datos de ejemplo</div>' +
    '<button type="button" class="btn btn-ghost btn-sm sb-collapse" id="collapseBtn" aria-label="Contraer o expandir la barra lateral">' + icon('panel-left') + '<span class="foot-label">Contraer</span></button></div>');
  var scrim = el('div', { class: 'shell-scrim' }), main = el('div', { class: 'shell-main' });
  var crumbs = '<nav class="crumbs" aria-label="Migas de pan">' + (cur ? '<span>' + esc(cur.g) + '</span><span class="sep" aria-hidden="true">/</span><span class="cur" aria-current="page">' + esc(cur.item.label) + '</span>' : '<span class="cur" aria-current="page">' + esc((doc.title || '').split(' · ')[0] || 'Armetales') + '</span>') + '</nav>';
  var huList = (page === 'alcance' || page === 'styleguide') ? [] : UI.huFor(page), huN = huList.reduce(function (a, x) { return a + x.hu.length; }, 0);
  var huBtn = huN ? '<button type="button" class="btn btn-ghost hu-btn" id="huBtn" aria-label="Historias de usuario de esta pantalla: ' + huN + '" data-tip="Historias de usuario" data-tip-pos="bottom">' + icon('clipboard-check') + '<span class="hu-lbl">HU <b>' + huN + '</b></span></button>' : '';
  var top = el('header', { class: 'topbar' },
    '<button type="button" class="btn btn-ghost btn-icon hide-md-up" id="navBtn" aria-label="Abrir menú" aria-controls="sidebar" aria-expanded="false">' + icon('menu') + '</button>' + crumbs +
    '<button type="button" class="search-trigger" id="searchBtn" aria-label="Buscar en toda la aplicación">' + icon('search', 'icon-sm') + '<span class="lbl">Buscar pedidos, clientes, placas…</span><span class="kbd" id="kbdHint">Ctrl K</span></button>' +
    '<div class="topbar-actions">' + huBtn + '<button type="button" class="btn btn-ghost btn-icon" id="bellBtn" aria-label="Notificaciones" data-tip="Notificaciones" data-tip-pos="bottom">' + icon('bell') + (UI.unreadCount() ? '<span class="dot-badge" id="bellBadge">' + UI.unreadCount() + '</span>' : '') + '</button>' +
    '<button type="button" class="btn btn-ghost btn-icon" id="themeBtn" data-tip-pos="bottom"></button>' +
    '<button type="button" class="user-btn" id="userBtn" aria-haspopup="menu" aria-label="Menú de usuario"><span class="avatar avatar-user is-sm">' + esc(me.nombre.split(' ').map(function (w) { return w[0]; }).slice(0, 2).join('')) + '</span><span class="u-text"><span class="u-name">' + esc(me.nombre) + '</span><br><span class="u-role">' + esc(me.rol) + ' · ' + esc((sede.nombre || '').replace('Sede ', '')) + '</span></span></button></div>');
  var skip = el('a', { href: '#app', class: 'sr-only', id: 'skipLink' }, 'Saltar al contenido');
  doc.body.insertBefore(skip, doc.body.firstChild); doc.body.insertBefore(shell, app); main.appendChild(top); main.appendChild(app); shell.appendChild(side); shell.appendChild(scrim); shell.appendChild(main);
  app.classList.add('page'); app.setAttribute('tabindex', '-1');
  if (/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) UI.$('#kbdHint').textContent = '⌘ K';
  setTheme(doc.documentElement.getAttribute('data-theme') || 'light', true);
  /* eventos */
  function navOpen(b) { shell.dataset.navOpen = b ? 'true' : 'false'; UI.$('#navBtn').setAttribute('aria-expanded', b); if (b) lock(); else unlock(); if (b) { var e = { root: side, trap: true, close: function () { navOpen(false); } }; navOpen._e = e; stack.push(e); setTimeout(function () { var f = UI.$('.nav-item[aria-current="page"]', side) || UI.$('.nav-item', side); f && f.focus(); }, 30); } else if (navOpen._e) { var i = stack.indexOf(navOpen._e); if (i > -1) stack.splice(i, 1); navOpen._e = null; } }
  UI.$('#navBtn').addEventListener('click', function () { navOpen(true); }); UI.$('#navClose').addEventListener('click', function () { navOpen(false); }); scrim.addEventListener('click', function () { navOpen(false); });
  UI.$$('.nav-item', side).forEach(function (a) { a.addEventListener('click', function () { if (shell.dataset.navOpen === 'true') navOpen(false); }); });
  addEventListener('resize', function () { if (innerWidth >= 900 && shell.dataset.navOpen === 'true') navOpen(false); });
  UI.$('#collapseBtn').addEventListener('click', function () { var c = shell.dataset.collapsed !== 'true'; shell.dataset.collapsed = c ? 'true' : 'false'; store('arm.collapsed', c ? '1' : '0'); setTimeout(function () { maps.forEach(function (m) { m.invalidate(); }); charts.forEach(function (c) { c.chart.resize(); }); }, 260); });
  UI.$('#themeBtn').addEventListener('click', function () { setTheme(UI.theme() === 'dark' ? 'light' : 'dark'); });
  UI.$('#searchBtn').addEventListener('click', function () { UI.palette(); });
  UI.$('#bellBtn').addEventListener('click', openNotifs);
  if (UI.$('#huBtn')) UI.$('#huBtn').addEventListener('click', function () { openHU(page); });
  /* indicador de más contenido en la navegación lateral */
  (function () { var sn = UI.$('.sb-nav', side); function upd() { sn.dataset.moreDown = sn.scrollTop + sn.clientHeight < sn.scrollHeight - 4 ? 'true' : 'false'; sn.dataset.moreUp = sn.scrollTop > 4 ? 'true' : 'false'; } sn.addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); var c = UI.$('.nav-item[aria-current="page"]', sn); if (c) { var r = c.getBoundingClientRect(), b = sn.getBoundingClientRect(); if (r.bottom > b.bottom || r.top < b.top) sn.scrollTop = c.offsetTop - sn.clientHeight / 2; } upd(); setTimeout(upd, 300); if (document.fonts && document.fonts.ready) document.fonts.ready.then(upd); })();
  UI.$('#siteBtn').addEventListener('click', function (e) { var cur = UI.sede().id; UI.menu(e.currentTarget, [{ heading: 'Sede o bodega activa' }].concat(ARM.sedes.map(function (s) { return { label: s.nombre, icon: s.principal ? 'warehouse' : 'map-pin', checked: s.id === cur, onClick: function () { store('arm.sede', s.id); UI.$('#siteName').textContent = s.nombre; UI.toast('Vista cambiada a ' + s.nombre + '. En esta demo los datos no se filtran por sede.', 'info'); doc.dispatchEvent(new CustomEvent('armetales:sede', { detail: s })); } }; })), { align: 'start' }); });
  UI.$('#userBtn').addEventListener('click', function (e) { UI.menu(e.currentTarget, [{ html: '<div class="row nowrap gap-3">' + UI.avatar(me.nombre) + '<div><div class="strong">' + esc(me.nombre) + '</div><div class="t-12 muted">' + esc(me.correo || '') + '</div><div class="t-12 muted">' + esc(me.rol) + ' · ' + esc(sede.nombre) + '</div></div></div>' }, { sep: true },
    { label: 'Mi perfil', icon: 'user', onClick: function () { UI.toast('El perfil de usuario no está incluido en la demo.', 'info'); } }, { label: 'Atajos de teclado', icon: 'key', onClick: shortcuts }, { label: 'Alcance de la propuesta', icon: 'file-text', href: 'alcance.html' }, { sep: true },
    { label: 'Cerrar sesión', icon: 'log-out', danger: true, onClick: function () { UI.toast('Sesión cerrada.', 'success', { duration: 900 }); setTimeout(function () { location.href = 'index.html'; }, 500); } }], { align: 'end' }); });
  doc.addEventListener('keydown', function (e) { var k = e.key.toLowerCase(); if ((e.metaKey || e.ctrlKey) && k === 'k') { e.preventDefault(); UI.palette(); } else if (k === '/' && !e.metaKey && !e.ctrlKey && !/input|textarea|select/i.test((doc.activeElement || {}).tagName || '') && !(doc.activeElement || {}).isContentEditable) { e.preventDefault(); UI.palette(); } });
  UI.$('#skipLink').addEventListener('click', function (e) { e.preventDefault(); app.focus(); });
}
function shortcuts() { UI.modal({ title: 'Atajos de teclado', width: 440, body: UI.kv([['Buscar y navegar', '<span class="kbd">⌘ K</span> o <span class="kbd">Ctrl K</span>'], ['Abrir buscador', '<span class="kbd">/</span>'], ['Cerrar paneles y menús', '<span class="kbd">Esc</span>'], ['Moverse en listas', '<span class="kbd">↑</span> <span class="kbd">↓</span> <span class="kbd">Enter</span>']]), footer: [{ label: 'Entendido', kind: 'primary' }] }); }
function openNotifs() {
  var list = ARM.notificaciones || [], tone = { peligro: 'alert-circle', alerta: 'alert-triangle', exito: 'check-circle', info: 'info' };
  function body() { return list.map(function (n) { return '<a class="notif-item' + (n.leida ? '' : ' is-unread') + '" href="' + esc(n.destino || '#') + '" data-n="' + n.notifId + '"><span class="notif-ico ' + n.severidad + '">' + icon(tone[n.severidad] || 'info', 'icon-sm') + '</span><span class="grow"><span class="strong t-13">' + esc(n.titulo) + '</span><br><span class="t-13 muted">' + esc(n.texto) + '</span><br><span class="t-12 subtle">' + esc(fmt.relativo(n.fechaHora)) + ' · ' + esc(n.tipo) + '</span></span></a>'; }).join(''); }
  var d = UI.drawer({ title: 'Notificaciones', subtitle: UI.unreadCount() + ' sin leer', width: 440, body: body(), noPadding: true, footer: [{ label: 'Marcar todas como leídas', kind: 'secondary', keepOpen: true, onClick: function (a) { list.forEach(function (n) { n.leida = true; }); a.setBody(body()); a.el.querySelector('.ov-sub').textContent = '0 sin leer'; var b = UI.$('#bellBadge'); if (b) b.remove(); return false; } }, { label: 'Configurar reglas', kind: 'ghost', onClick: function () { location.href = 'notificaciones.html'; } }] });
  d.body.addEventListener('click', function (e) { var a = e.target.closest('[data-n]'); if (a) { var n = list.filter(function (x) { return x.notifId === a.dataset.n; })[0]; if (n) n.leida = true; } });
}

/* ---------- 12. paleta de comandos (⌘K) ---------- */
/* UI.palette() — abre la paleta. Convención de destino: pedidos.html?id=ES-… · clientes.html?id=CL… · vehiculos.html?placa=WNK%20482 · despachos.html?id=DSP-… */
UI.palette = function () {
  if (UI.$('.cmdk-overlay')) return; var sel = 0, items = [];
  var root = el('div', { class: 'overlay cmdk-overlay' }), box = el('div', { class: 'cmdk', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Buscar y navegar' });
  box.innerHTML = '<div class="cmdk-input">' + icon('search') + '<input type="text" id="cmdkIn" placeholder="Busca una pantalla, un pedido, un cliente o una placa…" autocomplete="off" role="combobox" aria-expanded="true" aria-controls="cmdkList" aria-autocomplete="list"><span class="kbd">Esc</span></div><div class="cmdk-list" id="cmdkList" role="listbox"></div><div class="cmdk-foot"><span><span class="kbd">↑</span> <span class="kbd">↓</span> navegar</span><span><span class="kbd">Enter</span> abrir</span></div>';
  root.appendChild(box); var entry = mount(root, { initialFocus: '#cmdkIn' }), inp = UI.$('#cmdkIn', box), list = UI.$('#cmdkList', box);
  function build(q) {
    var n = UI.norm(q), out = [], pages = [];
    NAV.forEach(function (g) { g.items.forEach(function (i) { pages.push({ g: 'Pantallas', t: i.label, s: g.g, ic: i.icon, href: i.href }); }); }); pages.push({ g: 'Pantallas', t: 'Alcance de la propuesta', s: 'Documento', ic: 'file-text', href: 'alcance.html' });
    out = out.concat(pages.filter(function (p) { return !n || UI.norm(p.t + ' ' + p.s).indexOf(n) > -1; }).slice(0, n ? 6 : 9));
    if (n.length >= 2) {
      out = out.concat((ARM.pedidos || []).filter(function (p) { return UI.norm(p.pedidoId + ' ' + p.cliente).indexOf(n) > -1; }).slice(0, 5).map(function (p) { return { g: 'Pedidos', t: p.pedidoId + ' · ' + p.cliente, s: p.estado, ic: 'package', href: 'pedidos.html?id=' + encodeURIComponent(p.pedidoId) }; }));
      out = out.concat((ARM.clientes || []).filter(function (c) { return UI.norm(c.razonSocial + ' ' + c.nit + ' ' + c.clienteIdSAP + ' ' + c.municipio).indexOf(n) > -1; }).slice(0, 5).map(function (c) { return { g: 'Clientes', t: c.razonSocial, s: c.municipio, ic: 'users', href: 'clientes.html?id=' + encodeURIComponent(c.clienteIdSAP) }; }));
      out = out.concat((ARM.vehiculos || []).filter(function (v) { return UI.norm(v.placa + ' ' + v.marca + ' ' + v.tipo).indexOf(n) > -1; }).slice(0, 4).map(function (v) { return { g: 'Vehículos', t: v.placa + ' · ' + v.tipo + ' ' + v.marca, s: v.estado, ic: 'truck', href: 'vehiculos.html?placa=' + encodeURIComponent(v.placa) }; }));
      out = out.concat((ARM.despachos || []).filter(function (d) { return UI.norm(d.despachoId).indexOf(n) > -1; }).slice(0, 3).map(function (d) { return { g: 'Despachos', t: d.despachoId, s: d.estado + ' · ' + d.vehiculoId, ic: 'clipboard-list', href: 'despachos.html?id=' + encodeURIComponent(d.despachoId) }; }));
    }
    items = out; sel = 0; draw();
  }
  function draw() { if (!items.length) { list.innerHTML = '<div class="cmdk-empty">Sin resultados para «' + esc(inp.value) + '».</div>'; return; } var last = '', h = ''; items.forEach(function (i, k) { if (i.g !== last) { h += '<div class="cmdk-group">' + i.g + '</div>'; last = i.g; } h += '<div class="cmdk-item" role="option" id="ck' + k + '" data-k="' + k + '" aria-selected="' + (k === sel) + '">' + icon(i.ic) + '<span class="truncate">' + esc(i.t) + '</span><span class="ci-sub">' + esc(i.s) + '</span></div>'; }); list.innerHTML = h; inp.setAttribute('aria-activedescendant', 'ck' + sel); var s = UI.$('[aria-selected="true"]', list); if (s) s.scrollIntoView({ block: 'nearest' }); }
  function go(k) { var i = items[k]; if (i) { entry.close(); location.href = i.href; } }
  inp.addEventListener('input', function () { build(inp.value); });
  inp.addEventListener('keydown', function (e) { if (e.key === 'ArrowDown') { e.preventDefault(); sel = (sel + 1) % items.length; draw(); } else if (e.key === 'ArrowUp') { e.preventDefault(); sel = (sel - 1 + items.length) % items.length; draw(); } else if (e.key === 'Enter') { e.preventDefault(); go(sel); } });
  list.addEventListener('click', function (e) { var i = e.target.closest('[data-k]'); if (i) go(+i.dataset.k); }); list.addEventListener('mousemove', function (e) { var i = e.target.closest('[data-k]'); if (i && +i.dataset.k !== sel) { sel = +i.dataset.k; UI.$$('.cmdk-item', list).forEach(function (x) { x.setAttribute('aria-selected', x === i); }); } });
  build('');
};

/* ---------- 13. arranque ---------- */
(function init() {
  var t = store('arm.theme'); if (t === 'dark' || t === 'light') doc.documentElement.setAttribute('data-theme', t);
  function go() { buildShell(); isReady = true; readyCbs.forEach(function (f) { try { f(); } catch (e) { console.error(e); } }); readyCbs = []; var id = doc.body.dataset.page; if (id && !doc.title.match(/Armetales/)) doc.title += ' · Armetales'; }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', go); else go();
})();
})();

/* Pestañas con desplazamiento horizontal: marca si hay más contenido a los lados (ver .tabs[data-more] en app.css) */
(function () {
  function mark(t) { var max = t.scrollWidth - t.clientWidth, x = t.scrollLeft, a = x > 4, b = x < max - 4; if (max <= 4) t.removeAttribute('data-more'); else t.setAttribute('data-more', a && b ? 'both' : a ? 'start' : b ? 'end' : ''); }
  function scan() { var l = document.querySelectorAll('.tabs'); for (var i = 0; i < l.length; i++) mark(l[i]); }
  document.addEventListener('scroll', function (e) { var t = e.target; if (t && t.classList && t.classList.contains('tabs')) mark(t); }, true);
  window.addEventListener('resize', scan); document.addEventListener('click', function () { setTimeout(scan, 80); }, true);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(scan, 300); }); else setTimeout(scan, 300);
  window.addEventListener('load', function () { setTimeout(scan, 600); });
})();
