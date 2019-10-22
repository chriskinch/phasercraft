import React from "react";
import { connect } from "react-redux";
import 'styled-components/macro';

const Armory = () => {
    return (
        <div css={`
            display: flex;
        `}>
            <section>
                <h2>Armory</h2>
            </section>
        </div>
    );
}

const mapStateToProps = (state) => ({
    ...state
});

export default connect(mapStateToProps)(Armory);