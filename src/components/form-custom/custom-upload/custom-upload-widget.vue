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
		<!-- el-upload增加:name="field.options.name"后，会导致又拍云上传失败！故删除之！！ -->
		<el-upload
			ref="fieldEditor"
			v-loading="loading"
			:disabled="field.options.disabled || isReadMode"
			:action="realUploadURL"
			:http-request="(data) => handleUpload(data)"
			:auto-upload="field.options.customUploadAutoUpload"
			:headers="uploadHeaders"
			:data="uploadData"
			:with-credentials="field.options.withCredentials"
			:multiple="field.options.multipleSelect"
			:file-list="fileList"
			:show-file-list="field.options.showFileList"
			:accept="field.options.customUploadFileTypes.join(',')"
			list-type="picture-card"
			:class="{ hideUploadDiv: uploadBtnHidden || isReadMode }"
			:limit="field.options.limit"
			:on-exceed="handlePictureExceed"
			:before-upload="beforePictureUpload"
		>
			<!--  :on-preview="handlePicturePreview" :on-success="handlePictureUpload" :on-error="handleUploadError" :before-remove="handleBeforeRemove"
			:on-remove="handlePictureRemove" -->
			<template #tip>
				<div class="mt-5" v-if="!field.options.disabled && !isReadMode">
					<div class="my-1" v-if="!field.options.uploadTip">
						<span style="color: red">*</span>
						<span>{{ `仅支持上传${field.options.customUploadFileTypes.join(',')}格式的文件,` }}</span
						><span>并且文件大小不超过{{ field.options.fileMaxSize }}M</span>
					</div>
					<div class="el-upload__tip" v-else>
						{{ field.options.uploadTip }}
					</div>
				</div>
			</template>
			<template v-if="!field.options.disabled && !isReadMode">
				<div class="uploader-icon">
					<el-icon>
						<Plus />
					</el-icon>
				</div>
			</template>
			<template #file="{ file }">
				<div class="upload-item">
					<div class="item-content">
						<img class="el-upload-list__item-thumbnail" :src="setImageSrc(file)" />
						<span class="el-upload-list__item-actions">
							<span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
								<el-icon><zoom-in /></el-icon>
							</span>
							<span v-if="file.url" class="el-upload-list__item-delete" @click="handleDownload(file)">
								<el-icon>
									<Download />
								</el-icon>
							</span>
							<span v-if="!field.options.disabled && file.url && !isReadMode" class="el-upload-list__item-delete" @click="handleRemove(file)">
								<el-icon>
									<Delete />
								</el-icon>
							</span>
						</span>
					</div>
					<div class="file-name">{{ file.name }}</div>
				</div>
			</template>
		</el-upload>

		<div v-if="showPreviewDialogFlag" v-drag="['.drag-dialog.el-dialog', '.drag-dialog .el-dialog__header']">
			<el-dialog
				title=""
				v-model="showPreviewDialogFlag"
				append-to-body
				width="60%"
				:show-close="true"
				class="drag-dialog small-padding-dialog"
				:close-on-click-modal="true"
				:close-on-press-escape="true"
				:destroy-on-close="true"
			>
				<img :src="previewUrl" style="width: 100%" alt="" />
			</el-dialog>
		</div>
	</form-item-wrapper>
</template>

<script>
/* eslint-disable */
import SvgIcon from '@cqdcg/admin/components/SvgIcon/index';
import VForm3 from '@cqdcg/formdesigner';
const { FormItemWrapper, emitter, i18n, fieldMixin, Utils } = VForm3.VFormSDK;
const { deepClone, evalFn } = Utils;
import word from '/@/assets/file/word.png';
import excel from '/@/assets/file/excel.png';
import pdf from '/@/assets/file/pdf.png';
import txt from '/@/assets/file/txt.png';
import ppt from '/@/assets/file/ppt.png';
import zip from '/@/assets/file/zip.png';
import rar from '/@/assets/file/rar.png';
import other from '/@/assets/file/other.png';
import { fileUploadApi, fileDownloadApi, fileDeleteApi } from '@cqdcg/admin/api/common/index';

