import { customUploadSchema } from './custom-widgets-schema';
// import DictSelectWidget from './dict-select/dict-select-widget.vue';
// import DictCascaderWidget from './dict-cascader/dict-cascader-widget.vue';
import customUploadWidget from './custom-upload/custom-upload-widget.vue';
import zhCustomLang from './lang/zh-CN_custom.js';
import VForm3 from '@cqdcg/formdesigner';
const { addCustomWidgetSchema, addZHExtensionLang, PERegister, PEFactory } = VForm3.VFormSDK;
import CustomPEFactory from './custom-property-editor-factory';

export const loadCustomWidgets = (app) => {
	//加载语言文件
	//console.log('6888889999')
	addZHExtensionLang(zhCustomLang);
	// addENExtensionLang(enCustomLang);

	//加载自定义容器容器

	//加载自定义字段组件
	addCustomWidgetSchema(customUploadSchema); //加载组件Json Schema
	// PERegister.registerCPEditor(
	// 	app,
	// 	'dict-select-dictName',
	// 	'dict-select-dictName-editor',
	// 	PEFactory.createInputTextEditor('dictName', 'extension.setting.dictName')
	// );
	app.component(customUploadWidget.name, customUploadWidget); //注册组件
	// ['.png', '.jpg', '.jpeg', '.doc', '.xls', '.ppt', '.txt', '.pdf', '.docx', '.xlsx', '.pptx']
	let customUploadFileTypesOptions = [
		{ label: '.png', value: '.pmg' },
		{ label: '.jpg', value: '.jpg' },
		{ label: '.jpeg', value: '.jpeg' },
		{ label: '.doc', value: '.doc' },
		{ label: '.xls', value: '.xls' },
		{ label: '.ppt', value: '.ppt' },
		{ label: '.txt', value: '.txt' },
		{ label: '.pdf', value: '.pdf' },
		{ label: '.docx', value: '.docx' },
		{ label: '.xlsx', value: '.xlsx' },
		{ label: '.pptx', value: '.pptx' },
	];
	// 注册组件类型
	PERegister.registerCPEditor(
		app,
		'custom-upload-customUploadFileTypes',
		'custom-upload-customUploadFileTypes-editor',
		CustomPEFactory.createSelectEditor('customUploadFileTypes', 'extension.setting.customUploadFileTypes', {
			optionItems: customUploadFileTypesOptions,
			multiple: true,
			allowCreate: true,
			filterable: true,
		})
	);
	// 注册自动上传
	PERegister.registerCPEditor(
		app,
		'custom-upload-customUploadAutoUpload',
		'custom-upload-customUploadAutoUpload-editor',
		PEFactory.createBooleanEditor('customUploadAutoUpload', 'extension.setting.customUploadAutoUpload')
	);
	// addCustomWidgetSchema(dictSelectSchema); //加载组件Json Schema
	// PERegister.registerCPEditor(
	// 	app,
	// 	'dict-select-dictName',
	// 	'dict-select-dictName-editor',
	// 	PEFactory.createInputTextEditor('dictName', 'extension.setting.dictName')
	// );
	// app.component(DictSelectWidget.name, DictSelectWidget); //注册组件

	// addCustomWidgetSchema(dictCascaderSchema); //加载组件Json Schema
	// PERegister.registerCPEditor(
	// 	app,
	// 	'dict-cascader-dictName',
	// 	'dict-cascader-dictName-editor',
	// 	PEFactory.createInputTextEditor('dictName', 'extension.setting.dictName')
	// );
	// app.component(DictCascaderWidget.name, DictCascaderWidget); //注册组件
};
