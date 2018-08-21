$(document).ready(function(){




/****后台数据调取api****/
  var bgoods = {
    current_goods_page:1, /**加载商品列表当前页码**/
    per_goods_page:1000000,/**加载商品列表每页数量**/
    cur_cate_id:"",
    cur_cate_name:"",
    link_type:1,//判断商品和商品分类（1是商品，2是商品分类）

    //查询所有的商品
    findBGoods: function(){

      var params = this.getParams();
      var urlStr  = "/merchant/bgoodsList";

      $.post(urlStr+"?"+$.param(params),function(data){
        var tmpl = document.getElementById('product_list_templete').innerHTML;
        var doTtmpl = doT.template(tmpl);
        $(".goods_list").html(doTtmpl(data.goodsPage));

      });
    },

    //三级联动 ，menu_num为1的时候，查询/merchant/categories接口，弹出默认分类窗口
    //当第一个选择框cart_id_first选中了某个分类时,传如的menu_num为2 会访问新的接口 merchant/getbyparentid 并需要一个父分类ID
    //同理第二个cart_id_second，传入的menu_num为3 ，它们都是查询自己分类下的子分类；
     getProductCategory:function (menu_num) {

      if(menu_num==1){

        var url = "/merchant/categories";

        //链接至一个商品
        var curObj = $('[class="cart_id_first"]');

        //链接至一个商品分类
        var curObj2 = $('[class="cart_id_first2"]');

        curObj.html('<option value="">全部分类</option>');
        curObj2.html('<option value="">全部分类</option>');

        $.post(url,function(data){
          console.log("全部分类");
          console.log(data);
          var items = data.result.children;
          for(var row in items){
            $(curObj).append("<option value='"+ items[row].cateCode +"' data-id='"+items[row].cateId+"'>"+ items[row].cateName +"</option>");
            $(curObj2).append("<option value='"+ items[row].cateCode +"' data-id='"+items[row].cateId+"'>"+ items[row].cateName +"</option>");
          }
        });

        return;

      }else if(menu_num==2){

        var parentId = "";
        var curObj = null;

        //根据link_type 判断关联的商品类型
        if(this.link_type==2){

          parentId = $('[class="cart_id_first2"] [value="'+$('[class="cart_id_first2"]').val()+'"]').attr("data-id");
          curObj = $('[class="cart_id_second2"]');
        }else{

          parentId = $('[class="cart_id_first"] [value="'+$('[class="cart_id_first"]').val()+'"]').attr("data-id");
          curObj = $('[class="cart_id_second"]');
        }

        var url = "/merchant/getbyparentid?parentId="+parentId;

        if(!parentId){
          return;
        }

      }else if(menu_num==3){

        var parentId = "";
        var curObj = null;

        //根据link_type 判断关联的商品类型
        if(this.link_type==2){

          parentId = $('[class="cart_id_second2"] [value="'+$('[class="cart_id_second2"]').val()+'"]').attr("data-id");
          curObj = $('[class="cart_id_third2"]');
        }else{

          parentId = $('[class="cart_id_second"] [value="'+$('[class="cart_id_second"]').val()+'"]').attr("data-id");
          curObj = $('[class="cart_id_third"]');
        }

        var url = "/merchant/getbyparentid?parentId="+parentId;

        if(!parentId){
          return;
        }
      }

      curObj.html('<option value="">全部分类</option>');
      $.post(url,function (data) {

        var items = JSON.parse(data.data);
        for(var row in items){
          curObj.append("<option value='"+ items[row].cateCode +"' data-id='"+items[row].cateId+"'>"+ items[row].cateName +"</option>");
        }
      })

    },


    //参数封装成对象
    getParams:function(){

      var params = {};

      var goods_title = $('[name="keyword"]').val();
      var cate_id = this.cur_cate_id;
      if(goods_title)params.goodsTitle = goods_title;
      if(cate_id)params.userCateid = cate_id;

      params.goodsStatus = 1;
      params.startRow = (bgoods.current_goods_page-1) * bgoods.per_goods_page;
      params.pageSize = 100000000;
      params.hasImage = 1;

      return params;
    },

    //初始化doT
    doTinit:function()
    {
      //配置定界符
      doT.templateSettings = {
        evaluate:    /\[\%([\s\S]+?)\%\]/g,
        interpolate: /\[\%=([\s\S]+?)\%\]/g,
        encode:      /\[\%!([\s\S]+?)\%\]/g,
        use:         /\[\%#([\s\S]+?)\%\]/g,
        define:      /\[\%##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\%\]/g,
        conditional: /\[\%\?(\?)?\s*([\s\S]*?)\s*\%\]/g,
        iterate:     /\[\%~\s*(?:\%\]|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\%\])/g,
        varname: 'it',
        strip: true,
        append: true,
        selfcontained: false
      };
    }
  };

  //doT初始化
  bgoods.doTinit();

  //查询所有的商品
  bgoods.findBGoods();

  bgoods.getProductCategory(1);

  //添加轮播广告,恢复初始数据
  $("#add_ads").click(function () {


    //关键字设置为空
    $("input[name=keyword]").val("");

    //链接地址设置为空
    $("#links").val("");

    //预览窗口src初始化，和窗口隐藏
    $('#spBox').removeClass('hide');
    $('#showMsg').addClass('hide');
    $('#flBox').addClass('hide');

    //查询所有的商品
    bgoods.findBGoods();
    bgoods.getProductCategory(1);
    $(".cart_id_second").html("");
    $(".cart_id_third").html("");
  });

  //商品分类三级联动
  $('.cart_id_first').change(function(){
    bgoods.getProductCategory(2);
    bgoods.cur_cate_id = $(this).val();
    bgoods.cur_cate_name = $(this).find("option:selected").text();
  })

  $('.cart_id_second').change(function(){
    bgoods.getProductCategory(3);
    bgoods.cur_cate_id = $(this).val();
    bgoods.cur_cate_name = $(this).find("option:selected").text();
  })
  $('.cart_id_third').change(function(){
    bgoods.cur_cate_id = $(this).val();
    bgoods.cur_cate_name = $(this).find("option:selected").text();
  })

  $('.cart_id_first2').change(function(){
    bgoods.link_type = 2;
    bgoods.getProductCategory(2);
    bgoods.cur_cate_id = $(this).val();
  })

  $('.cart_id_second2').change(function(){
    bgoods.link_type = 2;
    bgoods.getProductCategory(3);
    bgoods.cur_cate_id = $(this).val();
  })
  $('.cart_id_third2').change(function(){
    bgoods.cur_cate_id = $(this).val();
  })

  //查询商品
  $('.search_goods_btn').click(function(e){
    bgoods.findBGoods();
    e.preventDefault();
  })

  //确定添加链接地址
  $(".addURL").click(function(e){
    e.preventDefault();
    var url = "";
    var url2 = "";
    var shopwxUrl = "http://" + $('[name="shopwxUrl"]').val();

    if(bgoods.link_type==2){
      var catId = bgoods.cur_cate_id;
      url2 = shopwxUrl+"/new/searchResult?userCateid="+catId;
      url = "/searchList/searchList?userCateid="+catId;
    }else{

      //var bgood = $('[name="gid"]');
      var bgood = $("#spBox").find("td.checked").children('[name="gid"]');
      if(!bgood || bgood.length==0){
        alert("请选在商品!");
      }
      var goodsId = bgood.val();

      url2 = shopwxUrl+"/single/product?goodsId="+goodsId;
      url = "/product/productDetail?goodsId="+goodsId;

    }

    $("#links").val(url);

    //预览iframe修改URL
    $('#showMsg').attr("src",url2);

  });

  //打开商品列表
  $("#ljsp").on('click',function () {
    $('#spBox').removeClass('hide');
    $('#flBox').addClass('hide');
    $('#showMsg').addClass('hide');
    bgoods.link_type = 1;
  });
  //打开商品分类
  $("#ljfl").on('click',function () {

    $('#spBox').addClass('hide');
    $('#flBox').removeClass('hide');
    $('#showMsg').addClass('hide');
    bgoods.link_type = 2;
  });

  //选择一个商品或分类显示 iframe 预览地址
  $("#seleceSP").on('click',function () {

    $('#showMsg').removeClass('hide');
    $('#spBox').addClass('hide');
    $('#flBox').addClass('hide');
  });

})
