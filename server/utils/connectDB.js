import mongoose from "mongoose";

const DBConnection = () => {
  mongoose
    .connect(process.env.DB)
    .then(() => console.log("DB is connected"))
    .catch((e) => console.log(e));
};

export default DBConnection;
