import React, { useState } from "react";
import Topbar from "../components/Topbar";
import TextArea from "../components/TextArea";


const NotePage = () => {

    const [isSaving, setIsSaving] = useState(false);
  
  return (
    <div className="h-screen flex flex-col">
      <Topbar isSaving={isSaving}/>
      <div className="flex-1 h-full">
        <TextArea setIsSaving={setIsSaving}/>
      </div>
    </div>
  );
};

export default NotePage;
