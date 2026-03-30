import Navbar from "../components/Navbar";
import List from "../components/List";
import Footer from "../components/Footer";
import useExplorePage from "../hooks/useExplorePage";
import useAppSelector from "../hooks/useAppSelector";

const Explore = () => {

    const user = useAppSelector((state) => state.user);
    const {
        blogs,
        isFetching,
        loaderRef,
        searchName,
    } = useExplorePage({
        token: user.token,
        userId: user.id,
    });

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
                        isFetching={isFetching}
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
