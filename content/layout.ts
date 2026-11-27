/**
 * Copy for the site chrome: default SEO metadata, skip link, header, mobile
 * menu, footer, 404 and the /booking page. Components import from here and
 * never hard-code these strings.
 */
import { site } from "@/config/site";
import { forms } from "./forms";
import { routes } from "./routes";
import { photos } from "./photos";

export const layoutCopy = {
  meta: {
    /** Used when a page sets no title of its own. */
    // TODO: copy review (not in the design)
    defaultTitle: "Fillox · Æstetiske behandlinger udført af læger og sygeplejersker",
    /** `%s` is replaced by the page title. */
    titleTemplate: "%s · Fillox",
    // TODO: copy review (expanded from the mf hero lead; not in the design). "Rynkebehandling" in
    // place of "botox" (a prescription medicine; 2026-10). Also the Organization JSON-LD description.
    description:
      "Tryg rynkebehandling, fillers og hudforbedring – udført af læger og sygeplejersker og tilpasset din anatomi. Klinikker i København og omegn.",
    /**
     * Default social sharing image: a 1200 × 630 crop of the clinic's mirror photo
     * (content/photos.ts; no product, no client's result).
     */
    // TODO: copy review (alt text)
    ogImage: {
      src: photos.ogSpejl.src,
      alt: photos.ogSpejl.alt,
      width: photos.ogSpejl.width,
      height: photos.ogSpejl.height,
    },
  },

  /** Visually hidden link that jumps past the header. */
  // TODO: copy review (accessible names below are not in the design)
  skipLink: "Gå til indhold",
  /** Id of <main> (the skip link's target, shown in the address bar as #indhold). */
  mainId: "indhold",

  header: {
    /** Accessible name of the desktop header navigation. */
    navLabel: "Hovedmenu",
    /** Accessible name of the logo link. */
    homeLabel: "Fillox – til forsiden",
    /**
     * Extra route prefixes that mark a top-level nav item as active
     * (keyed by the nav item's href). E.g. practitioner profiles live under "Om os".
     */
    activePrefixes: {
      [routes.treatments]: [routes.treatments],
      [routes.clinics]: [routes.clinics],
      [routes.about]: [routes.about, routes.practitioners, routes.contact, routes.jobs, routes.creator],
    } as Record<string, string[]>,
    /** Desktop "Priser" dropdown (categories, trust points and financing copy come from content/prices.ts). */
    pricesMenu: {
      // TODO: copy review (not in the design)
      financingCta: "Læs om finansiering",
    },
  },

  mobileMenu: {
    /**
     * "Se alle …" link at the bottom of a category (mobile menu level 2).
     * Keyed by category slug; falls back to ui.seeAllTreatments.
     */
    categoryAllLabels: {
      // TODO: copy review — only "for-maend" is in the design (mm3); the other five are invented.
      fillers: "Se alle fillers",
      // "Botox", as the category's mobile label (content/navigation.ts → treatmentCategories;
      // Alberte 2026-11-26 and the owner, an accepted § 66 risk). TODO: copy review (2026-11-27, Alberte)
      rynkebehandling: "Se alle botoxbehandlinger",
      hudforbedring: "Se alle hudbehandlinger",
      "laser-harfjerning": "Se alt om laser hårfjerning",
      hartab: "Se alle hårbehandlinger",
      "for-maend": "Se alle behandlinger for mænd",
    } as Record<string, string>,
  },

  footer: {
    tagline: "Æstetiske behandlinger udført af læger og sygeplejersker.",
    /** Accessible names for the footer landmarks / lists. */
    navLabel: "Sidefod",
    legalLabel: "Juridisk",
    clinicsLabel: "Vores klinikker",

    /**
     * The third contact card next to "Ring til os" / "Skriv til os" (content/ui.ts → callUs,
     * writeUs), linking to the booking page (config/site.ts → booking.href). Owner, 2026-10: the
     * footer had two buttons ("Tilmeld" and "Book tid"); booking is now one of three equal ways
     * to reach Fillox, so the newsletter's "Tilmeld" is the footer's only button. The arrow is
     * added by the component.
     */
    // TODO: copy review (owner's request, not in the design)
    bookingCard: {
      label: "Book online",
      value: "Find en tid",
    },

    /**
     * Newsletter signup at the top of the footer, on every page (owner, 2026-10: "så det er
     * fast"); hidden on /blog, which has its own band right above the footer. Form strings as
     * on /blog (content/pages/blog.ts → newsletter); posts to the same Netlify form.
     */
    // TODO: copy review (owner's request, not in the design: eyebrow, title, text, success, privacy line)
    // Owner note: `text` is what the visitor consents to, so it names what the mails are about
    // (markedsføringsloven § 10; Forbrugerombudsmanden, "Spamforbuddet" 2021, ch. 7.2: the consent
    // must be informed). No offers: owner 2026-11-26, point 4 of the pre-launch audit ("ret det med
    // priser osv"); was "Få tilbud, nyheder og tips …" and "… nyheder og gode tilbud." The newsletter
    // sends news, articles and tips: no time-limited discounts, gifts or competitions on treatments
    // (VEJ nr. 9319 af 26/06/2013, pkt. 5.1, https://www.retsinformation.dk/eli/retsinfo/2013/9319),
    // and never rynkebehandling or other prescription medicines (lægemiddelloven § 66). Should it
    // ever carry offers, change this text, /blog (content/pages/blog.ts → newsletter) and the
    // privacy policy (content/pages/legal.ts, "12. Nyhedsbrev") first.
    // Title and text: Alberte 2026-11-26 (forwarded by the owner), "Få nyt fra Fillox" / "Tilmeld
    // dig vores nyhedsbrev, og få seneste nyt om vores behandlinger, produktnyheder og særlige
    // invitationer." ("det seneste nyt": grammar). Was "Tilmeld dig vores nyhedsbrev" / "Få nyheder
    // og gode råd om vores behandlinger på e-mail." The same words on /blog and in "12. Nyhedsbrev".
    // What the consent now covers, and so what the mails may carry: "produktnyheder" never about a
    // prescription medicine (§ 66 above), and "særlige invitationer" (events) without offers,
    // discounts, gifts or competitions on treatments (VEJ 9319/2013 pkt. 5.1 above).
    // TODO: copy review (2026-11-26, Alberte; owner: what "særlige invitationer" will be)
    newsletter: {
      eyebrow: "Nyhedsbrev",
      title: "Få nyt fra Fillox",
      text: "Tilmeld dig vores nyhedsbrev, og få det seneste nyt om vores behandlinger, produktnyheder og særlige invitationer.",
      formName: forms.newsletter,
      placeholder: "Din e-mail",
      submit: "Tilmeld",
      emailLabel: "Din e-mail",
      formLabel: "Tilmeld nyhedsbrevet",
      sending: "Sender …",
      errors: {
        emailRequired: "Skriv din e-mail.",
        emailInvalid: "Tjek, at e-mailen er skrevet rigtigt.",
        submit: `Vi kunne ikke gennemføre din tilmelding. Prøv igen, eller skriv til os på ${site.contact.email}.`,
      },
      success: {
        title: "Tak for din tilmelding",
        // TODO: copy review (2026-11-26, without "og gode tilbud")
        text: "Du hører fra os, så snart vi har nyheder.",
      },
      /**
       * The line under the field, worded as on /blog (content/pages/blog.ts → newsletter.privacy).
       * The link opens the privacy policy's newsletter section (purpose, legal basis, retention,
       * processors, how to unsubscribe).
       */
      privacy: {
        text: "Vi bruger kun din e-mail til nyhedsbrevet, og du kan altid afmelde dig.",
        link: { label: "Læs vores privatlivspolitik", href: routes.privacyNewsletter },
        end: ".",
      },
    },

    /**
     * Trustpilot strip at the very bottom of the footer, on every page: the label
     * (content/ui.ts → trustpilotLabel, "Fremragende"), the stars and this line. {score} and
     * {count} come from config/site.ts → trustpilot (update them from the profile).
     */
    // TODO: copy review (owner's request, not in the design)
    trust: {
      summary: "{score} ud af 5 · {count} anmeldelser på Trustpilot",
    },
  },

  /**
   * /nyhedsbrev/tak (routes.newsletterThanks): the thank-you page after the newsletter signup
   * WITHOUT JavaScript. The form posts to public/__nyhedsbrev-tilmeldt.html (Netlify stores the
   * signup and serves that file), which forwards here. With JavaScript the form shows
   * footer.newsletter.success in place. noindex.
   */
  // TODO: copy review (no design; all copy invented)
  newsletterThanks: {
    eyebrow: "Nyhedsbrev",
    title: "Tak for din tilmelding",
    text: "Du er nu tilmeldt Fillox’ nyhedsbrev. Du kan altid afmelde dig igen via linket i bunden af hver mail.",
    primaryCta: { label: "Til forsiden", href: routes.home },
    secondaryCta: { label: "Se vores behandlinger", href: routes.treatments },
  },

  // TODO: copy review (404 page has no design; all copy invented)
  notFound: {
    metaTitle: "Siden blev ikke fundet",
    eyebrow: "Fejl 404",
    title: "Siden findes ikke",
    text: "Vi kan desværre ikke finde den side, du leder efter. Den kan være flyttet eller slettet. Prøv at gå til forsiden, eller book en tid direkte.",
    homeCta: "Til forsiden",
  },

  // TODO: copy review (/booking has no design; all copy invented)
  booking: {
    metaTitle: "Book tid",
    metaDescription:
      "Book din behandling hos Fillox online. Vælg klinik, behandling og tidspunkt – du starter altid med en konsultation.",
    eyebrow: "Online booking",
    title: "Book tid",
    intro:
      "Vælg klinik, behandling og tidspunkt i kalenderen herunder. Du starter altid med en konsultation, hvor din behandler gennemgår dine ønsker og lægger en plan sammen med dig.",
    /**
     * Under the intro. BEK nr. 834 af 27/06/2014 om kosmetisk behandling § 3: no cosmetic treatment of
     * persons under 18. Owner 2026-11-26 ("tilføj 18 år", to the proposed "Vi udfører kun kosmetiske
     * behandlinger på personer over 18 år"); "fyldt 18 år", since an 18-year-old may be treated. The
     * same line answers the FAQ on /ny-hos-fillox (content/pages/new-here.ts).
     */
    // TODO: copy review (2026-11-26)
    ageNote: "Vi udfører kun kosmetiske behandlinger på personer, der er fyldt 18 år.",
    helpTitle: "Brug for hjælp til at booke?",
    helpText: "Ring eller skriv til os, så finder vi den rigtige tid sammen.",
    /**
     * Query parameters of booking links: /booking?klinik=city2 (clinic cards, menus) and
     * /booking?behandler=alberte (practitioner CTAs). Built by lib/booking.ts.
     */
    params: { clinic: "klinik", practitioner: "behandler" },
    /**
     * Accessible name of the booking calendar's iframe (Gecko, fillox.dk). Gecko's script
     * injects the iframe with its own marketing title, which the embed replaces with this.
     */
    // TODO: copy review (not in the design)
    iframeTitle: "Online booking hos Fillox",
    /**
     * In the booking card when the calendar cannot load: without JavaScript, when the provider's
     * script is blocked or fails, or when no calendar has appeared after a few seconds
     * (components/booking/BookingUnavailable.tsx). The phone and e-mail buttons under it come from
     * config/site.ts. The message disappears as soon as the calendar arrives.
     */
    // TODO: copy review (not in the design)
    unavailable: {
      title: "Kalenderen kunne ikke indlæses",
      text: "Ring eller skriv til os, så finder vi en tid sammen.",
    },
    /**
     * Clinic picker above the calendar. Only used with a per-clinic booking provider
     * (config/site.ts → booking.provider "timma", as on fillox.no); the Gecko calendar
     * (fillox.dk) has its own clinic selector.
     */
    // TODO: copy review (not in the design; unused while fillox.dk books through Gecko)
    clinicPicker: {
      label: "Vælg klinik",
      hint: "Vælg den klinik, du vil booke i, så åbner kalenderen herunder.",
      /** Accessible name of the booking iframe, e.g. "Book tid i Fillox City2". */
      iframeTitle: (clinicName: string) => `Book tid i ${clinicName}`,
      /** Link under the calendar that opens the provider's booking page directly. */
      openDirect: "Åbn bookingen i et nyt vindue",
    },
  },
};

export type LayoutCopy = typeof layoutCopy;
