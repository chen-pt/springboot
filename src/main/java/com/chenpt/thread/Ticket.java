package com.chenpt.thread;

import java.util.HashMap;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Created by chenpt on 2018/11/17.
 */
public class Ticket implements Runnable{

    private int total;
    private Object lock = new Object();

    Ticket(int total){
        this.total=total;
    }

    public static void main(String[] args){
        Ticket ticket = new Ticket(10000);
        Thread thread1 = new Thread(ticket,"售票厅A");
        Thread thread2 = new Thread(ticket,"售票厅B");
        Thread thread3 = new Thread(ticket,"售票厅C");
        Thread thread4 = new Thread(ticket,"售票厅D");
        Thread thread5 = new Thread(ticket,"售票厅E");
        thread1.start();
        thread2.start();
        thread3.start();
        thread4.start();
        thread5.start();
    }


    @Override
    public void run() {

        while (true){
            sellTicket();
            if(total<=0){
                System.out.println(Thread.currentThread().getName()+"票已卖完");
                return;
            }
        }



    }

    public void sellTicket(){
        synchronized (lock){
            if(total>0){
                System.out.println(Thread.currentThread().getName()+"剩余"+total);
                total--;
            }
        }
    }
}
