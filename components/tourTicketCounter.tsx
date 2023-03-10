import { FC } from "react"
import TicketCounterEvent from "@/components/ticketCounterEvent"

// @ts-ignore
const TourTicketCounter: FC = ({ tourDetails }) => {

    return <>
        <div
            className="card m-3 p-3"
        >
            <h3>{tourDetails.tourSymbol}</h3>
            <h4>{tourDetails.tourName}</h4>
            <hr />
            {tourDetails.tourEvents
                // @ts-ignore
                .map(tourEvent => <TicketCounterEvent
                    // @ts-ignore
                    key={tourEvent.address.toString()}
                    // @ts-ignore
                    eventDetails={tourEvent}
                />)}
        </div>

    </>
}

export default TourTicketCounter