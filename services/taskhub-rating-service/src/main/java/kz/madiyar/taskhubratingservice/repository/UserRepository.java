package kz.madiyar.taskhubratingservice.repository;

import kz.madiyar.taskhubratingservice.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);
}
