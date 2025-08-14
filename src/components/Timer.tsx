import React from 'react';

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const Timer = ({ timeLeft }: { timeLeft: number }) => {
  return <div className="font-mono text-xl">{formatTime(timeLeft)}</div>;
};
