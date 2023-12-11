import React, { useState, useEffect, useRef } from "react";
import { Slider, Button, Image } from "antd";
import { StepForwardOutlined, StepBackwardOutlined } from "@ant-design/icons";
import { PlayCircleOutlined, PauseCircleOutlined } from "@ant-design/icons";

import { Music } from "../../types/Music";
import { getMusics } from "../../requests";
const styles = {
  container: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    margin: "auto",
    width: "80%",
  },
  image: {
    width: "100%",
    height: "auto",
    cursor: "pointer",
    borderRadius: "50%",
  },
  lyricsContainer: {
    padding: "10px",
    textAlign: "center" as const,
    width: "100%",
    height: "30vh",
    overflowY: "scroll" as const,
  },
};

export function Player({
  music,
  onPre,
  onNext,
}: {
  music: Music;
  onPre: () => void;
  onNext: () => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [lyrics, setLyrics] = useState("");
  const [currentMusic, setCurrentMusic] = useState<Music>(music);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  const [showLyrics, setShowLyrics] = useState(false);

  const handleImageClick = () => {
    setShowLyrics(!showLyrics);
  };
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener("loadedmetadata", () => {
        setDuration(audio.duration);
      });

      audio.addEventListener("timeupdate", () => {
        setCurrentTime(audio.currentTime);
      });
    }
  }, []);

  const onSliderChange = (value: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = (value / 100) * duration;
      setCurrentTime(audio.currentTime);
    }
  };
  useEffect(()=>{
    setCurrentMusic(music)
  },[music])

  useEffect(() => {
    if (currentMusic.text) {
      fetch(currentMusic.text)
        .then((response) => response.text())
        .then((text) => setLyrics(text))
        .catch((error) => console.error("Error fetching lyrics:", error));
    }
  }, [currentMusic.text]); 

  return (
    <div style={styles.container}>
      <audio ref={audioRef} src={currentMusic?.url} />
      <div style={{ marginBottom: "10px", textAlign: "center" }}>
        <div
          onClick={handleImageClick}
          style={{
            minHeight: "350px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {showLyrics ? (
            <div style={styles.lyricsContainer}>
              <pre>{lyrics}</pre>
            </div>
          ) : (
            <Image
              style={styles.image}
              src={currentMusic.cover}
              width={200}
              height={200}
              preview={false}
            />
          )}
        </div>

        <h2 style={{ fontWeight: "bold" }}>
          {currentMusic.name} - {currentMusic.artist}
        </h2>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
          marginBottom: "10px",
          width: "100%",
        }}
      >
        <div
          onClick={onPre}
          style={{
            marginLeft: "auto",
            marginRight: "2rem",
          }}
        >
          <StepBackwardOutlined
            style={{
              fontSize: "2rem",
            }}
          />
        </div>
        <div onClick={togglePlay}>
          {isPlaying ? (
            <PauseCircleOutlined
              style={{
                fontSize: "2rem",
              }}
            />
          ) : (
            <PlayCircleOutlined
              style={{
                fontSize: "2rem",
              }}
            />
          )}
        </div>
        <div
          onClick={onNext}
          style={{
            marginLeft: "2rem",
            marginRight: "auto",
          }}
        >
          <StepForwardOutlined
            style={{
              fontSize: "2rem",
            }}
          />
        </div>
      </div>
      <Slider
        defaultValue={0}
        value={(currentTime / duration) * 100}
        onChange={onSliderChange}
      />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>
          {new Date(currentTime * 1000).toISOString().substring(14, 19)}
        </span>
        <span>{new Date(duration * 1000).toISOString().substring(14, 19)}</span>
      </div>
    </div>
  );
}
export function MusicPlayer({
  currentMusicIndex,
}: {
  currentMusicIndex: number;
}) {
  const [index, setIndex] = useState(currentMusicIndex);
  const [musicsLoaded, setmusicsLoaded] = useState(false);
  const [musics, setmusics] = useState<Music[]>([]);
  const [error, setError] = useState(false);
  const [currentMusic, setCurrentMusic] = useState<Music>(musics[0]);
  useEffect(() => {
    if (!musicsLoaded) {
      getMusics()
        .then((musics) => {
          setmusics(musics);
          setmusicsLoaded(true);
          setCurrentMusic(musics[index]);
        })
        .catch((err) => {
          console.log(err);
          setError(true);
        });
    }
  });
  const playPrevious = () => {
    if (index > 0) {
      setIndex(index - 1);
    } else {
      setIndex(musics.length - 1);
    }
    setCurrentMusic(musics[index]);
  };

  const playNext = () => {
    if (index < musics.length - 1) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
    setCurrentMusic(musics[index]);
  };

  return (
    <div style={{width:'100%',height:'100%'}}>
      {currentMusic ? (
        <Player music={currentMusic} onNext={playNext} onPre={playPrevious} />
      ) : (
        <p>no music</p>
      )}
    </div>
  );
}
