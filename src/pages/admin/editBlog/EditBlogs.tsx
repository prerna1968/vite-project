import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../components/layout/Layout";
import myContext from "../../../context/data/myContext";
import { useNavigate, useParams } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";

function EditBlog() {
  const context = useContext(myContext);
  const { mode, getBlogById, updateBlog, getAllBlogs } = context;
  const { id } = useParams();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const blog = await getBlogById(id);
      if (blog) {
        setContent(blog.content);
        setTitle(blog.title);
        setDescription(blog.description);
      } else {
        console.error("No blog found with the given ID.");
      }
    };
    fetchData();
  }, [id, getBlogById]);

  const handleEditorChange = (content, editor) => {
    setContent(content);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSave = () => {
    updateBlog(id, { title, description, content });
    navigate("/dashboard");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="py-10">
          <h1 className="text-2xl font-bold mb-4">Edit Blog Post</h1>
          <div className="mb-4">
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Title"
            />
          </div>
          <div className="mb-4">
            <textarea
              value={description}
              onChange={handleDescriptionChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Description"
              rows={3}
            />
          </div>
          <Editor
            apiKey="tkkuxr58v88b9hvbr55c2smwgu25z2yhf6mwtdyhomqyhpzo"
            value={content}
            init={{
              height: 500,
              menubar: true,
              plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste code help wordcount",
              ],
              toolbar:
                "undo redo | formatselect | " +
                "bold italic backcolor | alignleft aligncenter " +
                "alignright alignjustify | bullist numlist outdent indent | " +
                "removeformat | help",
              content_style:
                "body { font-family: 'Roboto', sans-serif; font-size: 16px; }",
            }}
            onEditorChange={handleEditorChange}
          />
          <div className="mt-4">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default EditBlog;
