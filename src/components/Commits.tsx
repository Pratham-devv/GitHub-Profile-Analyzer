import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton"; 

interface GitHubCommits {
  username: string;
}

interface DailyCommits {
  date: string;
  count: number;
}


const GitHubCommits: React.FC<GitHubCommits> = ({ username }) => {
  const [dailyCommits, setDailyCommits] = useState<DailyCommits[]>([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchCommits = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://api.github.com/users/${username}/events/public`);
        const events = await res.json();

        const commitMap: { [date: string]: number } = {};

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        events.forEach((event: any ) => {
          if (event.type === "PushEvent") {
            const date = new Date(event.created_at).toISOString().split("T")[0];
            commitMap[date] = (commitMap[date] || 0) + event.payload.commits.length;
          }
        });

        const formattedCommits: DailyCommits[] = Object.entries(commitMap).map(
          ([date, count]) => ({ date, count })
        );

        
        formattedCommits.sort((a, b) => (a.date < b.date ? 1 : -1));
        setDailyCommits(formattedCommits);
      } catch (error) {
        console.error("Error fetching commits:", error);
      }
      setLoading(false);
    };

    fetchCommits();
  
  }, [username]);

  return (

    <div className="pb-4 px-2 rounded-xl shadow-md w-full">
      <h2 className="text-2xl font-bold mb-4">Daily GitHub Commits</h2>
      {loading ? (
        <div className="space-y-2 ">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-6 w-full bg-transparent" />
          ))}
        </div>
      ) : dailyCommits.length === 0 ? (
        <p className="text-gray-500">No recent commits found.</p>
      ) : (
        <ul className="space-y-2">
          {dailyCommits.map((commit, i) => (
            <li
              key={i}
              className="flex justify-between p-3 border rounded-md hover:scale-105 duration-500"
            >
              <span className="font-medium">{commit.date}</span>
              <span className="text-blue-600 font-semibold">{commit.count} commits</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GitHubCommits;
