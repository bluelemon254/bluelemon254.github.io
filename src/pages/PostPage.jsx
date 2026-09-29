import { useEffect, useMemo, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Tag from '../components/Tag';
import { contentImageUrl } from '../data/contentImages';
import { posts } from '../data/posts';
import { formatDate } from '../utils/formatDate';

const ALLOWED_MATH_MODES = new Set(['fit', 'scroll', 'full']);
const MIN_MATH_ZOOM = 0.75;
const MATH_NUMBER_GAP = 6;

function renderInline(text) {
  if (typeof text !== 'string') return text;
  const token = /(\\\([\s\S]*?\\\)|\$[^$\n]+\$|`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^\s)]+\))/g;
  const parts = [];
  let start = 0;
  for (const match of text.matchAll(token)) {
    const offset = match.index;
    if (offset > start) parts.push(text.slice(start, offset));
    const value = match[0];
    if (value.startsWith('\\(') || value.startsWith('$')) parts.push(value);
    else if (value.startsWith('`')) parts.push(<code key={offset}>{value.slice(1, -1)}</code>);
    else if (value.startsWith('**')) parts.push(<strong key={offset}>{renderInline(value.slice(2, -2))}</strong>);
    else if (value.startsWith('*')) parts.push(<em key={offset}>{renderInline(value.slice(1, -1))}</em>);
    else {
      const close = value.indexOf('](');
      const href = value.slice(close + 2, -1);
      parts.push(/^(https?:\/\/|mailto:|\/|#|\.\/|\.\.\/)/.test(href)
        ? <a key={offset} href={href}>{value.slice(1, close)}</a>
        : value);
    }
    start = offset + value.length;
  }
  if (!parts.length) return text;
  if (start < text.length) parts.push(text.slice(start));
  return parts;
}

function findScrollableMathElement(target, article) {
  let element = target;
  while (element && element !== article) {
    if (
      element.matches?.('.article-math-expression, mjx-container.article-math-overflow') &&
      element.scrollWidth > element.clientWidth + 1
    ) return element;
    element = element.parentElement;
  }
  return null;
}

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
  const hasEquationNumber = typeof equationNumber === 'number';

  return (
    <div
      key={key}
      className={`article-math article-math--${item.mode}${hasEquationNumber ? ' article-math--numbered' : ''}`}
    >
      <div className="article-math-expression">{`$$${item.value}$$`}</div>
      {hasEquationNumber ? (
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
        <p key={`${key}-${index}`}>{renderInline(text)}</p>
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
                  {renderInline(header)}
                </th>
              ))}
            </tr>
          </thead>
        ) : null}
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`${key}-r-${rowIndex}`}>
              {row.map((cell, cellIndex) => (
                  <td key={`${key}-r-${rowIndex}-c-${cellIndex}`}>{renderInline(cell)}</td>
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
          <img src={contentImageUrl(item.src)} alt={item.alt || ''} loading="lazy" />
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
        <li key={`${key}-item-${index}`}>{renderInline(item)}</li>
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
        <li key={`${key}-item-${index}`}>{renderInline(item)}</li>
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

    return <p key={key}>{renderInline(block)}</p>;
  }

  switch (block.type) {
    case 'paragraph':
      if (isMarkdownDivider(block.text)) {
        return <hr key={key} className="article-divider" aria-hidden="true" />;
      }

      return <p key={key}>{renderInline(block.text)}</p>;
    case 'heading': {
      const level = [2, 3, 4].includes(block.level) ? block.level : 2;
      const Heading = `h${level}`;
      return <Heading key={key} className="article-heading">{renderInline(block.text)}</Heading>;
    }
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
          <img src={contentImageUrl(block.src)} alt={block.alt || ''} loading="lazy" />
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
  const articleRef = useRef(null);
  const mathDragRef = useRef(null);
  const typesetRunRef = useRef({ slug: null, element: null, promise: null });

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

    let resizeObserver;
    let animationFrame;
    let cancelled = false;

    const fitMathToWidth = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        articleRef.current?.querySelectorAll('.article-math--numbered').forEach((box) => {
          box.classList.remove('article-math--centered', 'article-math--scrolling');
        });

        const containers = articleRef.current?.querySelectorAll('.article-body mjx-container[jax="CHTML"]');
        containers?.forEach((container) => {
          if (container.parentElement.closest('mjx-container')) return;

          const math = container.querySelector(':scope > mjx-math');
          const box = container.closest('.article-math--numbered');
          const number = box?.querySelector('.article-math-number');
          let availableWidth = container.parentElement.clientWidth;

          if (number && availableWidth) {
            const boxStyle = getComputedStyle(box);
            const boxRect = box.getBoundingClientRect();
            const contentLeft = boxRect.left + box.clientLeft + Number.parseFloat(boxStyle.paddingLeft);
            const contentWidth = box.clientWidth - Number.parseFloat(boxStyle.paddingLeft) -
              Number.parseFloat(boxStyle.paddingRight);
            const center = contentLeft + contentWidth / 2;
            const numberLeft = number.getBoundingClientRect().left;
            availableWidth = Math.max(1, 2 * (numberLeft - MATH_NUMBER_GAP - center));
          }

          if (!math || !availableWidth) return;

          container.style.zoom = '1';
          container.classList.remove('article-math-overflow');
          const mathWidth = math.getBoundingClientRect().width;
          const requiredZoom = mathWidth > availableWidth
            ? (availableWidth / mathWidth) * 0.98
            : 1;
          container.style.zoom = `${Math.max(MIN_MATH_ZOOM, requiredZoom)}`;
          const needsScroll = math.getBoundingClientRect().width > availableWidth + 0.5;
          container.classList.toggle('article-math-overflow', needsScroll);

          if (box) {
            if (needsScroll) {
              box.style.setProperty('--math-scroll-width', `${availableWidth}px`);
              box.classList.add('article-math--scrolling');
            } else {
              box.classList.add('article-math--centered');
            }
          }
        });

        articleRef.current?.querySelectorAll('.article-math-expression').forEach((expression) => {
          expression.classList.toggle(
            'article-math-expression--draggable',
            expression.scrollWidth > expression.clientWidth + 1
          );
        });
      });
    };

    const typesetAndFit = async () => {
      if (!window.MathJax?.typesetPromise || !articleRef.current) return;
      if (typesetRunRef.current.slug !== post.slug || typesetRunRef.current.element !== articleRef.current) {
        typesetRunRef.current = {
          slug: post.slug,
          element: articleRef.current,
          promise: window.MathJax.typesetPromise([articleRef.current])
        };
      }
      await typesetRunRef.current.promise;
      if (!cancelled) fitMathToWidth();
    };

    if (typeof ResizeObserver !== 'undefined' && articleRef.current) {
      resizeObserver = new ResizeObserver(fitMathToWidth);
      resizeObserver.observe(articleRef.current);
    }

    const article = articleRef.current;
    const handleMathWheel = (event) => {
      const element = findScrollableMathElement(event.target, article);
      if (!element) return;

      const distance = Math.abs(event.deltaX) > Math.abs(event.deltaY)
        ? event.deltaX
        : event.deltaY;
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? element.clientWidth : 1;
      const next = Math.max(0, Math.min(element.scrollWidth - element.clientWidth, element.scrollLeft + distance * unit));
      if (next !== element.scrollLeft) {
        element.scrollLeft = next;
        event.preventDefault();
      }
    };
    article?.addEventListener('wheel', handleMathWheel, { passive: false });

    const mathJaxScript = document.getElementById('MathJax-script');
    mathJaxScript?.addEventListener('load', typesetAndFit);
    typesetAndFit();

    return () => {
      cancelled = true;
      cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
      article?.removeEventListener('wheel', handleMathWheel);
      mathJaxScript?.removeEventListener('load', typesetAndFit);
      mathDragRef.current = null;
    };
  }, [post]);

  const stopMathDrag = (event) => {
    const drag = mathDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    drag.element.classList.remove('article-math-dragging');
    if (drag.element.hasPointerCapture(event.pointerId)) {
      drag.element.releasePointerCapture(event.pointerId);
    }
    mathDragRef.current = null;
  };

  const handleMathPointerDown = (event) => {
    if (event.button !== 0 || !['mouse', 'pen', 'touch'].includes(event.pointerType)) return;

    const element = findScrollableMathElement(event.target, articleRef.current);
    if (element) {
      if (event.pointerType !== 'touch') {
        const scrollbarHeight = (element.offsetHeight - element.clientHeight) *
          (Number.parseFloat(getComputedStyle(element).zoom) || 1);
        if (
          event.target === element &&
          scrollbarHeight > 0 &&
          event.clientY >= element.getBoundingClientRect().bottom - scrollbarHeight
        ) return;
      }

      mathDragRef.current = {
        element,
        pointerId: event.pointerId,
        startX: event.clientX,
        startScrollLeft: element.scrollLeft
      };
      element.setPointerCapture(event.pointerId);
      if (event.pointerType !== 'touch') event.preventDefault();
    }
  };

  const handleMathPointerMove = (event) => {
    const drag = mathDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    drag.element.scrollLeft = drag.startScrollLeft - (event.clientX - drag.startX);
    if (Math.abs(event.clientX - drag.startX) > 2) {
      drag.element.classList.add('article-math-dragging');
    }
  };

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
      <article
        ref={articleRef}
        className="post-article"
        onPointerDown={handleMathPointerDown}
        onPointerMove={handleMathPointerMove}
        onPointerUp={stopMathDrag}
        onPointerCancel={stopMathDrag}
        onLostPointerCapture={stopMathDrag}
      >
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
