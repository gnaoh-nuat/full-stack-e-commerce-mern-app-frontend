import SummaryApi from "../common";

const uploadImage = async (image) => {
  try {
    const formData = new FormData();
    formData.append("files", image);

    const response = await fetch(SummaryApi.uploadImage.url, {
      method: SummaryApi.uploadImage.method,
      body: formData,
      credentials: "include",
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error uploading image:", error);
    return { success: false, message: error.message };
  }
};

export default uploadImage;
