import { TrackContainer } from "@renderer/types/Tracks";
import TrackContainerComponent from "./trackContainer";

export default function TrackContainerList({ trackContainers }: { trackContainers: TrackContainer[] }) {
    return(
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 mx-auto lg:mx-[10%]">
            {trackContainers.map((trackContainer, index) => {
                return(
                    <TrackContainerComponent index={index} key={index} trackContainer={trackContainer}/>
                )
            })}
        </div>
    )
}