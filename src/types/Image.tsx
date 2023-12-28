import { Media , MediaType,Kind } from "./Media";

export interface Image extends Media {

}

const image0 = process.env.PUBLIC_URL +  "/images/demo1.jpg";
const image1 = process.env.PUBLIC_URL +  "/images/demo2.jpg";
const image2 = process.env.PUBLIC_URL +  "/images/demo3.jpg";

export const images: Image[] = [
    {
        id: 0,
        name: "demo1",
        url: image0,
        type: MediaType.ImageType,
        cover: image0,
        artist: "demo",
        kind: Kind.administrative_working,
    },
    {
        id: 1,
        name: "demo2",
        url: image1,
        type: MediaType.ImageType,
        cover: image1,
        artist: "demo",
        kind: Kind.administrative_working,
    },
    {
        id: 2,
        name: "demo3",
        url: image2,
        type: MediaType.ImageType,
        cover: image2,
        artist: "demo",
        kind: Kind.administrative_working,
    }
]