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
- **Netlify Forms** — kontaktformular, nyhedsbrev og "Få besked" (ingen backend)
- **Gecko Booking** — online booking på `/booking` (TIMMA understøttes til fillox.no)

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
  redirect i `content/redirects.ts` peger på en side, der ikke findes;
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
- der står æ, ø eller å i en streng i `app/`, `components/` eller `lib/` (tekst hører til i
  `content/`; udviklerværktøjet i `components/dev/` er undtaget).

Klinikker uden Gecko-kalender-id vises som en note (ikke en fejl), og det samme gør
Trustpilot-tallene i `config/site.ts`, når `trustpilot.checked` er mere end 60 dage gammel.

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
| Nyhedsbrev | `nyhedsbrev` | footeren på alle sider + `/blog` |
| "Få besked" (Østerbro) | `osterbro-besked` | `/klinikker` |

- Netlify finder formularerne ved deploy i `public/__forms.html` (skjult, aldrig linket).
  Feltnavnene dér skal matche det, komponenterne sender.
- Med JavaScript sender siden data til `/__forms.html` (`lib/forms.ts`) og viser en kvittering
  på stedet. Uden JavaScript poster kontaktformularen til `public/__kontakt-sendt.html`, som
  sender videre til `/kontakt/tak`, og nyhedsbrevet til `public/__nyhedsbrev-tilmeldt.html`, som
  sender videre til `/nyhedsbrev/tak`. Filerne i `public/` indeholder ingen tekst.
