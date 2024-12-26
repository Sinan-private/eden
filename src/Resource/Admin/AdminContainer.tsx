import {useAdmin} from "./admin.context.ts";
import {AdminPanel} from "./AdminPanel.tsx";

export const AdminContainer = () => {
  const {isFetching, showAdminPanel} = useAdmin();
  if (!showAdminPanel) {
    return null;
  }

  return isFetching
    ? <div>Loading</div>
    : <AdminPanel/>
}
