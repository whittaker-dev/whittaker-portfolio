"use client";
import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useMutation } from "@tanstack/react-query";
import { t } from "i18next";
import { motion } from "motion/react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import WaveText from "@/packages/components/WaveText";
import {
  CONTACT_FIELD_LIMITS,
  hasContactErrors,
  IContactForm,
  IContactFormErrors,
  normalizeContactForm,
  sendContactMessage,
  validateContactForm,
} from "@/packages/contact";

const EMPTY_FORM: IContactForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
  website: "",
};

type FieldProps = {
  name: keyof IContactForm;
  label: string;
  error?: string;
  children: React.ReactNode;
};

const Field = ({ name, label, error, children }: FieldProps) => (
  <div className="flex flex-col gap-2">
    <Label htmlFor={name} className="text-[13px] font-medium text-ink">
      {label}
    </Label>
    {children}
    {error && (
      <motion.span
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-1.5 text-[13px] text-danger"
      >
        <Icon icon="ph:warning-circle-bold" className="size-4 shrink-0" />
        {t(error)}
      </motion.span>
    )}
  </div>
);

const ContactForm = () => {
  const [values, setValues] = useState<IContactForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<IContactFormErrors>({});

  const { mutate, isPending } = useMutation({
    mutationFn: sendContactMessage,
    onSuccess: (response) => {
      if (!response.success) {
        setErrors(response.errors ?? {});
        toast.error(t(response.message));
        return;
      }

      setValues(EMPTY_FORM);
      setErrors({});
      toast.success(t(response.message));
    },
  });

  const handleChange =
    (field: keyof IContactForm) =>
    (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ): void => {
      const { value } = event.target;
      setValues((previous) => ({ ...previous, [field]: value }));

      // Clear the message as soon as the visitor starts fixing the field; re-validating
      // on every keystroke would flag an email as invalid while it is half typed.
      setErrors((previous) =>
        previous[field] ? { ...previous, [field]: undefined } : previous,
      );
    };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const normalized = normalizeContactForm(values);
    const nextErrors = validateContactForm(normalized);

    if (hasContactErrors(nextErrors)) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    mutate(normalized);
  };

  return (
    <motion.form
      noValidate
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="flex flex-col gap-5 border border-line bg-paper-raised p-5 md:p-8"
    >
      <h3 className="font-display text-[1.75rem] uppercase leading-none text-ink">
        <WaveText text={t("contact_form_title")} />
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field name="name" label={t("contact_field_name")} error={errors.name}>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            maxLength={CONTACT_FIELD_LIMITS.name}
            placeholder={t("contact_field_name_placeholder")}
            value={values.name}
            onChange={handleChange("name")}
            aria-invalid={Boolean(errors.name)}
            disabled={isPending}
          />
        </Field>

        <Field
          name="email"
          label={t("contact_field_email")}
          error={errors.email}
        >
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={CONTACT_FIELD_LIMITS.email}
            placeholder={t("contact_field_email_placeholder")}
            value={values.email}
            onChange={handleChange("email")}
            aria-invalid={Boolean(errors.email)}
            disabled={isPending}
          />
        </Field>
      </div>

      <Field
        name="subject"
        label={t("contact_field_subject")}
        error={errors.subject}
      >
        <Input
          id="subject"
          name="subject"
          maxLength={CONTACT_FIELD_LIMITS.subject}
          placeholder={t("contact_field_subject_placeholder")}
          value={values.subject}
          onChange={handleChange("subject")}
          aria-invalid={Boolean(errors.subject)}
          disabled={isPending}
        />
      </Field>

      <Field
        name="message"
        label={t("contact_field_message")}
        error={errors.message}
      >
        <Textarea
          id="message"
          name="message"
          rows={6}
          maxLength={CONTACT_FIELD_LIMITS.message}
          placeholder={t("contact_field_message_placeholder")}
          value={values.message}
          onChange={handleChange("message")}
          aria-invalid={Boolean(errors.message)}
          disabled={isPending}
          className="resize-none"
        />
        <span className="self-end font-mono text-[11px] text-ink-muted tabular-nums">
          {values.message.length}/{CONTACT_FIELD_LIMITS.message}
        </span>
      </Field>

      {/* Honeypot: hidden from people and screen readers, irresistible to form bots. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={handleChange("website")}
        />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isPending}
        className="mt-2 h-12 w-full rounded-none bg-brand text-sm font-semibold text-on-brand transition-[filter] hover:bg-brand hover:brightness-125"
      >
        {isPending ? (
          <>
            <Icon icon="svg-spinners:180-ring-with-bg" className="size-4" />
            {t("contact_sending")}
          </>
        ) : (
          <>
            <Icon icon="ph:paper-plane-tilt-bold" className="size-4" />
            {t("contact_send")}
          </>
        )}
      </Button>
    </motion.form>
  );
};

export default ContactForm;
