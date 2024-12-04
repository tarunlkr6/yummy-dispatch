import React from "react";
import { useGetCurrentUserQuery } from "../../slices/usersApiSlice";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Avatar,
  Spinner,
} from "@material-tailwind/react";
import { PencilIcon, EnvelopeIcon, CalendarIcon, ClockIcon, IdentificationIcon } from "@heroicons/react/24/solid";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";

const Profile = () => {
  const { data: profile, isLoading, error } = useGetCurrentUserQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#ff6347]"></div>
    </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Typography variant="h6" color="red">
          Error: {error.message}
        </Typography>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
    <Link to="/">
        <Button size="medium" variant="outlined" color="black" className="mx-auto rounded-full">
          Go back
        </Button>
      </Link>
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-slate-100 to-slate-200 min-h-screen">
      <Card className="w-full max-w-[64rem] mx-auto shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <CardHeader
          floated={false}
          className="h-60 bg-slate-300 relative overflow-hidden"
          style={{
            backgroundImage: `url(${assets.Black_banner})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <Typography variant="h2" className="text-center text-white font-bold tracking-wider animate-pulse">
              Welcome to Scan&Dine
            </Typography>
          </div>
        </CardHeader>

        <CardBody className="text-center relative px-6 py-12">
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
            <Avatar
              size="xxl"
              alt="Profile"
              className="border-4 border-white shadow-lg h-40 w-40"
              src={profile.data.avatar || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=1480&q=80"}
            />
          </div>
          <div className="mt-20">
            <Typography variant="h3" color="blue-gray" className="mb-2">
              {profile.data.fullName}
            </Typography>
            <Typography 
              color="blue-gray" 
              className="font-medium text-lg bg-blue-gray-50 inline-block px-4 py-1 rounded-full"
            >
              {profile.data.isAdmin ? "Administrator" : "User"}
            </Typography>
          </div>
        </CardBody>

        <CardBody className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileItem icon={<EnvelopeIcon className="h-6 w-6" />} label="Email" value={profile.data.email} />
            <ProfileItem icon={<CalendarIcon className="h-6 w-6" />} label="Member Since" value={formatDate(profile.data.createdAt)} />
            <ProfileItem icon={<ClockIcon className="h-6 w-6" />} label="Last Updated" value={formatDate(profile.data.updatedAt)} />
            <ProfileItem icon={<IdentificationIcon className="h-6 w-6" />} label="User ID" value={profile.data._id} />
          </div>
        </CardBody>

        <CardFooter className="flex justify-center pt-2 pb-6">
          <Button
            size="lg"
            color="blue-gray"
            disabled
            className="flex items-center gap-3 px-6 py-3 bg-blue-gray-800 hover:bg-blue-gray-900 transition-all duration-300 hover:cursor-not-allowed"
          >
            <PencilIcon strokeWidth={2} className="h-5 w-5" /> Edit Profile
          </Button>
        </CardFooter>
      </Card>
    </div>
    </>
  );
};

const ProfileItem = ({ icon, label, value }) => (
  <div className="flex items-center p-4 bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105">
    <div className="mr-4 text-blue-gray-500">
      {icon}
    </div>
    <div>
      <Typography variant="h6" color="blue-gray" className="mb-1">
        {label}
      </Typography>
      <Typography variant="small" className="text-slate-700 font-medium">
        {value}
      </Typography>
    </div>
  </div>
);

export default Profile;