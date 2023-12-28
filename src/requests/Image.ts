import axios from 'axios';
import { Image } from '../types/Image';

export async function getImages(): Promise<Image[]> {
    const { data } = await axios.get<Image[]>('/api/Image');
    return data;
}   

export async function addImage(formData: FormData) {
    await axios.post('/api/image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}


export async function deleteImage({ id }:{id:number}) {
    await axios.delete(`/api/Image/${id}`);
}