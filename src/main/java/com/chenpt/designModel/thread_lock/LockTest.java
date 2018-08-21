package com.chenpt.designModel.thread_lock;

import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/**
 * @Author: chenpengtao
 * @Description:
 * @Date: created in 2018/7/20
 * @Modified By:
 */
public class LockTest {
    private Lock lock = new ReentrantLock();

    public void testLock(Thread thread){

        lock.lock();

        try {
            System.out.println("线程名"+thread.getName() + "获得了锁");
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            System.out.println("线程名"+thread.getName() + "释放了锁");
            lock.unlock();
        }



//        if(lock.tryLock()){
//            try {
//                System.out.println("线程名"+thread.getName() + "获得了锁");
//            }catch (Exception e){
//                e.printStackTrace();
//            }finally {
//                System.out.println("线程名"+thread.getName() + "释放了锁");
//                lock.unlock();
//            }
//        }else {
//            System.out.println("线程名"+thread.getName() + "--有人占着锁，我就不用拉");
//        }


    }


}
