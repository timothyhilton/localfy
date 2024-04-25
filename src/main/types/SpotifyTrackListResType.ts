export default interface SpotifyTrackListResType{
    href: string;
    items: [ // which are individual songs
        {
            track: {
                name: string,
                artists: [
                    {
                        name: string
                    }
                ],
                album: {
                    name: string,
                    images: [
                        {
                            url: string
                        }
                    ]
                },
                id: string
            }
        }
    ]
}