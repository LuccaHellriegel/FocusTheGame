import {FC, useEffect, useState} from "react";
import "./App.css";

interface FocusEntryState {
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

const FocusEntry: FC<FocusEntryProps> = ({
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

const defaultEntry = (time: Time = defaultTime()): FocusEntryState => ({
  chunkDesc: "",
  time,
});

const STORAGE_KEY = "FOCUS_THE_GAME_STORAGE";

const App = () => {
  const [entries, setEntries] = useState<FocusEntryState[]>([]);

  useEffect(() => {
    let str = localStorage.getItem(STORAGE_KEY);
    //just feel like wasting computation today for less lines of code lol
    if (!str) str = JSON.stringify([defaultEntry()]);
    setEntries(JSON.parse(str));
  }, []);

  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }
  }, [entries]);

  const addEntry = () => setEntries([...entries, defaultEntry()]);

  return (
    <div className="AppContainer">
      {entries.map((entry, index) => (
        <FocusEntry
          key={index}
          {...entry}
          addEntry={addEntry}
          setEntry={(newEntry) =>
            setEntries((entries) => [
              ...entries.slice(0, index),
              newEntry(entries[index]),
              ...entries.slice(index + 1),
            ])
          }
          removeEntry={() => {
            setEntries((entries) => [
              ...entries.slice(0, index),
              ...entries.slice(index + 1),
            ]);
          }}
        />
      ))}
      <button className="AddEntryButton" onClick={addEntry}>
        +
      </button>
    </div>
  );
};

export default App;
