import { darken } from 'polished';

interface PixelBackgroundOptions {
  bg_color?: string;
}

export const pixel_background = ({ bg_color = "#e4f6f7" }: PixelBackgroundOptions = {}): string => {
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
  `;
};

interface PixelEmbossOptions {
  rgb?: string;
  a?: number;
}

export const pixel_emboss = ({ rgb = "0,0,0", a = 0.1 }: PixelEmbossOptions = {}): string => {
  const depth = "6px";
  return `
    background: rgba(${rgb},${a});
    border-top: ${depth} solid rgba(${rgb},${a});
    box-shadow: 0 -${depth} 0 rgba(${rgb},${a * 3});
    box-sizing: border-box;
    position: relative;
    margin: ${depth};
    text-align: center;
    &:before {
      background: rgba(${rgb},${a});
      border-top: ${depth} solid rgba(${rgb},${a});
      bottom: ${depth};
      box-shadow: 0 -${depth} 0 rgba(${rgb},${a * 3});
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
      box-shadow: 0 -${depth} 0 rgba(${rgb},${a * 3});
      content: '';
      display: block;
      right: -${depth};
      position: absolute;
      top: 0;
      width: ${depth};
    }
  `;
};

interface DialogOverlayOptions {
  bg_color?: string;
}

export const dialog_overlay = ({ bg_color = "#e4f6f7" }: DialogOverlayOptions = {}): string => {
  return `
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.9);
    padding: 10% 35%;
    color: white;
    font-size: 1.5em;
    font-weight: bold;
  `;
};