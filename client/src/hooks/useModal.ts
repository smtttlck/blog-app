import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as blogService from "../services/blogService";
import * as userService from "../services/userService";
import { updatePicturePath } from "../redux/features/user";
import { ModalOption } from "../types/ComponentTypes";
import useAppSelector from "./useAppSelector";

interface IUseModalParams {
    id: string;
    token: string;
    option: ModalOption;
}

const useModal = ({ id, token, option }: IUseModalParams) => {

    // hooks for navigation, dispatching actions to the Redux store, and selecting user data from the Redux store
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useAppSelector((state) => state.user);

    // state variables for managing the modal's state, the profile picture preview, and the selected file for updating the profile picture
    const [modalOption, setModalOption] = useState<string>(option);
    const [profilePicture, setProfilePicture] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);

    // function to handle closing the modal, which resets the modal option state variable to an empty string
    const handleCloseModal = () => {
        setModalOption("");
    };

    // function to handle changes to the profile picture input, which updates the profile picture preview and stores the selected file in state
    const handleProfilePicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];

        if (!selectedFile) {
            return;
        }

        setFile(selectedFile);
        const reader = new FileReader();

        reader.onload = (loadEvent) => {
            if (loadEvent.target?.result) {
                setProfilePicture(loadEvent.target.result as string);
            }
        };

        reader.readAsDataURL(selectedFile);
    };

    // function to handle deleting a blog, which calls the deleteBlog service function and navigates to the home page upon successful deletion
    const deleteHandler = async () => {
        await blogService.deleteBlog(token, id);
        navigate("/");
    };

    // function to handle updating the profile picture, which calls the updateUser service function with the selected file and updates the user's profile picture in the Redux store upon successful update
    const updateHandler = async () => {
        await userService.updateUser(token, id, { image: file });
        const userData = await userService.getUserById(user.token, user.id);

        dispatch(updatePicturePath(userData.picture_path || ""));
        window.location.reload();
    };

    return {
        deleteHandler,
        handleCloseModal,
        handleProfilePicChange,
        modalOption,
        profilePicture,
        updateHandler,
    };
};

export default useModal;