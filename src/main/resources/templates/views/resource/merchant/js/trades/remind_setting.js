$(document).ready(function () {
  tradesObj.doTinit();
  $.get("/merchant/getRemind", function (res) {
    console.log(res);
    if (res && res.value.order_pc_alert == 1) {
      $('[name="order_pc_alert"]').attr("checked", true).parent().addClass("checked");
    }
    if (res && res.value.order_voice_alert == 1) {
      $('[name="order_voice_alert"]').attr("checked", true).parent().addClass("checked");
    }
    /*  if (res && res.value.order_phone_lert == 1) {
     $('[name="order_phone_lert"]').attr("checked", true).parent().addClass("checked");
     }*/
    if (res && res.value.order_lert.indexOf("150") > -1) {
      $('[name="order_home_lert"]').attr("checked", true).parent().addClass("checked");
    }
    if (res && res.value.order_lert.indexOf("160") > -1) {
      $('[name="order_store_lert"]').attr("checked", true).parent().addClass("checked");
    }
    if (res && res.value.order_lert.indexOf("400") > -1) {
      $('[name="order_refund_lert"]').attr("checked", true).parent().addClass("checked");
    }
    var phones = "";
    if (res.value.order_remind_phones) {
      phones = res.value.order_remind_phones.split(",");
    }
    $('[name="order_remind_phone1"]').val(phones[0]);
    $('[name="order_remind_phone2"]').val(phones[1]);
    $('[name="order_remind_phone3"]').val(phones[2]);
  });


  $(".set-save-btn").click(function () {
    tradesObj.order_pc_alert = "";
    tradesObj.order_voice_alert = "";
    tradesObj.order_phone_lert = "";
    tradesObj.order_lert = "";
    tradesObj.order_remind_phones = "";
    tradesObj.doSetting();
  });
});


