package com.chenpt.designModel.abstractFactory;

/**
 * @Author: chenpengtao
 * @Description:
 * @Date: created in 2018/7/19
 * @Modified By:
 */
public abstract class AbstractFactory {

    public abstract Animal getAnimal(String animal);

    public abstract Color getColor(String color);

}
