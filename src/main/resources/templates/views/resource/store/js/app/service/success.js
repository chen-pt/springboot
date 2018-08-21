/**
 * Created by Administrator on 2016/7/27.
 */

define(['core'],function (core) {
    var mod={};
    mod.neworder = function(type){
        var type = type;
        var url = core.getHost()+ "/datastatistics/get_modal_Order";
        var datas={};
        datas.type = type;
        $.post(url,datas,function(e){
            var data = JSON.parse(e);
            if(data.status) {
                $(".order_count").html(data.result.order_count);
                $(".order_amount").html(data.result.order_amount);
                $(".paid_count").html(data.result.buyer_total);
                $(".paid_amount").html(data.result.price_order);
                //1
                if (data.result.per_order_total > 0) {
                    $(".neworder_up1").removeClass('hide');
                    $(".neworder_down1").addClass('hide');
                    $(".model_neworder_1").css("color", '#ff3333').html(((data.result.per_order_total) * 100).toFixed(2) + "%");
                } else {
                    $(".neworder_down1").removeClass('hide');
                    $(".neworder_up1").addClass('hide');
                    $(".model_neworder_1").css("color", '#33cc33').html(((data.result.per_order_total) * -100).toFixed(2) + "%");
                }
                //2
                if (data.result.per_order_amount > 0) {
                    $(".neworder_up2").removeClass('hide');
                    $(".neworder_down2").addClass('hide');
                    $(".model_neworder_2").css("color", '#ff3333').html(((data.result.per_order_amount) * 100).toFixed(2) + "%");
                } else {
                    $(".neworder_down2").removeClass('hide');
                    $(".neworder_up2").addClass('hide');
                    $(".model_neworder_2").css("color", '#33cc33').html(((data.result.per_order_amount) * -100).toFixed(2) + "%");
                }
                //3
                if (data.result.per_buyer_total > 0) {
                    $(".neworder_up3").removeClass('hide');
                    $(".neworder_down3").addClass('hide');
                    $(".model_neworder_3").css("color", '#ff3333').html(((data.result.per_buyer_total) * 100).toFixed(2) + "%");
                } else {
                    $(".neworder_down3").removeClass('hide');
                    $(".neworder_up3").addClass('hide');
                    $(".model_neworder_3").css("color", '#33cc33').html(((data.result.per_buyer_total) * -100).toFixed(2) + "%");
                }
                //4
                if (data.result.per_price_order > 0) {
                    $(".neworder_up4").removeClass('hide');
                    $(".neworder_down4").addClass('hide');
                    $(".model_neworder_4").css("color", '#ff3333').html(((data.result.per_price_order) * 100).toFixed(2) + "%");
                } else {
                    $(".neworder_down4").removeClass('hide');
                    $(".neworder_up4").addClass('hide');
                    $(".model_neworder_4").css("color", '#33cc33').html(((data.result.per_price_order) * -100).toFixed(2) + "%");
                }
            }else{
                
            }

        });
    }
    //成功订单饼状图1
    mod.big_circle_one = function(){
        var type = $("#out_type").val();
        var url = core.getHost()+"/datastatistics/get_circleper";
        //var url = core.getHost()+"/admin/datastatistics/get_newOrderline";get_circlesource
        var datas={}
        datas.type=type;
        $.post(url,datas,function(data){
            var data = JSON.parse(data);
            if(data.status==true){
                var myChart = echarts.init(document.getElementById('big_circle1'));
                var option = {
                    title : {
                        text: '物流方式分布',
                        //subtext: '纯属虚构',
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: data.result.key
                    },
                    series : [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius : '55%',
                            center: ['50%', '60%'],
                            data:data.result.data,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
                myChart.setOption(option);
            }

        })


    }
    //成功订单饼状图2
    mod.big_circle_two = function(){
        var type = $("#out_type").val();
        var url = core.getHost()+"/datastatistics/get_circlesource";
        //var url = core.getHost()+"/admin/datastatistics/get_newOrderline";get_circlesource
        var datas={}
        datas.type=type;
        $.post(url,datas,function(data){
            var data = JSON.parse(data);
            if(data.status==true){
                var myChart = echarts.init(document.getElementById('big_circle2'));
                var option = {
                    title : {
                        text: '来源分布',
                        //subtext: '纯属虚构',
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data:data.result.key
                    },
                    series : [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius : '55%',
                            center: ['50%', '60%'],
                            data:data.result.data,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };

                myChart.setOption(option);
            }

        })
    }
    //成功折线图
    mod.zhexiantu2 = function(){
        var type = $("#out_type").val();
        var isnew = 1;
        var url = core.getHost()+"/datastatistics/get_modal_newOrderline";
        var datas={}
        datas.type=type;
        datas.isnew=isnew;
        $.post(url,datas,function(e){
            var data =JSON.parse(e);
            if(data.status){
                if(!data.result.date){
                    data.result.date="";
                }
                // 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(document.getElementById('zhexiantu'));
                var option = { // 指定图表的配置项和数据
                    title: {
                       
                    },
                    tooltip: {
                        //trigger: 'axis',formatter: data.result.date + ' {b0}<br/>{a0}:{c0}</br>{a1}:{c1}'
                        trigger: 'axis',formatter:function(params,ticket,callback){
                            $.post(core.getHost()+"/datastatistics/get_format_axis_name",{params:JSON.stringify(params)} ,function(content){
                                callback(ticket , content);
                            });
                            return '加载中..';
                        }
                    },

                    legend: {
                        data:['成交订单数量','成交订单金额（元）']//“图例组件。”和下面series里的name对应
                    },
                    grid: {
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
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: data.result.xAxle
                        }


                    ],
                    yAxis: [//直角坐标系 grid 中的 y 轴，单个 grid 组件最多只能放左右两个 y 轴,单个Y{}， 双y[{},{}]
                        {
                            type : 'value',
                            position : 'left',
                            name : '成交订单数量',
                            splitNumber : 5,
                            min:0,
                            max :data.result.y1Axle.max
                        },
                        {
                            type:'value',
                            position:'right',
                            name:'成交订单金额（元）',
                            splitNumber : 5,
                            min:0,
                            max :data.result.y2Axle.max
                        }
                    ],
                    series: [

                        {
                            name:'成交订单数量',
                            type:'line',
                            yAxisIndex:0,
                            //yAxisIndex:0,
                            //stack: '总量',
                            //color:'#33cc33',
                            //data:[data.data1]
                            data:data.result.data1
                        },
                        {
                            name:'成交订单金额（元）',
                            type:'line',
                            yAxisIndex:1,//表示这个 dataZoom 组件控制第二个 yAxis，如果想控制多个连续的请携程[0 ,x]
                            data:data.result.data2
                        }
                    ]

                };
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
            }

        })



    }
    return mod;
});
