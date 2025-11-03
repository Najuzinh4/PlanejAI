import { Link } from 'react-router-dom';

export default function Home() {
  const handleImgError = (e) => {
    const el = e.currentTarget;
    const step = el.dataset.fallback || 'root';
    if (step === 'root') {
      el.src = '/assets/menina-estudando.png';
      el.dataset.fallback = 'assets';
    } else if (step === 'assets') {
      el.src = '/assets/ilustracao.png';
      el.dataset.fallback = 'done';
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#222222]">
      {/* Header */}
      <header className="container flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/planejai-icon.png" alt="PlanejAI" className="h-8 w-8" />
          <span className="text-xl font-semibold text-[#00B7E6]">PlanejAI</span>
        </Link>
        <Link to="/signup" className="text-sm font-medium text-[#222222] hover:text-[#7B42F6]">Log In</Link>
      </header>

      {/* Hero */}
      <main className="container grid min-h-[70vh] grid-cols-1 items-center gap-10 py-8 lg:min-h-[75vh] lg:grid-cols-2">
        {/* Left: copy */}
        <section>
          <h1 className="mb-4 text-4xl font-extrabold leading-tight text-[#222222] sm:text-5xl">
            Planeje seus estudos de forma inteligente
          </h1>
          <p className="mb-8 max-w-xl text-lg leading-relaxed text-[#555555]">
            Crie planos de estudo personalizados e otimizados com o poder da inteligência artificial.
          </p>

          <Link
            to="/signup"
            className="inline-flex items-center rounded-xl bg-[#7B42F6] px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-[#6b3aeb] focus:outline-none focus:ring-2 focus:ring-[#7B42F6]/30"
          >
            Comece agora
          </Link>
        </section>

        {/* Right: hero image */}
        <section className="relative flex items-center justify-center">
          <img
            src="/menina-estudando.png"
            data-fallback="root"
            onError={handleImgError}
            alt="Estudante estudando com PlanejAI"
            className="mx-auto max-w-[520px]"
          />
        </section>
      </main>
    </div>
  );
}


