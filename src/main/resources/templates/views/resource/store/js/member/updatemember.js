/**
 * Created by aaron 2017/3/19.
 */

var area_status = 1;

var old_name = "";
var old_member_sex = "";

$(function () {

  $("title").html("修改会员");

  $('#addReturnModal').on('okHide', function(e){console.log('okHide')})
  $('#addReturnModal').on('okHidden', function(e){console.log('okHidden')})
  $('#addReturnModal').on('cancelHide', function(e){console.log('cancelHide')})
  $('#addReturnModal').on('cancelHidden', function(e){console.log('cancelHidden')})

  getMember();

  checkPermission();

  /**
   * 更新会员提交事件
   */
  $("#add_sure").click(function () {
    updateMember();
  })

})

function getMember() {

  $.post("/store/member/getmember",{
    member_id : parseInt(getUrlMemberId())
  },function (result) {

    if(result.status == 0){
      window.location.href = "/store/member/index";
    }else{
      $("#member_mobile").val(result.data.member.mobile);
      $("#member_name").val(result.data.member.name);
      old_name = result.data.member.name;

      //性别显示判断
      if(result.data.member.sex == 0){
        old_member_sex = '0';
        $("#sex_0").addClass("checked");
        $("#sex_0").find("[name='member_sex']").checked;
      }else if(result.data.member.sex == 1){
        old_member_sex = '1';
        $("#sex_1").addClass("checked");
        $("#sex_1").find("[name='member_sex']").checked;
      }

      $("#member_mark").text( isEmpty(result.data.member.memo) ? "" : result.data.member.memo );
      $("#member_idcard").val( result.data.member.idcard_number);
      $("#member_email").val( result.data.member.email);


      $("#invite_code").val( (isEmpty(result.data.memberInfo.invite_code) ? "" : (result.data.memberInfo.invite_code.indexOf("_") > 0 ? result.data.memberInfo.invite_code.split("_")[1] :result.data.memberInfo.invite_code )));
      $("#birthday").val( isEmpty(result.data.memberInfo.birthday) ? "" : FormatDate(result.data.memberInfo.birthday) );
      $("#member_qq").val( result.data.memberInfo.qq);

      //省市区显示判断
      if( result.data.memberInfo.province != 0 ){
        getArea(parent_id_default,province_type);
        city_post.done(function(){

           $("#province").val(result.data.memberInfo.province);

          if(result.data.memberInfo.city != 0){
            getArea(result.data.memberInfo.province,city_type);
            city_post.done(function(){

              $("#city").val(result.data.memberInfo.city);

              if(result.data.memberInfo.area !=0){
                getArea(result.data.memberInfo.city,area_type);
                city_post.done(function(){

                  $("#area").val(result.data.memberInfo.area);

                })
              }else{
                getArea(result.data.memberInfo.city,area_type);
              }

            })

          }else{
            getArea(result.data.memberInfo.province,city_type);
          }

        })
      }else{
        getArea(parent_id_default,province_type);
      }

      $("#member_address").val( result.data.memberInfo.address);
      $("#surplus-integrate").text(isEmpty(result.data.member.integrate) ? 0 : result.data.member.integrate);
      $("#member_vcard").val( result.data.memberInfo.membership_number);
      $("#member_vcardt").val( result.data.memberInfo.barcode )
      $("#member_tag").text( isEmpty(result.data.memberInfo.tag) ? "" : result.data.memberInfo.tag );

      /**
       * 如果会员info表有误，更新时将没有id，无法识别身份
       */

      $("#udp").html("<input id='member_id' type='text' value='"+ result.data.member.member_id + "' hidden>" +
        " <input id='site_id' type='text' value='"+ result.data.member.site_id +"' hidden>" +
        " <input id='buyer_id' type='text' value='"+ result.data.member.buyer_id +"' hidden>");
    }
  })
  
}

function FormatDate (strTime) {
  var date = new Date(strTime);
  return date.getFullYear()+"-"+ ((date.getMonth()+1)>9 ? (date.getMonth()+1) : '0'+ (date.getMonth()+1))+"-"+(date.getDate()>9 ? date.getDate() : '0'+ date.getDate()) ;
}

/**
 * 获取url中的member_id
 * @returns {*}
 */
