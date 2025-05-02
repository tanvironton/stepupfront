import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter signup logic here
    console.log('Subscribed with email:', email);
    setEmail('');
  };
  return (
    <>
    <div className="border-t border-b border-gray-300 md:border-b-1">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 grid-cols-2">
          {/* Fast Delivery */}
          <div className="border-r border-gray-300 p-5 sm:p-10 max-md:border-b">
            <div className="flex flex-col items-center text-center">
              <img
                src="https://storage.apex4u.com/c37cea14-1210-4ca5-b62e-a7fee2458e13.png"
                alt="Fast Delivery"
                className="h-12 w-auto"
              />
              <h3 className="text-lg font-medium mt-2">Fast Delivery</h3>
              <p className="text-gray-600 mt-2 max-w-sm">
                Get Fast and hassle-free delivery of your orders to your
                doorstep. 
              </p>
              <a href="#" className="text-blue-500 font-semibold underline mt-2">
                Learn More
              </a>
            </div>
          </div>

          {/* Super Deals */}
          <div className="border-r border-gray-300 p-5 sm:p-10 max-md:border-b">
            <div className="flex flex-col items-center text-center">
              <img
                src="https://storage.apex4u.com/caa1b470-6545-4ff9-bafa-f1d2db452f0d.svg"
                alt="Super Deals"
                className="h-12"
              />
              <h3 className="text-lg font-medium mt-2">Super Deals</h3>
              <p className="text-gray-600 mt-2 max-w-sm">
                Stay updated on all our latest news, offers, and campaigns.
              </p>
              <a href="/super-deals" className="text-blue-500 font-semibold underline mt-2">
                Learn More
              </a>
            </div>
          </div>

          {/*  Rewards */}
          <div className="border-r border-gray-300 p-5 sm:p-10 max-md:border-b">
            <div className="flex flex-col items-center text-center">
              <img
                src="https://storage.apex4u.com/eaa1ca5b-3448-48b9-9ae3-05a0e2782762.svg"
                alt=" Rewards"
                className="h-12"
              />
              <h3 className="text-lg font-medium mt-2"> Rewards</h3>
              <p className="text-gray-600 mt-2 max-w-sm">
                Unlock a world of exciting benefits with Apex Rewards loyalty program.
              </p>
              <a href="#" className="text-blue-500 font-semibold underline mt-2">
                Learn More
              </a>
            </div>
          </div>

          {/* Stay Connected */}
          <div className="p-5 sm:p-10">
            <div className="flex flex-col items-center text-center">
              <div className="flex space-x-4">
                <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                  <img src="https://storage.apex4u.com/304ea012-a1d6-4e0e-a7c8-497c16d0838c.jpg" alt="Facebook" className="h-8 w-8" />
                </a>
                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                  <img src="https://storage.apex4u.com/21c4fcd8-40a4-4299-9384-417029ca6456.png" alt="Instagram" className="h-8 w-8" />
                </a>
                <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">
                  <img src="https://storage.apex4u.com/45e37e99-4209-42aa-89ec-f571d77e850e.jpg" alt="YouTube" className="h-8 w-8" />
                </a>
                <a href="https://www.linkedin.com/company/" target="_blank" rel="noopener noreferrer">
                  <img src="https://storage.apex4u.com/20d2a998-6052-4e02-b198-5ad0c3fe26bb.jpg" alt="LinkedIn" className="h-8 w-8" />
                </a>
              </div>
              <h3 className="text-lg font-medium mt-4">Stay Connected</h3>
              <p className="text-gray-600 mt-2 max-w-sm">
                Keep up with the latest styles, news and offers on our social channels.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="block border-t border-gray-90 w-full">
      <div className="container mx-auto py-10 grid grid-cols-4 gap-x-6">
        {/* Subscription Form */}
        <div className="pl-5">
          <h3 className="text-sm font-semibold text-black">Sign up and Stay Updated</h3>
          <p className="mt-3 text-[14px] leading-7 tracking-wide text-gray-500">
            Sign up and stay updated with the latest product launches and offers!
          </p>
          <form
            className="mt-5"
            action=""
            method="post"
            target="_blank"
          >
            <div className="flex">
              <input
                required
                type="email"
                name="EMAIL"
                placeholder="Enter your email"
                className="w-full rounded-l-md border border-gray-300 px-4 py-2 text-sm text-gray-500 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-r-md border border-black bg-black px-4 py-1 text-white font-semibold transition-all hover:bg-white hover:text-black"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-8 w-8"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
              </button>
            </div>
          </form>
        </div>

        {/* About Apex */}
        <div className="text-center">
  <h3 className="text-sm font-semibold text-black capitalize">Step Up</h3>
  <ul className="mt-1 list-none pl-0">
    {[
      { name: "Home", link: "/" },
      { name: "Shop", link: "/shop" },
     
      { name: "Contact", link: "/contact" },
    ].map((item) => (
      <li key={item.name} className="mb-1">
        <a className="text-[13px] text-gray-500 hover:underline" href={item.link}>{item.name}</a>
      </li>
    ))}
  </ul>
</div>

        {/* Help Section */}
        <div className="text-center">
          <h3 className="text-sm font-semibold text-black capitalize">Help</h3>
          <ul className="mt-1 list-none pl-0">
            {[
              { name: "Terms & Conditions", link: "/page/terms-and-conditions" },
              { name: "Shipping & Delivery", link: "/page/shipping-delivery" },
              { name: "How to Order", link: "/page/how-to-order" },
              { name: "Exchange & Return Policy", link: "/page/exchange-return-policy" },
              { name: "Warranty Policy", link: "/page/warranty-policy" },
              { name: "Privacy Policy", link: "/page/privacy-policy" },
            ].map((item) => (
              <li key={item.name} className="mb-1">
                <a className="text-[13px] text-gray-500 hover:underline" href={item.link}>{item.name}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Logo */}
        <div className="flex justify-center items-center w-full">
      <img 
        src="https://storage.apex4u.com/a6402468-6140-4958-bc85-1d4db76d9b1a.png" 
        alt="Image" 
        className="w-[180px] h-fit" 
        loading="lazy"
      />
    </div>
      </div>
    </div>
    </>
    
  );
};

export default Footer;

