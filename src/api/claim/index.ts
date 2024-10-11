import { service } from '@cqdcg/admin/utils/request';

// 获取认领列表数据
export function claimList(query?: Object) {
	return service.instance({
		url: '/businessitemcatalog/businessClaim/query',
		method: 'post',
		data: query,
	});
}
// 获取认领退回列表数据
export function claimBackList(query?: Object) {
	return service.instance({
		url: '/businessitemcatalog/businessClaimBack/query',
		method: 'post',
		data: query,
	});
}

//认领列表导出
export function exportExcel(query?: any) {
	return service.instance({
		url: '/businessitemcatalog/businessClaim/export',
		method: 'post',
		responseType: 'blob',
		data: query,
	});
}
// 获取下发进度
export function getProcess(query: string) {
	return service.instance({
		url: `/businessitemcatalog/businessIssue/progress/${query}`,
		method: 'get',
	});
}

// 认领退回发起
export function doClaimBack(query?: Object) {
	return service.instance({
		url: '/businessitemcatalog/businessClaimBack/doClaimBack',
		method: 'post',
		data: query,
	});
}
// 认领
export function doClaim(query?: Object) {
	return service.instance({
		url: '/businessitemcatalog/businessClaim/doClaim',
		method: 'post',
		data: query,
	});
}

// 查询部门下所有人
export function getUserNextInfo() {
	return service.instance({
		url: `/admin/sysArea/userNextInfo`,
		method: 'get',
	});
}

// 退回审批列表
export function queryApprovalList(query?: Object) {
	return service.instance({
		url: '/businessitemcatalog/businessClaimBack/queryApproval',
		method: 'post',
		data: query,
	});
}

// 批量审批
export function batchFlow(query?: Object) {
	return service.instance({
		url: '/businessitemcatalog/businessClaimBack/batchFlow',
		method: 'post',
		data: query,
	});
}

// 查询流程留痕
export function runPathShow(data: any) {
	return service.instance({
		url: `/task/process-instance/runPathShow`,
		method: 'get',
		params: data,
	});
}
