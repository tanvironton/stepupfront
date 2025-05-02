/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { getBaseUrl } from "../../../../utils/getBaseUrl";
import toast from "react-hot-toast";

const UploadImage = ({
  name,
  setImages,
  label,
  id,
  isSuccess,
  existingUrls = [],
}) => {
  const [loading, setLoading] = useState(false);
  const [urls, setUrls] = useState([]);
  const ref = useRef(null);

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const uploadSingleImage = async (base64) => {
    // call api to upload the image to cloudinary server
    setLoading(true);

    await axios
      .post(`${getBaseUrl()}/uploadImage`, { image: base64 })
      .then((res) => {
        const imageUrls = res.data;
        setUrls(imageUrls);
        //  console.log("Image URL:", res.data);
        toast.success("Uploaded image successfully!");
        setImages([...imageUrls]);
      })
      .then(() => setLoading(false))
      .catch((error) => {
        console.error("Failed to upload image", error);
        setLoading(false);
        //alert("Failed to upload image, please try again!");
      });
  };

  const uploadImage = async (event) => {
    try {
      const files = event.target.files;

      if (!files || files.length === 0) {
        console.error("No files selected.");
        return;
      }

      // Convert all files to Base64 in parallel
      const base64s = await Promise.all(
        Array.from(files).map((file) => convertBase64(file))
      );

      if (base64s.length > 0) {
        uploadSingleImage(base64s); // Assuming this function can handle an array of Base64 strings
      }
    } catch (error) {
      console.error("Error during file upload:", error.message);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      ref.current.value = "";
      setUrls([]);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (existingUrls?.length === 0) return;
    setUrls(() => [...existingUrls]);
  }, [existingUrls]);

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-600">
        {label}
      </label>
      <input
        ref={ref}
        multiple
        type="file"
        onChange={uploadImage}
        name={name}
        id={name}
        className="add-product-InputCSS"
      />
      {loading && (
        <div className="mt-2 text-sm text-blue-600">
          <p>Uplading...</p>
        </div>
      )}
      <div className="grid grid-cols-4 gap-2 p-4">
        {urls?.length > 0 &&
          urls?.map((url, i) => (
            <div className="p-2 border bg-muted" key={i}>
              <img className="w-full" src={url} alt="uploaded image" />
            </div>
          ))}
      </div>
    </div>
  );
};

export default UploadImage;
