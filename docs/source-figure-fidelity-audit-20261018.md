# Source-to-figure fidelity review (18 Oct 2026)

## What was wrong
The previous site **did not directly embed original PPT/PDF figures**. It converted much of the material into shared, stylized pipelines and tabbed explanations. Those were legible but flattened crucial differences between *original human work*, *2023 PoC*, *2024 operator workflow*, and *field validation*. For StAR, a 2D disk illustrated hierarchy but did not explicitly visualize radial depth in 3D. We preserve the original explanatory paper elements instead of treating every slide as another process diagram.

## Exact source crosswalk: Steel RAG (48+22 slides inspected)
| Original material | What the slide actually shows | Website correction |
|---|---|---|
| 2023 interim slide 9 | **Request review → customer specification review → production feasibility review → final review document** (4 phases, large blue directional arrow) | Leading interactive 4-phase original business workflow, emphasis on the *specification review* stage |
| 2023 interim slide 10 | Manual spec review: check grade/tests/standards/composition → extract needed content → enter Excel review form | Three grounded human activity cards with the automation touchpoint |
| 2023 interim slide 14 | Two hours / human error concerns in document inspection | Explain pain and impact as *reported motivation*, not prospectively measured uptime |
| 2023 interim slide 20 | Streamlit web / vector DB / ChatGPT path mapped into broader manufacturing work | Retain the existing original 2023 PoC architecture illustration, secondary to the actual work |
| 2023 interim slides 29–35 | Structured tables, PDF parsing, before/after demonstration | Existing detailed explanation retained; no customer-specific screenshot published |
| 2024 May slide 5 | Distinct visual regions: Unstructured.io OCR/text/table; summaries/originals; vector search; context learning; two Excel modes | Keep the existing pipeline as supporting evidence; avoid mislabeling it as a full replacement for human feasibility judgment |
| 2024 May slides 10–17 | **Seven exact user actions** from documents folder to main.py, 1/0 parsing, priority, steel type, export mode, search+Excel | New source-faithful selectable seven-stage operator flow |
| 2024 May slides 18–21 | Successful AND failed examples, cause analysis, field evaluation still requested | Retain honest verification caveat; do not call field QA complete |

**Original style retained in revised graphics:** broad navy/blue step emphasis, staged directional story and a highlighted bottleneck; operational inputs/outputs use clearly bounded cards. Page inherits modern site type and colors rather than screenshot-scale small PPT type.

**Permission/sensitivity decision:** The original decks contain internal client-specific screenshots. We did **not** publish raw PPT images, customer documents, or confidential material to GitHub Pages without specific clearance. The website now presents a faithful, interactive public-safe reconstruction with source slide numbers, not a cropped screenshot mislabeled as public art.

## StAR: original paper versus explanation
- Paper Figure 1 (page 1) contrasts Euclidean vs hyperbolic hierarchy preservation; Figure 2 (page 2) shows the retriever, graph features, hyperbolic scoring and adaptive gating.
- Website's existing figure-viewer remains untouched.
- New bottom-of-page illustration displays **Lorentz-model hyperboloid coordinates** as a rotatable 3D screen projection, with independent depth (1–6) and curvature magnitude (0.4–2.0) sliders.
- Mathematically: `H²(-c): −t²+x²+y² = −1/c; K = −c`, with `(x,y) = sinh(√c r)/√c (cos θ,sin θ)`, `t = cosh(√c r)/√c`. Intrinsic radial circumference `2π sinh(√c r)/√c` versus Euclidean `2πr`.
- **Critical distinction:** Intrinsic curvature does not increase with tree depth. Depth increases radial distance and the available circumference. A Euclidean-looking 3D surface *cannot* be interpreted as intrinsic hyperbolic curvature without specifying Minkowski metric. The UI explicitly says the rendering is a conceptual projection, not empirical model embeddings or paper's measured plotted coordinates.

## Other originals available and checked
- GRef-RAG manuscript PDF: Figure 1 birth-year evidence case, Figure 2 two-stage global/local retrieval, Table 1 shared-prompt comparison. Existing paper detail and interactive source-specific cases should remain; do not add a 3D ornament to a retrieval method.
- MoT v2 PDF: token-level translators and Context Correction, 10-agent memory/correctness example, Figure 13 agent count and Figure 14 long-context evaluation. Prefer metric-specific comparisons and the actual cache-translation lifecycle.
- MPR-CiteG paper PDF: Q query expansion / S synonym / F focus-balanced / G Korean–English translation and candidate reranking + citation grounding. Keep the Q/S/F/G corrections; no repeated architecture is necessary on the ScienceON *competition* page.
- Blue Carbon 2023 SBS presentation: slides 17–21 interface/SAR time series, slides 22–23 RVI/NDVI/FAI and charts, slides 24–25 vegetation (2020–21) / aquaculture (2020) **different** before/after dates. Keep these separate rather than depict all map regions as equally official park-managed conservation.
- BioAI DILAB presentation: slides 6 and 15 have *different* frameworks (odor multilabel vs hepatocyte clearance regression). Slides 11–13 distinguish model-stage comparisons; slides 22–23 show interpretability examples.
- The **original RAM-GNN paper/figure file was not among the currently mounted source PDFs/slides** and could not be confidently recovered via file search. We retain prior documented descriptions, without asserting a fresh original Figure audit.
- Alibaba original technical-report PDF not in the mounted input set in this turn. Do not imply a verified pixel-level original audit.

## Strategic sorting versus chronology
- Research highlighted by **verified individual authorship and the nature of contribution**: StAR (SIGIR 2026 first author) → GRef-RAG (core thesis, under review) → MoT (co-first) → RAM-GNN (submitted) → MPR-CiteG (collaborative workshop paper).
- Projects highlighted by **applied AI/RAG role fit, individual responsibility and credible team outcomes**: Steel RAG (team lead) → ScienceON (2nd place + paper) → Alibaba (multilingual IR) → Blue Carbon (field PM) → BioAI.
- Those are **not a timeline**; years remain visible. About/Journey provides chronological ordering. Research and project indexes now explicitly say this.

## Remaining source-image decision
For the public website the most defensible use of source materials is to reproduce user workflows and select consequential original **public** figures at a legible scale, not blindly post all internal PPT slides. Actual satellite image pairs and unredacted customer Excel/screenshots should be embedded only after confirming rights and redacting any client-sensitive information.