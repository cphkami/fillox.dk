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
- der står æ, ø eller å i en streng i `app/`, `components/` eller `lib/` (tekst hører til i
  `content/`; udviklerværktøjet i `components/dev/` er undtaget).

Klinikker uden Gecko-kalender-id vises som en note (ikke en fejl), og det samme gør
Trustpilot-tallene i `config/site.ts`, når `trustpilot.checked` er mere end 60 dage gammel.

## Deploy til Netlify

`netlify.toml` bygger med `npm run build` (inkl. `check:market`) og udgiver `.next` med
Netlifys Next.js-runtime. Ingen miljøvariabler at sætte i Netlify: Node-versionen står i
`netlify.toml` (`NODE_VERSION = "22"`; Next 16 kræver Node ≥ 20.9, se `engines` i `package.json`).

`netlify.toml` sætter også sikkerheds-headers på alle svar: HSTS (som det gamle site),
`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy` og en
Content-Security-Policy, der i første omgang kun rapporterer (`Content-Security-Policy-Report-Only`,
se "Efter lancering"). Den tillader kun Gecko (script + kalender-iframe), de betalingssider, Gecko
kan åbne i iframen (Nets Easy, OnPay), og værterne for taggene i GTM-containeren (Google Tag
Manager, Google Analytics, Google Ads, Meta Pixel; de indlæses kun efter samtykke). Lægger I et nyt
tredjepartsscript, en ny iframe eller et nyt tag i containeren på sitet, skal værten med i CSP'en.

1. Forbind repoet i Netlify → build-indstillingerne læses fra `netlify.toml`.
2. Domæne: `fillox.dk` (+ `www`) → Netlify, HTTPS via Let's Encrypt.
3. Gamle WordPress-URL'er sendes videre med 308 (`content/redirects.ts`, via `next.config.ts`).
   WordPress' sitemaps sender videre til `/sitemap.xml` (indekset) og `/legacy-sitemap.xml` (de to
   undersitemaps): `public/legacy-sitemap.xml` lister de 44 gamle adresser, der nu redirecter, så
   Google finder redirects hurtigere.
4. Efter første deploy: indsend `https://fillox.dk/sitemap.xml` **og**
   `https://fillox.dk/legacy-sitemap.xml` i Google Search Console (se "Efter lancering").

## Formularer via Netlify Forms

| Formular | Navn (`content/forms.ts`) | Hvor |
|---|---|---|
| Kontakt | `kontakt` | `/kontakt` |
| Nyhedsbrev | `nyhedsbrev` | footeren på alle sider + `/blog` |
| "Få besked" (Østerbro) | `osterbro-besked` | vises ikke siden 25/11-2026 (Østerbro er åben); fjernes helt, når klinikken har sin adresse (se kommentaren ved `notify` i `content/pages/clinics.ts`) |

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

## Cookiebanner og måling

- Første besøg: et banner nederst på siden ("Accepter alle", "Afvis alle" og "Tilpas" med
  Statistik og Marketing, intet sat til på forhånd). Indtil et ja indlæses **intet** fra Google
  eller Meta: Google Tag Manager (`config/site.ts` → `analytics.gtmId`, GTM-KDBJMVF2) hentes først,
  når Statistik eller Marketing er valgt, efter Google Consent Mode v2 (alt afvist som standard,
  så valget som `update`). "Afvis alle" sletter de gamle `_ga`/`_gcl_*`/`_fbp`-cookies fra
  WordPress-sitet.
- Valget gemmes i browseren (`fillox-consent` i localStorage) i 12 måneder; banneret spørger igen,
  når `consentVersion` i `config/site.ts` ændres. "Cookieindstillinger" i footeren åbner banneret
  igen; trækkes et samtykke tilbage, slettes cookies, og siden genindlæses.
- Tekster og cookielisten (privatlivspolitikken → "13. Cookies") står i `content/consent.ts`.
  **Nyt tag i containeren** (Hotjar, TikTok, Google Ads-remarketing …): samtykkeindstilling på
  tagget i GTM, værterne i CSP'en (`netlify.toml`), en linje i cookielisten og en ny
  `consentVersion`, så alle bliver spurgt igen.
