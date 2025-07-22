import React, { useEffect, useState } from "react";
import { Pagination, Spin, Button, message, Modal } from "antd";
import useBlog from "../../../Hooks/useBlog";
import ModalCreateCategoryBlog from "./ModalCreateCategoryBlog/ModalCreateCategoryBlog";
import ModalEditCategoryBlog from "./ModalEditCategoryBlog/ModalEditCategoryBlog";
import "./BlogCategoriesAdmin.css";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";

function BlogCategoriesAdmin() {
  const {
    blogCategories,
    totalCategories,
    loading,
    searchListBlogCategory,
    addNewBlogCategory,
    updateBlogCategoryById,
    deleteBlogCategoryById,
  } = useBlog();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState(null);

  const [currentCategoryPage, setCurrentCategoryPage] = useState(1);
  const categoryPageSize = 10;
  const [categoryFilters] = useState({
    keyword: "",
    sort_by: "created_at",
    sort_order: "desc",
  });

  useEffect(() => {
    searchListBlogCategory({
      ...categoryFilters,
      pageNum: currentCategoryPage,
      pageSize: categoryPageSize,
    });
    // eslint-disable-next-line
  }, [currentCategoryPage, categoryFilters]);

  // Handler tạo mới
  const handleCreateCategory = async (data) => {
    const res = await addNewBlogCategory(data);
    if (res.success) {
      message.success("Tạo danh mục blog thành công!");
      setIsAddModalOpen(false);
      searchListBlogCategory({ pageNum: 1, pageSize: 10 });
    } else {
      message.error(res.message || "Tạo danh mục blog thất bại!");
    }
  };

  // Handler sửa
  const handleEdit = (cat) => {
    setEditCategory(cat);
    setIsEditModalOpen(true);
  };

  const handleEditCategory = async (data) => {
    const res = await updateBlogCategoryById(data._id || data.id, {
      name: data.name,
    });
    if (res.success) {
      message.success("Cập nhật danh mục blog thành công!");
      setIsEditModalOpen(false);
      setEditCategory(null);
      searchListBlogCategory({
        pageNum: currentCategoryPage,
        pageSize: categoryPageSize,
      });
    } else {
      message.error(res.message || "Cập nhật thất bại!");
    }
  };

  // Handler xóa
  const handleDelete = (cat) => {
    setDeleteCategory(cat);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCategory = async () => {
    if (!deleteCategory) return;
    const res = await deleteBlogCategoryById(
      deleteCategory._id || deleteCategory.id
    );
    if (res.success) {
      message.success("Xóa danh mục blog thành công!");
      setIsDeleteModalOpen(false);
      setDeleteCategory(null);
      searchListBlogCategory({
        pageNum: currentCategoryPage,
        pageSize: categoryPageSize,
      });
    } else {
      message.error("Xóa thất bại!");
    }
  };

  return (
    <div className="blogcategory-table-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h2 className="blogcategory-table-title">Danh mục các bài Blog </h2>
        <Button type="primary" onClick={() => setIsAddModalOpen(true)}>
          Thêm danh mục
        </Button>
      </div>
      {loading ? (
        <Spin />
      ) : (
        <>
          <table className="blogcategory-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Name</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {blogCategories && blogCategories.length > 0 ? (
                blogCategories.map((cat, idx) => (
                  <tr key={cat._id || cat.id}>
                    <td>
                      {(currentCategoryPage - 1) * categoryPageSize + idx + 1}
                    </td>
                    <td>{cat.name}</td>
                    <td>
                      <div className="action-admin-category">
                        <CiEdit
                          className="icon-admin-category"
                          onClick={() => handleEdit(cat)}
                        />
                        <MdDeleteOutline
                          className="icon-admin-category"
                          onClick={() => handleDelete(cat)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} style={{ textAlign: "center" }}>
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <Pagination
            current={currentCategoryPage}
            pageSize={categoryPageSize}
            total={totalCategories}
            onChange={setCurrentCategoryPage}
            style={{
              marginTop: 20,
              display: "flex",
              justifyContent: "flex-end",
            }}
          />
        </>
      )}
      {/* Modal tạo mới */}
      <ModalCreateCategoryBlog
        isModalOpen={isAddModalOpen}
        handleCancel={() => setIsAddModalOpen(false)}
        handleCreate={handleCreateCategory}
        loading={loading}
      />
      {/* Modal chỉnh sửa */}
      <ModalEditCategoryBlog
        isModalOpen={isEditModalOpen}
        handleCancel={() => {
          setIsEditModalOpen(false);
          setEditCategory(null);
        }}
        handleEdit={handleEditCategory}
        loading={loading}
        editCategory={editCategory}
      />
      {/* Modal xác nhận xóa */}
      <Modal
        title="Xác nhận xóa danh mục"
        open={isDeleteModalOpen}
        onOk={handleDeleteCategory}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Xóa"
        cancelText="Hủy"
      >
        <p>
          Bạn có chắc chắn muốn xóa danh mục blog{" "}
          <strong>{deleteCategory?.name}</strong>?
        </p>
      </Modal>
    </div>
  );
}

export default BlogCategoriesAdmin;
