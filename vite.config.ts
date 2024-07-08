import { defineConfig } from 'vite';
import * as path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    css: {
        modules: {
            localsConvention: 'camelCase', // 可选，使用驼峰命名法
        },
    },
});
