import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useRef,
} from "react";
import { useGenerate } from "../hooks/useGenerate";
import { QueryResponse } from "@/src/api";

type props = {
  setData: Dispatch<SetStateAction<QueryResponse | undefined>>;
};

const InputText = ({ setData }: props) => {
  const [prompt, setPrompt] = useState<string>("");
  const [isMusic, setMusic] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement>(null);

  const { mutate, data, isPending, isSuccess } = useGenerate();

  const sendRequest = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      console.log(prompt);
      mutate({ prompt });
    }
  };

  useEffect(() => {
    if (isSuccess && data) {
      setData({ ...data });
      if (data.action === "play_music") {
        setMusic(true);
        const musicQuery = data.action_data || prompt;
        const streamUrl = `http://localhost:8000/music/stream?query=${encodeURIComponent(musicQuery)}`;
        setAudioUrl(streamUrl);
        console.log("URL audio:", streamUrl);
      }
    }
  }, [isSuccess, data, prompt]);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      console.log("Chargement de l'audio depuis:", audioUrl);
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.log("Auto-play bloqué par le navigateur:", err);
        });
      }
    }
  }, [audioUrl]);

  return (
    <div className="flex flex-col justify-center items-center gap-7">
      <input
        type="text"
        className="bg-white p-2 rounded border"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={sendRequest}
        disabled={isPending}
        placeholder="Demandez une musique..."
      />
      
      {isMusic && audioUrl && (
        <div className="w-full max-w-md">
          <audio
            ref={audioRef}
            controls
            autoPlay
            className="mt-4 w-full"
            onError={(e) => {
              console.error("Erreur de lecture audio:", e);
              const target = e.target as HTMLAudioElement;
              console.error("Src actuel:", target.src);
            }}
            onLoadedMetadata={() => {
              console.log("Audio chargé avec succès !");
            }}
          />
        </div>
      )}
    </div>
  );
};

export default InputText;