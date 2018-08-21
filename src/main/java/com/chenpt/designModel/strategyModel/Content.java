package com.chenpt.designModel.strategyModel;

/**
 * @Author: chenpengtao
 * @Description:
 * @Date: created in 2018/8/20
 * @Modified By:
 */
public class Content {

    Strategy strategy;

    public Content(Strategy strategy){
        this.strategy=strategy;
    }

    public double getRate(){
        return strategy.reRate();
    }

}
