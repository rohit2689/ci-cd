import React, { useEffect, useMemo, useState } from "react"

'use client'


type Match = {
    id: string
    series?: string
    teamA: string
    teamB: string
    venue?: string
    startTime: string // ISO string
    status?: string
}

const sampleMatches: Match[] = [
    {
        id: "1",
        series: "ICC World Test Championship",
        teamA: "India",
        teamB: "Australia",
        venue: "Wankhede, Mumbai",
        startTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
        status: "Upcoming",
    },
    {
        id: "2",
        series: "IPL",
        teamA: "Mumbai Indians",
        teamB: "Chennai Super Kings",
        venue: "Eden Gardens, Kolkata",
        startTime: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
        status: "Upcoming",
    },
    {
        id: "3",
        series: "T20 Tri-Series",
        teamA: "England",
        teamB: "Pakistan",
        venue: "Lords, London",
        startTime: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString(),
        status: "Upcoming",
    },
]

export default function Page() {
    const [matches, setMatches] = useState<Match[]>(sampleMatches)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [query, setQuery] = useState("")
    const [rangeDays, setRangeDays] = useState<number>(7)

    useEffect(() => {
        // Attempt to fetch real data from a custom API endpoint.
        // Replace '/api/cricket/upcoming' with your API endpoint or remove this effect if not needed.
        const fetchMatches = async () => {
            setLoading(true)
            setError(null)
            try {
                const res = await fetch("/api/cricket/upcoming")
                if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)
                const data = (await res.json()) as Match[]
                if (Array.isArray(data) && data.length) {
                    // convert/normalize dates if needed
                    setMatches(
                        data.map((m, i) => ({
                            id: m.id ?? String(i),
                            series: m.series,
                            teamA: m.teamA ?? m.team1 ?? "Team A",
                            teamB: m.teamB ?? m.team2 ?? "Team B",
                            venue: m.venue ?? m.location,
                            startTime: m.startTime ?? m.date ?? new Date().toISOString(),
                            status: m.status ?? "Upcoming",
                        }))
                    )
                }
            } catch (err: any) {
                // fallback to sampleMatches
                setError(err?.message ?? "Could not load matches; showing demo data.")
                setMatches(sampleMatches)
            } finally {
                setLoading(false)
            }
        }

        fetchMatches()
    }, [])

    const now = Date.now()
    const filtered = useMemo(() => {
        const maxTime = now + rangeDays * 24 * 60 * 60 * 1000
        return matches
            .filter((m) => {
                const t = new Date(m.startTime).getTime()
                return t >= now && t <= maxTime
            })
            .filter((m) => {
                if (!query.trim()) return true
                const q = query.toLowerCase()
                return (
                    (m.teamA ?? "").toLowerCase().includes(q) ||
                    (m.teamB ?? "").toLowerCase().includes(q) ||
                    (m.series ?? "").toLowerCase().includes(q) ||
                    (m.venue ?? "").toLowerCase().includes(q)
                )
            })
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    }, [matches, query, rangeDays, now])

    const formatDate = (iso: string) =>
        new Intl.DateTimeFormat("default", {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(new Date(iso))

    return (
        <main className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-5xl mx-auto">
                <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Upcoming Cricket Events</h1>
                        <p className="text-sm text-gray-500">Next matches and tournaments — powered by Tailwind CSS</p>
                    </div>

                    <div className="flex gap-3 items-center">
                        <input
                            aria-label="Search matches"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search team, series or venue..."
                            className="px-3 py-2 border border-gray-200 rounded-md bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />

                        <select
                            value={String(rangeDays)}
                            onChange={(e) => setRangeDays(Number(e.target.value))}
                            className="px-3 py-2 border border-gray-200 rounded-md bg-white text-sm shadow-sm"
                        >
                            <option value="1">Next 1 day</option>
                            <option value="3">Next 3 days</option>
                            <option value="7">Next 7 days</option>
                            <option value="30">Next 30 days</option>
                        </select>
                    </div>
                </header>

                {error && (
                    <div className="mb-4 p-3 rounded-md bg-yellow-50 text-yellow-800 border border-yellow-100 text-sm">
                        {error}
                    </div>
                )}

                <section>
                    {loading ? (
                        <div className="text-center py-12 text-gray-500">Loading matches...</div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">No upcoming matches found for the selected range.</div>
                    ) : (
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {filtered.map((m) => (
                                <li key={m.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="text-xs text-indigo-600 font-medium">{m.series}</div>
                                                <h2 className="text-lg font-semibold text-gray-900 mt-1">
                                                    {m.teamA} vs {m.teamB}
                                                </h2>
                                                <div className="text-sm text-gray-500 mt-1">{m.venue}</div>
                                            </div>
                                            <div className="text-sm text-right">
                                                <div className="text-gray-700 font-medium">{formatDate(m.startTime)}</div>
                                                <div className="text-xs text-gray-500 mt-1">{m.status}</div>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex gap-2">
                                            <button className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700">
                                                Add to Calendar
                                            </button>
                                            <button className="px-3 py-1.5 border border-gray-200 text-sm rounded-md hover:bg-gray-50">
                                                Match Details
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <footer className="mt-6 text-sm text-gray-400">
                    Note: This page uses demo data if no API endpoint is configured. Replace /api/cricket/upcoming with your data source.
                </footer>
            </div>
        </main>
    )
}</li>