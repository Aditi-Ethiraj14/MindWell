
import React from 'react';

const exercises = [
  {
    title: "10-Minute Walk",
    description: "Take a mindful walk outside for 10 minutes.",
    duration: "10 min"
  },
  {
    title: "Deep Breathing",
    description: "4-7-8 breathing technique: Inhale for 4s, hold for 7s, exhale for 8s.",
    duration: "5 min"
  },
  {
    title: "Progressive Relaxation",
    description: "Tense and relax each muscle group from toes to head.",
    duration: "15 min"
  }
];

export const MentalHealthExercises = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {exercises.map((exercise, index) => (
        <div key={index} className="bg-calm-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold mb-2">{exercise.title}</h3>
          <p className="text-gray-600 mb-2">{exercise.description}</p>
          <span className="text-calm-400 font-medium">{exercise.duration}</span>
        </div>
      ))}
    </div>
  );
};
