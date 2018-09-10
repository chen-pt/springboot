package com.chenpt.arithmetic;

import java.util.Arrays;

/**
 * @Author: chen
 * @Description: 插入排序
 * @Date: created in 2018/9/7
 * @Modified By:
 */
public class InsertSort {


    public static void operation(){
        int[] arr = {9,3,5,8,2};
        System.out.println("排序前：");
        Arrays.stream(arr).forEach(x->{
            System.out.print(x+" ");
        });

        int j,temp;        //temp：记录
        for(int i = 1; i < arr.length; i++){
            if(arr[i] < arr[i-1]){
                temp = arr[i];
                for(j = i-1; j>=0&&arr[j]>temp; j--){
                    arr[j+1] = arr[j];
                }
                arr[j+1] = temp;
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
