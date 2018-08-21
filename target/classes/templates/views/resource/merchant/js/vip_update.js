var area_status = 1;
var code_status = 0;
var time_status = 0;
var time = 59;
var interval1;

$(function () {

  $('#addReturnModal').on('okHide', function(e){console.log('okHide')})
  $('#addReturnModal').on('okHidden', function(e){console.log('okHidden')})
  $('#addReturnModal').on('cancelHide', function(e){console.log('cancelHide')})
  $('#addReturnModal').on('cancelHidden', function(e){console.log('cancelHidden')})

  /**
   * 修改会员提交事件
   */
  $("#add_sure").click(function () {
    addmember();
  })

})


/**
 * 修改会员
 */
function updateMember() {

  var member_id = $("#member_id").val();
  var buyer_id = $("#buyer_id").val();
  //var site_id = $("#site_id").val();
  var register_stores =$(".store_list").attr("data-id");
  // var store_id;
  // $.post(
  //   "/merchant/storeIdByName",
  //   {storeName:store_name},
  //   function (id) {
  //     store_id=id;
  //   }
  // )
  var member_mobile = $("#member_mobile").val();
  var member_name  = $("#member_name").val();
  var member_sex  = $('[name="sex"]:checked').val();;
  var member_idcard  = $("#member_idcard ").val();
  var birthday  = $("#birthday ").val();
  var member_email  = $("#member_email").val();
  var member_qq  = $("#member_qq").val();
  var country = $("#country").val();
  var province = $("#province").val();
  var city = $("#city").val();
  var area = $("#area").val();
  var other = $("#other").val();
  var member_address  = $("#member_address").val();
  var member_vcard  = $("#member_vcard").val();
  var member_vcardt  = $("#member_vcardt").val();
  var member_tag  = $("#member_tag").val();
  var member_mark  = $("#member_mark").val();
  var ban_status = $("#ban_status").val();

  var dateNow = new Date();
  var birthdayDate = isEmpty($("#birthday ").val()) ? undefined : parseDate($("#birthday ").val());

  var storeAdminext_id = "";
  if (typeof($("#member_code").val())!="undefined" && typeof($("#storeAdminext_id").val()) !="undefined") {
    if($.trim($("#member_code").val())!=""){
      storeAdminext_id = $("#storeAdminext_id").val();
    }
  }

  var bo=/^(\d{6})(18|19|20)?(\d{2})([01]\d)([0123]\d)(\d{3})(\d|X)?$/.test(member_idcard);
  if(bo == true){
    var year = member_idcard. substr(6,4);
    var month = member_idcard. substr(10,2);
    var day = member_idcard. substr(12,2);
  }

  if(isEmpty(member_sex) && isEmpty(member_idcard) && isEmpty(birthday) && isEmpty(member_email)
    && isEmpty(member_qq) && isEmpty(province) && isEmpty(city) && isEmpty(area) && isEmpty(other) && isEmpty(member_address)
    && isEmpty(member_vcard) && isEmpty(member_vcardt) && isEmpty(member_tag) && isEmpty(member_mark) && old_name==member_name){

    $("#addReturn").html("没有信息需要更新");

    setTimeout(function(){//两秒后跳转
      location.href = "/merchant/vip_list";
    },2000);

    return;

  }
  // else if(isEmpty(member_name)){
  //   $("#addReturn").html("名字不能为空");
  // }
  else if(isEmpty(member_id) || isEmpty(buyer_id)){

    $("#addReturn").html("检测到未识别的会员ID");

    setTimeout(function(){//两秒后跳转
      location.href = "/merchant/vip_list";
    },2000);

  }else if(isEmpty(member_name)){

    $("#addReturn").html("姓名不能为空");

  }else if(member_sex == 3){
    $("#addReturn").html("请填写性别");
  }else if(member_idcard && (bo==false||month>12||day>31)){
    $("#addReturn").html("身份证号码不正确");
  }else if(birthdayDate > dateNow){
    $("#addReturn").html("出生日期不正确");
  }else if(member_email && !member_email.match(/\w+@\w+\.\w+/ig)){
    $("#addReturn").html("邮箱地址不正确");
  }else{

    $("#addReturn").html('<tr><td colspan="8" style="text-align:center;">会员正在更新中。。。</td></tr>');

    $.post(
      "/merchant/vipUpdate",
      {
        member_id : parseInt(member_id),
        buyer_id : buyer_id,
        //site_id : site_id,
        //register_stores :store_id,
        register_stores : register_stores,
        register_clerks : storeAdminext_id ? parseInt(storeAdminext_id):0,
        name : member_name,
        sex : member_sex,
        idcard_number : isExist(member_idcard ),
        birthday : (isEmpty(birthday) ? undefined : parseDate(birthday)),
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
        memo : isExist(member_mark),
        ban_status : ban_status,
        storeAdminext_id : storeAdminext_id
      },
      function (result) {

        if(result.status == 1){

          $("#addReturn").html("更新成功");

          setTimeout(function(){//两秒后跳转
            location.href = "/merchant/vip_list";
          },3000);

        }else{

          $("#addReturn").html("更新失败");

        }
      })
  }

}

