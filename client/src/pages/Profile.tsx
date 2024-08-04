import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import * as api from "../api/Api";
import Footer from "../components/Footer";
import { useCallback, useEffect, useRef, useState } from "react";
import IBlog from "../types/BlogTypes";
import List from "../components/List";
import TabList from "../components/TabList";
import ProfileCard from "../components/ProfileCard";

const Profile = () => {

    const user = useSelector((state: any) => state.user);

    const [blogType, setBlogType] = useState<"blogs" | "bookmarks" | "comments">("blogs");
    const [blogs, setBlogs] = useState<IBlog[]>([]);
    const [offset, setOffset] = useState<number>(0);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [counters, setCounters] = useState<any>({});

    const loaderRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const getCounters = async () => {
            const blogCounter: number = await api.fetchData(`getBlog/count/${user.id}`, user.token, null, null);
            const followerCounter: number = await api.fetchData(`getFollow/follower/${user.id}`, user.token, null, "?onlyCount=true");
            const followingCounter: number = await api.fetchData(`getFollow/following/${user.id}`, user.token, null, "?onlyCount=true");
            setCounters({ blogCounter, followerCounter, followingCounter });
        }
        getCounters();
    }, [])    

    useEffect(() => {
        setBlogs([]);
        setHasMore(true);
        setOffset(0);
    }, [blogType])

    const fetchBlogs = async (offset: number) => {
        setIsFetching(true);
        let query: string = `?limit=6&offset=${offset}`;
        if(blogType === "bookmarks")
            query += `&onlyBookmarks=true&userId=${user.id}`;
        else if(blogType === "blogs")
            query += `&authorId=${user.id}`;
        else if(blogType === "comments")
            query += `&onlyComments=true&userId=${user.id}`;
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

                <ProfileCard
                    username={user.username}
                    picture_path={user.picture_path}
                    counters={counters}
                />

                <TabList 
                    blogType={blogType} setBlogType={setBlogType}
                />

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