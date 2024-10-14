const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User"); // Adjust the path as necessary

// Connect to MongoDB
mongoose.connect("mongodb+srv://admin123:admin123@clubnsociety.porp8.mongodb.net/Club?retryWrites=true&w=majority&appName=clubnsociety", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Provided array of demo students
const demoStudents = [
  {
      "studentId": "222",
      "name": "Super Admin",
      "email": "super@admin.com",
      "password": "123456789",
      "role": "admin"
  },
]


const addDemoStudents = async () => {
  try {
    // Iterate over demo students and register each one
    for (const student of demoStudents) {
      const { studentId, name, email, password, role } = student;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Check if the user already exists
      let user = await User.findOne({ email });
      if (!user) {
        // Create the user with the hashed password
        user = await User.create({
          studentId,
          name,
          email,
          password: hashedPassword,
          role,
        });
        console.log(`User registered: ${name}`);
      } else {
        console.log(`User already exists: ${name}`);
      }
    }

    console.log("All demo students added.");
  } catch (error) {
    console.error("Error adding demo students:", error.message);
  }
};

// Call the function to add demo students
addDemoStudents();
