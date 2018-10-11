package com.chenpt.thread;


import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/**
 * @Author: chen
 * @Description:
 * @Date: created in 2018/10/10
 * @Modified By:
 */
public class ThreadTest1{
   volatile int num = 0;
   Lock lock = new ReentrantLock();

    /**
     * 加锁控制变量原子性
     */
   public void autoAdd(){
       lock.lock();
       try {
           for(int i=0;i<1000;i++){
               num++;
           }
       }finally {
           lock.unlock();
       }

   }

    /**
     * 同步方式控制
     */
   public synchronized void autoAdd2(){
        for(int i=0;i<1000;i++){
            num++;
        }

    }

    /**
     * AtomicInteger方式控制原子性
     */
   AtomicInteger num2 = new AtomicInteger();
   public void autoAdd3(){
       for(int i=0;i<1000;i++)
        num2.getAndIncrement();
   }

}
