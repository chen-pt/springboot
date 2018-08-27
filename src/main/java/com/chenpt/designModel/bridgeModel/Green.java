package com.chenpt.designModel.bridgeModel;

/**
 * @Author: chen
 * @Description:
 * @Date: created in 2018/8/27
 * @Modified By:
 */
public class Green implements Color {

    @Override
    public void isColor(String shape) {
        System.out.println("绿色的"+shape);
    }
}
