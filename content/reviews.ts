import type { CustomerReview, ReviewSets } from "./types";

/**
 * Customer reviews shown on the site (home testimonial, practitioner profiles, treatment
 * pages), rotated by components/ui/ReviewRotator.
 *
 * LEGAL: only real reviews, quoted VERBATIM. Every entry below is copied byte for byte from
 * Fillox's Trustpilot profile (https://dk.trustpilot.com/review/fillox.dk, Trustpilot's own
 * page data, checked 2026-10-01): text, reviewer name as displayed, rating, publish date
 * (Danish time, as Trustpilot shows it) and the review's own URL.
 * - Never edit `text`, `author`, `date` or `rating`, and never write a review.
 * - `short` is the only shortened form: whole sentences of `text`, word for word, with "…"
 *   where text is left out. `npm run check:market` fails when an excerpt is not in its text.
 * - The aggregate (TrustScore, number of reviews) lives in config/site.ts → trustpilot.
 *
 * Selection (all 5 stars, in Danish). Left out on purpose:
 * - reviews that name "Botox": Botox is a prescription medicine, and testimonials about it
 *   count as advertising it to the public (needs a legal check before any use);
 * - reviews that name practitioners who are no longer on the team (content/team.ts);
 * - reviews about Fillox Oslo, anonymous reviewers ("Consumer"), reviews that give a
 *   practitioner a title they do not have, and reviews in other languages.
 *
 * Adding a review: copy it from its Trustpilot page into `reviews` (newest first), then add
 * its id to the sets where it belongs. A practitioner set only takes reviews that name that
 * person; a treatment set only reviews about that treatment; `general` only reviews that name
 * neither and fit every page (they fill up short sets: nothing about needles, anaesthesia or
 * a practitioner's title, which a laser page or a doctor's profile would contradict).
 * Treatment pages in `treatmentsWithoutReviews` show no reviews at all.
 */
