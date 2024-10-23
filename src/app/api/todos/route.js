import { NextResponse } from "next/server";
import { ConnectDB } from "@/helpers/db";

ConnectDB();
export function GET(request) {
  const todos = [
    {
      name: "create database",
      id: 1,
      message: "success",
    },
    {
      name: "manage api",
      id: 2,
      message: "all api's working",
    },
    {
      name: "sleep",
      id: 3,
      message: "wakeup",
    },
    {
      name: "cycling",
      id: 4,
      message: "in evening",
    },
  ];
  return NextResponse.json(todos, {
    status: 200,
    statusText: "success",
  });
}

export function POST() {
  console.log("post api called");
  return NextResponse.json({
    message: "testing post",
  });
}

export function DELETE() {
  console.log("DELETE api called");
  return NextResponse.json({
    message: "success",
  });
}
