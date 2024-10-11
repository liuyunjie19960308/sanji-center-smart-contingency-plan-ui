import { service } from '@cqdcg/admin/utils/request';
const modulePath = '/businessitemcatalog';

// 获取列表数据
export function fetchList(query?: Object) {
	return service.instance({
		url: `${modulePath}/api/businessItemAudit/query`,
		method: 'POST',
		data: query,
	});
}

// 批量审核事项
export const itemExamineApi = (data: any) => {
	return service.instance({
		url: `${modulePath}/api/businessItemAudit/auditAll`,
		method: 'POST',
		data: data,
	});
};
