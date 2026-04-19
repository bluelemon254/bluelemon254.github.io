export default function AboutPage() {
  return (
    <div className="container single-column-page">
      <section className="content-card">
        <p className="eyebrow">About</p>
        <h1>이 블로그에 대하여</h1>
        <br></br>
        <h3>블로그를 쓰게 된 동기</h3>
        <p>
          학습하는 내용들을 항상 머리에 담아두기는 쉽지 않다. 애시당초에 뇌는 오랫동안 쓰지 않은 정보를
          잊어버리도록 설계되어 있다. 대학교 2학년 전까지는 모든 것을 익혀서 장기기억에 넣으려고 했지만, 
          현실적으로 대학교 3학년이 되면서 그렇게 하는 것은 현실적으로 불가능하다는 것을 깨달았다. 따라서
          마치 Agent들이 cognitive outsourcing을 하듯이, digital archive를 만들어서 일종의
          hippocampus outsourcing을 하기로 했다. 저장 매체로 종이 노트와 같은 물리적인 실체가 아니라 
          digital medium을 택한 이유는, 언제 어디서나 접근 가능하다는 장점 때문이다. 
        </p>
        <h3>글의 방향성</h3>
        <p>
          이 블로그에서는 내가 공부한 내용들을 압축해서 기록하려고 한다. 그것도, 극도로 압축할 생각이다. 
          그 이유로는, 이미 자세한 내용은 교재나 인터넷에 찾아보면 충분히 많기 때문이다. 이 블로그의 목적은
          공부하다가 기억이 안 나는 내용이 있으면, 쉽게 찾아봐서 다시 기억하도록 하는 것이다. 따라서
          나 자신에게 친화적으로 서술되어 있기 때문에, 다른 사람들이 읽기에는 불친절하게 느껴질 수 있다. 
          글의 논리는 최대한 succinct하게, 원리로부터 출발하도록 노력하겠다. 
        </p>
      </section>
    </div>
  );
}
