import { service } from '@cqdcg/admin/utils/request';
const modulePath = '/businessitemcatalog';
// 获取分页列表数据
export function fetchList(query?: Object) {
	return service.instance({
		url: `${modulePath}/api/businessItemCatalog/query`,
		method: 'POST',
		data: query,
	});
}

// 删除事项
export const itemDelApi = (data: any) => {
	return service.instance({
		url: `${modulePath}/api/businessItemCatalog/${data}`,
		method: 'DELETE',
		data: data,
	});
};

// 批量删除事项
export const itemDelMulitApi = (data: any) => {
	return service.instance({
		url: `${modulePath}/api/businessItemCatalog/deleteList`,
		method: 'POST',
		data: data,
	});
};

// 新增事项
export const itemAddApi = (data: any) => {
	return service.instance({
		url: `${modulePath}/api/businessItemCatalog`,
		method: 'POST',
		data: data,
	});
};

// 编辑事项
export const itemEditApi = (data: any) => {
	return service.instance({
		url: `${modulePath}/api/businessItemCatalog`,
		method: 'PUT',
		data: data,
	});
};

// 提交事项
export const itemSubmitApi = (data: any) => {
	return service.instance({
		url: `${modulePath}/api/businessItemCatalog/submit`,
		method: 'POST',
		data: data,
	});
};

// 批量提交事项
export const itemSubmitAllApi = (data: any) => {
	return service.instance({
		url: `${modulePath}/api/businessItemCatalog/submitAll`,
		method: 'POST',
		data: data,
	});
};

// 事项详情
export const itemDetailApi = (data: any) => {
	return service.instance({
		url: `${modulePath}/api/businessItemCatalog/${data}`,
		method: 'GET',
		data: data,
	});
};

// 导出事项
export const itemExportApi = (data: any) => {
	return service.instance({
		url: `${modulePath}/api/businessItemCatalog/excelExport`,
		method: 'POST',
		params: {
			selectType: 0,
		},
		data: data,
		responseType: 'blob',
	});
};

// 事项编辑前状态查询
export const itemEditCheck = (data: any) => {
	return service.instance({
		url: `${modulePath}/api/businessItemCatalog/check/${data}`,
		method: 'GET',
		data: data,
	});
};
