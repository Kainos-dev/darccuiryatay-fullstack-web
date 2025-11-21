// app/api/users/route.js
import { connectDB } from "@/lib/connectionDB.js";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// GET → obtener usuarios
export async function GET() {
    await connectDB();
    const users = await User.find();
    return NextResponse.json(users);
}

// POST → crear usuario
export async function POST(req) {
  try {
    await connectDB();
    const { name, email, password, role } = await req.json();      // reemplaza a req.body de Express.

    const userExists = await User.findOne({ email });
    if (userExists)
      return Response.json({ error: "El usuario ya existe" }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword, role });

    return Response.json(newUser, { status: 201 });     // reemplaza a res.json() de Express.
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error creando usuario" }, { status: 500 });
  }
}