import React from "react";
import { connect } from "react-redux";
import CharacterCard from "./CharacterCard";

import { MENU_HEIGHT, MENU_WIDTH } from "../config";

function UI({ showUi }) {

  console.log(showUi)

  return (
    <div>
      {showUi &&
        <div
          id="character-select"
          style={{
            position: "absolute",
            boxSizing: "border-box",
            width: MENU_WIDTH,
            height: MENU_HEIGHT,
            top: 0,
            margin: "2em",
            padding: "2em",
            backgroundColor: "#fcfcfc"
          }}
        >
          <h1 style={{ marginTop: 0 }}>Character Select</h1>
          <ol 
            className="character-list"
            style={{
              display: "flex",
              listStyle: "none",
              margin: 0,
              padding: 0
            }}>
            <CharacterCard type="Cleric" />
            <CharacterCard type="Mage" />
            <CharacterCard type="Occultist" />
            <CharacterCard type="Ranger" />
            <CharacterCard type="Warrior" />
          </ol>
        </div>
      }
    </div>
  );
}

const mapStateToProps = ({ showUi }) => ({
  showUi
});

export default connect(mapStateToProps)(UI);