export const reviews: CustomerReview[] = [
  {
    id: "tp-6ab3d4c6cbb51ac47cd214dc",
    author: "Patricia Christensen",
    date: "2026-09-23",
    rating: 5,
    source: "Trustpilot",
    url: "https://dk.trustpilot.com/reviews/6ab3d4c6cbb51ac47cd214dc",
    text: "God service, effektiv behandling og super vejledning. ",
  },
  {
    id: "tp-6ab3d188b09e9f629f95ce8a",
    author: "Sarah Louise Kristiansen",
    date: "2026-09-23",
    rating: 5,
    source: "Trustpilot",
    url: "https://dk.trustpilot.com/reviews/6ab3d188b09e9f629f95ce8a",
    text: "Jeg følte mig tryg og godt behandlet hele vejen igennem. Medarbejderen var sød, professionel og lyttede til mine ønsker.\n\nMine læber er blevet så fine og naturlige, præcis som jeg håbede på. Jeg er meget tilfreds og kan varmt anbefale stedet! ❤️",
    short: "Jeg følte mig tryg og godt behandlet hele vejen igennem. … Mine læber er blevet så fine og naturlige, præcis som jeg håbede på. …",
    treatments: ["lip-filler"],
  },
  {
    id: "tp-6a917e1429e5ba05aececf31",
    author: "Amy Schuurhof",
    date: "2026-08-28",
    rating: 5,
    source: "Trustpilot",
    url: "https://dk.trustpilot.com/reviews/6a917e1429e5ba05aececf31",
    text: "Rigtig sød og tryg behandler🙂\n\nJeg følte mig i trygge hænder ",
  },
  {
    id: "tp-6a905a1f962ba5e1b6960539",
    author: "Nanna Brøndum",
    date: "2026-08-27",
    rating: 5,
    source: "Trustpilot",
    url: "https://dk.trustpilot.com/reviews/6a905a1f962ba5e1b6960539",
    text: "Jeg har været meget glad for det resultat Mike har lavet på mig og et behageligt sted at komme hos. Helt sikkert min faste klinik. ",
    practitioners: ["mike"],
  },
  {
    id: "tp-6a79f4bd5b4547d806c4cd3f",
    author: "Tanja Andersen",
    date: "2026-08-10",
    rating: 5,
    source: "Trustpilot",
    url: "https://dk.trustpilot.com/reviews/6a79f4bd5b4547d806c4cd3f",
    text: "Fantastisk resultat af Filler i læber. Mike er så dygtig og utrolig venlig. Kan anbefale ham på det højeste. ❤️🙏🏻",
    practitioners: ["mike"],
    treatments: ["lip-filler"],
  },
  {
    id: "tp-6a4f6e6ba97faedcc6075304",
    author: "Sarah",
    date: "2026-07-09",
    rating: 5,
    source: "Trustpilot",
    url: "https://dk.trustpilot.com/reviews/6a4f6e6ba97faedcc6075304",
    text: "Mike er meget rolig, og sørger for at du er godt tilpas samt klædt på i processen. Der er min anden gang jeg er her, og kan kun sige at det er super resultater, med god kvalitet. Kæmpe anbefaling herfra!",
    short: "Mike er meget rolig, og sørger for at du er godt tilpas samt klædt på i processen. … Kæmpe anbefaling herfra!",
    practitioners: ["mike"],
  },
  {
    id: "tp-6a08c976e9e5eac66014b19b",
    author: "AA",
    date: "2026-05-16",
    rating: 5,
    source: "Trustpilot",
    url: "https://dk.trustpilot.com/reviews/6a08c976e9e5eac66014b19b",
    text: "Virkelig imødekommende personale, der vægter højt at sikre en behandling der passer til en. Kæmpe anbefaling herfra!",
  },
  {
    id: "tp-69fdde069fc37839f18be885",
    author: "Emma",
    date: "2026-05-08",
    rating: 5,
    source: "Trustpilot",
    url: "https://dk.trustpilot.com/reviews/69fdde069fc37839f18be885",
    text: "Jeg føler mig altid tryg hos klinikken. Jeg har kun haft Annika, og hun lytter virkelig til mine ønsker og kommer med gode anbefalinger. Jeg ville aldrig få lavet mine læber andre steder – Fillox er mit go-to! Jeg har nu været der for 3 gang på ca halvandet år og få mine læber lavet igen, hvilket også bare siger en del om holdbarheden! ",
    short: "Jeg føler mig altid tryg hos klinikken. Jeg har kun haft Annika, og hun lytter virkelig til mine ønsker og kommer med gode anbefalinger. …",
    practitioners: ["annika"],
    treatments: ["lip-filler"],
  },
  {
    id: "tp-69f8db8a87db75a4d3e20419",
    author: "Maria",
    date: "2026-05-04",
    rating: 5,
    source: "Trustpilot",
    url: "https://dk.trustpilot.com/reviews/69f8db8a87db75a4d3e20419",
    text: "Jeg har fået lavet filler hos fillox, udført af Mike. Han er utrolig dygtig og rolig og det gør oplevelsen tryg og behagelig hele vejen igennem.\nMike er utrolig grundig og dygtig til sit arbejde og man kan mærke at han virkelig brænder for sit håndværk. \nJeg har fået at vide af en anden klinik, at mine læber ikke kunne laves, men må sige at her har Mike virkelig bevist det modsatte, med et så flot resultat. \nKæmpe anbefaling herfra👄\n",
    short: "Jeg har fået lavet filler hos fillox, udført af Mike. Han er utrolig dygtig og rolig og det gør oplevelsen tryg og behagelig hele vejen igennem. …",
    practitioners: ["mike"],
    treatments: ["lip-filler"],
  },
  {
    id: "tp-69eccd907b18c45698f3d2a5",
    author: "K.H",
    date: "2026-04-25",
    rating: 5,
    source: "Trustpilot",
    url: "https://dk.trustpilot.com/reviews/69eccd907b18c45698f3d2a5",
    text: "Jeg kan uden tvivl sige, at jeg har fundet min behandler. Jeg kommer kun til at gå hos Mike, og han får mine varmeste anbefalinger.\nDet var min første gang, jeg fik lavet en behandling, og jeg var ærligt talt ret nervøs. Jeg havde været til konsultationer flere andre steder, men endte med at trække mig, fordi jeg følte, at fokus hurtigt blev på alt det, der “kunne fikses”. Det gav mig en fornemmelse af, at det mere handlede om salg end om mig.\nJeg er godt klar over, at det er hverdag for dem – men for mig er det mit ansigt, og det er ikke noget, jeg tager let på. Derfor betød det enormt meget at blive mødt med forståelse og respekt for, at det her var noget, jeg havde tænkt grundigt over.\nI stedet for bare at få et hurtigt “det kan vi sagtens ordne”, blev jeg mødt i den sårbarhed, der ligger i at sætte ord på sine usikkerheder. Jeg følte ikke, at jeg skulle “fikses” – men derimod hjælpes til at se helheden og føle mig godt tilpas i mig selv.\nJeg har fået lavet mine læber, og resultatet er så naturligt og smukt, at jeg selv kan se en stor forskel, men ingen omkring mig lagde mærke til det uden at jeg sagde det. Til gengæld har jeg fået flere kommentarer om, at jeg ser gladere ud – og det er jeg også.",
    short: "Jeg kan uden tvivl sige, at jeg har fundet min behandler. Jeg kommer kun til at gå hos Mike, og han får mine varmeste anbefalinger. …",
    practitioners: ["mike"],
    treatments: ["lip-filler"],
  },
  {
    id: "tp-69764555ccd134a8d29b0a76",
    author: "Lærke",
    date: "2026-01-25",
    rating: 5,
    source: "Trustpilot",
    url: "https://dk.trustpilot.com/reviews/69764555ccd134a8d29b0a76",
    text: "Igen super pænt resultat på mine læber. Annika gør altid så man går derfra med et smil og er meget tilfreds. Hun er god til at vejlede om mængden hvad der passer til dine læber. ",
    short: "Igen super pænt resultat på mine læber. Annika gør altid så man går derfra med et smil og er meget tilfreds. …",
    practitioners: ["annika"],
    treatments: ["lip-filler"],
  },
  {
    id: "tp-6929d3d640ddbc87d17af0c9",
    author: "Jakob hansen",
    date: "2025-11-28",
    rating: 5,
    source: "Trustpilot",
    url: "https://dk.trustpilot.com/reviews/6929d3d640ddbc87d17af0c9",
    text: "Havde en fantastisk oplevelse hos Alberte, super god behandling og super sødt personale ",
    practitioners: ["alberte"],
  },
  {
    id: "tp-69026ece954bc499fc3ddb68",
    author: "Qlr",
    date: "2025-10-29",
    rating: 5,
    source: "Trustpilot",
    url: "https://dk.trustpilot.com/reviews/69026ece954bc499fc3ddb68",
    text: "Jeg har fået lavet læber hos Alberte, og har ikke kunne være mere tilfreds med resultatet. \nHun er både dygtig og professionel, hvilket har gjort at jeg har følt mig tryg og godt tilpas. \nAlberte tog sig tid til at lytte til mine ønsker og bekymringer, og hendes forklaringer om behandlingenprocessen var klare og informative, hvilket gav mig en dybere forståelse for hvad jeg kunne forvente. \nVarm anbefaling herfra, hun er givet mig præcis hvad jeg ønskede <33",
    short: "Jeg har fået lavet læber hos Alberte, og har ikke kunne være mere tilfreds med resultatet. …",
    practitioners: ["alberte"],
    treatments: ["lip-filler"],
  },
  {
    id: "tp-6900b13912cbf5de71d3d8da",
    author: "Sara Palani",
    date: "2025-10-28",
    rating: 5,
    source: "Trustpilot",
    url: "https://dk.trustpilot.com/reviews/6900b13912cbf5de71d3d8da",
    text: "Jeg kan varmt anbefale Mike! Han er utrolig professionel, nærværende og passioneret omkring sit arbejde.\nAllerede fra første session følte jeg mig tryg, set og i virkelig gode hænder. Han tager sig tid til at lytte, forklarer tingene grundigt og skræddersyr en plan, der passer præcis til ens behov. Derudover er han mega tålmodig ift man pludselig vil noget andet.\n\nMan kan tydeligt mærke, hvor meget han brænder for at hjælpe sine klienter – og det gør hele oplevelsen både behagelig og motiverende. Jeg går altid derfra med en følelse af ro og tillid 🙏🏽❤️\n\nTak for alt dit smukke arbejde, Mike – du gør en stor forskel!",
    short: "Jeg kan varmt anbefale Mike! Han er utrolig professionel, nærværende og passioneret omkring sit arbejde. …",
    practitioners: ["mike"],
  },
  {
    id: "tp-68f39a0d08d74344dec57867",
    author: "Nour",
    date: "2025-10-18",
    rating: 5,
    source: "Trustpilot",
    url: "https://dk.trustpilot.com/reviews/68f39a0d08d74344dec57867",
    text: "Jeg kan varmt anbefale Alberte! Hun er utrolig dygtig, professionel og har et fantastisk øje for detaljer. Fra første konsultation følte jeg mig tryg og godt informeret – hun tog sig god tid til at forklare alt, svare på mine spørgsmål og sikre, at vi fandt den helt rigtige løsning til mig.\nHun har bare øje for, hvad der ser naturligt og flot ud – og man kan mærke, at hun virkelig brænder for det, hun laver! \nKæmpe anbefaling! ",
    short: "Jeg kan varmt anbefale Alberte! Hun er utrolig dygtig, professionel og har et fantastisk øje for detaljer. …",
    practitioners: ["alberte"],
  },
  {
    id: "tp-68b300a60f8f26457300c274",
    author: "Maysara Salah",
    date: "2025-08-30",
    rating: 5,
    source: "Trustpilot",
    url: "https://dk.trustpilot.com/reviews/68b300a60f8f26457300c274",
    text: "Super god og professionel oplevelse. Anderledes end hvad jeg var vant til. Super flotte resultater også!",
  },
  {
    id: "tp-6898418be73fd2011079f98e",
    author: "Jh",
    date: "2025-08-10",
    rating: 5,
    source: "Trustpilot",
    url: "https://dk.trustpilot.com/reviews/6898418be73fd2011079f98e",
    text: "Jeg har nu været hos Alberte 3 gange og hver gang har simpelthen været så god. Jeg har aldrig prøvet hverken filler eller microneedeling før og var lidt nervøs, men Alberte har været så god til at sætte mig ind i det og tålmodig med at svare på alle mine mange spørgsmål. Derudover er hun en meget sød og tålmodig pige og tager hensyn til, hvis man er nervøs og hun går super meget op i selv de mindste detaljer så man får det flotteste resultat. Jeg kan kun varmt anbefale Alberte og har kun gode ting at sige om hende! Jeg har fundet min forever klinik😍",
    short: "Jeg har nu været hos Alberte 3 gange og hver gang har simpelthen været så god. … Jeg kan kun varmt anbefale Alberte og har kun gode ting at sige om hende! …",
    practitioners: ["alberte"],
    treatments: ["microneedling"],
  },
  {
    id: "tp-68885ff8e481b225331552cb",
    author: "Lisette Nielsen",
    date: "2025-07-29",
    rating: 5,
    source: "Trustpilot",
    url: "https://dk.trustpilot.com/reviews/68885ff8e481b225331552cb",
    text: "Jeg har verdens bedste oplevelse hos min behandler Alberte som hjalp mig med at få et perfekt resultat af mine læber.\nMan føler sig altid tryg og i gode hænder når man er hos Alberte som altid er sød og smilende. Hun er virkelig dygtig til at hjælpe en med at finde den rette behandling så man får sit ønskede resultat. Man føler sig ikke kun som patient hos hende, da hun gør lidt ekstra for at man føler sig speciel og det\nJeg kan klart anbefale at få lavet en hvilken som helst behandling hos Alberte",
    short: "Jeg har verdens bedste oplevelse hos min behandler Alberte som hjalp mig med at få et perfekt resultat af mine læber. …",
    practitioners: ["alberte"],
    treatments: ["lip-filler"],
  },
  {
    id: "tp-6887906b6563f6dce40919b7",
    author: "Jessica",
    date: "2025-07-28",
    rating: 5,
    source: "Trustpilot",
    url: "https://dk.trustpilot.com/reviews/6887906b6563f6dce40919b7",
    text: "Fik lavet læber hos Alberte i Amager Centret, og jeg er SÅ tilfreds! Hun er mega dygtig og virkelig omhyggelig, man kan mærke, at hun går op i sit arbejde. Resultatet blev super naturligt og præcis som jeg ønskede. Klart en anbefaling herfra!",
    short: "Fik lavet læber hos Alberte i Amager Centret, og jeg er SÅ tilfreds! … Resultatet blev super naturligt og præcis som jeg ønskede. …",
    practitioners: ["alberte"],
    treatments: ["lip-filler"],
  },
  {
    id: "tp-6863cf81ab4cc148c82dc0b2",
    author: "Victoria Ofjord",
    date: "2025-07-01",
    rating: 5,
    source: "Trustpilot",
    url: "https://dk.trustpilot.com/reviews/6863cf81ab4cc148c82dc0b2",
    text: "Jeg kan varmt anbefale Mike! Det var første gang, jeg fik lavet en kosmetisk behandling, og jeg var lidt nervøs. Men hele oplevelsen var utrolig tryg og professionel fra start til slut. Er super glad for resultaterne, meget naturligt og præcis det jeg havde håbet for! ",
    short: "Jeg kan varmt anbefale Mike! Det var første gang, jeg fik lavet en kosmetisk behandling, og jeg var lidt nervøs. Men hele oplevelsen var utrolig tryg og professionel fra start til slut. …",
    practitioners: ["mike"],
  },
  {
    id: "tp-68627b53fb5db385c73e2eae",
    author: "Victoria",
    date: "2025-06-30",
    rating: 5,
    source: "Trustpilot",
    url: "https://dk.trustpilot.com/reviews/68627b53fb5db385c73e2eae",
    text: "Var inde og få lipfiller hos Mike, og det var simpelhent bare det bedste! På trods af ubehag og min frygt for nåle, så fik Mike støttet og guidet mig roligt igennem hele behandlingen. Og et utrolig flot resultat, som jeg ikke kan stoppe med at kigge på! 💕",
    short: "Var inde og få lipfiller hos Mike, og det var simpelhent bare det bedste! … Og et utrolig flot resultat, som jeg ikke kan stoppe med at kigge på! 💕",
    practitioners: ["mike"],
    treatments: ["lip-filler"],
  },
  {
    id: "tp-6860032b6d4b131d7de8a3bf",
    author: "Songül",
    date: "2025-06-28",
    rating: 5,
    source: "Trustpilot",
    url: "https://dk.trustpilot.com/reviews/6860032b6d4b131d7de8a3bf",
    text: "Jeg har gået fast hos Annika siden hun startede, og jeg føler mig altid 100% tryg i hendes hænder. Hun er ærlig, lyttende og vanvittigt dygtig - hun gør kun det, der giver mening, og aldrig noget for bare at sælge.\n\nJeg har tidligere været hos en meget anerkendt klinik, men den service og kvalitet Annika leverer, overgår alt. Jeg går altid derfra glad og tilfreds - hver eneste gang!",
    short: "Jeg har gået fast hos Annika siden hun startede, og jeg føler mig altid 100% tryg i hendes hænder. Hun er ærlig, lyttende og vanvittigt dygtig - hun gør kun det, der giver mening, og aldrig noget for bare at sælge. …",
    practitioners: ["annika"],
  },
  {
    id: "tp-685e7b86c2d0f1443615b393",
    author: "Manon Hermann",
    date: "2025-06-27",
    rating: 5,
    source: "Trustpilot",
    url: "https://dk.trustpilot.com/reviews/685e7b86c2d0f1443615b393",
    text: "Jeg er bange for nåle, og de var rigtig gode til at holde pauser når jeg havde brug for det og give ekstra bedøvelses tid til mig. Meget rent og enkelt design. Venlige og søde.",
    short: "Jeg er bange for nåle, og de var rigtig gode til at holde pauser når jeg havde brug for det og give ekstra bedøvelses tid til mig. …",
  },
  {
    id: "tp-685be49bf3450e262884e97d",
    author: "Miya Kisbye",
    date: "2025-06-25",
    rating: 5,
    source: "Trustpilot",
    url: "https://dk.trustpilot.com/reviews/685be49bf3450e262884e97d",
    text: "Fik lavet læber hos søde Annika hos Fillox, og jeg er så glad for resultatet! Hun er virkelig dygtig og får en til at føle sig tryg hele vejen igennem. Det blev lige som jeg ønskede det. Kan virkelig anbefale hende! ♥️",
    short: "Fik lavet læber hos søde Annika hos Fillox, og jeg er så glad for resultatet! Hun er virkelig dygtig og får en til at føle sig tryg hele vejen igennem. …",
    practitioners: ["annika"],
    treatments: ["lip-filler"],
  },
  {
    id: "tp-6853191b833081bb8e327156",
    author: "SZ",
    date: "2025-06-18",
    rating: 5,
    source: "Trustpilot",
    url: "https://dk.trustpilot.com/reviews/6853191b833081bb8e327156",
    text: "Jeg har fået både skinbooster og fillers hos anikka, og jeg kan varmt anbefale hende! Hun er utrolig dygtig og professionel – man føler sig tryg i hendes hænder fra første sekund. Hun er sød, imødekommende og virkelig god til at lytte til mine ønsker. Hun rådgiver ærligt og grundigt, og hendes tilgang er meget nænsom – behandlingen var næsten smertefri. Resultatet blev præcis, som jeg ønskede det: naturligt, frisk og harmonisk. Jeg kommer helt sikkert igen!",
    short: "Jeg har fået både skinbooster og fillers hos anikka, og jeg kan varmt anbefale hende! … Resultatet blev præcis, som jeg ønskede det: naturligt, frisk og harmonisk. …",
    practitioners: ["annika"],
    treatments: ["skinbooster"],
  },
  {
    id: "tp-68362380ea90d5593d56ba95",
    author: "Luzan",
    date: "2025-05-28",
    rating: 5,
    source: "Trustpilot",
    url: "https://dk.trustpilot.com/reviews/68362380ea90d5593d56ba95",
    text: "Fantastisk service og ekspertise fra start til slut. Annika er utrolig professionel og imødekommende – man føler sig tryg med det samme. Hun forklarer alt grundigt og svarer tålmodigt på alle spørgsmål, så man føler sig godt informeret og i trygge hænder.\n\nJeg er normalt virkelig bange for nåle, men Annika bruger bedøvelse, og jeg kunne ærligt talt ikke mærke noget som helst! Det plejer ellers at gøre ret ondt at få fillers, men denne gang var det en helt anden oplevelse. Jeg er så glad for resultatet og kommer helt klart igen.",
    short: "Fantastisk service og ekspertise fra start til slut. Annika er utrolig professionel og imødekommende – man føler sig tryg med det samme. …",
    practitioners: ["annika"],
  },
  {
    id: "tp-67ddc269c749041a519ad94f",
    author: "Sally Villumsen",
    date: "2025-03-21",
    rating: 5,
    source: "Trustpilot",
    url: "https://dk.trustpilot.com/reviews/67ddc269c749041a519ad94f",
    text: "FILLOXXXXX!!!!\nFik lavet læber af sødeste Maria, hun er virkelig sød og sætter en ind i tingene. \nVirkelig et godt sted!!\n",
    practitioners: ["maria"],
    treatments: ["lip-filler"],
  },
  {
    id: "tp-677f6fed904b8496332316cb",
    author: "Camilla",
    date: "2025-01-09",
    rating: 5,
    source: "Trustpilot",
    url: "https://dk.trustpilot.com/reviews/677f6fed904b8496332316cb",
    text: "En 5’er herfra🩷 havde jeg ku gi Maria 10 havde jeg gjordt det🌸\nVågnede imorges og kiggede mig i spejlet og er simpelthen så glad for resultaterne, det utrolig hvor meget flotte naturlige resultater kan gøre ved ens selvtillid, så af hjertet tak🙏",
    short: "En 5’er herfra🩷 havde jeg ku gi Maria 10 havde jeg gjordt det🌸 …",
    practitioners: ["maria"],
  },
  {
    id: "tp-675a92ed19b8bc72d700f6d1",
    author: "Susan",
    date: "2024-12-12",
    rating: 5,
    source: "Trustpilot",
    url: "https://dk.trustpilot.com/reviews/675a92ed19b8bc72d700f6d1",
    text: "Utrolig søde og tager hensyn til ens behov og er eksta omhyggelige. Vil til enhver tid anbefale fillox",
  },
  {
    id: "tp-67373773339dd25ae582e74f",
    author: "Melissa Paludan",
    date: "2024-11-15",
    rating: 5,
    source: "Trustpilot",
    url: "https://dk.trustpilot.com/reviews/67373773339dd25ae582e74f",
    text: "Mig og min søster har begge fået 0,7 milliliter i vores læber, det er blevet så flot og vi kommer helt klart igen! Vi fik dem lavet hos Maria, dejlig god service ",
    practitioners: ["maria"],
    treatments: ["lip-filler"],
  },
  {
    id: "tp-6725f69f3483d58580291a9b",
    author: "Gillian  Lyons-Hardø",
    date: "2024-11-02",
    rating: 5,
    source: "Trustpilot",
    url: "https://dk.trustpilot.com/reviews/6725f69f3483d58580291a9b",
    text: "Jeg har været rigtig glad for resultaterne. Den sygeplejerske det udførte dem er meget professionel og giver rigtig god og ærlig vejledning.",
  },
  {
    id: "tp-66d4b791de24877a718f684b",
    author: "Sarah Mari Nielsen",
    date: "2024-09-01",
    rating: 5,
    source: "Trustpilot",
    url: "https://dk.trustpilot.com/reviews/66d4b791de24877a718f684b",
    text: "Jeg besøgte Fillox for at få lidt mere volumen i mine læber, og jeg er utrolig tilfreds med resultatet. Maria, som behandlede mig, er ikke kun yderst kompetent, men også utrolig behagelig og dygtig. Hun tog sig tid til at forstå, præcis hvilket look jeg ønskede, og udførte behandlingen med stor omhu. Resultatet er naturligt og smukt, præcis som jeg havde håbet. \n\nJeg kan varmt anbefale Maria hos Fillox, hvis du overvejer en filler behandling – du vil være i de bedste hænder!",
    short: "Jeg besøgte Fillox for at få lidt mere volumen i mine læber, og jeg er utrolig tilfreds med resultatet. Maria, som behandlede mig, er ikke kun yderst kompetent, men også utrolig behagelig og dygtig. …",
    practitioners: ["maria"],
    treatments: ["lip-filler"],
  },
  {
    id: "tp-662fbf1b5324f53bc92637e3",
    author: "Sofii Diaz",
    date: "2024-04-29",
    rating: 5,
    source: "Trustpilot",
    url: "https://dk.trustpilot.com/reviews/662fbf1b5324f53bc92637e3",
    text: "Har været hos dr Tom i dag for at lave læber og jeg har aldrig været mere fornøjd. Jeg har været hos mange ulige klinikker og steder, men har aldrig blevet så glad at jeg blev nødt til at skrive en anmeldelse. Jeg kan VARMT anbefale at komme til fillox. De er profesjonelle, dyktige og du er garantert et godt resultat. Jeg vil aldrig gå et andet sted igen. Mine læber er naturlige, plumped og fyldt op perfekt efter min form. Om du er i tvivl i om du skal booke en time, så er det her dit tegn på at du vil ikke fortryde det. De er varme, tar dig godt i mod og giver dig alt i alt en god opplevelse. Du går derfra med et smil.  10/10🌟💫",
    short: "Har været hos dr Tom i dag for at lave læber og jeg har aldrig været mere fornøjd. … Mine læber er naturlige, plumped og fyldt op perfekt efter min form. …",
    practitioners: ["tom"],
    treatments: ["lip-filler"],
  },
  {
    id: "tp-656f4c8296a64a611273ac6d",
    author: "Emilie Hastrup",
    date: "2023-12-05",
    rating: 5,
    source: "Trustpilot",
    url: "https://dk.trustpilot.com/reviews/656f4c8296a64a611273ac6d",
    text: "Rar og rolig oplevelse. Professionelt udført og god kommunikation",
  },
  {
    id: "tp-65045caa9e8e894fb9f1eb46",
    author: "Mia Olsen",
    date: "2023-09-15",
    rating: 5,
    source: "Trustpilot",
    url: "https://dk.trustpilot.com/reviews/65045caa9e8e894fb9f1eb46",
    text: "Virkelig god oplevelse. Rigtig god til at forklare og fortælle, hvilke muligheder der er. \nSuper professionelt og man føler sig i trygge hænder. \nOg så har de nogle ret lækre lokaler.",
    short: "Virkelig god oplevelse. Rigtig god til at forklare og fortælle, hvilke muligheder der er. Super professionelt og man føler sig i trygge hænder. …",
  },
];

