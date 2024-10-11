<template>
	<div class="layout-logo" v-if="setShowLogo" @click="onThemeConfigChange">
		<!-- <span :style="{color:setFontColor}">{{ themeConfig.globalTitle }}</span> -->
		<!-- <span :style="{ color: setFontColor, fontFamily: 'logo-title' }">四川省政务数字化应用全周期管理系统 </span> -->
		<span :style="{ color: setFontColor, fontFamily: 'logo-title' }">{{ themeConfig.globalTitle }} </span>
	</div>
	<div class="layout-logo-size" v-else @click="onThemeConfigChange">
		<img :src="logoMini" class="layout-logo-size-img" />
	</div>
</template>

<script setup lang="ts" name="layoutLogo">
import { useThemeConfig } from '@cqdcg/admin/stores/themeConfig';
import logoMini from '/@/assets/logo-mini.svg';

// 定义变量内容
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);

// 设置 logo 的显示。classic 经典布局默认显示 logo
const setShowLogo = computed(() => {
	let { isCollapse, layout } = themeConfig.value;
	return !isCollapse || layout === 'classic' || document.body.clientWidth < 1000;
});

// 设置 title 的显示颜色。根据布局模式自动显示
const setFontColor = computed(() => {
	let { layout } = themeConfig.value;
	return layout === 'classic' || layout === 'transverse' ? `var(--next-bg-topBarColor)` : 'var(--el-color-primary)';
});

// logo 点击实现菜单展开/收起
const onThemeConfigChange = () => {
	if (themeConfig.value.layout === 'transverse') return false;
	themeConfig.value.isCollapse = !themeConfig.value.isCollapse;
};
</script>

<style scoped lang="scss">
.layout-logo {
	display: flex;
	align-items: center;
	justify-content: center;
	// width: 220px;
	width: auto;
	height: 50px;
	margin-left: 20px;
	font-size: 16px;
	cursor: pointer;
	box-shadow: rgb(0 21 41 / 2%) 0 1px 4px;
	animation: logoAnimation 0.3s ease-in-out;

	span {
		display: inline-block;
		font-size: 21.5px;
		font-weight: 700;
		white-space: nowrap;
	}

	&:hover {
		span {
			color: var(--color-primary-light-2);
		}
	}
}

.layout-logo-size {
	display: flex;
	width: 100%;
	height: 50px;
	cursor: pointer;
	animation: logoAnimation 0.3s ease-in-out;

	&-img {
		width: 20px;
		margin: auto;
	}

	&:hover {
		img {
			animation: logoAnimation 0.3s ease-in-out;
		}
	}
}
</style>
