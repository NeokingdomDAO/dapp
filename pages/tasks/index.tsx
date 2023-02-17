import Link from "next/link";
import { Button } from "@mui/material";
import { useEffect } from "react";

Tasks.title = "Tasks List";
Tasks.requireLogin = true;

export default function Tasks() {
  const fetchTasks = async () => {
    const data = await fetch("/api/tasks", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const tasks = await data.json();
    console.log('🐞 > tasks', tasks);
  }

  useEffect(() => {
    fetchTasks();
  }, [])
  
  return (
    <>
      <div>Tasks list</div>

      <br />

      <Button component={Link} href="/tasks/new" variant="outlined">
        New Task
      </Button>
    </>
  );
}
