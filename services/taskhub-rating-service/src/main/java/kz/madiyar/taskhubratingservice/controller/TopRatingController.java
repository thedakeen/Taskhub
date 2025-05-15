package kz.madiyar.taskhubratingservice.controller;


import kz.madiyar.taskhubratingservice.model.entity.IssueSolution;
import kz.madiyar.taskhubratingservice.repository.DeveloperRating;
import kz.madiyar.taskhubratingservice.service.TopRatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/top-rating")
@RequiredArgsConstructor
public class TopRatingController {
    private final TopRatingService topRatingService;

//    /**
//     * GET /api/top-rating/overall?limit=5
//     * Supported limits: 5,10,20,50
//     */
//    @GetMapping("/overall")
//    public ResponseEntity<List<IssueSolution>> topOverall(
//            @RequestParam(name = "limit", defaultValue = "5") int limit) {
//        var list = topRatingService.topOverall(limit);
//        return ResponseEntity.ok(list);
//    }

//    /**
//     * GET /api/top-rating/developer/{devId}?limit=5
//     */
//    @GetMapping("/developer/{devId}")
//    public ResponseEntity<List<IssueSolution>> topByDeveloper(
//            @PathVariable("devId") Long developerId,
//            @RequestParam(name = "limit", defaultValue = "5") int limit) {
//        var list = topRatingService.topByDeveloper(developerId, limit);
//        return ResponseEntity.ok(list);
//    }

//    @GetMapping("/assignment/{assignmentId}")
//    public ResponseEntity<List<IssueSolution>> topByAssignment(
//            @PathVariable Long assignmentId,
//            @RequestParam(name = "limit", defaultValue = "5") int limit) {
//        return ResponseEntity.ok(topRatingService.topByAssignment(assignmentId, limit));
//    }


    @GetMapping("/issue/{issueId}")
    public ResponseEntity<List<IssueSolution>> topByIssue(
            @PathVariable Long issueId,
            @RequestParam(name = "limit", defaultValue = "5") int limit) {
        return ResponseEntity.ok(topRatingService.topByIssue(issueId, limit));
    }

    @GetMapping("/developers")
    public ResponseEntity<List<DeveloperRating>> topDevelopers(
            @RequestParam(name = "limit", defaultValue = "5") int limit) {
        return ResponseEntity.ok(topRatingService.topDevelopers(limit));
    }



}
