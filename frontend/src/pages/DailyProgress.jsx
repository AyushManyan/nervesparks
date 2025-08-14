import React, { useEffect, useState } from "react";
import axios from "axios";

const DailyProgress = () => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        let userId = null;
        if (storedUser) {
          try {
            const userObj = JSON.parse(storedUser);
            userId = userObj.id;
          } catch (e) {
            console.error("Failed to parse user data:", e);
            setError("Failed to parse user data");
            setLoading(false);
            return;
          }
        }

        if (!token || !userId) {
          setError("User not logged in");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `http://localhost:4000/api/users/${userId}/daily-progress`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        setProgress(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch daily progress.");
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading) return <p className="text-green-600">Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

return (
    <div className="min-h-screen bg-white p-6">
        <h1 className="text-3xl font-bold text-green-700 mb-4">
            Daily Progress
        </h1>
        {progress ? (
            <div className="bg-green-100 border border-green-300 rounded-lg p-4 shadow-md">
                <p className="text-green-900">
                    <strong>Calories:</strong> {Number(progress.calories).toFixed(2)}
                </p>
                <p className="text-green-900">
                    <strong>Protein:</strong> {Number(progress.protein).toFixed(2)}g
                </p>
                <p className="text-green-900">
                    <strong>Carbs:</strong> {Number(progress.carbs).toFixed(2)}g
                </p>
                <p className="text-green-900">
                    <strong>Fats:</strong> {Number(progress.fat).toFixed(2)}g
                </p>
            </div>
        ) : (
            <p className="text-gray-600">No progress recorded yet.</p>
        )}
    </div>
);
};

export default DailyProgress;
