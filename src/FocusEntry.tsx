import {FC, useState} from "react";

export interface FocusEntryState {
  chunkDesc: string;
  time: Time;
}
interface FocusEntryProps extends FocusEntryState {
  setEntry: (f: (entry: FocusEntryState) => FocusEntryState) => void;
  removeEntry: () => void;
  addEntry: () => void;
}
const defaultTime = () => ({minutes: 5, seconds: 0});
interface Time {
  minutes: number;
  seconds: number;
}
export const FocusEntry: FC<FocusEntryProps> = ({
  chunkDesc,
  time,
  setEntry,
  removeEntry,
  addEntry,
}) => {
  const [runningTimer, setRunningTimer] = useState<null | number>(null);

  const removeSecond = (timer: number) => {
    setEntry((entry) => {
      const time = entry.time;
      if (time.seconds === 0) {
        if (time.minutes === 0) {
          clearInterval(timer);
          return entry;
        } else {
          return {...entry, time: {minutes: time.minutes - 1, seconds: 59}};
        }
      } else {
        return {
          ...entry,
          time: {minutes: time.minutes, seconds: time.seconds - 1},
        };
      }
    });
  };

  const start = () => {
    var timer: number;
    timer = setInterval(() => removeSecond(timer), 1000);
    setRunningTimer(timer);
  };

  const stop = () => {
    if (runningTimer) clearInterval(runningTimer);
    setRunningTimer(null);
  };

  return (
    <div
      className="FocusEntryContainer"
      style={
        time.minutes == 0 && time.seconds == 0
          ? {backgroundColor: "greenyellow"}
          : {}
      }
    >
      <div className="FocusEntryChunkText">Small Chunk: </div>
      <input
        className="FocusEntryText"
        value={chunkDesc}
        onChange={(event) => {
          const value = event.currentTarget.value;
          setEntry((entry) => ({
            ...entry,
            chunkDesc: value,
          }));
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            addEntry();
          }
          if (
            (event.key === "Backspace" || event.key === "Delete") &&
            chunkDesc === ""
          ) {
            removeEntry();
          }
        }}
      ></input>
      <button
        className="FocusEntryTimer"
        onClick={() => {
          if (!runningTimer) {
            start();
          } else {
            stop();
          }
        }}
        onDoubleClick={() => {
          stop();
          setEntry((entry) => ({...entry, time: defaultTime()}));
        }}
      >
        {time.minutes + ":" + time.seconds}
      </button>

      <button onClick={removeEntry}>X</button>
    </div>
  );
};
export const defaultEntry = (time: Time = defaultTime()): FocusEntryState => ({
  chunkDesc: "",
  time,
});
