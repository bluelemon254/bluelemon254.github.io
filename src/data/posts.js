import { vectorCalculusPosts } from './folders/vectorCalculus/index';

export const postFolders = [
  {
    name: '벡터미적분학',
    posts: vectorCalculusPosts
  }
];

export const posts = postFolders.flatMap((folder) =>
  folder.posts.map((post) => ({
    ...post,
    folder: folder.name
  }))
);
