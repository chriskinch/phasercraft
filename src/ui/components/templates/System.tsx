import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { switchUi, toggleUi } from "@store/gameReducer";
import Button from "@components/Button";
import Dialog from "@components/Dialog";
import { dialog_overlay } from "@ui/themes";
import type { RootState } from "@store";

interface SystemProps {
  state: any; // TODO: Define proper state type
}

const System: React.FC<SystemProps> = ({ state }) => {
  const dispatch = useDispatch();
  const saveSlot = useSelector((state: RootState) => state.game.saveSlot);
  const [showDialog, setShowDialog] = useState(false);

  const save_dialog = showDialog ? (
    <Dialog>
      <div className="dialog-overlay">
        <p>Overwrite your existing save game?</p>
        <Button text="Yes" onClick={() => {
          if (saveSlot) {
            localStorage.setItem(saveSlot, JSON.stringify(state));
          }
          dispatch(toggleUi("system"));
          setShowDialog(false);
        }} />
        <Button text="Cancel" onClick={() => setShowDialog(false)} />
        <style jsx>{`
          .dialog-overlay {
            ${dialog_overlay()}
          }
        `}</style>
      </div>
    </Dialog>
  ) : null;

  return (
    <>
      <Button text="Save" onClick={() => setShowDialog(true)} />
      {/* <Button text="Load" onClick={e => {
          console.log("LOAD")
          dispatch(switchUi("load"));
      }} /> */}
      <Button text="Quit" onClick={() => {
        window.location.reload();
      }} />
      {save_dialog}
    </>
  );
};

export default System;