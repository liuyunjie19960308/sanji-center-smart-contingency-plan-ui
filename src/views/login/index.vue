<template>
	<div class="select-none">
		<img :src="bg" class="wave" />
		<div class="absolute flex-c right-5 top-3"></div>
		<div class="login-container">
			<div class="login-box">
				<div class="login-form">
					<div class="my-3 text-6xl font-semibold">{{ getThemeConfig.globalTitle }}</div>
					<div class="flex self-center justify-center">
						<div class="px-6 mx-auto rounded-3xl w-96">
							<div class="space-y-0">
								<register v-if="loginType === LoginTypeEnum.REGISTER" @change="changeLoginType" />
								<password v-if="loginType === LoginTypeEnum.PASSWORD" @signInSuccess="signInSuccess" @change="changeLoginType" />
								<mobile v-if="loginType === LoginTypeEnum.MOBILE" @signInSuccess="signInSuccess" @change="changeLoginType" />
								<expire v-if="loginType === LoginTypeEnum.EXPIRE" :username="username" @change="changeLoginType" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="loginIndex">
import { useThemeConfig } from '@cqdcg/admin/stores/themeConfig';
import { NextLoading } from '@cqdcg/admin/utils/loading';
// import illustration from '/@/assets/login/login_bg.svg';
import bg from '/@/assets/login/img_bg_index.png';
// import miniQr from '/@/assets/login/mini_qr.png';
import { useI18n } from 'vue-i18n';
import { formatAxis } from '@cqdcg/admin/utils/formatTime';
import { useMessage } from '@cqdcg/admin/hooks/message';
import { Session } from '@cqdcg/admin/utils/storage';
import { initBackEndControlRoutes } from '@cqdcg/admin/router/backEnd';
import { LoginTypeEnum } from '@cqdcg/admin/api/login/index';
import { ViteEnv } from '@cqdcg/admin/utils/env';

// 引入组件
const Password = defineAsyncComponent(() => import('./component/password.vue'));
const Mobile = defineAsyncComponent(() => import('./component/mobile.vue'));
// const Social = defineAsyncComponent(() => import('./component/social.vue'));
const Register = defineAsyncComponent(() => import('./component/register.vue'));
const Expire = defineAsyncComponent(() => import('./component/expire.vue'));
// const Tenant = defineAsyncComponent(() => import('./component/tenant.vue'));

// 定义变量内容
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const { t } = useI18n();
const route = useRoute();
const router = useRouter();

// 登录方式
const loginType = ref(LoginTypeEnum.PASSWORD);
// 用户名
const username = ref('');

// 修改登录类型
const changeLoginType = (type: LoginTypeEnum, name?: string) => {
	loginType.value = type;
	if (name) {
		username.value = name;
	}
};

// 获取布局配置信息
const getThemeConfig = computed(() => {
	return themeConfig.value;
});

themeConfig.value.globalTitle = ViteEnv.env.VITE_GLOBAL_TITLE;
// 登录成功后的跳转处理事件
const signInSuccess = async () => {
	const isNoPower = await initBackEndControlRoutes();
	if (isNoPower) {
		useMessage().warning('抱歉，您没有登录权限');
		Session.clear();
	} else {
		// 初始化登录成功时间问候语
		let currentTimeInfo = formatAxis(new Date());
		if (route.query?.redirect) {
			router.push({
				path: <string>route.query?.redirect,
				query: Object.keys(<string>route.query?.params).length > 0 ? JSON.parse(<string>route.query?.params) : '',
			});
		} else {
			router.push('/admin/system/menu/index');
		}
		// 登录成功提示
		const signInText = t('signInText');
		useMessage().success(`${currentTimeInfo}，${signInText}`);
		// 添加 loading，防止第一次进入界面时出现短暂空白
		NextLoading.start();
	}
};

// 页面加载时
onMounted(() => {
	NextLoading.done();
});
</script>
