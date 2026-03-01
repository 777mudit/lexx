import Case from "../../models/Case.js";
import Evidence from "../../models/Evidence.js";

// Create new Case
export const createCase = async (req, res) => {
  try {
    const { title, description } = req.body;

    // req.user is set by protect middleware
    const officerId = req.user._id;

    const newCase = await Case.create({ title, description, officer: officerId });
    res.status(201).json(newCase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};