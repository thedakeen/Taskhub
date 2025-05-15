package kz.madiyar.taskhubadminservice.model.requests;

import kz.madiyar.taskhubadminservice.model.entity.User;
import lombok.Data;

@Data
public class RoleUpdateRequest {
    private User.Role role;
}
