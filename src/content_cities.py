# City pages (existing, already indexed URLs) + blog + utility files.

def city_page(c):
    global R
    R = ""
    path = c["path"]
    trail = [("index.html", "Home"), (path, c["crumb"])]
    img = picture(c["img"], c["img_alt"], c["img_w"], c["img_h"], cls="bg", mobile=c.get("img_m"), wide=c.get("img_wide"),
                  widths=c.get("img_widths"), priority=True)
    body = hero(c["h1"], c["lede"], img, crumbs=trail, short=True, pos=c.get("pos", "60% 55%"))
    body += ticker()
    jobs = "".join(f"<li>{j}</li>" for j in c["jobs"])
    body += f'''
<section class="sec">
  <div class="wrap split">
    <div class="prose">
      <h2>{c["h2"]}</h2>
      {c["intro"]}
      <h3>{c["jobs_title"]}</h3>
      <ul>{jobs}</ul>
      {c["more"]}
      <div class="btn-row" style="margin-top:24px">{call_btn("city_section")}{text_btn("city_section", cls="btn btn-ghost", label="Text a photo")}</div>
    </div>
    <figure>
      {picture(c["side"], c["side_alt"], c["side_w"], c["side_h"], sizes="(max-width:800px) 100vw, 45vw")}
      <figcaption>{c["side_cap"]}</figcaption>
    </figure>
  </div>
</section>
<section class="sec concrete">
  <div class="wrap split">
    <div class="prose">
      <h2>{c["rvt_h2"]}</h2>
      {c["rvt"]}
      <p><a class="textlink" href="{R}RV-Transport-San-Diego.html">More on long-distance RV transport</a></p>
    </div>
    <div class="prose">
      <h2>Car transport in {c["short"]} too</h2>
      <p>The same truck pulls a dedicated car hauler. Chato's moves daily drivers, EVs, exotics and collector cars from {c["short"]} one vehicle at a time, door to door, with wheel straps on every tire.</p>
      <p><a class="textlink" href="{R}Auto-Transport-San-Diego.html">Car transport</a> &nbsp; <a class="textlink" href="{R}Classic-Car-Transport-San-Diego.html">Classic car transport</a></p>
    </div>
  </div>
</section>
'''
    body += zips_block(c["short"], c["zips"], c["hoods"])
    body += reviews_section(c.get("tag", "rv"), f"Why {c['short']} RV owners call Jose", concrete=False)
    body += faq_section(c["faq"], f"RV towing in {c['short']}: common questions")
    body += sign_section(current=path, title="Other cities we serve", intro="Chato's covers all of San Diego County and southwest Riverside County from its Escondido base.")
    body += band(f"Moving an RV in {c['short']}?", "Text the pickup spot, the drop-off and the RV length. Jose will reply with a price.")
    PAGES.append((path, "0.8"))
    write(path, page(path, c["title"], c["desc"], body,
                     [business_schema(),
                      service_schema(path, c["service"], c["desc"], c["area"]),
                      crumbs_schema(trail), faq_schema(c["faq"])]))

