package com.chenpt.test;

import java.time.LocalDate;

/**
 * @Author: chenpengtao
 * @Description:  java8 时间处理工具类
 * @Date: created in 2018/7/16
 * @Modified By:
 */
public class TimeDemo {


    public static void main(String[] args){
        LocalDate localDate = LocalDate.now();

        System.out.println(localDate.getDayOfYear());
    }


}
