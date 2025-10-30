import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[#222222]">
      {/* Header */}
      <header className="container flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/planejai-icon.png" alt="PlanejAI" className="h-8 w-8" />
          <span className="text-xl font-semibold text-[#00B7E6]">PlanejAI</span>
        </Link>
        <Link to="/login" className="text-sm font-medium text-[#222222] hover:text-[#7B42F6]">Log In</Link>
      </header>

      {/* Hero */}
      <main className="container grid min-h-[70vh] grid-cols-1 items-center gap-10 py-8 lg:min-h-[75vh] lg:grid-cols-2">
        {/* Left: copy */}
        <section><h1 className="mb-4 text-4xl font-extrabold leading-tight text-[#222222] sm:text-5xl">
            Planeje seus estudos de forma inteligente
          </h1>
          <p className="mb-8 max-w-xl text-lg leading-relaxed text-[#555555]">
            Crie planos de estudo personalizados e otimizados com o poder da inteligência artificial.
          </p>

          <Link
            to="/login"
            className="inline-flex items-center rounded-xl bg-[#7B42F6] px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-[#6b3aeb] focus:outline-none focus:ring-2 focus:ring-[#7B42F6]/30"
          >
            Comece agora
          </Link>
        </section>

        {/* Right: illustration with floating icons */}
        <section className="relative">
          <img
            src="/assets/ilustracao.png" onError={(e) => { e.currentTarget.src = "/planejai-icon.png"; }}
            alt="Estudante usando IA para planejar estudos"
            className="mx-auto max-w-[520px]"
          />

          {/* Floating icons */}
          <div className="pointer-events-none">
            {/* Calendar */}
            <div className="absolute -top-4 right-14 hidden rounded-xl bg-white p-3 shadow-lg ring-1 ring-black/5 sm:block">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="16" rx="2" stroke="#7B42F6" strokeWidth="2"/>
                <path d="M8 2V6M16 2V6M3 10H21" stroke="#7B42F6" strokeWidth="2"/>
              </svg>
            </div>
            {/* Checklist */}
            <div className="absolute top-24 -left-4 hidden rounded-xl bg-white p-3 shadow-lg ring-1 ring-black/5 sm:block">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 7H20M9 12H20M9 17H20" stroke="#7B42F6" strokeWidth="2" strokeLinecap="round"/>
                <path d="M4 7l1.5 1.5L7 7l-1.5-1.5L4 7zM4 12l1.5 1.5L7 12l-1.5-1.5L4 12zM4 17l1.5 1.5L7 17l-1.5-1.5L4 17z" fill="#7B42F6"/>
              </svg>
            </div>
            {/* AI bubble */}
            <div className="absolute bottom-4 right-6 hidden rounded-full bg-white px-4 py-2 shadow-lg ring-1 ring-black/5 sm:block">
              <span className="font-semibold text-[#7B42F6]">AI</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

