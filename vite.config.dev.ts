import { defineConfig } from 'vite';
import baseConfig from './vite.config';
import react from '@vitejs/plugin-react';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import path from 'node:path';

export default defineConfig({
    ...baseConfig,
    plugins: [
        react(),
        createSvgIconsPlugin({
            // 需要自动导入的 svg 文件目录（可自行修改）
            iconDirs: [path.resolve(process.cwd(), 'src/assets/icons/svg')],
            // 执行icon name的格式（可自行修改）
            symbolId: 'icon-[name]',
        }),
    ],
    root: 'example',
});
