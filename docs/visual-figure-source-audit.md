# Visual figure reconstruction — source audit (2026-10-17)

These are site-native explanatory SVG reconstructions, not extracted or redistributed paper figures. Any diagram labelled schematic or qualitative is **not** an experimental reproduction.

| Page | Grounded source | Reconstructed elements | Limitations |
| --- | --- | --- | --- |
| StAR | SIGIR 2026 camera-ready DOI 10.1145/3805712.3809897 | Figure 1 Euclidean vs hyperbolic intuition, Figure 2 Q-graph / C-subgraph / Lorentz / Spearman gating, ablations | Poincaré disk is *explanatory*; StAR's computations use the Lorentz model. |
| GRef-RAG | Author-supplied EACL short manuscript (12 pages) | Figure 1 Poola Rangadu vs Paganini Horror director/birth evidence, Figure 2 two phases and mention links, Figure 3 F1–context diagnostics | Figure 3 original numerical scatter coordinates unavailable; uses reported macro +1.77 F1 and −67.8% tokens. Manuscript under review. |
| MoT | arXiv 2607.28979v2 (44 pages, 2026-10-03, uploaded) | Figures 1–14: Llama-3.2/Gemma-3/Qwen-3 cross-family translation, accuracy 57.6%, F1 0.42, Figure 8 MoT/Context Correction, and agent/CAG scaling | Earlier Qwen2.5 results superseded; diagrams remain conceptual and do not plot invented numeric coordinates. |
| RAM-GNN | Author-supplied EPJ manuscript (25 pages) | Figure 1 network-mediated occupational exposure and Figure 2 MONET five relations / node-level attention | Schematic examples do not assert individual occupation risk or causal transmission. |
| ScienceON MPR-CiteG | Author-supplied CIKM RDGENAI paper | Figure 1 multi-portfolio query expansion Q/S/F/G, document rerank, answer with sentence-level citations | Sample source text is illustrative. |
| Alibaba product search | Website case page, author portfolio slide, technical-report metadata | Data quality, multilingual task tagging, LoRA system | Precise per-language ablations and original editable report diagram source not verified. |
| Steel RAG | 2023-10-11 midterm (48 slides) and 2024-05-10 enhancement meeting (22 slides), uploaded | 2023 Streamlit/Chroma/LLM PoC; 2024 Unstructured.io/GPT-3.5-Turbo embedding, EN/KR/JP, prioritized multi-doc, steel grade and two Excel export modes | Internal slides are used for reconstruction only; proprietary customer records not published. May 2024 handwriting OCR and field evaluation remained limitations. |
| Blue Carbon | 2023-11-29 SBS presentation (27 slides), uploaded | Taeanhaean National Park, Streamlit, GEE/geemap, Sentinel-1/2, time lapse, RVI/NDVI/FAI, vegetation and aquaculture change cases | Map-like SVGs remain conceptual and are not presented as actual raster observations. |
| BioAI | 2025 DILAB Bio-AI Convergence Competition result report (35 slides), uploaded | Problem 1 SMILES-pair odor multilabel with GAT/resMLP (F1 0.92, Jaccard 0.90); Problem 2 hepatocyte-clearance regression with descriptors/RFECV/SMARTS and model comparisons | Team-level results are documented; the presentation does not uniquely attribute each submodule to an individual. |

## Before merging
- Check all research labels against most recent manuscripts.
- Global KO/EN switching is supported for the story descriptions and figure explanations. Fixed technical labels in the SVGs remain in English.
- Test keyboard (ArrowLeft/ArrowRight/Home/End) and mobile widths.
- Preserve provenance labels distinguishing measured figures from explanatory schematics.
