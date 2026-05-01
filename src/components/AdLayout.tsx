import AdContainer from './AdContainer'

interface AdLayoutProps {
  children: React.ReactNode
}

export default function AdLayout({ children }: AdLayoutProps) {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 flex flex-col">
      <div className="flex flex-1">
        {/* Left ad sidebar */}
        <aside className="hidden lg:flex flex-col w-[160px] xl:w-[300px] shrink-0 px-2 py-6">
          <div className="sticky top-6">
            <AdContainer className="w-full min-h-[250px]" />
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>

        {/* Right ad sidebar */}
        <aside className="hidden lg:flex flex-col w-[160px] xl:w-[300px] shrink-0 px-2 py-6">
          <div className="sticky top-6">
            <AdContainer className="w-full min-h-[250px]" />
          </div>
        </aside>
      </div>

      {/* Footer ad */}
      <footer className="flex justify-center py-6 px-4">
        <AdContainer className="w-full max-w-2xl min-h-[90px]" />
      </footer>
    </div>
  )
}
