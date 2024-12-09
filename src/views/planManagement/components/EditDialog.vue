<script lang="ts" setup>
import { ElMessage } from 'element-plus';
import { typeAddApi, typeEditApi, fetchAllList } from '/@/api/type/index';

const title = ref('');
const visible = ref(false);
const btnLoding = ref(false);
const formRef = ref();
const formData = ref<any>({ parentId: '' });
const formRules = ref({
	itemType: [
		{ required: true, message: '请输入智能预案名称', trigger: 'blur' },
		{
			validator: (rule: any, value: any, callback: any) => {
				if (value && allType.value && allType.value.length > 0) {
					const filterArr = allType.value.filter((i: any) => i.itemType === value);
					if ((formData.value.itemTypeId && filterArr.length > 1) || (!formData.value.itemTypeId && filterArr.length > 0)) {
						callback(new Error('类型已存在'));
					} else {
						callback();
					}
				} else {
					callback();
				}
			},
			trigger: 'change',
		},
	],
});
const defineProps = {
	expandTrigger: 'click' as const,
	emitPath: false,
	checkStrictly: true,
	label: 'itemType',
	value: 'itemTypeId',
};
const emit = defineEmits('close');
defineExpose({
	title,
	visible,
	formData,
});
const allType = ref();
watch(
	() => visible.value,
	() => {
		getAllType();
	}
);
// 取消
const handleClose = () => {
	visible.value = false;
	formRef.value.clearValidate();
	formRef.value.resetFields();
};
// 提交
const handleSubmit = async () => {
	await formRef.value
		.validate(async (valid: any) => {
			if (valid) {
				const params = {
					parentId: formData.value.parentId,
					itemTypeId: formData.value.itemTypeId,
					itemType: formData.value.itemType,
				};
				btnLoding.value = true;
				try {
					const res = formData.value.itemTypeId ? await typeEditApi(params) : await typeAddApi(params);
					if (res.ok) {
						ElMessage.success('保存成功');
						handleClose();
						emit('close', true);
					} else {
						ElMessage.error(res.msg);
					}
				} catch (err: any) {
					ElMessage.error(err.msg);
				} finally {
					btnLoding.value = false;
				}
			}
		})
		.catch(() => {
			ElMessage.warning('请正确填写表单');
		});
};
// 获取所有智能预案名称
const getAllType = async () => {
	const res = await fetchAllList();
	allType.value = res.data;
};
</script>
<template>
	<el-dialog
		v-model="visible"
		:title="title"
		width="500"
		:before-close="handleClose"
		:close-on-click-modal="false"
		:show-close="false"
		:close-on-press-escape="false"
	>
		<div>
			<el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px">
				<el-form-item label="上级类型" prop="parentId">
					<el-cascader style="width: 100%" v-model="formData.parentId" :options="allType" :props="defineProps" :show-all-levels="false" clearable />
				</el-form-item>
				<el-form-item label="智能预案名称" prop="itemType">
					<el-input class="data-input" v-model="formData.itemType" placeholder="请输入智能预案名称"></el-input>
				</el-form-item>
			</el-form>
		</div>
		<template #footer>
			<div class="dialog-footer">
				<el-button @click="handleClose" :loading="btnLoding">取消</el-button>
				<el-button type="primary" @click="handleSubmit" :loading="btnLoding">确定</el-button>
			</div>
		</template>
	</el-dialog>
</template>
<style scoped lang="scss"></style>
