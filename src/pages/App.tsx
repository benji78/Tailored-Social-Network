import ReactSVG from '@/assets/react.svg'
import { Button } from '@/components/ui/button'
import { H1, H2, H3, H4 } from '@/components/ui/typography'

export default function App() {
  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-y-4">
        <H1>H1</H1>
        <H2>H2</H2>
        <H3>H3</H3>
        <H4>H4</H4>
        <div className="inline-flex items-center gap-x-4">
          <img src={ReactSVG} alt="React Logo" className="w-28" />
          <span className="text-6xl">+</span>
          <img src={'/vite.svg'} alt="Vite Logo" className="w-28" />
        </div>
        <a href="https://ui.shadcn.com" rel="noopener noreferrer nofollow" target="_blank">
          <Button variant="outline">shadcn/ui</Button>
        </a>
      </div>
    </main>
  )
}
