import React, { useMemo, useState, useEffect }from "react";
import 'styled-components/macro';

const Spell = useMemo(() => ({cooldown, disabled, primed, spell, onClick}) => {
    // let timer = null;
    // const [counter, setCounter] = useState(() => cooldown);

    // const memoizedValue = useMemo(() => function() {
    //     console.log("MEMO!")
    // }, [cooldown])

    console.log("SPELL")

    // const countDown = () => {
    //     console.log("COUNT: ", cooldown)
    // }

    // // Similar to componentDidMount and componentDidUpdate:
    // useEffect(() => {
    //     counter && console.log("COUNTER: ", counter)
    //     timer = counter && setInterval(() => countDown(), 1000);
    //     // console.log("COOLDOWN: ", cooldown, countDown)
    // }, []);

    const filter = primed ? "brightness(200%) saturate(50%)" : disabled ? "brightness(30%) saturate(0%)" : "none";
    return (
        <button 
            disabled={disabled}
            css={`
                border: none;    
                background: url("./UI/spells/${spell}.png") ;
                width: 44px;
                height: 44px;
                background-size: cover;
                image-rendering: pixelated;
                position: relative;
                filter: ${filter};
                color: white;
                font-size: 2em;
                text-align: center;
                text-shadow: 1px 1px 3px black;
                text-indent: -4px;
                &:focus {
                    outline: none;
                }
            `} 
            onClick={onClick}
        >{cooldown / 1000}</button>
    );
}, [cooldown]);

export default Spell;