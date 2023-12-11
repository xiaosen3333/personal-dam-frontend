import { useEffect, useRef, useState } from "react";
import { Video } from "../../types/Video";
import { Slider } from "antd";
import { StepForwardOutlined, StepBackwardOutlined, PauseCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { getVideos } from "../../requests";
const styles = {
  container: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    margin: "auto",
    width: "80%",
  },
};

export function Player({
  video,
  onPre,
  onNext,
}: {
  video: Video;
  onPre: () => void;
  onNext: () => void;
}){
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);
  const togglePlay = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener("loadedmetadata", () => {
        setDuration(video.duration);
      });

      video.addEventListener("timeupdate", () => {
        setCurrentTime(video.currentTime);
      });
    }
  }, []);

  const onSliderChange = (value: number) => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = (value / 100) * duration;
      setCurrentTime(video.currentTime);
    }
  };
  return (<div style={styles.container}>
    <video src={video.url} ref={videoRef}></video>
    <div>
      <h2 style={{ fontWeight: "bold" }}>
        {video.name} - {video.artist}
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
      <div onClick={onPre} style={{
        marginLeft: 'auto',
        marginRight: '2rem',
      }}><StepBackwardOutlined style={{
        fontSize: '2rem',
      }} /></div>
      <div
        onClick={togglePlay}
      >{isPlaying ? <PauseCircleOutlined style={{
        fontSize: '2rem',
      }}/> : <PlayCircleOutlined style={{
        fontSize: '2rem',
      }}/>}</div>
      <div onClick={onNext} style={{
        marginLeft: '2rem',
        marginRight: 'auto',
      }}><StepForwardOutlined style={{
        fontSize: '2rem',
      }}/></div>
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
  </div>)
}
export function VideoPlayer({
  currentVideoIndex,
}: {
  currentVideoIndex: number;
}) {
  const [index, setIndex] = useState(currentVideoIndex);
  const [videosLoaded, setvideosLoaded] = useState(false);
  const [videos, setvideos] = useState<Video[]>([]);
  const [error, setError] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<Video>(videos[0]);

  useEffect(() => {
    if (!videosLoaded) {
      getVideos()
        .then((videos) => {
          setvideos(videos);
          setvideosLoaded(true);
          setCurrentVideo(videos[index]);
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
      setIndex(videos.length - 1);
    }
    setCurrentVideo(videos[index]);
  };

  const playNext = () => {
    if (index < videos.length - 1) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
    setCurrentVideo(videos[index]);
  };
  
 

  return (
    <div style={{minWidth:'40%',height:'100%'}}>
      {currentVideo?(<Player video={currentVideo} onPre={playPrevious} onNext={playNext}/>):(<p>no video</p>)}
    </div>
    
  );
}