- Indtil containerens Meta Pixel-tags har et samtykketjek (se "Før lancering"), blokerer sitet alle
  Custom HTML-tags uden Marketing (`analytics.blockCustomHtmlWithoutMarketing`).

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
  - [ ] `content/pages/blog.ts` og `content/blog.ts`: de fire nye artikler, bloggens intro og
        nyhedsbrev (se "Blog" nedenfor)
  - [ ] `content/consent.ts`: cookiebanneret og afsnittet "13. Cookies" i privatlivspolitikken
        (nye tekster, se "Cookiebanner og måling" nedenfor)
  - [ ] `content/pages/jobs.ts` og `content/pages/creator.ts`: hele siderne (ikke i designet)
  - [ ] `content/pages/legal.ts`: meta-beskrivelser og "Juridisk"-eyebrow
- [x] **Pris**: Skinbooster står "fra 999 kr" på forsiden i designet, men 1.499 kr alle andre
      steder — vi bruger 1.499 kr (`content/treatments.ts`, bestsellers). Afklaret: live /priser
      (ændret 17/11-2026) starter skinboosters ved Ejal 40 til 1.499 kr (Microneedling, nu 1.200 kr,
      er ikke en skinbooster).
- [ ] **Priser ændret i WordPress efter kopien** (live /priser ændret 17/11-2026; `content/prices.ts`
      er kopieret 1/10-2026). Rettet 24/11-2026 efter live: Opløsning af filler (Hyalase) 899 → 999 kr,
      Microneedling 999 / 2.499 → 1.200 / 3.000 kr (følger med på behandlingssiden, i menuerne, på
      `/ny-hos-fillox` og i Albertes og Kubras priskort). Alle 111 rækker er ellers ens. Åbent:
  - [ ] Aftal et **content-freeze** på priserne i WordPress frem til lanceringen. På
        lanceringsdagen: hent https://fillox.dk/priser/ igen, sammenlign række for række med
        `content/prices.ts`, og ret afvigelser dér.
  - [ ] Live hedder overskriften nu **"Microneedling & Exosomer"**. Skal rækkerne på det nye site
        nævne exosomer? (Vi skriver ikke selv en ny etiket.)
- [ ] **Trustpilot-tallene på lanceringsdagen**: 4,7 og 172 anmeldelser er aflæst 1/10-2026 og står i
      forsidens hero, footer-strimlen og profilernes fakta. Aflæs score og antal på
      https://dk.trustpilot.com/review/fillox.dk, og opdatér `score`, `reviewCount` og `checked` i
      `config/site.ts` samtidig (Trustpilot afviser automatiske opslag, så det skal gøres i en browser).
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
  - [ ] **Blogartikler om Botox** (`/blog/botox-for-foerste-gang`,
        `/blog/hvornaar-giver-det-mening-at-starte-med-botox`,
        `/blog/de-foerste-24-timer-efter-botox`): **sat på pause 25/11-2026** (`published: false` i
        `content/blog.ts`): ingen side (404), ikke på `/blog`, i "Læs også", på behandlingssiderne
        eller i sitemap, og filterknappen "Botox" vises ikke. Teksterne ligger der stadig. Skal de
        skrives om (af bureauet), så de handler om behandlingen og ikke om produktet, eller slettes?
        Kommer de tilbage, signeres de "Fillox-holdet" (ikke Annika: en sundhedsperson, der
        anbefaler et lægemiddel i en reklame, er forbudt, BEK 253/2025 § 10, stk. 1, nr. 7) og får
        en rigtig dato; `check:market` afviser en udgivet artikel med en behandler som forfatter.
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
      (4) ~~Forsidens resultatbillede "rynkebehandling, 2026"~~: løst 24/11-2026 (forsiden har
      ikke længere et rynkekort, se "Fotos fra Drive" nedenfor).
