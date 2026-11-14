#!/usr/bin/env python3
"""Static site generator for chatosrvtowingsd.com (2026 rebrand, v2)."""
import json, os, re, html, math
from urllib.parse import quote

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "site")
DOMAIN = "https://chatosrvtowingsd.com"
BIZ = "Chato's Auto Transport & RV Towing"
OWNER = "Jose Barba"
PHONE = "(760) 532-1964"
TEL = "tel:+17605321964"
SMS = "sms:+17605321964?body=" + quote("Hi Jose, I need a quote to move my ")
CID = "853532398857064052"
FTID = "0x61390fbd77152ba1:0xbd85b31ce298e74"
G_LISTING = f"https://maps.google.com/?cid={CID}"
G_WRITE = f"https://www.google.com/search?q=Chato%27s+Auto+Transport+%26+RV+Towing&ludocid={CID}#lrd={FTID},3"
G_READ = f"https://www.google.com/search?q=Chato%27s+Auto+Transport+%26+RV+Towing&ludocid={CID}#lrd={FTID},1"
YELP = "https://www.yelp.com/biz/chatos-auto-transport-and-towing-escondido-4"
FB = "https://www.facebook.com/chatosautotransportandtowing/"
IG = "https://www.instagram.com/chatos.rv.towing"
OG_IMG = DOMAIN + "/images/brand/og-chatos-rv-towing-san-diego.jpg"
TODAY = "2026-11-13"
MAP = json.load(open(os.path.join(HERE, "map.json")))
exec(open(os.path.join(HERE, "meta.py"), encoding="utf-8").read())
GEAR = open(os.path.join(HERE, "gear_path.txt")).read().strip()

# ---------- icons ----------
I_PHONE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>'
I_TEXT = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 3h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 1-2zm3 6v2h2V9zm4 0v2h2V9zm4 0v2h2V9z"/></svg>'
STAR = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5l2.6 5.5 6 .7-4.4 4.1 1.2 6-5.4-3-5.4 3 1.2-6L1.4 7.7l6-.7z"/></svg>'
STARS = '<span class="stars" role="img" aria-label="5 out of 5 stars">' + STAR * 5 + '</span>'
GO = '<svg class="go" viewBox="0 0 24 24" aria-hidden="true"><path fill="#fff" d="M6 18L16 8v7h3V3H7v3h7L4 16z"/></svg>'
G_LOGO = '<span class="src src-g" aria-hidden="true">G</span>'
Y_LOGO = '<span class="src src-y" aria-hidden="true">Y</span>'

def shield(num, kind="I"):
    if kind == "CA":
        return (f'<svg class="shield" viewBox="0 0 42 44" role="img" aria-label="California State Route {num}">'
                '<path d="M21 2C13 2 8 5 4 5V21C4 33 13 39 21 42.5 29 39 38 33 38 21V5C34 5 29 2 21 2Z" fill="#0a6a44" stroke="#fff" stroke-width="2.6"/>'
                f'<text x="21" y="28" text-anchor="middle" font-family="Barlow,sans-serif" font-weight="600" font-size="15" fill="#fff">{num}</text></svg>')
    fs = 15 if len(num) < 3 else 12.5
    return (f'<svg class="shield" viewBox="0 0 42 44" role="img" aria-label="Interstate {num}">'
            '<path d="M3 7Q21 0 39 7V21Q39 36 21 43Q3 36 3 21Z" fill="#fff"/>'
            '<path d="M5.5 8.5Q21 2.6 36.5 8.5V14H5.5Z" fill="var(--shield-red)"/>'
            '<path d="M5.5 15.5H36.5V21Q36.5 34 21 40.5Q5.5 34 5.5 21Z" fill="var(--shield-blue)"/>'
            f'<text x="21" y="32" text-anchor="middle" font-family="Barlow,sans-serif" font-weight="600" font-size="{fs}" fill="#fff">{num}</text></svg>')

def seal(cls="seal"):
    """Chato's gear emblem as a living seal: gear turns behind the name band, ring text rotates."""
    ring = "30 YEARS OF EXPERIENCE • FAIR QUOTE GUARANTEED • RV &amp; CAR TRANSPORT • "
    return f'''<div class="{cls}" aria-hidden="true">
  <svg viewBox="-150 -150 300 300">
    <defs>
      <path id="ringpath" d="M0,-128 A128,128 0 1,1 -0.1,-128"/>
      <clipPath id="gearclip"><rect x="-120" y="-120" width="240" height="84"/><rect x="-120" y="40" width="240" height="84"/></clipPath>
    </defs>
    <circle r="146" fill="#1c1e21"/>
    <circle r="112" fill="none" stroke="rgba(242,137,28,.35)" stroke-width="1"/>
    <g class="ring"><text font-family="Barlow,sans-serif" font-weight="600" font-size="14.2" letter-spacing="1.5" fill="#fff"><textPath href="#ringpath">{ring}</textPath></text></g>
    <g clip-path="url(#gearclip)"><g class="gear"><path d="{GEAR}" fill="#f2891c" fill-rule="evenodd"/></g></g>
    <text y="4" text-anchor="middle" font-family="'Barlow Condensed',sans-serif" font-weight="800" font-size="46" fill="#fff">CHATO&#8217;S</text>
    <text y="24" text-anchor="middle" font-family="Barlow,sans-serif" font-weight="500" font-size="11.5" letter-spacing="1" fill="#e6e7e9">AUTO TRANSPORT &amp; TOWING</text>
    <rect x="-84" y="31" width="168" height="2" fill="#f2891c"/>
  </svg>
</div>'''

# ---------- reviews (verbatim; only "Jose" accents normalized) ----------
def R_(name, src, where, text, tags):
    return dict(name=name, src=src, where=where, text=text.replace("José", "Jose"), tags=set(tags.split()))

