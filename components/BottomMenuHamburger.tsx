"use client";

type Props = {
  open: boolean;
  toggle: () => void;
};

export default function BottomMenuHamburger({ open, toggle }: Props) {
  return (
    <button
      onClick={toggle}
      className="relative text-sm font-semibold uppercase tracking-[0.25em] text-neutral-700 transition-all duration-500 hover:tracking-[0.4em] cursor-pointer"
    >
      <span
        className={`absolute h-0.5 w-6.5 rounded-full bg-current transition-all duration-500 ${
          open ? "translate-y-0 rotate-45" : "-translate-y-2"
        }`}
      />
      <span
        className={`absolute h-0.5 w-6.5 rounded-full bg-current transition-all duration-500 ${
          open ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100"
        }`}
      />
      <span
        className={`absolute h-0.5 w-6.5 rounded-full bg-current transition-all duration-500 ${
          open ? "translate-y-0 -rotate-45" : "translate-y-2"
        }`}
      />
    </button>
  );
}
