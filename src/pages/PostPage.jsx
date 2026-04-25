import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Tag from '../components/Tag';
import { posts } from '../data/posts';
import { formatDate } from '../utils/formatDate';

const ALLOWED_MATH_MODES = new Set(['fit', 'scroll', 'full']);

function getMathMode(mode) {
  return ALLOWED_MATH_MODES.has(mode) ? mode : 'fit';
}

function normalizeMathItems(block) {
  const defaultMode = getMathMode(block.mode);

  if (Array.isArray(block.values) && block.values.length > 0) {
    return block.values
      .map((item) => {
        if (typeof item === 'string') {
          return { value: item, mode: defaultMode };
        }

        if (item && typeof item === 'object' && typeof item.value === 'string') {
          return { value: item.value, mode: getMathMode(item.mode || defaultMode) };
        }

        return null;
      })
      .filter(Boolean);
  }

  if (typeof block.value === 'string') {
    return [{ value: block.value, mode: defaultMode }];
  }

  return [];
}

function renderMathItem(item, key) {
  return (
    <div key={key} className={`article-math article-math--${item.mode}`}>
      {`$$${item.value}$$`}
    </div>
  );
}

function renderContentBlock(block, key) {
  if (typeof block === 'string') {
    return <p key={key}>{block}</p>;
  }

  switch (block.type) {
    case 'paragraph':
      return <p key={key}>{block.text}</p>;
    case 'math': {
      const items = normalizeMathItems(block);

      if (!items.length) {
        return null;
      }

      if (block.layout === 'row' || items.length > 1) {
        return (
          <div
            key={key}
            className={`article-math-row${block.wrap === false ? ' article-math-row--nowrap' : ''}`}
          >
            {items.map((item, index) => renderMathItem(item, `${key}-${index}`))}
          </div>
        );
      }

      return renderMathItem(items[0], key);
    }
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

  useEffect(() => {
    if (!post) {
      return;
    }

    if (typeof window !== 'undefined' && window.MathJax?.typesetPromise) {
      window.MathJax.typesetPromise();
    }
  }, [post]);

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
