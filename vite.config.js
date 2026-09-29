import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { generatePosts, postsDirectory } from './scripts/generatePosts.mjs';

const githubRepository = process.env.GITHUB_REPOSITORY ?? '';
const [owner = '', repoName = ''] = githubRepository.split('/');
const isUserPageRepo = repoName === `${owner}.github.io`;

function writingPostsPlugin() {
  return {
    name: 'writing-posts',
    async buildStart() {
      await generatePosts();
    },
    configureServer(server) {
      server.watcher.add(postsDirectory);
      let pending = Promise.resolve();
      const regenerate = (file) => {
        if (path.resolve(path.dirname(file)) !== path.resolve(postsDirectory) || !file.endsWith('.md')) return;
        pending = pending.catch(() => {}).then(() => generatePosts()).catch((error) => {
          console.error(error);
          server.ws.send({ type: 'error', err: { message: error.message, stack: error.stack } });
        });
      };
      for (const event of ['add', 'change', 'unlink']) server.watcher.on(event, regenerate);
    }
  };
}

export default defineConfig({
  plugins: [react(), writingPostsPlugin()],
  base: process.env.GITHUB_ACTIONS
    ? isUserPageRepo
      ? '/'
      : `/${repoName}/`
    : '/',
});
