import React, { useState } from "react";

//iconify
import { Icon } from "@iconify/react";

//components
import Modal from "../../Modal";
import { DeleteBlog } from "./DeleteBlog";
import EditBlog from "./EditBlog";
import { Link } from "react-router-dom";

const Table = (props) => {
  const [isDeleteModalOpened, setIsDeleteModalOpened] = useState(false);
  const [isEditBlogModalOpened, setIsBlogEditModalOpened] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [selectedBlog, setSelectedBlog] = useState();

  const openDeleteModal = () => setIsDeleteModalOpened(true);
  const closeDeleteModal = () => setIsDeleteModalOpened(false);

  const openEditModal = () => setIsBlogEditModalOpened(true);
  const closeEditModal = () => setIsBlogEditModalOpened(false);

  return (
    <div className="overflow-auto w-full mt-[20px]">
      <table className="w-full min-w-[400px] max-h-[100px] overflow-auto">
        <thead className="border-b-2 bg-gray-100 dark:bg-secondary-black">
          <tr>
            <th className="p-[1em]"></th>
            <th className="p-[1em]">blog title</th>
            <th className="p-[1em]">blog content</th>
            <th className="p-[1em]">img url</th>
            <th className="p-[1em]">Date</th>
            <th className="p-[1em]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {props.blogs?.map((blog) => {
            return (
              <tr className="border-b-2" key={blog._id}>
                <td className="text-center p-[1em]">
                  <Link
                    to={`/blog/${blog._id}`}
                    className="flex justify-center items-center"
                  >
                    <Icon icon={"icon-park:share"} />
                  </Link>
                </td>
                <td className="text-center p-[1em]">{blog.title}</td>
                <td className="text-center p-[1em]">
                  {blog.content.slice(0, 10)}....
                </td>
                <td className="text-center p-[1em]">
                  {blog.imgUrl.slice(0, 10)}....
                </td>
                <td className="text-center p-[1em]">
                  {blog.createdAt.slice(0, 10)}
                </td>
                <td className="text-center flex justify-center items-center gap-[5px]  p-[1em]">
                  <Icon
                    icon="material-symbols:delete-outline"
                    className="text-red-600 cursor-pointer"
                    onClick={() => {
                      openDeleteModal();
                      setSelectedId(blog._id);
                    }}
                  />
                  <Icon
                    icon="material-symbols:edit"
                    className="text-blue-600 cursor-pointer"
                    onClick={() => {
                      openEditModal();
                      setSelectedId(blog._id);
                      setSelectedBlog(blog);
                    }}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {isDeleteModalOpened && (
        <Modal onClose={closeDeleteModal}>
          <DeleteBlog onClose={closeDeleteModal} id={selectedId} />
        </Modal>
      )}

      {isEditBlogModalOpened && (
        <Modal onClose={closeEditModal}>
          <EditBlog
            onClose={closeEditModal}
            id={selectedId}
            selectedBlog={selectedBlog}
          />
        </Modal>
      )}
    </div>
  );
};

export default Table;
