import swaggerAutogen from "swagger-autogen";
import dotenv from "dotenv";
dotenv.config();

const doc = {
  info: {
    title: "EduNest Server APIs",
    description: "Automatically generated swagger docs for testing APIs",
    version: "1.1.0",
  },
  host:
    process.env.NODE_ENV === "development"
      ? "localhost:4000"
      : `${process.env.SERVER_URL}`,
  basePath: "/api/v2",
  schemes: [process.env.NODE_ENV === "development" ? "http" : "https"],
};

const outputFile = "./src/swagger-output.json";

const endPointFiles = [
  "./src/routes/Contact.ts",
  "./src/routes/Course.ts",
  "./src/routes/Profile.ts",
  "./src/routes/User.ts",
];

swaggerAutogen()(outputFile, endPointFiles, doc);

