const express = require("express");
const app = express();
const cors = require("cors");
const { data } = require("./data");

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/get", (req, res) => {
  return res.status(200).json({ data: data, success: true });
});
app.get("/search/:nameId", (req, res) => {
  const { nameId } = req.params;
  if (typeof nameId === "string") {
    const result = data.filter((elem) => {
      return elem.name.toLowerCase().startsWith(nameId.toLowerCase());
    });
    if (result.length < 1) {
      return res
        .status(404)
        .json({ data: [], success: false, message: "ERROR 404: Not found" });
    }
    return res
      .status(200)
      .json({ data: result, success: true, message: "Successfully found" });
  } else {
    return res
      .status(400)
      .json({ data: [], success: false, message: "ERROR 400: Bad Request" });
  }
});
app.patch("/update/:userId", (req, res) => {
  const { userId } = req.params;
  const { genus, name, family } = req.body;
  const result = data.find((elem) => {
    return elem.id === Number(userId);
  });
  if (result) {
    const finalData = data;
    finalData.forEach((elem) => {
      if (elem.id === result.id) {
        elem.name = name;
        elem.family = family;
        elem.genus = genus;
      }
    });
    res.status(200).json({
      data: finalData,
      success: true,
      message: `Entry with id ${userId} has been updated`,
    });
  } else {
    res
      .status(404)
      .json({ data: data, success: false, message: "Error 404: Not found." });
  }
});
app.delete("/delete/:userId", (req, res) => {
  const { userId } = req.params;
  const toDel = data.find((elem) => {
    return (elem.id = Number(userId));
  });
  if (toDel) {
    const afterDel = data;
    const result = afterDel.filter((a) => {
      return a.id !== toDel.id;
    });
    res
      .status(200)
      .json({
        data: result,
        success: true,
        message: `Entry with id ${userId} has been deleted`,
      });
  } else {
    res
      .status(404)
      .json({ data: data, success: false, message: "Error 404: Not found." });
  }
});
const port = 5000;
app.listen(port, (req, res) => {
  console.log(`Server running at ${port}...`);
});
