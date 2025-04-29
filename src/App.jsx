import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes'; // ✅ Import AppRoutes properly

function App() {
  return (
    <Router>
      <AppRoutes /> {/* ✅ Use AppRoutes to handle all your routing */}
    </Router>
  );
}

export default App;
