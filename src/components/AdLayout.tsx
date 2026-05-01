import SideAd from './SideAd'

interface AdLayoutProps {
  children: React.ReactNode
}

export default function AdLayout({ children }: AdLayoutProps) {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 flex flex-col">
      <div className="flex flex-1 justify-center">
        {/* Left ad sidebar */}
        <aside className="hidden lg:flex flex-col shrink-0 px-2 py-6">
          <div className="sticky top-6">
            <SideAd />
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 max-w-2xl">{children}</main>

        {/* Right ad sidebar */}
        <aside className="hidden lg:flex flex-col shrink-0 px-2 py-6">
          <div className="sticky top-6">
            <SideAd />
          </div>
        </aside>
      </div>

      {/* Footer ad */}
      <footer className="flex justify-center py-6 px-4">
        <div
          id="container-32d6b114e43f968c75084eb22df14ef7"
          className="w-full max-w-2xl min-h-[90px]"
        />
      </footer>
    </div>
  )
}
