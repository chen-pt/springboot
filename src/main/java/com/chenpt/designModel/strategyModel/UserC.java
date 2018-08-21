package com.chenpt.designModel.strategyModel;

/**
 * @Author: chenpengtao
 * @Description:
 * @Date: created in 2018/8/20
 * @Modified By:
 */
public class UserC implements Strategy {
    @Override
    public double reRate() {
        return 0.9;
    }
}
