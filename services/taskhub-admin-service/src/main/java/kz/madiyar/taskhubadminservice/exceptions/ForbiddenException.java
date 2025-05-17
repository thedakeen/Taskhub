package kz.madiyar.taskhubadminservice.exceptions;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.FORBIDDEN)
public class ForbiddenException extends Exception{
    public ForbiddenException(String message) {
        super(message);
    }
}
