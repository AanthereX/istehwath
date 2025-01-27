/** @format */

import { Tab } from "@headlessui/react";
import { useSelector } from "react-redux";
import { Fragment, useState } from "react";
import Startups from "../../Startups";

const Tabs = ({
  setShowCompleteProfileModal = false,
  showCompleteProfileModal = () => {},
  handlerCheckStartupBeforeNavigate,
  apiHit,
  loading,
  setLoading,
  handleGetBuyerListingWithFilters,
  pageBuyerLogs,
  setPageBuyerLogs,
  businessCategories,
  setBusinessCategories,
  values,
  setValues,
  location,
  setLocation,
  country,
  setCountry,
  selectedBusinessType,
  setSelectedBusinessType,
  promotion,
  setPromotion,
  selectedBusinessCategory,
  setSelectedBusinessCategory,
  businessCategory,
  setBusinessCategory,
  buyerCount,
  setBuyerCount,
  promotedTotal,
  setPromotedTotal,
  buyerListing,
  setBuyerListing,
  businessTypes,
  setBusinessTypes,
  handleGetBusinessType = () => {},
  filterModalOpen,
  setFilterModalOpen,
}) => {
  const [state, setState] = useState("recent");
  const Labels = useSelector((state) => state?.Language?.labels);
  const [activeTab, setActiveTab] = useState(1);
  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  return (
    <Fragment>
      <Tab.Group>
        <Tab.List>
          <Tab
            defaultChecked
            active
            onClick={() => handleTabClick(1)}
            className={`tab ${activeTab === 1 ? "active" : "inactive"}`}
          >
            <div className='p-3' onClick={() => setState("recent")}>
              <button> {Labels.recent} </button>
            </div>
          </Tab>
          <Tab
            className={`tab ${activeTab === 2 ? "active" : "inactive"}`}
            onClick={() => handleTabClick(2)}
          >
            <div className={"p-3"}>
              <button> {Labels.favorite} </button>
            </div>
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <Startups
              title={"recent"}
              setShowCompleteProfileModal={setShowCompleteProfileModal}
              showCompleteProfileModal={showCompleteProfileModal}
              handlerCheckStartupBeforeNavigate={
                handlerCheckStartupBeforeNavigate
              }
              apiHit={apiHit}
              loading={loading}
              setLoading={setLoading}
              activeTab={activeTab}
              handleGetBuyerListingWithFilters={
                handleGetBuyerListingWithFilters
              }
              buyerListing={buyerListing}
              setBuyerListing={setBuyerListing}
              pageBuyerLogs={pageBuyerLogs}
              setPageBuyerLogs={setPageBuyerLogs}
              businessCategories={businessCategories}
              setBusinessCategories={setBusinessCategories}
              location={location}
              setLocation={setLocation}
              country={country}
              values={values}
              setValues={setValues}
              setCountry={setCountry}
              selectedBusinessType={selectedBusinessType}
              setSelectedBusinessType={setSelectedBusinessType}
              promotion={promotion}
              businessCategory={businessCategory}
              setBusinessCategory={setBusinessCategory}
              setPromotion={setPromotion}
              selectedBusinessCategory={selectedBusinessCategory}
              setSelectedBusinessCategory={setSelectedBusinessCategory}
              buyerCount={buyerCount}
              setBuyerCount={setBuyerCount}
              promotedTotal={promotedTotal}
              setPromotedTotal={setPromotedTotal}
              businessTypes={businessTypes}
              setBusinessTypes={setBusinessTypes}
              handleGetBusinessType={handleGetBusinessType}
              filterModalOpen={filterModalOpen}
              setFilterModalOpen={setFilterModalOpen}
            />
          </Tab.Panel>
          <Tab.Panel>
            <Startups
              title={"favorite"}
              setShowCompleteProfileModal={setShowCompleteProfileModal}
              showCompleteProfileModal={showCompleteProfileModal}
              handlerCheckStartupBeforeNavigate={
                handlerCheckStartupBeforeNavigate
              }
              apiHit={apiHit}
              loading={loading}
              setLoading={setLoading}
              activeTab={activeTab}
              handleGetBuyerListingWithFilters={
                handleGetBuyerListingWithFilters
              }
              buyerListing={buyerListing}
              setBuyerListing={setBuyerListing}
              values={values}
              setValues={setValues}
              pageBuyerLogs={pageBuyerLogs}
              setPageBuyerLogs={setPageBuyerLogs}
              businessCategories={businessCategories}
              setBusinessCategories={setBusinessCategories}
              location={location}
              setLocation={setLocation}
              country={country}
              setCountry={setCountry}
              selectedBusinessType={selectedBusinessType}
              setSelectedBusinessType={setSelectedBusinessType}
              promotion={promotion}
              businessCategory={businessCategory}
              setBusinessCategory={setBusinessCategory}
              setPromotion={setPromotion}
              selectedBusinessCategory={selectedBusinessCategory}
              setSelectedBusinessCategory={setSelectedBusinessCategory}
              buyerCount={buyerCount}
              setBuyerCount={setBuyerCount}
              promotedTotal={promotedTotal}
              setPromotedTotal={setPromotedTotal}
              businessTypes={businessTypes}
              setBusinessTypes={setBusinessTypes}
              handleGetBusinessType={handleGetBusinessType}
              filterModalOpen={filterModalOpen}
              setFilterModalOpen={setFilterModalOpen}
            />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </Fragment>
  );
};

export default Tabs;
