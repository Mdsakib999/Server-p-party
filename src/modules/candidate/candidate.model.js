import { Schema, model } from "mongoose";

const timelineSchema = new Schema({
  year: Number,
  event: String,
});

const professionalCareerSchema = new Schema({
  type: String,
  timeline: [timelineSchema],
});

const personalInfoSchema = new Schema({
  birthDate: String,
  birthPlace: String,
  nationality: String,
  maritalStatus: String,
  spouse: String,
  children: [String],
});

const academicCareerSchema = new Schema({
  schools: [String],
  college: String,
  university: String,
  degree: String,
});

const activitySchema = new Schema({
  title: String,
  date: String,
  description: String,
});

const controversySchema = new Schema({
  title: String,
  details: String,
  verdict: String,
});

const socialLinksSchema = new Schema({
  website: String,
});

const recentActivitySchema = new Schema({
  image: String,
  title: String,
  channel: String,
  date: String,
});

const candidateSchema = new Schema(
  {
    _id: Number,
    name: {
      type: String,
      required: true,
    },
    position: String,
    roleCategory: String,
    portfolio: String,
    designations: [String],
    personalInfo: personalInfoSchema,
    academicCareer: academicCareerSchema,
    professionalCareer: [professionalCareerSchema],
    electionConstituency: String,
    activities: [activitySchema],
    highlights: [String],
    controversies: [controversySchema],
    otherIncomeSources: [String],
    socialLinks: socialLinksSchema,
    photos: [String],
    overallSummary: String,
    source_url: String,
    lastUpdated: Date,
    recentActivities: [recentActivitySchema],
  },
  {
    timestamps: true,
  }
);

const Candidate = model("Candidate", candidateSchema);
export default Candidate;
