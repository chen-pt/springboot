!(function() {
  'use strict';
  define(['services', 'slidebar', 'doT'], function(YBZF, slidebar, doT) {
    $('.slidebar').slidebar();

    $.extend((function() {
      // doT 模板设置
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

      return {
        'tmpl': function(template, data) {
          return doT.template(template)(data);
        }
      }
    })());

    // 查看图片
    $(document).on('click', '.small-img', function() {
      var src = $(this).find('img').prop('src');
      layer.open({type: 1,
        title: false,
        closeBtn: true,
        shift: 0,
        area: ['auto', 'auto'],
        skin: 'layui-layer-molv',
        shadeClose: false,
        content: '<div><img src="' + src + '"/></div>'
      });
    });

    $(document).on('input', '.editor-wrap textarea', function() {
      $(this).siblings('.num-limit').find('.js-pl-limit').empty().append(this.value.length);
    });


    //左边的导航栏展开和隐藏
    $(document).ready(function(){
      var arrow = $("a.clink-all");
      arrow.parent().find("ul.expmenu li").addClass("active");
      arrow.text('全部展开').addClass("active");
      arrow.parent().find('.nav-header i').removeClass('icon-pc-chevron-bottom').addClass('icon-pc-chevron-top');
      $("a.clink-all").click(function() {
        var arrow = $(this);
        if($(".expmenu").find("li[class=active]").length == $(".expmenu").find("li").length) {
          arrow.parent().find("ul.expmenu li").removeClass("active");
          arrow.text('全部隐藏').removeClass("active");
          arrow.parent().find('.nav-header i').removeClass('icon-pc-chevron-top').addClass('icon-pc-chevron-bottom');
        }
        else
        {
          arrow.parent().find("ul.expmenu li").addClass("active");
          arrow.text('全部展开').addClass("active");
          arrow.parent().find('.nav-header i').removeClass('icon-pc-chevron-bottom').addClass('icon-pc-chevron-top');
        }
      });
      $("ul.expmenu li > .nav-header").click(function() {
        var arrow = $(this).parent('ul.expmenu li');
        //当前ul.expmenu li 是否展开和隐藏
        if(arrow.hasClass("active")) {
          arrow.removeClass("active");
          arrow.find('.nav-header i').removeClass('icon-pc-chevron-top').addClass('icon-pc-chevron-bottom');
        } else if(arrow.hasClass("")) {
          arrow.addClass("active");
          arrow.find('.nav-header i').removeClass('icon-pc-chevron-bottom').addClass('icon-pc-chevron-top');
        }
        //ul.expmenu li是否全部展开和隐藏
        var liSize = $('ul.expmenu ').find('li').size();
        var activeSize = $('ul.expmenu ').find('li.active').size();
        if(liSize == activeSize) {
          arrow.parents('.sidebar').find('.clink-all').html('全部隐藏');
          arrow.parents('.sidebar').find('.clink-all').addClass("active");
        }else {
          arrow.parents('.sidebar').find('.clink-all').html('全部展开');
          arrow.parents('.sidebar').find('.clink-all').removeClass("active");
        }
      });

//             导航栏tab切换
      $(".nav-tabs li").click(function(){
        $(this).addClass("active").siblings("li").removeClass("active");
      })

      $("#check-all").click(function(){
        $('table').find('[type="checkbox"]').checked=true;
        $('table').find('[type="checkbox"]').prop('checked', true);
      });
      $('#batch-del').click(function(){
        $('table').find('[type="checkbox"]:checked').parents('tr').remove();
      });
      $(".select_all_btn").click(function(){
        if($(this).prop('checked')){
          $('table').find('[type="checkbox"]').prop('checked', true);
          $('table').find('[type="checkbox"]').parent().addClass('checked');
        }else{
          $('table').find('[type="checkbox"]').prop('checked', false);
          $('table').find('[type="checkbox"]').parent().removeClass('checked');
        }
      });

      /*
       $('.pageinfo').pagination({
       pages: 5,
       styleClass: ['pagination-large'],
       showCtrl: true,
       displayPage: 6,
       currentPage: 2,
       onSelect: function (num) {
       getNum();
       }
       });
       getNum();*/


    });
    function getNum(){
      $('.pageinfo').find('span:contains(共)').append("(" + 100 + "条记录)");
      //页码选择
      var pagearr = [15,30,50,100];

      var pageselect = '&nbsp;<select class="page_size_select">';

      $.each(pagearr, function(){

        if(this==5)
        {
          pageselect =pageselect+'<option value="'+this+'" selected>'+this+'</option>';
        }else{
          pageselect =pageselect+'<option value="'+this+'" >'+this+'</option>';
        }
      });

      pageselect = pageselect+'</select>&nbsp;';

      $('#pageinfo').find('span:contains(共)').prepend(pageselect);
    }

    return YBZF;
  });
})();
