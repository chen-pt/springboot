
/**
 * Created by wt on 2015/7/20.
 */

require.config({
    paths:{
        'core':'../lovejs/core',
        'capital': 'service/capital'
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
        case '/capital/index':initCapital();break;
    }

});

//主页初始化
function initCapital()
{
    require(['capital'], function (capital){

        capital.showtradeStatistics();

        capital.showCapitals('search',1);

    });
}
//订单搜索
function searchcapital()
{
    require(['capital'], function (capital){

        capital.showCapitals('search',1);
    });
}

