package com.chenpt.designModel.strategyModel;

/**
 * @Author: chenpengtao
 * @Description: 定义个策略接口返回优惠折扣
 * 针对不同的用户返回不同的比例
 * @Date: created in 2018/8/20
 * @Modified By:
 */
public interface Strategy {
    double reRate();
}