/**
 * 会员加入黑名单
 */
function memberToBlack() {

  var dateNow = new Date();
  var birthdayDate = isEmpty($("#birthday ").val()) ? undefined : parseDate($("#birthday ").val());
  var member_idcard = $("#member_idcard ").val();
  var member_email = $("#member_email").val();

  var bo=/^(\d{6})(18|19|20)?(\d{2})([01]\d)([0123]\d)(\d{3})(\d|X)?$/.test(member_idcard);
  if(bo == true){
    var year = member_idcard. substr(6,4);
    var month = member_idcard. substr(10,2);
    var day = member_idcard. substr(12,2);
  }
  if(isEmpty(member_id) || isEmpty(buyer_id)){

    $("#addReturn").html("检测到未识别的会员ID");

    setTimeout(function(){//两秒后跳转
      location.href = "/merchant/vip_list";
    },2000);

  }else if(member_idcard && (bo==false||month>12||day>31)){
    alert("身份证号码不正确");
  }else if(birthdayDate > dateNow){
    alert("出生日期不正确");
  }else if(member_email && !member_email.match(/\w+@\w+\.\w+/ig)){
    alert("邮箱地址不正确");
  }else {

    var tipHtml = '<h4 style="font-weight: 200">您确定将此会员<label style="color: #FF0000;">加入黑名单</label>吗?</h4>' +
      '<div><label style="color: #FF6600;">温馨提醒：</label></div><div style="color: #FF6600;">1、加入黑名单后，会员无法进行正常购买；<br>2、加入黑名单后，保留会员之前的所有消费记录；</div>';
    //  var tipHtml = '确定删除该会员吗?';
    layer.confirm(tipHtml, {title: ['提示']}, function (idx) {

      var member_id = $("#member_id").val();
      var buyer_id = $("#buyer_id").val();
      //var site_id = $("#site_id").val();
      var store_name = ($("#store_name").val() == null || $("#store_name").val() == "") ? $("#storeName").val() : $("#store_name").val();
      // var store_id;
      // $.post(
      //   "/merchant/storeIdByName",
      //   {storeName:store_name},
      //   function (id) {
      //     store_id=id;
      //   }
      // )
      var member_mobile = $("#member_mobile").val();
      var member_name = $("#member_name").val();
      var member_sex = $('[name="sex"]:checked').val();
      ;
      var member_idcard = $("#member_idcard ").val();
      var birthday = $("#birthday ").val();
      var member_email = $("#member_email").val();
      var member_qq = $("#member_qq").val();
      var country = $("#country").val();
      var province = $("#province").val();
      var city = $("#city").val();
      var area = $("#area").val();
      var other = $("#other").val();
      var member_address = $("#member_address").val();
      var member_vcard = $("#member_vcard").val();
      var member_vcardt = $("#member_vcardt").val();
      var member_tag = $("#member_tag").val();
      var member_mark = $("#member_mark").val();
      var ban_status = -9;

      if (isEmpty(member_sex) && isEmpty(member_idcard) && isEmpty(birthday) && isEmpty(member_email)
        && isEmpty(member_qq) && isEmpty(province) && isEmpty(city) && isEmpty(area) && isEmpty(other) && isEmpty(member_address)
        && isEmpty(member_vcard) && isEmpty(member_vcardt) && isEmpty(member_tag) && isEmpty(member_mark) && old_name == member_name) {

        $("#addReturn").html("没有信息需要更新");

        setTimeout(function () {//两秒后跳转
          location.href = "/merchant/vip_list";
        }, 2000);

        return;

      }  else {

        $("#addReturn").html('<tr><td colspan="8" style="text-align:center;">会员正在更新中。。。</td></tr>');

        $.post(
          "/merchant/vipUpdate",
          {
            member_id: parseInt(member_id),
            buyer_id: buyer_id,
            //site_id : site_id,
            //register_stores :store_id,
            storeName: store_name,
            name: member_name,
            sex: member_sex,
            idcard_number: isExist(member_idcard),
            birthday: (isEmpty(birthday) ? undefined : parseDate(birthday)),
            email: isExist(member_email),
            qq: isExist(member_qq),
            country: 0,
            province: (isEmpty(province) ? undefined : parseInt(province)),
            city: (isEmpty(city) ? undefined : parseInt(city)),
            area: (isEmpty(area) ? undefined : parseInt(area)),
            address: isExist(member_address),
            membership_number: isExist(member_vcard),
            barcode: isExist(member_vcardt),
            tag: isExist(member_tag),
            memo: isExist(member_mark),
            ban_status: ban_status
          },
          function (result) {

            if (result.status == 1) {

              $("#addReturn").html("更新成功");

              setTimeout(function () {//两秒后跳转
                location.href = "/merchant/vip_list";
              }, 2000);

            } else {

              $("#addReturn").html("更新失败");

            }
          })
      }
    });
  }

}

