<script lang="ts" setup>
import { ElMessage } from "element-plus";
import { planAddApi, planEditApi, fetchList } from "/@/api/plan/index";

const title = ref("");
const visible = ref(false);
const isCopy = ref(false);
const btnLoding = ref(false);
const formRef = ref();
const formData = ref<any>({ type: "1" });
const formRules = ref({
  name: [
    { required: true, message: "请输入智能预案名称", trigger: "blur" },
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value && allPlan.value && allPlan.value.length > 0) {
          const filterArr = allPlan.value.filter((i: any) => i.name === value);
          if (
            (formData.value.id && filterArr.length > 1) ||
            (!formData.value.id && filterArr.length > 0)
          ) {
            callback(new Error("类型已存在"));
          } else {
            callback();
          }
        } else {
          callback();
        }
      },
      trigger: "change",
    },
  ],
  type: [{ required: true, message: "请选择智能预案类型", trigger: "blur" }],
  copyId: [{ required: true, message: "请选择智能预案名称", trigger: "blur" }],
});

const emit = defineEmits("close");
defineExpose({
  title,
  visible,
  isCopy,
  formData,
});
const allPlan = ref();
watch(
  () => visible.value,
  () => {
    getAllPlan();
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
          id: formData.value.id,
          name: formData.value.name,
        };
        btnLoding.value = true;
        try {
          const res = formData.value.id
            ? await planEditApi(params)
            : await planAddApi(params);
          if (res.ok) {
            ElMessage.success("保存成功");
            handleClose();
            emit("close", true);
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
      ElMessage.warning("请正确填写表单");
    });
};
// 获取所有智能预案名称
const getAllPlan = async () => {
  const res = await fetchList({ current: 1, size: 9999 });
  allPlan.value = res.data.records;
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
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
      >
        <el-form-item label="智能预案名称:" prop="name">
          <el-input
            class="data-input"
            v-model="formData.name"
            placeholder="请输入智能预案名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="智能预案编码:" prop="code">
          <el-input
            class="data-input"
            v-model="formData.code"
            placeholder="自动生成"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="智能预案类型:" prop="type" v-if="!isCopy">
          <el-radio-group v-model="formData.type">
            <el-radio value="1">业务事项流程</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="目标智能预案:" prop="type" v-else>
          <el-select
            v-model="formData.copyId"
            placeholder="请选择目标智能预案"
            style="width: 100%"
          >
            <el-option
              v-for="item in allPlan"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose" :loading="btnLoding">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="btnLoding"
          >确定</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>
<style scoped lang="scss"></style>
