import React, { useContext, useState, useEffect } from "react";
import Layout from "../../../components/layout/Layout";
import myContext from "../../../context/data/myContext";
import { Button } from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { fireDB } from "../../../firebase/firebaseConfig"; // ensure the correct path

function Dashboard() {
  const context = useContext(myContext);
  const { mode } = context;
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // set the number of items per page

  const getAllBlogs = async () => {
    setLoading(true);
    try {
      const qry = query(collection(fireDB, "blogPost"), orderBy("time", "desc"));
      const data = await getDocs(qry);
      const blogArray = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBlogs(blogArray);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllBlogs();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(fireDB, 'blogPost', id));
      setBlogs(blogs.filter(blog => blog.id !== id));
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const totalPages = Math.ceil(blogs.length / itemsPerPage);
  const currentItems = blogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleEdit = (id) => {
    navigate(`/editblog/${id}`);
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Layout>
      <div className="py-10">
        <div className="flex flex-wrap justify-start items-center lg:justify-center gap-2 lg:gap-10 px-4 lg:px-0 mb-8">
          <div className="left">
            <img
              className="w-40 h-40 object-cover rounded-full border-2 border-pink-600 p-1"
              src={"https://cdn-icons-png.flaticon.com/128/3135/3135715.png"}
              alt="profile"
            />
          </div>
          <div className="right">
            <h1
              className="text-center font-bold text-2xl mb-2"
              style={{ color: mode === "dark" ? "white" : "black" }}
            >
              Prerna Gupta
            </h1>
            <h2
              style={{ color: mode === "dark" ? "white" : "black" }}
              className="font-semibold"
            >
              Software Developer
            </h2>
            <h2
              style={{ color: mode === "dark" ? "white" : "black" }}
              className="font-semibold"
            >
              pg178327@gmail.com
            </h2>
            <h2
              style={{ color: mode === "dark" ? "white" : "black" }}
              className="font-semibold"
            >
              <span>Total Blogs: </span> {blogs.length}
            </h2>
            <div className="flex gap-2 mt-2">
              <Link to="/createblog">
                <div className="mb-2">
                  <Button
                    style={{
                      background:
                        mode === "dark"
                          ? "rgb(226, 232, 240)"
                          : "rgb(30, 41, 59)",
                      color: mode === "dark" ? "black" : "white",
                    }}
                    className="px-8 py-2"
                  >
                    Create Blog
                  </Button>
                </div>
              </Link>
              <div className="mb-2">
                <Button
                  onClick={logout}
                  style={{
                    background:
                      mode === "dark"
                        ? "rgb(226, 232, 240)"
                        : "rgb(30, 41, 59)",
                    color: mode === "dark" ? "black" : "white",
                  }}
                  className="px-8 py-2"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
        <hr
          className={`border-2 ${
            mode === "dark" ? "border-gray-300" : "border-gray-400"
          }`}
        />
        <div className="container mx-auto px-4 max-w-7xl my-5">
          <div className="relative overflow-x-auto shadow-md sm:rounded-xl">
            <table className="w-full border-2 border-white shadow-md text-sm text-left text-gray-500 dark:text-gray-400">
              <thead
                style={{
                  background: mode === "dark" ? "white" : "rgb(30, 41, 59)",
                }}
                className="text-xs"
              >
                <tr>
                  <th
                    style={{
                      color: mode === "dark" ? "rgb(30, 41, 59)" : "white",
                    }}
                    scope="col"
                    className="px-6 py-3"
                  >
                    S.No
                  </th>
                  <th
                    style={{
                      color: mode === "dark" ? "rgb(30, 41, 59)" : "white",
                    }}
                    scope="col"
                    className="px-6 py-3"
                  >
                    Thumbnail
                  </th>
                  <th
                    style={{
                      color: mode === "dark" ? "rgb(30, 41, 59)" : "white",
                    }}
                    scope="col"
                    className="px-6 py-3"
                  >
                    Title
                  </th>
                  <th
                    style={{
                      color: mode === "dark" ? "rgb(30, 41, 59)" : "white",
                    }}
                    scope="col"
                    className="px-6 py-3"
                  >
                    Category
                  </th>
                  <th
                    style={{
                      color: mode === "dark" ? "rgb(30, 41, 59)" : "white",
                    }}
                    scope="col"
                    className="px-6 py-3"
                  >
                    Date
                  </th>
                  <th
                    style={{
                      color: mode === "dark" ? "rgb(30, 41, 59)" : "white",
                    }}
                    scope="col"
                    className="px-6 py-3"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => {
                    const { thumbnail, date, id, title, category } = item;
                    console.log(title,"titl>>>>");
                    console.log(item,"item>>");
                    return (
                      <tr
                        key={id}
                        className="border-b-2"
                        style={{
                          background:
                            mode === "dark" ? "rgb(30, 41, 59)" : "white",
                        }}
                      >
                        <td
                          style={{
                            color: mode === "dark" ? "white" : "black",
                          }}
                          className="px-6 py-4"
                        >
                          {index + 1}.
                        </td>
                        <th
                          style={{
                            color: mode === "dark" ? "white" : "black",
                          }}
                          scope="row"
                          className="px-6 py-4 font-medium"
                        >
                          <img
                            className="w-16 rounded-lg"
                            src={thumbnail}
                            alt="thumbnail"
                          />
                        </th>
                        <td
                          style={{
                            color: mode === "dark" ? "white" : "black",
                          }}
                          className="px-6 py-4"
                        >
                          {title}
                        </td>
                        <td
                          style={{
                            color: mode === "dark" ? "white" : "black",
                          }}
                          className="px-6 py-4"
                        >
                          {category}
                        </td>
                        <td
                          style={{
                            color: mode === "dark" ? "white" : "black",
                          }}
                          className="px-6 py-4"
                        >
                          {date}
                        </td>
                        <td
                          style={{
                            color: mode === "dark" ? "white" : "black",
                          }}
                          className="px-6 py-4 flex gap-2"
                        >
                          <button
                            onClick={() => handleEdit(id)}
                            className="px-4 py-1 rounded-lg text-white font-bold bg-blue-500"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(id)}
                            className="px-4 py-1 rounded-lg text-white font-bold bg-red-500"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      No blogs found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-4">
            <button
              onClick={() => handlePageChange("prev")}
              disabled={currentPage === 1}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === 1 ? "bg-gray-400" : "bg-blue-500 text-white"
              }`}
            >
              &lt;
            </button>
            <span className="mx-1 px-3 py-1 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange("next")}
              disabled={currentPage === totalPages}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === totalPages
                  ? "bg-gray-400"
                  : "bg-blue-500 text-white"
              }`}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
