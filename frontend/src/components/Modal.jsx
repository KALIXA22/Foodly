function Modal({ children, onClose }) {
  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <dialog
        className="fixed left-1/2 top-1/2 z-50 w-[90%] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/20 bg-white/90 p-6 shadow-2xl backdrop-blur-md"
        open
      >
        <button
          type="button"
          onClick={onClose}
          className="mb-4 ml-auto flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-sm text-text-muted transition hover:bg-gray-50"
          aria-label="Close modal"
        >
          ✕
        </button>
        {children}
      </dialog>
    </>
  );
}

export default Modal;