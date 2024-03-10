import { db } from "../models/db.js";
import { UserSpec, UserCredentialsSpec } from "../models/joi-schemas.js";

export const accountsController = {
  index: {
    auth: false,
    handler: function (request, h) {
      return h.view("main", { title: "Welcome to Playlist" });
    },
  },
  
  showSignup: {
    auth: false,
    handler: function (request, h) {
      return h.view("signup-view", { title: "Sign up for Playlist" });
    },
  },

  signup: {
    auth: false,
    validate: {
      payload: UserSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("signup-view", { title: "Sign up error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const user = request.payload;
      const email = db.userStore.getUserByEmail(user.email);
      console.log(`email: ${  email}`);
      console.log(`typeof email: ${  typeof email}`);

      if (typeof email === "string") {
        const message = "Email already has account";
        return h.view("signup-view", { title: "Email already has account", errors: message });
      }
      await db.userStore.addUser(user);
      return h.view("login-view", { title: "Login to Placemark" });
    },
  },

  showLogin: {
    auth: false,
    handler: function (request, h) {
      return h.view("login-view", { title: "Login to Playlist" });
    },
  },

  login: {
    auth: false,
    validate: {
      payload: UserCredentialsSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("login-view", { title: "Log in error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const { email, password } = request.payload;
      if (email === "admin" && password === "admin") {
        return h.redirect("/admin");
      }
      const user = await db.userStore.getUserByEmail(email);
      if (!user || user.password !== password) {
        const message = "Incorrect Username/Password";
        return h.view("login-view", { title: "Incorrect Username/Password", errors: message });
      }
      request.cookieAuth.set({ id: user._id });
      return h.redirect("/dashboard");
    },
  },

  logout: {
    auth: false,
    handler: function (request, h) {
      return h.redirect("/");
    },
  },

  async validate(request, session) {
    const user = await db.userStore.getUserById(session.id);
    if (!user) {
      return { isValid: false };
    }
    return { isValid: true, credentials: user };
  },
  
  editUser: {
    handler: async function (request, h) {
      const user = await db.userStore.getUserById(request.params.id);
      const viewData = {
        title: "Edit User",
        user: user,
      };
      return h.view("account-view", viewData);
    },
  },

  updateUser: {
    auth: false,
    validate: {
      payload: UserSpec,
      options: { abortEarly: false },
      failAction: async function (request, h, error) {
        const user = await db.userStore.getUserById(request.params.id);
        return h.view("account-view", { title: "Account Update error", user: user, errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const user = await db.userStore.getUserById(request.params.id);
      const newUser = {
        firstName: request.payload.firstName,
        lastName: request.payload.lastName,
        email: request.payload.email,
        password: request.payload.password,
      };
      await db.userStore.updateUser(user, newUser);
      return h.redirect("/dashboard");
    },
  },

  deleteUser: {
    handler: async function (request, h) {
      const user = await db.userStore.getUserById(request.params.id);
      await db.userStore.deleteUserById(user._id);
      return h.redirect("/admin");
    },
  },
};