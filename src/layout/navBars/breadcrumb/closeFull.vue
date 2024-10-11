<template>
	<div class="layout-navbars-close-full" v-if="isTagsViewCurrenFull">
		<div class="layout-navbars-close-full-icon">
			<SvgIcon name="ele-Close" :title="$t('tagsView.closeFullscreen')" @click="onCloseFullscreen" />
		</div>
	</div>
</template>

<script setup lang="ts" name="layoutCloseFull">
import { storeToRefs } from 'pinia';
import { useTagsViewRoutes } from '@cqdcg/admin/stores/tagsViewRoutes';

// 定义变量内容
const stores = useTagsViewRoutes();
const { isTagsViewCurrenFull } = storeToRefs(stores);

// 关闭当前全屏
const onCloseFullscreen = () => {
	stores.setCurrenFullscreen(false);
};
</script>

<style scoped lang="scss">
.layout-navbars-close-full {
	position: fixed;
	top: -30px;
	right: -30px;
	z-index: 9999999999;

	.layout-navbars-close-full-icon {
		position: relative;
		width: 60px;
		height: 60px;
		cursor: pointer;
		background: rgb(0 0 0 / 10%);
		border-radius: 100%;
		transition: all 0.3s ease;

		:deep(i) {
			position: absolute;
			top: 35px;
			left: 10px;
			color: #333;
			transition: all 0.3s ease;
		}
	}

	&:hover {
		transition: all 0.3s ease;

		:deep(i) {
			color: var(--el-color-primary);
			transition: all 0.3s ease;
		}
	}
}
</style>
