import { db } from "../models/db.js";
import { CategorySpec } from "../models/joi-schemas.js";

export const dashboardController = {
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const categories = await db.categoryStore.getUserCategories(loggedInUser._id);
      const viewData = {
        title: "Category Dashboard",
        categories: categories,
      };
      return h.view("dashboard-view", viewData);
    },
  },

  addCategory: {
    validate: {
      payload: CategorySpec,
      options: { abortEarly: false },
      failAction: async function (request, h, error) {
        const loggedInUser = request.auth.credentials;
        const userCategories = await db.categoryStore.getUserCategories(loggedInUser._id);
        return h.view("dashboard-view", { title: "Add Category error", categories: userCategories, errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const newCategory = {
        userid: loggedInUser._id,
        title: request.payload.title,
      };
      await db.categoryStore.addCategory(newCategory);
      return h.redirect("/dashboard");
    },
  },
  
  editCategory: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const category = await db.categoryStore.getCategoryById(request.params.id);
      const viewData = {
        title: "Edit Category",
        category: category,
      };
      return h.view("edit-category-view", viewData);
    },
  },

  updateCategory: {
    handler: async function (request, h) {
      const category = await db.categoryStore.getCategoryById(request.params.id);
      const updatedCategory = await db.categoryStore.getCategoryById(request.params.name);
      await db.categoryStore.updateCategory(category, updatedCategory);
      return h.redirect("/dashboard");
    },
  },
  
  deleteCategory: {
    handler: async function (request, h) {
      const category = await db.categoryStore.getCategoryById(request.params.id);
      await db.categoryStore.deleteCategoryById(category._id);
      return h.redirect("/dashboard");
    },
  },
};