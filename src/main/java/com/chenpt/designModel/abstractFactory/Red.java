package com.chenpt.designModel.abstractFactory;

/**
 * @Author: chenpengtao
 * @Description:
 * @Date: created in 2018/7/19
 * @Modified By:
 */
public class Red implements Color {
    @Override
    public void fill() {
        System.out.println("I am red");
    }
}
