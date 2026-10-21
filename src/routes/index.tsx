import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ChevronDown, Home, MapPin, Phone, Scissors, Send, Sparkles, Wrench } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { CATALOG, FREE, MAP_URL, MAX_URL, PHONE_DISPLAY, PHONE_TEL, PRICE_NOTE, buildRequest, priceFor } from "@/lib/services";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Швея в Дивногорском — ремонт и подгонка одежды, Новосибирск" },
      { name: "description", content: "Ремонт и подгонка одежды и домашнего текстиля с ценами от 150 ₽. Снятие мерок, консультация и подбор фурнитуры — бесплатно. Мкр. Дивногорский и Новомарусино, ул. Юности, 1. Цены ориентировочные." },
      { property: "og:title", content: "Швея в Дивногорском — ремонт и подгонка одежды" },
      { property: "og:description", content: "Работаю на дому рядом с вами. Материалы входят в стоимость. Заявка в MAX или по телефону." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const perks = [
  { icon: Home, text: "Работаю на дому, рядом с вами" },
  { icon: Wrench, text: "Есть всё необходимое оборудование" },
  { icon: Sparkles, text: "Материалы входят в стоимость" },
];

function Index() {
  const [selected, setSelected] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [copied, setCopied] = useState(false);

  const toggle = (item: string) =>
    setSelected((p) => (p.includes(item) ? p.filter((x) => x !== item) : [...p, item]));

  const sendToMax = async () => {
    try {
      await navigator.clipboard.writeText(buildRequest(selected, comment));
      setCopied(true);
    } catch {
      /* clipboard unavailable */
    }
    window.open(MAX_URL, "_blank", "noopener");
  };

  return (
    <div className="min-h-screen pb-28">
      {/* Hero */}
      <header className="mx-auto max-w-6xl px-5 pt-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Scissors className="h-4 w-4" /> Швея в Дивногорском
        </div>
      </header>
      <section className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-8 md:grid-cols-2 md:py-14">
        <div>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            Ремонт и подгонка одежды <span className="text-primary">в соседнем доме</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Подгоню и укорочу одежду, подошью шторы и тюль, починю домашний текстиль и фурнитуру.
          </p>
          <ul className="mt-6 space-y-3">
            {perks.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-secondary-foreground">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="font-semibold">{text}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 space-y-4">
            <div className="flex flex-wrap gap-3">
              <a href={PHONE_TEL} className="flex min-w-40 flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-soft transition hover:opacity-90">
                <Phone className="h-4 w-4" /> Позвонить
              </a>
              <a href={MAX_URL} target="_blank" rel="noopener" className="flex min-w-40 flex-1 items-center justify-center gap-2 rounded-full border border-primary bg-card px-6 py-3 font-semibold text-primary transition hover:bg-secondary">
                <Send className="h-4 w-4" /> Написать в MAX
              </a>
            </div>
            <a href="#services" className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition hover:text-primary">
              Выбрать услуги <ChevronDown className="h-4 w-4" />
            </a>
          </div>
        </div>
        <div className="stitch rounded-[2rem] p-2">
          <img src={hero} alt="Рабочее место швеи со швейной машинкой" width={1280} height={960} className="aspect-[4/3] w-full rounded-[1.6rem] object-cover" />
        </div>
      </section>

      {/* Services */}
      <section id="services" className="mx-auto max-w-6xl px-5 py-10">
        <h2 className="text-3xl font-semibold md:text-4xl">Каталог услуг</h2>
        <p className="mt-2 text-muted-foreground">Отметьте нужное — список уйдёт в заявку.</p>
        <p className="mt-1 text-sm text-accent">{PRICE_NOTE}</p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {CATALOG.map((cat) => (
            <article key={cat.num} className="rounded-3xl border border-border bg-card p-6">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-2xl font-semibold text-primary" style={{ fontFamily: "var(--font-display)" }}>{cat.num}</span>
                <h3 className="text-xl font-semibold">{cat.title}</h3>
              </div>
              {cat.groups.map((g, i) => (
                <div key={i} className="mt-4">
                  {g.title && <div className="mb-2 text-sm font-bold uppercase tracking-wide text-accent">{g.title}</div>}
                  <div className="flex flex-wrap gap-2">
                    {g.items.map((item) => {
                      const on = selected.includes(item.name);
                      return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => toggle(item.name)}
                        aria-pressed={on}
                        className={`flex min-w-32 flex-col rounded-2xl border px-3 py-1.5 text-left text-sm transition ${
                          on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary"
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          {on && <Check className="h-3.5 w-3.5" />}
                          {item.name}
                        </span>
                        <span className={`text-xs ${on ? "text-primary-foreground/80" : item.price === FREE ? "font-semibold text-accent" : "text-muted-foreground"}`}>
                          {item.price}
                        </span>
                      </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </article>
          ))}
        </div>
      </section>

      {/* Request */}
      <section id="request" className="mx-auto max-w-3xl px-5 py-10">
        <div className="stitch rounded-3xl bg-card p-6 md:p-8">
          <h2 className="text-3xl font-semibold">Заявка</h2>
          {selected.length ? (
            <ul className="mt-4 space-y-1 text-sm">
              {selected.map((x) => (
                <li key={x} className="flex justify-between gap-3 border-b border-border py-1.5">
                  {x}
                  <span className={`flex shrink-0 items-center gap-2 text-xs ${priceFor(x) === FREE ? "font-semibold text-accent" : "text-muted-foreground"}`}>
                    {priceFor(x)}
                    <button onClick={() => toggle(x)} className="text-base text-muted-foreground hover:text-primary" aria-label={`Убрать ${x}`}>×</button>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-muted-foreground">Услуги не выбраны — можно просто описать задачу.</p>
          )}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Комментарий: что за изделие, сроки…"
            rows={3}
            className="mt-4 w-full rounded-2xl border border-input bg-background p-3 outline-none focus:ring-2 focus:ring-ring"
          />
          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={sendToMax} className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-soft hover:opacity-90">
              <Send className="h-4 w-4" /> Отправить в MAX
            </button>
            <a href={PHONE_TEL} className="flex items-center gap-2 rounded-full border border-border px-6 py-3 font-semibold hover:bg-muted">
              <Phone className="h-4 w-4" /> Позвонить
            </a>
          </div>
          {copied && (
            <p className="mt-3 text-sm text-accent">Текст заявки скопирован — вставьте его в чат MAX.</p>
          )}
          <p className="mt-3 text-xs text-muted-foreground">{PRICE_NOTE}</p>
        </div>
      </section>

      {/* Contacts */}
      <footer className="mx-auto max-w-6xl px-5 py-10">
        <div className="grid gap-4 rounded-3xl bg-secondary p-6 text-secondary-foreground md:grid-cols-3">
          <a href={PHONE_TEL} className="flex items-center gap-3 font-semibold"><Phone className="h-5 w-5" /> {PHONE_DISPLAY}</a>
          <a href={MAX_URL} target="_blank" rel="noopener" className="flex items-center gap-3 font-semibold"><Send className="h-5 w-5" /> Написать в MAX</a>
          <a href={MAP_URL} target="_blank" rel="noopener" className="flex items-center gap-3 font-semibold"><MapPin className="h-5 w-5" /> Новосибирск, ул. Юности, 1 (2ГИС)</a>
        </div>
      </footer>

      {/* Mobile sticky bar */}
      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-card/95 p-3 backdrop-blur md:hidden">
        <div className="flex gap-2">
          <a href="#request" className="flex-1 rounded-full bg-primary py-3 text-center font-semibold text-primary-foreground">
            Заявка{selected.length ? ` (${selected.length})` : ""}
          </a>
          <a href={PHONE_TEL} className="grid w-14 place-items-center rounded-full border border-border" aria-label="Позвонить"><Phone className="h-5 w-5" /></a>
        </div>
      </div>
    </div>
  );
}