/****后台数据调取api****/
var tradesObj = {
  order_pc_alert: "",
  order_voice_alert: "",
  order_phone_lert: "",
  order_lert: "",
  order_remind_phones: "",
  doSetting: function () {
    if ($('[name="order_pc_alert"][value="1"]').is(":checked"))
      tradesObj.order_pc_alert = 1;
    if ($('[name="order_voice_alert"][value="1"]').is(":checked"))
      tradesObj.order_voice_alert = 1;
    /*if ($('[name="order_phone_lert"][value="1"]').is(":checked"))
     tradesObj.order_phone_lert = 1;*/
    if ($('[name="order_home_lert"][value="1"]').is(":checked"))
      tradesObj.order_lert = "150" + ",";
    if ($('[name="order_store_lert"][value="1"]').is(":checked"))
      tradesObj.order_lert += "160" + ",";
    if ($('[name="order_refund_lert"][value="1"]').is(":checked"))
      tradesObj.order_lert += "400" + ",";

    if (!tradesObj.order_lert) {
      tradesObj.order_phone_lert = 0;
    } else {
      tradesObj.order_phone_lert = 1;
    }

    if ($('[name="order_remind_phone1"]').val() != "") {
      tradesObj.order_remind_phones = tradesObj.order_remind_phones + "," + $('[name="order_remind_phone1"]').val();
    }
    if ($('[name="order_remind_phone2"]').val() != "") {
      tradesObj.order_remind_phones = tradesObj.order_remind_phones + "," + $('[name="order_remind_phone2"]').val();
    }
    if ($('[name="order_remind_phone3"]').val() != "") {
      tradesObj.order_remind_phones = tradesObj.order_remind_phones + "," + $('[name="order_remind_phone3"]').val();
    }
    tradesObj.order_remind_phones = tradesObj.order_remind_phones.substr(1);

    var tmpMobile = tradesObj.order_remind_phones.split(",");

    for (var i = 0, len = tmpMobile.length; i < len; i++) {
      for (var j = 0; j < len; j++) {
        if (i != j && tmpMobile[i] == tmpMobile[j]) {
          $.alert({'title': '温馨提示!', 'body': "接收提醒短信的手机号不能相同！"});
          return null;
        }
        if (tmpMobile[i] && !validate("mobile", tmpMobile[i])) {
          $.alert({'title': '温馨提示!', 'body': "请输入正确的手机号！"});
          return null;
        }
      }
    }
    var datas = {};
    datas.order_pc_alert = tradesObj.order_pc_alert;
    datas.order_voice_alert = tradesObj.order_voice_alert;
    datas.order_phone_lert = tradesObj.order_phone_lert;
    datas.order_remind_phones = tradesObj.order_remind_phones;
    datas.order_lert = tradesObj.order_lert;

    $.post("/merchant/orderRemind", datas, function (res) {
      console.log("Res");
      console.log(res);
      if (res.code = "000") {
        alert("设置成功！")
      }
    });
  },

  doTinit: function () {
    //配置定界符
    doT.templateSettings = {
      evaluate: /\[\%([\s\S]+?)\%\]/g,
      interpolate: /\[\%=([\s\S]+?)\%\]/g,
      encode: /\[\%!([\s\S]+?)\%\]/g,
      use: /\[\%#([\s\S]+?)\%\]/g,
      define: /\[\%##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\%\]/g,
      conditional: /\[\%\?(\?)?\s*([\s\S]*?)\s*\%\]/g,
      iterate: /\[\%~\s*(?:\%\]|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\%\])/g,
      varname: 'it',
      strip: true,
      append: true,
      selfcontained: false
    };
  }
};

var validate = function (type, obj, value) {
  var validate_result = false;
  var reg;
  switch (type) {
    //验证数字
    case  'member': {
      reg = new RegExp("^[0-9]*$");
      if (reg.test(obj)) {
        validate_result = true;
      }
    }
      ;
      break;
    //验证手机号
    case 'mobile': {
      reg = /^1[3|4|5|7|8][0-9]\d{4,8}$/;
      if (reg.test(obj)) {
        validate_result = true;
      }
    }
      ;
      break;
    //大于某个数
    case 'gt': {
      if (parseFloat(obj) > parseFloat(value)) {
        validate_result = true;
      }
    }
      ;
      break;
    //小于某个数
    case 'lt': {
      if (parseFloat(obj) < parseFloat(value)) {
        validate_result = true;
      }
    }
      ;
      break;
    //最大长度
    case 'max': {
      if (getStringLength(obj) <= parseFloat(value)) {
        validate_result = true;
      }
    }
      ;
      break;
    //最小长度
    case 'min': {
      if (getStringLength(obj) > parseFloat(value)) {
        validate_result = true;
      }
    }
      ;
      break;
    //汉字
    case 'cmax': {
      if (obj.length != 0) {

        reg = /^[\u4E00-\u9FA5]+$/;

        if (reg.test(obj) && getStringLength(obj) <= parseFloat(value)) {

          validate_result = true;
        }
      }

    }
      ;
      break;
    //汉字
    case 'cmin': {
      if (obj.length != 0) {

        reg = /^[\u4E00-\u9FA5]+$/;

        if (reg.test(obj) && getStringLength(obj) >= parseFloat(value)) {

          validate_result = true;
        }
      }

    }
      ;
      break;
    //身份证
    case 'idcard': {

      var ident = IdentityCodeValid(obj);

      if (ident) {

        validate_result = true;

      }
    }
      ;
      break;
    //邮箱帐号
    case 'email': {

      if (obj.length != 0) {

        reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

        if (reg.test(obj)) {

          validate_result = true;

        }
      }

    }
      ;
      break;
    //qq
    case 'qq': {

      reg = /^\d{5,15}$/;

      if (reg.test(obj)) {

        validate_result = true;
      }

    }
      ;
      break;
  }
  //console.log('type:'+type+'  obj:'+obj+'  val:'+value+ '  result:'+validate_result);
  return validate_result;
};
