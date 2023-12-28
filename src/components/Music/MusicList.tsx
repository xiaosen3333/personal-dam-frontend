import React, { useEffect, useState } from 'react';
import { Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Music } from '../../types/Music';
import { getMusics, deleteMusic } from '../../requests';
import { DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import { Kind } from '../../types/Media';

interface DataType {
  id: number;
  name: string;
  artist: string;
  cover: string;
  kind: Kind; 
  url: string;
}

export function MusicList({
  handleplay,
}: {
  handleplay: (index: number) => void;
}) {
  const [musicsLoaded, setmusicsLoaded] = useState(false);
  const [musics, setmusics] = useState<Music[]>([]);
  const [error, setError] = useState(false);
  const baseUrl = "http://localhost:3001/api/musics/";

  useEffect(() => {
    if (!musicsLoaded) {
      getMusics()
        .then((musics) => {
          setmusics(musics);
          setmusicsLoaded(true);
          console.log(musics);
        })
        .catch((err) => {
          console.log(err);
          setError(true);
        });
    }
  }, [musicsLoaded]); // 添加依赖项以解决 useEffect 的无限循环问题

  function convertToDataType(musics: Music[]): DataType[] {
    return musics.map((music) => {
      const { id, name, artist, kind, cover, url } = music;
      return {
        id,
        name,
        artist,
        kind,
        cover,
        url,
      };
    });
  }

  const handleDelete = async (record: DataType) => {
    try {
      // 调用删除函数
      await deleteMusic({ id: record.id,  });
      
      // 更新表格数据
      setmusics((prevMusics) => prevMusics.filter((music) => music.id !== record.id));
    } catch (error) {
      console.error("Error deleting music:", error);
    }
  };

  const downloadMusic = async (record: DataType) => {
    try {
      const response = await fetch(baseUrl + "download/" + record.id);
      if (response.status === 200) {
        const blob = new Blob([await response.arrayBuffer()], {
          type: "audio/mpeg",
        });
        console.log(blob);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = record.name + ".mp3"; // 或从 Content-Disposition 获取文件名
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

  const columns: ColumnsType<DataType> = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <div>{text}</div>,
    },
    {
      title: 'Cover',
      dataIndex: 'cover',
      key: 'cover',
      render: (text) => <img src={text} alt="Media Cover" style={{ width: '50px' }} />,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <a onClick={() => handleplay(record.id)}> {text}</a>
      ),
    },
    {
      title: 'Artist',
      dataIndex: 'artist',
      key: 'artist',
      render: (text) => <div>{text}</div>,
    },
    {
      title: 'Kind',
      dataIndex: 'kind',
      key: 'kind',
      render: (text) => <div>{text}</div>,
    },
    {
      title: 'Download',
      dataIndex: 'url',
      key: 'download',
      render: (text, record) => (
        <a onClick={() => downloadMusic(record)}>
          <DownloadOutlined />
          下载
        </a>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleDelete(record)}><DeleteOutlined /> 删除</a>
        </Space>
      ),
    },
  ];

  const data: DataType[] = convertToDataType(musics);

  return <Table columns={columns} scroll={{ x: 1000 }} dataSource={data} />;
}
