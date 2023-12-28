import { useEffect } from "react";
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
    card:{
        // width:'100%',
    }
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
        <Row gutter={[16, 24]} style={{
            width:'80%',
            }}>
          {items.map((item, index) => (
            <Col key={index} className="gutter-row" span={6}>
              <Card
                style={styles.card}
                hoverable
                cover={<img alt={item.name} src={item.cover} />}
                onClick={() => onCardClick(item.type,item.id-1)}
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
  

  export function UserShow({
    handleplay,
    searchValue, // 新增搜索值参数
  }: {
    handleplay: (type: MediaType, index: number) => void;
    searchValue: string; // 新增搜索值参数
  }) {
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
            .then((musics) => {
              // Assuming there's a 'kind' property in the Music type
              const filteredMusics = musics.filter((music) => {
                // Check if the music name contains the search value
                return music.name.includes(searchValue);
              })
              setmusics(filteredMusics);
              setmusicsLoaded(true);
              console.log(filteredMusics);
            })
            .catch((err) => {
              console.log(err);
              setError(true);
            });
        }
      }, [searchValue]);
      useEffect(() => {
        if (!imagesLoaded) {
          getImages()
            .then((images) => {
              const filteredImages=images.filter((image)=>{
                return image.name.includes(searchValue);
              })
              setimages(filteredImages);
              setimagesLoaded(true);
              console.log(images);
            })
            .catch(err => {
              console.log(err);
              setError(true);
            });
        }
      }, [])
      useEffect(() => {
        if (!videosLoaded) {
            getVideos()
                .then(videos => {
                  const filteredVideos=videos.filter((video)=>{
                    return video.name.includes(searchValue);
                  })
                    setvideos(filteredVideos);
                    setvideosLoaded(true);
                    console.log(videos);
                })
                .catch(err => {
                    console.log(err);
                    setError(true);
                });
        }
      }, []);

      return (
        <div>
          <MediaRow
            title="Images"
            items={images}
            onRefresh={() => {}}
            onCardClick={handleplay}
          />
          <MediaRow
            title="Music"
            items={musics}
            onRefresh={() => {}}
            onCardClick={handleplay}
          />
          <MediaRow
            title="Videos"
            items={videos}
            onRefresh={() => {}}
            onCardClick={handleplay}
          />
        </div>
    );
  }
  