import React, { useEffect, useState } from "react";
import { Card, Select, Upload, UploadFile, UploadProps, message } from "antd";
import { Form, Input, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Kind1, Kind2, Media, MediaType } from "../../types/Media";
import { UploadChangeParam } from "antd/es/upload";
const props: UploadProps = {
  name: "file",
  action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
  headers: {
    authorization: "authorization-text",
  },
  onChange(info) {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};
export interface MediaProps<T> {
  name: string;
  url: string;
  cover: string;
  artist: string;
  type: MediaType;
  id: number;
  extraProps: T;
  kind: Kind1 | Kind2;
}

const temp: MediaProps<any> = {
  name: "",
  url: "",
  cover: "",
  artist: "",
  type: MediaType.MusicType,
  id: 0,
  extraProps: {},
  kind: Kind1.administrative_working,
};

interface MediaUploadFormProps {
  mediaType: MediaType;
  initialValues?: Media;
  onSubmit: (values: Media) => void;
}

const MediaUploadForm: React.FC<MediaUploadFormProps> = ({
  mediaType,
  initialValues,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [uploadedFiles, setUploadedFiles] = useState({ url: [], cover: [] });
  useEffect(() => {
    form.resetFields();
  }, [mediaType, form]);
  const handleFileChange = (info: UploadChangeParam<UploadFile<any>>, field: 'url' | 'cover') => {
    // 根据上传状态更新文件列表
    if (info.file.status === 'done') {
      setUploadedFiles(prev => ({ ...prev, [field]: [...prev[field], info.file] }));
    }
  };

  const handleFinish = (values: any) => {
    const finalValues = {
      ...values,
      url: uploadedFiles.url,
      cover: uploadedFiles.cover,
      type: mediaType
    };
    onSubmit(finalValues);
  };
  return (
    <div style={{ width: "100%", display: "flex" }}>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        style={{ width: "80%", margin: "auto" }}
        form={form}
        initialValues={initialValues}
        onFinish={handleFinish}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please input the name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="url"
          label="Source"
          rules={[{ required: true, message: "Please input the Source!" }]}
        >
          <Upload {...props} onChange={(info) => handleFileChange(info, 'url')}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item name="cover" label="Cover">
        <Upload {...props} onChange={(info) => handleFileChange(info, 'cover')}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item name="artist" label="Artist">
          <Input />
        </Form.Item>
        <Form.Item name="kind" label="Kind" rules={[{ required: true, message: "Please input the kind" }]}>
          <Select>
            {Object.values(Kind1).map((kind) => (
              <Select.Option key={kind} value={kind}>
                {kind}
              </Select.Option>
            ))}
            {Object.values(Kind2).map((kind) => (
              <Select.Option key={kind} value={kind}>
                {kind}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        {mediaType === MediaType.MusicType && (
          <Form.Item name="text" label="Text">
            <Upload {...props}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
          </Form.Item>
        )}
        <Button type="primary" htmlType="submit" style={{margin:'0 40% 0 40%',width:'20%'}}>
          Upload
        </Button>
      </Form>
    </div>
  );
};
const tabListNoTitle = [
  {
    key: "music",
    label: "music",
  },
  {
    key: "image",
    label: "image",
  },
  {
    key: "video",
    label: "video",
  },
];

const App: React.FC = () => {
  const [activeTabKey2, setActiveTabKey2] = useState<string>("music");
  const [mediaData, setMediaData] = useState<MediaProps<any>>(temp);

  const onTab2Change = (key: string) => {
    setActiveTabKey2(key);
  };

  const handleSubmit = (values: Media) => {
    // 处理提交逻辑
    console.log(values);
  };

  return (
    <>
      <Card
        style={{ width: "90%" }}
        tabList={tabListNoTitle}
        activeTabKey={activeTabKey2}
        tabBarExtraContent={<a href="#">More</a>}
        onTabChange={onTab2Change}
        tabProps={{
          size: "middle",
        }}
      >
        <MediaUploadForm
          mediaType={determineMediaType(activeTabKey2)} 
          initialValues={mediaData}
          onSubmit={handleSubmit}
        />
      </Card>
    </>
  );
};
function determineMediaType(tabKey: string): MediaType {
  switch (tabKey) {
    case "music":
      return MediaType.MusicType;
    case "image":
      return MediaType.ImageType;
    case "video":
      return MediaType.VideoType;
    default:
      return MediaType.ImageType; // 默认类型
  }
}
export default App;
