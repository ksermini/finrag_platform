import React from "react";

const keys = "CTRL ALT CMD A S D F G H J K L ENTER".split(" ");

const KeyboardOverlay = () => (
  <div className="grid grid-cols-14 gap-1 text-[10px]">
    {keys.map((key, i) => (
      <div key={i} className="border border-white text-center py-1">
        {key}
      </div>
    ))}
  </div>
);

export default KeyboardOverlay;
