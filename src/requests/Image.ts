import axios from 'axios';
import { Image } from '../types/Image';

export async function getImages(): Promise<Image[]> {
    const { data } = await axios.get<Image[]>('/api/Image');
    return data;
}   

export async function addImage(Image:Image) {
    await axios.post('/api/Image', Image);
}

export async function deleteImage(Image:Image) {
    await axios.delete(`/api/Image/${Image.id}`);
}