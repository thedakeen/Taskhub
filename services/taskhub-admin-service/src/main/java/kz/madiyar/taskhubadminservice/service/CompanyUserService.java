package kz.madiyar.taskhubadminservice.service;


import kz.madiyar.taskhubadminservice.repository.CompanyUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CompanyUserService {
    private final CompanyUserRepository companyUserRepository;


}
