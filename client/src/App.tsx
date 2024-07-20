import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routes from './constants/Routes';
import IRoute from './types/RouteTypes';

function App() {

  return (
    <Router>
      <Routes>
        {routes.map((route: IRoute) => (
          <Route
            key={route.name}
            path={route.path}
            element={<route.component />}
          />
        ))}
      </Routes>
    </Router>
  );
}

export default App
