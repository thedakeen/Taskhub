package kz.madiyar.taskhubadminservice.service;


import kz.madiyar.taskhubadminservice.repository.CompanyUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class CompanyUserService {
    private final CompanyUserRepository companyUserRepository;


}
