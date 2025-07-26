import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loadGame, selectCharacter, setSaveSlot, switchUi } from "@store/gameReducer";
import Button from "@components/Button";
import Dialog from "@components/Dialog";
import type { RootState } from "@store";

interface SaveProps {
  load?: boolean;
}

const getSaveGames = (slots: string[]): (RootState | null)[] => {
  return slots.map(slot => {
    const saved = localStorage.getItem(slot);
    return saved ? JSON.parse(saved) : null;
  });
};

const Save: React.FC<SaveProps> = ({ load = false }) => {
  const dispatch = useDispatch();
  const slots = ["slot_a", "slot_b", "slot_c"];
  const [saveGames, setSaveGames] = useState<(RootState | null)[]>(getSaveGames(slots));
  const [showDialog, setShowDialog] = useState(false);
  const [currentSaveSlot, setCurrentSaveSlot] = useState<string | false>(false);
  const otherGames = load ? saveGames.filter(save => save !== null) : saveGames;

  const delete_dialog = showDialog ? (
    <Dialog>
      <div>
        <p>Are you sure you want to delete this save game?</p>
        <Button text="Confirm" onClick={() => {
          if (currentSaveSlot) {
            localStorage.removeItem(currentSaveSlot);
            setSaveGames(getSaveGames(slots));
            setShowDialog(false);
          }
        }} />
        <Button text="Cancel" onClick={() => setShowDialog(false)} />
        <style jsx>{`
          div {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background-color: rgba(0, 0, 0, 0.9);
            padding: 10% 35%;
            color: white;
            font-size: 1.25rem;
            font-weight: bold;
          }
        `}</style>
      </div>
    </Dialog>
  ) : null;

  return (
    <>
      <ol>
        {otherGames.map((save, i) => {
          const { game: { saveSlot, character, coins, wave } = {} } = save || {};
          return (
            <li key={i}>
              <h2>{"Slot " + Number(i + 1)}</h2>
              {save &&
                <>
                  <img 
                    src={`ui/player/${character.toLowerCase()}.gif`}
                    alt={`Load this save game.`} 
                  />
                  <p>Wave: {wave}</p>
                  <p>Gold: {coins}</p>
                </>
              }
              <div>
                {save ?
                  <Button text={"Load"} onClick={() => {
                    dispatch(loadGame(save));
                    dispatch(selectCharacter(character));
                  }} /> :
                  <Button text={"Select"} onClick={() => {
                    dispatch(setSaveSlot(slots[i]));
                    dispatch(switchUi("select"));
                  }} />
                }
                <Button text="Delete" disabled={save ? false : true} onClick={() => {
                  setCurrentSaveSlot(typeof saveSlot === "string" ? saveSlot : false);
                  setShowDialog(true);
                }} />
              </div>
            </li>
          );
        })}
      </ol>
      <style jsx>{`
        ol {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        
        li {
          flex: 1;
          padding: 0.5rem;
          text-align: center;
        }
        
        li:first-child {
          padding-left: 0;
        }
        
        li:last-child {
          padding-right: 0;
        }
        
        h2 {
          text-transform: capitalize;
        }
        
        img {
          padding-bottom: 0.5rem;
        }
        
        p {
          margin: 0;
        }
        
        p:last-of-type {
          margin-bottom: 0.5rem;
        }
        
        li > div {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
        }
      `}</style>
      {delete_dialog}
    </>
  );
};

export default Save;