- Nyhedsbrevet: privatlivspolitikken har et afsnit om det (`content/pages/legal.ts`, "12.
  Nyhedsbrev"), som begge tilmeldinger linker til. Skal godkendes af Fillox inden lancering (se
  TODO'en dér: mailværktøj, databehandleraftaler, overførsel til USA). Tilbud i nyhedsbrevet må
  aldrig reklamere for Botox eller andre receptpligtige lægemidler.
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
        /priser-metabeskrivelsen), `content/layout.ts` (sitets beskrivelse), `content/team.ts`
        (Maria), `content/navigation.ts` ("For mænd"-noten), `content/pages/home.ts` og
        `content/pages/men.ts`
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
- [ ] **Botox og markedsføring** (juridisk vurdering). Botox er receptpligtig medicin og må ikke
      reklameres for over for offentligheden. Bureauets nye tekster (oktober 2026) løser
      hovedparten: Botox-siden er erstattet af `/behandlinger/rynkebehandling` og
      `/behandlinger/andre-behandlingsmuligheder` (bureauets tekster, ordret), som handler om
      behandlingen og ikke om produktet. De gamle adresser (`/rynkebehandling`,
      `/ovrige-botox-behandlinger`, `/behandlinger/botox`, `/behandlinger/lip-flip` …) sender
      videre dertil (`content/redirects.ts`). Resten af sitet følger samme linje: menuer, kort,
      priskortets etiket og mobil-chip ("MIMISKE RYNKER M.M." og "Rynkebehandling" i stedet for
      "BOTOX" / "Botox"), metabeskrivelsen på `/priser`, sitets standardbeskrivelse og
      strukturerede data (`content/layout.ts`), Marias titel, bio og faktakort og hendes afsnit på
      lip filler-siden siger nu "rynkebehandling" (alle markeret `// TODO: copy review`).
      Produktnavnet står kun, hvor bureauet selv har skrevet det: ét FAQ-svar på rynkesiden og én
      sætning i Fillox Academy-afsnittet på Om os. De to rynkesider viser ingen anmeldelser,
      resultater, blogindlæg eller "fra"-pris (`treatmentsWithoutReviews` i `content/reviews.ts`).
      Stadig åbent:
  - [ ] **Blogartikler**, der stadig nævner Botox som produkt: `/blog/botox-for-foerste-gang`,
        `/blog/hvornaar-giver-det-mening-at-starte-med-botox`,
        `/blog/de-foerste-24-timer-efter-botox` og filterknappen "Botox" på `/blog`
        (`content/blog.ts`). Vi har ikke rørt dem: skal de skrives om (af bureauet) eller fjernes?
  - [ ] **Priser**: alle rækker på priskortet "Rynkebehandling" er uændrede (områder, pakker,
        tyggemuskler, hyperhidrose, Traptox). Konsultationskortet har stadig rækken
        "Lægekonsultation før første botox" — forslag med bureauets ord: "Lægefaglig
        forundersøgelse før første behandling". Traptox nævnes ikke på nogen side og er nu en
        prisrække uden link: skal den have et afsnit?
  - [ ] **"fra 799 kr" for rynkebehandling** står stadig i menuerne, på forsiden (bestseller #01),
        på siden for mænd og i behandlernes priskort ("Rynkebehandling" lige over
        kundeanmeldelserne hos Annika, Maria og Mike, `wrinkleOffer` i `content/team.ts`). Er en
        pris ved siden af behandlingen i orden?
  - [ ] **Siden for mænd** (`content/pages/men.ts`): FAQ-svaret "Hvor lang tid tager det?" bruger
        nu rynkesidens ord (lægefaglig forundersøgelse, mindst to dages betænkningstid);
        "cirka 15 minutter" og "Den er gratis" er taget ud. Skal det igen stå, at
        lægekonsultationen er gratis?
  - [ ] **Om os**: "Det er let at finde en klinik, der tilbyder botox, filler, laser …" er
        bureauets sætning og står ordret. Behold den, eller bed bureauet om en ny formulering
        (fx "rynkebehandling, filler, laser …") — ret den ikke selv.
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
      (4) Forsidens resultatbillede med teksten "rynkebehandling, 2026" er det samme stockfoto
      som rynkesidens topbillede.
- [ ] **Om os** (`content/pages/about.ts`, bureauets nye tekst): (1) "Og du behøver ikke føle dig
      hjemme i en eksklusiv luksusklinik for at føle dig hjemme hos os." står ordret, men lyder
      oversat — bed bureauet se på den. (2) Dr. Toms titel: den nye tekst siger "grundlægger af
      Fillox" og "den medicinsk ansvarlige læge", hans behandlerkort "Æstetisk læge · Daglig
      leder" og "fagligt ansvarlig læge" (`content/team.ts`). Hvilken skal begge steder bruge?
      (3) Dr. Toms portræt står to gange lige efter hinanden (lægeafsnittet og første
      behandlerkort): vi mangler et andet foto af ham (fx når han underviser, mindst 1300 px
      bredt). (4) Topbilledet er kun 800 × 533 og bliver blødt på store skærme: vi mangler en
      større original (mindst 2200 × 1470; tjek `hero.imagePositionDesktop`, hvis den er beskåret
      anderledes).
- [ ] **Behandlere** (`content/team.ts`, `// TODO: copy review`): Kubras tekster er et neutralt
      udkast (titel, City2, fillers, rynkebehandling og hudforbedring) — få hendes egne ord og et
      citat. Dr. Toms og Marias "Sådan arbejder …"-kort er skrevet i tredje person ud fra Om os.
      `/klinikker` siger ikke længere "Samme behandlere" (`content/pages/clinics.ts`), da
      behandlerne arbejder på bestemte klinikker — bekræft. Større originaler af `tom.jpg`
      (509 × 800) og `maria.jpg` (533 × 800): de bliver forstørret i profilernes hero fra 1280px.
- [ ] **Booking hos en bestemt behandler**: `/booking?behandler=<slug>` åbner Gecko-kalenderen
      uden filter. Kan Gecko forvælge en behandler (et kalender- eller ressource-id pr. behandler,
      som `geckoCalendarId` pr. klinik)? Indtil da åbner knapperne "Book tid hos …" på
      behandlersiderne kalenderen uden filter.
- [ ] **Båndet lige over footeren**: designets lyse bånd var i ét med den beige footer. Om os slutter nu med det rosa bånd "Velkommen til Fillox" (den nye tekst),
      ligesom behandlersiderne ("Book tid hos …"). Kun `/behandlere` slutter stadig med det sand-
      farvede "Fagligt ansvarlig"-bånd (`components/about/ResponsibleBand.tsx`). Skal det også være
      rosa?
- [ ] **Før/efter-billeder fra Drive** (mappen "Før/efter - Hjemmeside", lagt op af Alberte
      20/10-2026): FILLER har 3 billeder af læber ("FILLOX Lip Enhancement Comparison.png",
      "Billede 28.jpg" og "Billede 28-kopi.jpg"); BOTOX, SUNEKOS, SKINBOOSTER og POLYNUKLEOTIDER
      er tomme. De er ikke lagt på siden endnu: bekræft (1) skriftligt samtykke fra kunden til brug
      på hjemmesiden, (2) at reglerne for markedsføring af kosmetisk behandling tillader billederne,
      og (3) hvilken side de skal på (lip filler-siden). Botox-billeder må ikke bruges i
      markedsføring (receptpligtig medicin).
- [ ] **Billeder**: rigtige før/efter-billeder med samtykke (`content/treatments.ts`), foto +
      alt-tekst pr. klinik (`content/pages/clinics.ts`, og `seoImage`/`geo` i
      `content/clinics.ts`), større original af Om os-billedet og et andet foto af Dr. Tom (se
      "Om os" ovenfor). Nogle stockfotos har en laksefarvet baggrund, der ligger tæt på den
      støvede rosa, I fravalgte (`public/images/hero/hero-1.jpg` på /behandlinger, `results/duo-pink.jpg`
      i anmeldelserne på forsiden, lip filler-heroen): få dem farvekorrigeret mod Lys Rosa
      (ca. −20 % mætning, lidt lysere og køligere baggrund), eller vælg andre billeder ved de rosa
      flader.
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
| `public/__nyhedsbrev-tilmeldt.html` | Videresender til `routes.newsletterThanks` (fx `/nyhetsbrev/takk`); filnavnet er `content/forms.ts` → `newsletterNoJsAction` |
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
  norske forhold.
- **Formularnavne** vises i Netlify og i notifikationsmails — skift dem i `content/forms.ts` og
  `public/__forms.html` samtidig.
- **Priser**: skrives som tal i `content/**`; formatet (`1 499 kr`, `kr 1 499,-`) styres af
  `locale` og `pricePattern` i `config/site.ts`.
- **Gamle URL'er**: `content/redirects.ts` er den danske WordPress-liste — erstat den med
  fillox.no's gamle sitemap, så placeringer og links overlever skiftet.
- **hreflang** mellem fillox.dk og fillox.no er ikke sat op (kræver en tabel over, hvilke
  sider der svarer til hinanden, da stierne er forskellige).
