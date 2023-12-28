import React, { useEffect } from "react";
import { Card, Col, Divider, Row } from "antd";
import { useState } from "react";
import { Music } from "../../types/Music";
import { Video } from "../../types/Video";
import { Image } from "../../types/Image";
import { SwapOutlined } from "@ant-design/icons";
import { MediaType, Kind } from "../../types/Media";
import { getImages, getMusics, getVideos } from "../../requests";

const { Meta } = Card;
const styles = {
  card: {
    // width:'100%',
  }
}

function MediaRow<T extends { name: string; cover: string; artist: string; type: MediaType; id: number }>({
  title,
  items,
  onRefresh,
  onCardClick,
}: {
  title: string;
  items: T[];
  onRefresh: () => void;
  onCardClick: (type: MediaType, index: number) => void
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


export function Manual_laboringShow({
  handleplay,
  index
}: {
  handleplay: (type: MediaType, index: number) => void,
  index: keyof typeof Kind
}) {
  const [musics, setmusics] = useState<Music[]>([]);
  const [videos, setvideos] = useState<Video[]>([]);
  const [images, setimages] = useState<Image[]>([]);
  const [error, setError] = useState(false);
  console.log(index)
 
  useEffect(() => {

    getMusics()
      .then((musics) => {
        // Assuming there's a 'kind' property in the Music type
        const filteredMusics = musics.filter((music) => {
          // Replace 'your_required_kind' with the specific kind you want to display
          // console.log(Number(Kind[music.kind]),currentindex)
          return Number(Kind[music.kind]) === Number(Kind[index]);
        });
        setmusics(filteredMusics);
        console.log(filteredMusics);
      })
      .catch((err) => {
        console.log(err);
        setError(true);
      });

  }, [index]);
  useEffect(() => {

    getImages()
      .then((images) => {
        const filteredImages = images.filter((image) => {
          return Number(Kind[image.kind]) === Number(Kind[index]);
        })
        setimages(filteredImages);

        console.log(images);
      })
      .catch(err => {
        console.log(err);
        setError(true);
      });

  }, [index])
  useEffect(() => {

    getVideos()
      .then(videos => {
        const filteredVideos = videos.filter((video) => {
          return Number(Kind[video.kind])  === Number(Kind[index]);
        })
        setvideos(filteredVideos);

        console.log(videos);
      })
      .catch(err => {
        console.log(err);
        setError(true);
      });

  }, [index]);

  return (
    <div>
      <MediaRow
        title="Images"
        items={images}
        onRefresh={() => { }}
        onCardClick={handleplay}
      />
      <MediaRow
        title="Music"
        items={musics}
        onRefresh={() => { }}
        onCardClick={handleplay}
      />
      <MediaRow
        title="Videos"
        items={videos}
        onRefresh={() => { }}
        onCardClick={handleplay}
      />
    </div>
  );
}
