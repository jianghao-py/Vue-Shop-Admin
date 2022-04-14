<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>


        <!-- 卡片视图 -->
        <el-card class="box-card">

            <!-- 添加商品分类按钮 -->
            <el-button type="success" class="addGoods-btn" @click="showAddGoods">
                <i class="el-icon-plus"></i>添加商品
            </el-button>


           <tree-table :data="goodsList" :columns="columns" :selection-type="false" :expand-type="false" :show-index="true" border style="font-size:13px; margin-top:70px;">
               <!-- 第二列，是否有效 -->
               <template slot="isok" slot-scope="scope">
                   <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:#579f79"></i>
                   <i class="el-icon-error" v-else style="color:rgb(239, 123, 123)"></i>
               </template>

               <!-- 第三列，排序 -->
               <template slot="sort" slot-scope="scope">
                   <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
                   <el-tag type="success" v-if="scope.row.cat_level === 1" size="mini">二级</el-tag>
                   <el-tag type="warning" v-if="scope.row.cat_level === 2" size="mini">三级</el-tag>
               </template>

               <!-- 第三列，操作 -->
               <template slot="opt" slot-scope="scope">
                   <el-button type="danger" icon="el-icon-delete" circle style="background-color: rgb(239, 123, 123); margin-left:100px;" size="mini" @click="deleteGoods(scope.row)"></el-button>
               </template>
           </tree-table>


           <!-- 分页区域 -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[3, 5, 9]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            style="margin-top:50px"
            >
            </el-pagination>

        </el-card>


        <!-- 添加商品分类弹窗 -->
        <el-dialog
        title="添加分类"
        :visible.sync="addGoodDialogVisible"
        width="50%"
        @close="closeAddGoodDialog"
        >

            <!-- 表单 -->
            <el-form :model="addGoodForm" :rules="addGoodFormRule" ref="addGoodFormRef" label-width="100px">
                <el-form-item label="分类名称：" prop="cat_name">
                    <el-input v-model="addGoodForm.cat_name"></el-input>
                </el-form-item>

                <el-form-item label="父级分类：">
                     <el-cascader
                    v-model="cascaderVModelArry"
                    :options="parentGoodsList"
                    :props="cascaderProps"
                    @change="parentGoodsChanged"
                    clearable
                    change-on-select
                    ></el-cascader>
                </el-form-item>
            </el-form>
            
            <span slot="footer" class="dialog-footer">
                <el-button @click="addGoodDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addNewGoods">确 定</el-button>
            </span>
        </el-dialog>

        


    </div>
</template>

<script>
export default {
    data(){
        return{
            goodsList:[],
            // 请求参数
            queryInfo:{
                type:3,
                pagenum:1,
                pagesize:9
            },
            total: 0,
            // 表格列
            columns:[
                {
                    label:'分类名称',
                    prop:'cat_name'
                },
                {
                    label:'是否有效',
                    // 当前列为模板列
                    type:'template',
                    template:'isok'
                },
                {
                    label:'排序',
                    type:'template',
                    template:'sort'
                },
                {
                    label:'操作',
                    type:'template',
                    template:'opt'
                }
            ],

            addGoodDialogVisible:false,

            // 添加分类的表单
            addGoodForm:{
                cat_name:'',
                cat_pid:0,
                cat_level:0
            },

            addGoodFormRule:{
                cat_name:[
                     { required: true, message: '请输入活动名称', trigger: 'blur' }
                ]
            },

            parentGoodsList:[],


            // 级联选择器的配置对象
            cascaderProps:{
                value:'cat_id',
                label:'cat_name',
                children: 'children',
                expandTrigger: 'hover'
            },

            // 级联选择器的数组,选中的父级id数组
            cascaderVModelArry:[],

           


        }
    },
    created(){
        this.getGoodsList();
    },
    methods:{
        async getGoodsList(){
            const {data:res} = await this.$http.get('categories',{params:this.queryInfo});

            if(res.meta.status !== 200){
                return this.$message.error("获取商品分类列表失败");
            }

            this.goodsList = res.data.result;
            // 总数据条数
            this.total = res.data.total;
        },

        // 监听pagesize
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize;
            this.getGoodsList()
           
        },

        // 监听pagenum改变
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage;
             this.getGoodsList()
        },

        // 点击按钮弹出添加商品的弹窗
        showAddGoods(){
            // 获取父级分类的数据列表
            this.getParentGoodList();
            this.addGoodDialogVisible = true;
        },

        // 获取父级分类的数据列表
        async getParentGoodList(){
            const {data:res} = await this.$http.get('categories',{params:{type:2}});

            if(res.meta.status !== 200){
                return this.$message.error("获取父级分类的数据列表失败");
            }

            this.parentGoodsList = res.data;
            
            
        },

        // 级联选择器发生变化触发这个函数
        parentGoodsChanged(){
            // 证明选中了父级分类
            if(this.cascaderVModelArry.length > 0){
                // 父级分类的id重新赋值
                this.addGoodForm.cat_pid = this.cascaderVModelArry[this.cascaderVModelArry.length - 1];

                // 自身level值重新赋值
                this.addGoodForm.cat_level = this.cascaderVModelArry.length;
                return;
            }else{
                this.addGoodForm.cat_pid = 0;
                this.addGoodForm.cat_level = 0;
            }
        },

        // 关闭添加商品的弹窗
        closeAddGoodDialog(){
            this.$refs.addGoodFormRef.resetFields();
            this.cascaderVModelArry = [];
            this.addGoodForm.cat_pid = 0;
            this.addGoodForm.cat_level = 0;
        },

        // 添加新分类
        addNewGoods(){
            this.$refs.addGoodFormRef.validate(async valid =>{
                if(!valid){
                    return;
                }

                const {data:res} = await this.$http.post('categories',this.addGoodForm);
                if(res.meta.status !== 201){
                    return this.$message.error("添加新分类失败");
                }

                this.$message.success("添加新分类成功");

                this.getGoodsList();

                this.addGoodDialogVisible = false;
            })
        },

        // 删除商品分类
        async deleteGoods(row){
            const id = parseInt(row.id);
            const {data:res} = await this.$http.delete('categories/' + row.cat_id);
            
            if(res.meta.status !== 200){
                return this.$message.error("删除分类失败");
            }

            this.getGoodsList();
        }
    }
}
</script>

<style lang="less" scoped>
.box-card {
  position: relative;
}

.addGoods-btn{
    position: absolute;
    width: 200px;
    right: 50px;
    font-weight: bold;
    background-color: #579f79;
}

.addGoods-btn i{
    font-weight: bold;
    position: absolute;
    left: 20px;
}


</style>