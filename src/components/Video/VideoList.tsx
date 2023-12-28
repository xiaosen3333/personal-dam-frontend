import React, { useEffect, useState } from 'react';
import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Video } from '../../types/Video';
import { getVideos, deleteVideo } from '../../requests';
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

export function VideoList({
    handleplay,
}:{
    handleplay:(index:number)=> void;
}) {
  const [videosLoaded, setvideosLoaded] = useState(false);
  const [videos, setvideos] = useState<Video[]>([]);
  const [error, setError] = useState(false);
  const baseUrl = "http://localhost:3001/api/video/";

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
          const { id, name, artist, kind, cover, url } = videos;
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
          await deleteVideo({ id: record.id,  });
          
          // 更新表格数据
          setvideos((prevVideos) => prevVideos.filter((video) => video.id !== record.id));
        } catch (error) {
          console.error("Error deleting music:", error);
        }
      };

      const downloadVideo = async (record: DataType) => {
        try {
          const response = await fetch(baseUrl + "download/" + record.id);
          console.log(record.id)
          if (response.status === 200) {
            const blob = new Blob([await response.arrayBuffer()]);
            console.log(blob);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = record.name + ".mp4" ; // 或从 Content-Disposition 获取文件名
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
          render: (text,record) => (
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
            <a onClick={() => downloadVideo(record)}>
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

    const data: DataType[] = convertToDataType(videos);

    return (
        <Table columns={columns} dataSource={data} />
    )
}