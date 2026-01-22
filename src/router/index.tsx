import { createRouter, createRootRoute } from "@tanstack/react-router";
const rootRoute = createRootRoute({
  component: () => <h1>
    Hello World
  </h1>
});


const routeTree = rootRoute.addChildren([

]);

export const router = createRouter({ routeTree });
