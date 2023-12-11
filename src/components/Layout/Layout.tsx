import React, { useEffect, useMemo, useState } from 'react';
import {
  HomeOutlined,
  HeartOutlined,
  CustomerServiceOutlined,
  PictureOutlined,
  PlaySquareOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { musics } from '../../types/Music'; 
import { images } from '../../types/Image';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { MusicPlayer } from '../Music/MusicPlay';
import { MusicList } from '../Music/MusicList';
import { ImagePlayer } from '../Image/ImagePlay';
import { ImageList } from '../Image/ImageList';
import { VideoPlayer } from '../Video/VideoPlay';
import { VideoList } from '../Video/VideoList';
import { videos } from '../../types/Video';
import { Kind1, Kind2, MediaType } from '../../types/Media';
import { RandomShow } from '../RandomShow/RandomShow';
import Upload from '../Upload/Upload';
const { Header, Content, Sider } = Layout;

type MenuItem = {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  children?: MenuItem[];
};

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const kind1MenuItems = Object.keys(Kind1)
  .filter(key => isNaN(Number(key)))
  .map((key, index) => getItem(key, `${11+index}`));
const kind2MenuItems = Object.keys(Kind2)
  .filter(key => isNaN(Number(key)))
  .map((key, index) => getItem(key, `${11+kind1MenuItems.length+index}`));

const kindMenuItems = kind1MenuItems.concat(kind2MenuItems);

const items: MenuItem[] = [
  getItem('主页', '1', <HomeOutlined />),
  getItem('音乐', 'sub1', <CustomerServiceOutlined />, [
    getItem('播放', '2'),
    getItem('列表', '3'),
  ]),
  getItem('图片', 'sub2', <PictureOutlined />, [
    getItem('播放', '4'),
    getItem('列表', '5'),
  ]),
  getItem('视频', 'sub3', <PlaySquareOutlined />, [
    getItem('播放', '6'),
    getItem('列表', '7'),
  ]),
  getItem('分类', '8', <HeartOutlined />,kindMenuItems),
];

const isMenuItem = (item: any): item is MenuItem => {
  return item && typeof item === 'object' && 'key' in item && 'label' in item;
};

const findBreadcrumbPath = (
  items: MenuItem[],
  key: string,
  path: MenuItem[] = []
): MenuItem[] => {
  for (const item of items) {
    if (item){
    if (item.key === key) {
      return [...path, item];
    }
    if (isMenuItem(item) && item.children) {
      const foundPath = findBreadcrumbPath(item.children, key, [...path, item]);
      if (foundPath.length) {
        return foundPath;
      }
    }
  }
  }
  return [];
};

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [MusicIndex, setMusicIndex] = useState(2);
  const [ImageIndex, setImageIndex] = useState(0);
  const [VideoIndex, setVideoIndex] = useState(0);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [currentMenuItem, setCurrentMenuItem] = useState('1');

  const breadcrumbPath = useMemo(() => {
    return findBreadcrumbPath(items, currentMenuItem);
  }, [currentMenuItem, items]);

  const breadcrumbItems = useMemo(() => {
    return breadcrumbPath.map((item, index) => (
      <Breadcrumb.Item key={item.key}>
        {index === breadcrumbPath.length - 1 ? item.label : <a href={`#${item.key}`}>{item.label}</a>}
      </Breadcrumb.Item>
    ));
  }, [breadcrumbPath]);


  const onMusicIndexChange = (index: number) => {
    setMusicIndex(index);
    setCurrentMenuItem('2');
  };

  const onImageIndexChange = (index: number) => {
    setImageIndex(index);
    setCurrentMenuItem('4');
  };

  const onVideoIndexChange = (index: number) => {
    setVideoIndex(index);
    setCurrentMenuItem('6');
  };

  const findParentKey = (currentKey: string): string | undefined => {
    for (const item of items) {
      if (item.children?.some(child => child.key === currentKey)) {
        return item.key;
      }
    }
  };
  const onHomeCard = (type: MediaType, index: number) => {
    const tmp_index = type * 2;
    console.log(index);
    setCurrentMenuItem(tmp_index.toString());
    const parent_key = findParentKey(tmp_index.toString());
    setOpenKeys([parent_key || '']);
    switch(type) {
      case MediaType.MusicType:
        setMusicIndex(index);
        break;
      case MediaType.ImageType:
        setImageIndex(index);
        break;
      case MediaType.VideoType:
        setVideoIndex(index);
        break;
    }
  }

  const content = useMemo(() => {
    switch(currentMenuItem) {
      case '1':
        return <RandomShow  handleplay={onHomeCard}/>;
      case '2':
        return <MusicPlayer
         currentMusicIndex={MusicIndex}></MusicPlayer>;
      case '3':
        return <MusicList 
        handleplay={onMusicIndexChange}
        ></MusicList>;
      case '4':
        return <ImagePlayer currentImageIndex={ImageIndex}></ImagePlayer>;
      case '5':
        return <ImageList handleplay={onImageIndexChange}></ImageList>;
      case '6':
        return <VideoPlayer currentVideoIndex={VideoIndex}></VideoPlayer>;
      case '7':
        return <VideoList handleplay={onVideoIndexChange}></VideoList>;
      case '8':
        return <div>喜欢</div>;
      case '9':
        return <Upload />;
      default:
        return <div>主页</div>;
    
    }
  }, [currentMenuItem]);

  const onMenuClick = (e: { key: React.SetStateAction<string>; }) => {
    setCurrentMenuItem(e.key);
  };

  const onSubMenuClick = (openKeys: string[]) => {
    setOpenKeys(openKeys);
  }

  const handleUpload = () => {
    setCurrentMenuItem('9');
  }
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} onClick={onMenuClick} 
        openKeys={openKeys.length?openKeys:[]} 
        onOpenChange={onSubMenuClick}
        selectedKeys={[currentMenuItem]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', alignItems: 'center' }}>
          <UploadOutlined style={{
            margin: '0 1rem 0 auto',
            fontSize: '1.2rem',
          }}
          onClick={handleUpload}
          />
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
           {breadcrumbItems}
          </Breadcrumb>
          <div style={{ padding: 24, minHeight: 360, background: colorBgContainer , display: 'flex', justifyContent: 'center' }}>
            {content}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;