REVIEWS = [
    R_("Julie", "Google", "", "I had a 43ft 5th wheel I needed transported last minute, so I jumped online, seen Chato's Auto Transport ad, seen the 5 star reviews and reached out. Not only did Jose answer quickly, but he was very polite & he was able to meet me at my rv within an hour. He hooked right up & transported it to the location. He is an exceptional driver who can get whatever you need moved, but he does it with care, efficiency & the experience of someone who has been doing this for a long time! I have since hired him to transport my 5th wheel multiple times & wouldn't want anyone else.", "rv home"),
    R_("Tracey S.", "Yelp", "California", "When it comes to transport 1) I worry 2) I research the heck out of who is a good option and 3) this is an industry with many dishonest people. If you have any of these concerns, Jose Barba/ Charo Transport is your best possible option. I needed a vintage trailer moved from Sacramento to San Diego quickly after I made a bad choice and had to fire a transporter who lied and changed stories. He was responsive, kind, constant updates, on time as much as traffic would permit and extremely professional.", "rv long norcal home"),
    R_("Donny Allen", "Google", "", "Very professional, fast and even fixed my 5th wheels jack system just to help us out because ours wasn’t working. Extremely polite and helpful would definitely recommend!! I will be a returning customer", "rv home"),
    R_("Sarasta M.", "Yelp", "Lahaina, HI", "If I could give Jose 100 stars I would! Jose transport 40' fifthwheel for us from Loomis to San Diego! 8 hours drive! the next day he took it to the port to ship it to us (we live in Lahaina Hawaii). we never met Jose! all the logistics happen on the phone, he is a pro! send me pictures and videos of every step of the way! and as he promised he delivered the fiftheheel to the port! I felt like my own family member helping me out! MAHALO", "rv long norcal home"),
    R_("Doug G.", "Yelp", "Escondido, CA", "I hired Jose at Chato's Auto Transport to move a classic car across town Escondido. I told him it was ging to be a diffficult pickup backing in off a narrow driveway up a steep dirt driveway at a 90 degrees angle. To assure the feasibility he went out in advance to look at the challenge. He quoted me a very resonable fee and stuck to it. From the first call he kept me informed via text of every move, some with pictures. He was likeable, very easy to work with and very professional.", "car classic home escondido"),
    R_("Carlos P.", "Yelp", "Covina, CA", "If you need your travel trailer towed in Southern California, I recommend Jose Barba, Chato's Trailer Towing in San Diego/Escondido. Thank you, Jose, for getting my Airstream Trailer safely back to Yuma! Jose was professional, responsive and on time! Trailer delivered safe and sound!", "rv long az home"),
    R_("Oscar Zamora", "Google", "", "I hired Jose and my experience was very professional with a fair and reasonable price. He was very punctual and communication was excellent throughout the entire trip.", "rv car home long"),
    R_("Rochelle Z.", "Yelp", "Fallbrook, CA", "This is a real honest review especially since I never do reviews! This the second time I used Chato's towing. The first time was a couple years ago he picked up my 42Ft 5th wheel in Indio and dropped in Vista which was very fairly priced! Jose and his wife are supper friendly and patient! Him and his wife seem very honest and give the vibe of family helping you!", "rv home oceanside"),
    R_("Chris S.", "Yelp", "Encinitas, CA", "EXCELLENT. I used Jose to move a motorhome from Arizona to San Diego. He was friendly, fair priced, showed up on time and had excellent equipment in top notch condition.", "rv long az carlsbad"),
    R_("Kirsten S.", "Yelp", "San Clemente, CA", "Jose at Chatos was amazing! He was responsive and accommodated our short time frame request to move our park model RV from Palm Desert to our space in Borrego. It was a tight fit into our new space and he worked with us until we got it right! Highly recommend!", "rv home ramona"),
    R_("Claudine S.", "Yelp", "La Mesa, CA", "I needed to get my 2002 Avalon with 190,000 miles to a family member in Los Angeles. The very reasonable price was determined up front. No surprises. Jose provided door-to-door service, kept us updated on his ETA, and took pictures on his arrival. Jose was friendly, trustworthy, and a pro at what he does.", "car home elcajon santee"),
    R_("Monika M.", "Yelp", "San Marcos, CA", "All I can say is WOW!! Jose's experience and patience is exceptional. He was able to bring a 43' fifth wheel into a space that it should have never fit. But he did it. His patience and care exceeded my expectations. His concern for my property was above and beyond.", "rv home sanmarcos escondido"),
    R_("Francisco Siquina", "Google", "", "If I could give Jose Luis a thousand stars, I would without hesitation! Truly exceptional towing service! Excellent customer service, professionalism, friendliness, and an incredible willingness to help. You can tell when someone does their job with passion and dedication. 1000% recommended!", "rv car home"),
    R_("Rein H.", "Yelp", "Kaneohe, HI", "I just used Jose's services to move my car from Escondido to Long Beach. It had to be moved today to be put on a ship and I just contacted him yesterday. He took the job at a lower cost than any other quotes. He did it this morning, took photos at pickup and sent them to me, gave me updates on his location as he was driving, and delivered the vehicle to the port ahead of schedule.", "car long home"),
    R_("Theresa W.", "Yelp", "Alpine, CA", "Chato's Auto Transport & Towing is the best RV transport service we have ever worked with. Jose is truly a superstar, he communicates with you great and works very hard and ALWAYS does an AMAZING JOB.", "rv home elcajon santee"),
    R_("Konstantin D.", "Yelp", "Rancho Mirage, CA", "Jose was very courteous and communicable throughout the process and his towing skills are \"legit\". Jose was early to arrive to pickup my car and also able to deliver it ahead of schedule to its final destination. He knows the San Diego area very well. It's clear that Jose loves what he does and is good at it. Highly recommend!", "car home"),
    R_("Kyle C.", "Yelp", "Fallbrook, CA", "Used Jose to move our tiny home trailer for the 2 hour drive from the dealer to our spot. He was extremely responsive when setting up the delivery details. He was on time to pick up from the dealership and seeing him pull the trailer onto our ranch, he was extremely careful and a very skilled driver at towing our 45 foot trailer", "rv temecula ramona home"),
    R_("Gladys T.", "Yelp", "Vista, CA", "Jose was amazing he was fast and he knew what he was doing I have a fifth wheel that I needed transported and it wasn't an easy job. He took his time and was extremely patient and professional. Y lo mejor es que También habla español muy recomendable", "rv home oceanside carlsbad"),
    R_("Dennis Chin", "Google", "", "Fast service, great communication, smooth transaction, recommend +++.", "rv car"),
    R_("Rene V.", "Yelp", "Riverside, CA", "Awesome service. Jose was very professional and helpful. He transferred our 5th wheel to Jurupa from El Cajon. I highly recommend Chato's Service. Extremely satisfied customer.", "rv elcajon temecula long"),
    R_("Vicky P.", "Yelp", "Vista, CA", "Jose transported our 5th wheel today and did an absolutely beautiful job! His 30 years of experience definitely shows! He was on time and drove my home with absolute care and professional. Definitely worth every penny to ensure the safety of my RV.", "rv home oceanside carlsbad sanmarcos"),
    R_("JoAnne R.", "Yelp", "Lakeside, CA", "I had a driver lined up to tow a 5th wheel for me at 8am. then he texted me to cancel at 5:30am. after many unsuccessful calls to find someone else, i was very fortunate to get ahold of jose with chato's towing. jose is efficient, couteous and respectful of my property. jose is a real professional in every way.", "rv elcajon santee home"),
    R_("Linda K.", "Yelp", "Poway, CA", "Jose was a hero who rescued our boat on a trailer from the side of the freeway in Rancho Bernardo after a trailer axle failure issue. So appreciated that he fit us into his Sunday, communicated clearly on his schedule, and serious problem solving once he got to the boat to figure out how to get the boat/trailer (missing a wheel) onto his trailer.", "car ramona escondido"),
]

