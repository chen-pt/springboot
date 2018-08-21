package com.chenpt.designModel.abstractFactory;

/**
 * @Author: chenpengtao
 * @Description: 创建一个工厂生成器类，通过动物信息或颜色信息来获取工厂。
 * @Date: created in 2018/7/19
 * @Modified By:
 */
public class FactoryProducer {
    public static AbstractFactory getFactory(String choice){
        if(choice.equalsIgnoreCase("Animal")){
            return new AnimalFactory();
        }else if(choice.equalsIgnoreCase("Color")){
            return new ColorFactory();
        }
        return null;
    }
}
