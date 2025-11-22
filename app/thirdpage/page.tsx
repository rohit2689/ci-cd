'use client'

import { useState } from "react"

export default function Page() {
  const [selected, setSelected] = useState<Date | null>(null)

  const days = Array.from({ length: 30 }, (_, i) => i + 1)

  return (
    <main style={styles.wrap}>
      <h1 style={styles.title}>Simple Calendar Test</h1>

      <div style={styles.grid}>
        {days.map((d) => (
          <button
            key={d}
            onClick={() => setSelected(new Date(2025, 0, d))}
            style={{
              ...styles.day,
              background: selected?.getDate() === d ? "#4F46E5" : "#F3F4F6",
              color: selected?.getDate() === d ? "white" : "#111827",
            }}
          >
            {d}
          </button>
        ))}
      </div>

      <p style={styles.info}>
        {selected ? `Selected: ${selected.toDateString()}` : "Pick a date"}
      </p>
    </main>
  )
}

const styles: any = {
  wrap: {
    padding: 20,
    maxWidth: 400,
    margin: "30px auto",
    fontFamily: "sans-serif",
    background: "white",
    border: "1px solid #E5E7EB",
    borderRadius: 10,
  },
  title: { fontSize: 20, marginBottom: 10, fontWeight: 600 },
  grid: {
    d