CITIES = [  # (file, name, shield, kind, label)
    ("RV-Towing-Escondido.html", "Escondido", "15", "I", "RV towing Escondido"),
    ("RV-Towing-San-Marcos.html", "San Marcos", "78", "CA", "RV towing San Marcos"),
    ("RV-Towing-Carlsbad.html", "Carlsbad", "5", "I", "RV towing Carlsbad"),
    ("RV-Towing-Oceanside.html", "Oceanside", "5", "I", "RV towing Oceanside"),
    ("RV-Towing-Temecula.html", "Temecula & Murrieta", "15", "I", "RV towing Temecula"),
    ("RV-Towing-Ramona.html", "Ramona", "67", "CA", "RV towing Ramona"),
    ("RV-Towing-El-Cajon.html", "El Cajon", "8", "I", "RV towing El Cajon"),
    ("RV-Towing-Santee.html", "Santee", "52", "CA", "RV towing Santee"),
    ("RV-transport-Chula-Vista.html", "Chula Vista", "805", "I", "RV transport Chula Vista"),
    ("RV-transport-Imperial-Beach.html", "Imperial Beach", "5", "I", "RV transport Imperial Beach"),
]
ROUTES = [
    ("RV-Transport-San-Diego-to-Arizona.html", "San Diego to Arizona", "8", "RV transport to Arizona"),
    ("RV-Transport-San-Diego-to-Las-Vegas.html", "San Diego to Las Vegas, NV", "15", "RV transport to Las Vegas"),
    ("RV-Transport-San-Diego-to-Northern-California.html", "San Diego to Northern California", "5", "RV transport to Northern California"),
]

NAV = [
    ("index.html", "RV towing"),
    ("RV-Transport-San-Diego.html", "RV transport"),
    ("Auto-Transport-San-Diego.html", "Car transport"),
    ("Classic-Car-Transport-San-Diego.html", "Classic cars"),
    ("index.html#areas", "Areas"),
    ("Quick-Estimate.html", "Quick estimate"),
]

def esc(s):
    return html.escape(s, quote=True)

def clean_path(path):
    """Site path without .html: index.html -> '', blog/index.html -> blog/, RV-Transport-San-Diego.html -> RV-Transport-San-Diego."""
    frag = ""
    if "#" in path:
        path, frag = path.split("#", 1)
        frag = "#" + frag
    if path.endswith("index.html"):
        path = path[: -len("index.html")]
    elif path.endswith(".html"):
        path = path[:-5]
    return path + frag

def url_for(path):
    return DOMAIN + "/" + clean_path(path)

