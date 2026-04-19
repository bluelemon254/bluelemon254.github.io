import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const githubRepository = process.env.GITHUB_REPOSITORY ?? '';
const [owner = '', repoName = ''] = githubRepository.split('/');
const isUserPageRepo = repoName === `${owner}.github.io`;

export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS
    ? isUserPageRepo
      ? '/'
      : `/${repoName}/`
    : '/',
});
