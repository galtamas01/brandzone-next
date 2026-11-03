import { getDictionary } from "@/content/copy";
import { getCounters, getFaq, getPartners, getVideos } from "@/content/data";
import { ROUTES, type Locale } from "@/lib/i18n";
import { organizationJsonLd } from "@/lib/metadata";
import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/Hero";
import { Clients } from "@/components/Clients";
import { References } from "@/components/References";
import { Services } from "@/components/Services";
import { Team } from "@/components/Team";
import { Faq } from "@/components/Faq";
import { Contact } from "@/components/Contact";
import { SiteFooter } from "@/components/SiteFooter";
import { CookieBanner } from "@/components/CookieBanner";
import { RevealObserver } from "@/components/RevealObserver";
import { Tracking } from "@/components/Tracking";

/** A főoldal, nyelvtől függetlenül. Az app/(ro|hu|en) útvonalak ezt renderelik. */
export function HomePage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <>
      <SiteHeader locale={locale} dict={dict} />
      <main id="main">
        <Hero dict={dict} />
        <Clients dict={dict} partners={getPartners(locale)} />
        <References dict={dict} videos={getVideos(locale)} counters={getCounters()} />
        <Services dict={dict} />
        <Team dict={dict} />
        <Faq dict={dict} items={getFaq(locale)} />
        <Contact locale={locale} dict={dict} />
      </main>
      <SiteFooter locale={locale} dict={dict} />
      <CookieBanner dict={dict} policyHref={ROUTES[locale].policy} />
      <RevealObserver />
      <Tracking meta openAiEvent="page_viewed" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd(locale)) }}
      />
    </>
  );
}
