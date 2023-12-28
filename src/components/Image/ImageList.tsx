import React, { useEffect, useState } from 'react';
import { Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Image } from '../../types/Image';
import { getImages, deleteImage } from '../../requests';
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

export function ImageList({
    handleplay,
}:{
    handleplay:(index:number)=> void;
}) {
  const [imagesLoaded, setimagesLoaded] = useState(false);
  const [images, setimages] = useState<Image[]>([]);
  const [error, setError] = useState(false);
  const baseUrl = "http://localhost:3001/api/image/";

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
  },[imagesLoaded]);

    function convertToDataType(images: Image[]): DataType[] {
        return images.map((image) => {
          const { id, name, artist, kind, cover, url } = image;
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
          await deleteImage({ id: record.id,  });
          
          // 更新表格数据
          setimages((prevImages) => prevImages.filter((image) => image.id !== record.id));
        } catch (error) {
          console.error("Error deleting music:", error);
        }
      };

      const downloadImage = async (record: DataType) => {
        try {
          const response = await fetch(baseUrl + "download/" + record.id);
          if (response.status === 200) {
            const blob = new Blob([await response.arrayBuffer()]);
            console.log(blob);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = record.name + ".png"; 
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
          render: (text,record) =>(
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
            <a onClick={() => downloadImage(record)}>
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

    const data: DataType[] = convertToDataType(images);

    return (
        <Table columns={columns} dataSource={data} />
    )
}