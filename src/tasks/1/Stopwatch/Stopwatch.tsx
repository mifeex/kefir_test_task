import React, {VFC, ReactElement} from "react";

interface IStopwatchProps {}

interface IStopwatchState {
    status: boolean;
    runningTime: number;
}

const Stopwatch:VFC = ({}) => {
    const timer: any = React.useRef();
    const [status, setStatus] = React.useState(false);
    const [runningTime, setRunningTime] = React.useState(0);

    const getUnits = (time: number) => {
        const seconds = time / 1000;

        const min = Math.floor(seconds / 60).toString();
        const sec = Math.floor(seconds % 60).toString();
        const msec = (seconds % 1).toFixed(3).substring(2);

        return `${min}:${sec}:${msec}`;
    }

    const handleClick = () => {
            if (status) {
                clearInterval(timer.current);
            } else {
                const startTime = Date.now() - runningTime;
                timer.current = setInterval(() => {
                    setRunningTime(Date.now() - startTime);
                });
            }
            return setStatus(!status);
    };

    const handleReset = () => {
        clearInterval(timer.current);
        setRunningTime(0);
        setStatus(false);
    };

    const handleLap = () => {
        console.log(getUnits(runningTime));
    };

    React.useEffect(() => {
        return () => clearInterval(timer.current);
    }, [])

     return (
            <div>
                <p>{getUnits(runningTime)}</p>
                <button onClick={handleClick}>
                    {status ? "Stop" : "Start"}
                </button>
                <button onClick={handleReset}>Reset</button>
                <button onClick={handleLap}>Lap</button>
            </div>
        );
}

export default Stopwatch;
