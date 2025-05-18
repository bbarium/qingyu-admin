import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const commonRoute: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('@/views/common/Login.vue'),
    meta: { title: '登录', hideTabs: true },
  },
  {
    // 找不到路由重定向到404页面
    path: '/:pathMatch(.*)',
    // path: "*",
    component: () => import('@/views/common/404.vue'),
  },
]

//这里可以根据权限做动态路由
const menuRoute: RouteRecordRaw[] = [
  {
    path: '',
    component: () => import('@/views/layout/MainLayout.vue'),
    redirect: '/',
    meta: { icon: 'House', title: '首页', alwaysShow: true },
    children: [
      {
        path: '',
        component: () => import('@/views/home/CampusSelect.vue'),
        meta: { icon: 'House', title: '首页', hideMenu: true },
      },
    ],
  },
  {
    path: '/book',
    component: () => import('@/views/layout/MainLayout.vue'),
    meta: {
      icon: 'Calendar',
      title: '场地预定',
      hideMenu: true,
    },
    children: [
      {
        path: '',
        component: () => import('@/views/book/index.vue'),
        meta: { icon: 'Calendar', title: '场地预定', hideMenu: true },
      },
    ],
  },
  {
    path: '/profile',
    component: () => import('@/views/layout/MainLayout.vue'),
    meta: { icon: 'User', title: '个人主页', alwaysShow: true },
    children: [
      {
        path: '',
        component: () => import('@/views/user/Profile.vue'),
        meta: { title: '个人主页', icon: 'User', hideMenu: true },
      },
    ],
  },
]

const whiteList: string[] = ['/login'] //不需要登录也能查看的路由,最少需要'/login'，要不然会一直重定向到login

export default createRouter({
  history: createWebHashHistory(),
  routes: [...menuRoute, ...commonRoute],
})

export { menuRoute, whiteList }
