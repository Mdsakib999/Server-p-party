import ApiError from "../../utils/ApiError.js";
import Candidate from "./candidate.model.js";

const createCandidate = async (payload) => {
  // Remove _id if present (let MongoDB generate it)
  delete payload._id;

  // Create new candidate
  try {
    const candidate = await Candidate.create(payload);
    return candidate;
  } catch (err) {
    if (err.name === "ValidationError") {
      throw new ApiError(400, err.message);
    }
    throw err;
  }
};

const getAllCandidates = async (query = {}) => {
  const candidates = await Candidate.find(query);
  return candidates;
};

const getCandidateById = async (id) => {
  const candidate = await Candidate.findById(id);
  if (!candidate) {
    throw new ApiError(404, "Candidate not found");
  }
  return candidate;
};

const updateCandidate = async (id, payload) => {
  const candidate = await Candidate.findByIdAndUpdate(
    id,
    payload,
    { new: true, runValidators: true }
  );

  if (!candidate) {
    throw new ApiError(404, "Candidate not found");
  }

  return candidate;
};

const deleteCandidate = async (id) => {
  const candidate = await Candidate.findByIdAndDelete(id);
  if (!candidate) {
    throw new ApiError(404, "Candidate not found");
  }
  return candidate;
};

export const CandidateService = {
  createCandidate,
  getAllCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
};
