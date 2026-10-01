import React from "react";

const NoteBackground = ({ bgOptions, children }) => {
  const getBgStyle = () => {
    if (bgOptions.type == "color") {
      return { backgroundColor: bgOptions.value };
    }

    return {
      backgroundColor: bgOptions.value || "#1e1e1e",
      backgroundImage: `url(${bgOptions.src})`,
      backgroundSize: bgOptions.size,
      backgroundRepeat: "repeat",
      backgroundPosition: "top left",
    };
  };




  return (
    <div className="h-full w-full relative overflow-hidden transition-colors duration-300">
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={getBgStyle()}
      ></div>
      <div className="relative z-10 h-full overflow-y-auto leading-relaxed outline-none"
      style={{color: bgOptions.text}}>
        {children}
      </div>
    </div>
  );
};

export default NoteBackground;
