const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// 👉 Yaha apna STANDARD URI daalo (WITHOUT SRV)
//const MONGO_URI = "mongodb://anshusharma987405_db_user:anshu1234@cluster0-shard-00-00.g8cjeov.mongodb.net:27017,cluster0-shard-00-01.g8cjeov.mongodb.net:27017,cluster0-shard-00-02.g8cjeov.mongodb.net:27017/feespro?ssl=true&replicaSet=atlas-tnpq84-shard-0&authSource=admin&retryWrites=true&w=majority";
const MONGO_URI = "mongodb+srv://anshusharma987405_db_user:anshu1234@cluster0.g8cjeov.mongodb.net/feespro?retryWrites=true&w=majority";
(async () => {
  try {
    await mongoose.connect(MONGO_URI);

    const userSchema = new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: String
    });

    const User = mongoose.models.User || mongoose.model("User", userSchema);

    const hashed = await bcrypt.hash("anshu@#8923", 10);

    await User.updateOne(
      { email: "admin@feespro.com" },
      {
        name: "Admin",
        email: "admin@feespro.com",
        password: hashed,
        role: "admin"
      },
      { upsert: true }
    );

    console.log("✅ Admin created successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
})();