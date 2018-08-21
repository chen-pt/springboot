package com.chenpt.designModel.decorateModel;

/**
 * @Author: chenpengtao
 * @Description:
 * @Date: created in 2018/7/31
 * @Modified By:
 */
public class QHeroDecorate implements Learning {

    Hero hero ;

    public QHeroDecorate (Hero hero){
        this.hero = hero;
    }

    @Override
    public void Learn() {
        hero.Learn();
        ReturnCity();
    }

    public void ReturnCity(){
        System.out.println("学习了回城技能");
    }
}
