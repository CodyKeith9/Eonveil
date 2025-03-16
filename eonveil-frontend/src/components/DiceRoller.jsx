import React, { useState, useEffect } from "react";
import socket from "../socket";

function DiceRoller({ roomCode }) {
    const [rollResult, setRollResult] = useState(null);

    // Listen for dice roll updates
    useEffect(() => {
        socket.on("diceRollResult", ({ username, sides, roll }) => {
            setRollResult(`${username} rolled a D${sides}: ${roll}`);
        });

        return () => {
            socket.off("diceRollResult");
        };
    }, []);

    // Handle rolling a die
    const rollDice = (sides) => {
        const username = localStorage.getItem("username") || "Player"; // Replace with real user logic

        // Generate local roll result
        const roll = Math.floor(Math.random() * sides) + 1;
        setRollResult(`You rolled a D${sides}: ${roll}`);

        // Send roll to WebSocket server
        socket.emit("rollDice", { roomCode, sides, username });
    };

    return (
        <div>
            <h2>🎲 Dice Roller</h2>
            <div className="dice-buttons">
                <button onClick={() => rollDice(4)}>D4</button>
                <button onClick={() => rollDice(6)}>D6</button>
                <button onClick={() => rollDice(8)}>D8</button>
                <button onClick={() => rollDice(10)}>D10</button>
                <button onClick={() => rollDice(12)}>D12</button>
                <button onClick={() => rollDice(20)}>D20</button>
                <button onClick={() => rollDice(100)}>D100</button>
            </div>
            {rollResult && <p>{rollResult}</p>}
        </div>
    );
}

export default DiceRoller;
