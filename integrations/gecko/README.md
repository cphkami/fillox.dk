# Fillox-tema til Gecko Booking

`fillox-booking-theme.css` er et CSS-tema, der får den online booking på
[fillox.dk/booking](https://fillox.dk/booking) til at ligne resten af fillox.dk: Poppins,
plum/creme/sand-farverne, pille-knapper, afrundede kort, klinikker og tider som "chips" og
tydelige valgte tilstande.

Bookingen kører hos Gecko (i en iframe fra `filloxdanmark.app4.geckobooking.dk`), så
hjemmesidens egen CSS kan ikke nå ind i den. Temaet skal derfor lægges ind **i Gecko**. Det
gør du selv i Gecko-admin; der skal ikke ændres noget på hjemmesiden.

Se hvordan det ser ud i mappen [`preview/`](preview/) (skærmbilleder af den rigtige booking
med temaet: desktop, mobil og i den bredde, bookingen har inde på fillox.dk på en telefon).

## Sådan sætter du det ind

1. Log ind i Gecko-admin.
2. Gå til **Indstillinger → Tekster og skabeloner** og vælg fanen **"Generelle skabeloner"**.
3. Find teksten **"Booking - Alle sider - Header"** og tryk **Rediger**.
4. Skift editoren til **"Kilde"**-visning (kildekode). Det er vigtigt: i den almindelige
   visning bliver koden til tekst.
5. **Kopiér det, der allerede står der**, og gem det et sikkert sted (fx i en note). Så kan du
   altid gå tilbage. Står der fx Google Tag Manager-kode, skal den **blive stående**.
6. Sæt markøren i bunden, efter det eksisterende indhold, og indsæt:

   ```html
   <style>
   ...hele indholdet af fillox-booking-theme.css...
   </style>
   ```

   Altså: skriv `<style>`, indsæt hele filen præcis som den er (første linje er en kommentar,
   anden linje starter med `@import` og skal blive stående øverst), og afslut med `</style>`.
7. Gem/opdatér, mens du stadig er i "Kilde"-visning.

Temaet gælder med det samme for alle bookingsider (klinikker, ydelser, kalender, formularer,
log ind, venteliste).

## Sådan tester du

Åbn [fillox.dk/booking](https://fillox.dk/booking) på computer og mobil (genindlæs siden, evt.
med Cmd/Ctrl + Shift + R) og gå igennem:

- [ ] Menuen øverst (Book ny tid / Log ind / ...) og trin 1–4
- [ ] Vælg klinik (chips) og åbn/luk nogle ydelsesgrupper. Radioknapperne (de runde
      cirkler ved klinikker og ydelser) er 24 px og får en plum prik, når de er valgt
- [ ] Tryk på **i**'et ved en ydelse: beskrivelsen i vinduet skal stå med samme skrift
      (Poppins) som resten (se "Ydelsesbeskrivelser" nedenfor)
- [ ] Vælg en ydelse, se "Du har valgt", tryk **Videre**
- [ ] Ugevisning (på mobil vises dagene under hinanden), gå en uge frem med **7 Dage frem**,
      og Månedsvisning; klik på en dato
- [ ] En ydelse med tillægsydelser (fx Botox 2. områder): siden "Vælg evt. tillægsydelser"
- [ ] **Log ind**-siden, **Glemt kode?** og **Ny kunde?** (formularen "Bestil en kode")
- [ ] **Tilmeld venteliste → Opret**: tryk i felterne **Mellem d.** og **og d.**, så
      kalenderen (datovælgeren) åbner
- [ ] Tastatur: tryk Tab gennem en formular. Knapper, felter og afkrydsningsfelter (fx
      betingelser og nyhedsbrev) skal få en plum ramme, når de har fokus
- [ ] **På en telefon inde på fillox.dk/booking**, ikke kun via det direkte link. Inde på
      hjemmesiden er bookingen kun ca. 350 px bred (ca. 280 px på en lille telefon). Tjek især
      ugevisningen på en uge efter den første (knapperne "7 Dage tilbage" og "7 Dage frem")
      og "Vælg en tid"-siden (alle tider, også i højre kolonne, skal kunne ses helt)
- [ ] **Detaljer-trinnet** (formularen efter man har valgt en tid). Det trin kunne ikke
      testes, da vi ikke må vælge en tid i den rigtige kalender. Temaet styler felter,
      afkrydsningsfelter, knapper og fejlbeskeder ud fra de samme Gecko-felter som i
      venteliste-formularen, men tjek det selv: vælg en tid, se formularen og tryk
      **Tilbage** uden at bekræfte. (At vælge en tid kan holde tiden et øjeblik, så gør det på
      en tid langt ude i kalenderen.) Tjek også felter, som kun findes dér: et felt med en
      knap ved siden af (fx rabatkode), antal-vælgeren (− 1 +), radioknapper (hvis formularen
      har et valg mellem flere muligheder) og betaling. De tre første er stylet ud fra Geckos
      kode, men kunne ikke ses i den rigtige booking. Radioknapperne skal være lige så store
      som ved ydelserne, og man skal kunne vælge en mulighed ved at trykke hvor som helst på
      linjen. Tjek også kvitteringssiden (trin 4 "Færdig") næste gang der kommer en rigtig
      booking.
- [ ] Siderne for en kunde, der er logget ind (**Dine oplysninger**, **Dine reservationer**),
      og en bekræftelsesboks med knapperne **Annuller** og **Accepter**, som Gecko fx kan vise,
      når en reservation annulleres

Direkte link til bookingen (uden hjemmesiden rundt om):
<https://filloxdanmark.app4.geckobooking.dk/site/index.php?id=8796&icCode=8e00766ca8cc633be72131fc48608e4bb8796>

## Sådan fortryder du

Gå samme vej ind (**Indstillinger → Tekster og skabeloner → Generelle skabeloner → Booking -
Alle sider - Header → Kilde**), slet alt fra `<style>` til og med `</style>` (eller sæt det
indhold ind, du gemte i trin 5) og gem. Bookingen ser ud som før med det samme.

## Godt at vide (det kan CSS ikke ændre)

- **Tekster** redigeres i Gecko under **Indstillinger → Tekster og skabeloner → Booking
  tekster** (fx "Book en ny tid", "Vælg en dato", "Tilmeld venteliste", fejlbeskeder).
  Bemærk: "Vælg en tid"-siden siger *"Du kan nu vælge en af nedenstående grønne perioder"*.
  Med temaet er de ledige tider ikke grønne længere, så ret gerne teksten til fx "Vælg en af
  de ledige tider nedenfor".
- **Farver og skrift under "Ret småtekster mv."** i Gecko bliver overstyret af temaet. Lad dem
  stå som de er. Ændrer du dem, kan enkelte dele skifte farve igen.
- **Farver pr. ydelse** sættes på hver ydelse i Gecko og kan ikke ændres med CSS. Bookingen
  viser ikke de farver; alle ydelser vises i Fillox-farverne.
- **Kalenderfarver**: ledig tid = hvid chip, venteliste = lyserød chip, optaget/lukket = gennemstreget.
  I datovælgeren på ventelisten har dagen i dag en plum ring, og den valgte dag er plum.
- **Ydelsesbeskrivelser** (i'et ved en ydelse): Geckos teksteditor har gemt beskrivelserne med
  skriften Times New Roman og sort tekst. Temaet overstyrer skriften, så de vises i Poppins.
  Det er alligevel en god idé at fjerne formateringen i beskrivelserne i Gecko (marker teksten og
  brug editorens knap til at fjerne formatering), så de også ser rigtige ud uden temaet.
- **Sidetitler** som "Log ind - Fillox", "Tilmelding til ventelisten" og "Bestil en kode" er
  Gecko-tekster med fed skrift. Temaet viser dem som overskrifter. Retter du teksterne, så lad
  titlen stå som sin egen fede linje øverst.
- **Rækkefølge, grupper, priser, varighed og billeder** af behandlere styres i Gecko
  (Ydelser/Kalendere). Billederne vises runde.
- **"Log ind med Google/Facebook/MitID"-knapperne** beholder deres egne farver (MitID har
  faste regler for knappen). **"Powered by Gecko"** og sprogvælgeren (flaget) er Geckos og
  bliver stående.
- **Tastatur**: Gecko laver ydelsesrækker og tider på "Vælg en tid"-siden som klikbare felter,
  ikke som knapper, så de kan ikke nås med Tab-tasten. Det kan CSS ikke rette. Alt, der kan nås
  med Tab (knapper, links, felter, afkrydsningsfelter og radioknapper), får med temaet en synlig
  plum fokusramme. Den fjerner Gecko ellers.
- **Skriften Poppins** hentes fra Google Fonts (linjen med `@import` øverst). Det betyder, at
  besøgendes browser kontakter Google (IP-adresse) på bookingsiderne. Hjemmesiden selv henter
  ikke skrifter fra Google. Vil I undgå det, kan `@import`-linjen slettes; så bruges
  Helvetica/Arial i bookingen. Alt andet i temaet virker stadig.
- **Længde**: filen er ca. 59 KB, fordi den er kommenteret. Tjek efter indsættelsen, at
  slutningen kom med (sidste afsnit hedder "12. Motion" og slutter med `}` før `</style>`).
  Skærer Gecko teksten af, så kontakt udvikleren for en kortere version.
- **Gecko-opdateringer**: temaet bygger på Geckos klassenavne, som de så ud i oktober 2026.
  Ser noget forkert ud efter en opdatering hos Gecko, så slet style-blokken (se "Sådan
  fortryder du") og kontakt udvikleren.
- **Bevægelse**: temaet bruger kun korte farveovergange, og ingen hvis den besøgende har slået
  "reducér bevægelse" til på sin enhed.

## Hjemmesiden

På fillox.dk ligger bookingen i det hvide kort under "Book tid"-feltet
(`app/booking/page.tsx`, `components/booking/`). Temaet lader Geckos baggrund være
gennemsigtig, så kortet er baggrunden, og der skal ikke ændres noget på hjemmesiden.
Åbnes bookingen direkte (fx fra et link i en bekræftelsesmail), vises den på hvid baggrund.

## Filer

| Fil | Indhold |
|---|---|
| `fillox-booking-theme.css` | Temaet, der indsættes i Gecko. Kommentarerne i filen forklarer hver sektion. |
| `preview/` | Skærmbilleder af den rigtige booking med temaet: desktop 1280 px (vist i 75 %), mobil 390 px, 350 og 280 px (så bred er bookingen inde på fillox.dk på en telefon på 390 og 320 px) og fillox.dk/booking. `11-...-simuleret` viser antal-vælgeren (Geckos egen kode, som normalt er skjult) og et rabatkodefelt bygget efter Geckos mønster, uden for den rigtige formular. |
