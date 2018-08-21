/**
 * Created by 卡西 on 2016/6/1.
 */
define(['core'],function(core){
    var mod ={};
    mod.getPrintXiaopiao = function(){
        var tradesId = $("#trades_Id_xiaopiao").val();
        var data = {};

        data.trades_id = tradesId;

        $.ajax({
            type: 'POST',
            data: data,
            async:true,
            url: core.getHost() + '/print/getOrderPrint',
            success:function(e){
                $("#shangpin").empty();
                var data = JSON.parse(e);
                if(data.status){

                    String.prototype.toFixed = function(xxx) {
                        var xxx = xxx || 2;
                        var v = this.valueOf();
                        return parseFloat(v).toFixed(xxx)
                    }
                    var tpl =  $("#shangpin_templete").html();

                    var doTtmpl = doT.template(tpl);

                    var html = doTtmpl(data);

                    $("#shangpin").html(html);
                    $(".danhao").html(data.result.trades_information.trades_id);
                    $(".shijian").html(data.result.trades_information.pay_time);
                    $(".yingshou").html((data.result.trades_information.total_fee/100).toFixed(2));//应收

                    $(".cash_payment_pay").html(((data.result.trades_information.medical_insurance_card_pay)/100).toFixed(2));//医保支付
                    $(".youhui").html((data.result.trades_information.line_breaks_pay/100).toFixed(2))//优惠
                    $(".zhaolin").html(parseFloat($(".back").val()).toFixed(2))//找零
                    $(".cash_pay").html($(".cash").val().toFixed(2));
                    mod.getPrintMendian();

                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        });
    };
    mod.getPrintMendian = function(){

        var data = {};

        $.ajax({
            type: 'POST',
            data: data,
            async:true,
            url: core.getHost() + '/print/getStoreInfo',
            success:function(e){

                var data = JSON.parse(e);
                if(data.status){
                    $('.mendian').html(data.result.name);
                    $(".dianhua").html(data.result.tel);
                    var hei =data.result;
                    $(".dizhi").html(hei.province+hei.city+hei.country+hei.address);

                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        });
    };

    return mod;
})