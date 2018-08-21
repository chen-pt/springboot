/**
 * Created by aaron 2017/3/19.
 */

var area_status = 1;
var code_status = 0;
var time_status = 0;
var time = 59;
var interval1;

$(function () {
  $("title").html("添加会员");

  getArea(parent_id_default, province_type);
  checkPermission();
  checkInviteCodePermission();

  $('#addReturnModal').on('okHide', function (e) {
    console.log('okHide')
  })
  $('#addReturnModal').on('okHidden', function (e) {
    console.log('okHidden')
  })
  $('#addReturnModal').on('cancelHide', function (e) {
    console.log('cancelHide')
  })
  $('#addReturnModal').on('cancelHidden', function (e) {
    console.log('cancelHidden')
  })

  /**
   * 添加会员提交事件
   */
  $("#add_sure").click(function () {
    $("#add_sure").attr("disabled",true);
    addmember();
    setTimeout("$('#add_sure').removeAttr('disabled')",3000);
  })

})

function checkInviteCodePermission() {

  $('#inviteCode1').css("display", "block")

  // $.post("/common/selectPCinvitecode", {}, function (result) {
  //
  //   if (result == 0) {
  //
  //     $('#inviteCode1').css("display", "block")
  //
  //   } else if (result == 1) {
  //     $('#PCInviteCode').css("display", "none")
  //   } else {
  //     showInviteCode();
  //
  //   }
  //
  // })

}

function showInviteCode() {

  $('#inviteCode1').css("display", "none");
  $('#inviteCode').css("display", "block");

}

/**
 * 检验手机号是否被注册
 */
function addmember_checkuser() {

  $("#check_user").css('display', 'none');
  $("#sms_code").css('display', 'none');
  $("#phone_no").css('display', 'none');

  var mobile = $("#member_mobile").val();

  if (isEmpty(mobile)) {
    $("#phone_no").css('display', 'block');
    return;
  } else {

    if (!verfiyMobile(mobile)) {
      $("#sms_code").css('display', 'block');
      return;
    }

  }

  $.post("/store/member/checkMobile", {
    mobile: mobile,
  }, function (result) {

    if (result.status == true || result.status == 'true' || result.status == 'TRUE') {

      $("#check_user").css('display', 'block');

      code_status = 2;

    } else {

      code_status = 1;

      $.post("/store/member/getcode",
        {

          phoneNum: mobile,

        }, function (result) {

          if (result.status == 0) {
            $("#check_user").css('display', 'none');
            $("#sms_code").css('display', 'none');
            code_status = 1;
          } else {
            $("#sms_code").css('display', 'block');
          }

        })

      if (time_status == 0) {
        $("#hsbtn").removeAttr("onclick");
        interval1 = setInterval("outTime()", 1000);
      }
      $("#check_user").css('display', 'none');

    }

  })
}

function outTime() {

  time_status = 1;

  $("#hsbtn").text("在" + time + "秒后点此重发");
  time--;
  if (time < 1) {
    time_status = 0;
    time = 59;
    $("#hsbtn").attr("onclick", "addmember_checkuser();");
    $("#hsbtn").text("重发短信验证码");
    clearInterval(interval1);
  }

}

/**
 * 添加标签
 * @param lable
 */
function selectTable(obj) {
  var txt = obj.innerHTML;

  txt = txt.replace(/<.+?>/g, '');

  var tag = $('#member_tag').val();
  //是否存在注释
  var index = txt.indexOf('（');
  if (index > 0) {
    txt = txt.substr(0, index);
  }
  console.log(txt);
  //是否存在
  var find_index = tag.indexOf(txt);

  if (!(find_index >= 0)) {
    if (tag.length > 0) {
      $('#member_tag').val(tag + ',' + txt);
    } else {
      $('#member_tag').val(txt);
    }

  }

}


/**
 * 添加会员
 */
