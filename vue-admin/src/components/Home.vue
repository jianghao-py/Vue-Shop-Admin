<template>

    <div class="home-page">
        <el-container>
            <el-aside class="home-aside">
                <el-menu
                :default-active="activePath"
                class="el-menu-vertical-demo"
                background-color="#e8e8e0"
                text-color="#b0afab"
                active-text-color="#3f3f3f"
                unique-opened
                :router="true"
                >
                    <!-- 一级菜单 -->
                    <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
                        <!-- 一级菜单的模板区 -->
                        <template slot="title">
                        <i :class="iconsObj[item.id]"></i>
                        <span style="margin-left:10px">{{item.authName}}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/'+subItem.path)">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>{{subItem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>

                <el-button @click="logout" class="logout-btn">退出登录</el-button>
            </el-aside>

            <el-main class="home-main">
                <router-view></router-view>
                
            </el-main>
        </el-container>
    </div>
    

</template>

<script>
export default {
    name:"Home",
    created(){
        this.getMenuList();
        this.activePath = window.sessionStorage.getItem("activePath")
    },
    data(){
        return{
            // 左侧菜单数据
            menuList:[],
            iconsObj: {
                '125': 'iconfont icon-user',
                '103': 'iconfont icon-tijikongjian',
                '101': 'iconfont icon-shangpin',
                '102': 'iconfont icon-danju',
                '145': 'iconfont icon-baobiao'
            },
            activePath: ""
        }
    },
    methods:{
        logout(){
            window.sessionStorage.clear();
            this.$router.push("/login")
        },
        // 获取左侧侧边栏
        async getMenuList(){
            const {data:res} = await this.$http.get('menus');
            if(res.meta.status !== 200){
                return this.$message.error("res.meta.msg");
            }
            
            this.menuList = res.data;
        },
        saveNavState(path){
            window.sessionStorage.setItem("activePath",path);
            this.activePath = path;
        }
    }
}
</script>

<style lang="less" scoped>
.home-page{
    height: 100%;
    background-color: #e8e8e0;
    
}

/deep/ .home-aside{
    background-color: #e8e8e0;
    height: 100vh;
    position: relative;
    
    
}

/deep/ .home-main{
    background-color: #fff;
    border-top-left-radius: 30px;
    border-bottom-left-radius: 30px;
    height: 100vh;

    
}

/deep/ .el-menu-vertical-demo.el-menu{
    margin-top:50px;
    border: none;
    font-weight: bolder;
}

/deep/ .el-menu-vertical-demo.el-menu .el-submenu{
    padding: 10px;
    padding-top:20px;
    
    
}

/deep/ .el-submenu__title, .el-menu-item{
   border-radius: 17px;
}

/deep/ .el-submenu__title:hover,.el-menu-item:hover{
    background-color: rgb(254, 245, 245) !important;
    color: #333 !important;
}

/deep/ .logout-btn{
    width: 100%;
    position:absolute;
    bottom: 50px;
    background-color: #579f79;
    color: #fff;
    
}

</style>>

