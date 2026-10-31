import { cn } from '@/lib/utils'

const RUNNING_ITEMS = [
  'For Every Occasion, Make It Special',
  'Finest Quality Mehndi Cones',
  'Natural Ingredients',
  'Hygienic & Skin Friendly',
  'Made with Love',
  'Trusted by Mehndi Lovers',
  '100% Organic Rajasthani Sojat Henna',
  'Chemical, Ammonia & PPD Free',
  'Rich Dark Mahogany Stain Guarantee',
  'Doorstep Dispatch Across India',
]

interface ContinuousRunningLineProps {
  className?: string
}

export function ContinuousRunningLine({ className }: ContinuousRunningLineProps) {
  return (
    <aside
      className={cn(
        'bg-[#FAF5E8] overflow-hidden py-2 sm:py-2.5 border-y border-antique-gold/30 select-none shadow-2xs',
        className
      )}
      aria-label="Store highlights ticker"
    >
      <div className="flex w-full overflow-hidden">
        <div className="animate-marquee-continuous flex items-center">
          {/* First loop track */}
          <div className="flex shrink-0 items-center gap-6 sm:gap-10 pr-6 sm:pr-10">
            {RUNNING_ITEMS.map((item, index) => (
              <span
                key={`item-${index}`}
                className="flex items-center gap-6 sm:gap-10 whitespace-nowrap text-xs sm:text-[0.82rem] font-semibold uppercase tracking-wider text-bottle-green"
              >
                <span>{item}</span>
                <span className="text-antique-gold text-xs sm:text-sm font-normal select-none" aria-hidden="true">
                  ✦
                </span>
              </span>
            ))}
          </div>

          {/* Second duplicate track for continuous, zero-gap infinite loop */}
          <div className="flex shrink-0 items-center gap-6 sm:gap-10 pr-6 sm:pr-10" aria-hidden="true">
            {RUNNING_ITEMS.map((item, index) => (
              <span
                key={`dup-${index}`}
                className="flex items-center gap-6 sm:gap-10 whitespace-nowrap text-xs sm:text-[0.82rem] font-semibold uppercase tracking-wider text-bottle-green"
              >
                <span>{item}</span>
                <span className="text-antique-gold text-xs sm:text-sm font-normal select-none" aria-hidden="true">
                  ✦
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}

export default ContinuousRunningLine