CITY_DATA = [
dict(
    path="RV-Towing-Escondido.html", zips=["92025","92026","92027","92029"], hoods=["Hidden Meadows","Felicita","Rancho San Pasqual","San Pasqual Valley","Old Escondido"], tag="escondido", short="Escondido", crumb="RV towing Escondido",
    title="RV Towing Escondido, CA | RV & Car Transport | Chato's",
    desc="RV towing in Escondido from a local, owner-operated company. Fifth wheels, travel trailers and toy haulers moved across North County. Call (760) 532-1964.",
    service="RV towing in Escondido", area=["Escondido", "San Marcos", "Valley Center", "Rancho Bernardo"],
    h1="RV towing in Escondido, from right here in Escondido",
    lede="Chato's is based in Escondido, so North County RV moves are close to home. Fifth wheels, travel trailers and toy haulers, moved by the owner.",
    img="fifth-wheel-move-sunset", img_alt="RAM 3500 dually hitched to a fifth wheel in North County San Diego", img_w=1440, img_h=810,
    img_m="fifth-wheel-move-sunset-600", img_wide="fifth-wheel-move-sunset-wide", pos="55% 60%",
    h2="Escondido is home base",
    intro="<p>Most RV towing companies that show up in a search for Escondido are dispatching from somewhere else. Chato's truck lives here, which means shorter wait times for jobs in Escondido, San Marcos, Valley Center, Hidden Meadows and Rancho Bernardo.</p><p>Escondido also has some of the trickiest RV access in the county. Hillside homes off Bear Valley Parkway, long gravel drives in the San Pasqual Valley and steep lots in Hidden Meadows are everyday jobs for Jose, not reasons to say no.</p>",
    jobs_title="RV towing jobs around Escondido",
    jobs=["Storage lot to driveway, and back again after the trip",
          "Setting fifth wheels at Escondido RV Resort and other local parks",
          "Hillside and gravel driveways in Hidden Meadows, Valley Center and San Pasqual",
          "Trips up SR-76 and SR-79 toward Palomar Mountain, Lake Henshaw and Warner Springs",
          "Dealer pickups up I-15 in Temecula and Murrieta"],
    more="<p>Not sure your spot is reachable with a 40-foot fifth wheel? Text a photo of the driveway or street. Jose will tell you straight.</p>",
    side="ram-3500-fifth-wheel-solitude", side_alt="White RAM 3500 hitched to a Grand Design Solitude fifth wheel", side_w=382, side_h=510,
    side_cap="Fifth wheel hitched and ready to move out of an RV lot.",
    rvt_h2="RV transport out of Escondido",
    rvt="<p>Escondido sits right on I-15 and SR-78, which makes it an easy start for long-distance RV transport north to the Inland Empire, Los Angeles and the Central Valley, or east to Arizona and Nevada. Bought a trailer out of the area? Jose can pick it up and bring it home to Escondido.</p>",
    faq=[("How fast can you get to me in Escondido?", "Escondido is where the truck is parked, so local jobs are often scheduled the same day or next day. Call for anything urgent."),
         ("Can you get a fifth wheel up a steep driveway?", "Usually, yes. Steep and narrow driveways are common in Escondido. Send a photo of the driveway and the parking spot, and Jose will tell you before booking."),
         ("Do you serve San Marcos and Valley Center?", "Yes. San Marcos, Valley Center, Hidden Meadows, Rancho Bernardo, Ramona and Poway are all part of the regular North County area.")]),
dict(
    path="RV-Towing-Temecula.html", zips=["92590","92591","92592","92562","92563","92584","92595"], hoods=["Temecula","Murrieta","French Valley","Menifee","Wildomar"], tag="temecula", short="Temecula", crumb="RV towing Temecula",
    title="RV Towing Temecula & Murrieta | RV Transport | Chato's",
    desc="RV towing and RV transport in Temecula and Murrieta. Dealer pickups, RV park moves and long-distance hauls for fifth wheels and trailers. Call (760) 532-1964.",
    service="RV towing in Temecula and Murrieta", area=["Temecula", "Murrieta", "Menifee", "Fallbrook"],
    h1="RV towing in Temecula &amp; Murrieta",
    lede="Bought a fifth wheel in Temecula and don't have the truck to bring it home? Chato's picks up from dealers and private sellers and delivers anywhere in Southern California.",
    img="rv-transport-fifth-wheel-rear", img_alt="Rear of a Riverstone fifth wheel being transported by Chato's", img_w=1400, img_h=1050,
    img_m="rv-transport-fifth-wheel-rear-m", img_widths=[("-800", 800), ("", 1400)], pos="45% 55%",
    h2="Temecula is where a lot of RVs get bought",
    intro="<p>Temecula and Murrieta have one of the biggest clusters of RV dealers in Southern California. That is great for shopping and not so great when your new 38-foot fifth wheel needs a three-quarter-ton truck you don't own yet.</p><p>Chato's handles the delivery. Jose meets you or the dealer, checks the hitch, lights and tires, and tows it home to San Diego County, your storage lot, or the campground for your first trip.</p>",
    jobs_title="Temecula and Murrieta RV jobs",
    jobs=["Dealer pickups from Giant RV in Murrieta, Camping World of Temecula, Richardson's RV Centers and RV SuperCenter",
          "Private-party purchases anywhere in the Temecula Valley",
          "Moves to and from Pechanga RV Resort, Vail Lake and Lake Skinner",
          "Storage to home moves in Temecula, Murrieta, Menifee and French Valley",
          "Tows down I-15 to Escondido, San Diego and the rest of the county"],
    more="<p>Buying from a dealer? Ask them to have the RV prepped for road travel and send Jose the salesperson's name and number. He'll coordinate the pickup time directly.</p>",
    side="fifth-wheel-pickup-rv-lot-800", side_alt="White RAM 3500 hooked to a fifth wheel at an RV lot", side_w=800, side_h=600,
    side_cap="Pickup at an RV lot, hitched and ready to deliver.",
    rvt_h2="RV transport from Temecula",
    rvt="<p>Temecula sits between San Diego and the Inland Empire on I-15, with I-215 heading north. Chato's runs RV transport from here to Los Angeles, Orange County, the Central Valley and Arizona, as well as the short trip south into San Diego County.</p>",
    faq=[("Can you pick up an RV from a Temecula dealer for me?", "Yes. Send the dealer name, the salesperson's contact and the delivery address. Jose coordinates the pickup and walks the RV with the dealer before towing."),
         ("Do you cover Murrieta and Menifee?", "Yes. Temecula, Murrieta, Menifee, French Valley, Wildomar and Fallbrook are all covered."),
         ("Can you deliver my new RV straight to a campground?", "Yes. Give Jose the campground name and site number, and he can set it on the site for you.")]),
dict(
    path="RV-Towing-Oceanside.html", zips=["92054","92056","92057","92058","92055"], hoods=["Fire Mountain","Mission Del Oro","Ocean Hills","Rancho del Oro","Camp Pendleton"], tag="oceanside", short="Oceanside", crumb="RV towing Oceanside",
    title="RV Towing Oceanside, CA | RV Transport | Chato's",
    desc="RV towing in Oceanside for fifth wheels and travel trailers. RV park moves, storage runs and military relocations near Camp Pendleton. Call (760) 532-1964.",
    service="RV towing in Oceanside", area=["Oceanside", "Carlsbad", "Vista", "Camp Pendleton"],
    h1="RV towing in Oceanside",
    lede="Coastal RV moves in Oceanside, Carlsbad and Vista, from beachfront RV parks to storage lots off SR-76. Owner-operated, with photo updates every time.",
    img="fifth-wheel-palm-street", img_alt="Fifth wheel and RAM 3500 on a palm-lined street in coastal San Diego County", img_w=1200, img_h=675,
    img_m="fifth-wheel-palm-street-600", img_wide="fifth-wheel-palm-street-wide", pos="60% 55%",
    h2="Coastal RV towing, done carefully",
    intro="<p>Oceanside RV moves come with their own challenges: tight beach streets, parks with narrow interior roads, and sites where you back in between neighbors with inches to spare. Jose takes it slow and gets it right the first time.</p><p>Oceanside is also home to a lot of military families. If you are moving on or off Camp Pendleton, Chato's can tow your RV to the new duty station or to storage while you settle in.</p>",
    jobs_title="Oceanside RV towing jobs",
    jobs=["Moves in and out of Paradise by the Sea RV Resort and Oceanside RV Resort",
          "Campground trips to Guajome Regional Park",
          "Storage runs along SR-76 and Mission Avenue",
          "Military relocations for Camp Pendleton families",
          "Coastal moves in Carlsbad, Vista and San Marcos"],
    more="<p>RVs parked near the ocean pick up salt. If your fifth wheel has been sitting at the coast for a while, check the tires and brake wiring before a long tow. Jose will point out anything he sees at pickup.</p>",
    side="rv-towing-on-the-road-600", side_alt="Chato's truck towing a fifth wheel on a coastal road", side_w=600, side_h=800,
    side_cap="On the road with a fifth wheel in North County.",
    rvt_h2="RV transport from Oceanside",
    rvt="<p>From Oceanside, I-5 runs north to Orange County and Los Angeles, and SR-76 connects east to I-15. Chato's handles one-way RV transport from the coast to anywhere in California and out of state.</p>",
    faq=[("Can you move an RV for a military PCS from Camp Pendleton?", "Yes. Tell Jose the base gate or housing area, the destination and your timeline, and he will plan the move around your orders."),
         ("Can you back a fifth wheel into a tight beach RV site?", "Yes, that is everyday work. Send the park name and site number so Jose knows what to expect."),
         ("Do you cover Carlsbad and Vista?", "Yes. Carlsbad, Vista, San Marcos and Fallbrook are all part of the North County coastal area.")]),
dict(
    path="RV-Towing-El-Cajon.html", zips=["92019","92020","92021","92040","91941","91942","91901"], hoods=["Fletcher Hills","Granite Hills","Rancho San Diego","Lakeside","La Mesa","Alpine"], tag="elcajon", short="El Cajon", crumb="RV towing El Cajon",
    title="RV Towing El Cajon, CA | RV Transport | Chato's",
    desc="RV towing in El Cajon, Santee and Lakeside. RV park moves, storage runs and desert trips east on I-8 for fifth wheels and toy haulers. Call (760) 532-1964.",
    service="RV towing in El Cajon", area=["El Cajon", "Santee", "Lakeside", "La Mesa", "Alpine"],
    h1="RV towing in El Cajon, Santee &amp; Lakeside",
    lede="East County RV towing for fifth wheels, travel trailers and toy haulers. RV parks, storage lots and desert runs out I-8.",
    img="fifth-wheel-driveway-move", img_alt="Fifth wheel being backed into a residential driveway in East County San Diego", img_w=1200, img_h=675,
    img_m="fifth-wheel-driveway-move-600", img_wide="fifth-wheel-driveway-move-wide", pos="55% 60%",
    h2="East County is RV country",
    intro="<p>El Cajon, Santee and Lakeside have more RV parks and storage lots than almost anywhere in San Diego County, plus I-8 heading straight east toward the desert. That adds up to a lot of RVs on the move.</p><p>Chato's handles the in-county moves between parks and storage, and the long pulls up the I-8 grades for owners who would rather not tow a heavy fifth wheel up the mountain themselves.</p>",
    jobs_title="El Cajon RV towing jobs",
    jobs=["Moves to and from Vacationer RV Resort and Circle RV Resort",
          "Lakeside trips to Rancho Los Coches RV Park",
          "Santee Lakes Recreation Preserve campground drop-offs",
          "Storage lot runs across El Cajon, Santee, Lakeside and La Mesa",
          "Toy hauler trips east on I-8 toward Anza-Borrego and the Imperial Sand Dunes"],
    more="<p>Summer heat in East County is hard on tires that have been sitting. Before a long tow, check tire age and pressure. Jose will look them over at pickup too.</p>",
    side="toy-hauler-towing-mountains", side_alt="RAM 3500 towing a toy hauler on a wooded mountain road", side_w=736, side_h=1068,
    side_cap="Toy hauler on a mountain road, the kind of grade I-8 is known for.",
    rvt_h2="RV transport from El Cajon",
    rvt="<p>El Cajon is the jumping-off point for I-8 east to Imperial County and Arizona, and SR-67 north toward Ramona. Chato's runs RV transport from East County to anywhere in California, Arizona and beyond.</p>",
    faq=[("Can you tow my toy hauler to the Imperial Sand Dunes?", "Yes. Trips east on I-8 to the dunes and Anza-Borrego are common for East County toy hauler owners. Book early for holiday weekends."),
         ("Do you cover Santee, Lakeside and La Mesa?", "Yes. Santee, Lakeside, La Mesa, Alpine, Spring Valley and Rancho San Diego are all covered."),
         ("Can you move an RV between two parks on the same day?", "Yes. Park-to-park moves are usually same-day jobs. Send both park names and site numbers.")]),
dict(
    path="RV-transport-Chula-Vista.html", zips=["91910","91911","91913","91914","91915","91902","91950"], hoods=["Eastlake","Otay Ranch","Rancho del Rey","Bonita","National City"], tag="rv", short="Chula Vista", crumb="RV transport Chula Vista",
    title="RV Transport Chula Vista | RV Towing | Chato's",
    desc="RV transport and RV towing in Chula Vista and the South Bay. RV parks, Otay Mesa storage and long-distance moves for fifth wheels. Call (760) 532-1964.",
    service="RV transport in Chula Vista", area=["Chula Vista", "National City", "Bonita", "Otay Mesa", "San Ysidro"],
    h1="RV transport &amp; towing in Chula Vista",
    lede="South Bay RV moves for fifth wheels, travel trailers and toy haulers. Bayfront RV parks, Otay Mesa storage and long-distance transport.",
    img="rv-towing-on-the-road", img_alt="Chato's RAM 3500 towing a fifth wheel on a South Bay road", img_w=1200, img_h=675,
    img_m="rv-towing-on-the-road-600", img_wide="rv-towing-on-the-road-wide", pos="55% 60%",
    h2="South Bay RV moves without the drive",
    intro="<p>Chula Vista has some of the best-located RV parks in the county, right on the bay, and a lot of RV storage out toward Otay Mesa. Getting a big fifth wheel between the two through South Bay traffic is exactly the kind of job Chato's takes off your plate.</p><p>Jose covers Chula Vista, National City, Bonita, Eastlake, Otay Ranch and San Ysidro, with I-5, I-805 and SR-125 all within a few minutes.</p>",
    jobs_title="Chula Vista RV jobs",
    jobs=["Moves to and from Chula Vista RV Resort and Sun Outdoors San Diego Bay",
          "Campground trips to Sweetwater Summit Regional Park",
          "Drop-offs at KOA San Diego Metro and La Pacifica RV Park",
          "Storage lot runs around Otay Mesa and Eastlake",
          "Relocations for full-time RVers moving to or from the South Bay"],
    more="<p>Heading to a bayfront park? Many have assigned arrival windows. Send Jose your check-in time and he will plan the pickup around it.</p>",
    side="fifth-wheel-palm-street-600", side_alt="Fifth wheel parked on a palm-lined street after an RV move", side_w=600, side_h=800,
    side_cap="Fifth wheel delivered on a South Bay street.",
    rvt_h2="Long-distance RV transport from Chula Vista",
    rvt="<p>From the South Bay, Chato's transports RVs north on I-5 and I-805 to the rest of California, and east on I-8 to Arizona. Moving across the country with a full-time rig? Call to talk through the route.</p>",
    faq=[("Do you cover National City and Bonita?", "Yes. National City, Bonita, Eastlake, Otay Ranch, Imperial Beach and San Ysidro are all covered."),
         ("Can you pick my RV up from storage in Otay Mesa?", "Yes. Send the storage facility name and your space number, and make sure the gate code or access is arranged."),
         ("Can you move my RV between two Chula Vista parks?", "Yes. Park-to-park moves in the South Bay are usually same-day jobs.")]),
dict(
    path="RV-transport-Imperial-Beach.html", zips=["91932","92154","92118","92173"], hoods=["Imperial Beach","Nestor","Otay Mesa West","Coronado","San Ysidro"], tag="rv", short="Imperial Beach", crumb="RV transport Imperial Beach",
    title="RV Transport Imperial Beach | RV Towing | Chato's",
    desc="RV transport and towing in Imperial Beach, Coronado and the South Bay. Beach campgrounds, storage and desert trips for toy haulers. Call (760) 532-1964.",
    service="RV transport in Imperial Beach", area=["Imperial Beach", "Coronado", "Nestor", "San Ysidro"],
    h1="RV transport in Imperial Beach",
    lede="RV towing and transport at the southern tip of San Diego, from Silver Strand to the Tijuana River Valley, plus toy hauler runs out to the desert.",
    img="toy-hauler-towing-mountains", img_alt="RAM 3500 towing a toy hauler for an RV transport job", img_w=736, img_h=1068,
    pos="50% 65%",
    h2="Imperial Beach, not Imperial County",
    intro="<p>People search for RV transport in Imperial Beach for two reasons: they live in IB, or they are headed out to the sand dunes in Imperial County. Chato's does both. Local moves around Imperial Beach, Coronado, Nestor and the Tijuana River Valley, and long tows east on I-8 for toy hauler owners.</p><p>Beach streets in IB are narrow and parking is tight. Jose plans the approach before he arrives so your RV gets in and out without a three-point turn on Seacoast Drive.</p>",
    jobs_title="Imperial Beach RV jobs",
    jobs=["Campground drop-offs at Silver Strand State Beach",
          "Moves to and from the Tijuana River Valley Regional Park campground",
          "Storage runs between Imperial Beach, Nestor and Otay Mesa",
          "Toy hauler tows east on I-8 to the Imperial Sand Dunes",
          "Coronado and Silver Strand moves for military and seasonal residents"],
    more="<p>Planning a dunes weekend? Book the tow out and the tow back at the same time, especially for holiday weekends when everyone heads east.</p>",
    side="rv-transport-seismic-toy-hauler", side_alt="Jayco Seismic toy hauler hitched to Chato's truck", side_w=576, side_h=1024,
    side_cap="Toy hauler hitched for a desert run.",
    rvt_h2="RV transport from Imperial Beach",
    rvt="<p>Imperial Beach connects to I-5 in minutes, with I-805 and I-8 close by. Chato's moves RVs from IB to anywhere in San Diego County, across California, and out to Arizona.</p>",
    faq=[("Do you tow toy haulers to the dunes in Imperial County?", "Yes. Tows from Imperial Beach and the South Bay out I-8 to the Imperial Sand Dunes are common. Book both directions ahead for busy weekends."),
         ("Can you get an RV into Silver Strand State Beach?", "Yes. Send your reservation dates and site number, and Jose will plan the drop-off around check-in."),
         ("Do you cover Coronado?", "Yes. Coronado, Nestor, San Ysidro and Chula Vista are covered from Imperial Beach.")]),
]


