/**
 * Created by 卡西 on 2016/4/7.
 */
/**
 * Created by Administrator on 2015/11/19.
 */
require.config({
    paths:{
        'core':'../lovejs/core',
        'tools':'../lovejs/tools',
        'coupons': 'service/coupon'
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
        case '/coupon1/send_manager':initCoupon();break
    }

});
/**
 * 优惠券列表
 ***/
 function initCoupon(){
    require(['coupons'],function(coupons){
        coupons.getSendList();
    })
}
/**
 * 优惠券列表
 ***/
function searchcoupon() {
    require(['coupons'],function(coupons){
        coupons.getSendList();
    })
}








