package kz.madiyar.taskhubadminservice.service;

import kz.madiyar.taskhubadminservice.model.entity.User;
import kz.madiyar.taskhubadminservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class AdminService {
    private final UserRepository userRepository;


    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> updateUserRole(Long userId, User.Role role) {
        return userRepository.findById(userId)
                .map(user -> {
                    user.setRole(role);
                    return userRepository.save(user);
                });
    }


}