- [ ] **Om os** (`content/pages/about.ts`, bureauets nye tekst): (1) "Og du behøver ikke føle dig
      hjemme i en eksklusiv luksusklinik for at føle dig hjemme hos os." står ordret, men lyder
      oversat — bed bureauet se på den. (2) Dr. Toms titel: den nye tekst siger "grundlægger af
      Fillox" og "den medicinsk ansvarlige læge", hans behandlerkort "Æstetisk læge · Daglig
      leder" og "fagligt ansvarlig læge" (`content/team.ts`). Hvilken skal begge steder bruge?
      (3) ~~Dr. Toms portræt to gange~~ og (4) ~~det lille topbillede~~: løst 24/11-2026 med jeres
      egne fotos (lægeafsnittet viser Dr. Tom i klinikken, toppen gruppebilledet af fire
      behandlere, uden navne). Fillox Academy-afsnittet har stadig intet billede: det har ingen
      plads til et i sit layout, og vi har ikke opfundet et nyt. De to kursusbilleder i Drive kan
      ikke bruges, som de er: sikkerhedsbrillerne bærer fillermærket "croma" lige ved ansigtet.
      Har I et kursusbillede uden mærker, og skal afsnittet have et?
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
- [ ] **Fotos fra Drive (lagt på siden 24/11-2026)**. Du godkendte 24/11-2026, at klinikkens egne
      fotos bruges i stedet for stockfotos ("kunderne har givet samtykke, og klinikken må bruge alt
      sit indhold på sin egen hjemmeside"), og før/efter-billeder på behandlingssiderne. En
      gennemgang af de danske regler samme dag (ikke juridisk rådgivning) sagde: før/efter er tilladt
      for fillers og skinboosters på betingelser, aldrig for Botox (receptpligtig medicin,
      lægemiddellovens § 66). Det er gjort:
  - **Stemningsbilleder** (`public/images/fillox/`, `content/photos.ts`) i stedet for alle
    stockfotos: forsiden (top, de tre behandlingskort, anmeldelserne), `/behandlinger` og alle
    behandlingssider, Om os (gruppebilledet og Dr. Tom i klinikken), Ny hos Fillox?, `/klinikker`
    (behandlingsrummet på alle fire kort og i Googles strukturerede data), `/priser`,
    `/ledige-stillinger` (gruppebilledet), `/content-creator`, bloggen og delingsbillederne
    (`og-*.jpg`: et bredt udsnit af hvert foto, så ansigterne ikke skæres af, når Facebook,
    LinkedIn og X viser et link). Kun Dr. Tom og Mike er navngivet; de andre behandlere,
    gruppebilledet og alle kunder står **uden navn** i alt-tekster og filnavne. Botox-siderne
    (rynkebehandling og andre behandlingsmuligheder), de tre Botox-indlæg og Ny hos Fillox? viser
    kun billeder uden produkt, sprøjte og behandling (vinduesbilledet, spejlet, behandlingsrummet,
    et portræt af en smilende behandler). Ikke brugt: billedet med Profhilo-æsken (reklame for
    medicinsk udstyr med en behandlers anbefaling, BEK 715/2022 § 6), de tre enkeltbilleder af
    kunder lige efter en læbebehandling (de læses som resultater, og et af dem viser et fillermærke
    på spejlet), begge kursusbilleder (fillermærket "croma" på sikkerhedsbrillerne) og billedet
    382DC544 (en behandler giver en kunde en indsprøjtning ved øjenbrynet — det læses som en
    Botox-behandling, uanset hvor det står; det stod først på rynkesiden som "konsultation" og er
    fjernet 25/11-2026). Alt-tekster er markeret `TODO: copy review`.
  - [ ] **Juridisk tjek af selve billederne**: gennemgangen 24/11-2026 godkendte billederne til
    Botox-siderne ud fra en beskrivelse af dem, og én beskrivelse var forkert (382DC544 ovenfor).
    Lad den, der tjekker, se på billederne på rynkesiden, de tre Botox-indlæg og Ny hos Fillox?
    (vinduesbilledet, portrættet, spejlet og behandlingsrummet).
  - [ ] **Hvem er på billederne?** Behandlerne på stemningsbillederne står uden navn, men to
    behandlingssider viser en unavngiven behandler i toppen lige over en navngiven behandler
    ("Maria" på lip filler, "Alberte" på hudsiderne). Læsere kan tro, det er samme person. Sig
    gerne, hvem der er på hvilke billeder (så kan de stå på deres egne sider), ellers bruger vi
    billeder uden personer dér.
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
- [ ] **Billeder**: der er **ingen stockfotos** tilbage på siden (de ni filer i
      `public/images/hero/` og `public/images/results/` er slettet; logovæggen "Fillox-Behandling-3"
      findes stadig i `design-reference/uploads/`). Mangler stadig: et foto + alt-tekst pr. klinik
      (`content/pages/clinics.ts` → `card.photos`, og `seoImage`/`geo` i `content/clinics.ts`; nu viser
      alle fire kort samme behandlingsrum), og gerne større originaler af jeres fotos (se
      "Opløsning" ovenfor).
- [ ] **Netlify Forms**: formularerne ses under Forms efter første deploy; slå notifikationer til.
- [ ] **Blog** (du, 25/11-2026: "lave bloggen. skriv et par artikler", signeret "Fillox-holdet"):
      fire nye artikler, dateret 25/11-2026 — "Lip filler for første gang", "0,5 eller 1 ml?",
      "Hævelse og blå mærker" og "Skinbooster eller Profhilo". Alle fakta (priser, mængder, forløb,
      vagttelefon) kommer fra sitets eget indhold eller fra fillox.dk; kilden står ved hver blok i
      `content/blog.ts`. Artiklerne har ingen navngiven forfatter og intet portræt (Fillox-mærket i
      stedet; de strukturerede data nævner Fillox som forfatter).
  - [ ] **Fagligt tjek af en læge** før lancering: alle blokke markeret `TODO: fagligt tjek
        (læge)` (bl.a. hævelse, blå mærker og hvornår man skal ringe).
  - [ ] Copy review af artiklerne, link-teksterne under dem og bloggens intro ("Ærlige svar om
        behandlinger, forløb og efterpleje fra Fillox-holdet").
  - [ ] Bloggens overskrift er stadig designets **"Viden fra vores behandlere"**, mens artiklerne
        er signeret "Fillox-holdet". Behold den?
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
       ingen cookies; de GA4-events, de udløser, styres af GA4's indbyggede samtykketjek).
    3. Udløseren for tag 19, "Page Path indeholder `/booking/`": det nye site har ingen skråstreg
       til sidst. Ret til "Page Path er lig med `/booking`".
    4. Tag 26 (`form_submit` på "Page Path indeholder `/kontakt/`"): eventet kom fra WordPress'
       formular-plugin, og det nye site sender det ikke. Sæt tagget på pause (eller se spørgsmålet
       om kontaktformularen nedenfor) og ret stien til "er lig med `/kontakt`".
    5. Tag 6 (`indsend_knap`, Click Text "Indsend") og tag 10 (`booking_forside`, Click Text
       "BOOKING"): knapperne hedder nu "Send besked" og "Book tid". Ret udløserne.
    6. Læg **ikke** en Consent Mode-standard eller en CMP-skabelon ind i GTM: sitet sætter selv
       standarden (alt afvist) og opdateringen, før containeren indlæses. Slå "Aktivér
       samtykkeoversigt" til under Containerindstillinger for at se hvert tags samtykke.
    7. Test i Tag Assistant på Netlify-preview'et: "Afvis alle" → GTM indlæses ikke; kun
       Statistik → GA4 udløses, tag 37/38 ikke; "Accepter alle" → alle tags. Udgiv containeren.
    8. Derefter: sæt `analytics.blockCustomHtmlWithoutMarketing` til `false` i `config/site.ts`
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
  - [ ] **Kontaktformularen** måles ikke i GA4 på det nye site (se punkt 4). Skal sitet sende et
        event til GTM, når en besked er sendt? (En lille kodeændring.)
- [ ] **Østerbro** (du, 25/11-2026: "østerbro er åbent"): adressen findes ikke på fillox.dk, i
      Drive eller på Geckos offentlige side (Gecko kender behandlingsstedet "Fillox - Østerbro",
      id 14667, uden adresse). Indtil da står Østerbro som "Ny klinik" med "Fillox Østerbro er vores
      nyeste klinik. Adresse og åbningstider kommer her snart." (`content/clinics.ts`,
      `content/pages/clinics.ts`), uden adresse, tider, bookingknap, kortlink og strukturerede data,
      og "Få besked, når Østerbro åbner" er fjernet. **Send**: gadeadresse og postnummer,
      åbningstider, Google Maps-link (klinikkens sted) og Østerbros Gecko-kalender-id. Så sættes
      `status: "open"` (fremgangsmåden står i kommentaren i `content/clinics.ts`).
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
- [ ] **Kontrol efter behandling**: det nye site siger "Konsultation og kontrol er altid gratis".
      Live-politikken (fillox.dk/om-os/kontrol-eftertjek, som nu sender videre til
      `/priser#konsultation`) siger også: én kontrol pr. behandling, du booker den selv ca. 14 dage
      efter, og retten bortfalder efter 21 dage. Skal de betingelser stå på det nye site (fx på
      `/handelsbetingelser`)?
- [ ] **Sundhed+**: live /finansiering tilbyder finansiering via Sundhed+ (Sundhed+ Kredit). Det nye
      `/priser#finansiering` siger kun "Spørg i klinikken eller ved booking" (`content/prices.ts` →
      `financing`). Skal Sundhed+ nævnes eller linkes?
- [ ] **Premium medlemskab**: live /medlem (500 kr/md., 6.000 kr til behandlinger om året, 20 %
      rabat) findes ikke på det nye site, og /medlem sender videre til `/priser`. Tilbydes
      medlemskabet stadig? (Handelsbetingelserne nævner stadig abonnement.)
- [ ] **"Kun læger & sygeplejersker"** (trust-chippen på `/priser`) og "udført af læger og
      sygeplejersker" (sitets titel og beskrivelse, `content/layout.ts`, forsiden): gælder det også
      laser hårfjerning og Alberte (se næste punkt)? Ellers skal formuleringen ændres (af jer eller
      bureauet).
- [ ] **Alberte** (`content/team.ts`): titel, uddannelse og klinikker er ikke bekræftet (live giver
      hende ingen titel). Hendes priskort viser bl.a. Skinbooster og PRF (injektioner). Bekræft, hvad
      hun er uddannet som, og hvad hun udfører.
- [x] **"10.000+ behandlinger"** i forsidens hero (`content/pages/home.ts` → `stats`): bekræftet
      25/11-2026 ("10.000+ behandlinger er det vi har lavet indtil videre").
- [ ] **Instagram**: sitet linker til instagram.com/fillox_dk (`config/site.ts`), Amager Centrets side
      til instagram.com/fillox.dk. Hvilken konto er klinikkens?
- [x] `npm run build` er grønt, og de gamle URL'er redirecter: tjekket 24/11-2026 (produktionsbuild,
      `check:market` ok). Alle 45 adresser i WordPress' sitemap og de 24 menulinks på det live site,
      med og uden skråstreg til sidst og med store bogstaver, giver 200 eller ét 308-hop til en side
      med 200; alle `#ankre` findes; 0 brudte interne links.

