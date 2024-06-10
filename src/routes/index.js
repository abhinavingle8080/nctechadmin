import { useRoutes } from "react-router-dom";

// Routes Array
import LoginRoutes from './LoginRoutes';
import MainRoutes from './MainRoutes';
import UserRoutes from "./UserRoutes";

export default function Router() {
  return useRoutes(
    [
    LoginRoutes,
    MainRoutes,
    UserRoutes
  ]);
}