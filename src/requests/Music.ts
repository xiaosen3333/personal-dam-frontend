import axios from 'axios';
import { Music } from '../types/Music';

// axios.defaults.baseURL = 'http://localhost:3001';
export async function getMusics(kind?: string): Promise<Music[]> {
    const url = kind ? `/api/musics?kind=${kind}` : '/api/musics';
    const { data } = await axios.get<Music[]>(url);
    return data;
}

export async function addMusic(formData: FormData) {
    await axios.post('/api/musics', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
}

export async function deleteMusic({ id }: { id: number }) {
    await axios.delete(`/api/musics/${id}`);
}