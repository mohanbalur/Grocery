import jwt from "jsonwebtoken";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const generateResetToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "10m" });



export default generateToken;
