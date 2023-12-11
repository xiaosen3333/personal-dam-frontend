export interface Media {
    name: string
    url: string
    cover: string
    artist: string
    type: MediaType
    id: number
    kind:Kind1|Kind2
}


export enum MediaType {
    MusicType = 1,
    ImageType = 2,
    VideoType = 3,
}

export enum Kind1 {
    programming,
    administrative_working,
    manual_laboring,
    drawing
}
export enum Kind2 {
    exersising,
    cooking,
    sleeping,
    relaxing,
    eating
}