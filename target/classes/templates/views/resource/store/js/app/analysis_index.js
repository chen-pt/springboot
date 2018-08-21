/**
 * Created by Administrator on 2016/7/19.
 */
/**
 * Created by 卡西 on 2016/4/7.
 */

require.config({
    paths:{
        'core':'../lovejs/core',//基本插件
        'tools':'../lovejs/tools',//基本插件
        'ana': 'service/ana',
        'out':'service/out_list',
        'model':'service/model',
        'orderdata':'service/orderdata',
        'success':'service/success'
    }
});

/**
 * 初始化
 */
$(function () {

    require(['core'], function (core) {
        //doT
        core.doTinit();
        //重写console
        core.ReConsole();

    });

    /**
     * 路由
     * @type {string}
     */
    var url =  window.location.pathname;
    switch (url)
    {
        case '/order/orderAnalysis':initAnalysis();break;//
        case '/datastatistics/order_analysis':initOrderAnalysis();break;//数据面板
        case '/datastatistics/orderdata_analysis':initOrderdataAnalysis();break;//订单统计(新增订单)
        case '/datastatistics/order_success':initOrderSuccess();break;//订单统计(成功订单)
        case '/datastatistics/member_data':initMemberData();break;//订单统计(成功订单)
    }

});
/**
 * 订单分析
 ***/
function initAnalysis(){
    require(['ana'],function(ana){
        //print.getPrintXiaopiao();
        ana.bbc();
        //实现刷新功能
        $(document).on('click','',function() {

        })

    })
}
//会员数据
function initMemberData(){
    require(['orderdata','model'],function(orderdata,model){
        if($("#out_type").val()=="4"){
            $(".type_name").css({"background-color":"white","color":"#34c360" });
            $(".type_name[value ='4']").css({"background-color":"#34c360","color":"white" });
        }else if($("#out_type").val()=="3"){
            $(".type_name").css({"background-color":"white","color":"#34c360" });
            $(".type_name[value ='3']").css({"background-color":"#34c360","color":"white" });
        }else if($("#out_type").val()=="2"){
            $(".type_name").css({"background-color":"white","color":"#34c360" });
            $(".type_name[value ='2']").css({"background-color":"#34c360","color":"white" });
        }else{
            $(".type_name").css({"background-color":"white","color":"#34c360" });
            $(".type_name[value ='1']").css({"background-color":"#34c360","color":"white" });
        }
        orderdata.memberi_zhexianbiao($("#out_type").val());
        model.Member_TOP($("#out_type").val());//顶部数据
        model.Member_list($("#out_type").val());//会员列表
        $(".type_name").unbind('click').bind('click',function() {
            var type = $(this).val();
            $("#out_type").val(type);
            $(".type_name").css({
                "background-color": "white",
                "color": "#34c360"
            });
            model.Member_TOP(type);//顶部数据
            model.Member_list(type);//会员列表
            $(this).css({
                "color": "white",
                "background-color": "#34c360"
            });
            if (type == "3") {
                $(".timeswitch").html("较前一周");
            }
            else if (type == "4") {
                $(".timeswitch").html("较前一月");
            } else {
                $(".timeswitch").html("较前一天");
            }
            orderdata.memberi_zhexianbiao();
        })

    })
    outdata_listevent();self_shell();
}
//新增订单页面
function initOrderdataAnalysis(){
    require(['orderdata'],function(orderdata){
        if($("#out_type").val()=="4"){
            $(".type_name").css({"background-color":"white","color":"#34c360" });
            $(".type_name[value ='4']").css({"background-color":"#34c360","color":"white" });
        }else if($("#out_type").val()=="3"){
            $(".type_name").css({"background-color":"white","color":"#34c360" });
            $(".type_name[value ='3']").css({"background-color":"#34c360","color":"white" });
        }else if($("#out_type").val()=="2"){
            $(".type_name").css({"background-color":"white","color":"#34c360" });
            $(".type_name[value ='2']").css({"background-color":"#34c360","color":"white" });
        }else{
            $(".type_name").css({"background-color":"white","color":"#34c360" });
            $(".type_name[value ='1']").css({"background-color":"#34c360","color":"white" });
        }
        orderdata.newOrder($("#out_type").val());
        orderdata.zhexianbiao($("#out_type").val());

        $(".type_name").unbind('click').bind('click',function() {
            var type = $(this).val();
            $("#out_type").val(type);
            $(".type_name").css({
                "background-color": "white",
                "color": "#34c360"
            });
            $(this).css({
                "color": "white",
                "background-color": "#34c360"
            });
            if (type == "3") {
                $(".timeswitch").html("较前一周");
            }
            else if (type == "4") {
                $(".timeswitch").html("较前一月");
            } else {
                $(".timeswitch").html("较前一天");
            }
            orderdata.newOrder(type);
            orderdata.zhexianbiao();
        })



    });
    outdata_listevent();self_shell();
}
//成交订单页面
function initOrderSuccess(){
    require(['success'],function(success){
        if($("#out_type").val()=="4"){
            $(".type_name").css({"background-color":"white","color":"#34c360" });
            $(".type_name[value ='4']").css({"background-color":"#34c360","color":"white" });
        }else if($("#out_type").val()=="3"){
            $(".type_name").css({"background-color":"white","color":"#34c360" });
            $(".type_name[value ='3']").css({"background-color":"#34c360","color":"white" });
        }else if($("#out_type").val()=="2"){
            $(".type_name").css({"background-color":"white","color":"#34c360" });
            $(".type_name[value ='2']").css({"background-color":"#34c360","color":"white" });
        }else{
            $(".type_name").css({"background-color":"white","color":"#34c360" });
            $(".type_name[value ='1']").css({"background-color":"#34c360","color":"white" });
        }
        success.neworder($("#out_type").val());
        success.big_circle_one($("#out_type").val());
        success.big_circle_two($("#out_type").val());
        success.zhexiantu2($("#out_type").val());
        $(".type_name").unbind('click').bind('click',function() {
            var type = $(this).val();
            $("#out_type").val(type);
            $(".type_name").css({
                "background-color": "white",
                "color": "#34c360"
            });
            $(this).css({
                "color": "white",
                "background-color": "#34c360"
            });
            success.zhexiantu2()
            success.big_circle_one();
            success.big_circle_two();
            if (type == "3") {
                $(".timeswitch").html("较前一周");
            }
            else if (type == "4") {
                $(".timeswitch").html("较前一月");
            } else {
                $(".timeswitch").html("较前一天");
            }
            success.neworder(type);
        })

    })
    outdata_listevent();
    self_shell();

}
/**
 * 数据面板
 */
