import { TypedUseSelectorHook, useSelector } from "react-redux";
import type { RootState } from "../redux/app/store";

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default useAppSelector;