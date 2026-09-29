import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parsePost } from './writingGrammar.mjs';

const header = `---
title: 수식 문법 테스트
date: 2026-09-29
summary: Markdown 게시물 테스트
folder: 전자기학
tags: 수학, 예제
---
`;

test('문단 기본값, LaTeX 역슬래시, 중첩 블록을 보존한다', () => {
  const source = header + String.raw`
일반 문단에 \( \frac{a}{b} \)가 있습니다.

$$
\nabla \cdot \mathbf E = \frac{\rho}{\varepsilon_0}
$$

:::math numbered=false mode=scroll
\int_0^1 x^2 \, dx
:::

:::math-row wrap=false
$$a=b$$
$$c=d$$
:::

:::details 더 보기
- 첫째
- 둘째

$$x=y$$
:::
`;
  const post = parsePost(source, 'math-test.md');
  assert.equal(post.slug, 'math-test');
  assert.deepEqual(post.tags, ['수학', '예제']);
  assert.equal(post.content[0].type, 'paragraph');
  assert.match(post.content[0].text, /\\frac\{a\}\{b\}/);
  assert.equal(post.content[1].value, String.raw`\nabla \cdot \mathbf E = \frac{\rho}{\varepsilon_0}`);
  assert.equal(post.content[2].numbered, false);
  assert.equal(post.content[2].mode, 'scroll');
  assert.deepEqual(post.content[3].values, ['a=b', 'c=d']);
  assert.equal(post.content[3].wrap, false);
  assert.equal(post.content[4].content[0].type, 'bullet-points');
  assert.equal(post.content[4].content[1].value, 'x=y');
});

test('Markdown 스타일 블록을 기존 게시물 데이터 형식으로 변환한다', () => {
  const source = header + [
    '## 소제목',
    '',
    '1. 하나',
    '2. 둘',
    '',
    '| 이름 | 값 |',
    '| --- | --- |',
    '| a | b |',
    '',
    '![설명](/image.png "캡션")',
    '',
    '```js numbers',
    'const x = 1;',
    '```',
    '',
    ':::columns',
    '왼쪽',
    '',
    '오른쪽',
    ':::',
    '',
    ':::image-row',
    '![A](/a.png)',
    '![B](/b.png)',
    ':::'
  ].join('\n');
  const post = parsePost(source, 'blocks.md');
  assert.deepEqual(post.content.map((block) => block.type), [
    'heading', 'enumeration', 'table', 'image', 'code', 'paragraph-columns', 'image-row'
  ]);
  assert.deepEqual(post.content[2].rows, [['a', 'b']]);
  assert.equal(post.content[4].showLineNumbers, true);
  assert.equal(post.content[6].images.length, 2);
});

test('잘못 닫힌 블록은 파일과 줄을 포함해 오류를 낸다', () => {
  assert.throws(() => parsePost(header + ':::details 제목\n내용', 'broken.md'), /broken\.md:\d+: details 블록을 닫는 :::가 없습니다/);
  assert.throws(() => parsePost(header + '$$\nx', 'broken.md'), /broken\.md:\d+: 수식을 닫는 \$\$가 없습니다/);
});

test('이전 게시물 3개가 Markdown으로 유지된다', async () => {
  const expected = [
    ['em-maxwell-eqs.md', 56, '전자기학'],
    ['vector-calculus-gradient-divergence-curl.md', 12, '벡터미적분학'],
    ['vector-calculus-line-integral-intuition.md', 3, '벡터미적분학']
  ];
  for (const [file, count, folder] of expected) {
    const source = await readFile(new URL(`../content/posts/${file}`, import.meta.url), 'utf8');
    const post = parsePost(source, file);
    assert.equal(post.content.length, count);
    assert.equal(post.folder, folder);
  }
  const gradientSource = await readFile(new URL('../content/posts/vector-calculus-gradient-divergence-curl.md', import.meta.url), 'utf8');
  const gradient = parsePost(gradientSource, 'vector-calculus-gradient-divergence-curl.md');
  assert.equal(gradient.content.find((block) => block.type === 'table').caption, '세 연산자의 입력/출력 타입과 물리적 해석 비교');
  assert.deepEqual(gradient.content.find((block) => block.type === 'image-row').images.map((image) => image.src),
    ['/images/Figure_2.png', '/images/folder_icon.webp']);
});
