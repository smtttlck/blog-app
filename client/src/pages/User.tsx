import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import * as api from "../api/Api";
import IBlog from "../types/BlogTypes";
import List from "../components/List";
import Footer from "../components/Footer";
import ProfileCard from "../components/ProfileCard";
import IUser from "../types/UserTypes";

const User = () => {

    const user = useSelector((state: any) => state.user);

    const { id } = useParams<string>();

    const [blogs, setBlogs] = useState<IBlog[] | null>(null);
    const [offset, setOffset] = useState<number>(0);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [counters, setCounters] = useState<any>({});
    const [userInfo, setUserInfo] = useState<any>({});

    const loaderRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const getCounters = async () => {
            const blogCounter: number = await api.fetchData(`getBlog/count/${id}`, user.token, null, null);
            const followerCounter: number = await api.fetchData(`getFollow/follower/${id}`, user.token, null, "?onlyCount=true");
            const followingCounter: number = await api.fetchData(`getFollow/following/${id}`, user.token, null, "?onlyCount=true");
            setCounters({ blogCounter, followerCounter, followingCounter });
        }
        getCounters();
        api.fetchData(`getUser/${id}`, user.token, null, null)
            .then((data: IUser) => setUserInfo({ username: data.username, picture_path: data.picture_path }));        
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

                <ProfileCard
                    username={userInfo.username}
                    picture_path={userInfo.picture_path}
                    counters={counters}
                />

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