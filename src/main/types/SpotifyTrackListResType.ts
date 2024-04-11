export default interface SpotifyTrackListResType{
    href: string;
    items: [ // which are songs
        {
            track: {
                name: string,
                artists: [
                    {
                        name: string
                    }
                ]
            }
        }
    ]
}