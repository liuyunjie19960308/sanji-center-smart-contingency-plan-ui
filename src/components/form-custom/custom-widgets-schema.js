export const dictSelectSchema = {
	type: 'dict-select',
	icon: 'select-field',
	formItemFlag: true,
	options: {
		name: '',
		keyNameEnabled: false,
		keyName: '', //数据键值名称
		label: '',
		labelAlign: '',
		defaultValue: '',
		placeholder: '',
		columnWidth: '200px',
		size: '',
		labelWidth: null,
		labelHidden: false,
		labelWrap: false, //标签超长换行
		disabled: false,
		hidden: false,
		clearable: true,
		filterable: false,
		allowCreate: false,
		// remote: false,
		automaticDropdown: false, //自动下拉
		multiple: false,
		multipleLimit: 0,
		collapseTags: false, //对多选折叠已选项
		// dsEnabled: false, // 是否使用数据源数据
		// dsName: '', // 数据源名称
		// dataSetName: '', //数据集名称
		labelKey: 'label',
		valueKey: 'value',
		optionValueType: '',
		optionItems: [],
		dictName: 'schedule_type',
		required: false,
		requiredHint: '',
		validation: '',
		validationHint: '',
		//-------------------
		customClass: '', //自定义css类名
		labelIconClass: null,
		labelIconPosition: 'rear',
		labelTooltip: null,
		//-------------------
		onCreated: '',
		onMounted: '',
		onRemoteQuery: '',
		onChange: '',
		onFocus: '',
		onBlur: '',
		onValidate: '',
	},
};
export const dictCascaderSchema = {
	type: 'dict-cascader',
	icon: 'select-field',
	formItemFlag: true,
	options: {
		name: '',
		keyNameEnabled: false,
		keyName: '', //数据键值名称
		label: '',
		labelAlign: '',
		defaultValue: '',
		placeholder: '',
		size: '',
		labelWidth: null,
		labelHidden: false,
		columnWidth: '200px',
		disabled: false,
		hidden: false,
		clearable: true,
		filterable: false,
		multiple: false,
		checkStrictly: false, //可选择任意一级选项，默认不开启
		showAllLevels: true, //显示完整路径
		dsEnabled: false, // 是否使用数据源数据
		dsName: '', // 数据源名称
		dataSetName: '', //数据集名称
		labelKey: 'label',
		valueKey: 'value',
		childrenKey: 'children',
		areaDataEnabled: false, //是否加载省市区数据
		areaDataType: 0, //0不开启，1加载省市数据，2加载省市区数据
		optionItems: [],
		required: false,
		requiredHint: '',
		customRule: '',
		customRuleHint: '',
		dictName: 'expert_type',
		//-------------------
		customClass: '', //自定义css类名
		labelIconClass: null,
		labelIconPosition: 'rear',
		labelTooltip: null,
		//-------------------
		onCreated: '',
		onMounted: '',
		onChange: '',
		onFocus: '',
		onBlur: '',
		onValidate: '',
	},
};

export const customUploadSchema = {
	type: 'custom-upload',
	icon: 'picture-upload-field',
	formItemFlag: true,
	options: {
		name: '',
		keyNameEnabled: false,
		keyName: '', //数据键值名称
		label: '',
		labelAlign: '',
		labelWidth: null,
		labelHidden: false,
		columnWidth: '200px',
		disabled: false,
		hidden: false,
		required: false,
		requiredHint: '',
		customRule: '',
		customRuleHint: '',
		//-------------------
		uploadURL: '',
		uploadTip: '',
		customUploadType: 'submit', // submit/view
		customUploadAutoUpload: true, // 自动上传
		withCredentials: false,
		multipleSelect: false,
		showFileList: true,
		limit: 20,
		fileMaxSize: 5, //MB
		customUploadFileTypes: ['.png', '.jpg', '.jpeg'],
		//headers: [],
		//-------------------
		customClass: '', //自定义css类名
		labelIconClass: null,
		labelIconPosition: 'rear',
		labelTooltip: null,
		//-------------------
		onCreated: '',
		onMounted: '',
		onBeforeUpload: '',
		onUploadSuccess: '',
		onUploadError: '',
		onFileRemove: '',
		onValidate: '',
		//onFileChange: '',
	},
};
