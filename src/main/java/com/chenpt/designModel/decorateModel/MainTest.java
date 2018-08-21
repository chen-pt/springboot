package com.chenpt.designModel.decorateModel;

import org.omg.Messaging.SYNC_WITH_TRANSPORT;

/**
 * @Author: chenpengtao
 * @Description:
 * @Date: created in 2018/7/31
 * @Modified By:
 */
public class MainTest {
    public static void main(String[] args){
        Hero hero = new Hero("达摩");
        Learning learning = new QHeroDecorate(hero);
        learning.Learn();

        Test test = new Test();
        test.setName("你好你好");


        Test test1 = (Test) test.clone();

        System.out.println(test1==test);
    }



}
