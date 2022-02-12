import {useTimer} from "react-timer-hook";

export function MyTimer({add, expireFunction, aStart, newTime}: any) {
    let exTS = new Date();
    exTS.setSeconds(exTS.getSeconds() + add)
    const {
        start,
        pause,
        restart,
        seconds,
        minutes,
    } = useTimer({expiryTimestamp: exTS, onExpire: expireFunction, autoStart: aStart});

    return (
        <div style={{textAlign: 'center'}}>
            <div>
                <span>{minutes}</span>:<span>{seconds}</span>
            </div>
            <button onClick={start} id="start"/>
            <button onClick={pause} id="pause"/>
            <button onClick={() => {
                console.log("ADD: " + add);
                const time = new Date();
                time.setSeconds(time.getSeconds() + newTime);
                restart(time)
            }} id="restart"/>
        </div>
    );
}