import React, { useEffect, useState } from 'react';
import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Image } from '../../types/Image';
import { getImages } from '../../requests';

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



export function ImageList({
    handleplay,
}:{
    handleplay:(index:number)=> void;
}) {
  const [imagesLoaded, setimagesLoaded] = useState(false);
  const [images, setimages] = useState<Image[]>([]);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!imagesLoaded) {
      getImages()
        .then(images => {
          setimages(images);
          setimagesLoaded(true);
          console.log(images);
        })
        .catch(err => {
          console.log(err);
          setError(true);
        });
    }
  })
    function convertToDataType(images: Image[]): DataType[] {
        return images.map((image) => {
          const { id, name, artist } = image;
          return {
            id,
            name,
            artist,
          };
        });
      }

    const data: DataType[] = convertToDataType(images);

    return (
        <Table columns={columns} dataSource={data} />
    )
}