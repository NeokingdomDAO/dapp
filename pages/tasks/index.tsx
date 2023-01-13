import { Button } from "@mui/material";
import Link from "next/link";
import useUser from '../../lib/useUser';

Tasks.title = "Tasks List";

export default function Tasks() {
  useUser({ redirectTo: '/login' });
  
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
