package com.chenpt.mapper;


import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * 版权所有(C) 2017
 * 描述:
 * 作者: chen_pt
 * 创建日期: 2017/12/13
 * 修改记录:
 */
@Mapper
public interface PostInfoMapper {


    List<com.chenpt.model.PostInfo> getLst();

}
