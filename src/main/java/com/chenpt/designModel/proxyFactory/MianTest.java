package com.chenpt.designModel.proxyFactory;

/**
 * @Author: chenpengtao
 * @Description:
 * @Date: created in 2018/7/24
 * @Modified By:
 */
public class MianTest {


    public static void main(String[] args){
        BuyHouse buyHouse = new BuyHouseImpl();
        BuyHouseProxy buyHouseProxy = new BuyHouseProxy(buyHouse);
        buyHouseProxy.buyHouse();
    }

}
