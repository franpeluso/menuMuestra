export default function Footer() {
  return (
    <footer className="bg-[#721f22] text-stone-300 py-8 border-t border-[#8B262A]">
      <div className="max-w-4xl mx-auto px-4 text-center space-y-3">
        <p className="font-bold text-white tracking-widest text-sm uppercase">
          Nombre - Cafeteria
        </p>
        <p className="text-xs text-stone-300/80">
          © {new Date().getFullYear()} Todos los derechos reservados.
        </p>
        <div className="pt-2 text-xs">
          Desarrollado por{' '}
          <span className="font-extrabold text-white tracking-wider hover:text-red-300 transition-colors cursor-pointer">
            nextech Software Studio
          </span>
        </div>
      </div>
    </footer>
  );
}