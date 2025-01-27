import { Fragment, useEffect, useMemo, useState } from "react";
import CommonLayout from "../MarketPlace/CommonLayout/CommonLayout";
import { MainSearch } from "../../Components/Buyer/MarketPlace";
import { useSelector } from "react-redux";
import PromotedBusinessCard from "../../Components/PromotedBusinessCard";
import { getPromotedBusiness } from "../../Store/actions/users";
import NoDataAvailable from "../../Components/NoDataAvailable";
import Pagination from "../../Components/Pagination";
import { debounce } from "lodash";

const PromotedBusiness = () => {
  const Labels = useSelector((state) => state?.Language?.labels);
  const [promotedBusiness, setPromotedBusiness] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    handleGetPromotedListing();
  }, [page]);

  const handleGetPromotedListing = () => {
    setLoading(true);
    getPromotedBusiness(
      search,
      page,
      (res) => {
        setPromotedBusiness(res?.promoteBusiness);
        setTotal(res?.total);
      },
      setLoading
    );
  };

  const handleChange = (e) => {
    if (e.target.value === "") {
      setPage(1);
    }
    setSearch(e.target.value);
    getPromotedBusiness(
      e.target.value,
      page,
      (res) => {
        setPromotedBusiness(res?.promoteBusiness);
        setTotal(res?.total);
      },
      setLoading
    );
  };

  const debounceResults = useMemo(() => {
    return debounce(handleChange, 500);
  }, []);

  useEffect(() => {
    debounceResults.cancel();
  }, []);
  return (
    <Fragment>
      <CommonLayout>
        <div className="mx-auto md:w-4/5 pt-2 p-4 sm:px-8">
          <MainSearch title={Labels.marketPlace} onChange={debounceResults} />
          <div className="mt-10">
            <span className="text-fs_32 text-c_000000 font-general_semiBold">
              {Labels.promotedBusiness}
            </span>
          </div>
          <div className="mt-10">
            {promotedBusiness?.map((item, index) => {
              
              return (
                <PromotedBusinessCard
                  key={`promoted-${index}`}
                  data={item}
                  setSearch={setSearch}
                  search={search}
                  loading={loading}
                />
              );
            })}

            {!loading && promotedBusiness?.length <= 0 ? (
              <NoDataAvailable entity={Labels.promoteBusiness} />
            ) : (
              <>
                {promotedBusiness?.length ? (
                  <Pagination
                    pageCount={Math.ceil(total) / 10}
                    onPageChange={(event) => {
                      setPage(event?.selected + 1);
                    }}
                  />
                ) : null}
              </>
            )}
          </div>
        </div>
      </CommonLayout>
    </Fragment>
  );
};

export default PromotedBusiness;
