import axios from 'axios';
import { Video } from '../types/Video';

// 前端代码
export async function getVideos(kind?: string): Promise<Video[]> {
    const url = kind ? `/api/Video?kind=${kind}` : '/api/Video';
    const { data } = await axios.get<Video[]>(url);
    return data;
}
 

export async function addVideo(formData: FormData) {
    await axios.post('/api/video', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export async function deleteVideo({id}:{id:number}) {
    await axios.delete(`/api/Video/${id}`);
}