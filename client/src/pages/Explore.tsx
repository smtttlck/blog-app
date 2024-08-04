import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import * as api from "../api/Api";
import IBlog from "../types/BlogTypes";
import List from "../components/List";
import Footer from "../components/Footer";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Explore = () => {

    const user = useSelector((state: any) => state.user);

    const [blogs, setBlogs] = useState<IBlog[] | null>(null);
    const [offset, setOffset] = useState<number>(0);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const loaderRef = useRef<HTMLDivElement | null>(null);

    const query = useQuery();
    const searchName = query.get("name");
    const sort = query.get("sort");

    useEffect(() => {console.log(blogs)
        setBlogs([]);
        setHasMore(true);
        setOffset(0);
    }, [searchName, sort])

    const fetchBlogs = async (offset: number) => {
        setIsFetching(true);
        const queryForFetch: string = `?limit=4&offset=${offset}${sort ? `&sort=${sort}&sortType=DESC` : ""}${searchName ? `&name=${searchName}` : ""}&userId=${user.id}`;
        const data: IBlog[] = await api.fetchData("getBlog/", user.token, null, queryForFetch);
        if (data.length === 0)
            setHasMore(false);
        else 
            setBlogs(prevBlogs => (prevBlogs) ? [...prevBlogs, ...data] : [...data]);
        setIsFetching(false);
    };

    useEffect(() => {
        if (hasMore)
            fetchBlogs(offset);
    }, [offset, hasMore]);

    const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
        const target = entries[0];
        if (target.isIntersecting && !isFetching && hasMore) {
            setOffset(prevOffset => prevOffset + 4);
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

                <h1 className="my-4">{searchName ? `Blogs related to '${searchName}'` : "Explore new blogs"}</h1>
                <hr />

                {blogs &&
                    <><List
                        cardType="big"
                        datas={blogs}
                    />
                        <div ref={loaderRef} />
                    </>
                }

            </div>

            <Footer />

        </main>
    )
}

export default Explore;
