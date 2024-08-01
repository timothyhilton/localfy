import { Card, CardHeader, CardTitle } from "../ui/card"
import StatusButton from "./statusButton"
import { DownloadMenu } from "@renderer/components/download-menu"
import { TrackContainer } from "@renderer/types/Tracks"

type TrackContainerPropsArgs = {
    index: number
    trackContainer: TrackContainer
}

export default function TrackContainerComponent({ index, trackContainer }: TrackContainerPropsArgs){

    return(
        <Card className="h-[100px] w-[20rem]] bg-slate-100 dark:bg-slate-950" tabIndex={index} key={index}>
            <CardHeader>
                <div className="flex flex-row">
                    
                    {trackContainer.imageUrl ?
                        <img src={trackContainer.imageUrl} className="w-[4rem] h-[4rem] mt-[-0.4rem] ml-[-0.4rem] mr-4"></img>
                        :
                        <img src="../assets/nocover.png" className="w-[4rem] h-[4rem] mt-[-0.4rem] ml-[-0.4rem] mr-4"></img>
                    }
                    
                    <div className="flex flex-col truncate ml-1">
                        <CardTitle className="text-lg">
                            {trackContainer.name}
                        </CardTitle>
                        <StatusButton />
                    </div>
                    <DownloadMenu trackContainer={trackContainer} />
                </div>
            </CardHeader>
        </Card>
    )
}