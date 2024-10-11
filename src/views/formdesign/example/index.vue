<template>
	<v-form-render :form-json="formJson" :form-data="formData" :option-data="optionData" v-if="!loading"></v-form-render>
</template>
<script setup lang="ts">
import formJson from './formConfig/edit.json';
// ts-ignore

let optionData = {};
const formData = reactive({});
const initOption = async () => {
	const { schedule_type } = await useDictAsync('schedule_type');
	const { expert_type } = await useTreeDictAsync('expert_type');
	optionData = { select: schedule_type, cascader: expert_type };
	loading.value = false;
};
const loading = ref(true);
onMounted(() => {
	initOption();
});
</script>
