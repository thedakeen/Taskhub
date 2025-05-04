package kz.madiyar.taskhubratingservice.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;

@Entity
@Table(name = "issue_assignments",
        uniqueConstraints = @UniqueConstraint(columnNames = {"issue_id","developer_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IssueAssignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "assignment_id")
    private Long assignmentId;

    @ManyToOne
    @JoinColumn(name = "issue_id", nullable = false)
    private Issue issue;

    @ManyToOne
    @JoinColumn(name = "developer_id", nullable = false)
    private Developer developer;

    public enum Status { in_progress, completed }

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Status status = Status.in_progress;

    @CreationTimestamp
    @Column(name = "assigned_at", nullable = false,
            columnDefinition = "timestamp(0) with time zone default now()")
    private OffsetDateTime assignedAt;

    private OffsetDateTime completedAt;

    @OneToOne(mappedBy = "assignment", cascade = CascadeType.ALL, orphanRemoval = true)
    private IssueSolution solution;
}
