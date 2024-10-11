import { service } from '@cqdcg/admin/utils/request';
const modulePath = '/businessitemcatalog';

// 获取全部列表数据
export function fetchAllList(query?: Object) {
	return service.instance({
		url: `${modulePath}/api/businessitemtype`,
		method: 'GET',
		params: query,
	});
}

// 获取分页列表数据
export function fetchList(query?: Object) {
	return service.instance({
		url: `${modulePath}/api/businessitemtype/query`,
		method: 'POST',
		data: query,
	});
}

// 删除事项类型
export const typeDelApi = (data: any) => {
	return service.instance({
		url: `${modulePath}/api/businessitemtype/${data}`,
		method: 'DELETE',
		data: data,
	});
};

// 新增事项类型
export const typeAddApi = (data: any) => {
	return service.instance({
		url: `${modulePath}/api/businessitemtype`,
		method: 'POST',
		data: data,
	});
};

// 编辑事项类型
export const typeEditApi = (data: any) => {
	return service.instance({
		url: `${modulePath}/api/businessitemtype`,
		method: 'PUT',
		data: data,
	});
};

// 事项类型详情
export const typeDetailApi = (data: any) => {
	return service.instance({
		url: `${modulePath}/api/businessitemtype/${data}`,
		method: 'GET',
		data: data,
	});
};
