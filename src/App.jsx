import { RouterProvider } from "react-router-dom";

import AuthBootstrap from "./features/auth/components/AuthBootstrap";
import router from "./router/router";

const App = () => {
  return (
    <AuthBootstrap>
      <RouterProvider router={router} />
    </AuthBootstrap>
  );
};

export default App;