# ---------- schema ----------
def business_schema():
    return {
        "@type": "AutomotiveBusiness",
        "@id": DOMAIN + "/#business",
        "name": BIZ,
        "alternateName": ["Chato's RV Towing", "Chato's Auto Transport & Towing", "Chatos RV Towing San Diego"],
        "slogan": "30 years of experience. Fair quote, guaranteed.",
        "url": DOMAIN + "/",
        "telephone": "+1-760-532-1964",
        "logo": DOMAIN + "/images/brand/chatos-truck-logo-512.png",
        "image": [OG_IMG, DOMAIN + "/images/photos/fifth-wheel-towing-san-diego.webp"],
        "description": "30 years of experience. Owner-operated RV towing and RV transport for fifth wheels, travel trailers, toy haulers and motorhomes, plus car and classic car transport. Based in Escondido, serving San Diego County, California, Nevada and Arizona.",
        "founder": {"@type": "Person", "@id": DOMAIN + "/#jose", "name": OWNER, "alternateName": ["Jose Luis", "Chato"], "jobTitle": "Owner and driver", "description": "30 years of experience moving RVs, trailers and vehicles.", "knowsLanguage": ["en", "es"]},
        "priceRange": "$$",
        "knowsLanguage": ["en", "es"],
        "address": {"@type": "PostalAddress", "addressLocality": "Escondido", "addressRegion": "CA", "postalCode": "92027", "addressCountry": "US"},
        "areaServed": [{"@type": "AdministrativeArea", "name": "San Diego County, CA"}, {"@type": "State", "name": "California"},
                       {"@type": "State", "name": "Nevada"}, {"@type": "State", "name": "Arizona"}] +
                      [{"@type": "City", "name": n.split(" & ")[0]} for _, n, *_ in CITIES],
        "hasMap": G_LISTING,
        "openingHoursSpecification": [
            {"@type": "OpeningHoursSpecification", "dayOfWeek": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], "opens": "08:00", "closes": "19:00"},
            {"@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "09:00", "closes": "16:00"}],
        "sameAs": [G_LISTING, YELP, FB, IG],
        "makesOffer": [
            {"@type": "Offer", "itemOffered": {"@type": "Service", "name": n, "url": url_for(p)}} for p, n in [
                ("index.html", "RV towing"), ("RV-Transport-San-Diego.html", "RV transport"),
                ("Auto-Transport-San-Diego.html", "Car transport"), ("Classic-Car-Transport-San-Diego.html", "Classic car transport")]],
    }

def service_schema(path, name, desc, area):
    return {"@type": "Service", "@id": url_for(path) + "#service", "name": name, "serviceType": name,
            "description": desc, "provider": {"@id": DOMAIN + "/#business"},
            "areaServed": [{"@type": "Place", "name": a} for a in area], "url": url_for(path)}

def crumbs_schema(trail):
    return {"@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": i + 1, "name": n, "item": url_for(p)} for i, (p, n) in enumerate(trail)]}

def faq_schema(faqs):
    return {"@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": re.sub(r"<[^>]+>", "", a)}} for q, a in faqs]}

# ---------- components ----------
def call_btn(where, cls="btn btn-call", label=None):
    return f'<a class="{cls}" href="{TEL}" data-where="{where}">{I_PHONE}<span>{label or "Call " + PHONE}</span></a>'

def text_btn(where, cls="btn btn-text", label="Text Jose"):
    return f'<a class="{cls}" href="{SMS}" data-where="{where}">{I_TEXT}<span>{label}</span></a>'

def picture(name, alt, w, h, sizes="100vw", cls="", lazy=True, widths=None, mobile=None, wide=None, priority=False):
    attrs = f'alt="{esc(alt)}" width="{w}" height="{h}"' + (f' class="{cls}"' if cls else "")
    attrs += ' fetchpriority="high" decoding="async"' if priority else (' loading="lazy" decoding="async"' if lazy else "")
    src = f"{R}images/photos/{name}.webp"
    srcset = ""
    if widths:
        srcset = " srcset=\"" + ", ".join(f"{R}images/photos/{name}{sfx}.webp {wd}w" for sfx, wd in widths) + f"\" sizes=\"{sizes}\""
    if mobile or wide:
        out = "<picture>"
        if mobile:
            out += f'<source media="(max-width: 700px)" srcset="{R}images/photos/{mobile}.webp">'
        if wide:
            src = f"{R}images/photos/{wide}.webp"
            srcset = ""
        return out + f'<img src="{src}"{srcset} {attrs}></picture>'
    return f'<img src="{src}"{srcset} {attrs}>'

def split_lines(h1):
    """Wrap each line of an H1 (split on <br>) for the load animation."""
    parts = h1.split("<br>")
    return "".join(f'<span class="ln"><span style="--i:{i}">{p}</span></span>' for i, p in enumerate(parts))

def hero(h1, lede, img, crumbs=None, short=False, pos="70% 50%", with_seal=False):
    crumb_html = ""
    if crumbs:
        items = "".join(f'<li><a href="{R}{p}">{esc(n)}</a></li>' for p, n in crumbs[:-1]) + f'<li aria-current="page">{esc(crumbs[-1][1])}</li>'
        crumb_html = f'<nav class="crumbs" aria-label="Breadcrumb"><ol>{items}</ol></nav>'
    return f'''
<section class="hero{' short' if short else ''}" style="--pos:{pos}">
  {img}
  {seal("seal hero-seal") if with_seal else ""}
  <div class="wrap">
    {crumb_html}
    <h1>{split_lines(h1)}</h1>
    <p class="lede">{lede}</p>
    <div class="btn-row">{call_btn("hero")}<a class="btn btn-est" href="{R}Quick-Estimate.html" data-where="hero">Get a quick estimate</a>{text_btn("hero", label="Text Jose")}</div>
    <div class="trust">
      <span class="es yrs"><b>30 years</b> of experience</span>
      <a href="#reviews">{STARS} <span>5.0 on Google &amp; Yelp</span></a>
      <span class="es">Fair quote guaranteed</span>
      <span class="es" lang="es">Hablamos español</span>
    </div>
  </div>
</section>'''

ROUTE_TICKER = ["Loomis → San Diego", "Sacramento → San Diego", "Escondido → Yuma, AZ", "Arizona → San Diego",
                "Indio → Vista", "Palm Desert → Borrego Springs", "El Cajon → Jurupa Valley", "Escondido → Port of Long Beach",
                "San Diego → Los Angeles", "San Diego → Orange County", "San Diego → Las Vegas, NV", "San Diego → Hawaii, by ship"]

