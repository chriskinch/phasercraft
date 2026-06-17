import React, { useContext } from "react";
import { MenuContext } from "@ui/UI";
import styles from "./Price.module.css";

interface PriceProps {
    cost: number;
}

const Price: React.FC<PriceProps> = ({ cost }) => {
    const menu = useContext(MenuContext);

    const { color, icon, value } =
        menu === "equipment"
            ? {
                  value: Math.round(cost * 0.25),
                  icon: "sell",
                  color: "#a5b4c1",
              }
            : {
                  value: cost,
                  icon: "coin",
                  color: "#ffc34d",
              };

    return (
        <div
            className={styles.priceContainer}
            style={{ "--price-color": color } as React.CSSProperties}
        >
            <img className={styles.priceIcon} src={`./UI/icons/${icon}.gif`} alt="Item cost:" />{" "}
            {value}
        </div>
    );
};

export default Price;
