import { defineConfig } from 'vite';
import baseConfig from './vite.config';
import react from '@vitejs/plugin-react';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import dtsPlugin from 'vite-plugin-dts';
import nodeResolve from '@rollup/plugin-node-resolve';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import del from 'rollup-plugin-delete';
import path from 'node:path';

export default defineConfig({
    ...baseConfig,
    plugins: [
        react(),
        createSvgIconsPlugin({
            // 需要自动导入的 svg 文件目录（可自行修改）我的路径如下图所示
            iconDirs: [path.resolve(process.cwd(), 'src/assets/icons/svg')],
            // 执行icon name的格式（可自行修改）
            symbolId: 'icon-[name]',
        }),
        cssInjectedByJsPlugin(),
        dtsPlugin({
            tsconfigPath: './tsconfig.json',
            rollupTypes: true,
        }),
    ],
    build: {
        terserOptions:{
            compress: {
                drop_console: true, // 移除 console.log 语句
                drop_debugger: true, // 移除 debugger 语句
            },
            format: {
                comments: false, // 移除注释
            },
        },
        assetsInlineLimit: 10 * 1024, // 小于10k的资源文件将以dataUrl的方式导入
        sourcemap: 'hidden', // 生成sourcemap但是取消最后的注释，如果遇到bug可自行添加注销进行debug
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'player',
            formats: ['es', 'cjs', 'umd'],
        },
        rollupOptions: {
            external: ['react', 'react-dom'],
            output: [
                {
                    format: 'es',
                    dir: 'dist/es',
                    entryFileNames: '[name].js',
                },
                {
                    format: 'cjs',
                    dir: 'dist/cjs',
                    entryFileNames: '[name].js',
                },
                {
                    format: 'umd',
                    dir: 'dist/umd',
                    entryFileNames: '[name].js',
                    name: 'player',
                    globals: {
                        react: 'React',
                        'react-dom': 'ReactDOM',
                    },
                },
            ],
            plugins: [
                del({
                    targets: ['dist/*'],
                }),
                nodeResolve(),
            ],
        },
    },
});