export default {
	name: 'custom-upload-widget',
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
		SvgIcon,
	},
	data() {
		return {
			oldFieldValue: null, //field组件change之前的值
			fieldModel: [],
			rules: [],

			uploadHeaders: {},
			uploadData: {
				key: '', //七牛云上传文件名
				//token: '',  //七牛云上传token

				//policy: '',  //又拍云上传policy
				//authorization: '',  //又拍云上传签名
			},
			fileList: [], //上传文件列表
			fileListBeforeRemove: [], //删除前的文件列表

			previewUrl: '',
			showPreviewDialogFlag: false,

			pdfVisible: false, // 图片/pdf预览
			pdfUrl: '', // pdf预览地址
			loading: false, // 上传loading
		};
	},
	watch: {
		fieldModel: {
			handler(val) {
				if (val && val?.length > 0) {
					nextTick(() => {
						// 本地上传的文件，不加api，不会展示，回显的文件却会自动带上api，所以这里处理一下。
						this.fileList = val.map((item) => {
							if (item.url.indexOf('/api') === -1) {
								item.url = `/api/${item.url}`;
							}
							return item;
						});
					});
				} else {
					nextTick(() => {
						this.fileList = [];
					});
				}
			},
			deep: true,
		},
	},
	computed: {
		realUploadURL() {
			let uploadURL = this.field.options.uploadURL;
			if (!!uploadURL && (uploadURL.indexOf('DSV.') > -1 || uploadURL.indexOf('DSV[') > -1)) {
				let DSV = this.getGlobalDsv();
				return evalFn(this.field.options.uploadURL, DSV);
			}

			return this.field.options.uploadURL;
		},

		uploadBtnHidden() {
			return !this.fileList || this.fileList.length >= this.field.options.limit;
		},
	},
	beforeCreate() {
		/* 这里不能访问方法和属性！！ */
	},

	created() {
		/* 注意：子组件mounted在父组件created之后、父组件mounted之前触发，故子组件mounted需要用到的prop
				 需要在父组件created中初始化！！ */
		this.registerToRefList();
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
		//设置文件图片
		setImageSrc(file) {
			let src = other;
			switch (file.name.replace(/.+\./, '')) {
				case 'zip':
					src = zip;
					break;
				case 'doc':
				case 'docx':
					src = word;
					break;
				case 'pdf':
					src = pdf;
					break;
				case 'ppt':
					src = ppt;
					break;
				case 'rar':
					src = rar;
					break;
				case 'xls':
				case 'xlsx':
					src = excel;
					break;
				case 'txt':
					src = txt;
					break;
				case 'jpg':
				case 'png':
				case 'jpeg':
					src = file.url;
					break;
				default:
					src = other;
					break;
			}
			return src;
		},
		// 点击预览
		handlePictureCardPreview(file) {
			const name = file.name.replace(/.+\./, '');
			if (name === 'jpg' || name === 'jpge' || name === 'png') {
				this.previewUrl = file.url;
				this.showPreviewDialogFlag = true;
			} else if (name === 'pdf') {
				this.pdfUrl = file.url;
				this.pdfVisible = true;
			} else {
				this.$message({
					message: '文件格式不支持预览',
					type: 'warning',
				});
			}
		},
		// 下载
		handleDownload(file) {
			fileDownloadApi({ id: file.id }).then((response) => {
				// 创建一个临时链接，指向文件流的URL
				const urlObject = URL.createObjectURL(response);
				// 创建一个a标签，用于模拟点击下载
				const link = document.createElement('a');
				link.href = urlObject;
				document.body.appendChild(link);
				link.download = file.name;
				link.click();
				// 释放URL对象
				URL.revokeObjectURL(urlObject);
			});
		},
		// 删除
		handleRemove(file) {
			fileDeleteApi([file.id]).then(() => {
				let oldValue = deepClone(this.fileList);
				this.fileList = this.fileList.filter((f) => f.id !== file.id);
				this.syncUpdateFormModel(this.fileList);
				this.emitFieldDataChange(this.fileList, oldValue);
				this.$message({
					message: '删除成功',
					type: 'success',
				});
			});
		},
		handleUpload({ file }) {
			// 自定义上传
			let formData = new FormData();
			formData.append('file', file);
			// formData.append('dir', props.dir);
			this.loading = true;
			fileUploadApi(formData)
				.then((res) => {
					if (res.code === 0) {
						this.$message.success(res.msg || '成功上传');
						let oldValue = deepClone(this.fileList);
						// 保存上传成功返回的信息
						this.fileList.push({
							...res.data,
							name: file.name,
						});
						this.syncUpdateFormModel(this.fileList);
						this.emitFieldDataChange(this.fileList, oldValue);
					} else {
						this.$refs['fieldEditor'].handleRemove(file);
						this.$message.error(res.msg || '上传失败');
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		handlePictureExceed() {
			let uploadLimit = this.field.options.limit;
			// this.$message.warning(this.i18nt('render.hint.uploadExceed').replace('${uploadLimit}', uploadLimit));
			this.$message.warning(`最多支持上传${uploadLimit}个文件`);
		},

		handlePicturePreview(file) {
			this.previewUrl = file.url;
			this.showPreviewDialogFlag = true;
		},

		beforePictureUpload(file) {
			// 校验文件类型
			let fileTypeCheckResult = false;
			if (!!this.field.options && !!this.field.options.customUploadFileTypes) {
				let uploadFileTypes = this.field.options.customUploadFileTypes;
				if (uploadFileTypes.length > 0) {
					let fileExt = file.name.substring(file.name.lastIndexOf('.'));
					fileTypeCheckResult = uploadFileTypes.includes(fileExt);
				}
			}
			if (!fileTypeCheckResult) {
				this.$message.error(`文件格式错误，请上传 ${this.field.options.customUploadFileTypes.join(',')} 格式的文件`);
				// this.$message.error(this.i18nt('render.hint.unsupportedFileType') + file.type);
				return false;
			}

			// 校验文件大小
			let fileSizeCheckResult = false;
			let uploadFileMaxSize = 5; //5MB
			if (!!this.field.options && !!this.field.options.fileMaxSize) {
				uploadFileMaxSize = this.field.options.fileMaxSize;
			}
			fileSizeCheckResult = file.size / 1024 / 1024 <= uploadFileMaxSize;
			if (!fileSizeCheckResult) {
				this.$message.error(`文件大小不能超过 ${uploadFileMaxSize}MB`);
				return false;
			}

			// 设置上传文件图标
			this.setImageSrc(file);

			this.uploadData.key = file.name;
			return this.handleOnBeforeUpload(file);
		},

		handleOnBeforeUpload(file) {
			if (this.field.options.onBeforeUpload) {
				let bfFunc = new Function('file', this.field.options.onBeforeUpload);
				let result = bfFunc.call(this, file);
				if (typeof result === 'boolean') {
					return result;
				} else {
					return true;
				}
			}
			return true;
		},

		updateFieldModelAndEmitDataChangeForUpload(fileList, customResult, defaultResult) {
			this.fieldModel = this.fieldModel || [];
			let oldValue = deepClone(this.fieldModel);
			if (!!customResult && !!customResult.name && !!customResult.url) {
				this.fieldModel.push({
					name: customResult.name,
					url: customResult.url,
				});
			} else if (!!defaultResult && !!defaultResult.name && !!defaultResult.url) {
				this.fieldModel.push({
					name: defaultResult.name,
					url: defaultResult.url,
				});
			} else if (!!defaultResult && !!defaultResult.data && !!defaultResult.data.name && !!defaultResult.data.url) {
				this.fieldModel.push({
					name: defaultResult.data.name,
					url: defaultResult.data.url,
				});
			} else {
				this.fieldModel = deepClone(fileList);
			}

			this.syncUpdateFormModel(this.fieldModel);
			this.emitFieldDataChange(this.fieldModel, oldValue);
		},

		handlePictureUpload(res, file, fileList) {
			if (file.status === 'success') {
				let customResult = null;
				if (this.field.options.onUploadSuccess) {
					let customFn = new Function('result', 'file', 'fileList', this.field.options.onUploadSuccess);
					customResult = customFn.call(this, res, file, fileList);
				}

				this.updateFieldModelAndEmitDataChangeForUpload(fileList, customResult, res);
				this.fileList = deepClone(fileList);

				this.$nextTick(() => {
					this.clearValidate();
				});
			}
		},
		updateFieldModelAndEmitDataChangeForRemove(file, fileList) {
			let oldValue = deepClone(this.fieldModel);
			let foundFileIdx = -1;
			this.fileListBeforeRemove.map((fi, idx) => {
				/* 跟element-ui不同，element-plus删除文件时this.fileList数组对应元素已被删除！！ */
				if (fi.name === file.name && (fi.url === file.url || (!!fi.uid && fi.uid === file.uid))) {
					/* 这个判断有问题？？ */
					foundFileIdx = idx;
				}
			});
			if (foundFileIdx > -1) {
				this.fieldModel.splice(foundFileIdx, 1);
			}

			this.syncUpdateFormModel(this.fieldModel);
			this.emitFieldDataChange(this.fieldModel, oldValue);
		},

		handleBeforeRemove(file, fileList) {
			/* 保留删除之前的文件列表！！ */
			this.fileListBeforeRemove = deepClone(fileList);
		},

		handlePictureRemove(file, fileList) {
			this.updateFieldModelAndEmitDataChangeForRemove(file, fileList);
			this.fileList = deepClone(fileList);

			if (this.field.options.onFileRemove) {
				let customFn = new Function('file', 'fileList', this.field.options.onFileRemove);
				customFn.call(this, file, fileList);
			}
		},

		handleUploadError(err, file, fileList) {
			if (this.field.options.onUploadError) {
				let customFn = new Function('error', 'file', 'fileList', this.field.options.onUploadError);
				customFn.call(this, err, file, fileList);
			} else {
				this.$message({
					message: this.i18nt('render.hint.uploadError') + err,
					duration: 3000,
					type: 'error',
				});
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.full-width-input {
	width: 100% !important;
}

.hideUploadDiv {
	:deep(div.el-upload--picture-card) {
		/* 隐藏最后的图片上传按钮 */
		display: none;
	}

	:deep(div.el-upload--text) {
		/* 隐藏最后的文件上传按钮 */
		display: none;
	}

	:deep(div.el-upload__tip) {
		/* 隐藏最后的文件上传按钮提示 */
		display: none;
	}
}

.uploader-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	font-size: 28px;
	color: #8c939d;
}

.upload-item {
	position: relative;
	width: 100%;
	padding: 10px;
	text-align: center;

	.file-name {
		position: absolute;
		bottom: 2px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.item-content {
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		height: 80%;
	}
}
</style>
