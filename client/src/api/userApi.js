export const fetchUser = async () => {
  try {
    const res = await fetch("/api/user", { credentials: "include" });
    if (!res.ok) throw new Error("No logged-in user");
    const data = await res.json();
    console.log("Logged-in user:", data);
    return data;
  } catch (err) {
    console.error(err);
  }
};