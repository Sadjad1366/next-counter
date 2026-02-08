"use client";
import { ChangeEvent, SubmitEventHandler, useEffect, useState } from "react";
import LiquidGauge from "react-liquid-gauge";

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

  const percent = totalTime > 0 ? (remindedSeconds / totalTime) * 100 : 0;

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
  };

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-100 flex flex-col items-center justify-center p-8 space-y-6 mx-auto">
      <div className="[&_path]:transition-all [&_path]:duration-1000 [&_path]:ease-linear">
        <LiquidGauge
          value={percent}
          width={200}
          height={200}
          waveAnimation={isActive ? true : false}
          waveAmplitude={isActive ? 2 : 2.5}
          waveFrequency={isActive ? 5 : 1}
          gradient
          circleColor="#3b82f6"
          waveColor="#60a5fa"
          textSize={1}
          textRenderer={() => (
            <tspan
              className="fill-slate-700 font-mono font-bold"
              fontSize="24px"
              dy="0.3em"
            >
              {formatTime(remindedSeconds)}
            </tspan>
          )}
        />
      </div>

      <form
        onSubmit={submitHandler}
        className="flex flex-col items-center space-y-4"
      >
        <div className="flex space-x-2">
          <input
            className="w-20 border-2 border-slate-200 rounded-lg p-3 text-center"
            onChange={inputHandler}
            type="text"
            name="hours"
            value={showTime.hours}
            placeholder="HH"
          />
          <span className="text-2xl self-center">:</span>
          <input
            className="w-20 border-2 border-slate-200 rounded-lg p-3 text-center"
            onChange={inputHandler}
            type="text"
            name="minutes"
            value={showTime.minutes}
            placeholder="MM"
          />
          <span className="text-2xl self-center">:</span>
          <input
            className="w-20 border-2 border-slate-200 rounded-lg p-3 text-center"
            onChange={inputHandler}
            type="text"
            name="seconds"
            value={showTime.seconds}
            placeholder="SS"
          />
        </div>

        <div className="flex space-x-2">
          <button
            type="submit"
            className={`px-6 py-2 rounded-lg font-semibold text-white transition-colors ${
              isActive
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
            disabled={isActive}
          >
            {remindedSeconds > 0 && !isActive ? "Resume" : "Start"}
          </button>

          <button
            type="button"
            onClick={StopHandler}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            Stop
          </button>

          <button
            type="button"
            onClick={resetHandler}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
