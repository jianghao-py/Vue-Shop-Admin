<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>


        <!-- 卡片视图 -->
        <el-card class="box-card">
            <!-- 表格 -->
            <el-table
            :data="rightList"
            style="width: 100%; font-size:13px; "
            
            >
                <el-table-column type="index" label="编号" width="100px"> </el-table-column>
                <el-table-column
                    prop="authName"
                    label="权限名称"
                    width="346px">
                </el-table-column>
                <el-table-column
                    prop="path"
                    label="路径"
                    width="345px">
                </el-table-column>
                <el-table-column prop="level" label="等级" width="345px">
                    <!-- 渲染等级标签 -->
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.level === '0'">等级一</el-tag>
                        <el-tag type="warning" v-if="scope.row.level === '1'">等级二</el-tag>
                        <el-tag type="danger" v-if="scope.row.level === '2'">等级三</el-tag>

                    </template>  
                </el-table-column>
            </el-table>
        </el-card>

    </div>
</template>

<script>
export default {
    data(){
        return{
            // 权限列表
            rightList:[]
        }
    },
    created(){
        this.getRightList();
    },
    methods:{
        async getRightList(){
            const {data:res} =  await this.$http.get('rights/list');

            if(res.meta.status !== 200){
                return this.$message.error("获取权限列表失败");
            }

            this.rightList = res.data;
            this.$message.success("获取权限列表成功");
        }
    }
};
</script>

<style lang="less" scoped>

</style>