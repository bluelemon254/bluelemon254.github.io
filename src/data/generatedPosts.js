// Generated from content/posts/*.md. Do not edit by hand.
export const generatedPosts = [
  {
    "slug": "em-maxwell-eqs",
    "title": "맥스웰 방정식",
    "date": "2026-04-26",
    "summary": "맥스웰 방정식과 관련된 개념을 정리한다.",
    "tags": [
      "전자기학",
      "Wave Eq",
      "Gauge",
      "Phasor"
    ],
    "folder": "전자기학",
    "content": [
      {
        "type": "paragraph",
        "text": "맥스웰 방정식은 4개지만, 독립적인 식은 사실 2개이다."
      },
      {
        "type": "math",
        "layout": "row",
        "mode": "full",
        "values": [
          "\\nabla \\times \\mathbf E = - \\frac{\\partial \\mathbf B}{\\partial t}",
          "\\nabla \\times \\mathbf H = \\mathbf J_{\\text{free}} + \\frac{\\partial \\mathbf D}{\\partial t}"
        ]
      },
      {
        "type": "collapsible",
        "title": "자하가 있었다면?",
        "content": [
          {
            "type": "paragraph",
            "text": "아쉽게도(?) 자하(magnetic charge)는 없지만, 만약 있었다면 대칭적으로"
          },
          {
            "type": "math",
            "layout": "row",
            "mode": "full",
            "values": [
              "\\nabla \\times \\mathbf E = - \\mathbf J_{\\text{M, free}} - \\frac{\\partial \\mathbf B}{\\partial t}",
              "\\nabla \\times \\mathbf H = \\mathbf J_{\\text{E, free}} + \\frac{\\partial \\mathbf D}{\\partial t}"
            ]
          },
          {
            "type": "paragraph",
            "text": "가 되었을 것이다."
          }
        ]
      },
      {
        "type": "paragraph",
        "text": "Conservation law의 국소적 표현인 연속방정식(continuity eq.)는 어떤 물리량 \\( A \\)에 대해 다음과 같다."
      },
      {
        "type": "math",
        "mode": "full",
        "value": "\\frac{\\partial (A \\text{의 밀도})}{\\partial t} + \\nabla \\cdot (A \\text{의 flux}) = (A \\text{의 단위부피당 생성률})"
      },
      {
        "type": "paragraph",
        "text": "이때, 전하의 flux는 전류밀도 \\( \\mathbf J \\)이고, 전하는 생성되지 않으므로, 전하에 대한 연속방정식을 쓰면:"
      },
      {
        "type": "math",
        "mode": "full",
        "value": "\\frac{\\partial \\rho}{\\partial t} + \\nabla \\cdot \\mathbf J = 0"
      },
      {
        "type": "paragraph",
        "text": "이는 free charge이든, bound charge이든 성립하는 식이다. 즉, \\( \\rho_{\\text{free}} \\)와 \\( \\mathbf J_{\\text{free}} \\), \\( \\rho_{\\text{bound}} \\)와 \\( \\mathbf J_{\\text{bound}} \\)에 대해서 성립한다. 이때 \\( \\rho_{\\text{total}} = \\rho_{\\text{free}} + \\rho_{\\text{bound}} \\), \\( \\mathbf J_{\\text{total}} = \\mathbf J_{\\text{free}} + \\mathbf J_{\\text{bound}} \\)이다."
      },
      {
        "type": "collapsible",
        "title": "Material frame에서의 연속방정식",
        "content": [
          {
            "type": "paragraph",
            "text": "위는 spatial frame에서 서술한 것인데, 전류밀도 \\( \\mathbf J \\)를 \\( \\rho \\mathbf u \\)로 분해하면 (\\( \\mathbf u \\)는 drift velocity):"
          },
          {
            "type": "math",
            "mode": "full",
            "value": "\\frac{\\partial \\rho}{\\partial t} + \\nabla \\cdot (\\rho \\mathbf u) = \\left( \\frac{\\partial}{\\partial t} + \\mathbf u \\cdot \\nabla \\right) \\rho + \\rho \\nabla \\cdot \\mathbf u = 0"
          },
          {
            "type": "paragraph",
            "text": "이때, material frame을 도입하기 위해, 물질을 따라가면서 보는 값 \\( A ( \\mathbf x (t) , t )\\)를 미분해보면,"
          },
          {
            "type": "math",
            "mode": "full",
            "value": "\\frac{d}{dt} A ( \\mathbf x ( t) , t ) = \\frac{\\partial A}{\\partial \\mathbf x} \\frac{d \\mathbf x}{dt} + \\frac{\\partial A}{\\partial t} = \\left( \\frac{\\partial}{\\partial t} + \\mathbf u \\cdot \\nabla \\right) A \\triangleq \\frac{D}{Dt} A"
          },
          {
            "type": "paragraph",
            "text": "이다. 결국 material frame에서의 전하 연속방정식은:"
          },
          {
            "type": "math",
            "mode": "full",
            "value": "\\frac{D}{Dt} \\rho + \\rho \\nabla \\cdot \\mathbf u = 0"
          }
        ]
      },
      {
        "type": "collapsible",
        "title": "뇌터 전류",
        "content": [
          {
            "type": "paragraph",
            "text": "위 spatial frame의 연속방정식 (6)을 보면 알겠지만, \\( \\rho \\)를 시간축으로의 전류로 볼 수 있다. 이를 포함한 시공간 상에서의 전류를 뇌터 전류라고 부른다. 시공간 좌표를 \\( x^{\\mu} = (ct, \\mathbf x) \\)로 두면 뇌터 전류는 \\( j^{\\mu} = ( c \\rho, \\mathbf J ) \\)가 되고, 연속방정식 \\( \\partial_{\\mu} j^{\\mu} = 0 \\)를 만족시킨다."
          }
        ]
      },
      {
        "type": "paragraph",
        "text": "위의 맥스웰 방정식 Eq(1), Eq(2)에 대해서 \\( \\nabla \\cdot (\\text{양변}) \\)을 취하면, 각각"
      },
      {
        "type": "math",
        "layout": "row",
        "mode": "full",
        "values": [
          "\\frac{\\partial}{\\partial t} \\nabla \\cdot \\mathbf B = 0",
          "\\frac{\\partial}{\\partial t} \\nabla \\cdot \\mathbf D = \\frac{\\partial}{\\partial t} \\rho_{\\text{free}}"
        ]
      },
      {
        "type": "paragraph",
        "text": "이 되는데, 이때 초기조건으로 \\( t \\)에 대한 적분상수를 처리하면, 나머지 맥스웰 방정식이 나온다."
      },
      {
        "type": "math",
        "layout": "row",
        "mode": "full",
        "values": [
          "\\nabla \\cdot \\mathbf B = 0",
          "\\nabla \\cdot \\mathbf D = \\rho_{\\text{free}}"
        ]
      },
      {
        "type": "paragraph",
        "text": "구성방정식(constitutive eq.)이란 물질이 외부 물질, 장, 힘 등에 어떻게 반응하는지를 나타낸 식이다. Electric, magnetic flux density \\( \\mathbf D \\), \\( \\mathbf B \\)의 구성방정식은 다음과 같다:"
      },
      {
        "type": "math",
        "layout": "row",
        "mode": "full",
        "values": [
          "\\mathbf D = \\varepsilon_0 \\mathbf E + \\mathbf P",
          "\\mathbf B = \\mu_0 ( \\mathbf H + \\mathbf M )"
        ]
      },
      {
        "type": "paragraph",
        "text": "\\( \\mathbf D \\)를 보면, 여기에서부터 free charge와 bound charge의 구분이 나타나는 것이다. \\( \\mathbf D \\)의 구성방정식 (14)에서 \\( \\nabla \\cdot (\\text{양변}) \\)을 취하면, 좌변은 \\( \\nabla \\cdot \\mathbf D  = \\rho_{\\text{free}} \\)가 된다. \\( \\mathbf P \\)는 단위부피당 전기쌍극자 모멘트로 정의되는 분극벡터인데, 안쪽 (-)전하 기준으로 바깥쪽 (+)전하를 보기 때문에, \\( \\rho_{\\text{bound}} = - \\nabla \\cdot \\mathbf P \\)이다. 여기에서 \\( \\rho_{\\text{total}} = \\rho_{\\text{free}} + \\rho_{\\text{bound}} \\)를 쓰면 가우스 법칙 \\( \\nabla \\cdot \\mathbf E = \\frac{\\rho_{\\text{total}}}{\\varepsilon_0} \\)이 나온다."
      },
      {
        "type": "collapsible",
        "title": "Bound volume charge density VS bound surface charge density",
        "content": [
          {
            "type": "paragraph",
            "text": "어떤 부피 안에 있는 bound charge를 볼 때에는 전기쌍극자로 나가고 남은 전하를 보는 거기 때문에 \\( \\rho_{\\text{bound}} = - \\nabla \\cdot \\mathbf P \\)이지만, bound volume이 아니라 surface charge density를 보는 거면 외부 겉부분에 있는 표면전하를 보는 것이므로 \\( \\sigma_{\\text{bound}} = \\mathbf P \\cdot \\hat {\\mathbf n} \\)이다."
          }
        ]
      },
      {
        "type": "paragraph",
        "text": "이때, 선형 등방성 유전체에서는 \\( \\mathbf P = \\varepsilon_0 \\chi_e \\mathbf E \\)로 둘 수 있고, 결국 \\( \\varepsilon_r = 1 + \\chi_e \\)로 두어서, \\( \\varepsilon = \\varepsilon_r \\varepsilon_0 \\), \\( \\mathbf D = \\varepsilon \\mathbf E \\)로 할 수 있다. 참고로, polarization loss는 이 \\( \\chi_e \\)가 실수가 아닌 것에서 기인한다. \\(\\mathbf B\\)에서는, 강자성체가 아닌 이상 자화벡터 \\( \\mathbf M \\)은 매우 작아서 무시되거나, 선형 자성체에서는 \\( \\mathbf B = \\mu_0 ( \\mathbf H + \\mathbf M ) = \\mu_0 ( 1 + \\chi_m) \\mathbf H = \\mu_r \\mu_0 \\mathbf H = \\mu \\mathbf H \\)로 \\( \\mu \\)에 흡수된다."
      },
      {
        "type": "paragraph",
        "text": "또, free charge의 전류밀도 \\( \\mathbf J_{\\text{free}} \\)에 대한 구성방정식도 세울 수 있는데, 아래와 같다."
      },
      {
        "type": "math",
        "mode": "full",
        "value": "\\mathbf J_{\\text{free}} = \\sigma \\mathbf E"
      },
      {
        "type": "paragraph",
        "text": "이때, \\( \\sigma \\)는 전기전도도이다. 이 전기전도도를 가지고 물질을 구분하기도 하는데, 전기전도도가 커질수록 전력 손실이 더 많이 난다. 결국 손실은 Lossless dielectric \\( \\rightarrow \\) Lossy dielectric \\( \\rightarrow \\) Good conductor \\( \\rightarrow \\) Perfect conductor가 될수록 커진다. 참고로 perfect conductor의 내부에서는 유한한 장 세기에 대해 손실이 무한하기 때문에 장이 존재할 수 없다."
      },
      {
        "type": "paragraph",
        "text": "Ohmic conductor에서는 전기장이 전하에 하는 일이 단위부피당 열손실(Joule heating)과 같고, 그 값은 \\( p_{\\text{loss}} = \\mathbf E \\cdot \\mathbf J_{\\text{total}} \\)이다."
      },
      {
        "type": "paragraph",
        "text": "장에서의 미소 일은 각각 \\( d w_e = \\mathbf E \\cdot d \\mathbf D \\), \\( d w_m = \\mathbf H \\cdot d \\mathbf B \\)이므로, 단위부피당 저장된 에너지는 \\( w_e = \\frac 1 2 \\mathbf E \\cdot \\mathbf D = \\frac 1 2 \\varepsilon | E | ^2 \\), \\( w_m = \\frac 1 2 \\mathbf H \\cdot \\mathbf B = \\frac 1 2 \\mu | \\mathbf H | ^2 \\)이다."
      },
      {
        "type": "paragraph",
        "text": "\\( \\mathbf H \\cdot \\text{Eq(1)} - \\mathbf E \\cdot \\text{Eq(2)} \\)를 하면"
      },
      {
        "type": "math",
        "mode": "full",
        "value": "\\frac{\\partial}{\\partial t} \\left( \\frac 1 2 \\mathbf E \\cdot \\mathbf D + \\frac 1 2 \\mathbf H \\cdot \\mathbf B \\right) + \\nabla \\cdot (\\mathbf E \\times \\mathbf H) = - \\mathbf E \\cdot \\mathbf J"
      },
      {
        "type": "paragraph",
        "text": "가 되는데, 식 (5)의 내용과 비교해보면, \\( \\mathbf E \\times \\mathbf H \\triangleq \\mathbf S \\)가 전자기 에너지 flux를 나타낸다는 것을 알 수 있다. 이 \\( \\mathbf S \\)를 포인팅 벡터(Poynting vector)라고 한다."
      },
      {
        "type": "paragraph",
        "text": "장이 있으면, potential 함수를 잡는 게 자연스럽다. 잠시 potential 이야기를 하자면, 3차원에서는 \\( \\nabla \\)와 할 수 있는 것에 divergence, curl, gradient가 있다. potential은 제약식을 매번 풀지 않아도 되도록 제약을 두게 된다. 각각의 연산에 대해서 결과를 상수(조정해서 0으로 만들 수 있다)로 두면:"
      },
      {
        "type": "enumeration",
        "items": [
          "Divergence: \\( \\nabla \\cdot \\mathbf F = 0 \\)이면 \\( \\mathbf F = \\nabla \\times \\mathbf F ' \\)로 두어야지 \\( \\mathbf F ' \\)가 어떻게 되든 결과가 맞도록 할 수 있다. 즉 이때에는 vector potential \\( \\mathbf F ' \\)가 나온다.",
          "Curl: \\( \\nabla \\times \\mathbf F = 0 \\)이면 \\( \\mathbf F = \\nabla f \\)로 두어야지 \\( f \\)가 어떨게 되든 결과가 맞도록 할 수 있다. 즉 이때에는 scalar potential \\( f \\)가 나온다.",
          "Gradient: \\( \\nabla f = 0 \\)이면 \\( f \\)가 전역에서 상수여서 의미가 크게 없다."
        ]
      },
      {
        "type": "paragraph",
        "text": "직관적으로 이해하면, 어떤 점 근방의 매우 작은 구에 대해서, divergence는 법벡터, curl은 접벡터, gradient는 구 위의 함숫값에 대응된다."
      },
      {
        "type": "paragraph",
        "text": "이렇게 제약조건을 뽑아내기 위해 맥스웰 방정식 중 우변이 위치에 대한 상수인 것들을 고르면 Eq(12): \\( \\nabla \\cdot \\mathbf B = 0 \\)밖에 없다. 이는 magnetic vector potential \\( \\mathbf A \\)를 \\( \\mathbf B = \\nabla \\times \\mathbf A \\)가 되도록 잡으면 된다. 이제 \\( \\mathbf B \\)가 potential로 잡혔으니, Eq(1): \\( \\nabla \\times \\mathbf E = - \\frac{\\partial \\mathbf B}{\\partial t} \\)도 potential로 잡고 표현할 수 있다. \\( \\mathbf B = \\nabla \\times \\mathbf A \\)를 대입하면 \\( \\nabla \\times \\left( \\mathbf E + \\frac{\\partial \\mathbf A}{\\partial t} \\right) = 0 \\)이므로, \\( \\mathbf E + \\frac{\\partial \\mathbf A}{\\partial t} = - \\nabla V \\)로 잡을 수 있다. 지금까지의 결과를 요약하자면:"
      },
      {
        "type": "math",
        "layout": "row",
        "mode": "full",
        "values": [
          "\\mathbf B = \\nabla \\times \\mathbf A",
          "\\mathbf E = - \\nabla V - \\frac{\\partial \\mathbf A}{\\partial t}"
        ]
      },
      {
        "type": "paragraph",
        "text": "이 식들을 통해서 게이지 불변성을 얻을 수 있는데, 같은 현상을 설명하기 위해 \\( \\mathbf B = \\nabla \\times \\mathbf A \\)이므로 \\( \\mathbf A \\)에 \\( \\nabla \\phi \\)를 더해도 된다. 이때 \\( \\mathbf E \\)를 유지하기 위해서 \\( V \\)에서 \\( \\frac{\\partial \\phi}{\\partial t} \\)를 빼야 된다. 즉, 아래와 같은 게이지 변환에 대해 현상은 동일하다."
      },
      {
        "type": "math",
        "layout": "row",
        "mode": "full",
        "values": [
          "\\mathbf A \\leftarrow \\mathbf A + \\nabla \\phi",
          "V \\leftarrow V - \\frac{\\partial \\phi}{\\partial t}"
        ]
      },
      {
        "type": "paragraph",
        "text": "이때, 이 결과를 나머지 맥스웰 방정식에 대입하면, 다음과 같이 나온다: \\[ \\nabla^2 V + \\frac{\\partial}{\\partial t} (\\nabla \\cdot \\mathbf A) = - \\frac{\\rho_{\\text{free}}}{\\varepsilon}, \\nabla^2 \\mathbf A - \\mu \\varepsilon \\frac{\\partial \\mathbf A}{\\partial t} = - \\mu \\mathbf J + \\nabla \\left( \\nabla \\cdot \\mathbf A + \\mu \\varepsilon \\frac{\\partial V}{\\partial t} \\right) \\]"
      },
      {
        "type": "paragraph",
        "text": "여기에서 potential \\( \\mathbf A \\)에 대해서 건드리면 안 되는 부분은 curl밖에 없다. 만약 gradient를 바꾼다면 \\( V \\)측에서 보정이 들어가야 한다. 하지만, 위에서 봤듯이 gradient 제약조건은 큰 의미가 없으므로 divergence 제약조건을 본다. 위 게이지 변환 Eq(20): \\( \\mathbf A \\leftarrow \\mathbf A + \\nabla \\phi \\)에 대해서 divergence를 취하면 \\( \\nabla \\cdot \\mathbf A \\leftarrow \\nabla \\cdot \\mathbf A + \\nabla^2 \\phi \\)가 된다. 이때 \\( \\phi \\)를 잘 조정해서 게이지 조건을 만든다. 대표적인 gauge로는 로렌츠 게이지와 쿨롱 게이지가 있다. 각각 다음과 같다:"
      },
      {
        "type": "math",
        "layout": "row",
        "mode": "full",
        "values": [
          "\\text{Lorentz gauge: } \\nabla \\cdot \\mathbf A + \\mu \\varepsilon \\frac{\\partial V}{\\partial t} = 0",
          "\\text{Coulomb gauge: } \\nabla \\cdot \\mathbf A = 0"
        ]
      },
      {
        "type": "paragraph",
        "text": "쿨롱 게이지는 source-free region이고 \\( V (\\infty) = 0 \\)라는 조건 하에 \\( V = 0 \\)로 둘 수 있기 때문에 유용하다. 하지만 전자기학에서 나오는 상황은 일반적으로 source가 있기 때문에 로렌츠 게이지를 택한다."
      },
      {
        "type": "paragraph",
        "text": "로렌츠 게이지 하에서 파동방정식이 나온다."
      },
      {
        "type": "math",
        "layout": "row",
        "mode": "full",
        "values": [
          "\\left( \\nabla^2 - \\mu \\varepsilon \\frac{\\partial^2}{\\partial t^2} \\right) V = - \\frac{\\rho_{\\text{free}}}{\\varepsilon}",
          "\\left( \\nabla^2 - \\mu \\varepsilon \\frac{\\partial^2}{\\partial t^2} \\right) \\mathbf A = - \\mu \\mathbf J_{\\text{free}}"
        ]
      },
      {
        "type": "collapsible",
        "title": "달랑베르 연산자와 로렌츠 변환",
        "content": [
          {
            "type": "paragraph",
            "text": "광속 불변의 원리를 식으로 표현하면, 빛에 대해 \\( \\frac{\\sqrt{dx^2 + dy^2 + dz^2}}{dt} = c \\)이다. 이를 계량으로 만들면, \\( ds^2 = c^2 dt^2 - dx^2 - dy^2 - dz^2\\)이고, 이 시공간 좌표계 \\( x^{\\mu} = (ct, x, y, z) \\)에 대해 민코프스키 계량 \\( \\eta^{\\mu \\nu} = \\text{diag} (1, -1, -1, -1) \\)은 보존된다. 이를 기준으로 시공간 좌표계에서의 라플라시안 \\( \\nabla^2 \\)을 정의하면, 달랑베르 연산자 \\( \\square = \\eta^{\\mu \\nu} \\partial_{\\mu} \\partial_{\\nu} = \\frac{1}{c^2} \\frac{\\partial^2}{\\partial t^2} - \\nabla^2 \\)가 된다. 이를 이용해서 위의 식을 다시 쓰면, \\( \\square V = \\frac{\\rho_{\\text{free}}}{\\varepsilon_0} \\)와 \\( \\square \\mathbf A = \\mu_0 \\mathbf J_{\\text{free}} \\)가 된다."
          },
          {
            "type": "paragraph",
            "text": "참고로, 공변성을 고려해서 \\( x \\)방향 로렌츠 부스트만 생각하면, 민코프스키 계량의 보존은 쌍곡각 \\( \\phi \\)에 대한 쌍곡회전으로 이해할 수 있다. 즉 \\[ \\begin{bmatrix} ct' \\\\ x ' \\end{bmatrix} = \\begin{bmatrix} \\cosh \\phi & - \\sinh \\phi \\\\ - \\sinh \\phi & \\cosh \\phi \\end{bmatrix} \\begin{bmatrix} ct \\\\ x \\end{bmatrix} \\]이다. 이때, \\( S' \\) 좌표계의 원점을 \\( S \\) 좌표계에서 보면, \\( \\tanh \\phi = \\frac{x}{ct} = \\frac v c \\triangleq \\beta \\)가 나온다. \\( \\cosh \\phi \\)를 \\( \\gamma \\)로 정의하면, \\[ \\begin{bmatrix} ct' \\\\ x ' \\end{bmatrix} = \\begin{bmatrix} \\gamma & - \\beta \\gamma \\\\ - \\beta \\gamma & \\gamma \\end{bmatrix} \\begin{bmatrix} ct \\\\ x \\end{bmatrix} \\]가 나온다."
          },
          {
            "type": "paragraph",
            "text": "또다른 참고로, 시공간 위치벡터 \\( x^{\\mu} = (ct, x, y, z) \\)를 푸리에 변환하면 파수벡터 \\( k^{\\mu} = \\left( \\frac{\\omega}{c}, k_x, k_y, k_z \\right) \\)가 나온다. 이때 평면파의 위상은 파수벡터와 위치벡터의 내적(로렌츠 불변 내적)이므로, \\( k_{\\mu} x^{\\mu} = (\\eta_{\\mu \\nu} k^{\\nu}) x^{\\mu} = \\omega t - \\mathbf k \\cdot \\mathbf r \\)이다."
          }
        ]
      },
      {
        "type": "paragraph",
        "text": "둘 다 비슷한 꼴이므로, 그린함수를 이용해"
      },
      {
        "type": "math",
        "mode": "full",
        "value": "\\left( \\nabla^2 - \\mu \\epsilon \\frac{\\partial^2}{\\partial t^2} \\right) G = - \\delta( \\mathbf r ) \\delta (t )"
      },
      {
        "type": "paragraph",
        "text": "를 보자. 먼저 동차해는 상수계수 PDE이므로 인수분해해서 각각의 kernel을 해로 쓸 수 있다. (만약 중근이 발생하면 추가 항들이 곱해지게 되지만) 그렇다면 동차해는 각각 진행방향에 대해서 \\( \\frac{\\partial G}{\\partial s} = \\pm \\sqrt{ \\mu \\varepsilon } \\frac{\\partial G}{\\partial t} \\)가 되고, 결국 source-free region에서의 평면파는 속도는 \\( u = \\frac{1}{\\sqrt{ \\mu \\varepsilon }} \\)이다. 다음 비동차해를 보면, 푸리에 변환하고 적분해서 계산하면 아래와 같이 나온다. 이때, 광속 기준으로 하고, retarded time \\( t' = t - \\frac{| \\mathbf r |}{c} \\)을 이용한다."
      },
      {
        "type": "enumeration",
        "items": [
          "3차원: \\( \\frac{1}{4 \\pi} \\frac{\\delta ( t ' ) }{| \\mathbf r |} \\)",
          "2차원: \\( \\frac{1}{2 \\pi} \\frac{u ( t ' )}{\\sqrt{t^2 - (| \\mathbf r | / c)^2 } } \\)",
          "1차원: \\( \\frac{c}{2} u(t ') \\)"
        ]
      },
      {
        "type": "paragraph",
        "text": "여기에서 전자기파는 정현파꼴을 띠기 때문에, \\( \\cos \\phi \\)가 공통적으로 많이 나오는데, 이는 phasor notation으로 \\( e^{j \\phi} \\) 또는 \\( e^{- j \\phi} \\)로 해서, phasor의 실수부가 실제 신호를 나타내도록 할 수 있다. 일반적으로 위상각 \\( \\phi \\)는 \\( \\mathbf k \\cdot \\mathbf r - \\omega t \\) 꼴이다. 이때, 지수함수꼴은 미적분을 대수로 다루기 쉬우므로 생략한다. 일반적으로 시간항 \\( e^{j \\omega t} \\)를 생략하는데, 이때 평면파를 \\( e^{- j \\mathbf k \\cdot \\mathbf r } \\)로 잡는다. 여기에서 \\( \\frac{\\partial}{\\partial t} \\rightarrow j \\omega \\)이므로, 파동방정식은 다음과 같이 헬름홀츠 방정식으로 바뀐다."
      },
      {
        "type": "math",
        "mode": "full",
        "value": "( \\nabla^2 + k^2 ) G = - \\delta ( \\mathbf r )"
      },
      {
        "type": "paragraph",
        "text": "이를 풀면, 아래와 같이 해가 나온다. \\( V \\)의 경우 \\( \\frac{1}{\\varepsilon} \\), \\( \\mathbf A \\)의 경우 \\( \\mu \\)를 곱해준다. source에 대해서 원래는 time, spatial domain에서 convolution을 하지만, phasor의 경우 spatial domain에서 convolution한 다음, \\( \\Re \\{ \\tilde{A} e^{j \\omega t} \\} \\)로 처리한다."
      },
      {
        "type": "math",
        "mode": "full",
        "value": "\\text{3차원: } \\frac{1}{4 \\pi} \\frac{\\delta ( t ' ) }{| \\mathbf r |} \\rightarrow \\frac{1}{4 \\pi} \\frac{e^{- j k | \\mathbf r |}}{| \\mathbf r |}"
      },
      {
        "type": "math",
        "mode": "full",
        "value": "\\text{2차원: } \\frac{1}{2 \\pi} \\frac{u ( t ' )}{\\sqrt{t^2 - (| \\mathbf r | / c)^2 } } \\rightarrow - \\frac j 4 H_0^2 ( k | \\mathbf r | )"
      },
      {
        "type": "math",
        "mode": "full",
        "value": "\\text{1차원: } \\frac{c}{2} u ( t' ) \\rightarrow \\frac{1}{2jk}e^{-jk|\\mathbf r|}"
      },
      {
        "type": "paragraph",
        "text": "이때, 정현파에서의 평균값은 2개의 값이 곱해져야 의미가 있는데, 이때에는 \\( \\frac 1 2 \\Re \\{ \\tilde{A} \\cdot \\tilde{B}^{*} \\} \\)로 처리한다."
      },
      {
        "type": "paragraph",
        "text": "여기에서 나타나는 각종 물리량을 보자. 속도 \\( u \\), 임피던스 \\( \\eta \\), 굴절률 \\( n \\)은 다음과 같다."
      },
      {
        "type": "math",
        "layout": "row",
        "mode": "full",
        "values": [
          "u = \\frac{\\omega}{k} = \\frac{1}{\\sqrt{\\mu \\varepsilon}}",
          "\\eta = \\frac{| \\mathbf E |}{| \\mathbf H |} = \\sqrt{\\frac{\\mu}{\\varepsilon}}",
          "n = \\frac c v = \\sqrt{\\mu_r \\varepsilon_r}"
        ]
      },
      {
        "type": "paragraph",
        "text": "공기에서 나타나는 고유 임피던스는 \\( \\eta_0 = \\sqrt{\\frac{\\mu_0}{\\varepsilon_0}} \\approx 120 \\pi \\)이다."
      },
      {
        "type": "collapsible",
        "title": "물리량 단위 정리",
        "content": [
          {
            "type": "paragraph",
            "text": "단위를 생각할 때 \\( Q = CV \\), \\( \\Phi = LI \\)에 각각 \\( \\mathbf D = \\varepsilon \\mathbf E \\), \\( \\mathbf B = \\mu \\mathbf H \\)를 대응시키면 좋다. 각각 거리와 거리 제곱을 나누면 되고, 나머지는 기억 안 나면 차원 해석하면 된다."
          }
        ]
      }
    ]
  },
  {
    "slug": "vector-calculus-gradient-divergence-curl",
    "title": "Gradient, Divergence, Curl 한 번에 정리",
    "date": "2026-04-15",
    "summary": "스칼라장과 벡터장에서 자주 쓰이는 세 연산자의 의미를 물리적 해석과 함께 정리합니다.",
    "tags": [
      "벡터미적분학",
      "gradient",
      "curl"
    ],
    "folder": "벡터미적분학",
    "content": [
      {
        "type": "paragraph",
        "text": "Gradient는 \\(\\nabla f\\)처럼 가장 빠르게 증가하는 방향을, Divergence는 \\(\\nabla \\cdot \\mathbf{F}\\)처럼 유출입의 세기를, Curl은 \\(\\nabla \\times \\mathbf{F}\\)처럼 회전 경향을 측정합니다."
      },
      {
        "type": "collapsible",
        "title": "입력/출력 타입을 먼저 확인해야 하는 이유",
        "content": [
          {
            "type": "paragraph",
            "text": "세 연산자는 형태가 비슷해 보여도 입력과 출력의 타입이 다릅니다. 예를 들어 $f: \\mathbb{R}^n \\to \\mathbb{R}$일 때는 $\\nabla f$를, $\\mathbf{F}: \\mathbb{R}^n \\to \\mathbb{R}^n$일 때는 $\\nabla \\cdot \\mathbf{F}$ 또는 $\\nabla \\times \\mathbf{F}$를 써야 합니다."
          },
          {
            "type": "bullet-points",
            "items": [
              "Gradient: 스칼라장을 입력으로 받아 벡터장을 출력",
              "Divergence: 벡터장을 입력으로 받아 스칼라장을 출력",
              "Curl: 벡터장을 입력으로 받아 벡터장을 출력"
            ]
          }
        ]
      },
      {
        "type": "math",
        "mode": "full",
        "value": "\\nabla \\cdot (\\nabla \\times \\mathbf{F}) = 0"
      },
      {
        "type": "table",
        "headers": [
          "연산자",
          "입력",
          "출력",
          "핵심 의미"
        ],
        "rows": [
          [
            "Gradient $\\nabla f$",
            "스칼라장 $f$",
            "벡터장",
            "가장 빠른 증가 방향"
          ],
          [
            "Divergence $\\nabla \\cdot \\mathbf{F}$",
            "벡터장 $\\mathbf{F}$",
            "스칼라장",
            "유출입(발산) 세기"
          ],
          [
            "Curl $\\nabla \\times \\mathbf{F}$",
            "벡터장 $\\mathbf{F}$",
            "벡터장",
            "국소 회전 경향"
          ]
        ],
        "caption": "세 연산자의 입력/출력 타입과 물리적 해석 비교"
      },
      {
        "type": "paragraph-columns",
        "columns": [
          "Gradient 관점에서는 함수값이 가장 빠르게 증가하는 방향이 중요하며, 방향미분의 최대값이 $\\|\\nabla f\\|$라는 점이 직관을 만들어 줍니다.",
          "Divergence/Curl 관점에서는 장 자체의 흐름 구조가 중요합니다. 유체 문제에서는 $\\nabla \\cdot \\mathbf{F}$로 압축/팽창을, $\\nabla \\times \\mathbf{F}$로 소용돌이 성분을 읽습니다."
        ]
      },
      {
        "type": "paragraph",
        "text": "수식 표시 모드는 상황에 맞게 선택할 수 있습니다. full은 전체 폭, scroll은 가로 스크롤, row는 여러 박스를 한 줄에 배치합니다."
      },
      {
        "type": "math",
        "mode": "scroll",
        "value": "\\sum_{k=1}^{n} \\left(\\frac{1}{k} + \\frac{1}{k+1} + \\frac{1}{k+2}\\right)^2 = \\frac{1}{36} \\left(6 H_{n}^{(2)} + 6 H_{n+1}^{(2)} + 6 H_{n+2}^{(2)} + 4 H_{n} + 4 H_{n+1} + 4 H_{n+2}\\right)"
      },
      {
        "type": "math",
        "layout": "row",
        "mode": "fit",
        "values": [
          "\\nabla f",
          "\\nabla \\cdot \\mathbf{F}",
          "\\nabla \\times \\mathbf{F}"
        ]
      },
      {
        "type": "math",
        "mode": "fit",
        "value": "s"
      },
      {
        "type": "image-row",
        "images": [
          {
            "src": "/images/Figure_2.png",
            "alt": "벡터장 시각화 Figure 2",
            "caption": "Figure 2. 벡터장 흐름과 회전 성분 예시"
          },
          {
            "src": "/images/folder_icon.webp",
            "alt": "폴더 아이콘",
            "caption": "Folder icon"
          }
        ]
      },
      {
        "type": "code",
        "language": "python",
        "code": "import numpy as np\n\n# 2D 벡터장 F(x, y) = (y, -x)\ndef F(x, y):\n    return np.array([y, -x])\n\npoint = np.array([1.0, 2.0])\nprint(\"F(point) =\", F(*point))",
        "showLineNumbers": true
      },
      {
        "type": "paragraph",
        "text": "유체나 전자기학 문제를 풀 때 각각의 연산자가 어떤 물리량을 설명하는지 연결해두면 계산이 훨씬 명확해집니다."
      }
    ]
  },
  {
    "slug": "vector-calculus-line-integral-intuition",
    "title": "선적분의 직관: 경로를 따라 누적한다는 것",
    "date": "2026-04-13",
    "summary": "선적분을 단순 공식이 아닌 \"경로를 따라 힘을 더한다\"는 개념으로 이해해봅니다.",
    "tags": [
      "벡터미적분학",
      "line-integral",
      "적분"
    ],
    "folder": "벡터미적분학",
    "content": [
      {
        "type": "paragraph",
        "text": "선적분은 경로 위에서 벡터장과 접선 방향의 내적을 누적하는 과정으로 볼 수 있습니다."
      },
      {
        "type": "paragraph",
        "text": "같은 시작점과 끝점이라도 경로가 다르면 값이 달라질 수 있다는 점이 핵심입니다."
      },
      {
        "type": "paragraph",
        "text": "보존장에서는 경로 독립성이 생기므로 퍼텐셜 함수로 계산이 단순해진다는 점까지 연결해두면 좋습니다."
      }
    ]
  }
];