$(function () {
  getstores(0);

  /*$('#store_list').select2({
    placeholder: '请选择门店',
    allowClear: true,
    "language": {
      "noResults": function(){
        return "暂无数据";
      }
    }
  }); // 初始化插件
  $('#store_list').on('change',function () {
    var name = $(this).val();
    $('#store_name').val(name);
    $('#store_name_1').val(name);
  });*/
});
/**
 * 获取门店列表
 * @param currentPage
 */
var getstores = function () {
  $.ajax({
    url: "/merchant/getBStoresList",
    type: "POST",
    data: {
      "pageNum": 1,
      "pageSize": 200,
    },
    success: function (data) {
      // $("#store_table").empty("");
      // var li = "<li role='presentation'><a role='menuitem' tabindex='-1' href='javascript:void(0);' value='1'>全部</a></li>";
      // var tr = "";
      // for (var i = 0; i < data.storenames.length; i++) {
      //   li += "<li role='presentation'><a role='menuitem' tabindex='-1' href='javascript:void(0);' value='1'>"
      //     + data.storenames[i] + "</a></li>";
      // }
      // for (var i = 0; i < data.storelist.length; i++) {
      //   var store = data.storelist[i];
      //   (store.type == 1) ? storetype = "直营" : storetype = "加盟";
      //   (store.storesStatus == 0) ? storeStatus = "禁用" : storeStatus = "启用";
      //   tr += "<tr><td><label data-toggle='checkbox' class='checkbox-pretty inline'><input type='checkbox' " +
      //     "name='store_id' value='" + store.id + "'><span>" + store.name + "</span></label></td>" +
      //     "<td>" + store.storesNumber + "</td><td>" + storetype + "</td><td> " + store.province + "&nbsp;&nbsp;" +
      //     store.city + "&nbsp;&nbsp;" + store.country + "&nbsp;&nbsp;" + store.address +
      //     "</td><td>" + store.tel + "</td><td>" + storeStatus + "</td><td><a href='/merchant/store_add?storeid=" + store.id + "&show=1' class='sui-btn" +
      //     " icon-pencil'><i class='sui-icon icon-search'></i></a><a href='/merchant/store_add?storeid=" + store.id + "&show=0' class='sui-btn icon-pencil'>" +
      //     "<i class='sui-icon icon-edit'></i></a></td></tr>";
      // }
      // /* $("#store_list").append(li);*/
      // $("#store_table").append(tr);

      /*  var liArr = new Array('<option></option>');

       var items = data.storelist.list;

       $.each(items,function (i , item) {
       liArr.push('</option><option value="'+item.name+'">'+item.name+'</a></option>')
       });

       var liAppend = liArr.join('');

       $("#store_list").append(liAppend);*/
      var items = data.storelist.list;

      $.each(items,function (i , item) {
        ArrNameList.push(item.name);
        ArrIdList.push(item.id);
      });

    }
  })
}


/**
 * 参数判断
 * @param res
 * @returns {*}
 */
function name(res) {
  if ("直营" == res) {
    return 1;
  } else if ("加盟" == res) {
    return 0;
  } else if ("是" == res) {
    return 1;
  } else if ("否" == res) {
    return 0;
  } else if ("启用" == res) {
    return 1;
  } else if ("禁用" == res) {
    return 0;
  } else if ("全部" == res) {
    return null;
  } else {
    return res;
  }
}