## Efter lancering

- [ ] **Første Netlify-deploy (preview)**: alt ovenfor er målt på `next start`. På Netlify kører
      billeder gennem Netlify Image CDN og HTML/JS gennem Netlifys edge, så tjek på preview-URL'en:
      Lighthouse mobil + desktop på de vigtigste sider; at `/_next/image` svarer med `image/avif`
      eller `image/webp` (med `Accept: image/avif,image/webp`) og lang cache; at HTML og JS er
      brotli-komprimeret; at headers fra `netlify.toml` er med (`curl -I`); ingen konsolfejl eller
      404'er.
- [ ] **CSP**: i lanceringsugen er den kun rapporterende. Lav en hel testbooking i Gecko, inkl.
      betalingstrinnet, i Safari, Chrome og Firefox, og tjek, at konsollen ikke viser CSP-brud. Gør
      det også efter "Accepter alle" (GTM, GA4, Google Ads og Meta Pixel indlæst). Omdøb
      så `Content-Security-Policy-Report-Only` til `Content-Security-Policy` i `netlify.toml`.
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
| `netlify.toml` | CSP'en nævner Geckos værter: til TIMMA `frame-src https://bestill.timma.no` og ingen Gecko-script-vært |
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
- **Før/efter-billeder** er forbudt i markedsføring af kosmetiske indgreb i Norge: slet
  `public/images/resultater/` og `results` / `resultsTitle` / `resultsIntro` i `content/treatments.ts`
  (Kæbelinje), og brug kun billeder, I har lov til at bruge dér (`content/photos.ts`, med
  `share`-udsnittene til delingsbilleder). Lægens foto på Om os (`content/pages/about.ts` →
  `doctor.image`) kan udelades: så viser afsnittet hans portræt fra behandlerkortet.
- **Gamle URL'er**: `content/redirects.ts` er den danske WordPress-liste — erstat den med
  fillox.no's gamle sitemap, så placeringer og links overlever skiftet.
- **hreflang** mellem fillox.dk og fillox.no er ikke sat op (kræver en tabel over, hvilke
  sider der svarer til hinanden, da stierne er forskellige).
