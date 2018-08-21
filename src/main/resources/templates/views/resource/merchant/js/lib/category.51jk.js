/**
 * Created by qingshan on 2017/3/28.
 */
var curCategory ;
getCategory();
//选择分类
$("#lee_add_classify a").live("click",function(){

  $("#lee_add_classify_a").html('<i class="caret"></i>'+($(this).html().replace('<i class="sui-icon icon-angle-right pull-right"></i>',"")));
  $("input[name='classify']").val($(this).attr("data"));
  // alert('$(this).attr("data"):'+$(this).attr("data"));
  // alert($("input[name='classify']").val());
});

function getCategory(){
  curCategory = $.ajax({
    type: 'post',
    url: "./categories",
    dataType: 'json',
    success:function(data){
      console.log(data);
      var data=data.result.children;
      console.log(data);
      $("#lee_add_classify").html("");
      for(var i=0,len=data.length;i<len;i++)
      {
        if(data[i].cateCode==$('input[name="classify"]').val())$("#lee_add_classify_a").html('<i class="caret"></i>'+data[i].cateName);
        if(data[i].children)
        {
          $("#lee_add_classify").append('<li role="presentation" class="dropdown-submenu"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="'+data[i].cateCode+'"><i class="sui-icon icon-angle-right pull-right"></i><span style="margin-right:8px">'+data[i].cateName+'</span></a><ul class="sui-dropdown-menu"><ul></li>');
          for(var j=0,j_len=data[i].children.length;j<j_len;j++)
          {
            if(data[i].children[j].cateCode==$('input[name="classify"]').val())$("#lee_add_classify_a").html('<i class="caret"></i>'+data[i].children[j].cateName);
            if(data[i].children[j].children)
            {
              $("#lee_add_classify>li:eq("+i+")>ul").append('<li role="presentation" class="dropdown-submenu"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="'+data[i].children[j].cateCode+'"><i class="sui-icon icon-angle-right pull-right"></i><span style="margin-right:8px">'+data[i].children[j].cateName+'</span></a><ul class="sui-dropdown-menu"></ul></li>');
              for(var k=0,k_len=data[i].children[j].children.length;k<k_len;k++)
              {
                if(data[i].children[j].children[k].cateCode==$('input[name="classify"]').val())$("#lee_add_classify_a").html('<i class="caret"></i>'+data[i].children[j].children[k].cateName);
                $("#lee_add_classify>li:eq("+i+")>ul>li:eq("+j+")>ul").append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="'+data[i].children[j].children[k].cateCode+'">'+data[i].children[j].children[k].cateName+'</a></li>');
              }
            }else{
              $("#lee_add_classify>li:eq("+i+")>ul").append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="'+data[i].children[j].cateCode+'">'+data[i].children[j].cateName+'</a></li>');
            }
          }
        }else{
          $("#lee_add_classify").append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="'+data[i].cateCode+'">'+data[i].cateName+'</a></li>');
        }

      }
      $("#lee_add_classify").append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="">所有分类</a></li>');
      return;
    },
    error:function(){
      console.log("error ....");
    }
  })
}
