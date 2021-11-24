const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint

router.get("/", (req, res) => {
  // find all categories
  // be sure to include its associated Products
  console.log("hello world");
  // Get all books from the book table
  Category.findAll().then((CategoryData) => {
    res.json(CategoryData);
  });
});

router.get("/:id", (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  Category.findByPk(req.params.id, {
    // exclude: ["stock"],
    include: [
      {
        model: Product,
      },
    ],
  }).then((category) => {
    if (!category) {
      res.status(404).json({ message: "No Category found" });
      return;
    }

    res.json(category);
  });
});

router.post("/", async (req, res) => {
  // CREATE a new tag
  try {
    if (!req.body.category_name) {
      return res
        .status(404)
        .json({ message: "Missing category_name property from body" });
    }
    const newCategory = await Category.create({
      category_name: req.body.category_name,
    });

    if (!newCategory) {
      return res.status(404).json(newCategory);
    }

    res.status(200).json(newCategory);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", async (req, res) => {
  // UPDATE a tag's name by its `id` value
  try {
    const updateCategory = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (!req.body.category_name) {
      return res.status(400).json({
        message: "Update unsucessful, invalid Category_name provided",
      });
    }

    if (!updateCategory[0]) {
      return res
        .status(404)
        .json({ message: "No Category found with this ID" });
    }

    res.status(200).json({
      message: "Successfully updated Category ",
      updateCategory,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleteCategory = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!deleteCategory) {
      res.status(404).json({ message: "No Category found with this id!" });
      return;
    }

    res.status(200).json({ message: "Category Deleted Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
