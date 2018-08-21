/**
 * Created by Administrator on 2016/7/26.
 */
define(['core'],function (core) {
    var mod={};
    mod.newOrder = function(type) {
        var type = type;
        var url = core.getHost() + "/datastatistics/get_modal_newOrder";
        var datas = {};
        datas.type = type;
        $.post(url, datas, function (e) {
            var data = JSON.parse(e);
            if (data.status) {//判断data是否有数据
                $(".order_count").html(data.result.order_count);
                $(".order_amount").html(data.result.order_amount);
                $(".paid_count").html(data.result.paid_count);
                $(".paid_amount").html(data.result.paid_amount);
                $(".pending_count").html(data.result.pending_count);
                $(".pending_amount").html(data.result.pending_amount);
                //1
                if (data.result.order_count_with_before > 0) {
                    $(".newOrder_up1").removeClass('hide');
                    $(".newOrder_down1").addClass('hide');
                    $(".model_newOrder_1").css("color", '#ff3333').html(((data.result.order_count_with_before) * 100).toFixed(2) + "%");
                } else {
                    $(".newOrder_down1").removeClass('hide');
                    $(".newOrder_up1").addClass('hide');
                    $(".model_newOrder_1").css("color", '#33cc33').html(((data.result.order_count_with_before) * -100).toFixed(2) + "%");
                }
                //2
                if (data.result.order_amount_with_before > 0) {
                    $(".newOrder_up2").removeClass('hide');
                    $(".newOrder_down2").addClass('hide');
                    $(".model_newOrder_2").css("color", '#ff3333').html(((data.result.order_amount_with_before) * 100).toFixed(2) + "%");
                } else {
                    $(".newOrder_down2").removeClass('hide');
                    $(".newOrder_up2").addClass('hide');
                    $(".model_newOrder_2").css("color", '#33cc33').html(((data.result.order_amount_with_before) * -100).toFixed(2) + "%");
                }
                //3
                if (data.result.paid_count_with_before > 0) {
                    $(".newOrder_up3").removeClass('hide');
                    $(".newOrder_down3").addClass('hide');
                    $(".model_newOrder_3").css("color", '#ff3333').html(((data.result.paid_count_with_before) * 100).toFixed(2) + "%");
                } else {
                    $(".newOrder_down3").removeClass('hide');
                    $(".newOrder_up3").addClass('hide');
                    $(".model_newOrder_3").css("color", '#33cc33').html(((data.result.paid_count_with_before) * -100).toFixed(2) + "%");
                }
                //4
                if (data.result.paid_amount_with_before > 0) {
                    $(".newOrder_up4").removeClass('hide');
                    $(".newOrder_down4").addClass('hide');
                    $(".model_newOrder_4").css("color", '#ff3333').html(((data.result.paid_amount_with_before) * 100).toFixed(2) + "%");
                } else {
                    $(".newOrder_down4").removeClass('hide');
                    $(".newOrder_up4").addClass('hide');
                    $(".model_newOrder_4").css("color", '#33cc33').html(((data.result.paid_amount_with_before) * -100).toFixed(2) + "%");
                }
                //5
                if (data.result.pending_count_with_before > 0) {
                    $(".newOrder_up5").removeClass('hide');
                    $(".newOrder_down5").addClass('hide');
                    $(".model_newOrder_5").css("color", '#ff3333').html(((data.result.pending_count_with_before) * 100).toFixed(2) + "%");
                } else {
                    $(".newOrder_down5").removeClass('hide');
                    $(".newOrder_up5").addClass('hide');
                    $(".model_newOrder_5").css("color", '#33cc33').html(((data.result.pending_count_with_before) * -100).toFixed(2) + "%");
                }
                //6
                if (data.result.pending_amount_with_before > 0) {
                    $(".newOrder_up6").removeClass('hide');
                    $(".newOrder_down6").addClass('hide');
                    $(".model_newOrder_6").css("color", '#ff3333').html(((data.result.pending_amount_with_before) * 100).toFixed(2) + "%");
                } else {
                    $(".newOrder_down6").removeClass('hide');
                    $(".newOrder_up6").addClass('hide');
                    $(".model_newOrder_6").css("color", '#33cc33').html(((data.result.pending_amount_with_before) * -100).toFixed(2) + "%");
                }
            }else{

            }

        });
    }
        //折线图
    mod.zhexianbiao = function(){
        var type = $("#out_type").val();
        var url = core.getHost()+"/datastatistics/get_modal_newOrderline";
        var datas={}
        datas.type=type;
        $.post(url,datas,function(e){
            var data =JSON.parse(e);
                if (data.status) {
                    if(data.result) {
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
                            data: ['新增订单数量', '新增订单金额（元）'],//“图例组件。”和下面series里的name对应
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
                                type: 'value',
                                position: 'left',
                                name: '新增订单数量',
                                splitNumber: 5,
                                min: 0,
                                max: data.result.y1Axle.max
                            },
                            {
                                type: 'value',
                                position: 'right',
                                name: '新增订单金额（元）',
                                splitNumber: 5,
                                min: 0,
                                max: data.result.y2Axle.max
                            }
                        ],
                        series: [

                            {
                                name: '新增订单数量',
                                type: 'line',
                                yAxisIndex: 0,
                                //yAxisIndex:0,
                                //stack: '总量',
                                //color:'#33cc33',
                                //data:[data.data1]
                                data: data.result.data1
                            },
                            {
                                name: '新增订单金额（元）',
                                type: 'line',
                                yAxisIndex: 1,//表示这个 dataZoom 组件控制第二个 yAxis，如果想控制多个连续的请携程[0 ,x]
                                data: data.result.data2
                            }
                        ]

                    };
                    // 使用刚指定的配置项和数据显示图表。
                    myChart.setOption(option);
                    }
            }
        })

    }
    //会员列表折线图
    mod.memberi_zhexianbiao =function(){
        var type = $("#out_type").val();
        var url = core.getHost()+"/datastatistics/getMemberLine";
        var datas={}
        datas.type=type;
        $.post(url,datas,function(e){
            var data =JSON.parse(e);
            if (data.status) {
                if(data.result) {
                    if(!data.result.date){
                        data.result.date="";
                    }
                    // 基于准备好的dom，初始化echarts实例
                    $("#member_zhexian").empty().css({"height":"500px","width":"1100px"});
                    var myChart = echarts.init(document.getElementById('member_zhexian'));
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
                            data: ['会员数量', '新增会员成交数量'],//“图例组件。”和下面series里的name对应
                            x: '70%'
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
                                type: 'value',
                                position: 'left',
                                name: '会员数量',
                                splitNumber: 5,
                                min: 0,
                                max: data.result.y1Axle.max
                            },
                            {
                                type: 'value',
                                position: 'right',
                                name: '新增会员成交数量',
                                splitNumber: 5,
                                min: 0,
                                max: data.result.y2Axle.max
                            }
                        ],
                        series: [

                            {
                                name: '会员数量',
                                type: 'line',
                                yAxisIndex: 0,
                                //yAxisIndex:0,
                                //stack: '总量',
                                //color:'#33cc33',
                                //data:[data.data1]
                                data: data.result.data1
                            },
                            {
                                name: '新增会员成交数量',
                                type: 'line',
                                yAxisIndex: 1,//表示这个 dataZoom 组件控制第二个 yAxis，如果想控制多个连续的请携程[0 ,x]
                                data: data.result.data2
                            }
                        ]

                    };
                    // 使用刚指定的配置项和数据显示图表。
                    myChart.setOption(option);
                }else{
                    $("#member_zhexian").empty().css({"height":"50px","width":"1100px"});
                }
            }
        })
    }
    return mod;
});
