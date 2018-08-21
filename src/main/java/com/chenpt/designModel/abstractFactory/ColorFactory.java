package com.chenpt.designModel.abstractFactory;

/**
 * @Author: chenpengtao
 * @Description:
 * @Date: created in 2018/7/19
 * @Modified By:
 */
public class ColorFactory extends AbstractFactory {
    @Override
    public Animal getAnimal(String animal) {
        return null;
    }

    @Override
    public Color getColor(String color) {
        switch (color){
            case "red":
                return new Red();
            case "green":
                return new Green();
        }
        return null;
    }
}
