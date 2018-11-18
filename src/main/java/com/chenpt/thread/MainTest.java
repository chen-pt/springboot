package com.chenpt.thread;

import org.thymeleaf.util.StringUtils;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

/**
 * @Author: chen
 * @Description:
 * @Date: created in 2018/10/10
 * @Modified By:
 */
public class MainTest {

    private Runnable runnable;
    private Runnable runnable1;

    public static void main(String[] args){
//        countNum("asA12  9jj**二大爷");
//        grade(1,20);
//        totalCount();
//        System.out.println(random.nextInt(100));
//        Arrays.stream(num).forEach(c->{
//            System.out.println(c);
//        });
        HashMap hashMap = new HashMap();
        ConcurrentHashMap concurrentHashMap = new ConcurrentHashMap();
//        String str = reverse("abc");
//        System.out.println(str);
        Lock lock = new ReentrantLock();
        Condition condition = lock.newCondition();
    }


    public static void countNum(String str){
        if(StringUtils.isEmpty(str)){
            return;
        }
        int num1 = 0;//英文数量
        int num2 = 0;//空格数量
        int num3 = 0;//数字数量
        int num4 = 0;//其他数量
        char[] arrary = str.toCharArray();
        for(char c : arrary){
            if((c >= 65 && c <= 90) || (c >= 97 && c <= 122)){
                num1++;
            }else if(c == 32){
                num2++;
            }else if(c >= 48 && c <= 57){
                num3++;
            }else {
                num4++;
            }
        }
        System.out.println("英文数量= "+num1);
        System.out.println("空格数量= "+num2);
        System.out.println("数字数量= "+num3);
        System.out.println("其他数量= "+num4);
    }


    public static void grade(int c,int x){
        String str = c>=90?"A":c>=60?"B":(x-c)>=5?"D":"C";
        System.out.println("学习成绩："+str);
    }

    public static void totalCount(){
        int a,b,c,total=0; //个、十、百、统计
        for(int i=100; i<1000; i++){
            a = i % 10;
            b = i/10 % 10;
            c = i/100;

            if(i == (Math.pow(a,3)+Math.pow(b,3)+Math.pow(c,3))){
                System.out.println("水仙花："+i);
                total++;
            }
        }
        System.out.print("水仙花总数："+total);
    }


    /**
     * 递归
     * @param str
     * @return
     */
    public static String reverse(String str){
        if(str==null || str.length()<=1) return str;
        return reverse(str.substring(1))+str.charAt(0);
    }

    /**
     * 栈的先进后出原理
     * @param str
     * @return
     */
    public static String reverse2(String str){
        if(str==null || str.length()<=1) return str;

        char[] chars = str.toCharArray();
        Stack stack = new Stack();
        for (char c: chars) {
            stack.push(c);
        }

        for(int i=0;i<chars.length;i++){
            chars[i]= (char) stack.pop();
        }
        return new String(chars);
    }


}
