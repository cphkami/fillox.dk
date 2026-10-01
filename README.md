# Fillox.dk

Marketingsitet for Fillox Danmark: behandlinger, priser, klinikker, behandlere, blog og
online booking. Bygget ud fra Claude Design-filen **"Fillox Signature v2"** (Bold & Bordeaux,
designmanual 2026 — kilden ligger i `design-reference/`).

Søsterrepoet `fillox-no` (fillox.no) laves ud fra dette repo ved at bytte markedsdata ud —
se [Rebranding til fillox.no](#rebranding-til-filloxno). Arkitekturen og reglerne for koden
står i `ARCHITECTURE.md`.

## Stack

- **Next.js 16** (App Router, React 19, TypeScript) — alle sider genereres statisk
- **Tailwind CSS v4** — design-tokens i `app/globals.css`
- **Netlify** — hosting (`netlify.toml`, Next.js-runtime)
- **Netlify Forms** — kontaktformular, nyhedsbrev og "Få besked" (ingen backend)
- **Gecko Booking** — online booking på `/booking` (TIMMA understøttes til fillox.no)

Ingen database og ingen miljøvariabler.

## Lokal udvikling

```bash
npm install
npm run dev              # http://localhost:3000
```

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
  redirect i `content/redirects.ts` peger på en side, der ikke findes;
- en formular i `content/forms.ts` ikke er erklæret i `public/__forms.html` (eller omvendt), eller
  `public/__kontakt-sendt.html` ikke sender videre til takkesiden;
- booking-udbyderen mangler id'er (TIMMA: `timmaId` på hver åben klinik);
- en åben kliniks adresse eller åbningstider ikke kan læses ind i de strukturerede data
  (sidste adresselinje skal være `<postnr> <by>`, tider som `10–20`, dag-labels i
  `content/seo.ts` → `openingDays`);
- der står æ, ø eller å i en streng i `app/`, `components/` eller `lib/` (tekst hører til i
  `content/`).

Klinikker uden Gecko-kalender-id vises som en note (ikke en fejl).

## Deploy til Netlify

`netlify.toml` bygger med `npm run build` (inkl. `check:market`) og udgiver `.next` med
Netlifys Next.js-runtime. Ingen miljøvariabler. Kræver Node ≥ 20.9 (Next 16) — sæt evt.
`NODE_VERSION` i Netlify, hvis standardversionen er ældre.

1. Forbind repoet i Netlify → build-indstillingerne læses fra `netlify.toml`.
2. Domæne: `fillox.dk` (+ `www`) → Netlify, HTTPS via Let's Encrypt.
3. Gamle WordPress-URL'er sendes videre med 308 (`content/redirects.ts`, via `next.config.ts`).
4. Efter første deploy: indsend `https://fillox.dk/sitemap.xml` i Google Search Console.

## Formularer via Netlify Forms

| Formular | Navn (`content/forms.ts`) | Hvor |
|---|---|---|
| Kontakt | `kontakt` | `/kontakt` |
| Nyhedsbrev | `nyhedsbrev` | `/blog` |
| "Få besked" (Østerbro) | `osterbro-besked` | `/klinikker` |

- Netlify finder formularerne ved deploy i `public/__forms.html` (skjult, aldrig linket).
  Feltnavnene dér skal matche det, komponenterne sender.
- Med JavaScript sender siden data til `/__forms.html` (`lib/forms.ts`) og viser en kvittering
  på stedet. Uden JavaScript poster kontaktformularen til `public/__kontakt-sendt.html`, som
  sender videre til `/kontakt/tak`.
- Spam: honeypot-feltet `bot-field`.
- Notifikationer (e-mail ved ny besked) sættes op i Netlify under **Forms → Form notifications**.

## Booking via Gecko

- `config/site.ts` → `booking`: `provider: "gecko"`, Gecko-host og `geckoIcCode`.
- `/booking` viser Gecko-kalenderen (`components/booking/BookingEmbed.tsx` → `GeckoEmbed.tsx`,
  som indlæser Geckos `iframe.js`).
- Klinik-links ("Book →" i menuerne, klinikkortene) bygges af `lib/booking.ts`:
  - med et Gecko-kalender-id: `/booking?geckoCalendarId=12`, og Gecko vælger klinikken på forhånd;
  - uden: `/booking?klinik=<slug>` (kalenderen åbner uden filter).
- Behandler-links er `/booking?behandler=<slug>` (Gecko læser dem ikke; de er til statistik).
- Kalender-id'erne sættes pr. klinik i `content/clinics.ts` → `booking: { geckoCalendarId: "12" }`
  (id'et findes i Gecko-admin; `"12.13"` for flere kalendere).

## Før lancering

- [ ] **Gecko-kalender-id'er** på City2, Amager Centret og Frederiksberg i `content/clinics.ts`
      (`booking.geckoCalendarId`), så klinik-links vælger klinikken i kalenderen.
- [ ] **Copy review** — alle `// TODO: copy review` i `content/**` (tekster, der ikke står i
      designet og er skrevet i designets tone):
  - [ ] `content/layout.ts`: SEO-titel/-beskrivelse, alt-tekst på delingsbillede, skjulte
        skærmlæser-navne, "Læs om finansiering", "Se alle …"-links i mobilmenuen, 404-siden og
        hele `/booking`-teksten
  - [ ] `content/pages/home.ts`: SEO-titel, alt-tekst, skjulte navne
  - [ ] `content/pages/about.ts`: meta-beskrivelse, alt-tekst
  - [ ] `content/treatments.ts`: one-liners for behandlinger uden egen side og tekster i
        Botox/Lip filler-siderne
  - [ ] `content/pages/treatments.ts`: fallback-tekster, FAQ'er, oversigtssiden `/behandlinger`
  - [ ] `content/pages/practitioner.ts`: behandlersider (tekst i booking-båndet pr. behandler)
  - [ ] `content/pages/contact.ts`: meta, kort, formularens tilstande — og **beslut, om desktop
        også skal have samtykke-feltet** (kun i mobildesignet)
  - [ ] `content/pages/clinics.ts`: meta, skjulte navne, "Få besked"-formularen
  - [ ] `content/pages/blog.ts` og `content/blog.ts`: artikeldatoer og -tekster, nyhedsbrev
  - [ ] `content/pages/jobs.ts` og `content/pages/creator.ts`: hele siderne (ikke i designet)
  - [ ] `content/pages/legal.ts`: meta-beskrivelser og "Juridisk"-eyebrow
- [ ] **Pris**: Skinbooster står "fra 999 kr" på forsiden i designet, men 1.499 kr alle andre
      steder — vi bruger 1.499 kr (`content/treatments.ts`, bestsellers). Fillox bekræfter.
- [ ] **Juridisk**: registreret adresse og mailadresse til databeskyttelse (`info@` på
      privatlivssiden, `kontakt@` i `config/site.ts`) — `content/pages/legal.ts`.
- [ ] **Anmeldelser og Botox** (juridisk vurdering): Botox er receptpligtig medicin. Anmeldelser,
      der nævner Botox, er udeladt, og de seks botulinumtoksin-sider (Botox, Lip flip, Gummy
      smile, Hyperhidrose, Traptox, Botox for mænd) viser ingen kundeanmeldelser
      (`treatmentsWithoutReviews` i `content/reviews.ts`). Slå dem først til, når det er afklaret.
- [ ] **Billeder**: rigtige før/efter-billeder med samtykke (`content/treatments.ts`), foto +
      alt-tekst pr. klinik (`content/pages/clinics.ts`, og `seoImage`/`geo` i
      `content/clinics.ts`), større original af Om os-billedet (`content/pages/about.ts`).
- [ ] **Netlify Forms**: formularerne ses under Forms efter første deploy; slå notifikationer til.
- [ ] **Østerbro**: når klinikken åbner, sæt `status: "open"`, adresse, åbningstider og
      Gecko-id i `content/clinics.ts`.
- [ ] `npm run build` er grønt, og de gamle URL'er redirecter (stikprøve fra
      `content/redirects.ts`).

## Rebranding til fillox.no

fillox.no er et **separat repo**, der kopieres fra dette. Komponenterne er markedsneutrale:
man bytter markedsdata, ikke kode. Rør ikke `components/`, `lib/` eller `config/types.ts` —
skal du rette en tekst i en komponent, hører teksten til i `content/`.

### 1. Filer, der skal byttes

| Fil / mappe | Hvad |
|---|---|
| `config/site.ts` | `market: "no"`, `country: "NO"`, `legalName`, `domain`/`url` (`https://fillox.no`), `locale: "nb-NO"`, `lang: "nb"`, `currency: "NOK"`, `pricePattern`, telefon/e-mail, `company` (`registrationLabel: "Org.nr."`), Instagram, Trustpilot (`score`, `reviewCount`, `url` som på profilen), **booking** (se punkt 3) |
| `content/routes.ts` | Norske stier, fx `/om-oss`, `/personvern`, `/kontakt/takk` — **og omdøb de matchende mapper i `app/`** |
| `content/**` | Al tekst og data: navigation, klinikker, behandlinger, priser, behandlere, blog, sidetekster, UI-strenge, 404, `/booking`-tekst, `seo.ts` (dag-labels), `forms.ts` (formularnavne), `redirects.ts` (gamle fillox.no-URL'er), `reviews.ts` (kun ægte anmeldelser fra fillox.no's Trustpilot-profil, ordret; se kommentaren øverst i filen) |
| `public/__forms.html` | Samme formularnavne som `content/forms.ts` |
| `public/__kontakt-sendt.html` | Videresender til `routes.contactThanks` (fx `/kontakt/takk`) |
| `public/images/**` | Fotos; **klinikkortet** `public/images/clinics/kort.svg` er et København-kort |
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
  norske forhold.
- **Formularnavne** vises i Netlify og i notifikationsmails — skift dem i `content/forms.ts` og
  `public/__forms.html` samtidig.
- **Priser**: skrives som tal i `content/**`; formatet (`1 499 kr`, `kr 1 499,-`) styres af
  `locale` og `pricePattern` i `config/site.ts`.
- **Gamle URL'er**: `content/redirects.ts` er den danske WordPress-liste — erstat den med
  fillox.no's gamle sitemap, så placeringer og links overlever skiftet.
- **hreflang** mellem fillox.dk og fillox.no er ikke sat op (kræver en tabel over, hvilke
  sider der svarer til hinanden, da stierne er forskellige).
