"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSounds } from "@/hooks/useSounds";
import { recordBestStreak, useBestStreak } from "@/hooks/useBestStreak";
import {
  EMPTY_SCORES,
  THINKING_DELAY_MS,
  applyOutcome,
  getAiMove,
  getMatchWinner,
  judge,
  type MatchWinner,
  type Move,
  type Outcome,
  type RoundRecord,
  type Scores,
} from "@/lib/rps";

export type Phase = "idle" | "thinking" | "revealed" | "over";

export function useRpsGame() {
  const { play, enabled: soundOn, toggle: toggleSound } = useSounds();

  const [scores, setScores] = useState<Scores>(EMPTY_SCORES);
  const [round, setRound] = useState(0);
  const [playerMove, setPlayerMove] = useState<Move | null>(null);
  const [aiMove, setAiMove] = useState<Move | null>(null);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [matchWinner, setMatchWinner] = useState<MatchWinner>(null);
  const [streak, setStreak] = useState(0);
  const [history, setHistory] = useState<RoundRecord[]>([]);

  const bestStreak = useBestStreak();
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  const resetMatch = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setScores(EMPTY_SCORES);
    setRound(0);
    setPlayerMove(null);
    setAiMove(null);
    setOutcome(null);
    setPhase("idle");
    setMatchWinner(null);
    setStreak(0);
    setHistory([]);
    play("click");
  }, [play]);

  const playRound = useCallback(
    (move: Move) => {
      if (phase === "thinking" || phase === "over") return;

      const aiChoice = getAiMove();
      const result = judge(move, aiChoice);
      const nextRound = round + 1;
      const nextStreak = result === "win" ? streak + 1 : 0;

      setPhase("thinking");
      setOutcome(null);
      setMatchWinner(null);
      setPlayerMove(move);
      setAiMove(null);
      play("click");

      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;

        const nextScores = applyOutcome(scores, result);
        const winner = getMatchWinner(nextScores);

        setAiMove(aiChoice);
        setOutcome(result);
        setScores(nextScores);
        setRound(nextRound);
        setMatchWinner(winner);
        setPhase(winner ? "over" : "revealed");
        setHistory((current) => [{ round: nextRound, player: move, ai: aiChoice, outcome: result }, ...current]);

        if (result === "win") {
          setStreak(nextStreak);
          if (nextStreak > bestStreak) recordBestStreak(nextStreak);
        } else if (result === "lose") {
          setStreak(0);
        }

        if (result === "win") play("win");
        else if (result === "lose") play("lose");
        else play("draw");
      }, THINKING_DELAY_MS);
    },
    [bestStreak, phase, play, round, scores, streak],
  );

  return {
    scores,
    round,
    playerMove,
    aiMove,
    outcome,
    phase,
    matchWinner,
    streak,
    bestStreak,
    history,
    soundOn,
    isBusy: phase === "thinking" || phase === "over",
    playRound,
    resetMatch,
    toggleSound,
  };
}
