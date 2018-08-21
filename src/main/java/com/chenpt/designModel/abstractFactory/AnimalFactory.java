package com.chenpt.designModel.abstractFactory;

/**
 * @Author: chenpengtao
 * @Description:
 * @Date: created in 2018/7/19
 * @Modified By:
 */
public class AnimalFactory extends AbstractFactory {
    @Override
    public Animal getAnimal(String animal) {
        switch (animal){
            case "cat":
                return new Cat();
            case "dog":
                return new Dog();
        }
        return null;
    }

    @Override
    public Color getColor(String color) {
        return null;
    }
}
