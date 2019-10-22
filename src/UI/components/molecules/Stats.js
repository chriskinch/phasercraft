import React from "react";
import Stat from "../atoms/Stat";
import 'styled-components/macro';

const Stats = (props) => {
    const { health, resource, ...stats } = props.children;
    return (
        <dl css="overflow:hidden;">
            { Object.entries(stats).map((stat, i) => <Stat key = {i} label={ stat[0] } value={ stat[1] } /> ) }
        </dl>
    )
}

export default Stats;