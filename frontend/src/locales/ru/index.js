import auth from "./auth.json";
import navbar from "./navbar.json";
import home from "./home.json";
import companies from "./companies.json";
import profile from "./profile.json";
import errorHandling from "./errorHandling.json";

export default {
    ...auth,
    ...navbar,
    ...home,
    ...companies,
    ...profile,
    ...errorHandling,
};
