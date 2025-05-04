package kz.madiyar.taskhubratingservice.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;

@Entity
@Table(name = "otps")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Otp {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "email", referencedColumnName = "email", nullable = false)
    private User user;

    @Column(name = "otp_code", nullable = false)
    private String otpCode;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false,
            columnDefinition = "timestamp(0) with time zone default now()")
    private OffsetDateTime createdAt;

    @Column(name = "expires_at", nullable = false,
            columnDefinition = "timestamp(0) with time zone default (now() + '00:30:00'::interval)")
    private OffsetDateTime expiresAt;
}

