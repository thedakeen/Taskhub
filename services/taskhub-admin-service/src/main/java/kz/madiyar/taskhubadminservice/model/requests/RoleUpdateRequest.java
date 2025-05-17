package kz.madiyar.taskhubadminservice.model.requests;

import kz.madiyar.taskhubadminservice.model.entity.User;
import lombok.Data;

@Data
public class RoleUpdateRequest {
    private Long companyId;
    private User.Role role;
}
