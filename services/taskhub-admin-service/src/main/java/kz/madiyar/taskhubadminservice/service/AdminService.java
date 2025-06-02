package kz.madiyar.taskhubadminservice.service;


import lombok.extern.slf4j.Slf4j;

import kz.madiyar.taskhubadminservice.exceptions.BadRequestException;
import kz.madiyar.taskhubadminservice.exceptions.NotFoundException;
import kz.madiyar.taskhubadminservice.model.entity.Company;
import kz.madiyar.taskhubadminservice.model.entity.CompanyUser;
import kz.madiyar.taskhubadminservice.model.entity.User;
import kz.madiyar.taskhubadminservice.model.requests.CompanyUpdateRequest;
import kz.madiyar.taskhubadminservice.repository.CompanyRepository;
import kz.madiyar.taskhubadminservice.repository.CompanyUserRepository;
import kz.madiyar.taskhubadminservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;


@Slf4j
@Service
@RequiredArgsConstructor
public class AdminService {
    private final UserRepository userRepository;
    private final CompanyUserRepository companyUserRepository;
    private final CompanyRepository companyRepository;


    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    @SneakyThrows
    public CompanyUser updateUserRole(Long companyId, Long userId, User.Role role) {
        Company dbCompany = companyRepository.findByCompanyId(companyId).orElseThrow(
                () -> new NotFoundException("Company not found")
        );

        User dbUser = userRepository.findById(userId)
                .map(user -> {
                    user.setRole(role);
                    return userRepository.save(user);
                })
                .orElseThrow(
                        () -> new NotFoundException("User not found")
                );

        companyUserRepository.findByCompanyAndUser(dbCompany, dbUser)
                .ifPresent(companyUser -> {
                        throw new BadRequestException("Already exist such company with username " + dbUser.getId() + dbCompany.getCompanyId());
                });

        return companyUserRepository.save(CompanyUser.builder()
                        .company(dbCompany)
                        .user(dbUser)
                .build());
    }

    @SneakyThrows
    public Company updateCompany(Long companyId, CompanyUpdateRequest companyUpdateRequest) {
        return companyRepository.findByCompanyId(companyId)
                .map(
                        company -> {
                            company.setCompanyName(companyUpdateRequest.getCompanyName());
                            company.setDescription(companyUpdateRequest.getDescription());
                            company.setLogo(companyUpdateRequest.getLogo());
                            company.setWebsite(companyUpdateRequest.getWebsite());
                            return companyRepository.save(company);
                        }
                )
                .orElseThrow(
                        () -> new NotFoundException("Company not found")
                );
    }



}
