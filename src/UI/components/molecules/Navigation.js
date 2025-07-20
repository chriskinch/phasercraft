import React from "react";
import { connect } from "react-redux";
import { switchUi } from "@store/gameReducer";
import { pixel_background } from '../../themes';

const Navigation = ({menu, switchUi}) => {
    // Max inventory space is 12
    const items = ["Character", "Equipment", "Armory", "Arcanum"];

    return (
        <nav className="nav-container">
            { items &&
                items.map((item, i) => (
                    <>
                        <button 
                            key={i} 
                            className={`nav-button ${menu === item.toLowerCase() ? 'active' : ''}`}
                            onClick={() => switchUi(item.toLowerCase())}
                        >
                            {item}
                        </button>
                        <style jsx>{`
                            .nav-button {
                                ${ pixel_background({bg_color: (menu === item.toLowerCase()) ? "#44bff7" : "#ffa53d"}) }
                                color: white;
                                float: left;
                                font-size: 2em;
                                margin-right: 0.5em;
                            }
                        `}</style>
                    </>
                ))
            }
        </nav>
    );
}

const mapStateToProps = (state) => {
    const { menu } = state.game;
    return { menu }
};

export default connect(mapStateToProps, {switchUi})(Navigation);