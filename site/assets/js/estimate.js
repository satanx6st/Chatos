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
    cat: 'rv', rvType: 'fifth', length: 32, hitch: 'Fifth wheel king pin', year: '', make: '', model: '', body: BODIES[0],
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
  function drawPills() {
    pills.innerHTML = '';
    Object.keys(CATS).forEach(function (k) {
      pills.appendChild(h('button', { type: 'button', class: 'pill' + (S.cat === k ? ' on' : ''), 'aria-pressed': S.cat === k, onclick: function () {
        S.cat = k; S.year = S.make = S.model = ''; S.specialty = {}; subTab = 'year'; S.length = k === 'boat' ? 20 : 32; S.body = BODIES[0]; S.bodyTouched = false; if (!started) { started = true; track('estimate_started', { vehicle: k }); }
        drawPills(); go(0);
      } , html: '<span>' + CATS[k].label + '</span>' + icon(CATS[k].icon) }));
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
    if (S.cat === 'rv') return !!S.rvType && S.length > 0;
    if (S.cat === 'small') return !!S.smallType;
    if (S.cat === 'boat') return S.length > 0;
    return !!(S.year && S.make && S.model);
  }
  function stepVehicle() {
    var f = document.createDocumentFragment();
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
    input.addEventListener('input', function () {
      clearTimeout(timer);
      var q = input.value.trim();
      if (q.length < 3) { list.innerHTML = ''; return; }
      timer = setTimeout(function () {
        if (ctrl && ctrl.abort) ctrl.abort();
        ctrl = window.AbortController ? new AbortController() : null;
        fetch('https://photon.komoot.io/api/?limit=6&lang=en&lat=33.1&lon=-117.1&q=' + encodeURIComponent(q), ctrl ? { signal: ctrl.signal } : {})
          .then(function (r) { return r.json(); })
          .then(function (j) {
            list.innerHTML = '';
            (j.features || []).forEach(function (ft) {
              var p = ft.properties, lab = placeLabel(p);
              list.appendChild(h('li', {}, [h('button', { type: 'button', html: '<b>' + escapeHtml(lab.main) + '</b><span>' + escapeHtml(lab.sub) + '</span>', onclick: function () {
                setPlace(which, { label: lab.main + (lab.sub ? ', ' + lab.sub : ''), lat: ft.geometry.coordinates[1], lon: ft.geometry.coordinates[0] });
              } })]));
            });
            if (!list.children.length) list.appendChild(h('li', { class: 'empty', text: 'No places found. Try adding the city.' }));
          }).catch(function () {});
      }, 280);
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
  function escapeHtml(s) { return String(s || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function locate(which) {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(function (pos) {
      var lat = pos.coords.latitude, lon = pos.coords.longitude;
      fetch('https://photon.komoot.io/reverse?lat=' + lat + '&lon=' + lon).then(function (r) { return r.json(); }).then(function (j) {
        var p = (j.features && j.features[0] && j.features[0].properties) || {}, lab = placeLabel(p);
        setPlace(which, { label: (lab.main || 'My location') + (lab.sub ? ', ' + lab.sub : ''), lat: lat, lon: lon });
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
    var toPickupMi = leg[0].mi, loadedMi = leg[1].mi, homeMi = leg[2].mi;
    var mpgTow = C.mpgTowing[k];
    if (k === 'rv') mpgTow = Math.max(6.5, mpgTow - Math.max(0, S.length - 30) * 0.12);
    var fuel = ((toPickupMi + homeMi * C.returnLegFactor) / C.mpgEmpty + loadedMi / mpgTow) * C.dieselPerGallon;
    var driveH = leg[0].h + leg[1].h * C.towingSlowdown + leg[2].h * C.returnLegFactor;
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
    var sub = hookup + fuel + time + sizeAdj + addTotal + lodging;
    var rush = S.timing === 'ASAP or same day' ? sub * C.rush : 0;
    var total = Math.max(C.minimum[k], sub + rush);
    var r = function (n) { return Math.round(n / C.roundTo) * C.roundTo; };
    return {
      low: r(total * C.rangeLow), high: r(total * C.rangeHigh), total: total,
      lines: [
        ['Tow and hookup fee', hookup + sizeAdj],
        ['Diesel at $' + CONFIG.dieselPerGallon.toFixed(2) + '/gal, ' + Math.round(toPickupMi + loadedMi + homeMi) + ' total miles', fuel],
        ['Driver time, about ' + (driveH + handleH).toFixed(1) + ' hrs', time]
      ].concat(add.filter(function (a) { return a.price; }).map(function (a) { return [a.label, a.price]; }))
        .concat(lodging ? [['Overnight on the road (' + nights + ')', lodging]] : [])
        .concat(rush ? [['ASAP or same day', rush]] : []),
      review: review, miles: { toPickup: toPickupMi, loaded: loadedMi, home: homeMi }, minApplied: total === C.minimum[k] && sub + rush < C.minimum[k]
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

  // ---------- map (Leaflet, loaded on demand) ----------
  var map, layers, leafletReady;
  function loadLeaflet() {
    if (leafletReady) return leafletReady;
    leafletReady = new Promise(function (res) {
      var css = document.createElement('link'); css.rel = 'stylesheet'; css.href = app.dataset.leaflet + 'leaflet.css'; document.head.appendChild(css);
      var s = document.createElement('script'); s.src = app.dataset.leaflet + 'leaflet.js'; s.onload = res; document.head.appendChild(s);
    });
    return leafletReady;
  }
  function pin(color, txt) {
    return window.L.divIcon({ className: 'est-pin', html: '<span style="background:' + color + '">' + txt + '</span>', iconSize: [30, 30], iconAnchor: [15, 15] });
  }
  function drawMap() {
    var el = $('#est-map'); if (!el) return;
    loadLeaflet().then(function () {
      var L = window.L;
      if (!map) {
        map = L.map(el, { scrollWheelZoom: false, zoomControl: true, attributionControl: true }).setView([CONFIG.base.lat, CONFIG.base.lon], 9);
        // OpenStreetMap tiles (no key needed); if they fail, switch to Esri World Street Map
        var errs = 0, tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
        tiles.on('tileerror', function () {
          if (++errs === 4) { map.removeLayer(tiles); L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19, attribution: 'Tiles &copy; Esri' }).addTo(map); }
        });
        layers = L.layerGroup().addTo(map);
      }
      layers.clearLayers();
      var B = CONFIG.base, pts = [[B.lat, B.lon]];
      L.marker([B.lat, B.lon], { icon: pin('#24272b', 'J'), title: CONFIG.base.label }).addTo(layers).bindTooltip(CONFIG.base.label);
      if (S.pickup) { L.marker([S.pickup.lat, S.pickup.lon], { icon: pin('#f2891c', 'A') }).addTo(layers).bindTooltip('Pickup'); pts.push([S.pickup.lat, S.pickup.lon]); }
      if (S.drop) { L.marker([S.drop.lat, S.drop.lon], { icon: pin('#0a6a44', 'B') }).addTo(layers).bindTooltip('Drop-off'); pts.push([S.drop.lat, S.drop.lon]); }
      if (S.route && S.route.geometry) {
        L.geoJSON(S.route.geometry, { style: { color: '#f2891c', weight: 5, opacity: .9 } }).addTo(layers);
      } else if (S.pickup) {
        L.polyline(pts, { color: '#f2891c', weight: 3, dashArray: '6 8' }).addTo(layers);
      }
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
    var cond = Object.keys(S.cond).filter(function (c) { return S.cond[c]; }).map(function (c) { return CONFIG.addOns[c].label.toLowerCase(); });
    if (cond.length) lines.push('Condition: ' + cond.join(', '));
    if (S.notes) lines.push('Notes: ' + S.notes);
    lines.push('Website estimate: ' + money(est.low) + ' - ' + money(est.high) + ' (approximate, needs your review)');
    if (S.name) lines.push('Name: ' + S.name);
    return ascii(lines.join('\n'));
  }
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
    f.appendChild(h('div', { class: 'send' }, [
      h('a', { class: 'btn btn-call', href: sms, 'data-where': 'estimate', onclick: function () { track('estimate_sent', { method: 'sms', value: est.low }); }, html: '<span>Text this to Jose</span>' }),
      h('a', { class: 'btn btn-ghost', href: mail, 'data-where': 'estimate', onclick: function () { track('estimate_sent', { method: 'email', value: est.low }); }, html: '<span>Email it</span>' }),
      h('a', { class: 'btn btn-ghost', href: 'tel:' + CONFIG.phone, 'data-where': 'estimate', html: '<span>Call (760) 532-1964</span>' })
    ]));
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
      var rows = [['Vehicle', vehicleOk() ? describeVehicle() : CATS[S.cat].label], ['Pickup', S.pickup ? S.pickup.label : 'Not set yet'], ['Drop-off', S.drop ? S.drop.label : 'Not set yet']];
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
