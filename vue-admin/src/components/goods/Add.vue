<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card class="box-card">
            <el-alert
                title="添加商品信息"
                type="warning"
                :closable="false"
                center>
            </el-alert>

            <el-steps :active="activeIndex - 0" style="margin-top:40px;" :space="200" align-center>
                <el-step title="基本信息" icon="el-icon-edit"></el-step>
                <el-step title="商品参数" icon="el-icon-s-goods"></el-step>
                <el-step title="商品属性" icon="el-icon-s-data"></el-step>
                <el-step title="商品内容" icon="el-icon-info"></el-step>
                <el-step title="完成" icon="el-icon-success"></el-step>
            </el-steps>


            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">

                <el-tabs :tab-position="tabPosition" style="margin-top:40px;" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClick">
                    
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>

                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>

                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight" type="number"></el-input>
                        </el-form-item>

                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number" type="number"></el-input>
                        </el-form-item>


                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader
                                v-model="addForm.goods_cat"
                                :options="cateList"
                                :props="{ expandTrigger: 'hover',label:'cat_name',value:'cat_id',children:'children' }"
                                @change="handleChange">

                            </el-cascader>
                        </el-form-item>

                    </el-tab-pane>

                    <el-tab-pane label="商品参数" name="1">
                         <el-form-item :label="item.attr_name" v-for="item in tabTwoList" :key="item.attr_id">
                             
                             <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox :label="item2" v-for="(item2,i) in item.attr_vals" :key="i"></el-checkbox>
                            </el-checkbox-group>

                        </el-form-item>
                    </el-tab-pane>

                    <el-tab-pane label="商品属性" name="2">
                         <el-form-item :label="item.attr_name" v-for="item in tabThreeList" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>

                    <el-tab-pane label="商品内容" name="3">

                         <quill-editor v-model="addForm.goods_introduce">

                         </quill-editor>

                         <el-button type="success" class="addGoods-btn" @click="addGoods">
                            <i class="el-icon-plus"></i>添加商品
                        </el-button>
                    </el-tab-pane>
                </el-tabs>

            </el-form>

        </el-card>
    </div>
</template>

<script>
import _ from "lodash"

export default {
    data(){
        return{
            activeIndex:"0",
            tabPosition:'left',
            addForm:{
                goods_name:'',
                goods_price: 0,
                goods_weight: 0,
                goods_number: 0,
                goods_cat:[],
                // 富文本
                goods_introduce:'',
                // 商品的参数（数组），包含 动态参数 和 静态属性
                attrs:[]

            },

            addFormRules:{
                goods_name:[
                     { required: true, message: '请输入商品名称', trigger: 'blur' },
                ],
                goods_price:[
                     { required: true, message: '请输入商品价格', trigger: 'blur' },
                ],
                goods_weight:[
                     { required: true, message: '请输入商品重量', trigger: 'blur' },
                ],
                goods_number:[
                     { required: true, message: '请输入商品数量', trigger: 'blur' },
                ],
                goods_cat:[
                    { required: true, message: '请输入商品数量', trigger: 'blur' },
                ]
            },

            cateList:[],

            tabTwoList:[],
            tabThreeList:[]



        }
    },

    created(){
        this.getCateList();
    },
    methods:{
        async getCateList(){
            const {data:res} = await this.$http.get('categories');

            if(res.meta.status !== 200){
                return this.$message.error("获取商品分类失败");
            }

            this.cateList = res.data;
        },

        // 级联选择器change事件
        handleChange(){
            if(this.addForm.goods_cat.length !== 3){
                this.addForm.goods_cat = [];
            }
        },

        beforeTabLeave(activeName,oldActiveName){
            if(oldActiveName === "0" && this.addForm.goods_cat.length !== 3){
                this.$message.error("请先填写完成商品分类")
                return false;
            }
        },

        async tabClick(){
            if(this.activeIndex === '1'){
                const {data:res} = await this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`,{params:{sel:'many'}})

                if(res.meta.status !== 200){
                    return this.$message.error("获取商品参数失败");
                }

                // 字符串转数组
                res.data.forEach(element => {
                    element.attr_vals = element.attr_vals.length === 0 ? [] : element.attr_vals.split(' ');
                });
                
                this.tabTwoList = res.data;
               

            }else if(this.activeIndex === '2'){
                const {data:res} = await this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`,{params:{sel:'only'}});

                if(res.meta.status !== 200){
                    return this.$message.error("获取商品属性失败");
                }

                this.tabThreeList = res.data;

            }
        },

        addGoods(){
            this.$refs.addFormRef.validate(async valid =>{
                if(!valid){
                    return this.$message.error("请完整填写表单");
                }


                // 深拷贝addForm.goods_cat
                const cloneForm =  _.cloneDeep(this.addForm);

                // 操作拷贝的对象的数组转字符串发送请求
                cloneForm.goods_cat = cloneForm.goods_cat.join(',');

                const {data:res} = await this.$http.post('goods',cloneForm);


                if(res.meta.status !== 201){
                    return this.$message.error("添加商品失败");
                }

                this.$message.success("添加商品成功");

                this.$router.push("/goods");



            })
        }

    }
}
</script>

<style lang="less" scoped>
/deep/ .el-step__title{
    font-size: 13px;
}

/deep/ .el-tabs__item{
    font-size: 13px;
}

/deep/ .el-tabs__item.is-active{
    color: #579f79;
}

/deep/ .el-tabs__item:hover{
    color: #579f79;
}

/deep/ .el-tabs__active-bar{
    background-color: #579f79;
}

.addGoods-btn{
    margin-top: 30px;
    width: 200px;
    font-weight: bold;
    background-color: #579f79;
}

.addGoods-btn i{
    font-weight: bold;
    position: absolute;
    left: 20px;
}
</style>