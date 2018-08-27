package com.chenpt.designModel.bridgeModel;

/**
 * @Author: chen
 * @Description:
 * @Date: created in 2018/8/27
 * @Modified By:
 */
public class Red implements Color {

    @Override
    public void isColor(String shape) {
        System.out.println("红色的"+shape);
    }
}
