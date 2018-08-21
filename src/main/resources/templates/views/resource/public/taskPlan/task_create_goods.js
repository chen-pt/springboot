
//批量添加
var selectGoodBatch = function () {
  $('.goods_list ').find('[name="good"]:checked').each(function () {
    selectGoods($(this).parent().find('[name="index"]').val());
  })
  vm.goods.selectAll = false;
}

//批量删除
var unSelectGoodBatch = function () {
  $('.select_goods_list').find('[name="good"]:checked').each(function () {
    $(this).parent().removeClass("checked");
    $(this).checked = false;
    unSelectGoods($(this).parent().find('[name="_goods_id"]').val());

  })
  vm.goods.addSelectAll = false;
}


//商品全选
var selectAllGood = function(){
  vm.goods.selectAll = !vm.goods.selectAll;
}
//添加商品全选
var addSelectAllGood = function(){
  if(vm.goods.addSelectAll){
    vm.goods.addgoodListcheck = [];
  }
  vm.goods.addSelectAll = !vm.goods.addSelectAll;
}

//添加商品
var selectGoods = function (index){

  var goods_id = vm.goods.goodList[index].goodsId;

  if ($.inArray(goods_id, vm.goods.addgoodIdList) < 0) {
    vm.goods.addgoodIdList.push(goods_id);
    vm.goods.addgoodList.push(vm.goods.goodList[index]);
    vm.goods.addgoodListcheck.push(goods_id);
    layer.msg('商品选择成功');
  } else {
    layer.msg('该商品已被选择！')
  }

}
//移除商品
var unSelectGoods = function (goods_id){

  for( var index= 0;index < vm.goods.addgoodIdList.length;index++){
    if(vm.goods.addgoodIdList[index] == goods_id){
      vm.goods.addgoodIdList.splice(index,1);
      vm.goods.addgoodList.splice(index,1);
    }

  }
  layer.msg('商品移除选择成功');
}

var getIndex = function (val,arr) {

  for( var index= 0;index < arr.length;index++){
    if(arr[index] == val){
      return index;
    }
  }

  return -1;
}

var curPage_good = 1;
var totalNum_good  = 0;
var pageSize_good  = 15;
//获取参数
var getGoodsListParams = function () {
  //分类
  var userCateid = $('[name="catagoryCode"]').val();

  //标题
  var goodsTitle = $('input[name="much_search_input"]').val();

  //商品编码
  var goodsCode = $('input[name="goods_code_disc"]').val();

  //现价
  var goods_price_s = $('input[name="goods_price_s"]').val() ? $('input[name="goods_price_s"]').val().trim() * 100 : 0;
  var goods_price_b = $('input[name="goods_price_b"]').val() ? $('input[name="goods_price_b"]').val().trim() * 100 : 99999999;
  // var shopPWrice = goods_price_s + ',' + goods_price_b;



  var params = {}

  params.startRow = curPage_good ;
  params.pageSize = pageSize_good ;

  params.goodsStatus = 1;
  params.userCateid = userCateid > 0 ? userCateid : '';
  params.goodsTitle = goodsTitle;
  params.goodsCode = goodsCode;
  // params.shopPWrice = shopPWrice;

  params.startPrice = goods_price_s;
  params.endPrice = goods_price_b;
  if(userCateid)params.userCateid = userCateid

  return params;
}

//获取商品数据
var getGoodsList = function () {

  var url;
  var urlType = getURLType();
  if(urlType){
    url = '/'+ urlType +'/task/bgoodsList';
  }else {
    return;
  }

  $.post(url, getGoodsListParams(), function (result) {

    if(result.goodsPage){
      vm.goods.goodList = result.goodsPage.list;
      totalNum_good  = result.goodsPage.total;
      vm.goods.totalNum = totalNum_good ;

      $('#select_goods').find('.pageinfo').data('sui-pagination', '');
      $('#select_goods').find('.pageinfo').pagination({
        pages: result.goodsPage.pages,
        styleClass: ['pagination-large'],
        showCtrl: true,
        displayPage: 6,
        currentPage: curPage_good ,
        onSelect: function (num) {
          curPage_good  = num;
          vm.goods.selectAll = false;
          getGoodsList();
        }
      });
      getNumGoods();
    }


  });
}

//请求类目数据
var getCategories = function () {

  var url;
  var urlType = getURLType();
  if(urlType){
    url = '/'+ urlType +'/task/categories';
  }else {
    return;
  }

  $.post(url, {}, function (data) {

    if(data.result.children){
      vm.goods.categories = data.result;
      $('#cate_box').html(createDropdown(data.result));
      $('[role="menuitem"]').click(function () {
        $('.dropdown-toggle').text($(this).text());
        $('[name="catagoryCode"]').val($(this).attr('code'));
      })
    }

  })
}
//创建类目
var createDropdown = function (data) {

  var carDivStart = '<span class="sui-dropdown dropdown-bordered">' +
    '<span class="dropdown-inner">' +
    '<a role="button" data-toggle="dropdown" href="#" class="dropdown-toggle"><i class="caret"></i>请选择</a>';

  var mainDiv = createDropdownNext(data,0);

  var carDivEnd = '</span></span>';

  return carDivStart + mainDiv + carDivEnd;

}
//创建类目条目（递归）
var createDropdownNext = function (data,val) {

  if (data.children) {
    var catalogs = data.children;
    var catalog_ulStart = ' <ul class="sui-dropdown-menu"' + (val == 0 ? ('aria-labelledby="drop1"  role="menu" > ' +
      '<li role="presentation" class="dropdown-submenu"><a role="menuitem" tabindex="-1" href="#" >' +
      '请选择</li> <li role="presentation" class="divider"></li>') : '>');

    for(var i=0; i < catalogs.length; i++){
      var catalog = catalogs[i];

      var catalog_liStart = '<li role="presentation" '+ (catalog.children ? ' class="dropdown-submenu"' : '') +'> ' +
        '<a role="menuitem" tabindex="-1" href="#" code="'+ catalog.cateCode +'"' +
        '<i class="sui-icon icon-angle-right pull-right"></i> ' +
        catalog.cateName +'</a>'

      var mainDiv = createDropdownNext(catalog,1);

      var catalog_liEnd = ' </li>';

      catalog_ulStart += (catalog_liStart + mainDiv + catalog_liEnd);

    }

    var catalog_ulEnd = '</ul>';

    return catalog_ulStart + catalog_ulEnd;
  }
  return '';

}

var getNumGoods = function (){

  $('#select_goods').find('.pageinfo').find('span:contains(共)').append("<span id='m_t_n'>(" + totalNum_good  + "条记录)</span>");

  //页码选择
  var pagearr = [15,30,50,100];

  var pageselect = '<select class="page_size_select">';

  $.each(pagearr, function(){

    if(this==pageSize_good )
    {
      pageselect =pageselect+'<option value="'+this+'"  selected>'+this+'</option>';
    }else{
      pageselect =pageselect+'<option value="'+this+'">'+this+'</option>';
    }
  });

  pageselect = pageselect+'</select>&nbsp;';

  $('#select_goods').find('.pageinfo').find('span:contains(共)').prepend(pageselect);

  $('#select_goods').find('.page_size_select').change(function () {
    pageSize_good  = $('#select_goods').find('.page_size_select').val();
    vm.goods.selectAll = false;
    getGoodsList();
  })

}

