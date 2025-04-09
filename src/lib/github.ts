export const fetchRepos = async(username:string)=>{
    const resp = await fetch(`https://api.github.com/users/${username}/repos`);
    if(!resp.ok){
        throw new Error("Failed to fetch repos");  
    } 
    return resp.json();
}


export default async function fetchUserProfile(username:string) {
    const resp = await fetch(`https://api.github.com/users/${username}`);

    if(!resp.ok) {
        throw new Error("User not Found");
    }
    const data = await resp.json();
    return data;
}
 