package kz.madiyar.taskhubratingservice.repository;

import kz.madiyar.taskhubratingservice.model.entity.CompanyUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyUserRepository extends JpaRepository<CompanyUser, Long> {
}
