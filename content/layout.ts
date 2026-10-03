/**
 * Copy for the site chrome: default SEO metadata, skip link, header, mobile
 * menu, footer, 404 and the /booking page. Components import from here and
 * never hard-code these strings.
 */
import { site } from "@/config/site";
import { forms } from "./forms";
import { routes } from "./routes";

export const layoutCopy = {
  meta: {
    /** Used when a page sets no title of its own. */
    // TODO: copy review (not in the design)
    defaultTitle: "Fillox · Æstetiske behandlinger udført af læger og sygeplejersker",
    /** `%s` is replaced by the page title. */
    titleTemplate: "%s · Fillox",
    // TODO: copy review (expanded from the mf hero lead; not in the design)
    description:
      "Trygge behandlinger med botox, fillers og hudforbedring – udført af læger og sygeplejersker og tilpasset din anatomi. Klinikker i København og omegn.",
    /** Default social sharing image (1200×630 crop is taken from the centre). */
    // TODO: copy review (alt text)
    ogImage: {
      src: "/images/results/duo-pink.jpg",
      alt: "To smilende kvinder foran en rosa baggrund",
      width: 2000,
      height: 1228,
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
      rynkebehandling: "Se alle rynkebehandlinger",
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
    // (Forbrugerombudsmanden expects the kind of products). Newsletter offers must never promote
    // Botox or other prescription medicines (no advertising them to the public), the same reason
    // the Botox pages show no reviews.
    newsletter: {
      eyebrow: "Nyhedsbrev",
      title: "Tilmeld dig vores nyhedsbrev",
      text: "Få tilbud, nyheder og tips om vores behandlinger på e-mail.",
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
        text: "Du hører fra os, så snart vi har nyheder og gode tilbud.",
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
