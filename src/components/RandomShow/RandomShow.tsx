import React, { useEffect } from "react";
import { Card, Col, Divider, Row } from "antd";
import { useState } from "react";
import { Music } from "../../types/Music";
import { Video } from "../../types/Video";
import { Image } from "../../types/Image";
import { SwapOutlined } from "@ant-design/icons";
import { MediaType } from "../../types/Media";
import { getImages, getMusics, getVideos } from "../../requests";

const { Meta } = Card;
const styles = {
    card:{
        // width:'100%',
    }
}
function getRandomItems<T>(items: T[], count: number): T[] {
  const shuffled = items.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function MediaRow<T extends { name: string; cover: string; artist: string ; type: MediaType;id:number}>({
    title,
    items,
    onRefresh,
    onCardClick,
  }: {
    title: string;
    items: T[];
    onRefresh: () => void;
    onCardClick: (type:MediaType,index:number)=> void
  }) {
    return (
      <>
        <Divider orientation="left">
          {title} <SwapOutlined type="reload" onClick={onRefresh} style={{ cursor: 'pointer' }} />
        </Divider>
        <Row gutter={[16, 24]} style={{ width: '80%' }}>
  {items.map((item, index) => (
    <Col key={index} className="gutter-row" xs={24} sm={12} md={8} lg={6} xl={6}>
      <Card
        style={styles.card}
        hoverable
        cover={<img alt={item.name} src={item.cover} />}
        onClick={() => onCardClick(item.type, item.id - 1)}
        size="small"
      >
        <Meta title={item.name} description={item.artist} />
      </Card>
    </Col>
  ))}
</Row>

      </>
    );
  }
  

export function RandomShow({
  handleplay,
}: {
  handleplay:(type:MediaType,index:number)=> void
}) {
    const [randomMusics, setRandomMusics] = useState([] as Music[]);
    const [randomVideos, setRandomVideos] = useState([] as Video[]);
    const [randomImages, setRandomImages] = useState([] as Image[]);
    const [musicsLoaded, setmusicsLoaded] = useState(false);
    const [videosLoaded, setvideosLoaded] = useState(false);
    const [imagesLoaded, setimagesLoaded] = useState(false);
    const [musics, setmusics] = useState<Music[]>([]);
    const [videos, setvideos] = useState<Video[]>([]);
    const [images, setimages] = useState<Image[]>([]);
    const [error, setError] = useState(false);
    useEffect(() => {
      if (!musicsLoaded) {
        getMusics()
          .then(musics => {
            setmusics(musics);
            setRandomMusics(getRandomItems(musics, 4) as Music[]);
            setmusicsLoaded(true);
            console.log(musics);
          })
          .catch(err => {
            console.log(err);
            setError(true);
          });
      }
    })
    useEffect(() => {
      if (!imagesLoaded) {
        getImages()
          .then(images => {
            setimages(images);
            setRandomImages(getRandomItems(images, 4) as Image[]);
            setimagesLoaded(true);
            console.log(images);
          })
          .catch(err => {
            console.log(err);
            setError(true);
          });
      }
    })
    useEffect(() => {
      if (!videosLoaded) {
        getVideos()
          .then(videos => {
            setvideos(videos);
            setRandomVideos(getRandomItems(videos, 4) as Video[]);
            setvideosLoaded(true);
            console.log(videos);
          })
          .catch(err => {
            console.log(err);
            setError(true);
          });
      }
    })

    return (
      <div>
        <MediaRow
          title="Images"
          items={randomImages}
          onRefresh={() => setRandomImages(getRandomItems(images, 4))}
          onCardClick={handleplay}
        />
        <MediaRow
          title="Music"
          items={randomMusics}
          onRefresh={() => setRandomMusics(getRandomItems(musics, 4))}
          onCardClick={handleplay}
        />
        <MediaRow
          title="Videos"
          items={randomVideos}
          onRefresh={() => setRandomVideos(getRandomItems(videos, 4))}
          onCardClick={handleplay}
        />
      </div>
  );
}
