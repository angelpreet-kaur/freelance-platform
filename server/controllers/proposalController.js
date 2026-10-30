import Proposal from "../models/Proposal.js";
import Project from "../models/Project.js";

export const createProposal = async (req, res) => {
  try {
    const { projectId, coverLetter, bidAmount } = req.body;

    if (!projectId || !coverLetter || !bidAmount) {
      return res
        .status(400)
        .json({ message: "Project, cover letter and bid amount are required" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (project.status !== "open") {
      return res.status(400).json({ message: "This project is no longer open" });
    }

    const already = await Proposal.findOne({
      project: projectId,
      freelancer: req.user.id,
    });
    if (already) {
      return res
        .status(400)
        .json({ message: "You have already applied to this project" });
    }

    const proposal = await Proposal.create({
      project: projectId,
      freelancer: req.user.id,
      coverLetter,
      bidAmount,
    });

    res.status(201).json({ message: "Proposal sent successfully", proposal });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProjectProposals = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (project.client.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only view proposals for your own projects" });
    }

    const proposals = await Proposal.find({ project: project._id })
      .populate("freelancer", "name email skills hourlyRate")
      .sort({ createdAt: -1 });

    res.json({ count: proposals.length, proposals });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find({ freelancer: req.user.id })
      .populate("project", "title budget status")
      .sort({ createdAt: -1 });

    res.json({ count: proposals.length, proposals });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProposalStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ message: "Status must be accepted or rejected" });
    }

    const proposal = await Proposal.findById(req.params.id).populate("project");
    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }
    if (proposal.project.client.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only manage proposals on your own projects" });
    }

    proposal.status = status;
    await proposal.save();

    if (status === "accepted") {
      await Project.findByIdAndUpdate(proposal.project._id, {
        status: "in-progress",
      });
      await Proposal.updateMany(
        { project: proposal.project._id, _id: { $ne: proposal._id } },
        { status: "rejected" }
      );
    }

    res.json({ message: `Proposal ${status}`, proposal });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};