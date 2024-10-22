const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const Coach = require("../models/coach.model");

const userAuth = async (request, response, next) => {
    try {
        // Get the Authorization header from the request
        const authHeader = request.headers["authorization"];
        if (!authHeader) {
            return response.status(401).json({ status_code: 401, data: [], message: "token missing" });
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            console.log("hii")
            return response.status(401).json({ status_code: 401, data: [], message: "Unauthorized Access" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Replace with your JWT secret key
        const { id } = decoded;

        // Find the user by user_id

        const user = await User.findOne({ token });

        if (!user) {
            return response.status(401).json({ status_code: 401, data: [], message: "Unauthorized Access" });
        }
        request.user = user;
        next();
    } catch (error) {
        // Handle token errors (invalid token, expired token, etc.)
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return response.status(401).json({ status_code: 401, data: [], message: "Unauthorized Access - Invalid Token" });
        }
        return response.status(500).json({ status_code: 500, data: [], message: "Internal Server Error" });
    }
};



const isCoach = async (request, response, next) => {
    try {
        // Get the Authorization header from the request
        const authHeader = request.headers["authorization"];
        if (!authHeader) {
            return response.status(401).json({ status_code: 401, data: [], message: "Unauthorized Access" });
        }
        const token = authHeader.split(" ")[1];

        if (!token) {
            return response.status(401).json({ status_code: 401, data: [], message: "Unauthorized Access" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Replace with your JWT secret key
        const { id } = decoded;

        // Find the user by user_id
        const coach = await Coach.findById(id);

        if (!coach) {
            return response.status(401).json({ status_code: 401, data: [], message: "Unauthorized Access" });
        }
        request.coach = coach;

        next();
    } catch (error) {
        // Handle token errors (invalid token, expired token, etc.)
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return response.status(401).json({ status_code: 401, data: [], message: "Unauthorized Access - Invalid Token" });
        }


        return response.status(500).json({ status_code: 500, data: [], message: "Internal Server Error" });
    }
}

module.exports = { userAuth, isCoach };
