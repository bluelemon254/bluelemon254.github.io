import { useEffect, useMemo } from 'react';
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

function renderMathItem(item, key, equationNumber) {
  return (
    <div key={key} className={`article-math article-math--${item.mode}`}>
      <div className="article-math-expression">{`$$${item.value}$$`}</div>
      {typeof equationNumber === 'number' ? (
        <span className="article-math-number">({equationNumber})</span>
      ) : null}
    </div>
  );
}

function renderParagraphColumns(block, key) {
  const columns = Array.isArray(block.columns) ? block.columns.filter((item) => typeof item === 'string') : [];

  if (!columns.length) {
    return null;
  }

  return (
    <div key={key} className="article-paragraph-columns">
      {columns.map((text, index) => (
        <p key={`${key}-${index}`}>{text}</p>
      ))}
    </div>
  );
}

function renderTableBlock(block, key) {
  const headers = Array.isArray(block.headers)
    ? block.headers.filter((item) => typeof item === 'string')
    : [];
  const rows = Array.isArray(block.rows)
    ? block.rows
        .filter((row) => Array.isArray(row) && row.length > 0)
        .map((row) => row.map((cell) => (typeof cell === 'string' ? cell : String(cell))))
    : [];

  if (!headers.length && !rows.length) {
    return null;
  }

  return (
    <figure key={key} className="article-table-wrap">
      <table className="article-table">
        {headers.length ? (
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={`${key}-h-${index}`} scope="col">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
        ) : null}
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`${key}-r-${rowIndex}`}>
              {row.map((cell, cellIndex) => (
                <td key={`${key}-r-${rowIndex}-c-${cellIndex}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {block.caption ? <figcaption>{block.caption}</figcaption> : null}
    </figure>
  );
}

function renderImageRowBlock(block, key) {
  const images = Array.isArray(block.images) ? block.images : [];

  if (!images.length) {
    return null;
  }

  return (
    <div key={key} className="article-image-row">
      {images.map((item, index) => (
        <figure key={`${key}-img-${index}`} className="article-image-row-item">
          <img src={item.src} alt={item.alt || ''} loading="lazy" />
          {item.caption ? <figcaption>{item.caption}</figcaption> : null}
        </figure>
      ))}
    </div>
  );
}

function renderCollapsibleBlock(block, key) {
  const title = typeof block.title === 'string' && block.title.trim().length > 0
    ? block.title
    : '자세히 보기';
  const items = Array.isArray(block.content) ? block.content : [];

  return (
    <details key={key} className="article-collapsible">
      <summary>{title}</summary>
      <div className="article-collapsible-body">
        {items.map((item, index) => renderContentBlock(item, `${key}-content-${index}`))}
      </div>
    </details>
  );
}

function numberMathBlocks(blocks, startAt = 1) {
  let equationCounter = startAt;

  const numberedBlocks = blocks.map((block) => {
    if (!block || typeof block !== 'object') {
      return block;
    }

    if (block.type === 'collapsible' && Array.isArray(block.content)) {
      const nested = numberMathBlocks(block.content, equationCounter);
      equationCounter = nested.nextEquationNumber;

      return {
        ...block,
        content: nested.blocks
      };
    }

    if (block.type !== 'math') {
      return block;
    }

    const items = normalizeMathItems(block);

    if (!items.length) {
      return block;
    }

    if (block.numbered === false) {
      return {
        ...block,
        _equationNumbers: []
      };
    }

    const equationNumbers = items.map(() => {
      const current = equationCounter;
      equationCounter += 1;
      return current;
    });

    return {
      ...block,
      _equationNumbers: equationNumbers
    };
  });

  return {
    blocks: numberedBlocks,
    nextEquationNumber: equationCounter
  };
}

function normalizeListItems(block) {
  if (!Array.isArray(block.items)) {
    return [];
  }

  return block.items
    .map((item) => {
      if (typeof item === 'string') {
        return item;
      }

      if (item && typeof item === 'object' && typeof item.text === 'string') {
        return item.text;
      }

      return null;
    })
    .filter((item) => typeof item === 'string' && item.trim().length > 0);
}

function renderEnumerationBlock(block, key) {
  const items = normalizeListItems(block);

  if (!items.length) {
    return null;
  }

  return (
    <ol key={key} className="article-list article-list--ordered">
      {items.map((item, index) => (
        <li key={`${key}-item-${index}`}>{item}</li>
      ))}
    </ol>
  );
}

function renderBulletPointsBlock(block, key) {
  const items = normalizeListItems(block);

  if (!items.length) {
    return null;
  }

  return (
    <ul key={key} className="article-list article-list--unordered">
      {items.map((item, index) => (
        <li key={`${key}-item-${index}`}>{item}</li>
      ))}
    </ul>
  );
}

function isMarkdownDivider(text) {
  return typeof text === 'string' && text.trim() === '---';
}

function renderContentBlock(block, key) {
  if (typeof block === 'string') {
    if (isMarkdownDivider(block)) {
      return <hr key={key} className="article-divider" aria-hidden="true" />;
    }

    return <p key={key}>{block}</p>;
  }

  switch (block.type) {
    case 'paragraph':
      if (isMarkdownDivider(block.text)) {
        return <hr key={key} className="article-divider" aria-hidden="true" />;
      }

      return <p key={key}>{block.text}</p>;
    case 'paragraph-columns':
      return renderParagraphColumns(block, key);
    case 'math': {
      const items = normalizeMathItems(block);
      const equationNumbers = Array.isArray(block._equationNumbers) ? block._equationNumbers : [];

      if (!items.length) {
        return null;
      }

      if (block.layout === 'row' || items.length > 1) {
        return (
          <div
            key={key}
            className={`article-math-row${block.wrap === false ? ' article-math-row--nowrap' : ''}`}
          >
            {items.map((item, index) =>
              renderMathItem(item, `${key}-${index}`, equationNumbers[index])
            )}
          </div>
        );
      }

      return renderMathItem(items[0], key, equationNumbers[0]);
    }
    case 'table':
      return renderTableBlock(block, key);
    case 'enumeration':
      return renderEnumerationBlock(block, key);
    case 'bullet-points':
      return renderBulletPointsBlock(block, key);
    case 'image-row':
      return renderImageRowBlock(block, key);
    case 'collapsible':
      return renderCollapsibleBlock(block, key);
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

  const renderedContent = useMemo(() => {
    if (!post) {
      return [];
    }

    return numberMathBlocks(post.content).blocks;
  }, [post]);

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
          {renderedContent.map((block, index) => renderContentBlock(block, `${post.slug}-${index}`))}
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
