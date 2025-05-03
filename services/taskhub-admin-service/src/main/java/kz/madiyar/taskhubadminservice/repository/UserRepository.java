package kz.madiyar.taskhubadminservice.repository;

import kz.madiyar.taskhubadminservice.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UserRepository extends JpaRepository<User, Long> {
}
