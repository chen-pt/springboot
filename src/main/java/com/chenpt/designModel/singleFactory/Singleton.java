package com.chenpt.designModel.singleFactory;

import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/**
 * @Author: chenpengtao
 * @Description: 单例模式
 * @Date: created in 2018/7/19
 * @Modified By:
 */
public class Singleton {
    private static volatile Singleton singleton;

    private Singleton(){}

    public static Singleton getInstance(){
        Lock lock = new ReentrantLock();
        if(singleton==null){
            synchronized(Singleton.class){
                singleton = new Singleton();
            }
        }
        return singleton;
    }

}
