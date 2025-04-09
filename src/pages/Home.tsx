import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import fetchUserProfile, { fetchRepos } from "@/lib/github";
import { useState } from "react";
import { Star, GitFork, Code2 } from "lucide-react";
import { motion } from "framer-motion";
import GitHubCommitChart from "@/components/Commits";


type UserProfile = {
    avatar_url: string;
    name:string;
    bio:string;
    followers:number;
    following:number;
};

type Repo ={
    id: number;
    name:string;
    html_url:string;
    stargazers_count:number;
    forks_count:number;
    language:string;
}

export default function Home(){
    const[username, setUsername]= useState("");
    const[userProfile, setUserProfile]= useState<UserProfile | null>(null); 
    const[repos, setRepos]= useState<Repo[]>([]);
    const[error, setError]= useState("");
    const[loading, setloading]= useState(false);

    const handleSearch = async()=>{
        setError("");
        setloading(true);
        try{
            const profile = await fetchUserProfile(username);
            const repositories = await fetchRepos(username);
            setUserProfile(profile);
            setRepos(repositories);
        }catch(err){
            setError("User not found");
            setUserProfile(null);
            setRepos([]);
        }finally{
            setloading(false);
        }
    };

    // -----UI RENDER-----

    return(
        <div className="flex w-full flex-col items-center bg-gray-950 min-h-screen text-gray-300  ">
            <h1 className="text-4xl font-bold text-green-600 mb-5">GitHub User Profile Analyzer</h1>

            <div className="flex gap-2 justify-center w-[78%] md:w-[65%] lg:w-[55%] xl:w-[45%]">
                <Input
                value={username}
                placeholder="Enter GitHub Username"
                className="placeholder-gray-400"
                onChange={(e)=>setUsername(e.target.value)}/>
                <Button onClick={handleSearch}
                disabled={loading}> {loading ? "Searching":"Search"}</Button>
            </div>

            {error && <p className="text-red-500 ">{error}</p>}

            { userProfile &&(
                <motion.div
                initial={{opacity:0 , y:20}}
                animate={{opacity:1 , y:0}}
                
                className="border w-3/4 rounded-t-2xl mt-10 p-4  md:w-[62%] lg:w-[52%] xl:w-[42%]">
                    <div>
                        <img src={userProfile.avatar_url} alt="User Avatar" 
                        className="w-16 h-16 rounded-full"/>

                        <div>
                            <h2 className="font-medium text-3xl">{userProfile.name}</h2>
                            <p>{userProfile.bio}</p>
                            <p>{userProfile.followers} | {userProfile.following}</p>
                        </div>
                    </div>
                </motion.div>
            )
            }

            {repos.length>0 && (
                <motion.div
                initial={{opacity:0 }}
                animate={{opacity:1}} 
                className="border w-3/4 rounded-b-2xl p-5  md:w-[62%] lg:w-[52%] xl:w-[42%]">
                      {userProfile && <GitHubCommitChart username={username} />}
                    <h3 className="text-3xl mb-2">Repositories</h3>
                    <ul >
                        {repos.map((repo)=>(
                            <li className="border p-2 rounded-2xl m-3 hover:scale-105 duration-500" key={repo.id}>
                              <a href={repo.html_url}
                              target="_blank"
                              className="text-2xl border-b-2 px-1 hover:text-gray-400"
                              rel="noopener noreferrer">{repo.name}</a>  

                              <div className="flex gap-4 text-sm mt-1">
                                <span className="flex items-center gap-1">
                                    <Star className="w-4 h-4"/> {repo.stargazers_count} Stars
                                </span>
                                <span className="flex items-center gap-1">
                                    <GitFork className="w-4 h-4"/> {repo.forks_count} Forks
                                </span>
                                <span className="flex items-center gap-1">
                                    <Code2 className="w-4 h-4"/> {repo.language} 
                                </span>
                              </div>
                            </li>
                            
                        ))}
                    </ul>
                     
                </motion.div>
            )}

          

        </div>
    )

}
