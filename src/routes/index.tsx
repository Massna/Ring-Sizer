import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'

export const Route = createFileRoute('/')({
  component: Home,
})

// Brazilian ring sizes (inner circumference in mm)
// Diameter = circumference / π
const RING_SIZES = [
  { size: 10, circ: 10, diam: 10 / Math.PI },
  { size: 11, circ: 11, diam: 11 / Math.PI },
  { size: 12, circ: 12, diam: 12 / Math.PI },
  { size: 13, circ: 13, diam: 13 / Math.PI },
  { size: 14, circ: 14, diam: 14 / Math.PI },
  { size: 15, circ: 15, diam: 15 / Math.PI },
  { size: 16, circ: 16, diam: 16 / Math.PI },
  { size: 17, circ: 17, diam: 17 / Math.PI },
  { size: 18, circ: 18, diam: 18 / Math.PI },
  { size: 19, circ: 19, diam: 19 / Math.PI },
  { size: 20, circ: 20, diam: 20 / Math.PI },
  { size: 21, circ: 21, diam: 21 / Math.PI },
  { size: 22, circ: 22, diam: 22 / Math.PI },
  { size: 23, circ: 23, diam: 23 / Math.PI },
  { size: 24, circ: 24, diam: 24 / Math.PI },
  { size: 25, circ: 25, diam: 25 / Math.PI },
  { size: 26, circ: 26, diam: 26 / Math.PI },
  { size: 27, circ: 27, diam: 27 / Math.PI },
  { size: 28, circ: 28, diam: 28 / Math.PI },
  { size: 29, circ: 29, diam: 29 / Math.PI },
  { size: 30, circ: 30, diam: 30 / Math.PI },
  { size: 31, circ: 31, diam: 31 / Math.PI },
  { size: 32, circ: 32, diam: 32 / Math.PI },
  { size: 33, circ: 33, diam: 33 / Math.PI },
  { size: 34, circ: 34, diam: 34 / Math.PI },
  { size: 35, circ: 35, diam: 35 / Math.PI },
]

// Conversion table: Brazilian size -> US, UK, EU, JP/CN
// Based on standard ring size conversion charts
const CONVERSION_TABLE: Record<number, { us: number | string; uk: string; eu: number; jp: number }> = {
  10: { us: 5, uk: 'J', eu: 49, jp: 9 },
  11: { us: 5.5, uk: 'K', eu: 50, jp: 10 },
  12: { us: 6, uk: 'L', eu: 51, jp: 11 },
  13: { us: 6.5, uk: 'M', eu: 52, jp: 12 },
  14: { us: 7, uk: 'N', eu: 54, jp: 13 },
  15: { us: 7.5, uk: 'O', eu: 55, jp: 14 },
  16: { us: 8, uk: 'P', eu: 56, jp: 15 },
  17: { us: 8.5, uk: 'Q', eu: 57, jp: 16 },
  18: { us: 9, uk: 'R', eu: 58, jp: 17 },
  19: { us: 9.5, uk: 'S', eu: 59, jp: 18 },
  20: { us: 10, uk: 'T', eu: 60, jp: 19 },
  21: { us: 10.5, uk: 'U', eu: 62, jp: 20 },
  22: { us: 11, uk: 'V', eu: 63, jp: 21 },
  23: { us: 11.5, uk: 'W', eu: 64, jp: 22 },
  24: { us: 12, uk: 'X', eu: 65, jp: 23 },
  25: { us: 12.5, uk: 'Y', eu: 66, jp: 24 },
  26: { us: 13, uk: 'Z', eu: 67, jp: 25 },
  27: { us: 13.5, uk: 'Z1', eu: 68, jp: 26 },
  28: { us: 14, uk: 'Z2', eu: 69, jp: 27 },
  29: { us: 14.5, uk: 'Z3', eu: 70, jp: 28 },
  30: { us: 15, uk: 'Z4', eu: 71, jp: 29 },
  31: { us: 15.5, uk: 'Z5', eu: 72, jp: 30 },
  32: { us: 16, uk: 'Z6', eu: 73, jp: 31 },
  33: { us: 16.5, uk: 'Z7', eu: 74, jp: 32 },
  34: { us: 17, uk: 'Z8', eu: 75, jp: 33 },
  35: { us: 17.5, uk: 'Z9', eu: 76, jp: 34 },
}

