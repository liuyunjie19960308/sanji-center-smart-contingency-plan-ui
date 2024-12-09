<script lang="ts" setup>
import { ElMessageBox, ElMessage } from "element-plus";
import { fetchList, planDelApi, planExportApi } from "../../../api/plan/index";
import formJson from "./formConfig/search.json";
import { handleBlobFile } from "@cqdcg/admin/utils/other";

const tableColumns = computed(() => {
  return [
    { prop: "name", label: "预案名称" },
    { prop: "code", label: " 预案编码", width: 350 },
    { prop: "type", label: "类型", width: 200 },
    { prop: "updateTime", label: "更新时间", width: 200 },
    {
      prop: "businessItemStatus",
      label: "状态",
      slot: "statusSlot",
      width: 140,
      fixed: "right",
    },
  ];
});
const tableConfig = computed(() => {
  return {
    multiple: true,
    rowKey: "id",
    request: fetchList,
    options: {
      border: false,
    },
  };
});
// 配置搜索
const formData = ref({
  businessItemStatus: undefined,
  businessItemType: undefined,
  implementingEntityId: undefined,
  keyWords: undefined,
  principalDepartmentId: undefined,
  updateTime: undefined,
});
const optionData = reactive({});
// 配置form 表单
const formConfig = computed(() => ({
  title: "智能预案管理",
  formJson,
  formData,
  optionData,
}));

const statusConfig = ref<any>({
  1: "审核通过",
  2: "审核中",
  3: "审核驳回",
  6: "待提交",
});

// 操作
const DTableRef = ref();
const router = useRouter();
const handleOperate = (operateType: string, data: any = {}) => {
  switch (operateType) {
    case "config":
      break;
    case "add":
      break;
    case "edit":
      break;
    case "copy":
      break;
    case "delete":
      handleDelete(data.id);
      break;
    case "import":
      break;
    case "export":
      const dataArr: any[] = [data.id];
      handleExport(dataArr);
      break;
    case 'offline':
        break;
    default:
      break;
  }
};

//获取选择的值
const selectValue = ref<any[]>([]);
const getSelectValue = (value: any) => {
  if (Array.isArray(value)) {
    selectValue.value = value;
  }
};

// 删除
const deleteLoading = ref(false);
const handleDelete = (idArr: any) => {
  ElMessageBox.confirm("确定删除?", "提示信息", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    deleteLoading.value = true;
    planDelApi(idArr)
      .then((res: any) => {
        if (res.ok) {
          ElMessage.success("操作成功");
          DTableRef.value.getTableData();
        } else {
          ElMessage.error(res.msg);
        }
      })
      .finally(() => {
        deleteLoading.value = false;
      });
  });
};

// 编辑
const handleEdit = (data: any) => {};

//设置颜色
const setColor = (type: Number) => {
  switch (type) {
    case 6:
      return "wait-tag";
    case 2:
      return "edit-tag";
    case 3:
      return "refuse-tag";
    case 1:
      return "agree-tag";
    default:
      break;
  }
};

// 导出
const exportLoading = ref(false);
const handleExport = (idArr: string[]) => {
  exportLoading.value = true;
  planExportApi(idArr)
    .then((res: any) => {
      handleBlobFile(res, "智能预案管理.xlsx");
    })
    .finally(() => {
      ElMessage.success("导出成功");
      exportLoading.value = false;
    });
};

onMounted(async () => {
  DTableRef.value.setFormConfig({
    title: "智能预案管理",
    formJson: formJson,
    formData: formData.value,
    optionData: {},
  });
});
</script>

<template>
  <div class="hy-container">
    <DTable
      @sendSelectValue="getSelectValue"
      :tableConfig="tableConfig"
      :tableColumns="tableColumns"
      :formConfig="formConfig"
      ref="DTableRef"
    >
      <template #tableHeader>
        <el-button
          type="primary"
          plain
          @click="handleOperate('add')"
          icon="Plus"
          >创建智能预案</el-button
        >
        <el-button
          type="primary"
          plain
          @click="handleOperate('copy')"
          icon="upload"
          :loading="submitLoading"
          >复制智能预案</el-button
        >
        <el-button
          type="primary"
          plain
          @click="handleOperate('import')"
          icon="download"
          >导入</el-button
        >
      </template>
      <template #statusSlot="{ row }">
        <el-tag :class="setColor(row.businessItemStatus)">{{
          statusConfig[row.businessItemStatus]
        }}</el-tag>
      </template>
      <template #operation>
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="{ row }">
            <div class="flex items-center w-full">
              <el-button
                text
                type="primary"
                @click="handleOperate('edit', row)"
                >编辑</el-button
              >
              <el-button
                text
                type="primary"
                @click="handleOperate('offline', row)"
                >下线</el-button
              >
              <el-button
                text
                type="primary"
                @click="handleOperate('config', row)"
                :loading="submitLoading"
                >配置</el-button
              >
              <el-button
                text
                type="primary"
                @click="handleOperate('export', row)"
                :loading="submitLoading"
                >导出</el-button
              >
              <el-button
                text
                type="danger"
                @click="handleOperate('delete', row)"
                :loading="deleteLoading"
                >删除</el-button
              >
            </div>
          </template>
        </el-table-column>
      </template>
    </DTable>
  </div>
</template>
<style scoped lang="scss"></style>
