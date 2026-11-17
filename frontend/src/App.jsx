import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import NotePage from "./Pages/NotePage";
import AllNotes from "./Pages/AllNotes";
import LoginPage from "./Pages/LoginPage";
import { useAuth } from "./contexts/AuthContext";


const ProtectedRoute = ({children}) => {

  const { isAuthenticated, isLoading } = useAuth()

  if(isLoading) return <div className="text-blue-600 text-lg">Loading..</div>
  if(!isAuthenticated) return <Navigate to="/login" replace />
  return children

}



const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage/>} />

      <Route path="/"
      element={
        <ProtectedRoute>
          <div className="bg-[#232323] flex flex-col rounded-xl h-screen w-screen text-white overflow-hidden">
            <AllNotes />
          </div>
        </ProtectedRoute>
      } />

      <Route
      path="/note/:id"
      element={
        <ProtectedRoute>
          <NotePage />
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
};

export default App;
