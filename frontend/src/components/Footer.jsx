export default function Footer() {
  return (
    <footer className="border-t border-[#d4ccbd] bg-[#f7f4ec] text-[#514d44]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-xs sm:flex-row sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-center sm:text-left">
          <span className="font-serif text-sm text-[#29271f] font-normal tracking-wide">
            Remirind
          </span>
          <span className="hidden sm:inline text-[#d4ccbd]">|</span>
          <span className="tracking-wide">
            &copy; {new Date().getFullYear()} All rights reserved.
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs tracking-wide">
          <span>Curated by <strong className="font-medium text-[#29271f]">Ishaan Ray</strong></span>
          <span className="text-[#d4ccbd]">|</span>
          <a
            href="https://github.com/Cipher-Shadow-IR"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#514d44] transition-colors hover:text-[#8b713a]"
            aria-label="GitHub Profile"
          >
            GitHub
          </a>
          <span className="text-[#d4ccbd]">|</span>
          <a
            href="https://linkedin.com/in/ishaan-ray-cs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#514d44] transition-colors hover:text-[#8b713a]"
            aria-label="LinkedIn Profile"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
