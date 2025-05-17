package kz.madiyar.taskhubadminservice.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;
import java.util.Arrays;

/**
 * JPA entity for the 'users' table with Lombok annotations.
 */
@Entity
@Table(
        name = "users",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "username"),
                @UniqueConstraint(columnNames = "email")
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    /**
     * PostgreSQL citext is case-insensitive text; stored as String in Java.
     */
    @Column(nullable = false, unique = true, columnDefinition = "citext")
    private String email;

    public enum Role {
        developer,
        company,
        admin;

        public static boolean isValid(String value) {
            return Arrays.stream(values())
                    .anyMatch(r -> r.name().equals(value));
        }
    }

    @Column(length = 20, nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Role role = Role.developer;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false,
            columnDefinition = "timestamp(0) with time zone default now()")
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false,
            columnDefinition = "timestamp(0) with time zone default now()")
    private OffsetDateTime updatedAt;

    @Column(name = "password_hash", nullable = false)
    @JsonIgnore
    private byte[] passwordHash;

    @Column(nullable = false)
    @Builder.Default
    private Boolean activated = false;

    /**
     * Validate role before persisting/updating.
     */
    @PrePersist
    @PreUpdate
    private void validateRole() {
        if (!Role.isValid(this.role.name())) {
            throw new IllegalArgumentException("Invalid role: " + this.role);
        }
    }
}
