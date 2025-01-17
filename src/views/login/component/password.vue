<template>
	<el-form
		size="large"
		class="login-content-form"
		ref="loginFormRef"
		:rules="loginRules"
		:model="state.ruleForm"
		@keyup.enter="handleVerify"
		label-position="top"
	>
		<el-form-item class="login-animation1" prop="username" label="账号">
			<el-input text :placeholder="$t('password.accountPlaceholder1')" v-model="state.ruleForm.username" clearable autocomplete="off">
				<template #prefix>
					<el-icon class="el-input__icon">
						<ele-User />
					</el-icon>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item class="login-animation2" prop="password" label="密码">
			<el-input
				:type="state.isShowPassword ? 'text' : 'password'"
				:placeholder="$t('password.accountPlaceholder2')"
				v-model="state.ruleForm.password"
				autocomplete="off"
			>
				<template #prefix>
					<el-icon class="el-input__icon">
						<ele-Unlock />
					</el-icon>
				</template>
				<template #suffix>
					<i
						class="iconfont el-input__icon login-content-password"
						:class="state.isShowPassword ? 'icon-yincangmima' : 'icon-xianshimima'"
						@click="state.isShowPassword = !state.isShowPassword"
					>
					</i>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item class="login-animation2" prop="code" v-if="verifyImageEnable" label="验证码">
			<el-col :span="15">
				<el-input text maxlength="4" :placeholder="$t('mobile.placeholder2')" v-model="state.ruleForm.code" clearable autocomplete="off">
					<template #prefix>
						<el-icon class="el-input__icon">
							<ele-Position />
						</el-icon>
					</template>
				</el-input>
			</el-col>
			<el-col :span="1"></el-col>
			<el-col :span="8">
				<img style="width: 128px; height: 40px" :src="imgSrc" @click="getVerifyImageCode" />
			</el-col>
		</el-form-item>
		<el-form-item class="login-animation4">
			<el-button type="primary" class="rounded-lg login-content-submit" v-waves @click="handleVerify" :loading="loading">
				<span class="font-semibold tracking-wide">{{ $t('password.accountBtnText') }}</span>
			</el-button>
		</el-form-item>
		<span class="text-primary cursor-pointer">忘记密码</span>
		<div class="relative flex items-center justify-between">
			<div class="ml-auto text-sm">
				<!-- <a href="#" class="text-primary hover:text-blue-600" @click="emit('change', LoginTypeEnum.MOBILE)"> 验证码登录 </a> -->
				<!-- <a href="#" v-if="autoRegisterEnable" class="ml-2 text-primary hover:text-blue-600" @click="emit('change', LoginTypeEnum.REGISTER)">
					注册账号
				</a> -->
			</div>
		</div>

		<!-- <div class="font12 mt30 login-animation4 login-msg">{{ $t('browserMsgText') }}</div> -->
	</el-form>
	<Verify
		@success="verifySuccess"
		:mode="'pop'"
		:captchaType="'blockPuzzle'"
		v-if="verifyEnable"
		:imgSize="{ width: '330px', height: '155px' }"
		ref="verifyref"
	/>
</template>

<script setup lang="ts" name="password">
import { defineAsyncComponent, reactive, ref } from 'vue';
import { useUserInfo } from '@cqdcg/admin/stores/userInfo';
import { useI18n } from 'vue-i18n';
import { generateUUID } from '@cqdcg/admin/utils/other';
import { LoginErrorEnum, LoginTypeEnum } from '@cqdcg/admin/api/login/index';
import { ViteEnv } from '@cqdcg/admin/utils/env';

// 使用国际化插件
const { t } = useI18n();

// 动态加载滑块验证码组件
const Verify = defineAsyncComponent(() => import('@cqdcg/admin/components/Verifition/Verify'));

// 定义变量内容
// const autoRegisterEnable = ref(ViteEnv.env.VITE_REGISTER_ENABLE === 'true');
const emit = defineEmits(['signInSuccess', 'change']); // 声明事件名称
const loginFormRef = ref(); // 定义LoginForm表单引用
const loading = ref(false); // 定义是否正在登录中
const state = reactive({
	isShowPassword: false, // 是否显示密码
	ruleForm: {
		// 表单数据
		username: 'admin', // 用户名
		password: '123456', // 密码
		code: '', // 验证码
		randomStr: 'blockPuzzle', // 验证码随机数
	},
});

const loginRules = reactive({
	username: [{ required: true, trigger: 'blur', message: t('password.accountPlaceholder1') }], // 用户名校验规则
	password: [{ required: true, trigger: 'blur', message: t('password.accountPlaceholder2') }], // 密码校验规则
});

const verifyref = ref<InstanceType<typeof Verify>>(null); // 定义verify组件引用
// 是否开启验证码
const verifyEnable = ref(ViteEnv.env.VITE_VERIFY_ENABLE === 'true');
const verifyImageEnable = ref(ViteEnv.env.VITE_VERIFY_IMAGE_ENABLE === 'true');
const imgSrc = ref('');

// 调用图形证码进行校验
const getVerifyImageCode = () => {
	state.ruleForm.randomStr = generateUUID();
	imgSrc.value = `${ViteEnv.env.VITE_API_URL}${ViteEnv.env.VITE_IS_MICRO == 'false' ? '/admin' : '/auth'}/code/image?randomStr=${
		state.ruleForm.randomStr
	}`;
};

// 调用滑块验证码进行校验
const handleVerify = async () => {
	const valid = await loginFormRef.value.validate().catch(() => {}); // 表单校验

	if (valid && verifyEnable.value) {
		verifyref.value.show(); // 显示验证组件
	} else if (valid) {
		onSignIn(); // 调用登录方法
	}
};

// 滑块验证码校验成功调用后台登录接口
const verifySuccess = (params: any) => {
	state.ruleForm.code = params.captchaVerification; // 获取验证码
	onSignIn(); // 调用登录方法
};

// 账号密码登录
const onSignIn = async () => {
	loading.value = true; // 正在登录中
	try {
		await useUserInfo().login(state.ruleForm); // 调用登录方法
		emit('signInSuccess'); // 触发事件
	} catch (err: any) {
		if (err?.data === LoginErrorEnum.CREDENTIALS_EXPIRED) {
			emit('change', LoginTypeEnum.EXPIRE, state.ruleForm.username); // 触发修改密码
		}
	} finally {
		loading.value = false; // 登录结束
		if (verifyImageEnable.value) {
			getVerifyImageCode();
		}
	}
};

onMounted(() => {
	if (verifyImageEnable.value) {
		getVerifyImageCode();
	}
});
</script>
<style lang="scss" scoped>
.login-content-form {
	margin-top: 0 !important;

	:deep(.el-form-item) {
		margin-bottom: 24px !important;

		.el-form-item__label {
			width: 100%;
			height: auto !important;
			margin-bottom: 12px !important;
			font-size: 16px;
			font-weight: 500;
			line-height: 16px;
			color: #303133;

			&::before {
				display: none;
			}
		}

		.login-content-submit {
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 24px;
			background-color: #4655f5;

			.font-semibold {
				font-size: 18px;
				line-height: 18px;
			}
		}
	}

	.text-primary {
		font-size: 16px;
		line-height: 16px;
		color: #4655f5;
	}
}
</style>
