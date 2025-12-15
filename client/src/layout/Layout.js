import {LoginPage} from "../pages/login/LoginPage.js"
import {Dashboard} from "../pages/dashboard/Dashboard.js";
import { useEffect, useState } from "react";

export const Layout = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [userDetails, setUserDetails] = useState({
    userId:"",
    firstName: "",
    lastName: "",
    mailid: "",
    timeZone: "",
    createdTime: "",
  });
  useEffect(() => {
    window.catalyst.auth
      .isUserAuthenticated()
      .then((result) => {
        setUserDetails({
          userId: result.content.user_id,
          firstName: result.content.first_name,
          lastName: result.content.last_name,
          mailid: result.content.email_id,
          timeZone: result.content.time_zone,
          createdTime: result.content.created_time,
        });
        setIsUserAuthenticated(true);
      })
      .catch((err) => {})
      .finally(() => {
        setIsFetching(false);
      });
  }, []);
  return (
    <>
      {isFetching ? (
        <p>Loading …</p>
      ) : isUserAuthenticated ? (
        <Dashboard userDetails={userDetails} />
      ) : (
        <LoginPage />
      )}
    </>
  );
}