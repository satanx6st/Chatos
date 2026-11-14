# Page content. Executed inside build.py (shares its namespace).

def svc_row(title, href, img, body, ticks, link_text):
    t = "".join(f"<li>{x}</li>" for x in ticks)
    return f'''
    <article class="svc">
      <div class="svc-media">{img}</div>
      <div>
        <h3><a href="{R}{href}">{title}</a></h3>
        <p>{body}</p>
        <ul class="ticks">{t}</ul>
        <a class="textlink" href="{R}{href}">{link_text}</a>
      </div>
    </article>'''

# =====================================================================
# HOME
# =====================================================================
R = ""
HOME_FAQ = [
    ("What kinds of RVs do you move?",
     "Fifth wheels, travel trailers, toy haulers, goosenecks, park model RVs, tiny homes and motorhomes. Jose has moved fifth wheels up to 43 feet and a 45-foot tiny home trailer. When you call or text, share the length, the make and model, and the hitch type so he can confirm the setup."),
    ("What does the fair quote guarantee mean?",
     "Jose looks at your project honestly and gives you a fair price before anything is booked. No games, no changing the number on moving day. If your move needs something extra, like a steep driveway or a tight gate, he tells you up front."),
    ("How much does RV towing cost in San Diego?",
     "It depends on the distance, the size and weight of the RV, how easy the pickup and drop-off spots are to reach, and how soon you need it moved. Text the two addresses, the RV length and a photo of where it is parked, and Jose will give you a price before anything is booked."),
    ("Can you move my RV today?",
     "Often, yes. Same-day and next-day moves depend on the schedule, so if it is urgent, call instead of texting and Jose will tell you right away what he can do."),
    ("Do you do long-distance RV transport?",
     f'Yes. Chato\'s moves RVs all over California and out of state to Nevada and Arizona, and delivers to the port for RVs shipping to Hawaii. See <a href="{R}RV-Transport-San-Diego.html">RV transport from San Diego</a>, <a href="{R}RV-Transport-San-Diego-to-Arizona.html">Arizona</a> and <a href="{R}RV-Transport-San-Diego-to-Las-Vegas.html">Las Vegas</a>.'),
    ("Do you transport cars too?",
     f'Yes, on a dedicated car hauler, one vehicle at a time. That includes daily drivers, trucks, EVs, exotics and collector cars. See <a href="{R}Auto-Transport-San-Diego.html">car transport</a> and <a href="{R}Classic-Car-Transport-San-Diego.html">classic car transport</a>.'),
    ("Do I need to be there for pickup and delivery?",
     "Not always. If you cannot be there, arrange access with the RV park, storage lot or seller, and Jose will send photos and updates so you know where your RV or car is."),
    ("¿Hablan español?",
     "Sí. Jose habla español. Llama o manda texto al (760) 532-1964 para mover tu RV, tráiler o carro."),
]

home_body = hero(
    "RV towing<br>&amp; transport<br>in San Diego",
    "30 years of experience moving fifth wheels, travel trailers, toy haulers and motorhomes, with Jose behind the wheel of his own RAM 3500 dually. Cars and classic cars on a dedicated car hauler. Across San Diego County, all of California, Nevada and Arizona.",
    picture("fifth-wheel-towing-san-diego", "White RAM 3500 dually towing a Riverstone Legacy fifth wheel for Chato's RV Towing", 1600, 1200, cls="bg",
            widths=[("-800", 800), ("-1200", 1200), ("", 1600)], mobile="fifth-wheel-towing-san-diego-m", priority=True),
    pos="72% 55%", with_seal=True)
home_body += ticker()

