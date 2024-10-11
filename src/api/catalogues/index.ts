import { service } from '@cqdcg/admin/utils/request';

// 事项目录列表查询
export function businessItemfolderList(data: any) {
	return service.instance({
		url: '/businessitemcatalog/api/businessItemfolder/query',
		method: 'POST',
		data: data,
	});
}
//

export function businessItemfolderlog(data: any) {
	return service.instance({
		url: `/businessitemcatalog/api/businessItemfolder/${data}`,
		method: 'GET',
	});
}
// 导出事项
export const itemExportApi = (data: any) => {
	return service.instance({
		url: `/businessitemcatalog/api/businessItemCatalog/excelExport`,
		method: 'post',
		params: {
			selectType: 0,
		},
		responseType: 'blob',
		data: data,
	});
};

// 获取列表数据
export function fetchDeptTree(query?: Object) {
	return service.instance({
		url: '/businessitemcatalog/api/businessItemfolder/deptTree',
		method: 'get',
		params: query,
	});
}
