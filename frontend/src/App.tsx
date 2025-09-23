import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import {
  RouterProvider,
  createBrowserRouter,
} from "react-router";

function isAuthenticated() {
  // Example: check for a token in sessionStorage
  return Boolean(sessionStorage.getItem("authToken"));
}

const router = createBrowserRouter([
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },
  {
    path: "/",
    element: (
      <ProtectedRoute isAuthenticated={isAuthenticated()}>
        
        <Home />
      </ProtectedRoute>
    ),
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
