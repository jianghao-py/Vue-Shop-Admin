<template>
    <div class="welcome-page">
        <div class="left-part">
            <img src="../assets/avatar.jpg" class="avatar" alt="">
            <h3 style="margin-top:30px">用户您好，欢迎登录</h3>
        </div>

        <el-card style="height:280px; width:40%; position:absolute;right:30px; text-align:center">
            <a href="https://github.com/jianghao-py/Vue-Shop-Admin">
            
                <h3>Github 链接</h3>

                <img src="../assets/github.png" alt="" style="width:100%;height:100%;">
            
            </a>

        </el-card>

        <el-card style="height:280px; width:25%; position:absolute;right:550px;">
            <ul class="list">
                <router-link to='/users'>
                    <li style="border-left: 20px solid #f0bfa9;">用户列表</li>
                </router-link>

                <router-link to='/roles'>
                    <li style="border-left: 20px solid #69a079;">角色列表</li>
                </router-link>


                <router-link to='/rights'>
                    <li style="border-left: 20px solid #a6bdc6;">权限列表</li>
                </router-link>

                <router-link to='/goods'>
                    <li style="border-left: 20px solid #b4bb99;">商品列表</li>
                </router-link>


                <router-link to='/categories'>
                    <li style="border-left: 20px solid #deaed4;">商品分类</li>
                </router-link>

                <router-link to='/orders'>
                   <li style="border-left: 20px solid #f2d7b8;">订单列表</li>
                </router-link>
            
            </ul>

        </el-card>


        <div class="bottom-left">
            <el-carousel trigger="click" height="100%">
                <el-carousel-item>
                    <img src="../assets/img1.png" alt="" style="width:95%; height:95%; margin-top:15px">
                </el-carousel-item>

                <el-carousel-item>
                    <img src="../assets/img2.png" alt="" style="width:95%; height:95%; margin-top:15px">
                </el-carousel-item>

                <el-carousel-item>
                    <img src="../assets/img3.png" alt="" style="width:95%; height:95%; margin-top:15px">
                </el-carousel-item>

                <el-carousel-item>
                    <img src="../assets/img4.png" alt="" style="width:95%; height:95%; margin-top:15px">
                </el-carousel-item>

                <el-carousel-item>
                    <img src="../assets/img5.png" alt="" style="width:95%; height:95%; margin-top:15px">
                </el-carousel-item>

            </el-carousel>
        </div>

        <div id="main" class="chart"></div>

    </div>
</template>

<script>
import * as echarts from 'echarts';


export default {
    name:"WelcomePage",
    data(){
        return{
           
        }
    },

    mounted(){
        var chartDom = document.getElementById('main');
        var myChart = echarts.init(chartDom);
        var option;

        option = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            left: 'center'
        },
        series: [
            {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                show: true,
                fontSize: '40',
                fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: [
                { value: 1048, name: '华东' },
                { value: 735, name: '华南' },
                { value: 580, name: '华北' },
                { value: 484, name: '西部' },
                { value: 300, name: '其他' }
            ]
            }
        ]
        };

        option && myChart.setOption(option);
    }
}
</script>

<style lang="less" scoped>
.welcome-page{
    width: 100%;
    height: 100%;
    position: relative;
}


.avatar{
    width: 100px;
    height: 100px;
    border-radius: 50%;
}

.left-part{
    width: 20%;
    height:200px;
    position:absolute;
    text-align: center;
}

.bottom-left{
    width: 45%;
    height: 300px;
    position: absolute;
    bottom: 10px;
    border-radius: 17px;
    text-align: center;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.el-carousel{
    width: 100%;
    height: 270px;
    border-radius: 17px;
}

.el-card{
    border-radius: 17px;
}



a{
    text-decoration: none;
    color: #333;
}



.list{
    list-style: none;
    height: 260px;
    width: 100%;
    text-align: left;
    font-size: 14px;
    font-weight: bold;
    

}

.list li{
    width: 100%;
    height: 14%;
    line-height: 36.4px;
    padding-left: 40px;
    margin:0 0 12px 0;
    border-radius: 7px;
    
    
}

/deep/ .el-card__body{
    width: 100%;
    height: 270px;
    padding: 0;
   
}

.chart{
    position:absolute;
    right: 30px;
    width: 45%;
    height: 270px;
    bottom: 20px;
    border-radius: 17px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    
}

/deep/ .el-carousel__button{
    height: 3px;
    color: #333;
    background-color: #333;
}
</style>

