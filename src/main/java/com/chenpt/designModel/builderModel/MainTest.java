package com.chenpt.designModel.builderModel;

/**
 * @Author: chenpengtao
 * @Description:
 * @Date: created in 2018/8/14
 * @Modified By:
 */
public class MainTest {

    public static void main(String[] args){
        Director director = new Director();

        Person person = director.createHumanByDirecotr(new Man());
        Person person2 = director.createHumanByDirecotr(new WoMen());
        System.out.println(person.getHead()+person.getBody());
        System.out.println(person2.getHead()+person2.getBody());
    }

}