home_body += f'''
<section class="sec">
  <div class="wrap">
    <div class="sec-head">
      <h2>What Chato's moves</h2>
      <p>One truck, one driver with 30 years of experience, and your RV or vehicle is the only load on it. No brokers, no waiting on a carrier you never met.</p>
    </div>
    <div class="services">
      {svc_row("RV towing in San Diego", "index.html#rv-towing",
        picture("rv-towing-on-the-road-600", "Chato's RAM 3500 towing a fifth wheel RV on a San Diego road", 600, 800, sizes="(max-width:800px) 100vw, 55vw"),
        "Local RV moves around the county: out of storage, into an RV park, from the dealer to your driveway, or across town to a new spot. Jose backs it into tight places so you don't have to.",
        ["Fifth wheels, travel trailers and toy haulers", "Storage lots, RV parks, dealers and driveways", "Same-day moves when the schedule allows"],
        "See how RV towing works")}
      {svc_row("RV transport, long distance", "RV-Transport-San-Diego.html",
        picture("rv-transport-fifth-wheel-rear-800", "Riverstone fifth wheel hitched for long-distance RV transport", 800, 600, sizes="(max-width:800px) 100vw, 55vw"),
        "Bought an RV up north or out of state? Moving and need your fifth wheel to follow? Chato's hauls RVs all over California, to Nevada and Arizona, and to the port for Hawaii.",
        ["Dealer and private-party pickups", "California, Nevada and Arizona routes", "Photo and video updates from pickup to drop-off"],
        "RV transport from San Diego")}
      {svc_row("Car transport", "Auto-Transport-San-Diego.html",
        picture("ferrari-car-transport-san-diego", "Red Ferrari strapped on Chato's car hauler for car transport in San Diego", 738, 553, sizes="(max-width:800px) 100vw, 55vw"),
        "Daily drivers, trucks, Teslas and exotics moved on an open car hauler, one vehicle at a time, straight from pickup to delivery.",
        ["Door-to-door, no terminals", "EVs, exotics, lifted trucks and off-roaders", "Dealer, auction and private sales"],
        "Car transport in San Diego")}
      {svc_row("Classic car transport", "Classic-Car-Transport-San-Diego.html",
        picture("classic-convertibles-car-hauler", "Vintage convertibles loaded on a car hauler for classic car transport", 680, 510, sizes="(max-width:800px) 100vw, 55vw"),
        "Collector cars get wheel straps over the tires, a slow careful load, and a driver who treats a 1955 Nomad like the only one left.",
        ["Wheel straps, not frame hooks", "Car shows, shops, auctions and storage", "Your car is the only one on the trailer"],
        "Classic car transport")}
    </div>
  </div>
</section>
'''

home_body += steps_section()
home_body += values_section()

home_body += f'''
<section class="sec" id="rv-towing">
  <div class="wrap split">
    <div class="prose">
      <h2>RV towing in San Diego, done by the owner</h2>
      <p>Chato's is Jose Barba and his white RAM 3500 dually. When you call, he answers. When your RV moves, he is the one behind the wheel. That is why customers keep calling him back for the next move.</p>
      <p>Most local RV towing jobs in San Diego County look like one of these:</p>
      <ul>
        <li><strong>Storage to home or campsite.</strong> Pull the fifth wheel out of a storage lot in Escondido, Santee or Otay and set it at your house or a campground.</li>
        <li><strong>RV park moves.</strong> Relocating between parks in Chula Vista, Oceanside, El Cajon or Mission Bay, including getting it level in the new site.</li>
        <li><strong>Dealer pickups.</strong> Bought a trailer in Temecula or Murrieta and don't have a truck big enough? Jose brings it home.</li>
        <li><strong>Tight driveways and yards.</strong> The jobs other companies turn down: steep driveways, narrow streets and backyards.</li>
        <li><strong>Your truck broke down.</strong> If your tow vehicle quits with the trailer attached, Chato's can take the RV the rest of the way.</li>
      </ul>
      <p>Don't see your situation? Text a photo of where the RV is parked and where it needs to go. You will get an honest answer about whether it can be done.</p>
      <div class="btn-row" style="margin-top:24px">{call_btn("rv_towing_section")}{text_btn("rv_towing_section", cls="btn btn-ghost", label="Text a photo")}</div>
    </div>
    <figure>
      {picture("fifth-wheel-driveway-move-600", "Fifth wheel being moved into a residential driveway in San Diego County", 600, 800, sizes="(max-width:800px) 100vw, 45vw")}
      <figcaption>A fifth wheel set in a residential driveway after a local move.</figcaption>
    </figure>
  </div>
</section>
'''

home_body += reels_section("Recent loads", "Short clips straight from Jose's phone.", [
    ("classic-chevy-nomad-transport", "1955 Chevy Nomad strapped on the car hauler"),
    ("fifth-wheel-rv-transport", "Jayco Seismic toy hauler hitched to the RAM 3500"),
    ("car-transport-car-hauler", "INEOS Grenadier on a mountain run"),
])

home_body += reviews_section("home")

