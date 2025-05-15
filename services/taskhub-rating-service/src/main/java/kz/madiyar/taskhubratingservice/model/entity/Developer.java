package kz.madiyar.taskhubratingservice.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "developers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Developer {
    @Id
    @Column(name = "developer_id")
    private Long developerId;

    @MapsId
    @OneToOne
    @JoinColumn(name = "developer_id")
    private User user;

    @Column(name = "github_id", unique = true)
    private Long githubId;

    private String bio;
    private String githubUsername;
    private String avatarUrl;
    private String cvUrl;

    @OneToMany(mappedBy = "developer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<IssueAssignment> assignments;
}

