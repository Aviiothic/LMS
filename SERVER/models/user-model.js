import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Name is required"],
      minLength: [5, "Name should be greater than 5 chars"],
      maxLenth: [30, "Name should be less than 30 chars"],
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "This email is already in use"],
      lowercase: true,
      trim: true,
      match: [
        /^(?!.*\.\.)[a-zA-Z0-9][a-zA-Z0-9._%+-]*[a-zA-Z0-9]@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password id required"],
      minLength: [8, "Password should be greater than 8 chars"],
      maxLenth: [30, "Password should be less than 30 chars"],
      select: false,
      trim: true,
    },
    avatar: {
      public_id: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    forgetPasswordToken: {
      type: String,
    },
    forgetPasswordExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods ={
    generateJWTToken: async function(){
// Suggested code may be subject to a license. Learn more: ~LicenseLog:1473549088.
// Suggested code may be subject to a license. Learn more: ~LicenseLog:3737916110.
        return await JWT.sign({id: this._id, email: this.email, role: this.role, subscription: this.subscription}, 
            process.env.JWT_SECRET, 
            {
                expiresIn: process.env.JWT_EXPIRY
            }
        );
    }
}

const User = mongoose.model("User", userSchema);

export default User;
