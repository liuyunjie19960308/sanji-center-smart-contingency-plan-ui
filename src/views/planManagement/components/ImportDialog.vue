<!-- json 导入组件 -->
<template>
  <el-dialog
    :title="prop.title"
    v-model="state.upload.open"
    :close-on-click-modal="false"
    draggable
    width="500"
  >
    <el-upload
      ref="uploadRef"
      :limit="1"
      accept=".json"
      :headers="headers"
      :action="baseURL + other.adaptationUrl(url)"
      :disabled="state.upload.isUploading"
      :on-progress="handleFileUploadProgress"
      :on-success="handleFileSuccess"
      :on-error="handleFileError"
      :auto-upload="false"
      drag
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        {{ $t("excel.operationNotice") }}
        <em>{{ $t("excel.clickUpload") }}</em>
      </div>
      <template #tip>
        <div class="el-upload__tip text-center">
          <span>仅允许导入json格式文件</span>
        </div>
      </template>
    </el-upload>
    <template #footer>
      <el-button @click="state.upload.open = false">取消</el-button>
      <el-button type="primary" @click="submitFileForm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="upload-excel">
import { useMessage } from "@cqdcg/admin/hooks/message";
import other from "@cqdcg/admin/utils/other";
import { Session } from "@cqdcg/admin/utils/storage";

const emit = defineEmits(["sizeChange", "refreshDataList"]);
const prop = defineProps({
  url: {
    type: String,
  },
  title: {
    type: String,
  },
  tempUrl: {
    type: String,
  },
});

const uploadRef = ref();

const state = reactive({
  upload: {
    open: false,
    isUploading: false,
  },
});

/**
 * 下载模板文件
 */
const downExcelTemp = () => {
  other.downBlobFile(other.adaptationUrl(prop.tempUrl), {}, "temp.xlsx");
};

/**
 * 上传进度条变化事件
 */
const handleFileUploadProgress = () => {
  state.upload.isUploading = true;
};

/**
 * 上传失败事件处理
 */
const handleFileError = (e: any) => {
  const message = JSON.parse(e.message);
  useMessage().error(message.msg);
  state.upload.open = false;
};

/**
 * 上传成功事件处理
 * @param {any} response - 上传成功的响应结果
 */
const handleFileSuccess = (response: any) => {
  state.upload.isUploading = false;
  state.upload.open = false;
  uploadRef.value.clearFiles();

  // 校验失败
  if (response.code === 1) {
    useMessage().error(response.msg);
  } else {
    useMessage().success(response.msg ? response.msg : "导入成功");
    // 刷新表格
    emit?.("refreshDataList");
  }
};

/**
 * 提交表单，触发上传
 */
const submitFileForm = () => {
  uploadRef.value.submit();
};

/**
 * 显示上传文件对话框，并清除上传信息
 */
const show = () => {
  state.upload.isUploading = false;
  state.upload.open = true;
};

/**
 * 计算请求头部信息
 */
const headers = computed(() => {
  return {
    Authorization: "Bearer " + Session.getToken(),
    "TENANT-ID": Session.getTenant(),
  };
});

// 暴露变量
defineExpose({
  show,
});
</script>

<style scoped></style>
