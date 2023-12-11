import { useEffect, useState } from "react";
import { Image } from "../../types/Image";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { getImages } from "../../requests";

const styles = {
  container: {
    display: "inline-flex",
    FlexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
  },
  image: {
    width: "80%",
  },
  icon: {
    fontSize: "2rem",
    margin: "1rem",
  },
};

export function Player({
    image,
    onPre,
    onNext,
}: {
    image: Image;
    onPre: () => void;
    onNext: () => void;
}) {
    const [currentImage, setCurrentImage] = useState<Image>(image);
    useEffect(()=>{
        setCurrentImage(image)
      },[image])
    
  return (
    <div style={styles.container}>
      <div style={styles.icon} onClick={onPre}>
        <LeftOutlined />
      </div>
      <img
        src={currentImage.url}
        alt={currentImage.name}
        style={styles.image}
      />
      <div style={styles.icon} onClick={onNext}>
        <RightOutlined />
      </div>
    </div>
  );
}

export function ImagePlayer({
  currentImageIndex,
}: {
  currentImageIndex: number;
}) {
  const [index, setIndex] = useState(currentImageIndex);
  const [imagesLoaded, setimagesLoaded] = useState(false);
  const [images, setimages] = useState<Image[]>([]);
  const [error, setError] = useState(false);
  const [currentImage, setCurrentImage] = useState<Image>(images[0]);
  useEffect(() => {
    if (!imagesLoaded) {
      getImages()
        .then((images) => {
          setimages(images);
          setimagesLoaded(true);
          setCurrentImage(images[index]);
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
      setIndex(images.length - 1);
    }
    setCurrentImage(images[index]);
  };

  const playNext = () => {
    if (index < images.length - 1) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
    setCurrentImage(images[index]);
  };

  return <div style={{ width: "100%", height: "100%" }}>
    {currentImage?(
    <Player image={currentImage} onPre={playPrevious} onNext={playNext} />):(<p>no image</p>)}
  </div>;
}
