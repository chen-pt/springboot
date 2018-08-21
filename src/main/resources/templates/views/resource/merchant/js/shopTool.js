
/**css
 *  create by xiongkang         按钮打开 弹窗 属性 设置 demo:  data-target="#shop-tool-0"   -0为 多个小工具如只需一个则默认设置为0   shopToolFn.createElement(0);
 *  @name shopTool
 *  @param Public Object
 *  @extends null
 * */

//创建全局变量、公共方法、公共对象
var ModalFsAttribute = [{name:'role', value:'dialog'},{name:'data-hasfoot', value:'false'},{name:'tabindex', value:'-1'},{name:'aria-hidden', value:'true'},{name:'class',value:'sui-modal hide fade'}];
var CloseModalButtonAttribute = [{name:'aria-hidden', value:'true'},{name:'data-dismiss', value:'modal'},{name:'class',value:'sui-close'},{name:'type',value:'button'}];
var SearchInputAarry = [
  {left:'商品名&nbsp;',inputP:'请输入商品名/通用名',type:'text',className:'input-medium goodsTitle',isSpace:false,idKey:'goodsTitle-'},
  {left:'商品标题&nbsp;',inputP:'请输入商品标题',type:'text',className:'input-medium goods_title',isSpace:false,idKey:'goods_title-'},
  {left:'批准文号&nbsp;',inputP:'请输入批准文号',type:'text',className:'input-medium approval_number',isSpace:false,idKey:'approval_number-'},
  {left:'价&nbsp;&nbsp;&nbsp;格&nbsp;',inputP:'',type:'text',className:'input-small startPrice',isSpace:true,idKey:'startPrice-'},
  {left:'-',inputP:'',type:'text',className:'input-small endPrice',isSpace:false,idKey:'endPrice-'},
  {left:'商品编码&nbsp;',inputP:'请输入商品编码',type:'text',className:'input-medium goods_code',isSpace:false,idKey:'goods_code-'},
  {left:'条形码&nbsp;',inputP:'请输入条形码',type:'text',className:'input-medium bar_code',isSpace:false,idKey:'bar_code-'},
];

var ToolKey = 1;            //默认工具窗口键值 为1
var ToolId = 0;

var ShowShopAarry = [];     //定义当前展示商品
var nowSelectShopDataAarry = [];     //定义当前展示商品数组对象
var nowSelectShopAarry = [];  //定义全局选中商品

var CategoryAarry = [];     //分类数据

var LoadDOM = '<div class="sui-loading loading-xsmall loading-inline" style="height: 30px;width:30px;text-align: center;margin: 260px 0 0;"><i class="sui-icon icon-pc-loading"></i></div>';
var ShopLoadDOM = '<div class="sui-loading loading-xsmall loading-inline" style="height: 30px;width:30px;text-align: center;margin: 260px 300px 0;"><i class="sui-icon icon-pc-loading"></i></div>';

var pagination_page_no = 1; //页码
var pagination_pages = 1; //总页数
var pagination_totals = 0; //总条数
var pagination_pagesize = 16; //每页显示多少条

Array.prototype.removeValue = function (val) {
  for(var i=0; i<this.length; i++) {
    if(this[i] == val) {
      this.splice(i, 1);
      break;
    }
  }
};
Array.prototype.removeObject = function (val) {
  for(var i=0; i<this.length; i++) {
    if(i == val) {
      this.splice(i, 1);
      break;
    }
  }
};
/**
 * a:     //user_cateid
 * b:     //最大价格
 * c:     //最小价格
 * d:     //商品名
 * e:     //
 * f:     //商品标题
 * g:     //批准文号
 * h:     //商品编码
 * i:     //条形码
 * */
var searchData = {
  user_cateid:'',
  maxPrice:'',
  minPrice:'',
  goods_name:'',
  pageNum:18,
  currentPage:1,
//        goods_img:1,
  goods_status:1,
  goods_title:'',//商品标题
  approval_number:'',//批准文号
  goods_code:'',//商品编码
  bar_code:''//条形码
};

