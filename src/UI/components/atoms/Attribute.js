import React from "react";
import round from "lodash/round"

const Attribute = ({delimeter=":", label, value, polarity}) => {
    const getColor = () => {
        if (!polarity) return 'black';
        return polarity > 0 ? '#10b981' : '#ef4444';
    };

    return (
        <>
            <dt className="attribute-label">
                { label }{delimeter}
            </dt>
            <dd className="attribute-value">
                { round(value, 2) }
            </dd>
            
            <style jsx>{`
                .attribute-label {
                    clear: left;
                    float: left;
                    margin-right: 0.5rem;
                    text-align: left;
                    text-transform: capitalize;
                    white-space: nowrap;
                }
                
                .attribute-value {
                    overflow: hidden;
                    text-align: right;
                    margin-left: 0;
                    color: ${getColor()};
                }
            `}</style>
        </>
    )
}

export default Attribute;