import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { compare } from "bcrypt";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Benutzername und Passwort sind erforderlich" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Ungültige Anmeldedaten" },
        { status: 401 }
      );
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Ungültige Anmeldedaten" },
        { status: 401 }
      );
    }

    // Hier würden Sie normalerweise eine Session erstellen oder ein JWT Token zurückgeben
    // Für dieses einfache Beispiel geben wir nur eine erfolgreiche Antwort zurück
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Ein Fehler ist aufgetreten" },
      { status: 500 }
    );
  }
} 