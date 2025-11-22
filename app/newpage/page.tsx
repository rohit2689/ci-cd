import React from "react";

type Festival = {
    id: string;
    name: string;
    month: number; // 1-12
    day: number; // 1-31
    emoji?: string;
    description?: string;
};

const FESTIVALS: Festival[] = [
    { id: "newyear", name: "New Year's Day", month: 1, day: 1, emoji: "🎉", description: "Start the new year with hope and goals." },
    { id: "valentine", name: "Valentine's Day", month: 2, day: 14, emoji: "💖", description: "Celebrate love and friendship." },
    { id: "holi", name: "Holi", month: 3, day: 8, emoji: "🌈", description: "Festival of colors (date varies — sample fixed)." },
    { id: "easter", name: "Easter", month: 4, day: 21, emoji: "✝️", description: "Spring festival and celebration." },
    { id: "diwali", name: "Diwali", month: 11, day: 1, emoji: "🪔", description: "Festival of lights (date varies — sample fixed)." },
    { id: "halloween", name: "Halloween", month: 10, day: 31, emoji: "🎃", description: "Spooky costumes and treats." },
    { id: "thanksgiving", name: "Thanksgiving", month: 11, day: 28, emoji: "🦃", description: "Give thanks and enjoy a feast." },
    { id: "christmas", name: "Christmas", month: 12, day: 25, emoji: "🎄", description: "Holiday celebration and giving." },
];

function nextOccurrence(month: number, day: number, from = new Date()): Date {
    const year = from.getFullYear();
    const candidate = new Date(year, month - 1, day, 0, 0, 0, 0);
    if (isSameDate(candidate, from) || candidate >= startOfDay(from)) {
        // If it's today or later this year => use this year
        return candidate;
    }
    // Otherwise next year
    return new Date(year + 1, month - 1, day, 0, 0, 0, 0);
}

function startOfDay(d: Date) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}

function isSameDate(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function formatDate(d: Date) {
    return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

export default function Page() {
    const now = new Date();

    const upcoming = FESTIVALS.map((f) => {
        const date = nextOccurrence(f.month, f.day, now);
        const msPerDay = 1000 * 60 * 60 * 24;
        const diffMs = startOfDay(date).getTime() - startOfDay(now).getTime();
        const daysLeft = Math.round(diffMs / msPerDay);
        return { ...f, nextDate: date, daysLeft };
    })
        .sort((a, b) => a.nextDate.getTime() - b.nextDate.getTime())
        .slice(0, 6);

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
            <div className="max-w-5xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">Upcoming Festivals</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">Next events and how long until they happen.</p>
                </header>

                <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {upcoming.map((f) => (
                        <article
                            key={f.id}
                            className="flex flex-col justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 shadow-sm"
                        >
                            <div>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                            <span className="mr-2">{f.emoji}</span>
                                            {f.name}
                                        </h2>
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">{f.description}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-400">{formatDate(f.nextDate)}</p>
                                        <p className="mt-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                                            {f.daysLeft <= 0 ? "Today" : f.daysLeft === 1 ? "In 1 day" : `In ${f.daysLeft} days`}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <div className="w-full h-2 bg-indigo-100 dark:bg-indigo-900 rounded-full overflow-hidden">
                                    {/* visual progress toward the event within the year */}
                                    {(() => {
                                        const start = new Date(now.getFullYear(), 0, 1).getTime();
                                        const end = new Date(now.getFullYear() + 1, 0, 1).getTime();
                                        const progress = Math.min(
                                            100,
                                            Math.max(0, ((startOfDay(f.nextDate).getTime() - start) / (end - start)) * 100)
                                        );
                                        return <div style={{ width: `${progress}%` }} className="h-2 bg-indigo-500" />;
                                    })()}
                                </div>
                            </div>
                        </article>
                    ))}
                </section>

                <footer className="mt-8 text-center text-sm text-gray-500 dark:text-gray-300">
                    Sample festival dates are static for demonstration. Some festivals follow lunar or regional calendars and vary each year.
                </footer>
            </div>
        </main>
    );
}