home_body += f'''
<section class="sec">
  <div class="wrap about">
    {picture("jose-chatos-rv-towing-600", "Jose Luis, owner and driver of Chato's Auto Transport and RV Towing, with his truck", 600, 800, sizes="(max-width:800px) 100vw, 40vw")}
    <div>
      <h2>Meet Jose: 30 years behind the wheel</h2>
      <p>Jose Barba, "Chato" to his friends, runs Chato's the way he would want his own RV handled: show up when he says, take the extra minute on the hitch, keep the owner in the loop, and give an honest answer about every project, big or small.</p>
      <p>Jose has <strong>30 years of experience</strong> moving RVs, trailers and vehicles, and he does it with passion. Customers notice: "His 30 years of experience definitely shows!" He knows the grades, the gates, the RV parks and the port, and he shares that know-how with every customer so the move goes right.</p>
      <p>Most of all, Jose stands behind his price. <strong>Your quote will always be fair. Guaranteed.</strong></p>
      <div class="spanish" lang="es">
        <p><strong>¿Necesitas mover tu RV, tu tráiler o tu carro?</strong> Jose habla español. Llama o manda texto al <a href="{TEL}" data-where="spanish_block">{PHONE}</a> y te da precio rápido.</p>
      </div>
    </div>
  </div>
</section>
'''

home_body += also_hauls()
home_body += map_section()
home_body += sign_section()
home_body += faq_section(HOME_FAQ)
home_body += band()

PAGES.append(("index.html", "1.0"))
write("index.html", page(
    "index.html",
    "RV Towing San Diego | 30 Years | RV & Car Transport | Chato's",
    "RV towing and RV transport in San Diego with 30 years of experience. Fifth wheels, trailers, motorhomes, cars and classics. Call or text (760) 532-1964.",
    home_body,
    [business_schema(),
     {"@type": "WebSite", "@id": DOMAIN + "/#website", "url": DOMAIN + "/", "name": BIZ, "publisher": {"@id": DOMAIN + "/#business"}, "inLanguage": "en-US"},
     service_schema("index.html", "RV towing", "Local RV towing for fifth wheels, travel trailers and toy haulers in San Diego County.", ["San Diego", "Escondido", "Oceanside", "El Cajon", "Chula Vista", "Temecula"]),
     faq_schema(HOME_FAQ)],
    active="index.html"))

# =====================================================================
# RV TRANSPORT SAN DIEGO (new)
# =====================================================================
RVT_FAQ = [
    ("How far will you transport an RV?",
     "Anywhere Jose can legally and safely tow it: across San Diego County, statewide to Los Angeles, the desert, the Central Valley and Northern California, out of state to Nevada and Arizona, and to the port for RVs shipping to Hawaii. Tell him the route when you call."),
    ("What size RV can you transport?",
     "Fifth wheels, travel trailers, toy haulers, goosenecks, park models, tiny homes and motorhomes. He has moved fifth wheels up to 43 feet and a 45-foot tiny home. Share the length, dry weight and hitch type so he can confirm before booking."),
    ("How is RV transport priced?",
     "By the trip: miles, the size and weight of the RV, tolls or permits on the route, and the pickup and delivery access. You get a price for the whole move before it is scheduled."),
    ("Can you pick up an RV I bought from a private seller?",
     "Yes. Coordinate a time with the seller, send Jose the address and the seller's phone number, and he will handle the hookup, walk-around photos and delivery to you."),
    ("Do I need to empty the tanks and pack everything down?",
     f'Yes. Empty the black and gray tanks, secure anything loose inside, and close every vent, window and slide. Our <a href="{R}blog/how-to-prepare-fifth-wheel-for-transport.html">fifth wheel transport checklist</a> walks through it.'),
]
rvt = hero("RV transport from San Diego<br>to anywhere you need it",
           "Long-distance and local RV transport for fifth wheels, travel trailers and toy haulers. One driver, one RV, door to door, with updates along the way.",
           picture("fifth-wheel-pickup-rv-lot", "Chato's RAM 3500 hooked to a fifth wheel at an RV lot, ready for RV transport", 1600, 1200, cls="bg",
                   widths=[("-800", 800), ("", 1600)], mobile="fifth-wheel-pickup-rv-lot-m", priority=True),
           crumbs=[("index.html", "Home"), ("RV-Transport-San-Diego.html", "RV transport San Diego")], short=True, pos="65% 55%")
