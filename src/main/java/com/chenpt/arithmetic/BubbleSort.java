package com.chenpt.arithmetic;

import java.util.Arrays;

/**
 * @Author: chen
 * @Description: 冒泡排序
 * @Date: created in 2018/9/5
 * @Modified By:
 */
public class BubbleSort {



    public static void operation(){
        int[] arr = {9,3,5,8,2};
        System.out.println("排序前：");
        Arrays.stream(arr).forEach(x->{
            System.out.print(x+" ");
        });

        for (int i=0;i<arr.length-1;i++) {       //外层循环控制次数
            for (int j=0;j<arr.length-1-i;j++) { //内层循环控制每一次需要比较的次数
                if(arr[j]>arr[j+1]){
                    int temp=arr[j];
                    arr[j]=arr[j+1];
                    arr[j+1]=temp;
                }
            }
        }

        System.out.println("\n排序后：");
        for (int num : arr){
            System.out.print(num+" ");
        }

    }

    public static void main(String[] ar){
        operation();
    }

}
