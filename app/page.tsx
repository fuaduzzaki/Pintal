import { Navbar } from '@/components/landing/navbar'
import { Hero } from '@/components/landing/hero'
import { Problem } from '@/components/landing/problem'
import { Solution } from '@/components/landing/solution'
import { Value } from '@/components/landing/value'
import { Stats } from '@/components/landing/stats'
import { Pricing } from '@/components/landing/pricing'
import { Footer } from '@/components/landing/footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <Value />
        <Stats />
        <Pricing />
      </main>
      <Footer />
    </div>
  )
}
