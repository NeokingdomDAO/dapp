import { Button } from "@mui/material";
import Link from "next/link";

Tasks.title = "Tasks List";
Tasks.requireLogin = true;

export default function Tasks() {
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
