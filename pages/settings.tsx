import useUser from '../lib/useUser';

Settings.title = "Settings";

export default function Settings() {
  useUser({ redirectTo: '/login' });
  return <div>Settings</div>;
}
