import React, { useState, useEffect } from "react";
import socket from "../socket";

function CharacterStats({ roomCode }) {
    const [hp, setHp] = useState(100);
    const [stamina, setStamina] = useState(100);
    const [mana, setMana] = useState(100);
    const [playersStats, setPlayersStats] = useState({});

    // Function to update stats
    const updateStat = (statType, change) => {
        let newValue;
        if (statType === "hp") newValue = Math.max(0, Math.min(100, hp + change));
        if (statType === "stamina") newValue = Math.max(0, Math.min(100, stamina + change));
        if (statType === "mana") newValue = Math.max(0, Math.min(100, mana + change));

        if (statType === "hp") setHp(newValue);
        if (statType === "stamina") setStamina(newValue);
        if (statType === "mana") setMana(newValue);

        socket.emit("updateStats", { roomCode, statType, value: newValue });
    };

    // Listen for stat updates from other players
    useEffect(() => {
        socket.on("statsUpdate", (updatedStats) => {
            setPlayersStats(updatedStats);
        });

        return () => {
            socket.off("statsUpdate");
        };
    }, []);

    return (
        <div className="stats-container">
            <h2>Character Stats</h2>

            {/* HP Stat */}
            <div className="stat">
                <label>❤️ HP</label>
                <div className="stat-controls">
                    <button onClick={() => updateStat("hp", -10)}>-10</button>
                    <button onClick={() => updateStat("hp", -5)}>-5</button>
                    <button onClick={() => updateStat("hp", -1)}>-1</button>
                    <input type="text" value={hp} readOnly />
                    <button onClick={() => updateStat("hp", +1)}>+1</button>
                    <button onClick={() => updateStat("hp", +5)}>+5</button>
                    <button onClick={() => updateStat("hp", +10)}>+10</button>
                </div>
            </div>

            {/* Stamina Stat */}
            <div className="stat">
                <label>⚡ Stamina</label>
                <div className="stat-controls">
                    <button onClick={() => updateStat("stamina", -10)}>-10</button>
                    <button onClick={() => updateStat("stamina", -5)}>-5</button>
                    <button onClick={() => updateStat("stamina", -1)}>-1</button>
                    <input type="text" value={stamina} readOnly />
                    <button onClick={() => updateStat("stamina", +1)}>+1</button>
                    <button onClick={() => updateStat("stamina", +5)}>+5</button>
                    <button onClick={() => updateStat("stamina", +10)}>+10</button>
                </div>
            </div>

            {/* Mana Stat */}
            <div className="stat">
                <label>🔮 Mana</label>
                <div className="stat-controls">
                    <button onClick={() => updateStat("mana", -10)}>-10</button>
                    <button onClick={() => updateStat("mana", -5)}>-5</button>
                    <button onClick={() => updateStat("mana", -1)}>-1</button>
                    <input type="text" value={mana} readOnly />
                    <button onClick={() => updateStat("mana", +1)}>+1</button>
                    <button onClick={() => updateStat("mana", +5)}>+5</button>
                    <button onClick={() => updateStat("mana", +10)}>+10</button>
                </div>
            </div>

            {/* Other Players' Stats */}
            <h3>Other Players' Stats</h3>
            {Object.entries(playersStats).map(([player, stats]) => (
                <div key={player}>
                    <p>{player}</p>
                    <p>❤️ {stats.hp} | ⚡ {stats.stamina} | 🔮 {stats.mana}</p>
                </div>
            ))}
        </div>
    );
}

export default CharacterStats;
