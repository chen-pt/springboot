/**
 * Created by qingshan on 2017/3/28.
 */
var curCategory ;
getCategory();
//选择分类
$("#lee_add_classify a").live("click",function(){

  $("#lee_add_classify_a").html('<i class="caret"></i>'+($(this).html().replace('<i class="sui-icon icon-angle-right pull-right"></i>',"")));
  $("input[name='classify']").val($(this).attr("data"));
});

function getCategory(){

  curCategory = $.ajax({
    type: 'post',
    url: "./cats",
    dataType: 'json',
    success:function(data){
      console.log(data);
      var data=data.ybCategoryList;
      console.log(data);
      $("#lee_add_classify").html();
      for(var i=0,len=data.length;i<len;i++)
      {
        if(data[i].cate_code==$('input[name="classify"]').val())$("#lee_add_classify_a").html('<i class="caret"></i>'+data[i].cate_name);
        if(data[i].subYbCategory.length>0)
        {
          $("#lee_add_classify").append('<li role="presentation" class="dropdown-submenu"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="'+data[i].cate_code+'"><i class="sui-icon icon-angle-right pull-right"></i><span style="margin-right:8px">'+data[i].cate_name+'</span></a><ul class="sui-dropdown-menu"><ul></li>');
          for(var j=0,j_len=data[i].subYbCategory.length;j<j_len;j++)
          {
            if(data[i].subYbCategory[j].cate_code==$('input[name="classify"]').val())$("#lee_add_classify_a").html('<i class="caret"></i>'+data[i].subYbCategory[j].cate_name);
            if(data[i].subYbCategory[j].subYbCategory.length>0)
            {
              $("#lee_add_classify>li:eq("+i+")>ul").append('<li role="presentation" class="dropdown-submenu"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="'+data[i].subYbCategory[j].cate_code+'"><i class="sui-icon icon-angle-right pull-right"></i><span style="margin-right:8px">'+data[i].subYbCategory[j].cate_name+'</span></a><ul class="sui-dropdown-menu"></ul></li>');
              for(var k=0,k_len=data[i].subYbCategory[j].subYbCategory.length;k<k_len;k++)
              {
                if(data[i].subYbCategory[j].subYbCategory[k].cate_code==$('input[name="classify"]').val())$("#lee_add_classify_a").html('<i class="caret"></i>'+data[i].subYbCategory[j].subYbCategory[k].cate_name);
                $("#lee_add_classify>li:eq("+i+")>ul>li:eq("+j+")>ul").append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="'+data[i].subYbCategory[j].subYbCategory[k].cate_code+'">'+data[i].subYbCategory[j].subYbCategory[k].cate_name+'</a></li>');
              }
            }else{
              $("#lee_add_classify>li:eq("+i+")>ul").append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="'+data[i].subYbCategory[j].cate_code+'">'+data[i].subYbCategory[j].cate_name+'</a></li>');
            }
          }
        }else{
          $("#lee_add_classify").append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="'+data[i].cate_code+'">'+data[i].cate_name+'</a></li>');
        }

      }
      $("#lee_add_classify").prepend('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="">所有分类</a></li>');
      return;
    },
    error:function(){
      console.log("error ....");
    }
  })
}
