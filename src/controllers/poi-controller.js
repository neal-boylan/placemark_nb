import { db } from "../models/db.js";
import { PoiSpec } from "../models/joi-schemas.js";

export const poiController = {
  index: {
    handler: async function (request, h) {
      const category = await db.categoryStore.getCategoryById(request.params.id);
      const poi = await db.poiStore.getPoiById(request.params.poiid);
      const viewData = {
        title: poi.name,
        category: category,
        poi: poi,
      };
      return h.view("poi-view", viewData);
    },
  },

  editPoi: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const category = await db.categoryStore.getCategoryById(request.params.id);
      const poi = await db.poiStore.getPoiById(request.params.poiid);
      const viewData = {
        title: "Edit PoI",
        category: category,
        poi: poi,
        user: loggedInUser,
      };
      return h.view("edit-poi-view", viewData);
    },
  },

  updatePoi: {
    validate: {
      payload: PoiSpec,
      options: { abortEarly: false },
      failAction: async function (request, h, error) {
      const category = await db.categoryStore.getCategoryById(request.params.id);
      const poi = await db.poiStore.getPoiById(request.params.poiid);
      return h.view("poi-view", { title: "Edit poi error", category: category, poi: poi, errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const poi = await db.poiStore.getPoiById(request.params.poiid);
      const newPoi = {
        name: request.payload.name,
        latitude: Number(request.payload.latitude),
        longitude: Number(request.payload.longitude),
      };
      await db.poiStore.updatePoi(poi, newPoi);
      return h.redirect(`/category/${request.params.id}`);
    },
  },
};