function getUrlMemberId() {

  var url = window.location.href;
  var strs = url.split("/");

  return strs[strs.length-1];
  
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
 * 更新会员
 */
function updateMember() {



  var member_id = $("#member_id").val();
  var buyer_id = $("#buyer_id").val();
  var site_id = $("#site_id").val();
  var member_mobile = $("#member_mobile").val();
  var member_name = $("#member_name").val();
  var member_sex = $('[name="member_sex"]:checked').val();
  var member_idcard = $("#member_idcard ").val();
  var birthday = isEmpty($("#birthday ").val()) ? undefined : parseDate($("#birthday ").val());
  var member_email = $("#member_email").val();
  var member_qq = $("#member_qq").val();
  var country = $("#country").val();
  var province = $("#province").val();
  var city = $("#city").val();
  var area = $("#area").val();
  var other = $("#other").val();

  var integrate = isEmpty($("#integrate").val()) ? "0" : $("#integrate").val();
  var surplus_integrate = isEmpty($("#surplus-integrate").text()) || $("#surplus-integrate").text().length==0  ? 0 : parseInt($("#surplus-integrate").text().trim());

  var member_address = $("#member_address").val();
  var member_vcard = $("#member_vcard").val();
  var member_vcardt = $("#member_vcardt").val();
  var member_tag = $("#member_tag").val();
  var member_mark = $("#member_mark").val();

  if(isEmpty(member_sex)){
    if(isEmpty(old_member_sex)){
      $("#addReturn").html("请选择性别");
      return;
    }else {
      member_sex = old_member_sex;
    }
  }

  if(!isEmpty(birthday) && birthday.getTime() > (new Date()).getTime() ){
    $("#addReturn").html("出生日期请勿选择大于今天的日期");
    return;
  }else if(!isEmpty(member_idcard) && !verfiyIdCard(member_idcard)){
    $("#addReturn").html("身份证格式不对");
    return;
  }else if(!isEmpty(member_email) && !verfiyEmail(member_email)){
    $("#addReturn").html("邮箱地址格式不对");
    return;
  }else if(!isEmpty(member_qq) && !verfiyQQ(member_qq)){
    $("#addReturn").html("qq格式不对");
    return;
  }


  if(isEmpty(member_name)){
    $("#addReturn").html("名字不能为空");
  }else if(isEmpty(member_id) || isEmpty(site_id) || isEmpty(buyer_id)){

    $("#addReturn").html("检测到未识别的会员ID，请刷新重试或联系客服");

    setTimeout(function(){//两秒后跳转
      location.href = "/store/member/index";
    },2000);

  }else{

    $("#add_sure").unbind("click");

    $("#addReturn").html('<tr><td colspan="8" style="text-align:center;">会员正在更新中。。。</td></tr>');

    var im = "0";

    if(parseInt(integrate) != 0 && ( surplus_integrate + parseInt(integrate)) >= 0){

      var type = true;
      if(parseInt(integrate) < 0){
        type = false;
      }

      $.ajax({
        async: false,
        url: "/common/integralModify",
        method: 'post',
        data: {
          type : type,
          value : Math.abs(parseInt(integrate)),
          buyerId : buyer_id,
        },
        success: function(result) {
          im = result.status;
        },
        error: function(result) {
          im = "error";
        }
      });

      if(im != "success"){
        $("#addReturn").html('<tr><td colspan="8" style="text-align:center;">会员积分更新失败，刷新重试，或联系客服</td></tr>');
        return;
      }

    }else if(parseInt(integrate) == 0){

    }else{
      $("#addReturn").html("<tr><td colspan='8' style='text-align:center;'>剩余积分不足</td></tr>");
      return;
    }

    $.post(
      "/store/member/updatememberinfo",
      {
        member_id : parseInt(member_id),
        buyer_id : buyer_id,
        site_id : site_id,
        name : member_name,
        sex : isExist(member_sex),
        idcard_number : isExist(member_idcard ),
        birthday : birthday,
        email : isExist(member_email),
        qq : isExist(member_qq),
        country :0,
        province : (isEmpty(province) ? undefined : parseInt(province)),
        city : (isEmpty(city) ? undefined : parseInt(city)),
        area : (isEmpty(area) ? undefined : parseInt(area)),
        address : isExist(member_address),
        membership_number : isExist(member_vcard),
        barcode : isExist(member_vcardt),
        tag : isExist(member_tag),
        memo : isExist(member_mark)
      },
      function (result) {

        if(result.status == 1){

          $("#addReturn").html("更新成功");
          setTimeout(function(){//两秒后跳转
            location.href = "/store/member/index";
          },3000);

        }else{

          $("#add_sure").click(function () {
            updateMember();
          })
          $("#addReturn").html("更新失败");

        }
      })
  }

}






