
$(function(){
  //var cname="";
  var totalNum = 0;
  var pagesize = 15;
  var curPage = 1;
  var cid=GetQueryString("id");
  var type=GetQueryString("type");
  var categoriesData={};
  getcategories();
  $(".content").css("overflow","visible");

  var classifyname =  $("input[name='classifyname']").val();
  if(classifyname != "" && classifyname!=null){
    $("#classifyName").html(classifyname);
  }

  $("#query_pro_classify").bind("click",function(){
    curPage = 1;
    getgoodsList();
  });

  $('.page_size_select').live('change',function(){
    pagesize = $(this).val();
    getgoodsList();
  });

  $("#lee_add_classify a").live("click",function(){
    $("input[name='classify']").val($(this).attr("data"));
  });

  //回车搜索
  $(document).keyup(function(event){
    if(event.keyCode ==13){
      getgoodsList();
    }
  });

  function getcategories(){
    $.ajax({
      type: 'post',
      url: "/merchant/categories",
      dataType: 'json',
      success:function(data){
        var data=data.result.children;
        categoriesData = data;
        console.log(data);
        $("#lee_add_classify").html("");
        for(var i=0,len=data.length;i<len;i++)
        {
          if(data[i].cateId==$('input[name="classify"]').val())$("#lee_add_classify_a").html('<i class="caret"></i>'+data[i].cateName);
          if(data[i].children)
          {
            $("#lee_add_classify").append('<li role="presentation" class="dropdown-submenu"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="'+data[i].cateId+'"><i class="sui-icon icon-angle-right pull-right"></i><span style="margin-right:8px">'+data[i].cateName+'</span></a><ul class="sui-dropdown-menu"><ul></li>');
            for(var j=0,j_len=data[i].children.length;j<j_len;j++)
            {
              if(data[i].children[j].cateId==$('input[name="classify"]').val())$("#lee_add_classify_a").html('<i class="caret"></i>'+data[i].children[j].cateName);
              if(data[i].children[j].children)
              {
                $("#lee_add_classify>li:eq("+i+")>ul").append('<li role="presentation" class="dropdown-submenu"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="'+data[i].children[j].cateId+'"><i class="sui-icon icon-angle-right pull-right"></i><span style="margin-right:8px">'+data[i].children[j].cateName+'</span></a><ul class="sui-dropdown-menu"></ul></li>');
                for(var k=0,k_len=data[i].children[j].children.length;k<k_len;k++)
                {
                  if(data[i].children[j].children[k].cateId==$('input[name="classify"]').val())$("#lee_add_classify_a").html('<i class="caret"></i>'+data[i].children[j].children[k].cateName);
                  $("#lee_add_classify>li:eq("+i+")>ul>li:eq("+j+")>ul").append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="'+data[i].children[j].children[k].cateId+'">'+data[i].children[j].children[k].cateName+'</a></li>');
                }
              }else{
                $("#lee_add_classify>li:eq("+i+")>ul").append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="'+data[i].children[j].cateId+'">'+data[i].children[j].cateName+'</a></li>');
              }
            }
          }else{
            $("#lee_add_classify").append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="'+data[i].cateId+'">'+data[i].cateName+'</a></li>');
          }

        }

        $("#lee_add_classify").append('<li role="presentation"><a role="menuitem" tabindex="-1" href="javascript:void(0)" data="">所有分类</a></li>');
        getgoodsList();
        return;
      },
      error:function(){
        console.log("error ....");
      }
    })
  }

  $.ajax({
    type: 'post',
    url: "./getbyparentid",
    data:{parentId:0},
    dataType: 'json',
    success:function(result){
      var items = eval(result.data);
      for(var row in items){
        $("#first_classify_qs").append("<option value='"+ items[row].cateId +"'>"+ items[row].cateName +"</option>");
      }
      console.log($("#second_classify_qs").html());
      console.log($("#third_classify_qs").html());
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
      url: "./getbyparentid",
      data:{parentId:parentId},
      dataType: 'json',
      success:function(result){
        $("#second_classify_qs").empty().append("<option value='-1'>请选择"+"</option>");
        var items = eval(result.data);
        for(var row in items){
          if(initVal != "" && initVal==items[row].cateId)
            $("#second_classify_qs").append("<option value='"+ items[row].cateId +"' selected='selected' >"+ items[row].cateName +"</option>");
          else
            $("#second_classify_qs").append("<option value='"+ items[row].cateId +"'>"+ items[row].cateName +"</option>");
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
    if(parentId==-1){
      $("#third_classify_qs").empty().append("<option value='-1'>请选择"+"</option>");
    }
    $.ajax({
      type: 'post',
      url: "./getbyparentid",
      data:{parentId:parentId},
      dataType: 'json',
      success:function(result){
        $("#third_classify_qs").empty().append("<option value='-1'>请选择"+"</option>");
        var items = eval(result.data);
        for(var row in items){
          if(initVal != "" && initVal==items[row].cateId)
            $("#third_classify_qs").append("<option value='"+ items[row].cateId +"' selected='selected' >"+ items[row].cateName +"</option>");
          else
            $("#third_classify_qs").append("<option value='"+ items[row].cateId +"'>"+ items[row].cateName +"</option>");
        }
      },
      error:function(){
        console.log("error ....");
      }
    })
  }

  $("#first_classify_qs").live("change",function () {
    var parentId=$(this).val();
    if(parentId==-1){
      $("#second_classify_qs").empty().append("<option value='-1'>请选择"+"</option>");
      $("#third_classify_qs").empty().append("<option value='-1'>请选择"+"</option>");
    }
    $("#second_classify_qs").val("-1");
    $("#third_classify_qs").val("-1");
    $.ajax({
      type: 'post',
      url: "./getbyparentid",
      data:{parentId:parentId},
      dataType: 'json',
      success:function(result){
        $("#second_classify_qs").empty().append("<option value='-1'>请选择"+"</option>");
        var items = eval(result.data);
        for(var row in items){
          $("#second_classify_qs").append("<option value='"+ items[row].cateId +"'>"+ items[row].cateName +"</option>");
        }
      },
      error:function(){
        console.log("error ....");
      }
    })
  });

  $("#second_classify_qs").live("change",function () {
    var parentId=$(this).val();
    if(parentId==-1){
      $("#third_classify_qs").empty().append("<option value='-1'>请选择"+"</option>");
    }
    $.ajax({
      type: 'post',
      url: "./getbyparentid",
      data:{parentId:parentId},
      dataType: 'json',
      success:function(result){
        $("#third_classify_qs").empty().append("<option value='-1'>请选择"+"</option>");
        var items = eval(result.data);
        for(var row in items){
          $("#third_classify_qs").append("<option value='"+ items[row].cateId +"'>"+ items[row].cateName +"</option>");
        }
      },
      error:function(){
        console.log("error ....");
      }
    })
  });


  //获取分类产品细信息
  function getgoodsList() {
    var pageSize=pagesize;
    var datas = {};

    var goodsCodeStatus = $("input[name='goodsCodeStatus']").val();//商品编码
    var goodsTemplate = $("input[name='goodsTemplate']").val();//商品模版
    var goodsClassify = $("input[name='goodsClassify']").val();//有无分类
    datas.goodsCodeStatus = goodsCodeStatus;
    datas.goodsTemplate = goodsTemplate;
    datas.goodsClassify = goodsClassify;
    
    var classify = $("input[name='classify']").val();
    var cateCode = getCode(classify);
    datas.startRow = curPage;
    datas.pageSize = pageSize;
    datas.hasImage = -1;
    datas.userCateid = cateCode > 0 ? cateCode : "";
    datas.goodsTitle = $("input[name='search_input']").val().trim();
    var goodstatus = $("input[name='status']").val();
    if (goodstatus == null || goodstatus == '' || goodstatus ==0) {
      datas.goodsStatus = 0;
    }else{
      datas.goodsStatus = goodstatus;
    }
    $("#product_table").empty();
    AlertLoading($("#product_table"));
    $.ajax({
      type: 'POST',
      url: "/merchant/bgoodsList",
      data:datas,
      dataType: 'json',
      success: function(data){
        console.log(data);
        var result = data.goodsPage;
        totalNum = result.total;
        console.log(totalNum);
        $("#product_table").empty();
        if(result.list.length  <=0){
          $("#product_table").append("<tr><td colspan='8' style='text-align: center'>暂无数据</td></tr>");
          return;
        }
        for (var i=0;i<result.list.length;i++){
          var goods=result.list[i];
          var userCode = goods.userCateid;
          var cateInfo = {};
          /*商品类别start*/
          cateInfo = getCname(userCode);
          /*商品类别end*/
          var imageId=goods.imgHash;
          var imageIdurl=imageId!=null?(_imgConfig.url +imageId+'.jpg'):'/templates/views/resource/merchant/img/empty.jpg';
          $("#product_table").append("<tr>" +
            "<td>" +
            "<label data-toggle='checkbox' class='checkbox-pretty inline'>" +
            "<input type='checkbox' name='gid' value='"+goods.goodsId+"'>" +
            "<span>" +
            "<img class='product_img'' src='"+imageIdurl+"' /></span>" +
            "</label></td><td style='word-break: break-all;'>"+goods.goodsTitle+"</td>" +
            "<td style='word-break: break-all;'>"+goods.drugName+"</td>" +
            "<td style='word-break: break-all;'>"+goods.approvalNumber+"</td>" +
            "<td style='word-break: break-all;'>"+goods.specifCation+"</td>" +
            "<td style='word-break: break-all;'>"+cateInfo.cname+"</td>" +
            "<td style='word-break: break-all;'>"+(goods.goodsStatus==1?"上架":"下架")+"</td>" +
            "<td>" +
            "<a class='sui-btn change_classify_btn' gidTitle ='"+goods.goodsTitle+"' cateIds='"+cateInfo.cateids+"'  gid='"+goods.goodsId+"' data-toggle='modal' data-target='#change_classify' data-backdrop='static'>修改分类</a></td></tr>");
        }
        $("#product_table").append('<tr><td colspan="16"><span class ="pageinfo" style="float: right"></span></td></tr>');

        $('.pageinfo').pagination({
          pages: result.pages,
          styleClass: ['pagination-large'],
          showCtrl: true,
          displayPage: 8,
          currentPage: curPage,
          onSelect: function (num) {
            curPage = num;
            getNum();
            getgoodsList();
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
    $("#first_classify_qs").val("-1");
    $("#second_classify_qs").val("-1");
    $("#third_classify_qs").val("-1");
    $("#second_classify_qs").empty().append("<option value='-1'>请选择"+"</option>");
    $("#third_classify_qs").empty().append("<option value='-1'>请选择"+"</option>");
  }

  //修改分类
  $(".change_classify_btn").live("click",function(){
    initEditSelect();
    console.log($("#second_classify_qs").html());
    console.log($("#third_classify_qs").html());
    var gid = $(this).attr("gid");
    var gidTitle = $(this).attr("gidTitle");
    var cateIds = $(this).attr("cateIds");
    var cateid = cateIds.split(">");
    console.log(cateid);
    $("#first_classify_qs").val(cateid[0]);
    if(cateid.length==1&&cateid[0]!=""){
      getsecondClassify(cateid[0],cateid[1]);
    }
    if(cateid.length>=2){
      getsecondClassify(cateid[0],cateid[1]);
      getthirdClassify(cateid[1],cateid[2]);
    }
    console.log($("#second_classify_qs").html());
    console.log($("#third_classify_qs").html());
    $("#change_classify  #alert_title").html("商品标题： "+gidTitle);
    $("#gls").val(gid);
  });

  //批量修改分类
  $(".change_classify_batch_btn").live("click",function(){
    initEditSelect();
    var gids = "";
    $("input[name='gid']:checkbox:checked").each(function(){
      if($(this).attr("checked")){
        gids += $(this).val()+",";
      }
    });
    $("#change_classify #alert_title").html("您已选择将"+$("input[name='gid']:checkbox:checked").length+"个商品，转移到产品类目：");
    $("#gls").val(gids);
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
      url:"/merchant/updateGoodsCate",
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

  //获取商品分类
  function getCname(userCode){
    var yname="";
    var ename="";
    var ycode="";
    var ecode="";
    var cateName = "";
    var cateId = "";
    for(var i=0,len=categoriesData.length;i<len;i++){
      if (userCode == categoriesData[i].cateCode) {
        cateName = categoriesData[i].cateName;
        cateId = categoriesData[i].cateId;
        break;
      }else{
        yname=categoriesData[i].cateName;
        ycode=categoriesData[i].cateId;
      }
      if(categoriesData[i].children !=null){
        for(var j=0,j_len=categoriesData[i].children.length;j<j_len;j++){
          if (userCode == categoriesData[i].children[j].cateCode){
            cateName = yname +">"+ categoriesData[i].children[j].cateName;
            cateId = ycode +">"+ categoriesData[i].children[j].cateId;
            break;
          }else {
            ename= yname + ">" + categoriesData[i].children[j].cateName;
            ecode= ycode + ">" + categoriesData[i].children[j].cateId;
          }
          if(categoriesData[i].children[j].children!=null){
            for(var k=0,k_len=categoriesData[i].children[j].children.length;k<k_len;k++){
              if (userCode == categoriesData[i].children[j].children[k].cateCode){
                cateName = ename +">"+ categoriesData[i].children[j].children[k].cateName;
                cateId = ecode +">"+ categoriesData[i].children[j].children[k].cateId;
                break;
              }
            }
          }
        }
      }
    }
    return {"cname":cateName,"cateids":cateId};
  }

  //根据cateId获取cateCode
  function getCode(cateId){
    for(var i=0,len=categoriesData.length;i<len;i++){
      if (cateId == categoriesData[i].cateId) {
        return categoriesData[i].cateCode;
      }
      if(categoriesData[i].children !=null){
        for(var j=0,j_len=categoriesData[i].children.length;j<j_len;j++){
          if (cateId == categoriesData[i].children[j].cateId){
            return categoriesData[i].children[j].cateCode;
          }
          if(categoriesData[i].children[j].children!=null){
            for(var k=0,k_len=categoriesData[i].children[j].children.length;k<k_len;k++){
              if (cateId == categoriesData[i].children[j].children[k].cateId){
                return categoriesData[i].children[j].children[k].cateCode;
              }
            }
          }
        }
      }
    }
  }

  function GetQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
  }

});

