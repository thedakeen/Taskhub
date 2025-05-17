package kz.madiyar.taskhubadminservice.model.requests;

import jakarta.persistence.Column;
import lombok.Data;


@Data
public class CompanyUpdateRequest {

    private String companyName;

    private String description;

    private String website;
    private String logo;
}
