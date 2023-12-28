import { Media , MediaType,Kind } from "./Media";

export interface Video extends Media {
    duration: number
}

const video0 = process.env.PUBLIC_URL +  "/videos/demo1.mp4";
const video1 = process.env.PUBLIC_URL +  "/videos/demo2.mp4";
const video2 = process.env.PUBLIC_URL +  "/videos/demo3.mp4";

export const videos: Video[] = [
    {
        id: 0,
        name: "demo1",
        url: video0,
        type: MediaType.VideoType,
        cover: '.',
        artist: "demo",
        duration: 100,
        kind: Kind.administrative_working,
    },
    {
        id: 1,
        name: "demo2",
        url: video1,
        type: MediaType.VideoType,
        cover: '.',
        artist: "demo",
        duration: 100,
        kind: Kind.administrative_working,
    },
    {
        id: 2,
        name: "demo3",
        url: video2,
        type: MediaType.VideoType,
        cover: '.',
        artist: "demo",
        duration: 100,
        kind: Kind.administrative_working,
    }
]