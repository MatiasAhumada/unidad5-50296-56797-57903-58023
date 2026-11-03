function AuthFormError({ message }) {
  if (!message) {
    return null;
  }

  return (
    <p
      className="rounded-lg border border-red-200 bg-red-50 p-3 text-center text-xs text-red-700"
      role="alert"
      aria-live="assertive"
    >
      {message}
    </p>
  );
}

export default AuthFormError;
