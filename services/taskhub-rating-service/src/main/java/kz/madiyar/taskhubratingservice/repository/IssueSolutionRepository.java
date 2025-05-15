package kz.madiyar.taskhubratingservice.repository;

import kz.madiyar.taskhubratingservice.model.entity.IssueSolution;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;



@Repository
public interface IssueSolutionRepository extends JpaRepository<IssueSolution, Long> {
    Optional<IssueSolution> findByAssignment_AssignmentId(Long assignmentId);

    List<IssueSolution> findTop5ByAssignment_Issue_IdOrderByRatingDesc(Long issueId);
    List<IssueSolution> findTop10ByAssignment_Issue_IdOrderByRatingDesc(Long issueId);
    List<IssueSolution> findTop20ByAssignment_Issue_IdOrderByRatingDesc(Long issueId);
    List<IssueSolution> findTop50ByAssignment_Issue_IdOrderByRatingDesc(Long issueId);


    List<IssueSolution> findTop5ByAssignment_AssignmentIdOrderByRatingDesc(Long assignmentId);
    List<IssueSolution> findTop10ByAssignment_AssignmentIdOrderByRatingDesc(Long assignmentId);
    List<IssueSolution> findTop20ByAssignment_AssignmentIdOrderByRatingDesc(Long assignmentId);
    List<IssueSolution> findTop50ByAssignment_AssignmentIdOrderByRatingDesc(Long assignmentId);

    // Top solutions for a given developer (via assignment → developer)
    @Query("SELECT s FROM IssueSolution s " +
            "WHERE s.assignment.developer.developerId = :devId " +
            "ORDER BY s.rating DESC")
    List<IssueSolution> findTopByDeveloper(@Param("devId") Long developerId, Pageable page);



    @Query("""
      SELECT a.developer.developerId    AS developerId,
             AVG(s.rating)              AS averageRating
      FROM IssueSolution s
      JOIN s.assignment a
      GROUP BY a.developer.developerId
      ORDER BY AVG(s.rating) DESC
      """)
    List<DeveloperRating> findTopDevelopersByAverageRating(Pageable pageable);

}
