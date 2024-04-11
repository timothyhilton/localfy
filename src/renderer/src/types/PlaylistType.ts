export default interface PlaylistType {
    name: string;
    images: [
        {
            url: string
        }
    ];
    description: string;
    id: string;
    tracks: {
        href: string,
        total: number
    };
    trackNameList: [string]
};