import { Navigate } from "react-router";
import { auth } from "../../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";

const PrivateRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) return <p>Cargando...</p>;
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
