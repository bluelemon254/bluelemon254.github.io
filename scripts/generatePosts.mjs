import { readFile, readdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { parsePost } from './writingGrammar.mjs';

export const postsDirectory = fileURLToPath(new URL('../content/posts/', import.meta.url));
const outputFile = fileURLToPath(new URL('../src/data/generatedPosts.js', import.meta.url));

export async function generatePosts() {
  const entries = await readdir(postsDirectory, { withFileTypes: true });
  const files = entries.filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name).sort();
  const posts = [];
  const slugs = new Set();

  for (const file of files) {
    const source = await readFile(path.join(postsDirectory, file), 'utf8');
    const post = parsePost(source, file);
    if (slugs.has(post.slug)) throw new Error(`${file}: 중복된 slug: ${post.slug}`);
    slugs.add(post.slug);
    posts.push(post);
  }

  const output = `// Generated from content/posts/*.md. Do not edit by hand.\nexport const generatedPosts = ${JSON.stringify(posts, null, 2)};\n`;
  const previous = await readFile(outputFile, 'utf8').catch((error) => {
    if (error.code === 'ENOENT') return null;
    throw error;
  });
  if (output !== previous) await writeFile(outputFile, output, 'utf8');
  return posts.length;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  generatePosts()
    .then((count) => console.log(`Generated ${count} Markdown post(s).`))
    .catch((error) => { console.error(error); process.exitCode = 1; });
}
