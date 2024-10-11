import VForm3 from '@cqdcg/formdesigner';
const { i18n } = VForm3.VFormSDK;

export function translate(key) {
	return i18n.methods['i18nt'](key);
}

export const createSelectEditor = function (propName, propLabelKey, configs) {
	return {
		template: `
    <el-form-item :label="propLabel">
      <el-select :multiple="multiple" :allowCreate="allowCreate" :filterable="filterable"  v-model="optionModel.${propName}">
        <el-option v-for="item in optionItems" :key="item.value" :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
  `,
		props: {
			designer: Object,
			selectedWidget: Object,
			optionModel: Object,
		},
		data() {
			return {
				optionItems: configs.optionItems,
				propLabel: translate(propLabelKey),
				multiple: configs.multiple,
				allowCreate: configs.allowCreate,
				filterable: configs.filterable,
			};
		},
	};
};

export default {
	createSelectEditor,
};
