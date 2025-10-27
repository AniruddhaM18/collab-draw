import MainPage from "@/components/home/MainPage";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import axiosInstance from "@/libs/axios/axiosInstance";

const page = async () => {
  const jwtCookie = (await cookies()).get("jwt");

  if (!jwtCookie) {
    redirect("/signin");
  }

  let user;
  let rooms;

  try{
    const { data } = await axiosInstance.get("/auth/info");
    user = data;
  } catch (e) {
    console.log("Error fetching user info")
    console.log(e)
  }

  try{
    const { data } = await axiosInstance.get("/room/all");
    rooms = data;
  } catch (e) {
    console.log("Error fetching rooms")
    console.log(e)
  }


  return (
    <MainPage jwtCookie={jwtCookie} rooms={rooms} userInfo={user} />
  );
};

export default page;