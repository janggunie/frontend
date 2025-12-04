"use client";

export default function HamburgerMenu({
  open,
  toggle,
}: {
  open: boolean;
  toggle: () => void;
}) {
  return (
    <button onClick={toggle} className="z-[100] relative">
      {open ? (
        <div className="text-3xl font-bold">✕</div>
      ) : (
        <div className="flex flex-col gap-1">
          <span className="block w-6 h-0.5 bg-black"></span>
          <span className="block w-6 h-0.5 bg-black"></span>
          <span className="block w-6 h-0.5 bg-black"></span>
        </div>
      )}
    </button>
  );
}
