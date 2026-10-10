import useAuthBootstrap from "../hooks/useAuthBootstrap";

const AuthBootstrap = ({ children }) => {
  useAuthBootstrap();

  return children;
};

export default AuthBootstrap;
