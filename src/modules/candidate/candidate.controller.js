import { CandidateService } from "./candidate.service.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";

const createCandidate = catchAsync(async (req, res) => {
  const result = await CandidateService.createCandidate(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Candidate created successfully",
    data: result,
  });
});

const getAllCandidates = catchAsync(async (req, res) => {
  const result = await CandidateService.getAllCandidates(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Candidates retrieved successfully",
    data: result,
  });
});

const getCandidateById = catchAsync(async (req, res) => {
  const result = await CandidateService.getCandidateById(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Candidate retrieved successfully",
    data: result,
  });
});

const updateCandidate = catchAsync(async (req, res) => {
  const result = await CandidateService.updateCandidate(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Candidate updated successfully",
    data: result,
  });
});

const deleteCandidate = catchAsync(async (req, res) => {
  const result = await CandidateService.deleteCandidate(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Candidate deleted successfully",
    data: result,
  });
});

export const CandidateController = {
  createCandidate,
  getAllCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
};