type Step = 'tutorial' | 'calibration' | 'measurement'

function Home() {
  const [step, setStep] = useState<Step>('tutorial')
  const [tutorialPage, setTutorialPage] = useState(0)
  const [pixelsPerCm, setPixelsPerCm] = useState<number | null>(null)
  const [selectedSize, setSelectedSize] = useState<number | null>(null)

  const finishTutorial = () => {
    setStep('calibration')
  }

  return (
    <main className="min-h-screen bg-stone-50 text-stone-800">
      <header className="bg-stone-900 text-stone-50 py-4 px-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-tight">💍 Ring Sizer</h1>
          <span className="text-xs text-stone-400">Precise & Free</span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {step === 'tutorial' && (
          <Tutorial
            page={tutorialPage}
            setPage={setTutorialPage}
            onFinish={finishTutorial}
          />
        )}
        {step === 'calibration' && (
          <Calibration
            onCalibrated={(ppc) => {
              setPixelsPerCm(ppc)
              setStep('measurement')
            }}
          />
        )}
        {step === 'measurement' && pixelsPerCm !== null && (
          <Measurement
            pixelsPerCm={pixelsPerCm}
            selectedSize={selectedSize}
            onSelectSize={setSelectedSize}
            onRecalibrate={() => setStep('calibration')}
          />
        )}
      </div>
    </main>
  )
}

