import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext.jsx";  
import AppRoutes from "./routes/RoutesFile";

const App = () => (
  <Router>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </Router>
);

export default App;
