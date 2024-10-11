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
		:path="path"
	>
		<el-select
			ref="fieldEditor"
			v-model="fieldModel"
			v-show="!isReadMode"
			class="full-width-input"
			:key="selectKey"
			:disabled="field.options.disabled"
			:clearable="field.options.clearable"
			:filterable="field.options.filterable"
			:allow-create="field.options.allowCreate"
			:default-first-option="allowDefaultFirstOption"
			:reserve-keyword="false"
			:automatic-dropdown="field.options.automaticDropdown"
			:multiple="field.options.multiple"
			:multiple-limit="field.options.multipleLimit"
			:collapse-tags="field.options.collapseTags"
			:placeholder="field.options.placeholder || i18nt('render.hint.selectPlaceholder')"
			:remote="field.options.remote"
			:remote-method="remoteMethod"
			:persistent="true"
			@focus="handleFocusCustomEvent"
			@blur.capture="handleBlurCustomEvent"
			@change="handleChangeEvent"
		>
			<el-option v-for="item in field.options.optionItems" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled">
			</el-option>
		</el-select>
		<template v-if="isReadMode">
			<span class="readonly-mode-field">{{ optionLabel }}</span>
		</template>
	</form-item-wrapper>
</template>

<script>
import VForm3 from '@cqdcg/formdesigner';
const { FormItemWrapper, emitter, i18n, fieldMixin, generateId } = VForm3.VFormSDK;
import { useDictAsync } from '@cqdcg/admin/hooks/dict';

export default {
	name: 'dict-select-widget',
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
		path: {
			type: Array,
			default: function () {
				return [];
			},
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
			widgetKey: '',
		};
	},
	computed: {
		allowDefaultFirstOption() {
			return !!this.field.options.filterable || !!this.field.options.remote;
		},

		remoteMethod() {
			if (!!this.field.options.remote && !!this.field.options.onRemoteQuery) {
				return this.remoteQuery;
			} else {
				return undefined;
			}
		},

		selectKey() {
			return this.widgetKey || this.field.id;
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
		/**
		 * 获取选中项label
		 * @return {*}
		 */
		getSelectedLabel() {
			return this.$refs.fieldEditor.selectedLabel;
		},

		refreshWidgetKey() {
			//强制刷新组件！！
			this.widgetKey = 'select-key-' + generateId();
		},
		async initDict() {
			if (this.field.options.dictName) {
				const res = await useDictAsync(this.field.options.dictName);
				this.loadOptions(res[this.field.options.dictName]);
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
}
</style>
