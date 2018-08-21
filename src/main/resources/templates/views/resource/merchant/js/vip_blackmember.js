getMemberById();
/**
 * 获取url中的phone
 * @returns {*}
 */
function getUrlPhone() {

  var url = window.location.href;
  var strs = url.split("/");

  return strs[strs.length - 1];

}
/**
 * 会员修改、查看界面回显
 */
function getMemberById() {
  var memberId = getUrlPhone();
  $.post(
    "/merchant/getMemberById",
    {memberId: memberId},
    function (data) {
      if (data.code =="000") {
        member = data.value;
        var buyer_id = member.buyer_id;
        var member_id = member.member_id;
        var storeName = member.store_name;
        var member_mobile = member.mobile;
        var member_name = member.member_name;
        var member_sex = member.sex;
        var member_idcard = member.idcard_number;
        var birthday = member.birthday;
        var member_email = member.email;
        var member_qq = member.qq;
        var country = 1;
        var province = isEmpty(member.province) ? 0 : member.province;
        var city = isEmpty(member.city) ? 0 : member.city;
        var area = isEmpty(member.area) ? 0 : member.area;
        var member_address = member.address;
        var member_vcard = member.membership_number;
        var member_vcardt = member.barcode;
        var integrate = isEmpty(member.integrate) ? 0 : member.integrate; //剩余积分
        var member_tag = member.tag;
        var member_mark = member.memo;
        var ban_status = member.ban_status;
        var total_get_integrate = isEmpty(member.total_get_integrate) ? 0 : member.total_get_integrate; //获得积分
        var total_consume_integrate = isEmpty(member.total_consume_integrate) ? 0 : member.total_consume_integrate; //使用积分

        //alert(member);
        //if($("#register_stores_search") !=null){$("#register_stores_search").val(storeName);}
        $("#storeName").val(storeName);
        if ($("#select2-store_list-container") != null) {
          $('#store_list').select2({
            placeholder: storeName,
            allowClear: true,
            "language": {
              "noResults": function () {
                return "暂无数据";
              }
            }
          });
          //$('#store_list').val(storeName);
        }

        $("#register_stores_search").val(storeName);

        $("#member_code").val(member.inviteCode);


        $("#mobile").html(member_mobile);
        //if ($("#member_mobile") != null){$("#member_mobile").val(member_mobile);}
        $("#member_name").val(member_name);
        $('[name="sex"][value="' + member_sex + '"]').attr("checked", true);
        $('[name="sex"][value="' + member_sex + '"]').parent().addClass("checked");

        $("#member_sex").val(member_sex);
        $("#member_idcard").val(member_idcard);
        $("#birthday").val(birthday);
        $("#member_email").val(member_email);
        $("#member_qq").val(member_qq);
        $("#country").val(country);
        //$("#province").val(province);
        //$("#city").val(city);
        //$("#area").val(area);
        $("#member_address").val(member_address);
        $("#member_vcard").val(member_vcard);
        $("#member_vcardt").val(member_vcardt);
        $("#integrate_black").html("获得积分（" + total_get_integrate + ") 使用积分（" + total_consume_integrate + "） 剩余积分（" + integrate + ")");
        //if ($("#integrate") != null){$("#integrate").val(integrate);}
        $("#member_tag").html(member_tag);
        $("#member_mark").val(member_mark);
        if ($("#ban_status") != null) {
          $("#ban_status").val(ban_status);
        }
        $("#single_add").append(
          "<input type='hidden' value='" + buyer_id + "' id='buyer_id'/>" +
          "<input type='hidden' value='" + member_id + "' id='member_id'/>" +
          "<input type='hidden' value='" + storeName + "' id='storeName'/>"
        )
        //省市区显示判断
        if (province != 0) {
          getArea(parent_id_default, province_type);
          city_post.done(function () {

            $("#province").val(province);

            if (city != 0) {
              getArea(province, city_type);
              city_post.done(function () {

                $("#city").val(city);

                if (area != 0) {
                  getArea(city, area_type);
                  city_post.done(function () {

                    $("#area").val(area);

                  })
                } else {
                  getArea(city, area_type);
                }

              })

            } else {
              getArea(province, city_type);
            }

          })
        } else {
          getArea(parent_id_default, province_type);
        }
      } else {
        alert("没有查询到该会员信息");
      }
    }
  )
}
