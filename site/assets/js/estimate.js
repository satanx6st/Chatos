/* Chato's Quick Estimate
 * Everything Jose may want to change lives in CONFIG below.
 *
 * How prices work (set by Jose, Nov 2026):
 *  - In town, RVs are priced by the hour. The rate depends on the RV length.
 *    The clock runs from hookup to unhook, so time at pickup and drop-off counts.
 *  - In town, cars, classics, golf carts, motorcycles and boats have a $150 minimum.
 *  - Long distance is priced per mile on the exact locations, condition and weather:
 *    the site never shows a number for it. The customer texts Jose instead.
 *  - The low number is the fair price if everything goes smoothly.
 *    The high number adds the extra time that usually shows up (slow hookup, traffic, tight spots).
 */
(function () {
  'use strict';

  var CONFIG = {
    base: { lat: 33.119837, lon: -117.049181, label: "Jose's base in Escondido" },
    email: 'chatosautos@yahoo.com',
    phone: '+17605321964',

    // "In town" = San Diego County plus the Temecula and Murrieta area, and no more than 90 loaded miles.
    // Boxes are [south lat, north lat, west lon, east lon].
    inTownBoxes: [[32.53, 33.51, -117.60, -116.08], [33.43, 33.62, -117.32, -117.00]],
    inTownMaxMiles: 90,

    rv: {
      tiers: [                                   // hourly rate by RV length
        { id: 't30', label: 'Up to 30 ft', rate: 320 },
        { id: 't36', label: '31 to 36 ft', rate: 360 },
        { id: 't40', label: '37 to 40 ft', rate: 380 },
        { id: 't46', label: '41 to 46 ft', rate: 420 }
      ],
      minHours: 1,           // minimum charge in San Diego = 1 hour at the RV's rate
      hookupHours: 0.5,      // hooking up at pickup
      unhookHours: 0.25,     // unhooking and leveling at drop-off
      towSlowdown: 1.25,     // a loaded RV drives slower than car traffic
      roundTo: 0.5,          // hours are rounded up to the next half hour
      extraHookup: 0.5,      // high number only: pickup takes longer than planned
      extraUnhook: 0.25,     // high number only: drop-off takes longer than planned
      extraTraffic: 0.25     // high number only: +25% on the drive for traffic
    },
    vehicle: {               // cars, classics, golf carts and motos, boats (in town)
      minimum: { car: 150, classic: 150, small: 150, boat: 150 },
      includedMiles: 10,     // loaded miles covered by the minimum
      perMile: { car: 4, classic: 4.5, small: 3.5, boat: 4.5 },
      extraPct: 0.3,         // high number: +30% for extra time
      roundTo: 10
    },
    multiVehicle: { addPct: 0.6, max: 3 },        // each extra vehicle on the same trip adds 60%. More than 3 = custom quote
    extraStop: { hours: 0.25, fee: 25 },          // each extra stop on the way
    // Things that add time. RVs: hours. Other vehicles: dollars.
    // Half goes into the low number, all of it into the high number.
    flags: {
      backyard: { label: 'Backyard or side-yard pickup', h: 1, fee: 100 },
      steep:    { label: 'Steep driveway', h: 0.5, fee: 50 },
      tight:    { label: 'Tight gate or tight space', h: 0.5, fee: 50 },
      soft:     { label: 'Gravel, dirt or soft ground', h: 0.25, fee: 25 },
      lowclear: { label: 'Low trees or wires', h: 0.25, fee: 0 },
      setplace: { label: 'Back it into the spot at drop-off', h: 0.25, fee: 25 },
      nonrun:   { label: "Doesn't run or drive", h: 0.5, fee: 50 },
      flats:    { label: 'Flat or old tires', h: 0.5, fee: 50 },
      nobrakes: { label: "Brakes or lights don't work", h: 0.25, fee: 25 },
      jack:     { label: "Landing gear or jack doesn't work", h: 0.5, fee: 50 },
      lowride:  { label: 'Lowered or low clearance', h: 0, fee: 25 },
      showcar:  { label: 'Show car, extra care', h: 0, fee: 25 }
    },
    perDay: 8,               // estimates one browser can make in 24 hours
    validDays: 7
  };

  var CATS = {
    rv: { label: 'RV & trailers', icon: 'M3 15V7a2 2 0 0 1 2-2h11l4 4v6h-2a2 2 0 1 1-4 0H9a2 2 0 1 1-4 0zM6 8v3h4V8zm6 0v3h4V8z' },
    car: { label: 'Car & truck', icon: 'M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11a2 2 0 0 1 2 2v3h-2a2 2 0 1 1-4 0H9a2 2 0 1 1-4 0H3v-3a2 2 0 0 1 2-2zm2 0h10l-1.2-3.2a.5.5 0 0 0-.5-.3H8.7a.5.5 0 0 0-.5.3z' },
    classic: { label: 'Classic & luxury', icon: 'M12 2l2.6 6.3 6.4.4-5 4.1 1.6 6.4L12 15.8 6.4 19.2 8 12.8 3 8.7l6.4-.4z' },
    small: { label: 'Golf cart, moto & ATV', icon: 'M5 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm14 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM9 13h4l2-5h3M11 8h3' },
    boat: { label: 'Boat on trailer', icon: 'M3 14h18l-3 5H6zM6 13V7l7-3v9M13 6l5 7' }
  };
  var CAT_INFO = {
    rv: 'Fifth wheels, travel trailers, toy haulers, motorhomes',
    car: 'Daily drivers, SUVs, pickups and EVs',
    classic: 'Classics, exotics and show cars',
    small: 'Golf carts, motorcycles, ATVs and UTVs',
    boat: 'A boat on its own trailer'
  };
  var RV_TYPES = [
    { id: 'fifth', label: 'Fifth wheel', hitch: 'Fifth wheel king pin' },
    { id: 'travel', label: 'Travel trailer', hitch: 'Bumper pull, ball hitch' },
    { id: 'toy', label: 'Toy hauler', hitch: 'Fifth wheel or bumper pull' },
    { id: 'goose', label: 'Gooseneck', hitch: 'Gooseneck ball' },
    { id: 'park', label: 'Park model or tiny home', hitch: 'Jose confirms the method', review: true },
    { id: 'motor', label: 'Motorhome', hitch: 'Jose confirms the method', review: true }
  ];
  var SMALL_TYPES = ['Golf cart', 'Motorcycle', 'ATV or UTV', 'Dirt bike', 'Jet ski', 'Other'];
  var SPECIALTY = [
    { id: 'classic', label: 'Classic or vintage' }, { id: 'exotic', label: 'Exotic or luxury' },
    { id: 'lowride', label: 'Lowered or low clearance', add: 'lowride' }, { id: 'showcar', label: 'Show car', add: 'showcar' }
  ];
  var BOAT_LENGTHS = ['Up to 20 ft', '21 to 26 ft', 'Over 26 ft'];
  var CAR_MAKES = ['Acura','Alfa Romeo','AMC','Aston Martin','Audi','Austin-Healey','Bentley','BMW','Buick','Cadillac','Chevrolet','Chrysler','Datsun','DeLorean','Dodge','Ferrari','Fiat','Ford','Genesis','GMC','Honda','Hummer','Hyundai','INEOS','Infiniti','Jaguar','Jeep','Kia','Lamborghini','Land Rover','Lexus','Lincoln','Lotus','Lucid','Maserati','Mazda','McLaren','Mercedes-Benz','Mercury','MG','MINI','Mitsubishi','Nissan','Oldsmobile','Plymouth','Polestar','Pontiac','Porsche','Ram','Rivian','Rolls-Royce','Shelby','Studebaker','Subaru','Tesla','Toyota','Triumph','Volkswagen','Volvo','Other'];
  var LOC_TYPES = ['Home driveway or street', 'Backyard or side yard', 'Storage lot', 'RV park or campground', 'Dealer or auction', 'Port', 'Roadside'];
  var ACCESS = [['steep', 'Steep driveway'], ['tight', 'Tight gate or space'], ['soft', 'Gravel or soft ground'], ['lowclear', 'Low trees or wires']];

  // ---------- state ----------
  var FRESH = {
    cat: null, rvType: '', rvLen: '', rvModel: '', stops: 0, year: '', make: '', model: '',
    boatLen: '', smallType: 'Golf cart', qty: 1, qtyMore: false, others: '', specialty: {},
    pickup: null, drop: null, pickupType: LOC_TYPES[0], dropType: LOC_TYPES[0],
    access: { pickup: {}, drop: {} }, cond: {}, setplace: false, timing: 'Flexible', date: '',
    first: '', last: '', tel: '', notes: '', step: 0
  };
  var S = JSON.parse(JSON.stringify(FRESH));
  S.route = null;
  var STEPS = ['Vehicle', 'Pickup', 'Drop-off', 'Your info', 'Estimate'];
  var KEY = 'chatos-estimate-v2', LOG = 'chatos-estimate-log';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var app = $('#estimator');
  if (!app) return;
  var panel = $('.est-body', app), tabs = $('.est-steps', app), pills = $('.est-cats', app);
  var mbar = document.querySelector('.est-mbar .btn');
  var sumEl = $('#est-summary'), rangeEls = document.querySelectorAll('[data-range]');
  var track = function (ev, p) { window.dataLayer = window.dataLayer || []; window.dataLayer.push(Object.assign({ event: ev }, p || {})); if (window.gtag) window.gtag('event', ev, p || {}); };
  var started = false, showErr = false;

  function h(tag, attrs, kids) {
    var el = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (attrs[k] === null || attrs[k] === undefined || attrs[k] === false) return;
      if (k === 'class') el.className = attrs[k];
      else if (k === 'text') el.textContent = attrs[k];
      else if (k === 'html') el.innerHTML = attrs[k];
      else if (k.indexOf('on') === 0) el.addEventListener(k.slice(2), attrs[k]);
      else el.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c) el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return el;
  }
  function icon(path) { return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + path + '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/></svg>'; }
  function money(n) { return '$' + Math.round(n).toLocaleString('en-US'); }
  function ascii(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\x20-\x7E\n]/g, ''); }
  function escapeHtml(s) { return String(s || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  // fetch with a time limit, so a slow free service never freezes the estimate
  function fetchT(url, ms, signal) {
    var ctrl = window.AbortController ? new AbortController() : null, t;
    if (ctrl) { t = setTimeout(function () { ctrl.abort(); }, ms || 8000); if (signal) signal.addEventListener('abort', function () { ctrl.abort(); }); }
    return fetch(url, ctrl ? { signal: ctrl.signal } : {}).then(function (r) { clearTimeout(t); return r; }, function (e) { clearTimeout(t); throw e; });
  }

  // ---------- keep progress if the page reloads ----------
  function save() {
    try { var c = {}; Object.keys(FRESH).forEach(function (k) { c[k] = S[k]; }); sessionStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {}
  }
  function restore() {
    try {
      var c = JSON.parse(sessionStorage.getItem(KEY) || 'null'); if (!c || !c.cat) return;
      Object.keys(FRESH).forEach(function (k) { if (c[k] !== undefined) S[k] = c[k]; });
      if (S.step > maxStep()) S.step = maxStep();
      started = true;
    } catch (e) {}
  }
  function startOver() { try { sessionStorage.removeItem(KEY); } catch (e) {} location.reload(); }

  // ---------- category pills ----------
  function chooseCat(k) {
    var keep = { pickup: S.pickup, drop: S.drop, pickupType: S.pickupType, dropType: S.dropType, access: S.access, first: S.first, last: S.last, tel: S.tel, route: S.route };
    S = Object.assign(JSON.parse(JSON.stringify(FRESH)), keep, { cat: k });
    subTab = 'year'; showErr = false;
    if (!started) { started = true; track('estimate_started', { vehicle: k }); }
    drawPills(); go(0);
  }
  function drawPills() {
    pills.innerHTML = '';
    pills.hidden = !S.cat;
    if (!S.cat) return;
    Object.keys(CATS).forEach(function (k) {
      pills.appendChild(h('button', { type: 'button', class: 'pill' + (S.cat === k ? ' on' : ''), 'aria-pressed': S.cat === k, onclick: function () { if (S.cat !== k) chooseCat(k); }, html: '<span>' + CATS[k].label + '</span>' + icon(CATS[k].icon) }));
    });
  }
  function drawTabs() {
    tabs.innerHTML = '';
    var top = maxStep();
    STEPS.forEach(function (n, i) {
      tabs.appendChild(h('button', { type: 'button', class: 'tab' + (S.step === i ? ' on' : '') + (i < S.step ? ' done' : ''), 'aria-current': S.step === i ? 'step' : 'false', disabled: i > top ? 'disabled' : null, onclick: function () { if (i <= maxStep()) go(i); }, html: '<small>Step ' + (i + 1) + '</small>' + n }));
    });
  }
  function maxStep() { if (vehicleMissing()) return 0; if (!S.pickup) return 1; if (!S.drop) return 2; if (infoMissing()) return 3; return 4; }

  // ---------- searchable list (AutoZone style) ----------
  function picker(title, items, value, onPick, opts) {
    opts = opts || {};
    var wrap = h('div', { class: 'picker' });
    var input = h('input', { type: 'search', placeholder: opts.placeholder || 'Type to narrow down your search', 'aria-label': title });
    var list = h('ul', { class: 'plist', role: 'listbox', 'aria-label': title });
    function render() {
      var q = input.value.trim().toLowerCase(); list.innerHTML = '';
      var shown = items.filter(function (it) { return !q || String(it).toLowerCase().indexOf(q) > -1; });
      shown.slice(0, 120).forEach(function (it) {
        list.appendChild(h('li', {}, [h('button', { type: 'button', role: 'option', 'aria-selected': it == value, class: it == value ? 'on' : '', text: it, onclick: function () { onPick(it); } })]));
      });
      if (opts.free && q) list.appendChild(h('li', {}, [h('button', { type: 'button', class: 'use', text: 'Use "' + input.value.trim() + '"', onclick: function () { onPick(input.value.trim()); } })]));
      if (!shown.length && !q) list.appendChild(h('li', { class: 'empty', text: opts.free ? 'Type it in the box above, then tap Use.' : 'Nothing to show.' }));
      else if (!shown.length && !opts.free) list.appendChild(h('li', { class: 'empty', text: 'No match. Try another spelling.' }));
    }
    input.addEventListener('input', render);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); var q = input.value.trim(); var m = items.filter(function (it) { return String(it).toLowerCase().indexOf(q.toLowerCase()) > -1; }); if (m.length) onPick(m[0]); else if (opts.free && q) onPick(q); } });
    render();
    wrap.appendChild(h('div', { class: 'psearch' }, [input])); wrap.appendChild(list);
    return wrap;
  }
  var YEARS = (function () { var a = [], y = new Date().getFullYear() + 1; for (; y >= 1930; y--) a.push(String(y)); return a; })();

  function qtyField(noun) {
    var box = h('div', { class: 'qty' });
    box.appendChild(h('h3', { text: 'How many ' + noun + ' on this trip?' }));
    var cur = S.qtyMore ? 'More than 3' : String(S.qty);
    box.appendChild(chips(['1', '2', '3', 'More than 3'], cur, function (v) {
      S.qtyMore = v === 'More than 3'; S.qty = S.qtyMore ? 4 : parseInt(v, 10); render();
    }));
    if (S.qtyMore) box.appendChild(h('p', { class: 'custom-note', html: '<b>More than 3 ' + noun + ' needs a custom quote.</b> Finish the steps and send it to Jose. He will price the whole trip for you.' }));
    if (S.qty > 1 || S.qtyMore) box.appendChild(h('label', { class: 'field' }, [h('span', { text: 'The other ' + noun + ' (year, make, model)' }), h('textarea', { rows: 2, maxlength: 300, placeholder: noun === 'vehicles' ? 'e.g. 2019 Honda Civic, 2015 Ford F-150' : 'e.g. 2 Club Car golf carts', oninput: function (e) { S.others = e.target.value; save(); } }, [S.others])]));
    return box;
  }

  // ---------- step 1: vehicle ----------
  var subTab = 'year';
  function vehicleMissing() {
    if (!S.cat) return 'Pick what you are moving';
    if (S.cat === 'rv') { if (!S.rvType) return 'Pick the kind of RV'; if (!S.rvLen) return 'Pick the length of the RV'; return ''; }
    if (S.cat === 'small') return S.smallType ? '' : 'Pick what you are moving';
    if (S.cat === 'boat') return S.boatLen ? '' : 'Pick the length of the boat';
    if (!S.year) return 'Pick the year';
    if (!S.make) return 'Pick the make';
    if (!S.model) return 'Pick the model';
    return '';
  }
  function stepVehicle() {
    var f = document.createDocumentFragment();
    if (!S.cat) {
      f.appendChild(h('h3', { text: 'What are you moving?' }));
      var tg = h('div', { class: 'type-grid' });
      Object.keys(CATS).forEach(function (k) {
        tg.appendChild(h('button', { type: 'button', class: 'type-card', onclick: function () { chooseCat(k); }, html: icon(CATS[k].icon) + '<b>' + CATS[k].label + '</b><span>' + CAT_INFO[k] + '</span>' }));
      });
      f.appendChild(tg);
      f.appendChild(h('p', { class: 'hint', text: 'Tap one to start. It takes about a minute.' }));
      return f;
    }
    if (S.cat === 'rv') {
      f.appendChild(h('h3', { text: 'What kind of RV?' }));
      var g = h('div', { class: 'cards' });
      RV_TYPES.forEach(function (t) {
        g.appendChild(h('button', { type: 'button', class: 'card' + (S.rvType === t.id ? ' on' : ''), 'aria-pressed': S.rvType === t.id, onclick: function () { S.rvType = t.id; render(); }, html: '<b>' + t.label + '</b><span>' + t.hitch + '</span>' }));
      });
      f.appendChild(g);
      f.appendChild(h('h3', { text: 'How long is it?' }));
      var lg = h('div', { class: 'cards len' });
      CONFIG.rv.tiers.concat([{ id: 'over', label: 'Over 46 ft' }]).forEach(function (t) {
        lg.appendChild(h('button', { type: 'button', class: 'card' + (S.rvLen === t.id ? ' on' : ''), 'aria-pressed': S.rvLen === t.id, onclick: function () { S.rvLen = t.id; render(); }, html: '<b>' + t.label + '</b>' }));
      });
      f.appendChild(lg);
      f.appendChild(h('p', { class: 'hint', text: 'Measure from the hitch to the back bumper. Not sure? Pick the closest one. The exact length can change the price a little.' }));
      f.appendChild(h('label', { class: 'field' }, [h('span', { text: 'Year, brand and model (optional)' }), h('input', { type: 'text', maxlength: 80, value: S.rvModel, placeholder: 'e.g. 2019 Grand Design Reflection', oninput: function (e) { S.rvModel = e.target.value; save(); } })]));
    } else if (S.cat === 'small') {
      f.appendChild(h('h3', { text: 'What are we moving?' }));
      f.appendChild(chips(SMALL_TYPES, S.smallType, function (v) { S.smallType = v; render(); }));
      f.appendChild(h('label', { class: 'field' }, [h('span', { text: 'Make and model (optional)' }), h('input', { type: 'text', maxlength: 80, value: S.model, placeholder: 'e.g. Club Car Onward, Honda Rancher', oninput: function (e) { S.model = e.target.value; save(); } })]));
      f.appendChild(qtyField('units'));
    } else if (S.cat === 'boat') {
      f.appendChild(h('h3', { text: 'How long is the boat?' }));
      f.appendChild(chips(BOAT_LENGTHS, S.boatLen, function (v) { S.boatLen = v; render(); }));
      f.appendChild(h('label', { class: 'field' }, [h('span', { text: 'Make and model (optional)' }), h('input', { type: 'text', maxlength: 80, value: S.model, placeholder: 'e.g. Bayliner 195', oninput: function (e) { S.model = e.target.value; save(); } })]));
    } else {
      f.appendChild(yearMakeModel());
      if (S.cat === 'classic') {
        f.appendChild(h('h3', { text: 'Anything special about it? (optional)' }));
        var c = h('div', { class: 'chips' });
        SPECIALTY.forEach(function (sp) {
          c.appendChild(h('button', { type: 'button', class: 'chip' + (S.specialty[sp.id] ? ' on' : ''), 'aria-pressed': !!S.specialty[sp.id], text: sp.label, onclick: function () { S.specialty[sp.id] = !S.specialty[sp.id]; render(); } }));
        });
        f.appendChild(c);
      }
      f.appendChild(qtyField('vehicles'));
    }
    f.appendChild(nav(vehicleMissing(), 'Next: pickup', 1));
    return f;
  }
  function yearMakeModel() {
    var box = h('div', { class: 'ymm' });
    box.appendChild(h('h3', { text: S.cat === 'classic' ? 'Your classic' : 'Your vehicle' }));
    if (subTab === 'done' && S.year && S.make && S.model) {
      box.appendChild(h('div', { class: 'confirm', id: 'ymm-confirm' }, [
        h('div', { class: 'confirm-check', 'aria-hidden': 'true', html: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>' }),
        h('div', { class: 'confirm-text' }, [h('small', { text: 'Your vehicle' }), h('b', { text: [S.year, S.make, S.model].join(' ') })]),
        h('button', { type: 'button', class: 'linkbtn', text: 'Change', onclick: function () { subTab = 'year'; render(); } })
      ]));
      return box;
    }
    var parts = [['year', 'Year', S.year], ['make', 'Make', S.make], ['model', 'Model', S.model]];
    var bar = h('div', { class: 'subtabs', role: 'tablist' });
    parts.forEach(function (p, i) {
      var can = i === 0 || (i === 1 && S.year) || (i === 2 && S.year && S.make);
      bar.appendChild(h('button', { type: 'button', role: 'tab', class: subTab === p[0] ? 'on' : '', 'aria-selected': subTab === p[0], disabled: can ? null : 'disabled', onclick: function () { subTab = p[0]; render(); }, html: '<small>' + (i + 1) + '. ' + p[1] + '</small><b>' + (p[2] || 'Pick') + '</b>' }));
    });
    box.appendChild(bar);
    if (subTab === 'year') box.appendChild(picker('Year', YEARS, S.year, function (v) { S.year = v; subTab = 'make'; render(); }, { placeholder: 'Type the year, like 1967' }));
    else if (subTab === 'make') box.appendChild(picker('Make', CAR_MAKES, S.make, function (v) { S.make = v; S.model = ''; subTab = 'model'; render(); }, { free: true, placeholder: 'Type the make, like Ford' }));
    else {
      var holder = h('div', {}, [h('p', { class: 'loading', text: 'Loading models' })]);
      box.appendChild(holder);
      loadModels(S.make, S.year).then(function (models) {
        holder.innerHTML = '';
        holder.appendChild(picker('Model', models, S.model, function (v) {
          S.model = v; subTab = 'done'; render();
          var c = document.getElementById('ymm-confirm'); if (c && c.scrollIntoView) c.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, { free: true, placeholder: 'Type the model, like Mustang' }));
      });
    }
    return box;
  }
  var modelCache = {};
  function loadModels(make, year) {
    if (!make || make === 'Other') return Promise.resolve([]);
    var key = make + '|' + year;
    if (modelCache[key]) return Promise.resolve(modelCache[key]);
    var base = 'https://vpic.nhtsa.dot.gov/api/vehicles/';
    var u1 = base + 'GetModelsForMakeYear/make/' + encodeURIComponent(make) + (year ? '/modelyear/' + year : '') + '?format=json';
    var u2 = base + 'GetModelsForMake/' + encodeURIComponent(make) + '?format=json';
    var pick = function (j) { return (j.Results || []).map(function (r) { return r.Model_Name; }).filter(function (v, i, a) { return v && a.indexOf(v) === i; }).sort(); };
    return fetchT(u1, 8000).then(function (r) { return r.json(); }).then(function (j) {
      var m = pick(j); if (m.length) return m;
      return fetchT(u2, 8000).then(function (r) { return r.json(); }).then(pick);
    }).catch(function () { return []; }).then(function (m) { if (m.length) modelCache[key] = m; return m; });
  }

  // ---------- step 2/3: places ----------
  function stepPlace(which) {
    var f = document.createDocumentFragment();
    var isP = which === 'pickup';
    f.appendChild(h('h3', { text: isP ? 'Where is it now?' : 'Where is it going?' }));
    f.appendChild(addressField(which));
    f.appendChild(h('h3', { text: 'What kind of place is it?' }));
    f.appendChild(chips(LOC_TYPES, isP ? S.pickupType : S.dropType, function (v) { if (isP) S.pickupType = v; else S.dropType = v; render(); }));
    f.appendChild(h('h3', { text: 'Anything tricky to get in or out? (optional)' }));
    var c = h('div', { class: 'chips' });
    ACCESS.forEach(function (a) {
      var on = !!S.access[which][a[0]];
      c.appendChild(h('button', { type: 'button', class: 'chip' + (on ? ' on' : ''), 'aria-pressed': on, text: a[1], onclick: function () { S.access[which][a[0]] = !on; render(); } }));
    });
    f.appendChild(c);
    if (!isP && S.cat !== 'small') f.appendChild(toggle('Back it into the spot or set it in place', S.setplace, function (v) { S.setplace = v; save(); }));
    var miss = isP ? (S.pickup ? '' : 'Search the pickup address and tap it in the list') : (S.drop ? '' : 'Search the drop-off address and tap it in the list');
    f.appendChild(nav(miss, isP ? 'Next: drop-off' : 'Next: your info', isP ? 2 : 3));
    return f;
  }
  function addressField(which) {
    var cur = S[which];
    var wrap = h('div', { class: 'addr' });
    var input = h('input', { type: 'search', autocomplete: 'off', placeholder: 'Type the address or city', value: cur ? cur.label : '', 'aria-label': which === 'pickup' ? 'Pickup address' : 'Drop-off address' });
    var list = h('ul', { class: 'sugg', role: 'listbox' });
    var timer, ctrl;
    var items = [];
    function show(list_, arr) {
      list_.innerHTML = ''; items = arr;
      arr.forEach(function (it) {
        list_.appendChild(h('li', {}, [h('button', { type: 'button', html: '<b>' + escapeHtml(it.main) + '</b><span>' + escapeHtml(it.sub) + '</span>', onclick: function () { choose(it); } })]));
      });
      if (!arr.length) list_.appendChild(h('li', { class: 'empty', text: 'No places found. Try the street number, street and city, like 1572 Bear Valley Pkwy, Escondido.' }));
    }
    function choose(it) {
      list.innerHTML = '<li class="loading">Finding it on the map</li>'; input.value = it.main + (it.sub ? ', ' + it.sub : '');
      it.get().then(function (pl) { if (pl) setPlace(which, pl); else show(list, []); });
    }
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); if (items[0]) choose(items[0]); } });
    input.addEventListener('input', function () {
      clearTimeout(timer);
      var q = input.value.trim();
      if (q.length < 3) { list.innerHTML = ''; items = []; return; }
      timer = setTimeout(function () {
        if (ctrl && ctrl.abort) ctrl.abort();
        ctrl = window.AbortController ? new AbortController() : null;
        searchPlaces(q, ctrl && ctrl.signal).then(function (arr) { show(list, arr); }).catch(function () {});
      }, 260);
    });
    wrap.appendChild(h('div', { class: 'addr-row' }, [input, h('button', { type: 'button', class: 'locate', title: 'Use my location', 'aria-label': 'Use my location', html: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" stroke-width="2"/></svg>', onclick: function () { locate(which); } })]));
    wrap.appendChild(list);
    if (cur) wrap.appendChild(h('p', { class: 'picked', html: '<b>' + (which === 'pickup' ? 'Pickup' : 'Drop-off') + ':</b> ' + escapeHtml(cur.label) }));
    return wrap;
  }
  function placeLabel(p) {
    var street = [p.housenumber, p.street].filter(Boolean).join(' ');
    var main = p.name && p.name !== street ? p.name : (street || p.city || p.county || '');
    var sub = [p.name && street && p.name !== street ? street : '', p.city, p.state, p.postcode].filter(Boolean).filter(function (v, i, a) { return a.indexOf(v) === i && v !== main; }).join(', ');
    return { main: main, sub: sub };
  }
  // Address search: Esri World Geocoder (best US street-address coverage, no key) + Photon/OpenStreetMap for places
  var ESRI = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/';
  function searchPlaces(q, signal) {
    var esri = fetchT(ESRI + 'suggest?f=json&countryCode=USA,MEX&maxSuggestions=6&location=-117.05,33.12&text=' + encodeURIComponent(q), 7000, signal)
      .then(function (r) { return r.json(); }).then(function (j) {
        return (j.suggestions || []).filter(function (x) { return !x.isCollection; }).map(function (x) {
          var parts = x.text.replace(/, USA$/, '').split(', ');
          return { main: parts[0], sub: parts.slice(1).join(', '), get: function () {
            return fetchT(ESRI + 'findAddressCandidates?f=json&maxLocations=1&magicKey=' + encodeURIComponent(x.magicKey) + '&SingleLine=' + encodeURIComponent(x.text), 8000)
              .then(function (r) { return r.json(); }).then(function (k) {
                var c = k.candidates && k.candidates[0]; if (!c) return null;
                return { label: (c.address || x.text).replace(/, USA$/, ''), lat: c.location.y, lon: c.location.x };
              }).catch(function () { return null; });
          } };
        });
      }).catch(function () { return []; });
    var photon = fetchT('https://photon.komoot.io/api/?limit=4&lang=en&lat=33.1&lon=-117.1&q=' + encodeURIComponent(q), 7000, signal)
      .then(function (r) { return r.json(); }).then(function (j) {
        return (j.features || []).map(function (ft) {
          var lab = placeLabel(ft.properties);
          return { main: lab.main, sub: lab.sub, get: function () { return Promise.resolve({ label: lab.main + (lab.sub ? ', ' + lab.sub : ''), lat: ft.geometry.coordinates[1], lon: ft.geometry.coordinates[0] }); } };
        });
      }).catch(function () { return []; });
    return Promise.all([esri, photon]).then(function (r) {
      var out = r[0].slice(0, 6), seen = out.map(function (x) { return x.main.toLowerCase(); });
      r[1].forEach(function (x) { if (x.main && seen.indexOf(x.main.toLowerCase()) < 0 && out.length < 8) { out.push(x); seen.push(x.main.toLowerCase()); } });
      return out;
    });
  }
  function locate(which) {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(function (pos) {
      var lat = pos.coords.latitude, lon = pos.coords.longitude;
      fetchT(ESRI + 'reverseGeocode?f=json&location=' + lon + ',' + lat, 8000).then(function (r) { return r.json(); }).then(function (j) {
        var a = j.address || {};
        setPlace(which, { label: a.LongLabel ? a.LongLabel.replace(/, USA$/, '') : (a.Match_addr || 'My location'), lat: lat, lon: lon });
      }).catch(function () { setPlace(which, { label: 'My location', lat: lat, lon: lon }); });
    });
  }
  function setPlace(which, place) { S[which] = place; S.route = null; render(); routeNow(); }

  // ---------- step 4: your info ----------
  var LETTERS = 'A-Za-zÀ-ÖØ-öø-ÿ';
  var NAME_RE = new RegExp('^[' + LETTERS + "][" + LETTERS + " '.-]*$");
  var JUNK = ['test', 'testing', 'tester', 'asdf', 'asdfg', 'asd', 'qwe', 'qwer', 'qwerty', 'zxc', 'fake', 'none', 'nobody', 'anon', 'anonymous', 'xxx', 'abc', 'abcd', 'sdf', 'jkl', 'lol', 'hola', 'hello', 'hi', 'name', 'first', 'last', 'firstname', 'lastname', 'user', 'nombre', 'apellido', 'no', 'yes', 'na', 'ok', 'aa', 'bb', 'xx', 'xy', 'xyz', 'null', 'undefined', 'customer', 'cliente', 'mr', 'mrs', 'ms', 'sr', 'sra'];
  function clean(v) { return String(v || '').trim().replace(/\s+/g, ' '); }
  function nameErr(v, which) {
    v = clean(v);
    var w = which === 'first' ? 'first name' : 'last name';
    if (!v) return 'Enter your ' + w;
    if (!NAME_RE.test(v)) return 'Use letters only in your ' + w;
    var letters = v.replace(new RegExp('[^' + LETTERS + ']', 'g'), '');
    if (letters.length < 2) return 'Enter your full ' + w;
    if (letters.length > 30) return 'Your ' + w + ' looks too long';
    if (/(.)\1\1/i.test(letters)) return 'Check the spelling of your ' + w;
    if (letters.length > 3 && !/[aeiouyÀ-ÆÈ-ÏÒ-ÖÙ-Ýà-æè-ïò-öù-ý]/i.test(letters)) return 'Check the spelling of your ' + w;
    if (JUNK.indexOf(v.toLowerCase().replace(/[^a-z]/g, '')) > -1) return 'Enter your real ' + w;
    return '';
  }
  function phoneDigits(v) { var d = String(v || '').replace(/\D/g, ''); if (d.length === 11 && d[0] === '1') d = d.slice(1); return d; }
  function phoneErr(v) {
    var d = phoneDigits(v);
    if (!d) return 'Enter your phone number so Jose can reply';
    if (d.length !== 10) return 'Enter a 10-digit phone number';
    if (/^[01]/.test(d) || /^\d{3}[01]/.test(d) || /^\d11/.test(d) || d.slice(3, 6) === '555' || /^(\d)\1{9}$/.test(d) || d === '1234567890' || d === '0123456789') return 'Check the phone number';
    return '';
  }
  function prettyPhone(v) { var d = phoneDigits(v); return '(' + d.slice(0, 3) + ') ' + d.slice(3, 6) + '-' + d.slice(6); }
  function infoErrors() {
    var e = { first: nameErr(S.first, 'first'), last: nameErr(S.last, 'last'), tel: phoneErr(S.tel) };
    if (!e.first && !e.last && (clean(S.first) + ' ' + clean(S.last)).length < 5) e.last = 'Enter your full last name';
    return e;
  }
  function infoMissing() { var e = infoErrors(); return e.first || e.last || e.tel || ''; }

  function stepInfo() {
    var f = document.createDocumentFragment();
    var err = infoErrors();
    f.appendChild(h('h3', { text: 'Who is this estimate for?' }));
    f.appendChild(h('p', { class: 'hint first', text: 'Jose uses your name and number to reply with your quote. Required.' }));
    var row = h('div', { class: 'name-row' });
    function field(key, label, attrs) {
      var bad = showErr && err[key];
      var lab = h('label', { class: 'field' + (bad ? ' bad' : '') }, [h('span', { text: label + ' *' })]);
      var input = h('input', Object.assign({ value: S[key], 'aria-invalid': bad ? 'true' : null, required: 'required', oninput: function (e) { S[key] = e.target.value; save(); if (showErr) refreshErrors(); } }, attrs));
      lab.appendChild(input);
      lab.appendChild(h('small', { class: 'err', 'data-err': key, text: bad ? err[key] : '' }));
      return lab;
    }
    row.appendChild(field('first', 'First name', { type: 'text', autocomplete: 'given-name', autocapitalize: 'words', maxlength: 30 }));
    row.appendChild(field('last', 'Last name', { type: 'text', autocomplete: 'family-name', autocapitalize: 'words', maxlength: 30 }));
    f.appendChild(row);
    f.appendChild(field('tel', 'Mobile phone', { type: 'tel', autocomplete: 'tel', inputmode: 'tel', maxlength: 20, placeholder: '(760) 555-1234' }));

    f.appendChild(h('h3', { text: 'Condition (optional)' }));
    var conds = S.cat === 'rv' ? [['flats', 'Flat or old tires'], ['nobrakes', "Brakes or lights don't work"], ['jack', "Landing gear or jack doesn't work"]]
      : S.cat === 'boat' ? [['flats', 'Trailer tires flat or old'], ['nobrakes', "Trailer lights don't work"]]
      : [['nonrun', "Doesn't run or drive"], ['flats', 'Flat tires']];
    var c = h('div', { class: 'chips' });
    conds.forEach(function (a) {
      var on = !!S.cond[a[0]];
      c.appendChild(h('button', { type: 'button', class: 'chip' + (on ? ' on' : ''), 'aria-pressed': on, text: a[1], onclick: function () { S.cond[a[0]] = !on; render(); } }));
    });
    f.appendChild(c);
    f.appendChild(h('p', { class: 'hint', text: 'All good? Leave these off.' }));
    f.appendChild(h('h3', { text: 'Extra stops on the way? (optional)' }));
    f.appendChild(chips(['None', '1 stop', '2 stops', '3 stops'], S.stops ? S.stops + (S.stops > 1 ? ' stops' : ' stop') : 'None', function (v) { S.stops = v === 'None' ? 0 : parseInt(v, 10); render(); }));
    f.appendChild(h('h3', { text: 'When do you need it moved?' }));
    f.appendChild(chips(['Flexible', 'This week', 'As soon as possible'], S.timing, function (v) { S.timing = v; render(); }));
    f.appendChild(h('label', { class: 'field' }, [h('span', { text: 'Preferred date (optional)' }), h('input', { type: 'date', value: S.date, onchange: function (e) { S.date = e.target.value; save(); } })]));
    f.appendChild(h('label', { class: 'field' }, [h('span', { text: 'Anything else Jose should know? (optional)' }), h('textarea', { rows: 3, maxlength: 500, placeholder: 'Gate code needed, HOA time window, dealer contact...', oninput: function (e) { S.notes = e.target.value; save(); } }, [S.notes])]));
    f.appendChild(nav(infoMissing(), 'See my estimate', 4));
    return f;
  }
  function refreshErrors() {
    var e = infoErrors();
    ['first', 'last', 'tel'].forEach(function (k) {
      var el = panel.querySelector('[data-err="' + k + '"]'); if (!el) return;
      el.textContent = e[k]; el.parentNode.classList.toggle('bad', !!e[k]);
      var inp = el.parentNode.querySelector('input'); if (inp) { if (e[k]) inp.setAttribute('aria-invalid', 'true'); else inp.removeAttribute('aria-invalid'); }
    });
    var n = panel.querySelector('.nav-miss'); if (n && !infoMissing()) n.textContent = '';
  }

  // ---------- pricing ----------
  function inTown(p) {
    return CONFIG.inTownBoxes.some(function (b) { return p.lat >= b[0] && p.lat <= b[1] && p.lon >= b[2] && p.lon <= b[3]; });
  }
  function flagList() {
    var out = [];
    ['pickup', 'drop'].forEach(function (w) { Object.keys(S.access[w]).forEach(function (a) { if (S.access[w][a]) out.push(a); }); });
    if (S.pickupType === 'Backyard or side yard' || S.dropType === 'Backyard or side yard') out.push('backyard');
    if (S.setplace && S.cat !== 'small') out.push('setplace');
    Object.keys(S.cond).forEach(function (c) { if (S.cond[c]) out.push(c); });
    if (S.cat === 'classic') SPECIALTY.forEach(function (sp) { if (S.specialty[sp.id] && sp.add) out.push(sp.add); });
    return out.filter(function (v, i, a) { return CONFIG.flags[v] && a.indexOf(v) === i; });
  }
  function ceilTo(n, step) { return Math.ceil(n / step - 1e-9) * step; }
  function compute() {
    if (!S.route) return null;
    var C = CONFIG, leg = S.route.legs[1], k = S.cat;
    var loadedMi = leg.mi, review = [];
    var flags = flagList();
    flags.forEach(function (f) { if (['backyard', 'tight', 'lowclear', 'nonrun', 'flats', 'nobrakes', 'jack'].indexOf(f) > -1) review.push(C.flags[f].label); });
    if (S.pickupType === 'Port' || S.dropType === 'Port') review.push('Port paperwork and appointment');
    var base = { miles: loadedMi, review: review };
    var local = inTown(S.pickup) && inTown(S.drop) && loadedMi <= C.inTownMaxMiles;
    if (!local) return Object.assign(base, { custom: 'long' });
    if ((k === 'car' || k === 'classic' || k === 'small') && S.qtyMore) return Object.assign(base, { custom: 'many' });
    if (k === 'rv') {
      if (S.rvLen === 'over') return Object.assign(base, { custom: 'big' });
      var tier = C.rv.tiers.filter(function (t) { return t.id === S.rvLen; })[0], R = C.rv;
      var t = RV_TYPES.filter(function (x) { return x.id === S.rvType; })[0];
      if (t && t.review) review.push(t.label + ': Jose confirms how he moves it');
      var drive = leg.h * R.towSlowdown + S.stops * C.extraStop.hours;
      var flagH = flags.reduce(function (s, f) { return s + (C.flags[f].h || 0); }, 0);
      var lowH = Math.max(R.minHours, ceilTo(R.hookupHours + drive + R.unhookHours + flagH / 2, R.roundTo));
      var highH = ceilTo(R.hookupHours + R.extraHookup + drive * (1 + R.extraTraffic) + R.unhookHours + R.extraUnhook + flagH, R.roundTo);
      if (highH < lowH + R.roundTo) highH = lowH + R.roundTo;
      return Object.assign(base, { low: lowH * tier.rate, high: highH * tier.rate, hours: [lowH, highH], rate: tier.rate });
    }
    var V = C.vehicle, n = (k === 'car' || k === 'classic' || k === 'small') ? Math.min(S.qty, C.multiVehicle.max) : 1;
    var one = Math.max(V.minimum[k], V.minimum[k] + Math.max(0, loadedMi - V.includedMiles) * V.perMile[k]);
    var trip = one * (1 + (n - 1) * C.multiVehicle.addPct) + S.stops * C.extraStop.fee;
    var flagFee = flags.reduce(function (s, f) { return s + (C.flags[f].fee || 0); }, 0);
    var low = ceilTo(trip + flagFee / 2, V.roundTo);
    var high = ceilTo(trip * (1 + V.extraPct) + flagFee, V.roundTo);
    if (high < low + 25) high = ceilTo(low + 25, V.roundTo);
    return Object.assign(base, { low: low, high: high });
  }

  // ---------- routing ----------
  function hav(a, b) {
    var R = 3958.8, toR = Math.PI / 180, dLat = (b.lat - a.lat) * toR, dLon = (b.lon - a.lon) * toR;
    var x = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(a.lat * toR) * Math.cos(b.lat * toR) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 2 * R * Math.asin(Math.sqrt(x));
  }
  var routeSeq = 0;
  function routeNow() {
    var B = CONFIG.base;
    drawMap();
    if (!S.pickup || !S.drop) return;
    var seq = ++routeSeq;
    var pts = [B, S.pickup, S.drop, B];
    var fallback = function () {
      if (seq !== routeSeq) return;
      S.route = { approx: true, geometry: null, legs: [0, 1, 2].map(function (i) { var mi = hav(pts[i], pts[i + 1]) * 1.3; return { mi: mi, h: mi / 45 }; }) };
      update(); drawMap();
    };
    var url = 'https://router.project-osrm.org/route/v1/driving/' + pts.map(function (p) { return p.lon.toFixed(5) + ',' + p.lat.toFixed(5); }).join(';') + '?overview=full&geometries=geojson';
    fetchT(url, 9000).then(function (r) { return r.json(); }).then(function (j) {
      if (seq !== routeSeq) return;
      if (!j.routes || !j.routes[0]) return fallback();
      var rt = j.routes[0];
      S.route = { approx: false, geometry: rt.geometry, legs: rt.legs.map(function (l) { return { mi: l.distance / 1609.34, h: l.duration / 3600 }; }) };
      update(); drawMap();
    }).catch(fallback);
  }

  // ---------- map ----------
  // Branded vector map (MapLibre + OpenFreeMap, no key). Falls back to Leaflet + OpenStreetMap
  // if WebGL or the vector tiles are not available.
  var BRAND = {
    land: '#f1f1ee', park: '#e3e8de', wood: '#dfe5d8', water: '#c4d3da', building: '#e4e3de',
    minor: '#ffffff', major: '#ffffff', majorCase: '#d9d9d4', freeway: '#f7d8ae', freewayCase: '#e3b37a',
    rail: '#cfcfca', boundary: '#b8b8b2', text: '#4b5057', halo: '#ffffff', route: '#f2891c', routeCase: '#24272b'
  };
  function loadScript(src) { return new Promise(function (res, rej) { var s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); }); }
  function loadCss(href) { var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = href; document.head.appendChild(l); }
  function webgl() { try { var c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl'))); } catch (e) { return false; } }

  function brandStyle(style) {
    style.layers = style.layers.filter(function (l) { return l.id !== 'ne2_shaded' && !/hillshade/.test(l.id); });
    style.layers.forEach(function (l) {
      var id = l.id, p = l.paint = l.paint || {};
      if (l.type === 'background') p['background-color'] = BRAND.land;
      else if (id === 'water') p['fill-color'] = BRAND.water;
      else if (id === 'waterway') p['line-color'] = BRAND.water;
      else if (id === 'park') { p['fill-color'] = BRAND.park; p['fill-opacity'] = 1; }
      else if (/landcover_wood/.test(id)) { p['fill-color'] = BRAND.wood; p['fill-opacity'] = 0.6; }
      else if (/landuse_residential/.test(id)) { p['fill-color'] = '#ecebe6'; }
      else if (id === 'building') p['fill-color'] = BRAND.building;
      else if (l.type === 'line' && /motorway/.test(id) && /casing/.test(id)) p['line-color'] = BRAND.freewayCase;
      else if (l.type === 'line' && /motorway/.test(id)) p['line-color'] = BRAND.freeway;
      else if (l.type === 'line' && /major_casing/.test(id)) p['line-color'] = BRAND.majorCase;
      else if (l.type === 'line' && /highway_major/.test(id)) p['line-color'] = BRAND.major;
      else if (l.type === 'line' && /highway_minor|highway_path/.test(id)) p['line-color'] = BRAND.minor;
      else if (l.type === 'line' && /railway/.test(id)) p['line-color'] = BRAND.rail;
      else if (l.type === 'line' && /boundary/.test(id)) p['line-color'] = BRAND.boundary;
      if (l.type === 'symbol' && !/shield/.test(id)) { p['text-color'] = BRAND.text; p['text-halo-color'] = BRAND.halo; p['text-halo-width'] = 1.4; }
    });
    return style;
  }

  var gl = null, glMarkers = [], glReady = null, useLeaflet = false;
  function initGL(el) {
    if (glReady) return glReady;
    var V = app.dataset.vendor;
    loadCss(V + 'maplibre/maplibre-gl.css');
    glReady = Promise.all([loadScript(V + 'maplibre/maplibre-gl.js'), fetch('https://tiles.openfreemap.org/styles/positron').then(function (r) { if (!r.ok) throw 0; return r.json(); })])
      .then(function (res) {
        var style = brandStyle(res[1]);
        gl = new window.maplibregl.Map({ container: el, style: style, center: [CONFIG.base.lon, CONFIG.base.lat], zoom: 8.3, attributionControl: { compact: true }, cooperativeGestures: true });
        gl.addControl(new window.maplibregl.NavigationControl({ showCompass: false }), 'top-left');
        return new Promise(function (res2, rej2) {
          var t = setTimeout(function () { rej2('timeout'); }, 12000);
          gl.on('load', function () {
            clearTimeout(t);
            gl.addSource('route', { type: 'geojson', lineMetrics: true, data: { type: 'FeatureCollection', features: [] } });
            gl.addLayer({ id: 'route-case', type: 'line', source: 'route', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': BRAND.routeCase, 'line-width': 8, 'line-opacity': 0.85 } });
            gl.addLayer({ id: 'route-line', type: 'line', source: 'route', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': BRAND.route, 'line-width': 4.5 } });
            gl.addLayer({ id: 'route-glow', type: 'line', source: 'route', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-width': 14, 'line-blur': 5, 'line-gradient': glowGradient(-1) } });
            gl.addLayer({ id: 'route-spark', type: 'line', source: 'route', layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-width': 3.5, 'line-blur': 0.5, 'line-gradient': sparkGradient(-1) } });
            startLive();
            var at = el.querySelector('.maplibregl-ctrl-attrib'); if (at) at.classList.remove('maplibregl-compact-show');
            res2(gl);
          });
          gl.on('error', function (e) { if (!gl.loaded()) { clearTimeout(t); rej2(e); } });
        });
      });
    return glReady;
  }
  // "Live" route: a soft light pulse travels along the route, base > pickup > drop-off > base
  var live = { on: false, t0: 0, len: 0 }, reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function band(p, w, color, peak) {
    var clear = 'rgba(255,255,255,0)';
    if (p < 0) return ['interpolate', ['linear'], ['line-progress'], 0, clear, 1, clear];
    var a = Math.max(0.0001, p - w), b2 = Math.min(0.9998, p), c = Math.min(0.9999, p + w * 0.15);
    if (b2 <= a) b2 = a + 0.00005; if (c <= b2) c = b2 + 0.00005;
    return ['interpolate', ['linear'], ['line-progress'], 0, clear, a, clear, b2, color + peak + ')', c, clear, 1, clear];
  }
  function glowGradient(p) { return band(p, 0.14, 'rgba(255,226,180,', 0.95); }
  function sparkGradient(p) { return band(p, 0.08, 'rgba(255,255,255,', 1); }
  function setLivePath(coords) {
    live.on = !!(coords && coords.length > 1); live.t0 = performance.now(); live.len = coords ? coords.length : 0;
    if (!live.on && gl && gl.getLayer('route-glow')) { gl.setPaintProperty('route-glow', 'line-gradient', glowGradient(-1)); gl.setPaintProperty('route-spark', 'line-gradient', sparkGradient(-1)); }
  }
  function startLive() {
    if (reduceMotion) return;
    var last = 0;
    function frame(ts) {
      if (gl && live.on && gl.getLayer('route-glow') && ts - last > 33) {
        last = ts;
        var dur = Math.min(9000, Math.max(5000, live.len * 4)), p = ((ts - live.t0) % dur) / dur;
        p = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;   // ease in-out
        gl.setPaintProperty('route-glow', 'line-gradient', glowGradient(p));
        gl.setPaintProperty('route-spark', 'line-gradient', sparkGradient(p));
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  function pinEl(color, txt, title) { var d = document.createElement('div'); d.className = 'est-pin' + (txt !== 'J' ? ' pulse' : ''); d.title = title; d.style.setProperty('--pc', color); d.innerHTML = '<span style="background:' + color + '">' + txt + '</span>'; return d; }

  function drawMap() {
    var el = $('#est-map'); if (!el) return;
    if (useLeaflet || !webgl()) { useLeaflet = true; return drawLeaflet(el); }
    initGL(el).then(function (m) {
      var ML = window.maplibregl;
      glMarkers.forEach(function (mk) { mk.remove(); }); glMarkers = [];
      var B = CONFIG.base, pts = [[B.lon, B.lat]];
      glMarkers.push(new ML.Marker({ element: pinEl('#24272b', 'J', CONFIG.base.label) }).setLngLat([B.lon, B.lat]).addTo(m));
      if (S.pickup) { glMarkers.push(new ML.Marker({ element: pinEl('#f2891c', 'A', 'Pickup') }).setLngLat([S.pickup.lon, S.pickup.lat]).addTo(m)); pts.push([S.pickup.lon, S.pickup.lat]); }
      if (S.drop) { glMarkers.push(new ML.Marker({ element: pinEl('#0a6a44', 'B', 'Drop-off') }).setLngLat([S.drop.lon, S.drop.lat]).addTo(m)); pts.push([S.drop.lon, S.drop.lat]); }
      var geom = S.route && S.route.geometry ? S.route.geometry : (pts.length > 1 ? { type: 'LineString', coordinates: pts } : null);
      m.getSource('route').setData(geom ? { type: 'Feature', geometry: geom, properties: {} } : { type: 'FeatureCollection', features: [] });
      m.setPaintProperty('route-line', 'line-dasharray', S.route && S.route.geometry ? [1, 0] : [2, 2]);
      setLivePath(geom && geom.coordinates && S.route && S.route.geometry ? geom.coordinates : null);
      if (pts.length > 1) {
        var b = new ML.LngLatBounds(pts[0], pts[0]);
        (geom && geom.coordinates ? geom.coordinates : pts).forEach(function (c) { b.extend(c); });
        m.fitBounds(b, { padding: 46, maxZoom: 13, duration: 900 });
      }
      m.resize();
    }).catch(function () { useLeaflet = true; el.innerHTML = ''; drawLeaflet(el); });
  }

  // Leaflet fallback
  var map, layers, leafletReady;
  function loadLeaflet() {
    if (leafletReady) return leafletReady;
    loadCss(app.dataset.vendor + 'leaflet/leaflet.css');
    leafletReady = loadScript(app.dataset.vendor + 'leaflet/leaflet.js');
    return leafletReady;
  }
  function pin(color, txt) {
    return window.L.divIcon({ className: 'est-pin' + (txt !== 'J' ? ' pulse' : ''), html: '<span style="background:' + color + '">' + txt + '</span>', iconSize: [30, 30], iconAnchor: [15, 15] });
  }
  function drawLeaflet(el) {
    loadLeaflet().then(function () {
      var L = window.L;
      if (!map) {
        map = L.map(el, { scrollWheelZoom: false }).setView([CONFIG.base.lat, CONFIG.base.lon], 9);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
        el.classList.add('osm');
        layers = L.layerGroup().addTo(map);
      }
      layers.clearLayers();
      var B = CONFIG.base, pts = [[B.lat, B.lon]];
      L.marker([B.lat, B.lon], { icon: pin('#24272b', 'J'), title: CONFIG.base.label }).addTo(layers);
      if (S.pickup) { L.marker([S.pickup.lat, S.pickup.lon], { icon: pin('#f2891c', 'A') }).addTo(layers); pts.push([S.pickup.lat, S.pickup.lon]); }
      if (S.drop) { L.marker([S.drop.lat, S.drop.lon], { icon: pin('#0a6a44', 'B') }).addTo(layers); pts.push([S.drop.lat, S.drop.lon]); }
      if (S.route && S.route.geometry) { L.geoJSON(S.route.geometry, { style: { color: '#f2891c', weight: 5, opacity: .9 } }).addTo(layers); }
      else if (S.pickup) L.polyline(pts, { color: '#f2891c', weight: 3, dashArray: '6 8' }).addTo(layers);
      if (pts.length > 1) map.fitBounds(pts, { padding: [36, 36], maxZoom: 13 }); else map.setView(pts[0], 9);
      setTimeout(function () { map.invalidateSize(); }, 50);
    });
  }

  // ---------- estimate step ----------
  function describeVehicle() {
    if (S.cat === 'rv') {
      var t = RV_TYPES.filter(function (x) { return x.id === S.rvType; })[0] || { label: 'RV', hitch: '' };
      var len = S.rvLen === 'over' ? 'over 46 ft' : (CONFIG.rv.tiers.filter(function (x) { return x.id === S.rvLen; })[0] || { label: '' }).label.toLowerCase();
      return (S.rvModel ? S.rvModel + ', ' : '') + t.label.toLowerCase() + ', ' + len + ', hitch: ' + t.hitch.toLowerCase();
    }
    if (S.cat === 'small') return (S.qtyMore ? 'More than 3' : S.qty) + ' x ' + S.smallType + (S.model ? ' (' + S.model + ')' : '');
    if (S.cat === 'boat') return 'Boat on trailer, ' + S.boatLen.toLowerCase() + (S.model ? ' (' + S.model + ')' : '');
    var sp = SPECIALTY.filter(function (x) { return S.specialty[x.id]; }).map(function (x) { return x.label.toLowerCase(); });
    var many = S.qtyMore ? 'More than 3 vehicles, first: ' : S.qty > 1 ? S.qty + ' vehicles, first: ' : '';
    return many + [S.year, S.make, S.model].join(' ') + (sp.length ? ', ' + sp.join(', ') : '');
  }
  function fullName() { return clean(S.first) + ' ' + clean(S.last); }
  // Reference code: date + a short check code built from the details and the price.
  // If someone edits the price in the message, the code no longer matches what the site gives for the same details.
  function hash(str) { var x = 5381; for (var i = 0; i < str.length; i++) x = ((x << 5) + x + str.charCodeAt(i)) >>> 0; return x.toString(36).toUpperCase().slice(-4); }
  function signature(est) {
    return [S.cat, S.rvType, S.rvLen, S.boatLen, S.year, S.make, S.model, S.qty, S.qtyMore, S.pickup && S.pickup.label, S.drop && S.drop.label, flagList().join(','), S.stops, est.custom || '', est.low || '', est.high || ''].join('|');
  }
  function refCode(est) {
    var d = new Date(), mm = ('0' + (d.getMonth() + 1)).slice(-2), dd = ('0' + d.getDate()).slice(-2);
    return 'CH-' + mm + dd + '-' + hash(signature(est) + '|' + mm + dd);
  }
  function validUntil() { var d = new Date(Date.now() + CONFIG.validDays * 864e5); return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }

  // Light limit per browser so the tool is not used to fish for prices
  function allowed(sig) {
    try {
      var now = Date.now(), log = JSON.parse(localStorage.getItem(LOG) || '[]').filter(function (x) { return now - x.t < 864e5; });
      if (log.some(function (x) { return x.s === sig; })) return true;
      if (log.length >= CONFIG.perDay) return false;
      log.push({ t: now, s: sig }); localStorage.setItem(LOG, JSON.stringify(log));
    } catch (e) {}
    return true;
  }

  function message(est, ref) {
    var acc = function (w) { var a = ACCESS.filter(function (x) { return S.access[w][x[0]]; }).map(function (x) { return x[1].toLowerCase(); }); return a.length ? ' (' + a.join(', ') + ')' : ''; };
    var lines = [
      'Hi Jose, estimate request from chatosrvtowingsd.com',
      'Ref: ' + ref,
      'Name: ' + fullName(),
      'Phone: ' + prettyPhone(S.tel),
      'Vehicle: ' + describeVehicle(),
      'Pickup: ' + S.pickup.label + ' - ' + S.pickupType.toLowerCase() + acc('pickup'),
      'Drop-off: ' + S.drop.label + ' - ' + S.dropType.toLowerCase() + acc('drop') + (S.setplace ? ', set in place' : ''),
      'Timing: ' + S.timing + (S.date ? ', ' + S.date : '')
    ];
    if (S.others) lines.push('Other vehicles: ' + S.others);
    if (S.stops) lines.push('Extra stops: ' + S.stops);
    var cond = Object.keys(S.cond).filter(function (c) { return S.cond[c] && CONFIG.flags[c]; }).map(function (c) { return CONFIG.flags[c].label.toLowerCase(); });
    if (cond.length) lines.push('Condition: ' + cond.join(', '));
    if (S.notes) lines.push('Notes: ' + S.notes);
    if (est.custom === 'long') lines.push('Long distance, about ' + Math.round(est.miles) + ' miles. Please send me a quote.');
    else if (est.custom === 'big') lines.push('RV over 46 ft. Please send me a quote.');
    else if (est.custom === 'many') lines.push('More than 3 vehicles. Please send me a custom quote.');
    else lines.push('Website estimate: ' + money(est.low) + ' - ' + money(est.high) + ' (approximate, in town, subject to your review)');
    return ascii(lines.join('\n'));
  }
  function copyText(t) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(t).then(function () { return true; }, function () { return legacyCopy(t); });
    return Promise.resolve(legacyCopy(t));
  }
  function legacyCopy(t) {
    try { var ta = document.createElement('textarea'); ta.value = t; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, t.length); var ok = document.execCommand('copy'); document.body.removeChild(ta); return ok; } catch (e) { return false; }
  }
  function selectPre(el) { if (!el || !window.getSelection) return; var r = document.createRange(); r.selectNodeContents(el); var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r); }

  var CUSTOM = {
    long: ['Long-distance move', 'Text Jose for your price', 'Long-distance moves are priced per mile, based on the exact pickup and drop-off, the condition of your vehicle and the weather. Send your details to Jose and he will reply with a fair quote.'],
    big: ['RV over 46 ft', 'Text Jose for your price', 'Bigger rigs need the right equipment and route. Send your details to Jose and he will reply with a fair quote.'],
    many: ['More than 3 vehicles', 'Custom quote', 'Trips with more than 3 vehicles are priced by Jose. Send your details and he will put together a fair quote for the whole trip.']
  };
  function stepEstimate() {
    var f = document.createDocumentFragment();
    var est = compute();
    if (!est) { f.appendChild(h('p', { class: 'loading', text: 'Working out your route' })); return f; }
    var sig = signature(est);
    if (!allowed(sig)) {
      f.appendChild(h('div', { class: 'est-result' }, [
        h('small', { text: 'Estimate limit reached' }),
        h('div', { class: 'big small', text: 'Talk to Jose directly' }),
        h('p', { class: 'disc', text: 'You have already made several estimates today. To keep prices fair for everyone, call or text Jose and he will quote your move himself.' })
      ]));
      f.appendChild(h('div', { class: 'send' }, [
        h('a', { class: 'btn btn-call', href: 'tel:' + CONFIG.phone, html: '<span>Call (760) 532-1964</span>' }),
        h('a', { class: 'btn btn-dark', href: 'sms:' + CONFIG.phone + '?body=' + encodeURIComponent('Hi Jose, I need a quote to move my vehicle.'), html: '<span>Text Jose</span>' })
      ]));
      return f;
    }
    var ref = refCode(est);
    var cu = CUSTOM[est.custom];
    if (cu) {
      f.appendChild(h('div', { class: 'est-result' }, [
        h('small', { text: cu[0] }),
        h('div', { class: 'big small', text: cu[1] }),
        h('p', { class: 'disc', text: cu[2] })
      ]));
    } else {
      f.appendChild(h('div', { class: 'est-result' }, [
        h('small', { text: 'Your approximate price, ' + fullName().split(' ')[0] }),
        h('div', { class: 'big', text: money(est.low) + ' to ' + money(est.high) }),
        h('p', { class: 'disc', html: 'The first number is the fair price if everything goes smoothly. The second one covers extra time at pickup or drop-off.' })
      ]));
      f.appendChild(h('ul', { class: 'disc-list' }, [
        h('li', { html: '<b>This estimate can change when you talk with Jose.</b> He can adjust it in your favor, or depending on your conditions.' }),
        h('li', { text: S.cat === 'rv' ? 'In town, time runs from hookup to unhook, so the state of the pickup and drop-off spots counts. The exact length of your trailer or RV can also change the price.' : 'The condition of your vehicle and the access at pickup and drop-off can change the price.' }),
        h('li', { text: 'Minimum rate applies in San Diego. Valid until ' + validUntil() + '. Fair quote, guaranteed.' })
      ]));
    }
    if (est.review.length) f.appendChild(h('p', { class: 'needs', html: '<b>Jose may ask for a photo of:</b> ' + escapeHtml(est.review.join(', ').toLowerCase()) + '.' }));

    var msg = message(est, ref);
    var subj = ascii('Estimate ' + ref + ': ' + describeVehicle().split(',')[0] + ', ' + S.pickup.label.split(',')[0] + ' to ' + S.drop.label.split(',')[0]);
    var sms = 'sms:' + CONFIG.phone + '?body=' + encodeURIComponent(msg);
    var mail = 'mailto:' + CONFIG.email + '?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(msg);
    var enc = encodeURIComponent, to = enc(CONFIG.email), su = enc(subj), bo = enc(msg);
    var MAILERS = [
      ['Email app', mail, 'email'],
      ['Gmail', 'https://mail.google.com/mail/?view=cm&fs=1&to=' + to + '&su=' + su + '&body=' + bo, 'gmail'],
      ['Yahoo Mail', 'https://compose.mail.yahoo.com/?to=' + to + '&subject=' + su + '&body=' + bo, 'yahoo'],
      ['Outlook', 'https://outlook.live.com/mail/0/deeplink/compose?to=' + to + '&subject=' + su + '&body=' + bo, 'outlook']
    ];
    var value = est.low || 0;
    var ENV = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5.5" width="18" height="13" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4 7l8 6 8-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>';
    var copyBtn = h('button', { type: 'button', class: 'btn btn-dark', html: '<span>Copy message</span>', onclick: function () {
      copyText(msg).then(function (ok) {
        copyBtn.querySelector('span').textContent = ok ? 'Copied! Now paste it' : 'Select the message below';
        if (!ok) { var d = panel.querySelector('.preview'); if (d) { d.open = true; selectPre(d.querySelector('pre')); } }
        track('estimate_sent', { method: 'copy', value: value });
        setTimeout(function () { copyBtn.querySelector('span').textContent = 'Copy message'; }, 3000);
      });
    } });
    f.appendChild(h('h3', { class: 'send-title', text: 'Send it to Jose' }));
    f.appendChild(h('div', { class: 'send' }, [
      h('a', { class: 'btn btn-call', href: sms, 'data-where': 'estimate', onclick: function () { track('estimate_sent', { method: 'sms', value: value }); }, html: '<span>Text this to Jose</span>' }),
      copyBtn
    ]));
    var mailRow = h('div', { class: 'mailers' }, [h('span', { class: 'mailers-label', text: 'Or email it with' })]);
    MAILERS.forEach(function (m) {
      var ext = m[2] !== 'email';
      mailRow.appendChild(h('a', { class: 'mailer', href: m[1], target: ext ? '_blank' : null, rel: ext ? 'noopener' : null, 'data-where': 'estimate_' + m[2], onclick: function () { track('estimate_sent', { method: m[2], value: value }); }, html: ENV + '<span>' + m[0] + '</span>' }));
    });
    f.appendChild(mailRow);
    f.appendChild(h('p', { class: 'send-help', html: 'Nothing opened? Tap <b>Copy message</b> and paste it in a text to <a href="sms:' + CONFIG.phone + '">(760) 532-1964</a> or an email to <a href="mailto:' + CONFIG.email + '">' + CONFIG.email + '</a>.' }));
    f.appendChild(h('details', { class: 'preview' }, [h('summary', { text: 'See the message that will be sent' }), h('pre', { text: msg })]));
    f.appendChild(h('div', { class: 'end-row' }, [
      h('button', { type: 'button', class: 'linkbtn', text: 'Go back and change something', onclick: function () { go(3); } }),
      h('button', { type: 'button', class: 'linkbtn', text: 'Start over', onclick: startOver })
    ]));
    if (stepEstimate.tracked !== sig) { stepEstimate.tracked = sig; track('estimate_completed', { vehicle: S.cat, value: value, type: est.custom || 'in_town' }); }
    return f;
  }

  // ---------- small UI helpers ----------
  function chips(items, value, onPick) {
    var c = h('div', { class: 'chips', role: 'radiogroup' });
    items.forEach(function (it) { c.appendChild(h('button', { type: 'button', role: 'radio', 'aria-checked': it === value, class: 'chip' + (it === value ? ' on' : ''), text: it, onclick: function () { onPick(it); } })); });
    return c;
  }
  function toggle(label, val, on) {
    var input = h('input', { type: 'checkbox', onchange: function (e) { on(e.target.checked); } });
    input.checked = !!val;
    return h('label', { class: 'toggle' }, [input, h('span', { text: label })]);
  }
  // Back + Next. Next always answers: if something is missing it says what, in plain words.
  function nav(missing, label, to) {
    var note = h('p', { class: 'nav-miss', role: 'status', 'aria-live': 'polite' });
    var next = h('button', { type: 'button', class: 'btn btn-call' + (missing ? ' wait' : ''), text: label, onclick: function () {
      var m = to === 4 ? infoMissing() : missing;
      if (!m) return go(to);
      if (to === 4) { showErr = true; render(); var bad = panel.querySelector('.field.bad input'); if (bad) bad.focus(); return; }
      note.textContent = m; note.classList.remove('shake'); void note.offsetWidth; note.classList.add('shake');
    } });
    var row = h('div', { class: 'next' }, [S.step > 0 ? h('button', { type: 'button', class: 'btn btn-ghost back', text: 'Back', onclick: function () { go(S.step - 1); } }) : h('span'), next]);
    return h('div', {}, [row, note]);
  }

  // ---------- render ----------
  function go(i) { S.step = i; render(); var top = app.getBoundingClientRect().top + window.scrollY - 90; if (window.scrollY > top) window.scrollTo({ top: top, behavior: 'smooth' }); }
  function render() {
    drawTabs();
    panel.innerHTML = '';
    var body = S.step === 0 ? stepVehicle() : S.step === 1 ? stepPlace('pickup') : S.step === 2 ? stepPlace('drop') : S.step === 3 ? stepInfo() : stepEstimate();
    var wrap = h('div', { class: 'step-anim' }); wrap.appendChild(body); panel.appendChild(wrap);
    save();
    update();
  }
  function update() {
    var est = S.step === 4 ? compute() : null;
    var t;
    if (S.step < 4) t = 'Shown at the last step';
    else if (!est) t = 'Working out your route';
    else if (est.custom) t = est.custom === 'many' ? 'Custom quote' : 'Text Jose for a quote';
    else t = money(est.low) + ' to ' + money(est.high);
    rangeEls.forEach(function (el) { el.textContent = t; el.classList.toggle('wait', S.step < 4 || !est); });
    if (mbar) mbar.textContent = S.step === 4 && est ? 'Send to Jose' : S.step === 3 ? 'See my estimate' : 'Continue';
    if (sumEl) {
      var rows = [['Vehicle', !vehicleMissing() ? describeVehicle() : (S.cat ? CATS[S.cat].label : 'Pick a vehicle type')], ['Pickup', S.pickup ? S.pickup.label : 'Not set yet'], ['Drop-off', S.drop ? S.drop.label : 'Not set yet']];
      sumEl.innerHTML = rows.map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + escapeHtml(r[1]) + '</dd></div>'; }).join('');
    }
    if (S.step === 4 && est && !panel.querySelector('.est-result')) render();
  }

  restore();
  drawPills(); render(); drawMap();
  if (S.pickup && S.drop) routeNow();
  if (mbar) mbar.addEventListener('click', function () {
    if (S.step === 4) { var sd = panel.querySelector('.send'); if (sd) sd.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    var btn = panel.querySelector('.next .btn-call'); if (btn) btn.click();
  });
})();
