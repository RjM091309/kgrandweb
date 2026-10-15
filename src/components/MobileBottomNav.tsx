import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useDragControls } from 'motion/react';
import {
  Home,
  BedDouble,
  CalendarCheck,
  Tag,
  Menu,
  Sparkles,
  Images,
  Phone,
  Info,
  HelpCircle,
} from 'lucide-react';
import { useHotel, Page } from '../context/HotelContext';

type IconType = React.ComponentType<{ className?: string; strokeWidth?: number }>;

type NavItem = { page: Page; label: string; icon: IconType };

const LEFT_ITEMS: NavItem[] = [
  { page: 'contact', label: 'Contact', icon: Phone },
  { page: 'rooms', label: 'Rooms', icon: BedDouble },
];
const RIGHT_ITEMS: NavItem[] = [{ page: 'offers', label: 'Offers', icon: Tag }];

/** Everything not already one tap away in the bar lives in the "More" sheet. */
const SHEET_TILES: NavItem[] = [
  { page: 'amenities', label: 'Amenities', icon: Sparkles },
  { page: 'gallery', label: 'Gallery', icon: Images },
  { page: 'booking', label: 'Book a Stay', icon: CalendarCheck },
  { page: 'about', label: 'About', icon: Info },
  { page: 'faqs', label: 'FAQs', icon: HelpCircle },
];

const BAR_HEIGHT = 64; // px, excludes safe-area inset
const NOTCH_RADIUS = 38; // px
const FAB_SIZE = 56; // px

/** Radial-gradient mask that punches a circular notch out of the bar's top-center. */
const NOTCH_MASK = `radial-gradient(circle ${NOTCH_RADIUS}px at 50% 0px, transparent 99%, #000 100%)`;

/**
 * Mobile/tablet bottom tab bar (below `lg`), standing in for the desktop nav
 * links. "Home" is the raised gold center button; "More" opens a bottom sheet
 * with the remaining pages and the guest account.
 */
