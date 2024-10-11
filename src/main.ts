// @ts-nocheck

import { initEnv } from '@cqdcg/admin/utils/env';
initEnv(import.meta.env);
import { setupPinia } from '@cqdcg/admin/stores/index';

import ElementPlus from 'element-plus';
import '/@/theme/tailwind.css';
import 'element-plus/dist/index.css';
import '/@/theme/index.scss';

// import '@cqdcg/admin/dist/style.css';

// @ts-ignore
import BusinessUI from '@cqdcg-ui/business';
// 引入业务组件css
import '@cqdcg-ui/business/dist/es/index.css';

// 部门树组件
import vue3TreeOrg from 'vue3-tree-org';
import 'vue3-tree-org/lib/vue3-tree-org.css';
// 日历组件
import { setupCalendar } from 'v-calendar';

import { DelWrap, DictTag, Editor, Pagination, RightToolbar, Tip, UploadExcel, UploadFile, UploadImg } from '@cqdcg/admin/components/index';
import { dateStr, dateTimeStr, parseDate, parseTime, timeStr } from '@cqdcg/admin/utils/formatTime';

// @ts-ignore 布局工具
import { Pane, Splitpanes } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
import { createApp } from 'vue';
import App from './App.vue';

import { initService } from '@cqdcg/admin/utils/request';
let service = await initService();
import { initI18n } from '@cqdcg/admin/i18n/index';
import router from './router/index';
import { directive } from '@cqdcg/admin/directive/index';

import { elSvg } from '@cqdcg/admin/utils/other';

import VForm3 from '@cqdcg/formdesigner';
import '@cqdcg/formdesigner/dist/designer.style.css';
import { loadCustomWidgets } from '/@/components/form-custom/custom-widgets-loader.js';

const initApp = async () => {
	const app = createApp(App);
	setupPinia(app);
	// 全局方法挂载
	app.config.globalProperties.parseTime = parseTime;
	app.config.globalProperties.parseDate = parseDate;
	app.config.globalProperties.dateTimeStr = dateTimeStr;
	app.config.globalProperties.dateStr = dateStr;
	app.config.globalProperties.timeStr = timeStr;
	app.config.globalProperties.baseURL = import.meta.env.VITE_API_URL;
	app.component('HomeTest', () => import('@cqdcg/admin/views/home/test'));
	// 导入通用自定义组件
	app.component('DictTag', DictTag);
	app.component('Pagination', Pagination);
	app.component('RightToolbar', RightToolbar);
	app.component('uploadExcel', UploadExcel);
	app.component('UploadFile', UploadFile);
	app.component('UploadImg', UploadImg);
	app.component('Editor', Editor);
	app.component('Tip', Tip);
	app.component('DelWrap', DelWrap);
	// 导入布局插件
	app.component('Splitpanes', Splitpanes);
	app.component('Pane', Pane);
	app.use(BusinessUI);
	const i18n = await initI18n();

	directive(app);
	elSvg(app);
	app
		.use(router) // 路由
		.use(ElementPlus) // ElementPlus 全局引入
		// .use(ElementIcons) // elementIcons 图标全局引入
		.use(VForm3) // 表单设计
		.use(vue3TreeOrg) // 组织架构组件
		.use(i18n) // 国际化
		.use(setupCalendar, {}); // 日历组件
	window.axios = service;
	loadCustomWidgets(app);
	app.mount('#app');
};

initApp();
