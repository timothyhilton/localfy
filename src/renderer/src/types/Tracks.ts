export default interface Track {
    name: string
    artists: string[]
    album: string
    id: string
    coverArtUrl: string
}

export interface TrackContainer {
    name: string
    id: string
    type: "playlist" | "album"
    imageUrl: string
    trackListHref: string
    trackCount: number
    tracks: Track[] | null
}

