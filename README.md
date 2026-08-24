# ojungii.com — Research Portfolio v6

Junghyun Oh(오정현)의 공개용 연구자 포트폴리오입니다. 별도 빌드 과정 없이 GitHub Pages 루트에서 배포되는 정적 HTML/CSS/JavaScript 사이트입니다.

## 주요 구성

- 홈을 `연구 포지셔닝 → 검증된 성과 → 대표 연구 → case studies → 프로필 → 연락` 흐름으로 재구성
- 메인 페이지의 force-directed dynamic network graph
  - 중앙 `JH.Oh`와 연구·프로젝트·학력·수상·Contact·Scholar·LinkedIn 노드
  - 카테고리 선택 시 세부 노드 확장
  - 노드 드래그, hover 관계 강조, detail-node navigation
  - 카테고리 간 교차 관계선으로 star 구조 완화
- 별도 `Research`, `Projects`, `About & Bio` 페이지
- 프로젝트별 상세 case study
  - ScienceON AI Challenge / MPR-CiteG
  - Alibaba Multilingual Product Search
  - Steel Specification Review RAG
  - Sentinel-based Blue Carbon Monitoring
  - Bio-AI competition award record
- 한국어/영어 전환과 Light/Dark 모드 유지
- LinkedIn 직접 링크와 QR 코드
- JSON-LD Person/ProfilePage, Open Graph, sitemap, robots, manifest
- 키보드 포커스, skip link, reduced motion, 24px 이상 인터랙션 타깃
- 모바일 메뉴와 반응형 case-study 레이아웃

## 공개용 편집 원칙

- 전화번호, 고등학교, 어학점수, 자격증 전체 목록, 자기평가형 skill bars는 메인 사이트에서 제외
- 연구·직무 정체성과 직접 연결되는 결과만 전면 배치
- 수상명보다 문제·역할·방법·결과의 연결을 우선
- 팀 프로젝트는 공개 자료에서 개인 역할이 확인되는 범위만 기재
- Alibaba 순위는 공개 기술보고서 기준으로 표기
- 동일 이름 연구자가 병합된 DBLP author profile은 제거하고 StAR 개별 레코드만 연결
- BioAI는 확인 가능한 3위 수상 결과와 참여 맥락만 공개하고 비공개 기술 세부는 추정하지 않음

## 사진 교체

현재 페이지는 GitHub 공개 프로필 이미지를 사용하며 로딩 실패 시 `assets/profile-fallback.svg`를 표시합니다.

정식 프로필 사진을 사용할 때:

1. `assets/profile.jpg`를 추가합니다.
2. `index.html`과 `about/index.html`에서 아래 URL을 `/assets/profile.jpg`로 교체합니다.

```text
https://avatars.githubusercontent.com/u/112710022?v=4
```

권장 사진:
- 세로 4:5
- 1600 × 2000px 이상
- 자연광 또는 단색 배경
- 얼굴과 상반신이 충분히 크게 보이는 연구자/비즈니스 프로필

## 파일 구조

```text
.
├── index.html
├── research/index.html
├── about/index.html
├── projects/
│   ├── index.html
│   ├── steel-rag/index.html
│   ├── blue-carbon/index.html
│   ├── alibaba-search/index.html
│   ├── scienceon-mpr-citeg/index.html
│   └── bioai/index.html
├── assets/
│   ├── styles.css
│   ├── script.js
│   ├── network.js
│   ├── linkedin-qr.png
│   ├── profile-fallback.svg
│   ├── favicon.svg
│   └── og-image.png
├── 404.html
├── sitemap.xml
├── robots.txt
├── site.webmanifest
├── CNAME
└── .nojekyll
```

## 로컬 확인

```bash
python -m http.server 8000
```

브라우저에서 `http://localhost:8000`을 엽니다.

## 기존 GitHub Pages 저장소에 배포

저장소 루트에서 v6 파일을 덮어쓴 뒤:

```bash
git status --short
git add -- .nojekyll 404.html CNAME README.md index.html robots.txt site.webmanifest sitemap.xml assets about research projects
git commit -m "feat: add dynamic portfolio network graph"
git push origin main
```

GitHub의 `Settings → Pages`는 다음을 유지합니다.

```text
Source: Deploy from a branch
Branch: main
Folder: / (root)
Custom domain: ojungii.com
Enforce HTTPS: enabled
```

## 배포 전 최종 확인

- GitHub 프로필 이미지가 공개용 사진으로 적절한지
- BioAI의 문제 정의, 본인 역할, 방법론, 결과 자료 보강 여부
- Alibaba 개인 역할을 더 구체적으로 공개할 수 있는지
- ScienceON 개인 역할을 더 구체적으로 공개할 수 있는지
- StAR paper/poster/code의 최종 공개 링크
- GRef-RAG 심사 상태와 공개 가능 범위
- 학위 예정일과 이메일 주소
