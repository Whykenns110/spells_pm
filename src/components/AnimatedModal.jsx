export default function AnimatedModal({ isOpen, isClosing, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      onClick={onClose}
    >
      <div 
        className={`modal-animate ${isClosing ? 'modal-exit' : ''}`}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}