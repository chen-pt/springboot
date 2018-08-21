package com.chenpt.exception;

/**
 * 描述: 业务逻辑异常，通常用于业务处理过程中，不能满足业务处理规则引发的异常
 * 创建日期: 2017-01-16
 * 修改记录:
 */
public class BusinessLogicException extends Exception {

    static final long serialVersionUID = -1256516991663579399L;

    public BusinessLogicException() {
        super();
    }

    public BusinessLogicException(String message) {
        super(message);
    }

    public BusinessLogicException(String message, Throwable cause) {
        super(message, cause);
    }

    public BusinessLogicException(Throwable cause) {
        super(cause);
    }

    protected BusinessLogicException(String message, Throwable cause,
                        boolean enableSuppression,
                        boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }

}
