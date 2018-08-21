package com.chenpt.designModel.thread_lock;

/**
 * @Author: chenpengtao
 * @Description:
 * @Date: created in 2018/7/20
 * @Modified By:
 */
public class MainTest {

    public static void main(String[] args){

        LockTest lockTest = new LockTest();
        SynchronizedTest synchronizedTest = new SynchronizedTest();

        Thread t1 = new Thread(new Runnable() {
            @Override
            public void run() {
//                lockTest.testLock(Thread.currentThread());
                synchronizedTest.test1();
            }
        },"t1");

        Thread t2 = new Thread(new Runnable() {
            @Override
            public void run() {
//                lockTest.testLock(Thread.currentThread());
                synchronizedTest.test2();
            }
        },"t2");


        t1.start();
        t2.start();
    }


}
