import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { switchUi } from "@store/gameReducer";
import { pixelBackgroundVars } from "../../themes";
import theme from "../../themes.module.css";
import type { RootState } from "@store";

const Navigation = () => {
    const dispatch = useDispatch();
    const menu = useSelector((state: RootState) => state.game.menu);
    // Max inventory space is 12
    const items = ["Character", "Equipment", "Armory", "Arcanum"];

    return (
        <nav>
            {items &&
                items.map((item, i) => {
                    const active = menu === item.toLowerCase();
                    return (
                        <button
                            key={i}
                            className={theme.pixelBackground}
                            style={{
                                ...pixelBackgroundVars({
                                    bg_color: active ? "#44bff7" : "#ffa53d",
                                }),
                                color: "white",
                                float: "left",
                                fontSize: "2em",
                                marginRight: "0.5em",
                            }}
                            onClick={() => dispatch(switchUi(item.toLowerCase()))}
                        >
                            {item}
                        </button>
                    );
                })}
        </nav>
    );
};

const mapStateToProps = (state: RootState) => {
    const { menu } = state.game;
    return { menu };
};

export default Navigation;
