package com.chenpt.designModel.compositeModel;

/**
 * @Author: chen
 * @Description:
 * @Date: created in 2018/8/27
 * @Modified By:
 */
public class TextFile implements AbstractFile {

    String name;

    TextFile(String name){
        this.name=name;
    }

    @Override
    public void add(AbstractFile component) {
        System.out.println("对不起，不支持该方法！");
    }

    @Override
    public void remove(AbstractFile component) {
        System.out.println("对不起，不支持该方法！");
    }

    @Override
    public AbstractFile getChild(int i) {
        System.out.println("对不起，不支持该方法！");
        return null;
    }

    @Override
    public void operation() {
        //模拟杀毒
        System.out.println("----对文本文件'" + name + "'进行杀毒");
    }
}
