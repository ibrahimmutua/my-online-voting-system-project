// import logo from './logo.svg';
// import './App.css';
import React from "react";
import { createBrowserRouter,RouterProvider } from "react-router-dom";

import RootLayout from "./pages/RootLayout";
import ErrorPage from "./pages/ErrorPage";
import Register from './pages/Register'
import Login from './pages/Login'
import Results from './pages/Results'
import Elections from './pages/Elections'
import Candidates from './pages/Candidates'
import ElectionDetails from './pages/ElectionDetails'
import Congrats from './pages/Congrats'
import Logout from './pages/Logout'
import ProtectedRoute from './components/ProtectedRoute'
import ChatBot from './components/ChatBot'
const router=createBrowserRouter([
  {
    path:'/',
    element:<RootLayout/>,
    errorElement:<ErrorPage/>,
    children:[
      {
        index:true,
        element:<Login/>
      },
      { path: "login", element: <Login /> },
      {
        path:"register",
        element:<Register />
      },
      {
        path:"results",
        element:<ProtectedRoute><Results /></ProtectedRoute>
      },
      { path: "elections", element: <ProtectedRoute><Elections /></ProtectedRoute> },
      {
        path:"elections/:id",
        element:<ProtectedRoute><ElectionDetails /></ProtectedRoute>
      },
     {
       path:"elections/:id/candidates",
        element:<ProtectedRoute><Candidates /></ProtectedRoute>
     },
     {
       path:"congrats",
        element:<ProtectedRoute><Congrats /></ProtectedRoute>
     },
     {
       path:"logout",
        element:<ProtectedRoute><Logout /></ProtectedRoute>
     },
     

    ]
  }
])
function App() {
  return(
    <>
      <RouterProvider router={router}/>
      <ChatBot />
    </>
  )
}

export default App;
