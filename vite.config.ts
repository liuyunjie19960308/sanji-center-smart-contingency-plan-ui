import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig, loadEnv, ConfigEnv } from 'vite';
import vueSetupExtend from 'vite-plugin-vue-setup-extend';
import AutoImport from 'unplugin-auto-import/vite';
import topLevelAwait from 'vite-plugin-top-level-await';
import { createStyleImportPlugin, VxeTableResolve } from 'vite-plugin-style-import';
import viteCompression from 'vite-plugin-compression';
// @ts-ignore
import { svgBuilder } from '/@/components/IconSelector/index';
import { visualizer } from 'rollup-plugin-visualizer';

const pathResolve = (dir: string) => {
	return resolve(__dirname, '.', dir);
};

const alias: Record<string, string> = {
	'/@': pathResolve('./src/'),
	'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
};

const viteConfig = defineConfig((mode: ConfigEnv) => {
	const env = loadEnv(mode.mode, process.cwd());
	return {
		plugins: [
			vue(), // Vue 插件
			svgBuilder('./src/assets/icons/'), // 将 SVG 文件转换成 Vue 组件
			vueSetupExtend(), // setup语法糖增强插件
			AutoImport({
				imports: ['vue', 'vue-router', 'pinia'], // 自动导依赖库数组
				dts: './auto-imports.d.ts', // 自动导入类型定义文件路径
			}),
			createStyleImportPlugin({
				resolves: [VxeTableResolve()], // 配置vxetable 按需加载
			}),
			topLevelAwait({
				promiseExportName: '__tla', // TLA Promise 变量名
				promiseImportName: (i) => `__tla_${i}`, // TLA Promise 导入名
			}),
			viteCompression({
				deleteOriginFile: false, // 压缩后删除原来的文件
			}),
			visualizer({
				// 打包完成后自动打开浏览器，显示产物体积报告
				open: true,
			}),
		],
		root: process.cwd(), // 项目根目录
		resolve: { alias, extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'] }, // 路径别名配置
		base: mode.command === 'serve' ? './' : env.VITE_PUBLIC_PATH,
		optimizeDeps: {
			include: [
				'vue',
				'vue-router',
				'pinia',
				'axios',
				'@vueuse/core',
				'element-plus',
				'element-plus/es/locale/lang/zh-cn',
				'element-plus/es/locale/lang/en',
				'@cqdcg-ui/business',
				'@cqdcg/admin',
				'@cqdcg/formdesigner',
			],
		},
		server: {
			host: '0.0.0.0', // 服务器地址
			port: env.VITE_PORT as unknown as number, // 服务器端口号
			open: env.VITE_OPEN === 'true', // 是否自动打开浏览器
			hmr: true, // 启用热更新
			proxy: {
				'/api/gen': {
					//单体架构下特殊处理代码生成模块代理
					target: env.VITE_IS_MICRO === 'true' ? env.VITE_ADMIN_PROXY_PATH : env.VITE_GEN_PROXY_PATH,
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, ''),
				},
				'/api': {
					// target: env.VITE_ADAdmin@1NBi*&^52MIN_PROXY_PATH, // 目标服务器地址
					// target: 'http://23.99.220.142:31100/api', //vpn 服务器
					target: 'https://mock1.router.fishliu.com/mock/12', // mock 服务器
					// target: 'http://192.168.5.52:9999', //黄彬洋
					// target: 'http://192.168.5.28:9999', //吴军
					// target: 'http://192.168.5.124:9999', //吴振宁
					// target: 'http://192.168.5.127:9999', // 董博
					// target: 'http://192.168.5.156:9999', // 彭航

					ws: true, // 是否启用 WebSocket
					changeOrigin: true, // 是否修改请求头中的 Origin 字段
					rewrite: (path) => path.replace(/^\/api/, ''),
				},
				'^/ws/info/.*': {
					target: env.VITE_ADMIN_PROXY_PATH, // 目标服务器地址
					ws: true, // 是否启用 WebSocket
					changeOrigin: true,
				},
			},
		},
		build: {
			outDir: 'dist',
			chunkSizeWarningLimit: 1500,
			rollupOptions: {
				output: {
					manualChunks: {
						vue: ['vue', 'vue-router', 'pinia', 'axios'],
						elementPlus: ['element-plus'],
						echarts: ['echarts'],
						cqdcgUI: ['@cqdcg-ui/business'],
						cqdcgAdmin: ['@cqdcg/admin'],
						cqdcgFormdesigner: ['@cqdcg/formdesigner'],
					},
				},
			},
		},
		css: { preprocessorOptions: { css: { charset: false } } },
		define: {
			__VUE_I18N_LEGACY_API__: JSON.stringify(false),
			__VUE_I18N_FULL_INSTALL__: JSON.stringify(false),
			__INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false),
			__VERSION__: JSON.stringify(process.env.npm_package_version),
			__NEXT_NAME__: JSON.stringify(process.env.npm_package_name),
		},
	};
});

export default viteConfig;
