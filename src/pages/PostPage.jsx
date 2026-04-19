import { Link, useParams } from 'react-router-dom';
import { BlockMath } from 'react-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Tag from '../components/Tag';
import { posts } from '../data/posts';
import { formatDate } from '../utils/formatDate';

function renderContentBlock(block, key) {
  if (typeof block === 'string') {
    return <p key={key}>{block}</p>;
  }

  switch (block.type) {
    case 'paragraph':
      return <p key={key}>{block.text}</p>;
    case 'math':
      return (
        <div key={key} className="article-math">
          <BlockMath math={block.value} />
        </div>
      );
    case 'image':
      return (
        <figure key={key} className="article-figure">
          <img src={block.src} alt={block.alt || ''} loading="lazy" />
          {block.caption ? <figcaption>{block.caption}</figcaption> : null}
        </figure>
      );
    case 'code':
      return (
        <SyntaxHighlighter
          key={key}
          language={block.language || 'text'}
          style={oneDark}
          className="article-code-block"
          showLineNumbers={Boolean(block.showLineNumbers)}
          wrapLongLines
          customStyle={{ margin: 0, borderRadius: '10px' }}
        >
          {block.code}
        </SyntaxHighlighter>
      );
    default:
      return null;
  }
}

export default function PostPage() {
  const { slug } = useParams();
  const post = posts.find((item) => item.slug === slug);

  if (!post) {
    return (
      <div className="container single-column-page">
        <div className="empty-state">
          <h1>포스트를 찾지 못했습니다.</h1>
          <p>슬러그가 바뀌었거나 아직 작성되지 않은 글입니다.</p>
          <Link className="primary-button" to="/">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container single-column-page">
      <article className="post-article">
        <p className="eyebrow">{post.folder}</p>
        <h1>{post.title}</h1>

        <div className="article-meta">
          <span>{formatDate(post.date)}</span>
        </div>

        <p className="article-summary">{post.summary}</p>

        <div className="tag-list">
          {post.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>

        <div className="article-body">
          {post.content.map((block, index) => renderContentBlock(block, `${post.slug}-${index}`))}
        </div>
      </article>

      <div className="back-link-wrap">
        <Link className="primary-button" to="/">
          목록으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
