import { darken } from 'polished';

export const pixel_background = ({bg_color = "#e4f6f7"} = {}) => {
    return `
        background: ${bg_color};
        border: none;
        box-shadow: 0 6px 0 ${darken(0.3, bg_color)}, 0 10px 0 rgba(0,0,0,0.25);
        box-sizing: border-box;
        display: inline-block;
        outline: 0;
        padding: 0.25em;
        position: relative;
        height: 100%;
        margin: 0 6px;
        &:before {
            background: ${bg_color};
            width: 6px;
            content: '';
            display: block;
            top: 6px;
            position: absolute;
            bottom: 6px;
            left: -6px;
            box-shadow: 0 6px 0 ${darken(0.3, bg_color)}, 0 10px 0 rgba(0,0,0,0.25);
        }
        &:after {
            background: ${bg_color};
            width: 6px;
            content: '';
            display: block;
            top: 6px;
            position: absolute;
            bottom: 6px;
            right: -6px;
            box-shadow: 0 6px 0 ${darken(0.3, bg_color)}, 0 10px 0 rgba(0,0,0,0.3);
        }
    `
};

export const pixel_emboss = ({rgb = "0,0,0", a = 0.1} = {}) => {
    const depth = "6px";
    return `
        background: rgba(${rgb},${a});
        border-top: ${depth} solid rgba(${rgb},${a});
        box-shadow: 0 -${depth} 0 rgba(${rgb},${a*3});
        box-sizing: border-box;
        color: rgba(${rgb},0.2);
        display: inline-block;
        height: 54px;
        line-height: 20px;
        position: relative;
        margin: 4px;
        text-align: center;
        width: 54px;
        &:before {
            background: rgba(${rgb},${a});
            border-top: ${depth} solid rgba(${rgb},${a});
            bottom: ${depth};
            box-shadow: 0 -${depth} 0 rgba(${rgb},${a*3});
            content: '';
            display: block;
            left: -${depth};
            position: absolute;
            top: 0;
            width: ${depth};
        }
        &:after {
            background: rgba(${rgb},${a});
            border-top: ${depth} solid rgba(${rgb},${a});
            bottom: ${depth};
            box-shadow: 0 -${depth} 0 rgba(${rgb},${a*3});
            content: '';
            display: block;
            right: -${depth};
            position: absolute;
            top: 0;
            width: ${depth};
        }
    `
};