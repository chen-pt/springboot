package com.chenpt.designModel.prototypeModel;

import groovy.transform.Synchronized;

import java.io.*;
import java.util.*;
import java.util.stream.Stream;

/**
 * @Author: chenpengtao
 * @Description:
 * @Date: created in 2018/8/1
 * @Modified By:
 */
public class MainTest2 {
    public static void main(String[] args){

        try {
//            序列化Resume
            Resume resume = new Resume();
//            resume.setName("哈哈");
//            resume.setSex("男");
//            resume.setAge("20");
//            resume.dispaly();
//            ObjectOutputStream outputStream = new ObjectOutputStream(new FileOutputStream("D:\\resume.txt"));
//            outputStream.writeObject(resume);
//            outputStream.close();

            //改变sex（根据结果可见sex未被序列化，而是直接从内存中读取）
            resume.setSex("女");

            //反序列化
            ObjectInputStream inputStream = new ObjectInputStream(new FileInputStream("D:\\resume.txt"));
            Resume resume1 = (Resume) inputStream.readObject();
            resume1.dispaly();

            HashMap map = new HashMap();
        }catch (Exception e){
            e.printStackTrace();
        }


    }
}
