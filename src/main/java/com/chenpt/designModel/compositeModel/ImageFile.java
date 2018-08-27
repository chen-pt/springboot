package com.chenpt.designModel.compositeModel;

/**
 * @Author: chen
 * @Description:
 * @Date: created in 2018/8/27
 * @Modified By:
 */
public class ImageFile implements AbstractFile {

    String name;

    ImageFile(String name){
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
        System.out.println("----对图像文件'" + name + "'进行杀毒");
    }
}