/**
 * Where each review is shown (ids from `reviews`, in display order). Sets shorter than the
 * minimum are filled up with `general` reviews by reviewsFor(); the section heading then
 * says "Det siger vores kunder" instead of naming the practitioner or treatment.
 */
export const reviewSets: ReviewSets = {
  home: [
    "tp-6ab3d188b09e9f629f95ce8a", // Sarah Louise Kristiansen
    "tp-6a4f6e6ba97faedcc6075304", // Sarah
    "tp-6a08c976e9e5eac66014b19b", // AA
    "tp-69764555ccd134a8d29b0a76", // Lærke
    "tp-685e7b86c2d0f1443615b393", // Manon Hermann
  ],
  // Must fit every page that fills up from it, laser hair removal and a doctor's profile
  // included: no needles or anaesthesia (Manon Hermann), no "sygeplejerske" (Gillian
  // Lyons-Hardø). Those two stay out of `general`; Manon Hermann is on the home page.
  general: [
    "tp-6ab3d4c6cbb51ac47cd214dc", // Patricia Christensen
    "tp-65045caa9e8e894fb9f1eb46", // Mia Olsen
    "tp-6a917e1429e5ba05aececf31", // Amy Schuurhof
    "tp-6a08c976e9e5eac66014b19b", // AA
    "tp-68b300a60f8f26457300c274", // Maysara Salah
    "tp-675a92ed19b8bc72d700f6d1", // Susan
    "tp-656f4c8296a64a611273ac6d", // Emilie Hastrup
  ],
  practitioners: {
    tom: [
      "tp-662fbf1b5324f53bc92637e3", // Sofii Diaz
    ],
    alberte: [
      "tp-68f39a0d08d74344dec57867", // Nour
      "tp-6887906b6563f6dce40919b7", // Jessica
      "tp-68885ff8e481b225331552cb", // Lisette Nielsen
      "tp-69026ece954bc499fc3ddb68", // Qlr
      "tp-6898418be73fd2011079f98e", // Jh
      "tp-6929d3d640ddbc87d17af0c9", // Jakob hansen
    ],
    annika: [
      "tp-6860032b6d4b131d7de8a3bf", // Songül
      "tp-69fdde069fc37839f18be885", // Emma
      "tp-685be49bf3450e262884e97d", // Miya Kisbye
      "tp-68362380ea90d5593d56ba95", // Luzan
      "tp-69764555ccd134a8d29b0a76", // Lærke
    ],
    maria: [
      "tp-66d4b791de24877a718f684b", // Sarah Mari Nielsen
      "tp-67373773339dd25ae582e74f", // Melissa Paludan
      "tp-677f6fed904b8496332316cb", // Camilla
      "tp-67ddc269c749041a519ad94f", // Sally Villumsen
    ],
    mike: [
      "tp-69eccd907b18c45698f3d2a5", // K.H
      "tp-69f8db8a87db75a4d3e20419", // Maria
      "tp-6900b13912cbf5de71d3d8da", // Sara Palani
      "tp-6a79f4bd5b4547d806c4cd3f", // Tanja Andersen
      "tp-6863cf81ab4cc148c82dc0b2", // Victoria Ofjord
      "tp-6a905a1f962ba5e1b6960539", // Nanna Brøndum
    ],
  },
  treatments: {
    "lip-filler": [
      "tp-6ab3d188b09e9f629f95ce8a", // Sarah Louise Kristiansen
      "tp-685be49bf3450e262884e97d", // Miya Kisbye
      "tp-69eccd907b18c45698f3d2a5", // K.H
      "tp-6887906b6563f6dce40919b7", // Jessica
      "tp-66d4b791de24877a718f684b", // Sarah Mari Nielsen
      "tp-68627b53fb5db385c73e2eae", // Victoria
    ],
    skinbooster: [
      "tp-6853191b833081bb8e327156", // SZ
    ],
    microneedling: [
      "tp-6898418be73fd2011079f98e", // Jh
    ],
  },
};

