export const logout = async (req, res) => {
  res.status(200).json({
    message: "Logout successful. Please delete token on client side."
  });
};