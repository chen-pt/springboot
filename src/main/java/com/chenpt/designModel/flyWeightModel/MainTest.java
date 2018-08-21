package com.chenpt.designModel.flyWeightModel;

/**
 * @Author: chenpengtao
 * @Description:
 * @Date: created in 2018/8/20
 * @Modified By:
 */
public class MainTest {

    public static void main(String[] args){
        WebSiteFactory factory = new WebSiteFactory();

        WebSite fx = factory.getWebSite("产品展示");
        fx.use(new User("小菜"));

        WebSite fy = factory.getWebSite("产品展示");
        fx.use(new User("大鸟"));

        WebSite fz = factory.getWebSite("博客");
        fx.use(new User("阿娇"));

        WebSite fb = factory.getWebSite("博客");
        fx.use(new User("阿呀"));

        System.out.println("创建网站数量："+factory.getSiteCount());

    }


}