def ticker():
    items = "".join(f"<li>{esc(t)}</li>" for t in ROUTE_TICKER)
    return f'''
<section class="ticker" aria-label="Recent routes from customer reviews">
  <div class="ticker-label">Recent runs</div>
  <div class="marquee"><ul class="track">{items}</ul><ul class="track" aria-hidden="true">{items}</ul></div>
</section>'''

def review_card(r):
    src_logo = G_LOGO if r["src"] == "Google" else Y_LOGO
    link = G_READ if r["src"] == "Google" else YELP
    where = f'<span>{esc(r["where"])}</span>' if r["where"] else ""
    return f'''<figure class="review">
      <div class="rv-top">{STARS}<a href="{link}" target="_blank" rel="noopener" aria-label="Read on {r['src']}">{src_logo}</a></div>
      <blockquote><p>{esc(r["text"])}</p></blockquote>
      <figcaption><b>{esc(r["name"])}</b>{where}<em>{r["src"]}</em></figcaption>
    </figure>'''

def reviews_section(tag="home", title="35 five-star reviews and counting", intro=None, concrete=True, limit=None):
    pool = [r for r in REVIEWS if tag in r["tags"]] or REVIEWS
    if len(pool) < 6:
        pool = pool + [r for r in REVIEWS if r not in pool][: 6 - len(pool)]
    if limit:
        pool = pool[:limit]
    intro = intro or "Real reviews from Chato's Google Business Profile and Yelp. Same story every time: honest price, constant updates, and a driver who treats your RV like his own."
    half = (len(pool) + 1) // 2
    rows = ""
    for i, chunk in enumerate([pool[:half], pool[half:]]):
        cards = "".join(review_card(r) for r in chunk)
        rows += f'<div class="marquee rv-row{" rev" if i else ""}"><div class="track">{cards}</div><div class="track" aria-hidden="true">{cards}</div></div>'
    return f'''
<section class="sec{' concrete' if concrete else ''}" id="reviews">
  <div class="wrap">
    <div class="sec-head">
      <h2>{title}</h2>
      <p>{intro}</p>
    </div>
    <div class="badges">
      <a class="badge" href="{G_READ}" target="_blank" rel="noopener">{G_LOGO}<span><b><span data-count="5.0">5.0</span></b> {STARS}<small>Google reviews</small></span></a>
      <a class="badge" href="{YELP}" target="_blank" rel="noopener">{Y_LOGO}<span><b><span data-count="5.0">5.0</span></b> {STARS}<small>30 Yelp reviews</small></span></a>
      <div class="badge-actions">
        <a class="btn btn-dark" href="{G_WRITE}" target="_blank" rel="noopener">Leave a Google review</a>
        <a class="btn btn-ghost" href="{YELP}" target="_blank" rel="noopener">See all on Yelp</a>
      </div>
    </div>
  </div>
  <div class="rv-rows">{rows}</div>
</section>'''

def sign_section(current=None, title="Where Jose picks up", intro=None):
    rows = []
    for f, n, num, kind, label in CITIES:
        if f == current:
            continue
        rows.append(f'<li><a href="{R}{f}">{shield(num, kind)}<span>{esc(n)}</span>{GO}</a></li>')
    long_rows = "".join(f'<li><a href="{R}{f}">{shield(num)}<span>{esc(n)}</span>{GO}</a></li>' for f, n, num, l in ROUTES if f != current)
    intro = intro or "Based in Escondido, Chato's runs RV and vehicle moves across all of San Diego County, into Riverside County, and long distance to Nevada, Arizona and beyond. Pick your city for ZIP codes and local details."
    return f'''
<section class="sec" id="areas">
  <div class="wrap">
    <div class="sec-head">
      <h2>{title}</h2>
      <p>{intro}</p>
    </div>
    <nav class="sign" aria-label="Service areas">
      <div class="sign-inner">
        <p class="sign-title">RV towing &amp; transport, San Diego County</p>
        <ul class="sign-list">{''.join(rows)}</ul>
        <p class="sign-title sign-title-2">Long distance</p>
        <ul class="sign-list">{long_rows}</ul>
        <p class="sign-foot">Also serving San Diego, Vista, Poway, Rancho Bernardo, La Mesa, Lakeside, National City, Fallbrook, Valley Center, Orange County and Los Angeles.</p>
      </div>
    </nav>
  </div>
</section>'''

