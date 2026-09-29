# 게시물 작성 문법

새 글은 `content/posts/글주소.md`에 작성합니다. JS 객체나 `type: 'paragraph'`는 직접 쓰지 않습니다. 저장하면 개발 서버가 자동으로 변환하고, 배포용 빌드도 변환을 먼저 실행합니다. 기존 게시물 세 개도 이 형식으로 옮겨져 있습니다.

## 가장 작은 예제

````md
---
title: 맥스웰 방정식 첫걸음
date: 2026-09-29
summary: 네 방정식의 의미를 간단히 살펴봅니다.
folder: 전자기학
tags: 맥스웰, 전자기학
---

여기에 글을 쓰면 자동으로 문단이 됩니다. 빈 줄을 넣으면 새 문단이 됩니다.
문단 안의 줄바꿈은 한 문단으로 이어집니다. 인라인 수식은 \( E = mc^2 \)처럼 씁니다.

## 가우스 법칙

$$
\nabla \cdot \mathbf E = \frac{\rho}{\varepsilon_0}
$$

수식 번호는 자동으로 붙습니다.
````

파일 이름이 기본 글 주소(`slug`)입니다. 예를 들어 `content/posts/maxwell-intro.md`의 주소는 `#/posts/maxwell-intro`입니다. 파일 이름에는 영문 소문자, 숫자, 하이픈만 쓰세요. 메타데이터에 `slug: 다른-주소`를 지정할 수도 있습니다. `title`, `date`, `summary`, `folder`는 필수이고, `tags`는 쉼표로 구분하는 선택 항목입니다. `date`는 `YYYY-MM-DD` 형식입니다. `folder`가 기존 폴더 이름과 같으면 그 폴더에 들어가고, 새로운 이름이면 새 폴더가 만들어집니다.

## 문단과 인라인 문법

특별한 표시가 없는 글은 모두 문단입니다. `**굵게**`, `*기울임*`, `` `짧은 코드` ``, `[링크](https://example.com)`을 쓸 수 있습니다. 내부 글 링크는 `[글 보기](#/posts/maxwell-intro)`처럼 씁니다. 인라인 LaTeX는 `\( \alpha + \beta \)` 또는 `$\alpha + \beta$`를 사용합니다. HTML이나 일반 Markdown의 모든 확장 문법을 지원하는 것은 아닙니다.

수식에서는 **역슬래시를 한 번만** 씁니다. Markdown 원본에 `\frac{a}{b}`라고 적으면 됩니다. JS 문자열처럼 `\\frac{a}{b}`로 이중 입력하지 마세요. 변환기가 JS 파일을 만들 때 필요한 이스케이프를 자동 처리합니다.

## 자주 쓰는 블록

아래의 `md` 예시들은 게시물 본문에 그대로 넣으면 됩니다.

### 제목과 구분선

````md
## 큰 소제목
### 작은 소제목
#### 더 작은 소제목

---
````

글의 큰 제목(`#`)은 위 메타데이터의 `title`에서 자동으로 표시하므로 본문은 `##`부터 시작합니다.

### 수식

````md
$$\mathbf F = m\mathbf a$$

$$
\nabla \times \mathbf E = -\frac{\partial \mathbf B}{\partial t}
$$
````

`$$...$$`는 자동 번호가 붙는 수식입니다. 긴 수식은 화면 폭에 맞춰 축소되다가, 최소 크기 이하로 줄여야 할 때 수식 영역에 가로 스크롤이 생깁니다.

번호를 숨기거나 표시 방식을 지정할 때만 명시적 블록을 씁니다. `mode`는 `full`(기본값), `fit`, `scroll` 중 하나입니다.

````md
:::math numbered=false mode=full
\frac{a}{b} = c
:::

:::math-row
$$\nabla \cdot \mathbf B = 0$$
$$\nabla \cdot \mathbf D = \rho$$
:::
````

