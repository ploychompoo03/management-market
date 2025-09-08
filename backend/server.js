import 'dotenv/config';
import app from './app.js';   // <- อยู่โฟลเดอร์เดียวกันกับ server.js

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
