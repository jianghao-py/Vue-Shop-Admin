<template>
    <div>
         <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">
            <!-- 搜索 -->
            <el-input
                placeholder="请输入内容"
                class="search-inp"
                clearable
            >
                <el-button
                slot="append"
                icon="el-icon-search"
                class="search-btn"
                ></el-button>
            </el-input>

            <!-- 表格 -->
             <el-table
                :data="orderList"
                border
                style="width: 100%; margin-top:50px;">

                <el-table-column
                type="index"
                label="编号"
                width="100">
                </el-table-column>

                <el-table-column
                prop="order_number"
                label="单号">
                </el-table-column>

                <el-table-column
                prop="order_price"
                label="订单价格"
                width="120">
                </el-table-column>

                <el-table-column
                prop="order_pay"
                label="是否付款"
                width="120">
                    
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.pay_status === '1'">
                            已付款
                        </el-tag>

                        <el-tag type="danger" v-if="scope.row.pay_status === '0'">
                            未付款
                        </el-tag>
                    </template>

                </el-table-column>

                <el-table-column
                prop="is_send"
                label="是否发货"
                width="120">
                </el-table-column>

                <el-table-column
                label="下单时间"
                width="120">
                    {{time | dateFormat}}
                </el-table-column>

                <el-table-column
                label="操作"
                width="140">
                        <el-button type="primary" icon="el-icon-edit" circle style="background-color: #579f79; border:1px solid #579f79;" size="mini" @click="showDialog"></el-button>
                        <el-button type="danger" icon="el-icon-location" circle style="background-color: rgb(239, 123, 123); margin-left:40px;" size="mini" @click="showDelivery"></el-button>
                </el-table-column>
            </el-table>


            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5,10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                style="margin-top:40px">
            </el-pagination>


        </el-card>


        <!-- 弹窗 -->
        <el-dialog
            title="修改地址"
            :visible.sync="dialogVisible"
            width="50%"
            @close="clearData">
            
            <el-form ref="addressFormRef" :model="addressForm" label-width="100px" :rules="addressFormRule">
                <el-form-item label="省市区/县" prop="address1">
                    <el-cascader
                        v-model="addressForm.address1"
                        :options="cityData"
                        :props="{ expandTrigger: 'hover' }">
                    </el-cascader>
                </el-form-item>

                <el-form-item label="详细地址" prop="address2">
                    <el-input v-model="addressForm.address2"></el-input>
                </el-form-item>
            </el-form>


            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addBtn">确 定</el-button>
            </span>
        </el-dialog>


        <!-- 物流弹窗 -->
        <el-dialog
            title="物流进度"
            :visible.sync="dialogVisible2"
            width="50%">
            
            <el-timeline :reverse="reverse">
                <el-timeline-item
                v-for="(activity, index) in activities"
                :key="index"
                :timestamp="activity.timestamp"
                :color="activity.color">
                {{activity.content}}
                </el-timeline-item>
            </el-timeline>
               

        </el-dialog>

        
    
    
    </div>
</template>

<script>
import cityData from "./citydata"
import { nanoid } from 'nanoid'

export default {
    data(){
        return{
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:5
            },
            orderList:[],
            total:0,
            time:new Date('2022-04-11'),

            dialogVisible:false,

            addressForm:{
                address1:[],
                address2:''
            },

            cityData:cityData,

            addressFormRule:{
                address1:[
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                ],
                address2:[
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                ]
            },

            dialogVisible2:false,

            reverse: true,
            
            activities: [{
                content: '商品已经下单',
                timestamp: '2022-04-09',
                color: '#0bbd87'
                }, {
                content: '您的订单将由HLA（北京海淀区清河中街店）门店安排发货',
                timestamp: '2022-04-09',
                color: '#0bbd87'
                }, {
                content: '卖家发货',
                timestamp: '2022-04-10',
                color: '#0bbd87'
                }, {
                content: '顺丰速运 已收取快件',
                timestamp: '2022-04-11',
                color: '#0bbd87'
                }, {
                content: '快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]',
                timestamp: '2022-04-11',
                color: '#0bbd87'
                }, {
                content: '快件到达 [北京顺义集散中心]',
                timestamp: '2022-04-12',
                color: '#0bbd87'
                }, {
                content: '快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]',
                timestamp: '2022-04-12',
                color: '#0bbd87'
                }, {
                content: '[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件',
                timestamp: '2022-04-13',
                color: '#0bbd87'
                }, {
                content: '已签收,感谢使用顺丰,期待再次为您服务',
                timestamp: '2022-04-13',
                color: '#0bbd87'
                }],

            deliveryID:[nanoid()]


        }
    },
    created(){
        this.getOrderList();
    },
    methods:{
        async getOrderList(){
            const {data:res} = await this.$http.get('orders',{params: this.queryInfo});

            if(res.meta.status !== 200){
                return this.$message.error("获取数据失败");
            }

            this.orderList = res.data.goods;
            this.total = res.data.total;

            for(let i=0;i<5;i++){
                this.deliveryID[i] = nanoid();
            }

            for(let i=0;i<this.orderList.length;i++){
                this.orderList[i].order_number = this.deliveryID[i];
            }
            
        },

        handleSizeChange(newSize){
            this.queryInfo.pagesize = newSize;
            this.getOrderList();
        },

        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage;
            this.getOrderList();
        },

        showDialog(){
            this.dialogVisible = true;
        },

        clearData(){
            this.$refs.addressFormRef.resetFields();
        },

        addBtn(){
            this.$refs.addressFormRef.validate(valid =>{
                if(!valid){
                    return this.$message.error("请完善选项");
                }

                this.dialogVisible = false;
                this.$message.success("添加成功");

                
            })
        },

        showDelivery(){
           

            this.dialogVisible2 = true;
        }


    }
}
</script>

<style lang="less" scoped>
/deep/ .search-inp {
  width: 400px;
}

.search-btn {
  width: 70px;
}
</style>