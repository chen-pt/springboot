define([], function () {

  var integral = {};

  integral.checkFlag = true;

  integral.init = function () {

    var useCase = $("#useCase").val();
    var $ele = $("#set_integral_rule_" + useCase);
    $ele.removeClass("lee_hide");

    //保存事件
    $(".btn-primary").bind("click", function () {
      integral.save($ele);
    });

    //下拉选事件
    $ele.find('#rule_use_type,#rule_give_type').change(function () {
      for (var i = 1; i < 4; i++) {
        $(".rule_content_" + useCase + "_" + i).addClass("lee_hide");
      }
      $(".rule_content_" + useCase + "_" + $(this).val()).removeClass("lee_hide");
    });

    switch (useCase) {

      case "110"://注册
        break;
      case "120"://购物

        break;
      case "130"://积分抵现金
        break;
      case "140"://签到
        checkinAddDelEle();
        break;
      default:

    }

  }

  integral.initData = function () {
    var datas = {};
    datas.id = $("#id").val();

    $.post("/merchant/rules", datas, function (datas) {
      if (datas.status) {
        var data = {};
        data.result = datas.result[0];
        var $ele = $("#set_integral_rule_" + $("#useCase").val());
        $ele.find("textarea").val(data.result.integral_desc);
        $ele.find("input[name='status']").val(data.result.status);
        $ele.find("input[name='status']").parent().find("span").html(data.result.status == 1 ? "开启" : "关闭");

        //var tmpVal = eval("(" + data.result.value + ")");
        if (!data.result.value)return;
        var tmpVal = JSON.parse(data.result.value);
        switch (data.result.use_case.toString()) {
          case "110":
            $("#set_integral_rule_" + data.result.use_case + " .integral-value").val(tmpVal[0].value);
            break;
          case "120":
            var tmpType = 1;
            switch (data.result.add_type.toString()) {
              case "110":
                tmpType = 1;
                $(".rule_content_120_1 input:eq(0)").val(tmpVal[0].min / 100);
                $(".rule_content_120_1 input:eq(1)").val(parseInt(tmpVal[0].value));
                break;
              case "120":
                tmpType = 2;
                $(".rule_content_120_2 input:eq(0)").val(tmpVal[0].min / 100);
                $(".rule_content_120_2 input:eq(1)").val(parseInt(tmpVal[0].value));
                break;
              case "130":
                tmpType = 3;
                for (var i = 0, len = tmpVal.length; i < len; i++) {
                  $(".rule_content_120_3 input:eq(" + (i * 2) + ")").val(tmpVal[i].min / 100);
                  $(".rule_content_120_3 input:eq(" + (i * 2 + 1) + ")").val(tmpVal[i].value);
                }
                break;
            }

            for (var i = 1; i < 4; i++) {
              $(".rule_content_120_" + i).addClass("lee_hide");
            }
            $ele.find("#rule_give_type option[value=" + tmpType + "]").attr("selected", true);
            $(".rule_content_120_" + tmpType).removeClass("lee_hide");

            $("#set_integral_rule_" + data.result.use_case + " .add_max").val(data.result.add_max);
            break;
          case "130":

            var tmpType = 1;
            switch (data.result.subtract_type.toString()) {
              case "110":
                tmpType = 1;
                $(".rule_content_130_1 input:eq(0)").val(tmpVal[0].min / 100);
                $(".rule_content_130_1 input:eq(1)").val(tmpVal[0].value / 100);
                var count = tmpVal[0].value / 100 / $("#_pro").val();
                $(".rule_content_130_1 input:eq(1)").next('span').html(isNaN(count) ? 0 : count);
                break;
              case "120":
                tmpType = 2;
                $(".rule_content_130_2 input:eq(0)").val(tmpVal[0].min / 100);
                $(".rule_content_130_2 input:eq(1)").val(tmpVal[0].value / 100);
                break;
              case "130":
                tmpType = 3;
                break;
            }

            for (var i = 1; i < 4; i++) {
              $(".rule_content_130_" + i).addClass("lee_hide");
            }
            $ele.find("#rule_use_type option[value=" + tmpType + "]").attr("selected", true);
            $(".rule_content_130_" + tmpType).removeClass("lee_hide");

            $("#set_integral_rule_" + data.result.use_case + " .subtract_max").val(data.result.subtract_max / 100);
            break;
          case "140":
            var tmpType = 1;
            switch (data.result.add_type.toString()) {
              case "110":
                tmpType = 1;
                $(".rule_content_140_1 input:eq(0)").val(tmpVal[0].value);
                break;
              case "120":
                tmpType = 2;
                break;
            }
            var arr = JSON.parse(data.result.value)[0];
            var str = "";
            for (var i in arr.valuearr) {
              var tmpi = parseInt(i) + 1;
              str += "<div class='full-cut-condition'>（<span class='condition_num'>" + tmpi + "</span>） 第 <span class='condition_num'>" + tmpi + "</span>天" +
                "<input type='text' class='condition_val input-small' placeholder='10' maxlength='3' onkeyup=\"value=value.replace(/[^\\d]|^0/g,'');\" value='" + arr.valuearr[i] + "'>积分 &nbsp;";
              str += (tmpi== arr.valuearr.length  && tmpi > 3) ? "<a class='del-full-cut-condition sui-btn btn-small btn-danger'>删除</a>" : "";
              str += "</div>";
            }
            if (arr.valuearr) {
              str += "<div class='add-full-cut-condition'>+增加</div>";
              $("#points_get_detail").empty();
              $("#points_get_detail").append(str);
              if (arr.valuearr.length==15)$('.add-full-cut-condition').addClass("gray");
            }
            if (tmpVal[0].add_value > 0 || tmpVal[0].max_num > 0) {
              $("#set_integral_rule_140 input[name=checkbox]").attr('checked', true).parent().addClass('checked');
            }else {
              $("#set_integral_rule_140 input[name=add_value]").attr('disabled', true);
              $("#rule_content_140_1_max_num").attr('disabled', true);
            }
            $("#rule_content_140_1_max_num").val(tmpVal[0].max_num == 0 ? 5 : tmpVal[0].max_num);
            $("#rule_content_140_2_max_num").html($('.full-cut-condition').length);
            $("#set_integral_rule_140 input[name=add_value]").val(tmpVal[0].add_value == 0 ? 10 : tmpVal[0].add_value);

            for (var i = 1; i < 3; i++) {
              $(".rule_content_140_" + i).addClass("lee_hide");
            }

            $ele.find("#rule_give_type option[value=" + tmpType + "]").attr("selected", true);
            $(".rule_content_140_" + tmpType).removeClass("lee_hide");
            break;
        }
      }
    });
  }

  integral.save = function () {
    integral.checkFlag = true;
    var useCase = $("#useCase").val();
    var $ele = $("#set_integral_rule_" + useCase);
    var data = {};
    data.id = $("#id").val();
    data.useCase = $("#useCase").val();
    data.status = $ele.find("input[name='status']").val();
    data.integralDesc = $ele.find("textarea").val();
    data.addMax = $("#diff_limit").val();

    switch (useCase) {
      case "110"://注册
        integral.value4Regist(data, $ele);
        break;
      case "120"://购物
        integral.value4Buy(data, $ele);
        break;
      case "130"://积分抵现金
        integral.value4Diff(data, $ele);

        break;
      case "140"://签到
        integral.value4Checkin(data, $ele);
        break;
      default:

    }
    if (integral.checkFlag) {

      $.post("/merchant/updateRule", data, function (data) {
        if (data.status == "success") {
          alert("更新成功！");
          location.href="/merchant/set";
        } else {
          alert(data.msg || "error");
        }
      });
    }

  }

  integral.value4Regist = function (data, $ele) {
    var max = "99999";
    var min = "0";
    var tmpVal = $ele.find(".integral-value").val();
    checkNum(tmpVal);
    data.value = '[{"min":"' + min + '","max":"' + max + '","type":"fixed","value":"' + tmpVal + '"}]';
  }

  integral.value4Diff = function (data, $ele) {
    var max = "99999";
    var min = 0;
    var tmpVal = 0;
    var subtract_type = $ele.find("#rule_use_type").val();
    var subtract_type_tmp = 110;
    switch (subtract_type) {
      case "1":
        min = $(".rule_content_130_1 input:eq(0)").val() * 100;
        tmpVal = $(".rule_content_130_1 input:eq(1)").val() * 100;
        subtract_type_tmp = 110;
        break;
      case "2":
        min = $(".rule_content_130_2 input:eq(0)").val() * 100;
        tmpVal = $(".rule_content_130_2 input:eq(1)").val() * 100;
        subtract_type_tmp = 120;
        break;
      case "3":
        subtract_type_tmp = 130;
        break;
    }
    if (!min && subtract_type != "3") {
      alert("请输入正确的金额！");
      integral.checkFlag = false;
      return;
    }
    if (!tmpVal && subtract_type != "3") {
      alert("请输入正确的积分值！");
      integral.checkFlag = false;
      return;
    }
    data.value = '[{"min":"' + min + '","max":"' + max + '","type":"fixed","value":"' + tmpVal + '"}]';
    data.subtractMax = $("#set_integral_rule_130 .subtract_max").val() * 100;
    data.subtractType = subtract_type_tmp;
  }

  integral.value4Buy = function (data, $ele) {
    var max = "99999";
    var min = 0;
    var tmpVal = 0;
    var add_type = $ele.find("#rule_give_type").val();
    var add_type_tmp = 110;
    var value = '';
    switch (add_type) {
      case "1":
        min = $(".rule_content_120_1 input:eq(0)").val() * 100;
        tmpVal = $(".rule_content_120_1 input:eq(1)").val();
        add_type_tmp = 110;
        if (!min) {
          alert("请输入正确的金额！");
          integral.checkFlag = false;
          return;
        }
        if (!tmpVal) {
          alert("请输入正确的积分值！");
          integral.checkFlag = false;
          return;
        }
        value = '[{"min":"' + min + '","max":"' + max + '","type":"fixed","value":"' + tmpVal + '"}]';
        break;
      case "2":
        min = $(".rule_content_120_2 input:eq(0)").val() * 100;
        tmpVal = $(".rule_content_120_2 input:eq(1)").val();
        add_type_tmp = 120;
        if (!min) {
          alert("请输入正确的金额！");
          integral.checkFlag = false;
          return;
        }
        if (!tmpVal) {
          alert("请输入正确的积分值！");
          integral.checkFlag = false;
          return;
        }
        value = '[{"min":"' + min + '","max":"' + max + '","type":"fixed","value":"' + tmpVal + '"}]';
        break;
      case "3":
        add_type_tmp = 130;
        value = "[";
        for (var i = 0; i < 3; i++) {
          if (!$(".rule_content_120_3 input:eq(" + (i * 2) + ")").val() || !$(".rule_content_120_3 input:eq(" + (i * 2 + 1) + ")").val()) {
            alert("请填写必填项！");
            integral.checkFlag = false;
            return;
          }
          if ($(".rule_content_120_3 input:eq(" + (i * 2) + ")").val() * 100 >= $(".rule_content_120_3 input:eq(" + ((i + 1) * 2) + ")").val() * 100) {
            $('.integral-set-error').removeClass('lee_hide');
            integral.checkFlag = false;
            return;
          } else {
            $('.integral-set-error').addClass('lee_hide');
          }
          value += '{"min":"' + $(".rule_content_120_3 input:eq(" + (i * 2) + ")").val() * 100 + '","max":"' + (i < 2 ? ($(".rule_content_120_3 input:eq(" + ((i + 1) * 2) + ")").val() * 100 - 1) : max) + '","type":"fixed","value":"' + $(".rule_content_120_3 input:eq(" + (i * 2 + 1) + ")").val() + '"}';
          value += i < 2 ? "," : "";
        }
        value += "]";
        break;
    }
    data.addType = add_type_tmp;
    data.addMax = $("#set_integral_rule_120 .add_max").val();
    data.value = value;
  }

  integral.value4Checkin = function (data, $ele) {
    var tmlValue = 10;
    var max_num = 0;
    var add_value = 0;
    var add_max = 9999;
    var add_type = $ele.find("#rule_give_type").val();
    var add_type_tmp = 110;
    var element = '.rule_content_140_' + add_type;

    $(element).find("input[name=checkbox]").click(function () {
      if (!$(this).is(':checked')) {
        $("#set_integral_rule_140 input[name=add_value]").attr('disabled', true);
      }
      else {
        $("#set_integral_rule_140 input[name=add_value]").attr('disabled', false);
      }
    });

    if ($(element).find("input[name=checkbox]").is(':checked')) {
      if (add_type == 1) {
        max_num = $("#rule_content_140_1_max_num").val();
        add_value = $("#rule_content_140_1_max_num").next().val();
      } else if (add_type == 2) {
        max_num = $("#rule_content_140_2_max_num").html();
        add_value = $("#rule_content_140_2_max_num").next().val();
      }

      if (!add_value || add_value < 1 || add_value >= 1000) {
        alert("请输入正确的额外积分(1-999)！");
        integral.checkFlag = false;
        return false;
      }
      if (!max_num || max_num < 1 || max_num >= 100) {
        alert("请输入连续签到天数(1-99)！");
        integral.checkFlag = false;
        return false;
      }
    }
    var is_error = 0;
    if (add_type == 1) {
      add_type_tmp = 110;
      tmlValue = $(".rule_content_140_1 input[name=point_value]").val();
      data.value = '[{"value":"' + tmlValue + '","max_num":"' + max_num + '","add_value":"' + add_value + '"}]';
    } else if (add_type == 2) {
      add_type_tmp = 120;
      var valuearr = [];

      $('.condition_val').each(function () {
        if ($(this).val() == '') {
          is_error = 1;
          alert("请输入正确的自定义积分！");
          integral.checkFlag = false;
          return false;
        }
        valuearr.push($(this).val());
      });
      data.value = '[{"valuearr":[' + valuearr + '],"value":"0","max_num":"' + max_num + '","add_value":"' + add_value + '"}]';
    }

    if (!tmlValue || tmlValue < 1 || tmlValue >= 1000) {
      alert("请输入正确的固定积分(1-999)！");
      integral.checkFlag = false;
      return false;
    }
    data.addType = add_type_tmp;
  }

  function checkinAddDelEle() {
    //删除
    $('.del-full-cut-condition').live('click', function () {
      $(this).parent().remove();
      if ($(".full-cut-condition").index() > 2) $(".full-cut-condition").last().append('<a class="del-full-cut-condition sui-btn btn-small btn-danger">删除</a>');
      $("#rule_content_140_2_max_num").html($('.full-cut-condition').length);
      $()
      if ($(this).parent().index() != 15) $('.add-full-cut-condition').removeClass('gray');
    });

    //增加
    $('.add-full-cut-condition').live('click', function () {
      var tmp = $(this).prev().clone();
      var prevConditionNum = parseInt(tmp.find('.condition_num').html());
      var prevConditionVal = parseInt(tmp.find('.condition_val').attr('placeholder'));
      if (prevConditionNum == 15) return false;


      tmp.find('.condition_num').html(prevConditionNum + 1);
      tmp.find('.condition_val').val(prevConditionVal * (prevConditionNum + 1));

      $('.del-full-cut-condition').remove();
      tmp.find('.del-full-cut-condition').remove();
      tmp.append('<a class="del-full-cut-condition sui-btn btn-small btn-danger">删除</a>');
      tmp.insertBefore($(this));
      $("#rule_content_140_2_max_num").html($('.full-cut-condition').length);
      if (prevConditionNum == 14) $(this).addClass('gray');
    });

    $("#set_integral_rule_140 input[name=checkbox]").click(function () {
      if (!$(this).is(':checked')) {
        $("#set_integral_rule_140 input[name=add_value]").attr('disabled', true);
        $("#rule_content_140_1_max_num").attr('disabled', true);
      }
      else {
        $("#set_integral_rule_140 input[name=add_value]").attr('disabled', false);
        $("#rule_content_140_1_max_num").attr('disabled', false);
      }
    });

  }

  function checkNum(strs) {
    for (var i in strs) {
      var str = strs[i];
      if (!str || str < 0 || str > 100) {
        alert("请输入正确金额!");
        integral.checkFlag = false;
        return;
      }
    }
  }

  return integral;
});
