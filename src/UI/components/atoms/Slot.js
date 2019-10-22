import React from "react";
import 'styled-components/macro';
import { pixel_emboss } from '../../themes';

const Slot = ({ slot }) => {
    return (
        <div css={ pixel_emboss }>{slot}</div>
    );
}

export default Slot;