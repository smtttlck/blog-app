import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import * as api from "../api/Api";
import Footer from "../components/Footer";
import { useCallback, useEffect, useRef, useState } from "react";
import IBlog from "../types/BlogTypes";
import List from "../components/List";

const Profile = () => {

    const user = useSelector((state: any) => state.user);

    const [blogType, setBlogType] = useState<"blogs" | "bookmarks">("blogs");
    const [blogs, setBlogs] = useState<IBlog[]>([]);
    const [offset, setOffset] = useState<number>(0);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const loaderRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setBlogs([]);
        setHasMore(true);
        setOffset(0);
    }, [blogType])

    const fetchBlogs = async (offset: number) => {
        setIsFetching(true);
        const query: string = `?userId=${user.id}&${(blogType === "bookmarks") ? "onlyBookmarks=true" : ""}&limit=6&offset=${offset}`;
        const data: IBlog[] = await api.fetchData("getBlog/", user.token, null, query);
        if (data.length === 0)
            setHasMore(false);
        else
            setBlogs(prevBlogs => (prevBlogs) ? [...prevBlogs, ...data] : [...data]);
        setIsFetching(false);
    }

    useEffect(() => {
        if (hasMore)
            fetchBlogs(offset);
    }, [offset, hasMore])

    const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
        const target = entries[0];
        if (target.isIntersecting && !isFetching && hasMore) {
            setOffset(prevOffset => prevOffset + 6);
        }
    }, [isFetching, hasMore]);

    useEffect(() => {
        const option = {
            root: null,
            rootMargin: '20px',
            threshold: 1.0
        };

        const observer = new IntersectionObserver(handleObserver, option);
        if (loaderRef.current) observer.observe(loaderRef.current);

        return () => {
            if (loaderRef.current) observer.unobserve(loaderRef.current);
        };
    }, [handleObserver]);

    return (
        <main className="page">
            <Navbar />

            <div className="container">

                <div className="big-profile-picture text-center mt-3">
                    <img src={user.picture_path} />
                    <h3>{user.username}</h3>
                </div>

                <div className="tablist d-flex justify-content-center my-2">
                    <ul className="list-group list-group-horizontal">
                        <li
                            className={`list-group-item w-auto list-group-item-action ${blogType == "blogs" ? "list-group-item-success" : ""}`}
                            onClick={() => setBlogType("blogs")}
                        >
                            Blogs
                        </li>
                        <li
                            className={`list-group-item w-auto list-group-item-action ${blogType == "bookmarks" ? "list-group-item-success" : ""}`}
                            onClick={() => setBlogType("bookmarks")}
                        >
                            Bookmarks
                        </li>
                    </ul>
                </div>

                <List
                    datas={blogs}
                />
                <div ref={loaderRef} />

            </div>

            <Footer />

        </main >
    )
}

export default Profile