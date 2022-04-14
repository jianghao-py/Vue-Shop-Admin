<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">
             <el-alert
                title="注意：只允许为第三级分类设置相关参数"
                type="warning"
                :closable="false"
                show-icon>
            </el-alert>

            <el-row style="margin-top:20px;">
                <el-col>
                    <span style="font-size:13px; font-weight:bold;">请先选择商品分类：</span>

                    <el-cascader
                    v-model="cascaderVModelArray"
                    :options="cateList"
                    :props="cascaderProps"
                    @change="handleChange"
                    clearable></el-cascader>
                    
                </el-col>
            </el-row>

            <el-tabs v-model="activeName" @tab-click="handleTabClick" style="margin-top:30px;">
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="success" class="addParams" size="mini" :disabled="isBtnDisable" @click="addParamsDialogVisible=true">
                        <i class="el-icon-plus"></i>添加参数
                    </el-button>

                    <el-table :data="manyList" border style="margin-top:20px">

                        <el-table-column label="点击展开Tags" type="expand" width=150>
                            <template slot-scope="scope">
                                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="deleteTag(i,scope.row)">
                                    {{item}}
                                </el-tag>

                                <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)"
                                style="width:120px;"
                                >
                                </el-input>

                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            
                            </template>
                        </el-table-column>

                        <el-table-column label="编号" type="index" width=120></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>

                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" circle style="background-color: #579f79; border:1px solid #579f79;" size="mini" @click="showEditDialog(scope.row.attr_id)"></el-button>
                                <el-button type="danger" icon="el-icon-delete" circle style="background-color: rgb(239, 123, 123); margin-left:100px;" size="mini"  @click="deleteParams(scope.row.attr_id)"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

                <el-tab-pane label="静态属性" name="only">
                    


                    <el-button type="success" class="addAttributes" size="mini" :disabled="isBtnDisable" @click="addParamsDialogVisible=true">
                        <i class="el-icon-plus"></i>添加属性
                    </el-button>

                    <el-table :data="onlyList" border style="margin-top:20px">
                        
                        <el-table-column label="点击展开Tags" type="expand" width=150>
                            <template slot-scope="scope">
                                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="deleteTag(i,scope.row)">
                                    {{item}}
                                </el-tag>

                                <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)"
                                style="width:120px;"
                                >
                                </el-input>

                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            
                            </template>
                        </el-table-column>
                        
                        
                        <el-table-column label="编号" type="index" width=100></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>

                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" circle style="background-color: #579f79; border:1px solid #579f79;" size="mini" @click="showEditDialog(scope.row.attr_id)"></el-button>
                                <el-button type="danger" icon="el-icon-delete" circle style="background-color: rgb(239, 123, 123); margin-left:100px;" size="mini" @click="deleteParams(scope.row.attr_id)"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <!-- 添加参数和属性弹窗 -->
        <el-dialog
        :title="'添加' + titleText"
        :visible.sync="addParamsDialogVisible"
        width="50%"
        @close="closeAddParamsDialog"
        >
        
            <el-form :model="addForm" :rules="addFormRule" ref="addFormRef" label-width="100px" class="demo-ruleForm">
                
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addParamsDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改参数和属性弹窗 -->
        <el-dialog
        :title="'修改' + titleText"
        :visible.sync="editParamsDialogVisible"
        width="50%"
        @close="closeEditParamsDialog"
        >
        
            <el-form :model="editForm" :rules="editFormRule" ref="editFormRef" label-width="100px" class="demo-ruleForm">
                
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="editParamsDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParams">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return{
            // 商品分类列表
            cateList:[],

            cascaderProps:{
                expandTrigger: 'hover',
                value:'cat_id',
                label:'cat_name',
                children: 'children'
            },
            // 级联选择框v-model绑定的数组，保存的是上面对象中的value（cat_id）
            cascaderVModelArray:[],


            activeName:'many',
            manyList:[],
            onlyList:[],

            addParamsDialogVisible:false,

            addForm:{},

            addFormRule:{
                attr_name:[
                    { required: true, message: "请输入参数", trigger: 'blur' }
                ]
            },

            editParamsDialogVisible:false,

            editForm:{

            },

            editFormRule:{
                attr_name:[
                    { required: true, message: "请输入参数", trigger: 'blur' }
                ]
            },

            inputVisible:false,
            inputValue:''






        }
    },
    created(){
        this.getCateList();
    },
    methods:{
        // 获取所有商品分类列表
        async getCateList(){
            const {data:res} = await this.$http.get('categories');

            if(res.meta.status !== 200){
                return this.$message.error("获取商品分类列表失败");
            }

            this.cateList = res.data;
        },

        // 级联选择框选中发生变化，触发此回调函数
        handleChange(){
            this.sendHTTPGetParams();


        },
        // Tab页签点击事件
        handleTabClick(){
            this.sendHTTPGetParams();

        },

        // 发送请求获取数据
        async sendHTTPGetParams(){
            // 证明选中的不是三级分类
            if(this.cascaderVModelArray.length !== 3){
                this.cascaderVModelArray = [];
                this.manyList = [];
                this.onlyList = [];
                return;
            }

            // 获取参数列表
            const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}});

            if(res.meta.status !== 200){
                return this.$message.error("获取参数列表失败");
            }

            // attr_vals字符串转数组
            res.data.forEach(element => {
                element.attr_vals = element.attr_vals ? element.attr_vals.split(' ') : [];

                // 控制动态添加tags的v-if和v-model
                element.inputVisible = false;
                element.inputValue = '';

            });

            // 判断数据属于哪个表格
            if(this.activeName === "many"){
                this.manyList = res.data;
            }else{
                this.onlyList = res.data;
            }
        },
        // 监听弹窗关闭事件
        closeAddParamsDialog(){
            this.$refs.addFormRef.resetFields();
        },
        // 点击按钮添加参数
        addParams(){
            this.$refs.addFormRef.validate(async valid =>{
                if(!valid){
                    return;
                }
                
                const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{attr_name:this.addForm.attr_name,attr_sel:this.activeName});


               
                if(res.meta.status !== 201){
                    return this.$message.error("添加参数失败");
                }

                this.addParamsDialogVisible = false;
                this.sendHTTPGetParams()

            })
        },

        // 弹出修改弹出
        async showEditDialog(id){
            const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${id}`,{params:{attr_sel:this.activeName}});

            if(res.meta.status !== 200){
                return this.$message.error("获取参数信息失败");
            }

            this.editForm =res.data;

            this.editParamsDialogVisible = true;
        },
        closeEditParamsDialog(){
            this.$refs.editFormRef.resetFields();
           
        },

        editParams(){
            this.$refs.editFormRef.validate(async valid =>{
                if(!valid){
                    return false;
                }

                const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{
                    attr_name:this.editForm.attr_name,
                    attr_sel:this.activeName
                });

                if(res.meta.status !== 200){
                    return this.$message.error("编辑参数信息失败");
                }

                this.$message.success("编辑参数信息成功");

                this.sendHTTPGetParams();

                this.editParamsDialogVisible = false;

            })
        },

        async deleteParams(id){
            const result = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err =>{
                return err;
            });

            if(result !== "confirm"){
                return;
            }

            const {data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`);

            if(res.meta.status !== 200){
                return this.$message.error("删除失败");
            }

            this.$message.success("删除成功");

            this.sendHTTPGetParams();
        },

        // 添加Tag
        async handleInputConfirm(row){
            if(row.inputValue.trim().length === 0){
                row.inputValue = '';
                row.inputVisible = false;
                return;
            }

            row.attr_vals.push(row.inputValue.trim());
            row.inputValue = '';
            row.inputVisible = false;

            const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
                attr_name: row.attr_name,
                attr_sel:row.attr_sel,
                attr_vals: row.attr_vals.join(" ")
            });

            if(res.meta.status !== 200){
                return this.$message.error("修改参数项失败");
            }

            this.$message.success("修改参数项成功");

            
        },

        showInput(row){
            row.inputVisible = true;

            // 文本框自动获取焦点
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        // 删除Tag
        async deleteTag(i,row){
            row.attr_vals.splice(i,1);

             const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
                attr_name: row.attr_name,
                attr_sel:row.attr_sel,
                attr_vals: row.attr_vals.join(" ")
            });

            if(res.meta.status !== 200){
                return this.$message.error("删除参数项失败");
            }

            this.$message.success("删除参数项成功");
        }
    },

    computed:{
        // 如果按钮需要被禁用则返回true
        isBtnDisable(){
            if(this.cascaderVModelArray.length !== 3){
                return true;
            }

            return false;
        },

        // 当前选中三级分类的ID
        cateId(){
            if(this.cascaderVModelArray.length === 3){
                // 最后一项
                return this.cascaderVModelArray[2];
            }

            return null;
        },
        // 计算添加参数和属性弹窗的标题文本，两者公用一个弹窗，需要区分
        titleText(){
            if(this.activeName === "many"){
                return '动态参数';
            }

            return '静态属性';
        }
    }
}
</script>

<style lang="less" scoped>
/deep/ .el-tabs__item.is-active{
    color: #579f79;
}

/deep/ .el-tabs__item:hover{
    color: #579f79;
}

/deep/ .el-tabs__active-bar{
    background-color: #579f79;
}

.addParams,.addAttributes{
    margin-top: 10px;
    position: relative;
    font-weight: bold;
    width: 100px;
    background-color: #579f79;
}

.addParams i, .addAttributes i{
    font-weight: bold;
    position: absolute;
    left: 5px;
}

.el-tag{
    margin: 10px;
}
</style>