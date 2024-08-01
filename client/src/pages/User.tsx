import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import * as api from "../api/Api";
import IBlog from "../types/BlogTypes";
import List from "../components/List";
import Footer from "../components/Footer";

const User = () => {

    const user = useSelector((state: any) => state.user);

    const { id } = useParams<string>();

    const [count, setCount] = useState<number>();
    const [blogs, setBlogs] = useState<IBlog[] | null>(null);
    const [offset, setOffset] = useState<number>(0);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const loaderRef = useRef<HTMLDivElement | null>(null);


    useEffect(() => {
        api.fetchData(`getBlog/count/${id}`, user.token, null, null)
            .then(data => setCount(data));
    }, [id])

    const fetchBlogs = async (offset: number) => {
        setIsFetching(true);
        const data: IBlog[] = await api.fetchData(`getBlog/`, user.token, null, `?authorId=${id}&limit=4&offset=${offset}`)
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
                {(blogs && typeof blogs?.[0]?.authorId !== "string") &&
                    <div className="big-profile-picture text-center mt-3">
                        <img src={(blogs[0].authorId.picture_path && blogs[0].authorId.picture_path !== "") ?
                            `http://localhost:3001/${blogs[0].authorId.picture_path.split("public\\")[1].split("\\").join('/')}` :
                            "/public/default-user.png"}
                        />
                        <h3>{`${count} Stories By ${blogs[0].authorId.username}`}</h3>
                    </div>
                }

                <hr />

                {blogs &&
                    <>
                        <List
                            cardType="big"
                            datas={blogs}
                        />
                        <div ref={loaderRef} />
                    </>
                }

            </div>

            <Footer />

        </main >
    )
}

export default User