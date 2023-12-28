export interface Media {
    name: string
    url: string
    cover: string
    artist: string
    type: MediaType
    id: number
    kind:Kind
}

export enum MediaType {
    MusicType = 1,
    ImageType = 2,
    VideoType = 3,
}

export enum Kind {
    programming,
    administrative_working,
    manual_laboring,
    drawing,
    exersising,
    cooking,
    sleeping,
    relaxing,
    eating
}