package com.chenpt.service;

import com.chenpt.mapper.PostInfoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostInfoService {

	@Autowired
	private PostInfoMapper postInfoMapper;
	
	public List<com.chenpt.model.PostInfo> getLst() {

		return postInfoMapper.getLst();
	}

}
