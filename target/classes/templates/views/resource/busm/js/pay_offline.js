
var siteId =getSiteId();
var credUrl;

//加载查询
$.ajax({
  type: "post",
  url: "/jk51b/getOfflineBySiteId",
  dataType: "json",
  data:{
    "siteId":siteId,
  },
  success: function(data) {
    if(data.status==0){
      if(data.offlineMap){
        var ruleMap=data.offlineMap;
        document.getElementById('wx_app_id').value=noUndefind(ruleMap.wx_app_id);//
        document.getElementById('wx_mch_id').value=noUndefind(ruleMap.wx_mch_id);//
        document.getElementById('wx_key').value=noUndefind(ruleMap.wx_key);//
        document.getElementById('wx_appsecret').value=noUndefind(ruleMap.wx_appsecret);//
        document.getElementById('ali_app_id').value=noUndefind(ruleMap.ali_app_id);//
        document.getElementById('ali_seller_id').value=noUndefind(ruleMap.ali_seller_id);//
        document.getElementById('ali_private_key').value=noUndefind(ruleMap.ali_private_key);//
        document.getElementById('ali_public_key').value=noUndefind(ruleMap.ali_public_key);//
        document.getElementById('public_key').value=noUndefind(ruleMap.public_key);//
        document.getElementById('ali_app_auth_token').value=noUndefind(ruleMap.ali_app_auth_token);//

        if (ruleMap.status == 0) {//有效
          $("#status_disab").parent().removeClass("checked");
          $("#status_disab").attr("checked", false);
          $("#status_block").parent().addClass("checked");
          $("#status_block").attr("checked", true);
        } else {//无效
          $("#status_block").parent().removeClass("checked");
          $("#status_block").attr("checked", false);
          $("#status_disab").parent().addClass("checked");
          $("#status_disab").attr("checked", true);
        }

        if (ruleMap.wx_cert_path){
          document.getElementById("mediImg").innerHTML  = "已上传";
        }else {
          document.getElementById("mediImg").innerHTML  = "未上传";
        }
      }
      console.log(data.offlineMap);
    }
    else {
      alert("查询异常，请联系管理员")
    }
  },
  error: function() {
    console.log("请求失败！");
  }
});

//判断不显示undefind
function noUndefind(obj) {
  if (obj == undefined){
    return "";
  }else {
    return obj;
  }
}

//设置线下支付
function editOfflineBySiteId() {
  $.ajax({
    type: "post",
    url: "/jk51b/editOfflineBySiteId",
    dataType: "json",
    data:{
      "siteId":siteId,
      "wx_app_id":$("#wx_app_id").val(),
      "wx_mch_id":$("#wx_mch_id").val(),
      "wx_key":$("#wx_key").val(),
      "wx_appsecret":$("#wx_appsecret").val(),
      "wx_cert_path":credUrl,
      "ali_app_id":$("#ali_app_id").val(),
      "ali_seller_id":$("#ali_seller_id").val(),
      "ali_private_key":$("#ali_private_key").val(),
      "ali_public_key":$("#ali_public_key").val(),
      "public_key":$("#public_key").val(),
      "ali_app_auth_token":$("#ali_app_auth_token").val(),
      "status":$('input[name="offline_status"]:checked').val(),
    },
    success: function(data) {
      if(data.status==0){
        alert("编辑成功")
        location.reload();
      }
      else {
        alert("编辑出现异常，请联系技术人员")
      }
    },
    error: function() {
      console.log("请求失败！");
    }
  });
}

//获取当前商家ID
function getSiteId() {
  var url = window.location.href;
  var strs = url.split("=");
  return strs[strs.length - 1];
}



//上传证书
function upload(elementId, targetId, imgId) {
  $.ajaxFileUpload({
    url: "/common/localFileUpload",
    type: "post",
    secureuri: false, //一般设置为false
    fileElementId: elementId, // 上传文件的id、name属性名
    dataType: "JSON", //返回值类型
    success: function (result) {
      var imageUrl = result.image.url;
      credUrl = imageUrl;
      $("#" + targetId).val(imageUrl);
      $("#" + imgId).attr("src", imageUrl);
    },
    error: function (result) {
      alert("上传异常");
    }
  });
}
