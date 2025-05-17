package kz.madiyar.taskhubadminservice.configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;

@OpenAPIDefinition(
        info = @Info(
                contact = @Contact(
                        name = "Madiyar",
                        email = "klintzhan005@gmail.com"
                ),
                description = "Open API documentation for TaskHub Admin Service project",
                title = "Open API specification - Madiyar",
                version = "1.0"

        ),
        servers = {
                @Server(
                        description = "Local ENV",
                        url = "http://localhost:8090"
                ),
                @Server(
                        description = "Dev ENV",
                        url = "https://example.com"
                )
        },
        security = @SecurityRequirement(
                name = "bearerAuth"
        )

)
@SecurityScheme(
        name = "bearerAuth",
        description = "JWT auth description",
        scheme = "bearer",
        type = SecuritySchemeType.HTTP,
        bearerFormat = "JWT",
        in = SecuritySchemeIn.HEADER
)
public class OpenApiConfig {
}
//        http://localhost:8090/swagger-ui/index.html#/
//        http://localhost:8090/swagger-ui/index.html#/
//        http://localhost:8090/swagger-ui/index.html#/

