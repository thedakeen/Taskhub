package kz.madiyar.taskhubadminservice.exceptions;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class MessageResponse {
    private int statusCode;
    private Date timestamp;
    private String message;
    private String description;
}
