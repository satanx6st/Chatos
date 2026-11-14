/* Chato's Quick Estimate
 * Everything Jose may want to change lives in CONFIG below.
 * Prices are a starting point: confirm every number with Jose before launch.
 */
(function () {
  'use strict';

  var CONFIG = {
    base: { lat: 33.119837, lon: -117.049181, label: "Jose's base in Escondido" },
    email: 'chatosautos@yahoo.com',
    phone: '+17605321964',
    dieselPerGallon: 8.09,           // USD fallback. Live value comes from assets/data/fuel.json (updated weekly)
    dieselAdjust: 0,                 // add or subtract from the weekly price, e.g. 0.25 for a San Diego premium
    mpgEmpty: 15,                    // RAM 3500 dually, not towing
    mpgTowing: { rv: 9, car: 12, classic: 12, small: 13, boat: 11 },
    driverPerHour: 85,               // driving + hookup time
    hookupFee: { rv: 150, car: 95, classic: 140, small: 75, boat: 120 },
    handlingHours: { rv: 1.0, car: 0.5, classic: 0.75, small: 0.4, boat: 0.75 },
    minimum: { rv: 250, car: 175, classic: 225, small: 125, boat: 200 },
    returnLegFactor: 0.6,            // share of the empty drive home that is charged
    towingSlowdown: 1.15,            // loaded legs take longer than car traffic
    lodgingPerNight: 160,            // added for every 10 driving hours
    rvLengthOver: { ft: 30, perFt: 0.02 },   // +2% per foot over 30 ft
    rush: 0.15,                      // same-day / ASAP
    routeBuffer: 0.10,               // +10% miles and drive time for detours, traffic and fuel stops
    extraStop: { miles: 8, hours: 0.33, fee: 25 },   // each extra stop on the way
    rangeLow: 0.9, rangeHigh: 1.2, roundTo: 25,
    addOns: {
      backyard:   { label: 'Backyard or side-yard pickup', price: 150, review: true },
      steep:      { label: 'Steep driveway', price: 100 },
      tight:      { label: 'Tight gate or tight space', price: 100, review: true },
      soft:       { label: 'Gravel, dirt or soft ground', price: 75 },
      lowclear:   { label: 'Low trees or wires', price: 0, review: true },
      setplace:   { label: 'Back it into the spot at drop-off', price: 50 },
      nonrun:     { label: "Doesn't run or drive", price: 75, review: true },
      flats:      { label: 'Flat or old tires', price: 0, review: true },
      nobrakes:   { label: "Brakes or lights don't work", price: 0, review: true },
      jack:       { label: "Landing gear or jack doesn't work", price: 0, review: true },
      lowride:    { label: 'Low clearance or lowered', price: 50 },
      showcar:    { label: 'Show car, extra care', price: 50 }
    }
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
    { id: 'toy', label: 'Toy hauler', hitch: 'Fifth wheel king pin' },
    { id: 'goose', label: 'Gooseneck', hitch: 'Gooseneck ball' },
    { id: 'park', label: 'Park model or tiny home', hitch: 'Depends on the unit', review: true },
    { id: 'motor', label: 'Motorhome', hitch: 'Jose confirms the method', review: true }
  ];
  var HITCHES = ['Fifth wheel king pin', 'Gooseneck ball', 'Bumper pull, ball hitch', 'Not sure'];
  var SMALL_TYPES = ['Golf cart', 'Motorcycle', 'ATV or UTV', 'Dirt bike', 'Jet ski', 'Other'];
  var SPECIALTY = [
    { id: 'classic', label: 'Classic or vintage' }, { id: 'exotic', label: 'Exotic or luxury' },
    { id: 'lowride', label: 'Lowered or low clearance', add: 'lowride' }, { id: 'showcar', label: 'Show car', add: 'showcar' }
  ];
  var BODIES = ['Sedan or coupe', 'SUV or crossover', 'Pickup or van', 'Lifted or oversize'];
  var CAR_MAKES = ['Acura','Alfa Romeo','AMC','Aston Martin','Audi','Austin-Healey','Bentley','BMW','Buick','Cadillac','Chevrolet','Chrysler','Datsun','DeLorean','Dodge','Ferrari','Fiat','Ford','Genesis','GMC','Honda','Hummer','Hyundai','INEOS','Infiniti','Jaguar','Jeep','Kia','Lamborghini','Land Rover','Lexus','Lincoln','Lotus','Lucid','Maserati','Mazda','McLaren','Mercedes-Benz','Mercury','MG','MINI','Mitsubishi','Nissan','Oldsmobile','Plymouth','Polestar','Pontiac','Porsche','Ram','Rivian','Rolls-Royce','Shelby','Studebaker','Subaru','Tesla','Toyota','Triumph','Volkswagen','Volvo','Other'];
  var RV_MAKES = ['Airstream','Alliance','Brinkley','Coachmen','Cruiser RV','DRV','Dutchmen','Forest River','Grand Design','Heartland','Highland Ridge','inTech','Jayco','KZ','Keystone','Lance','Newmar','Northwood','Palomino','Prime Time','Redwood','Riverstone','Thor','Tiffin','Winnebago','Other'];
  var LOC_TYPES = ['Home driveway or street', 'Backyard or side yard', 'Storage lot', 'RV park or campground', 'Dealer or auction', 'Port', 'Roadside'];
  var ACCESS = [['steep', 'Steep driveway'], ['tight', 'Tight gate or space'], ['soft', 'Gravel or soft ground'], ['lowclear', 'Low trees or wires']];

  // ---------- state ----------
  var S = {
    cat: null, rvType: '', length: 32, hitch: '', stops: 0, year: '', make: '', model: '', body: BODIES[0],
    smallType: 'Golf cart', qty: 1, specialty: {}, ev: false, bodyTouched: false,
    pickup: null, drop: null, pickupType: LOC_TYPES[0], dropType: LOC_TYPES[0],
    access: { pickup: {}, drop: {} }, cond: {}, setplace: false, timing: 'Flexible', date: '', name: '', notes: '',
    route: null, step: 0
  };
  var STEPS = ['Vehicle', 'Pickup', 'Drop-off', 'Details', 'Estimate'];

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var app = $('#estimator');
  if (!app) return;
  var panel = $('.est-body', app), tabs = $('.est-steps', app), pills = $('.est-cats', app);
  var sumEl = $('#est-summary'), rangeEls = document.querySelectorAll('[data-range]');
  var track = function (ev, p) { window.dataLayer = window.dataLayer || []; window.dataLayer.push(Object.assign({ event: ev }, p || {})); if (window.gtag) window.gtag('event', ev, p || {}); };
  var started = false;

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

  // ---------- category pills ----------
  function chooseCat(k) {
    S.cat = k; S.year = S.make = S.model = ''; S.specialty = {}; subTab = 'year'; S.length = k === 'boat' ? 20 : 32;
    S.body = BODIES[0]; S.bodyTouched = false; S.rvType = ''; S.hitch = ''; S.cond = {};
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
    STEPS.forEach(function (n, i) {
      tabs.appendChild(h('button', { type: 'button', class: 'tab' + (S.step === i ? ' on' : '') + (i < S.step ? ' done' : ''), 'aria-current': S.step === i ? 'step' : 'false', onclick: function () { if (i <= maxStep()) go(i); }, html: '<small>Step ' + (i + 1) + '</small>' + n }));
    });
  }
  function maxStep() { if (!vehicleOk()) return 0; if (!S.pickup) return 1; if (!S.drop) return 2; return 4; }

  // ---------- searchable list (AutoZone style) ----------
  function picker(title, items, value, onPick, opts) {
    opts = opts || {};
    var wrap = h('div', { class: 'picker' });
    var input = h('input', { type: 'search', placeholder: 'Type to narrow down your search', 'aria-label': title });
    var list = h('ul', { class: 'plist', role: 'listbox', 'aria-label': title });
    function render() {
      var q = input.value.trim().toLowerCase(); list.innerHTML = '';
      var shown = items.filter(function (it) { return !q || String(it).toLowerCase().indexOf(q) > -1; });
      shown.slice(0, 120).forEach(function (it) {
        list.appendChild(h('li', {}, [h('button', { type: 'button', role: 'option', 'aria-selected': it == value, class: it == value ? 'on' : '', text: it, onclick: function () { onPick(it); } })]));
      });
      if (opts.free && q) list.appendChild(h('li', {}, [h('button', { type: 'button', class: 'use', text: 'Use "' + input.value.trim() + '"', onclick: function () { onPick(input.value.trim()); } })]));
      if (!shown.length && !opts.free) list.appendChild(h('li', { class: 'empty', text: 'No match. Try another spelling.' }));
    }
    input.addEventListener('input', render); render();
    wrap.appendChild(h('div', { class: 'psearch' }, [input])); wrap.appendChild(list);
    return wrap;
  }
  var YEARS = (function () { var a = [], y = new Date().getFullYear() + 1; for (; y >= 1930; y--) a.push(String(y)); return a; })();

  // ---------- step 1: vehicle ----------
  var subTab = 'year';
  function vehicleOk() {
    if (!S.cat) return false;
    if (S.cat === 'rv') return !!S.rvType && S.length > 0;
    if (S.cat === 'small') return !!S.smallType;
    if (S.cat === 'boat') return S.length > 0;
    return !!(S.year && S.make && S.model);
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
      f.appendChild(h('p', { class: 'hint', text: 'Pick the type first so the estimate asks the right questions.' }));
      return f;
    }
    if (S.cat === 'rv') {
      f.appendChild(h('h3', { text: 'What kind of RV?' }));
      var g = h('div', { class: 'cards' });
      RV_TYPES.forEach(function (t) {
        g.appendChild(h('button', { type: 'button', class: 'card' + (S.rvType === t.id ? ' on' : ''), onclick: function () { S.rvType = t.id; S.hitch = t.hitch; render(); }, html: '<b>' + t.label + '</b><span>' + t.hitch + '</span>' }));
      });
      f.appendChild(g);
      f.appendChild(rangeField('Length', 12, 45, S.length, ' ft', function (v) { S.length = v; update(); }));
      f.appendChild(h('h3', { text: 'Hitch type' }));
      f.appendChild(chips(HITCHES, S.hitch, function (v) { S.hitch = v; render(); }));
      f.appendChild(yearMakeModel(RV_MAKES, 'RV brand and model (optional)', true));
    } else if (S.cat === 'small') {
      f.appendChild(h('h3', { text: 'What are we moving?' }));
      f.appendChild(chips(SMALL_TYPES, S.smallType, function (v) { S.smallType = v; render(); }));
      f.appendChild(rangeField('How many', 1, 4, S.qty, '', function (v) { S.qty = v; update(); }));
      f.appendChild(h('label', { class: 'field' }, [h('span', { text: 'Make and model (optional)' }), h('input', { type: 'text', value: S.model, placeholder: 'e.g. Club Car Onward, Honda Rancher', oninput: function (e) { S.model = e.target.value; update(); } })]));
    } else if (S.cat === 'boat') {
      f.appendChild(h('h3', { text: 'Boat on its own trailer' }));
      f.appendChild(rangeField('Boat length', 10, 30, S.length > 30 ? 20 : S.length, ' ft', function (v) { S.length = v; update(); }));
      f.appendChild(h('label', { class: 'field' }, [h('span', { text: 'Make and model (optional)' }), h('input', { type: 'text', value: S.model, placeholder: 'e.g. Bayliner 195', oninput: function (e) { S.model = e.target.value; update(); } })]));
    } else {
      f.appendChild(yearMakeModel(CAR_MAKES, null, false));
      f.appendChild(h('h3', { text: 'Body style' }));
      f.appendChild(chips(BODIES, S.body, function (v) { S.body = v; S.bodyTouched = true; render(); }));
      if (S.cat === 'classic') {
        f.appendChild(h('h3', { text: 'Specialty' }));
        var c = h('div', { class: 'chips' });
        SPECIALTY.forEach(function (sp) {
          c.appendChild(h('button', { type: 'button', class: 'chip' + (S.specialty[sp.id] ? ' on' : ''), 'aria-pressed': !!S.specialty[sp.id], text: sp.label, onclick: function () { S.specialty[sp.id] = !S.specialty[sp.id]; render(); } }));
        });
        f.appendChild(c);
      }
      f.appendChild(toggle('Electric vehicle', S.ev, function (v) { S.ev = v; }));
    }
    f.appendChild(nextBtn(vehicleOk(), subTab === 'done' ? 'Confirm and continue' : 'Next: pickup location', 1));
    return f;
  }
  function yearMakeModel(makes, heading, optional) {
    var box = h('div', { class: 'ymm' });
    if (heading) box.appendChild(h('h3', { text: heading }));
    if (subTab === 'done' && S.year && S.make && S.model) {
      var isRV = makes === RV_MAKES;
      box.appendChild(h('div', { class: 'confirm', id: 'ymm-confirm' }, [
        h('div', { class: 'confirm-check', 'aria-hidden': 'true', html: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>' }),
        h('div', { class: 'confirm-text' }, [h('small', { text: 'Your ' + (isRV ? 'RV' : 'vehicle') }), h('b', { text: [S.year, S.make, S.model].join(' ') })]),
        h('button', { type: 'button', class: 'linkbtn', text: 'Change', onclick: function () { subTab = 'year'; render(); } })
      ]));
      return box;
    }
    var parts = [['year', 'Year', S.year], ['make', 'Make', S.make], ['model', 'Model', S.model]];
    var bar = h('div', { class: 'subtabs', role: 'tablist' });
    parts.forEach(function (p) {
      bar.appendChild(h('button', { type: 'button', role: 'tab', class: subTab === p[0] ? 'on' : '', 'aria-selected': subTab === p[0], onclick: function () { subTab = p[0]; render(); }, html: (optional ? '<small>Optional</small>' : '') + '<b>' + (p[2] || p[1]) + '</b>' }));
    });
    box.appendChild(bar);
    if (subTab === 'year') box.appendChild(picker('Year', YEARS, S.year, function (v) { S.year = v; subTab = 'make'; render(); }));
    else if (subTab === 'make') box.appendChild(picker('Make', makes, S.make, function (v) { S.make = v; S.model = ''; subTab = 'model'; render(); }, { free: true }));
    else {
      var holder = h('div', {}, [h('p', { class: 'loading', text: 'Loading models' })]);
      box.appendChild(holder);
      loadModels(makes === RV_MAKES ? '' : S.make, S.year).then(function (models) {
        holder.innerHTML = '';
        holder.appendChild(picker('Model', models, S.model, function (v) {
          S.model = v; subTab = 'done'; guessBody(); render();
          var c = document.getElementById('ymm-confirm'); if (c && c.scrollIntoView) c.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, { free: true }));
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
    return fetch(u1).then(function (r) { return r.json(); }).then(function (j) {
      var m = pick(j); if (m.length) return m;
      return fetch(u2).then(function (r) { return r.json(); }).then(pick);
    }).catch(function () { return []; }).then(function (m) { modelCache[key] = m; return m; });
  }

  // Pick the body style from NHTSA vehicle type (SUV/MPV or truck); the customer can still change it
  function guessBody() {
    if (S.bodyTouched || !(S.cat === 'car' || S.cat === 'classic') || !S.make || !S.year) return;
    var want = S.model.toLowerCase();
    var base = 'https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/' + encodeURIComponent(S.make) + '/modelyear/' + S.year + '/vehicletype/';
    var has = function (type) {
      return fetch(base + type + '?format=json').then(function (r) { return r.json(); }).then(function (j) {
        return (j.Results || []).some(function (x) { return String(x.Model_Name).toLowerCase() === want; });
      }).catch(function () { return false; });
    };
    Promise.all([has('mpv'), has('truck')]).then(function (r) {
      if (S.bodyTouched) return;
      var nb = r[0] ? 'SUV or crossover' : r[1] ? 'Pickup or van' : 'Sedan or coupe';
      if (nb !== S.body) { S.body = nb; if (S.step === 0) render(); else update(); }
    });
  }

  // ---------- step 2/3: places ----------
  function stepPlace(which) {
    var f = document.createDocumentFragment();
    var isP = which === 'pickup';
    f.appendChild(h('h3', { text: isP ? 'Where is it now?' : 'Where is it going?' }));
    f.appendChild(addressField(which));
    f.appendChild(h('h3', { text: 'Type of location' }));
    f.appendChild(chips(LOC_TYPES, isP ? S.pickupType : S.dropType, function (v) { if (isP) S.pickupType = v; else S.dropType = v; render(); }));
    f.appendChild(h('h3', { text: 'Anything tricky about access?' }));
    var c = h('div', { class: 'chips' });
    ACCESS.forEach(function (a) {
      var on = !!S.access[which][a[0]];
      c.appendChild(h('button', { type: 'button', class: 'chip' + (on ? ' on' : ''), 'aria-pressed': on, text: a[1], onclick: function () { S.access[which][a[0]] = !on; render(); } }));
    });
    f.appendChild(c);
    if (!isP && S.cat !== 'small') f.appendChild(toggle('Back it into the spot or set it in place', S.setplace, function (v) { S.setplace = v; update(); }));
    var ok = isP ? !!S.pickup : !!S.drop;
    f.appendChild(nextBtn(ok, isP ? 'Next: drop-off location' : 'Next: details', isP ? 2 : 3));
    return f;
  }
  function addressField(which) {
    var cur = S[which];
    var wrap = h('div', { class: 'addr' });
    var input = h('input', { type: 'search', autocomplete: 'off', placeholder: 'Search an address, city or place', value: cur ? cur.label : '', 'aria-label': which === 'pickup' ? 'Pickup address' : 'Drop-off address' });
    var list = h('ul', { class: 'sugg', role: 'listbox' });
    var timer, ctrl;
    var items = [];
    function show(list_, arr) {
      list_.innerHTML = ''; items = arr;
      arr.forEach(function (it) {
        list_.appendChild(h('li', {}, [h('button', { type: 'button', html: '<b>' + escapeHtml(it.main) + '</b><span>' + escapeHtml(it.sub) + '</span>', onclick: function () { choose(it); } })]));
      });
      if (!arr.length) list_.appendChild(h('li', { class: 'empty', text: 'No places found. Try the street number, street and city, like 15738 Thyme Ct, Adelanto.' }));
    }
    function choose(it) {
      list.innerHTML = ''; input.value = it.main + (it.sub ? ', ' + it.sub : '');
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
    var opt = signal ? { signal: signal } : {};
    var esri = fetch(ESRI + 'suggest?f=json&countryCode=USA,MEX&maxSuggestions=6&location=-117.05,33.12&text=' + encodeURIComponent(q), opt)
      .then(function (r) { return r.json(); }).then(function (j) {
        return (j.suggestions || []).filter(function (x) { return !x.isCollection; }).map(function (x) {
          var parts = x.text.replace(/, USA$/, '').split(', ');
          return { main: parts[0], sub: parts.slice(1).join(', '), get: function () {
            return fetch(ESRI + 'findAddressCandidates?f=json&maxLocations=1&magicKey=' + encodeURIComponent(x.magicKey) + '&SingleLine=' + encodeURIComponent(x.text))
              .then(function (r) { return r.json(); }).then(function (k) {
                var c = k.candidates && k.candidates[0]; if (!c) return null;
                return { label: c.address || x.text, lat: c.location.y, lon: c.location.x };
              }).catch(function () { return null; });
          } };
        });
      }).catch(function () { return []; });
    var photon = fetch('https://photon.komoot.io/api/?limit=4&lang=en&lat=33.1&lon=-117.1&q=' + encodeURIComponent(q), opt)
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
  function escapeHtml(s) { return String(s || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function locate(which) {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(function (pos) {
      var lat = pos.coords.latitude, lon = pos.coords.longitude;
      fetch(ESRI + 'reverseGeocode?f=json&location=' + lon + ',' + lat).then(function (r) { return r.json(); }).then(function (j) {
        var a = j.address || {};
        setPlace(which, { label: a.LongLabel ? a.LongLabel.replace(/, USA$/, '') : (a.Match_addr || 'My location'), lat: lat, lon: lon });
      }).catch(function () { setPlace(which, { label: 'My location', lat: lat, lon: lon }); });
    });
  }
  function setPlace(which, place) { S[which] = place; S.route = null; render(); routeNow(); }

  // ---------- step 4: details ----------
  function stepDetails() {
    var f = document.createDocumentFragment();
    f.appendChild(h('h3', { text: 'Condition' }));
    var conds = S.cat === 'rv' ? [['flats', 'Flat or old tires'], ['nobrakes', "Brakes or lights don't work"], ['jack', "Landing gear or jack doesn't work"]]
      : S.cat === 'boat' ? [['flats', 'Trailer tires flat or old'], ['nobrakes', "Trailer lights don't work"]]
      : [['nonrun', "Doesn't run or drive"], ['flats', 'Flat tires']];
    var c = h('div', { class: 'chips' });
    conds.forEach(function (a) {
      var on = !!S.cond[a[0]];
      c.appendChild(h('button', { type: 'button', class: 'chip' + (on ? ' on' : ''), 'aria-pressed': on, text: a[1], onclick: function () { S.cond[a[0]] = !on; render(); } }));
    });
    f.appendChild(c);
    f.appendChild(h('p', { class: 'hint', text: "Everything good? Leave these off. If anything is on, Jose will review it before he quotes." }));
    f.appendChild(h('h3', { text: 'Extra stops on the way?' }));
    f.appendChild(chips(['None', '1 stop', '2 stops', '3 stops'], S.stops ? S.stops + (S.stops > 1 ? ' stops' : ' stop') : 'None', function (v) { S.stops = v === 'None' ? 0 : parseInt(v, 10); render(); }));
    f.appendChild(h('p', { class: 'hint', text: 'Picking up keys or paperwork, a gas or dump station, a second address. Each stop adds a few miles and some time.' }));
    f.appendChild(h('h3', { text: 'When do you need it moved?' }));
    f.appendChild(chips(['Flexible', 'This week', 'ASAP or same day'], S.timing, function (v) { S.timing = v; render(); }));
    f.appendChild(h('label', { class: 'field' }, [h('span', { text: 'Preferred date (optional)' }), h('input', { type: 'date', value: S.date, onchange: function (e) { S.date = e.target.value; } })]));
    f.appendChild(h('label', { class: 'field' }, [h('span', { text: 'Your name (optional)' }), h('input', { type: 'text', autocomplete: 'name', value: S.name, oninput: function (e) { S.name = e.target.value; } })]));
    f.appendChild(h('label', { class: 'field' }, [h('span', { text: 'Anything else Jose should know? (optional)' }), h('textarea', { rows: 3, placeholder: 'Gate code needed, HOA time window, dealer contact...', oninput: function (e) { S.notes = e.target.value; } }, [S.notes])]));
    f.appendChild(nextBtn(true, 'See my estimate', 4));
    return f;
  }

  // ---------- pricing ----------
  function vehicleKey() { return S.cat; }
  function compute() {
    if (!S.route) return null;
    var k = vehicleKey(), C = CONFIG, leg = S.route.legs;
    var buf = 1 + C.routeBuffer, st = S.stops || 0;
    var toPickupMi = leg[0].mi * buf, loadedMi = leg[1].mi * buf + st * C.extraStop.miles, homeMi = leg[2].mi * buf;
    var mpgTow = C.mpgTowing[k];
    if (k === 'rv') mpgTow = Math.max(6.5, mpgTow - Math.max(0, S.length - 30) * 0.12);
    var fuel = ((toPickupMi + homeMi * C.returnLegFactor) / C.mpgEmpty + loadedMi / mpgTow) * C.dieselPerGallon;
    var driveH = (leg[0].h + leg[1].h * C.towingSlowdown + leg[2].h * C.returnLegFactor) * buf + st * C.extraStop.hours;
    var handleH = C.handlingHours[k] * (k === 'small' ? Math.max(1, S.qty * 0.7) : 1);
    var time = (driveH + handleH) * C.driverPerHour;
    var hookup = C.hookupFee[k] * (k === 'small' ? (1 + (S.qty - 1) * 0.5) : 1);
    var sizeAdj = 0;
    if (k === 'rv' && S.length > C.rvLengthOver.ft) sizeAdj = (hookup + time) * (S.length - C.rvLengthOver.ft) * C.rvLengthOver.perFt;
    if ((k === 'car' || k === 'classic') && S.body === 'Lifted or oversize') sizeAdj = 50;
    var add = [], review = [];
    function addOn(key) { var a = C.addOns[key]; if (!a) return; add.push({ label: a.label, price: a.price }); if (a.review) review.push(a.label); }
    ['pickup', 'drop'].forEach(function (w) { Object.keys(S.access[w]).forEach(function (a) { if (S.access[w][a]) addOn(a); }); });
    if (S.pickupType === 'Backyard or side yard' || S.dropType === 'Backyard or side yard') addOn('backyard');
    if (S.setplace) addOn('setplace');
    Object.keys(S.cond).forEach(function (c) { if (S.cond[c]) addOn(c); });
    if (k === 'classic') SPECIALTY.forEach(function (sp) { if (S.specialty[sp.id] && sp.add) addOn(sp.add); });
    if (k === 'rv') { var t = RV_TYPES.filter(function (x) { return x.id === S.rvType; })[0]; if (t && t.review) review.push(t.label + ' moves are confirmed by Jose'); }
    if (S.hitch === 'Not sure' && k === 'rv') review.push('Hitch type to confirm');
    if (S.pickupType === 'Port' || S.dropType === 'Port') review.push('Port paperwork and appointment');
    var addTotal = add.reduce(function (s, a) { return s + a.price; }, 0);
    var totalDriveH = leg[0].h + leg[1].h * C.towingSlowdown + leg[2].h;
    var nights = Math.floor(totalDriveH / 10);
    var lodging = nights * C.lodgingPerNight;
    var stopFee = st * C.extraStop.fee;
    var sub = hookup + fuel + time + sizeAdj + addTotal + lodging + stopFee;
    var rush = S.timing === 'ASAP or same day' ? sub * C.rush : 0;
    var total = Math.max(C.minimum[k], sub + rush);
    var r = function (n) { return Math.round(n / C.roundTo) * C.roundTo; };
    return {
      low: r(total * C.rangeLow), high: r(total * C.rangeHigh), total: total,
      lines: [
        ['Tow and hookup fee', hookup + sizeAdj],
        ['Diesel at $' + CONFIG.dieselPerGallon.toFixed(2) + '/gal, ' + Math.round(toPickupMi + loadedMi + homeMi) + ' mi incl. ' + Math.round(C.routeBuffer * 100) + '% detour buffer', fuel],
        ['Driver time, about ' + (driveH + handleH).toFixed(1) + ' hrs', time]
      ].concat(add.filter(function (a) { return a.price; }).map(function (a) { return [a.label, a.price]; }))
        .concat(stopFee ? [['Extra stops (' + st + ')', stopFee]] : [])
        .concat(lodging ? [['Overnight on the road (' + nights + ')', lodging]] : [])
        .concat(rush ? [['ASAP or same day', rush]] : []),
      review: review, miles: { toPickup: leg[0].mi, loaded: leg[1].mi, home: leg[2].mi }, minApplied: total === C.minimum[k] && sub + rush < C.minimum[k]
    };
  }

  // ---------- routing ----------
  function hav(a, b) {
    var R = 3958.8, toR = Math.PI / 180, dLat = (b.lat - a.lat) * toR, dLon = (b.lon - a.lon) * toR;
    var x = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(a.lat * toR) * Math.cos(b.lat * toR) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return 2 * R * Math.asin(Math.sqrt(x));
  }
  function routeNow() {
    var B = CONFIG.base;
    drawMap();
    if (!S.pickup || !S.drop) return;
    var pts = [B, S.pickup, S.drop, B];
    var fallback = function () {
      S.route = { approx: true, geometry: null, legs: [0, 1, 2].map(function (i) { var mi = hav(pts[i], pts[i + 1]) * 1.3; return { mi: mi, h: mi / 48 }; }) };
      update(); drawMap();
    };
    var url = 'https://router.project-osrm.org/route/v1/driving/' + pts.map(function (p) { return p.lon.toFixed(5) + ',' + p.lat.toFixed(5); }).join(';') + '?overview=full&geometries=geojson';
    fetch(url).then(function (r) { return r.json(); }).then(function (j) {
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
    if (S.cat === 'rv') { var t = RV_TYPES.filter(function (x) { return x.id === S.rvType; })[0]; return [S.year, S.make, S.model].filter(Boolean).join(' ') + (S.make || S.model || S.year ? ' ' : '') + t.label.toLowerCase() + ', ' + S.length + ' ft, hitch: ' + S.hitch.toLowerCase(); }
    if (S.cat === 'small') return S.qty + ' x ' + S.smallType + (S.model ? ' (' + S.model + ')' : '');
    if (S.cat === 'boat') return 'Boat on trailer, ' + S.length + ' ft' + (S.model ? ' (' + S.model + ')' : '');
    var sp = SPECIALTY.filter(function (x) { return S.specialty[x.id]; }).map(function (x) { return x.label.toLowerCase(); });
    return [S.year, S.make, S.model].join(' ') + ', ' + S.body.toLowerCase().replace('suv', 'SUV') + (S.ev ? ', EV' : '') + (sp.length ? ', ' + sp.join(', ') : '');
  }
  function message(est) {
    var acc = function (w) { var a = ACCESS.filter(function (x) { return S.access[w][x[0]]; }).map(function (x) { return x[1].toLowerCase(); }); return a.length ? ' (' + a.join(', ') + ')' : ''; };
    var lines = [
      'Hi Jose, quick estimate request from chatosrvtowingsd.com',
      'Vehicle: ' + describeVehicle(),
      'Pickup: ' + S.pickup.label + ' - ' + S.pickupType.toLowerCase() + acc('pickup'),
      'Drop-off: ' + S.drop.label + ' - ' + S.dropType.toLowerCase() + acc('drop') + (S.setplace ? ', set in place' : ''),
      'Miles: about ' + Math.round(est.miles.loaded) + ' loaded',
      'Timing: ' + S.timing + (S.date ? ', ' + S.date : '')
    ];
    if (S.stops) lines.push('Extra stops: ' + S.stops);
    var cond = Object.keys(S.cond).filter(function (c) { return S.cond[c]; }).map(function (c) { return CONFIG.addOns[c].label.toLowerCase(); });
    if (cond.length) lines.push('Condition: ' + cond.join(', '));
    if (S.notes) lines.push('Notes: ' + S.notes);
    lines.push('Website estimate: ' + money(est.low) + ' - ' + money(est.high) + ' (approximate, needs your review)');
    if (S.name) lines.push('Name: ' + S.name);
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
  function stepEstimate() {
    var f = document.createDocumentFragment();
    var est = compute();
    if (!est) { f.appendChild(h('p', { class: 'loading', text: 'Calculating the route' })); return f; }
    f.appendChild(h('div', { class: 'est-result' }, [
      h('small', { text: 'Your approximate range' }),
      h('div', { class: 'big', text: money(est.low) + ' to ' + money(est.high) }),
      h('p', { class: 'disc', html: '<b>This is an approximate estimate, not a final quote.</b> Jose has to review your information, and the final quote can change depending on the vehicle, access at pickup and drop-off, the route and timing. Whatever it ends up being, your final quote will always be fair. Guaranteed.' })
    ]));
    var tbl = h('table', { class: 'breakdown' });
    est.lines.forEach(function (l) { tbl.appendChild(h('tr', {}, [h('td', { text: l[0] }), h('td', { text: money(l[1]) })])); });
    if (est.minApplied) tbl.appendChild(h('tr', { class: 'min' }, [h('td', { text: 'Minimum for this kind of move applies' }), h('td', { text: '' })]));
    f.appendChild(tbl);
    f.appendChild(h('p', { class: 'miles', text: "Route: Jose's base to pickup " + Math.round(est.miles.toPickup) + ' mi, pickup to drop-off ' + Math.round(est.miles.loaded) + ' mi, back to base ' + Math.round(est.miles.home) + ' mi' + (S.route.approx ? ' (straight-line estimate)' : '') + '.' }));
    if (est.review.length) {
      var ul = h('ul', { class: 'review-list' });
      est.review.forEach(function (r) { ul.appendChild(h('li', { text: r })); });
      f.appendChild(h('div', { class: 'needs' }, [h('b', { text: 'Jose will review these with you' }), ul]));
    }
    var msg = message(est);
    var subj = ascii('Quick estimate: ' + describeVehicle().split(',')[0] + ', ' + S.pickup.label.split(',')[0] + ' to ' + S.drop.label.split(',')[0]);
    var sms = 'sms:' + CONFIG.phone + '?body=' + encodeURIComponent(msg);
    var mail = 'mailto:' + CONFIG.email + '?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(msg);
    var gmail = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(CONFIG.email) + '&su=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(msg);
    var copyBtn = h('button', { type: 'button', class: 'btn btn-dark', html: '<span>Copy message</span>', onclick: function () {
      copyText(msg).then(function (ok) {
        copyBtn.querySelector('span').textContent = ok ? 'Copied! Now paste it' : 'Select the message below';
        if (!ok) { var d = panel.querySelector('.preview'); if (d) { d.open = true; selectPre(d.querySelector('pre')); } }
        track('estimate_sent', { method: 'copy', value: est.low });
        setTimeout(function () { copyBtn.querySelector('span').textContent = 'Copy message'; }, 3000);
      });
    } });
    f.appendChild(h('div', { class: 'send' }, [
      h('a', { class: 'btn btn-call', href: sms, 'data-where': 'estimate', onclick: function () { track('estimate_sent', { method: 'sms', value: est.low }); }, html: '<span>Text this to Jose</span>' }),
      copyBtn,
      h('a', { class: 'btn btn-ghost', href: mail, 'data-where': 'estimate', onclick: function () { track('estimate_sent', { method: 'email', value: est.low }); }, html: '<span>Email it</span>' }),
      h('a', { class: 'btn btn-ghost', href: gmail, target: '_blank', rel: 'noopener', 'data-where': 'estimate', onclick: function () { track('estimate_sent', { method: 'gmail', value: est.low }); }, html: '<span>Open in Gmail</span>' })
    ]));
    f.appendChild(h('p', { class: 'send-help', html: 'Nothing opened? Tap <b>Copy message</b> and paste it in a text to <a href="tel:' + CONFIG.phone + '">(760) 532-1964</a> or an email to <a href="mailto:' + CONFIG.email + '">' + CONFIG.email + '</a>.' }));
    f.appendChild(h('details', { class: 'preview' }, [h('summary', { text: 'See the message that will be sent' }), h('pre', { text: msg })]));
    f.appendChild(h('button', { type: 'button', class: 'linkbtn', text: 'Start over', onclick: function () { location.reload(); } }));
    if (!stepEstimate.tracked) { stepEstimate.tracked = true; track('estimate_completed', { vehicle: S.cat, value: est.low, miles: Math.round(est.miles.loaded) }); }
    return f;
  }

  // ---------- small UI helpers ----------
  function chips(items, value, onPick) {
    var c = h('div', { class: 'chips', role: 'radiogroup' });
    items.forEach(function (it) { c.appendChild(h('button', { type: 'button', role: 'radio', 'aria-checked': it === value, class: 'chip' + (it === value ? ' on' : ''), text: it, onclick: function () { onPick(it); } })); });
    return c;
  }
  function rangeField(label, min, max, val, unit, on) {
    var out = h('output', { text: val + unit });
    var input = h('input', { type: 'range', min: min, max: max, value: val, 'aria-label': label, oninput: function (e) { var v = +e.target.value; out.textContent = v + unit; on(v); } });
    return h('label', { class: 'field range' }, [h('span', {}, [label + ' ', out]), input]);
  }
  function toggle(label, val, on) {
    var input = h('input', { type: 'checkbox', onchange: function (e) { on(e.target.checked); update(); } });
    input.checked = !!val;
    return h('label', { class: 'toggle' }, [input, h('span', { text: label })]);
  }
  function nextBtn(ok, label, to) {
    return h('div', { class: 'next' }, [h('button', { type: 'button', class: 'btn btn-call', disabled: ok ? null : 'disabled', text: label, onclick: function () { if (ok) go(to); } })]);
  }

  // ---------- render ----------
  function go(i) { S.step = i; render(); var top = app.getBoundingClientRect().top + window.scrollY - 90; if (window.scrollY > top) window.scrollTo({ top: top, behavior: 'smooth' }); }
  function render() {
    drawTabs();
    panel.innerHTML = '';
    var body = S.step === 0 ? stepVehicle() : S.step === 1 ? stepPlace('pickup') : S.step === 2 ? stepPlace('drop') : S.step === 3 ? stepDetails() : stepEstimate();
    var wrap = h('div', { class: 'step-anim' }); wrap.appendChild(body); panel.appendChild(wrap);
    update();
  }
  function update() {
    var est = compute();
    var t = est ? money(est.low) + ' to ' + money(est.high) : (S.pickup && S.drop ? 'Calculating' : 'Add pickup and drop-off');
    rangeEls.forEach(function (el) { el.textContent = t; });
    if (sumEl) {
      var rows = [['Vehicle', vehicleOk() ? describeVehicle() : (S.cat ? CATS[S.cat].label : 'Pick a vehicle type')], ['Pickup', S.pickup ? S.pickup.label : 'Not set yet'], ['Drop-off', S.drop ? S.drop.label : 'Not set yet']];
      if (est) rows.push(['Loaded miles', Math.round(est.miles.loaded) + ' mi']);
      sumEl.innerHTML = rows.map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + escapeHtml(r[1]) + '</dd></div>'; }).join('');
    }
    if (S.step === 4 && est && !panel.querySelector('.est-result')) render();
  }

  // Weekly diesel price (written by the GitHub deploy workflow); falls back to CONFIG
  fetch(app.dataset.fuel, { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(function (j) {
    var v = parseFloat(j.dieselPerGallon);
    if (v > 2 && v < 15) { CONFIG.dieselPerGallon = v + (CONFIG.dieselAdjust || 0); update(); if (S.step === 4) render(); }
  }).catch(function () {});

  drawPills(); render(); drawMap();
  var mbar = $('.est-mbar .btn');
  if (mbar) mbar.addEventListener('click', function () { go(Math.min(4, maxStep())); });
})();
