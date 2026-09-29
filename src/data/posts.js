import { generatedPosts } from './generatedPosts';

export const postFolders = [...new Set(generatedPosts.map((post) => post.folder))].map((name) => ({
  name,
  posts: generatedPosts.filter((post) => post.folder === name)
}));

export const posts = postFolders.flatMap((folder) =>
  folder.posts.map((post) => ({
    ...post,
    folder: folder.name
  }))
);

const seenSlugs = new Set();
for (const post of posts) {
  if (seenSlugs.has(post.slug)) throw new Error(`Duplicate post slug: ${post.slug}`);
  seenSlugs.add(post.slug);
}
