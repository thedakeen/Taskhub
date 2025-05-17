package kz.madiyar.taskhubadminservice.exceptions;


import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.WebRequest;

import java.nio.file.AccessDeniedException;
import java.util.Date;

import static org.springframework.http.HttpStatus.CONFLICT;
@ControllerAdvice
//@RestControllerAdvice
@Order(Ordered.HIGHEST_PRECEDENCE)
public class ExceptionHandlerController {

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<MessageResponse> conflictException(ConflictException ex, WebRequest request) {
        MessageResponse message = new MessageResponse(
                CONFLICT.value(),
                new Date(),
                ex.getMessage(),
                request.getDescription(false));

        return new ResponseEntity<MessageResponse>(message, CONFLICT);
    }
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<MessageResponse> conflictException(AuthenticationException ex, WebRequest request) {
        MessageResponse message = new MessageResponse(
                HttpStatus.UNAUTHORIZED.value(),
                new Date(),
                ex.getMessage(),
                request.getDescription(false));

        return new ResponseEntity<MessageResponse>(message, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<MessageResponse> globalExceptionHandler(Exception ex, WebRequest request) {
        MessageResponse message = new MessageResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                new Date(),
                ex.getMessage(),
                request.getDescription(false));

        return new ResponseEntity<MessageResponse>(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<MessageResponse> forbiddenException(ForbiddenException ex, WebRequest request) {
        MessageResponse message = new MessageResponse(
                HttpStatus.FORBIDDEN.value(),
                new Date(),
                ex.getMessage() + " Forbidden",
                request.getDescription(true));

        return new ResponseEntity<MessageResponse>(message, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(AccessDeniedException.class)
    @ResponseBody
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ResponseEntity<MessageResponse> accessDeniedException(ForbiddenException ex, WebRequest request) {
        MessageResponse message = new MessageResponse(
                HttpStatus.FORBIDDEN.value(),
                new Date(),
                ex.getMessage() + " Forbidden",
                request.getDescription(true));

        return new ResponseEntity<MessageResponse>(message, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<MessageResponse> badRequestException(BadRequestException ex, WebRequest request) {
        MessageResponse message = new MessageResponse(
                HttpStatus.BAD_REQUEST.value(),
                new Date(),
                ex.getMessage(),
                request.getDescription(false));

        return new ResponseEntity<MessageResponse>(message, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InternalServerException.class)
    public ResponseEntity<MessageResponse> internalServerException(InternalServerException ex, WebRequest request) {
        MessageResponse message = new MessageResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                new Date(),
                ex.getMessage(),
                request.getDescription(false));

        return new ResponseEntity<MessageResponse>(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<MessageResponse> expiredJwtException(ExpiredJwtException ex, WebRequest request) {
        MessageResponse message = new MessageResponse(
                HttpStatus.FORBIDDEN.value(),
                new Date(),
                ex.getMessage(),
                request.getDescription(false)
        );
        return new ResponseEntity<MessageResponse>(message, HttpStatus.FORBIDDEN);
    }
}