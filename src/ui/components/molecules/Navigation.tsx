import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { switchUi } from "@store/gameReducer";
import { pixel_background } from '../../themes';
import type { RootState } from "@store";

const Navigation = () => {
  const dispatch = useDispatch();
  const menu = useSelector((state: RootState) => state.game.menu);
  // Max inventory space is 12
  const items = ["Character", "Equipment", "Armory", "Arcanum"];

  return (
    <nav className="nav-container">
      {items &&
        items.map((item, i) => (
          <React.Fragment key={i}>
            <button 
              className={`nav-button ${menu === item.toLowerCase() ? 'active' : ''}`}
              onClick={() => dispatch(switchUi(item.toLowerCase()))}
            >
              {item}
            </button>
            <style jsx>{`
              .nav-button {
                ${pixel_background({bg_color: (menu === item.toLowerCase()) ? "#44bff7" : "#ffa53d"})}
                color: white;
                float: left;
                font-size: 2em;
                margin-right: 0.5em;
              }
            `}</style>
          </React.Fragment>
        ))
      }
    </nav>
  );
};

const mapStateToProps = (state: RootState) => {
  const { menu } = state.game;
  return { menu };
};

export default Navigation