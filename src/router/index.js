import Vue from 'vue'
import Router from 'vue-router'
import { SingletonApp } from '../application'
// const _import = require('./_import_' + process.env.NODE_ENV) //获取组件的方法
Vue.use(Router)

// const _import = file => {
//   let component
//   if(process.env.NODE_ENV==="production"){
//     component = import('@/pages' + file + '.vue')
//   }else{
//     try {
//       component = require('@/pages' + file + '.vue').default
//     }catch(err){
//       component = {render: c=>c('div', `未找到该页面: /pages${file}.vue`)}
//     }
//   }
//   return component
// }

/**
 * Note: 子菜单只在 children.length >= 1 时显示
 *
 * hidden: true                   是否在菜单中显示， 默认为false
 * alwaysShow: true               当你1个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                只有1个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                若你想不管路由下面的 children 声明的个数都显示你的根路由，你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    title: 'title'               设置该路由在侧边栏和面包屑中展示的名字
    icon: 'icon-name'            设置该路由的图标
    breadcrumb: false            如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
    affix: true                  标签不可关闭
    noCache: true                如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
  }
 */

export const constantRoutes = [
  { path: '*', redirect: '/404', hidden: true }
]

// 渲染含有子级的菜单
/**
 * parentMenu
 * 渲染含有子级的菜单
 * menuType: top 顶级菜单， menu: 含有子级的普通菜单，page: 菜单中最一级需要指定具体页面
 */
function parentMenu(item, menuType = 'menu') {
  const app = SingletonApp.getInstance()
  let _component
  switch (menuType) {
    case "top":
      _component = app.layout
      break
    case "page":
      _component = {
        render: c => c("router-view")
      }
    default:
      _component = app.pageMap[item.code] //_import(item.code)
  }
  return {
    path: item.url,
    component: _component,
    name: item.name,
    meta: {
      title: item.name, icon: item.imageUrl, affix: item.functionType === 'desk'
    }
  }
}

export const generateRouter = (routerList, pFunId = null, pParentId = null) => {
  const routers = []
  if (Array.isArray(routerList)) {
    routerList.forEach((item, index) => {
      routers.push(parseRouterItem(item, pFunId, pParentId))
    })
  }
  return routers
}

const parseRouterItem = (item, pFunId, pParentId) => {
  let obj
  let childs
  if (!pParentId) {
    obj = parentMenu(item, 'top')
    if (item.subNodeFlag == 0) {
      item.name += " " // 修复控制台输出 路由名称重复的问题
      obj.meta = null  // 修复菜单搜索时，只有一级的菜单在搜索结果列表里显示成两级
      childs = [item]
      obj.children = generateRouter(childs, item.functioinId, item.parentId)
    } else {
      childs = item.childSecFunctioinDTOs
      obj.children = generateRouter(childs, item.functioinId, item.parentId)
    }
    // 如果顶层路由是'/'，说明是首页，是首页是添加redirect属性
    if (/^[\/]{1}$/.test(item.url)) {
      obj.redirect = childs[0].url
    }
  } else {
    if (item.subNodeFlag == 0) {
      obj = parentMenu(item, 'page')
    } else {
      obj = parentMenu(item)
      obj.children = generateRouter(item.childSecFunctioinDTOs, item.functioinId, item.parentId)
    }
  }
  return obj
}

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
const router = createRouter()
// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export const resetRouter = (_router) => {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}
export const concatRouter = (routers) => {
  constantRoutes.unshift(...routers)
}
export default router