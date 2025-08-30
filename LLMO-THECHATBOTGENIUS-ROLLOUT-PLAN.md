# LLM Optimization Rollout Plan (Site: thechatbotgenius.com)

Status: Draft v0.2 (adapted for The Chatbot Genius)
Owner: Jay (jay@barkerhrs.com)
Scope: Public pages in this repo (root + subfolders), excluding archives and demo sites noted below (see CLAUDE.md)

Goals
- Improve visibility and consumption by AI systems (LLMO) across main public pages.
- Ensure claims are accurate and consistent with current offerings (AI consulting, books, projects, demos).
- Add/standardize machine-readable signals (schema, sitemap, llms.txt) and concise human-scannable summaries.

Non-Goals
- Do not introduce frameworks or a build process (static site remains).
- Do not add product features or new sections beyond current site structure.

Acceptance Criteria
- No misleading or aspirational claims remain on public pages (services, demos, AI-news context are clearly described).
- JSON-LD schema present on key pages and validates (LocalBusiness/Person/WebSite/WebPage + Article/Book/Service where appropriate).
- `sitemap.xml` exists and is current; `llms.txt` is published and correct; `robots.txt` includes AI crawler directives and Sitemap.
- Each core page has a short “Key Takeaways” section near the top (or equivalent TL;DR).
- In-body links connect core pages without requiring JS nav; no critical links rely solely on JS.

Constraints
- Work within the current static structure and modular CSS (see CLAUDE.md and STYLE-GUIDE.md).
- Exclude demo sites under `web-development/demos/**` and historical `archive-*/**` when applying content changes.
- Update `TRUTH-REFACTOR.md` for any claim changes (file + line refs).

Deliverables (High Level)
1) Content truth-audit and fixes (align claims across Home, About, Books, Blog, Projects, Web Dev, AI News)
2) Information architecture touch-up + in-body linking between core pages
3) AI crawler artifacts: verify/refresh `sitemap.xml`; add `llms.txt`; ensure `robots.txt` references Sitemap and AI bots
4) Schema JSON-LD: LocalBusiness, Person, WebSite, WebPage; Article for blog posts; Book for books; Service for Web Dev/Services; Breadcrumb where helpful
5) Page structure improvements: Key Takeaways/TL;DR, Q&A blocks, heading clarity
6) E-E-A-T: Organization + author bio consistency, last-updated timestamps on long pages

Project Checklist

- [ ] Phase 1 — Truth Audit (root + subpages)
  - [ ] Identify and fix inconsistencies (e.g., service capabilities vs. demos, AI News context as curated content, Services links that 404)
  - [ ] Align site messaging to current focus: AI consulting, books, projects, web dev demos (no unlaunched offerings)
  - [ ] Update `TRUTH-REFACTOR.md` with file + line refs and rationale

- [ ] Phase 2 — IA + Internal Links
  - [ ] Ensure in-body links connect: Home ↔ About/Books/Blog/Projects/Web Dev; Blog posts ↔ Blog listing; Web Dev ↔ demos; Contact anchors
  - [ ] Verify no critical links exist only in JS nav; add HTML links near top/bottom where needed

- [ ] Phase 3 — AI Crawler Artifacts
  - [ ] Verify `sitemap.xml` lists current pages (Home, About, Books, Blog listing, Projects, AI News, Web Dev, notable blog posts)
  - [ ] Add `/llms.txt` highlighting key pages with one-line summaries and canonical URLs
  - [ ] Ensure `robots.txt` includes `Sitemap: https://thechatbotgenius.com/sitemap.xml` and AI bot policies

- [ ] Phase 4 — Schema JSON-LD (connected graph)
  - [ ] Site-wide base graph: Organization (LocalBusiness) + Person + WebSite + WebPage (page-specific)
  - [ ] Blog posts: Article
  - [ ] Books page: Book (with offers linking to Amazon where relevant)
  - [ ] Web Development/Services: Service (and Offer where applicable)
  - [ ] BreadcrumbList where helpful
  - [ ] Validate with Rich Results Test / Schema.org validator

