import { useNavigate } from 'react-router-dom';

export default function BreadcrumbNav({
  parentLabel,
  parentRoute,
  currentLabel,
}) {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center gap-2 text-xs font-medium text-med-text-muted">
      <button
        type="button"
        onClick={() => navigate(parentRoute)}
        className="hover:text-med-primary-900 transition-colors cursor-pointer"
      >
        {parentLabel}
      </button>
      <span>›</span>
      <span className="font-semibold text-med-primary-900">{currentLabel}</span>
    </nav>
  );
}