export const MobileBottomNav: React.FC = () => {
  const { currentPage, navigateTo } = useHotel();
  const [moreOpen, setMoreOpen] = useState(false);

  const go = (page: Page) => {
    setMoreOpen(false);
    navigateTo(page);
  };

  // Room detail and booking are part of the Rooms flow, so keep that tab lit.
  const isActive = (page: Page) =>
    currentPage === page || (page === 'rooms' && (currentPage === 'room-detail' || currentPage === 'booking'));
  const homeActive = currentPage === 'home';

  const renderItem = (item: NavItem) => {
    const active = !moreOpen && isActive(item.page);
    const Icon = item.icon;
    return (
      <button
        key={item.page}
        type="button"
        onClick={() => go(item.page)}
        aria-current={active ? 'page' : undefined}
        className={`relative flex-1 min-w-0 flex flex-col items-center justify-center gap-1 transition-colors ${
          active ? 'text-amber-300' : 'text-stone-400 active:text-stone-200'
        }`}
      >
        <Icon className="w-[22px] h-[22px]" strokeWidth={active ? 2.2 : 1.8} />
        <span className={`text-[10px] tracking-wide truncate max-w-full ${active ? 'font-semibold' : 'font-medium'}`}>
          {item.label}
        </span>
        {active && <span className="absolute bottom-1.5 h-[3px] w-5 rounded-full bg-amber-300" />}
      </button>
    );
  };

  return (
    <>
      <nav
        aria-label="Primary"
        className="lg:hidden fixed inset-x-0 bottom-0 z-40 pointer-events-none"
        style={{ height: `calc(${BAR_HEIGHT + FAB_SIZE / 2}px + env(safe-area-inset-bottom, 0px))` }}
      >
        {/* Notched bar background */}
        <div
          className="absolute inset-x-0 bottom-0 bg-stone-950 border-t border-stone-800 pointer-events-auto"
          style={{
            height: `calc(${BAR_HEIGHT}px + env(safe-area-inset-bottom, 0px))`,
            boxShadow: '0 -8px 24px rgb(0 0 0 / 0.25)',
            maskImage: NOTCH_MASK,
            WebkitMaskImage: NOTCH_MASK,
          }}
        />

        <div
          className="absolute inset-x-0 bottom-0 flex items-stretch pointer-events-auto"
          style={{ height: `calc(${BAR_HEIGHT}px + env(safe-area-inset-bottom, 0px))`, paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          {LEFT_ITEMS.map(renderItem)}
          <div style={{ width: NOTCH_RADIUS * 2 }} aria-hidden="true" />
          {RIGHT_ITEMS.map(renderItem)}
          <button
            type="button"
            onClick={() => setMoreOpen((o) => !o)}
            aria-expanded={moreOpen}
            aria-haspopup="dialog"
            className={`relative flex-1 min-w-0 flex flex-col items-center justify-center gap-1 transition-colors ${
              moreOpen ? 'text-amber-300' : 'text-stone-400 active:text-stone-200'
            }`}
          >
            <Menu className="w-[22px] h-[22px]" strokeWidth={moreOpen ? 2.2 : 1.8} />
            <span className={`text-[10px] tracking-wide ${moreOpen ? 'font-semibold' : 'font-medium'}`}>More</span>
            {moreOpen && <span className="absolute bottom-1.5 h-[3px] w-5 rounded-full bg-amber-300" />}
          </button>
        </div>

        {/* Raised center "Home" button sitting in the notch */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 pointer-events-auto">
          <button
            type="button"
            onClick={() => go('home')}
            aria-label="Home"
            aria-current={homeActive ? 'page' : undefined}
            className="btn-gold flex items-center justify-center"
            style={{
              width: FAB_SIZE,
              height: FAB_SIZE,
              borderRadius: '9999px',
              boxShadow: '0 10px 22px rgb(0 0 0 / 0.35), inset 0 1px 0 rgb(255 255 255 / 0.45)',
            }}
          >
            <Home className="w-6 h-6" strokeWidth={homeActive ? 2.4 : 2} />
          </button>
        </div>
      </nav>

      <MoreSheet open={moreOpen} onClose={() => setMoreOpen(false)} onNavigate={go} />
    </>
  );
};

const MoreSheet: React.FC<{ open: boolean; onClose: () => void; onNavigate: (page: Page) => void }> = ({
  open,
  onClose,
  onNavigate,
}) => {
  const { currentPage } = useHotel();
  const dragControls = useDragControls();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="lg:hidden fixed inset-0 z-[55] flex flex-col justify-end">
          <motion.div
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="More"
            className="relative flex flex-col max-h-[88%] rounded-t-3xl border-t border-stone-800 bg-stone-950 text-stone-100 shadow-[0_-12px_32px_rgb(0_0_0/0.4)]"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            drag="y"
            dragListener={false}
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.7 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 90 || info.velocity.y > 500) onClose();
            }}
          >
            {/* Drag handle — the only drag target, so the list below still scrolls normally. */}
            <div
              className="shrink-0 pt-2.5 pb-3 cursor-grab active:cursor-grabbing"
              style={{ touchAction: 'none' }}
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="mx-auto h-1.5 w-10 rounded-full bg-stone-700" />
            </div>

            <div
              className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4"
              style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom, 0px))' }}
            >
              <p className="mt-1 mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300">Explore</p>
              <div className="grid grid-cols-3 gap-2.5">
                {SHEET_TILES.map(({ page, label, icon: Icon }) => {
                  const active = currentPage === page;
                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => onNavigate(page)}
                      aria-current={active ? 'page' : undefined}
                      className={`flex flex-col items-center justify-center gap-2 rounded-2xl px-1.5 py-3.5 border transition-colors active:scale-[0.98] ${
                        active
                          ? 'bg-amber-300 border-amber-300 text-stone-950'
                          : 'bg-stone-900 border-stone-800 text-stone-200'
                      }`}
                    >
                      <span
                        className={`h-9 w-9 inline-flex items-center justify-center rounded-xl ${
                          active ? 'bg-stone-950/10' : 'bg-stone-800 text-amber-300'
                        }`}
                      >
                        <Icon className="w-[18px] h-[18px]" />
                      </span>
                      <span className="text-[11px] font-semibold leading-tight text-center">{label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 flex items-center justify-center gap-4 text-[11px] text-stone-500">
                <button type="button" onClick={() => onNavigate('privacy')} className="hover:text-stone-300">
                  Privacy Policy
                </button>
                <span aria-hidden="true">·</span>
                <button type="button" onClick={() => onNavigate('terms')} className="hover:text-stone-300">
                  Terms & Conditions
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
