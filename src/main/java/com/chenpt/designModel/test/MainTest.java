package com.chenpt.designModel.test;

/**
 * @Author: chenpengtao
 * @Description:
 * @Date: created in 2018/7/23
 * @Modified By:
 */
public class MainTest {

    public static void main(String[] args) {
        ISubject subject = new MySubject();
        subject.add(new Observer1());
        subject.add(new Observer2());
        subject.operation();
    }

}
