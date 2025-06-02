package kz.madiyar.taskhubratingservice.controller;

import lombok.extern.slf4j.Slf4j;

import jakarta.persistence.EntityNotFoundException;
import kz.madiyar.taskhubratingservice.model.entity.IssueSolution;
import kz.madiyar.taskhubratingservice.model.requests.RatingRequest;
import kz.madiyar.taskhubratingservice.repository.UserRepository;
import kz.madiyar.taskhubratingservice.service.IssueSolutionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;


@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/rating")
public class RatingController {
    private final IssueSolutionService solutionService;
    private final UserRepository userRepo;

    @PostMapping("/{solutionId}")
    public ResponseEntity<?> rate(
            @AuthenticationPrincipal UserDetails user,
            @PathVariable Long solutionId,
            @RequestBody RatingRequest req
    ) {
        System.out.println(user);
        Long companyUserId = userRepo.findByUsername(user.getUsername()).orElseThrow(EntityNotFoundException::new).getId();
        try {
            IssueSolution updated = solutionService.rateSolution(companyUserId, solutionId, req.getRating());
            return ResponseEntity.ok(updated);
        } catch (EntityNotFoundException ex) {
            return ResponseEntity.notFound().build();
        } catch (AccessDeniedException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }




}
