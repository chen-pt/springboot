!(function () {
  $(document).ready(function(){
    var goodsId=GetQueryString("goodsId");
    if(goodsId!=null){

      $('#goods_id').val(goodsId);
      $.ajax({
        type: 'POST',
        url: "./bgoodsOne",
        data: {"goodsId":goodsId},
        dataType: 'json',
        success: function(data){
          if (! data.goods) {
            layer.alert("商品不存在", function () {
              history.back();
            });
            return;
          }
          // 把删除商品这些按钮显示出来
          $('.goods-tools').removeClass('hidden');

          $("input[name='approval_number']").val(data.goods.approvalNumber);
          $("#drug_name").val(data.goods.drugName);
          $("#com_name").val(data.goods.comName);
          $("#specif_cation").val(data.goods.specifCation);
          $("input[name='goods_company']").val(data.goods.goodsCompany);
          $("input[name='brand_name']").val(data.goods.brandName);
          $("input[name='drug_category']").find("option[value='"+data.goods.drugCategory+"']").attr("checked","checked");
          $("select[name='goods_property']").find("option[value='"+data.goods.goodsProperty+"']").attr("selected","selected");
          $("select[name='goods_forts']").find("option[value='"+data.goods.goodsForts+"']").attr("selected","selected");
          $("input[name='goods_validity']").val(data.goods.goodsValidity);
          $("input[name='goods_use']").find("option[value='"+data.goods.goodsUse+"']").attr("checked","checked");

          $("input[name='good_forpeople']").find("option[value='"+data.goods.goodForpeople+"']").attr("checked","checked");
          $("input[name='is_medicare']").find("option[value='"+data.goods.isMedicare+"']").attr("checked","checked");
          $("#medicare_code").val(data.goods.medicareCode);
          $("#bar_code").val(data.goods.barCode);
          $("input[name='main_ingredient']").val(data.goods.mainIngredient);
          $("input[name='goods_indications']").val(data.goods.goodsIndications);
          $("input[name='goods_use_method']").val(data.goods.goodsUseMethod);
          $("input[name='goods_usage']").val(data.goods.goodsUsage);
          $("input[name='forpeople_desc']").val(data.goods.forpeopleDesc);
          $("input[name='goods_action']").val(data.goods.goodsAction);
          $("input[name='adverse_reactioins']").val(data.goods.adverseReactioins);
          $("input[name='goods_note']").val(data.goods.goodsNote);
          $("input[name='goods_contd']").val(data.goods.goodsContd);
          $("input[name='goods_deposit']").val(data.goods.goodsDeposit);
          $("input[name='goods_batch_no']").val(data.goods.goodsBatchNo);
          $("input[name='shop_price']").val(data.goods.shopPrice);

          $("input[name='goods_description']").val(data.goods.goodsDescription);
          $("input[name='qualification']").val(data.goods.qualification);

        },
        error:function(){
          layer.alert("网络错误");
        }
      });
    }

  });

  function GetQueryString(name)
  {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
  }
})();