var shopToolFn = {};  //定义小工具方法对象
var getDomFn = {      //操作dom公共方法对象
  forModalProperty:function(dom,arr){   //定义属性
    for(var i=0;i<arr.length;i++){
      dom.setAttribute(arr[i].name,arr[i].value);
    }
    return dom;
  },
  createHeadMenu:function(index){    //追加头部菜单  绑定头部菜单事件
    var headMenu = document.createElement('div');
    var left = document.createElement('div');
    var right = document.createElement('div');
    var leftInfo = document.createTextNode('所有分类');
    var rightInfo = '已选择商品（<span id="NOW_COUNT_'+index+'">0</span>/6）';
    headMenu.className = 'shop-menu';
    left.className = 'leftInfo active';
    right.className = 'rightInfo';
    left.appendChild(leftInfo);
    right.innerHTML = rightInfo ;
    headMenu.appendChild(left);
    headMenu.appendChild(right);
    left.onclick = function(){
      right.className = 'rightInfo';
      this.className = 'leftInfo active';
    };
    right.onclick = function(){
      left.className = 'leftInfo';
      this.className = 'rightInfo active';
    };
    return headMenu;
  },
  createBodyNav:function(index){ //追加分类菜单  //默认显示加载状态 有数据则清除
    var ListBox = '<ul class="left-category" id="left-category-'+index+'"></ul>';
    return ListBox;
  },
  createBodyContent:function(index){ //追加右侧 表单
    var form = document.createElement("form");
    var searchBtn = document.createElement('button');
    var shopList = document.createElement('div');
    var clearBoth = document.createElement('div');
    clearBoth.style.clear = 'both';
    var pageDiv = document.createElement('div');
    var submitButton = document.createElement('a');
    var submitText = document.createTextNode('提交');
    submitButton.appendChild(submitText);
    submitButton.className = 'sui-btn btn-info btn-xlarge';
    submitButton.style.margin = '10px 270px 0';
    /*var pageInfo = document.createElement('span');
    pageInfo.className = 'pageinfo';
    pageDiv.className = 'sui-pagination';*/
    pageDiv.setAttribute('id','pageDiv-'+index);
    shopList.className = 'shop-list-box';
    shopList.setAttribute('id','shop-list-box-'+index);
    shopList.innerHTML = ShopLoadDOM;
    searchBtn.innerHTML = '搜索';
    searchBtn.className = 'sui-btn btn-info';
    searchBtn.setAttribute('type','button');
    /*pageDiv.appendChild(pageInfo);*/
    form.className = 'sui-form';
    for(var i=0;i<SearchInputAarry.length;i++){
      var label = document.createElement('label');
      label.style.marginBottom = '5px';
      var inputDom = document.createElement('input');
      inputDom.setAttribute('type',SearchInputAarry[i].type);
      inputDom.setAttribute('placeholder',SearchInputAarry[i].inputP);
      inputDom.className = SearchInputAarry[i].className;
      inputDom.setAttribute('id',SearchInputAarry[i].idKey+index);
      label.innerHTML = SearchInputAarry[i].left;
      label.appendChild(inputDom);
      if(SearchInputAarry[i].isSpace){
        label.style.marginRight = '0px';
      }else{
        label.style.marginRight = '20px';
      }
      if(i==3){
        var br1 = document.createElement('br');
        var br2 = document.createElement('br');
        form.appendChild(br1);
        form.appendChild(br2);
      }
      form.appendChild(label);
    }
    form.appendChild(searchBtn);
    form.appendChild(shopList);
    form.appendChild(clearBoth);
    form.appendChild(pageDiv);
    form.appendChild(submitButton);
    submitButton.onclick = function(){
      shopToolFn.submitAarry(index);
    };
    searchBtn.onclick = function(){
      var goods_title = $('#goods_title-'+index).val();
      var approval_number = $('#approval_number-'+index).val();
      var goods_code = $('#goods_code-'+index).val();
      var bar_code = $('#bar_code-'+index).val();
      var goods_name = $('#goodsTitle-'+index).val();
      var maxPrice = $('#endPrice-'+index).val();
      var minPrice = $('#startPrice-'+index).val();
      if(maxPrice!=''){
        maxPrice = parseFloat(maxPrice)*10*10;
      }
      if(minPrice!=''){
        minPrice = parseFloat(minPrice)*10*10;
      }
      console.log(maxPrice,minPrice);
      pagination_page_no = 1;
      var sData = {
          maxPrice:maxPrice,
          minPrice:minPrice,
          goods_name:goods_name,
          pageNum:18,
          currentPage:1,
  //        goods_img:1,
          goods_status:1,
          goods_title:goods_title,//商品标题
          approval_number:approval_number,//批准文号
          goods_code:goods_code,//商品编码
          bar_code:bar_code //条形码
        };
      searchData = sData;
        shopToolFn.searchData(sData,index);
        //layer.msg('搜索')
    };
    return form;
  },
  createBodyShopList:function(arr){  //追加商品列表
    var ListBox = $('#shop-list-box-'+ToolKey);
    console.log(ToolKey);
    ListBox.empty();
    var ListItem = '';
    for(var i=0;i<arr.length;i++){
      var data = arr[i];
      var url = this.replaceImgURLString(data.def_url);
      var srcURL = this.imgLink(url,70,70,'.jpg');
      var price = this.floatTwo(data.shop_price);
      var isChecked = shopToolFn.getChecked(data.goods_id);
      /*if(data.goods_status==2){
        layer.msg(data.com_name);
      }*/
      ListItem += data.goods_status==1?'<div class="single" style="overflow: hidden;" data-goodsid="'+data.goods_id+'">' +
        '<input comName="'+data.com_name+'" goodsid="'+data.goods_id+'" imgURL="'+srcURL+'" market_price="'+data.market_price+'" shop_price="'+data.shop_price+'" specif_cation="'+data.specif_cation+'" wx_purchase_way="'+data.wx_purchase_way+'" name="select" type="checkbox" class="selectIMG" onclick="addShop('+data.goods_id+')" '+isChecked+'>'+
        '<div style="width: 100%; height: 60px;">' +
        '<img src="'+srcURL+'" val="'+url+'"> ' +
        '</div> ' +
        '<div style="width: 100%; height: 30px;"><div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: block; height: 17px;">'+data.drug_name+'</div> ' +
        '<div>￥'+price+'</div>' +
        '</div>' +
        '</div>':'';
    }
    ListBox.append(ListItem);
  },
  createPageInfo:function () {
    var pageDiv = document.createElement('div');
    var pageInfo = document.createElement('span');
    pageInfo.className = 'pageinfo';
    pageDiv.className = 'sui-pagination';
    pageDiv.setAttribute('id','pageDiv');
    pageDiv.appendChild(pageInfo);
    return pageDiv;
  },
  createLeftMenuList:function(arr,index){
    var li = '<li id="cate_'+index+'_0" class="active" onclick="changeList(0,'+index+')">所有分类</li>';
    for(var i=0;i<arr.length;i++){
      li+= '<li id="cate_'+index+'_'+arr[i].cateCode+'" ceteCode="'+arr[i].cateCode+'" onclick="changeList('+arr[i].cateCode+','+index+')">'+arr[i].cateName+'</li>';
    }
    return li;
  },
  imgLink:function (value) {
    var url='http://jkosshash.oss-cn-shanghai.aliyuncs.com/'+value+'.jpg';
    return url;
  },
  replaceImgURLString:function(value){
    var a=value.substring(value.lastIndexOf(":")+2,value.length-2);
    return a;
  },
  floatTwo:function(num){
    var num = (num/100).toFixed(2);
    return num;
  },
  createShowItem:function(arr,index){
    var li = '';
    var box = $('.add_shop_alls_'+index).children('ul');
    box.empty();
    for(var i=0;i<arr.length;i++){
      var data = arr[i];
      var price = this.floatTwo(data.shop_price);
      var url = this.replaceImgURLString(data.def_url);
      var srcURL = this.imgLink(url,70,70,'.jpg');
      li += '<li >'+
        '<img src="'+srcURL+'" class="img-item">'+
        '<div class="shop-info">'+
        '<div class="shop-info-name">'+data.drug_name+'</div>'+
        '<div class="shop-info-price">￥'+price+'</div>'+
      '</div>'+
      '</li>';
    }
    box.append(li);
  },
  checkGoodsInput:function(index,arr){
    /*var arr = nowSelectShopAarry;
    for(var i=0;i<arr.length;i++){
      $('#shop-list-box-'+index).find('.single').children('input[goodsid="'+arr[i]+'"]').attr('checked','checked');
    }*/
    console.log(arr);
    $('#shop-list-box-'+index).children('.single').each(function () {
      var thisId = $(this).attr('data-goodsid');
      /*console.log(thisId);
      console.log(arr);*/
      if($.inArray(thisId, arr)>-1){
        $(this).children('input').attr('checked',true);
      }else{
        $(this).children('input').attr('checked',false);
      }
    });
  }
};




