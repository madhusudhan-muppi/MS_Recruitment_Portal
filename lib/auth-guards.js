import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/roles";

export async function getSessionUser() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    return session?.user || null;
}

export async function requireAdmin() {
    const user = await getSessionUser();
    if (!user) return { response: NextResponse.json({ message: "Authentication required" }, { status: 401 }) };
    if (!isAdmin(user)) return { response: NextResponse.json({ message: "Admin access required" }, { status: 403 }) };
    return { user };
}