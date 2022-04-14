<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>


        <!-- 卡片视图 -->
        <el-card class="box-card">
            <!-- 搜索 -->
            <el-input
                placeholder="请输入内容"
                class="search-inp"
                v-model="queryInfo.query"
                clearable
                @keyup.enter.native="getGoodsList"
                @clear="getGoodsList"
            >
                <el-button
                slot="append"
                icon="el-icon-search"
                class="search-btn"
                @click="getGoodsList"
                ></el-button>
            </el-input>

            <el-button type="success" class="success-btn" @click="goAddPage">
                <i class="el-icon-plus"></i>添加商品
            </el-button>

            <!-- 列表 -->
             <el-table
                :data="goodsList"
                border
                style="width: 100%; margin-top:50px;">
                <el-table-column
                prop="goods_name"
                label="商品名称"
                >
                </el-table-column>
                <el-table-column
                prop="goods_price"
                label="商品价格"
                width="95px" >
                </el-table-column>
                <el-table-column
                prop="goods_weight"
                label="商品重量"
                width="70px">
                </el-table-column>
                 <el-table-column
                label="创建时间"
                width="140px">
                    {{dateTime | dateFormat}}
                </el-table-column>


                 <el-table-column
                label="操作"
                width="130px">
                    <template slot-scope="scope">
                    
                        <el-button type="danger" icon="el-icon-delete" circle style="background-color: rgb(239, 123, 123); margin-left:40px;" size="mini" @click="deleteGoods(scope.row.goods_id)"></el-button>

                    </template>
                </el-table-column>
                
            </el-table>


            <!-- 分页 -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[5,10]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            style="margin-top:50px;">

            </el-pagination>

        </el-card>
    </div>
</template>

<script>
export default {
    data(){
        return{
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:5
            },

            goodsList:[],
            total:0,
            dateTime: new Date("2022-4-11")
        }
    },
    created(){
        this.getGoodsList();
    },
    methods:{
        // 获取商品列表
        async getGoodsList(){
            const {data:res} = await this.$http.get('goods',{params:this.queryInfo});

            if(res.meta.status !== 200){
                return this.$message.error('获取商品列表失败');
            }

           

            this.goodsList = res.data.goods;
            this.total = res.data.total;

        },

        // 分页Size
        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize;
            this.getGoodsList();
        },

        // 分页换页
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage;
            this.getGoodsList();
        },

        // 删除商品
        async deleteGoods(id){
            const result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(error =>{
                return error;
            });

            if(result !== "confirm"){
                return;
            }

            const {data:res} = await this.$http.delete(`goods/${id}`);

            if(res.meta.status !== 200){
                return this.$message.error("删除失败");
            }

            this.$message.success("删除成功");

            this.getGoodsList();
        },


        // 去添加商品页面
        goAddPage(){
            this.$router.push('/goods/add');
        }

    }
}
</script>

<style lang="less" scoped>
.box-card {
  position: relative;
  
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
</style>