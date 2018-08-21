package com.chenpt.designModel.builderModel;

/**
 * @Author: chenpengtao
 * @Description:
 * @Date: created in 2018/8/14
 * @Modified By:
 */
public class Man implements IBuildPerson {
    Person person = new Person();

    @Override
    public void buildHead() {
        person.setHead("男人");
    }

    @Override
    public void buildBody() {
        person.setBody("身体");
    }

    @Override
    public void buildHand() {
        person.setHand("手");
    }

    @Override
    public void buildFoot() {
        person.setFoot("脚");
    }

    @Override
    public Person createPerson() {
        return person;
    }
}
