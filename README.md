# Fillox.dk

Marketingsitet for Fillox Danmark: behandlinger, priser, klinikker, behandlere, blog og
online booking. Bygget ud fra Claude Design-filen **"Fillox Signature v2"** (Bold & Bordeaux,
designmanual 2026 — kilden ligger i `design-reference/`), i Anettes farver fra 10. oktober 2026:
offwhite baggrund, Lys Rosa og plum, med lidt sandbeige (se `ARCHITECTURE.md` → "Design tokens").

Søsterrepoet `fillox-no` (fillox.no) laves ud fra dette repo ved at bytte markedsdata ud —
se [Rebranding til fillox.no](#rebranding-til-filloxno). Arkitekturen og reglerne for koden
står i `ARCHITECTURE.md`.

## Stack

- **Next.js 16** (App Router, React 19, TypeScript) — alle sider genereres statisk
- **Tailwind CSS v4** — design-tokens i `app/globals.css`
- **Netlify** — hosting (`netlify.toml`, Next.js-runtime)
- **Netlify Forms** — kontaktformular og nyhedsbrev (ingen backend)
- **Gecko Booking** — online booking på `/booking` (TIMMA understøttes til fillox.no)
- **Cookiebanner + Google Tag Manager** — statistik og marketing indlæses først efter samtykke
  (se "Cookiebanner og måling")

Ingen database og ingen miljøvariabler.

## Lokal udvikling

```bash
npm install
npm run dev              # http://localhost:3000
```

I `npm run dev` har hver side en rund **Farver**-knap nederst til højre: skift farverne live,
se kontrasten (AA ✓/✗), og tryk "Kopiér farver" for at sende ændringerne videre. Ændringerne
gemmes kun i din browser; de rigtige farver ændres i `app/globals.css`. Knappen findes ikke i
det byggede site (se `ARCHITECTURE.md` → "Colour tuner").

Tjek før commit:

```bash
npx tsc --noEmit         # typer
npm run lint             # ESLint
npm run check:market     # markedsdata hænger sammen (se nedenfor)
npm run build            # kører check:market først (prebuild)
```

**Al tekst og alle markedsdata ligger i `content/**` og `config/site.ts`** — aldrig i
`components/` eller `app/`. Skal en tekst, pris, adresse eller et link ændres, er det dér.

`npm run check:market` stopper buildet, hvis:

- en rute i `content/routes.ts` ikke har en `app/<sti>/page.tsx` (eller omvendt), eller en
  redirect i `content/redirects.ts` peger på en side, der ikke findes (eller på en fil, sitet ikke
  serverer: `/sitemap.xml`, et ikon i `app/` eller en fil i `public/`, fx `/legacy-sitemap.xml`);
- en redirect eller en prisrække (`content/prices.ts` → `treatmentSlug` / `treatmentAnchor`) peger
  på en behandling, der ikke findes, eller på et `#anker`, som siden ikke har (afsnit og kort på
  de lange behandlingssider, fx `/behandlinger/andre-behandlingsmuligheder#lip-flip`);
- en formular i `content/forms.ts` ikke er erklæret i `public/__forms.html` (eller omvendt), eller
  `public/__kontakt-sendt.html` / `public/__nyhedsbrev-tilmeldt.html` ikke sender videre til deres
  takkeside (`routes.contactThanks` / `routes.newsletterThanks`);
- booking-udbyderen mangler id'er (TIMMA: `timmaId` på hver åben klinik);
- en åben kliniks adresse eller åbningstider ikke kan læses ind i de strukturerede data
  (sidste adresselinje skal være `<postnr> <by>`, tider som `10–20`, dag-labels i
  `content/seo.ts` → `openingDays`);
- et udgivet blogindlæg eller en filterknap på `/blog` nævner Botox, det aktive stof eller et
  andet mærke af det (adresse, titel, uddrag, kategori, tags, billede, overskrifter, bookingkort,
  links), eller et indlæg viser et bookingkort (med "fra"-pris) til rynkesiderne;
- sikkerheds-headerne i `netlify.toml` ikke er præcis dem i `config/securityHeaders.ts` (navne og
  værdier), en anden `[[headers]]`-blok også sætter en af dem, `next.config.ts` → `headers()`
  (som scriptet kører) ikke sender præcis den liste på `/:path*` (eller sætter en af dem på en
  anden sti), eller CSP'en ikke tillader booking-udbyderen (Geckos script og kalender, eller
  TIMMA-siden) og, med en GTM-container, `www.googletagmanager.com`;
- en behandler (`content/team.ts`) uden foto har en profilside, et delingsbillede eller et
  priskort, eller en behandler med profilside mangler foto (filen i `public/`), delingsbillede
  eller sin række i ansigtstabellen (`faces`);
- en behandlers `clinicSlugs` (det eneste sted, der står, hvor hun eller han arbejder) nævner en
  klinik, der ikke findes eller ikke er åben, en behandler ingen klinik har (undtagen dem i
  `clinicsUnknown`, i dag ingen), en tekst om behandleren (kort, profil, "Din behandler" på
  behandlingssiderne) nævner en anden klinik (også med små bogstaver, med eller uden mellemrum som
  "City 2", eller som "Frb" eller "Taastrup"), eller profilen ikke har kortet "Arbejder i";
- der står æ, ø eller å i en streng i `app/`, `components/` eller `lib/` (tekst hører til i
  `content/`; udviklerværktøjet i `components/dev/` er undtaget).

Klinikker uden Gecko-kalender-id vises som en note (ikke en fejl), og det samme gør
Trustpilot-tallene i `config/site.ts`, når `trustpilot.checked` er mere end 60 dage gammel.

## Deploy til Netlify

`netlify.toml` bygger med `npm run build` (inkl. `check:market`) og udgiver `.next` med
Netlifys Next.js-runtime. Ingen miljøvariabler at sætte i Netlify: Node-versionen står i
`netlify.toml` (`NODE_VERSION = "22"`; Next 16 kræver Node ≥ 20.9, se `engines` i `package.json`).

Sikkerheds-headers (HSTS som det gamle site, `X-Content-Type-Options`, `Referrer-Policy`,
`X-Frame-Options`, `Permissions-Policy` og en Content-Security-Policy, der i første omgang kun
rapporterer: `Content-Security-Policy-Report-Only`, se "Efter lancering") står ét sted:
`config/securityHeaders.ts`. `next.config.ts` → `headers()` sender dem på alt, Next.js-serveren
svarer: sider, robots.txt, sitemap.xml, manifestet og 404-siden (de svar når Netlifys `[[headers]]`
ikke). `netlify.toml` gentager samme liste for de filer, Netlifys CDN selv leverer (billeder i
`public/`, `/_next/static`, `/_next/image`). **Ret altid i begge filer**: `npm run check:market`
(også før hvert build) fejler, hvis et navn eller en værdi afviger. De gamle URL'ers
308-videresendelser får ingen headers fra Next.js (det gør Next.js bevidst); det er uskadeligt, og
Netlify sætter selv HSTS og nosniff på dem.

CSP'en (`config/securityHeaders.ts` → `cspDirectives`) tillader kun Gecko (script +
kalender-iframe), de betalingssider, Gecko kan åbne i iframen (Nets Easy, OnPay), og værterne for
taggene i GTM-containeren (Google Tag Manager, Google Analytics, Google Ads, Meta Pixel; de indlæses
kun efter samtykke). Lægger I et nyt tredjepartsscript, en ny iframe eller et nyt tag i containeren
på sitet, skal værten med i CSP'en (begge filer).

1. Forbind repoet i Netlify → build-indstillingerne læses fra `netlify.toml`.
2. Domæne: `fillox.dk` (+ `www`) → Netlify, HTTPS via Let's Encrypt. **Følg "Domæneskiftet"
   nedenfor**: apex som primært domæne og et nyt deploy bagefter, ellers bliver sitet ikke indekseret.
3. Gamle WordPress-URL'er sendes videre med 308 (`content/redirects.ts`, via `next.config.ts`).
   WordPress' sitemaps sender videre til `/sitemap.xml` (indekset) og `/legacy-sitemap.xml` (de to
   undersitemaps): `public/legacy-sitemap.xml` lister de 44 gamle adresser, der nu redirecter, så
   Google finder redirects hurtigere.
4. Efter første deploy: indsend `https://fillox.dk/sitemap.xml` **og**
   `https://fillox.dk/legacy-sitemap.xml` i Google Search Console (se "Efter lancering").

### Domæneskiftet

Om sitet må indekseres, afgøres, når det **bygges** (`lib/indexing.ts`): kun et production-build,
hvor Netlifys primære domæne (`URL`) er præcis `https://fillox.dk` (`config/site.ts` → `url`), er
indekserbart. Buildet på `fillox-dk.netlify.app` svarer `Disallow: /` i robots.txt og har
`noindex, nofollow` på alle sider, og begge dele ligger færdige i buildet. Peger man blot domænet om,
fortsætter præcis det build på fillox.dk, og hele sitet er blokeret for søgemaskiner (også de gamle
adressers 308-viderestillinger), indtil nogen deployer igen. Derfor, i denne rækkefølge:

1. Netlify → **Domain management**: tilføj `fillox.dk`, og sæt **`fillox.dk` (apex) som primært
   domæne**; `www.fillox.dk` er et alias, der viderestiller dertil. Bliver www primært (Netlify kan
   foreslå det), er `URL` `https://www.fillox.dk`: sitet bliver aldrig indekserbart, og alle
   canonicals peger på et domæne, der viderestiller.
2. **Deploys → Trigger deploy → "Deploy site"** ("Clear cache and deploy site" skader ikke): et nyt
   production-build, der ser det nye primære domæne.
3. Tjek bagefter:
   - `curl -s https://fillox.dk/robots.txt` viser `Allow: /` og `Sitemap: https://fillox.dk/sitemap.xml`;
   - `curl -s https://fillox.dk/ | grep -o '<meta name="robots"[^>]*>'` viser kun
     `max-image-preview:large` (intet `noindex`);
   - `curl -sI https://www.fillox.dk/` giver 301 til `https://fillox.dk/`.

## Formularer via Netlify Forms

| Formular | Navn (`content/forms.ts`) | Hvor |
|---|---|---|
| Kontakt | `kontakt` | `/kontakt` |
| Nyhedsbrev | `nyhedsbrev` | footeren på alle sider + `/blog` |

- Netlify finder formularerne ved deploy i `public/__forms.html` (skjult, aldrig linket).
  Feltnavnene dér skal matche det, komponenterne sender.
- Med JavaScript sender siden data til `/__forms.html` (`lib/forms.ts`) og viser en kvittering
  på stedet. Uden JavaScript poster kontaktformularen til `public/__kontakt-sendt.html`, som
  sender videre til `/kontakt/tak`, og nyhedsbrevet til `public/__nyhedsbrev-tilmeldt.html`, som
  sender videre til `/nyhedsbrev/tak`. Filerne i `public/` indeholder ingen tekst.
- Nyhedsbrevet: privatlivspolitikken har et afsnit om det (`content/pages/legal.ts`, "12.
  Nyhedsbrev"), som begge tilmeldinger linker til. Skal godkendes af Fillox inden lancering (se
  TODO'en dér: mailværktøjet og databehandleraftalen med det, og hvor længe beviset for samtykket
  gemmes; overførslen til USA via Netlify står i afsnittet siden 26/11-2026). Nyhedsbrevet sender
  kun nyheder, artikler og gode råd, ingen tilbud, og aldrig reklame for rynkebehandling eller
  andre receptpligtige lægemidler (se "'Tilbud' i nyhedsbrevet").
- Kontaktformularen: afsnittet "14. Kontaktformular" i privatlivspolitikken, som formularen linker
  til (se "Privatlivspolitikken og kontaktformularen").
- Spam: honeypot-feltet `bot-field`.
- Notifikationer (e-mail ved ny besked) sættes op i Netlify under **Forms → Form notifications**,
  kun til en mailboks, som kun behandlerne læser (se "Hvem læser beskederne?").

## Cookiebanner og måling

- Første besøg: et banner nederst på siden ("Accepter alle", "Afvis alle" og "Tilpas" med
  Statistik og Marketing, intet sat til på forhånd). Indtil et ja indlæses **intet** fra Google
  eller Meta: Google Tag Manager (`config/site.ts` → `analytics.gtmId`, GTM-KDBJMVF2) hentes først,
  når Statistik eller Marketing er valgt, efter Google Consent Mode v2 (alt afvist som standard,
  så valget som `update`). "Afvis alle" sletter de gamle `_ga`/`_gcl_*`/`_fbp`-cookies fra
  WordPress-sitet og PixelYourSite-pluginnets cookies (`pys*`, `last_pys*`, `pbid`; navnene er
  fra pluginnets cookieliste: bekræft dem i en browser, der har besøgt det gamle site).
- Valget gemmes i browseren (`fillox-consent` i localStorage) i 12 måneder; banneret spørger igen,
  når `consentVersion` i `config/site.ts` ændres. "Cookieindstillinger" i footeren åbner banneret
  igen; trækkes et samtykke tilbage, slettes cookies, og siden genindlæses — også i andre åbne
  faner med sitet (de følger valget med det samme).
- Banneret ligger under headeren: mobilmenuen og menuerne "Priser", "Find klinik" og "Om os"
  dækker det, mens de er åbne.
- Tekster og cookielisten (privatlivspolitikken → "13. Cookies") står i `content/consent.ts`.
  **Nyt tag i containeren** (Hotjar, TikTok, Google Ads-remarketing …): samtykkeindstilling på
  tagget i GTM, værterne i CSP'en (`config/securityHeaders.ts` → `cspDirectives` og kopien i
  `netlify.toml`), en linje i cookielisten og en ny
  `consentVersion`, så alle bliver spurgt igen.
- Indtil containerens Meta Pixel-tags har et samtykketjek (se "Før lancering"), blokerer sitet alle
  Custom HTML-tags uden Marketing (`analytics.blockCustomHtmlWithoutMarketing`).

## Booking via Gecko

- `config/site.ts` → `booking`: `provider: "gecko"`, Gecko-host og `geckoIcCode`.
- `/booking` viser Gecko-kalenderen (`components/booking/BookingEmbed.tsx` → `GeckoEmbed.tsx`,
  som indlæser Geckos `iframe.js`).
- Kan kalenderen ikke indlæses (uden JavaScript, `iframe.js` blokeret af en adblocker eller CSP'en,
  Gecko nede, eller ingen kalender efter 8 sekunder), viser kortet "Kalenderen kunne ikke
  indlæses. Ring eller skriv til os, så finder vi en tid sammen." med telefon og e-mail
  (`components/booking/BookingUnavailable.tsx`, teksten i `content/layout.ts` →
  `booking.unavailable`). Beskeden forsvinder, så snart kalenderen kommer.
