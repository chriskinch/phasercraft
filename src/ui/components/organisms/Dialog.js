import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

const Dialog = ({children}) => {
    const [modalRoot, setModalRoot] = useState(null);
    
    useEffect(() => {
        const root = document.querySelector('#app');
        const el = document.createElement('div');
        
        if (root) {
            root.appendChild(el);
            setModalRoot(el);
            
            return () => {
                root.removeChild(el);
            };
        }
    }, []);

    if (!modalRoot) return null;

    return createPortal(children, modalRoot);
}

export default Dialog;