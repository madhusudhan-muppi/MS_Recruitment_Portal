export async function requireAdmin() {
    const user = await getSessionUser();
    if (!user) return { response: NextResponse.json({ message: "Authentication required" }, { status: 401 }) };
    if (!isAdmin(user)) return { response: NextResponse.json({ message: "Admin access required" }, { status: 403 }) };
    return { user };
}