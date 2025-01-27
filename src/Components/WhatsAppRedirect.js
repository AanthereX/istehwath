import { useEffect, useState, memo } from "react";
import { Icons } from "../assets/icons";
const WhatsAppRedirect = () => {
  const [isIconVisible, setIconVisible] = useState(false);
  const { whatsAppIcon } = Icons;
  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    if (scrollPosition === 0) {
      setIconVisible(false);
    } else {
      setIconVisible(true);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return isIconVisible ? (
    <a
      href={"https://wa.me/+966550246646"}
      className={`fixed md:bottom-8 bottom-8 md:right-32 right-4 z-[99] flex items-center justify-center bg-c_25D366 rounded-full p-3.5`}
      rel={"noreferrer"}
      target={"_blank"}
    >
      <img src={whatsAppIcon} alt={"whatsappicon"} className={"h-8 w-8"} />
    </a>
  ) : null;
};
export default memo(WhatsAppRedirect);