CITY_DATA += [
dict(
    path="RV-Towing-San-Marcos.html", zips=["92069","92078","92096"], hoods=["San Elijo Hills","Lake San Marcos","Twin Oaks Valley","Santa Fe Hills","Cal State San Marcos"], tag="sanmarcos",
    short="San Marcos", crumb="RV towing San Marcos",
    title="RV Towing San Marcos, CA | RV & Car Transport | Chato's",
    desc="RV towing and RV moving in San Marcos, next door to Chato's Escondido base. Fifth wheels, travel trailers and tight driveways. Fair quote guaranteed.",
    service="RV towing in San Marcos", area=["San Marcos", "San Elijo Hills", "Lake San Marcos", "Escondido"],
    h1="RV towing in San Marcos",
    lede="San Marcos is next door to Chato's home base in Escondido. Fast scheduling for fifth wheels, travel trailers and toy haulers along the 78 corridor.",
    img="fifth-wheel-pickup-rv-lot", img_alt="Fifth wheel hitched to a RAM 3500 at an RV lot near San Marcos", img_w=1600, img_h=1200,
    img_m="fifth-wheel-pickup-rv-lot-m", img_widths=[("-800", 800), ("", 1600)], pos="62% 55%",
    h2="Ten minutes from Jose's driveway",
    intro="<p>Chato's truck is parked just up SR-78 in Escondido, so San Marcos jobs are some of the quickest to schedule. Hillside streets in San Elijo Hills, gated communities around Lake San Marcos and long driveways in Twin Oaks Valley are all familiar ground.</p><p>One San Marcos customer has called Jose back three times, including the day he set a 43-foot fifth wheel into a space that, in her words, it should have never fit.</p>",
    jobs_title="San Marcos RV jobs",
    jobs=["Storage lot to home moves along SR-78 and San Marcos Boulevard",
          "Backing fifth wheels into tight side yards and HOA-friendly spots",
          "Moves for Cal State San Marcos families and new residents",
          "Twin Oaks Valley ranch and long gravel driveways",
          "Dealer pickups from Temecula and Murrieta up I-15"],
    more="<p>HOA rules on RV parking? Tell Jose the time window you have and he will plan the drop-off around it.</p>",
    side="ram-3500-fifth-wheel-solitude", side_alt="RAM 3500 hitched to a fifth wheel ready to move", side_w=382, side_h=510,
    side_cap="Hitched and ready for a short North County move.",
    rvt_h2="RV transport from San Marcos",
    rvt="<p>SR-78 connects San Marcos to I-5 and I-15 in minutes. From here Chato's runs RVs north to Orange County, Los Angeles and Sacramento, and east to Nevada and Arizona.</p>",
    faq=[("How fast can you get to San Marcos?", "San Marcos is next door to Escondido, where the truck is parked. Same-day and next-day moves are often possible. Call for anything urgent."),
         ("Can you put my fifth wheel in a tight side yard?", "Usually, yes. Tight side yards are Jose's specialty. Send a photo of the gate and the space so he can tell you before booking."),
         ("Do you also cover Vista and Escondido?", "Yes. Vista, Escondido, Valley Center and Carlsbad are all close by.")]),
dict(
    path="RV-Towing-Carlsbad.html", zips=["92008","92009","92010","92011"], hoods=["La Costa","Aviara","Bressi Ranch","Calavera Hills","the Village","South Carlsbad"], tag="carlsbad",
    short="Carlsbad", crumb="RV towing Carlsbad",
    title="RV Towing Carlsbad, CA | RV Transport | Chato's",
    desc="RV towing and RV transport in Carlsbad: beach campgrounds, storage runs and tight coastal streets. Owner-operated, fair quote guaranteed. Call (760) 532-1964.",
    service="RV towing in Carlsbad", area=["Carlsbad", "La Costa", "Encinitas", "Oceanside"],
    h1="RV towing in Carlsbad",
    lede="Coastal RV moves in Carlsbad, La Costa and Encinitas. Beach campgrounds, storage lots and tight neighborhood streets, handled by the owner.",
    img="fifth-wheel-towing-san-diego", img_alt="RAM 3500 towing a large fifth wheel through a residential street", img_w=1600, img_h=1200,
    img_m="fifth-wheel-towing-san-diego-m", img_widths=[("-800", 800), ("-1200", 1200), ("", 1600)], pos="72% 55%",
    h2="Carlsbad RV moves, done right the first time",
    intro="<p>Carlsbad RV owners usually store their rigs inland and bring them to the coast for trips, or the other way around. Getting a 40-foot fifth wheel through the Village or up a La Costa hillside takes patience and a driver who has done it before.</p><p>Jose plans the approach before he arrives, keeps you posted on the way, and sets the RV where you want it.</p>",
    jobs_title="Carlsbad RV jobs",
    jobs=["Campground drop-offs and pickups at South Carlsbad State Beach",
          "Storage lot runs between Carlsbad, Vista and San Marcos",
          "Hillside and HOA moves in La Costa, Aviara and Calavera Hills",
          "Coastal moves to Encinitas, Leucadia and Oceanside",
          "Car transport for Carlsbad dealers and private sales"],
    more="<p>Beach campsites book months out. Give Jose your reservation dates as soon as you have them.</p>",
    side="fifth-wheel-palm-street-600", side_alt="Fifth wheel delivered on a palm-lined coastal street", side_w=600, side_h=800,
    side_cap="Coastal delivery under the palms.",
    rvt_h2="RV transport from Carlsbad",
    rvt="<p>I-5 runs right through Carlsbad, north to Orange County and Los Angeles. One Encinitas customer had Jose bring a motorhome all the way from Arizona. Long distance is everyday work.</p>",
    faq=[("Can you drop my RV at South Carlsbad State Beach?", "Yes. Send your reservation dates and site number, and Jose will plan the drop-off around check-in."),
         ("Do you cover Encinitas and Leucadia?", "Yes. Encinitas, Leucadia, Cardiff, Oceanside and Vista are all covered."),
         ("Can you move a motorhome?", "Yes. Jose has moved motorhomes, including one from Arizona to the San Diego coast. Call to talk through your model.")]),
dict(
    path="RV-Towing-Ramona.html", zips=["92065","92036","92070"], hoods=["San Diego Country Estates","Ramona Oaks","Julian","Santa Ysabel","Wynola"], tag="ramona",
    short="Ramona", crumb="RV towing Ramona",
    title="RV Towing Ramona, CA | Ranch & Backcountry RV Moves | Chato's",
    desc="RV towing in Ramona, Julian and the backcountry. Ranch properties, gravel drives and mountain roads for fifth wheels, trailers and tiny homes. Fair quote guaranteed.",
    service="RV towing in Ramona", area=["Ramona", "San Diego Country Estates", "Julian", "Santa Ysabel"],
    h1="RV towing in Ramona &amp; the backcountry",
    lede="Ranch drives, gravel pads and mountain roads. Fifth wheels, travel trailers and tiny homes moved in Ramona, Julian and San Diego Country Estates.",
    img="toy-hauler-towing-mountains", img_alt="RAM 3500 towing a toy hauler on a wooded mountain road", img_w=736, img_h=1068, pos="50% 65%",
    h2="Backcountry RV moves need backcountry experience",
    intro="<p>Ramona is horse country: long gravel driveways, tight turns past barns and fences, and RV pads that sit at the bottom of a slope. Up the hill in Julian and Santa Ysabel, the roads get narrower and steeper.</p><p>That is exactly where Jose's experience shows. One Fallbrook customer watched him pull a 45-foot tiny home trailer onto their ranch and called him extremely careful and a very skilled driver.</p>",
    jobs_title="Ramona and backcountry jobs",
    jobs=["Ranch and horse property moves with long gravel drives",
          "Tiny home and park model deliveries to rural lots",
          "Campground trips to Dos Picos County Park",
          "Mountain runs up SR-78 and SR-79 to Julian and Santa Ysabel",
          "Desert trips down to Borrego Springs and Anza-Borrego"],
    more="<p>If the ground is soft after rain, a heavy trailer can sink. Text Jose a photo of the pad and the drive so he can plan for it.</p>",
    side="toy-hauler-towing-mountains", side_alt="Toy hauler being towed on a mountain road", side_w=736, side_h=1068,
    side_cap="Mountain roads are part of the job.",
    rvt_h2="RV transport from Ramona",
    rvt="<p>SR-67 drops into Poway and I-15, and SR-78 heads east to Julian and the desert. Chato's moves RVs from Ramona to anywhere in California, Nevada and Arizona, and recently set a park model from Palm Desert into a tight space in Borrego.</p>",
    faq=[("Can you get a fifth wheel down a long gravel driveway?", "Usually, yes. Send photos of the drive, the turns and the pad. Jose will tell you honestly if it is doable and how he would do it."),
         ("Do you deliver tiny homes and park models?", "Yes. Jose has delivered a 45-foot tiny home trailer to a ranch and set a park model RV in Borrego."),
         ("Do you go up to Julian?", "Yes. Julian, Santa Ysabel, Wynola and Warner Springs are all covered.")]),
dict(
    path="RV-Towing-Santee.html", zips=["92071","92040","92019","92020"], hoods=["Carlton Hills","Carlton Oaks","Sky Ranch","Fanita Ranch","Lakeside"], tag="santee",
    short="Santee", crumb="RV towing Santee",
    title="RV Towing Santee, CA | RV Moving & Transport | Chato's",
    desc="RV towing and RV moving in Santee and Lakeside. Santee Lakes, Mission Trails and East County storage runs for fifth wheels and toy haulers. Call (760) 532-1964.",
    service="RV towing in Santee", area=["Santee", "Lakeside", "El Cajon"],
    h1="RV towing in Santee",
    lede="RV moves around Santee Lakes, Mission Trails and the East County storage lots. Fifth wheels, travel trailers and toy haulers, with a fair quote guaranteed.",
    img="fifth-wheel-driveway-move", img_alt="Fifth wheel set in a residential driveway in East County", img_w=1200, img_h=675,
    img_m="fifth-wheel-driveway-move-600", img_wide="fifth-wheel-driveway-move-wide", pos="55% 60%",
    h2="Santee RV owners have options. Jose makes it easy",
    intro="<p>Between Santee Lakes, Mission Trails and the storage lots along SR-52 and SR-67, Santee might have more RVs per street than anywhere in the county. That means a lot of short moves: storage to home, home to campground, and back again.</p><p>When another driver cancelled on a Lakeside customer at 5:30 in the morning, Jose stepped in and got her fifth wheel moved that day.</p>",
    jobs_title="Santee RV jobs",
    jobs=["Campground drop-offs at Santee Lakes Recreation Preserve",
          "Kumeyaay Lake Campground trips in Mission Trails Regional Park",
          "Storage runs along SR-52, SR-67 and Mission Gorge Road",
          "Moves to Lakeside, El Cajon and Alpine",
          "Toy hauler trips east on I-8 toward the desert"],
    more="<p>Your driver cancelled? Call Jose directly instead of texting so he can tell you right away what he can do.</p>",
    side="rv-towing-on-the-road-600", side_alt="RAM 3500 towing a fifth wheel on an East County road", side_w=600, side_h=800,
    side_cap="On the road with a fifth wheel.",
    rvt_h2="RV transport from Santee",
    rvt="<p>SR-52 links Santee to I-15 and I-5, and SR-125 to I-8. Chato's moves RVs from Santee to anywhere in California, and out to Nevada and Arizona.</p>",
    faq=[("Can you drop my RV at Santee Lakes?", "Yes. Send your reservation dates and site number, and Jose will plan the drop-off around check-in."),
         ("My driver cancelled. Can you help today?", "Call Jose directly. Same-day moves depend on the schedule, but he will give you an honest answer right away."),
         ("Do you cover Lakeside?", "Yes. Lakeside, El Cajon, Alpine and La Mesa are all covered.")]),
]

