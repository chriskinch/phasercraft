import React from "react";
import { pixelBackgroundVars } from "@ui/themes";
import theme from "@ui/themes.module.css";

interface TitleProps {
    text: string;
    // Overrides the default blue title background (e.g. the Merchant uses grey).
    color?: string;
}

const Title: React.FC<TitleProps> = ({ text, color = "#44bff7" }) => {
    return (
        <h1
            className={theme.pixelBackground}
            style={{
                ...pixelBackgroundVars({ bg_color: color }),
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
