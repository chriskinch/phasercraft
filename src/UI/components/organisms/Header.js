import React from "react"
import Button from "../atoms/Button"
import Navigation from "../molecules/Navigation"
import Title from "../atoms/Title"
import "styled-components/macro"

const Header = ({config, menu, toggleUi}) => {
    const { navigation, title } = config;
    if(navigation){
        return (
            <>
                <Navigation />
                <div css={`
                    float: right;
                `}>
                    <Button text="X" onClick={ () => toggleUi() } type="square" />
                </div>
            </>            
        );
    }else{ 
        return (
            <Title text={ title } /> 
        )
    }
}

export default Header;