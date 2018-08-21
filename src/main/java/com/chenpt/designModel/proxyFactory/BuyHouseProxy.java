package com.chenpt.designModel.proxyFactory;

/**
 * @Author: chenpengtao
 * @Description:  买房代理类
 * @Date: created in 2018/7/24
 * @Modified By:
 */
public class BuyHouseProxy implements BuyHouse {

    BuyHouse buyHouse;

    public BuyHouseProxy(BuyHouse buyHouse){
        this.buyHouse=buyHouse;
    }



    @Override
    public void buyHouse() {
        System.out.println("买房前准备");
        buyHouse.buyHouse();
        System.out.println("买房后装修");
    }
}
