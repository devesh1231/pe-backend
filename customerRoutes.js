import {
    customerDefaultController
  } from "../controller/customerController.js";
  import express from "express";
  
  const route = express.Router();
  
  route.get("/customer", customerDefaultController);
  
  export default route;
  