import { useEffect } from "react"
import { createPortal } from "react-dom"
import "styled-components/macro"

const Dialog = ({children}) => {
    const root = document.querySelector('#root');
    const el = document.createElement('div');
    
    useEffect(() => {
        root.appendChild(el);
    });

    return (
        createPortal(
            children,
            root
        )
    );
}

export default Dialog;