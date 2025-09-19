## PROJECT CONTEXT
- Platform: The Chatbot Genius Blog
- Output: Blog post (HTML) with metadata, SVG header image, SEO-ready
- Word Count Target: 800–1000 words (flexible, not strict)
- Voice: Conversational, personal, reflective, engaging

---

## AGENT WORKFLOW

### Step 1: Researcher Agent
- Input: Topic or link
- Output File: `blog_research.md`
- Responsibilities:
  - Collect facts, stats, examples, sources
  - Suggest possible story angles
  - Provide keywords/phrases for SEO
- Notes:
  - No prose writing
  - Only bullet notes and sources

---

### Step 2: Writer Agent (Draft)
- Input Files: `blog_research.md`
- Output File: `blog_draft.md`
- Responsibilities:
  - Write 800–1200 words in author’s voice
  - Use personal anecdotes + research
  - Add headings, subheadings, CTA
  - Place **TL;DR summary** at top
- Notes:
  - Draft only — not polished
  - Maintain authentic tone

---

### Step 3: Developmental Editor Agent
- Input File: `blog_draft.md`
- Output File: `blog_dev_notes.md`
- Responsibilities:
  - Provide big-picture feedback
  - Check structure, flow, clarity
  - Identify gaps, redundancies, weak transitions
  - Recommend improvements
- Notes:
  - No sentence-level edits
  - Feedback only, actionable and constructive

---

### Step 4: Editor Agent
- Input Files: `blog_draft.md`, `blog_dev_notes.md`
- Output File: `blog_edit.md`
- Responsibilities:
  - Line edit for clarity, grammar, readability
  - Adjust headings/subheadings for SEO/scannability
  - Smooth transitions, trim redundancies
  - Ensure tone remains conversational/personal
- Notes:
  - Preserve the author’s style
  - Keep length close to draft unless bloaty

---

### Step 5: Writer Agent (Polish)
- Input Files: `blog_edit.md`
- Output File: `blog_final.md`
- Responsibilities:
  - Perform final pass in the same author voice
  - Incorporate editor’s adjustments smoothly
  - Strengthen hooks and transitions
  - Confirm consistent tone throughout
- Notes:
  - Publication-ready version
  - This is the authoritative draft

---

## PUBLISHING PIPELINE

### Step 6: HTML Generation
- Convert `blog_final.md` → HTML
- Insert consistent site header/footer
- Add SEO meta description + Open Graph tags
- Save as `/blog/[slug].html`

---

### Step 7: Image Creation
- Generate SVG header image (`1200x630px`)
- Save to `/blog/images/[slug]-header.svg`
- Ensure readable text and consistent site aesthetic
- Write descriptive alt text that explains what's shown in the image

---

### Step 8: Data Update
- Update `blog-posts-data.js`
  - Add entry with title, excerpt, date, image, DESCRIPTIVE alt text, URL, sortDate
  - Alt text must describe what's IN the image (e.g., "Flowchart showing AI workflow stages")
  - NOT generic text like "AI-generated illustration" or "Image for this article"
- Insert new entry at BEGINNING of array

---

### Step 9: Deployment
```bash
git add .
git commit -m "Add blog post: [Title]"
git push
QUALITY CHECKS
✅ Word count within 800–1000 (flexible)

✅ TL;DR summary present at top

✅ Voice matches sample (conversational, reflective)

✅ SEO fields populated (keywords, meta, descriptive alt text that explains image content)

✅ Header image 1200x630px, consistent design

✅ blog-posts-data.js updated correctly

✅ Blog page loads dynamically, no manual edits to blog.html

FILE STRUCTURE
bash
Copy code
/blog/
├── your-post-slug.html
├── images/
│   └── your-post-slug-header.svg
├── blog_research.md
├── blog_draft.md
├── blog_dev_notes.md
├── blog_edit.md
├── blog_final.md
/blog-posts-data.js
/blog.html
