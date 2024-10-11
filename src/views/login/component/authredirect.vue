<script setup lang="ts" name="authredirect">
import { service } from '@cqdcg/admin/utils/request';

import { other } from '@cqdcg/admin/utils/other';
import { validateNull } from '@cqdcg/admin/utils/validate';
import { Session } from '@cqdcg/admin/utils/storage';
import { useUserInfo } from '@cqdcg/admin/stores/userInfo';
import { useMessageBox } from '@cqdcg/admin/hooks/message';

/**
 * 加载完成后执行的函数，用于处理授权回调。
 */
onMounted(async () => {
	// 获取 URL 参数，获取 code 参数，获取不到则换成 ticket
	const url = window.location.href.replace('#/authredirect', '').replaceAll('/', '');
	let code = other.getQueryString(url, 'code');
	if (validateNull(code)) {
		code = other.getQueryString(url, 'ticket');
	}

	if (validateNull(code)) {
		code = other.getQueryString(url, 'authCode');
	}

	// 分割登录参数
	let state = other.getQueryString(url, 'state');
	let type = state.split('-')[1];
	state = state.split('-')[0];
	// 发送登录请求，如果 type 为 LOGIN，则为登录操作，否则为绑定操作
	if (type === 'LOGIN') {
		Session.clear();
		await useUserInfo().loginBySocial(state, code);
		window.close();
	} else {
		bind(state, code);
	}
});

/**
 * 绑定社交账号。
 * @param state - 登录参数
 * @param code - 授权码
 */
const bind = (state: string, code: string) => {
	service
		.instance({
			url: '/admin/social/bind',
			method: 'post',
			params: { state, code },
		})
		.then(() => {
			useMessageBox()
				.confirm('社交账号绑定成功')
				.then(() => {
					window.close();
				});
		});
};
</script>
