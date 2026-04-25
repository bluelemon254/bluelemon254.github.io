export const vectorCalculusGradientDivergenceCurlPost = {
  slug: 'vector-calculus-gradient-divergence-curl',
  title: 'Gradient, Divergence, Curl 한 번에 정리',
  date: '2026-04-15',
  summary:
    '스칼라장과 벡터장에서 자주 쓰이는 세 연산자의 의미를 물리적 해석과 함께 정리합니다.',
  tags: ['벡터미적분학', 'gradient', 'curl'],
  content: [
    {
      type: 'paragraph',
      text: 'Gradient는 가장 빠르게 증가하는 방향을, Divergence는 유출입의 세기를, Curl은 회전 경향을 측정합니다.'
    },
    {
      type: 'paragraph',
      text: '세 연산자는 형태가 비슷해 보여도 입력과 출력의 타입이 다르므로 어떤 장에 적용하는지 항상 먼저 확인해야 합니다.'
    },
    {
      type: 'math',
      mode: 'full',
      value: '\\nabla \\cdot (\\nabla \\times \\mathbf{F}) = 0'
    },
    {
      type: 'paragraph',
      text: '수식 표시 모드는 상황에 맞게 선택할 수 있습니다. full은 전체 폭, scroll은 가로 스크롤, row는 여러 박스를 한 줄에 배치합니다.'
    },
    {
      type: 'math',
      mode: 'scroll',
      value:
        '\\sum_{k=1}^{n} \\left(\\frac{1}{k} + \\frac{1}{k+1} + \\frac{1}{k+2}\\right)^2 = \\frac{1}{36} \\left(6 H_{n}^{(2)} + 6 H_{n+1}^{(2)} + 6 H_{n+2}^{(2)} + 4 H_{n} + 4 H_{n+1} + 4 H_{n+2}\\right)'
    },
    {
      type: 'math',
      layout: 'row',
      values: [
        { mode: 'fit', value: '\\nabla f' },
        { mode: 'fit', value: '\\nabla \\cdot \\mathbf{F}' },
        { mode: 'fit', value: '\\nabla \\times \\mathbf{F}' }
      ]
    },
    {
      type: 'image',
      src: '/Figure_2.png',
      alt: '벡터장 시각화 Figure 2',
      caption: 'Figure 2. 벡터장 흐름과 회전 성분 예시'
    },
    {
      type: 'code',
      language: 'python',
      showLineNumbers: true,
      code: `import numpy as np

# 2D 벡터장 F(x, y) = (y, -x)
def F(x, y):
    return np.array([y, -x])

point = np.array([1.0, 2.0])
print("F(point) =", F(*point))`
    },
    {
      type: 'paragraph',
      text: '유체나 전자기학 문제를 풀 때 각각의 연산자가 어떤 물리량을 설명하는지 연결해두면 계산이 훨씬 명확해집니다.'
    }
  ]
};
