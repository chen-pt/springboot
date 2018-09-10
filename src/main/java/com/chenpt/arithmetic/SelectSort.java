package com.chenpt.arithmetic;

import java.util.Arrays;

/**
 * @Author: chen
 * @Description:  选择排序
 * @Date: created in 2018/9/7
 * @Modified By:
 */
public class SelectSort {

    public static void operation(){
        int[] arr = {9,3,5,8,2};
        System.out.println("排序前：");
        Arrays.stream(arr).forEach(x->{
            System.out.print(x+" ");
        });

        for (int i=0;i<arr.length-1;i++){
            for (int j=i+1;j<arr.length;j++){
                if(arr[i]>arr[j]){
                    int x = arr[i];
                    arr[i] = arr[j];
                    arr[j] = x;
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
