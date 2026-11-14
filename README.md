# Chato's Auto Transport & RV Towing website

Live site: https://chatosrvtowingsd.com
Owner: Jose Barba. Website by ProLeady Agency.

## Folder structure

```
.github/workflows/deploy.yml   Deploys /site to GitHub Pages on every push to main,
                               and every Monday refreshes the diesel price.
site/                          Everything that goes live (this folder is the website root)
  index.html                   Home (RV towing San Diego)
  *.html                       Service, city and route pages (URLs kept from the 2024 site)
  Quick-Estimate.html          Quick estimate tool
  blog/                        Tips articles
  assets/
    css/site.css               All styles
    js/site.js                 Menu, animations, call/text tracking
    js/estimate.js             Quick estimate (prices in CONFIG at the top)
    data/fuel.json             Diesel price used by the estimate (auto-updated weekly)
    fonts/                     Barlow and Barlow Condensed (self-hosted)
    vendor/                    Map libraries for the estimate (MapLibre, Leaflet fallback)
  images/
    brand/                     Logos and the social share image
    icons/                     Favicons for Android and browsers
    photos/                    Job photos (WebP, several sizes)
  video/                       Short job clips (MP4) and their posters
  favicon.ico, apple-touch-icon.png, site.webmanifest, robots.txt, sitemap.xml, 404.html
src/                           Page generator (not deployed)
  build.py                     Layout, header, footer, schema, shared sections
  content.py                   Home, RV transport, car transport, classic cars
  content_cities.py            City pages, route pages, quick estimate, blog, sitemap
  meta.py                      Meta descriptions for every page
  map.json, gear_path.txt      Route map and gear seal shapes
```

## Editing pages

1. Change the text in `src/content.py`, `src/content_cities.py` or `src/meta.py`.
2. Run `python3 src/build.py`. It rewrites every HTML file in `site/`.
3. Commit and push to `main`. GitHub Actions publishes it in about a minute.

Styles and scripts in `site/assets/` are edited directly; the generator does not touch them.

## Quick estimate

- Rates are in `CONFIG` at the top of `site/assets/js/estimate.js`. Confirm them with Jose.
- Distance starts at Jose's base, 1572 Bear Valley Pkwy, Escondido.
- Address search: Photon (OpenStreetMap). Routing: OSRM. Car models: NHTSA. Map: MapLibre with OpenFreeMap vector tiles in Chato's colors (colors in BRAND inside estimate.js); falls back to Leaflet + OpenStreetMap. No API keys needed.
- Diesel price: add a free EIA key (https://www.eia.gov/opendata/register.php) as the repo secret `EIA_API_KEY` to turn on the weekly update. Without it the site uses the value in `site/assets/data/fuel.json`. `dieselAdjust` in `CONFIG` adds a San Diego premium on top.

## Tracking

GTM `GTM-WKH4VDNV`, GA4 `G-QWQ6XN5SZ8`, Google Ads `AW-16819927573` with call conversion.
Events: `phone_call_click`, `text_message_click`, `email_click`, `estimate_started`, `estimate_completed`, `estimate_sent`.

## GitHub Pages settings

Settings > Pages > Source: **GitHub Actions**. Custom domain: `chatosrvtowingsd.com`, Enforce HTTPS on.
For `www.chatosrvtowingsd.com` to work, add a `www` CNAME record at the DNS provider pointing to `satanx6st.github.io`.
