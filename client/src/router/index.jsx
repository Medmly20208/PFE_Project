import { createBrowserRouter, Outlet } from "react-router-dom";
import { lazy } from "react";

//components
import Dashboard from "../components/Dashboard";
import Profile from "../components/Profile";
import Reports from "../components/Reports";
import Chat from "../components/Chat";
import News from "../components/News";
import ChatItem from "../components/Chat/ChatItem";
import MyBlogs from "../components/Blog/MyBlogs";
import AllBlogs from "../components/Blog/Allblogs";
import BlogPage from "../components/Blog/BlogPage";
import Blog from "../components/Blog";
import Portfolio from "../components/Portfolio";

//pages
import Landing from "../pages/Landing";
import Error from "../pages/Error";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Container from "../components/Container";
import ChooseAssets from "../components/ChooseAssets";
import InitAssets from "../components/InitAssets";
import Ratios from "../components/Ratios";
import PredictionComponent from "../components/Prediction";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
    errorElement: <Error />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },

  {
    path: "/choose-assets",
    element: <InitAssets />,
  },
  {
    path: "/",
    element: <Container />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "profile",
        element: <Profile />,
      },

      {
        path: "reports",
        element: <Reports />,
      },
      {
        path: "portfolio",
        element: <Portfolio />,
      },
      {
        path: "ratios",
        element: <Ratios />,
      },
      {
        path: "Prediction",
        element: <PredictionComponent />,
      },
      {
        path: "chat",
        element: <Chat />,
        children: [
          {
            path: ":room",
            index: true,
            element: <ChatItem />,
          },
        ],
      },

      {
        path: "news",
        element: <News />,
      },

      {
        path: "blog",
        element: <Blog />,
        children: [
          {
            path: "all",

            element: <AllBlogs />,
          },
          {
            path: "myblog",
            element: <MyBlogs />,
          },
          {
            path: ":blogId",
            element: <BlogPage />,
          },
        ],
      },
    ],
  },
]);
