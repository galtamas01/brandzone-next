import type { Dictionary } from "@/content/copy";
import { FORM_NAMES, ROUTES, type Locale } from "@/lib/i18n";
import { RollButton } from "@/components/ui/RollButton";
import { Mail, Phone } from "@/components/Icons";
import styles from "./Contact.module.css";

/**
 * Ajánlatkérő űrlap – Netlify Forms.
 * Sima HTML-űrlap (JS nélkül is működik); a Netlify a statikus HTML-ből ismeri fel
 * a `data-netlify` attribútum alapján. A mezőnevek és az űrlapnevek a régi oldallal
 * azonosak, így a beküldések ugyanott gyűlnek. Spamszűrés: rejtett „bot-field".
 */
export function Contact({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const c = dict.contact;
  const f = c.form;
  const req = <span className={styles.req} aria-hidden="true">*</span>;

  return (
    <section id="arajanlat" className={styles.section} aria-labelledby="contact-title">
      <div className="container">
        <div className={styles.card}>
          <div className={styles.info}>
            <p className={styles.label} data-reveal>
              {c.label}
            </p>
            <h2 id="contact-title" className={styles.title} data-reveal style={{ "--i": 1 } as React.CSSProperties}>
              {c.title}
            </h2>
            <p className={styles.lead} data-reveal style={{ "--i": 2 } as React.CSSProperties}>
              {c.lead}
            </p>

            <dl className={styles.channels} data-reveal style={{ "--i": 3 } as React.CSSProperties}>
              <div>
                <dt>
                  <Mail size={18} />
                  {c.emailLabel}
                </dt>
                {c.emails.map((e) => (
                  <dd key={e.value}>
                    {e.tag ? <span className={styles.tag}>{e.tag}</span> : null}
                    <a href={e.href}>{e.value}</a>
                  </dd>
                ))}
              </div>
              <div>
                <dt>
                  <Phone size={18} />
                  {c.phoneLabel}
                </dt>
                {c.phones.map((p) => (
                  <dd key={p.value}>
                    {p.tag ? <span className={styles.tag}>{p.tag}</span> : null}
                    <a href={p.href}>{p.value}</a>
                  </dd>
                ))}
              </div>
            </dl>
          </div>

          <form
            className={styles.form}
            name={FORM_NAMES[locale]}
            method="POST"
            action={ROUTES[locale].thanks}
            data-netlify="true"
            netlify-honeypot="bot-field"
          >
            <input type="hidden" name="form-name" value={FORM_NAMES[locale]} />
            <p hidden>
              <label>
                Bot field <input name="bot-field" tabIndex={-1} autoComplete="off" />
              </label>
            </p>

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="name">
                  {f.name}
                  {req}
                </label>
                <input id="name" name="name" type="text" placeholder={f.namePh} autoComplete="name" required />
              </div>
              <div className={styles.field}>
                <label htmlFor="company">
                  {f.company}
                  {req}
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  placeholder={f.companyPh}
                  autoComplete="organization"
                  required
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="email">
                  {f.email}
                  {req}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={f.emailPh}
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  required
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="phone">{f.phone}</label>
                <input id="phone" name="phone" type="tel" placeholder={f.phonePh} autoComplete="tel" inputMode="tel" />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="note">
                {f.note}
                {req}
              </label>
              <textarea id="note" name="note" rows={5} placeholder={f.notePh} required />
            </div>

            <label className={styles.consent} htmlFor="cb-policy">
              <input id="cb-policy" name="cb-policy" type="checkbox" required />
              <span className={styles.box} aria-hidden="true">
                <svg viewBox="0 0 16 16" width="12" height="12">
                  <path d="m3 8.5 3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span>
                {f.consentBefore}
                <a href={ROUTES[locale].policy} target="_blank" rel="noopener">
                  {f.consentLink}
                </a>
                {f.consentAfter}
                {req}
              </span>
            </label>

            <p className={styles.note}>
              <span aria-hidden="true">*</span> {f.required}
            </p>

            <RollButton type="submit" variant="green" size="lg" className={styles.submit}>
              {f.submit}
            </RollButton>
          </form>
        </div>
      </div>
    </section>
  );
}
