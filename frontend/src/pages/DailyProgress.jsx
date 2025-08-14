import React, { useEffect, useState } from "react";
import api from "../services/api";
import {getToken, setUser } from "../utils/auth";

const DailyProgress = () => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getToken();
    if (token) {
      // Always fetch latest user info if logged in
      api.me()
        .then(res => {
          setUser(res.data);
          // Always overwrite progress with latest API response
          api.dailyProgress()
            .then(res2 => {
              setProgress(res2.data); // Only today's progress
              setLoading(false);
            })
            .catch(() => {
              setError("Failed to fetch daily progress.");
              setLoading(false);
            });
        })
        .catch(() => {
          setError("User not logged in");
          setLoading(false);
        });
    } else {
      setError("User not logged in");
      setLoading(false);
    }
  }, []);

  if (loading) return <p className="text-green-600">Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-4">Goal Progress</h1>
      <h2 className="text-lg font-semibold text-gray-700 mb-2">Progress for Goals</h2>
      {progress ? (
        <div className="bg-green-100 border border-green-300 rounded-lg p-4 shadow-md space-y-4">
          <ProgressBar label="Calories" value={progress.calories} />
          <ProgressBar label="Protein" value={progress.protein} />
          <ProgressBar label="Carbs" value={progress.carbs} />
          <ProgressBar label="Fat" value={progress.fat} />
        </div>
      ) : (
        <p className="text-gray-600">No progress recorded yet.</p>
      )}
    </div>
  );
}

function ProgressBar({ label, value }) {
  let percent = Number(value);
  if (!isFinite(percent) || isNaN(percent) || percent < 0) percent = 0;
  percent = Math.min(100, percent);
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span>{percent.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded h-4">
        <div
          className="bg-brand-500 h-4 rounded"
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
};

export default DailyProgress;
