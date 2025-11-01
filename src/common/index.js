// Địa chỉ backend
const backendDomain = "http://localhost:8080";

// Tổng hợp các API endpoint chính
const SummaryApi = {
  // === AUTHENTICATION ===
  signUP: {
    url: `${backendDomain}/api/signup`,
    method: "post",
  },
  signIn: {
    url: `${backendDomain}/api/signin`,
    method: "post",
  },
  current_user: {
    url: `${backendDomain}/api/user-details`,
    method: "get",
  },
  logout_user: {
    url: `${backendDomain}/api/userLogout`,
    method: "get",
  },

  // === USER ===
  allUser: {
    url: `${backendDomain}/api/all-user`,
    method: "get",
  },
  updateUser: {
    url: `${backendDomain}/api/update-user`,
    method: "post",
  },
  changePassword: {
    url: `${backendDomain}/api/change-password`,
    method: "post",
  },
  uploadAvatar: {
    url: `${backendDomain}/api/upload-avatar`,
    method: "post",
  },

  // === PRODUCT ===
  uploadProduct: {
    url: `${backendDomain}/api/upload-product`,
    method: "post",
  },
  allProduct: {
    url: `${backendDomain}/api/get-product`,
    method: "get",
  },
  updateProduct: {
    url: `${backendDomain}/api/update-product`,
    method: "post",
  },
  categoryProduct: {
    url: `${backendDomain}/api/get-categoryProduct`,
    method: "get",
  },
  categoryWiseProduct: {
    url: `${backendDomain}/api/category-product`,
    method: "post",
  },
  productDetails: {
    url: `${backendDomain}/api/product-details`,
    method: "post",
  },

  // === CART ===
  addToCartProduct: {
    url: `${backendDomain}/api/addtocart`,
    method: "post",
  },
  addToCartProductCount: {
    url: `${backendDomain}/api/countAddToCartProduct`,
    method: "get",
  },
  addToCartProductView: {
    url: `${backendDomain}/api/view-cart-product`,
    method: "get",
  },
  updateCartProduct: {
    url: `${backendDomain}/api/update-cart-product`,
    method: "post",
  },
  deleteCartProduct: {
    url: `${backendDomain}/api/delete-cart-product`,
    method: "post",
  },

  // === SEARCH & FILTER ===
  searchProduct: {
    url: `${backendDomain}/api/search`,
    method: "get",
  },
  filterProduct: {
    url: `${backendDomain}/api/filter-product`,
    method: "post",
  },

  // === FORGOT PASSWORD ===
  forgotPassword: {
    url: `${backendDomain}/api/forgot-password`,
    method: "post",
  },
  resetPassword: {
    url: `${backendDomain}/api/forgot-password/reset-password`,
    method: "post",
  },
  verifyCode: {
    url: `${backendDomain}/api/forgot-password/verify-otp`,
    method: "post",
  },

  // === ADDRESS ===
  createAddress: {
    url: `${backendDomain}/api/address`,
    method: "post",
  },
  getUserAddresses: {
    url: `${backendDomain}/api/address`,
    method: "get",
  },
  updateAddress: {
    url: `${backendDomain}/api/address/`,
    method: "put",
  },
  deleteAddress: {
    url: `${backendDomain}/api/address/`,
    method: "delete",
  },

  // === FILE / IMAGE UPLOAD ===
  uploadImage: {
    url: `${backendDomain}/api/upload-images`,
    method: "post",
  },

  // === ORDER ===
  createOrder: {
    url: `${backendDomain}/api/order`,
    method: "post",
  },
  getOrdersByStatus: {
    url: `${backendDomain}/api/order/by-status`,
    method: "get",
  },
  getOrderById: {
    url: `${backendDomain}/api/order/`,
    method: "get",
  },
  cancelOrder: {
    url: `${backendDomain}/api/order/`,
    method: "put",
  },
  vnpayReturn: {
    url: `${backendDomain}/api/order/vnpay-return`,
    method: "get",
  },
  getAllOrders: {
    url: `${backendDomain}/api/all-orders`,
    method: "get",
  },

  // === REVIEW ===
  getProductReviews: {
    url: `${backendDomain}/api/review/product`,
    method: "get",
  },
  addReview: {
    url: `${backendDomain}/api/add-review`,
    method: "post",
  },
  updateReview: {
    url: `${backendDomain}/api/update-review`,
    method: "put",
  },
  deleteReview: {
    url: `${backendDomain}/api/delete-review`,
    method: "delete",
  },
};

export default SummaryApi;
