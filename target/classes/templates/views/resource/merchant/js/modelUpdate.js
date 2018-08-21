

$(document).ready(function(){


  $.ajax({
    type:'get',
    url:'/jk51b/goods/queryState',
    dataType: 'json',
    success: function(data){
      if(data.status == "ok"){

        $.each(data.results.items, function(e,items) {

          if(items.detail_tpl=="药品类模板"){

            $("#1").html("药品模板");
            if(items.allow_add==1){
              $("#allowadd_10").prop("checked", true);
            }
            if(items.allow_update==1){
              $("#allowupdate_10").attr("checked", true);
            }
          }else if(items.detail_tpl=="保健品模板"){
            $("#2").html("保健品模板");
            if(items.allow_add==1){
              $("#allowadd_40").prop("checked", true);
            }
            if(items.allow_update==1){
              $("#allowupdate_40").attr("checked", true);
            }
          }else if(items.detail_tpl=="化妆品模板"){
            $("#3").html("化妆品模板");
            if(items.allow_add==1){
              $("#allowadd_60").prop("checked", true);
            }
            if(items.allow_update==1){
              $("#allowupdate_60").attr("checked", true);
            }
          }else if(items.detail_tpl=="消毒类模板"){
            $("#4").html("消毒品模板");
            if(items.allow_add==1){
              $("#allowadd_80").prop("checked", true);
            }
            if(items.allow_update==1){
              $("#allowupdate_80").attr("checked", true);
            }
          }else if(items.detail_tpl=="器械类模板"){
            $("#5").html("医疗器械模板");
            if(items.allow_add==1){
              $("#allowadd_30").prop("checked", true);
            }
            if(items.allow_update==1){
              $("#allowupdate_30").attr("checked", true);
            }
          }else if(items.detail_tpl=="中药材模板"){
            $("#6").html("中药模板");
            if(items.allow_add==1){
              $("#allowadd_70").prop("checked", true);
            }
            if(items.allow_update==1){
              $("#allowupdate_70").attr("checked", true);
            }
          }else{
            $("#7").html("其他模板");
            if(items.allow_add==1){
              $("#allowadd_20").prop("checked", true);
            }
            if(items.allow_update==1){
              $("#allowupdate_20").attr("checked", true);
            }
          }
        });
      }
    },
    error:function(){
      console.log("error ....");
    }
  });
  
  function _save() {

  }

});

