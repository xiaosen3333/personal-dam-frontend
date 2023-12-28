import { Media , MediaType ,Kind } from "./Media";

export interface Music extends Media {
    text: string
}


const imgSrc0 = process.env.PUBLIC_URL +  "/musics/当我在这里/当我在这里.png";
const song0 = process.env.PUBLIC_URL +  "/musics/当我在这里/当我在这里.mp3";
const text0 = process.env.PUBLIC_URL +  "/musics/当我在这里/当我在这里.txt";
const imgSrc1 = process.env.PUBLIC_URL +  "/musics/借我/借我.png";
const song1 = process.env.PUBLIC_URL +  "/musics/借我/借我.mp3";
const text1 = process.env.PUBLIC_URL +  "/musics/借我/借我.txt";
const imgSrc2 = process.env.PUBLIC_URL +  "/musics/穷孩子/穷孩子.png";
const song2 = process.env.PUBLIC_URL +  "/musics/穷孩子/穷孩子.mp3";
const text2 = process.env.PUBLIC_URL +  "/musics/穷孩子/穷孩子.txt";
const imgSrc3 = process.env.PUBLIC_URL +  "/musics/秋蝉/秋蝉.png";
const song3 = process.env.PUBLIC_URL +  "/musics/秋蝉/秋蝉.mp3";
const text3 = process.env.PUBLIC_URL +  "/musics/秋蝉/秋蝉.txt";
const imgSrc4 = process.env.PUBLIC_URL +  "/musics/听吧/听吧.png";
const song4 = process.env.PUBLIC_URL +  "/musics/听吧/听吧.mp3";
const text4 = process.env.PUBLIC_URL +  "/musics/听吧/听吧.txt";

export const musics: Music[] = [
  {
    id: 0,
    name: "当我在这里",
    artist: "姚谦",
    url: song0,
    cover: imgSrc0,
    text: text0,
    type: MediaType.MusicType,
    kind: Kind.administrative_working,
  },
  {
    id:1,
    name: "借我",
    artist: "锦屏/谢春花",
    url: song1,
    cover: imgSrc1,
    text: text1,
    type: MediaType.MusicType,
    kind: Kind.administrative_working,
  },
  {
    id:2,
    name: "穷孩子",
    artist: "冯笑/古世杰/贾伟",
    url: song2,
    cover: imgSrc2,
    text: text2,
    type: MediaType.MusicType,
    kind: Kind.administrative_working,
  },
  {
    id:3,
    name: "秋蝉",
    artist: "李子恒",
    url: song3,
    cover: imgSrc3,
    text: text3,
    type: MediaType.MusicType,
    kind: Kind.administrative_working,
  },
  {
    id:4,
    name: "听吧",
    artist: "王海涛",
    url: song4,
    cover: imgSrc4,
    text: text4,
    type: MediaType.MusicType,
    kind: Kind.administrative_working,
  }
];