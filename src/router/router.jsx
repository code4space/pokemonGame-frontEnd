import { createBrowserRouter } from "react-router-dom";
import HomePage from "../views/home";
import LoginPage from "../views/login";
import PrivateRoute from "../components/privateRoute";
import CollectionPage from "../views/collection";
import TopNavbar from "../components/TopNavbar";

const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />
    },
    {
        element: <PrivateRoute />,
        children: [
            {
                element: <TopNavbar />,
                children: [
                    {
                        path: '/',
                        element: <HomePage />
                    },
                    {
                        path: '/collection',
                        element: <CollectionPage />
                    },
                ]
            }
        ]
    }
])

export default router