for c in CITY_DATA:
    city_page(c)

# =====================================================================
# LONG-DISTANCE ROUTE PAGES
# =====================================================================
def route_page(rt):
    global R
    R = ""
    path = rt["path"]
    trail = [("index.html", "Home"), ("RV-Transport-San-Diego.html", "RV transport San Diego"), (path, rt["crumb"])]
    img = picture(rt["img"], rt["img_alt"], rt["img_w"], rt["img_h"], cls="bg", mobile=rt.get("img_m"), wide=rt.get("img_wide"), widths=rt.get("img_widths"), priority=True)
    body = hero(rt["h1"], rt["lede"], img, crumbs=trail, short=True, pos=rt.get("pos", "60% 55%"))
    body += ticker()
    facts = "".join(f"<li><b>{a}</b><span>{b}</span></li>" for a, b in rt["facts"])
    body += f"""
<section class="sec">
  <div class="wrap split">
    <div class="prose">
      <h2>{rt["h2"]}</h2>
      {rt["intro"]}
      <h3>What we move on this route</h3>
      <ul>{"".join(f"<li>{x}</li>" for x in rt["moves"])}</ul>
      <div class="btn-row" style="margin-top:24px">{call_btn("route_section")}{text_btn("route_section", cls="btn btn-ghost", label="Text the route")}</div>
    </div>
    <div>
      <ul class="states route-facts">{facts}</ul>
      <p class="fine">Mileage is approximate, one way, by the usual highway route.</p>
    </div>
  </div>
</section>
"""
    body += map_section(rt["map_title"], rt["map_intro"])
    body += steps_section("How a long-distance move works", [
        ("Send the route", "Pickup and delivery addresses, your dates, and the RV or vehicle details."),
        ("Get a fair quote", "One honest price for the whole trip. Nothing is booked until you say yes."),
        ("Photos at pickup", "Jose walks around, checks hitch, tires and lights, and documents the condition."),
        ("Updates to delivery", "Photos and ETAs on the road, and your RV set where you want it."),
    ])
    body += reviews_section(rt["tag"], rt["rev_title"], concrete=False)
    body += faq_section(rt["faq"], "Questions about this route")
    body += sign_section(current=path, title="More routes and cities")
    body += band(rt["band"], "Text the pickup, the delivery and the RV or vehicle details. You will get an honest answer and a fair quote, guaranteed.")
    PAGES.append((path, "0.8"))
    write(path, page(path, rt["title"], rt["desc"], body, [business_schema(), service_schema(path, rt["service"], rt["desc"], rt["area"]), crumbs_schema(trail), faq_schema(rt["faq"])]))

