import { FC } from "react"


const Loading: FC = () => {
    return <div className="spinner-grow" role="status">
        <span className="visually-hidden">Loading...</span>
    </div>
}

export default Loading

export const LoadingLight: FC = () => {
    return <div className="spinner-border text-light" role="status">
        <span className="visually-hidden">Loading...</span>
    </div>
}