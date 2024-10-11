<template>
	<component :is="layouts[themeConfig.layout]" />
</template>

<script setup lang="ts" name="layout">
import { onBeforeMount, onUnmounted, defineAsyncComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '@cqdcg/admin/stores/themeConfig';
import { Local } from '@cqdcg/admin/utils/storage';
import mittBus from '@cqdcg/admin/utils/mitt';

// 引入组件
const layouts: any = {
	defaults: defineAsyncComponent(() => import('/@/layout/main/defaults.vue')),
	classic: defineAsyncComponent(() => import('/@/layout/main/classic.vue')),
	transverse: defineAsyncComponent(() => import('/@/layout/main/transverse.vue')),
	columns: defineAsyncComponent(() => import('/@/layout/main/columns.vue')),
};

// 定义变量内容
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);

// 窗口大小改变时(适配移动端)
const onLayoutResize = () => {
	if (!Local.get('oldLayout')) Local.set('oldLayout', themeConfig.value.layout);
	const clientWidth = document.body.clientWidth;
	if (clientWidth < 1000) {
		themeConfig.value.isCollapse = false;
		mittBus.emit('layoutMobileResize', {
			layout: 'defaults',
			clientWidth,
		});
	} else {
		mittBus.emit('layoutMobileResize', {
			layout: 'classic',
			// layout: Local.get('oldLayout') ? Local.get('oldLayout') : themeConfig.value.layout,
			clientWidth,
		});
	}
};
// 页面加载前
onBeforeMount(() => {
	onLayoutResize();
	// storesThemeConfig.setThemeConfig({ themeConfig: {... Local.get('themeConfig'), layout: 'classic'}});
	Local.set('oldLayout', 'classic');
	window.addEventListener('resize', onLayoutResize);
});
// 页面卸载时
onUnmounted(() => {
	window.removeEventListener('resize', onLayoutResize);
});
</script>
