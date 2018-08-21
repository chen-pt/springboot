$(function(){

  $(".upload").click(function(event){

      var date_type = $(this).attr("data-type");
      var fileid = "";
      var formname = "";
      if(date_type==="ali"){
        fileid = "ali-file";
        formname = "ali-file-form";
      }else if(date_type==="wx"){
        fileid = "wx-file";
        formname = "wx-file-form";
      }else if(date_type==="ali-refund"){
        fileid = "ali-refund-file";
        formname = "ali-refund-file-form";
      }else if(date_type==="wx-refund"){
        fileid = "wx-refund-file";
        formname = "wx-refund-file-form";
      }else if(date_type==="ali-debit"){
        fileid = "ali-debit-file";
        formname = "ali-debit-file-form";
      }else if(date_type==="wx-debit"){
        fileid = "wx-debit-file";
        formname = "wx-debit-file-form";
      }

      var file = $("#"+fileid).val();

      if(file=='' || file==null){
        alert("请选择文件后再点击上传");
        return;
      }

      var formData = new FormData($("#"+formname)[0]);
      formData.append('type', date_type);
      formData.append('filename', date_type);

      $.ajax({
        type:"POST",
        url:"../jk51b/account_import_ajax",
        data:formData,
        //async: false,
        cache: false,
        contentType: false,
        processData: false,
        success:function(data){
          if(data.status==="OK"){
            alert("文件上传成功");
          }else{
            alert(data.errorMessage);
          }
        }
      });

  });

  $(".pay-record").click(function(){
    $("#pay-record").addClass("active");
    $("#refund-record").removeClass("active");
    $("#debit-record").removeClass("active");
  })
  $(".refund-record").click(function(){
    $("#refund-record").addClass("active");
    $("#debit-record").removeClass("active");
    $("#pay-record").removeClass("active");

  })
  $(".debit-record").click(function(){
    $("#debit-record").addClass("active");
    $("#pay-record").removeClass("active");
    $("#refund-record").removeClass("active");
  })

})
