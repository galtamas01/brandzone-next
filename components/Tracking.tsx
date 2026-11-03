import Script from "next/script";
import { TRACKING } from "@/lib/site";

type Props = {
  /** Meta (Facebook) pixel – a régi oldalon csak a főoldalakon futott. */
  meta?: boolean;
  /** OpenAI pixel esemény: főoldalon page_viewed, köszönőoldalon lead_created. */
  openAiEvent?: "page_viewed" | "lead_created";
};

/**
 * Mérőkódok – a régi oldal viselkedésével azonosan.
 * A GA, a GTM, a Meta és az OpenAI pixel hozzájárulás nélkül is betölt (ahogy eddig);
 * a TikTok pixel csak elfogadás után (CookieBanner). Ld. README „GDPR" megjegyzés.
 * Mindegyik `afterInteractive`, így nem lassítják az első megjelenítést.
 */
export function Tracking({ meta = false, openAiEvent }: Props) {
  const { gaId, gtmId, metaPixelId, openAiPixelId } = TRACKING;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
      </Script>

      <Script id="gtm" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
      </Script>

      {meta ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixelId}');fbq('track','PageView');`}
        </Script>
      ) : null}

      {openAiEvent ? (
        <Script id="oai-pixel" strategy="afterInteractive">
          {`!function(w,d,s,u){if(w.oaiq)return;var q=function(){q.q.push(arguments)};q.q=[];w.oaiq=q;var j=d.createElement(s);j.async=1;j.src=u;var f=d.getElementsByTagName(s)[0];f.parentNode.insertBefore(j,f)}(window,document,"script","https://bzrcdn.openai.com/sdk/oaiq.min.js");oaiq("init",{pixelId:"${openAiPixelId}",debug:true});oaiq("measure","${openAiEvent}",${openAiEvent === "lead_created" ? '{type:"customer_action"}' : '{type:"contents"}'});`}
        </Script>
      ) : null}

      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
          title="GTM"
        />
        {meta ? (
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            alt=""
            src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
          />
        ) : null}
      </noscript>
    </>
  );
}
