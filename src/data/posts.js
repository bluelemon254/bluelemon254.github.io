import { emPosts } from './folders/em/index';

export const postFolders = [
  {
    name: '전자기학',
    posts: emPosts
  }
];

export const posts = postFolders.flatMap((folder) =>
  folder.posts.map((post) => ({
    ...post,
    folder: folder.name
  }))
);
