package com.chenpt.arithmetic;

/**
 * @Author: chen
 * @Description:  二分法查找(前提必须是拍好序的数组)
 * @Date: created in 2018/10/23
 * @Modified By:
 */
public class DichotomySearch {


    public static void main(String[] args){
        int arr[] = {1,3,5,7,9,11,12};
        int rs = midSearch(arr,arr[0],arr[arr.length-1],9);
        System.out.println(rs);
    }

    /**
     * 二分法查找
     * @param arr   排好序的数组
     * @param min   最小值
     * @param max   最大值
     * @param findNum 待查找的值
     * @return
     */
    public static int midSearch(int[] arr,int min,int max,int findNum){
        if(arr.length<=0){
            return 0;
        }
        int mid = (min+max)/2;//取中间值

        if(mid==findNum){
            return mid;
        }

        //如果中间值大于查找值，则查找值在数组左边
        if(mid>findNum){
            return midSearch(arr,min,mid-1,findNum);
        }

        //如果中间值小于查找值，则查找值在数组右边
        if(mid<findNum){
            return midSearch(arr,min+1,max,findNum);
        }

        return 0;
    }

}
