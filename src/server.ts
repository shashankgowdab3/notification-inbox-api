import app from "./app";
import { seedNotifications } from "./services/notification.service";

const PORT = 3000;

app.listen(PORT, () => {
   seedNotifications();
  console.log(`Server running on http://localhost:${PORT}`);
});