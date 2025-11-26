export async function getAuthUser() {
  try {
    const res = await fetch("/api/user", {
      method: "GET",
      credentials: "include",
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

export async function saveMapping(mapping) {
  try {
    const res = await fetch("/api/user/save-mapping", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ mapping }),
    });
    if (!res.ok) {
      throw new Error("Failed to save mapping");
    }

    return await res.json();
  } catch (err) {
    console.error("Error saving mapping:", err);
    return null;
  }
}

export async function getMapping() {
  try {
    const res = await fetch("/api/user/mapping", {
      method: "GET",
      credentials: "include",
    });
    
    if (!res.ok) {
      throw new Error("Failed to fetch mapping");
    }
    return await res.json();
  } catch (err) {
    console.error("Error fetching mapping:", err);
    return null;
  }
}