/**
 * Treatment pages that show no customer reviews: the botulinum-toxin treatments. Botox is a
 * prescription medicine, and customer testimonials on a page that markets it can count as
 * advertising it to the public; even general reviews read as Botox testimonials there.
 * Remove a slug only after a legal check (open question for the owner).
 */
export const treatmentsWithoutReviews: readonly string[] = [
  "botox",
  "lip-flip",
  "gummy-smile",
  "hyperhidrose",
  "traptox",
  "botox-for-maend",
];

const reviewById = new Map(reviews.map((review) => [review.id, review]));

export function getReview(id: string): CustomerReview | undefined {
  return reviewById.get(id);
}

function reviewsById(ids: readonly string[]): CustomerReview[] {
  return ids.flatMap((id) => reviewById.get(id) ?? []);
}

/** Stable start offset in the general pool for `seed`, so fallback pages don't all show the same reviews. */
function rotateBy<T>(items: T[], seed?: string): T[] {
  if (!seed || items.length < 2) return items;
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  const start = hash % items.length;
  return [...items.slice(start), ...items.slice(0, start)];
}

export type ReviewSelection = {
  /** Reviews to show, in order: the specific ones first, then general ones. */
  reviews: CustomerReview[];
  /** How many of `reviews` are about the practitioner / treatment (the rest are general). */
  specificCount: number;
  /** Every review shown is about the practitioner / treatment (the heading may name it). */
  allSpecific: boolean;
};

