package kz.madiyar.taskhubadminservice.controller;


import kz.madiyar.taskhubadminservice.model.entity.User;
import kz.madiyar.taskhubadminservice.model.requests.RoleUpdateRequest;
import kz.madiyar.taskhubadminservice.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<User> updateUserRole(@PathVariable Long userId,
                                           @RequestBody RoleUpdateRequest request
    ) {
        return adminService.updateUserRole(userId, request.getRole())
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }




}
