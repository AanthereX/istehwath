import CommonLayout from "../../MarketPlace/CommonLayout/CommonLayout";
import { ViewBusinesses } from "../../../Components/Buyer/MarketPlace";
import { useSelector } from "react-redux";
import { Icons } from "../../../assets/icons";
import { useNavigate } from "react-router-dom";

const BuyerRequestStartup = () => {
  const Labels = useSelector((state) => state?.Language?.labels);
  const { blueCheck, yellowCheck, location, blackCheck } = Icons;
  const navigation = useNavigate();
  const data = [
    {
      id: "#1324324",
      labelKey: "mainHeadingWillBeHere",
      businessKey: "businessKey",
      blueCheck: blueCheck,
      blackCheck: blackCheck,
      yellowCheck: yellowCheck,
      location: location,
      locationKey: "saudi",
      promoted: "Promoted",
      details: [
        { priceKey: "SAR10K", askingPrice: "AskingPrice" },
        { priceKey: "SAR10K", askingPrice: "TTMRevenue" },
        { priceKey: "NumberOfSize", askingPrice: "NumberOfCustomer" },
        { priceKey: "Jan2023", askingPrice: "DateFounded" },
        { priceKey: "StartUp", askingPrice: "StartupTeam" },
      ],
    },
    {
      id: "#1324324",
      labelKey: "mainHeadingWillBeHere",
      businessKey: "businessKey",
      blueCheck: blueCheck,
      yellowCheck: yellowCheck,
      location: location,
      locationKey: "saudi",
      promoted: "Promoted",
      details: [
        { price: "SAR 10 K", askingPrice: "Asking price" },
        { price: "SAR 10 K", askingPrice: "TTM Revenue" },
        { price: "10-100", askingPrice: "Number of customer" },
        { price: "Jan 2023", askingPrice: "Date founded" },
        { price: "03", askingPrice: "Startup Team" },
      ],
    },
    {
      id: "#1324324",
      labelKey: "mainHeadingWillBeHere",
      businessKey: "businessKey",
      blueCheck: blueCheck,
      yellowCheck: yellowCheck,
      location: location,
      locationKey: "saudi",
      promoted: "Promoted",
      details: [
        { price: "SAR 10 K", askingPrice: "Asking price" },
        { price: "SAR 10 K", askingPrice: "TTM Revenue" },
        { price: "10-100", askingPrice: "Number of customer" },
        { price: "Jan 2023", askingPrice: "Date founded" },
        { price: "03", askingPrice: "Startup Team" },
      ],
    },
    {
      id: "#1324334",
      labelKey: "mainHeadingWillBeHere",
      businessKey: "businessKey",
      blueCheck: blueCheck,
      yellowCheck: yellowCheck,
      location: location,
      locationKey: "saudi",
      promoted: "Promoted",
      details: [
        { price: "SAR 10 K", askingPrice: "Asking price" },
        { price: "SAR 10 K", askingPrice: "TTM Revenue" },
        { price: "10-100", askingPrice: "Number of customer" },
        { price: "Jan 2023", askingPrice: "Date founded" },
        { price: "03", askingPrice: "Startup Team" },
      ],
    },
  ];
  return (
    <div>
      <CommonLayout>
        <div className="mx-auto md:w-4/5 pt-2 p-4 sm:px-8">
          <div className="flex justify-center items-center">
            <span className="text-fs_40 font-general_semiBold">
              {Labels.buyerRequest}
            </span>
          </div>

          <div>
            <div className="cursor-pointer" onClick={() => navigation("/")}>
              <ViewBusinesses data={data} />
            </div>
          </div>
        </div>
      </CommonLayout>
    </div>
  );
};

export default BuyerRequestStartup;
