import { createBrowserRouter } from "react-router-dom";
import HomePage from "../views/home";
import LoginPage from "../views/login";
import PrivateRoute from "../components/privateRoute";
import CollectionPage from "../views/collection";
import TopNavbar from "../components/TopNavbar";
import DrawPage from "../views/draw";
import PreparePage from "../views/prepare";
import GamePlayPage from "../views/gamePlay";
import LosePage from "../views/losePage";
import WinPage from "../views/winPage";
import GameModePage from "../views/gameMode";
import PagePvP from "../views/pvp";

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
                        path: '/pvp',
                        element: <PagePvP />
                    },
                    {
                        path: '/mode',
                        element: <GameModePage />
                    },
                    {
                        path: '/collection',
                        element: <CollectionPage />
                    },
                    {
                        path: '/draw',
                        element: <DrawPage />
                    },
                    {
                        path: '/prepare',
                        element: <PreparePage />
                    },
                    {
                        path: '/play',
                        element: <GamePlayPage />
                    },
                    {
                        path: '/play/lose',
                        element: <LosePage />
                    },
                    {
                        path: '/play/win',
                        element: <WinPage />
                    },
                ]
            }
        ]
    }
])

export default router