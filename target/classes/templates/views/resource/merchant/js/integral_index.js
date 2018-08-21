/**
 * Created by boren on 15/9/7.
 * 积分管理
 */

/**
 * 初始化
 */
$(function () {

  require.config({

    paths: {
      'vue': '/templates/views/resource/public/sui/js/vue',
    },
    baseUrl: '/templates/views/resource/merchant/js',
  });

  /**
   * 路由
   *
   */
  var url = window.location.pathname;

  switch (url) {
    case '/merchant/manage'     :
      initIntegralManagement();
      break;
    case '/merchant/set'     :
      initIntegralSet();
      break;
    case '/merchant/setRule'      :
      initIntegralEdit();
      break;
    case '/merchant/report' :
      reportList();
      break;
  }

});

function initIntegralManagement() {

  require(["integral_manage"], function (integral) {
    integral.get_integral_list();

    $(".change_integrate_btn").live("click", function () {
      integral.cur_buyer_id = $(this).attr("data");
      $("#change_integral .integral_phone").html($(this).parents("tr").find("td:eq(0)").html());
      $("#change_integral .integral_surplus").html($(this).parents("tr").find("td:eq(3)").html());
      $("#change_integral input[name='integral_val']").val("");
    });
    $(".set-userPoint-qs").click(function () {
      integral.updateForce();
    });

  })

}
function initIntegralSet() {

  getRulesData();

  $(".set-integralValue-btn-qs").click(function () {
    setIntegralProportion();
  });

}

function getRulesData() {
  require(['vue'], function (Vue) {
    var url = "/merchant/rules";
    $.ajax({
      url: url,
      data: {},
      async: false,
      type: 'post',
      success: function (data) {

        Vue.filter('rule_format', function (value, useCase, addType, subType) {
          return ruleFormat(value, useCase, addType, subType);
        });

        var vm = new Vue({
          el: "#set_table",
          data: {
            result: data.result,
            status: data.status
          },
          ready: function () {

          },
          filters: {
            desc_format: function (value) {
              return (value && value.length > 20) ? value.substr(0, 19) + "..." : value;
            }
          }
        });
      }
    });
  });
}

function ruleFormat(value, useCase, addType, subType) {
  useCase = useCase.toString();
  var tmpAddType = addType.toString();
  var tmpSubtractType = subType.toString();
  var tmpShowValue = "";
  switch (useCase) {
    case "110":
      value = value || "[{}]";
      value = JSON.parse(value)[0].value || 0;
      tmpShowValue = "+" + value;
      break;
    case "120":
      switch (tmpAddType) {
        case "110":
          tmpShowValue = "满足条件时赠送一次";
          break;
        case "120":
          tmpShowValue = "按照条件累加赠送";
          break;
        case "130":
          tmpShowValue = "按不同的条件送不同的数量";
          break;
      }
      break;
    case "130":
      switch (tmpSubtractType) {
        case "110":
          tmpShowValue = "满足条件时抵扣一次";
          break;
        case "120":
          tmpShowValue = "满足条件时抵扣，可以累加";
          break;
        case "130":
          tmpShowValue = "按积分价值直接抵扣";
          break;
      }
      break;
    case "140":
      switch (tmpAddType) {
        case "110":
          tmpShowValue = "每日获取固定积分";
          break;
        case "120":
          tmpShowValue = "每日获取自定义积分";
          break;
      }
  }

  return tmpShowValue || "";
}

//设置积分价值
function setIntegralProportion() {
  var integral_value = $("#set_integral input").val();

  if (integral_value < 0.01 || integral_value > 100) {
    alert("金额必须控制在0.01至100间！");
    return;
  }
  if (isNaN(integral_value)) {
    alert('输入必须为数字');
    return;
  }
  var url = "/merchant/setProportion";
  var datas = {};
  datas.integralProportion = integral_value * 100;
  $.post(url, datas, function (data) {
    if (data.status) {
      alert("积分设置成功");
      location.reload();
    }
  });
};

function reportList() {
  require(["integral_manage"], function (integral) {
    integral.get_report_list();
  })
}

function initIntegralEdit() {

  require(["integral_edit"], function (integral) {
    integral.init();
    integral.initData();
  })

  dataValidate();

}

function dataValidate() {
  $("form").find("input").each(function () {
    //输入的数值验证，两位小数
    if ($(this).attr("data-double")) {
      $(this).keyup(function () {
        var inputv = $(this).val();
        if (/[^0-9\d.?]|^0(?!\.)\d+|^[^\d]|\.\d*\.|\.{2}|0\.00/.test(inputv)) $(this).val("");
        if (/\S{13}/.test(inputv))$(this).val(inputv.substr(0, 12));
        if (/\d*\.\d{3}/.test(inputv))$(this).val(inputv.substr(0, inputv.indexOf(".")+3));
      });
    }
    //输入的数值验证，正整数
    if ($(this).attr("data-integer")) {
      $(this).keyup(function () {
        var inputv = $(this).val();
        ///[^\d]|^0/g
        if (!/^[1-9]\d*$/.test($(this).val()) || /\d{20}/.test($(this).val())) $(this).val("");
        if (/\S{13}/.test(inputv))$(this).val(inputv.substr(0, 12));
        if (/\d*\.\d{3}/.test(inputv))$(this).val(inputv.substr(0, inputv.indexOf(".")+3));
      });
    }
  })
}
