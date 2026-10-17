# Portfolio visual design review — 2026-10-17

## Audit basis
Current `main` (after PR #2), author-provided manuscript/slide material, and StreamMA's **interaction principles** (step navigation, animation controls, visual explanation). This does not copy StreamMA source code, its actual experiments, or its visual assets.

## Shared issues corrected
1. **Typography:** fallback to uninstalled Pretendard / Inter made mixed Korean-English pages inconsistent. Load Noto Sans KR and Inter with `display=swap`, use OS fallbacks, Korean word-break control, font size and weight hierarchy.
2. **SVG scale:** original 720×380 diagrams shrank inside two-column layouts, making 14px labels visually ~8–10px. Assign a larger canvas, reformatted case layouts, controlled horizontal pan on narrow screens. Individual SVG cards truncate overlong words rather than forcing them beyond their boxes.
3. **Repetitive layouts:** narrative types now differ: StAR graph primer, GRef evidence case, MoT systems/process, RAM multilayer analysis, MPR citation; projects use operational flows and choices.
4. **Unresponsive interaction:** add next/previous, optional play/pause (disabled for reduced-motion users), keyboard-accessible figure navigation, distinct per-project demos, explicit notes separating concept sketches from measured results.
5. **Incomplete research entry:** independent `/research/mpr-citeg/` still used the legacy explorer; replace with a functioning paper figure viewer and link to it from the research list.

## Page-by-page review
| Page | Figure/evidence alignment | Distinct interactive experience | Follow-up limitation |
| --- | --- | --- | --- |
| StAR | SIGIR 2026 Fig. 1 geometry primer, Fig. 2 Lorentz/Q/C-graph and Spearman gate; reported ablations | Depth-driven hierarchical tree changes to illustrate exponential branching | Drawing uses Poincaré disk for intuition, not StAR's Lorentz implementation |
| GRef-RAG | EACL manuscript's real two-film comparison, global/local pipeline, context-vs-F1; author supplemental complete-bundle budget controls | 512/1024/2048 token matched-budget selector with **measured** macro ΔF1 | Supplemental budget result is labelled *post-review*, not retroactively claimed to be the original figure |
| MoT v2 | arXiv:2607.28979v2 main Figures 1–14 and appendix Figure groups 15–32 explained by method type | Translation-layer placement trade-off; token Top-K expert selector; optional figure tour | Appendix captions are grouped into an explanatory guide, **not** 18 pixel-matched figure reproductions |
| RAM-GNN | Occupational exposure + 5 MONET relations, node attention and reported macro outcomes | Illustrative per-occupation relation focus without invented real-world scores | Attention is not causal occupational risk |
| MPR-CiteG | CIKM scientific-retrieval paper Figure 1: query portfolios, sentence-level citation | Select an answer sentence to inspect its cited source | Source sentences are illustrative, not excerpts from private corpus |
| Steel RAG | 2023 midterm and 2024 enhancement (Unstructured.io, embedding, multilingual, Excel) | Phase comparison 2023 / 2024; actual options and limitations distinguished | Private client specifications not embedded |
| Blue Carbon | SBS Streamlit + GEE and satellite indices; before/after imagery from slide workflow | Inspect schematic earlier/later observations | Simulation does not produce real geolocation or change scores |
| ScienceON | CIKM multi-query portfolio and CiteG manuscript | Select grounded sentence and source | Examples illustrate citation mechanism |
| Alibaba | Technical report/portfolio: data refinement and multilingual QC/QI | Compare query–category vs query–item tasks | Hyperparameter and per-language statistics not invented |
| BioAI | 35-slide DILAB deck: 109 odor labels, F1/Jaccard GAT/fusion; drug clearance RFECV/QSAR | Swap two molecule inputs; switch between **reported** F1 and Jaccard | Team results separated from unverified individual task attribution |

## Checks
- `node --check` for original and new JavaScript files
- 10 page-specific source and script integrity checks
- Chromium browser checks at desktop 1440px and mobile 390px: load, SVG display, next/previous, demo, language toggle, dark mode, and screenshot export
- Review `detail-page-design-previews` artifact on the PR's **Visual design smoke** workflow once complete

## Visual review caveat
Automated viewport testing does not substitute for a human design review of all screenshots, final manuscript proofreading, or usability testing with real visitors. These remain the merge gate.
