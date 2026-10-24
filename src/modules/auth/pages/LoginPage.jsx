import LoginForm from '../components/LoginForm';

function LoginPage() {
  return (
    <main className="relative isolate grid min-h-dvh place-items-center overflow-hidden bg-[radial-gradient(circle_at_50%_38%,rgba(10,81,137,.72),transparent_34%),linear-gradient(135deg,#012644_0%,#063b66_54%,#011d37_100%)] px-4 py-[22px] sm:px-5 sm:py-9">
      <div
        className="pointer-events-none absolute -top-[175px] -left-[140px] -z-10 h-[370px] w-[370px] rotate-[14deg] rounded-[18px] border border-[rgba(111,199,239,.09)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-[160px] -bottom-[190px] -z-10 h-[370px] w-[370px] rotate-[-16deg] rounded-[18px] border border-[rgba(111,199,239,.09)]"
        aria-hidden="true"
      />
      <section className="w-full max-w-[520px]" aria-labelledby="login-title">
        <div className="mb-6 text-center text-white" aria-label="MedPortal">
          <div
            className="mx-auto mb-3 grid h-[60px] w-[60px] place-items-center rounded-lg border border-white/80 bg-[#f8fcff] shadow-[0_12px_35px_rgba(0,12,30,.22)]"
            aria-hidden="true"
          >
            <svg
              className="h-8 w-8 fill-none stroke-[#073b69] [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:1.8]"
              viewBox="0 0 32 32"
              focusable="false"
            >
              <path d="M16 3.5 26 7v7.6c0 6.15-4.03 11.58-10 13.4-5.97-1.82-10-7.25-10-13.4V7l10-3.5Z" />
              <path d="M16 9.8v8.7M11.65 14.15h8.7" />
            </svg>
          </div>
          <p className="m-0 font-[Manrope,sans-serif] text-2xl font-semibold tracking-[-.02em]">
            MedPortal
          </p>
          <p className="mt-1 mb-0 text-xs tracking-[.12em] text-[#a8d8ee] uppercase">
            Gestión de salud
          </p>
        </div>
        <LoginForm />
        <p className="mt-5 mb-0 text-center text-xs text-[rgba(218,239,249,.66)]">
          © 2026 MedPortal · Sistema de gestión para profesionales de la salud
        </p>
      </section>
    </main>
  );
}

export default LoginPage;
