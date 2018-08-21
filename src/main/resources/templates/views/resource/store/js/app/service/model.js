/**
 * Created by dawang on 2016/7/19.
 */

define(['core'],function (core) {
    var mod ={};
    //小面板1
    mod.model_one=function (type) {
        var type = type;
        var url = core.getHost()+ "/datastatistics/get_modal_data";
        $("#loadhelp1").show(); 
        var datas={};
        datas.type = type;
        $.post(url,datas,function(e){
            var data = JSON.parse(e);
            if(data.status) {
                $(".new_order_num").html(data.result.total);
                if (data.result.per_total > 0) {
                    $(".one_up").removeClass('hide');
                    $(".one_down").addClass('hide');
                    $(".model_one_1").css("color", '#ff3333').html(((data.result.per_total) * 100).toFixed(2) + "%");
                } else {
                    $(".one_down").removeClass('hide');
                    $(".one_up").addClass('hide');
                    $(".model_one_1").css("color", '#33cc33').html(((data.result.per_total) * -100).toFixed(2) + "%");
                }
                $(".modal_one_money").html(data.result.amount);
                if (data.result.per_amount > 0) {
                    $(".one_up2").removeClass('hide');
                    $(".one_down2").addClass('hide');
                    $(".model_one_2").css("color", '#ff3333').html(((data.result.per_amount) * 100).toFixed(2) + "%");
                } else {
                    $(".one_down2").removeClass('hide');
                    $(".one_up2").addClass('hide');
                    $(".model_one_2").css("color", '#33cc33').html(((data.result.per_amount) * -100).toFixed(2) + "%");
                }

                $(".modal_one_per").html(data.result.person_per_amount);
                if (data.result.per_person > 0) {
                    $(".one_up3").removeClass('hide');
                    $(".one_down3").addClass('hide');
                    $(".model_one_3").css("color", '#ff3333').html(((data.result.per_person) * 100).toFixed(2) + "%");
                } else {
                    $(".one_down3").removeClass('hide');
                    $(".one_up3").addClass('hide');
                    $(".model_one_3").css("color", '#33cc33').html(((data.result.per_person) * -100).toFixed(2) + "%");
                }
                $("#loadhelp1").hide();
            }else{
                
            }

        });
    }
    //小面板2
    mod.model_two=function (type) {
        var type = type;
        var url = core.getHost()+ "/datastatistics/get_modal_dataTwo";
        $("#loadhelp2").show();
        var datas={};
        datas.type = type;
        $.post(url,datas,function(e){
            var data = JSON.parse(e);//解析json
            if(data.status) {
                $(".paid_order_amount").html(data.result.pay_order);
                $(".paid_order_amount_money").html(data.result.pay_order_amount);
                $(".waiting_pay_order_amount").html(data.result.wait_pay_order);
                $(".waiting_pay_order_amount_money").html(data.result.wait_pay_order_amount);
                $(".canceled_order_amount").html(data.result.cancel_pay_order);
                $(".canceled_order_amount_money").html(data.result.cancel_pay_order_amount);
                if (data.result.per_pay_order > 0) {
                    $(".two_up1").removeClass('hide');
                    $(".two_down1").addClass('hide');
                    $(".model_two_1").css("color", '#ff3333').html(((data.result.per_pay_order) * 100).toFixed(2) + "%");
                } else {
                    $(".two_up1").addClass('hide');
                    $(".two_down1").removeClass('hide');
                    $(".model_two_1").css("color", '#33cc33').html(((data.result.per_pay_order) * -100).toFixed(2) + "%");
                }
                if (data.result.per_pay_order_amount > 0) {
                    $(".two_up2").removeClass('hide');
                    $(".two_down2").addClass('hide');
                    $(".model_two_2").css("color", '#ff3333').html(((data.result.per_pay_order_amount) * 100).toFixed(2) + "%");
                } else {
                    $(".two_up2").addClass('hide');
                    $(".two_down2").removeClass('hide');
                    $(".model_two_2").css("color", '#33cc33').html(((data.result.per_pay_order_amount) * -100).toFixed(2) + "%");
                }
                if (data.result.per_wait_pay_order > 0) {
                    $(".two_up3").removeClass('hide');
                    $(".two_down3").addClass('hide');
                    $(".model_two_3").css("color", '#ff3333').html(((data.result.per_wait_pay_order) * 100).toFixed(2) + "%");
                } else {
                    $(".two_up3").addClass('hide');
                    $(".two_down3").removeClass('hide');
                    $(".model_two_3").css("color", '#33cc33').html(((data.result.per_wait_pay_order) * -100).toFixed(2) + "%");
                }
                if (data.result.per_wait_pay_order_amount > 0) {
                    $(".two_up4").removeClass('hide');
                    $(".two_down4").addClass('hide');
                    $(".model_two_4").css("color", '#ff3333').html(((data.result.per_wait_pay_order_amount) * 100).toFixed(2) + "%");
                } else {
                    $(".two_up4").addClass('hide');
                    $(".two_down4").removeClass('hide');
                    $(".model_two_4").css("color", '#33cc33').html(((data.result.per_wait_pay_order_amount) * -100).toFixed(2) + "%");
                }
                if (data.result.per_cancel_pay_order > 0) {
                    $(".two_up5").removeClass('hide');
                    $(".two_down5").addClass('hide');
                    $(".model_two_5").css("color", '#ff3333').html(((data.result.per_cancel_pay_order) * 100).toFixed(2) + "%");
                } else {
                    $(".two_up5").addClass('hide');
                    $(".two_down5").removeClass('hide');
                    $(".model_two_5").css("color", '#33cc33').html(((data.result.per_cancel_pay_order) * -100).toFixed(2) + "%");
                }
                if (data.result.per_cancel_pay_order_amount > 0) {
                    $(".two_up6").removeClass('hide');
                    $(".two_down6").addClass('hide');
                    $(".model_two_6").css("color", '#ff3333').html(((data.result.per_cancel_pay_order_amount) * 100).toFixed(2) + "%");
                } else {
                    $(".two_up6").addClass('hide');
                    $(".two_down6").removeClass('hide');
                    $(".model_two_6").css("color", '#33cc33').html(((data.result.per_cancel_pay_order_amount) * -100).toFixed(2) + "%");
                }
                $("#loadhelp2").hide();
            }else{

            }
        });
    }
    //小面板3
    mod.model_three=function (type) {
        var type = type;
        var url = core.getHost()+ "/datastatistics/get_modal_dataThree";
        $("#loadhelp3").show();
        var datas={};
        datas.type = type;
        $.post(url,datas,function(e){
            var data = JSON.parse(e);//解析json
            if(data.status) {
                $(".refund_order_amount").html(data.result.refund_order);
                $(".refund_order_amount_money").html(data.result.refund_order_amount)
                $(".refund_ok_order_amount").html(data.result.refund_ok_order);
                $(".refund_ok_order_amount_money").html(data.result.refund_ok_order_amount)
                $(".refuse_refund_order_amount").html(data.result.refuse_refund_order);
                $(".refuse_refund_order_amount_money").html(data.result.refuse_refund_order_amount);
                if (data.result.per_refund_order > 0) {
                    $(".three_up1").removeClass('hide');
                    $(".three_down1").addClass('hide');
                    $(".model_three_1").css("color", '#ff3333').html(((data.result.per_refund_order) * 100).toFixed(2) + "%");
                } else {
                    $(".three_up1").addClass('hide');
                    $(".three_down1").removeClass('hide');
                    $(".model_three_1").css("color", '#33cc33').html(((data.result.per_refund_order) * (-100)).toFixed(2) + "%");
                }
                if (data.result.per_refund_order_amount > 0) {
                    $(".three_up2").removeClass('hide');
                    $(".three_down2").addClass('hide');
                    $(".model_three_2").css("color", '#ff3333').html(((data.result.per_refund_order_amount) * 100).toFixed(2) + "%");
                } else {
                    $(".three_up2").addClass('hide');
                    $(".three_down2").removeClass('hide');
                    $(".model_three_2").css("color", '#33cc33').html(((data.result.per_refund_order_amount) * (-100)).toFixed(2) + "%");
                }

                if (data.result.per_refund_ok_order > 0) {
                    $(".three_up3").removeClass('hide');
                    $(".three_down3").addClass('hide');
                    $(".model_three_3").css("color", '#ff3333').html(((data.result.per_refund_ok_order) * 100).toFixed(2) + "%");
                } else {
                    $(".three_up3").addClass('hide');
                    $(".three_down3").removeClass('hide');
                    $(".model_three_3").css("color", '#33cc33').html(((data.result.per_refund_ok_order) * (-100)).toFixed(2) + "%");
                }
                if (data.result.per_refund_ok_order_amount > 0) {
                    $(".three_up4").removeClass('hide');
                    $(".three_down4").addClass('hide');
                    $(".model_three_4").css("color", '#ff3333').html(((data.result.per_refund_ok_order_amount) * 100).toFixed(2) + "%");
                } else {
                    $(".three_up4").addClass('hide');
                    $(".three_down4").removeClass('hide');
                    $(".model_three_4").css("color", '#33cc33').html(((data.result.per_refund_ok_order_amount) * (-100)).toFixed(2) + "%");
                }
                if (data.result.per_refuse_refund_order > 0) {
                    $(".three_up5").removeClass('hide');
                    $(".three_down5").addClass('hide');
                    $(".model_three_5").css("color", '#ff3333').html(((data.result.per_refuse_refund_order) * 100).toFixed(2) + "%");
                } else {
                    $(".three_up5").addClass('hide');
                    $(".three_down5").removeClass('hide');
                    $(".model_three_5").css("color", '#33cc33').html(((data.result.per_refuse_refund_order) * (-100)).toFixed(2) + "%");
                }
                if (data.result.per_refuse_refund_order_amount > 0) {
                    $(".three_up6").removeClass('hide');
                    $(".three_down6").addClass('hide');
                    $(".model_three_6").css("color", '#ff3333').html(((data.result.per_refuse_refund_order_amount) * 100).toFixed(2) + "%");
                } else {
                    $(".three_up6").addClass('hide');
                    $(".three_down6").removeClass('hide');
                    $(".model_three_6").css("color", '#33cc33').html(((data.result.per_refuse_refund_order_amount) * (-100)).toFixed(2) + "%");
                }
                $("#loadhelp3").hide();
            }else{

            }
        });
    }
    //小面板4
    mod.model_four=function (type) {
        var type = type;
        var url = core.getHost()+ "/datastatistics/get_modal_dataFour";
        $("#loadhelp4").show();
        var datas={};
        datas.type = type;
        $.post(url,datas,function(e){
            var data = JSON.parse(e);//解析json
            if(data.status) {
                $(".pickup_order_amount").html(data.result.pickup_order);
                $(".pickup_order_amount_money").html(data.result.pickup_order_amount)
                $(".delivery_order_amount").html(data.result.delivery_order);
                $(".delivery_order_amount_money").html(data.result.delivery_order_amount)
                $(".courier_order_amount").html(data.result.courier_order);
                $(".courier_order_amount_money").html(data.result.courier_order_amount);
                if (data.result.per_pickup_order > 0) {
                    $(".four_up1").removeClass('hide');
                    $(".four_down1").addClass('hide');
                    $(".model_four_1").css("color", '#ff3333').html(((data.result.per_pickup_order) * 100).toFixed(2) + "%");
                } else {
                    $(".four_up1").addClass('hide');
                    $(".four_down1").removeClass('hide');
                    $(".model_four_1").css("color", '#33cc33').html(((data.result.per_pickup_order) * (-100)).toFixed(2) + "%");
                }
                if (data.result.per_pickup_order_amount > 0) {
                    $(".four_up2").removeClass('hide');
                    $(".four_down2").addClass('hide');
                    $(".model_four_2").css("color", '#ff3333').html(((data.result.per_pickup_order_amount) * 100).toFixed(2) + "%");
                } else {
                    $(".four_up2").addClass('hide');
                    $(".four_down2").removeClass('hide');
                    $(".model_four_2").css("color", '#33cc33').html(((data.result.per_pickup_order_amount) * (-100)).toFixed(2) + "%");
                }

                if (data.result.per_delivery_order > 0) {
                    $(".four_up3").removeClass('hide');
                    $(".four_down3").addClass('hide');
                    $(".model_four_3").css("color", '#ff3333').html(((data.result.per_delivery_order) * 100).toFixed(2) + "%");
                } else {
                    $(".four_up3").addClass('hide');
                    $(".four_down3").removeClass('hide');
                    $(".model_four_3").css("color", '#33cc33').html(((data.result.per_delivery_order) * (-100)).toFixed(2) + "%");
                }
                if (data.result.per_delivery_order_amount > 0) {
                    $(".four_up4").removeClass('hide');
                    $(".four_down4").addClass('hide');
                    $(".model_four_4").css("color", '#ff3333').html(((data.result.per_delivery_order_amount) * 100).toFixed(2) + "%");
                } else {
                    $(".four_up4").addClass('hide');
                    $(".four_down4").removeClass('hide');
                    $(".model_four_4").css("color", '#33cc33').html(((data.result.per_delivery_order_amount) * (-100)).toFixed(2) + "%");
                }
                if (data.result.per_courier_order > 0) {
                    $(".four_up5").removeClass('hide');
                    $(".four_down5").addClass('hide');
                    $(".model_four_5").css("color", '#ff3333').html(((data.result.per_courier_order) * 100).toFixed(2) + "%");
                } else {
                    $(".four_up5").addClass('hide');
                    $(".four_down5").removeClass('hide');
                    $(".model_four_5").css("color", '#33cc33').html(((data.result.per_courier_order) * (-100)).toFixed(2) + "%");
                }
                if (data.result.per_courier_order_amount > 0) {
                    $(".four_up6").removeClass('hide');
                    $(".four_down6").addClass('hide');
                    $(".model_four_6").css("color", '#ff3333').html(((data.result.per_courier_order_amount) * 100).toFixed(2) + "%");
                } else {
                    $(".four_up6").addClass('hide');
                    $(".four_down6").removeClass('hide');
                    $(".model_four_6").css("color", '#33cc33').html(((data.result.per_courier_order_amount) * (-100)).toFixed(2) + "%");
                }
                $("#loadhelp4").hide();
            }else{

            }
        });
    }
    //小面板5
    mod.model_five=function (type) {
        var type = type;
        var url = core.getHost()+ "/datastatistics/get_modal_dataFive";
        $("#loadhelp5").show();
        var datas={};
        datas.type = type;
        $.post(url,datas,function(e){
            var data = JSON.parse(e);//解析json
            if(data.status) {
                $(".weinxin_order_amount").html(data.result.weixin_order);
                $(".weixin_order_amount_money").html(data.result.weixin_order_amount);
                $(".assistant_order_amount").html(data.result.assistant_order);
                $(".assistant_order_amount_money").html(data.result.assistant_order_amount);
                $(".shop_order_amount").html(data.result.shop_order);
                $(".shop_order_amount_money").html(data.result.shop_order_amount);
                if (data.result.per_weixin_order > 0) {
                    $(".five_up1").removeClass('hide');
                    $(".five_down1").addClass('hide');
                    $(".model_five_1").css("color", '#ff3333').html(((data.result.per_weixin_order) * 100).toFixed(2) + "%");
                } else {
                    $(".five_up1").addClass('hide');
                    $(".five_down1").removeClass('hide');
                    $(".model_five_1").css("color", '#33cc33').html(((data.result.per_weixin_order) * -100).toFixed(2) + "%");
                }
                if (data.result.per_weixin_order_amount > 0) {
                    $(".five_up2").removeClass('hide');
                    $(".five_down2").addClass('hide');
                    $(".model_five_2").css("color", '#ff3333').html(((data.result.per_weixin_order_amount) * 100).toFixed(2) + "%");
                } else {
                    $(".five_up2").addClass('hide');
                    $(".five_down2").removeClass('hide');
                    $(".model_five_2").css("color", '#33cc33').html(((data.result.per_weixin_order_amount) * -100).toFixed(2) + "%");
                }
                if (data.result.per_assistant_order > 0) {
                    $(".five_up3").removeClass('hide');
                    $(".five_down3").addClass('hide');
                    $(".model_five_3").css("color", '#ff3333').html(((data.result.per_assistant_order) * 100).toFixed(2) + "%");
                } else {
                    $(".five_up3").addClass('hide');
                    $(".five_down3").removeClass('hide');
                    $(".model_five_3").css("color", '#33cc33').html(((data.result.per_assistant_order) * -100).toFixed(2) + "%");
                }
                if (data.result.per_assistant_order_amount > 0) {
                    $(".five_up4").removeClass('hide');
                    $(".five_down4").addClass('hide');
                    $(".model_five_4").css("color", '#ff3333').html(((data.result.per_assistant_order_amount) * 100).toFixed(2) + "%");
                } else {
                    $(".five_up4").addClass('hide');
                    $(".five_down4").removeClass('hide');
                    $(".model_five_4").css("color", '#33cc33').html(((data.result.per_assistant_order_amount) * -100).toFixed(2) + "%");
                }
                if (data.result.per_shop_order > 0) {
                    $(".five_up5").removeClass('hide');
                    $(".five_down5").addClass('hide');
                    $(".model_five_5").css("color", '#ff3333').html(((data.result.per_shop_order) * 100).toFixed(2) + "%");
                } else {
                    $(".five_up5").addClass('hide');
                    $(".five_down5").removeClass('hide');
                    $(".model_five_5").css("color", '#33cc33').html(((data.result.per_shop_order) * -100).toFixed(2) + "%");
                }
                if (data.result.per_shop_order_amount > 0) {
                    $(".five_up6").removeClass('hide');
                    $(".five_down6").addClass('hide');
                    $(".model_five_6").css("color", '#ff3333').html(((data.result.per_shop_order_amount) * 100).toFixed(2) + "%");
                } else {
                    $(".five_up6").addClass('hide');
                    $(".five_down6").removeClass('hide');
                    $(".model_five_6").css("color", '#33cc33').html(((data.result.per_shop_order_amount) * -100).toFixed(2) + "%");
                }
                $("#loadhelp5").hide();
            } else{

            }
        });
    }
    //小面板6
    mod.model_six=function (type) {
        //var type = $("#type").val();//取当天数据
        var type = type;//取4天的数据
        var url = core.getHost()+ "/datastatistics/get_modal_dataSix";
        $("#loadhelp6").show();
        var datas={};
        datas.type = type;
        $.post(url,datas,function(e){
            var data = JSON.parse(e);//解析json
        if(data.status) {
            $(".store_total_amount").html(data.result.store_total);
            $(".store_rank_number").html(data.result.store_rank);
            $(".store_order_amount_money").html(data.result.store_order_amount);
            if (data.result.per_store_total > 0) {
                $(".six_up1").removeClass('hide');
                $(".six_down1").addClass('hide');
                $(".model_six_1").css("color", '#ff3333').html(((data.result.per_store_total) * 100).toFixed(2) + "%");
            } else {
                $(".six_up1").addClass('hide');
                $(".six_down1").removeClass('hide');
                $(".model_six_1").css("color", '#33cc33').html(((data.result.per_store_total) * -100).toFixed(2) + "%");
            }
            if (data.result.per_store_order_amount > 0) {
                $(".six_up2").removeClass('hide');
                $(".six_down2").addClass('hide');
                $(".model_six_2").css("color", '#ff3333').html(((data.result.per_store_order_amount) * 100).toFixed(2) + "%");
            } else {
                $(".six_up2").addClass('hide');
                $(".six_down2").removeClass('hide');
                $(".model_six_2").css("color", '#33cc33').html(((data.result.per_store_order_amount) * -100).toFixed(2) + "%");
            }
            if (data.result.pre_store_rank < 0) {
                $(".six_up3").removeClass('hide');
                $(".six_down3").addClass('hide');
                $(".model_six_3").css("color", '#ff3333').html(((data.result.pre_store_rank) * -1) + "位");
            } else {
                $(".six_up3").addClass('hide');
                $(".six_down3").removeClass('hide');
                $(".model_six_3").css("color", '#33cc33').html(((data.result.pre_store_rank) * 1) + "位");
            }
            $("#loadhelp6").hide();
        }else{

        }
        });
    }
    //小面板7
    mod.model_seven=function (type,clicked) {
        //var type = $("#type").val();//取当天数据
        var type =type;//取4天的数据
        var url = core.getHost()+ "/datastatistics/get_modal_dataSeven";
        $("#loadhelp7").show();
        var datas={};
        datas.type = type;
        $.post(url,datas,function(e){
            var data = JSON.parse(e);//解析json
            if(data.status) {
                 if(!data.result.clicked){
                     var length=data.result.top_assistant.length;//获取数据中排名数组（top_assistant）的长度
                     if(length>clicked) {
                         data.result.clicked = clicked;
                         $("#xiala1").show();
                         $("#modal_list2").css("height","17.6%");
                     }else if(length<=clicked && length>0){
                         data.result.clicked = length;
                         $("#xiala1").hide();
                         $("#modal_list2").css("height","17.6%");
                     }else{
                         $("#modal_list2").html("<tr><td>暂无排名<td><tr>");
                         $("#xiala1").hide();
                         $("#modal_list2").css("height","17.6%");

                     }
                }
                $(".assistant_total_amount").html(data.result.assistant_total);
                $(".assistant_order_amount7").html(data.result.assistant_order);
                $(".assistant_order_amount_money7").html(data.result.assistant_order_amount);
                if (data.result.per_assistant_total > 0) {
                    $(".seven_up1").removeClass('hide');
                    $(".seven_down1").addClass('hide');
                    $(".model_seven_1").css("color", '#ff3333').html(((data.result.per_assistant_total) * 100).toFixed(2) + "%");
                } else {
                    $(".seven_up1").addClass('hide');
                    $(".seven_down1").removeClass('hide');
                    $(".model_seven_1").css("color", '#33cc33').html(((data.result.per_assistant_total) * -100).toFixed(2) + "%");
                }
                if (data.result.per_assistant_order > 0) {
                    $(".seven_up2").removeClass('hide');
                    $(".seven_down2").addClass('hide');
                    $(".model_seven_2").css("color", '#ff3333').html(((data.result.per_assistant_order) * 100).toFixed(2) + "%");
                } else {
                    $(".seven_up2").addClass('hide');
                    $(".seven_down2").removeClass('hide');
                    $(".model_seven_2").css("color", '#33cc33').html(((data.result.per_assistant_order) * -100).toFixed(2) + "%");
                }
                if (data.result.per_assistant_order_amount > 0) {
                    $(".seven_up3").removeClass('hide');
                    $(".seven_down3").addClass('hide');
                    $(".model_seven_3").css("color", '#ff3333').html(((data.result.per_assistant_order_amount) * 100).toFixed(2) + "%");
                } else {
                    $(".seven_up3").addClass('hide');
                    $(".seven_down3").removeClass('hide');
                    $(".model_seven_3").css("color", '#33cc33').html(((data.result.per_assistant_order_amount) * -100).toFixed(2) + "%");
                }

            }else{

            }
            if(length>0) {
                //调用dotjs插件
                var tpl = $("#assistant_templete").html();

                var doTtmpl = doT.template(tpl);

                var html = doTtmpl(data);

                $("#modal_list2").html(html);
            }
            $("#loadhelp7").hide();

        });
    }
    //小面板8
    mod.model_eight=function (type,clicked) {
        //var type = $("#type").val();//取当天数据
        var type = type;//取4天的数据
        var url = core.getHost()+ "/datastatistics/get_modal_dataEight";
        $("#loadhelp8").show();
        var datas={};
        datas.type = type;
        $.post(url,datas,function(e){
            var data = JSON.parse(e);//解析json
           if(data.status) {
               if(!data.result.clicked){
                   var length=data.result.top_goods.length;
                   if(length>clicked) {
                       data.result.clicked = clicked;
                       $("#xiala2").show();
                       $("#modal_list3").css("height","17.6%");
                   }else if(length<=clicked && length>0){
                       data.result.clicked = length;
                       $("#xiala2").hide();
                       $("#modal_list3").css("height","17.6%");
                   }else{
                       $("#modal_list3").html("<tr><td>暂无排名<td><tr>");
                       $("#xiala2").hide();
                       $("#modal_list3").css("height","17.6%");
                   }
               }
               $(".goods_type_total_amount").html(data.result.goods_type_total);
               $(".goods_total_amount").html(data.result.goods_total);
               $(".goods_amount_money").html(data.result.goods_amount);
               if (data.result.per_goods_type_total > 0) {
                   $(".eight_up1").removeClass('hide');
                   $(".eight_down1").addClass('hide');
                   $(".model_eight_1").css("color", '#ff3333').html(((data.result.per_goods_type_total) * 100).toFixed(2) + "%");
               } else {
                   $(".eight_up1").addClass('hide');
                   $(".eight_down1").removeClass('hide');
                   $(".model_eight_1").css("color", '#33cc33').html(((data.result.per_goods_type_total) * -100).toFixed(2) + "%");
               }
               if (data.result.per_goods_total > 0) {
                   $(".eight_up2").removeClass('hide');
                   $(".eight_down2").addClass('hide');
                   $(".model_eight_2").css("color", '#ff3333').html(((data.result.per_goods_total) * 100).toFixed(2) + "%");
               } else {
                   $(".eight_up2").addClass('hide');
                   $(".eight_down2").removeClass('hide');
                   $(".model_eight_2").css("color", '#33cc33').html(((data.result.per_goods_total) * -100).toFixed(2) + "%");
               }
               if (data.result.per_goods_amount > 0) {
                   $(".eight_up3").removeClass('hide');
                   $(".eight_down3").addClass('hide');
                   $(".model_eight_3").css("color", '#ff3333').html(((data.result.per_goods_amount) * 100).toFixed(2) + "%");
               } else {
                   $(".eight_up3").addClass('hide');
                   $(".eight_down3").removeClass('hide');
                   $(".model_eight_3").css("color", '#33cc33').html(((data.result.per_goods_amount) * -100).toFixed(2) + "%");
               }

               
           }else{

           }
            if(length>0) {
                //调用dotjs插件
                var tpl = $("#goods_templete").html();

                var doTtmpl = doT.template(tpl);

                var html = doTtmpl(data);

                $("#modal_list3").html(html);
            }
            $("#loadhelp8").hide();

        });
    };
    //会员顶部数据
    mod.Member_TOP = function(type){
        //var type = $("#type").val();//取当天数据
        var type = type;//取4天的数据
        var url = core.getHost()+ "/datastatistics/MemberData";
        var datas={};
        datas.type = type;
        $.post(url,datas,function(e){
            var data = JSON.parse(e);//解析json
            if(data.status) {
                $(".member_total").html(data.result.member_total);
                $(".add_member_total").html(data.result.add_member_total);
                $(".num").html(data.result.num);
                $(".no_num").html(data.result.no_num);
                $(".now_amount").html(data.result.now_amount);
                $(".now_price_order").html(data.result.now_price_order);
                if (data.result.precent_member_total > 0) {
                    $(".one_up").removeClass('hide');
                    $(".one_down").addClass('hide');
                    $(".up_one").css("color", '#ff3333').html(((data.result.precent_member_total) * 100).toFixed(2) + "%");
                } else {
                    $(".one_up").addClass('hide');
                    $(".one_down").removeClass('hide');
                    $(".down_one").css("color", '#33cc33').html(((data.result.precent_member_total) * -100).toFixed(2) + "%");
                }
                if (data.result.precent_add_member_total > 0) {
                    $(".two_up").removeClass('hide');
                    $(".two_down").addClass('hide');
                    $(".up_two").css("color", '#ff3333').html(((data.result.precent_add_member_total) * 100).toFixed(2) + "%");
                } else {
                    $(".two_up").addClass('hide');
                    $(".two_down").removeClass('hide');
                    $(".down_two").css("color", '#33cc33').html(((data.result.precent_add_member_total) * -100).toFixed(2) + "%");
                }
                if (data.result.precent_num > 0) {
                    $(".three_up").removeClass('hide');
                    $(".three_down").addClass('hide');
                    $(".up_three").css("color", '#ff3333').html(((data.result.precent_num) * 100).toFixed(2) + "%");
                } else {
                    $(".three_up").addClass('hide');
                    $(".three_down").removeClass('hide');
                    $(".down_three").css("color", '#33cc33').html(((data.result.precent_num) * -100).toFixed(2) + "%");
                }
                //4
                if (data.result.precent_no_num > 0) {
                    $(".four_up").removeClass('hide');
                    $(".four_down").addClass('hide');
                    $(".up_four").css("color", '#ff3333').html(((data.result.precent_no_num) * 100).toFixed(2) + "%");
                } else {
                    $(".four_up").addClass('hide');
                    $(".four_down").removeClass('hide');
                    $(".down_four").css("color", '#33cc33').html(((data.result.precent_no_num) * -100).toFixed(2) + "%");
                }
                //5
                if (data.result.per_now_amount > 0) {
                    $(".five_up").removeClass('hide');
                    $(".five_down").addClass('hide');
                    $(".up_five").css("color", '#ff3333').html(((data.result.per_now_amount) * 100).toFixed(2) + "%");
                } else {
                    $(".five_up").addClass('hide');
                    $(".five_down").removeClass('hide');
                    $(".down_five").css("color", '#33cc33').html(((data.result.per_now_amount) * -100).toFixed(2) + "%");
                }
                //6
                if (data.result.per_price_order > 0) {
                    $(".six_up").removeClass('hide');
                    $(".six_down").addClass('hide');
                    $(".up_six").css("color", '#ff3333').html(((data.result.per_price_order) * 100).toFixed(2) + "%");
                } else {
                    $(".six_up").addClass('hide');
                    $(".six_down").removeClass('hide');
                    $(".down_six").css("color", '#33cc33').html(((data.result.per_price_order) * -100).toFixed(2) + "%");
                }
            }else{
                
            }
        });
    }
    //50强列表
    mod.Member_list = function(type){
        var type =type;
        var url = core.getHost()+"/datastatistics/MemberList";
        var datas = {};
        datas.type=type;
        $.post(url,datas,function(e){
            var data =JSON.parse(e);
            //console.log(data);
            $("#table_member").empty();
            //调用dotjs插件
            var tpl =  $("#member_list").html();

            var doTtmpl = doT.template(tpl);

            var html = doTtmpl(data);

            $("#table_member").html(html);
        })
    }
    return mod;
});