ROUTE_DATA = [
dict(path="RV-Transport-San-Diego-to-Arizona.html", crumb="San Diego to Arizona", tag="az",
     title="RV Transport San Diego to Arizona | Yuma, Phoenix | Chato's",
     desc="RV and car transport between San Diego and Arizona: Yuma, Phoenix and the Colorado River. Fifth wheels, Airstreams and motorhomes. Fair quote guaranteed.",
     service="RV transport San Diego to Arizona", area=["San Diego", "Yuma, AZ", "Phoenix, AZ", "Arizona"],
     h1="RV transport between<br>San Diego and Arizona",
     lede="Fifth wheels, Airstreams, toy haulers and motorhomes moved between San Diego County and Arizona, in both directions, by the owner.",
     img="rv-towing-on-the-road", img_alt="RAM 3500 towing a fifth wheel on an open highway toward Arizona", img_w=1200, img_h=675,
     img_m="rv-towing-on-the-road-600", img_wide="rv-towing-on-the-road-wide", pos="55% 60%",
     h2="Over the mountains and across the desert",
     intro="<p>The run from San Diego to Arizona starts with one of the toughest climbs in Southern California: I-8 up through the mountains east of Alpine and down the In-Ko-Pah grade into the desert. Heavy fifth wheels need a truck and a driver that can handle the grade both ways, plus the summer heat on the other side.</p><p>Jose has made the trip with customers' RVs in both directions, including an Airstream back home to Yuma and a motorhome from Arizona to the San Diego coast.</p>",
     moves=["Snowbird moves to winter RV resorts in Yuma and the Colorado River area", "RVs bought in Arizona and brought home to San Diego", "Motorhomes, park models and toy haulers for desert season", "Cars and classics on the single-car hauler"],
     facts=[("San Diego to Yuma", "About 175 miles on I-8"), ("San Diego to Phoenix", "About 355 miles on I-8 and I-10"), ("The big climb", "I-8 mountain grades east of Alpine"), ("Best season", "Fall through spring, before the desert heat")],
     map_title="Arizona and everywhere else Jose drives", map_intro="Real routes from Chato's customer reviews, including an Airstream to Yuma and a motorhome from Arizona to San Diego.",
     rev_title="Customers who made the Arizona run with Jose", band="Moving an RV to or from Arizona?",
     faq=[("How long does RV transport from San Diego to Arizona take?", "Yuma is usually a same-day run. Phoenix is a long day of driving. Jose confirms timing with your quote."),
          ("Can you bring an RV I bought in Arizona back to San Diego?", "Yes. Send the seller or dealer contact, the address and the RV details. Jose coordinates the pickup."),
          ("Do you move motorhomes to Arizona?", "Yes. Jose has moved motorhomes between Arizona and San Diego. Call to confirm your model.")]),
dict(path="RV-Transport-San-Diego-to-Las-Vegas.html", crumb="San Diego to Las Vegas", tag="long",
     title="RV Transport San Diego to Las Vegas, NV | Chato's",
     desc="RV and car transport between San Diego and Las Vegas, Nevada. Fifth wheels, travel trailers, toy haulers and cars, door to door. Fair quote guaranteed.",
     service="RV transport San Diego to Las Vegas", area=["San Diego", "Las Vegas, NV", "Henderson, NV", "Nevada"],
     h1="RV transport between<br>San Diego and Las Vegas",
     lede="Door-to-door RV and car transport on I-15 between San Diego County and Las Vegas, Henderson and southern Nevada.",
     img="fifth-wheel-move-sunset", img_alt="RAM 3500 hitched to a fifth wheel at sunset, ready for a Las Vegas run", img_w=1440, img_h=810,
     img_m="fifth-wheel-move-sunset-600", img_wide="fifth-wheel-move-sunset-wide", pos="55% 60%",
     h2="A straight shot up I-15, done carefully",
     intro="<p>Escondido sits right on I-15, the same freeway that runs all the way to Las Vegas. It is a straightforward route on paper, but it climbs through the Cajon Pass and up to Mountain Pass before dropping into the Las Vegas valley, with serious summer heat in between.</p><p>Jose tows the whole way himself, sends updates from the road, and delivers to your home, storage lot or RV park in southern Nevada.</p>",
     moves=["Fifth wheels and travel trailers for people moving to or from Las Vegas", "Toy haulers headed to the desert", "Cars and trucks door to door", "RVs bought or sold between Nevada and San Diego"],
     facts=[("San Diego to Las Vegas", "About 330 miles on I-15"), ("Escondido to Las Vegas", "About 300 miles"), ("The climbs", "Cajon Pass and Mountain Pass"), ("Watch for", "Summer heat in the Mojave")],
     map_title="Las Vegas and the rest of the map", map_intro="Real routes from Chato's customer reviews across California, Nevada and Arizona.",
     rev_title="Long-haul reviews", band="Moving an RV to or from Las Vegas?",
     faq=[("How long does RV transport from San Diego to Las Vegas take?", "It is usually a one-day drive. Jose confirms pickup and delivery times with your quote."),
          ("Can you move my car to Las Vegas too?", "Yes. Cars and trucks go on the single-car hauler, door to door."),
          ("Do you deliver to Henderson and North Las Vegas?", "Yes. Anywhere in the Las Vegas valley and southern Nevada.")]),
dict(path="RV-Transport-San-Diego-to-Northern-California.html", crumb="San Diego to Northern California", tag="norcal",
     title="RV Transport San Diego to Sacramento & Bay Area | Chato's",
     desc="RV and car transport between San Diego and Northern California: Sacramento, Loomis and the Bay Area. Fifth wheels, vintage trailers and cars. Fair quote guaranteed.",
     service="RV transport San Diego to Northern California", area=["San Diego", "Sacramento", "Loomis", "San Francisco Bay Area"],
     h1="RV transport between San Diego<br>and Northern California",
     lede="Sacramento, the Bay Area and the Sierra foothills to San Diego and back. Fifth wheels, vintage trailers and cars, moved by one driver the whole way.",
     img="rv-transport-fifth-wheel-rear", img_alt="Riverstone fifth wheel on the road for a long-distance RV transport", img_w=1400, img_h=1050,
     img_m="rv-transport-fifth-wheel-rear-m", img_widths=[("-800", 800), ("", 1400)], pos="45% 55%",
     h2="Eight hours on I-5, with updates the whole way",
     intro="<p>Northern California to San Diego is one of the most common long-distance RV moves in the state, and one of the easiest to get wrong. Brokers hand your RV to whoever takes the price. Some drivers cancel, change the story or go quiet.</p><p>Chato's customers tell a different story: a 40-foot fifth wheel from Loomis to San Diego with photos and videos at every step, and a vintage trailer from Sacramento after another transporter fell through.</p>",
     moves=["Fifth wheels and travel trailers bought up north and brought to San Diego", "Vintage trailers and Airstreams", "RVs headed to the Port of Long Beach for shipping to Hawaii", "Cars and classics on the single-car hauler"],
     facts=[("San Diego to Sacramento", "About 500 miles on I-5"), ("San Diego to San Francisco", "About 500 miles"), ("The climb", "The Grapevine over Tejon Pass"), ("Port option", "Delivery to the Port of Long Beach for Hawaii")],
     map_title="Northern California and beyond", map_intro="Real routes from Chato's customer reviews, including Loomis to San Diego to the port for Hawaii.",
     rev_title="They trusted Jose with the long drive", band="Moving an RV between NorCal and San Diego?",
     faq=[("How long does RV transport from Sacramento to San Diego take?", "Plan on a long day of driving, around eight hours plus hookup. Jose confirms timing with your quote."),
          ("Do I need to be there at pickup?", "No. One customer never met Jose in person. All the logistics were done by phone, with photos and videos of every step."),
          ("Can you take my RV to the port for shipping to Hawaii?", "Yes. Jose has delivered RVs and cars to the Port of Long Beach for customers shipping to Hawaii.")]),
]
for rt in ROUTE_DATA:
    route_page(rt)


