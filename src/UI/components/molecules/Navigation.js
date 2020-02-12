import React from "react";
import 'styled-components/macro';
import { connect } from "react-redux";
import { switchUi } from "@store/gameReducer";
import { pixel_background } from '../../themes';

const Navigation = ({menu, switchUi}) => {
    // Max inventory space is 12
    const items = ["Equipment", "Armory", "Arcanum"];

    return (
        <nav>
            { items &&
                items.map((item, i) => <button key={i} css={`
                    ${ pixel_background({bg_color: (menu === item.toLowerCase()) ? "#44bff7" : "#ffa53d"}) }
                    color: white;
                    float: left;
                    font-size: 2em;
                    margin-right: 0.5em;
                `}
                onClick={() => switchUi(item.toLowerCase())}>{item}</button>)
            }
        </nav>
    );
}

const mapStateToProps = (state) => {
    const { menu } = state;
    return { menu }
};

export default connect(mapStateToProps, {switchUi})(Navigation);