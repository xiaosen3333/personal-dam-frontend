import axios from 'axios';
import { Music } from '../types/Music';

// axios.defaults.baseURL = 'http://localhost:3001';
export async function getMusics(): Promise<Music[]> {
    const { data } = await axios.get<Music[]>('/api/musics');
    return data;
}   

export async function addMusic(music:Music) {
    await axios.post('/api/musics', music);
}

export async function deleteMusic(music:Music) {
    await axios.delete(`/api/musics/${music.id}`);
}