type ReviewsForOptions = {
  /** Team member slug: reviews that name this person (reviewSets.practitioners). */
  practitioner?: string;
  /** Treatment slug: reviews about this treatment (reviewSets.treatments). */
  treatment?: string;
  /** A named set instead ("home", "general"). */
  set?: "home" | "general";
  /** Fewer specific reviews than this are filled up with general ones. Default 3. */
  min?: number;
  /** At most this many reviews. Default 6. */
  max?: number;
  /** Varies which general reviews fill up (use the page slug). */
  seed?: string;
};

/**
 * The reviews for a practitioner, a treatment or a named set: its own reviews (at most `max`),
 * filled up to `min` with general reviews, never the same review twice. A general review is
 * never counted as being about the practitioner or treatment (see `specificCount`). None for
 * a treatment in `treatmentsWithoutReviews`.
 */
export function reviewsFor({ practitioner, treatment, set, min = 3, max = 6, seed }: ReviewsForOptions): ReviewSelection {
  if (treatment && treatmentsWithoutReviews.includes(treatment)) return { reviews: [], specificCount: 0, allSpecific: false };
  const ids = [
    ...(set ? reviewSets[set] : []),
    ...(practitioner ? (reviewSets.practitioners[practitioner] ?? []) : []),
    ...(treatment ? (reviewSets.treatments[treatment] ?? []) : []),
  ];
  const chosen = reviewsById([...new Set(ids)]).slice(0, max);
  const specificCount = set === "general" ? 0 : chosen.length;
  for (const review of rotateBy(reviewsById(reviewSets.general), seed)) {
    if (chosen.length >= Math.min(min, max)) break;
    if (!chosen.some((c) => c.id === review.id)) chosen.push(review);
  }
  return { reviews: chosen, specificCount, allSpecific: specificCount > 0 && specificCount === chosen.length };
}
