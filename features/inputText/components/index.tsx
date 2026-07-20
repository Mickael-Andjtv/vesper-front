import React, { useState } from "react";

const InputText = () => {
  const [prompt, setPrompt] = useState<string>("");
  const sendRequest = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      console.log(prompt);
    }
  };
  return (
    <div className="flex justify-center items-center gap-7">
      <input
        type="text"
        // name=""
        // id=""
        className="bg-white"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={sendRequest}
      />
    </div>
  );
};

export default InputText;