rvt += f'''
<section class="sec">
  <div class="wrap split">
    <div class="prose">
      <h2>RV transport without the broker runaround</h2>
      <p>Most RV transport companies you find online are brokers. They take your deposit, post your job on a load board and hand your fifth wheel to whichever driver takes the price. You find out who is towing it the day of pickup.</p>
      <p>Chato's works the other way. Jose quotes the job, Jose hooks up your RV, and Jose delivers it. You have his cell number the whole time, and you get photos at pickup, on the road and at drop-off.</p>
      <h3>Real routes from Chato's customers</h3>
      <ul>
        <li>A 40-foot fifth wheel from Loomis to San Diego, then to the port to ship to Hawaii</li>
        <li>A vintage trailer from Sacramento to San Diego on short notice</li>
        <li>An Airstream back home to Yuma, Arizona, and a motorhome from Arizona to San Diego</li>
        <li>A 42-foot fifth wheel from Indio to Vista, and a park model from Palm Desert to Borrego Springs</li>
        <li>A fifth wheel from El Cajon to Jurupa Valley</li>
      </ul>
      <p>Heading out of state? See <a href="{R}RV-Transport-San-Diego-to-Arizona.html">RV transport to Arizona</a>, <a href="{R}RV-Transport-San-Diego-to-Las-Vegas.html">RV transport to Las Vegas</a> and <a href="{R}RV-Transport-San-Diego-to-Northern-California.html">RV transport to Northern California</a>.</p>
      <h3>What we transport</h3>
      <p><strong>Fifth wheels</strong> from compact models to 43-foot luxury rigs like the Riverstone Legacy. <strong>Travel trailers</strong> and Airstreams of every size. <strong>Toy haulers</strong> like the Jayco Seismic. <strong>Motorhomes, park models and tiny homes.</strong> Not sure if yours fits? Send the make, model and length.</p>
    </div>
    <figure>
      {picture("rv-transport-seismic-toy-hauler", "Jayco Seismic toy hauler hitched to a white RAM 3500 for RV transport", 576, 1024, sizes="(max-width:800px) 100vw, 40vw")}
      <figcaption>Jayco Seismic toy hauler hitched and ready to roll.</figcaption>
    </figure>
  </div>
</section>
'''
rvt += steps_section("How long-distance RV transport works", [
    ("Send the route", "Pickup and delivery addresses, the dates that work, and the RV's make, model and length."),
    ("Lock in a price", "You get one price for the trip. Nothing is scheduled until you say yes."),
    ("Pickup inspection", "Jose walks around the RV, checks tires, lights and hitch, and takes photos with you or the seller."),
    ("Delivered and set", "Your RV arrives with updates the whole way and gets parked where you want it."),
])
rvt += f'''
<section class="sec">
  <div class="wrap prose narrow">
    <h2>What affects the price of RV transport</h2>
    <p>There is no honest flat rate for RV transport, because no two moves are the same. These are the things that move the number:</p>
    <ul>
      <li><strong>Distance and route.</strong> Highway miles cost less per mile than a mountain grade or city traffic.</li>
      <li><strong>Size and weight.</strong> A 43-foot fifth wheel takes more fuel and more care than a 20-foot travel trailer.</li>
      <li><strong>Access.</strong> A storage lot with a wide gate is quick. A steep driveway or a tight backyard takes time.</li>
      <li><strong>Timing.</strong> Flexible dates are easier to fit in. Last-minute moves are possible but depend on the schedule.</li>
      <li><strong>Condition.</strong> Tires, bearings and brakes need to be road-ready for a long haul. Jose will tell you if something looks unsafe before he hooks up.</li>
    </ul>
    <p>The fastest way to a real number: text the route, the RV length and a couple of photos to <a href="{SMS}" data-where="rv_transport_pricing">{PHONE}</a>.</p>
  </div>
</section>
'''
rvt += reviews_section("long", "RV owners who trusted Jose with the long haul", concrete=True)
rvt += map_section()
rvt += faq_section(RVT_FAQ, "RV transport questions")
rvt += also_hauls()
rvt += sign_section(title="RV transport by city")
rvt += band("Need an RV moved across the state?", "Send Jose the pickup, the delivery and the RV details. You will get a straight price for the trip.")
PAGES.append(("RV-Transport-San-Diego.html", "0.9"))
write("RV-Transport-San-Diego.html", page(
    "RV-Transport-San-Diego.html",
    "RV Transport San Diego | Fifth Wheel & Trailer Transport",
    "Long-distance and local RV transport from San Diego for fifth wheels, travel trailers and toy haulers. Owner-operated, door to door. Call (760) 532-1964.",
    rvt,
    [business_schema(), service_schema("RV-Transport-San-Diego.html", "RV transport", "Local and long-distance RV transport for fifth wheels, travel trailers and toy haulers from San Diego.", ["San Diego", "Los Angeles", "Temecula", "Escondido"]),
     crumbs_schema([("index.html", "Home"), ("RV-Transport-San-Diego.html", "RV transport San Diego")]), faq_schema(RVT_FAQ)],
    active="RV-Transport-San-Diego.html"))

