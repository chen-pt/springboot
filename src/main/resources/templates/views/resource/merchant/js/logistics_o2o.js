define(function () {

  var mod = {};
  mod.siteId = "8888";

  mod.o2oInit = function () {
    var url = "/merchant/o2oData";
    var datas = {};
    datas.siteId = mod.siteId;
    $.post(url, datas, function (data) {
      if (data.status) {
        if(typeof(data.result)!="undefined"&&typeof(data.result.meta_status)!="undefined"&&data.result.meta_status==1){
          //$('[name="log_desc"]:eq(0)').attr("checked",true);
          $('#sBtn').attr("checked",true);
        }else if(typeof(data.result)!="undefined"&&typeof(data.result.meta_status)!="undefined"&&data.result.meta_status==2){
          //$('[name="log_desc"]:eq(1)').attr("checked",true);
          $('#sBtn').attr("checked",false);
        }

        if(typeof(data.result)!="undefined"&&typeof(data.result.o2oTimeGapMap)!="undefined"&&data.result.o2oTimeGapMap!=null){

          var timeGapInfo = JSON.parse(data.result.o2oTimeGapMap.meta_val);
          $('[name="o2oStartTime"]').val(timeGapInfo.o2oStartTime.split(":",2)[0]);
          $('[name="o2oStartMinute"]').val(timeGapInfo.o2oStartTime.split(":",2)[1]);
          $('[name="o2oEndTime"]').val(timeGapInfo.o2oEndTime.split(":",2)[0]);
          $('[name="o2oEndMinute"]').val(timeGapInfo.o2oEndTime.split(":",2)[1]);
          $('#metaIdforTimeGap').val(data.result.o2oTimeGapMap.meta_id);
        }else {
          $('[name="o2oStartTime"]').val("00");
          $('[name="o2oStartMinute"]').val("00");
          $('[name="o2oEndTime"]').val(23);
          $('[name="o2oEndMinute"]').val(59);
        }
        $('#metaId').val(data.result.meta_id);

        //判断是否要隐藏商户自送收费规则
        checkHide();

        //判断是否隐藏其余时间的物流配置
        checkHideOtherConf();

        var o2o_info = data.result.meta_val || "[]";
        o2o_info = JSON.parse(o2o_info);
        var $ele = $('.o2o-condition');
        for (var i = 0, len = o2o_info.length; i < len; i++) {
          $ele.each(function () {
            $(this).children('span').addClass("lee_hide");
            $(this).children('.del-o2o-condition').addClass("lee_hide");
          });

          $ele.eq(i).find('.del-o2o-condition').removeClass("lee_hide");
          $ele.eq(i).find('span.lee_hide').removeClass("lee_hide");
          $ele.eq(i).removeClass("lee_hide");
          $ele.eq(i).find('input').eq(0).val(o2o_info[i].distance);
          $ele.eq(i).find('input').eq(1).val(parseFloat(o2o_info[i].fix_price / 100).toFixed(2));

          var free_scope_low = ((o2o_info[i].free_scope || '').split('-')[0] || 0) / 100;
          var free_scope_high = ((o2o_info[i].free_scope || '').split('-')[1] || 0) / 100;

          if (free_scope_low && free_scope_high) {
            $ele.eq(i).find('input').eq(2).val(free_scope_low.toFixed(2));
            $ele.eq(i).find('input').eq(3).val(free_scope_high.toFixed(2));
          }

        }

        if ($('.o2o-condition.lee_hide').length < 1) {
          $(".add-o2o-condition").addClass("gray");
        }

      }
    });
  }

//增加条件事件
  mod.AddCut = function (obj) {

    if ($(obj).hasClass("gray")) {
      return;
    }
    $('.o2o-condition').each(function () {
      $(this).children('span').addClass("lee_hide");
      $(this).children('.del-o2o-condition').addClass("lee_hide");
    });

    $('.o2o-condition.lee_hide').eq(0).find('.del-o2o-condition').removeClass("lee_hide");
    $('.o2o-condition.lee_hide').eq(0).find('span.lee_hide').removeClass("lee_hide");
    $('.o2o-condition.lee_hide').eq(0).removeClass("lee_hide");

    if ($('.o2o-condition.lee_hide').length < 1) {
      $(obj).addClass("gray");
    }

  };

  //删除条件事件
  mod.DelCut = function (obj) {
    $(obj).parent(".o2o-condition").find(".input-small").val("");
    $(obj).parent('.o2o-condition').addClass("lee_hide");

    $('.add-o2o-condition').removeClass('gray');

    $('.o2o-condition:visible').eq($(this).index(".o2o-condition .del-o2o-condition")).find(".lee_hide").removeClass("lee_hide");

  };

  //检查满减条件
  mod.checkO2OCondition = function () {
    var errorFlag = false;
    var tmpO2OInfo = [];
    var num = 0;

    //获取运送方式
    if(typeof($('[name="logistics_flag_mode"]:checked').val()) == "undefined"){
      $('.o2o-error-mode').removeClass('lee_hide');
      return false;
    }
    mod.logistics_flag_mode =  $('[name="logistics_flag_mode"]:checked').val();


    var $ele = $('.o2o-condition:visible');
    for (var i = 0, len = $ele.length; i < len; i++) {
      if ($ele.eq(i).find('input').eq(0).val() == "" || $ele.eq(i).find('input').eq(1).val() == "") {
        errorFlag = true;
      } else if (i < len - 1 && parseFloat($ele.eq(i + 1).find('input').eq(0).val()) <= parseFloat($ele.eq(i).find('input').eq(0).val())) {
        // 距离递增
        errorFlag = true;
      } else if ($ele.eq(i).find('input').eq(2).val() || $ele.eq(i).find('input').eq(3).val()) {
        // 输入了值
        if ($ele.eq(i).find('input').eq(2).val() <= 0) {
          // 值必须大于0
          errorFlag = 2;
        } else if (parseFloat($ele.eq(i).find('input').eq(2).val()) >= parseFloat($ele.eq(i).find('input').eq(3).val()) || 0) {
          // 订单金额区间
          errorFlag = 2;
        }
      }

      if (errorFlag === true) {
        $('.o2o-error').removeClass('lee_hide');
        return false;
      } else if (errorFlag === 2) {
        $ele.eq(i).find('.free_scope_tips').show();
        return false;
      } else {
        $('.o2o-error').addClass('lee_hide');
        $('.free_scope_tips').hide();
      }
      tmpO2OInfo[num] = {};
      tmpO2OInfo[num].distance = parseFloat($ele.eq(i).find('input').eq(0).val()).toFixed(2);
      tmpO2OInfo[num].fix_price = parseFloat($ele.eq(i).find('input').eq(1).val() * 100).toFixed(2);
      // 订单金额区间
      if ($ele.eq(i).find('input').eq(2).val() && $ele.eq(i).find('input').eq(3).val()) {
        var free_scope_low = parseFloat($ele.eq(i).find('input').eq(2).val() * 100).toFixed(2);
        var free_scope_high = parseFloat($ele.eq(i).find('input').eq(3).val() * 100).toFixed(2);
        tmpO2OInfo[num].free_scope = free_scope_low + '-' + free_scope_high;
      }

      num++;
    }

    mod.log_val = JSON.stringify(tmpO2OInfo) || {};



    //获取时间
    var timeGapInfo = {};
    var o2oStartTime = $('[name=o2oStartTime]').val();
    var o2oStartMinute = $('[name=o2oStartMinute]').val();
    var o2oEndTime = $('[name=o2oEndTime]').val();
    var o2oEndMinute = $('[name=o2oEndMinute]').val();

    if(o2oStartTime.length==1){
      o2oStartTime = "0"+o2oStartTime;
    }
    if(o2oStartMinute.length==1){
      o2oStartMinute = "0"+o2oStartMinute;
    }
    if(o2oEndTime.length==1){
      o2oEndTime = "0"+o2oEndTime;
    }
    if(o2oEndMinute.length==1){
      o2oEndMinute = "0"+o2oEndMinute;
    }
    if(o2oStartTime=="" ||o2oStartMinute==""||o2oEndTime ==""||o2oEndMinute==""){
      $('.o2o-error-time').removeClass('lee_hide');
      return false;
    }

   //时间判断（开始时间不能大于结束时间）
    var timegapFlag = false;
    if(parseInt(o2oStartTime)>parseInt(o2oEndTime)){
      timegapFlag = true;
    }

    if(parseInt(o2oStartTime)==parseInt(o2oEndTime)&&parseInt(o2oStartMinute)>=parseInt(o2oEndMinute)){
      timegapFlag = true;
    }

    if(timegapFlag){
      $('.o2o-error-time-small').removeClass('lee_hide');
      return false;
    }

    timeGapInfo.o2oStartTime = o2oStartTime+":"+o2oStartMinute;
    timeGapInfo.o2oEndTime =o2oEndTime+":"+o2oEndMinute;
    mod.time_val = JSON.stringify(timeGapInfo) || {};

    return true;
  };

  mod.checkSubmit = function () {
    if (!mod.checkO2OCondition()) {
      return false;
    }

    if ($("#ser").val()=='') {
      return false;
    }

    if ($("#m_shop").find("input:checked").length <=0 ) {
      alert("手机商城下单页配送方式至少选择一种");
      return false;
    }

    var url = "/merchant/o2oUpdate";

    var log_desc = "";
    var log_status = ($('#sBtn:checked')&&$('#sBtn:checked').length>0)?1:2;//关闭2，开启1
    var datas = {};
    datas.metaVal = mod.log_val;
    datas.log_desc = log_desc;
    datas.metaStatus = log_status;
    datas.metaId = $("#metaId").val();
    datas.siteId = mod.siteId;
    datas.metaIdforTimeGap = $("#metaIdforTimeGap").val();
    datas.time_val = mod.time_val;
    datas.logistics_flag_mode = mod.logistics_flag_mode;

    updateDis();

    $.post(url, datas, function (data) {
      if (data.status) {
        alert("设置成功!");
        location.reload();
      } else {
        alert(data.result.msg);
      }
    });
  };

  return mod;
});
