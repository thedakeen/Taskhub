package kz.madiyar.taskhubratingservice.service;

import jakarta.persistence.EntityNotFoundException;
import kz.madiyar.taskhubratingservice.repository.IssueSolutionRepository;
import lombok.RequiredArgsConstructor;


import kz.madiyar.taskhubratingservice.model.entity.CompanyUser;
import kz.madiyar.taskhubratingservice.model.entity.IssueSolution;
import kz.madiyar.taskhubratingservice.repository.CompanyUserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class IssueSolutionService {

    private final IssueSolutionRepository solutionRepo;
    private final CompanyUserRepository companyUserRepo;

    /**
     * Rate a solution by its ID, checking that it belongs to the current company user.
     *
     * @param companyUserId ID of the authenticated company user
     * @param solutionId    the solution to rate
     * @param rating        1–5
     * @return the updated solution
     * @throws EntityNotFoundException   if no such solution
     * @throws AccessDeniedException     if solution’s company ≠ user’s company
     * @throws IllegalArgumentException  if rating not in 1..5
     */
    public IssueSolution rateSolution(Long companyUserId, Long solutionId, int rating) {
        // 1) load company user
        CompanyUser cu = companyUserRepo.findByUser_Id(companyUserId)
                .orElseThrow(() -> new AccessDeniedException("Not a valid company user"));

        // 2) load solution
        IssueSolution sol = solutionRepo.findById(solutionId)
                .orElseThrow(() -> new EntityNotFoundException("Solution not found: " + solutionId));

        // 3) ensure it belongs to this company
        Long solCompanyId = sol.getAssignment()
                .getIssue()
                .getCompany()
                .getCompanyId();
        if (!solCompanyId.equals(cu.getCompany().getCompanyId())) {
            throw new AccessDeniedException("Cannot rate solutions outside your company");
        }

        // 4) validate rating
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        // 5) apply & save
        sol.setRating(rating);
        return solutionRepo.save(sol);
    }


}
