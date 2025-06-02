package kz.madiyar.taskhubadminservice.controller;


import kz.madiyar.taskhubadminservice.model.entity.Company;
import kz.madiyar.taskhubadminservice.model.entity.CompanyUser;
import kz.madiyar.taskhubadminservice.model.entity.User;
import kz.madiyar.taskhubadminservice.model.requests.CompanyUpdateRequest;
import kz.madiyar.taskhubadminservice.model.requests.RoleUpdateRequest;
import kz.madiyar.taskhubadminservice.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;

    @GetMapping
    public ResponseEntity<List<User>> getAll() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/update-user-role/{userId}")
    public ResponseEntity<CompanyUser> updateUserRole(@PathVariable Long userId,
                                                      @RequestBody RoleUpdateRequest request
    ) {
        return ResponseEntity.ok(
                adminService.updateUserRole(request.getCompanyId(), userId, request.getRole()));
    }

    @PutMapping("update-company/{companyId}")
    public ResponseEntity<Company> updateCompany(@PathVariable Long companyId,
                                                 @RequestBody CompanyUpdateRequest request){
        return ResponseEntity.ok(adminService.updateCompany(companyId, request));
    }





}
