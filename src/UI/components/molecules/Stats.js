import React from "react";
import Stat from "@atoms/Stat";
import 'styled-components/macro';

const Stats = (props) => {
    const { size = 1, info, children: { health, resource, ...stats }} = props;
    return (
        <dl css={`
            clear: both;
            overflow:hidden;
            font-size: ${size}em;
            margin: 0;
        `}>
            { Object.entries(stats).map((stat, i) => <Stat key = {i} label={ stat[0] } value={ stat[1] } info={info} /> ) }
        </dl>
    )
}

export default Stats;