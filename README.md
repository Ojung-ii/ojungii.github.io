# ojungii.com — AI Research Portfolio v7

Junghyun Oh(오정현)의 공개용 AI 연구자 포트폴리오입니다. 별도 빌드 과정 없이 GitHub Pages 루트에서 배포되는 정적 HTML/CSS/JavaScript 사이트입니다.

## 포지셔닝

- 메인 정체성: **AI Researcher**
- 차별화 축: **Graph-based Learning · Retrieval · Reasoning**
- 주요 연구: **Graph Neural Networks / GraphRAG / Information Retrieval / LLM Reasoning & Evaluation**
- Research Engineering: **PyTorch / vLLM / LLM inference / experiment & evaluation pipelines**

GraphRAG를 단독 정체성으로 두지 않고, Graph Neural Networks부터 GraphRAG·Retrieval·LLM evaluation까지 이어지는 graph-based AI 전문성을 보여주도록 구성했습니다.

## Dynamic Navigator

메인 페이지의 force-directed dynamic network graph는 v6 구조와 동작을 그대로 유지합니다.

- 중앙 `JH.Oh`
- 연구·프로젝트·학력·수상·Contact·Scholar·LinkedIn 카테고리
- 카테고리 선택 시 detail node 확장
- drag, hover relationship highlight, detail navigation
- category cross-links

## 주요 페이지

- `/` — AI Researcher positioning, dynamic navigator, research profile, selected research/projects
- `/research/` — Graph Learning / Retrieval & RAG / LLM Reasoning & Evaluation / Research Engineering, publications
- `/projects/` — Applied AI case studies
- `/about/` — profile, short bio, education/research path, awards, technical keywords

## 배포

```bash
git status --short
git add -- .nojekyll 404.html CNAME README.md index.html robots.txt site.webmanifest sitemap.xml assets about research projects
git commit -m "feat: reposition portfolio as broad AI research profile"
git push origin main
```

## GitHub Pages

```text
Source: Deploy from a branch
Branch: main
Folder: / (root)
Custom domain: ojungii.com
Enforce HTTPS: enabled
```
