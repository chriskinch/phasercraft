import React from "react"
import Button from "../atoms/Button"
import Navigation from "../molecules/Navigation"
import Title from "../atoms/Title"
import "styled-components/macro"

const Header = ({config, toggleUi}) => {
    const { navigation, title, close } = config || {};
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
            <>
                <Title text={ title } />
                <div css={`
                    float: right;
                `}>
                    {close &&
                        <Button text="X" onClick={ () => toggleUi() } type="square" />
                    }
                </div>
            </>
        )
    }
}

export default Header;