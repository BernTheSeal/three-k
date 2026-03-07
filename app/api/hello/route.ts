import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({ msg: "HELLO" }, { status: 200 });
};
