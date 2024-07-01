import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {createSvgIconsPlugin} from 'vite-plugin-svg-icons';
import * as path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      react(),
      createSvgIconsPlugin({
        // 需要自动导入的 svg 文件目录（可自行修改）我的路径如下图所示
        iconDirs: [path.resolve(process.cwd(), "src/icons/svg")],
        // 执行icon name的格式（可自行修改）
        symbolId: "icon-[name]",
      }),
  ],
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
  server: {
    headers: {
      'Cache-Control': 'no-cache',
    },
  },
})