# =====================================================================
# QUICK ESTIMATE
# =====================================================================
R = ""
EST_FAQ = [
    ("Is the online estimate my final price?", "No. It is an approximate range based on the details you enter and the driving route. Jose reviews every request and the final quote can change depending on the vehicle, access at pickup and drop-off, the route and timing. Your final quote will always be fair. Guaranteed."),
    ("How is the estimate calculated?", "It starts from Jose's base in Escondido and adds up the drive to your pickup, the loaded miles to your drop-off and part of the drive home, diesel for the truck, driver time for driving and hookup, the tow fee for your type of vehicle, and any extras like a backyard pickup or a steep driveway."),
    ("Why does a backyard or tight spot change the price?", "Backing an RV out of a backyard, through a tight gate or up a steep driveway takes more time and care. Some of these Jose wants to see in photos first, so the estimate flags them for review."),
    ("What happens after I send it?", "Your details go to Jose by text or email, already filled in. He reviews them, asks for a photo if needed, and replies with your fair quote."),
]
est_body = f"""
<section class="hero short est-hero">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="{R}index.html">Home</a></li><li aria-current="page">Quick estimate</li></ol></nav>
    <h1>{split_lines("Quick estimate for<br>RV &amp; car transport")}</h1>
    <p class="lede">Pick your vehicle, add the pickup and drop-off, and get an approximate price range in about a minute. Then send it to Jose with one tap.</p>
  </div>
</section>
<section class="est-sec">
  <div class="wrap est-grid" id="estimator" data-leaflet="{R}assets/vendor/leaflet/" data-fuel="{R}assets/data/fuel.json">
    <aside class="est-side" aria-label="Estimate summary">
      <div class="est-card">
        <small>Approximate range</small>
        <div class="est-range" data-range aria-live="polite">Add pickup and drop-off</div>
        <dl id="est-summary"></dl>
        <p class="disc-mini">Approximate only. Jose reviews every request and the final quote can change. Fair quote guaranteed.</p>
      </div>
      <div id="est-map" class="est-map" role="img" aria-label="Map of Jose's base, the pickup and the drop-off"></div>
    </aside>
    <div class="est-panel">
      <div class="est-cats" aria-label="Vehicle type"></div>
      <div class="est-steps" aria-label="Steps"></div>
      <div class="est-body">
        <noscript><p>The quick estimate needs JavaScript. Call <a href="{TEL}">{PHONE}</a> or text Jose for a quote.</p></noscript>
      </div>
    </div>
  </div>
</section>
<div class="est-mbar"><div><small>Approximate range</small><b data-range>Add pickup and drop-off</b></div><button type="button" class="btn btn-call">Continue</button></div>
<section class="sec">
  <div class="wrap est-info">
    <div class="prose">
      <h2>How the quick estimate works</h2>
      <p>The range is built the same way Jose prices a move: the miles from his base in Escondido to your pickup, the loaded miles to your drop-off, part of the drive home, diesel for the RAM 3500, driver time for driving and hookup, the tow fee for your kind of vehicle, and extras like a backyard pickup, a steep driveway or a vehicle that doesn't run.</p>
      <p>Long trips include an overnight on the road. Same-day requests include a rush charge. Everything is shown line by line so you can see where the number comes from.</p>
    </div>
    <div class="note">
      <h3>Important</h3>
      <p><strong>This is an approximate estimate, not a quote.</strong> Jose has to review your information, and the final quote can change depending on the vehicle, its condition, access at pickup and drop-off, the route and timing.</p>
      <p>Whatever the final number is, it will be fair. That's Jose's guarantee.</p>
    </div>
  </div>
</section>
"""
est_body += faq_section(EST_FAQ, "Quick estimate questions")
est_body += band()
est_body += '<script src="' + R + 'assets/js/estimate.js?v=2026-11d" defer></script>'
PAGES.append(("Quick-Estimate.html", "0.9"))
write("Quick-Estimate.html", page("Quick-Estimate.html",
    "RV & Car Transport Cost Estimate San Diego | Chato's",
    "Get a quick, approximate price range for RV towing, RV transport or car transport from San Diego. Pick your vehicle, add pickup and drop-off, send it to Jose.",
    est_body,
    [business_schema(), crumbs_schema([("index.html", "Home"), ("Quick-Estimate.html", "Quick estimate")]), faq_schema(EST_FAQ),
     {"@type": "WebApplication", "name": "Chato's Quick Estimate", "url": url_for("Quick-Estimate.html"), "applicationCategory": "BusinessApplication", "operatingSystem": "Any", "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"}, "provider": {"@id": DOMAIN + "/#business"}}],
    active="Quick-Estimate.html"))

