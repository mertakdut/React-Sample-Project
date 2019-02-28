package com.demo.bankapp.service.abstractions;

import java.util.List;

import com.demo.bankapp.model.User;
import com.demo.bankapp.request.LoginRequest;

public interface IUserService {

	List<User> findAll();

	User findByUserName(String username);

	User findByTcno(String tcno);

	User createNewUser(User user);

	User login(String username, String password);

}