# =====================================================================
# CAR TRANSPORT (keeps the indexed Auto-Transport-San-Diego.html URL)
# =====================================================================
CT_FAQ = [
    ("Is this car towing or car transport?",
     "Transport. Your car rides on a car hauler behind Jose's truck, strapped down at the wheels, and goes straight from pickup to delivery. It is scheduled, not a roadside call."),
    ("Is my car the only one on the trailer?",
     "Yes. Chato's never mixes your car with other customers' cars and never stops at a terminal. If you have two or three of your own vehicles going the same way, Jose can take them on the same trip. More than three gets a custom quote."),
    ("Can you move an electric vehicle like a Tesla?",
     "Yes. EVs are loaded in transport or tow mode and strapped at the wheels like any other car. Have it charged enough to drive on and off the trailer if possible."),
    ("Can you pick up a car I bought from a dealer or auction?",
     "Yes. Send the address, the release paperwork or gate pass if there is one, and a contact name. Jose coordinates the pickup and delivers it to you."),
    ("How much does car transport cost in San Diego?",
     "It depends on miles, the vehicle, and how easy pickup and delivery are to reach. Text the two addresses and the year, make and model for a price."),
]
ct = hero("Car transport in San Diego,<br>one vehicle at a time",
          "Door-to-door car transport on a dedicated car hauler for daily drivers, trucks, EVs, exotics and off-roaders. Local, statewide and out of state.",
          picture("tesla-car-transport", "White Tesla strapped on Chato's car hauler for car transport in San Diego", 1200, 675, cls="bg",
                  mobile="tesla-car-transport-600", wide="tesla-car-transport-wide", priority=True),
          crumbs=[("index.html", "Home"), ("Auto-Transport-San-Diego.html", "Car transport San Diego")], short=True, pos="60% 60%")
