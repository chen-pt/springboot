package com.chenpt.annotation;

import java.lang.annotation.*;

/**
 * 文件名:com.jk51.annotation.
 * 描述: 记录日志
 * 创建日期: 2017-01-16
 * 修改记录:
 */
@Target({ElementType.PARAMETER, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface LogRequired {

    String description() default "";
}
