import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@iitp\.ac\.in$/,
        "Email must be an @iitp.ac.in email",
      ],
    },
    rollno: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      match: [
        /^[0-9]{4}[A-Z]{2}[0-9]{2}$/,
        "Invalid roll number format (e.g., 2302CS01)",
      ],
    },
    password: {
      type: String,
      required: true,
      select: false, // hide from query results by default
    },

    // ✅ Optional profile fields (can be updated from frontend)
    avatar: {
      type: String,
      default: "",
    },
    displayName: {
      type: String,
      default: "",
      trim: true,
    },
    phone: {
      type: String,
      default: "",
    },
    hostel: {
      type: String,
      default: "",
      trim: true,
    },
    roomNumber: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Sanitize output
userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
  },
});

// ✅ Export model
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
