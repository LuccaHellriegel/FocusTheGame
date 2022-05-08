import {FC, useEffect, useState} from "react";
import "./App.css";
import {FocusEntryState, defaultEntry, FocusEntry} from "./FocusEntry";

const EphemeralRambling: FC = () => {
  return (
    <div className="EphemeralRamblingContainer">
      <h1>Ephemeral Rambling</h1>
      <textarea className="EphemeralRamblingTextArea"></textarea>
    </div>
  );
};

const STORAGE_KEY = "FOCUS_THE_GAME_STORAGE";

const FeelingWords: FC = () => {
  return (
    <div>
      How does it feel?
      <input></input>
    </div>
  );
};

const RelationshipBuilding: FC = () => {
  return (
    <div>
      Relationship Building:
      <input></input>
    </div>
  );
};

const Debrief: FC = () => {
  return (
    <>
      <div>
        Have you thanked it? <input type="checkbox"></input>
      </div>
      <div>
        Have you taken it in? <input type="checkbox"></input>
      </div>
      <div>
        Have you said goodbye? <input type="checkbox"></input>
      </div>
    </>
  );
};

const GendlinFocusing: FC = () => {
  return (
    <div className="GendlinFocusingContainer">
      <h1>Gendlin Focusing</h1>
      <div>
        What is happening? <input></input>
      </div>
      <div>Where do you feel it?</div>
      <FeelingWords></FeelingWords>

      <RelationshipBuilding></RelationshipBuilding>
      <Debrief></Debrief>
    </div>
  );
};

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
      <EphemeralRambling />
      <div className="FocusEntries">
        <h1>Focus Entries</h1>
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
      <GendlinFocusing></GendlinFocusing>
    </div>
  );
};

export default App;
