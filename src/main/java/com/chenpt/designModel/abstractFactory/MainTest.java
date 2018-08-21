package com.chenpt.designModel.abstractFactory;

/**
 * @Author: chenpengtao
 * @Description:
 * @Date: created in 2018/7/19
 * @Modified By:
 */
public class MainTest {
    public static void main(String[] args){
        //获取动物工厂
        AbstractFactory abstractFactory = FactoryProducer.getFactory("animal");
        Animal animal =  abstractFactory.getAnimal("cat");
        Animal animal2 =  abstractFactory.getAnimal("dog");
        animal.descript();
        animal2.descript();

        //获取颜色工厂
        AbstractFactory abstractFactory2 = FactoryProducer.getFactory("color");
        Color color = abstractFactory2.getColor("red");
        Color color2 = abstractFactory2.getColor("green");
        color.fill();
        color2.fill();
    }


}
