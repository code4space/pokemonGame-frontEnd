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
import PreparePvP from "../views/preparePvP";
import PvPWrapper from "../views/pvpWrapper";

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
                        element: <PvPWrapper />,
                        children: [
                            {
                                path: '/pvp',
                                element: <PagePvP/>
                            },
                            {
                                path: '/pvp/draft',
                                element: <PreparePvP/>
                            },
                        ]
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