import React from "react";
import { Route, Routes } from "react-router-dom";
import NotePage from "./Pages/NotePage";
import AllNotes from "./Pages/AllNotes";



const App = () => {
  return (
    <div className="bg-[#232323] flex flex-col rounded-xl h-screen w-screen text-white overflow-hidden">
      <Routes>
        <Route path="/" element={<AllNotes />} />
        <Route path="/note/:id" element={<NotePage />} />
      </Routes> 
    </div>
  );
};

export default App;