def map_svg(highlight=None):
    W, H = MAP["W"], MAP["H"]
    C = MAP["cities"]
    focus = {"CA", "NV", "AZ"}
    st = ""
    labels = {"CA": (190, 470, "California"), "NV": (470, 300, "Nevada"), "AZ": (700, 470, "Arizona"),
              "UT": (760, 260, "Utah")}
    for s in MAP["states"]:
        cls = "st on" if s["code"] in focus else "st"
        st += f'<path class="{cls}" d="{s["d"]}"/>'
    for code, (x, y, name) in labels.items():
        st += f'<text class="stl{" on" if code in focus else ""}" x="{x}" y="{y}">{name}</text>'
    ox, oy = C["escondido"]
    dests = [("sacramento", "Sacramento & Loomis", -1, "end"), ("sf", "San Francisco", -1, "end"), ("lasvegas", "Las Vegas, NV", 1, "start"),
             ("yuma", "Yuma, AZ", 1, "start"), ("indio", "Coachella Valley", 1, "start"), ("la", "LA & Orange County", -1, "end"),
             ("borrego", "Borrego Springs", 1, "start-low")]
    routes = ""
    for i, (k, name, side, anchor) in enumerate(dests):
        x, y = C[k]
        mx, my = (ox + x) / 2, (oy + y) / 2
        dx, dy = x - ox, y - oy
        ln = math.hypot(dx, dy) or 1
        bend = min(90, ln * 0.22) * side
        cx, cy = mx - dy / ln * bend, my + dx / ln * bend
        dy_lab = 5
        if anchor == "start-low":
            anchor, dy_lab = "start", 9
        lx = x + (10 if anchor == "start" else -10)
        routes += (f'<path class="route" style="--d:{i * 0.18:.2f}s" pathLength="1" d="M{ox},{oy} Q{cx:.1f},{cy:.1f} {x},{y}"/>'
                   f'<g class="dest" style="--d:{0.6 + i * 0.18:.2f}s"><circle cx="{x}" cy="{y}" r="6"/>'
                   f'<text x="{lx}" y="{y + dy_lab}" text-anchor="{anchor}">{name}</text></g>')
    lbx, lby = C["longbeach"]
    hawaii = (f'<path class="route sea" style="--d:1.4s" pathLength="1" d="M{lbx},{lby} Q{lbx - 140},{lby + 40} 112,{lby + 86}"/>'
              f'<g class="dest" style="--d:2s"><text x="120" y="{lby + 110}" text-anchor="start">Hawaii, by ship</text></g>')
    return f'''<svg class="map" viewBox="80 190 830 510" role="img" aria-label="Map of routes Chato's has run from San Diego County to Northern California, Las Vegas, Arizona and the Port of Long Beach">
  <g>{st}</g>
  <g>{routes}{hawaii}</g>
  <g class="home"><circle class="pulse" cx="{ox}" cy="{oy}" r="10"/><circle cx="{ox}" cy="{oy}" r="8"/><text x="{ox - 14}" y="{oy + 34}" text-anchor="end">San Diego County</text></g>
</svg>'''

def map_section(title="From San Diego to Nevada, Arizona and beyond", intro=None, dark=True):
    intro = intro or "Every line on this map is a real move from a Chato's customer review. Jose runs RVs and vehicles all over California and across state lines to Nevada and Arizona, and has delivered to the port for RVs and cars shipping to Hawaii."
    states = "".join(f"<li><b>{s}</b><span>{d}</span></li>" for s, d in [
        ("California", "San Diego to Sacramento, the Bay Area, LA, Orange County and the desert"),
        ("Nevada", "Las Vegas and southern Nevada"),
        ("Arizona", "Yuma and moves from Arizona back to San Diego"),
        ("Hawaii", "Port delivery for RVs and cars going by ship"),
        ("Other states", "Ask Jose. If it can be towed safely, he will tell you how")])
    return f'''
<section class="sec{' dark' if dark else ''} map-sec" id="long-distance">
  <div class="wrap map-grid">
    <div>
      <div class="sec-head"><h2>{title}</h2><p>{intro}</p></div>
      <ul class="states">{states}</ul>
      <p style="margin-top:24px"><a class="textlink light" href="{R}RV-Transport-San-Diego.html">Long-distance RV transport</a></p>
    </div>
    <div class="map-wrap">{map_svg()}</div>
  </div>
</section>'''

def values_section():
    vals = [
        ("Straight talk, every project", "Jose tells you honestly what your move needs, depending on your project. If something isn't safe or isn't worth it, you will hear it from him first.",
         "I appreciate his honest prices and great work.", "Liz R., Yelp"),
        ("Fair quote, guaranteed", "Your quote will always be fair. That's a promise. You get the price before anything is booked, and it doesn't change on moving day.",
         "The very reasonable price was determined up front. No surprises.", "Claudine S., Yelp"),
        ("Passion for the work", "Jose doesn't just haul trailers. He loves this work, and it shows in the way he backs a 43-foot fifth wheel into a spot others said was impossible.",
         "It's clear that Jose loves what he does and is good at it.", "Konstantin D., Yelp"),
        ("30 years of know-how", "Thirty years of grades, hitches, tight gates, desert heat and port paperwork. That experience means fewer surprises and a safer tow from start to finish.",
         "His 30 years of experience definitely shows!", "Vicky P., Yelp"),
    ]
    cards = "".join(f'''<article class="value"><h3>{t}</h3><p>{b}</p><blockquote>&ldquo;{q}&rdquo;<cite>{c}</cite></blockquote></article>''' for t, b, q, c in vals)
    return f'''
<section class="sec values-sec">
  <div class="wrap values-grid">
    <div class="values-intro">
      {seal("seal values-seal")}
      <h2>Why San Diego calls Jose first</h2>
      <p>Customers come for the truck. They come back for the man driving it.</p>
      <div class="btn-row">{call_btn("values")}</div>
    </div>
    <div class="values">{cards}</div>
  </div>
</section>'''

def zips_block(city, zips, hoods):
    z = "".join(f"<li>{x}</li>" for x in zips)
    h = ", ".join(hoods)
    return f'''
<section class="sec zips-sec">
  <div class="wrap">
    <div class="sec-head"><h2>{city} ZIP codes we serve</h2><p>RV moving, RV transport and car transport anywhere in these ZIP codes, including {h}.</p></div>
    <ul class="zips">{z}</ul>
  </div>
</section>'''

def also_hauls():
    items = [("Motorhomes &amp; park models", "Including park model RVs set into tight lots"), ("Tiny homes", "Trailers up to 45 feet, dealer to land"),
             ("Goosenecks &amp; bumper pulls", "Horse, cargo and vintage trailers like Airstream"), ("Boats on trailers", "From the launch ramp or the side of the freeway"),
             ("Motorcycles, ATVs &amp; UTVs", "Dirt bikes, side-by-sides, buggies and golf carts"), ("Small equipment", "Compact construction gear and small forklifts")]
    li = "".join(f"<li><b>{a}</b><span>{b}</span></li>" for a, b in items)
    return f'''
<section class="sec concrete">
  <div class="wrap">
    <div class="sec-head"><h2>If it rolls on a trailer, ask Jose</h2><p>Beyond RVs and cars, Chato's hauls a long list of things people don't know who to call for.</p></div>
    <ul class="hauls">{li}</ul>
  </div>
</section>'''

