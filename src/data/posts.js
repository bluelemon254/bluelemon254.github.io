import { linearAlgebraPosts } from './folders/linearAlgebra/index';
import { vectorCalculusPosts } from './folders/vectorCalculus/index';

export const postFolders = [
  {
    name: '선형대수학',
    posts: linearAlgebraPosts
  },
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
