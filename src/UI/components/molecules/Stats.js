import React from "react";
import Stat from "../atoms/Stat";
import 'styled-components/macro';

const Stats = (props) => {
    const { size = 1, children: { health, resource, ...stats } } = props;
    return (
        <dl css={`
            overflow:hidden;
            font-size: ${size}em;
        `}>
            { Object.entries(stats).map((stat, i) => <Stat key = {i} label={ stat[0] } value={ stat[1] } /> ) }
        </dl>
    )
}

export default Stats;