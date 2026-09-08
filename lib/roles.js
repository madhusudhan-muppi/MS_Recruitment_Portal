export function isAdmin(user) {
    if (!user) return false;
    const role = user.role;
    if (Array.isArray(role)) return role.includes("admin");
    if (typeof role !== "string") return false;
    return role.split(",").map((p) => p.trim()).includes("admin");
}