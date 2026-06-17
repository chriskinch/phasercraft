import React from "react";
import Button from "@components/Button";
import Navigation from "@components/Navigation";
import Title from "@components/Title";
import styles from "./Header.module.css";

interface HeaderConfig {
    navigation?: boolean;
    title?: string;
    close?: boolean;
}

interface HeaderProps {
    config?: HeaderConfig;
    toggleUi: () => void;
}

const Header: React.FC<HeaderProps> = ({ config, toggleUi }) => {
    const { navigation, title, close } = config || {};

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
                <Title text={title || ""} />
                <div className={styles.closeButton}>
                    {close && <Button text="X" onClick={() => toggleUi()} />}
                </div>
            </>
        );
    }
};

export default Header;
