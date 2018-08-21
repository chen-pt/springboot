package com.chenpt.enumdemo;


import java.sql.Time;

/**
 * 版权所有(C) 2017 上海银路投资管理有限公司
 * 描述:
 * 作者: chen_pt
 * 创建日期: 2018/4/16
 * 修改记录:
 */
public class MainDemo extends Thread {
    private static int ticket = 200;
    private static String snz = "aa";

    MainDemo(String name){
        super(name);
    }

    @Override
    public void run() {

        while (ticket>0){
            synchronized (snz){
                if(ticket>0){
                    System.out.println(getName()+"==="+ticket);
                    ticket--;
                }
            }
            try {
                sleep(1000);//休息一秒
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

    }








}
