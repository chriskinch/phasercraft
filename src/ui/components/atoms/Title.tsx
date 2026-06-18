import React from "react";
import { pixelBackgroundVars } from "@ui/themes";
import theme from "@ui/themes.module.css";

interface TitleProps {
    text: string;
}

const Title: React.FC<TitleProps> = ({ text }) => {
    return (
        <h1
            className={theme.pixelBackground}
            style={{
                ...pixelBackgroundVars({ bg_color: "#44bff7" }),
                color: "white",
                float: "left",
                marginRight: "1em",
            }}
        >
            {text}
        </h1>
    );
};

export default Title;
