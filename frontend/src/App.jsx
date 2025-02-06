import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext.jsx";
import AppRoutes from "./routes/RoutesFile";
import GlobalStyles from "./components/GlobalStyles.jsx";

const App = () => (
  <>
    <GlobalStyles />
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  </>
);

export default App;
