import { darken } from 'polished';

export function pixel_background({bg_color = "#e4f6f7"} = {}) {
    return `
        background: ${bg_color};
        box-shadow: 0 6px 0 ${darken(0.3, bg_color)}, 0 10px 0 rgba(0,0,0,0.25);
        box-sizing: border-box;
        display: inline-block;
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