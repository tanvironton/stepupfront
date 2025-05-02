import  { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from "react-redux";

const ProductReviewForm = ({ productId }) => {
  const [reviewsData, setReviewsData] = useState({ reviews: [], metadata: {} });
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [saveInfo, setSaveInfo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useSelector((state) => state.auth);
  // Fetch existing reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:5100/api/reviews/${productId}`);
        console.log('Fetched reviews:', response.data);
        setReviewsData(response.data); // Store the complete response object
      } catch (error) {
        console.error("Error fetching reviews:", error);
        toast.error("Failed to load reviews");
      }
    };

    fetchReviews();
  }, [productId]);

  // Load saved user info from localStorage
  useEffect(() => {
    const savedSaveInfo = localStorage.getItem('saveReviewInfo');
    if (savedSaveInfo) setSaveInfo(savedSaveInfo === 'true');
  }, []);

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    
    if (!comment.trim()) {
      toast.error("Please write a review");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Using a hardcoded userId which should be replaced with the actual user ID in a real app
      const userId =user._id;
      
      const reviewData = {
        comment,
        rating,
        userId,
        productId
      };
      
      await axios.post('http://localhost:5100/api/reviews/post-review', reviewData);
      
      // Save user preference if checkbox is checked
      localStorage.setItem('saveReviewInfo', saveInfo ? 'true' : 'false');
      
      // Reset form fields
      setRating(0);
      setComment('');
      
      toast.success("Your review is awaiting approval");
      
      // Refresh reviews
      const response = await axios.get(`http://localhost:5100/api/reviews/${productId}`);
      setReviewsData(response.data);
      
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("You can only review products you have purchased with completed orders");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Existing Reviews */}
      {reviewsData.reviews && reviewsData.reviews.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">
            Reviews ({reviewsData.reviews.length})
            {reviewsData.metadata && reviewsData.metadata.avgRating && (
              <span className="ml-2 text-gray-600">
                Average: {reviewsData.metadata.avgRating.toFixed(1)} / 5
              </span>
            )}
          </h2>
          
          {reviewsData.reviews.map((review, index) => (
            <div key={review._id || index} className="flex flex-col mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-start mb-2">
                <div className="mr-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-lg font-medium">
                      {review.userId?.email?.charAt(0) || 'A'}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">
                    {review.userId?.email ? review.userId.email.split('@')[0] : 'Anonymous'}
                  </h3>
                  <div className="flex items-center">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg 
                          key={star}
                          xmlns="http://www.w3.org/2000/svg" 
                          className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-700">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add a review section */}
      <div className="border border-gray-200 rounded-md p-6 mb-8 bg-white">
        <h2 className="text-xl font-bold mb-4">Add a review</h2>
        <p className="text-gray-600 mb-6 text-sm">Your email address will not be published. Required fields are marked *</p>

        <form onSubmit={handleSubmit}>
          {/* Rating */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Your rating *
            </label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  className="text-2xl focus:outline-none"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-6 w-6 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Review text */}
          <div className="mb-6">
            <label htmlFor="comment" className="block text-gray-700 font-medium mb-2">
              Your review *
            </label>
            <textarea
              id="comment"
              className="w-full border border-gray-300 rounded p-2 min-h-[120px]"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>

          {/* Save info checkbox */}
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={saveInfo}
                onChange={() => setSaveInfo(!saveInfo)}
              />
              <span className="ml-2 text-gray-700 text-sm">
                Save my preferences in this browser for the next time I comment.
              </span>
            </label>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductReviewForm;