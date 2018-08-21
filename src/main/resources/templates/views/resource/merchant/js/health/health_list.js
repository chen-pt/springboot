var vm;
$(function () {
  vm = new Vue({
    el: '#health_list',
    data: {
      stores : [],
      memberList : [],
      // phone:'',
      // idCard:''
    },
    created: function () {
      getStores();
      getList();
    },
    methods : {
      edit:function (index) {
        // alert(index)
        this.memberList[index].phoneEdit=false
        this.memberList[index].idCardEdit=false
        this.memberList[index].edit=false

      },
      changeNameOrIdCard:function(index,healthId){
        // alert(index)
        this.memberList[index].phoneEdit=true
        this.memberList[index].idCardEdit=true
        this.memberList[index].edit=true

        // var oldPhone=this.memberList[index].phone;

        var data={};
        data.id=healthId;
        data.flag=1
        if(this.memberList[index].phone!=""){
          data.mobile=this.memberList[index].phone;
        }
        if(this.memberList[index].idcardNumber!=""){
          data.idCardNum=this.memberList[index].idcardNumber;
        }
        if(this.isPoneAvailable(data.mobile)==false){
          // this.memberList[index].phone=oldPhone;
          getList();
          alert("手机号码格式不正确")
          return
        }
        if(this.isIdCard(data.idCardNum)==false){
          // this.memberList[index].phone=oldPhone;
          getList();
          alert("身份证格式不正确")
          return
        }

        $.ajax({
          type:'post',
          data:data,
          url:"/merchant/editPhoneOrIdCard",
        }).then( function (res) {
            if(res.message=="Success"){
              getList();
              alert("修改成功")
            }else{
              alert("修改发生问题,请稍候重试")
            }
        })
      },
      isPoneAvailable: function (pone) {
        var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!myreg.test(pone)) {
          return false;
        } else {
          return true;
        }
      },
      isIdCard:function(idCard){
        var id=idCard;
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (reg.test(id) === false) {
          return false;
      }

  }

    }
  })

  $('.page_size_select').change(function () {
    pageSize = this.val();
    getList();
  })
})


function getStores() {
  $.post(
    "/merchant/storelist",
    function (res) {
      console.debug(res);
      vm.stores = res;
    });
}

function getList() {
  var url = "/merchant/healthList";

  var param = {};
  var phone = $('#phone').val();
  if (phone) param.phone=phone;
  var checkdateBegin = $('#checkdateBegin').val();
  if (checkdateBegin) param.checkdateBegin=checkdateBegin;
  var checkdateEnd = $('#checkdateEnd').val();
  if (checkdateEnd) param.checkdateEnd=checkdateEnd;
  var storeId = $('#storeName').val();
  if (storeId) param.storeId = storeId;
  var fullname = $('#fullname').val();
  if (fullname) param.fullname = fullname;

  param.pageSize = pageSize;
  param.pageno = curPage;

  $.post(
    url,
    param,
    function(result){
      if(result.message == 'Success'){
        var list = result.value.list;

        vm.memberList = list;
        var xx=vm;
        vm.memberList.map(function (item) {
          xx.$set(item, 'phoneEdit', true);
          xx.$set(item, 'idCardEdit', true);
          xx.$set(item, 'edit', true);
        })

        var num = result.value.total
        totalNum = num;

        $("#last_page_index").html(result.value.pages);
        $("#page_count").html("共" + result.value.pages + "页");
        $("#row_count").html("("+result.value.total+"条记录)");

        if($('.pageinfo')){
          $('.pageinfo').remove();
        }

        $(".health-list").append("<span class='pageinfo' style='text-align:right'></span>")

        $('.pageinfo').pagination({
          pages: result.value.pages,
          styleClass: ['pagination-large'],
          showCtrl: true,
          displayPage: 6,
          currentPage: curPage,
          onSelect: function (num) {
            curPage = num;
            getList();
          }
        });
        getNum();
      }else {
        vm.priceList = [];
        console.log("error ....");
      }
    },
    "json");
}

//列表
var curPage = 1;
var totalNum = 0;
var pageSize = 15;

function getNum() {
  $('.pageinfo').find('span:contains(共)').append("<span id='m_t_n'>(" + totalNum + "条记录)</span>");
  //页码选择
  var pagearr = [15, 30, 50, 100];

  var pageselect = '<select class="page_size_select" style="width: 50px;">';

  $.each(pagearr, function () {

    if (this == pageSize) {
      pageselect = pageselect + '<option value="' + this + '"  selected>' + this + '</option>';
    } else {
      pageselect = pageselect + '<option value="' + this + '">' + this + '</option>';
    }
  });

  pageselect = pageselect + '</select>&nbsp;';

  $('.pageinfo').find('span:contains(共)').prepend(pageselect);

  $('.page_size_select').change(function () {
    pageSize = $('.page_size_select').val();
    getList()
  })
}
