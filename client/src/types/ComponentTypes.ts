export type ModalOption = "deleteBlog" | "newUser";

export interface IModalProps {
    id: string;
    token: string;
    option: ModalOption;
}