const express = require("express");
const router = express();
const auth = require("./auth");

router.get("/auth-endpoint", auth, (request, response) => {
    // response.json({ message: "You are authorized to access me" });
    const userRole = request.user.role;
    response.json({ message: "You are authorized to access me" ,
      role: userRole });
  });

module.exports = router;