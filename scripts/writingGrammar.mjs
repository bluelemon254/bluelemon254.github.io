import path from 'node:path';

const MATH_MODES = new Set(['fit', 'full', 'scroll']);

function fail(file, line, message) {
  throw new Error(`${file}:${line}: ${message}`);
}

function imageFromLine(line) {
  const match = line.match(/^!\[([^\]]*)\]\(([^\s)]+)(?:\s+"([^"]*)")?\)$/);
  return match && { src: match[2], alt: match[1], ...(match[3] ? { caption: match[3] } : {}) };
}

function tableCells(line) {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim());
}

function isTableSeparator(line) {
  return tableCells(line).every((cell) => /^:?-{3,}:?$/.test(cell));
}

export function parsePost(source, file = 'post.md') {
  const lines = source.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').split('\n');
  let index = 0;

  if (lines[index]?.trim() !== '---') fail(file, 1, '첫 줄은 메타데이터 시작선 --- 이어야 합니다.');
  index += 1;

  const metadata = {};
  while (index < lines.length && lines[index].trim() !== '---') {
    const line = lines[index];
    if (line.trim()) {
      const match = line.match(/^([a-z][a-z-]*):\s*(.*)$/i);
      if (!match) fail(file, index + 1, '메타데이터는 key: value 형식이어야 합니다.');
      if (Object.hasOwn(metadata, match[1])) fail(file, index + 1, `중복된 메타데이터: ${match[1]}`);
      metadata[match[1]] = match[2].trim();
    }
    index += 1;
  }
  if (index === lines.length) fail(file, lines.length, '메타데이터를 닫는 --- 가 없습니다.');
  index += 1;

  for (const key of ['title', 'date', 'summary', 'folder']) {
    if (!metadata[key]) fail(file, 1, `필수 메타데이터 ${key}가 없습니다.`);
  }
  const allowedMetadata = new Set(['title', 'date', 'summary', 'folder', 'tags', 'slug']);
  for (const key of Object.keys(metadata)) {
    if (!allowedMetadata.has(key)) fail(file, 1, `알 수 없는 메타데이터: ${key}`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(metadata.date) ||
      Number.isNaN(Date.parse(`${metadata.date}T00:00:00Z`))) {
    fail(file, 1, 'date는 YYYY-MM-DD 형식이어야 합니다.');
  }
  const slug = metadata.slug || path.basename(file, path.extname(file));
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    fail(file, 1, 'slug 또는 파일 이름은 영문 소문자·숫자·하이픈만 사용할 수 있습니다.');
  }

  function options(text, allowed) {
    const result = {};
    for (const part of text.trim().split(/\s+/).filter(Boolean)) {
      const match = part.match(/^([a-z]+)=(\S+)$/);
      if (!match || !allowed.has(match[1]) || Object.hasOwn(result, match[1])) {
        fail(file, index + 1, `잘못된 블록 옵션: ${part}`);
      }
      result[match[1]] = match[2];
    }
    if (result.mode && !MATH_MODES.has(result.mode)) fail(file, index + 1, 'mode는 fit, full, scroll 중 하나입니다.');
    for (const key of ['numbered', 'wrap']) {
      if (result[key] && !['true', 'false'].includes(result[key])) {
        fail(file, index + 1, `${key}는 true 또는 false여야 합니다.`);
      }
    }
    return result;
  }

  function dollarMath() {
    const start = index;
    const opening = lines[index].trim();
    if (opening !== '$$') {
      const single = opening.match(/^\$\$(.+)\$\$$/);
      if (!single) fail(file, index + 1, '수식은 $$ 단독 줄 또는 $$수식$$ 한 줄로 작성하세요.');
      index += 1;
      return single[1].trim();
    }
    index += 1;
    const body = [];
    while (index < lines.length && lines[index].trim() !== '$$') {
      body.push(lines[index]);
      index += 1;
    }
    if (index === lines.length) fail(file, start + 1, '수식을 닫는 $$가 없습니다.');
    index += 1;
    const value = body.join('\n').trim();
    if (!value) fail(file, start + 1, '빈 수식은 사용할 수 없습니다.');
    return value;
  }

  function collectUntilClose(kind) {
    const start = index;
    const body = [];
    index += 1;
    while (index < lines.length && lines[index].trim() !== ':::') {
      body.push(lines[index]);
      index += 1;
    }
    if (index === lines.length) fail(file, start + 1, `${kind} 블록을 닫는 :::가 없습니다.`);
    index += 1;
    return body;
  }

  function blocks(nested = false) {
    const result = [];
    while (index < lines.length) {
      const line = lines[index].trim();
      if (!line) { index += 1; continue; }
      if (line === ':::') {
        if (!nested) fail(file, index + 1, '대응하는 시작 블록이 없는 :::입니다.');
        index += 1;
        return result;
      }

      const blockMatch = line.match(/^:::(\w[\w-]*)(?:\s+(.*))?$/);
      if (blockMatch) {
        const [, kind, argument = ''] = blockMatch;
        if (kind === 'details') {
          if (!argument.trim()) fail(file, index + 1, 'details 제목이 필요합니다.');
          index += 1;
          result.push({ type: 'collapsible', title: argument.trim(), content: blocks(true) });
          continue;
        }
        if (kind === 'math') {
          const opt = options(argument, new Set(['mode', 'numbered']));
          const body = collectUntilClose(kind).join('\n').trim();
          if (!body) fail(file, index + 1, '빈 수식은 사용할 수 없습니다.');
          result.push({ type: 'math', mode: opt.mode || 'full', value: body,
            ...(opt.numbered === 'false' ? { numbered: false } : {}) });
          continue;
        }
        if (kind === 'math-row') {
          const opt = options(argument, new Set(['mode', 'numbered', 'wrap']));
          const body = collectUntilClose(kind);
          const inner = parseMathRow(body, file, index - body.length - 1);
          result.push({ type: 'math', layout: 'row', mode: opt.mode || 'full', values: inner,
            ...(opt.numbered === 'false' ? { numbered: false } : {}),
            ...(opt.wrap === 'false' ? { wrap: false } : {}) });
          continue;
        }
        if (kind === 'columns') {
          if (argument) fail(file, index + 1, 'columns에는 옵션을 쓰지 않습니다.');
          const body = collectUntilClose(kind).join('\n').trim();
          const columns = body.split(/\n\s*\n/).map((item) => item.replace(/\n/g, ' ').trim()).filter(Boolean);
          if (columns.length < 2) fail(file, index + 1, 'columns에는 빈 줄로 구분한 문단이 2개 이상 필요합니다.');
          result.push({ type: 'paragraph-columns', columns });
          continue;
        }
        if (kind === 'image-row') {
          if (argument) fail(file, index + 1, 'image-row에는 옵션을 쓰지 않습니다.');
          const body = collectUntilClose(kind).filter((item) => item.trim());
          const images = body.map((item) => imageFromLine(item.trim()));
          if (!images.length || images.some((item) => !item)) {
            fail(file, index + 1, 'image-row에는 Markdown 이미지 줄만 넣으세요.');
          }
          result.push({ type: 'image-row', images });
          continue;
        }
        if (kind === 'table') {
          const body = collectUntilClose(kind).filter((item) => item.trim());
          if (body.length < 2 || !body[0].includes('|') || !isTableSeparator(body[1])) {
            fail(file, index + 1, 'table에는 Markdown 표가 필요합니다.');
          }
          const headers = tableCells(body[0]);
          const rows = body.slice(2).map((row) => tableCells(row));
          if (rows.some((row) => row.length !== headers.length)) {
            fail(file, index + 1, '표의 열 개수가 머리글과 다릅니다.');
          }
          result.push({ type: 'table', headers, rows,
            ...(argument.trim() ? { caption: argument.trim() } : {}) });
          continue;
        }
        fail(file, index + 1, `알 수 없는 블록: ${kind}`);
      }

      if (line.startsWith('```')) {
        const start = index;
        const match = line.match(/^```([\w+#-]*)(?:\s+(numbers))?$/);
        if (!match) fail(file, index + 1, '코드 블록은 ```언어 또는 ```언어 numbers 형식입니다.');
        index += 1;
        const code = [];
        while (index < lines.length && lines[index].trim() !== '```') {
          code.push(lines[index]);
          index += 1;
        }
        if (index === lines.length) fail(file, start + 1, '코드 블록을 닫는 ```가 없습니다.');
        index += 1;
        result.push({ type: 'code', language: match[1] || 'text', code: code.join('\n'),
          ...(match[2] ? { showLineNumbers: true } : {}) });
        continue;
      }
      if (line.startsWith('$$')) {
        result.push({ type: 'math', mode: 'full', value: dollarMath() });
        continue;
      }
      if (line === '---') { result.push('---'); index += 1; continue; }
      const heading = line.match(/^(#{2,4})\s+(.+)$/);
      if (heading) {
        result.push({ type: 'heading', level: heading[1].length, text: heading[2] });
        index += 1;
        continue;
      }
      const image = imageFromLine(line);
      if (image) { result.push({ type: 'image', ...image }); index += 1; continue; }
      const listKind = /^[-*]\s+/.test(line) ? 'bullet-points' : /^\d+\.\s+/.test(line) ? 'enumeration' : null;
      if (listKind) {
        const pattern = listKind === 'enumeration' ? /^\d+\.\s+(.+)$/ : /^[-*]\s+(.+)$/;
        const items = [];
        while (index < lines.length) {
          const match = lines[index].trim().match(pattern);
          if (!match) break;
          items.push(match[1]);
          index += 1;
        }
        result.push({ type: listKind, items });
        continue;
      }
      if (line.includes('|') && index + 1 < lines.length && isTableSeparator(lines[index + 1])) {
        const headers = tableCells(line);
        index += 2;
        const rows = [];
        while (index < lines.length && lines[index].trim().includes('|')) {
          const cells = tableCells(lines[index]);
          if (cells.length !== headers.length) fail(file, index + 1, '표의 열 개수가 머리글과 다릅니다.');
          rows.push(cells);
          index += 1;
        }
        result.push({ type: 'table', headers, rows });
        continue;
      }

      const paragraph = [];
      while (index < lines.length) {
        const current = lines[index].trim();
        if (!current || current === ':::' || current === '---' || current.startsWith(':::') ||
            current.startsWith('```') || current.startsWith('$$') || /^(#{2,4})\s+/.test(current) ||
            imageFromLine(current) || /^[-*]\s+/.test(current) || /^\d+\.\s+/.test(current) ||
            (current.includes('|') && index + 1 < lines.length && isTableSeparator(lines[index + 1]))) break;
        paragraph.push(current);
        index += 1;
      }
      if (!paragraph.length) fail(file, index + 1, `지원하지 않는 문법: ${line}`);
      result.push({ type: 'paragraph', text: paragraph.join(' ') });
    }
    if (nested) fail(file, lines.length, 'details 블록을 닫는 :::가 없습니다.');
    return result;
  }

  return {
    slug,
    title: metadata.title,
    date: metadata.date,
    summary: metadata.summary,
    tags: (metadata.tags || '').replace(/^\[/, '').replace(/\]$/, '').split(',').map((tag) => tag.trim()).filter(Boolean),
    folder: metadata.folder,
    content: blocks()
  };
}

function parseMathRow(lines, file, offset) {
  const values = [];
  let index = 0;
  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) { index += 1; continue; }
    if (line === '$$') {
      const start = index;
      index += 1;
      const body = [];
      while (index < lines.length && lines[index].trim() !== '$$') {
        body.push(lines[index]);
        index += 1;
      }
      if (index === lines.length) fail(file, offset + start + 1, 'math-row 수식을 닫는 $$가 없습니다.');
      index += 1;
      if (!body.join('\n').trim()) fail(file, offset + start + 1, '빈 수식은 사용할 수 없습니다.');
      values.push(body.join('\n').trim());
    } else {
      const match = line.match(/^\$\$(.+)\$\$$/);
      if (!match) fail(file, offset + index + 1, 'math-row에는 $$수식$$만 넣으세요.');
      values.push(match[1].trim());
      index += 1;
    }
  }
  if (values.length < 2) fail(file, offset + 1, 'math-row에는 수식이 2개 이상 필요합니다.');
  return values;
}
