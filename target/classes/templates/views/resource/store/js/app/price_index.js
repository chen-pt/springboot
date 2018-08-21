/**
 * Created by Administrator on 2015/11/19.
 */
require.config({
    paths:{
        'core':'../lovejs/core',
        'tools':'../lovejs/tools',
        'price': 'service/price'
    }
});

/**
 * 初始化
 */
$(function () {

    require(['core'], function (core) {
        //doT
        core.doTinit();
        //重写console
        core.ReConsole();

    });

    /**
     * 路由
     * @type {string}
     */
    var url =  window.location.pathname;
    switch (url)
    {
        case '/price/index':initPrice();break;

    }

});

/**
 * 价格列表
 */
function initPrice() {
    require(['price'], function (price){
        price.showPrice();
        price.getProductCategory();

        $(document).on('click', '#lee_add_classify a', function(evt) {
            $("#lee_add_classify_a").html('<i class="caret"></i>'+($(this).html().replace('<i class="sui-icon icon-angle-right pull-right"></i>',"")));
            $("input[name='classify']").val($(this).attr("data"));
        });

        //价格提交修改
        $(document).on('click', '.btn-store-price', function() {
            var goods_id = $(this).parents("tr").find("input[name='goods_id']").val();
            var store_price = $(this).parents("tr").find("td:eq(2) span").html();
            var store_price_title = $(this).parents("tr").find(".img-title").html();
            var market_price = $(this).parents("tr").find("td:eq(3)").html();
            $("#store_price_title").html(store_price_title);
            $("#store_price").val(store_price);
            $("#goods_id").val(goods_id);
            $("#market_price").html(market_price);
            $('#Revise-modal').modal('show');
        });
    });
}

/**
 * 价格搜索
 */
function index_searchPrice() {

    require(['price'], function (price){
        price.showPrice();
    });
}
//价格修改
function showUpdateStorePrice()
{
  var postdata = {};

  postdata.goodsId = $('#goods_id').val();
  postdata.goodsPrice = $('#store_price').val();
  if(postdata.goodsPrice > 10000000) {
    layer.msg('提交失败！');
    return;
  }
  $.ajax({
    type: 'POST',
    data: postdata,
    url: './updateYBPrice',

    success:function(e){


      if(e=='success') {
        layer.msg('提交成功!', {'time': 500, 'end': function() {
          window.location.reload();
        }});
      }else{
        $.alert({'title':'温馨提示!','body':'提交失败！'});
      }
    }
  });
};
//全部恢复门店价格

function AllRegain_btn() {
    require(['price'], function (price){
        $.confirm({'body':'确定后，会将所有门店设置的价格重置','okHide': function () {
          var postdata = {};

          postdata.type = "900";

          $.ajax({
            type: 'POST',
            data: postdata,
            url: './resumeStorePriceAction',

            success:function(e){

              if(e.msg=="success") {
                window.location.reload();
              }else{
                $.alert({'title':'温馨提示!','body':'未设置门店的价格'});
              }
            }
          });
        }});
    });
}

//单个恢复门店价格
function Regain_btn(goods_id) {
    require(['price'], function (price){
        layer.msg('恢复成功！', {'time': 500, 'end': function() {
          var postdata = {};

          postdata.type = "100";
          postdata.goodsId=postdata
          $.ajax({
            type: 'POST',
            data: postdata,
            url: './resumeStorePriceAction',

            success:function(e){

              if(e=="success") {
                window.location.reload();
              }else{
                $.alert({'title':'温馨提示!','body':'未设置门店的价格'});
              }
            }
          });
        }});
    });
}

//价格刷新
function Refresh_btn(goods_id) {
    require(['price'], function (price){
        price.showPriceProductDetail(goods_id);
    });
}




