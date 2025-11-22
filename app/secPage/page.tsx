'use client'

import React, { useState } from "react"

type Match = {
  id: string
  teamA: string
  teamB: string
  startTime: string
}

const sampleMatches: Match[] = [
  { id: "1", teamA: "India", teamB: "Australia", startTime: new Date().toISOString() },
  { id: "2", teamA: "England", teamB: "Pakistan", startTime: new Date().toISOString() },
]

export default function Page() {
  const [matches] = useState<Match[]>(sampleMatches)

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">Upcoming Cricket Matches</h1>
      <ul>
        {matches.map((m) => (
          <li key={m.id} className="mb-2 p-2 border rounded">
            {m.teamA} vs {m.teamB} — {new Date(m.startTime).toLocaleString()}
          </li>
        ))}
      </ul>
    </main>
  )
}
