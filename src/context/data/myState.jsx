import React, { useEffect, useState } from 'react'
import MyContext from './myContext';
import { collection, deleteDoc, doc, getDoc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { fireDB } from '../../firebase/firebaseConfig';

function MyState(props) {
    const [mode, setMode] = useState('light');
    const toggleMode = () => {
        if (mode === 'light') {
            setMode('dark');
            document.body.style.backgroundColor = 'rgb(17, 24, 39)';
        }
        else {
            setMode('light');
            document.body.style.backgroundColor = 'white';
        }
    }

    const [searchkey, setSearchkey] = useState('');

    const [loading, setloading] = useState(false);

    const [getAllBlog, setGetAllBlog] = useState([]);
    
    function getAllBlogs() {
        setloading(true);
        try {
            const q = query(
                collection(fireDB, "blogPost"),
                orderBy('time')
            );
            const data = onSnapshot(q, (QuerySnapshot) => {
                let blogArray = [];
                QuerySnapshot.forEach((doc) => {
                    blogArray.push({ ...doc.data(), id: doc.id });
                });

                setGetAllBlog(blogArray)
                console.log(blogArray)
                setloading(false)
            });
            return () => data;
        } catch (error) {
            console.log(error)
            setloading(false)
        }
    }

    useEffect(() => {
        getAllBlogs();
    }, []);

    const deleteBlogs = async (id) => {
        console.log(id,"deleteId");
        try {
            await deleteDoc(doc(fireDB, "blogPost", id));
            getAllBlogs()
            toast.success("Blogs deleted successfully")
        } catch (error) {
            console.log(error)
        }
    }

    const updateBlog = async (id, updatedBlog) => {
        try {
            const blogRef = doc(fireDB, "blogPost", id);
            console.log(id,"blogRef");
            await updateDoc(blogRef, updatedBlog);
            getAllBlogs()
            toast.success("Blog updated successfully");
        } catch (error) {
            console.error("Error updating blog: ", error);
        }
    }

    const getBlogById = async (id) => {
        try {
            const blogRef = doc(fireDB, "blogPost", id);
            const blogSnap = await getDoc(blogRef);
            if (blogSnap.exists()) {
                return blogSnap.data();
            } else {
                console.log("No such document!");
                return null;
            }
        } catch (error) {
            console.error("Error getting blog: ", error);
            return null;
        }
    }


    return (
        <MyContext.Provider value={{
            mode,
            toggleMode,
            searchkey,
            setSearchkey,
            loading,
            setloading,
            getAllBlog,
            deleteBlogs,
            updateBlog,
            getBlogById
        }}>
            {props.children}
        </MyContext.Provider>
    )
}

export default MyState