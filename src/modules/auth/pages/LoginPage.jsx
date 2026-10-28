import LoginForm from '../components/LoginForm';

function LoginPage({ title, redirectPath }) {
  return (
    <div
      className="
      flex
      flex-col
      justify-center
      h-[100dvh]
      bg-neutral-100
      sm:items-center
    "
    >
      <LoginForm title={title} redirectPath={redirectPath} />
    </div>
  );
}

export default LoginPage;
