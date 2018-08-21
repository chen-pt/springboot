/**
 * Created by boren on 15/9/2.
 * 图片选择处理
 */

define(['core'],function(core){

  var img_list_pageno = 1;

  var lee_str="";

  var tmpstatus=false;

  //显示图片空间图片
  var ShowSpaceImg = function ()
  {

    var datas={};

    datas.current_page = img_list_pageno;

    datas.per_page=10;

    var url = core.getHost()+"/admin/bshop/get_ImageLibrary_ajax";

    $("#space-pic .modal-body").empty();

    $.post(url,datas,function(e)
    {
        var data = JSON.parse(e);

        if(data && data.status)
        {
          var tmpHtml="";

          for(var i in data.result.items)
          {
            tmpHtml="<div class='pic-parent-div'>"+
            '<img src="'+data.result.items[i].imgsrc+'" class="product_img" alt="" />'
            +" </div>";
            $("#space-pic .modal-body").append(tmpHtml);
          }
          $("#space-pic .modal-body").append("<p id='pageinfo'></p>");

          $('#pageinfo').pagination({
            pages: data.result.total_pages,
            styleClass: ['pagination-large'],
            showCtrl: true,
            displayPage: 6,
            currentPage: img_list_pageno,
            onSelect: function (num) {

              img_list_pageno = num;
              ShowSpaceImg();
            }
          });

          $('#pageinfo').find('span:contains(共)').append("(" + data.result.total_items + "条记录)");

        }else{
          $("#space-pic .modal-body").append("<p>暂无图片！</p>");
        }
    });

  };
  //选择图片空间的图片
  var ImgEvents = function ()
  {
    $("#space-pic .pic-parent-div").on("click",function()
    {
      if(tmpstatus){
        tmpstatus = false;
      }else{
        $(this).find(".has-select").remove();
      }
    });

    $("#space-pic .product_img").on("click",function()
    {
      tmpstatus = true;
      console.log(lee_str[$(this).index("#space-pic .product_img")]);
      $(this).before("<div class='has-select'>√</div>");
    });
  };

  //
  return {
    ShowSpaceImg:ShowSpaceImg,
    ImgEvents:ImgEvents
  };

});
