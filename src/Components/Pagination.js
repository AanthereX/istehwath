/** @format */

import { Fragment } from "react";
import ReactPaginate from "react-paginate";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import useLocalStorage from "react-use-localstorage";
import { Roles } from "../constants/constant";

const Pagination = ({ pageCount, onPageChange, currentPage = 1 }) => {
  const role = localStorage.getItem("role");
  const [localStorageLanguage, setLocalStorageLanguage] = useLocalStorage(
    "language",
    "ar",
  );

  return (
    <Fragment>
      <ReactPaginate
        nextLabel={
          localStorageLanguage === "eng" ? (
            <BiChevronRight />
          ) : (
            <BiChevronLeft />
          )
        }
        pageCount={pageCount}
        breakLabel='...'
        previousLabel={
          localStorageLanguage === "eng" ? (
            <BiChevronLeft />
          ) : (
            <BiChevronRight />
          )
        }
        pageRangeDisplayed={2}
        marginPagesDisplayed={2}
        activeClassName={`active rounded-full !text-c_FFFFFF ${
          role === Roles.BUYER ? "!bg-c_BDA585" : "!bg-c_1C2F40"
        } w-8 h-8 text-center py-1 font-general_medium font-medium`}
        pageClassName='page-item'
        breakClassName='page-item'
        nextLinkClassName='page-link'
        pageLinkClassName='page-link'
        breakLinkClassName='page-link'
        previousLinkClassName='page-link'
        nextClassName='page-item next-item'
        previousClassName='page-item prev-item'
        containerClassName={`pagination react-paginate items-center bg-transparent border-b-[4px] rounded-b-[4px] ${
          role === Roles.BUYER ? "border-c_BDA585" : "border-c_1F3B54"
        }  font-general_regular font-normal w-fit mx-auto flex justify-end  items-end gap-x-4 rounded-md py-2 px-3`}
        onPageChange={onPageChange}
        forcePage={currentPage - 1}
      />
    </Fragment>
  );
};

export default Pagination;