ct += f'''
<section class="sec">
  <div class="wrap split">
    <div class="prose">
      <h2>Auto transport that goes straight there</h2>
      <p>Big car carriers load nine or ten cars, follow a route that suits the carrier, and drop vehicles at terminals. Chato's loads one car, drives straight to your delivery address, and unloads it where you want it.</p>
      <p>That makes it a good fit when timing matters, when the car is valuable, or when you simply want to know who has your keys.</p>
      <h3>Cars we move</h3>
      <ul>
        <li><strong>Daily drivers and family cars</strong> for moves, new jobs and college drop-offs</li>
        <li><strong>EVs</strong> like Tesla, loaded in transport mode</li>
        <li><strong>Exotics and sports cars</strong> like Ferrari, loaded slowly with wheel straps</li>
        <li><strong>Trucks and off-roaders</strong>, from half-ton pickups to the INEOS Grenadier</li>
        <li><strong>Classic and collector cars</strong>, covered on our <a href="{R}Classic-Car-Transport-San-Diego.html">classic car transport</a> page</li>
      </ul>
      <h3>Common car transport jobs</h3>
      <ul>
        <li>Dealer and auction pickups in San Diego, Los Angeles and the Inland Empire</li>
        <li>Private-party purchases where you can't drive the car home</li>
        <li>Moves between San Diego and anywhere in California, Arizona or Nevada</li>
        <li>Shop runs: body shop, wrap shop, detailer or mechanic</li>
      </ul>
    </div>
    <div>
      <figure>
        {picture("ferrari-on-car-hauler", "Red Ferrari secured with wheel straps on a car hauler", 738, 983, sizes="(max-width:800px) 100vw, 45vw")}
        <figcaption>Exotic car loaded and strapped for a San Diego delivery.</figcaption>
      </figure>
    </div>
  </div>
</section>
'''
ct += steps_section("How car transport works", [
    ("Send the details", "Year, make and model, pickup and delivery addresses, and when it needs to move."),
    ("Get your price", "One price for the trip. Nothing is booked until you say yes."),
    ("Loaded and strapped", "Photos at pickup, wheel straps on every tire, and a check before rolling."),
    ("Delivered to your door", "Unloaded where you want it, with a walk-around when it arrives."),
])
ct += reels_section("Car transport on video", "A few loads from the last few weeks.", [
    ("car-transport-car-hauler", "INEOS Grenadier strapped on the car hauler"),
    ("classic-chevy-nomad-transport", "1955 Chevy Nomad loaded for delivery"),
    ("fifth-wheel-rv-transport", "Same truck, same driver, pulling a toy hauler"),
])
ct += reviews_section("car", "Car owners on Google and Yelp", concrete=True)
ct += faq_section(CT_FAQ, "Car transport questions")
ct += related([("Classic-Car-Transport-San-Diego.html", "Classic car transport"), ("RV-Transport-San-Diego.html", "RV transport San Diego"), ("index.html", "RV towing San Diego"), ("RV-Towing-Escondido.html", "Transport from Escondido")])
ct += band("Need a car moved?", "Text the year, make and model with the pickup and delivery addresses. You will get a price back fast.")
PAGES.append(("Auto-Transport-San-Diego.html", "0.9"))
write("Auto-Transport-San-Diego.html", page(
    "Auto-Transport-San-Diego.html",
    "Car Transport San Diego | Auto Transport by Chato's",
    "Door-to-door car transport in San Diego on a dedicated car hauler, one vehicle at a time. EVs, exotics, trucks and classics. Call (760) 532-1964.",
    ct,
    [business_schema(), service_schema("Auto-Transport-San-Diego.html", "Car transport", "Door-to-door car transport on a dedicated single-vehicle car hauler from San Diego.", ["San Diego", "Escondido", "Los Angeles"]),
     crumbs_schema([("index.html", "Home"), ("Auto-Transport-San-Diego.html", "Car transport San Diego")]), faq_schema(CT_FAQ)],
    active="Auto-Transport-San-Diego.html"))

