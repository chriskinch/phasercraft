import React from "react";
import 'styled-components/macro';
import { pixel_background } from '../../themes';

const Title = ({text}) => {
    return (
        <h1 css={`
            ${ pixel_background({ bg_color: "#44bff7" }) }
            color: white;
            float: left;
            margin-right: 1em;
        `}>{ text }</h1>
    );
}

export default Title;