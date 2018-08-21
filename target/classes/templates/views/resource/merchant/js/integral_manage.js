define(['vue'], function (Vue) {



  var integral = {};

  integral.integral_list_pageno = 1;
  integral.cur_per_page = 15;
  integral.cur_buyer_id = -1;

  integral.integral_report_pageno = 1;
  integral.report_cur_per_page = 15;



  /**积分管理列表**/
  integral.get_integral_list = function () {

    var vm = new Vue({
      el: "#integral_table",
      data: function () {
        return {result: '', status: ''}
      },
      ready: function () {

        var _self = this;
        _self.getIntegralList();
        //回车搜索
        $(document).keyup(function(event){
          if(event.keyCode ==13){
            _self.getIntegralList();
          }
        });

      },
      methods: {

        getIntegralList: function () {
          getList(this);

        }
      }
    });
  }
  function getList(_self) {

   /* $("#integral_table").html('');
    AlertLoading($("#integral_table"));*/
    var url = "/merchant/members";
    var datas = {};
    datas.pageNum = integral.integral_list_pageno;
    datas.pageSize = integral.cur_per_page;
    datas.mobile = $("#phone").val();

    AlertLoading($("#integral_table"));

    $.ajax({
      url: url,
      data: datas,
      type: 'post',
      success: function (data) {
        _self.result = data.result;
        _self.status = data.status;

        $("#integral_table").children(".alert-loading").hide();

        if (_self.status && data.status) {
          //pageHelper(".pageinfo", data.page, _self.getIntegralList());

          $('.pageinfo').pagination({
            pages: data.page.pages,
            styleClass: ['pagination-large'],
            showCtrl: true,
            displayPage: 6,
            currentPage: integral.integral_list_pageno,
            onSelect: function (num) {
              integral.integral_list_pageno = num;
              _self.getIntegralList();
            }
          });
          $('.pageinfo').pagination('updatePages', data.page.pages);

          $('.pagination-large').find('div span:eq(0)').empty();
          var html = "";//$('.pagination-large').find('div span:eq(0)').html();
          $('.pagination-large').find('div span:eq(0)').html("<select class='page_size_select' style='width: 50px'>" +
            "<option value='15'>15</option><option value='30'>30</option><option value='50'>50</option><option value='100'>100</option></select>"
            + html + " (" + data.page.total + "条记录)");
          $('.page_size_select').find('option[value=' + integral.cur_per_page + ']').attr("selected", true);

          $('.page_size_select').live('change', function () {
            integral.integral_list_pageno = 1;
            integral.cur_per_page = $(this).val();
            _self.getIntegralList();
          });
        }

      }
    });
  }

  /**积分记录**/
  integral.get_report_list = function () {

    function formatTime(str) {
      var strDate = new Date(str + 8 * 3600 * 1000);
      var sDate = strDate.toISOString().replace("T", " ")
        .replace(/\..+$/, "");
      return sDate.replace(/年|月/g, '-').replace(/日/g, '');
    }

    var vm = new Vue({
      el: "#integral_report_table",
      data: function () {
        return {result: '', status: ''}
      },
      ready: function () {
        var _self = this;
        _self.getIntegralList();

      },
      methods: {
        getIntegralList: function () {
          getLogList(this);

        }
      },
      filters: {
        desc_format: function (value) {
          value = (value && value.length > 5 && value.indexOf(":") != -1) ? value.substr(0, value.indexOf(":")) : value;
          return value || "";
        },
        time_format: function (value) {
          return formatTime(value);
        }

      }

    });

    function getLogList(_self) {
      var url = "/merchant/logQuery";
      var datas = {};
      datas.pageNum = integral.integral_list_pageno;
      datas.pageSize = integral.cur_per_page;
      datas.mobile = $("#phone").val();
      datas.buyerId = $("#memberId").val();

      $.ajax({
        url: url,
        data: datas,
        type: 'post',
        success: function (data) {
          _self.result = data.result;
          _self.status = data.status;
          if (_self.status) {
            $('.pageinfo').pagination({
              pages: data.page.pages,
              styleClass: ['pagination-large'],
              showCtrl: true,
              displayPage: 6,
              currentPage: integral.integral_list_pageno,
              onSelect: function (num) {
                integral.integral_list_pageno = num;
                _self.getIntegralList();
              }
            });
            $('.pageinfo').pagination('updatePages', data.page.pages);

            var html = "";//$('.pagination-large').find('div span:eq(0)').html();
            $('.pagination-large').find('div span:eq(0)').empty();
            $('.pagination-large').find('div span:eq(0)').html("<select class='page_size_select' style='width: 50px'>" +
              "<option value='15'>15</option><option value='30'>30</option><option value='50'>50</option><option value='100'>100</option></select>"
              + html + " (" + data.page.total + "条记录)");
            $('.page_size_select').find('option[value=' + integral.cur_per_page + ']').attr("selected", true);

            $('.page_size_select').live('change', function () {
              integral.integral_list_pageno = 1;
              integral.cur_per_page = $(this).val();
              _self.getIntegralList();
            });
          }

        }
      });
    }
  }

  integral.updateForce = function () {
    if (integral.cur_buyer_id > 0) {
      var integral_val = $('input[name="integral_val"]').val();
      var type = true;
      if (integral_val.indexOf("-") > -1) {
        if (integral_val.indexOf("-") > 0) {
          alert("请输入正确的积分值!");
          return;
        }
        integral_val = integral_val.replace(/-/g, '');
        type = false;
      }
      if (!integral_val || integral_val == 0) {
        alert("请输入正确的积分值!");
        return;
      }
      var datas = {};
      datas.buyerId = integral.cur_buyer_id;
      datas.type = type;
      datas.value = integral_val;

      $.post("/merchant/updateForce", datas, function (data) {
        if (data.status=="success") {
          alert("修改成功！");
          location.reload();
        } else {
          alert("操作失败");
        }
      });
    }

  }

  return integral;

});
