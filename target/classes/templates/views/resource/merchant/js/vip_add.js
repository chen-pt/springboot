/**
 * Created by aaron 2017/3/19.
 */

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

  getArea(parent_id_default,province_type);
  /**
   * 添加会员提交事件
   */
  $("#add_sure").click(function () {
    addmember();
  })


})

/**
 * 检验手机号是否被注册
 */
function addmember_checkuser() {

  var mobile = $("#member_mobile").val();

  // $.post("/store/member/checkMobile",{
  //   mobile:mobile,
  // },function (result) {
  //
  //   if(result.status ==true || result.status=='true' ||  result.status=='TRUE'){
  //
  //     code_status = 2;
  //
  //   }else{
  //
  //     code_status = 1;
  //
  //   }
  //
  // })

  $.ajax({
    type: "post",

    url: "/store/member/checkMobile",

    cache:false,

    async:false,

    data: {
      "mobile":mobile
    },

    success: function(result){
      if(result.status ==true || result.status=='true' ||  result.status=='TRUE'){

        code_status = 2;

      }else{

        code_status = 1;

      }
    }
  });
}


/**
 * 添加标签
 * @param lable
 */
function selectTable(obj)
{
  var txt = obj.innerHTML;

  txt = txt.replace(/<.+?>/g,'');

  var tag = $('#member_tag').val();
  //是否存在注释
  var index = txt.indexOf('（');
  if(index > 0)
  {
    txt = txt.substr(0,index);
  }
  console.log(txt);
  //是否存在
  var find_index = tag.indexOf(txt);

  if(!(find_index>=0))
  {
    if(tag.length>0)
    {
      $('#member_tag').val(tag+','+txt);
    }else{
      $('#member_tag').val(txt);
    }

  }

}


/**
 * 添加会员
 */
function addmember() {

  var storeAdminext_id = "";
  if (typeof($("#member_code").val())!="undefined" && typeof($("#storeAdminext_id").val()) !="undefined") {
    if($.trim($("#member_code").val())!=""){
      storeAdminext_id = $("#storeAdminext_id").val();
    }
  }

  var storeName = $("#storeName").val();
  var register_stores =$(".store_list").attr("data-id");
  var member_mobile = $("#member_mobile").val();
  var member_name  = $("#member_name").val();
  var member_sex  = isEmpty($("[name='member_sex']:checked").val())? 3 : parseInt($("[name='member_sex']:checked").val());
  var member_idcard  = isExist($("#member_idcard ").val());
  var birthday  = isEmpty($("#birthday ").val()) ? undefined : parseDate($("#birthday ").val());
  var member_email  =isExist($("#member_email").val());
  var member_qq  = isExist($("#member_qq").val());
  var country = 1;
  var province = isEmpty($("#province").val())? undefined : parseInt($("#province").val());
  var city = isEmpty($("#city").val())? undefined : parseInt($("#city").val());
  var area = isEmpty($("#area").val())? undefined : parseInt($("#area").val());
  var member_address  = isExist($("#member_address").val());
  var member_vcard  = isExist($("#member_vcard").val());
  var member_vcardt  =isExist($("#member_vcardt").val());
  var integrate = isExist($("#integrate").val());
  var member_tag  =isExist($("#member_tag").val());
  var member_mark  =isExist($("#member_mark").val());
  var ban_status = isEmpty($("#ban_status").val())? undefined : parseInt($("#ban_status").val());
  var status = (ban_status==0) ? 0 : 20;

  var dateNow = new Date();
  //var  date1arr = birthday.split("-");
  //var date1 = new Date();
  //date1.setFullYear(1993,10,10);
  //alert(date1);

  var bo=/^(\d{6})(18|19|20)?(\d{2})([01]\d)([0123]\d)(\d{3})(\d|X)?$/.test(member_idcard);
  if(bo == true){
    var year = member_idcard. substr(6,4);
    var month = member_idcard. substr(10,2);
    var day = member_idcard. substr(12,2);
  }


  if(isEmpty(member_mobile)){
    $("#addReturn").html("手机号不能为空");
  }else if(member_mobile && !member_mobile.match(/1[3|4|5|7|6|8][0-9]{9}$/ig)){
    $("#addReturn").html("手机号码不正确");
  }else{
    addmember_checkuser();


    if (code_status ==2){
      $("#addReturn").html("该手机号已经被注册");
    }else if(isEmpty(member_name)){

      $("#addReturn").html("姓名不能为空");

    }else if(member_email && !member_email.match(/\w+@\w+\.\w+/ig)){
      $("#addReturn").html("邮箱地址不正确");
    }else if(member_idcard && (bo==false||month>12||day>31)){
      $("#addReturn").html("身份证号码不正确");
    }else if(birthday > dateNow){
      $("#addReturn").html("出生日期不正确");
    }else if(member_sex == 3){
      $("#addReturn").html("请填写性别");
    }else{

      $("#addReturn").html('<tr><td colspan="8" style="text-align:center;">会员正在添加中。。。</td></tr>');

      $.post(
        "/merchant/vipAdd",
        {
          register_stores : register_stores,
          mobile : member_mobile,
          name : member_name,
          sex : member_sex,
          idcard_number : member_idcard ,
          birthday : birthday ,
          email : member_email,
          qq : member_qq,
          country :1,
          province :province,
          city :city,
          area :area,
          // store_citys  : store_citys,
          // address_show  : address_show,
          address : member_address,
          membership_number : member_vcard,
          barcode : member_vcardt,
          tag : member_tag,
          memo : member_mark,
          integrate : integrate,
          ban_status : ban_status,
          status : status,
          storeAdminext_id : storeAdminext_id


        },
        function (result) {

          if(result.status == 1){

            $("#addReturn").html("添加成功");

            setTimeout(function(){//两秒后跳转
              location.href = "/merchant/vip_list";
            },3000);

          }else if(result.status == 2 ){

            $("#addReturn").html("验证码错误请重新获取");

          }else if(result.status == 3){

            $("#addReturn").html("商户信息有误，请刷新或者重新登录");

          }else if (result.status ==4){

            $("#addReturn").html("该手机号已经被注册");

          }else {

            $("#addReturn").html("添加失败");

          }
        })
    }

  }



}

/**
 * Created by admin on 2017/3/13.
 */
$(function () {
  getstores(0);

  // $('#store_list').select2({
  //   placeholder: '请选择门店',
  //   allowClear: true,
  //   "language": {
  //     "noResults": function(){
  //       return "暂无数据";
  //     }
  //   }
  // }); // 初始化插件
  // $('#store_list').on('change',function () {
  //   var name = $(this).val();
  //   $('#store_name').val(name);
  //   $('#store_name_1').val(name);
  // });
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


