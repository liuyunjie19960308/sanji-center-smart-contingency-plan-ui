// @ts-nocheck
import { RouteRecordRaw } from "vue-router";

/**
 * 建议：路由 path 路径与文件夹名称相同，找文件可浏览器地址找，方便定位文件位置
 *
 * 路由meta对象参数说明
 * meta: {
 *      title:          菜单栏及 tagsView 栏、菜单搜索名称（国际化）
 *      isLink：        是否超链接菜单，开启外链条件，`1、isLink: 链接地址不为空 2、isIframe:false`
 *      isHide：        是否隐藏此路由
 *      isKeepAlive：   是否缓存组件状态
 *      isAffix：       是否固定在 tagsView 栏上
 *      isIframe：      是否内嵌窗口，开启条件，`1、isIframe:true 2、isLink：链接地址不为空`
 *      roles：         当前路由权限标识，取角色管理。控制路由显示、隐藏。超级管理员：admin 普通角色：common
 *      icon：          菜单、tagsView 图标，阿里：加 `iconfont xxx`，fontawesome：加 `fa xxx`
 * }
 */

// 扩展 RouteMeta 接口
declare module "vue-router" {
  interface RouteMeta {
    isLink?: string;
    isHide?: boolean;
    isAuth?: boolean;
    isKeepAlive?: boolean;
    isAffix?: boolean;
    isIframe?: boolean;
    roles?: string[];
    icon?: string;
  }
}

/**
 * 定义静态路由（默认路由）
 * 前端添加路由，请在此处加
 */
export const dynamicRoutes: Array<RouteRecordRaw> = [
  {
    path: "/home",
    name: "router.home",
    component: () => import("@cqdcg/admin/views/home/index"),
    meta: {
      isLink: "",
      isHide: false,
      isKeepAlive: true,
      isAffix: true,
      isIframe: false,
      icon: "iconfont icon-shouye",
    },
  },
  {
    path: "/personal",
    name: "router.personal",
    component: () => import("@cqdcg/admin/views/admin/system/user/personal"),
    meta: {
      isHide: true,
    },
  },
  {
    path: "formdesign",
    name: "formdesign",
    component: () => import("/@/views/formdesign/index.vue"),
    meta: {
      isHide: true,
    },
  },
  {
    path: "formrender",
    name: "formrender",
    component: () => import("/@/views/formdesign/render.vue"),
    meta: {
      isHide: true,
    },
  },
  {
    path: "example",
    name: "example",
    component: () => import("/@/views/formdesign/example/index.vue"),
    meta: {
      isHide: true,
    },
  },
];

/**
 * 定义静态路由（默认路由）
 */
export const staticRoutes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "staticRoutes.login",
    // 默认为模版中的login页面
    // component: () => import('@cqdcg/admin/views/login/index'),
    //自定义login页面
    component: () => import("/@/views/login/index"),
    meta: {
      isAuth: false,
    },
  },
  {
    path: "/authredirect",
    name: "staticRoutes.authredirect",
    component: () => import("/@/views/login/component/authredirect"),
    meta: {
      isAuth: false,
    },
  },
];

/**
 * 定义404、401界面
 */
export const notFoundAndNoPower = [
  {
    path: "/:path(.*)*",
    name: "staticRoutes.notFound",
    component: () => import("@cqdcg/admin/views/error/404"),
    meta: {
      isHide: true,
    },
  },
  {
    path: "/401",
    name: "staticRoutes.noPower",
    component: () => import("@cqdcg/admin/views/error/401"),
    meta: {
      isHide: true,
    },
  },
];

/**
 *  基础性路由
 *
 * 所有节点都是挂载此节点下
 */
export const baseRoutes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "/",
    // 默认为模板中的layout @cqdcg/admin/layout
    component: () => import("@cqdcg/admin/layout/index"),
    // 使用自定义layout
    // component: () => import('/@/layout/index'),
    redirect: "/home",
    meta: {
      isKeepAlive: true,
    },
    children: [],
  },
];