function initOrderAnalysis(){
    require(['model'],function(model){
        var clicked=1;
        if($("#out_type").val()=="4"){
            $(".type_name").css({"background-color":"white","color":"#34c360" });
            $(".type_name[value ='4']").css({"background-color":"#34c360","color":"white" });
        }else if($("#out_type").val()=="3"){
            $(".type_name").css({"background-color":"white","color":"#34c360" });
            $(".type_name[value ='3']").css({"background-color":"#34c360","color":"white" });
        }else if($("#out_type").val()=="2"){
            $(".type_name").css({"background-color":"white","color":"#34c360" });
            $(".type_name[value ='2']").css({"background-color":"#34c360","color":"white" });
        }else{
            $(".type_name").css({"background-color":"white","color":"#34c360" });
            $(".type_name[value ='1']").css({"background-color":"#34c360","color":"white" });
        }
        model.model_one($("#out_type").val());
        model.model_two($("#out_type").val());
        model.model_three($("#out_type").val());
        model.model_four($("#out_type").val());
        model.model_five($("#out_type").val());
        model.model_six($("#out_type").val());
        model.model_seven($("#out_type").val(),clicked);
        model.model_eight($("#out_type").val(),clicked);

        
        //实现切换时间后，小面板刷新功能


        //$(document).on("click",".type_name",function(){
        //使用unbind函数去除重复执行
            $(".type_name").unbind('click').bind('click',function(){
                clicked=1;
            var type = $(this).val();
                $("#out_type").val(type);
                $(".type_name").css({
                    "background-color":"white",
                    "color":"#34c360"
                });
                $(this).css({
                    "color":"white",
                    "background-color":"#34c360"
                });
            if(type=="3"){
                $(".timeswitch").html("较前一周");
            }
            else if(type=="4"){
                $(".timeswitch").html("较前一月");
            }else{
                $(".timeswitch").html("较前一天");
            }
            model.model_one(type);
            model.model_two(type);
            model.model_three(type);
            model.model_four(type);
            model.model_five(type);
            model.model_six(type);
            model.model_seven(type,clicked);
            model.model_eight(type,clicked);
            //$(document).on("click",".type_number",function(){
                //使用unbind函数去除重复执行
                $(".type_number").unbind('click').bind('click',function(){
                    var number = $(this).val();
                    clicked=1;
                    if(number==1){
                        model.model_one(type);
                    }
                    if(number==2){
                        model.model_two(type);
                    }
                    if(number==3){
                        model.model_three(type);
                    }
                    if(number==4){
                        model.model_four(type);
                    }
                    if(number==5){
                        model.model_five(type);
                    }
                    if(number==6){
                        model.model_six(type);
                    }
                    if(number==7){
                        model.model_seven(type,clicked);
                    }
                    if(number==8){
                        model.model_eight(type,clicked);
                    }
                
                })

                $("#xiala1").unbind('click').bind('click',function(){
                    clicked=5;
                    model.model_seven(type,clicked);

                 })
                $("#xiala2").unbind('click').bind('click',function(){
                    clicked=5;
                    model.model_eight(type,clicked);
                })

        })

        //小面板单独刷新

           // $(document).on("click", ".type_number", function () {
            //使用unbind函数去除重复执行
            $(".type_number").unbind('click').bind('click',function(){
                var number = $(this).val();
                clicked=1;

                if (number == 1) {
                    $("#loadhelp1").show();
                    model.model_one($("#out_type").val());
                }
                if (number == 2) {
                    model.model_two($("#out_type").val());
                }
                if (number == 3) {
                    model.model_three($("#out_type").val());
                }
                if (number == 4) {
                    model.model_four($("#out_type").val());
                }
                if (number == 5) {
                    model.model_five($("#out_type").val());
                }
                if (number == 6) {
                    model.model_six($("#out_type").val());
                }
                if (number == 7) {
                    model.model_seven($("#out_type").val(),clicked);
                }
                if (number == 8) {
                    model.model_eight($("#out_type").val(),clicked);
                }

            })
        $("#xiala1").unbind('click').bind('click',function(){
            clicked=5;
            model.model_seven($("#out_type").val(),clicked);
        })
        $("#xiala2").unbind('click').bind('click',function(){
            clicked=5;
            model.model_eight($("#out_type").val(),clicked);
        })
       

    });
    outdata_listevent();
    self_shell();
}

