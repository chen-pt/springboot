
//更新商品
function updateGoods() {
  var datas ={};
  datas.approval_number= $(".syncGood_approval_number").text();
  if(datas.approval_number==""){
    datas.approval_number=$("input[name=approval_number]").parents("td").next().find(".diffFeid").val();
  }
  datas.drug_name= $(".sync_drug_name").text();
  if(datas.drug_name==""){
    datas.drug_name=$("input[name=drug_name]").parents("td").next().find(".diffFeid").val();
  }
  datas.com_name= $(".syncGood_com_name").text();
  if(datas.com_name==""){
    datas.com_name=$("input[name=com_name]").parents("td").next().find(".diffFeid").val();
  }
  datas.user_cateid= $(".syncGood_user_cateid").text();
  if(datas.user_cateid==""){
    datas.user_cateid=$("input[name=user_cateid]").parents("td").next().find(".diffFeid").val();
  }
  datas.specif_cation= $(".syncGood_specif_cation").text();
  if(datas.specif_cation==""){
    datas.specif_cation=$("input[name=specif_cation]").parents("td").next().find(".diffFeid").val();
  }
  datas.drug_category= $(".syncGood_drug_category").text();
  if(datas.drug_category==""){
    datas.drug_category=$("input[name=drug_category]").parents("td").next().find(".diffFeid").val();
  }
  datas.goods_deposit= $(".syncGood_goods_deposit").text();
  if(datas.goods_deposit==""){
    datas.goods_deposit=$("input[name=goods_deposit]").parents("td").next().find(".diffFeid").val();
  }
  datas.medicare_code= $(".syncGood_medicare_code").text();
  if(datas.medicare_code==""){
    datas.medicare_code=$("input[name=medicare_code]").parents("td").next().find(".diffFeid").val();
  }
  datas.bar_code= $(".syncGood_bar_code").text();
  if(datas.bar_code==""){
    datas.bar_code=$("input[name=bar_code]").parents("td").next().find(".diffFeid").val();
  }
  datas.medicare_code= $(".syncGood_medicare_code").text();
  if(datas.medicare_code==""){
    datas.medicare_code=$("input[name=medicare_code]").parents("td").next().find(".diffFeid").val();
  }

  if(datas.drug_category=="甲类非处方药"){
    datas.drug_category=110;
  }else if(datas.drug_category=="乙类非处方药"){
    datas.drug_category=120;
  }else if(datas.drug_category=="处方药"){
    datas.drug_category=130;
  }else if(datas.drug_category=="双轨药"){
    datas.drug_category=140;
  }else if(datas.drug_category=="非方剂"){
    datas.drug_category=150;
  }else if(datas.drug_category=="方剂"){
    datas.drug_category=160;
  }else if(datas.drug_category=="一类"){
    datas.drug_category=170;
  }else if(datas.drug_category=="二类"){
    datas.drug_category=180;
  }else{
    datas.drug_category=190;
  }
  datas.goods_property= $(".syncGood_goods_property").text();
  if(datas.goods_property==""){
    datas.goods_property=$("input[name=goods_property]").parents("td").next().find(".diffFeid").val();
  }
  if(datas.goods_property=="化学药制剂"){
    datas.goods_property=110;
  }else if(datas.goods_property=="中成药"){
    datas.goods_property=120;
  }else if(datas.goods_property=="生物制品"){
    datas.goods_property=130;
  }else if(datas.goods_property=="抗生素"){
    datas.goods_property=140;
  }else if(datas.goods_property=="中药材"){
    datas.goods_property=150;
  }else if(datas.goods_property=="中药饮片"){
    datas.goods_property=160;
  }else if(datas.goods_property=="复方制剂"){
    datas.goods_property=170;
  }else if(datas.goods_property=="根茎类"){
    datas.goods_property=180;
  } else if(datas.goods_property=="茎木类"){
    datas.goods_property=190;
  }else{
    datas.goods_property=9999;
  }
  datas.goods_forts= $(".syncGood_goods_forts").text();
  if(datas.goods_forts==""){
    datas.goods_forts=$("input[name=goods_forts]").parents("td").next().find(".diffFeid").val();
  }

  if(datas.goods_forts=="片剂"){
    datas.goods_forts=110;
  }else if(datas.goods_forts=="胶囊"){
    datas.goods_forts=120;
  }else if(datas.goods_forts=="丸剂"){
    datas.goods_forts=130;
  }else if(datas.goods_forts=="颗粒"){
    datas.goods_forts=140;
  }else if(datas.goods_forts=="液体"){
    datas.goods_forts=150;
  }else if(datas.goods_forts=="膏剂"){
    datas.goods_forts=160;
  }else if(datas.goods_forts=="贴剂"){
    datas.goods_forts=170;
  }else if(datas.goods_forts=="糖浆"){
    datas.goods_forts=180;
  } else if(datas.goods_forts=="散剂"){
    datas.goods_forts=190;
  }else if(datas.goods_forts=="栓剂"){
    datas.goods_forts=200;
  }else if(datas.goods_forts=="喷雾"){
    datas.goods_forts=210;
  } else{
    datas.goods_forts=9999;
  }
  datas.goods_company= $(".syncGood_goods_company").text();
  if(datas.goods_company==""){
    datas.goods_company=$("input[name=goods_company]").parents("td").next().find(".diffFeid").val();
  }
  datas.goods_validity= $(".syncGood_goods_validity").text();
  if(datas.goods_validity==""){
    datas.goods_validity=$("input[name=goods_validity]").parents("td").next().find(".diffFeid").val();
  }

  datas.goods_use= $(".syncGood_goods_use").text();
  if(datas.goods_use==""){
    datas.goods_use=$("input[name=goods_use]").parents("td").next().find(".diffFeid").val();
  }
  if(datas.goods_use=="口服"){
    datas.goods_use=110;
  }else if(datas.goods_use=="外用"){
    datas.goods_use=120;
  }else if(datas.goods_use=="注射"){
    datas.goods_use=130;
  }else if(datas.goods_use=="含服"){
    datas.goods_use=140;
  } else{
    datas.goods_use=9999;
  }
  datas.goods_forpeople= $(".syncGood_goods_forpeople").text();
  if(datas.goods_forpeople==""){
    datas.goods_forpeople=$("input[name=goods_forpeople]").parents("td").next().find(".diffFeid").val();
  }
  if(datas.goods_forpeople=="不限"){
    datas.goods_forpeople=110;
  }else if(datas.goods_forpeople=="成人"){
    datas.goods_forpeople=120;
  }else if(datas.goods_forpeople=="婴幼儿"){
    datas.goods_forpeople=130;
  }else if(datas.goods_forpeople=="儿童"){
    datas.goods_forpeople=140;
  }else if(datas.goods_forpeople=="男性"){
    datas.goods_forpeople=150;
  }else if(datas.goods_forpeople=="妇女"){
    datas.goods_forpeople=160;
  }else {
    datas.goods_forpeople=170;
  }
  datas.is_medicare=$(".syncGood_is_medicare").text();
  if(datas.is_medicare==""){
    datas.is_medicare=$("input[name=is_medicare]").parents("td").next().find(".diffFeid").val();
  }
  if(datas.is_medicare=="非医保"){
    datas.is_medicare=1;
  }else if(datas.is_medicare=="甲类医保"){
    datas.is_medicare=2;
  }else if(datas.is_medicare=="乙类医保"){
    datas.is_medicare=3;
  }else {
    datas.is_medicare=1;
  }
  datas.goods_weight= $(".syncGood_goods_weight").text();
  if(datas.goods_weight==""){
    datas.goods_weight=$("input[name=goods_weight]").parents("td").next().find(".diffFeid").val();
  }
  datas.specif_cation= $(".syncGood_specif_cation").text();
  if(datas.specif_cation==""){
    datas.specif_cation=$("input[name=specif_cation]").parents("td").next().find(".diffFeid").val();
  }
  datas.detail_tpl= $("#detail_tpl").text();
  if(datas.detail_tpl==""){
    datas.detail_tpl=$("input[name=detail_tpl]").parents("td").next().find(".diffFeid").val();
  }
  datas.main_ingredient= $(".syncGood_main_ingredient").text();
  if(datas.main_ingredient==""){
    datas.main_ingredient=$("input[name=main_ingredient]").parents("td").next().find(".diffFeid").val();
  }
  datas.goods_indications= $(".syncGood_goods_indications").text();
  if(datas.goods_indications==""){
    datas.goods_indications=$("input[name=goods_indications]").parents("td").next().find(".diffFeid").val();
  }
  datas.goods_action= $(".syncGood_goods_action").text();
  if(datas.goods_action==""){
    datas.goods_action=$("input[name=goods_action]").parents("td").next().find(".diffFeid").val();
  }
  datas.goods_use_method= $(".syncGood_goods_use_method").text();
  if(datas.goods_use_method==""){
    datas.goods_use_method=$("input[name=goods_use_method]").parents("td").next().find(".diffFeid").val();
  }
  datas.adverse_reactioins= $(".syncGood_adverse_reactioins").text();
  if(datas.adverse_reactioins==""){
    datas.adverse_reactioins=$("input[name=adverse_reactioins]").parents("td").next().find(".diffFeid").val();
  }
  datas.goods_note= $(".syncGood_goods_note").text();
  if(datas.goods_note==""){
    datas.goods_note=$("input[name=goods_note]").parents("td").next().find(".diffFeid").val();
  }
  datas.goods_contd= $(".syncGood_goods_contd").text();
  if(datas.goods_contd==""){
    datas.goods_contd=$("input[name=goods_contd]").parents("td").next().find(".diffFeid").val();
  }
  datas.goods_description= $(".syncGood_goods_description").text();
  if(datas.goods_description==""){
    datas.goods_description=$("input[name=goods_description]").parents("td").next().find(".diffFeid").val();
  }


  datas.syncGood_id= $("#syncGoodsId").text();
  $.ajax({
    type:'post',
    url:'/jk51b/goods/updateGoods',
    data:datas,
    dataType: 'json',
    success: function(data){
      if(data.status == "ok"){
        layer.msg( "更新成功", function() {
          location.pathname = '/jk51b/goods/update';
        });
      }
      if(data.status == "notAllowUpdate"){
        layer.msg( "此模块暂时不允许更新", function() {
        });
      }
    },
    error:function(){
      console.log("error ....");
    }
  });
}
//忽略更新
function _cancel() {
  var datas ={};
  datas.syncGood_id= $("#syncGoodsId").text();
  $.ajax({
    type:'post',
    url:'/jk51b/goods/ignoreUpdate',
    data:datas,
    dataType: 'json',
    success: function(data){
      if(data.status == "ok"){
        layer.msg( "更新成功", function() {
          location.pathname = '/jk51b/goods/update';
        });
      }
    },
    error:function(){
      console.log("error. ....");
    }
  });
}

