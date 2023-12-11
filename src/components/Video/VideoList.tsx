import React, { useEffect, useState } from 'react';
import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Video } from '../../types/Video';
import { getVideos } from '../../requests';

interface DataType {
  id: number;
  name: string;
  artist: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Artist',
    dataIndex: 'artist',
    key: 'artist',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>play {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];



export function VideoList({
    handleplay,
}:{
    handleplay:(index:number)=> void;
}) {
  const [videosLoaded, setvideosLoaded] = useState(false);
  const [videos, setvideos] = useState<Video[]>([]);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!videosLoaded) {
      getVideos()
        .then(videos => {
          setvideos(videos);
          setvideosLoaded(true);
          console.log(videos);
        })
        .catch(err => {
          console.log(err);
          setError(true);
        });
    }
  })
    function convertToDataType(images: Video[]): DataType[] {
        return videos.map((videos) => {
          const { id, name, artist } = videos;
          return {
            id,
            name,
            artist,
          };
        });
      }

    const data: DataType[] = convertToDataType(videos);

    return (
        <Table columns={columns} dataSource={data} />
    )
}