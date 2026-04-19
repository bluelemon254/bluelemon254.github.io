import { Link } from 'react-router-dom';
import Tag from './Tag';
import { formatDate } from '../utils/formatDate';

export default function PostCard({ post }) {
  return (
    <article className="post-card">
      <div className="post-card-meta">
        <span className="folder-pill">{post.folder}</span>
        <span>·</span>
        <span>{formatDate(post.date)}</span>
      </div>

      <h2 className="post-card-title">
        <Link to={`/posts/${post.slug}`}>{post.title}</Link>
      </h2>

      <p className="post-card-summary">{post.summary}</p>

      <div className="tag-list">
        {post.tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>

      <Link className="read-more" to={`/posts/${post.slug}`}>
        글 읽기 →
      </Link>
    </article>
  );
}