function addmember() {

  var member_mobile = $("#member_mobile").val();
  var member_code = $("#member_code").val();
  var member_name = $("#member_name").val();
  var member_sex = $('[name="member_sex"]:checked').val();
  var invite_code = isExist($("#invite_code").val());
  var member_idcard = isExist($("#member_idcard ").val());
  var birthday = isEmpty($("#birthday ").val()) ? undefined : parseDate($("#birthday ").val());
  var member_email = isExist($("#member_email").val());
  var member_qq = isExist($("#member_qq").val());
  var country = 1;
  var province = isEmpty($("#province").val()) ? undefined : parseInt($("#province").val());
  var city = isEmpty($("#city").val()) ? undefined : parseInt($("#city").val());
  var area = isEmpty($("#area").val()) ? undefined : parseInt($("#area").val());
  // var store_citys  = $("#store_citys").val();
  // var address_show  = $("#address_show").val();
  var member_address = isExist($("#member_address").val());
  var integrate = isEmpty($("#integrate").val()) ? 0 : parseInt($("#integrate").val());
  var member_vcard = isExist($("#member_vcard").val());
  var member_vcardt = isExist($("#member_vcardt").val());
  var member_tag = isExist($("#member_tag").val());
  var member_mark = isExist($("#member_mark").val());

  if (integrate < 0) {
    integrate = 0;
  }

  if (isEmpty(member_mobile)) {
    $("#addReturn").html("手机号不能为空");
  } else if (!verfiyMobile(member_mobile)) {
    $("#addReturn").html("手机号格式不对");
  } else if (code_status == 0) {
    $("#addReturn").html("未获取验证码");
  } else if (code_status == 2) {
    $("#addReturn").html("该手机号已经被注册");
  } else if (isEmpty(member_code)) {
    $("#addReturn").html("验证码不能为空");
  }
  // else if(!verfiyCode(member_code)){
  //   $("#addReturn").html("验证码是4到6位的数字");
  // }
  else if (isEmpty(member_name)) {
    $("#addReturn").html("姓名不能为空");
  } else if (isEmpty(member_sex)) {
    $("#addReturn").html("请选择性别");
  } else if (!isEmpty(birthday) && birthday.getTime() > (new Date()).getTime()) {
    $("#addReturn").html("出生日期选择请勿大于今天的日期");
  } else if (!isEmpty(invite_code) && !verfiyInvitCode(invite_code)) {
    $("#addReturn").html("邀请码请输入五位数字，前后不允许有空格");
  } else if (!isEmpty(member_idcard) && !verfiyIdCard(member_idcard)) {
    $("#addReturn").html("身份证格式不对");
  } else if (!isEmpty(member_email) && !verfiyEmail(member_email)) {
    $("#addReturn").html("邮箱地址格式不对");
  } else if (!isEmpty(member_qq) && !verfiyQQ(member_qq)) {
    $("#addReturn").html("qq格式不对");
  } else {

    $("#addReturn").html('<tr><td colspan="8" style="text-align:center;">会员正在添加中。。。</td></tr>');

    $.post(
      "/store/member/addmemberinfo",
      {
        mobile: member_mobile,
        mobile_code: member_code,
        name: member_name,
        sex: member_sex,
        invite_code: invite_code,
        register_clerks: isExist(register_clerks),
        idcard_number: member_idcard,
        birthday: birthday,
        email: member_email,
        qq: member_qq,
        country: 1,
        province: province,
        city: city,
        area: area,
        // store_citys  : store_citys,
        // address_show  : address_show,
        address: member_address,
        integrate: integrate,
        membership_number: member_vcard,
        barcode: member_vcardt,
        tag: member_tag,
        memo: member_mark
      },
      function (result) {

        if (result.status == 1) {

          $("#addReturn").html("添加成功");

          setTimeout(function () {//两秒后跳转
            location.href = "/store/member/index";
          }, 3000);

        } else if (result.status == 2) {

          $("#addReturn").html("验证码错误");

        } else if (result.status == 3) {

          $("#addReturn").html("商户信息有误，请刷新或者重新登录");

        } else if (result.status == 4) {

          $("#addReturn").html("该手机号已经被注册");

        } else if (result.status == 5) {
          $("#addReturn").html("添加失败,该邀请码不纯在")
        } else {

          $("#addReturn").html("添加失败，系统通讯异常");

        }
      })
  }


}






