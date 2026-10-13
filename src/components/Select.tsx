import React, { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  /** `field` = boxed form input; `bare` = borderless, for selects that sit inside an existing box. */
  variant?: 'field' | 'bare';
  /** Which edge of the trigger the menu lines up with. */
  align?: 'left' | 'right';
  className?: string;
  'aria-label'?: string;
}

/** Brand-styled replacement for the native <select>, with keyboard support. */
export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  variant = 'field',
  align = 'left',
  className = '',
  'aria-label': ariaLabel,
}) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));
  const selected = options[selectedIndex];

  useEffect(() => {
    if (!open) return;
    setActiveIndex(selectedIndex);
    const onPointer = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    return () => document.removeEventListener('mousedown', onPointer);
  }, [open, selectedIndex]);

  // Keep the highlighted option in view while arrowing through a long list.
  useEffect(() => {
    if (!open) return;
    listRef.current?.children[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [open, activeIndex]);

  const choose = (index: number) => {
    onChange(options[index].value);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(options.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      choose(activeIndex);
    } else if (e.key === 'Escape' || e.key === 'Tab') {
      setOpen(false);
    }
  };

  const triggerClass =
    variant === 'bare'
      ? 'w-full flex items-center justify-between gap-2 text-left bg-transparent focus:outline-none'
      : `w-full flex items-center justify-between gap-2 text-left rounded-xs border px-3 py-2.5 transition-colors focus:outline-none ${
          open ? 'border-amber-500 bg-white' : 'border-stone-200 bg-stone-50 hover:border-amber-400 focus:border-amber-500'
        }`;

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyDown}
        className={triggerClass}
      >
        <span className="truncate text-stone-900">{selected?.label}</span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 transition-transform ${open ? 'rotate-180 text-amber-600' : 'text-stone-400'}`}
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          className={`absolute top-full ${align === 'right' ? 'right-0' : 'left-0'} mt-1.5 z-50 min-w-full w-max max-w-[min(calc(100vw-2rem),24rem)] max-h-64 overflow-auto rounded-sm border border-stone-200 bg-white py-1.5 shadow-xl animate-in fade-in slide-in-from-top-1`}
        >
          {options.map((option, i) => {
            const isSelected = option.value === value;
            const isActive = i === activeIndex;
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(i)}
                className={`flex items-center justify-between gap-4 px-3.5 py-2 cursor-pointer transition-colors ${
                  isActive ? 'bg-amber-50' : ''
                } ${isSelected ? 'text-amber-800 font-semibold' : 'text-stone-700'}`}
              >
                <span>{option.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
