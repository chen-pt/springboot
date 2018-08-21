$(function(){

  var totalNum = 0;
  var pagesize = 10;
  var curPage = 1;
  var categoriesData={};






  //选择分类
  $("#lee_add_classify a").live("click",function(){
    $("#lee_add_classify_a").html('<i class="caret"></i>'+($(this).html().replace('<i class="sui-icon icon-angle-right pull-right"></i>',"")));
    $("[name='classify']").val($(this).attr("data"));
  });

  $("#search_btn").click(function(){
    getgoodsList(1,true);
  });


  //回调查询商品列表
  getCats(getgoodsList);


  //查询所有的商品分类
  function getCats(callBack){

    $.ajax({
      type: 'post',
      url: "/jk51b/goods/cats",
      dataType: 'json',
      success:function(data){

        //回调
        callBack();

        if(data==null)return;
        var data=data.ybCategoryList;
        categoriesData = data;
        // console.log(data);
        $("#lee_add_classify").html("");
        $("#lee_add_classify").append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="">所有分类</a></li>');
        for(var i=0,len=data.length;i<len;i++)
        {
          if(data[i].cate_id==$('input[name="classify"]').val())$("#lee_add_classify_a").html('<i class="caret"></i>'+data[i].cate_name);
          if(data[i].subYbCategory)
          {
            $("#lee_add_classify").append('<li role="presentation" class="dropdown-submenu"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="'+data[i].cate_id+'"><i class="sui-icon icon-angle-right pull-right"></i><span style="margin-right:8px">'+data[i].cate_name+'</span></a><ul class="sui-dropdown-menu"><ul></li>');
            for(var j=0,j_len=data[i].subYbCategory.length;j<j_len;j++)
            {
              if(data[i].subYbCategory[j].cate_id==$('input[name="classify"]').val())$("#lee_add_classify_a").html('<i class="caret"></i>'+data[i].subYbCategory[j].cate_name);
              if(data[i].subYbCategory[j].subYbCategory)
              {
                $("#lee_add_classify>li:eq("+i+")>ul").append('<li role="presentation" class="dropdown-submenu"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="'+data[i].subYbCategory[j].cate_id+'"><i class="sui-icon icon-angle-right pull-right"></i><span style="margin-right:8px">'+data[i].subYbCategory[j].cate_name+'</span></a><ul class="sui-dropdown-menu"></ul></li>');
                for(var k=0,k_len=data[i].subYbCategory[j].subYbCategory.length;k<k_len;k++)
                {
                  if(data[i].subYbCategory[j].subYbCategory[k].cate_id==$('input[name="classify"]').val())$("#lee_add_classify_a").html('<i class="caret"></i>'+data[i].subYbCategory[j].subYbCategory[k].cate_name);
                  $("#lee_add_classify>li:eq("+i+")>ul>li:eq("+j+")>ul").append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="'+data[i].subYbCategory[j].subYbCategory[k].cate_id+'">'+data[i].subYbCategory[j].subYbCategory[k].cate_name+'</a></li>');
                }
              }else{
                $("#lee_add_classify>li:eq("+i+")>ul").append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="'+data[i].subYbCategory[j].cate_id+'">'+data[i].subYbCategory[j].cate_name+'</a></li>');
              }
            }
          }else{
            $("#lee_add_classify").append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="'+data[i].cate_id+'">'+data[i].cate_name+'</a></li>');
          }

        }
        return;
      },
      error:function(){
        console.log("error ....");
      }
    })



  }

  //查询商品列表
function getgoodsList(currentPage,isSelect) {


  var pageSize=15;
  var datas = {};
  if(isSelect){

    //商品名称
    datas.drug_name = $("input[name='search_input']").val();

    //分类的id
    var classify = $("input[name='classify']").val();
    datas.cate_id = classify > 0 ? classify : "";

    //商品状态
    var statusStr = $("#drop12").find("span").text();

    datas.status = "-1";
    if(statusStr==="上架"){
      datas.status = "1";
    }else if(statusStr==="下架"){
      datas.status = "2";
    }
  }

  datas.page = isNaN(currentPage)?1:currentPage;
  datas.pageSize = pageSize;

  $.ajax({
    type: 'POST',
    url: "./query",
    data:datas,
    dataType: 'json',
    success: function(data){
      // console.log(data,'444444444444444');

      if(!data.status){
        return ;

      }
      var result = data.result;
      totalNum = result.total_items;
      console.log(totalNum);
      $("#product_table").empty();
      for (var i=0;i<result.items.length;i++){
        var goods=result.items[i];

        var cate_id = goods.cate_id;
        var parent_id = goods.parent_id;
        var first_category_id = goods.first_category_id;
        var cateInfo = {};
        cateInfo = getCname(cate_id,parent_id,first_category_id);
        /*商品类别end*/
        var def_url =goods.def_url;
        var imageId= "";
        if(def_url){
          imageId = def_url.hash;
        }

        var imageIdurl=imageId!=""?imgLink(imageId,100,100,'.jpg'):'/templates/views/resource/merchant/img/empty.jpg';
        $("#product_table").append("<tr>" +
          "<td>" +
          "<label data-toggle='checkbox' class='checkbox-pretty inline'>" +
          "<input type='checkbox' name='gid' value='"+goods.goods_id+"'>" +
          "<span>" +
          "<img class='product_img'' src='"+imageIdurl+"' /></span>" +
          // "</label></td><td style='word-break: break-all;'>"+goods.goods_title+"</td>" +
          "<td style='word-break: break-all;'>"+goods.drug_name+"</td>" +
          "<td style='word-break: break-all;'>"+goods.approval_number+"</td>" +
          "<td style='word-break: break-all;'>"+goods.specif_cation+"</td>" +
          "<td style='word-break: break-all;'>"+(goods.cate_name==null?'':goods.cate_name)+"</td>" +
          "<td style='word-break: break-all;'>"+(goods.delist_time=="0000-00-00 00:00:00"?"上架":"下架")+"</td>" +
          "<td>" +
          "<a class='sui-btn change_classify_btn' gidTitle ='"+goods.goods_title+"' cateIds='"+cateInfo.cateids+"'  gid='"+goods.goods_id+"' data-toggle='modal' data-target='#change_classify' data-backdrop='static'>修改分类</a></td></tr>");
      }
      $("#product_table").append('<tr><td colspan="16"><span class ="pageinfo" style="float: right"></span></td></tr>');

      $('.pageinfo').pagination({
        pages: result.total_pages,
        styleClass: ['pagination-large'],
        showCtrl: true,
        displayPage: 8,
        currentPage: result.current,
        onSelect: function (num) {
          curPage = num;
          getNum();
          getgoodsList(num,false);
        }
      });
      getNum();
      $('.select_all_btn').attr("checked", false);
      $('.select_all_btn').parent().removeClass("checked");
    },
    error:function(){
      console.log("error ....");
    }
  });
}

//获取商品分类
  function getCname(cate_id,parent_id,first_category_id){
    var fname="";
    var pname="";
    var cateName = "";

    for(var i=0,len=categoriesData.length;i<len;i++){

      if(categoriesData[i].cate_id==first_category_id){
        fname = categoriesData[i].cate_name;
      }

      for(var k=0,klen=categoriesData[i].subYbCategory.length;k<klen;k++){
        if(categoriesData[i].subYbCategory[k].cate_id==parent_id){
          pname = categoriesData[i].subYbCategory[k].cate_name;
        }

        for(var f=0,flen=categoriesData[i].subYbCategory[k].subYbCategory.length;f<flen;f++){
          if(categoriesData[i].subYbCategory[k].subYbCategory[f].cate_id==cate_id){
            cateName = categoriesData[i].subYbCategory[k].subYbCategory[f].cate_name;
          }

        }
      }

    }
    var cname = "";
    var cateId = "";
    if(fname){
      cname = cname+fname+">";
      cateId = cateId+first_category_id+">";
    }
    if(pname){
      cname = cname+pname+">";
      cateId = cateId+parent_id+">";
    }
    if(cateName){
      cname = cname+cateName;
      cateId = cateId+cate_id;
    }
    return {"cname":cname,"cateids":cateId};
  }

  function getNum() {
    $('.pageinfo').find('span:contains(共)').append("(" + totalNum + "条记录)");
    //页码选择
    var pagearr = [15,30,50,100];
    var pageselect = '&nbsp;<select class="page_size_select" style="width:40px">';
    $.each(pagearr, function(){

      if(this==pagesize){
        pageselect =pageselect+'<option value="'+this+'" selected>'+this+'</option>';
      }else{
        pageselect =pageselect+'<option value="'+this+'" >'+this+'</option>';
      }});
    pageselect = pageselect+'</select>&nbsp;';
    $('.pageinfo').find('span:contains(共)').prepend(pageselect);
  }

  //初始化修改分类下拉列表
  function initEditSelect(){
    $("#first_classify_qs").val("");
    $("#second_classify_qs").val("");
    $("#third_classify_qs").val("");
  }


  $.ajax({
    type: 'post',
    url: "./getgoodsClassifybyparentid",
    data:{parentId:0},
    dataType: 'json',
    success:function(result){

      if(result.status==="ERROR"){
        return;
      }
      var ybCategoryList = result.ybCategoryList;
      for(var c in ybCategoryList){
        $("#first_classify_qs").append("<option value='"+ ybCategoryList[c].cate_id +"'>"+ ybCategoryList[c].cate_name +"</option>");
      }
    },
    error:function(){
      console.log("error ....");
    }
  })

  //获取二级分类
  function getsecondClassify(cateId,initVal) {
    var parentId=cateId;
    if(parentId==-1){
      $("#second_classify_qs").empty().append("<option value='-1'>请选择"+"</option>");
      $("#third_classify_qs").empty().append("<option value='-1'>请选择"+"</option>");
    }
    $.ajax({
      type: 'post',
      url: "./getgoodsClassifybyparentid",
      data:{parentId:parentId},
      dataType: 'json',
      success:function(result){
        $("#second_classify_qs").empty().append("<option value='-1'>请选择"+"</option>");
        if(result.status==="ERROR"){
          return;
        }
        var ybCategoryList = result.ybCategoryList;
        for(var c in ybCategoryList){
          if(initVal != "" && initVal==ybCategoryList[c].cate_id)
            $("#second_classify_qs").append("<option value='"+ ybCategoryList[c].cate_id +"' selected='selected' >"+ ybCategoryList[c].cate_name +"</option>");
          else
            $("#second_classify_qs").append("<option value='"+ ybCategoryList[c].cate_id +"'>"+ ybCategoryList[c].cate_name +"</option>");
        }
      },
      error:function(){
        console.log("error ....");
      }
    })
  }

  //获取三级分类
  function getthirdClassify(cateId,initVal) {
    var parentId=cateId;
    if(parentId==-1||cateId==""){
      $("#third_classify_qs").empty().append("<option value='-1'>请选择"+"</option>");
      return;
    }
    $.ajax({
      type: 'post',
      url: "./getgoodsClassifybyparentid",
      data:{parentId:parentId},
      dataType: 'json',
      success:function(result){
        $("#third_classify_qs").empty().append("<option value='-1'>请选择"+"</option>");
        if(result.status==="ERROR"){
          return;
        }
        var ybCategoryList = result.ybCategoryList;
        for(var c in ybCategoryList){
          if(initVal != "" && initVal==ybCategoryList[c].cate_id)
            $("#third_classify_qs").append("<option value='"+ ybCategoryList[c].cate_id +"' selected='selected' >"+ ybCategoryList[c].cate_name +"</option>");
          else
            $("#third_classify_qs").append("<option value='"+ ybCategoryList[c].cate_id +"'>"+ ybCategoryList[c].cate_name +"</option>");
        }
      },
      error:function(){
        console.log("error ....");
      }
    })
  }

  $("#first_classify_qs").live("change",function () {
    var parentId=$('#first_classify_qs option:selected').val();
    if(parentId==-1){
      $("#second_classify_qs").empty().append("<option value='-1'>请选择"+"</option>");
      $("#third_classify_qs").empty().append("<option value='-1'>请选择"+"</option>");
    }
    $.ajax({
      type: 'post',
      url: "./getgoodsClassifybyparentid",
      data:{parentId:parentId},
      dataType: 'json',
      success:function(result){

        $("#second_classify_qs").empty().append("<option value='-1'>请选择"+"</option>");
        if(result.status==="ERROR"){
          return;
        }
        var ybCategoryList = result.ybCategoryList;
        for(var c in ybCategoryList){
          $("#second_classify_qs").append("<option value='"+ ybCategoryList[c].cate_id +"'>"+ ybCategoryList[c].cate_name +"</option>");
        }
      },
      error:function(){
        console.log("error ....");
      }
    })
  });

  $("#second_classify_qs").live("change",function () {
    var parentId=$('#second_classify_qs option:selected').val();
    if(parentId==-1){
      $("#third_classify_qs").empty().append("<option value='-1'>请选择"+"</option>");
    }
    $.ajax({
      type: 'post',
      url: "./getgoodsClassifybyparentid",
      data:{parentId:parentId},
      dataType: 'json',
      success:function(result){
        $("#third_classify_qs").empty().append("<option value='-1'>请选择"+"</option>");
        if(result.status==="ERROR"){
          return;
        }
        var ybCategoryList = result.ybCategoryList;
        for(var c in ybCategoryList){
          $("#third_classify_qs").append("<option value='"+ ybCategoryList[c].cate_id +"'>"+ ybCategoryList[c].cate_name +"</option>");
        }
      },
      error:function(){
        console.log("error ....");
      }
    })
  });

  $(".change_classify_btn").live("click",function(){
    initEditSelect();
    var gid = $(this).attr("gid");
    var gidTitle = $(this).attr("gidTitle");
    var cateIds = $(this).attr("cateIds");
    var cateid = cateIds.split(">");
    console.log(cateid);
    $("#first_classify_qs").val(cateid[0]);
    getsecondClassify(cateid[0],cateid[1]);
    getthirdClassify(cateid[1],cateid[2]);
    $("#change_classify  #alert_title").html("商品标题： "+gidTitle);
    $("#gls").val(gid);
  });


  //更新商品类别
  $(".change-classify-btn-qs").live("click",function () {
    var data = {};
    var gls = $("#gls").val();
    var cateId =  $("#third_classify_qs").val();
    if(cateId=="-1"){   //未选择
      cateId =  $("#second_classify_qs").val();
      if(cateId=="-1"){
        cateId =  $("#first_classify_qs").val();
      }
    }
    data.cateId = cateId;
    data.gls = gls;
    console.log(cateId);
    $.ajax({
      type:"post",
      url:"./updateGoodsCate",
      data:data,
      async: false,
      dataType:'json',
      success: function (data) {
        //location.reload();
        getgoodsList();
        $('#change_classify').modal('hide');
      },
      error:function(){
        console.log("error ....");
      }
    });
  });
})
