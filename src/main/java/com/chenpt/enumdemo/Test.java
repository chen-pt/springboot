package com.chenpt.enumdemo;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * 版权所有(C) 2017 上海银路投资管理有限公司
 * 描述:
 * 作者: chen_pt
 * 创建日期: 2018/5/10
 * 修改记录:
 */
public class Test {
    public static void main(String[] args) {

        List list1 =new ArrayList();
        list1.add("1111");
        list1.add("2222");
        list1.add("3333");

        List list2 =new ArrayList();
        list2.add("3333");
        list2.add("4444");
        list2.add("5555");

        //并集
//        list1.addAll(list2);
        //交集
//        list1.retainAll(list2);
        //差集
        list1.removeAll(list2);
        //无重复并集
//        list2.removeAll(list1);
//        list1.addAll(list2);

        Iterator<String> it=list1.iterator();
        while (it.hasNext()) {
            System.out.println(it.next());

        }

    }


    public List<String> getList(){
        String[] a = { "i", "p" };
        String[] b = { "b", "0", "u" };
        String[] c = { "j", "e", "s", "d" };
        // 存放数组
        String x = "";
        String y = "";
        String z = "";
        List<String> list = new ArrayList<>();
        for (int j = 0; j < a.length; j++) {
            for (int k = 0; k < b.length; k++) {
                for (int h = 0; h < c.length; h++) {
                    x = a[j];
                    y = b[k];
                    z = c[h];
                    list.add(x+y+z);
                }
            }
        }

        return null;
    }


}
