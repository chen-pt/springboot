package com.chenpt.designModel.compositeModel;

/**
 * @Author: chen
 * @Description:
 * @Date: created in 2018/8/27
 * @Modified By:
 */
public class MainTest {


    public static void main(String[] args){
        //针对抽象构件编程
        AbstractFile file1,file2,file3,folder1,folder2,folder3;

        folder1 = new Folder("chenpt的资料");
        folder2 = new Folder("图像文件");
        folder3 = new Folder("文本文件");

        file1 = new ImageFile("小龙女.jpg");
        file2 = new ImageFile("张无忌.gif");
        file3 = new TextFile("九阴真经.txt");

        folder2.add(file1);
        folder2.add(file2);
        folder3.add(file3);
        folder1.add(folder2);
        folder1.add(folder3);

        folder1.operation();

    }



}