# =====================================================================
# BLOG
# =====================================================================
R = "../"
POSTS = [
dict(
    slug="how-to-prepare-fifth-wheel-for-transport.html",
    title="How to Prepare a Fifth Wheel for Transport: Checklist",
    h1="How to get your fifth wheel ready for transport",
    desc="A practical checklist to get a fifth wheel or travel trailer ready for RV transport: tanks, slides, tires, interior and paperwork. From Chato's in San Diego.",
    img="fifth-wheel-move-sunset-600", img_w=600, img_h=800, img_alt="Fifth wheel hitched to a RAM 3500, ready for transport",
    excerpt="Tanks, slides, tires, the inside and the paperwork. Fifteen minutes of prep that keeps the move fast and safe.",
    body=f'''
<p>A good RV transport starts before the truck shows up. Fifteen minutes of prep keeps the hookup quick, keeps your things from rattling loose, and lets your driver focus on the road. Here is the checklist Jose gives every customer.</p>
<h2>Outside the RV</h2>
<ul>
<li><strong>Bring in the slides and lock them.</strong> Every slide fully retracted, with the slide locks or travel bars in place if your RV has them.</li>
<li><strong>Raise and lock the stabilizer jacks.</strong> Leave the landing gear down until the truck is under the pin box.</li>
<li><strong>Retract the awning and secure it.</strong> Wind can unroll a loose awning at highway speed.</li>
<li><strong>Close and latch every compartment door.</strong> Check the basement doors twice.</li>
<li><strong>Disconnect shore power, water and sewer.</strong> Coil the cords and hoses and store them inside.</li>
<li><strong>Check the tires.</strong> Look for cracking on the sidewalls and check the date code. RV tires often age out before they wear out.</li>
</ul>
<h2>Inside the RV</h2>
<ul>
<li><strong>Empty the black and gray tanks.</strong> Full tanks add weight and slosh. Fresh water can be drained too, unless you need it on arrival.</li>
<li><strong>Secure anything that can move.</strong> Dishes, TVs, decor, the coffee maker. Put loose items in bins on the floor.</li>
<li><strong>Close and latch cabinets, the fridge and the shower door.</strong> A strip of painter's tape on cabinet doors helps.</li>
<li><strong>Close every window, vent and roof hatch.</strong></li>
<li><strong>Turn off propane at the tanks</strong> and switch the fridge off or to battery as your manual recommends.</li>
</ul>
<h2>Paperwork and access</h2>
<ul>
<li>Have the registration with the RV.</li>
<li>If it is in storage or at an RV park, arrange the gate code or access ahead of time.</li>
<li>If you won't be there, give Jose the name and number of someone who will, and the exact spot where the RV should go.</li>
</ul>
<h2>At pickup</h2>
<p>Jose walks around the RV, checks the pin box or hitch, connects the brake wiring and tests the lights. He takes photos so you have a record of the condition at pickup, then sends updates on the way.</p>
<p>Got a question about your RV that isn't on this list? <a href="{SMS}" data-where="blog">Text Jose</a> or call <a href="{TEL}" data-where="blog">{PHONE}</a>. You can also read more about <a href="{R}RV-Transport-San-Diego.html">RV transport from San Diego</a>.</p>
'''),
dict(
    slug="open-car-hauler-vs-enclosed-classic-car-transport.html",
    title="Open vs Enclosed Classic Car Transport: What to Choose",
    h1="Open car hauler or enclosed transport for a classic car?",
    desc="Open vs enclosed classic car transport, explained honestly: what each protects against, when a dedicated open hauler makes sense, and what to ask before booking.",
    img="classic-convertibles-car-hauler", img_w=680, img_h=510, img_alt="Vintage convertibles on an open car hauler",
    excerpt="What each option really protects against, and why a dedicated single-car hauler is often the right call for local and regional moves.",
    body=f'''
<p>If you own a classic, the first question about shipping it is usually open or enclosed. The honest answer depends on the car, the distance, the season and your budget. Here is how to think about it.</p>
<h2>What enclosed transport protects against</h2>
<p>An enclosed trailer keeps out weather, road grit and anything kicked up by other traffic. For a concours car with fresh paint going across the country in winter, that protection is worth paying for.</p>
<h2>What a dedicated open hauler does well</h2>
<p>Most of the risk with car shipping is not the sky. It is handling: how the car is loaded, where it is tied down, how many times it gets moved between trucks and terminals, and whether someone backs another car into it.</p>
<p>A dedicated open car hauler, like the one Chato's uses, carries one car. It is loaded once and unloaded once. Nothing is stacked above it, and nothing is driven on or off around it. For local and regional moves in Southern California, where the weather is usually dry and the trip is a few hours, that often matters more than walls.</p>
<h2>How the car is tied down matters most</h2>
<p>Ask any transporter how they secure the car. On a classic, you want straps over the tires so the load goes into the wheels, not hooks or chains on the frame, suspension or bumpers. That is how Jose straps every car, including the 1955 Chevy Nomad in the video on our <a href="{R}Classic-Car-Transport-San-Diego.html">classic car transport</a> page.</p>
<h2>Questions to ask before you book</h2>
<ul>
<li>Will my car be the only one on the trailer?</li>
<li>Are there any transfers or terminal stops?</li>
<li>How do you tie down the car?</li>
<li>Will you take photos at pickup and delivery?</li>
<li>Who exactly is driving, and can I call them?</li>
</ul>
<h2>So which one?</h2>
<p>For a short or regional move in good weather, a dedicated open hauler with wheel straps is a smart, careful choice. For long winter trips or show cars that can't take a speck of dust, enclosed is worth it. If you are not sure, <a href="{TEL}" data-where="blog">call Jose at {PHONE}</a> and he will tell you honestly which fits your car.</p>
'''),
dict(
    slug="moving-rv-out-of-storage-or-tight-driveway.html",
    title="Moving an RV Out of Storage or a Tight Driveway | Chato's",
    h1="Moving an RV out of storage or a tight driveway",
    desc="What to know before moving a fifth wheel or trailer out of a San Diego storage lot, backyard or steep driveway, and how to tell if the move is doable.",
    img="fifth-wheel-driveway-move-600", img_w=600, img_h=800, img_alt="Fifth wheel being moved in a tight residential driveway",
    excerpt="Steep driveways, narrow gates and backyards. How to tell if your RV can come out, and what to send for a fast answer.",
    body=f'''
<p>Some of the most common calls Chato's gets are not long trips. They are short moves that are hard: a fifth wheel wedged in a backyard, a trailer at the bottom of a steep driveway, or an RV in a storage space with a post on each side. Here is what makes these moves work.</p>
<h2>Send photos before anything else</h2>
<p>The fastest way to know if a tight move is doable is a few photos. Send:</p>
<ul>
<li>The RV from the front and both sides, showing what is around it</li>
<li>The path out: the gate, driveway or aisle, from where the RV is sitting</li>
<li>The street in front, showing parked cars, trees and slopes</li>
<li>Where it needs to go, if it is a tight spot too</li>
</ul>
<p>With that, Jose can usually tell you right away if the move works and how long it will take.</p>
<h2>Things that make a tight move harder</h2>
<ul>
<li><strong>Low trees and wires.</strong> Fifth wheels are tall. Measure the clearance if you can.</li>
<li><strong>Soft ground.</strong> Lawns and dirt after rain can sink a heavy trailer.</li>
<li><strong>Flat tires or seized brakes</strong> on an RV that has been parked a long time.</li>
<li><strong>Cars on the street</strong> that block the swing. Ask neighbors to move them that day.</li>
</ul>
<h2>Storage lot moves</h2>
<p>Storage lots in San Diego County range from wide-open gravel to tight aisles with posts. Have your gate code and space number ready, and check that the RV's tires are inflated. If the battery is dead, the slides and jacks may not work, so charge it ahead of time if you can.</p>
<h2>Backyard and steep driveway moves</h2>
<p>These are where experience shows. One reviewer described Jose getting a 33-foot fifth wheel out of a yard that most companies wouldn't try. He takes the time to plan the angle and won't rush it.</p>
<p>Have a tricky one? <a href="{SMS}" data-where="blog">Text the photos to {PHONE}</a> and you will get a straight answer. See more about <a href="{R}index.html">RV towing in San Diego</a>.</p>
'''),
]

