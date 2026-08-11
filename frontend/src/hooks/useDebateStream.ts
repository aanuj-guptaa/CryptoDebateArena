import { useState, useEffect, useRef } from 'react';
import { DebateTurn, Verdict, DebateStatus } from '../lib/types';
import { getStreamUrl } from '../lib/api';

export function useDebateStream(debateId: string | null, isPaused: boolean = false) {
  const [turns, setTurns] = useState<DebateTurn[]>([]);
  const [tension, setTension] = useState<number>(50);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [status, setStatus] = useState<DebateStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const pendingEventsRef = useRef<{ turns: DebateTurn[]; verdict: Verdict | null; done: boolean }>({
    turns: [],
    verdict: null,
    done: false
  });

  const isPausedRef = useRef(isPaused);
  useEffect(() => {
    isPausedRef.current = isPaused;
    // If unpaused, flush queued turns
    if (!isPaused) {
      const pending = pendingEventsRef.current;
      if (pending.turns.length > 0) {
        setTurns((prev) => [...prev, ...pending.turns]);
        pending.turns.forEach((t) => {
          setTension((prev) => Math.max(0, Math.min(100, prev + (t.tensionDelta || 0))));
        });
        pending.turns = [];
      }
      if (pending.verdict) {
        setVerdict(pending.verdict);
        pending.verdict = null;
      }
      if (pending.done) {
        setStatus('completed');
        pending.done = false;
      }
    }
  }, [isPaused]);

  useEffect(() => {
    if (!debateId) return;

    setStatus('connecting');
    setError(null);
    setTurns([]);
    setTension(50);
    setVerdict(null);
    pendingEventsRef.current = { turns: [], verdict: null, done: false };

    const eventSource = new EventSource(getStreamUrl(debateId));

    eventSource.onopen = () => {
      setStatus('streaming');
    };

    eventSource.addEventListener('turn', (e) => {
      try {
        const turn = JSON.parse(e.data) as DebateTurn;
        if (isPausedRef.current) {
          pendingEventsRef.current.turns.push(turn);
        } else {
          setTurns((prev) => [...prev, turn]);
          setTension((prev) => {
            const newTension = prev + (turn.tensionDelta || 0);
            return Math.max(0, Math.min(100, newTension));
          });
        }
      } catch (err) {
        console.error('Failed to parse turn event', err);
      }
    });

    eventSource.addEventListener('verdict', (e) => {
      try {
        const parsedVerdict = JSON.parse(e.data) as Verdict;
        if (isPausedRef.current) {
          pendingEventsRef.current.verdict = parsedVerdict;
        } else {
          setVerdict(parsedVerdict);
        }
      } catch (err) {
        console.error('Failed to parse verdict event', err);
      }
    });

    eventSource.addEventListener('done', () => {
      if (isPausedRef.current) {
        pendingEventsRef.current.done = true;
      } else {
        setStatus('completed');
      }
      eventSource.close();
    });

    eventSource.onerror = () => {
      if (status !== 'completed') {
        setStatus('error');
        setError('Lost connection to the debate arena.');
        eventSource.close();
      }
    };

    return () => {
      eventSource.close();
    };
  }, [debateId]);

  return { turns, tension, verdict, status, error };
}
