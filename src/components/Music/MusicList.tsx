import React, { useEffect, useState } from 'react';
import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Music } from '../../types/Music';
import { getMusics } from '../../requests';

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



export function MusicList({
    handleplay,
}:{
    handleplay:(index:number)=> void;
}) {
  const [musicsLoaded, setmusicsLoaded] = useState(false);
  const [musics, setmusics] = useState<Music[]>([]);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!musicsLoaded) {
      getMusics()
        .then(musics => {
          setmusics(musics);
          setmusicsLoaded(true);
          console.log(musics);
        })
        .catch(err => {
          console.log(err);
          setError(true);
        });
    }
  })
    function convertToDataType(musics: Music[]): DataType[] {
        return musics.map((music) => {
          const { id, name, artist } = music;
          return {
            id,
            name,
            artist,
          };
        });
      }

    const data: DataType[] = convertToDataType(musics);

    return (
        <Table columns={columns} dataSource={data} />
    )
}