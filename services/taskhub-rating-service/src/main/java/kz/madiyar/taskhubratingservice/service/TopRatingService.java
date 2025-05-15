package kz.madiyar.taskhubratingservice.service;


import kz.madiyar.taskhubratingservice.model.entity.IssueSolution;
import kz.madiyar.taskhubratingservice.repository.DeveloperRating;
import kz.madiyar.taskhubratingservice.repository.IssueSolutionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service

@RequiredArgsConstructor
public class TopRatingService {

    private final IssueSolutionRepository solutionRepo;

//    public List<IssueSolution> topByDeveloper(Long developerId, int limit) {
//        PageRequest page = PageRequest.of(0, limit);
//        return solutionRepo.findTopByDeveloper(developerId, page);
//    }
//
//
//    public List<IssueSolution> topByAssignment(Long assignmentId, Integer limit) {
//        return switch (limit) {
//            case 5  -> solutionRepo.findTop5ByAssignment_AssignmentIdOrderByRatingDesc(assignmentId);
//            case 10 -> solutionRepo.findTop10ByAssignment_AssignmentIdOrderByRatingDesc(assignmentId);
//            case 20 -> solutionRepo.findTop20ByAssignment_AssignmentIdOrderByRatingDesc(assignmentId);
//            case 50 -> solutionRepo.findTop50ByAssignment_AssignmentIdOrderByRatingDesc(assignmentId);
//            default -> throw new IllegalArgumentException("Unsupported limit: " + limit);
//        };
//    }

    public List<IssueSolution> topByIssue(Long issueId, int limit) {
        return switch (limit) {
            case 5  -> solutionRepo.findTop5ByAssignment_Issue_IdOrderByRatingDesc(issueId);
            case 10 -> solutionRepo.findTop10ByAssignment_Issue_IdOrderByRatingDesc(issueId);
            case 20 -> solutionRepo.findTop20ByAssignment_Issue_IdOrderByRatingDesc(issueId);
            case 50 -> solutionRepo.findTop50ByAssignment_Issue_IdOrderByRatingDesc(issueId);
            default -> throw new IllegalArgumentException("Unsupported limit: " + limit);
        };
    }


    public List<DeveloperRating> topDevelopers(int limit) {
        PageRequest pr = PageRequest.of(0, limit);
        return solutionRepo.findTopDevelopersByAverageRating(pr);
    }


}
