import { useInterval } from "usehooks-ts";

import { useState } from "react";

export default function useStopwatch({
  autoStart,
  offsetTimestamp,
}: {
  autoStart?: boolean;
  offsetTimestamp?: number;
}) {
  const [passedSeconds, setPassedSeconds] = useState(getSecondsFromExpiry(offsetTimestamp, true) || 0);
  const [prevTime, setPrevTime] = useState(new Date());
  const [seconds, setSeconds] = useState(passedSeconds + getSecondsFromPrevTime(prevTime || 0, true));
  const [isRunning, setIsRunning] = useState(autoStart);

  useInterval(
    () => {
      setSeconds(passedSeconds + getSecondsFromPrevTime(prevTime, true));
    },
    isRunning ? 1000 : null,
  );

  function start() {
    const newPrevTime = new Date();
    setPrevTime(newPrevTime);
    setIsRunning(true);
    setSeconds(passedSeconds + getSecondsFromPrevTime(newPrevTime, true));
  }

  function pause() {
    setPassedSeconds(seconds);
    setIsRunning(false);
  }

  function reset(offset = 0, newAutoStart = true) {
    const newPassedSeconds = getSecondsFromExpiry(offset, true) || 0;
    const newPrevTime = new Date();
    setPrevTime(newPrevTime);
    setPassedSeconds(newPassedSeconds);
    setIsRunning(newAutoStart);
    setSeconds(newPassedSeconds + getSecondsFromPrevTime(newPrevTime, true));
  }

  return {
    ...getTimeFromSeconds(seconds),
    start,
    pause,
    reset,
    isRunning,
  };
}

function getTimeFromSeconds(secs: number) {
  const totalSeconds = Math.ceil(secs);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  return {
    seconds,
    minutes,
    hours,
    days,
  };
}

function getSecondsFromExpiry(expiry: number = 0, shouldRound: boolean) {
  if (!expiry) return 0;
  const now = new Date().getTime();
  const milliSecondsDistance = now - expiry;
  if (milliSecondsDistance > 0) {
    const val = milliSecondsDistance / 1000;
    return shouldRound ? Math.round(val) : val;
  }
  return 0;
}

function getSecondsFromPrevTime(prevTime: Date, shouldRound: boolean) {
  const now = new Date().getTime();
  const milliSecondsDistance = now - prevTime.getTime();
  if (milliSecondsDistance > 0) {
    const val = milliSecondsDistance / 1000;
    return shouldRound ? Math.round(val) : val;
  }
  return 0;
}
