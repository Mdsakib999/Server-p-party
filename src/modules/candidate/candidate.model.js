import { Schema, model } from "mongoose";

const personalInfoSchema = new Schema(
  {
    birth_date: String,
    birth_place: {
      type: String,
      required: true,
    },
    nationality: {
      type: String,
      default: "Bangladeshi",
    },
    mobileNo: String,
    website_or_social: [String],
  },
  { _id: false },
);

const academicCareerSchema = new Schema(
  {
    schools: [String],
    college: String,
    university: [String],
    degree: [String],
  },
  { _id: false },
);

const politicalCareerSchema = new Schema(
  {
    year: String,
    event: String,
  },
  { _id: false },
);

const electionConstituencySchema = new Schema(
  {
    actual_place_name: String,
    election_area_name: String,
  },
  { _id: false },
);

const photoSchema = new Schema(
  {
    secure_url: String,
    public_id: String,
    url: String,
  },
  { _id: false },
);

const candidateSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    designation: {
      type: String,
      default: "Party Leader",
    },

    profession: {
      type: String,
      default: "Politician",
    },

    portfolio: {
      type: [String],
    },

    previous_designations: {
      type: [String],
    },

    personal_info: {
      type: personalInfoSchema,
      required: true,
    },

    academic_career: academicCareerSchema,

    business_income_source_professional_career: [String],

    political_career: [politicalCareerSchema],

    election_constituencies: {
      type: [electionConstituencySchema],
      required: true,
    },

    life_activities: String,

    other_income_sources: [String],

    photos: {
      type: [photoSchema],
      default: [],
    },

    overall_summary: {
      type: String,
      required: true,
    },

    district: {
      type: [String],
      required: true,
    },

    division: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Candidate = model("Candidate", candidateSchema);
export default Candidate;
