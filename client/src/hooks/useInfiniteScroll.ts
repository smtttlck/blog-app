import { useEffect, useRef } from "react";

interface IUseInfiniteScrollParams {
    hasMore: boolean;
    isFetching: boolean;
    onLoadMore: () => void;
}

const useInfiniteScroll = ({ hasMore, isFetching, onLoadMore }: IUseInfiniteScrollParams) => {
    const loaderRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const currentLoader = loaderRef.current;
        const observer = new IntersectionObserver((entries) => {
            const target = entries[0];

            if (target.isIntersecting && !isFetching && hasMore) {
                onLoadMore();
            }
        }, {
            root: null,
            rootMargin: "20px",
            threshold: 1.0,
        });

        if (currentLoader) {
            observer.observe(currentLoader);
        }

        return () => {
            if (currentLoader) {
                observer.unobserve(currentLoader);
            }
        };
    }, [hasMore, isFetching, onLoadMore]);

    return loaderRef;
};

export default useInfiniteScroll;