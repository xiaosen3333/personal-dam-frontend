import React, { useState, useEffect, useRef } from "react";
import { Slider, Button, Image } from "antd";
import { StepForwardOutlined, StepBackwardOutlined } from "@ant-design/icons";
import { PlayCircleOutlined, PauseCircleOutlined } from "@ant-design/icons";
import { DownloadOutlined } from "@ant-design/icons";

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

  const baseUrl = "http://localhost:3001/api/musics/";

  const downloadMusic = async () => {
    try {
      const response = await fetch(baseUrl + "download/" + currentMusic.id);
      if (response.status === 200) {
        const blob = new Blob([await response.arrayBuffer()], {
          type: "audio/mpeg",
        });
        console.log(blob);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = currentMusic.name + ".mp3"; // 或从 Content-Disposition 获取文件名
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error("File not found or other server error");
      }
    } catch (error) {
      console.error("Error downloading music:", error);
    }
  };
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
    if (!audio) return;
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    if (audio) {
      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
      audio.addEventListener("timeupdate", handleTimeUpdate);
    }

    // 清除函数
    return () => {
      if (audio) {
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audio.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, []);

  const onSliderChange = (value: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = (value / 100) * duration;
      setCurrentTime(audio.currentTime);
    }
  };
  useEffect(() => {
    setCurrentMusic(music);
  }, [music]);

  useEffect(() => {
    if (currentMusic.text) {
      fetch(currentMusic.text)
        .then((response) => response.text())
        .then((text) => setLyrics(text))
        .catch((error) => console.error("Error fetching lyrics:", error));
    }
  }, [currentMusic]);

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
        <div onClick={downloadMusic}>
          {/* <a href={currentMusic.url} download={currentMusic.name}><DownloadOutlined/></a> */}
          <Button onClick={downloadMusic} icon={<DownloadOutlined />} />
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
    setIndex((prevIndex) => {
      const newIndex = prevIndex > 0 ? prevIndex - 1 : musics.length - 1;
      console.log(newIndex);
      console.log(musics[newIndex]);
      return newIndex;
    });
  };

  const playNext = () => {
    setIndex((prevIndex) => {
      const newIndex = prevIndex < musics.length - 1 ? prevIndex + 1 : 0;
      setCurrentMusic(musics[newIndex]);
      console.log(newIndex);
      console.log(musics[newIndex]);
      return newIndex;
    });
  };

  useEffect(() => {
    setCurrentMusic(musics[index]);
  }, [index, musics]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {currentMusic ? (
        <Player music={currentMusic} onNext={playNext} onPre={playPrevious} />
      ) : (
        <p>no music</p>
      )}
    </div>
  );
}