function Tutorial({
  page,
  setPage,
  onFinish,
}: {
  page: number
  setPage: (p: number) => void
  onFinish: () => void
}) {
  const pages = [
    {
      title: 'Welcome!',
      content: (
        <>
          <p className="text-stone-600 leading-relaxed">
            This app helps you find your exact ring size so you can shop online with confidence.
          </p>
          <p className="text-stone-600 leading-relaxed mt-3">
            The secret is calibration: we adjust your device's scale so the circles on screen are exactly the same size as a real ring.
          </p>
        </>
      ),
    },
    {
      title: 'How does it work?',
      content: (
        <>
          <p className="text-stone-600 leading-relaxed">
            <strong>1. Calibration:</strong> You'll adjust a virtual ruler on screen to match a real object of known size (like a credit card).
          </p>
          <p className="text-stone-600 leading-relaxed mt-3">
            <strong>2. Measurement:</strong> Place your finger over the circles on screen. The one that fits perfectly is your size!
          </p>
        </>
      ),
    },
    {
      title: 'Important Tips',
      content: (
        <>
          <ul className="list-disc list-inside text-stone-600 space-y-2 leading-relaxed">
            <li>Use the app in <em>landscape</em> orientation for better accuracy.</li>
            <li>Remove thick phone cases — they lift your finger away from the screen.</li>
            <li>Measure your finger in the evening, when it's slightly swollen.</li>
            <li>Don't force your finger — the ring should slide on with gentle resistance.</li>
          </ul>
        </>
      ),
    },
  ]

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 md:p-8">
      <div className="flex gap-1.5 mb-6">
        {pages.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= page ? 'bg-amber-500' : 'bg-stone-200'
            }`}
          />
        ))}
      </div>

      <h2 className="text-2xl font-bold text-stone-900 mb-4">
        {pages[page].title}
      </h2>

      <div className="mb-8">{pages[page].content}</div>

      <div className="flex justify-between">
        <button
          onClick={() => setPage(Math.max(0, page - 1))}
          disabled={page === 0}
          className="px-5 py-2.5 rounded-xl text-stone-600 font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-100 transition-colors"
        >
          Back
        </button>
        {page < pages.length - 1 ? (
          <button
            onClick={() => setPage(page + 1)}
            className="px-6 py-2.5 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors shadow-sm"
          >
            Next
          </button>
        ) : (
          <button
            onClick={onFinish}
            className="px-6 py-2.5 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors shadow-sm"
          >
            Start
          </button>
        )}
      </div>
    </div>
  )
}

function Calibration({
  onCalibrated,
}: {
  onCalibrated: (pixelsPerCm: number) => void
}) {
  const [method, setMethod] = useState<'credit' | 'ruler' | 'screen'>('credit')
  const [creditWidthMm] = useState(85.6)
  const [rulerCm, setRulerCm] = useState(5)
  const [screenDPI, setScreenDPI] = useState(96)
  const rulerRef = useRef<HTMLDivElement>(null)
  const [sliderVal, setSliderVal] = useState(100)

  const handleCreditCalibration = () => {
    if (!rulerRef.current) return
    const rect = rulerRef.current.getBoundingClientRect()
    const pixels = rect.width
    const mm = creditWidthMm
    const ppc = pixels / (mm / 10)
    onCalibrated(ppc)
  }

  const handleRulerCalibration = () => {
    if (!rulerRef.current) return
    const rect = rulerRef.current.getBoundingClientRect()
    const pixels = rect.width
    const ppc = pixels / rulerCm
    onCalibrated(ppc)
  }

  const handleScreenCalibration = () => {
    const ppc = screenDPI / 2.54
    onCalibrated(ppc)
  }

  const getRulerStyle = () => {
    if (method === 'credit') {
      return { width: `${creditWidthMm * (sliderVal / 100)}px` }
    }
    if (method === 'ruler') {
      return { width: `${rulerCm * 37.8 * (sliderVal / 100)}px` }
    }
    return { width: '200px' }
  }

  useEffect(() => {
    setSliderVal(100)
  }, [method])

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 md:p-8">
      <h2 className="text-2xl font-bold text-stone-900 mb-2">Screen Calibration</h2>
      <p className="text-stone-500 mb-6">
        Choose the most convenient method to calibrate your device's scale.
      </p>

      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setMethod('credit')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            method === 'credit'
              ? 'bg-stone-900 text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          💳 Credit Card
        </button>
        <button
          onClick={() => setMethod('ruler')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            method === 'ruler'
              ? 'bg-stone-900 text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          📏 Real Ruler
        </button>
        <button
          onClick={() => setMethod('screen')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            method === 'screen'
              ? 'bg-stone-900 text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          🖥️ Device Specs
        </button>
      </div>

      {method === 'credit' && (
        <div>
          <p className="text-stone-600 mb-4">
            Grab a credit or debit card and adjust the rectangle below so it has{' '}
            <strong>exactly the same size</strong> as your real card.
          </p>
          <div className="mb-6 p-6 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-center overflow-x-auto">
            <div
              ref={rulerRef}
              style={getRulerStyle()}
              className="h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg shadow-lg flex items-center justify-center text-white font-bold text-sm select-none"
            >
              <span className="opacity-90">CARD</span>
            </div>
          </div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Adjust size: <span className="text-amber-600">{sliderVal}%</span>
          </label>
          <input
            type="range"
            min={50}
            max={150}
            value={sliderVal}
            onChange={(e) => setSliderVal(Number(e.target.value))}
            className="w-full mb-6 accent-amber-500"
          />
          <button
            onClick={handleCreditCalibration}
            className="w-full px-6 py-3 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors shadow-sm"
          >
            Confirm Calibration
          </button>
        </div>
      )}

      {method === 'ruler' && (
        <div>
          <p className="text-stone-600 mb-4">
            Place a real ruler over the screen and adjust the segment below so it measures{' '}
            <strong>exactly {rulerCm} cm</strong> on the ruler.
          </p>
          <div className="mb-4">
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Segment size (cm)
            </label>
            <select
              value={rulerCm}
              onChange={(e) => setRulerCm(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-stone-800"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <option key={n} value={n}>
                  {n} cm
                </option>
              ))}
            </select>
          </div>
          <div className="mb-6 p-6 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-center overflow-x-auto">
            <div className="relative">
              <div
                ref={rulerRef}
                style={getRulerStyle()}
                className="h-12 bg-stone-900 rounded flex items-end justify-between px-1 pb-1"
              >
                {Array.from({ length: rulerCm + 1 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-px bg-stone-400"
                    style={{ height: i % 5 === 0 ? '16px' : '8px' }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-1 text-xs text-stone-500">
                <span>0</span>
                <span>{rulerCm} cm</span>
              </div>
            </div>
          </div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Fine-tune: <span className="text-amber-600">{sliderVal}%</span>
          </label>
          <input
            type="range"
            min={50}
            max={150}
            value={sliderVal}
            onChange={(e) => setSliderVal(Number(e.target.value))}
            className="w-full mb-6 accent-amber-500"
          />
          <button
            onClick={handleRulerCalibration}
            className="w-full px-6 py-3 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors shadow-sm"
          >
            Confirm Calibration
          </button>
        </div>
      )}

      {method === 'screen' && (
        <div>
          <p className="text-stone-600 mb-4">
            Enter your device's pixel density (DPI/PPI). You can find this in the manufacturer's specs.
          </p>
          <div className="mb-4">
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Device DPI / PPI
            </label>
            <input
              type="number"
              value={screenDPI}
              onChange={(e) => setScreenDPI(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-stone-800"
            />
          </div>
          <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200 text-sm text-amber-800">
            <strong>Tip:</strong> iPhones are usually ~326–460 DPI. Androids vary from 300 to 500+ DPI. Tablets are typically ~264 DPI.
          </div>
          <button
            onClick={handleScreenCalibration}
            className="w-full px-6 py-3 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors shadow-sm"
          >
            Confirm Calibration
          </button>
        </div>
      )}
    </div>
  )
}

function Measurement({
  pixelsPerCm,
  selectedSize,
  onSelectSize,
  onRecalibrate,
}: {
  pixelsPerCm: number
  selectedSize: number | null
  onSelectSize: (size: number) => void
  onRecalibrate: () => void
}) {
  const [displayMode, setDisplayMode] = useState<'grid' | 'single'>('grid')
  const [currentIndex, setCurrentIndex] = useState(12)
  const [showTable, setShowTable] = useState(false)

  const selectedRing = RING_SIZES.find((r) => r.size === selectedSize)
  const conversion = selectedSize ? CONVERSION_TABLE[selectedSize] : null

  const pxForMm = (mm: number) => (mm / 10) * pixelsPerCm

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 md:p-8 mb-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold text-stone-900">Measure Your Finger</h2>
            <p className="text-stone-500 text-sm">
              Tap the circle that fits your finger perfectly.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setDisplayMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                displayMode === 'grid'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setDisplayMode('single')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                displayMode === 'single'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              One by One
            </button>
          </div>
        </div>

        {displayMode === 'grid' ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {RING_SIZES.map((ring) => {
              const px = pxForMm(ring.diam * 10)
              const isSelected = selectedSize === ring.size
              return (
                <button
                  key={ring.size}
                  onClick={() => onSelectSize(ring.size)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-stone-200 hover:border-amber-300 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <div
                      style={{
                        width: `${px}px`,
                        height: `${px}px`,
                        minWidth: '24px',
                        minHeight: '24px',
                      }}
                      className={`rounded-full border-2 ${
                        isSelected ? 'border-amber-500' : 'border-stone-400'
                      }`}
                    />
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      isSelected ? 'text-amber-700' : 'text-stone-600'
                    }`}
                  >
                    {ring.size}
                  </span>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="mb-6 flex items-center gap-4">
              <button
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                className="w-10 h-10 rounded-full bg-stone-100 text-stone-700 font-bold hover:bg-stone-200 disabled:opacity-30 transition-colors"
              >
                ←
              </button>
              <span className="text-sm font-medium text-stone-500 w-24 text-center">
                Size {RING_SIZES[currentIndex]?.size}
              </span>
              <button
                onClick={() =>
                  setCurrentIndex(Math.min(RING_SIZES.length - 1, currentIndex + 1))
                }
                disabled={currentIndex === RING_SIZES.length - 1}
                className="w-10 h-10 rounded-full bg-stone-100 text-stone-700 font-bold hover:bg-stone-200 disabled:opacity-30 transition-colors"
              >
                →
              </button>
            </div>

            {(() => {
              const ring = RING_SIZES[currentIndex]
              const px = pxForMm(ring.diam * 10)
              const isSelected = selectedSize === ring.size
              return (
                <button
                  onClick={() => onSelectSize(ring.size)}
                  className={`flex flex-col items-center gap-4 p-8 rounded-2xl border-2 transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-stone-200 hover:border-amber-300 hover:bg-stone-50'
                  }`}
                >
                  <div
                    style={{
                      width: `${px}px`,
                      height: `${px}px`,
                      minWidth: '40px',
                      minHeight: '40px',
                    }}
                    className={`rounded-full border-3 ${
                      isSelected ? 'border-amber-500' : 'border-stone-500'
                    }`}
                  />
                  <div className="text-center">
                    <span
                      className={`text-2xl font-bold ${
                        isSelected ? 'text-amber-700' : 'text-stone-800'
                      }`}
                    >
                      {ring.size}
                    </span>
                    <p className="text-xs text-stone-400 mt-1">
                      {ring.diam.toFixed(2)} mm Ø
                    </p>
                  </div>
                </button>
              )
            })()}
          </div>
        )}
      </div>

      {selectedRing && conversion && (
        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6 md:p-8 mb-6">
          <h3 className="text-lg font-bold text-amber-900 mb-4">
            🎉 Your size is: {selectedRing.size}
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-amber-800 mb-4">
            <div>
              <span className="text-amber-600">Inner Diameter:</span>
              <p className="font-semibold">{selectedRing.diam.toFixed(2)} mm</p>
            </div>
            <div>
              <span className="text-amber-600">Circumference:</span>
              <p className="font-semibold">{selectedRing.circ} mm</p>
            </div>
          </div>

          <div className="border-t border-amber-200 pt-4">
            <p className="text-sm font-semibold text-amber-900 mb-2">International Sizes</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div className="bg-white rounded-lg p-3 border border-amber-100 text-center">
                <p className="text-amber-500 text-xs font-medium uppercase">US / CA</p>
                <p className="text-amber-900 font-bold text-lg">{conversion.us}</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-amber-100 text-center">
                <p className="text-amber-500 text-xs font-medium uppercase">UK / AU</p>
                <p className="text-amber-900 font-bold text-lg">{conversion.uk}</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-amber-100 text-center">
                <p className="text-amber-500 text-xs font-medium uppercase">EU</p>
                <p className="text-amber-900 font-bold text-lg">{conversion.eu}</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-amber-100 text-center">
                <p className="text-amber-500 text-xs font-medium uppercase">JP / CN</p>
                <p className="text-amber-900 font-bold text-lg">{conversion.jp}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 md:p-8 mb-6">
        <button
          onClick={() => setShowTable(!showTable)}
          className="w-full flex items-center justify-between text-left"
        >
          <h3 className="text-lg font-bold text-stone-900">📋 Full Conversion Chart</h3>
          <span className="text-stone-500 text-xl">{showTable ? '−' : '+'}</span>
        </button>

        {showTable && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500">
                  <th className="pb-2 pr-4 font-medium">Brazil</th>
                  <th className="pb-2 pr-4 font-medium">US / CA</th>
                  <th className="pb-2 pr-4 font-medium">UK / AU</th>
                  <th className="pb-2 pr-4 font-medium">EU</th>
                  <th className="pb-2 pr-4 font-medium">JP / CN</th>
                  <th className="pb-2 font-medium">Ø mm</th>
                </tr>
              </thead>
              <tbody>
                {RING_SIZES.map((ring) => {
                  const conv = CONVERSION_TABLE[ring.size]
                  const isSelected = selectedSize === ring.size
                  return (
                    <tr
                      key={ring.size}
                      onClick={() => onSelectSize(ring.size)}
                      className={`border-b border-stone-100 cursor-pointer transition-colors ${
                        isSelected ? 'bg-amber-50' : 'hover:bg-stone-50'
                      }`}
                    >
                      <td className="py-2 pr-4 font-semibold text-stone-800">{ring.size}</td>
                      <td className="py-2 pr-4 text-stone-600">{conv.us}</td>
                      <td className="py-2 pr-4 text-stone-600">{conv.uk}</td>
                      <td className="py-2 pr-4 text-stone-600">{conv.eu}</td>
                      <td className="py-2 pr-4 text-stone-600">{conv.jp}</td>
                      <td className="py-2 text-stone-600">{ring.diam.toFixed(2)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <button
        onClick={onRecalibrate}
        className="w-full px-6 py-3 rounded-xl bg-stone-200 text-stone-700 font-medium hover:bg-stone-300 transition-colors"
      >
        Recalibrate Screen
      </button>
    </div>
  )
}
