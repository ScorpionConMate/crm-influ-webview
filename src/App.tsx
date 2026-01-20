import { router } from "@/router";
import { RouterProvider } from "@tanstack/react-router";

export function App() {
  return <RouterProvider router={router} />;
}

export default App;