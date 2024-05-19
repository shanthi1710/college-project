import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../../utils/ContextProvider";
import placementcell from "../../assets/placementcell.png";
// import { GoogleButton } from "react-google-button";

const Signin = () => {
  const { googleSignIn, unRegisteredGoogleUser, registeredGoogleUser } =
    useContext(Context);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (unRegisteredGoogleUser) {
      navigate("/register");
    }
    if (registeredGoogleUser) {
      navigate("/userprofile");
    }
  }, [unRegisteredGoogleUser, registeredGoogleUser]);

  const navigateAdminSignin = () => {
    navigate("/adminsignin");
  };

  return (
    <div
      className="h-full flex flex-col md:flex-row"
      style={{
        backgroundImage:
          "url('https://media.licdn.com/dms/image/C5622AQFA3CIaGEKhhA/feedshare-shrink_800/0/1673679036529?e=2147483647&v=beta&t=TQgQME0RXqReO4ocUqQeIslJYTXqNBa5edOG-jTDots')",
      }}
    >
      <div className="py-3 flex-1 flex flex-col justify-center items-center backdrop-blur-lg bg-white/40">
        <div className="m-3 p-7 rounded-xl bg-white shadow-xl">
          <div className="space-y-4">
            <img
              src={placementcell}
              loading="lazy"
              className="w-20 rounded-full shadow-md"
              alt="tailus logo"
            />
            <h2 className="mb-8 text-5xl text-blue-950 font-black">
              Sign in to apply for <br /> Placements
            </h2>
          </div>
          <div className="mt-16 grid space-y-4">
            <button
              onClick={handleGoogleSignIn}
              className="group h-12 px-6 border-2 border-gray-300 rounded-full transition duration-300
     hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100"
            >
              <div className="relative flex items-center space-x-4 justify-center">
                <img
                  src="https://tailus.io/sources/blocks/social/preview/images/google.svg"
                  className="absolute left-0 w-6"
                  alt="google logo"
                />
                <span className="block w-max font-semibold tracking-wide text-gray-700 text-lg transition duration-300 group-hover:text-blue-600">
                  Continue with Google
                </span>
              </div>
            </button>
            <button
              onClick={navigateAdminSignin}
              className="group h-12 px-6 border-2 border-gray-300 rounded-full transition duration-300
     hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100"
            >
              <div className="relative flex items-center space-x-4 justify-center">
                <span className="block w-max font-semibold tracking-wide text-gray-700 text-lg transition duration-300 group-hover:text-blue-600">
                  Signin as TPO
                </span>
              </div>
            </button>
          </div>
          <div className="mt-20 text-gray-600 text-center">
            <p className="text-xs">
              By proceeding, you agree to our Terms of Use
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
