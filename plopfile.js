module.exports = function (plop) {
	// 创建组件模板
	plop.setGenerator('component', {
		description: '生成组件模板',
		prompts: [
			{
				type: 'input',
				name: 'name',
				message: '请输入要创建的组件名称',
				default: 'TestComponent',
			},
			{
				type: 'input',
				name: 'path',
				default: 'src/components',
				message: '请输入要创建的组件路径',
			},
		],
		actions: [
			{
				type: 'add',
				path: '{{path}}/{{camelCase name}}.vue',
				templateFile: 'plop-templates/component-template.vue.hbs',
			},
		],
	});

	// 创建页面模板
	plop.setGenerator('page', {
		description: '生成组件模板',
		prompts: [
			{
				type: 'input',
				name: 'name',
				message: '请输入要创建的页面名称',
				default: 'TestPage',
			},
			{
				type: 'input',
				name: 'path',
				message: '请输入要创建的页面路径',
				default: 'src/test/',
			},
			// {
			// 	type: 'confirm',
			// 	name: 'registerRouter',
			// 	message: '是否需要注册后台菜单路由',
			// },
		],
		actions: function (data) {
			const actions = [
				{
					type: 'add',
					path: '{{path}}/{{camelCase name}}.vue',
					templateFile: 'plop-templates/page-template.vue.hbs',
				},
				{
					type: 'add',
					path: '{{path}}/formConfig/{{camelCase name}}Form.json',
					templateFile: 'plop-templates/formJson-template.json',
				},
			];
			// 是否需要注册路由
			if (data.registerRouter) {
				// 调用注册路由接口
			}
			return actions;
		},
	});
};
