import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routes from './constants/Routes';
import IRoute from './types/RouteTypes';
import Authorization from './components/Authorization';

function App() {

  return (
    <Router>
      <Routes>
        {routes.map((route: IRoute) => {
          if (route.auth) {
            return (
              <Route
                key={route.name}
                path={route.path}
                element={<Authorization><route.component /></Authorization>}
              />
            )
          }
          else {
            return (
              <Route
                key={route.name}
                path={route.path}
                element={<route.component />}
              />
            )
          }
        })}
      </Routes>
    </Router>
  );
}

export default App
