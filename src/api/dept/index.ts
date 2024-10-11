import { service } from '@cqdcg/admin/utils/request';

// 获取列表数据
export function fetchDeptTree(query?: Object) {
	return service.instance({
		url: '/admin/dept/selectTreeByDeptName',
		method: 'get',
		params: query,
	});
}
