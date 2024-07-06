import React, { useContext, useEffect, useState } from "react";
import Layout from "../../../components/layout/Layout";
import myContext from "../../../context/data/myContext";
import { useNavigate, useParams } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

function EditBlog() {
  const context = useContext(myContext);
  const { getBlogById, updateBlog } = context;
  const { id } = useParams();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const navigate = useNavigate();
  const storage = getStorage();

  useEffect(() => {
    const fetchData = async () => {
      const blog = await getBlogById(id);
      console.log(blog,"blogssss>>>");
      
      
      if (blog) {
        setContent(blog.content);
        setTitle(blog.title);
        setCategory(blog.category);
        if (blog.thumbnail) {
          setThumbnailPreview(blog.thumbnail);
        }
      } else {
        console.error("No blog found with the given ID.");
      }
    };
    fetchData();
  }, [id, getBlogById]);

  const handleEditorChange = (content: string) => {
    setContent(content);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCategory(e.target.value);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setThumbnail(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result && typeof reader.result === 'string') {
          setThumbnailPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const updateBlogWithImage = async (thumbnailUrl: string) => {
      await updateBlog(id, { content, title, category, thumbnail: thumbnailUrl });
      navigate("/dashboard");
    };

    if (thumbnail) {
      const storageRef = ref(storage, `blogThumbnails/${thumbnail.name}`);
      uploadBytes(storageRef, thumbnail).then((snapshot) => {
        getDownloadURL(snapshot.ref).then(updateBlogWithImage);
      });
    } else {
      updateBlogWithImage(thumbnailPreview);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center w-full px-6 md:px-10 py-8">
        <h2 className="text-2xl font-bold mb-4">Edit Blog</h2>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Title"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
        />
        <textarea
          value={category}
          onChange={handleCategoryChange}
          placeholder="Category"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded"
        />
        <input
          type="file"
          onChange={handleThumbnailChange}
          className="mb-4"
        />
        {thumbnailPreview && (
          <img src={thumbnailPreview} alt="Thumbnail Preview" className="w-64 h-64 object-cover mb-4" />
        )}
        <Editor
          apiKey="tkkuxr58v88b9hvbr55c2smwgu25z2yhf6mwtdyhomqyhpzo"
          value={content}
          onEditorChange={handleEditorChange}
          init={{
            height: 500,
            menubar: true,
            plugins: [
              'advlist autolink lists link image charmap print preview anchor',
              'searchreplace visualblocks code fullscreen',
              'insertdatetime media table paste code help wordcount'
            ],
            toolbar:
              'undo redo | formatselect | bold italic backcolor | \
              alignleft aligncenter alignright alignjustify | \
              bullist numlist outdent indent | removeformat | help'
          }}
        />
        <button
          onClick={handleSave}
          className="px-4 py-2 mt-4 text-white bg-blue-500 rounded"
        >
          Save Changes
        </button>
      </div>
    </Layout>
  );
}

export default EditBlog;
