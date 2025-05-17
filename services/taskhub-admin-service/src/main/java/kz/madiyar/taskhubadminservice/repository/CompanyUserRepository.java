package kz.madiyar.taskhubadminservice.repository;

import kz.madiyar.taskhubadminservice.model.entity.Company;
import kz.madiyar.taskhubadminservice.model.entity.CompanyUser;
import kz.madiyar.taskhubadminservice.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyUserRepository extends JpaRepository<CompanyUser, Long> {
    Optional<CompanyUser> findByCompanyAndUser(Company company, User user);
}