/*******数据面板导出报表************/
function outdata_listevent(){
    require(['out'],function(out){
        //数据面板
        $(document).on('click','#search_report1',function(){
            out.datamodalout();
        })
        //新增订单
        $(document).on('click',"#search_report2",function(){
            out.new_orderout();
        })
        //完成订单
        $(document).on('click',"#search_report3",function(){
            out.success_orderout();
        });
        //会员数据
        $(document).on('click',"#search_report4",function(){
            out.member_out();

        })

    })
}

/*================自动运行（10分钟）==================*/
function self_shell(){
    setInterval("self_shell_type()",10*60*1000);
}
function self_shell_type(){
    require(['model',"orderdata","success"],function(model,orderdata,success){
        if($("#modal_type").val()=="data_modal"){//
            var r_value = $("#out_type").val();
            var clicked=1;
            model.model_one(r_value);
            model.model_two(r_value);
            model.model_three(r_value);
            model.model_four(r_value);
            model.model_five(r_value);
            model.model_six(r_value);
            model.model_seven(r_value,clicked);
            model.model_eight(r_value,clicked);
        } else if($("#modal_type").val()=="data_analysis_new"){
            var top_type=$("#out_type").val();
            orderdata.newOrder(top_type);
            orderdata.zhexianbiao();
        }else if($("#modal_type").val()=="data_analysis_successed"){

            var top_type =$("#out_type").val();
            success.zhexiantu2()
            success.big_circle_one();
            success.big_circle_two();
            success.neworder(top_type);
        } else if($("#modal_type").val()=="data_analysis_member"){
            var member_top_type =  $("#out_type").val();
            model.Member_TOP(member_top_type);//顶部数据
            model.Member_list(member_top_type);//会员列表
            orderdata.memberi_zhexianbiao();
        }

    })
}
