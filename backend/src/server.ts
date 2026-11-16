import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT;

// no Express 5 o callback também é chamado quando a porta não abre (ex.: já está em uso)
app.listen(PORT, (error) => {
  if (error) throw error;
  console.log(`API Running on port ${PORT}`);
});
