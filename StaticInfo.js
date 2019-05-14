const path = require("path");
module.exports = {
  LocalFolder: path.join(__dirname, "/public/uploads"),
  OuterIndexPath: "http://localhost:5000/uploads/",
  TemplatePath: path.join(__dirname, "Template.html")
};
