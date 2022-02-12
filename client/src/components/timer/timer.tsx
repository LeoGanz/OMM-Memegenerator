import {useTimer} from "react-timer-hook";

export function MyTimer({expiryTimestamp}: any, onExpire: Function) {
    const {
        seconds,
        minutes,
        isRunning,
        start,
        pause,
        resume,
        restart,
    } = useTimer({expiryTimestamp, onExpire: () => onExpire});

    return (
        <div style={{textAlign: 'center'}}>
            <div>
                <span>{minutes}</span>:<span>{seconds}</span>
            </div>
        </div>
    );
}