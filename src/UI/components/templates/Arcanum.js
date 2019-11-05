import React from "react";
import { connect } from "react-redux";
import 'styled-components/macro';

const Arcanum = () => {
    return (
        <div css={`
            display: flex;
        `}>
            <section>
                <h2>Arcanum</h2>
            </section>
        </div>
    );
}

const mapStateToProps = (state) => ({
    ...state
});

export default connect(mapStateToProps)(Arcanum);