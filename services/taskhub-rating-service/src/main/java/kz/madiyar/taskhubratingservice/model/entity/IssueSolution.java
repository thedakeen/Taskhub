package kz.madiyar.taskhubratingservice.model.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "issue_solutions",
        uniqueConstraints = @UniqueConstraint(columnNames = "assignment_id"))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IssueSolution {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "solution_id")
    private Long solutionId;

    @OneToOne
    @JoinColumn(name = "assignment_id", nullable = false)
    @JsonIgnore
    private IssueAssignment assignment;

    @Column(name = "solution_text", nullable = false)
    private String solutionText;

    public enum Status { pending, checked }

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Status status = Status.pending;

    @Column(name = "rating", columnDefinition = "integer default 0")
    @Builder.Default
    private Integer rating = 0;
}

