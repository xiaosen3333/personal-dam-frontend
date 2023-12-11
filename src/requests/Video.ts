import axios from 'axios';
import { Video } from '../types/Video';

export async function getVideos(): Promise<Video[]> {
    const { data } = await axios.get<Video[]>('/api/Video');
    return data;
}   

export async function addVideo(Video:Video) {
    await axios.post('/api/Video', Video);
}

export async function deleteVideo(Video:Video) {
    await axios.delete(`/api/Video/${Video.id}`);
}