import SideAd from './SideAd'
import FooterAd from './FooterAd'

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
            <SideAd key="left" />
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 max-w-2xl">{children}</main>

        {/* Right ad sidebar */}
        <aside className="hidden lg:flex flex-col shrink-0 px-2 py-6">
          <div className="sticky top-6">
            <SideAd key="right" />
          </div>
        </aside>
      </div>

      {/* Footer ad */}
      <footer className="flex justify-center py-6 px-4">
        <FooterAd />
      </footer>
    </div>
  )
}
