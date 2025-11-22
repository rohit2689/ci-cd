import React, { useMemo, useState } from "react";

'use client'


function startOfMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}
function endOfMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}
function daysInMonth(date: Date) {
    return endOfMonth(date).getDate();
}
function monthLabel(date: Date) {
    return date.toLocaleString(undefined, { month: "long", year: "numeric" });
}
function isSameDay(a: Date, b: Date) {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

export default function Page() {
    const today = useMemo(() => new Date(), []);
    const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(today));
    const [selected, setSelected] = useState<Date | null>(null);

    const weeks = useMemo(() => {
        // Build a 6x7 grid for weeks x weekdays
        const firstDay = startOfMonth(currentMonth);
        const firstWeekday = firstDay.getDay(); // 0 (Sun) - 6 (Sat)
        const totalDays = daysInMonth(currentMonth);

        // Previous month tail
        const prevMonthLastDay = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            0
        ).getDate();

        const cells: { date: Date; inMonth: boolean }[] = [];

        // Fill previous month's tail
        for (let i = firstWeekday - 1; i >= 0; i--) {
            const dayNum = prevMonthLastDay - i;
            const d = new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() - 1,
                dayNum
            );
            cells.push({ date: d, inMonth: false });
        }

        // Current month days
        for (let d = 1; d <= totalDays; d++) {
            cells.push({
                date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d),
                inMonth: true,
            });
        }

        // Next month leading days to fill 6x7
        const remaining = 42 - cells.length;
        for (let d = 1; d <= remaining; d++) {
            const dDate = new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() + 1,
                d
            );
            cells.push({ date: dDate, inMonth: false });
        }

        // split into weeks
        const weeksArr: { date: Date; inMonth: boolean }[][] = [];
        for (let i = 0; i < 6; i++) {
            weeksArr.push(cells.slice(i * 7, i * 7 + 7));
        }
        return weeksArr;
    }, [currentMonth]);

    function prevMonth() {
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
        );
    }
    function nextMonth() {
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
        );
    }
    function goToToday() {
        const s = startOfMonth(today);
        setCurrentMonth(s);
        setSelected(today);
    }

    return (
        <div style={styles.wrap}>
            <div style={styles.header}>
                <button onClick={prevMonth} aria-label="Previous month" style={styles.navBtn}>
                    ‹
                </button>
                <div style={styles.title}>{monthLabel(currentMonth)}</div>
                <button onClick={nextMonth} aria-label="Next month" style={styles.navBtn}>
                    ›
                </button>
            </div>

            <div style={styles.weekdays}>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((wd) => (
                    <div key={wd} style={styles.weekdayCell}>
                        {wd}
                    </div>
                ))}
            </div>

            <div style={styles.grid} role="grid" aria-label="Calendar">
                {weeks.map((week, wi) => (
                    <div key={wi} style={styles.weekRow} role="row">
                        {week.map((cell, di) => {
                            const d = cell.date;
                            const isToday = isSameDay(d, today);
                            const isSelected = selected ? isSameDay(d, selected) : false;
                            return (
                                <button
                                    key={di}
                                    role="gridcell"
                                    aria-selected={isSelected}
                                    onClick={() => setSelected(d)}
                                    style={{
                                        ...styles.day,
                                        background: isSelected ? "#2b6cb0" : "transparent",
                                        color: cell.inMonth ? (isSelected ? "white" : "#111827") : "#9CA3AF",
                                        border: isToday ? "1px solid #2b6cb0" : "1px solid transparent",
                                        opacity: cell.inMonth ? 1 : 0.6,
                                        cursor: "pointer",
                                    }}
                                >
                                    {d.getDate()}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>

            <div style={styles.footer}>
                <button onClick={goToToday} style={styles.todayBtn}>
                    Today
                </button>
                <div style={styles.selectedInfo}>
                    {selected ? `Selected: ${selected.toDateString()}` : "No date selected"}
                </div>
            </div>
        </div>
    );
}

const styles: { [k: string]: React.CSSProperties } = {
    wrap: {
        maxWidth: 420,
        margin: "24px auto",
        padding: 18,
        borderRadius: 12,
        border: "1px solid #E5E7EB",
        fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue'",
        background: "#fff",
    },
    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    navBtn: {
        background: "transparent",
        border: "none",
        fontSize: 20,
        padding: "6px 10px",
        cursor: "pointer",
    },
    title: {
        fontWeight: 600,
        fontSize: 16,
    },
    weekdays: {
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        textAlign: "center",
        fontSize: 12,
        color: "#6B7280",
        marginBottom: 6,
    },
    weekdayCell: {
        padding: "6px 0",
    },
    grid: {
        display: "grid",
        gap: 6,
    },
    weekRow: {
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
    },
    day: {
        height: 44,
        borderRadius: 8,
        border: "none",
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14,
    },
    footer: {
        marginTop: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    todayBtn: {
        background: "#F3F4F6",
        border: "none",
        padding: "8px 12px",
        borderRadius: 8,
        cursor: "pointer",
    },
    selectedInfo: {
        fontSize: 13,
        color: "#374151",
    },
};