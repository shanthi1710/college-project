import adminModel from "../mongodb/models/adminModel.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { createAdminToken } from "../jwt/jwt.js";

const registerAdmin = async (req, res) => {
  let photoUrl = null;
  let photoId = null;
  try {
    const { username, password } = req.body;
    if (req.file) {
      const { path } = req.file;
      const uploadedPhoto = await cloudinary.uploader.upload(path);
      photoUrl = uploadedPhoto.secure_url;
      photoId = uploadedPhoto.public_id;
      await fs.unlink(path);
    }

    const existingAdmin = await adminModel.findOne({ username: username });
    if (existingAdmin) {
      return res.status(400).json("Username already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new adminModel({
      username: username,
      password: hashedPassword,
      avatar: photoUrl,
      avatarpublicid: photoId,
    });

    await newAdmin.save();

    return res.status(201).json("Admin created successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const getAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const adminObj = await adminModel.findOne({ username: username });
    if (!adminObj) {
      return res.status(401).json("Invalid username or username");
    }

    // compare the password with the hashed password in the database
    const isValidPassword = await bcrypt.compare(password, adminObj.password);

    if (!isValidPassword) {
      return res.status(401).json("Invalid password or username");
    }
    // this is to create a jwt token
    const jwtAccessToken = createAdminToken(adminObj);

    // this saves the jwt token in an httponly cookie with 12 hr
    return res
      .status(200)
      .cookie("jwtAdminAccessTokenCookie", jwtAccessToken, {
        maxAge: 1000 * 60 * 60 * 1, // 1 hr
        httpOnly: true,
        sameSite: "none", // Use 'none' for cross-origin requests
        path: "/", // Set the path to '/' to make it available across the entire client site
        secure: true, // Send the cookie only over HTTPS
      })
      .json("Successfully logged in");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  // try {
  //   const { username, password } = req.body;

  //   // hash the password
  //   const hashedpassword = await bcrypt.hash(password, 13);

  //   // This is the case of creating multiple admin accounts
  //   const adminExists = await adminModel.findOne({ username });
  //   if (adminExists) {
  //     return res.status(200).json(adminExists);
  //   }

  //   const newAdmin = await adminModel.create({
  //     username: username,
  //     password: hashedpassword,
  //   });
  //   return res.status(200).json("Successfully created admin");
  // } catch (error) {
  //   return res.status(500).json({ message: error.message });
  // }
};

const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldpassword, newpassword } = req.body;

    // Finds the admin details object from database
    const adminToUpdate = await adminModel.findOne({ username: id });

    // Check if the admin exists
    if (!adminToUpdate) {
      return res.status(404).json("Admin not found");
    }

    // compare with  hashed password
    const isValidPassword = await bcrypt.compare(
      oldpassword,
      adminToUpdate.password
    );

    if (!isValidPassword || oldpassword === newpassword) {
      return res
        .status(400)
        .json(
          "Invalid old password. Make sure not to reuse old password. Please contact the IT if forgot password"
        );
    }

    // start a new session for atomicity property
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // hash the password
      const hashedpassword = await bcrypt.hash(newpassword, 13);

      await adminModel
        .findOneAndUpdate(
          { username: id }, // id to update
          { password: hashedpassword } // fields to be patched
        )
        .session(session);
      await session.commitTransaction();
      return res.status(200).json("Password updated");
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { getAdmin, updateAdmin, registerAdmin };
