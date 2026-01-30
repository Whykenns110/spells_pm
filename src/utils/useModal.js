import { useState } from 'react';

export function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);
  const [isClosing, setIsClosing] = useState(false);

  const open = () => {
    setIsOpen(true);
    setIsClosing(false);
  };

  const close = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 250); // Время должно совпадать с CSS анимацией
  };

  return { isOpen, isClosing, open, close };
}