/**
 * Created by sunhongchao on 2017/7/19.
 */
var pagination_page_no = 1; //页码
var pagination_pages = 1; //总页数
var pagination_totals = 0; //总条数
var pagination_pagesize = 10; //每页显示多少条

function addpage(methodName) {
    if(pagination_page_no>pagination_pages){
        pagination_page_no =pagination_pages;
    }
    $('.pageinfo').pagination({
        pages: pagination_pages, //总页数
        styleClass: ['pagination-large'],
        showCtrl: true,
        displayPage: 4,
        currentPage: pagination_page_no, //当前页码
        onSelect: function (num) {
            pagination_page_no = num;
            vm.pageNum=num;
            if (typeof methodName === "function"){
                methodName();
            }
        }
    });

    // $('.pageinfo').find('span:contains(共)').append("(" + pagination_totals + "条记录)");

    var pageselect = '&nbsp;<select class="page_size_select" style="width:80px;display: none" >';
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


    $('.page_size_select').one('change',function(){
        pagination_pagesize = $(this).val();
        methodName();
    });


};/**
 * Created by admin on 2017/7/19.
 */
