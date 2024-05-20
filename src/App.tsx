import ReactSVG from '@/assets/react.svg'
import { ThemeProvider } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'
import { ModeToggle } from './components/mode-toggle'
import { H1, H2, H3, H4 } from '@/components/ui/typography.tsx'

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {/* {children} */}
      <main className="flex h-screen flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-y-4">
          <ModeToggle />
          <H1>H1</H1>
          <H2>H2</H2>
          <H3>H3</H3>
          <H4>H4</H4>
          <div className="inline-flex items-center gap-x-4">
            <img src={ReactSVG} alt="React Logo" className="w-32" />
            <span className="text-6xl">+</span>
            <img src={'/vite.svg'} alt="Vite Logo" className="w-32" />
          </div>
          <a href="https://ui.shadcn.com" rel="noopener noreferrer nofollow" target="_blank">
            <Button variant="outline">shadcn/ui</Button>
          </a>
        </div>
      </main>
    </ThemeProvider>
  )
}