def steps_section(title="How a move works", items=None):
    items = items or [
        ("Text the details", "Pickup and drop-off, the RV or vehicle, its length, and a photo of how it is parked."),
        ("Get a fair quote", "Jose looks at distance, size and access and gives you an honest price before anything is booked."),
        ("Hook up and roll", "He shows up on time, checks the hitch, lights and tires, and sends updates on the way."),
        ("Parked where you want it", "Your RV or car is set in the spot you choose, even a tight driveway or storage space."),
    ]
    lis = "".join(f"<li><h3>{esc(h)}</h3><p>{esc(p)}</p></li>" for h, p in items)
    return f'''
<section class="sec concrete">
  <div class="wrap">
    <div class="sec-head"><h2>{title}</h2></div>
    <ol class="steps">{lis}</ol>
  </div>
</section>'''

def reels_section(title, intro, clips):
    figs = ""
    for name, cap in clips:
        figs += f'''
      <figure class="reel">
        <video muted loop playsinline preload="none" data-autoplay data-src="{R}video/{name}.mp4" poster="{R}video/{name}-poster.webp" width="432" height="768" aria-label="{esc(cap)}"></video>
        <figcaption>{esc(cap)}</figcaption>
      </figure>'''
    return f'''
<section class="sec dark">
  <div class="wrap">
    <div class="sec-head"><h2>{title}</h2><p>{intro}</p></div>
    <div class="reels">{figs}
    </div>
  </div>
</section>'''

def faq_section(faqs, title="Questions people ask before they call"):
    items = "".join(f'<details><summary>{esc(q)}</summary><div class="a"><p>{a}</p></div></details>' for q, a in faqs)
    return f'''
<section class="sec">
  <div class="wrap">
    <div class="sec-head"><h2>{title}</h2></div>
    <div class="faq">{items}</div>
  </div>
</section>'''

def band(title="Tell Jose what needs to move", text="Call or text with the pickup, the drop-off and what you are hauling. You will get an honest answer and a fair quote, guaranteed."):
    return f'''
<section class="band">
  <div class="road" aria-hidden="true"></div>
  <div class="wrap">
    <div><h2>{title}</h2><p>{text}</p></div>
    <div class="btn-row">{call_btn("band")}{text_btn("band", cls="btn btn-ghost", label="Text Jose")}</div>
  </div>
</section>'''

def related(links, title="Related services"):
    lis = "".join(f'<li><a href="{R}{p}">{esc(n)}</a></li>' for p, n in links)
    return f'''
<section class="sec concrete">
  <div class="wrap">
    <div class="sec-head"><h2>{title}</h2></div>
    <ul class="related">{lis}</ul>
  </div>
</section>'''

# ---------- page shell ----------
def with_years(desc):
    """Every meta description mentions Jose's 30 years of experience."""
    if "30 years" in desc:
        return desc
    for old, new in [(" Call (760) 532-1964.", " 30 years of experience. Call (760) 532-1964."),
                     (" Fair quote guaranteed.", " 30 years of experience, fair quote guaranteed."),
                     (" Owner-operated, door to door.", " 30 years of experience, door to door.")]:
        if old in desc:
            return desc.replace(old, new)
    return desc.rstrip(".") + ". 30 years of experience."

def page(path, title, desc, body, schema_items, og_image=OG_IMG, robots="index,follow", active=None):
    desc = META.get(path, with_years(desc) if robots.startswith("index") else desc)
    canonical = url_for(path)
    nav = ""
    for p, n in NAV:
        cur = ' aria-current="page"' if (active and p == active) else ""
        nav += f'<a href="{R}{p}"{cur}{' class="est-link"' if p.startswith("Quick") else ""}>{n}</a>'
    graph = {"@context": "https://schema.org", "@graph": schema_items}
    footer_cities = "".join(f'<li><a href="{R}{f}">{esc(l)}</a></li>' for f, n, num, k, l in CITIES)
    footer_routes = "".join(f'<li><a href="{R}{f}">{esc(l)}</a></li>' for f, n, num, l in ROUTES)
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<meta name="abstract" content="Chato's Auto Transport &amp; RV Towing: owner-operator Jose Barba, 30 years of experience moving RVs and vehicles from San Diego.">
<meta name="robots" content="{robots},max-image-preview:large">
<link rel="canonical" href="{canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="{esc(BIZ)}">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(desc)}">
<meta property="og:url" content="{canonical}">
<meta property="og:image" content="{og_image}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="White RAM 3500 dually towing a fifth wheel RV for Chato's in San Diego County">
<meta property="og:locale" content="en_US">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{esc(title)}">
<meta name="twitter:description" content="{esc(desc)}">
<meta name="twitter:image" content="{og_image}">
<meta name="theme-color" content="#24272b">
<meta name="geo.region" content="US-CA">
<meta name="geo.placename" content="San Diego County">
<link rel="icon" href="{R}favicon.ico" sizes="16x16 32x32 48x48">
<link rel="icon" type="image/png" sizes="32x32" href="{R}images/icons/favicon-32.png">
<link rel="icon" type="image/png" sizes="96x96" href="{R}images/icons/favicon-96.png">
<link rel="icon" type="image/png" sizes="192x192" href="{R}images/icons/favicon-192.png">
<link rel="apple-touch-icon" href="{R}apple-touch-icon.png">
<link rel="manifest" href="{R}site.webmanifest">
<link rel="preload" href="{R}assets/fonts/barlow-condensed-latin-800-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="{R}assets/fonts/barlow-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="{R}assets/css/site.css?v=2026-11m">
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){{w[l]=w[l]||[];w[l].push({{'gtm.start':new Date().getTime(),event:'gtm.js'}});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);}})(window,document,'script','dataLayer','GTM-WKH4VDNV');</script>
<!-- Google tag: GA4 + Google Ads (with call conversion number) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-QWQ6XN5SZ8"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}gtag('js',new Date());gtag('config','G-QWQ6XN5SZ8');gtag('config','AW-16819927573');gtag('config','AW-16819927573/d32PCKyOvZkaEJX0rtQ-',{{'phone_conversion_number':'{PHONE}'}});</script>
<script>document.documentElement.classList.add('js');</script>
<script type="application/ld+json">{json.dumps(graph, ensure_ascii=False)}</script>
</head>
<body>
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WKH4VDNV" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<a class="skip" href="#main">Skip to content</a>
<header class="top">
  <div class="wrap">
    <a class="brand" href="{R}index.html" aria-label="{esc(BIZ)} home">
      <img src="{R}images/brand/chatos-truck-logo-64.webp" srcset="{R}images/brand/chatos-truck-logo-64.webp 1x, {R}images/brand/chatos-truck-logo-128.webp 2x" alt="Chato's RV Towing Services logo" width="73" height="64">
      <span><b>Chato's</b><small>Auto Transport &amp; RV Towing</small></span>
    </a>
    <button class="menu-btn" aria-expanded="false" aria-controls="nav">Menu</button>
    <nav class="nav" id="nav" aria-label="Main">{nav}</nav>
    <div class="top-cta">{text_btn("header", label="Text")}{call_btn("header", label=PHONE)}</div>
  </div>
