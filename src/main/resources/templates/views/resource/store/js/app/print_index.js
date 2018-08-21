/**
 * Created by 卡西 on 2016/4/7.
 */

require.config({
    paths:{
        'core':'../lovejs/core',
        'tools':'../lovejs/tools',
        'print': 'service/print'
    }
});

/**
 * 初始化
 */
$(function () {

    require(['core'], function (core) {
        //doT
        core.doTinit();
        //重写console
        core.ReConsole();

    });

    /**
     * 路由
     * @type {string}
     */
    var url =  window.location.pathname;
    switch (url)
    {
        case '/print/receipt':initReceipt();break
    }

});
/**
 * 优惠券列表
 ***/
function initReceipt(){
    require(['print'],function(print){
        print.getPrintXiaopiao();



    })
}

