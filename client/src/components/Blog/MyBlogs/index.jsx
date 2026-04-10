import React, { useState } from "react";

//components

import Modal from "../../Modal";
import NewBlogForm from "./CreateBlog";
import Table from "./Table";
import NoData from "../../NoData";
import IsLoading from "../../IsLoading";

//rtk
import { useGetBlogPostsByUserIdQuery } from "../../../api/apiSlice";

const Blogs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [search, setSearch] = useState("");

  const {
    data: blogs,
    refetch,
    isLoading,
  } = useGetBlogPostsByUserIdQuery({
    userId: localStorage.getItem("id"),
    title: search,
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="mt-[40px]">
      <div className="flex justify-between">
        <h1 className="text-lg font-semibold">My blogs</h1>
        <a className="mainBtn w-fit" onClick={openModal}>
          New Blog
        </a>
      </div>

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NewBlogForm onClose={closeModal} />
        </Modal>
      )}
      <div className="w-full mt-[10px] ">
        <form className="flex gap-[20px] p-[10px] flex-wrap items-center bg-white my-[10px] rounded-lg dark:bg-secondary-black dark:text-white">
          <div>
            <input
              type="text"
              className="px-[10px] py-[5px] border
             border-gray-500 rounded-md dark:bg-secondary-black"
              placeholder="blog title"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            ></input>
          </div>
        </form>
      </div>

      <Table blogs={blogs?.data} />
      {isLoading && <IsLoading />}
      {blogs?.data.length === 0 && <NoData />}
    </div>
  );
};

export default Blogs;
