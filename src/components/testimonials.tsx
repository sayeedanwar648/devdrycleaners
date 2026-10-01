import { copy } from "@/lib/i18n";
import { useAppStore } from "@/store/app-store";

export function Testimonials() {
  const lang = useAppStore((s) => s.lang);
  const t = copy[lang];

  return (
    <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <h2 className="font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
        {t.storiesTitle}
      </h2>
      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {t.stories.map((story) => (
          <li
            key={story.name}
            className="flex flex-col rounded-2xl border border-border bg-ivory p-6"
          >
            <p className="flex-1 font-display text-xl leading-snug text-ink">
              {story.quote}
            </p>
            <p className="mt-6 text-sm font-medium text-ink">{story.name}</p>
            <p className="text-sm text-muted">{story.place}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
