<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 搜索 -->
      <el-input
        placeholder="请输入内容"
        class="search-inp"
        v-model="queryInfo.query"
        clearable
        @clear="getUserList"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          class="search-btn"
          @click="getUserList"
        ></el-button>
      </el-input>

      <el-button type="success" class="success-btn" @click="addDialogVisible = true">
        <i class="el-icon-plus"></i>添加用户
      </el-button>

      <!-- 用户列表区 -->
      <el-table
        :data="userList"
        style="width: 100%; margin-top: 50px; font-size: 13px"
        border
      >
        <el-table-column type="index" label="编号"> </el-table-column>
        <el-table-column prop="username" label="姓名" width="120">
        </el-table-column>
        <el-table-column prop="mobile" label="电话" width="150">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="230">
        </el-table-column>
        <el-table-column prop="role_name" label="角色" width="150">
        </el-table-column>

        <el-table-column label="状态" width="100" class="table-operation">
          <!-- 状态按钮 -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#579f79"
              inactive-color="rgb(239, 123, 123)"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑用户"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                style="background-color: #579f79;"
                @click="showEditUserDialog(scope.row.id)"
                size="mini"
              ></el-button>
            </el-tooltip>

            <el-tooltip
              class="item"
              effect="dark"
              content="删除用户"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                style="background-color: rgb(239, 123, 123);"
                @click="removeUserById(scope.row.id)"
                size="mini"
              ></el-button>
            </el-tooltip>

            <el-tooltip
              class="item"
              effect="dark"
              content="权限分配"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                @click="showSetUserPermissionDialog(scope.row)"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        class="page-seperate"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户弹窗 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <!-- 内容主体区 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="addForm.username"></el-input>
            </el-form-item>

            <el-form-item label="密码" prop="password">
                <el-input v-model="addForm.password"></el-input>
            </el-form-item>

            <el-form-item label="邮箱" prop="email">
                <el-input v-model="addForm.email"></el-input>
            </el-form-item>

            <el-form-item label="手机号" prop="mobile">
                <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
        </el-form>

    
        <!-- 底部按钮区 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            
            <el-button type="primary" @click="addUser">
                确 定
            </el-button>
        </span>
    </el-dialog>


    <!-- 修改用户的对话框 -->
    <el-dialog
    title="编辑用户"
    :visible.sync="editUserDialogVisable"
    width="30%"
    @close="editDialogClosed"
    >
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
            <el-form-item label="用户名">
                <el-input v-model="editForm.username" disabled></el-input>
            </el-form-item>

            <el-form-item label="邮箱" prop="email">
                <el-input v-model="editForm.email"></el-input>
            </el-form-item>

            <el-form-item label="手机号" prop="mobile">
                <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
        </el-form>
        
        <span slot="footer" class="dialog-footer">
            <el-button @click="editUserDialogVisable = false">取 消</el-button>
            <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 分配用户权限弹窗 -->
    <el-dialog
    title="提示"
    :visible.sync="setUserPermissionDialogVisible"
    width="30%"
    >
      <p>用户：{{setUserPermissionUserInfo.username}}</p>

      <br>

      <p>职位：{{setUserPermissionUserInfo.role_name}}</p>

      <br>

      <p>
        分配新职位：
        <el-select v-model="selectedRoleId" placeholder="请选择">
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
          </el-option>
      </el-select>
      </p>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setUserPermissionDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="savaRoleInfo">确 定</el-button>
      </span>

  </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    
    // 自定义校验规则
    let checkEmail = (rule,value,callback) =>{
        const regEmail = /^\w+@\w+(\.\w+)+$/

        if (regEmail.test(value)) {
            return callback()
        }

        callback(new Error("请输入正确的邮箱格式"));
    }

    let checkMobile = (rule,value,callback) =>{
        const regMobile = /^1[34578]\d{9}$/

        if (regMobile.test(value)) {
            return callback()
        }

        //返回一个错误提示
        callback(new Error('请输入合法的手机号码'))
    }


    return {
        // 获取用户列表参数对象
        queryInfo: {
            query: "",
            // 当前的页数
            pagenum: 1,
            // 当前每页显示多少条数据
            pagesize: 5,
        },
        userList: [],
        total: 0,

        //控制添加用户对话框的显示与隐藏
        addDialogVisible: false,

        // 添加用户的表单数据
        addForm:{
            username:"",
            password:"",
            email:"",
            mobile:""

        },
        

        // 添加表单验证规则
        addFormRules:{
            username:[
                { required: true, message: '请输入用户名', trigger: 'blur' },
                { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
            ],
            password:[
                { required: true, message: '请输入密码', trigger: 'blur' },
                { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
            ],
            email:[
                { required: true, message: '请输入邮箱', trigger: 'blur' },
                { validator: checkEmail, trigger: 'blur' }
                
            ],
            mobile:[
                { required: true, message: '请输入手机号', trigger: 'blur' },
                { validator: checkMobile, trigger: 'blur' }
                
            ]
        },

        //控制修改用户对话框的显示与隐藏
        editUserDialogVisable:false,

        // 查询到的用户信息对象
        editForm: {},

        // 修改用户表单验证规则
        editFormRules:{
             email:[
                { required: true, message: '请输入邮箱', trigger: 'blur' },
                { validator: checkEmail, trigger: 'blur' }
                
            ],
            mobile:[
                { required: true, message: '请输入手机号', trigger: 'blur' },
                { validator: checkMobile, trigger: 'blur' }
                
            ]
        },

        // 分配用户权限弹窗显示flag
        setUserPermissionDialogVisible:false,

        // 保存页面数据到弹窗显示
        setUserPermissionUserInfo:{},


        // 职业列表
        rolesList: [],

        // 下拉菜单选中的值
        selectedRoleId:"",

        getSetUserPermissionScopeRow: ''
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    //   获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });

      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表失败");
      }
      this.userList = res.data.users;
      this.total = res.data.total;
    },

    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      // 更新每页显示几条数据，重新发送ajax请求
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },

    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      // 控制页面的跳转
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },

    // 监听switch开关状态的改变
    async userStateChanged(userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        this.$message.error("更新用户状态失败");
      }
      this.$message.success("更新用户状态成功");
    },

    // 关闭添加用户弹窗事件，清空表单
    addDialogClosed(){
        this.$refs.addFormRef.resetFields();
    },


    // 添加新用户
    addUser(){
        this.$refs.addFormRef.validate(async (valid) =>{
            if(valid === false){
                return;
            }
            // 发起添加用户网络请求
            const {data:res} = await this.$http.post("users",this.addForm);
            
            if(res.meta.status !==201){
                this.$message.error("添加用户失败");
            }

            this.$message.success("添加用户成功");
            this.addDialogVisible = false;
            this.getUserList();
        });
    },

    // 修改用户弹窗
    async showEditUserDialog(id){
        const {data:res} = await this.$http.get("users/" + id);

        if(res.meta.status !== 200){
            return this.$message.error("查询用户信息失败");
        }

        this.$message.success("查询用户信息成功");
        
        this.editForm = res.data

        
        this.editUserDialogVisable = true;   
    },

    // 关闭修改用户弹窗事件，清空表单
    editDialogClosed(){
        this.$refs.editFormRef.resetFields();
    },

    // 修改用户信息并提交
    editUserInfo(){
        this.$refs.editFormRef.validate(async (valid)=>{
            if(!valid){
                return;
            }

            const {data:res} = await this.$http.put("users/" + this.editForm.id,{email:this.editForm.email,mobile:this.editForm.mobile});
            
            if(res.meta.status !== 200){
                return this.$message.error("更新用户信息失败");
            }

            this.editUserDialogVisable = false;

            this.getUserList();

            this.$message.success("更新用户信息成功");
        });
    },


    // 根据id删除对应的用户
    async removeUserById(id){
        const result = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).catch((err) => {
            return err;
        });     
        
        if(result !== "confirm"){
          return this.$message.error("已取消删除");
        }


        const {data:res} = await this.$http.delete("users/" + id);

        if(res.meta.status !== 200){
          return this.$message.error("删除失败");
        }
        
        this.$message.success("删除成功");
        this.getUserList();

        
    },

    // 显示分配用户权限弹窗
    async showSetUserPermissionDialog(userInfo){
      

      // 保存用户信息（用户名和职业）到弹窗直接显示
      this.setUserPermissionUserInfo = userInfo;

      const {data:res} = await this.$http.get('roles');

      if(res.meta.status !== 200){
        return this.$message.error("获取职位列表失败");
      }

      this.rolesList = res.data;

      this.getSetUserPermissionScopeRow = userInfo.id;

      this.setUserPermissionDialogVisible = true;
    },


    // 点击分配用户职位按钮更改用户职位
    async savaRoleInfo(row){
      if(!this.selectedRoleId){
        return this.$message.error("请选择要分配的职位");
      }

      const {data:res} = await this.$http.put(`users/${this.getSetUserPermissionScopeRow}/role`,{rid: this.selectedRoleId});

      if(res.meta.status !== 200){
        return this.$message.error("分配用户职位失败");
      }

      this.$message.success("分配用户职位成功");

      this.getUserList();

      this.setUserPermissionDialogVisible = false;

    }
   
  },

};
</script>

<style lang="less" scoped>
.box-card {
  position: relative;
  height: 630px;
}

/deep/ .search-inp {
  width: 400px;
}

.search-btn {
  width: 70px;
}

.success-btn {
  position: absolute;
  width: 200px;
  right: 50px;
  font-weight: bold;
  background-color: #579f79;
}

.success-btn i {
  font-weight: bold;
  position: absolute;
  left: 20px;
}

/deep/ div.cell {
  display: flex;
  justify-content: space-around;
}

/deep/ .page-seperate {
  position: absolute;
  bottom: 25px;
}
</style>