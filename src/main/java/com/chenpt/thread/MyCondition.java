package com.chenpt.thread;

import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/**
 * Created by chenpt on 2018/11/18.
 */
public class MyCondition {

    private Lock lock = new ReentrantLock();
    private Condition condition1 = lock.newCondition();
    private Condition condition2 = lock.newCondition();


    public void methodA(){
        try {
            lock.lock();
            System.out.println(Thread.currentThread().getName()+"进入methodA 并获得锁");
            condition1.await();
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            System.out.println(Thread.currentThread().getName()+"离开methodA 并释放锁");
            lock.unlock();
        }
    }

    public void methodB(){
        try {
            lock.lock();
            System.out.println(Thread.currentThread().getName()+"进入methodB 并获得锁");
            condition1.signal();
            condition2.await();
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            System.out.println(Thread.currentThread().getName()+"离开methodB 并释放锁");
            lock.unlock();
        }
    }

    public static void main(String[] args){
        MyCondition condition = new MyCondition();
        new Thread(new Runnable() {
            @Override
            public void run() {
                condition.methodA();
            }
        },"线程A").start();

        new Thread(new Runnable() {
            @Override
            public void run() {
                condition.methodB();
            }
        },"线程B").start();
    }

}
