import { accountsController } from "./controllers/accounts-controller.js";
import { dashboardController } from "./controllers/dashboard-controller.js";
import { aboutController } from "./controllers/about-controller.js";
import { adminController } from "./controllers/admin-controller.js";
import { categoryController } from "./controllers/category-controller.js";
import { poiController } from "./controllers/poi-controller.js";

export const webRoutes = [
  { method: "GET", path: "/", config: accountsController.index },
  { method: "GET", path: "/signup", config: accountsController.showSignup },
  { method: "GET", path: "/login", config: accountsController.showLogin },
  { method: "GET", path: "/logout", config: accountsController.logout },
  { method: "POST", path: "/register", config: accountsController.signup },
  { method: "POST", path: "/authenticate", config: accountsController.login },

  { method: "GET", path: "/dashboard", config: dashboardController.index },
  { method: "POST", path: "/dashboard/addcategory", config: dashboardController.addCategory },
  { method: "GET", path: "/dashboard/deletecategory/{id}", config: dashboardController.deleteCategory },
  // { method: "GET", path: "/dashboard/editcategory/{id}", config: dashboardController.editCategory },
  // { method: "POST", path: "/dashboard/updatecategory/{id}/updateCategory/{}", config: dashboardController.updateCategory },

	{ method: "GET", path: "/about", config: aboutController.index },

  { method: "GET", path: "/category/{id}", config: categoryController.index },
  { method: "POST", path: "/category/{id}/addpoi", config: categoryController.addPoi },
  { method: "GET", path: "/category/{id}/deletepoi/{poiid}", config: categoryController.deletePoi },
  { method: "GET", path: "/category/{id}/editcategory", config: categoryController.editCategory },
  { method: "POST", path: "/category/{id}/updatecategory", config: categoryController.updateCategory },

  { method: "GET", path: "/poi/{id}/viewpoi/{poiid}", config: poiController.index },
  { method: "GET", path: "/poi/{id}/editpoi/{poiid}", config: poiController.editPoi },
  { method: "POST", path: "/poi/{id}/updatepoi/{poiid}", config: poiController.updatePoi },

  { method: "GET", path: "/admin", config: adminController.index },
  { method: "GET", path: "/admin/deleteuser/{id}", config: adminController.deleteOneUser },
  { method: "GET", path: "/admin/deleteusers", config: adminController.deleteUsers },
  { method: "GET", path: "/admin/deletecategories", config: adminController.deleteCategories },
  { method: "GET", path: "/admin/deletepois", config: adminController.deletePois },
];