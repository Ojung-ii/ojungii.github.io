# ojungii.com

Junghyun Oh의 연구자 포트폴리오 사이트입니다. 별도 빌드 과정이 없는 정적 HTML/CSS/JavaScript 구조이므로 GitHub Pages의 저장소 루트에서 바로 배포할 수 있습니다.

## 주요 기능

- 한국어 / 영어 전환 및 사용자 선택 저장
- Day / Night 모드, 시스템 테마 자동 감지 및 사용자 선택 저장
- 데스크톱·태블릿·모바일 반응형 레이아웃
- GraphRAG 연구, 프로젝트, 경력, 수상 이력 구성
- 모바일 메뉴, 현재 섹션 표시, 스크롤 애니메이션
- 키보드 포커스, 본문 바로가기, reduced-motion 등 접근성 처리
- Open Graph 이미지, sitemap, robots.txt, web manifest, 404 페이지 포함

## 파일 구성

```text
.
├── index.html              # 사이트 콘텐츠 및 구조
├── 404.html                # GitHub Pages용 오류 페이지
├── CNAME                   # ojungii.com 사용자 지정 도메인
├── .nojekyll               # Jekyll 처리 비활성화
├── README.md
├── robots.txt
├── sitemap.xml
├── site.webmanifest
└── assets/
    ├── styles.css           # 전체 디자인 및 반응형 스타일
    ├── script.js            # 언어·테마·모바일 메뉴·스크롤 동작
    ├── favicon.svg
    └── og-image.png         # 링크 공유 미리보기 이미지
```

## 로컬에서 확인

압축을 푼 디렉터리에서 다음 명령을 실행합니다.

```bash
python -m http.server 8000
```

브라우저에서 `http://localhost:8000`을 엽니다. HTML 파일을 직접 더블클릭하는 것보다 로컬 서버로 확인하는 편이 경로 동작까지 정확히 검증할 수 있습니다.

## 콘텐츠 수정

- 소개, 연구, 프로젝트, 경력, 수상, 연락처: `index.html`
- 색상, 여백, 폰트, 반응형 레이아웃: `assets/styles.css`
- 언어·테마·메뉴 동작: `assets/script.js`
- 사용자 지정 도메인: `CNAME`

한국어와 영어 문구는 동일 요소의 `data-ko`와 `data-en` 속성으로 관리합니다.

```html
<span data-ko="대표 연구" data-en="Selected research">대표 연구</span>
```

논문이나 프로젝트를 갱신할 때는 두 언어 문구를 함께 변경합니다.

## 기존 GitHub Pages 저장소에 배포

대상 저장소: `Ojung-ii/ojungii.github.io`

### 방법 A: Git 명령 사용

```bash
git clone https://github.com/Ojung-ii/ojungii.github.io.git
cd ojungii.github.io
git switch -c feat/bilingual-portfolio
```

이 프로젝트의 파일을 저장소 루트에 복사한 뒤, 아래처럼 필요한 경로만 명시하여 커밋합니다.

```bash
git add -- .nojekyll 404.html CNAME README.md index.html robots.txt sitemap.xml site.webmanifest assets
git commit -m "Build bilingual research portfolio"
git push -u origin feat/bilingual-portfolio
```

GitHub에서 `feat/bilingual-portfolio` → `main` Pull Request를 만들고 내용을 확인한 다음 병합합니다.

### 방법 B: GitHub 웹 화면 사용

1. `Ojung-ii/ojungii.github.io` 저장소에서 새 브랜치 `feat/bilingual-portfolio`를 만듭니다.
2. **Add file → Upload files**에서 압축을 푼 파일과 `assets` 폴더를 저장소 루트에 업로드합니다.
3. 기존 `index.html`을 새 파일로 교체합니다.
4. Pull Request를 만들어 검토한 뒤 `main`에 병합합니다.

## GitHub Pages 설정 확인

저장소의 **Settings → Pages**에서 다음을 확인합니다.

```text
Source: Deploy from a branch
Branch: main
Folder: /(root)
Custom domain: ojungii.com
Enforce HTTPS: enabled
```

이 프로젝트에는 `CNAME`이 포함되어 있지만, GitHub Pages의 **Custom domain** 설정도 `ojungii.com`으로 유지되어야 합니다. 기존 도메인이 이미 GitHub Pages 저장소에 연결되어 있다면 일반적으로 콘텐츠 교체만으로 동일 주소를 계속 사용할 수 있습니다.

## 공개 전 확인할 항목

- `ojh7839@o.cnu.ac.kr`, LinkedIn, DBLP 링크가 현재 사용하는 주소인지
- StAR의 논문·코드·포스터 링크 추가 여부
- GRef-RAG의 심사 상태와 공개 가능 범위
- 학위 예정일, 수상 명칭, 프로젝트 설명의 최신성
- GitHub Pages 배포 후 `https://ojungii.com`과 모바일 화면
