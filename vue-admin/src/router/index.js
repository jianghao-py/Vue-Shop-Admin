import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../components/Login"
import Home from "../components/Home"
import Welcome from "../components/Welcome"
import Users from "../components/user/Users"
import PermissionList from "../components/permission/PermissionList"
import Roles from "../components/permission/Roles"
import Category from "../components/goods/Category"
import Branch from "../components/goods/Branch"
import List from "../components/goods/List"
import Add from "../components/goods/Add"
import Order from "../components/order/Order"
import Chart from "../components/chart/Chart"

Vue.use(VueRouter)

const routes = [
    {
      path:"/",
      redirect:"/login"
    },
    {
      path:"/login",
      component: Login
    },
    {
      path:"/home",
      component:Home,
      redirect:"/welcome",
      children:[
        {path:'/welcome',component: Welcome},
        {path:'/users',component: Users},
        {path:'/rights',component:PermissionList},
        {path:'/roles',component:Roles},
        {path:'/categories',component:Category},
        {path:'/params',component: Branch},
        {path:'/goods',component:List},
        {path:'/goods/add',component:Add},
        {path:'/orders',component:Order},
        {path:'/reports',component:Chart}
      ]
    },

]

const router = new VueRouter({
  routes
})

router.beforeEach((to,from,next)=>{
  if(to.path === '/login'){
    return next();
  }

  const tokenSession = window.sessionStorage.getItem("token");
  // 如果没有token，强制返回登录页
  if(!tokenSession){
    return next("/login");
  }

  next();
})

export default router
