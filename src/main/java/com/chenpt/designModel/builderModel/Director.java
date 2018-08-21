package com.chenpt.designModel.builderModel;

/**
 * @Author: chenpengtao
 * @Description:
 * @Date: created in 2018/8/14
 * @Modified By:
 */
public class Director {

    public Person createHumanByDirecotr(IBuildPerson iBuildPerson){
        iBuildPerson.buildHead();
        iBuildPerson.buildBody();
        iBuildPerson.buildHand();
        iBuildPerson.buildFoot();

        return iBuildPerson.createPerson();
    }

}
