import { db } from "../models/db.js";
import { PoiSpec, CategorySpec } from "../models/joi-schemas.js";

export const categoryController = {
  index: {
    handler: async function (request, h) {
      const category = await db.categoryStore.getCategoryById(request.params.id);
      const viewData = {
        title: "Category",
        category: category,
      };
      return h.view("category-view", viewData);
    },
  },

  addPoi: {
    validate: {
      payload: PoiSpec,
      options: { abortEarly: false },
      failAction: async function (request, h, error) {
        const currentCategory = await db.categoryStore.getCategoryById(request.params.id);
        return h.view("category-view", { title: "Add Poi error", category: currentCategory, errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const category = await db.categoryStore.getCategoryById(request.params.id);
      const newPoi = {
        name: request.payload.name,
        latitude: Number(request.payload.latitude),
        longitude: Number(request.payload.longitude),
      };
      await db.poiStore.addPoi(category._id, newPoi);
      return h.redirect(`/category/${category._id}`);
    },
  },

  deletePoi: {
    handler: async function(request, h) {
      const category = await db.categoryStore.getCategoryById(request.params.id);
      await db.poiStore.deletePoi(request.params.poiid);
      return h.redirect(`/category/${category._id}`);
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
    validate: {
      payload: CategorySpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("dashboard-view", { title: "Edit Category error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const category = await db.categoryStore.getCategoryById(request.params.id);
      const newCategory = {
        title: request.payload.title,
      };
      await db.categoryStore.updateCategory(category, newCategory);
      return h.redirect("/dashboard");
    },
  },
};