def blog_shell_hero(h1, lede, img, trail):
    return hero(h1, lede, img, crumbs=trail, short=True, pos="50% 55%")

cards = ""
for p in POSTS:
    path = "blog/" + p["slug"]
    trail = [("index.html", "Home"), ("blog/blog.html", "Tips"), (path, p["h1"])]
    body = f'''
<section class="hero short" style="--pos:50% 50%">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="{R}index.html">Home</a></li><li><a href="{R}blog/blog.html">Tips</a></li><li aria-current="page">{esc(p["h1"])}</li></ol></nav>
    <h1>{p["h1"]}</h1>
    <p class="meta">By Jose Barba, owner of Chato's Auto Transport &amp; RV Towing. Updated November 2026.</p>
  </div>
</section>
<section class="sec">
  <div class="wrap">
    <article class="article prose">
      {picture(p["img"], p["img_alt"], p["img_w"], p["img_h"], sizes="(max-width:800px) 100vw, 740px", lazy=False)}
      {p["body"]}
    </article>
  </div>
</section>
'''
    body += band()
    PAGES.append((path, "0.6"))
    write(path, page(path, p["title"], p["desc"], body, [
        business_schema(),
        {"@type": "BlogPosting", "headline": p["h1"], "description": p["desc"], "datePublished": TODAY, "dateModified": TODAY,
         "image": f"{DOMAIN}/images/photos/{p['img']}.webp", "mainEntityOfPage": url_for(path),
         "author": {"@id": DOMAIN + "/#jose"},
         "publisher": {"@id": DOMAIN + "/#business"}},
        crumbs_schema(trail)]))
    cards += f'''
      <a class="post-card" href="{R}{path}">
        {picture(p["img"], p["img_alt"], p["img_w"], p["img_h"], sizes="(max-width:700px) 100vw, 33vw")}
        <h2>{p["h1"]}</h2>
        <p>{p["excerpt"]}</p>
      </a>'''

blog_body = f'''
<section class="hero short">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><ol><li><a href="{R}index.html">Home</a></li><li aria-current="page">Tips</li></ol></nav>
    <h1>RV and car transport tips</h1>
    <p class="lede">Practical advice from Jose on getting RVs and cars ready to move, and choosing the right kind of transport.</p>
  </div>
</section>
<section class="sec"><div class="wrap"><div class="posts">{cards}
</div></div></section>
''' + band()
PAGES.append(("blog/blog.html", "0.5"))
write("blog/blog.html", page("blog/blog.html", "RV & Car Transport Tips | Chato's RV Towing San Diego",
      "Tips for RV towing, RV transport and classic car transport from Chato's in San Diego: prep checklists, open vs enclosed transport and tight-access moves.",
      blog_body, [business_schema(), crumbs_schema([("index.html", "Home"), ("blog/blog.html", "Tips")])]))

# =====================================================================
# Redirect stubs, 404, sitemap, robots, manifest
# =====================================================================
def redirect(path, target_rel, target_abs):
    write(path, f'''<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><title>Moved</title>
<meta name="robots" content="noindex,follow">
<link rel="canonical" href="{target_abs}">
<meta http-equiv="refresh" content="0;url={target_rel}">
</head><body><p>This page moved. <a href="{target_rel}">Continue</a>.</p></body></html>
''')

for old in ["post.html", "post-1.html", "post-2.html", "post-3.html", "post-4.html", "post-5.html"]:
    redirect("blog/" + old, "blog.html", DOMAIN + "/blog/blog.html")
redirect("blog/index.html", "blog.html", DOMAIN + "/blog/blog.html")
redirect("Chatos-Auto-and-RV-Towing.html", "./", DOMAIN + "/")

R = "/"
nf = f'''
<section class="hero short">
  <div class="wrap">
    <h1>That page isn't here</h1>
    <p class="lede">The link may be old or mistyped. Head to the home page, or call or text Jose if you need an RV or car moved.</p>
    <div class="btn-row">{call_btn("404")}<a class="btn btn-text" href="/">Go to the home page</a></div>
  </div>
</section>'''
write("404.html", page("404.html", "Page not found | Chato's RV Towing San Diego", "This page could not be found.", nf, [business_schema()], robots="noindex,follow"))

sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
for p, pr in PAGES:
    sm += f"  <url><loc>{url_for(p)}</loc><lastmod>{TODAY}</lastmod><priority>{pr}</priority></url>\n"
sm += "</urlset>\n"
write("sitemap.xml", sm)
write("robots.txt", f"User-agent: *\nAllow: /\n\nSitemap: {DOMAIN}/sitemap.xml\n")
write("site.webmanifest", json.dumps({"name": BIZ, "short_name": "Chato's", "icons": [
    {"src": "/favicon-192.png", "sizes": "192x192", "type": "image/png"},
    {"src": "/favicon-512.png", "sizes": "512x512", "type": "image/png"}],
    "theme_color": "#24272b", "background_color": "#24272b", "display": "standalone", "start_url": "/"}, indent=2))
print("pages:", len(PAGES))
