package com.chenpt.designModel.compositeModel;

import java.util.ArrayList;

/**
 * @Author: chen
 * @Description:
 * @Date: created in 2018/8/27
 * @Modified By:
 */
public class Folder implements AbstractFile {

    private ArrayList<AbstractFile> fileList=new ArrayList<AbstractFile>();
    private String name;

    public Folder(String name) {
        this.name = name;
    }

    @Override
    public void add(AbstractFile c) {
        fileList.add(c);
    }

    @Override
    public void remove(AbstractFile c) {
        fileList.remove(c);
    }

    @Override
    public AbstractFile getChild(int i) {
        return fileList.get(i);
    }

    @Override
    public void operation() {
        System.out.println("****对文件夹'" + name + "'进行杀毒");  //模拟杀毒

        //递归调用成员构件的killVirus()方法
        for(AbstractFile obj : fileList) {
            obj.operation();
        }
    }
}
