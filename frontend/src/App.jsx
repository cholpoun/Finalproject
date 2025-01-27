import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/RoutesFile";

const App = () => (
  <Router>
    <AppRoutes />
  </Router>
);

export default App;
