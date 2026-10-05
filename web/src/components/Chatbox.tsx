import React, { useState, useRef, useEffect } from "react";
import type { ChatLogEntry } from "../types";

interface Props {
  messages: ChatLogEntry[];
  width?: string;
}

const FILTERS = ["All", "Game", "Public", "Combat", "Loot"] as const;

export const Chatbox: React.FC<Props> = ({ messages, width = "74%" }) => {
  const [expanded, setExpanded] = useState(false);
  const [filter, setFilter] = useState<string>("All");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const filtered = filter === "All" ? messages : messages;

  return (
    <div style={{
      width, maxWidth: 320, position: "absolute", bottom: 0, left: 0, zIndex: 5,
      background: "rgba(20,16,12,0.88)", borderRadius: "0 6px 0 0",
      border: "1.5px solid #6B583E", borderTop: "none", borderLeft: "none",
      padding: 3, boxSizing: "border-box",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "2px 4px", background: "#28221B", borderRadius: 3, marginBottom: 2 }}>
        <span style={{ color: "#FFEE33", fontSize: 9, fontWeight: "bold", textShadow: "1px 1px 1px #000" }}>📜 Chat</span>
        <button onClick={() => setExpanded(!expanded)} style={{ background: "#382F25", border: "none", borderRadius: 2, width: 18, height: 18, cursor: "pointer", color: "#FFEE33", fontSize: 10 }}>
          {expanded ? "▼" : "▲"}
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ height: expanded ? 130 : 64, overflowY: "auto", padding: "2px 4px" }}>
        {filtered.slice(-20).map(log => (
          <div key={log.id} style={{ color: log.color, fontSize: 10, lineHeight: "14px", textShadow: "1px 1px 1px #000" }}>
            {log.message}
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 1, padding: "1px 0", overflowX: "auto" }}>
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "1px 4px", border: "none", borderRadius: 2, cursor: "pointer",
              fontSize: 7, fontWeight: filter === f ? "bold" : "normal",
              background: filter === f ? "#4A3A22" : "transparent",
              color: filter === f ? "#FFEE33" : "#8C8070",
              textShadow: "1px 1px 1px #000", whiteSpace: "nowrap",
            }}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );
};
