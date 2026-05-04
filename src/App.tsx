import { useEffect, useRef, useState } from 'react'
import AdLayout from './components/AdLayout'

// Brazilian ring sizes — proper diameters (mm) and circumferences (mm)
// Formula: diameter = 12.5 + (size - 10) * 0.5
// Circumference = diameter * π
const RING_SIZES = Array.from({ length: 26 }, (_, i) => {
  const size = 10 + i
  const diam = 12.5 + (size - 10) * 0.5
  const circ = diam * Math.PI
  return { size, diam, circ }
})

// Conversion table: Brazilian size → US, UK, EU, JP/CN
const CONVERSION_TABLE: Record<
  number,
  { us: number | string; uk: string; eu: number; jp: number }
> = {
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

function estimatePPI(): number {
  const dpr = window.devicePixelRatio || 1
  const ua = navigator.userAgent
  const sw = window.screen.width
  const sh = window.screen.height

  // iPhones — known PPI values by model range
  if (/iPhone/.test(ua)) {
    if (dpr === 3) {
      // iPhone 12/13/14/15/16 Pro/Pro Max, XS/X/11 Pro
      if (sw === 430 || sw === 393) return 460 // Pro Max, Pro
      if (sw === 390) return 476 // iPhone 12/13 mini
      return 460
    }
    if (dpr === 2) {
      // iPhone SE, XR, 11, older
      if (sw === 414) return 326 // iPhone XR/11
      if (sw === 375) return 326 // iPhone SE (2nd/3rd), 8, etc.
      return 326
    }
    return 326
  }

  // iPads
  if (
    /iPad/.test(ua) ||
    (sw === 1024 && dpr === 2) ||
    (sw === 834 && dpr === 2)
  ) {
    return 264
  }

  // Android phones
  if (/Android/.test(ua)) {
    // Small screens = phone
    if (Math.min(sw, sh) < 600) {
      if (dpr >= 3.5) return 520
      if (dpr >= 3) return 400
      if (dpr >= 2.5) return 360
      if (dpr === 2) return 300
      return 240
    }
    // Larger screens = tablet
    if (Math.min(sw, sh) < 900) {
      return 264
    }
  }

  // Desktop / laptop
  if (dpr === 1) return 96
  if (dpr === 2) {
    // Retina Macs
    if (/Mac/.test(ua)) {
      // 13-inch MacBook Air/Pro = 227 PPI, 14/16-inch = 254 PPI
      if (sw >= 1512) return 254
      return 227
    }
    return 150
  }

  return 96 * dpr
}

function getInitialScale(): number {
  const ppi = estimatePPI()
  // pixels per mm = PPI / 25.4
  const pxPerMm = ppi / 25.4
  return pxPerMm
}

type Step = 'tutorial' | 'measurement'

export default function App() {
  const [step, setStep] = useState<Step>('tutorial')
  const [tutorialPage, setTutorialPage] = useState(0)
  const [pxPerMm, setPxPerMmState] = useState<number>(() => {
    const saved = localStorage.getItem('ringSizerPxPerMm')
    if (saved) {
      const parsed = parseFloat(saved)
      if (!isNaN(parsed) && parsed > 0) return parsed
    }
    return getInitialScale()
  })

  const setPxPerMm = (newVal: number) => {
    setPxPerMmState(newVal)
    localStorage.setItem('ringSizerPxPerMm', newVal.toString())
  }

  const [selectedSize, setSelectedSize] = useState<number | null>(null)
  const [showCalibrate, setShowCalibrate] = useState(false)

  const finishTutorial = () => {
    setStep('measurement')
  }

  return (
    <AdLayout>
      <header className="bg-stone-900 text-stone-50 py-4 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-tight">
            💍 Ring Sizer
          </h1>
          <span className="text-xs text-stone-400">Precise &amp; Free</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {step === 'tutorial' && (
          <Tutorial
            page={tutorialPage}
            setPage={setTutorialPage}
            onFinish={finishTutorial}
          />
        )}
        {step === 'measurement' && (
          <>
            {showCalibrate && (
              <Calibration
                estimatedPpi={estimatePPI()}
                pxPerMm={pxPerMm}
                onCalibrated={(newPxPerMm) => {
                  setPxPerMm(newPxPerMm)
                  setShowCalibrate(false)
                }}
                onCancel={() => setShowCalibrate(false)}
              />
            )}
            <Measurement
              pxPerMm={pxPerMm}
              onScaleChange={setPxPerMm}
              selectedSize={selectedSize}
              onSelectSize={setSelectedSize}
              onOpenCalibrate={() => setShowCalibrate(true)}
            />
          </>
        )}
      </div>
    </AdLayout>
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
            This app helps you find your exact ring size so you can shop online
            with confidence.
          </p>
          <p className="text-stone-600 leading-relaxed mt-3">
            We automatically detect your screen size, then you can fine-tune if
            needed. Place your finger over the circles — the one that fits is
            your size!
          </p>
        </>
      ),
    },
    {
      title: 'How does it work?',
      content: (
        <>
          <p className="text-stone-600 leading-relaxed">
            <strong>1. Auto-detect:</strong> We estimate your device's screen
            density so circles appear at real-world size.
          </p>
          <p className="text-stone-600 leading-relaxed mt-3">
            <strong>2. Fine-tune:</strong> Use the slider to adjust if the
            circles look too big or small. You can also calibrate with a credit
            card for maximum accuracy.
          </p>
          <p className="text-stone-600 leading-relaxed mt-3">
            <strong>3. Measure:</strong> Place your finger over the circles. The
            one that fits perfectly is your size!
          </p>
        </>
      ),
    },
    {
      title: 'Important Tips',
      content: (
        <>
          <ul className="list-disc list-inside text-stone-600 space-y-2 leading-relaxed">
            <li>
              Use the app in <em>landscape</em> orientation for better accuracy.
            </li>
            <li>
              Remove thick phone cases — they lift your finger away from the
              screen.
            </li>
            <li>
              Measure your finger in the evening, when it is slightly swollen.
            </li>
            <li>
              Do not force your finger — the ring should slide on with gentle
              resistance.
            </li>
            <li>
              Compare with a ring you already own by placing it on the circles.
            </li>
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
  estimatedPpi,
  pxPerMm,
  onCalibrated,
  onCancel,
}: {
  estimatedPpi: number
  pxPerMm: number
  onCalibrated: (pxPerMm: number) => void
  onCancel: () => void
}) {
  const [method, setMethod] = useState<'credit' | 'ruler'>('credit')
  const [sliderVal, setSliderVal] = useState(100)
  const cardRef = useRef<HTMLDivElement>(null)
  const rulerRef = useRef<HTMLDivElement>(null)
  const [rulerCm, setRulerCm] = useState(5)

  const basePxPerMm = pxPerMm

  const getCardStyle = (): React.CSSProperties => {
    const mm = 85.6 // credit card width
    const basePx = mm * basePxPerMm * (sliderVal / 100)
    return { width: `${basePx}px`, minWidth: '120px' }
  }

  const getRulerStyle = (): React.CSSProperties => {
    const mm = rulerCm * 10
    const basePx = mm * basePxPerMm * (sliderVal / 100)
    return { width: `${basePx}px`, minWidth: '120px' }
  }

  const handleCreditCalibrate = () => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const newPxPerMm = rect.width / 85.6
    onCalibrated(newPxPerMm)
  }

  const handleRulerCalibrate = () => {
    if (!rulerRef.current) return
    const rect = rulerRef.current.getBoundingClientRect()
    const newPxPerMm = rect.width / (rulerCm * 10)
    onCalibrated(newPxPerMm)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 md:p-8 mb-6">
      <h2 className="text-2xl font-bold text-stone-900 mb-2">
        Calibrate Screen
      </h2>
      <p className="text-stone-500 mb-4">
        Estimated screen density: <strong>{estimatedPpi} PPI</strong>. Adjust
        below for accuracy.
      </p>

      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => {
            setMethod('credit')
            setSliderVal(100)
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            method === 'credit'
              ? 'bg-stone-900 text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          💳 Credit Card
        </button>
        <button
          onClick={() => {
            setMethod('ruler')
            setSliderVal(100)
          }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            method === 'ruler'
              ? 'bg-stone-900 text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          📏 Ruler
        </button>
      </div>

      {method === 'credit' && (
        <div>
          <p className="text-stone-600 mb-4 text-sm">
            Place a real credit/debit card over the rectangle below. Adjust the
            slider until they match exactly.
          </p>
          <div className="mb-6 p-6 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-center overflow-x-auto">
            <div
              ref={cardRef}
              style={getCardStyle()}
              className="h-32 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl shadow-lg flex flex-col items-center justify-center text-white font-bold select-none"
            >
              <span className="text-lg opacity-90">CREDIT</span>
              <span className="text-xs opacity-70 mt-1">85.6 mm</span>
            </div>
          </div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Adjust: <span className="text-amber-600">{sliderVal}%</span>
          </label>
          <input
            type="range"
            min={30}
            max={200}
            value={sliderVal}
            onChange={(e) => setSliderVal(Number(e.target.value))}
            className="w-full mb-6 accent-amber-500"
          />
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-3 rounded-xl bg-stone-200 text-stone-700 font-medium hover:bg-stone-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreditCalibrate}
              className="flex-[2] px-6 py-3 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors shadow-sm"
            >
              Confirm Calibration
            </button>
          </div>
        </div>
      )}

      {method === 'ruler' && (
        <div>
          <p className="text-stone-600 mb-4 text-sm">
            Place a real ruler over the segment below. Adjust the slider until
            they match exactly.
          </p>
          <div className="mb-4">
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Segment length
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
                className="h-14 bg-stone-900 rounded flex items-end justify-between px-1 pb-1"
              >
                {Array.from({ length: rulerCm + 1 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-px bg-stone-400"
                    style={{ height: i % 5 === 0 ? '20px' : '10px' }}
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
            Adjust: <span className="text-amber-600">{sliderVal}%</span>
          </label>
          <input
            type="range"
            min={30}
            max={200}
            value={sliderVal}
            onChange={(e) => setSliderVal(Number(e.target.value))}
            className="w-full mb-6 accent-amber-500"
          />
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-3 rounded-xl bg-stone-200 text-stone-700 font-medium hover:bg-stone-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleRulerCalibrate}
              className="flex-[2] px-6 py-3 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors shadow-sm"
            >
              Confirm Calibration
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function Measurement({
  pxPerMm,
  onScaleChange,
  selectedSize,
  onSelectSize,
  onOpenCalibrate,
}: {
  pxPerMm: number
  onScaleChange: (v: number) => void
  selectedSize: number | null
  onSelectSize: (size: number) => void
  onOpenCalibrate: () => void
}) {
  const [displayMode, setDisplayMode] = useState<'grid' | 'single'>('grid')
  const [currentIndex, setCurrentIndex] = useState(12)
  const [showTable, setShowTable] = useState(false)
  const [scaleSlider, setScaleSlider] = useState(100)
  const pxPerMmRef = useRef(pxPerMm)
  const isDraggingRef = useRef(false)

  const selectedRing = RING_SIZES.find((r) => r.size === selectedSize)
  const conversion = selectedSize ? CONVERSION_TABLE[selectedSize] : null

  // Keep pxPerMmRef in sync with pxPerMm
  useEffect(() => {
    pxPerMmRef.current = pxPerMm
  }, [pxPerMm])

  // Effective scale combines the base pxPerMm with the user's real-time slider
  const effectivePxPerMm = pxPerMm * (scaleSlider / 100)

  const pxForMm = (mm: number) => mm * effectivePxPerMm

  // Update base scale immediately when slider changes, but limit to reasonable range
  const handleScaleChange = (val: number) => {
    // Limit to 30%-170% to prevent extreme scaling
    const clamped = Math.max(30, Math.min(170, val))
    setScaleSlider(clamped)
    isDraggingRef.current = true
  }

  // Reset slider after user stops interacting (on mouseUp/touchEnd)
  const handleScaleRelease = () => {
    if (isDraggingRef.current && scaleSlider !== 100) {
      // Calculate new scale and update
      const newScale = pxPerMmRef.current * (scaleSlider / 100)
      onScaleChange(newScale)
      setScaleSlider(100)
      isDraggingRef.current = false
    }
  }

  return (
    <div>
      {/* Scale fine-tune bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-4 mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-stone-700 whitespace-nowrap">
            🔧 Scale:
          </span>
          <input
            type="range"
            min={30}
            max={170}
            value={scaleSlider}
            onChange={(e) => handleScaleChange(Number(e.target.value))}
            onMouseUp={handleScaleRelease}
            onTouchEnd={handleScaleRelease}
            className="flex-1 min-w-[120px] accent-amber-500"
          />
          <span className="text-sm font-mono text-stone-500 w-12 text-right">
            {scaleSlider}%
          </span>
          <button
            onClick={onOpenCalibrate}
            className="px-3 py-1.5 rounded-lg bg-stone-100 text-stone-600 text-xs font-medium hover:bg-stone-200 transition-colors whitespace-nowrap"
          >
            Calibrate
          </button>
        </div>
        <p className="text-xs text-stone-400 mt-2">
          If circles look too small or big, adjust above. For best accuracy, use
          Calibrate with a credit card.
        </p>
      </div>

      {/* Measurement circles */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 md:p-8 mb-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold text-stone-900">
              Measure Your Finger
            </h2>
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
              const px = pxForMm(ring.diam)
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
                  setCurrentIndex(
                    Math.min(RING_SIZES.length - 1, currentIndex + 1),
                  )
                }
                disabled={currentIndex === RING_SIZES.length - 1}
                className="w-10 h-10 rounded-full bg-stone-100 text-stone-700 font-bold hover:bg-stone-200 disabled:opacity-30 transition-colors"
              >
                →
              </button>
            </div>

            {(() => {
              const ring = RING_SIZES[currentIndex]
              const px = pxForMm(ring.diam)
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
                    className={`rounded-full border-[3px] ${
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
                      {ring.diam.toFixed(1)} mm Ø
                    </p>
                  </div>
                </button>
              )
            })()}
          </div>
        )}
      </div>

      {/* Result card */}
      {selectedRing && conversion && (
        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6 md:p-8 mb-6">
          <h3 className="text-lg font-bold text-amber-900 mb-4">
            🎉 Your size is: {selectedRing.size}
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-amber-800 mb-4">
            <div>
              <span className="text-amber-600">Inner Diameter:</span>
              <p className="font-semibold">{selectedRing.diam.toFixed(1)} mm</p>
            </div>
            <div>
              <span className="text-amber-600">Circumference:</span>
              <p className="font-semibold">{selectedRing.circ.toFixed(1)} mm</p>
            </div>
          </div>

          <div className="border-t border-amber-200 pt-4">
            <p className="text-sm font-semibold text-amber-900 mb-2">
              International Sizes
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div className="bg-white rounded-lg p-3 border border-amber-100 text-center">
                <p className="text-amber-500 text-xs font-medium uppercase">
                  US / CA
                </p>
                <p className="text-amber-900 font-bold text-lg">
                  {conversion.us}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-amber-100 text-center">
                <p className="text-amber-500 text-xs font-medium uppercase">
                  UK / AU
                </p>
                <p className="text-amber-900 font-bold text-lg">
                  {conversion.uk}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-amber-100 text-center">
                <p className="text-amber-500 text-xs font-medium uppercase">
                  EU
                </p>
                <p className="text-amber-900 font-bold text-lg">
                  {conversion.eu}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-amber-100 text-center">
                <p className="text-amber-500 text-xs font-medium uppercase">
                  JP / CN
                </p>
                <p className="text-amber-900 font-bold text-lg">
                  {conversion.jp}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full conversion table */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 md:p-8 mb-6">
        <button
          onClick={() => setShowTable(!showTable)}
          className="w-full flex items-center justify-between text-left"
        >
          <h3 className="text-lg font-bold text-stone-900">
            📋 Full Conversion Chart
          </h3>
          <span className="text-stone-500 text-xl">
            {showTable ? '−' : '+'}
          </span>
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
                      <td className="py-2 pr-4 font-semibold text-stone-800">
                        {ring.size}
                      </td>
                      <td className="py-2 pr-4 text-stone-600">{conv.us}</td>
                      <td className="py-2 pr-4 text-stone-600">{conv.uk}</td>
                      <td className="py-2 pr-4 text-stone-600">{conv.eu}</td>
                      <td className="py-2 pr-4 text-stone-600">{conv.jp}</td>
                      <td className="py-2 text-stone-600">
                        {ring.diam.toFixed(1)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
