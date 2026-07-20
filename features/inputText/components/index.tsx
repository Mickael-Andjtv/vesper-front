import React, { useEffect, useState } from "react";
import { useGenerate } from "../hooks/useGenerate";

const InputText = () => {
  const [prompt, setPrompt] = useState<string>("");
  const { mutate, data, isPending, isSuccess } = useGenerate();
  const sendRequest = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      console.log(prompt);
      mutate({ prompt });
    }
  };

  useEffect(() => {
    if (isSuccess) console.log(data);
  }, [isSuccess]);

  return (
    <div className="flex justify-center items-center gap-7">
      <input
        type="text"
      
        className="bg-white"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={sendRequest}
      />
    </div>
  );
};

export default InputText;