`math-row`의 각 수식에는 번호가 하나씩 붙습니다. 필요하면 시작 줄에 `numbered=false`, `mode=fit`, `wrap=false` 등을 붙일 수 있습니다. `math-row`에는 수식을 두 개 이상 넣고 각 수식을 `$$...$$`로 감싸세요. 여러 줄 수식은 여는 `$$`와 닫는 `$$`를 각각 단독 줄에 둡니다.

### 목록, 표, 코드, 이미지

````md
- 첫 번째 항목
- 두 번째 항목

1. 첫 번째 단계
2. 두 번째 단계

| 기호 | 뜻 |
| --- | --- |
| E | 전기장 |

```js numbers
const field = 'E';
```

![이미지 설명](/images/example.png "선택적 캡션")
````

코드 블록에서 `numbers`는 줄 번호를 표시합니다. 이미지는 `content/images/example.png`에 놓고 `/images/example.png`로 참조할 수 있습니다. 표의 각 행은 머리글과 열 개수가 같아야 합니다. 표 셀 안의 `|` 이스케이프나 중첩 목록은 현재 지원하지 않습니다.

표 아래에 캡션을 붙이려면 표를 다음처럼 감쌉니다.

````md
:::table 연산자 비교
| 연산자 | 의미 |
| --- | --- |
| Gradient | 증가 방향 |
:::
````

### 접기, 나란한 문단, 이미지 행

````md
:::details 자세한 풀이
접었을 때 숨길 문단입니다.

$$x^2 + y^2 = r^2$$
:::

:::columns
왼쪽에 놓을 문단입니다.

오른쪽에 놓을 문단입니다.
:::

:::image-row
![첫 번째](/images/a.png "그림 A")
![두 번째](/images/b.png "그림 B")
:::
````

`details` 안에는 일반 문단과 다른 블록을 넣을 수 있습니다. `columns`는 빈 줄로 문단을 구분하며 문단 두 개 이상이 필요합니다. `image-row`에는 이미지 줄만 넣습니다. `:::`로 시작한 블록은 반드시 `:::`로 닫으세요.

## 변환과 확인

```bash
npm run dev          # 시작할 때 변환, .md를 저장하면 다시 변환
npm run posts:build  # Markdown → src/data/generatedPosts.js 수동 변환
npm run test:grammar # 문법 테스트
npm run build        # 배포 빌드 전 자동 변환
```

`src/data/generatedPosts.js`는 자동 생성 파일이므로 직접 수정하지 않습니다. 문법 오류가 있으면 파일명과 줄 번호가 출력됩니다. 새 글을 추가한 뒤에는 `.md` 원본과 자동 생성된 JS를 함께 커밋하세요. 글 주소가 다른 게시물과 겹치지 않도록 주의하세요.

## 새 글 게시하기

1. `content/posts/my-new-post.md`를 만들고, 위 예제처럼 맨 위 메타데이터와 본문을 작성합니다. 기존 글 세 개도 같은 폴더의 예제로 볼 수 있습니다.
2. 이미지가 있으면 `content/images/`에 넣고 본문에서 `/images/파일명`으로 참조합니다. 실제 사이트에서는 빌드가 이미지 URL을 자동으로 만들어 줍니다.
3. `npm run dev`로 미리 보거나 `npm run build`로 빌드를 확인합니다. 저장할 때와 빌드할 때 `src/data/generatedPosts.js`가 자동 갱신됩니다.
4. 아래 명령으로 원본 Markdown, 이미지, 생성된 JS를 올립니다.

```bash
git add content/posts content/images src/data/generatedPosts.js
git commit -m "Add new post"
git push origin main
```

`main`에 push하면 `.github/workflows/deploy.yml`이 GitHub Pages로 자동 배포합니다. `dist/`는 빌드 결과라 Git에서 제외되어 있으므로 직접 올릴 필요가 없습니다. 게시물 외의 코드나 문서도 수정했다면 커밋 전에 `git status`를 확인하고 해당 파일도 `git add`하세요.
