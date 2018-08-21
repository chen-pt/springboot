package com.chenpt.designModel.builderModel;

/**
 * @Author: chenpengtao
 * @Description:
 * @Date: created in 2018/8/14
 * @Modified By:
 */
public interface IBuildPerson {
    //具体组成部分
    void buildHead();
    void buildBody();
    void buildHand();
    void buildFoot();

    Person createPerson();//返回相应的创建对象
}
