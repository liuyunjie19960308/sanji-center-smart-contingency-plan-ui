<template>
	<form-item-wrapper
		:designer="designer"
		:field="field"
		:rules="rules"
		:design-state="designState"
		:parent-widget="parentWidget"
		:parent-list="parentList"
		:index-of-parent-list="indexOfParentList"
		:sub-form-row-index="subFormRowIndex"
		:sub-form-col-index="subFormColIndex"
		:sub-form-row-id="subFormRowId"
	>
		<div class="full-width-input" :class="{ 'readonly-mode-cascader': isReadMode }">
			<el-cascader
				ref="fieldEditor"
				:options="cascaderOptions"
				v-model="fieldModel"
				:disabled="field.options.disabled || isReadMode"
				:clearable="field.options.clearable"
				:filterable="field.options.filterable"
				:placeholder="field.options.placeholder || i18nt('render.hint.selectPlaceholder')"
				:show-all-levels="showFullPath"
				:props="{
					checkStrictly: field.options.checkStrictly,
					multiple: field.options.multiple,
					expandTrigger: 'hover',
					value: valueKey,
					label: labelKey,
					children: childrenKey,
				}"
				@visible-change="hideDropDownOnClick"
				@expand-change="hideDropDownOnClick"
				@focus="handleFocusCustomEvent"
				@blur="handleBlurCustomEvent"
				@change="handleChangeEvent"
			>
			</el-cascader>
			<template v-if="isReadMode">
				<span class="readonly-mode-field">{{ getContentForReadMode() }}</span>
			</template>
		</div>
	</form-item-wrapper>
</template>

<script>
import VForm3 from '@cqdcg/formdesigner';
const { FormItemWrapper, emitter, i18n, fieldMixin } = VForm3.VFormSDK;
import { useTreeDictAsync } from '@cqdcg/admin/hooks/dict';
import { pcTextArr, pcaTextArr } from 'element-china-area-data';

export default {
	name: 'dict-cascader-widget',
	componentName: 'FieldWidget', //必须固定为FieldWidget，用于接收父级组件的broadcast事件
	mixins: [emitter, fieldMixin, i18n],
	props: {
		field: Object,
		parentWidget: Object,
		parentList: Array,
		indexOfParentList: Number,
		designer: Object,

		designState: {
			type: Boolean,
			default: false,
		},

		subFormRowIndex: {
			/* 子表单组件行索引，从0开始计数 */ type: Number,
			default: -1,
		},
		subFormColIndex: {
			/* 子表单组件列索引，从0开始计数 */ type: Number,
			default: -1,
		},
		subFormRowId: {
			/* 子表单组件行Id，唯一id且不可变 */ type: String,
			default: '',
		},
	},
	components: {
		FormItemWrapper,
	},
	data() {
		return {
			oldFieldValue: null, //field组件change之前的值
			fieldModel: null,
			rules: [],
		};
	},
	computed: {
		labelKey() {
			return this.field.options.labelKey || 'label';
		},

		valueKey() {
			return this.field.options.valueKey || 'value';
		},

		childrenKey() {
			return this.field.options.childrenKey || 'children';
		},

		showFullPath() {
			return this.field.options.showAllLevels === undefined || !!this.field.options.showAllLevels;
		},

		/* 计算属性会被缓存，已弃用，改用getContentForReadMode方法！！ */
		// contentForReadMode() {
		//   let onlyLeafFlag = !this.field.options.checkStrictly
		//   let checkedNodes = this.$refs.fieldEditor.getCheckedNodes(onlyLeafFlag)
		//   if (!checkedNodes || (checkedNodes.length <= 0)) {
		//     return '--'
		//   } else {
		//     return checkedNodes.map(nodeItem => nodeItem.text).join(", ")
		//   }
		// },

		cascaderOptions() {
			if (this.field.options.areaDataEnabled && this.field.options.areaDataType === 1) {
				return pcTextArr;
			} else if (this.field.options.areaDataEnabled && this.field.options.areaDataType === 2) {
				return pcaTextArr;
			}

			return this.field.options.optionItems;
		},
	},
	beforeCreate() {
		/* 这里不能访问方法和属性！！ */
	},

	created() {
		/* 注意：子组件mounted在父组件created之后、父组件mounted之前触发，故子组件mounted需要用到的prop
           需要在父组件created中初始化！！ */
		this.registerToRefList();
		this.initDict();
		this.initFieldModel();
		this.initEventHandler();
		this.buildFieldRules();

		this.handleOnCreated();
	},

	mounted() {
		this.handleOnMounted();
	},

	beforeUnmount() {
		this.unregisterFromRefList();
	},

	methods: {
		/* 开启任意级节点可选后，点击radio隐藏下拉框 */
		hideDropDownOnClick() {
			setTimeout(() => {
				document.querySelectorAll('.el-cascader-panel .el-radio').forEach((el) => {
					el.onclick = () => {
						//console.log('test====', 1111)
						this.$refs.fieldEditor.popperVisible = false; // 单选框部分点击隐藏下拉框
					};
				});
			}, 100);
		},

		getContentForReadMode() {
			let onlyLeafFlag = !this.field.options.checkStrictly;
			let checkedNodes = [];
			if (this.$refs.fieldEditor) {
				checkedNodes = this.$refs.fieldEditor.getCheckedNodes(onlyLeafFlag);
			}
			if (!checkedNodes || checkedNodes.length <= 0) {
				return '--';
			} else {
				return checkedNodes.map((nodeItem) => nodeItem.label || nodeItem.text).join(', ');
			}
		},
		async initDict() {
			if (this.field.options.dictName) {
				const res = await useTreeDictAsync(this.field.options.dictName);
				this.field.options.optionItems = JSON.parse(JSON.stringify(res[this.field.options.dictName]));
			} else {
				this.initOptionItems();
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.full-width-input {
	width: 100% !important;

	:deep(.el-cascader) {
		width: 100% !important;
	}
}

.readonly-mode-cascader :deep(.el-cascader) {
	display: none;
}
</style>
