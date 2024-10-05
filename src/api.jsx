import axios from "axios";

const BASE_URL = "https://twiceloved-backend.onrender.com";

/** API Class. */

class TwiceLovedApi {
  static token = localStorage.getItem("token") || null;

  static setToken(token) {
    this.token = token;
    localStorage.setItem("token", token);
  }

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${this.token}` };
    const params = method === "get" ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? [...message, ` Status: ${err.response.status}`] : [message, ` Status: ${err.response.status}`];
    }
  }

  static async loginUser(formData) {
    let res = await this.request("auth/login", formData, "post");
    this.setToken(res["token"]);
    return res["token"];
  }

  static async logoutUser() {
    this.token = null;
  }

  static async registerUser(formData) {
    let res = await this.request("auth/register", formData, "post");
    this.setToken(res["token"]);
    return res["token"];
  }

  static async getUser(username) {
    let res = await this.request(`users/${username}`);
    return res["user"];
  }

  static async patchUser(username, formData) {
    let res = await this.request(`users/${username}`, formData, "patch");
    return res["user"];
  }

  static async getAllItemsGivenAway() {
    let res = await this.request(`users/all/items-given-away`);
    return res["itemsGivenAway"];
  }

  static async getListings(queryData) {
    let res = await this.request(`listings`, queryData);
    return res["listings"];
  }

  static async getLocationByZip(zip) {
    let res = await this.request(`locations/${zip}`);
    return res["location"];
  }

  static async getLocationById(id) {
    let res = await this.request(`locations/ids/${id}`);
    return res["location"];
  }

  static async getListing(id) {
    let res = await this.request(`listings/${id}`);
    const listing = res["listing"];
    try {
      const listingImages = await TwiceLovedApi.getListingImages(id);
      listing.listingImages = listingImages;
    } catch (err) {
      console.error("No listing images for this listing", err);
      listing.listingImages = [];
    }
    return listing;
  }

  static async getListingImages(id) {
    let res = await this.request(`listing-images/listings/${id}`);
    return res["listingImages"];
  }

  static async postListingImage(username, listingId, formData) {
    let res = await this.request(
      `listing-images/${username}/listings/${listingId}`,
      formData,
      "post"
    );
    return res["listingImage"];
  }

  static async deleteListingImage(username, listingId, imageOrder) {
    let res = await this.request(
      `listing-images/${username}/listings/${listingId}/${imageOrder}`,
      {},
      "delete"
    );
    return res["listingImages"];
  }

  static async getUserListings(username) {
    let res = await this.request(`listings/users/${username}`);
    return res["listings"];
  }

  static async getUserFavorites(username) {
    let res = await this.request(`favorites/${username}`);
    return res["favorites"];
  }

  static async postListing(username, formData) {
    formData["categoryId"] = +formData["categoryId"];
    formData["conditionId"] = +formData["conditionId"];
    formData["locationId"] = +formData["locationId"];
    let res = await this.request(`listings/${username}`, formData, "post");
    return res["listing"];
  }

  static async patchListing(username, listingId, formData) {
    formData["categoryId"] = +formData["categoryId"];
    formData["conditionId"] = +formData["conditionId"];
    await this.request(`listings/${username}/${listingId}`, formData, "patch");
    return;
  }

  static async deleteListing(username, listingId) {
    await this.request(`listings/${username}/${listingId}`, {}, "delete");
    return;
  }

  static async postLocation(formData) {
    await this.request(`locations`, formData, "post");
    return;
  }

  static async postFavorite(username, listingId) {
    await this.request(`favorites/${username}/${listingId}`, {}, "post");
  }

  static async deleteFavorite(username, listingId) {
    await this.request(`favorites/${username}/${listingId}`, {}, "delete");
  }

  static async getCategories() {
    let res = await this.request(`categories`);
    return res["categories"];
  }
}

export default TwiceLovedApi;
