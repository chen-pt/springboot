
function onImg(img,type){
  if(type){
    $("#uploadImgBtn").attr("onchange","upLoadImg('"+img+"','"+type+"')");
  }else {
    $("#uploadImgBtn").attr("onchange","upLoadImg('"+img+"')");
  }

  $("#uploadImgBtn").click();

}

function upLoadImg(img,type){

  $.ajaxFileUpload({
    url: "/merchant/localpictureUpload",
    type: "post",
    secureuri: false, //一般设置为false
    fileElementId: "uploadImgBtn", // 上传文件的id、name属性名
    data:{"flag":type,"file":img},
    dataType: "JSON", //返回值类型
    success: function (result) {
      console.log(result,"------------------------------------");

      if(result.code == 200){
        if(type){
          $("."+img).attr("data-icon-id",result.data.iconId);
        }

        $("."+img).attr("src",result.data.url);
      }else{
        alert("图片上传失败！")
      }

    },
    error: function (result) {
      console.log(result);
    }
  });



}
