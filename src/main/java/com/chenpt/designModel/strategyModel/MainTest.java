package com.chenpt.designModel.strategyModel;

/**
 * @Author: chenpengtao
 * @Description:
 * @Date: created in 2018/8/20
 * @Modified By:
 */
public class MainTest {

    /**
     * 比如说一款皮肤88元，那么针对三个用户最终需要付多少呢
     */
    public static void main(String[] args){
        int total = 88;
        double result;
        Content content;

        //客户a
        content = new Content(new UserA());
        result = total*content.getRate();
        System.out.println("A用户所需钱数="+result);

        //客户b
        content = new Content(new UserB());
        result = total*content.getRate();
        System.out.println("B用户所需钱数="+result);

    }

}
