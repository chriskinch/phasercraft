import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface DialogProps {
  children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ children }) => {
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);
  
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
};

export default Dialog;