# =====================================================================
# CLASSIC CAR TRANSPORT (new)
# =====================================================================
CC_FAQ = [
    ("Do you offer enclosed classic car transport?",
     "Chato's uses an open single-car hauler. Your car is the only vehicle on it, and it goes straight from pickup to delivery, which keeps exposure short. If your car needs fully enclosed transport, ask Jose and he will tell you honestly what fits."),
    ("How do you secure a classic car?",
     "With straps over the tires, so nothing pulls on the frame, the suspension or a fresh paint job. The car is loaded slowly and the straps are checked before it rolls."),
    ("Can you move a classic that doesn't run?",
     "Tell Jose when you call. Whether it can be loaded depends on the car and the spot it is sitting in, and he will tell you up front what it will take."),
    ("Can you take my car to a car show?",
     "Yes. Show and event deliveries are scheduled with time to unload before gates close. Book early for big weekends."),
    ("Are you available outside San Diego?",
     "Yes. Classic cars are moved across California and out of state, including pickups from sellers and auctions."),
]
cc = f'''
<section class="hero split-hero">
  <div class="wrap">
    <div>
      <nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="{R}index.html">Home</a></li><li aria-current="page">Classic car transport San Diego</li></ol></nav>
      <h1>{split_lines("Classic car transport<br>in San Diego")}</h1>
      <p class="lede">Collector and vintage car transport on a dedicated hauler. Wheel straps, slow loading, one car per trip, and a driver who knows what he is carrying.</p>
      <div class="btn-row">{call_btn("hero")}{text_btn("hero", label="Text Jose a photo")}</div>
      <div class="trust"><a href="#reviews">{STARS} <span>5.0 on Google</span></a><span class="es" lang="es">Hablamos español</span></div>
    </div>
    <div class="frame">{picture("classic-chevy-nomad-car-hauler", "1955 Chevy Nomad loaded on Chato's car hauler for classic car transport in San Diego", 576, 1024, priority=True, lazy=False)}</div>
  </div>
</section>
<section class="sec">
  <div class="wrap split">
    <div class="prose">
      <h2>Your classic is the only car on the trailer</h2>
      <p>A classic car is not a commuter car with old paint. Chrome bumpers sit low, original trim breaks if you look at it wrong, and the wrong tie-down point can bend something that cannot be replaced.</p>
      <p>That is why Chato's does classic car transport the slow way: one car, a careful load, straps over the tires instead of hooks on the frame, and a straight drive to the delivery address. No terminals, no shuffling between carriers, no other cars loaded above yours.</p>
      <h3>Classic car transport jobs we handle</h3>
      <ul>
        <li>Car shows and cruise nights around San Diego County</li>
        <li>Restoration, paint and upholstery shop runs</li>
        <li>Buying or selling a collector car in another city or state</li>
        <li>Moving a car in or out of storage or a garage</li>
        <li>Auction pickups and deliveries</li>
      </ul>
      <p>Recent loads include a 1955 Chevy Nomad, vintage convertibles and modern exotics. Whatever you own, Jose will tell you how he plans to load it before he shows up.</p>
    </div>
    <figure class="reel">
      <video muted loop playsinline preload="none" data-autoplay data-src="{R}video/classic-chevy-nomad-transport.mp4" poster="{R}video/classic-chevy-nomad-transport-poster.webp" width="432" height="768" aria-label="1955 Chevy Nomad on Chato's car hauler"></video>
      <figcaption style="color:var(--steel)">1955 Chevy Nomad, strapped at the wheels and ready to deliver.</figcaption>
    </figure>
  </div>
</section>
<section class="sec concrete">
  <div class="wrap">
    <div class="sec-head"><h2>Recent classic and specialty loads</h2><p>Photos from real Chato's jobs.</p></div>
    <div class="gallery">
      {picture("classic-chevy-nomad-car-hauler", "1955 Chevy Nomad on a car hauler, front three-quarter view", 576, 1024, sizes="(max-width:600px) 50vw, 33vw")}
      {picture("classic-convertibles-car-hauler", "Two vintage convertibles on a car hauler outside a garage", 680, 510, sizes="(max-width:600px) 50vw, 33vw")}
      {picture("classic-car-transport-chevy-nomad", "White RAM 3500 pulling a classic Chevy Nomad on a car hauler", 576, 1024, sizes="(max-width:600px) 50vw, 33vw")}
    </div>
  </div>
</section>
'''
cc += steps_section("How classic car transport works", [
    ("Tell Jose about the car", "Year, make and model, whether it runs, ground clearance, and where it is parked."),
    ("Plan the load", "He tells you how he will load and strap it, and gives you a price for the trip."),
    ("Careful pickup", "Photos before loading, straps over the tires, and a final check before rolling."),
    ("Straight to delivery", "No terminals or transfers. Unloaded at the show, the shop or your garage."),
])
cc += reviews_section("car", "Owners trust Jose with what matters", concrete=False)
cc += faq_section(CC_FAQ, "Classic car transport questions")
cc += related([("Auto-Transport-San-Diego.html", "Car transport San Diego"), ("blog/open-car-hauler-vs-enclosed-classic-car-transport.html", "Open vs enclosed classic car transport"), ("RV-Transport-San-Diego.html", "RV transport San Diego"), ("index.html", "RV towing San Diego")])
cc += band("Moving a classic?", "Send a photo of the car and where it is parked. Jose will tell you how he will load it and what it costs.")
PAGES.append(("Classic-Car-Transport-San-Diego.html", "0.9"))
write("Classic-Car-Transport-San-Diego.html", page(
    "Classic-Car-Transport-San-Diego.html",
    "Classic Car Transport San Diego | Collector Car Hauling",
    "Classic and collector car transport in San Diego. One car per trip, wheel straps, no terminals. Shows, shops, auctions and storage. Call (760) 532-1964.",
    cc,
    [business_schema(), service_schema("Classic-Car-Transport-San-Diego.html", "Classic car transport", "Single-vehicle classic and collector car transport from San Diego with wheel-strap tie-downs.", ["San Diego", "Escondido", "Los Angeles"]),
     crumbs_schema([("index.html", "Home"), ("Classic-Car-Transport-San-Diego.html", "Classic car transport San Diego")]), faq_schema(CC_FAQ)],
    active="Classic-Car-Transport-San-Diego.html"))

exec(open(os.path.join(os.path.dirname(__file__), "content_cities.py"), encoding="utf-8").read())
