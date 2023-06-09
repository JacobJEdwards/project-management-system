// Purpose: Middleware for express app
import express from "express";
import Cors from "cors";
import Morgan from "morgan";
import Helmet from "helmet";
import * as dotenv from "dotenv";
import { storage } from "../utils/multer";
import multer from "multer";
import compression from "compression";

dotenv.config();

// Middleware for express app
const middleware = [
    // reduce response size
    compression(),
    // parse request body
    express.json(),
    express.urlencoded({ extended: true }),
    multer({ storage: storage }).single("file"),
    // serve static files
    express.static("uploads"),
    // enable cors
    Cors(),
    // log http requests
    Morgan("dev"),
    // secure app by setting various http headers
    Helmet(),
];

export default middleware;
