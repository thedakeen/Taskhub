package kz.madiyar.taskhubratingservice.security.jwt;

import kz.madiyar.taskhubratingservice.model.entity.User;
import kz.madiyar.taskhubratingservice.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Service
public class CustomUserDetailsService {

    private final UserRepository userRepo;

    public CustomUserDetailsService(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    public UserDetails loadById(Long id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User "+id+" not found"));

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password("")
                .authorities("ROLE_" + user.getRole().name().toUpperCase())
                .build();
    }
}

