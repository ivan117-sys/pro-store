import { APP_NAME } from "@/lib/constants";

const Footer = () => {

  const currentYear = new Date().getFullYear();

  return ( 
  
  <footer className="border-t">

    <div className="p-s text-center">
      {currentYear} {APP_NAME} All rights reserved
    </div>
  </footer> );
}
 
export default Footer;