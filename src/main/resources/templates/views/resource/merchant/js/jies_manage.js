/**
 * Created by zhangduoduo on 2017/3/13.
 */
var ACCOUNT = {};

ACCOUNT.GetNum = {

    settings: {
        //modalID: '#modal-slider',
    },
    init: function () {
        this.ajaxGetList();
        this.even();
    },
    even: function () {

      $(document).keyup(function(event){
        if(event.keyCode ==13){
          ACCOUNT.GetNum.ajaxGetList();
        }
      });
        $("#search").on('click', function () {
            ACCOUNT.GetNum.ajaxGetList();
        });
    },
    ajaxGetList: function () {
        var data = {
            "pageNum":pagination_page_no,
            "pageSize":pagination_pagesize,
            "financeNo": $("input[name=pay_number]").val(),
            "findType":"merchant",
            "payStyle": $('#pay_style option:selected').val()
        };

      $("#account_table").html('');
      AlertLoading($("#account_table"));
        $.ajax({
            type: 'post',
            url: "get_product_list",
            dataType: 'json',
            data:data,
            success: function (data) {

              pagination_pages = data.pages;
              pagination_totals = data.total;

                var tmpl = document.getElementById('accountList').innerHTML;
                var doTtmpl = doT.template(tmpl);
                $("#account_table").html(doTtmpl(data));
              $("#pagediv").html("<span class='pageinfo'></span>")
                addpage(ACCOUNT.GetNum.ajaxGetList);
            }
        });
    }
};

ACCOUNT.init = function () {
    ACCOUNT.GetNum.init();
};

$(function () {
    ACCOUNT.init();
});
