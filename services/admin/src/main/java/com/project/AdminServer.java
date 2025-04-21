import io.github.cdimascio.dotenv.Dotenv;
import io.grpc.Server;
import io.grpc.ServerBuilder;
import io.grpc.stub.StreamObserver;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class AdminServer {
    private static final Dotenv dotenv = Dotenv.configure()
            .directory("Taskhub/services/.env") // Путь к services/.env относительно services/admin/
            .load();
    private static final String SECRET_KEY = dotenv.get("JWT_SIGNED_STRING");
    private static final String DB_URL = convertPostgresUriToJdbc(dotenv.get("POSTGRES_URI"));
    private static final String DB_USER = extractUserFromUri(dotenv.get("POSTGRES_URI"));
    private static final String DB_PASSWORD = extractPasswordFromUri(dotenv.get("POSTGRES_URI"));
    private static final int GRPC_PORT = Integer.parseInt(dotenv.get("GRPC_ADMIN_SERVICE_PORT", "50053"));

    public static void main(String[] args) throws Exception {
        Server server = ServerBuilder.forPort(GRPC_PORT)
                .addService(new AdminPanelImpl())
                .build();
        server.start();
        System.out.println("Admin Server started at port " + GRPC_PORT);
        server.awaitTermination();
    }

    static class AdminPanelImpl extends AdminPanelGrpc.AdminPanelImplBase {
        @Override
        public void checkRole(CheckRoleRequest req, StreamObserver<CheckRoleResponse> responseObserver) {
            String token = req.getToken();
            CheckRoleResponse.Builder response = CheckRoleResponse.newBuilder();

            try {
                if (SECRET_KEY == null || DB_URL == null || DB_USER == null || DB_PASSWORD == null) {
                    throw new IllegalStateException("Required environment variables not set");
                }

                Claims claims = Jwts.parser()
                        .setSigningKey(SECRET_KEY)
                        .parseClaimsJws(token)
                        .getBody();
                long userID = Long.parseLong(claims.getSubject());

                String role = getRoleFromDatabase(userID);
                boolean isAdmin = "admin".equalsIgnoreCase(role);

                response.setIsAdmin(isAdmin)
                        .setRole(role)
                        .setUserID(userID)
                        .setMessage(isAdmin ? "Access granted to admin panel" : "Access denied: not an admin");
            } catch (Exception e) {
                response.setIsAdmin(false)
                        .setMessage("Invalid token or error: " + e.getMessage());
            }

            responseObserver.onNext(response.build());
            responseObserver.onCompleted();
        }

        private String getRoleFromDatabase(long userID) throws Exception {
            String role = "developer";
            try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
                String sql = "SELECT role FROM users WHERE id = ?";
                PreparedStatement stmt = conn.prepareStatement(sql);
                stmt.setLong(1, userID);
                ResultSet rs = stmt.executeQuery();
                if (rs.next()) {
                    role = rs.getString("role");
                } else {
                    throw new Exception("User with ID " + userID + " not found");
                }
            }
            return role;
        }
    }

    // Вспомогательные методы для парсинга POSTGRES_URI
    private static String convertPostgresUriToJdbc(String uri) {
        return "jdbc:postgresql://" + uri.split("://")[1].split("@")[1];
    }

    private static String extractUserFromUri(String uri) {
        return uri.split("://")[1].split(":")[0];
    }

    private static String extractPasswordFromUri(String uri) {
        return uri.split("://")[1].split(":")[1].split("@")[0];
    }
}