- Klinik-links ("Book →" i menuerne, klinikkortene) bygges af `lib/booking.ts`:
  - med et Gecko-kalender-id: `/booking?geckoCalendarId=12`, og Gecko vælger klinikken på forhånd;
  - uden: `/booking?klinik=<slug>` (kalenderen åbner uden filter).
- Behandler-links er `/booking?behandler=<slug>` (Gecko læser dem ikke; de er til statistik).
- Kalender-id'erne sættes pr. klinik i `content/clinics.ts` → `booking: { geckoCalendarId: "12" }`
  (id'et findes i Gecko-admin; `"12.13"` for flere kalendere).
- Kalenderens udseende (skrift, farver, knapper) er et CSS-tema, der sættes ind **i Gecko**:
  `integrations/gecko/fillox-booking-theme.css`, vejledning i `integrations/gecko/README.md`.
  Temaet følger hjemmesidens farver og skrifter; ændres de, skal temaet opdateres og sættes ind
  i Gecko igen.

## Før lancering

- [ ] **Gecko-kalender-id'er** på City2, Amager Centret og Frederiksberg i `content/clinics.ts`
      (`booking.geckoCalendarId`), så klinik-links vælger klinikken i kalenderen.
- [ ] **Gecko-tema**: sæt den nye `integrations/gecko/fillox-booking-theme.css` (Figtree,
      Poppins-overskrifter, Anettes farver fra 10. oktober) ind i Gecko i stedet for det gamle
      tema, se `integrations/gecko/README.md`. Ellers er kalenderen på `/booking` stadig plum med
      Poppins.
- [ ] **Copy review** — alle `// TODO: copy review` i `content/**` (tekster, der ikke står i
      designet og er skrevet i designets tone):
  - [ ] `content/layout.ts`: SEO-titel/-beskrivelse, alt-tekst på delingsbillede, skjulte
        skærmlæser-navne, "Læs om finansiering", "Se alle …"-links i mobilmenuen, 404-siden og
        hele `/booking`-teksten
  - [ ] `content/pages/home.ts`: SEO-titel, alt-tekst, skjulte navne
  - [ ] `content/pages/about.ts`: meta-beskrivelse, alt-tekst
  - [ ] `content/pages/new-here.ts`: hele `/ny-hos-fillox` (oversat fra norsk, se "Ny hos
        Fillox?" nedenfor) og de tekster, der ikke står i udkastet (meta, link-tekster, alt-tekster)
  - [ ] `content/treatments.ts`: one-liners for behandlinger uden egen side, tekster på Lip
        filler-siden, og på rynkesiderne kort-teksten, mega-menuens navn "Andre behandlinger" og
        linket "Andre behandlingsmuligheder →" (se "Rynkesiderne" nedenfor)
  - [ ] "rynkebehandling" i stedet for "Botox": `content/prices.ts` (priskortets etiket og chip,
        /priser-metabeskrivelsen), `content/layout.ts` (sitets beskrivelse),
        `content/navigation.ts` ("For mænd"-noten), `content/pages/home.ts` og
        `content/pages/men.ts`
  - [ ] `content/pages/treatments.ts`: fallback-tekster, FAQ'er, oversigtssiden `/behandlinger`
  - [ ] `content/pages/practitioner.ts`: behandlersider (tekst i booking-båndet pr. behandler)
  - [ ] `content/pages/contact.ts`: meta, kort, formularens tilstande og linjen ved beskedfeltet
        (26/11-2026, se "Helbredsoplysninger i formularen"). Intet samtykke-felt på desktop: afsnit 14
        bygger ikke længere på samtykke (26/11-2026), og feltet på mobil er ikke et samtykke. E-mail-kortet siger nu "Svar inden
        for én hverdag" (designet 6ko: "Svar inden for 24 timer") ligesom mobilintroen og
        takkesiden, så sitet kun giver ét løfte (25/11-2026): **det er jeres løfte om svartid.**
        Foretrækker I 24 timer, ændres det alle tre steder.
  - [ ] `content/pages/clinics.ts`: meta, skjulte navne, "Få besked"-formularen
  - [ ] `content/pages/blog.ts` og `content/blog.ts`: de syv artikler, bloggens overskrift, intro
        og nyhedsbrev, og intro-linjen over artiklerne på behandlingssiderne (`content/treatments.ts`,
        `content/pages/treatments.ts`; se "Blog" nedenfor)
  - [ ] `content/consent.ts`: cookiebanneret og afsnittet "13. Cookies" i privatlivspolitikken
        (nye tekster, se "Cookiebanner og måling" nedenfor)
  - [ ] `content/pages/jobs.ts` og `content/pages/creator.ts`: hele siderne (ikke i designet)
  - [ ] `content/pages/legal.ts`: meta-beskrivelser og "Juridisk"-eyebrow, og siden 26/11-2026 hele
        `/handelsbetingelser`, afsnit 14 i privatlivspolitikken og de nye sætninger i afsnit 12
        (formålet og overførslen til USA; se "Handelsbetingelserne" og "Privatlivspolitikken og
        kontaktformularen")
  - [ ] **Rettet efter ejerens svar 26/11-2026** (punkt 1–7 og 9 i gennemgangen, alle markeret
        `// TODO: copy review`): de nye sætninger i `content/treatments.ts`, `content/blog.ts`,
        `content/pages/treatments.ts` (løfter om resultater, opløsning af filler, "et lokalbedøvende
        middel"), `content/pages/new-here.ts` (hudtone-kortet og kortet "Laser hårfjerning"),
        `content/pages/about.ts` ("rynkebehandling"), `content/prices.ts` ("Opløsning af filler",
        "Lægekonsultation før første rynkebehandling", "Laserpakker, overkrop" og chippen "Laser
        overkrop"), `content/pages/men.ts` (kæbelinje-rækken og FAQ'en om pris), `content/team.ts` (Dr.
        Toms tillægssætning), `content/layout.ts` og `content/pages/blog.ts` (nyhedsbrevet),
        `content/pages/contact.ts` (linkene til privatlivspolitikken) og `content/pages/legal.ts`. Se
        de enkelte punkter nedenfor.
  - [ ] **Rettet efter gennemgangen 25/11-2026** (alle markeret `// TODO: copy review`):
    - Tear trough lover ikke længere: FAQ'en siger "… placere filleren rigtigt, så risikoen for det
      bliver så lille som muligt" (før "så du undgår det"), og "En af de bedste ikke-kirurgiske
      løsninger på trætte øjne." er taget ud af introen og metateksten.
    - Kortet for laser hårfjerning på `/behandlinger` siger "Langvarig hårfjerning …" (designets
      "Permanent hårfjerning …"; sidens egen FAQ siger, at det ikke kan garanteres).
    - Siderne for mænd taler ikke længere til kvinder: Kæbelinje for mænd uden "… og giver mere
      karakter hos kvinder" og "… eller feminine træk"; Laser for mænd har "Godt til" ryg og
      skuldre, bryst og mave, nakke og skæglinje, armhuler, arme og ben (fra pakkerne på
      overkroppen), ikke "Bikini og brasil", og ikke FAQ'en "Kan mænd også få laser hårfjerning?".
    - "Lip filler" staves sådan overalt (før "Lip Filler" i sidens overskrift, brødkrumme,
      bookingknapper, `/behandlinger`-kortet, `/ny-hos-fillox` og bookingkortet i artiklerne).
    - Lip filler-introen: "Vi doserer konservativt, så du altid kan bygge på senere." (kommafejl);
      Kindben-FAQ'en: "… og sammen aftaler vi det ønskede resultat."
    - Klinikkernes bookingknapper på `/klinikker` (desktop) siger "Book i Fillox Frederiksberg"
      (designets "Book i Frederiksberg" / "Book i Østerbro": forkert forholdsord).
    - Dr. Toms priskort siger på alle bredder (før kun i booking-båndet, som ikke vises under
      768 px), at hans behandlinger har et specialist-tillæg efter aftale; siden 26/11-2026 undtagen
      næsekorrektion (se "Lægetillægget og Næsekorrektion").
    - Metateksten på rynkesiden er bureauets sætning forkortet til 146 tegn (siden selv er uændret),
      og bloggen hedder "Blog om behandlinger og efterpleje" i søgeresultater.
    - Skærmlæsere kalder hver anmeldelse "dias" (før det engelske "slide"), og de to links "Hage" på
      `/priser` hedder for skærmlæsere "Hage (fillers)" og "Hage (laser hårfjerning)".
    - Syv gamle adresser for nasolabiale linjer, marionetlinjer og ansigtskonturering sender nu
      videre til `/priser#fillers`, hvor behandlingerne står med navn og pris (før `/behandlinger`,
      som ikke nævner dem).
- [x] **Pris**: Skinbooster står "fra 999 kr" på forsiden i designet, men 1.499 kr alle andre
      steder — vi bruger 1.499 kr (`content/treatments.ts`, bestsellers). Afklaret: live /priser
      (ændret 17/11-2026) starter skinboosters ved Ejal 40 til 1.499 kr (Microneedling, nu 1.200 kr,
      er ikke en skinbooster).
- [ ] **Priser ændret i WordPress efter kopien** (live /priser ændret 17/11-2026; `content/prices.ts`
      er kopieret 1/10-2026). Rettet 24/11-2026 efter live: Opløsning af filler 899 → 999 kr,
      Microneedling 999 / 2.499 → 1.200 / 3.000 kr (følger med på behandlingssiden, i menuerne, på
      `/ny-hos-fillox` og i Albertes priskort). Alle 111 rækker var ellers ens. Siden 26/11-2026 har
      prislisten 108 rækker: tre laserpakker er taget ud, og to etiketter er ændret (se
      "Laserpriser for mænd og kvinder", "Hyalase" og "Botox og markedsføring" → "Priser"). Åbent:
  - [ ] Aftal et **content-freeze** på priserne i WordPress frem til lanceringen. På
        lanceringsdagen: hent https://fillox.dk/priser/ igen, sammenlign række for række med
        `content/prices.ts`, og ret afvigelser dér. Spring de tre laserpakker over, der er taget ud
        26/11-2026 ("Mave + bryst" 1.700, "Ryg + skuldre" 2.750 og "Ryg + skuldre + mave + bryst"
        3.900 kr), og læs "Laserpakker for mænd" som "Laserpakker, overkrop", "Opløsning af filler
        (Hyalase)" som "Opløsning af filler" og "Lægekonsultation før første botox" som "… før første
        rynkebehandling".
  - [ ] Live hedder overskriften nu **"Microneedling & Exosomer"**. Skal rækkerne på det nye site
        nævne exosomer? (Vi skriver ikke selv en ny etiket.)
- [ ] **Trustpilot-tallene på lanceringsdagen**: 4,7 og 172 anmeldelser er aflæst 1/10-2026 og står i
      forsidens hero, footer-strimlen og profilernes fakta. Aflæs score og antal på
      https://dk.trustpilot.com/review/fillox.dk, og opdatér `score`, `reviewCount` og `checked` i
      `config/site.ts` samtidig (Trustpilot afviser automatiske opslag, så det skal gøres i en browser).
- [ ] **Juridisk**: registreret adresse og mailadresse til databeskyttelse (`info@` i afsnit 1 på
      privatlivssiden, `kontakt@` i `config/site.ts` og i afsnit 12 og 14) — `content/pages/legal.ts`.
- [x] **Privatlivspolitikken og kontaktformularen** (du, 26/11-2026: "ret det hele som du har
      skrevet til mig. alt fra punkt 1-9"): nyt afsnit "14. Kontaktformular" (`#kontaktformular`) med
      felterne, formålet, retsgrundlaget (art. 6, stk. 1, litra f, og for helbredsoplysninger i
      beskeden art. 9, stk. 2, litra h, jf. databeskyttelseslovens § 7, stk. 3; se "Helbredsoplysninger
      i formularen" nedenfor), opbevaring, Netlify, Inc. som databehandler, overførslen til
      USA via EU-U.S. Data Privacy Framework (Netlify, Inc står som "Active" på
      dataprivacyframework.gov, tjekket 26/11-2026) og retten til indsigelse; afsnit 12 har fået samme
      overførselsgrundlag. Formularen linker dertil: afkrydsningsfeltet på mobil ("… som beskrevet i privatlivspolitikken")
      og en linje over knappen fra 768 px ("Vi bruger dine oplysninger til at besvare din
      henvendelse. Læs mere i vores privatlivspolitik."). Opfølgning:
  - [ ] **Slet besvarede beskeder i Netlify** (Forms → "kontakt"): afsnit 14 lover, at en henvendelse
        slettes, når den er besvaret og fulgt op, og Netlify gemmer dem, til de slettes. Aftal en fast
        rytme, fx hver måned.
  - [x] **Helbredsoplysninger i formularen** (du, 26/11-2026: "nej du skal ikke skeive det i
        kontaktformularen. virker dumt.. ingen sender hvis der ikke er mulighed for at sende?" og
        "måske skriv kort sætning med du behøves ikke at skrive personlig oplysnigner, vi ringer til
        dig og tager en snak om det"): formularen forbyder ikke noget. Mellem "Besked" og feltet står
        nu "Du behøver ikke at skrive detaljer om dit helbred – giv os dit nummer, så ringer vi og
        tager en snak om det." (`content/pages/contact.ts` → `form.fields.message.hint`; "detaljer om
        dit helbred", ikke "personlige oplysninger", fordi navn og e-mail også er personlige
        oplysninger og skal udfyldes). Afsnit 14 (`content/pages/legal.ts`) lover ikke længere et
        samtykke, som formularen aldrig indhenter, og siger det samme som linjen. Besvarelsen hviler på
        ét retsgrundlag (art. 6, stk. 1, litra f). Krydset på mobil er ikke et samtykke: vi skal bruge
        oplysningerne for at kunne svare, og feltet skal udfyldes for at sende, så det er ikke et frit
        valg (art. 4, nr. 11; Datatilsynet, "Samtykke", 2021, afsnit 2.3). Fejlteksten ved feltet er nu
        "Sæt kryds i feltet for at sende din besked." Helbredsoplysninger, der kommer alligevel:
        art. 9, stk. 2, litra h, jf. databeskyttelseslovens § 7, stk. 3; det, der er vigtigt for en
        behandling, skrives i journalen (afsnit 3 og 6). "Tilbagetrækning" (af samtykke) er erstattet
        af "Indsigelse" (art. 21). Ingen jurist har vurderet afsnit 14. Kilderne står i kommentaren
        over afsnittet. Åbent:
    - [ ] **Hvem læser beskederne? (svar før lanceringen)**: § 7, stk. 3 gælder kun, når
          oplysningerne behandles af sundhedspersoner med tavshedspligt efter loven. Hvem kan åbne
          beskederne i Netlify (Forms) og i den mailboks, der får besked om nye beskeder? Er det kun
          Dr. Tom og sygeplejerskerne, tilføjer vi i afsnit 14: "Hos os er det kun vores behandlere,
          der læser og besvarer beskederne. De er sundhedspersoner og har tavshedspligt." Læser andet
          sundhedsfagligt personale med på en behandlers ansvar: "Hos os læses beskederne kun af vores
          behandlere og af sundhedsfagligt personale, der arbejder på deres ansvar. De har alle
          tavshedspligt." En receptionist, der kun booker, er næppe sundhedsperson (sundhedsloven § 6;
          vejledning nr. 10248 af 15/12/2025), og tavshedspligt i en ansættelseskontrakt er ikke
          tavshedspligt efter loven. Læser receptionen med, så begræns adgangen, før sitet går live:
          kun behandlerne må kunne se beskederne i Netlify og i notifikations-mailboksen. Det hjælper
          ikke at fjerne sætningen om art. 9 fra afsnit 14, for så har helbredsoplysninger i beskederne
          slet intet grundlag.
    - [ ] **Netlifys databehandleraftale** (Exhibit I, punkt 4: ingen følsomme oplysninger,
          medmindre aftalen tillader det) er stadig en restrisiko. Linjen ved beskedfeltet får færre
          til at skrive om deres helbred, men nogle gør det alligevel. Slet besvarede beskeder hurtigt
          (se "Slet besvarede beskeder i Netlify"), og overvej på sigt en formularudbyder, hvis aftale
          dækker helbredsoplysninger.
    - [ ] **Krydset på mobil** siger stadig "Jeg accepterer …" og ligner et samtykke, selv om afsnit
          14 nu siger, at det ikke er det. Det kan erstattes af samme linje som fra 768 px ("Vi bruger
          dine oplysninger til at besvare din henvendelse. Læs mere i vores privatlivspolitik."), så
          formularen også bliver kortere på mobil. Designet (mc) har feltet, så det er jeres valg.
  - [ ] **IP-adresse i Netlify Forms**: Netlify har oplyst (supportforum 2020–2021, ikke i deres
        dokumentation), at IP-adressen gemmes med hver indsendelse. Åbn en indsendelse eller
        CSV-eksporten under Forms, og se, hvad der gemmes ud over felterne. Står der mere (IP-adresse,
        browser, henvisende side), skal afsnit 12 og 14 nævne det.
  - [ ] **Mailudbyderen**: slår I e-mail-notifikationer til i Netlify Forms (se "Netlify Forms"), ligger
        beskederne også i jeres mailboks. Skal mailudbyderen nævnes som databehandler i afsnit 14 (og
        overførslen, hvis den er uden for EU)?
  - [ ] **EU-U.S. Data Privacy Framework** blev opretholdt af EU-Retten 3/9-2025 (T-553/23), men
        sagen er anket til EU-Domstolen (C-703/25 P, anket 31/10-2025; vi har ikke fundet en afgørelse
        26/11-2026). Netlify, Inc stod som "Active" på dataprivacyframework.gov 26/11-2026. Tjek før
        lanceringen, at rammen stadig gælder, og at Netlify stadig står på listen; ellers bruger
        Netlifys databehandleraftale EU's standardkontraktbestemmelser (DPA § 14.3), og afsnit 12 og 14
        skal rettes.
- [x] **"Tilbud" i nyhedsbrevet** (du, 26/11-2026: "ret det med priser osv osv.. det ikke
      mening"): nyhedsbrevet lover kun nyheder, artikler og gode råd. Footeren siger "Få nyheder og
      gode råd om vores behandlinger på e-mail.", kvitteringen "Du hører fra os, så snart vi har
      nyheder.", `/blog` "Få tips og nyheder i din indbakke" og "Én mail om måneden med nye artikler
      og gode råd om vores behandlinger. Ingen spam.", og afsnit 12 i privatlivspolitikken det
      samme (VEJ 9319/2013 pkt. 5.1; markedsføringsloven § 10).
  - **Regel for nyhedsbrevet**: kun nyheder, artikler og gode råd om behandlingerne. Ingen
    tidsbegrænsede rabatter, "månedens tilbud", gaver eller konkurrencer på behandlinger, og aldrig
    rynkebehandling eller andre receptpligtige lægemidler (lægemiddelloven § 66). Vil I senere sende
    tilbud, skal tilmeldingsteksterne (footeren, `/blog`) og afsnit 12 rettes først.
- [ ] **Botox og markedsføring** (juridisk vurdering). Botox er receptpligtig medicin og må ikke
      reklameres for over for offentligheden. Bureauets nye tekster (oktober 2026) løser
      hovedparten: Botox-siden er erstattet af `/behandlinger/rynkebehandling` og
      `/behandlinger/andre-behandlingsmuligheder` (bureauets tekster, ordret), som handler om
      behandlingen og ikke om produktet. De gamle adresser (`/rynkebehandling`,
      `/ovrige-botox-behandlinger`, `/behandlinger/botox`, `/behandlinger/lip-flip` …) sender
      videre dertil (`content/redirects.ts`). Resten af sitet følger samme linje: menuer, kort,
      priskortets etiket og mobil-chip ("MIMISKE RYNKER M.M." og "Rynkebehandling" i stedet for
      "BOTOX" / "Botox"), metabeskrivelsen på `/priser`, sitets standardbeskrivelse og
      strukturerede data (`content/layout.ts`) siger nu "rynkebehandling" (alle markeret
      `// TODO: copy review`).
      Produktnavnet eller det aktive stof står kun, hvor bureauet selv har skrevet det: fire steder
      på rynkesiden — FAQ-spørgsmålet "Hvad er forskellen på Botox og filler?" (en synlig
      overskrift og spørgsmålets navn i de strukturerede data, FAQPage) og svaret på det, FAQ-svaret
      "Ved kosmetisk behandling med botulinumtoksin …" og afsnittet "Hvis der er tale om en
      behandling med botulinumtoksin …" under konsultationen (se "Juridisk gennemlæsning"
      nedenfor). Fillox Academy-afsnittet på Om os siger siden 26/11-2026 "rynkebehandling" (se "Om
      os" nedenfor), og det samme gælder for de andre receptpligtige lægemidler (se "Hyalase").
      Rynkesiderne viser ingen anmeldelser,
      resultater eller "fra"-pris (`treatmentsWithoutReviews` i `content/reviews.ts`). Rynkesiden
      har igen "Læs mere om rynkebehandling" med de tre rynkeartikler (nedenfor); siden om andre
      behandlingsmuligheder har ingen blogsektion. Stadig åbent:
  - [ ] **Blogartikler om rynkebehandling** (du, 25/11-2026): de tre Botox-indlæg er skrevet om
        til artikler om selve behandlingen og udgivet: `/blog/rynkebehandling-for-foerste-gang`,
        `/blog/hvornaar-giver-rynkebehandling-mening` og
        `/blog/de-foerste-24-timer-efter-rynkebehandling` (filterknappen hedder "Rynkebehandling").
        Produktnavnet og det aktive stof står ingen steder: ikke i titel, overskrifter, adresse,
        uddrag, metatekst, alt-tekst eller billede, og heller ikke i brødteksten, som bruger
        rynkesidens egne ord ("muskelafslappende injektionsbehandling", "rynkebehandling med et
        receptpligtigt lægemiddel"). Ingen priser, intet bookingkort med "fra"-pris, ingen
        resultater og ingen navngiven behandler; de er signeret "Fillox-holdet" (en sundhedsperson,
        der anbefaler et lægemiddel i en reklame, er forbudt, BEK 253/2025 § 10, stk. 1, nr. 7). Kun
        fakta fra sitet selv og fra fillox.dk; kilden står ved hver blok i `content/blog.ts`.
        `npm run check:market` afviser et udgivet indlæg eller en filterknap, der nævner Botox
        eller et andet mærke af stoffet, og et bookingkort til rynkesiderne. De gamle
        preview-adresser `/blog/botox-…` giver 404 og har ingen viderestilling, så produktnavnet
        ikke lever videre i en adresse. Åbent:
    - [ ] **Fagligt tjek af en læge** (aftalt med ejeren 25/11-2026, afventer; alle blokke
          markeret `TODO: fagligt tjek (læge)`), især
          efterplejen, og hvornår man skal ringe til vagtlægen eller 112. fillox.dk siger kun 2
          timer før let træning og 24 timer før hård træning; det gamle udkasts råd (ikke ligge ned
          i 4 timer, ikke massere området) står ikke på fillox.dk og er udeladt. Skal lægen tilføje
          efterpleje og advarselstegn, der gælder netop den muskelafslappende behandling (fx besvær
          med at synke eller tale, et hængende øjenlåg)? I dag bruger "De første 24 timer" sitets
          generelle tegn og samme "Ring 112"-liste som artiklen om hævelse og blå mærker
          (synsforstyrrelser, vejrtræknings- eller synkebesvær, hævelse i tungen eller svælget), og
          den henviser til hævelsesartiklen for dem, der har fået filler. Akuttelefonen er et link,
          man kan trykke på (ringer op) under advarselstegnene i alle tre artikler med advarselstegn
          (også "Lip filler for første gang", 25/11-2026).
    - [ ] Har lægen ikke flere råd, der gælder netop de første 24 timer (i dag kun træningen),
          holder titlen "De første 24 timer efter en rynkebehandling" ikke helt, hvad den lover.
          Forslag: "Efter en rynkebehandling: træning, reaktioner og hvornår du skal ringe" (adressen
          bliver), i søgeresultater "Efter en rynkebehandling: hvad skal du vide?". Hvad vælger I?
    - [ ] **Juridisk gennemlæsning** af de tre artikler før lanceringen (brødteksten nævner
          "rynkebehandling med et receptpligtigt lægemiddel" og "muskelafslappende
          injektionsbehandling"). Og af rynkesiden selv: FAQ-overskriften "Hvad er forskellen på
          Botox og filler?" nævner et receptpligtigt lægemiddel i en overskrift og i de
          strukturerede data (FAQPage), som søgemaskiner viser. Forslag (bureauets tekst, så det
          kræver jeres og juristens ja): "Hvad er forskellen på muskelafslappende behandling og
          filler?", eller i det mindste at tage det spørgsmål ud af de strukturerede data.
    - [ ] Copy review. "Hvornår giver rynkebehandling mening?" er mærket "Guide" i stedet for
          designets "Forebyggelse", fordi "forebyggelse" kan læses som en påstand. OK?
    - [ ] De gamle `/blog/botox-…`-adresser lå kun på det skjulte preview og giver nu 404 uden
          viderestilling. OK?
    - [ ] Skal siden om andre behandlingsmuligheder også have en blogsektion? (De tre artikler
          handler om rynker.)
  - [ ] **Priser**: alle rækker på priskortet "Rynkebehandling" er uændrede (områder, pakker,
        tyggemuskler, hyperhidrose, Traptox). Konsultationskortets række hedder siden 26/11-2026
        "Lægekonsultation før første rynkebehandling" (live: "… før første botox"; rettet efter din
        Botox-regel som en del af punkt 1, du 26/11-2026: "ret det hele"). Kravet om en lægefaglig
        forundersøgelse gælder behandling med botulinumtoksin, men "rynkebehandling" dækker på
        rynkesiden også filler og microneedling mod linjer; bureauets ord, "Lægefaglig
        forundersøgelse før første behandling", undgår den tvetydighed. Hvilken vælger I (eller
        juristen)? Traptox nævnes ikke på nogen side og er nu en prisrække uden link: skal den have et
        afsnit?
  - [ ] **"fra 799 kr" for rynkebehandling** står stadig i menuerne, på forsiden (bestseller #01),
        på siden for mænd og i behandlernes priskort ("Rynkebehandling" lige over
        kundeanmeldelserne hos Alberte, Annika og Mike, `wrinkleOffer` i `content/team.ts`). Er en
        pris ved siden af behandlingen i orden?
  - [ ] **Siden for mænd** (`content/pages/men.ts`): FAQ-svaret "Hvor lang tid tager det?" bruger
        nu rynkesidens ord (lægefaglig forundersøgelse, mindst to dages betænkningstid);
        "cirka 15 minutter" og "Den er gratis" er taget ud. Skal det igen stå, at
        lægekonsultationen er gratis? (De tre rynkeartikler siger heller ikke "gratis" om den
        lægefaglige forundersøgelse eller kontrollen.)
  - [x] **Om os** (du, 26/11-2026: "ret det hele som du har skrevet til mig"): bureauets sætning
        siger nu "Det er let at finde en klinik, der tilbyder rynkebehandling, filler, laser eller
        hudforbedrende behandlinger." (før "botox"); resten af afsnittet er ordret. Rettet efter din
        Botox-regel som en del af punkt 1, så sig det til bureauet.
- [x] **Hyalase** (du, 26/11-2026: "ret det hele som du har skrevet til mig. alt fra punkt 1-9"):
      handelsnavnet står ingen steder. Prisrækken hedder "Opløsning af filler" (`/priser` og lip
      filler-sidens priskort; prisen 999 kr pr. område er uændret), FAQ-svaret på lip filler-siden
      (også i FAQPage) siger "Ja. Filler af hyaluronsyre kan opløses igen. Opløsning af filler koster
      999 kr pr. område pr. gang.", og de to blogartikler siger det samme uden navnet. Efter samme
      regel er "tilsat lidocain, et bedøvelsesmiddel" overalt blevet "tilsat et lokalbedøvende
      middel" (FAQ'en om smerter på fillersiderne, lip filler, næsekorrektion, hage og to
      artikler); punkt 1 nævnte kun Hyalase, så siger juristen, at lidocain i en CE-mærket filler er
      i orden, kan den gamle tekst komme tilbage. `npm run check:market` (regel 14 og 18) afviser nu Hyalase/hyaluronidase og
      lidocain/Xylocain i prislisten, på behandlingssiderne, hos behandlerne, i alle siders tekster og
      i hele teksten i udgivne blogindlæg.
- [x] **Løfter om resultater** (du, 26/11-2026: "ret det hele som du har skrevet til mig"): rettet
      med "kan", "mange" og "typisk" (VEJ 9319/2013 pkt. 6.2: samme resultat kan sjældent
      garanteres) på kindben, kæbelinje (også for mænd og rækken på `/behandlinger/for-maend`), tear
      trough, næsekorrektion (introen, metateksten og "Ofte kan en lille mængde filler gøre en
      tydelig forskel"), lip filler (mobilteksten), skinbooster, Profhilo, microneedling, PRF hud, PRF
      hår, Signatur ("Mange oplever en synlig forskel efter første behandling."), korttekster på
      `/behandlinger` og hos Alberte og Profhilo-afsnittet i bloggen. Profhilo er "en type
      hyaluronsyre" (uden "ny"), og sammenligningen med traditionelle fillers er taget ud.
      Faktatabellerne og "Resultatet ses med det samme" for filler er beholdt (filleren giver volumen
      med det samme). Til copy review (ikke ændret, men påstande, der skal kunne dokumenteres, VEJ
      9319/2013 pkt. 12):
  - [ ] Kindben "Med hyaluronsyre genskaber vi volumen …", Signatur "gel-maske, der genopbygger
        hudbarrieren", Ejal 40 "stimulerer dannelsen af nyt kollagen og elastin" (og "40 mg").
  - [ ] Laser hårfjerning: introen "Effektiv og langvarig hårfjerning med diodelaser. Indbygget køling
        gør behandlingen behagelig …" og "den indbyggede køling beskytter huden og gør behandlingen
        behagelig". Forslag: "… Indbygget køling kan gøre behandlingen mere behagelig …".
  - [ ] Albertes priskort, skinbooster: "Dybdegående fugt med Profhilo, Sunekos eller Ejal 40 for
        frisk, strammere hud." Forslag: "… der kan give en friskere, strammere hud."
- [ ] **Aldersgrænsen 18 år** står ingen steder på sitet (BEK 834/2014 § 3: kosmetisk behandling må
      ikke foretages på personer under 18 år; BEK 828/2013 § 5 og VEJ 9319/2013 pkt. 6.1 om
      markedsføring over for børn og unge). Forslag, med dit ja: en FAQ på `/ny-hos-fillox` og en
      linje i `/booking`-introen, "Vi udfører kun kosmetiske behandlinger på personer over 18 år.",
      og på `/content-creator`: "Du skal være fyldt 18, og dit indhold må ikke henvende sig til børn
      og unge. Vi samarbejder ikke om rynkebehandling."
- [ ] **Ny hos Fillox?** (`/ny-hos-fillox`, `content/pages/new-here.ts`): bureauets udkast er på
      norsk, og siden er en tro dansk oversættelse (samme indhold, intet tilføjet). **Bureauet
      skal læse den igennem** før lancering. Desuden:
  - [ ] Kortet om linjer og rynker viser Rynkebehandling, Microneedling og Andre
        behandlingsmuligheder. Den sidste handler ikke om rynker (læber, sved, kæbespændinger) —
        skal den byttes ud med PRF hud? (én linje i content-filen)
  - [ ] Kortet viser ingen pris for de to rynkesider (kun på denne side, `pricesHiddenFor`;
        deres egne sider og `/priser` er uændrede). Bekræft.
  - [ ] Gecko kan ikke forvælge en behandling, så alle "Book tid"-knapper åbner den samme
        kalender (to klik til kalenderen, ikke til behandlingen, som forfatterens anbefaling 1
        forestiller sig).
  - [x] **Behandlinger, Fillox Danmark ikke har** (du, 26/11-2026: "ret det hele som du har skrevet
        til mig"): kortet om pigmentpletter, rødme, porer og ar siger nu "Peeling, microneedling eller
        PRF kan være relevante alternativer.", og kortet "Lys- og laserbehandlinger" er blevet "Laser
        hårfjerning: Vi bruger diodelaser til hårfjerning. Laseren virker på hårsækkene, og
        indstillingerne tilpasses din hudtype og hårstruktur." (VEJ 9319/2013 pkt. 5.2.1). Sig det til
        bureauet. Til copy review: kortets første sætning gentager overskriften (de andre kort starter
        med "Bruges …" eller "En behandling …").
  - [ ] **Samme problem på Om os** (bureauets tekst, ikke ændret): båndet "Den rigtige behandling
        kræver mere end ét værktøj" siger om hudkvalitet "Måske vil en laserbehandling, microneedling
        eller en injektionsbehandling være mere relevant", men Fillox Danmark har ingen hudlaser, kun
        diodelaser til hårfjerning. Forslag: "Måske vil microneedling eller en injektionsbehandling
        være mere relevant." Retter vi, eller spørger I bureauet?
  - Siden linkes fra "Om os"-menuen (desktop og mobil) og fra footeren.
- [ ] **Tekster, bureauet ikke har leveret endnu** (intet lagt ud): polynukleotider
      ("laksesæd": kun en indledning, og forfatteren vil have produktdokumentationen tjekket før en
      kategorisk forklaring — indtil da nævnes polynukleotider kun på priskortet "Hårtab &
      hovedbund" og PolyPhil Hair-siden, som før); egne sider for de fire klinikker (kun billeder
      i Drive; `/klinikker` er uændret); hårtab & hårvækst; skinboosters, microneedling og
      laser-undersiderne (kun overskrifter).
- [ ] **Rynkesiderne** (`content/treatments.ts`): (1) Linket "Andre behandlingsmuligheder →" på
      rynkesiden er vores (ikke i bureauets tekst) — ønskes det? (2) Mega-menuen kalder den anden
      side "Andre behandlinger" (det fulde navn er for bredt til kolonnen ved 1024px); alle andre
      steder står "Andre behandlingsmuligheder". OK? (3) Sidens titel i søgeresultater er 61 tegn
      (én over vores grænse) — forslag: "Andre kosmetiske og medicinske behandlinger".
      (4) ~~Forsidens resultatbillede "rynkebehandling, 2026"~~: løst 24/11-2026 (forsiden har
      ikke længere et rynkekort, se "Fotos fra Drive" nedenfor).
      (5) Afsnittet "Find din Fillox-klinik" siger "Se den enkelte kliniks behandlere,
      behandlingstilbud og muligheder for konsultation. Find din klinik →", men `/klinikker` viser
      kun adresse, åbningstider, booking og rutevejledning. Enten viser klinikkortene "Behandlere
      her: …" (det står allerede i `clinicSlugs`, `content/team.ts`), eller bureauet ændrer
      sætningen, fx "Se adresser, åbningstider og book en konsultation." Hvad vælger I?
- [ ] **Mega-menuen** (`content/navigation.ts`, ejerens design v2): kolonnernes links hedder "Alle
      rynker →" og "Alle hud →" ("Alle hud" er ikke korrekt dansk), mens mobilmenuen siger "Se alle
      rynkebehandlinger" og "Se alle hudbehandlinger". Forslag: "Alle rynkebehandlinger →" og "Alle
      hudbehandlinger →", hvis de kan være i kolonnen ved 1024 px, ellers "Se alle →" i alle fire
      kolonner. Hvad foretrækker du?
- [ ] **Om os** (`content/pages/about.ts`, bureauets nye tekst): (1) "Og du behøver ikke føle dig
      hjemme i en eksklusiv luksusklinik for at føle dig hjemme hos os." står ordret, men lyder
      oversat — bed bureauet se på den. (2) ~~Dr. Toms titel~~: løst 25/11-2026 ("lidt mere end
      bare læge"): kortene siger nu "Æstetisk læge & grundlægger", Om os, `/behandlere` og hans
      profil "Æstetisk læge · Grundlægger & daglig leder"; profilen nævner også fagligt ansvarlig
      læge og undervisningen (fra fillox.dk og bureauets tekst). Har han en titel mere (fx
      speciallæge), så skriv den.
      (3) **Dr. Toms foto**: hans nye portræt (grå uniform, 25/11-2026) er det eneste foto af ham.
      Lægeafsnittet viser det nu i et bredt udsnit (hele højden: fra hoved til hænder, planten og
      panelvæggen), og hans behandlerkort længere nede på siden viser samme foto tæt. Har I et
      andet billede af ham? (4) ~~det lille topbillede~~: løst 24/11-2026 (toppen viser
      gruppebilledet af fire behandlere, uden navne). Fillox Academy-afsnittet har stadig intet
      billede: det har ingen plads til et i sit layout, og vi har ikke opfundet et nyt. De to
      kursusbilleder i Drive kan ikke bruges, som de er: sikkerhedsbrillerne bærer fillermærket
      "croma" lige ved ansigtet. Har I et kursusbillede uden mærker, og skal afsnittet have et?
- [ ] **Behandlere** (`content/team.ts`, `// TODO: copy review`): Dr. Toms "Sådan arbejder …"-kort
      er skrevet i tredje person ud fra Om os. Nye sætninger at godkende (25/11-2026): booking-båndet
      nederst på Albertes, Annikas og Mikes profiler ("Du møder Annika i Fillox Østerbro og Fillox
      City2. Første konsultation er altid gratis.") og Simones og Frederikkes kort (se nedenfor).
  - [x] **"Uddannet kosmetisk sygeplejerske i Fillox af Dr. Tom"** (Annika) og
        **Autorisationsregisteret** (du, 26/11-2026: "ja annika er sygepljesker osv så det ikke noget
        problem.. alle er udddannet korrekt mm."): Annika er sygeplejerske, og alle behandlere har den
        rette uddannelse og autorisation. Teksterne om Annika (`/om-os`, `/behandlere`, hendes profil,
        lip filler-siden, faktakortet "Uddannet af: Dr. Tom i Fillox" og sætningen på Toms profil)
        er uændrede.
  - [x] **Lægetillægget og Næsekorrektion** (du, 26/11-2026: "lad 9 bliv som det er medmindre det
        står i priserne"): prislisten siger "Næsekorrektion · op til 1 ml, v. Dr. Tom · 3.999 kr" (live
        /priser: "Udføres af Dr. Tom"), så prisen er allerede prisen hos ham. Under hans priskort (alle
        bredder) og i hans booking-bånd står derfor nu "Prisen på næsekorrektion gælder behandling
        hos læge. Ved de andre behandlinger har behandling hos læge et specialist-tillæg efter aftale."
        (før "Behandling hos læge har et specialist-tillæg efter aftale."). `/priser` (rækken
        "Specialist-tillæg (behandling v. læge) · valgfrit · efter aftale") og næsekorrektionssiden er
        uændrede. Mente du, at sætningen skulle stå helt som før, er det kun `DOCTOR_SURCHARGE` i
        `content/team.ts`, der skal tilbage.
- [x] **Titler** (du, 25/11-2026: "tom er self læge mm men de andre skriver vi bare kosmetiske
      sygeplejerske"): Alberte, Annika, Mike, Simone og Frederikke er "Kosmetisk sygeplejerske"
      ("Sygeplejerske" på forsidens kort) på kortene, profilerne, "Din behandler" på
      behandlingssiderne, i alt-teksterne og i de strukturerede data. Dr. Tom er uændret. Det
      afklarer også Albertes titel (før stod hun som "Behandler").
- [x] **Hvem arbejder hvor** (du, 25/11-2026: "Frederikke = Østerbro / Simone = city2 og Amager /
      Mike = frb og Amager / Annika = Østerbro og city2 / Alberte = FRB"): det står ét sted,
      `clinicSlugs` i `content/team.ts`, og alle tekster om, hvor en behandler arbejder, bygges
      derfra: kortet "Arbejder i" øverst på Albertes, Annikas og Mikes profiler (med klinikkernes
      korte navne som i designet, fx "Frederiksberg & Amager Centret"), booking-båndet nederst på dem
      og Simones og Frederikkes kort (med de fulde navne, "Fillox Frederiksberg og Fillox Amager
      Centret"). `npm run check:market` fejler, hvis en tekst om en behandler i `content/team.ts`
      eller i "Din behandler" på behandlingssiderne nævner en anden klinik (anmeldelser og andre
      sider tjekkes ikke). Designet har tre faktakort, så "Arbejder i" tog en plads:
      Alberte mistede "Fillox på Trustpilot" (det eneste kort, der ikke handlede om hende), Annika
      "Prioritet: Kundetilfredshed" (står også under "Sådan arbejder jeg") og Mike "Udvikling:
      Løbende uddannelse" (står i introen lige over). `/klinikker` siger stadig ikke "Samme
      behandlere" (`content/pages/clinics.ts`), da behandlerne arbejder på bestemte klinikker.
  - [x] **Dr. Tom**: arbejder på alle klinikker (du, 25/11-2026). Hans profil har nu "Arbejder i:
        Alle klinikker", og bookingbåndet siger "Du møder Dr. Tom i alle vores klinikker." Åbner en
        ny klinik, kommer han automatisk med.
  - [x] En anmeldelse om Alberte (Jessica, Trustpilot 28/7-2025) siger "Fik lavet læber hos
        Alberte i Amager Centret", men hun arbejder på Frederiksberg i dag. Du svarede 25/11-2026
        "ok det fint" til, om hun arbejdede i Amager Centret dengang, så anmeldelsen er sat på igen
        på sin gamle plads på hendes profil og på lip filler-siden (`content/reviews.ts` →
        `reviewSets.practitioners.alberte` og `reviewSets.treatments["lip-filler"]`; seks
        anmeldelser begge steder).
- [x] **Kubra er stoppet** (du, 25/11-2026: "Kubra er også ude"): hun er fjernet overalt
      (behandlerlisten, forsiden, Om os, `/behandlere`, profilen og hendes foto), og
      `/behandlere/kubra` sender videre (308) til Om os → behandlerne. Ingen anmeldelse nævnte hende,
      og ingen behandlingsside viste hende som "Din behandler" (Alberte står før hende på de sider,
      de begge tilbød), så de er uændrede. Hendes udkast til tekster skal derfor ikke godkendes.
- [ ] **Nye behandlere: Simone og Frederikke** (du, 25/11-2026: "vi har fået nye profiler, Simone &
      Frederikke … afventer deres billeder. men så ved du at der skal være placeholders"; "Tommy" er
      Dr. Tom). De står på forsiden, på Om os og på `/behandlere` som kort nr. 5 og 6, så der igen er
      to hele rækker af tre, med navn, "Kosmetisk sygeplejerske" og én sætning ud fra det, du har
      skrevet: "Du møder Simone i Fillox City2 og Fillox Amager Centret." / "Du møder Frederikke i
      Fillox Østerbro." (`// TODO: copy review`). I stedet for et foto står en rosa flade med
      forbogstavet og "Billede på vej" i samme størrelse som fotoene, så intet flytter sig, når
      billedet kommer. Intet andet er skrevet om dem (intet efternavn, ingen uddannelse,
      behandlinger eller citater), og de har ingen profilside endnu: `/behandlere/simone` og
      `/behandlere/frederikke` giver 404, intet linker dertil, og deres kort er ikke links.
  - [ ] Send deres **fotos** (portræt, gerne som de andres: lys væg, sort Fillox-uniform). Du
        sender dem senere (25/11-2026: "sender senere").
  - [ ] **Et par linjer om hver** og **hvilke behandlinger de udfører** (kommer også senere). Så
        får de en profilside som de andre og kan stå som "Din behandler" på behandlingssiderne.
  - **Sådan kommer et foto på** (`content/team.ts`, tre trin):
    1. Læg filen i `public/images/team/`, fx `simone-2026.jpg` (et portræt, ca. 4:5 eller mere
       kvadratisk, sRGB, uden metadata, mindst 1000 px bredt; beskær et liggende foto først).
    2. Sæt `image` på hendes post (`src`, `alt: "Simone, kosmetisk sygeplejerske hos Fillox"`,
       `width`, `height`), og tilføj hende i ansigtstabellen `faces`: åbn filen i et billedprogram,
       der viser markørens position, aflæs pixelsøjlen midt i ansigtet (`x`) og pixelrækkerne for
       pupillerne (`eyes`) og linjen mellem læberne (`mouth`), og del med billedets bredde (`x`)
       eller højde (`eyes`, `mouth`): pupiller i række 268 af 1118 → `eyes: 0.24`. Se de tre
       teamgitre ved 390 og 1440 px: øjnene skal stå på linje med de andres. Kortene viser så
       fotoet i stedet for pladsholderen (stadig uden link).
    3. Når teksterne kommer: tilføj `profile` (intro, fakta med "Arbejder i", behandlinger,
       booking-bånd), `link`, `bookingHref`, `bio` og `image.share` (`og-<fil>.jpg`, et bredt udsnit
       til delinger), som hos de andre. Så får hun en profilside og en plads i sitemap'et, og
       kortene bliver links. `npm run check:market` fejler, hvis et trin er halvt gjort.
- [ ] **Maria er stoppet** (du, 25/11-2026: "Maria er ikke længere i Fillox … hun er ude"): hun er
      fjernet overalt (behandlerlisten, forsiden, Om os, `/behandlere`, profilen og hendes foto), og
      `/behandlere/maria` sender videre (308) til Om os → behandlerne. De fem anmeldelser, der
      nævner hende, er taget ud (31 tilbage); kunden "Maria" i en anmeldelse om Mike er en anden og
      står der stadig.
  - [x] Lip filler-siden viser **Annika** som "Din behandler" (hun tilbyder lip filler, og flere
        anmeldelser om læber nævner hende). Bekræftet 25/11-2026 ("ok"). Det står på selve siden
        (`content/treatments.ts` → `practitionerSlug`), så det bliver Annika, selv om Alberte og
        Mike også har lip filler på deres profiler.
  - [ ] Siden for mænd ("Du er i gode hænder") viser nu Alberte, Annika og **Mike** (i stedet for
        Maria). Er det i orden?
  - [x] Maria og Kubra er ikke med på gruppebilledet i sofaen (du, 25/11-2026). Det bliver.
  - [ ] Er Maria eller Kubra på andre behandlerbilleder (behandleren med folderen og behandleren i
        hvid kittel, fx på forsiden, `/priser`, behandlingssider og blogindlæg)? Hvis ja, skal de
        skiftes.
- [ ] **Nye portrætter** (du, 25/11-2026): Tom (grå uniform), Alberte (sort), Annika og Mike har nye
      fotos, `public/images/team/<slug>-2026.jpg` (fra Drive, uden metadata, ikke forstørret), på
      alle sider; de gamle portrætter og stemningskopierne af de fire fotos er slettet.
      Vinduesbilledet er også Alberte: det står fortsat uden navn som stemningsbillede og aldrig ved
      siden af en anden navngiven behandler. På forsiden står Alberte nu højere (hele hovedet med
      luft over, på linje med de andre). Med seks behandlere står de igen i to hele rækker af 3, som
      du bad om 3/10-2026 (forsiden fra 768 px, Om os og `/behandlere` fra 1024 px; 2 + 2 + 2 på Om
      os og `/behandlere` fra 560 til 1023 px).
  - [ ] Annikas foto er beskåret helt tæt over håret, så hendes ansigt står lidt større og tættere
        på kanten end de andres på behandlerkortene, under "Din behandler" på lip filler-siden og
        øverst på hendes profil. Har I en version med mere luft over hovedet?
  - [ ] Større originaler: de fire nye portrætter er 976–1290 px brede, og Toms foto forstørres op
        til ca. 1,85× på behandlerkortene. Send gerne de fulde originaler.
  - Profilernes topbillede viser nu hele hovedet også i smalle vinduer (480–639 px), og ansigtet
    står midt i billedet på iPad på højkant (768–1023 px).
- [ ] **Booking hos en bestemt behandler**: `/booking?behandler=<slug>` åbner Gecko-kalenderen
      uden filter. Kan Gecko forvælge en behandler (et kalender- eller ressource-id pr. behandler,
      som `geckoCalendarId` pr. klinik)? Indtil da åbner knapperne "Book tid hos …" på
      behandlersiderne kalenderen uden filter.
- [x] **Footer og logo** (du, 25/11-2026: "footer har den samme farve som header, lidt lysere
      beige" og logoet "ikke helt mørk … #222222 agtig"): footeren har nu headerens farve
      (offwhite) med en tynd streg øverst, og dens kort (telefon, e-mail, booking, Trustpilot) er
      lys beige. Logoet er espresso `#3B2A28`, samme farve som overskrifterne (du valgte den ud
      fra en sammenligning; før `#242724`). Filen er `public/brand/fillox-logo-espresso.png`.
- [ ] **Båndet lige over footeren**: designets lyse bånd var i ét med den beige footer (footeren er
      offwhite siden 25/11-2026, så det er ikke længere et problem). Om os slutter nu med det rosa bånd "Velkommen til Fillox" (den nye tekst),
      ligesom behandlersiderne ("Book tid hos …"). Kun `/behandlere` slutter stadig med det sand-
      farvede "Fagligt ansvarlig"-bånd (`components/about/ResponsibleBand.tsx`). Skal det også være
      rosa?
- [ ] **Fotos fra Drive (lagt på siden 24/11-2026)**. Du godkendte 24/11-2026, at klinikkens egne
      fotos bruges i stedet for stockfotos ("kunderne har givet samtykke, og klinikken må bruge alt
      sit indhold på sin egen hjemmeside"), og før/efter-billeder på behandlingssiderne. En
      gennemgang af de danske regler samme dag (ikke juridisk rådgivning) sagde: før/efter er tilladt
      for fillers og skinboosters på betingelser, aldrig for Botox (receptpligtig medicin,
      lægemiddellovens § 66). Det er gjort:
  - **Stemningsbilleder** (`public/images/fillox/`, `content/photos.ts`) i stedet for alle
    stockfotos: forsiden (top, de tre behandlingskort, anmeldelserne), `/behandlinger` og alle
    behandlingssider, Om os (gruppebilledet), Ny hos Fillox?, `/klinikker`
    (behandlingsrummet på alle fire kort og i Googles strukturerede data), `/priser`,
    `/ledige-stillinger` (gruppebilledet), `/content-creator`, bloggen og delingsbillederne
    (`og-*.jpg`: et bredt udsnit af hvert foto, så ansigterne ikke skæres af, når Facebook,
    LinkedIn og X viser et link). Tom, Alberte, Annika og Mike har deres fotos som portrætter (se
    "Nye portrætter" ovenfor); som stemningsbilleder står alle **uden navn** i alt-tekster og
    filnavne, ligesom gruppebilledet og alle kunder. Botox-siderne (rynkebehandling og andre
    behandlingsmuligheder), de tre rynkeartikler og Ny hos Fillox? viser kun billeder uden
    produkt, sprøjte og behandling (vinduesbilledet, spejlet, behandlingsrummet og
    folderbilledet, rynkesidens top). Ikke brugt: billedet med Profhilo-æsken (reklame for
    medicinsk udstyr med en behandlers anbefaling, BEK 715/2022 § 6), de tre enkeltbilleder af
    kunder lige efter en læbebehandling (de læses som resultater, og et af dem viser et fillermærke
    på spejlet), begge kursusbilleder (fillermærket "croma" på sikkerhedsbrillerne) og billedet
    382DC544 (en behandler giver en kunde en indsprøjtning ved øjenbrynet — det læses som en
    Botox-behandling, uanset hvor det står; det stod først på rynkesiden som "konsultation" og er
    fjernet 25/11-2026). Alt-tekster er markeret `TODO: copy review`.
  - [ ] **Juridisk tjek af selve billederne**: gennemgangen 24/11-2026 godkendte billederne til
    Botox-siderne ud fra en beskrivelse af dem, og én beskrivelse var forkert (382DC544 ovenfor).
    Lad den, der tjekker, se på billederne på rynkesiden, de tre rynkeartikler og Ny hos Fillox?
    (vinduesbilledet, folderbilledet, spejlet og behandlingsrummet).
  - [x] "Læs også" under rynkeartiklerne viser kun billeder uden sprøjte og uden behandling
    (25/11-2026): de to andre rynkeartikler og "Lip filler for første gang" (folderbilledet).
    Sprøjtebilledet (Skinbooster eller Profhilo) og billedet af en behandling (Hævelse og blå
    mærker) står ikke længere dér; "De første 24 timer" linker i stedet til hævelsesartiklen i
    teksten (under "Vent med at træne", 25/11-2026).
  - [ ] **Hvem er på billederne?** Delvist besvaret 25/11-2026 (portrætterne, og vinduesbilledet
    er Alberte; på hudsiderne står det over "Din behandler: Alberte" eller uden navn). Stadig åbent:
    sprøjtebillederne, folderbilledet og behandlingen i hvid kittel (gruppebilledet: Maria og Kubra er
    ikke med, 25/11-2026; de fire forbliver unavngivne). Sprøjtebilledet
    med armene over kors ligner tydeligt Albertes portræt (samme fotografering, positur, handsker
    og baggrund), så det står ikke længere øverst på lip filler-siden over "Din behandler: Annika":
    toppen dér viser nu spejlbilledet (25/11-2026). Næsekorrektion viser behandlingsrummet i
    stedet for billedet af en behandler, der gør en sprøjte klar, over "Din behandler: Dr. Tom".
    Sprøjtebillederne står stadig uden navn øverst på kindben, kæbelinje, hage og tear trough
    (ingen navngiven behandler dér), på forsidens lip filler-kort og i to artikler. Billedet,
    hvor hun gør sprøjten klar, er Alberte (du, 25/11-2026: "den billede af alberte lip filler").
    Er det også Alberte på billedet med armene over kors? (Hun er kosmetisk sygeplejerske og giver injektioner:
    skinbooster, PRF hud, lip filler, fillers og rynkebehandling står på hendes profil, se
    "Alberte" nedenfor.)
    - Behandlingen i hvid kittel (artiklen "Hævelse og blå mærker") står siden 25/11-2026 også
      under "Fra bloggen" på kindben, kæbelinje, hage, tear trough, næsekorrektion og kæbelinje for
      mænd, så advarselstegnene og akuttelefonen kan findes fra alle filler-sider (før kun lip
      filler). Er hun Maria eller Kubra, skal billedet skiftes (se "Maria er stoppet").
    - [ ] **"Skinbooster eller Profhilo"** har sprøjtebilledet med armene over kors øverst. Fra
      1024 px viser udsnittet kun ansigt og skuldre (sprøjten og handskerne sidder nederst og
      skæres væk), så toppen ligner et portræt af en bestemt behandler over en artikel, der nævner
      Profhilo, Ejal 40 og Sunekos ved navn (billedet med Profhilo-æsken blev fravalgt af samme
      grund, BEK 715/2022 § 6). Er det Alberte, ses hun desuden tre gange på
      `/behandlinger/skinbooster`: vinduesbilledet øverst, hendes portræt under "Din behandler" og
      artikelkortet under "Læs mere om skinbooster". Må en genkendelig behandler stå øverst på
      artiklen (juristen)? Har I ellers et foto uden en genkendelig person, fx en
      skinbooster-behandling uden synligt produkt? Alle otte stemningsbilleder er i brug.
  - **Før/efter på Kæbelinje** (`/behandlinger/kaebelinje`, "Før og efter"): ét profilpar af hage og
    læber (`public/images/resultater/hage-1-*`, fra "Billede28-kopi"), skåret ud af jeres egen
    komposit med samme udsnit på begge halvdele og ingen anden redigering; teksten siger, at det er
    samme person, vist med samtykke, og at resultater varierer. Ingen ml, tid eller "uden filter".
    **Bekræft for parret** i journalen (BEK 834/2014 § 37): at før og efter er samme kunde, i den
    rækkefølge (vi har fulgt jeres komposit, øverst = før, og den synlige forskel); at
    "efter"-billedet er et opfølgningsbillede og ikke taget lige efter behandlingen; at kunden var
    mindst 18 år; at der er skriftligt samtykke, som dækker hjemmesiden (sundhedsloven § 43, GDPR
    art. 9) — billederne lå i "FØR/EFTER - Nord Magasin": bekræft, at samtykket dækker
    hjemmesiden og ikke kun magasinet; og hvilken behandling det var (vi skriver "filler" og "Hage
    og læber", fordi det er det, billederne viser — skal det stå på hage-siden i stedet?). Fjern
    billedet, hvis samtykket trækkes tilbage.
  - **Holdt tilbage** (filerne er klar, men opfylder ikke betingelserne endnu): læbeparrene fra
    "Billede 28" og "Lip Enhancement Comparison" (efter-billedet har et blankt lag på læberne, som
    før-billedet ikke har: en forskel i det behandlede område, og et tegn på, at det er taget lige
    efter behandlingen, hvor læberne typisk stadig er hævede — lip filler-siden siger selv, at det
    endelige resultat ses efter cirka en uge); IMG_7619/7633 (et stiksted på læben, og lyset er
    kraftigere på efter-billedet); herrelæberne IMG_7904/7905 (meget forskellig hvidbalance; jeres
    "Billede 2" kalder 7904 "før", men bekræft rækkefølgen i journalen); "Billede 3" (rækkefølgen kan
    ikke ses sikkert); IMG_5189 (hagen i profil: hovedet er bøjet bagover på før-billedet og
    lige på efter-billedet, så hage og læber ses fra en anden vinkel; baggrund, lys og skarphed
    er også forskellige); IMG_7689/7690 (rødme lige efter behandlingen); Sunekos-øjnene "Billede 11"
    (efter-billedet er lysere og jævnere belyst, hvilket i sig selv mindsker mørke rande, og
    vipperne er sminket forskelligt). Har I opfølgningsbilleder i journalen med samme udsnit og lys
    (dem, BEK 834 § 37 kræver), kan de komme på lip filler-, skinbooster- og Sunekos-siderne.
    "Billede 4" er ikke et før/efter (begge halvdele er samme øjeblik). **Ingen Botox-før/efter.**
  - Video (fx en videotop) må kun bruges på jeres egen hjemmeside, ikke på sociale medier. På
    fillox.no er før/efter-billeder forbudt: kopiér ikke afsnittet dertil.
  - [ ] **Større originaler**: filerne i Drive er 782–1548 px brede (telefon-eksporter).
    Bloggens artikeltop er 1440 px bred på store skærme, så kun spejlbilledet er skarpt dér; de
    andre forstørres op til 1,84 gange og ses lidt slørede (mest "0,5 eller 1 ml?", sprøjtebilledet
    på 782 px, og "Lip filler for første gang", folderbilledet på 854 px). Send gerne de fulde
    originaler fra kameraet/telefonen: de kan lægges ind uden kodeændringer.
- [ ] **Farveprøver i Drive/Website** (7 PNG'er lagt op 2/11-2026: 6B3840, 5C3F38, 6A2630,
      6E4038, 74483C, 7A4B51, 57353A): ikke brugt. Skal en af dem erstatte plum (#6B3840) på
      sitet? Paletten ændres kun efter din besked.
- [x] **"Profesionelle billeder" i Drive** (22/10 og 27/10-2026): lagt på siden 24/11-2026 som
      stemningsbilleder (se "Fotos fra Drive" ovenfor). Behold medarbejdernes skriftlige samtykke,
      også for dem, der ikke er navngivet.
- [x] **Lip filler-siden viste en usand påstand**: afsnittet "Resultater med lip filler" havde tre
      "før/efter"-par, hvor begge halvdele var det samme stockfoto, med teksterne "Lip filler · 0,5 ml ·
      2026" osv. under introen "Rigtige kunder … delt med samtykke og uden filtre". Afsnittet er
      fjernet (24/11-2026); lip filler-siden har stadig intet før/efter-afsnit (se "Fotos fra Drive").
- [x] **Forsidens resultatbilleder** ("Vi fremkalder, vi forandrer ikke", `content/pages/home.ts` →
      `results`): stockfotos med "lip filler, 2026" osv. er erstattet (24/11-2026) af jeres egne
      stemningsbilleder med behandlingens navn som eneste tekst (Lip filler, Kæbelinje, Skinbooster;
      intet rynkekort). Ingen kunder og ingen resultater; før/efter står på behandlingssiderne.
      Kæbelinje-kortet viser nu folderbilledet (25/11-2026; Mikes foto er blevet hans portræt).
      Lip filler-kortet (du, 25/11-2026: "for højt oppe vs de andre") viser nu billedet med armene
      over kors, zoomet ind, så øjnene står i samme højde som på de to andre kort og der er luft
      over hovedet; sprøjten ses stadig nederst til højre.
- [ ] **Billeder**: der er **ingen stockfotos** tilbage på siden (de ni filer i
      `public/images/hero/` og `public/images/results/` er slettet; logovæggen "Fillox-Behandling-3"
      findes stadig i `design-reference/uploads/`). Mangler stadig: et foto + alt-tekst pr. klinik
      (`content/pages/clinics.ts` → `card.photos`, og `seoImage`/`geo` i `content/clinics.ts`; nu viser
      alle fire kort samme behandlingsrum), og gerne større originaler af jeres fotos (se
      "Opløsning" ovenfor).
- [ ] **Titler i søgeresultaterne**: behandlingssiderne og flere andre sider har korte titler ("Hage ·
      Fillox", "Kindben · Fillox", "Priser · Fillox", "Om os · Fillox"), som på det gamle site
      ("Kindben – Fillox"). Titler med behandlingsform og by (højst 60 tegn) er en nem gevinst ved
      lanceringen, fx "Filler i hagen i København · Fillox", "Filler i kindben i København · Fillox",
      "Priser på behandlinger · Fillox" (aldrig et receptpligtigt produkt). Skal vi skrive dem, eller
      gør bureauet? (Bloggen hedder "Blog om behandlinger og efterpleje · Fillox" fra 25/11-2026, og
      Dr. Toms profil bruger hans korte titel, "Dr. Tom Haugland – Æstetisk læge & grundlægger".)
- [ ] **Netlify Forms**: formularerne ses under Forms efter første deploy; slå notifikationer til,
      kun til en mailboks, som kun behandlerne læser (se "Privatlivspolitikken og kontaktformularen":
      "Hvem læser beskederne?", slet besvarede beskeder, og mailudbyderen som databehandler).
- [ ] **Blog** (du, 25/11-2026: "lave bloggen. skriv et par artikler", signeret "Fillox-holdet"):
      syv artikler, dateret 25/11-2026 — "Lip filler for første gang", "0,5 eller 1 ml?",
      "Hævelse og blå mærker", "Skinbooster eller Profhilo" og de tre rynkeartikler
      ("Rynkebehandling for første gang", "Hvornår giver rynkebehandling mening?", "De første 24
      timer efter en rynkebehandling"; se "Botox og markedsføring" ovenfor). Alle fakta (priser,
      mængder, forløb, vagttelefon) kommer fra sitets eget indhold eller fra fillox.dk; kilden står
      ved hver blok i `content/blog.ts`. Artiklerne har ingen navngiven forfatter og intet portræt
      (Fillox-mærket i stedet; de strukturerede data nævner Fillox som forfatter), og bloggen viser
      ingen af behandlernes portrætter: Skinbooster-artiklen har sprøjtebilledet, rynkeartiklerne
      behandlingsrummet, spejlet og vinduesbilledet. Filterknappen "Botox" hedder nu
      "Rynkebehandling".
  - [ ] **Fagligt tjek af en læge** før lancering (alle syv artikler; aftalt med ejeren 25/11-2026,
        afventer): alle blokke markeret `TODO: fagligt tjek
        (læge)` (bl.a. hævelse, blå mærker og hvornår man skal ringe; rynkeartiklerne: se "Botox og
        markedsføring"). Konkrete spørgsmål til lægen:
    - [ ] "Hævelse og blå mærker" kalder "Blå mærker eller misfarvning" normalt (fra fillox.dk's
          FAQ) og siger samtidig "ring med det samme", hvis huden bliver "hvid, bleg, plettet eller
          blålig". Det kan en læser ikke skelne. Forslag: "Blå mærker der, hvor nålen har været" som
          normalt, og som tegn på at ringe: "Huden i eller omkring området bliver hvid eller bleg,
          får et plettet, netagtigt blåligt eller lilla mønster (ikke et almindeligt blåt mærke),
          eller føles kold." Teksten er ikke ændret, før lægen har formuleret den (samme sætning
          står nu også i "Lip filler for første gang").
    - [ ] fillox.dk's FAQ siger "Undgå at tage Paracet, Aspirin, Ibux eller Voltaren"; artiklerne
          (og behandlingssidernes FAQ) nævner ikke Paracet. Må artiklerne sige, hvad man kan tage
          mod smerter (fx paracetamol)?
    - [ ] **Hastegraden**: "Lip filler for første gang" siger "hurtigst muligt kontakte en læge", hvis
          en betændelsesreaktion varer over en uge, mens hævelsesartiklens "Ring med det samme,
          hvis:" blander akutte kredsløbstegn (hvid eller bleg hud, smerter der tager til) med noget,
          der kan vente til samme dag (en reaktion, der har varet over en uge). Skal listen deles i
          "Ring med det samme" (hvid, bleg eller plettet hud, kold hud, smerter der tager til) og
          "Kontakt os samme dag" (tegn på infektion, hævelse der tager til, en reaktion over en uge),
          med samme ordlyd i begge artikler?
    - [ ] **Efterplejen efter skinbooster og Profhilo** følger nu fillox.dk (25/11-2026): "De
          første 12 timer skal du lade være med at gnide eller massere området og undgå makeup og
          hudcreme, sauna, træning og stærk kulde eller varme." (artiklen og FAQ'en "Kan jeg gå på
          arbejde dagen efter?" på begge sider; før stod der ingen tid for makeup, sauna og træning,
          og hudcreme og kulde/varme manglede). fillox.dk siger "også" om anden halvdel: gælder de
          12 timer også den?
    - "Lip filler for første gang" har nu også advarselstegnene (stærkere smerter; hvid, bleg,
      plettet eller blålig hud → akuttelefonen; syn, vejrtrækning eller synkebesvær → 112), et link
      til "Hvornår skal du kontakte os?" i hævelsesartiklen og sætningen "stop ikke selv med
      ordineret medicin" under rådet om Aspirin, Ibux og Voltaren (som hævelsesartiklen).
  - Kontrollen: alle fem artikler, der nævner den, siger nu fillox.dk's betingelser: "Kontrollen
    tilbydes én gang pr. behandling og skal ligge inden for 21 dage efter behandlingen." (Se
    "Kontrol efter behandling" nedenfor om prislisten.)
  - [ ] Copy review af artiklerne og link-teksterne under dem. Bloggens overskrift er nu **"Viden
        fra Fillox-holdet"** (før designets "Viden fra vores behandlere"), introen "Ærlige svar om
        behandlinger, forløb og efterpleje, så du ved, hvad du kan forvente.", og linjen over
        artiklerne på behandlingssiderne "Det, du gerne vil vide før og efter din behandling,
        skrevet af Fillox-holdet." Er de i orden? Rettet efter gennemgangen 25/11-2026: tre uddrag
        er forkortet til højst 160 tegn (uddraget er også metatekst og delingstekst), akuttelefonen
        er et link i "Lip filler for første gang", "Skinbooster eller Profhilo" har vagtlægen, et
        link til "Hvornår skal du kontakte os?" og et link til priserne på hudforbedring,
        konsultationen i "Lip filler for første gang" er tydeligt den samme gratis konsultation,
        formuleringer uden løfter ("for at mindske risikoen for infektion", "som regel ikke et tegn
        på, at noget er galt"), "0,5 ml" og "1 ml" deles ikke over to linjer, og kommaer og et par
        oversatte vendinger er rettet.
- [ ] **Cookiebanner og måling** (du, 25/11-2026: "cookiebanner ja"; se afsnittet "Cookiebanner og
      måling" ovenfor). Gennemgangen af det live site 25/11-2026 fandt GTM-KDBJMVF2 (GA4
      G-TE9JGYM0GM med Google signals og Ads-link, Google Ads Conversion Linker og Meta Pixel
      342699568558593) plus to WordPress-plugins uden for containeren: Site Kit (GA4 G-QMXBXHY79B)
      og PixelYourSite (Meta Pixel 155084197640287 med Conversions API). Det live site har intet
      cookiebanner.
  - [ ] **Bekræft GTM-KDBJMVF2** som containeren til det nye site (`config/site.ts` →
        `analytics.gtmId`), og få containerens administrator til at lave ændringerne her (før
        lanceringen, så målingen virker fra dag ét):
    1. Tag 37 (Custom HTML, Meta Pixel 342699568558593) og tag 38 (`fbq('track','Schedule')`):
       Avancerede indstillinger → Samtykkeindstillinger → "Kræv yderligere samtykke, for at tagget
       udløses": `ad_storage`, `ad_user_data` og `ad_personalization`. I dag udløses Meta Pixel
       uanset samtykke.
    2. Tag 19 (Custom HTML, `bekraeft_booking`) og tag 32 (Custom HTML, lytter efter
       `custom.postMessage.*` fra Gecko-kalenderen): "Intet yderligere samtykke kræves" (de sætter
       ingen cookies; de GA4-events, de udløser, styres af GA4-taggenes samtykke, punkt 3).
    3. GA4-taggene: tag 3 og 33 (Google-tagget G-TE9JGYM0GM) og GA4-events 6, 10, 22, 26, 34 og
       35 → Samtykkeindstillinger → "Kræv yderligere samtykke": `analytics_storage`. Tag 11
       (Conversion Linker) → `ad_storage`. I dag har de kun Googles indbyggede tjek, som ved
       afvist Statistik stadig sender cookieløse GA4-hits (Consent Mode "advanced"), også når kun
       Marketing er valgt — banneret lover, at det kun sker, hvis man siger ja. (Vil juristen
       hellere acceptere de cookieløse hits, skal "13. Cookies" i `content/consent.ts` sige det.)
    4. Udløseren for tag 19, "Page Path indeholder `/booking/`": det nye site har ingen skråstreg
       til sidst. Ret til "Page Path er lig med `/booking`".
    5. Tag 26 (`form_submit` på "Page Path indeholder `/kontakt/`"): eventet kom fra WordPress'
       formular-plugin, og det nye site sender det ikke. Sæt tagget på pause (eller se spørgsmålet
       om kontaktformularen nedenfor) og ret stien til "er lig med `/kontakt`".
    6. Tag 6 (`indsend_knap`, Click Text "Indsend") og tag 10 (`booking_forside`, Click Text
       "BOOKING"): knapperne hedder nu "Send besked" og "Book tid". Ret udløserne.
    7. Læg **ikke** en Consent Mode-standard eller en CMP-skabelon ind i GTM: sitet sætter selv
       standarden (alt afvist) og opdateringen, før containeren indlæses. Slå "Aktivér
       samtykkeoversigt" til under Containerindstillinger for at se hvert tags samtykke.
    8. Test i Tag Assistant på Netlify-preview'et: "Afvis alle" → GTM indlæses ikke; kun
       Statistik → GA4 udløses, tag 37/38 ikke; kun Marketing → ingen GA4-hits (heller ikke
       cookieløse), tag 37/38 udløses; "Accepter alle" → alle tags. Udgiv containeren.
    9. Derefter: sæt `analytics.blockCustomHtmlWithoutMarketing` til `false` i `config/site.ts`
       (ellers er tag 19 og 32, og dermed booking- og købsmålingen i GA4, slået fra, når kun
       Statistik er valgt).
  - [ ] **GA4 og Google Ads** (uden for containeren): Site Kit-pluginnet (G-QMXBXHY79B) stopper med
        WordPress. Det ser ud til at levere Google Ads-konverteringen "Book appointment" (sidevisning
        på `/booking`). Flyt den til G-TE9JGYM0GM (fx nøglebegivenheden `bekraeft_booking` eller
        `purchase`, importeret i Google Ads) før lanceringen, hvis Ads-kontoen byder på den.
  - [ ] **Meta**: PixelYourSite-pixlen 155084197640287 (med Conversions API) stopper med WordPress;
        kun GTM-pixlen 342699568558593 følger med. Hvilken pixel bruger jeres annoncer?
  - [ ] **GA4 G-TE9JGYM0GM** har "automatisk registrering af brugerleverede data" slået til (e-mail
        og telefon fra formularer sendes hashet til Google). Slå det fra (GA4 → Datastrømme →
        Google-tagindstillinger), eller få det beskrevet i privatlivspolitikken.
  - [ ] **Gecko-kalenderen** indlæser Google Tag Manager (GTM-K388CKJQ, GTM-5JMDCX4G) i sin egen
        iframe på `/booking`, uanset cookievalget. Bed Gecko om at fjerne det eller vente på
        samtykke, eller få juristen til at vurdere, om privatlivspolitikken skal nævne det.
  - [ ] **Juristen**: banneret og "13. Cookies" (`content/consent.ts`) er nye tekster. Åbne punkter:
        overførselsgrundlaget for Google og Meta (USA, fx EU-US Data Privacy Framework), og om de
        er databehandlere eller selvstændigt dataansvarlige.
  - [ ] **Kontaktformularen** måles ikke i GA4 på det nye site (se punkt 5). Skal sitet sende et
        event til GTM, når en besked er sendt? (En lille kodeændring.)
- [ ] **Østerbro** er åben (du, 25/11-2026) på **Nordre Frihavnsgade 13A, 2100 København Ø**
      (postnummer og kortplacering tjekket mod OpenStreetMap). Den står nu som åben klinik på
      /klinikker, i menuerne, i footeren, på /kontakt, på forsiden og i de strukturerede data, og
      "Få besked"-formularen er fjernet helt. Åbningstider fra dig 25/11-2026: man–fre 9–18, lør
      10–17, søndag lukket. **Mangler**: linket til klinikkens Google Maps-sted ("Rutevejledning"
      søger i dag på adressen) og Østerbros Gecko-kalender-id (Gecko kender behandlingsstedet "Fillox - Østerbro",
      id 14667). Alt sættes i `content/clinics.ts`.
- [ ] **City2: adresse og weekendtider** (`content/clinics.ts`): fillox.dk/kontakt siger både
      "Cityringen 2, Plan 3" (mobil) og "Cityringen 4" (desktop, centrets egen adresse); weekend
      10–17 (desktop) eller 10–19 (mobil). Centrets egen side (city2.dk, uge 48) siger man–tor 10–19,
      fre 10–21, lør–søn 10–19. Hvad er klinikkens adresse og tider (som i Google-profilen)?
- [ ] **Amager Centret: åbningstider**: sitet viser lør–søn 10–17 (samme tider som City2). Centrets
      egen side (amagercentret.dk, uge 48) siger lør 10–18 og søndag lukket. Hvilke tider gælder?
- [ ] **Afbud og udeblivelse**: live /priser siger 500 kr ved udeblivelse, handelsbetingelserne 100 %
      af bookingen (også ved afbud senere end 6 timer før). Reglen på /priser om, at kun hverdage
      tæller (en mandagstid skal aflyses fredagen før), står ikke på det nye site
      (`content/pages/legal.ts`, kommentaren i `content/prices.ts`). Hvad gælder?
- [x] **Handelsbetingelserne** (du, 26/11-2026: "ret det hele som du har skrevet til mig. alt fra
      punkt 1-9"): `/handelsbetingelser` er rettet (`content/pages/legal.ts`, ikke længere ordret fra
      fillox.dk). Fortrydelsesretten følger forbrugeraftaleloven (LBK nr. 1184 af 28/09/2025, §§ 18–20,
      22 og 25, gennemlæst igen 26/11-2026; § 20 a fra lov nr. 723 af 20/06/2025 står ikke i
      lovbekendtgørelsen, se "Onlinesalg via Gecko"): køber man et gavekort eller abonnement online,
      over telefonen eller på anden måde uden for klinikkerne, kan man fortryde inden for 14 dage uden
      at give en grund; en brugt del betales, og resten refunderes inden 14 dage til det kort, man
      betalte med. Ved køb i klinikken giver loven ingen fortrydelsesret, men live-løftet om 14 dage
      ("medmindre du har taget gavekortet i brug") står der stadig, som jeres eget vilkår. "hold" →
      "behandlinger", den dobbelte overskrift og de tre gentagne gyldighedsregler er slået sammen,
      alle stave- og sætningsfejl er rettet, og teksten siger "du". Forretningsvilkårene er
      uændrede (korttyper, gebyrerne 500 kr / 100 % / 250 kr, gyldighed 6 og 12 måneder, betaling,
      refundering, abonnement, kvitteringer, opsigelse). Opfølgning:
  - [ ] **Juridisk gennemlæsning før lanceringen**: de omskrevne handelsbetingelser og det nye
        afsnit "14. Kontaktformular" (og overførselssætningen i afsnit 12) i privatlivspolitikken bør
        læses af en jurist (alle markeret `// TODO: copy review` i `content/pages/legal.ts`).
  - [ ] **Køb i klinikken**: loven giver ingen fortrydelsesret dér, men betingelserne lover stadig 14
        dage, "medmindre du har taget gavekortet i brug" (som live). Skal det løfte blive stående? Og
        undtagelsen nævner kun gavekortet (som live): kan et abonnement købt i klinikken fortrydes,
        selv om det er taget i brug, eller skal der stå "gavekortet eller abonnementet"?
  - [ ] **Gavekort**: betingelserne siger stadig (som live), at gavekort er personlige og ikke kan
        overdrages, og at de gælder i 6 måneder. Forbrug.dk kalder gavekort ihændehaverbeviser, og en
        gyldighed kortere end 3 år skal være rimelig og tydelig ved købet. Skal de to vilkår blive?
        Forbrug.dk siger også, at værdien af et elektronisk gavekort (et, der fx kan bruges online)
        som udgangspunkt kan udbetales i gyldighedsperioden (med henvisning til betalingsloven § 96),
        mens betingelserne siger, at resterende klip ikke refunderes. Gælder det jeres gavekort, når
        de kun kan bruges hos Fillox (juristen)?
  - [ ] **Abonnement**: der står nu "12 måneder fra købsdatoen" (live sagde også "12 måneder fra
        enten købsdato"): skal der stå "fra købsdato eller startdato"? Og hvad betyder "ved ophør i
        klinikken" (står uændret): når kunden stopper, eller hvis klinikken lukker? Findes
        abonnementet stadig, skal betingelserne også sige, med hvilket varsel det kan opsiges
        (forbrugeraftaleloven § 28, stk. 3; kunden kan altid opsige med 1 måneds varsel, når der er
        gået 5 måneder, § 28, stk. 1). (Se også "Premium medlemskab".)
  - [ ] **Onlinesalg via Gecko**: sælges gavekort og abonnementer online, skal kunden have
        oplysning om fortrydelsesretten og standardfortrydelsesformularen på et varigt medium
        (forbrugeraftaleloven § 8, stk. 1, nr. 11, og § 19, stk. 3–4); ellers forlænges fristen med op
        til 12 måneder. Tjek Geckos kvittering. Sendes fysiske gavekort med posten, løber fristen fra
        modtagelsen (§ 19, stk. 2, nr. 2), ikke fra købsdagen, som betingelserne siger. Siden
        19/6-2026 skal et køb, der er lavet via en onlinegrænseflade, også kunne fortrydes med en
        fortrydelsesfunktion mærket "Fortryd aftale", som er synlig i hele fristen (forbrugeraftaleloven
        § 20 a, indsat ved lov nr. 723 af 20/06/2025), og oplysningerne skal sige, hvor den er (§ 8,
        stk. 1, nr. 11). Har Geckos køb og bookinger en sådan funktion? Så skriver vi i
        betingelserne, hvor den er; ellers skal den laves, før der sælges online.
  - [ ] **Bookinger online og over telefonen** (juristen): en betalt behandling, der bookes online
        (Gecko) eller over telefonen, er også fjernsalg med 14 dages fortrydelsesret (§§ 3, nr. 4, og
        18), og inden for fristen må kunden ikke pålægges andre omkostninger end efter §§ 22, 24 og 25
        (§ 19, stk. 1). Betingelserne nævner kun gavekort og abonnementer. Må afbudsgebyrerne (500 kr /
        100 % / 250 kr) kræves for en online booking, der aflyses inden for 14 dage efter, den blev
        lavet, og skal betingelserne nævne fortrydelsesretten for bookinger? (Selve gebyrerne: se
        "Afbud og udeblivelse".)
  - [ ] **Fejlbehandling og lukkedage** (juristen): betingelserne siger stadig (som live), at
        refundering ved fejlbehandling kun kan ske ved fysisk fremmøde i den klinik, hvor købet er
        foretaget (ved onlinekøb er der ingen sådan klinik), og at der ikke ydes kompensation ved
        lukkedage, ud over at behandlingen flyttes. Holder de to vilkår over for aftaleloven § 38 c og
        forbrugeraftaleloven § 27 og § 33?
- [ ] **Kontrol efter behandling**: det nye site siger "Konsultation og kontrol er altid gratis".
      Live-politikken (fillox.dk/om-os/kontrol-eftertjek, som nu sender videre til
      `/priser#konsultation`) siger også: én kontrol pr. behandling, du booker den selv ca. 14 dage
      efter, og retten bortfalder efter 21 dage. Blogartiklerne siger det nu (25/11-2026), men
      prislisten (`/priser`: introen og rækken "Kontrol efter behandling"), bookingkortet i "Lip
      filler for første gang" og kortet "Gratis kontrol" hos behandlerne gør ikke. Skal
      betingelserne også stå dér (og på `/handelsbetingelser`)?
- [ ] **"Første konsultation er altid gratis"** står på alle behandlingssider, også laser, hud og
      hår, og `/priser` siger "Konsultation og kontrol er altid gratis". Live /priser nævner kun
      "Fillers konsultation" og "Lægekonsultation" som gratis og har "Sen aflysning - Konsultation kr
      250". Gælder den gratis konsultation alle behandlinger? Ellers begrænser vi løftet til fillers
      og rynkebehandling.
- [ ] **Akuttelefonen** har samme nummer som telefontiden (35 10 00 50, man–fre 10–17, lør 10–14),
      og på `/kontakt` står de to kort side om side. En kunde med en komplikation om aftenen kan
      ikke se, om opkaldet når vagtlægen. Hvordan når et opkald uden for telefontiden vagtlægen (fx
      et valg i telefonmenuen)? Så skriver vi det ved akuttelefonen, fx "Akuttelefon 35 10 00 50,
      også uden for telefontiden". Har vagtlægen et eget nummer, bruger vi det.
- [ ] **Sundhed+**: live /finansiering tilbyder finansiering via Sundhed+ (Sundhed+ Kredit). Det nye
      `/priser#finansiering` siger kun "Spørg i klinikken eller ved booking" (`content/prices.ts` →
      `financing`). Skal Sundhed+ nævnes eller linkes?
- [ ] **Premium medlemskab**: live /medlem (500 kr/md., 6.000 kr til behandlinger om året, 20 %
      rabat) findes ikke på det nye site, og /medlem sender videre til `/priser`. Tilbydes
      medlemskabet stadig? (Handelsbetingelserne nævner stadig abonnement.)
- [x] **Laserpriser for mænd og kvinder** (du, 26/11-2026: "ret det med priser osv osv.. det ikke
      mening"): én pris pr. kombination for alle, den laveste, og ingen pris efter køn
      (ligestillingsloven, LBK nr. 5 af 06/01/2025, § 2; EU-direktiv 2004/113). "Laserpakker for mænd"
      hedder nu "Laserpakker, overkrop" (chip "Laser overkrop", `/priser#laser-overkrop`, før
      `#laser-maend`), med samme otte rækker og beløb, og rækkerne linker til laser hårfjerning.
      "Mave + bryst" 1.700, "Ryg + skuldre" 2.750 og "Ryg + skuldre + mave + bryst" 3.900 kr er taget ud
      af "Laserpakker", fordi de samme områder står til 1.500 / 2.000 / 3.500 kr. Intet beløb er ændret
      eller nyt. Laser for mænd viser pakkerne under kortets navn (før "Priser for mænd") med "Faste
      priser på kombinerede områder, de samme for alle.", laser hårfjernings FAQ siger "… og priserne
      er de samme for alle", og `/behandlinger/for-maend` siger "Der er også faste pakkepriser …" (før
      "Til mænd er der også …"). "Fra"-priserne er uændrede overalt (laser fra 500 kr, "Laserpakker,
      overkrop" fra 1.000 kr og "Laserpakker" fra 1.300 kr i Priser-menuen). Opfølgning:
  - [ ] **Gecko og fillox.dk**: bookingen i Gecko (og live /priser) har stadig de gamle laserpakker:
        listen "Mænd" og "Mave + bryst" 1.700, "Ryg + skuldre" 2.750 og "Ryg + skuldre + mave + bryst"
        3.900 kr. Ret dem i Gecko før lanceringen (pakkerne uden "mænd", de tre dyre pakker fjernet),
        så bookingen viser de samme navne og priser som sitet.
  - [ ] **Laserpakker dyrere end enkeltområderne**: tre rækker på "Laserpakker, overkrop" koster mere
        end områderne hver for sig: Ryg / skuldre / arme 3.400 kr (Ryg inkl. lænd 1.200 + Skuldre 850 +
        Hele arme 1.200 = 3.250), Ryg / skulder / nakke 2.700 kr (1.200 + 850 + Nakke 600 = 2.650) og
        Ryg / skuldre / bryst 3.100 kr (1.200 + 850 + Bryst 900 = 2.950). Er det en fejl, eller dækker
        pakkerne mere (fx ryg uden lænd)? Beløbene er ikke ændret.
  - [ ] Copy review: "Laserpakker, overkrop" har også ryg, skuldre, arme, nakke og skæglinje, mens
        "Overkrop" på live /priser kun er overskriften for maven og brystet. Et bredere navn kunne være
        "Laserpakker, ryg og overkrop".
- [ ] **"Kun læger & sygeplejersker"** (trust-chippen på `/priser`) og "udført af læger og
      sygeplejersker" (sitets titel og beskrivelse, `content/layout.ts`, forsiden): gælder det også
      laser hårfjerning? Ellers skal formuleringen ændres (af jer eller bureauet). (Alberte er
      kosmetisk sygeplejerske, du 25/11-2026, så for hende passer det.)
- [ ] **Alberte** (`content/team.ts`): titel og klinik er afklaret 25/11-2026 (kosmetisk
      sygeplejerske, Fillox Frederiksberg).
  - [x] **Hvad hun udfører** (du, 25/11-2026, om behandlingerne på hendes profil: "ved ikke tjek
        hvad vi har skrevet tidligere, nok det hele"): laser hårfjerning, microneedling,
        skinbooster, signatur-ansigtsbehandling og PRF hud bliver på hendes profil ud fra det svar.
        Dertil er **lip filler** og **fillers i ansigtet** kommet på, fordi hendes egne
        Trustpilot-anmeldelser nævner læber og filler (Jh nævner ikke hvilket område) ("Jeg har fået lavet læber hos Alberte", "et perfekt resultat af mine læber", "Fik lavet
        læber hos Alberte" og "Jeg har aldrig prøvet hverken filler eller microneedeling før" om
        hendes behandlinger), og **rynkebehandling** (du, 25/11-2026: "ja hun laver også
        rynkebehandling"). De har samme navn, tekst og pris som hos Annika og Mike (fra
        prislisten; rynkekortet hedder "Rynkebehandling", aldrig produktnavnet). Rækkefølgen:
        hudbehandlingerne først (hendes profils fokus i designet), så lip filler, fillers og
        rynkebehandling, og "Gratis konsultation" sidst: ni kort, tre hele rækker af tre fra 1152 px
        og rækker af to fra 768 px med konsultationen i fuld bredde. Lip filler-siden viser stadig
        Annika som "Din behandler", rynkesiden viser ingen behandler, og ingen anden
        behandlingsside har fået en ny behandler.
  - [ ] Hendes **uddannelse**: designets tidslinje ("2021 kosmetolog, 2022 laser/IPL …") og specialet
        "Laser & hudforbedring" er ikke med, da intet bekræfter dem.
  - [ ] Laver Alberte også filler i **kindben, kæbelinje og hage** (kortet "Fillers i ansigtet")?
        Hendes anmeldelse nævner kun "filler" uden område; ellers fjernes kortet fra hendes profil.
- [x] **"10.000+ behandlinger"** i forsidens hero (`content/pages/home.ts` → `stats`): bekræftet
      25/11-2026 ("10.000+ behandlinger er det vi har lavet indtil videre").
- [x] **Instagram**: kontoen er @fillox.dk (tidligere @fillox_dk), bekræftet af ejeren 25/11-2026.
      `config/site.ts` → `social.instagram`; /content-creator og de strukturerede data (`sameAs`)
      læser derfra.
  - [ ] Footeren har **intet Instagram-link** (designet har ingen sociale links), men det live
        fillox.dk linker til Instagram fra forsiden. Skal footeren have et link til @fillox.dk?
- [x] `npm run build` er grønt, og de gamle URL'er redirecter: tjekket 24/11-2026 (produktionsbuild,
      `check:market` ok). Alle 45 adresser i WordPress' sitemap og de 24 menulinks på det live site,
      med og uden skråstreg til sidst, giver 200 eller ét 308-hop til en side med 200; de gamle
      adresser, der redirecter, gør det også med store bogstaver (`/FILLERS/`); alle `#ankre` findes;
      0 brudte interne links. Undtagelse (25/11-2026): de sider, der har samme adresse som før
      (`/priser`, `/om-os`, `/booking`, `/kontakt`, `/handelsbetingelser`, `/privatlivspolitik`),
      giver 404 med store bogstaver (fx `/Priser`, og `/Priser/` → 308 → `/Priser` → 404), hvor
      WordPress svarede 200. Skal det rettes, kan en lille `proxy.ts` sende enhver adresse med store
      bogstaver videre (308) til samme adresse med små.

## Efter lancering

- [ ] **Domæneskiftet** (lanceringsdagen, først): primært domæne, nyt deploy og de tre tjek i
      "Domæneskiftet" ovenfor. Indtil det er gjort, er hele fillox.dk blokeret for søgemaskiner.
- [ ] **Første Netlify-deploy (preview)**: alt ovenfor er målt på `next start`. På Netlify kører
      billeder gennem Netlify Image CDN og HTML/JS gennem Netlifys edge, så tjek på preview-URL'en:
      Lighthouse mobil + desktop på de vigtigste sider; at `/_next/image` svarer med `image/avif`
      eller `image/webp` (med `Accept: image/avif,image/webp`) og lang cache; at HTML og JS er
      brotli-komprimeret; ingen konsolfejl eller 404'er; og at alle seks sikkerheds-headers kommer
      præcis én gang på en side OG på en fil: `curl -sI https://fillox-dk.netlify.app/ | cut -d: -f1
      | sort | uniq -di` og det samme for `/images/fillox/spejl.jpg`. Kommandoen må kun vise
      cache-status (og `x-nextjs-prerender`, som er Next.js' egen). Netlify sætter selv HSTS og
      nosniff på sider; står en af dem to gange, så sig det.
- [ ] **CSP**: i lanceringsugen er den kun rapporterende. Lav en hel testbooking i Gecko, inkl.
      betalingstrinnet, i Safari, Chrome og Firefox, og tjek, at konsollen ikke viser CSP-brud. Gør
      det også efter "Accepter alle" (GTM, GA4, Google Ads og Meta Pixel indlæst), gerne med et
      annonceklik-id i adressen (fx `?gclid=test`): GA4-taggets Ads-link kan kalde
      `ad.doubleclick.net` og `www.googleadservices.com`, som nu står i CSP'en (25/11-2026). Sæt så
      `cspHeaderName` i `config/securityHeaders.ts` til `Content-Security-Policy`, og omdøb nøglen
      i `netlify.toml` på samme måde (`check:market` kræver begge).
- [ ] **Google Search Console**: indsend `/sitemap.xml` og `/legacy-sitemap.xml`. Slet
      `public/legacy-sitemap.xml` og de to `wp-sitemap-…`-redirects i `content/redirects.ts` ca. 3
      måneder efter lanceringen.
- [ ] **Hastighed i praksis**: se feltdata (Core Web Vitals) for fillox.dk i PageSpeed Insights ca.
      28 dage efter lanceringen.

## Rebranding til fillox.no

fillox.no er et **separat repo**, der kopieres fra dette. Komponenterne er markedsneutrale:
man bytter markedsdata, ikke kode. Rør ikke `components/`, `lib/` eller `config/types.ts` —
skal du rette en tekst i en komponent, hører teksten til i `content/`.

### 1. Filer, der skal byttes

| Fil / mappe | Hvad |
|---|---|
| `config/site.ts` | `market: "no"`, `country: "NO"`, `legalName`, `domain`/`url` (`https://fillox.no`), `locale: "nb-NO"`, `lang: "nb"`, `currency: "NOK"`, `pricePattern`, telefon/e-mail, `company` (`registrationLabel: "Org.nr."`), Instagram, Trustpilot (`score`, `reviewCount`, `url` som på profilen), **booking** (se punkt 3), `analytics.gtmId` (fillox.no's egen GTM-container, eller `null`: så intet cookiebanner og ingen tags; cookielisten i `content/consent.ts` skal passe til containerens tags) |
| `content/routes.ts` | Norske stier, fx `/om-oss`, `/personvern`, `/kontakt/takk` — **og omdøb de matchende mapper i `app/`** |
| `content/**` | Al tekst og data: navigation, klinikker, behandlinger, priser, behandlere, blog, sidetekster, UI-strenge, 404, `/booking`-tekst, `seo.ts` (dag-labels), `forms.ts` (formularnavne), `redirects.ts` (gamle fillox.no-URL'er), `reviews.ts` (kun ægte anmeldelser fra fillox.no's Trustpilot-profil, ordret; se kommentaren øverst i filen) |
| `public/__forms.html` | Samme formularnavne som `content/forms.ts` |
| `public/__kontakt-sendt.html` | Videresender til `routes.contactThanks` (fx `/kontakt/takk`) |
| `public/__nyhedsbrev-tilmeldt.html` | Videresender til `routes.newsletterThanks` (fx `/nyhetsbrev/takk`); filnavnet er `content/forms.ts` → `newsletterNoJsAction` |
| `public/images/**` | Fotos; **klinikkortet** `public/images/clinics/kort.svg` er et København-kort |
| `public/legacy-sitemap.xml` | De gamle fillox.dk-adresser: slet filen (og de to `wp-sitemap-…`-redirects), eller erstat den med fillox.no's gamle URL'er |
| `config/securityHeaders.ts` + `netlify.toml` | Samme ændring i begge: CSP'en nævner Geckos værter. Til TIMMA `frame-src https://bestill.timma.no` i stedet for Geckos værter, ingen Gecko-script-vært, og fillox.no's GTM-værter. `check:market` fejler, hvis CSP'en ikke tillader TIMMA-siden |
| `ARCHITECTURE.md`, `README.md` | Rutetabel og tekst for NO |

`config/types.ts` og `content/types.ts` er fælles kontrakter — TypeScript tjekker det norske
indhold mod samme typer, som komponenterne bruger. Kør `npx tsc --noEmit` og
`npm run check:market` efter hvert skridt.

### 2. Ruter

Mapperne i `app/` er de rigtige URL'er; `content/routes.ts` er kortet, som links, canonical-URL'er
og sitemap bygges af. Ændr begge — `check:market` fejler, hvis de ikke passer sammen.

| DK | NO (forslag) |
|---|---|
| `app/om-os` | `app/om-oss` |
| `app/handelsbetingelser` | fx `app/vilkar` |
| `app/privatlivspolitik` | `app/personvern` |
| `app/kontakt/tak` | `app/kontakt/takk` |
| `app/nyhedsbrev/tak` | `app/nyhetsbrev/takk` |
| `app/booking` | beslutning: behold `/booking`, eller `/book-time` som på den nuværende fillox.no |

Resten (`behandlinger`, `behandlere`, `klinikker`, `kontakt`, `priser`, `blog`,
`ledige-stillinger`, `content-creator`) er de samme ord på norsk. Sidetitler, H1'er og
sektion-id'er kommer fra `content/`.

### 3. Booking: TIMMA i stedet for Gecko

fillox.no booker via TIMMA — én reservationsside pr. klinik. `/booking` viser da en
klinikvælger (en knap pr. åben klinik) og klinikkens TIMMA-side i fuld bredde.

```ts
// config/site.ts
booking: {
  provider: "timma",
  href: routes.booking,
  timmaBaseUrl: "https://bestill.timma.no/reservation/",
},
```

```ts
// content/clinics.ts — på hver åben klinik
booking: { timmaId: "filloxstortingsgata" },
```

TIMMA-id'erne fra den nuværende fillox.no: `filloxdrammen`, `filloxlillestrom`,
`filloxmajorstuen`, `filloxstortingsgata`, `filloxstrommen`, `filloxtheresesgate`,
`filloxtorshov`.

- `/booking?klinik=<slug>` vælger klinikken på forhånd (klinik-links i menuer og på kort bygges
  automatisk af `lib/booking.ts`). Query-parameteren er tekst: `content/layout.ts` →
  `booking.params` (fx `klinikk`).
- Vælgerens tekster: `content/layout.ts` → `booking.clinicPicker`.
- iframen får automatisk sidens højde: TIMMA-siden taler iframe-resizer-protokollen, og
  `components/booking/TimmaEmbed.tsx` svarer på den selv — der indlæses intet tredjepartsscript.
- `check:market` fejler, hvis en åben klinik mangler `timmaId`.
- Fjern Gecko-felterne (`geckoHost`, `geckoIcCode`, `geckoCalendarId`) — de bruges ikke.
- Læg redirects fra de gamle booking-URL'er ind i `content/redirects.ts`, fx
  `/book-time/stortingsgata` → `/booking?klinik=stortingsgata`.

### 4. Pas på

- **Syv klinikker**: klinik-rækkerne på forsiden, i footeren og på `/kontakt` har fire kolonner
  (designet til fire danske klinikker) og bliver 4 + 3 med syv. Kræver en designbeslutning
  (fx gruppering efter region som på den nuværende fillox.no).
- **Klinikkortet på mobil** (`/klinikker`) er tegnet over København: nyt kort
  (`public/images/clinics/kort.svg`) og nye pin-positioner i `content/pages/clinics.ts` → `map.pins`.
- **Adresser og åbningstider**: sidste adresselinje `<postnr> <sted>` (fx `0161 Oslo`), tider
  som `10–20`, og dag-labels (`Man–fre`, `Lør–søn` …) skal stå i `content/seo.ts` →
  `openingDays` — ellers mangler de i Googles strukturerede data (`check:market` fanger det).
- **Juridiske sider**: firmakortene (navn, org.nr., telefon) hentes fra `config/site.ts`, men
  brødteksten i `content/pages/legal.ts` er skrevet til Danmark (Fillox Danmark ApS, dansk
  sundhedslovgivning, Datatilsynet, journalføring i Gecko Booking) og skal skrives om til
  norske forhold. Handelsbetingelsernes fortrydelsesret følger siden 26/11-2026 den danske
  forbrugeraftalelov, og afsnit 12 og 14 i privatlivspolitikken (nyhedsbrevet, kontaktformularen)
  nævner Netlify og EU-U.S. Data Privacy Framework.
- **Formularnavne** vises i Netlify og i notifikationsmails — skift dem i `content/forms.ts` og
  `public/__forms.html` samtidig.
- **Priser**: skrives som tal i `content/**`; formatet (`1 499 kr`, `kr 1 499,-`) styres af
  `locale` og `pricePattern` i `config/site.ts`.
- **Før/efter-billeder** er forbudt i markedsføring af kosmetiske indgreb i Norge: slet
  `public/images/resultater/` og `results` / `resultsTitle` / `resultsIntro` i `content/treatments.ts`
  (Kæbelinje), og brug kun billeder, I har lov til at bruge dér (`content/photos.ts`, med
  `share`-udsnittene til delingsbilleder). Lægens foto på Om os (`content/pages/about.ts` →
  `doctor.image`) er i dag Dr. Toms portræt i et bredt udsnit. Uden nøglen viser afsnittet hans
  udsnit fra behandlerkortet, som så står to gange på siden.
- **Gamle URL'er**: `content/redirects.ts` er den danske WordPress-liste — erstat den med
  fillox.no's gamle sitemap, så placeringer og links overlever skiftet.
- **hreflang** mellem fillox.dk og fillox.no er ikke sat op (kræver en tabel over, hvilke
  sider der svarer til hinanden, da stierne er forskellige).
