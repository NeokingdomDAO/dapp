import useUser from '../../lib/useUser';

NewTask.title = "New task";

export default function NewTask() {
  useUser({ redirectTo: '/login' });
  return <div>New Task</div>;
}
