export default function DashboardCard({ label, value, helper, icon: Icon }) {
  return (
    <article className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-ink/58">{label}</p>
          <strong className="mt-2 block text-3xl">{value}</strong>
        </div>
        {Icon && (
          <span className="rounded-md bg-champagne p-3 text-berry">
            <Icon size={22} />
          </span>
        )}
      </div>
      {helper && <p className="mt-4 text-sm text-ink/62">{helper}</p>}
    </article>
  );
}
