package com.chenpt.thread;

/**
 * @Author: chen
 * @Description:
 * @Date: created in 2018/10/10
 * @Modified By:
 */
public class MainTest {

    public static void main(String[] args){
        final ThreadTest1 test1 = new ThreadTest1();
        for (int i=0;i<10;i++){
            new Thread(){
                public void run(){
                    test1.autoAdd();
//                    test1.autoAdd2();
//                    test1.autoAdd3();
                }
            }.start();
        }
        while (Thread.activeCount()>1)
            Thread.yield();
        System.out.println(test1.num);
    }

}
