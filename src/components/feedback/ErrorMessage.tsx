export function ErrorMessage({
  message,
  id,
  children,
}: {
  message?: string;
  id?: string;
  children?: React.ReactNode;
}) {
  const text = message ?? children;
  if (!text) return null;
  return (
    <p
      id={id}
      role="alert"
      className="mt-2 text-sm text-destructive"
    >
      {text}
    </p>
  );
}
