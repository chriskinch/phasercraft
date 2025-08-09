import React from "react";
import Button from "@components/Button";
import Navigation from "@components/Navigation";
import Title from "@components/Title";

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
        <div className="close-button">
          <Button text="X" onClick={() => toggleUi()} />
        </div>
        <style jsx>{`
          .close-button {
            float: right;
          }
        `}</style>
      </>            
    );
  } else { 
    return (
      <>
        <Title text={title || ""} />
        <div className="close-button">
          {close &&
            <Button text="X" onClick={() => toggleUi()} />
          }
        </div>
        <style jsx>{`
          .close-button {
            float: right;
          }
        `}</style>
      </>
    );
  }
};

export default Header;