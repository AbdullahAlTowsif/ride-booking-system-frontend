import type { ReactNode } from "react";
import Footer from "../modules/Common/Footer";
import Navbar from "../modules/Common/Navbar";

interface IProps {
    children: ReactNode
}

const CommonLayout = ({children}: IProps) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar></Navbar>
            <div className="grow-1">
                {children}
            </div>
            <Footer></Footer>
        </div>
    );
};

export default CommonLayout;
