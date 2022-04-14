<template>

    <div class="login-page">
        <div class="login-container clearFix">
            <div class="left">
                <img src="../assets/login.png" alt="">
            </div>

            <div class="right">
                <h1>Log in</h1>
                <div class="welcome-text">亲爱的用户您好，欢迎登录</div>

                <!-- 登录表单区 -->
                <el-form ref="loginFormRef" class="login-form" :model="loginForm" :rules="rules">
                    <!-- 用户名 -->
                    <el-form-item prop="username">
                        <el-input placeholder="账号" class="user-input" v-model="loginForm.username"></el-input>
                    </el-form-item>

                    <!-- 密码 -->
                    <el-form-item prop="password">
                        <el-input placeholder="密码" type="password" class="password-input" v-model="loginForm.password"></el-input>
                    </el-form-item>

                    <!-- 提交按钮 -->
                    <el-form-item class="btns">
                        <el-button round class="login-btn" @click="login">登录</el-button>
                        <el-button round class="reset-btn">忘记密码</el-button>
                    </el-form-item>

                </el-form>
            </div>
        </div>
    </div>
   
</template>

<script>
export default {
    name:"Login",
    data(){
        return{
            // 登录表单数据绑定对象
            loginForm:{
                username:"admin",
                password:"123456"
            },
            rules:{
                // 验证用户名是否合法
                username:[
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度需要在 3 到 10 个字符之间', trigger: 'blur' }
                ],

                // 验证密码是否合法
                password:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 10, message: '长度需要在 6 到 15 个字符之间', trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
        login(){
            this.$refs.loginFormRef.validate(async (valid)=>{
                if(!valid){
                    return;
                }
                const {data:res} = await this.$http.post("login", this.loginForm);
                
                
                if(res.meta.status !==200){
                    return this.$message.error("登录失败");
                }else{
                    this.$message.success("登录成功");
                    // 将登录成功的token，保存到客户端中的 sessionStorage中
                    // token只在网站打开期间生效
                    window.sessionStorage.setItem("token",res.data.token);
                    // 跳转到主页
                    this.$router.push("/home");
                }
            })
        }
    }
}
</script>


<style lang="less" scoped>
.login-page{
    height: 100%;
    background-color: #f8dec8;
    padding-top: 100px;
}

.login-container{
    width: 1200px;
    height: 520px;
    background-color: #fff;
    margin: auto;
    border:5px solid #fff;
    border-radius: 17px;
    text-align: center;
}

.left{
    float: left;
    height: 100%;
}

.left img{
    border-top-left-radius: 17px;
}


.right{
    float: right;
    width: 400px;
    height: 100%;
    background-color: #fff;
    margin-right: 70px;
    text-align: center;
    padding-top:30px;

}

.right .welcome-text{
    font-size: 14px;
    margin-top: 25px;
    font-weight: bold;
    color: rgb(141, 141, 141);
}

.right .login-form{
    margin-top: 50px;
}


/deep/ .el-input__inner:focus{
    border-color: #00401e;
}

/deep/ .btns .el-form-item__content{
    margin-top: 20px;
    width: 100%;
    display: flex;
    justify-content: space-between;
}

/deep/ .el-button{
    width: 40%;
    margin: 0;
}

/deep/ .login-btn{
    background-color: #579f79;
    color: #fff;
}

/deep/ .reset-btn{
    color: #fff;
    background-color: rgb(239, 123, 123);
    
}

/deep/ .login-btn:hover{
    background-color: #83b79a;
    color: #fff;
}

/deep/ .reset-btn:hover{
    color: #fff;
    background-color: rgb(243, 177, 177);
    
}
</style>


