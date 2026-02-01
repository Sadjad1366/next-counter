"use client";
import { ChangeEvent, SubmitEventHandler, useEffect, useState } from "react";

export default function CounterPage() {
  type ShowTime = {
    hours: number;
    minutes: number;
    seconds: number;
  };
  const initialTime = {
    hours: 0,
    minutes: 0,
    seconds: 0,
  };
  const [showTime, setShowTime] = useState<ShowTime>(initialTime);
  const [remindedSeconds, setRemindedSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);

  const inputHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    const numericValue = value === "" ? 0 : parseInt(value);

    if (numericValue < 0 || isNaN(numericValue)) return;

    if ((name === "minutes" || name === "seconds") && numericValue > 59) {
      return;
    }

    if (name === "hours" && numericValue > 99) return;

    setShowTime((prev) => ({ ...prev, [name]: numericValue }));
  };

  const resetHandler = () => {
    setIsActive(false);
    setRemindedSeconds(0);
    setShowTime(initialTime);
  };

  const StopHandler = () => {
    setIsActive(false);
  };

  const totalTime =
    showTime.hours * 3600 + showTime.minutes * 60 + showTime.seconds;

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (isActive) {
      timer = setInterval(() => {
        setRemindedSeconds((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, remindedSeconds]);

  const submitHandler: SubmitEventHandler = (event) => {
    event.preventDefault();
    if (remindedSeconds === 0) setRemindedSeconds(totalTime);
    setIsActive(true);
    console.log(remindedSeconds);
  };
  return (
    <div className="space-x-4">
      <form onSubmit={submitHandler}>
        <input
          className="border rounded-lg p-2 m-2 "
          onChange={inputHandler}
          type="text"
          name="hours"
          value={showTime.hours}
          placeholder="00"
        />
        <input
          className="border rounded-lg p-2 m-2 "
          onChange={inputHandler}
          type="text"
          name="minutes"
          value={showTime.minutes}
          placeholder="00"
        />
        <input
          className="border rounded-lg p-2 m-2 "
          onChange={inputHandler}
          type="text"
          name="seconds"
          value={showTime.seconds}
          placeholder="00"
        />
        <button
          type="submit"
          className={
            isActive
              ? `bg-slate-400 text-white rounded-lg p-2 m-2`
              : `bg-green-400 text-white rounded-lg p-2 m-2`
          }
          disabled={isActive}
        >
          Start
        </button>
        <button
          type="button"
          onClick={StopHandler}
          className="bg-red-400 text-white rounded-lg p-2 m-2"
        >
          Stop
        </button>
        <button
          type="button"
          onClick={resetHandler}
          className="bg-cyan-400 text-white rounded-lg p-2 m-2"
        >
          Reset
        </button>
        <div>{remindedSeconds}</div>
      </form>
    </div>
  );
}
