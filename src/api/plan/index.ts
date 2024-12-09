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

// 删除预案
export const planDelApi = (data: any) => {
	return service.instance({
		url: `${modulePath}/api/businessItemCatalog/${data}`,
		method: 'DELETE',
		data: data,
	});
};

// 新增预案
export const planAddApi = (data: any) => {
	return service.instance({
		url: `${modulePath}/api/businessItemCatalog`,
		method: 'POST',
		data: data,
	});
};

// 编辑预案
export const planEditApi = (data: any) => {
	return service.instance({
		url: `${modulePath}/api/businessItemCatalog`,
		method: 'PUT',
		data: data,
	});
};

// 预案详情
export const planDetailApi = (data: any) => {
	return service.instance({
		url: `${modulePath}/api/businessItemCatalog/${data}`,
		method: 'GET',
		data: data,
	});
};

// 导出预案
export const planExportApi = (data: any) => {
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

// 下线预案
export const planOfflineApi = (data: any) => {
	return service.instance({
		url: `${modulePath}/api/businessItemCatalog`,
		method: 'PUT',
		data: data,
	});
};