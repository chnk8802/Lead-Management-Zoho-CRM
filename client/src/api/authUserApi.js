export async function getAuthUser() {
  try {
    const res = await fetch("/api/user", {
      method: "GET",
      credentials: "include"
    });
    
    if (!res.ok) {
      throw new Error("Failed to fetch auth user");
    }

    return await res.json();
  } catch (err) {
    console.error("Error fetching auth user:", err);
    return null;
  }
}
