import { Fragment } from "react";
import MainNavigation from "./MainNavigation"

const layout = (props) => {
    return (
        <Fragment>
            <MainNavigation/>
            <main>{props.children}</main>
        </Fragment>
    );
};

export default layout;