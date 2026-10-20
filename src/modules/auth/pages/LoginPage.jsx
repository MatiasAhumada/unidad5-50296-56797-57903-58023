import LoginForm from '../components/LoginForm';
import '../styles/login.css';

function LoginPage() {
  return (
    <main className="login-page">
      <div className="ambient ambient--top" aria-hidden="true" />
      <div className="ambient ambient--bottom" aria-hidden="true" />
      <section className="login-shell" aria-labelledby="login-title">
        <div className="brand-lockup" aria-label="MedPortal">
          <div className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" focusable="false">
              <path d="M16 3.5 26 7v7.6c0 6.15-4.03 11.58-10 13.4-5.97-1.82-10-7.25-10-13.4V7l10-3.5Z" />
              <path d="M16 9.8v8.7M11.65 14.15h8.7" />
            </svg>
          </div>
          <p className="brand-name">MedPortal</p>
          <p className="brand-caption">Gestión de salud</p>
        </div>
        <LoginForm />
        <p className="login-footer">
          © 2026 MedPortal · Sistema de gestión para profesionales de la salud
        </p>
      </section>
    </main>
  );
}

export default LoginPage;
