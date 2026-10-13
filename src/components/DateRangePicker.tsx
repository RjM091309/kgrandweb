import React, { useEffect, useRef, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

type Field = 'checkIn' | 'checkOut';

interface DateRangePickerProps {
  checkIn: string;
  checkOut: string;
  onChange: (range: { checkIn: string; checkOut: string }) => void;
  /** `hero` = large boxed fields with two-month calendar; `compact` = inline fields for sidebars/strips. */
  variant?: 'hero' | 'compact';
  /** Which edge of the field the calendar popover lines up with. */
  align?: 'left' | 'right';
  className?: string;
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// Dates are kept as local 'YYYY-MM-DD' strings to avoid UTC off-by-one shifts.
const toKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const fromKey = (key: string) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const addDays = (key: string, days: number) => {
  const d = fromKey(key);
  d.setDate(d.getDate() + days);
  return toKey(d);
};
const nightsBetween = (a: string, b: string) =>
  Math.round((fromKey(b).getTime() - fromKey(a).getTime()) / 86_400_000);

const formatShort = (key: string) =>
  key ? fromKey(key).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'Select date';
const formatYear = (key: string) => (key ? fromKey(key).getFullYear() : '');

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  checkIn,
  checkOut,
  onChange,
  variant = 'hero',
  align = 'left',
  className = '',
}) => {
  const today = toKey(new Date());
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Field>('checkIn');
  const [hovered, setHovered] = useState<string | null>(null);
  const [viewMonth, setViewMonth] = useState(() => {
    const d = fromKey(checkIn || today);
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const openAt = (field: Field) => {
    setActive(field);
    const anchor = fromKey((field === 'checkOut' ? checkOut : checkIn) || today);
    setViewMonth(new Date(anchor.getFullYear(), anchor.getMonth(), 1));
    setOpen(true);
  };

  const selectDay = (key: string) => {
    if (active === 'checkIn' || key <= checkIn) {
      // New arrival date; keep departure if it is still after it, otherwise default to one night.
      onChange({ checkIn: key, checkOut: checkOut > key ? checkOut : addDays(key, 1) });
      setActive('checkOut');
    } else {
      onChange({ checkIn, checkOut: key });
      setOpen(false);
    }
  };

  const shiftMonth = (delta: number) =>
    setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));

  const thisMonth = new Date(fromKey(today).getFullYear(), fromKey(today).getMonth(), 1);
  const canGoBack = viewMonth > thisMonth;
  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;
  const rangeEnd = active === 'checkOut' && hovered && hovered > checkIn ? hovered : checkOut;

  const renderMonth = (month: Date) => {
    const firstWeekday = month.getDay();
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const cells: (string | null)[] = [
      ...Array(firstWeekday).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) => toKey(new Date(month.getFullYear(), month.getMonth(), i + 1))),
    ];

    return (
      <div className="w-full">
        <p className="text-center font-serif text-sm font-semibold text-stone-900 mb-3">
          {month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
        <div className="grid grid-cols-7 mb-1">
          {WEEKDAYS.map((w) => (
            <span key={w} className="text-center text-[10px] font-semibold uppercase tracking-wider text-stone-400 py-1">
              {w}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-1" onMouseLeave={() => setHovered(null)}>
          {cells.map((key, i) => {
            if (!key) return <span key={`blank-${i}`} />;
            const disabled = key < today;
            const isStart = key === checkIn;
            const isEnd = key === rangeEnd;
            const inRange = checkIn && rangeEnd && key > checkIn && key < rangeEnd;
            const isToday = key === today;

            return (
              <div
                key={key}
                className={`relative h-9 ${inRange ? 'bg-amber-100/70' : ''} ${
                  isStart && rangeEnd > checkIn ? 'bg-gradient-to-r from-transparent from-50% to-amber-100/70 to-50%' : ''
                } ${isEnd && rangeEnd > checkIn ? 'bg-gradient-to-l from-transparent from-50% to-amber-100/70 to-50%' : ''}`}
              >
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => selectDay(key)}
                  onMouseEnter={() => setHovered(key)}
                  className={`relative mx-auto flex h-9 w-9 items-center justify-center rounded-full text-xs tabular-nums transition-colors ${
                    isStart || isEnd
                      ? 'bg-stone-900 text-amber-200 font-bold shadow-sm'
                      : disabled
                        ? 'text-stone-300 cursor-not-allowed line-through decoration-stone-200'
                        : 'text-stone-800 font-medium hover:bg-amber-200/70 cursor-pointer'
                  }`}
                >
                  {fromKey(key).getDate()}
                  {isToday && !isStart && !isEnd && (
                    <span className="absolute bottom-1 h-1 w-1 rounded-full bg-amber-500" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const fieldButton = (field: Field) => {
    const value = field === 'checkIn' ? checkIn : checkOut;
    const isActive = open && active === field;
    const label = field === 'checkIn' ? 'Check-In' : 'Check-Out';

    if (variant === 'compact') {
      return (
        <button
          type="button"
          onClick={() => openAt(field)}
          className={`flex-1 min-w-0 text-left px-3 py-2.5 rounded-xs transition-colors cursor-pointer ${
            isActive ? 'bg-white ring-1 ring-amber-400' : 'hover:bg-white/70'
          }`}
        >
          <span className="block text-[10px] uppercase tracking-wider text-stone-500">{label}</span>
          <span className="block text-xs font-semibold text-stone-900 mt-0.5 truncate">{formatShort(value)}</span>
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={() => openAt(field)}
        className={`flex-1 min-w-0 h-full text-left px-3 sm:px-4 py-3 transition-colors cursor-pointer ${
          isActive ? 'bg-amber-50/80' : 'hover:bg-stone-50'
        }`}
      >
        <span className="block text-[11px] font-medium uppercase tracking-wider text-stone-500 mb-1">
          {label}<span className="hidden sm:inline"> Date</span>
        </span>
        <span className="flex items-center gap-2">
          <Calendar className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-600' : 'text-amber-700'}`} />
          <span className="text-sm font-semibold text-stone-900 truncate">{formatShort(value)}</span>
          <span className="hidden xl:inline text-xs text-stone-400">{formatYear(value)}</span>
        </span>
      </button>
    );
  };

  const isHero = variant === 'hero';

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <div
        className={
          isHero
            ? `flex items-stretch h-full rounded-xs border bg-white overflow-hidden transition-colors ${
                open ? 'border-amber-500' : 'border-stone-200 hover:border-amber-400'
              }`
            : 'flex items-stretch gap-1 rounded-xs border border-stone-200 bg-stone-50/60 p-1'
        }
      >
        {fieldButton('checkIn')}
        <span className={`flex items-center ${isHero ? 'border-x border-stone-100 px-1' : ''}`}>
          <ArrowRight className="w-3.5 h-3.5 text-stone-300" />
        </span>
        {fieldButton('checkOut')}
      </div>

      {open && (
        <div
          className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} top-full mt-2 z-50 rounded-sm border border-stone-200 bg-white p-4 sm:p-5 shadow-2xl animate-in fade-in slide-in-from-top-1 ${
            isHero ? 'w-[min(calc(100vw-2rem),22rem)] md:w-[40rem]' : 'w-[min(calc(100vw-2rem),20rem)]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              disabled={!canGoBack}
              aria-label="Previous month"
              className="p-1.5 rounded-full text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <p className="text-[11px] uppercase tracking-wider text-stone-500">
              Select <span className="font-semibold text-amber-700">{active === 'checkIn' ? 'check-in' : 'check-out'}</span> date
            </p>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              aria-label="Next month"
              className="p-1.5 rounded-full text-stone-600 hover:bg-stone-100 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className={`grid gap-6 ${isHero ? 'md:grid-cols-2' : ''}`}>
            {renderMonth(viewMonth)}
            {isHero && (
              <div className="hidden md:block">
                {renderMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-stone-100">
            <p className="text-xs text-stone-600">
              {nights > 0 ? (
                <>
                  <span className="font-semibold text-stone-900">{nights} {nights === 1 ? 'night' : 'nights'}</span>
                  <span className="text-stone-400"> · {formatShort(checkIn)} – {formatShort(checkOut)}</span>
                </>
              ) : (
                'Select your dates'
              )}
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="shrink-0 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-200 bg-stone-900 hover:bg-stone-800 rounded-xs transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
