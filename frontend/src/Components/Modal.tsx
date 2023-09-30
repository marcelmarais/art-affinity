import React, { useEffect, ReactNode } from "react";
import ReactDOM from "react-dom";

const modalRoot = document.getElementById("modal-root") as HTMLElement;

interface ModalProps {
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ children }) => {
  const el = document.createElement("div");

  el.style.position = "fixed";
  el.style.top = "0";
  el.style.left = "0";
  el.style.width = "100%";
  el.style.height = "100%";
  el.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
  el.style.zIndex = "1000";
  el.style.display = "flex";
  el.style.alignItems = "center";
  el.style.justifyContent = "center";

  useEffect(() => {
    modalRoot.appendChild(el);

    return () => {
      modalRoot.removeChild(el);
    };
  }, [el]);

  const content = (
    <div style={{ padding: "20px", maxWidth: "600px", width: "100%" }}>
      {children}
    </div>
  );

  return ReactDOM.createPortal(content, el);
};

export default Modal;
