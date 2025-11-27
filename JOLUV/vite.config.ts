import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // '/api'로 시작하는 요청을 백엔드 서버로 전달
      '/api': {
        target: 'http://16.176.198.162:8080', // 백엔드 서버 주소
        changeOrigin: true,
        secure: false,
        // 👇 rewrite 설정을 제거합니다. (이제 /api가 그대로 백엔드로 전달됨)
        // rewrite: (path) => path.replace(/^\/api/, ''), 
      },
    },
  },
});