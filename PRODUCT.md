# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Recruiters and hiring teams evaluating Whittaker Tran (Minh Tai) for a software engineering role. They skim quickly, want to see experience, stack depth and shipped work, then reach out or grab the CV.

## Product Purpose

A single-page personal portfolio for a full-stack developer based in Ho Chi Minh City. Success is a recruiter understanding who he is, what he builds with and what he has shipped within one scroll, then sending a message through the contact form or a direct channel.

## Capabilities and Constraints

- Next.js 15 App Router under `src/app/[lang]`, Tailwind CSS 4, `motion` for animation, i18next (English copy complete; Vietnamese file is a stub).
- Content lives in `src/packages/database` (experience, projects, tech stack) and `src/locales/en/translation.json`; layouts read from there, never hard-code duplicates.
- Contact form posts to `/api/contact` (nodemailer, rate-limited, honeypot); its validation and submit logic must be preserved.
- Light and dark theme via `.dark` class on `<html>`, persisted in localStorage.

## Brand Commitments

- Name: Whittaker Tran. Logo "WT / Whittaker" in brand blue `#0a21c0` (`public/assets/images/logo.png`, `logo_white.png`).
- User-pinned direction (2026-11-09): editorial dark layout in the spirit of renando.duingzcreative.site, with the motion vocabulary of portfolio-fahryy.netlify.app; accent is the logo blue; dark is the default theme with a light toggle kept.

## Evidence on Hand

- One role: Software Engineer at NUS Technology since July 2023, with achievements and tech list.
- Five projects with covers and screenshots in `public/assets/images/projects`.
- Tech stack with years of experience per tool.
- Avatar is an illustrated (cartoon) image, not a photo: `public/assets/images/avatar.jpeg`.
- No awards, testimonials, client logos or download-ready CV link exist; the "My Resume" and "My Blog" links are `#`. Do not fabricate them.
- Copy conflict to resolve with the owner: `about_me_introduction` says "5+ years" while the experience data starts in 2023.

## Product Principles

- Scannable first: a recruiter should get role, stack and proof in seconds.
- Real content only; no invented metrics or logos.
- Motion supports reading order and never blocks content.
