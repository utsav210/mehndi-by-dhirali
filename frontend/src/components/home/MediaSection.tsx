import { Play, BookOpen, Video, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TutorialItem {
  id: string
  title: string
  category: string
  duration: string
  tag: string
  url: string
}

const DHIRALI_YOUTUBE_CHANNEL = 'https://www.youtube.com/channel/UCmJikx0yiVrpqzps213L-KA'

const TUTORIALS: TutorialItem[] = [
  {
    id: '1',
    title: 'How to Hold and Control a Mehndi Cone for Fine Lines',
    category: 'Technique',
    duration: '6 mins',
    tag: 'Beginner',
    url: DHIRALI_YOUTUBE_CHANNEL,
  },
  {
    id: '2',
    title: 'Bridal Mandala Centerpiece Step-by-Step Tutorial',
    category: 'Design',
    duration: '14 mins',
    tag: 'Intermediate',
    url: DHIRALI_YOUTUBE_CHANNEL,
  },
  {
    id: '3',
    title: 'Secret Aftercare Routine for Deep Mahogany Stain',
    category: 'Stain Care',
    duration: '5 mins',
    tag: 'Essential',
    url: DHIRALI_YOUTUBE_CHANNEL,
  },
]

export default function MediaSection({ className }: { className?: string }) {
  return (
    <section className={cn('py-16 bg-white', className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-antique-gold font-decorative text-sm uppercase tracking-wider mb-2">
            <Video className="h-4 w-4" />
            <span>Learning & Demonstrations</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-bottle-green sm:text-4xl">
            Mehndi Masterclasses & Tutorials
          </h2>
          <div className="ornamental-divider my-4">
            <span className="text-antique-gold text-lg">✦</span>
          </div>
          <p className="text-secondary-text text-sm sm:text-base">
            Learn authentic techniques from Dhirali to elevate your bridal, festive, and contemporary henna artistry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TUTORIALS.map((tutorial) => (
            <a
              key={tutorial.id}
              href={tutorial.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-subtle-border overflow-hidden bg-warm-ivory/20 shadow-xs hover:shadow-card hover:border-antique-gold/50 transition-all block cursor-pointer"
            >
              {/* Media Thumbnail with Play button */}
              <div className="relative aspect-video bg-gradient-to-br from-forest-green to-bottle-green flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-antique-gold text-forest-green shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="h-6 w-6 ml-1 fill-current" />
                </div>
                <div className="absolute bottom-3 right-3 rounded-md bg-black/60 px-2 py-1 text-xs text-white">
                  {tutorial.duration}
                </div>
                <div className="absolute top-3 left-3 rounded-full bg-bottle-green/80 backdrop-blur-xs px-2.5 py-0.5 text-xs text-antique-gold border border-antique-gold/30">
                  {tutorial.tag}
                </div>
              </div>

              {/* Information */}
              <div className="p-5">
                <div className="flex items-center justify-between text-xs text-secondary-text mb-2">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-antique-gold" />
                    <span>{tutorial.category}</span>
                  </div>
                  <span className="text-[11px] text-antique-gold font-semibold flex items-center gap-1">
                    YouTube
                    <ExternalLink className="h-3 w-3" />
                  </span>
                </div>
                <h3 className="font-serif text-base font-semibold text-primary-text group-hover:text-bottle-green transition-colors line-clamp-2">
                  {tutorial.title}
                </h3>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href={DHIRALI_YOUTUBE_CHANNEL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-bottle-green bg-warm-ivory/60 hover:bg-bottle-green hover:text-white px-6 py-2.5 text-xs font-semibold text-bottle-green transition-all shadow-xs"
          >
            <span>Explore All Masterclasses on Dhirali's YouTube Channel</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  )
}
