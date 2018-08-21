/**
 * Created by admin on 2017/3/29...
 */

// 隐藏没有的字段
window.onload=function() {
  //隐藏相同项
  $(document).on("click", "#hide", function () {
    $('.field-group:not(.diff)').fadeToggle('slow');
  });

  //标红不同项
  $(".field-group").each(function(){
    //var checkbox = ['approval_number','good_user_cateid','bar_code'];
    var first=$(this).find('td').eq(1).html();
    var isDom = $(this).find('td').eq(3);
    var second = '';
    if(isDom.find('span').length==0){
      if(isDom.find('input').length>0){
        second = '';
      }else{
        second=isDom.html();
      }
    }else{
      second=isDom.find('span').html();
    }
    if(first&&second){  //两边都有值的情况下
      if(first!=second){
        $(this).addClass('diff');
        //替换sapn标签为textarea文本对象
        var content = $('.diff span').html();
        //var insertHtml='<div>我是插入的元素。</div>'
        var value = $('<textarea class="diffFeid">'+content+'</textarea>');
        $('.diff span').after(value);
        $('.diff span').remove();
        var detail_tpl = location.search.substr(location.search.length - 2, location.search.length);
        // 获取设置值
        $.ajax({
          type: 'post',
          url: '/jk51b/goods/queryState',
          data: {
            'detail_tpl': detail_tpl
          },
          dataType: 'json',
        }).done(function (rsp) {
         var fields = rsp.results.items[0].fields;
         console.log(fields);
          $(".diffFeid").parents("td").parents("tr").find(".field-checkbox input").each(function(){
            var fieldscheck = ($(this).attr("name")) ;
            console.log(fieldscheck);
            var flag = new RegExp(fieldscheck).test(fields);
            console.log(flag);
            if(flag){
              $(this).prop("disabled",false).prop("checked",true).show()
            }else{
              var spanClass = ($(this).attr("name"));
              var spanVal =$(this).parents("td").next().find(".diffFeid").html();
              var content1 = spanVal;
              var value = $('<span class ="'+spanClass+'">'+content1+'</span>');
              $(this).parents("td").next().find(".diffFeid").after(value);
              $(this).parents("td").next().find(".diffFeid").remove();
            }
          });
        });
      }
    }
  });
  //全选
  $(document).on("click", "#checkall", function () {
    var self = this;
    $('.field-checkbox').find('input:checkbox').each(function () {
      // 禁用的 不进行操作
      if (!this.disabled) {
        this.checked = self.checked;
      }
    });
  });

  $(document).on('change', '.field-checkbox input:checkbox', function () {
    var $fieldCheckbox = $('.field-checkbox').find('input:visible:checkbox');
    if ($fieldCheckbox.length == $fieldCheckbox.filter(':checked').length) {
      $("#checkall").prop('checked', true);
    } else {
      $("#checkall").prop('checked', false);
    }
  });

  $(document).on('change', '.field-sync-val', function () {
    $(this).next('.sync-val').val(this.value);
  });




  var detail_tpl = location.search.substr(location.search.length - 2, location.search.length);
  var nofields = [];

  nofields['10'] = ['goods_usage', 'forpeople_desc'];
  nofields['40'] = ['com_name', 'drug_category', 'goods_property', 'goods_use', 'goods_forpeople', 'is_medicare', 'medicare_code', 'goods_action'];
  nofields['80'] = ['com_name', 'drug_category', 'goods_property', 'goods_use', 'goods_forpeople', 'is_medicare', 'medicare_code', 'goods_action'];
  nofields['60'] = ['com_name', 'drug_category', 'goods_property', 'goods_use', 'goods_forpeople', 'is_medicare', 'medicare_code', 'goods_action'];
  nofields['30'] = ['com_name', 'goods_property', 'goods_forts', 'goods_use', 'goods_forpeople', 'is_medicare', 'medicare_code'];
  nofields['50'] = ['com_name', 'goods_property', 'goods_forts', 'goods_use', 'goods_forpeople', 'is_medicare', 'medicare_code'];
  nofields['70'] = ['goods_forts', 'goods_use', 'goods_forpeople', 'is_medicare', 'medicare_code', 'bar_code', 'goods_description'];
  nofields['20'] = ['com_name', 'drug_category', 'goods_property', 'goods_forts', 'goods_use', 'goods_forpeople', 'is_medicare', 'medicare_code'];


  $.each(nofields[detail_tpl], function (k, v) {
    $("#" + v).parents('tr').remove();
    $("#" + v).remove();
  });
}

function getTings() {
  var detail_tpl = location.search.substr(location.search.length - 2, location.search.length);
  // 获取设置值
  $.ajax({
    type: 'post',
    url: '/jk51b/goods/queryState',
    data: {
      'detail_tpl': detail_tpl
    },
    dataType: 'json',
  }).done(function (rsp) {
    if (rsp.status && rsp.results.items[0].fields) {
      var fields = rsp.results.items[0].fields.split(',');

      $.each(fields, function (k, v) {
        $('#' + v).prop('checked', true);
      });
    }
  });
}

getTings();

$(document).on('click', '#save', function () {
  var fields = $('#fields').find('input:checked').map(function () {
    return this.id;
  }).get();

  var detail_tpl = location.search.substr(location.search.length - 2, location.search.length);
  $.ajax({
    type: 'post',
    url: '/jk51b/goods/modelSave',
    data: {
      'fields': fields.join(','),
      'detail_tpl': detail_tpl,
      'fields_pk': 'approval_number'
    },
    dataType: 'json'
  }).done(function (rsp) {
    if (rsp.status == "ok") {
      layer.msg("设置成功", function () {
        location.pathname = '/jk51b/goods/update';
      });
    } else {
      layer.msg(rsp.result.msg);
    }
  });
});

