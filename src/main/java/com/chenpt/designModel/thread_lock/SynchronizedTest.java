package com.chenpt.designModel.thread_lock;

/**
 * @Author: chenpengtao
 * @Description:
 * @Date: created in 2018/7/20
 * @Modified By:
 */
public class SynchronizedTest {


    public  void test1(){
        int i= 5;
        while (--i >0){
            System.out.println(Thread.currentThread().getName()+":"+i);
        }
    }

    public void test2(){
        synchronized (this){
            int i= 5;
            while (--i >0){
                System.out.println(Thread.currentThread().getName()+":"+i);
            }
        }

    }


}
