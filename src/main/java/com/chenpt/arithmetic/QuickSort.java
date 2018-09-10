package com.chenpt.arithmetic;

import java.util.*;

/**
 * @Author: chen
 * @Description: 快速排序
 * @Date: created in 2018/9/7
 * @Modified By:
 */
public class QuickSort {

    public static void main(String[] ar){

        HashMap hashMap = new HashMap();
        TreeMap<String,String> treeMap = new TreeMap();
        LinkedHashMap linkedHashMap = new LinkedHashMap();

        treeMap.put("d",null);
        treeMap.put("c","c");
        treeMap.put("b","b");
        treeMap.put("a","a");

        linkedHashMap.put("d","d");
        linkedHashMap.put("c","c");
        linkedHashMap.put("b","b");
        linkedHashMap.put("a","a");

        treeMap.forEach((k,v)->{
            System.out.println(k+"--"+v);
        });

        linkedHashMap.forEach((k,v)->{
            System.out.println(k+"--"+v);
        });

    }

}
