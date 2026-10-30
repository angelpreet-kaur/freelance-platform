import Project from "../models/Project.js";

export const createProject = async (req, res) => {
  try {
    const { title, description, budget, skills, deadline } = req.body;

    if (!title || !description || !budget) {
      return res
        .status(400)
        .json({ message: "Title, description and budget are required" });
    }

    const project = await Project.create({
      title,
      description,
      budget,
      skills,
      deadline,
      client: req.user.id,
    });

    res
      .status(201)
      .json({ message: "Project posted successfully", project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    const { search, skill, minBudget, maxBudget } = req.query;
    const filter = { status: "open" };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (skill) {
      filter.skills = { $regex: skill, $options: "i" };
    }
    if (minBudget || maxBudget) {
      filter.budget = {};
      if (minBudget) filter.budget.$gte = Number(minBudget);
      if (maxBudget) filter.budget.$lte = Number(maxBudget);
    }

    const projects = await Project.find(filter)
      .populate("client", "name email")
      .sort({ createdAt: -1 });

    res.json({ count: projects.length, projects });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "client",
      "name email"
    );
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ client: req.user.id }).sort({
      createdAt: -1,
    });
    res.json({ count: projects.length, projects });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};