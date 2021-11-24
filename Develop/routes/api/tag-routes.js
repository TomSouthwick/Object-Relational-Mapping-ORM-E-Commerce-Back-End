const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

router.get("/", (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  console.log("hello world");
  // Get all books from the book table
  Tag.findAll().then((TagData) => {
    res.json(TagData);
  });
});

router.get("/:id", (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  Tag.findByPk(req.params.id, {
    // exclude: ["stock"],
    include: [{ model: Product }],
  }).then((TagData) => {
    if (!TagData) {
      res.status(404).json({ message: "No Tag found" });
      return;
    }

    res.json(TagData);
  });
});

router.post("/", async (req, res) => {
  // CREATE a new tag
  try {
    if (!req.body.tag_name) {
      return res
        .status(404)
        .json({ message: "Missing tag_name property from body" });
    }
    const newTag = await Tag.create({
      tag_name: req.body.tag_name,
    });

    if (!newTag) {
      return res.status(404).json({ message: "No tag found with this ID" });
    }

    res.status(200).json(newTag);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", async (req, res) => {
  // UPDATE a tag's name by its `id` value
  try {
    const updateTag = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (!req.body.tag_name) {
      return res
        .status(400)
        .json({ message: "Update unsucessful, invalid value provided" });
    }

    if (!updateTag[0]) {
      return res.status(404).json({ message: "No tag found with this ID" });
    }

    res.status(200).json({
      message: "Successfully updated Tag ",
      updateTag,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleteTag = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!deleteTag) {
      res.status(404).json({ message: "No tag found with this id!" });
      return;
    }

    res.status(200).json({ message: "Tag Deleted Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
