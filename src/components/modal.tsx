import { useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-[9999]">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <div className="flex justify-between items-center mb-4">
          {title && <h2 className="text-xl font-semibold">{title}</h2>}
          <button
            onClick={onClose}
            className="bg-gray-400 text-white text-sm py-2 px-4 rounded transition-all duration-300 hover:-translate-y-0.5 active:translate-y-1 hover:shadow-2xl active:shadow-lg w-1/2"
          >
            Done
          </button>
        </div>
        <div className="w-full">{children}</div>
      </div>
    </div>,
    document.body
  );
}
