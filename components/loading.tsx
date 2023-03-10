import { FC } from "react"


const Loading: FC = () => {
    return <div className="spinner-grow m-3" role="status">
        <span className="visually-hidden">Loading...</span>
    </div>
}

export default Loading

export const LoadingLight: FC = () => {
    return <div className="spinner-border text-light m-3" role="status">
        <span className="visually-hidden">Loading...</span>
    </div>
}