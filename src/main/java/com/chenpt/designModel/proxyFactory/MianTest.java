package com.chenpt.designModel.proxyFactory;
import java.lang.reflect.Proxy;

/**
 * @Author: chenpengtao
 * @Description:
 * @Date: created in 2018/7/24
 * @Modified By:
 */
public class MianTest {


    public static void main(String[] args){
//        BuyHouse buyHouse = new BuyHouseImpl();
//        BuyHouseProxy buyHouseProxy = new BuyHouseProxy(buyHouse);
//        buyHouseProxy.buyHouse();


        BuyHouse buyHouse2 = new BuyHouseImpl2();

//        MyProxy myProxy = new MyProxy(buyHouse2);
//        try {
//            BuyHouse subject = (BuyHouse) Proxy.newProxyInstance(myProxy.getClass().getClassLoader(),buyHouse2.getClass().getInterfaces(),myProxy);
//            subject.buyHouse();
//        } catch (Throwable throwable) {
//            throwable.printStackTrace();
//        }

        MyCglib myCglib = new MyCglib();

        BuyHouse buyHouse3 = (BuyHouse) myCglib.getInstance(buyHouse2);
        buyHouse3.buyHouse();
    }

}
