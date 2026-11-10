import { socialLinks } from "@/packages/database";
import { Icon } from "@iconify/react";
import { t } from "i18next";

const Footer = () => {
  return (
    <footer className="border-t border-line">
      <div className="shell flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
        <a href="#top" className="display flex items-baseline text-2xl">
          WHITTAKER
          <span className="ml-0.5 inline-block size-1.5 bg-brand-ink" />
        </a>

        <p className="label">
          © {new Date().getFullYear()} · {t("footer_note")}
        </p>

        <div className="flex items-center gap-1">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.link}
              target={link.link.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={link.name}
              className="flex size-10 items-center justify-center text-ink-muted transition-colors hover:text-brand-ink"
            >
              <Icon icon={link.icon} className="size-5" />
            </a>
          ))}
          <a
            href="#top"
            aria-label={t("back_to_top")}
            className="ml-2 flex size-10 items-center justify-center border border-line text-ink transition-colors hover:border-brand-ink hover:text-brand-ink"
          >
            <Icon icon="ph:arrow-up-bold" className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
