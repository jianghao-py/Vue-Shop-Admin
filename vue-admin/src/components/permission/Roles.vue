<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>职位列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card class="box-card">

            <!-- 添加职位权限 -->
            <el-button type="success" class="addPermission-btn" @click="addPermissionDialog = true">
                <i class="el-icon-plus"></i>添加职位
            </el-button>

            <!-- 表格 -->
            <el-table
            :data="rolesList"
            border
            style="width: 100%; margin-top: 70px; font-size:13px">
                <el-table-column type="expand" label="点击展开树状图" width="120">
                    <template slot-scope="scope">
                        <el-row v-for="(item1) in scope.row.children" :key="item1.id" class="first-row row-center">
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag>{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>

                            <!-- 渲染二级和三级权限 -->
                            <el-col :span="19">

                                <el-row v-for="(item2) in item1.children" :key="item2.id" class="second-row row-center">
                                    <el-col :span="6">
                                        <el-tag type="success">{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>

                                    <el-col :span="18">
                                        <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable @close="closeTagById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>

                        </el-row>
                    </template>
                </el-table-column>


                <el-table-column
                type="index"
                label="编号"
                width="100">
                </el-table-column>

                <el-table-column
                prop="roleName"
                label="职位名称"
                width="270">
                </el-table-column>
                <el-table-column
                prop="roleDesc"
                label="职位描述"
                width="270">
                </el-table-column>


                <el-table-column label="操作">

                    <template slot-scope="scope">

                        <el-tooltip
                        class="item"
                        effect="dark"
                        content="编辑职位"
                        placement="top"
                        :enterable="false"
                        >
                        <el-button
                            type="primary"
                            icon="el-icon-edit"
                            style="background-color: #579f79;"
                            size="mini"
                            @click="showEditJobDialog(scope.row.id)"
                        ></el-button>
                        </el-tooltip>

                        <el-tooltip
                        class="item"
                        effect="dark"
                        content="删除职位"
                        placement="top"
                        :enterable="false"
                        >
                            <el-button
                                type="danger"
                                icon="el-icon-delete"
                                style="background-color: rgb(239, 123, 123);"
                                size="mini"
                                @click="removeJobById(scope.row.id)"
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
                                size="mini"
                                @click="showSetPermissionDialog(scope.row)"
                            ></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

        </el-card>

        <!-- 添加职位弹窗 -->
        <el-dialog
        title="添加职位"
        :visible.sync="addPermissionDialog"
        width="30%"
        @close="addPermissionDialogClosed"
        >


            <el-form :model="addPermissionForm" :rules="addPermissionFormRules"  ref="addPermissionFormRef" label-width="70px">
                <el-form-item label="职位名" prop="roleName">
                    <el-input v-model="addPermissionForm.roleName"></el-input>
                </el-form-item>

                <el-form-item label="职位描述" prop="roleDesc">
                    <el-input v-model="addPermissionForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>


            <span slot="footer" class="dialog-footer">
                <el-button @click="addPermissionDialog = false">取 消</el-button>
                <el-button type="primary" @click="addJob">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑职位弹窗 -->
        <el-dialog
        title="编辑职位"
        :visible.sync="editPermissionDialog"
        width="50%"
        @close="editPermissionDialogClosed"
        >


            <el-form :model="editJobForm" :rules="editPermissionFormRules"  ref="editPermissionFormRef" label-width="100px">
                <el-form-item label="职位名" prop="roleName">
                    <el-input v-model="editJobForm.roleName"></el-input>
                </el-form-item>

                <el-form-item label="职位描述" prop="roleDesc">
                    <el-input v-model="editJobForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>

            
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editPermissionDialog = false">取 消</el-button>
                    
                    <el-button type="primary" @click="editJob">确 定</el-button>
                    
                    
                </span>
                
            
        </el-dialog>


        <!-- 分配权限弹窗 -->
        <el-dialog
        title="分配权限"
        :visible.sync="setPermissionDialogVisible"
        width="50%"
        @close="setPermissionDialogClose"
        >

            <el-tree :data="permissionsList" :props="treeProps" show-checkbox node-key="id" :default-checked-keys="defaultCheckKeys" :default-expand-all="true" ref="treeRef"></el-tree>

            <span slot="footer" class="dialog-footer">
                <el-button @click="setPermissionDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotPermission">确 定</el-button>
            </span>

        </el-dialog>

    </div>

    
</template>

<script>
export default {
    data(){
        return{
            rolesList:[],
            addPermissionDialog:false,
            addPermissionForm:{
                roleName:"",
                roleDesc:""
            },
            addPermissionFormRules:{
                roleName:[
                     { required: true, message: '请输入活动名称', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                roleDesc:[
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ]
            },


            editJobForm:{},
            editPermissionDialog:false,
            editPermissionFormRules:{
                roleName:[
                     { required: true, message: '请输入活动名称', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                roleDesc:[
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ]
            },
            getHttpID:'',


            // 分配权限对话框显示隐藏
            setPermissionDialogVisible:false,
            
            // 所有权限的数据
            permissionsList:[],

            // Tree控件
            treeProps:{
                label:'authName',
                children:'children'
            },

            // 默认选中节点的ID数组
            defaultCheckKeys:[105],

            getPermissionID:''


        }
    },
    created(){
        this.getRolesList();
    },
    methods:{
        async getRolesList(){
            const {data:res} = await this.$http.get("roles");

            if(res.meta.status !== 200){
                return this.$message.error("获取职位权限列表失败");
            }

            this.rolesList = res.data;
        },
        addPermissionDialogClosed(){
            this.$refs.addPermissionFormRef.resetFields();
        },
        addJob(){

            this.$refs.addPermissionFormRef.validate(async (valid) =>{
                if(valid === false){
                    return;
                }
                const {data:res}  = await this.$http.post('roles',this.addPermissionForm);

                if(res.meta.status !== 201){
                    return this.$message.error("添加职位权限失败");
                }

                this.$message.success("添加职位权限成功");
                this.addPermissionDialog = false;
                this.getRolesList();
               
            });   
            
            
        },

        async showEditJobDialog(id){
            const {data:res} = await this.$http.get("roles/" + id);

             if(res.meta.status !== 200){
                return this.$message.error("查询职位信息失败");
            }

            this.$message.success("查询用户信息成功");

            this.getHttpID = id;
        
            this.editJobForm = res.data

        
            this.editPermissionDialog = true;   
        },
        editPermissionDialogClosed(){
            this.$refs.editPermissionFormRef.resetFields();
        },

        editJob(){
            this.$refs.editPermissionFormRef.validate(async (valid)=>{
                if(!valid){
                    return;
                }

                const {data:res} = await this.$http.put("roles/" + this.getHttpID,{roleName:this.editJobForm.roleName,roleDesc:this.editJobForm.roleDesc});
                console.log(res);

                if(res.meta.status !== 200){
                    return this.$message.error("更新职位信息失败");
                }

                this.editPermissionDialog = false;

                this.getRolesList();

                this.$message.success("更新职位信息成功");
            });
        },

        async removeJobById(id){
            const result = await this.$confirm('此操作将永久删除该职位, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch((err) => {
                return err;
            });     
        
            if(result !== "confirm"){
                return this.$message.error("已取消删除");
            }


            const {data:res} = await this.$http.delete("roles/" + id);

            if(res.meta.status !== 200){
                return this.$message.error("删除失败");
            }
            
            this.$message.success("删除成功");
            this.getRolesList();
        },

        // 根据Id删除权限Tag标签
        async closeTagById(row,id){
            // 弹框警告
            const result = await this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch( (err) =>{
                return err
            });

            if(result !== "confirm"){
                return this.$message.info("取消了删除");
            }

            const {data:res} = await this.$http.delete(`roles/${row.id}/rights/${id}`);

            
            if(res.meta.status !== 200){
                return this.$message.error("删除标签失败");
            }

            // 部分渲染页面（不是整体渲染）
            row.children = res.data;

        },

        // 弹出分配权限的弹窗
        async showSetPermissionDialog(row){
            // 获取数据
            const {data:res} = await this.$http.get('rights/tree');

            if(res.meta.status !== 200){
                return this.$message.error("获取权限数失败");
            }

            this.permissionsList = res.data;

            this.getPermissionID = row.id;

            // 递归获取三级节点的id
            this.getLeafKeys(row,this.defaultCheckKeys);

            this.setPermissionDialogVisible = true;
        },

        // 递归获取角色下所有三级权限的id并保存到defaultCheckKeys
        getLeafKeys(node,arry){
            if(!node.children){
                return arry.push(node.id);
            }

            node.children.forEach(item => {
                this.getLeafKeys(item,arry);
            });
        },

        // 监听分配权限弹窗的关闭事件
        setPermissionDialogClose(){
            this.defaultCheckKeys = [];
        },

        // 分配权限
        async allotPermission(){
            const keys = [
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys() 
            ];

            const keysStr = keys.join(',');

            const {data:res} = await this.$http.post(`roles/${this.getPermissionID}/rights`,{rids:keysStr});

            if(res.meta.status !== 200){
                return this.$message.error("分配权限失败");
            }

            this.$message.success("分配权限成功");

            this.getRolesList();

            this.setPermissionDialogVisible = false;

        }
    }
}
</script>

<style lang="less" scoped>
.box-card {
  position: relative;
}

.addPermission-btn{
    position: absolute;
    width: 200px;
    right: 50px;
    font-weight: bold;
    background-color: #579f79;
}

.addPermission-btn i {
  font-weight: bold;
  position: absolute;
  left: 20px;
}

/deep/ div.cell {
  display: flex;
  justify-content: space-around;
}

.el-tag{
    margin: 10px;
}

.first-row{
    border-bottom: 1px #eee solid;
}

.first-row:first-child{
    border-top: 1px #eee solid;
}

.second-row{
    border-bottom: 1px #eee solid;
}

.second-row:last-child{
    border: none;
}

.row-center{
    display: flex;
    align-items: center;
}
</style>