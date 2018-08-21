/**
 * Created by Administrator on 2016/7/19.
 */
define(['core'],function (core) {
     var mod ={};

    mod.bbc = function(){
        
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('echarts'));

        // 指定图表的配置项和数据
        option = {
            title: {
                text: '订单分析'
            },
            tooltip: { //提示框组件  item：数据项图形出发  axis：坐标触发
                trigger: 'axis'
            },
            legend: {  //图例组件
                data:['新增订单笔数','新增订单金额']
            },

            grid: {  //直角坐标系内绘图网格，单个 grid 内最多可以放置上下两个 X 轴，左右两个 Y 轴
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },

            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['2016-07-13','2016-07-14','2016-07-15','2016-07-16','2016-07-17','2016-07-18','2016-07-19']
            },

            yAxis: [//直角坐标系 grid 中的 y 轴，单个 grid 组件最多只能放左右两个 y 轴,单个Y{}， 双y[{},{}]
                {
                    type : 'value',
                    position : 'left',
                    name : '订单数量',
                    splitNumber : 5,
                    min:0,
                    max : 10000
                },
                {
                    type:'value',
                    position:'right',
                    name:'订单金额',
                    splitNumber : 5,
                    min:0,
                    max : 500000
                }
            ],

            series: [
                {
                    name:'新增订单笔数',
                    type:'line',
                    stack: '总量',
                    data:[1200, 1320, 1010, 1340, 900, 2300, 2100]
                },
                {
                    name:'新增订单金额',
                    type:'line',
                    stack: '总量',
                    data:[1500, 2300, 2010, 1504, 1900, 3003, 4100]
                }
            ]
        };


        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);



    }




    return mod;
})