# v10 — Site-wide readability and visual hierarchy audit

## Scope
This pass reviews the *public site* and its interactive components: homepage, research and projects indexes, about, five research pages, five applied-project pages, 404, and the dynamic project viewer (valid / missing entry states). The editorial admin at `/admin-0225/` is intentionally excluded: it is not part of the visitor-facing portfolio.

## Reproduced bug
The 17 October screenshot shows two scientific figure tabs crushed into narrow columns. The code used `<span class=story-num>FIGURE ...</span>` followed by a long title **as a second flex item in the same row**. `align-items:center` and a shrinking flex child made Korean characters stack vertically. Merely decreasing the font size would conceal rather than fix the layout.

## Changes applied
- Stacked figure **metadata / concise title / 01–NN counter** in separate block-level children.
- Rewrote figure tab labels for **41 stages across 10 research/project pages** in Korean and English, retaining full paper figure descriptions in the panel and accessible tab label.
- Desktop: two to four visible tabs use equal-width grid columns. Five or more use a scrollable rail with fixed readable minimum widths. On mobile, cards remain readable and horizontally scroll rather than shrinking.
- Updated font/line-height/word wrapping for homepage hero, bibliography entries, research/projects cards, award and timeline sections, process notes, buttons, navigation, hero summaries, tags, metadata, figure metrics, and project evidence pages.
- Prevented child flex/grid items from violating their card container width; retained long research titles without ellipsis or silent content removal.
- Preserved the underlying manuscript-grounded diagrams, scientific metrics, all project figures, and domain-specific interactive demonstrations.

## Validation
- `Site sanity`: JS syntax and integration for 10 detail pages.
- `Visual design smoke`: 10 detail pages × 1440/390px; step navigation, interaction demos, language and theme switching.
- `Sitewide readability`: **17 public URL variants × 1440/768/390px**; bilingual and dark/light; checks page horizontal overflow, figure-tab metadata/title/counter overlap, too-narrow tabs, clipped text and JavaScript exceptions. Captures **34 browser screenshots**.
- Includes public CMS project viewer with and without an `id` parameter.
- Automated checks do not certify subjective visual aesthetics. Final human review of the screenshot artifact and copy editing remains appropriate before deployment.

## Deliberate exceptions
- Horizontal scrolling **inside** interactive figure canvases and multi-stage figure tab rails is intentional at small screen sizes and does not cause page-wide overflow.
- Original paper graphics are **site-native explanatory reconstructions**; they are not represented as pixel-perfect source artwork.
- The private editorial admin interface is out of public-portfolio scope.
