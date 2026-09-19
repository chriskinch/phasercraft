import React from "react";
import Button from "@components/Button";
import Navigation from "@components/Navigation";
import Title from "@components/Title";
import styles from "./Header.module.css";

interface HeaderConfig {
    navigation?: boolean;
    title?: string;
    // Overrides the default blue title colour (the Merchant uses grey).
    titleColor?: string;
    // Optional controls rendered in the header, to the right of the title (e.g.
    // the Merchant's Buy/Sell toggle). Reads its own state from the store.
    headerControls?: React.FC;
    close?: boolean;
}

interface HeaderProps {
    config?: HeaderConfig;
    toggleUi: () => void;
}

const Header: React.FC<HeaderProps> = ({ config, toggleUi }) => {
    const { navigation, title, titleColor, headerControls: HeaderControls, close } = config || {};

    if (navigation) {
        return (
            <>
                <Navigation />
                <div className={styles.closeButton}>
                    <Button text="X" onClick={() => toggleUi()} />
                </div>
            </>
        );
    } else {
        return (
            <>
                <Title text={title || ""} color={titleColor} />
                {HeaderControls && (
                    <div className={styles.headerControls}>
                        <HeaderControls />
                    </div>
                )}
                <div className={styles.closeButton}>
                    {close && <Button text="X" onClick={() => toggleUi()} />}
                </div>
            </>
        );
    }
};

export default Header;
