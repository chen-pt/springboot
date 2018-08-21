/**
 * Created by admin on 2017/4/10.
 */
$(function () {
    /*$(".isCheck").click(function(){
        var current = $("#selectMonth").find("option:selected").val();
        alert(current);
        var thisMonth = $(this).attr("time-month");
        var thisMonthCut = thisMonth.length=1?thisMonth.replace('0',''):thisMonth;
        if(current == thisMonthCut){
            $('#detail-msg').modal('show');
        }
    });*/
});


$(document).ready(function () {

    function transform(obj){
        var arr = [];
        for(var item in obj){
            arr.push(obj[item]);
        }
        return arr;
    }

    function  dataFormat (date, fmt){
        var o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

});




