import { useEffect, useState } from 'react';

export default function ProgressBar({timer}) {
    const [remainingTime, setRemainingTime] = useState(timer);

    useEffect(() => {
        const interval = setInterval((prevState) => { 
        console.log('INTERVAL');
        setRemainingTime(prevState => prevState - 10);
        }, 10);

        return () => { clearInterval(interval) };
    }, []);

    return (
        <progress value={remainingTime} max={timer} />
    );
}