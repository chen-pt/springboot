package com.chenpt.designModel.adapterModel;

/**
 * @Author: chen
 * @Description:  翻译者（适配器）
 * @Date: created in 2018/8/24
 * @Modified By:
 */
public class Translator implements Player {

    ForeignCenter foreignCenter;

    Translator(ForeignCenter foreignCenter){
        this.foreignCenter=foreignCenter;
    }

    @Override
    public void attack() {
        foreignCenter.进攻();
    }

    @Override
    public void defense() {
        foreignCenter.防守();
    }
}
