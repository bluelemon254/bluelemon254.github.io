import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container single-column-page">
      <div className="empty-state">
        <p className="eyebrow">404</p>
        <h1>페이지를 찾을 수 없습니다.</h1>
        <p>주소가 잘못되었거나 삭제된 페이지입니다.</p>
        <Link className="primary-button" to="/">
          홈으로 이동
        </Link>
      </div>
    </div>
  );
}
