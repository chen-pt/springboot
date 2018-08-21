package com.chenpt.test;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 版权所有(C) 2017 上海银路投资管理有限公司
 * 描述:
 * 作者: chen_pt
 * 创建日期: 2018/5/31
 * 修改记录:
 */
public class FinalDemo {

    private static final int x = 0;


    public static void main(String[] args){

        List list = new ArrayList();
        List list1 = list;
        list.add(1);
        list.add(2);
        list.add(3);
        list.clear();
        list.add(4);
        list.add(5);

        list = null;

        list.add(1);
        for (Object a : list1) {
            System.out.println(a);
        }
    }


}
