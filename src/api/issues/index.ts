import { service } from '@cqdcg/admin/utils/request';

// 下发列表查询
export function businessIssueList(data?: any) {
	return service.instance({
		url: `/businessitemcatalog/businessIssue/query`,
		method: 'POST',
		data: data,
	});
}
//下发撤回数量
export function queryNum(data?: any) {
	return service.instance({
		url: `/businessitemcatalog/businessClaim/queryNum`,
		method: 'POST',
		data: data,
	});
}

// 下发列表 下发子页面列表
export const itemIssueHistoryApi = (data: any) => {
	return service.instance({
		url: `/businessitemcatalog/businessClaim/issueHistory`,
		method: 'POST',
		data: data,
	});
};
// 下发列表 撤回子页面列表

export const itembackHistoryApi = (data: any) => {
	return service.instance({
		url: `/businessitemcatalog/businessClaimBack/backHistory`,
		method: 'POST',
		data: data,
	});
};

// 事项下发
export const itemAddApi = (data: any) => {
	return service.instance({
		url: `/businessitemcatalog/businessIssue/add`,
		method: 'POST',
		data: data,
	});
};
// 事项撤回
export const itemRevocationApi = (data: any) => {
	return service.instance({
		url: `/businessitemcatalog/businessIssue/revocation`,
		method: 'POST',
		data: data,
	});
};

// 事项下发进度
export const itemProgressApi = (data: any) => {
	return service.instance({
		url: `/businessitemcatalog/businessIssue/progress/${data}`,
		method: 'GET',
	});
};

// 导出事项
export const itemExportApi = (data: any) => {
	return service.instance({
		url: `/businessitemcatalog/businessIssue/export`,
		method: 'post',
		responseType: 'blob',
		data: data,
	});
};
//业务事项

export const queryToIssueApi = () => {
	return service.instance({
		url: `/businessitemcatalog/businessIssue/queryToIssue`,
		method: 'GET',
	});
};
//组织机构（部门/区县）

export const userInfoAreaApi = () => {
	return service.instance({
		url: `/admin/sysArea/userInfoArea?isPage=${true}`,
		method: 'GET',
	});
};