- [ ] Phase 5 — Page Structure Improvements
  - [ ] Add “Key Takeaways” near the top of core pages (Home, About, Books, Blog listing, Projects, Web Dev, AI News)
  - [ ] Use question-forward headings with short, direct answers where helpful
  - [ ] Add context-setting intros or TL;DR blocks for longer pages

- [ ] Phase 6 — E-E-A-T / Bio / Timestamps
  - [ ] Confirm Organization + Person schema (name, URL, sameAs) and reuse across pages
  - [ ] Ensure About page has concise, credible author bio with links (LinkedIn, GitHub)
  - [ ] Add “Last updated” timestamps to long-form pages (visible text + dateModified in schema)

Work Plan (Step-by-step)

1) Inventory + Baseline
   - Enumerate pages: `index.html`, `about.html`, `books.html`, `blog.html`, `projects.html`, `ai-news.html`, `web-development.html`, `web-development/index.html`, and representative blog posts (`/blog/*.html`).
   - Map each page’s role and surface missing/placeholder links (e.g., Services links to non-existent pages).

2) Truth Audit (Edits + TRUTH-REFACTOR.md)
   - Align wording with current offerings (AI consulting, training, custom app dev, demos). Avoid implying unavailable services.
   - Remove/soften any aspirational claims; fix or remove dead/404 links (e.g., Services placeholders) or mark as “Coming soon”.
   - Record each change in `TRUTH-REFACTOR.md` with date, file, line(s), and rationale.

3) Add AI Artifacts
   - Verify/update `sitemap.xml` with canonical URLs for all public pages.
   - Create `/llms.txt` enumerating top pages with concise summaries and canonical URLs.
   - Ensure `robots.txt` includes AI crawler allowances/blocks and `Sitemap:` directive.

4) Schema JSON-LD
   - Inject/update base graph (Organization/LocalBusiness, Person, WebSite, WebPage) via inline `<script type="application/ld+json">`.
   - Page-specific: Article (blog posts), Book (books page and/or individual books), Service (web-development/services), BreadcrumbList where helpful.

5) Structure + Links
   - Add “Key Takeaways” and, where useful, “FAQ” mini-sections per page.
   - Ensure in-body HTML links between core pages; avoid JS-only navigation dependencies.

6) E-E-A-T Enhancements
   - Confirm Author info on About; connect schema (Person linked to Organization).
   - Add visible last-updated timestamps on long pages (and dateModified in schema).

7) QA + Validation
   - Validate schema with Rich Results Test / schema.org validator.
   - Spot-check pages with JS disabled (content discoverable).
   - Confirm sitemap and llms.txt reachable at root URLs.

Roll-forward Protocol
- Keep changes minimal per page; do not introduce new features.
- After each page edit, update this plan (progress) and `TRUTH-REFACTOR.md`.
- Maintain consistent tone and truthfulness with current offerings.

Open Questions
- Should Web Development pages expose detailed Service/Offer schema now (with rates) or keep as Service descriptions without offers?
- Should Books page include Book + Offer schema for each book with marketplace links (Amazon .com/.ca)?
- What subset of blog posts should be prioritized in `/llms.txt` as “best of” citations?

Changelog
- v0.2: Adapted for The Chatbot Genius (site structure, artifacts, schema types, exclusions).
- v0.1: Initial plan (other site).

Progress Log
- [2025-08-30] v0.2 plan created and adapted for The Chatbot Genius (scope, deliverables, exclusions). File added to repo.
- [2025-08-30] Mobile navigation fixes completed across pages; not part of LLMO scope but improves crawlable content access on mobile.
- [2025-08-30] Test run on about.html: added Key Takeaways section, internal links block, visible Last updated timestamp, and connected JSON-LD graph (Organization, Person, WebSite, WebPage). Validated structure & no functional regressions.

Next Actions
- Inventory pages and draft initial `/llms.txt` candidates with one-line summaries.
- Validate existing `sitemap.xml` coverage and add any missing core pages.
- Define base JSON-LD graph (LocalBusiness/Person/WebSite/WebPage) for index/about/books and prepare snippet template.
 - If approved, roll out Key Takeaways + base JSON-LD to Books, Projects, Web Dev, AI News.