</header>
<main id="main">
{body}
</main>
<footer class="foot">
  <div class="wrap">
    <div class="foot-grid">
      <div>
        <a class="brand" href="{R}index.html"><img src="{R}images/brand/chatos-truck-logo-128.webp" alt="" width="73" height="64" loading="lazy"><span><b style="color:#fff">Chato's</b><small>Auto Transport &amp; RV Towing</small></span></a>
        <p><strong style="color:#fff">{esc(BIZ)}</strong><br>Owner and driver: {OWNER}, 30 years of experience. Based in Escondido, CA 92027. Serving San Diego County, Southern California, Nevada and Arizona.</p>
        <p><a href="{TEL}" data-where="footer">{PHONE}</a> &nbsp; <a href="{SMS}" data-where="footer">Text Jose</a></p>
        <p lang="es">Hablamos español.</p>
      </div>
      <div>
        <h2>Services</h2>
        <ul>
          <li><a href="{R}index.html">RV towing San Diego</a></li>
          <li><a href="{R}RV-Transport-San-Diego.html">RV transport San Diego</a></li>
          <li><a href="{R}Auto-Transport-San-Diego.html">Car transport San Diego</a></li>
          <li><a href="{R}Classic-Car-Transport-San-Diego.html">Classic car transport</a></li>
          {footer_routes}
          <li><a href="{R}blog/index.html">RV &amp; car transport tips</a></li>
        </ul>
      </div>
      <div>
        <h2>Service areas</h2>
        <ul>{footer_cities}</ul>
      </div>
      <div>
        <h2>Hours</h2>
        <div class="hours"><span>Sun to Fri</span><span>8 AM to 7 PM</span><span>Saturday</span><span>9 AM to 4 PM</span></div>
        <h2 style="margin-top:22px">Reviews &amp; social</h2>
        <ul>
          <li><a href="{G_LISTING}" target="_blank" rel="noopener">Google reviews</a></li>
          <li><a href="{YELP}" target="_blank" rel="noopener">Yelp reviews</a></li>
          <li><a href="{FB}" target="_blank" rel="noopener">Facebook</a></li>
          <li><a href="{IG}" target="_blank" rel="noopener">Instagram</a></li>
        </ul>
      </div>
    </div>
    <div class="foot-bottom">
      <span>&copy; 2026 {esc(BIZ)}. All rights reserved.</span>
      <span>Website by <a href="https://proleadyagency.com/" target="_blank" rel="noopener">ProLeady Agency</a></span>
    </div>
  </div>
</footer>
<div class="actionbar">{call_btn("sticky_bar", label="Call")}{text_btn("sticky_bar", label="Text")}</div>
<script src="{R}assets/js/site.js?v=2026-11m" defer></script>
</body>
</html>
'''

_HREF = re.compile(r'(href|content)="([^"]+?\.html)(#[^"]*)?"')
def _clean_links(path, html_text):
    """Rewrite internal .html links to clean, root-relative URLs (GitHub Pages serves /page as page.html)."""
    base = os.path.dirname(path)
    def fix(m):
        attr, url, frag = m.group(1), m.group(2), m.group(3) or ""
        if url.startswith(DOMAIN + "/"):
            return f'{attr}="{DOMAIN}/{clean_path(url[len(DOMAIN) + 1:])}{frag}"'
        if re.match(r"^[a-z]+:", url) or attr == "content":
            return m.group(0)
        site_path = os.path.normpath(os.path.join(base, url)) if not url.startswith("/") else url.lstrip("/")
        return f'{attr}="/{clean_path(site_path)}{frag}"'
    return _HREF.sub(fix, html_text)

def write(path, content):
    if path.endswith(".html"):
        content = _clean_links(path, content)
    full = os.path.join(OUT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        f.write(content)

R = ""
PAGES = []

exec(open(os.path.join(HERE, "content.py"), encoding="utf-8").read())
