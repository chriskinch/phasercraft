import React from "react";
import { pixel_background } from '../../themes';

const Title = ({text}) => {
    return (
        <h1 className="title">
            { text }
            
            <style jsx>{`
                .title {
                    ${ pixel_background({ bg_color: "#44bff7" }) }
                    color: white;
                    float: left;
                    margin-right: 1em;
                }
            `}</style>
        </h1>
    );
}

export default Title;