//小工具方法实例化
/**
 * 创建商品小工具 dom 实体
 * @public
 * @functionName createElement
 * @param index
 * */
shopToolFn.createElement = function(index,selectArr){ //接收实体工具index key值 ps：创建不同实体工具对象
  var ToolModalFs = document.createElement("div");  //创建SUI Div   父级
  ToolModalFs.style.width = '900px';
  ToolModalFs.style.marginLeft = '-400px';
  var ToolModalSc = document.createElement("div");  //创建SUI Div   dialog
  var ToolModalTh = document.createElement("div");  //创建SUI Div   content
  var ToolModalFu = document.createElement("div");  //创建SUI Div   header
  var ToolModalFf = document.createElement("div");  //创建SUI Div   body
  var ToolModalSx = document.createElement("div");  //创建SUI Div   main
  ToolModalFf.style.maxHeight = '650px';
  var CloseBtn = document.createElement("button");  //创建SUI button 关闭
  var CloaeText = document.createTextNode('×');    //创建内容
  var ModalTitle = document.createElement("h4");     //创建SUI 标题
  var titleText = document.createTextNode('商品小工具');
  ModalTitle.className = 'modal-title';
  CloseBtn.appendChild(CloaeText);
  ModalTitle.appendChild(titleText);
  ToolModalFs = getDomFn.forModalProperty(ToolModalFs,ModalFsAttribute); //给div赋sui modal 属性
  CloseBtn = getDomFn.forModalProperty(CloseBtn,CloseModalButtonAttribute); //给按钮赋 属性
  ToolModalFs.setAttribute('id','shop-tool-'+index);  //添加ID
  ToolModalSc.setAttribute('class','modal-dialog');  //给二级标签赋class
  ToolModalTh.setAttribute('class','modal-content'); //给三级标签赋class
  ToolModalFu.setAttribute('class','modal-header');  //给四级标签赋class
  ToolModalFf.setAttribute('class','modal-body');    //给四级标签赋class
  ToolModalSx.setAttribute('class','shop-main');    //给五级标签赋class
  ToolModalSx.innerHTML = getDomFn.createBodyNav(index);  //追加列表
  ToolModalSx.appendChild(getDomFn.createBodyContent(index));  //追加表单
  ToolModalFu.appendChild(CloseBtn);
  ToolModalFu.appendChild(ModalTitle);
  ToolModalFf.appendChild(getDomFn.createHeadMenu(index));  //追加头
  ToolModalFf.appendChild(ToolModalSx);   //追加内容
  ToolModalTh.appendChild(ToolModalFu);   //三层级追加四层header
  ToolModalTh.appendChild(ToolModalFf);   //三层级追加四层body
  ToolModalSc.appendChild(ToolModalTh);   //二层追加三层
  ToolModalFs.appendChild(ToolModalSc);   //父级追加所有
  document.body.appendChild(ToolModalFs); //追加到页面
};
shopToolFn.getCategory = function(index){  //获取分类列表
  var li = '';
  if(CategoryAarry.length>0){
    li = getDomFn.createLeftMenuList(CategoryAarry,index);
  }else{
    $.ajax({
      type: "post",
      url: "/merchant/categories",
      dataType: "json",
      async:false,
      success: function(data) {
        //console.log(data,"查找商品分类链接");
        if(data.result){
          CategoryAarry = data.result.children;
          li += getDomFn.createLeftMenuList(CategoryAarry,index);
        }
      },
      error: function() {
        console.log("请求失败！");
      }
    });
  }
  return li;
};
shopToolFn.searchData = function(datas,index){
  //console.log('当前页码：'+pagination_page_no);
  var _this = this;
  //$('#pageDiv').empty().html('<span class="sui-pagination"></span>');
  $.ajax({
    type: "post",
    url: "/merchant/ecBgoodsList",
    dataType: "json",
    data:datas,
    success: function(data) {
      //console.log(data,"查询商品列表");
      if(data.code=="000"){
        if(data.total%18>0){
          pagination_pages = parseInt(data.total/18)+1;//总页数
        }
        else{
          pagination_pages = parseInt(data.total/18);
        }
        pagination_totals = data.total;//总条数
        ShowShopAarry = data.gInfos;
        getDomFn.createBodyShopList(ShowShopAarry);
        $("#pageDiv-"+index).html("<span class='pageinfo'></span>").removeClass('hide');
        addpage(index);
      } else{
        ShowShopAarry = [];
        getDomFn.createBodyShopList(ShowShopAarry);
        $("#pageDiv-"+index).addClass('hide');
      }
    },
    error: function() {
      console.log("请求失败！");
    }
  });
};
shopToolFn.getShopList = function(index){
  /**
   * a:     //user_cateid
   * b:     //最大价格
   * c:     //最小价格
   * d:     //商品名
   * e:     //
   * f:     //商品标题
   * g:     //批准文号
   * h:     //商品编码
   * i:     //条形码
   * */
  //console.log('初始化获取商品列表',searchData);
  /*ToolKey = index;*/
  searchData.currentPage = pagination_page_no;
  this.searchData(searchData,index);  //默认查找所有
};
shopToolFn.removeShopDataAarry = function(id,arr){
  for(var i=0;i<arr.length;i++){
    if(arr[i].goods_id==id){
      arr.splice(i, 1);
    }
  }
  return arr;
};
shopToolFn.replaceShopAarry = function(data){
  //var arr = nowSelectShopAarry;
  var showDom = $('#show-arr-'+ToolKey);
  var arr = shopToolFn.strToAarry(showDom.val());
  var arrData = nowSelectShopDataAarry;
  var id = data.toString();

  var index = $.inArray(id,arr);
  if(index >= 0){
    arr.removeValue(id);
  }else{
    if(arr.length>=6){
      layer.msg('最多添加6件商品哦！');
      $("[goodsid='"+id+"']").attr('checked',false);
    }else{
      var sLen = $('.select-arr').length;
      for(var i=1;i<sLen;i++){
        if(i!=ToolKey){
          var otherShowDom = $('#show-arr-'+i);
          var otherArr = shopToolFn.strToAarry(otherShowDom.val());
          var isIn = $.inArray(id,otherArr);
          if(isIn>=0){
            layer.msg('其他层已经添加过该商品哦！');
            $("[goodsid='"+id+"']").attr('checked',false);
            return arr;
          }
        }
      }
      arr.push(id);
    }
    /*arrData.push(obj);*/
  }
  console.log(arr,'++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
  /*nowSelectShopDataAarry = arrData;*/
  $('#NOW_COUNT_'+ToolKey).html(arr.length);
  showDom.val(shopToolFn.ArrToString(arr));

  return arr;
};

//返回 是否选中 字符
shopToolFn.getChecked = function(id){
  //var arr = nowSelectShopAarry;
  var showDom = $('#show-arr-'+ToolKey);
  var arr = shopToolFn.strToAarry(showDom.val());
  id = id.toString();
  var res = "";
  var index = $.inArray(id,arr);
  if(index >= 0){
    res = 'checked="checked"';
  }
  return res;
};

/*//返回 是否选中 字符
shopToolFn.getChecked = function(index){
  //var arr = nowSelectShopAarry;
  var showDom = $('#show-arr-'+index);
  var arr = shopToolFn.strToAarry(showDom.val());
  id = id.toString();
  var res = "";
  var index = $.inArray(id,arr);
  if(index >= 0){
    res = "checked";
  }
  return res;
};*/

shopToolFn.submitAarry = function(index){
  var showDom = $('#show-arr-'+index);
  var arr = shopToolFn.strToAarry(showDom.val());
  if(arr.length==0){
    layer.msg('请至少选中一个商品！');
    return;
  }
  var nowSelectShopStr = shopToolFn.ArrToString(arr);
  var datas = {
    id:ToolId,
    goodsIds:nowSelectShopStr,
    line:index
  };
  $.ajax({
    type: "post",
    url: "/merchant/homePage/upd",
    dataType: "json",
    data:datas,
    success: function(data) {
      if(data.status=="OK") {
        layer.msg('保存成功!');
        $('#old-arr-'+index).val(nowSelectShopStr);
        $('#show-arr-'+index).val(nowSelectShopStr);
        $('#label-count-'+index).html(arr.length);
        getDomFn.createShowItem(shopToolFn.getShopData(nowSelectShopStr,index),index);
        $('#shop-tool-'+index).modal('hide');
      }else{
        layer.msg('保存失败!');
      }
    },
    error: function() {
      console.log("请求失败！");
    }
  });
};

shopToolFn.getShopData = function(str,index){  //根据字符串返回商品列表
  var arr = [];
  if(str!=''){
    $.ajax({
      type: "post",
      url: "/merchant/ecBgoodsList",
      dataType: "json",
      data:{goods_id:str},
      async:false,
      success: function(data) {
        if(data.code=='000'){
          if(data.gInfos&&data.gInfos.length>0){
            arr = shopToolFn.getUpShop(data.gInfos,index);    //排除下架商品
          }else{
            arr = [];
          }
        }
      },
      error:function () {
        console.log("请求失败！");
      }
    });
  }
  return arr;
};

shopToolFn.strToAarry = function(str){
  return str?str.split(','):[];
};

shopToolFn.ArrToString = function(arr){
  return arr.join(',');
};

shopToolFn.getUpShop = function(data,index){
  var arrData = [];
  var strArr = [];
  var str = '';
  for(var i=0;i<data.length;i++){
    if(data[i].goods_status==1){
      arrData.push(data[i]);
      strArr.push(data[i].goods_id);
    }
  }
  str = shopToolFn.ArrToString(strArr);
  $('#old-arr-'+index).val(str);
  $('#show-arr-'+index).val(str);
  $('#label-count-'+index).html(arrData.length);
  return arrData;
};
//切换分类
function changeList(code,index){
  $('#left-category-'+index).find('li').removeClass('active');
  $('#cate_'+index+'_'+code).addClass('active');
  pagination_page_no = 1;   //重置页码
  searchData.user_cateid = code==0?'':code;//重置分类ID
  searchData.currentPage = 1;//重置页码
  shopToolFn.searchData(searchData,index);  //调取查询接口
};

//添加分页器
function addpage(methodName) {
  // console.log('总页数：'+pagination_pages);
  // console.log('当前页码：'+pagination_page_no);
  console.log(ToolKey);
  if(pagination_page_no>pagination_pages){
    pagination_page_no =pagination_pages;
  }
  console.log('---------'+methodName+'----------');
  /*$('.pageinfo').html('');*/
  $('#pageDiv-'+methodName).children('.pageinfo').pagination({
    pages: pagination_pages, //总页数
    styleClass: ['pagination-large'],
    showCtrl: true,
    displayPage: 4,
    currentPage: pagination_page_no, //当前页码
    onSelect: function (num) {
      pagination_page_no = num;
      //pagination_page_no=num;
      shopToolFn.getShopList(methodName);
      if (typeof methodName === "function"){
        methodName();
      }
    }
  });

  // $('.pageinfo').find('span:contains(共)').append("(" + pagination_totals + "条记录)");

  /*var pageselect = '&nbsp;<select class="page_size_select" style="width:80px;display: none" >';
  var pagearr = [];
  $.each(pagearr, function () {

    if (this == pagination_pagesize) {
      pageselect = pageselect + '<option value="' + this + '" selected>' + this + '</option>';
    } else {
      pageselect = pageselect + '<option value="' + this + '" >' + this + '</option>';
    }
  });

  pageselect = pageselect + '</select>&nbsp;';
  if( !$('.page_size_select').val()){
    $('.pageinfo').find('span:contains(共)').prepend(pageselect);
  }
*/

  $('.page_size_select').one('change',function(){
    pagination_pagesize = $(this).val();
    methodName(methodName);
  });


};

//添加 或 删除商品
function addShop(id){
 //获取id值  排重
  nowSelectShopAarry = shopToolFn.replaceShopAarry(id);
  /*console.log(this);*/
};

function changeKeys(id,index){
  ToolId = id;
  ToolKey = index;
  var goods_title = $('#goods_title-'+index).val('');
  var approval_number = $('#approval_number-'+index).val('');
  var goods_code = $('#goods_code-'+index).val('');
  var bar_code = $('#bar_code-'+index).val('');
  var goods_name = $('#goodsTitle-'+index).val('');
  var maxPrice = $('#endPrice-'+index).val('');
  var minPrice = $('#startPrice-'+index).val('');
  /*console.log(maxPrice,minPrice);
  if(maxPrice!=''){
    maxPrice = parseFloat(maxPrice)*100;
  }
  if(minPrice!=''){
    minPrice = parseFloat(minPrice)*100;
  }*/

  /*var sData = {
    maxPrice:maxPrice,
    minPrice:minPrice,
    goods_name:goods_name,
    pageNum:18,
    currentPage:1,
    //        goods_img:1,
    goods_status:1,
    goods_title:goods_title,//商品标题
    approval_number:approval_number,//批准文号
    goods_code:goods_code,//商品编码
    bar_code:bar_code //条形码
  };*/
  pagination_page_no = 1;
  var sData = {
    maxPrice:'',
    minPrice:'',
    goods_name:'',
    pageNum:18,
    currentPage:1,
    //        goods_img:1,
    goods_status:1,
    goods_title:'',//商品标题
    approval_number:'',//批准文号
    goods_code:'',//商品编码
    bar_code:'' //条形码
  };
  searchData = sData;
 /* searchData = {
    user_cateid:'',
    maxPrice:'',
    minPrice:'',
    goods_name:'',
    pageNum:18,
    currentPage:1,
//        goods_img:1,
    goods_status:1,
    goods_title:'',//商品标题
    approval_number:'',//批准文号
    goods_code:'',//商品编码
    bar_code:''//条形码
  };*/
  shopToolFn.getShopList(index);
  var str = $('#old-arr-'+index).val();
  var arr = str?str.split(','):[];
  $('#NOW_COUNT_'+ToolKey).html(arr.length);
  getDomFn.checkGoodsInput(index,arr);
};
//按钮方法绑定
