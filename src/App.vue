<template>
	<el-config-provider :size="getGlobalComponentSize" :locale="getGlobalI18n">
		<router-view v-show="setLockScreen" />
		<LockScreen v-if="themeConfig.isLockScreen" />
		<Setings ref="settingsRef" v-show="themeConfig.lockScreenTime > 1" />
		<CloseFull v-if="!themeConfig.isLockScreen" />
	</el-config-provider>
</template>

<script setup lang="ts" name="app">
import { useI18n } from 'vue-i18n';
import { useTagsViewRoutes } from '@cqdcg/admin/stores/tagsViewRoutes';
import { useThemeConfig } from '@cqdcg/admin/stores/themeConfig';
import { globalComponentSize, useTitle } from '@cqdcg/admin/utils/other';
import { Local, Session } from '@cqdcg/admin/utils/storage';
import { emitter as mittBus } from '@cqdcg/admin/utils/mitt';
import setIntroduction from '@cqdcg/admin/utils/setIconfont';

// 引入组件
const LockScreen = defineAsyncComponent(() => import('@cqdcg/admin/layout/lockScreen/index'));
const Setings = defineAsyncComponent(() => import('@cqdcg/admin/layout/navBars/breadcrumb/setings'));
const CloseFull = defineAsyncComponent(() => import('@cqdcg/admin/layout/navBars/breadcrumb/closeFull'));

// 定义变量内容
const { messages, locale } = useI18n();
const settingsRef = ref();
const route = useRoute();
const stores = useTagsViewRoutes();
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
// provide('VITE_REGISTER_ENABLE', import.meta.env.VITE_REGISTER_ENABLE);
// provide('VITE_VERIFY_ENABLE', import.meta.env.VITE_VERIFY_ENABLE);
// provide('VITE_VERIFY_IMAGE_ENABLE', import.meta.env.VITE_VERIFY_IMAGE_ENABLE);
// provide('VITE_IS_MICRO', import.meta.env.VITE_IS_MICRO);
// provide('VITE_API_URL', import.meta.env.VITE_API_URL);
// provide('VITE_AUTO_TENANT', import.meta.env.VITE_AUTO_TENANT);
// provide('VITE_GLOBAL_TITLE', import.meta.env.VITE_GLOBAL_TITLE);
// provide('VITE_FOOTER_TITLE', import.meta.env.VITE_FOOTER_TITLE);
provide('ViteEnv', import.meta.env);

// 设置锁屏时组件显示隐藏
const setLockScreen = computed(() => {
	// 防止锁屏后，刷新出现不相关界面
	// https://gitee.com/lyt-top/vue-next-admin/issues/I6AF8P
	return themeConfig.value.isLockScreen ? themeConfig.value.lockScreenTime > 1 : themeConfig.value.lockScreenTime >= 0;
});

// 获取全局组件大小
const getGlobalComponentSize = computed(() => {
	return globalComponentSize();
});
// 获取全局 i18n
const getGlobalI18n = computed(() => {
	return messages.value[locale.value];
});
// 设置初始化，防止刷新时恢复默认
onBeforeMount(() => {
	// 设置批量第三方 icon 图标
	setIntroduction.cssCdn();
	// 设置批量第三方 js
	setIntroduction.jsCdn();
});
// 页面加载时
onMounted(() => {
	nextTick(() => {
		// 监听布局配'置弹窗点击打开
		mittBus.on('openSetingsDrawer', () => {
			settingsRef.value.openDrawer();
		});
		// 获取缓存中的布局配置
		if (Local.get('themeConfig')) {
			storesThemeConfig.setThemeConfig({ themeConfig: Local.get('themeConfig') });
			document.documentElement.style.cssText = Local.get('themeConfigStyle');
		}
		// 获取缓存中的全屏配置
		if (Session.get('isTagsViewCurrenFull')) {
			stores.setCurrenFullscreen(Session.get('isTagsViewCurrenFull'));
		}
	});
});
// 页面销毁时，关闭监听布局配置/i18n监听
onUnmounted(() => {
	mittBus.off('openSetingsDrawer', () => {});
});
// 监听路由的变化，设置网站标题
watch(
	() => route.path,
	() => {
		useTitle();
	},
	{
		deep: true,
	}
);
</script>
